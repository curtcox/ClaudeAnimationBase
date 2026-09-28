// start.mjs: the one command for a fresh clone of Frog or Axolotl.   npm start
//   1. checks what's needed (Node 20+, ffmpeg, Chrome, and on a Mac its `say` voices) and says how to get what's missing
//   2. installs the packages if they aren't yet (npm ci)
//   3. builds the companion site, serves it and opens it in your browser: everything but the film, in about a minute
//   4. then makes the film (tools/rebuild.mjs): the scratch voice, every chapter's draft and watch page, and the whole film
//      joined (tools/assemble.mjs). The site shows the progress and gains each chapter as it's done; the film page last.
// Run it again after a change and only what changed is redone (docs/RELEASE.md, "Iterating").
//   npm start -- --site-only       steps 1-3
//   npm start -- --chapters=2,5    only those chapters' drafts (the film is joined only when every chapter has one)
//   npm start -- --final           final-quality renders instead of drafts (many hours)
//   npm start -- --no-open         don't open the browser
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, statSync, openSync, mkdirSync } from 'node:fs';

const args = process.argv.slice(2), has = k => args.includes(`--${k}`);
const PORT = +(process.env.PORT || 8077), URL_ = `http://localhost:${PORT}/`;
const on = cmd => spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { stdio: 'ignore' }).status === 0;
const say = s => console.log(`\n▶ ${s}`);
const node = (script, a = [], o = {}) => spawnSync(process.execPath, [script, ...a], { stdio: 'inherit', ...o }).status === 0;

// ---- 1. what's needed ----
const missing = [], later = [];
if (+process.versions.node.split('.')[0] < 20) missing.push(`Node.js 20 or newer (this is ${process.version}): https://nodejs.org/`);
if (!on('ffmpeg') || !on('ffprobe')) later.push(`ffmpeg, to make the videos: ${process.platform === 'darwin' ? 'brew install ffmpeg' : 'https://ffmpeg.org/download.html'}`);
const chrome = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(p => p && existsSync(p));
if (!chrome) later.push('Google Chrome, which draws the film: https://www.google.com/chrome/ (or set CHROME_PATH to a Chrome or Chromium)');
if (process.platform !== 'darwin') console.log('note: the scratch voice uses the Mac\'s built-in voices, so here the drafts are silent (the timing is the committed one)');
if (missing.length) { console.error('Needed first:\n  ' + missing.join('\n  ')); process.exit(1); }
if (later.length) console.log('The site will work, but the film needs:\n  ' + later.join('\n  '));

// ---- 2. packages ----
const lock = 'package-lock.json', stamp = 'node_modules/.package-lock.json';
if (!existsSync(stamp) || statSync(stamp).mtimeMs < statSync(lock).mtimeMs) {
  say('installing packages (npm ci)');
  if (spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['ci', '--no-audit', '--no-fund'], { stdio: 'inherit', shell: process.platform === 'win32' }).status !== 0) process.exit(1);
}

// ---- 3. the site, served and opened ----
say('building the companion site');
if (!node('tools/build_site.mjs')) process.exit(1);
let up = false; try { up = (await fetch(`${URL_}api/review`, { signal: AbortSignal.timeout(2000) })).ok; } catch { }
if (!up) {
  mkdirSync('out/rebuild', { recursive: true });
  const log = openSync('out/rebuild/serve.log', 'a');
  spawn(process.execPath, ['tools/serve.mjs'], { detached: true, stdio: ['ignore', log, log] }).unref();
  for (let i = 0; i < 50 && !up; i++) { await new Promise(r => setTimeout(r, 200)); try { up = (await fetch(`${URL_}api/review`)).ok; } catch { } }
  if (!up) { console.error(`the site server didn't start; see out/rebuild/serve.log`); process.exit(1); }
}
console.log(`the site: ${URL_}`);
if (!has('no-open')) {
  const [cmd, a] = process.platform === 'darwin' ? ['open', [URL_]] : process.platform === 'win32' ? ['cmd', ['/c', 'start', '', URL_]] : ['xdg-open', [URL_]];
  spawn(cmd, a, { stdio: 'ignore', detached: true }).unref();
}
if (has('site-only')) process.exit(0);
if (later.length) { console.error('\nStopping before the film: install what\'s listed above, then run npm start again.'); process.exit(1); }

// ---- 4. the film ----
say(`making the film${has('final') ? ' at final quality (many hours)' : ' as drafts (an hour or two the first time; minutes after a small change)'}; progress shows on the site`);
const pass = args.filter(a => /^--(chapters=|final$|qr$)/.test(a));
const ok = node('tools/rebuild.mjs', ['--no-serve', ...pass]);
console.log(ok ? `\ndone. The film: ${URL_}film/` : `\nsome steps failed; the site says which (${URL_}review/), and out/rebuild/ has the log`);
process.exit(ok ? 0 : 1);
