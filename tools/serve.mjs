// serve.mjs: serves the companion site (site/public) on localhost, with byte ranges so the watch pages' videos can seek.
//   npm run serve   →   http://localhost:8077/
// It also answers the watch pages' review notes (review/chNN.json, via tools/review_lib.mjs), which is how the notes panel
// knows to appear: the published site has no /api, so there the panel stays hidden. Only this machine can reach it.
//   GET  /api/notes?ch=N                     the chapter's notes
//   POST /api/notes  { ch, note }            a new note (a still of the frame may come along as a data: URL)
//   POST /api/notes  { ch, id, reply }       a reply;   { ch, id, status }  open or resolve it;   { ch, id, delete: true }
//   POST /api/seen   { ch, a, b }            a stretch of the current draft just watched, a to b seconds (review/seen.json)
//   GET  /api/review                         every chapter: what waits on Curt, what waits on Claude, unwatched drafts
//   GET  /api/rebuild                        the last overnight rebuild (tools/rebuild.mjs): its steps, and any that failed
// and the review index that reads it, /review/ (tools/review_page.mjs). Every page served here gets a link to it, and
// while a rebuild is running, a line saying how far along it is.
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { load, save, newId, markSeen, overview, DIR } from './review_lib.mjs';
import { reviewPage } from './review_page.mjs';
const ROOT = 'site/public', PORT = +(process.env.PORT || 8077);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.mp4': 'video/mp4', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.txt': 'text/plain; charset=utf-8' };
const json = (res, code, body) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
const chOf = v => { const n = parseInt(v, 10); return Number.isInteger(n) && n >= 0 && n < 100 ? n : null; };

// the link to the review index, added to every page served here (so never on the published site)
const BADGE = `<a href="/review/" style="position:fixed;right:12px;bottom:12px;z-index:9;font:600 14px system-ui;background:#8A3A22;color:#fff;padding:.45em .8em;border-radius:8px;text-decoration:none;box-shadow:0 2px 6px #0003">Review index</a>`;

// while a rebuild runs (npm start, npm run rebuild), a line at the top of every page says how far along it is
function progress() {
  try {
    const pid = +readFileSync('out/rebuild/lock', 'utf8'); process.kill(pid, 0);
    const r = JSON.parse(readFileSync('out/rebuild/last.json', 'utf8')), done = r.steps.length, last = r.steps.at(-1);
    return `<div style="position:sticky;top:0;z-index:9;font:600 14px system-ui;background:#FFF1CE;border-bottom:1px solid #E3C28A;padding:.5em 1em">
Still making the film: ${done}${r.planned ? ` of about ${r.planned}` : ''} steps done${last ? ` (last: ${last.name}${last.ok ? '' : ', which failed'})` : ''}.
Chapters appear here as they're finished; <a href="" onclick="location.reload();return false">reload</a> to see what's new.</div>`;
  } catch { return ''; }
}

