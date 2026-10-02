// youtube_upload.mjs: puts a translation's final film on YouTube, with its title, description, tags, thumbnail and
// subtitles, and writes the video's id into i18n/<lang>/site.yaml (the language's site then embeds it).
//   node i18n/tools/youtube_upload.mjs --login --client=<client_secret….json>   once per Mac: sign in (below)
//   node i18n/tools/youtube_upload.mjs --lang=es --dry       what would be uploaded, and nothing else (no sign-in)
//   node i18n/tools/youtube_upload.mjs --lang=es             upload it (private), then the thumbnail and subtitles
//   --privacy=unlisted|public                                 instead of private
//   --video=ID                                                a video already uploaded by hand: set its words, thumbnail
//                                                             and subtitles only (no upload; its privacy is left alone)
//   --again                                                   upload even though site.yaml already has a video
//   --category=1                                              YouTube's category (1, Film & Animation)
//   --synthetic=no                                            don't declare it altered or synthetic content (the
//                                                             default declares it: the voices are ElevenLabs', one of
//                                                             them a clone of Curt's)
//
// What it uploads, from the language's stage (i18n/tools/films.mjs --final makes them):
//   out/film/film.mp4        the film; refused unless out/film/film.json says it's the final, not the drafts
//   out/film/youtube.md      the title, description and tags (tools/youtube.mjs, in the language)
//   out/film/subtitles.srt   the subtitles, as the language's caption track
//   i18n/<lang>/thumbnail.jpg
// The upload is resumable: if it's interrupted, running the same command again carries on where it stopped (the session
// is kept in out/i18n/upload_<lang>.json, for a week, and only for the same film file).
//
// Signing in (once per Mac): in Google Cloud Console, a project with the YouTube Data API v3 enabled, an OAuth consent
// screen (External, with your account as a test user) and an OAuth client of type "Desktop app"; download its JSON and
// run --login with it. A browser opens to choose the account and channel and allow access; the client's id and secret
// and the sign-in's refresh token go into the macOS Keychain (service "youtube-upload"), never into a file or the log,
// and the downloaded JSON can then be deleted. Elsewhere, set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET and
// YOUTUBE_REFRESH_TOKEN instead. (A consent screen left in "Testing" ends a refresh token after 7 days: --login again.)
//
// Google locks a video uploaded through an API project it hasn't audited to private (docs/RELEASE.md §5), and that lock
// can't be lifted in YouTube Studio. Until the project is audited, upload the film by hand in YouTube Studio and run
// this with --video=ID to fill in the rest.
// Quota: an upload is about 1,600 of the project's 10,000 daily units; a thumbnail 50, the subtitles 450, an update 50.
import { execFileSync, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createHash, randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, statSync, openSync, readSync, closeSync, mkdirSync, rmSync } from 'node:fs';
import YAML from 'yaml';
import { args } from './i18n_lib.mjs';

const KC = 'youtube-upload', ENV = { client_id: 'YOUTUBE_CLIENT_ID', client_secret: 'YOUTUBE_CLIENT_SECRET', refresh_token: 'YOUTUBE_REFRESH_TOKEN' };
const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';   // upload, update, thumbnails and captions
const API = 'https://www.googleapis.com', TOKEN = 'https://oauth2.googleapis.com/token';
// each translation's language as YouTube names it (i18n/PLAN.md: Latin American Spanish, Brazilian Portuguese,
// Traditional Chinese for Taiwan)
const CODES = { es: 'es-419', pt: 'pt-BR', ja: 'ja', hi: 'hi', zh: 'zh-TW', de: 'de', fr: 'fr', ko: 'ko' };
const die = s => { console.error(s); process.exit(1); };
if (!existsSync('i18n/tools/stage.mjs')) die('run this from the project\'s root: node i18n/tools/youtube_upload.mjs');

