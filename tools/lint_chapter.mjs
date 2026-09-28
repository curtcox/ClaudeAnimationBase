// lint_chapter.mjs: checks a chapter for what a viewer would trip over, in a few seconds and without rendering: codes that
// crowd, cover content, flash by or found no room; captions that cover content the picture could lift clear of, or that
// don't use the frame's width; silent stretches where nothing new is drawn (linger); and stretches where the picture
// holds still (chapterLint() in src/timing.js has the rules).
//   node tools/lint_chapter.mjs                 every chapter that has a scene
//   node tools/lint_chapter.mjs --chapter=2     just that one
// Exit 1 if anything but a warning is found (a still stretch, a caption over a full frame, a caption a code squeezes:
// sometimes a held shot is the point, and some pictures fill the frame).
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readYaml } from './script_lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const pad = n => String(n).padStart(2, '0');
const chapters = readYaml('script/chapters.yaml').filter(c => args.chapter ? +c.n === +args.chapter : existsSync(`src/gen/ch${pad(c.n)}.js`));
const chrome = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => p && existsSync(p));
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--allow-file-access-from-files', ...(process.platform === 'linux' ? ['--no-sandbox'] : [])] });
let errors = 0;
for (const c of chapters) {
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('[page error]', e.message));
  await page.goto(pathToFileURL(resolve('studio.html')).href + `?render&chapter=${pad(c.n)}`, { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.ready === true', { timeout: 60000 });
  const t0 = Date.now(), issues = await page.evaluate(() => typeof SHOTS !== 'undefined' && SHOTS.length ? chapterLint() : null);
  await page.close();
  if (!issues) { console.log(`chapter ${c.n}: no scene yet`); continue; }
  const WARN = ['static', 'undercap', 'squeezed'], bad = issues.filter(i => !WARN.includes(i.kind));
  errors += bad.length;
  console.log(`chapter ${c.n} (${c.title}): ${bad.length} problem${bad.length === 1 ? '' : 's'}, ${issues.length - bad.length} warning${issues.length - bad.length === 1 ? '' : 's'}  [${((Date.now() - t0) / 1000).toFixed(1)} s]`);
  for (const i of issues) console.log(`  ${i.kind.padEnd(8)} ${i.where.padEnd(30)} ${i.msg}`);
}
await browser.close();
process.exit(errors ? 1 : 0);
