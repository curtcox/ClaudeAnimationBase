// render.mjs: renders studio.html in headless Chrome. Length and fps come from the page (PROJECT in src/config.js).
//
//   Look at it (open the images with your image viewer / Read tool):
//     node render.mjs --sheet=0.5,1,1.5,2 [--cols=4] [--w=480] --out=out/check/a.jpg        contact sheet of chosen times
//     node render.mjs --strip=2.0:2.5 [--cols=6] [--w=320] --out=out/check/strip.jpg        EVERY frame in a stretch (motion)
//     node render.mjs --sheet=2.1,2.2 --crop=760,300,400,400 --w=600 --out=out/check/face.jpg full-res crops (details)
//     node render.mjs --strip=2.0:2.5 --crop-at=960,780,500,400 --out=out/check/feet.jpg       crops that follow a WORLD point
//         (x,y in world px, may be page expressions like PLK.MX(1.38); w,h in screen px) through each frame's camera
//     node render.mjs --stills=1.2,3.4 --out=out/stills                                     full-res PNGs
//   Make the video:
//     node render.mjs --clip [--range=0:4] --out=out/video.mp4                               straight to MP4 (one worker)
//     node render.mjs --frames [--range=0:8] --workers=4                                     JPEG frames → out/frames (parallel, resumable)
//     node render.mjs --encode --out=out/video.mp4                                           out/frames → MP4
//   Standalone loops (LOOPS in the page): add --loop=<name> to any of the above (times are then loop times), or
//     node render.mjs --loop=emotions --png --out=out/loop_emotions                          one cycle as PNGs (for GIFs)
//   Music: --audio=assets/song.mp3 (or PROJECT.audio) is muxed into --clip and --encode. Other flags: --fps=24,
//   --chrome=<path to Chrome/Chromium>.
//   Frog or Axolotl: add --chapter=N to any of the above to render that chapter (tools/timeline.mjs generates its timing);
//   --review burns in captions of the words (a review aid, never in the film).
//     node render.mjs --chapter=2 --draft               a review cut, about 6× faster than a final: flat washes for watercolor
//                                                       fills, 12 fps, 1280 wide, captions on (--no-review drops them), the
//                                                       chapter's voice track muxed in → out/ch02_draft.mp4. Resumable; re-renders only what changed.
//   A chapter's frames dir keeps a manifest of what drew each shot, so --frames (and --draft) re-render only the shots whose
//   code, timing or codes changed, and everything when the engine did. --shots=D,E re-renders just those shots regardless.
//   An encode is skipped when no frame and no voice track is newer than the video (--force encodes anyway).
import puppeteer from 'puppeteer-core';
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, statSync, renameSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const CHROMES = [args.chrome, process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ...playwrightChromes()];
// Chromium builds Playwright downloaded (~/.cache/ms-playwright/chromium-NNNN), newest first
function playwrightChromes() {
  const dir = `${homedir()}/.cache/ms-playwright`;
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(n => /^chromium-\d+$/.test(n)).sort((a, b) => b.split('-')[1] - a.split('-')[1])
    .map(n => `${dir}/${n}/chrome-linux64/chrome`);
}
const CHROME = CHROMES.find(p => p && existsSync(p));
if (!CHROME) { console.error('Chrome not found: pass --chrome=<path> or set CHROME_PATH'); process.exit(1); }
// --chapter=N renders that chapter of Frog or Axolotl (studio.html?chapter=N): its own frames dir, and out/chNN.mp4 by default
const CH = args.chapter ? String(args.chapter).padStart(2, '0') : null;
const DRAFT = !!args.draft, REVIEW = !!args.review || (DRAFT && !args['no-review']);
const fps = +(args.fps || (DRAFT ? 12 : 24)), OUT_W = DRAFT ? 1280 : 1920, FRAMES_DIR = CH ? `out/frames/ch${CH}${DRAFT ? '_draft' : ''}` : 'out/frames';
// a draft with no other instruction renders its frames, then encodes them
const AUTO = DRAFT && CH && !['sheet', 'strip', 'stills', 'png', 'frames', 'clip', 'encode'].some(k => args[k]);
if (AUTO) args.frames = true;
const run = (cmd, a) => new Promise((ok, bad) => { const p = spawn(cmd, a, { stdio: 'inherit' }); p.on('close', c => c ? bad(new Error(cmd + ' exited ' + c)) : ok()); });
const times = s => String(s).split(',').map(Number);
const span = s => String(s).split(':').map(Number);
// comma-separated fields, keeping commas inside parentheses ('PLK.MX(1.38),PLK.WL,500,300'); numbers stay numbers
const fields = s => { const out = []; let d = 0, cur = ''; for (const ch of String(s)) { if (ch === ',' && !d) { out.push(cur); cur = ''; continue; } d += ch === '(' ? 1 : ch === ')' ? -1 : 0; cur += ch; } out.push(cur); return out.map(v => isNaN(+v) ? v : +v); };