// ---- the Keychain: secrets go in through security's stdin (not its arguments, which other processes can see) ----
const kcGet = acct => { try { return execFileSync('security', ['find-generic-password', '-s', KC, '-a', acct, '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; } };
const secret = acct => process.env[ENV[acct]] || kcGet(acct);
function kcSet(acct, v) {
  if (!/^[\w.\-\/~+=]+$/.test(v)) die(`the ${acct} has characters the Keychain step doesn't expect; set ${ENV[acct]} instead`);
  spawnSync('security', ['-i'], { input: `add-generic-password -U -s ${KC} -a ${acct} -w "${v}"\n`, stdio: ['pipe', 'ignore', 'ignore'] });
  if (kcGet(acct) !== v) die(`couldn't save the ${acct} in the Keychain`);
}

// ---- signing in ----
async function login() {
  if (!args.client || !existsSync(args.client)) die('which client? --client=<the OAuth client JSON downloaded from Google Cloud Console>');
  const c = JSON.parse(readFileSync(args.client, 'utf8')), o = c.installed || c.web;
  if (!o?.client_id || !o?.client_secret) die(`${args.client} isn't an OAuth client's JSON (no installed.client_id)`);
  if (!c.installed) die('that client is a web client; make one of type "Desktop app"');
  const verifier = randomBytes(32).toString('base64url'), state = randomBytes(16).toString('hex');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const server = createServer(), port = await new Promise(res => server.listen(0, '127.0.0.1', () => res(server.address().port)));
  const redirect = `http://127.0.0.1:${port}`;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({ client_id: o.client_id, redirect_uri: redirect, response_type: 'code',
    scope: SCOPE, access_type: 'offline', prompt: 'consent', state, code_challenge: challenge, code_challenge_method: 'S256' })}`;
  console.log('A browser is opening to sign in to YouTube: choose the account and the channel the films go on, and allow it.');
  console.log(`If it doesn't open, open this:\n${url}`);
  spawnSync('open', [url]);
  const code = await new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('no answer from the browser in 10 minutes')), 600000);
    server.on('request', (req, out) => {
      const q = new URL(req.url, redirect).searchParams;
      if (!q.get('code') && !q.get('error')) { out.writeHead(404).end(); return; }
      const ok = q.get('state') === state && q.get('code');
      out.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }).end(ok ? 'Signed in. You can close this tab.' : `Not signed in: ${q.get('error') || 'the answer didn\'t match'}.`);
      clearTimeout(t); ok ? res(q.get('code')) : rej(new Error(`not signed in: ${q.get('error') || 'state mismatch'}`));
    });
  }).finally(() => server.close());
  const r = await fetch(TOKEN, { method: 'POST', body: new URLSearchParams({ code, client_id: o.client_id, client_secret: o.client_secret,
    redirect_uri: redirect, grant_type: 'authorization_code', code_verifier: verifier }) });
  const j = await r.json();
  if (!r.ok || !j.refresh_token) die(`Google didn't give a refresh token (${r.status} ${j.error || ''})`);
  kcSet('client_id', o.client_id); kcSet('client_secret', o.client_secret); kcSet('refresh_token', j.refresh_token);
  const me = await (await fetch(`${API}/youtube/v3/channels?part=snippet&mine=true`, { headers: { Authorization: `Bearer ${j.access_token}` } })).json();
  console.log(`Signed in; saved in the Keychain (service "${KC}"). The channel: ${me.items?.[0]?.snippet?.title ?? '(none found)'}`);
  console.log(`${args.client} can be deleted now.`);
}
if (args.login) { await login(); process.exit(0); }