async function api(req, res, url) {
  if (url.pathname === '/api/review') return json(res, 200, overview());
  if (url.pathname === '/api/rebuild') return json(res, 200, existsSync('out/rebuild/last.json') ? JSON.parse(readFileSync('out/rebuild/last.json', 'utf8')) : {});
  if (url.pathname === '/api/seen') {
    if (req.method !== 'POST') return json(res, 405, { error: 'POST' });
    let body = ''; for await (const c of req) { body += c; if (body.length > 1e4) return json(res, 413, { error: 'too big' }); }
    let q; try { q = JSON.parse(body); } catch { return json(res, 400, { error: 'not JSON' }); }
    const ch = chOf(q.ch); if (ch == null) return json(res, 400, { error: 'ch?' });
    return json(res, 200, markSeen(ch, +q.a, +q.b) || {});
  }
  if (req.method === 'GET') { const ch = chOf(url.searchParams.get('ch')); return ch == null ? json(res, 400, { error: 'ch?' }) : json(res, 200, load(ch)); }
  if (req.method !== 'POST') return json(res, 405, { error: 'GET or POST' });
  let body = ''; for await (const c of req) { body += c; if (body.length > 4e6) return json(res, 413, { error: 'too big' }); }
  let q; try { q = JSON.parse(body); } catch { return json(res, 400, { error: 'not JSON' }); }
  const ch = chOf(q.ch); if (ch == null) return json(res, 400, { error: 'ch?' });
  const doc = load(ch), now = new Date().toISOString();
  if (q.note) {
    const n = q.note, text = String(n.text || '').trim(); if (!text) return json(res, 400, { error: 'empty note' });
    const note = { id: newId(), t: typeof n.t === 'number' ? +n.t.toFixed(2) : null, line: n.line || null, shot: n.shot || null, by: n.by === 'claude' ? 'claude' : 'curt',
      text, point: Array.isArray(n.point) ? n.point.map(v => +(+v).toFixed(3)) : undefined, status: 'open', created: now, replies: [] };
    const m = typeof n.frame === 'string' && n.frame.match(/^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/);
    if (m) { mkdirSync(`${DIR}/frames`, { recursive: true }); writeFileSync(`${DIR}/frames/ch${String(ch).padStart(2, '0')}-${note.id}.jpg`, Buffer.from(m[1], 'base64')); note.frame = `frames/ch${String(ch).padStart(2, '0')}-${note.id}.jpg`; }
    doc.notes.push(note); save(ch, doc); return json(res, 200, note);
  }
  const note = doc.notes.find(n => n.id === q.id); if (!note) return json(res, 404, { error: 'no such note' });
  if (q.delete) doc.notes = doc.notes.filter(n => n !== note);
  else if (q.reply) (note.replies ||= []).push({ by: q.by === 'claude' ? 'claude' : 'curt', text: String(q.reply).trim(), at: now });
  else if (q.status === 'open' || q.status === 'resolved') note.status = q.status;
  else return json(res, 400, { error: 'reply, status or delete?' });
  save(ch, doc); return json(res, 200, note);
}

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (/^\/api\/(notes|seen|review|rebuild)$/.test(url.pathname)) return api(req, res, url).catch(e => json(res, 500, { error: e.message }));
  if (url.pathname === '/review' || url.pathname === '/review/') { res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-store' }); return res.end(reviewPage()); }
  let p = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  // local-only listening pages, from out/ (a site build clears site/public, so they don't live there): /voices/ the
  // casting sampler (tools/voice_sampler.mjs), /names/ the names check (names_check.mjs), /sounds/ the sounds (sfx.mjs)
  let f = /^[/\\](voices|names|sounds)([/\\]|$)/.test(p) ? join('out', p) : join(ROOT, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); return res.end('not found'); }
  if (extname(f) === '.html' && !req.headers.range) {
    const html = readFileSync(f, 'utf8').replace('</body>', BADGE + '</body>').replace(/<body>/, m => m + progress());
    res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-store' }); return res.end(html);
  }
  // no-cache and Last-Modified: a redrawn draft (same name, new file) is fetched afresh, never played from the browser's cache
  const st = statSync(f), size = st.size, type = TYPES[extname(f)] || 'application/octet-stream', range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  const fresh = { 'Cache-Control': 'no-cache', 'Last-Modified': st.mtime.toUTCString() };
  if (range) {
    const a = range[1] ? +range[1] : 0, b = range[2] ? +range[2] : size - 1;
    res.writeHead(206, { ...fresh, 'Content-Type': type, 'Content-Range': `bytes ${a}-${b}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': b - a + 1 });
    return createReadStream(f, { start: a, end: b }).pipe(res);
  }
  res.writeHead(200, { ...fresh, 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' });
  createReadStream(f).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`companion site: http://localhost:${PORT}/\nwhat needs review: http://localhost:${PORT}/review/  (notes → ${DIR}/NOTES.md)`));