// out/frames → MP4, with the chapter's sound: its voice and sound effects (audio/chNN_full.wav, tools/sfx.mjs) when that
// mix is as new as the voice, else the voice alone (audio/chNN.wav)
function chapterAudio() {
  const voice = `audio/ch${CH}.wav`, full = `audio/ch${CH}_full.wav`;
  if (!existsSync(voice)) return null;
  if (existsSync(full) && statSync(full).mtimeMs >= statSync(voice).mtimeMs) return full;
  console.log(`note: ${existsSync(full) ? `${full} is older than the voice` : `no ${full}`}, so this has the voice without its sounds (node tools/sfx.mjs mixes them)`);
  return voice;
}
async function encode() {
  const out = args.out || (CH ? `out/ch${CH}${DRAFT ? '_draft' : ''}.mp4` : 'out/video.mp4');
  const audio = args.audio || (CH ? chapterAudio() : null);
  const have = existsSync(FRAMES_DIR) ? readdirSync(FRAMES_DIR).filter(f => /^f\d{5}\.jpg$/.test(f)).length : 0;
  // a chapter stops at its length: frames past it are left over from when it was longer
  const g = {}; if (CH && !args.loop) new Function('window', readFileSync(`src/gen/ch${CH}.js`, 'utf8'))(g);
  const cap = g.CHAPTER ? Math.ceil(g.CHAPTER.duration * fps - 1e-9) : Infinity;
  let n = 0; while (n < cap && existsSync(`${FRAMES_DIR}/f${String(n).padStart(5, '0')}.jpg`)) n++;
  if (!n) { console.error(`no frames in ${FRAMES_DIR}`); process.exit(1); }
  if (n < Math.min(have, cap)) console.log(`warning: frame ${n} is missing, so the video stops there (later frames unused)`);
  // nothing drawn or voiced since the last encode: keep it (--force encodes anyway)
  if (!args.force && existsSync(out)) {
    let newest = audio ? statSync(audio).mtimeMs : 0;
    for (const f of readdirSync(FRAMES_DIR)) if (/^f\d{5}\.jpg$/.test(f)) newest = Math.max(newest, statSync(`${FRAMES_DIR}/${f}`).mtimeMs);
    const frames = () => +execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=nb_frames', '-of', 'default=nw=1:nk=1', out]).toString().trim();
    // (the frame count catches a video from before a cut; -shortest may trim a frame or two to the voice)
    if (newest < statSync(out).mtimeMs && Math.abs(frames() - n) <= 2) { console.log(`${out} is current (nothing drawn or voiced since it was made)`); return; }
  }
  console.log(`encoding ${n} frames at ${fps} fps → ${out}${audio ? ' with ' + audio : ''}`);
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-stats', '-framerate', String(fps), '-i', `${FRAMES_DIR}/f%05d.jpg`,
    ...(audio ? ['-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
    '-frames:v', String(n), '-c:v', 'libx264', '-preset', DRAFT ? 'veryfast' : 'slow', '-crf', DRAFT ? '23' : '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  console.log('wrote ' + out);
}
if (args.encode) { await encode(); process.exit(0); }

// --soft-gl: no GPU on this machine; render WebGL in software (SwiftShader), which Chrome only allows when asked.
// --gpu-angle=vulkan|gl-egl: headless Linux on an NVIDIA GPU (e.g. a cloud or cluster node); plain --use-gl=angle gets
// no WebGL context there. Check which GPU Chrome actually lands on with gpu_probe.mjs.
const ANGLE = { vulkan: ['--use-angle=vulkan', '--enable-features=Vulkan'], 'gl-egl': ['--use-angle=gl-egl'] };
if (args['gpu-angle'] && !ANGLE[args['gpu-angle']]) { console.error(`--gpu-angle must be one of ${Object.keys(ANGLE)}`); process.exit(1); }
const gpu = args['soft-gl'] ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  : args['gpu-angle'] ? ANGLE[args['gpu-angle']]
  : process.platform === 'win32' ? ['--use-angle=d3d11'] : process.platform === 'darwin' ? ['--use-angle=metal'] : ['--use-gl=angle'];
// Ubuntu 23.10+ blocks Chrome's user-namespace sandbox; headless rendering of local files doesn't need it.
const sandbox = process.platform === 'linux' ? ['--no-sandbox'] : [];
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: [...sandbox, '--allow-file-access-from-files', '--ignore-gpu-blocklist', ...gpu, '--enable-gpu-rasterization', '--window-size=1920,1080', '--disable-renderer-backgrounding', '--disable-background-timer-throttling']
});
async function openPage(tag = '') {
  const page = await browser.newPage();
  page.on('console', m => { if (['error', 'warn'].includes(m.type())) console.log(`[page${tag}]`, m.text()); });
  page.on('pageerror', e => console.log(`[page error${tag}]`, e.message));
  await page.goto(pathToFileURL(resolve('studio.html')).href + '?render' + (CH ? `&chapter=${CH}` : '') + (REVIEW ? '&review=1' : '') + (DRAFT ? '&draft=1' : ''), { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction('window.ready === true', { timeout: 60000 });
  if (args.loop) {
    const ok = await page.evaluate(name => { if (!LOOPS[name]) return false; window.LOOP = LOOPS[name]; return true; }, args.loop);
    if (!ok) { console.error(`no loop named "${args.loop}"`); process.exit(1); }
  }
  return page;
}
const frameOf = async (page, t, type, q, w = 1920) => {
  const url = await page.evaluate((t, type, q, w) => window.renderAt(t, type, q, w), t, type, q, w);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};
// the length of whatever is being rendered: a loop's .len, or the video's duration
const lengthOf = page => page.evaluate(() => window.LOOP ? window.LOOP.len : DUR);

if (args.sheet || args.strip) {
  const page = await openPage(), out = args.out || 'out/sheet.jpg'; mkdirSync(dirname(out), { recursive: true });
  let ts;
  if (args.strip) { const [a, b] = span(args.strip); ts = []; for (let i = Math.round(a * fps); i <= Math.round(b * fps); i++) ts.push(i / fps); }
  else ts = times(args.sheet);
  const crop = args.crop ? times(args.crop) : null, at = args['crop-at'] ? fields(args['crop-at']) : null;
  const { url, ms } = await page.evaluate((ts, c, w, crop, at) => window.renderSheet(ts, c, w, crop, at), ts, +(args.cols || (args.strip ? 6 : 3)), +(args.w || (args.strip ? 320 : 640)), crop, at);
  writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
  console.log(`${out}  (${ts.length} frames)  ms/frame: ${ms.join(' ')}`);
} else if (args.stills) {
  const page = await openPage(), out = args.out || 'out/stills'; mkdirSync(out, { recursive: true });
  console.log('GPU:', await page.evaluate(() => window.gpuInfo()));
  for (const s of times(args.stills)) {
    const t0 = Date.now(), buf = await frameOf(page, s, 'image/png');
    const f = `${out}/t${s.toFixed(2).replace('.', '_')}.png`; writeFileSync(f, buf);
    console.log(`${f}  ${Date.now() - t0} ms`);
  }
} else if (args.png) {
  // PNG sequence (for GIFs): a loop's full cycle (frame n equals frame 0, so it isn't rendered), or --range=a:b.
  const probe = await openPage(), len = await lengthOf(probe); await probe.close();
  const [a, b] = args.range ? span(args.range) : [0, len], n = Math.round((b - a) * fps);
  const out = args.out || `out/${args.loop ? 'loop_' + args.loop : 'png'}`, workers = +(args.workers || 3); mkdirSync(out, { recursive: true });
  let next = 0; const start = Date.now();
  // open every worker's page first: a page still loading behind others that are already rendering can stall past its timeout
  const pages = []; for (let w = 0; w < workers; w++) pages.push(await openPage('#' + w));
  await Promise.all(pages.map(async page => {
    while (next < n) { const i = next++; writeFileSync(`${out}/f${String(i).padStart(4, '0')}.png`, await frameOf(page, a + i / fps, 'image/png')); }
  }));
  console.log(`${n} frames → ${out}  (${((Date.now() - start) / n).toFixed(0)} ms/frame)`);
} else if (args.frames) {
  // Parallel and resumable: each worker pulls the next missing frame; files are written atomically.
  const probe = await openPage(), len = await lengthOf(probe);
  mkdirSync(FRAMES_DIR, { recursive: true });
  let [a, b] = args.range ? span(args.range) : [0, len];
  if (CH && !args.loop) [a, b] = await refreshFrames(probe, a, b);
  await probe.close();
  const workers = +(args.workers || 4);
  const first = Math.round(a * fps), last = Math.min(Math.ceil(len * fps) - 1, Math.ceil(b * fps) - 1);
  const todo = []; for (let i = first; i <= last; i++) { const f = `${FRAMES_DIR}/f${String(i).padStart(5, '0')}.jpg`; if (!existsSync(f) || statSync(f).size < 1000) todo.push(i); }
  console.log(`${todo.length} frames to render (${last - first + 1 - todo.length} already done), ${workers} workers`);
  let next = 0, done = 0; const start = Date.now();
  // open every worker's page first: a page still loading behind others that are already rendering can stall past its timeout
  const pages = []; for (let w = 0; w < workers; w++) pages.push(await openPage('#' + w));
  // A page whose GPU context is lost never answers (protocolTimeout is 0), and the run would wait on it for ever: a frame
  // that takes over FRAME_MS gets a fresh page and is tried again, twice at most.
  const FRAME_MS = +(args['frame-timeout'] || 90) * 1000;
  const within = (p, ms) => { let t; return Promise.race([p, new Promise((_, no) => { t = setTimeout(() => no(new Error(`no frame after ${ms / 1000} s`)), ms); t.unref(); })]).finally(() => clearTimeout(t)); };
  await Promise.all(pages.map(async (page, w) => {
    while (next < todo.length) {
      const i = todo[next++], f = `${FRAMES_DIR}/f${String(i).padStart(5, '0')}.jpg`;
      let buf;
      for (let tries = 0; !buf; tries++) {
        try { buf = await within(frameOf(page, i / fps, 'image/jpeg', DRAFT ? .88 : .94, OUT_W), FRAME_MS); }
        catch (e) {
          if (tries >= 2) throw e;
          console.log(`[page#${w}] frame ${i}: ${e.message}; opening a fresh page`);
          page.close().catch(() => { }); page = await openPage('#' + w);
        }
      }
      writeFileSync(f + '.tmp', buf); renameSync(f + '.tmp', f);
      if (++done % 24 === 0 || done === todo.length) {
        const el = (Date.now() - start) / 1000;
        console.log(`frame ${done}/${todo.length}  ${(el / done * 1000).toFixed(0)} ms/frame effective  eta ${((todo.length - done) * el / done / 60).toFixed(1)} min`);
      }
    }
  }));
  if (AUTO) { await browser.close(); await encode(); process.exit(0); }
} else if (args.clip) {
  const page = await openPage(), len = await lengthOf(page);
  const [a, b] = args.range ? span(args.range) : typeof args.clip === 'string' ? span(args.clip) : [0, len];
  const audio = args.audio || await page.evaluate(() => PROJECT.audio || '');
  const out = args.out || (CH ? `out/ch${CH}.mp4` : 'out/clip.mp4'); mkdirSync(dirname(out), { recursive: true });
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    ...(audio ? ['-ss', String(a), '-t', String(b - a), '-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((b - a) * fps), start = Date.now();
  for (let i = 0; i < n; i++) {
    const buf = await frameOf(page, a + i / fps, 'image/jpeg', .93, OUT_W);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 24 === 0 || i === n - 1) console.log(`frame ${i + 1}/${n}  ${((Date.now() - start) / (i + 1)).toFixed(0)} ms/frame`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log(`wrote ${out}`);
} else {
  console.log('nothing to do: see the usage notes at the top of render.mjs');
}
await browser.close();

// What drew a chapter's frames. The engine: every script the page loads, the chapter's timeline, the render settings and
// the scene file outside its shot functions. Each shot: its function's source, its time span and the codes placed over it.
// Frames of shots whose print changed are deleted (they're then missing, so they render), for the whole chapter whatever
// the range, and the manifest is updated, so an interrupted run resumes correctly. Returns the range to render (--shots
// narrows it to those shots, and re-renders them regardless).
async function refreshFrames(page, a, b) {
  const sha = x => createHash('sha1').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex').slice(0, 16);
  const info = await page.evaluate(() => ({ scene: CHAPTER.scene, dur: DUR,
    shots: SHOTS.map(([t0, f], i) => ({ name: (f.name || 'shot' + i).replace(/^shot/, ''), t0, t1: i + 1 < SHOTS.length ? SHOTS[i + 1][0] : DUR, src: f.toString() })),
    plan: railPlan().map(p => [p.id, +p.t0.toFixed(3), +(p.t0 + p.hold).toFixed(3), p.x, p.y]) }));
  const html = readFileSync('studio.html', 'utf8');
  const files = [...html.matchAll(/<script src="(src\/[^"]+)"/g)].map(m => m[1]).filter(f => !f.includes("$")).concat(`src/gen/ch${CH}.js`);
  let scene = readFileSync(`src/scenes/${info.scene}`, 'utf8');
  for (const s of info.shots) scene = scene.replace(s.src, '');
  const engine = sha([html, scene, ...files.map(f => readFileSync(f, 'utf8')), DRAFT, REVIEW, fps, OUT_W]);
  const shots = Object.fromEntries(info.shots.map(s => [s.name, sha([s.src, s.t0, s.t1, info.plan.filter(p => p[1] < s.t1 && p[2] > s.t0)])]));
  const mf = `${FRAMES_DIR}/manifest.json`, old = existsSync(mf) ? JSON.parse(readFileSync(mf, 'utf8')) : null;
  const want = args.shots ? String(args.shots).split(',') : null;
  for (const w of want || []) if (!(w in shots)) { console.error(`no shot ${w}; shots are ${Object.keys(shots).join(' ')}`); process.exit(1); }
  const stale = info.shots.filter(s => !old || old.engine !== engine || old.shots[s.name] !== shots[s.name] || (want && want.includes(s.name)));
  let removed = 0;
  for (const s of stale) for (let i = Math.ceil(s.t0 * fps - 1e-9); i < s.t1 * fps - 1e-9; i++) {
    const f = `${FRAMES_DIR}/f${String(i).padStart(5, '0')}.jpg`; if (existsSync(f)) { rmSync(f); removed++; }
  }
  writeFileSync(mf, JSON.stringify({ engine, shots }, null, 1));
  const why = !old ? 'no manifest yet' : old.engine !== engine ? 'the engine changed' : null;
  console.log(stale.length ? `stale: ${why ? `every shot (${why})` : 'shots ' + stale.map(s => s.name).join(' ')}; ${removed} frames cleared` : 'every shot is current');
  if (!want) return [a, b];
  const sel = info.shots.filter(s => want.includes(s.name));
  return [Math.max(a, Math.min(...sel.map(s => s.t0))), Math.min(b, Math.max(...sel.map(s => s.t1)))];
}