// ---- what to upload ----
const lang = args.lang;
if (!CODES[lang]) die(`which language? --lang=${Object.keys(CODES).join('|')}`);
const S = `i18n/${lang}/stage`, FILM = `${S}/out/film`, SITE = `i18n/${lang}/site.yaml`;
const VIDEO = `${FILM}/film.mp4`, SRT = `${FILM}/subtitles.srt`, THUMB = `i18n/${lang}/thumbnail.jpg`, MD = `${FILM}/youtube.md`;
for (const f of [VIDEO, `${FILM}/film.json`, MD, SRT, THUMB]) if (!existsSync(f)) die(`no ${f}: make the final film first (node i18n/tools/films.mjs --final --langs=${lang})`);
if (!JSON.parse(readFileSync(`${FILM}/film.json`, 'utf8')).final) die(`${VIDEO} is the drafts joined, not the final: node i18n/tools/films.mjs --final --langs=${lang}`);
// youtube.md: "## Title", the description in the fence under "## Description", "## Tags"
const md = readFileSync(MD, 'utf8'), section = h => (md.split(/^## /m).find(s => s.startsWith(h)) || '').slice(h.length);
const title = section('Title').trim(), description = (section('Description').match(/```\n([\s\S]*?)\n```/) || [])[1];
const tags = section('Tags').trim().split(',').map(t => t.trim()).filter(Boolean);
if (!title || !description || !tags.length) die(`${MD} is missing its title, description or tags`);
const problems = [title.length > 100 && `the title is ${title.length} characters (YouTube takes 100)`, description.length > 5000 && `the description is ${description.length} characters (YouTube takes 5,000)`,
  /[<>]/.test(title + description) && 'YouTube refuses < and > in a title or description', tags.join(',').length > 500 && 'the tags run over 500 characters',
  statSync(THUMB).size > 2 * 2 ** 20 && `${THUMB} is over YouTube's 2 MB`].filter(Boolean);
if (problems.length) die(problems.join('\n'));
const site = existsSync(SITE) ? YAML.parse(readFileSync(SITE, 'utf8')) || {} : {};
const privacy = args.privacy || 'private', synthetic = args.synthetic !== 'no', category = String(args.category || 1);
if (!['private', 'unlisted', 'public'].includes(privacy)) die('--privacy is private, unlisted or public');
const snippet = { title, description, tags, categoryId: category, defaultLanguage: CODES[lang], defaultAudioLanguage: CODES[lang] };
const size = statSync(VIDEO).size, gb = (size / 2 ** 30).toFixed(2);

if (args.dry) {
  console.log(`${lang} (${CODES[lang]}): ${args.video ? `fill in video ${args.video}` : `upload ${VIDEO} (${gb} GB), ${privacy}`}`);
  console.log(`  title: ${title}\n  description: ${description.length} characters\n  tags: ${tags.join(', ')}`);
  console.log(`  category ${category}; altered or synthetic content: ${synthetic ? 'yes' : 'no'}\n  thumbnail: ${THUMB}\n  subtitles: ${SRT}`);
  if (site.film?.youtube) console.log(`  ${SITE} already has video ${site.film.youtube}${args.again || args.video ? '' : ': it would stop (--again to upload another)'}`);
  process.exit(0);
}
if (site.film?.youtube && !args.again && !args.video) die(`${SITE} already has the ${lang} film: https://www.youtube.com/watch?v=${site.film.youtube}\n--video=${site.film.youtube} to fill it in again, or --again to upload another`);

// ---- an access token, refreshed as it nears its hour ----
let access = null, until = 0;
async function token() {
  if (access && Date.now() < until - 300000) return access;
  const [id, sec, refresh] = ['client_id', 'client_secret', 'refresh_token'].map(secret);
  if (!id || !sec || !refresh) die('not signed in: node i18n/tools/youtube_upload.mjs --login --client=<client JSON>');
  const r = await fetch(TOKEN, { method: 'POST', body: new URLSearchParams({ client_id: id, client_secret: sec, refresh_token: refresh, grant_type: 'refresh_token' }) });
  const j = await r.json();
  if (!r.ok) die(`Google refused the sign-in (${j.error || r.status}): --login again`);
  access = j.access_token; until = Date.now() + j.expires_in * 1000; return access;
}
async function api(path, { method = 'GET', body, headers = {}, raw } = {}) {
  const r = await fetch(`${API}${path}`, { method, redirect: 'manual', headers: { Authorization: `Bearer ${await token()}`,
    ...(body && !raw ? { 'Content-Type': 'application/json; charset=utf-8' } : {}), ...headers }, body: raw ? body : body && JSON.stringify(body) });
  if (raw === 'response') return r;
  const text = await r.text(), j = text ? JSON.parse(text) : {};
  if (!r.ok) die(`${method} ${path.split('?')[0]}: ${r.status} ${j.error?.message || text.slice(0, 300)}`);
  return j;
}

// ---- the upload, resumable ----
const SESSION = `out/i18n/upload_${lang}.json`, CHUNK = 64 * 2 ** 20;   // a multiple of 256 KiB, as YouTube asks
const mtime = statSync(VIDEO).mtimeMs;
async function upload() {
  let s = existsSync(SESSION) ? JSON.parse(readFileSync(SESSION, 'utf8')) : null;
  if (s && (s.size !== size || s.mtime !== mtime || Date.now() - s.started > 6 * 864e5)) s = null;   // another film, or stale
  if (!s) {
    const status = { privacyStatus: privacy, selfDeclaredMadeForKids: false, containsSyntheticMedia: synthetic, embeddable: true };
    const r = await api('/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', { method: 'POST', raw: 'response',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Upload-Content-Length': String(size), 'X-Upload-Content-Type': 'video/mp4' },
      body: JSON.stringify({ snippet, status }) });
    if (!r.ok || !r.headers.get('location')) die(`YouTube wouldn't start the upload: ${r.status} ${(await r.text()).slice(0, 300)}`);
    s = { url: r.headers.get('location'), size, mtime, started: Date.now() };
    mkdirSync('out/i18n', { recursive: true }); writeFileSync(SESSION, JSON.stringify(s) + '\n');
  }
  // how much YouTube has (a 308 with Range: bytes=0-N), or the video if it has it all
  const put = (headers, body) => fetch(s.url, { method: 'PUT', redirect: 'manual', headers: { Authorization: `Bearer ${access}`, ...headers }, body });
  const fd = openSync(VIDEO, 'r'), buf = Buffer.alloc(CHUNK), t0 = Date.now();
  let at = 0, tries = 0, sent0 = null;
  try {
    for (;;) {
      await token();
      let r;
      try {
        r = await put({ 'Content-Range': `bytes */${size}` });
        if (r.status === 200 || r.status === 201) return r.json();
        if (r.status === 404 || r.status === 410) { rmSync(SESSION); die('YouTube forgot the upload (it expires after a week): run this again to start over'); }
        if (r.status !== 308) throw new Error(`asking how far: ${r.status}`);
        const range = r.headers.get('range'); at = range ? +range.split('-')[1] + 1 : 0; sent0 ??= at;
        const n = readSync(fd, buf, 0, Math.min(CHUNK, size - at), at);
        r = await put({ 'Content-Range': `bytes ${at}-${at + n - 1}/${size}`, 'Content-Type': 'video/mp4' }, buf.subarray(0, n));
        if (r.status === 200 || r.status === 201) return r.json();
        if (r.status !== 308) throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`);
        tries = 0;
        const done = at + n, mbs = (done - sent0) / 2 ** 20 / ((Date.now() - t0) / 1000);
        process.stdout.write(`\r  ${(done / size * 100).toFixed(1)}% of ${gb} GB, ${mbs.toFixed(1)} MB/s, about ${Math.ceil((size - done) / 2 ** 20 / mbs / 60)} min to go   `);
      } catch (e) {
        if (r && r.status >= 400 && r.status < 500 && r.status !== 408 && r.status !== 429) die(`\nthe upload failed: ${e.message}`);
        if (++tries > 8) die(`\nthe upload stopped after 8 tries (${e.message}); run this again to carry on`);
        const wait = Math.min(300, 2 ** tries) * 1000;
        console.log(`\n  ${e.message}; trying again in ${wait / 1000} s`); await new Promise(res => setTimeout(res, wait));
      }
    }
  } finally { closeSync(fd); }
}

let id = args.video;
if (!id) {
  console.log(`uploading ${VIDEO} (${gb} GB) as "${title}", ${privacy}`);
  const v = await upload();
  id = v.id; rmSync(SESSION, { force: true });
  console.log(`\nuploaded: https://www.youtube.com/watch?v=${id} (${v.status?.uploadStatus}; YouTube processes it for a while)`);
} else {
  const v = await api(`/youtube/v3/videos?part=snippet&id=${encodeURIComponent(id)}`);
  if (!v.items?.length) die(`no video ${id} on this channel`);
  await api('/youtube/v3/videos?part=snippet', { method: 'PUT', body: { id, snippet } });
  console.log(`video ${id}: title, description, tags and language set`);
}

// ---- the site embeds it: i18n/<lang>/site.yaml, written straight away so a run after a failure doesn't upload twice ----
const doc = existsSync(SITE) ? YAML.parseDocument(readFileSync(SITE, 'utf8')) : Object.assign(new YAML.Document({}), { commentBefore: ` The ${lang} film on YouTube (i18n/tools/youtube_upload.mjs); the language's site embeds it.` });
if (doc.getIn(['film', 'youtube']) !== id) {
  doc.setIn(['film', 'youtube'], id); writeFileSync(SITE, doc.toString({ lineWidth: 0 }));
  console.log(`${SITE}: film: youtube: ${id}`);
}

// ---- the thumbnail, and the subtitles as the language's caption track (once) ----
const thumb = await api(`/upload/youtube/v3/thumbnails/set?videoId=${id}`, { method: 'POST', raw: 'response', headers: { 'Content-Type': 'image/jpeg' }, body: readFileSync(THUMB) });
console.log(thumb.ok ? `thumbnail: ${THUMB}` : `the thumbnail wasn't set (${thumb.status}: ${(await thumb.text()).slice(0, 200)}); a custom thumbnail needs a verified channel. Add it in YouTube Studio.`);
const tracks = await api(`/youtube/v3/captions?part=snippet&videoId=${id}`);
if (tracks.items?.some(t => t.snippet.language === CODES[lang] && t.snippet.trackKind !== 'asr')) console.log(`subtitles: already there (${CODES[lang]})`);
else {
  const b = `----${randomBytes(12).toString('hex')}`;
  const body = Buffer.concat([Buffer.from(`--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ snippet: { videoId: id, language: CODES[lang], name: '', isDraft: false } })}\r\n--${b}\r\nContent-Type: application/octet-stream\r\n\r\n`),
    readFileSync(SRT), Buffer.from(`\r\n--${b}--\r\n`)]);
  const r = await api('/upload/youtube/v3/captions?uploadType=multipart&part=snippet', { method: 'POST', raw: 'response', headers: { 'Content-Type': `multipart/related; boundary=${b}` }, body });
  console.log(r.ok ? `subtitles: ${SRT} (${CODES[lang]})` : `the subtitles weren't added (${r.status}: ${(await r.text()).slice(0, 200)}); add ${SRT} in YouTube Studio`);
}
console.log(`done. Commit and push ${SITE} so the ${lang} site embeds the film.`);
if (!args.video && privacy !== 'private') console.log('If YouTube Studio says the video is "locked as private", the API project needs Google\'s audit; meanwhile upload by hand and use --video.');
