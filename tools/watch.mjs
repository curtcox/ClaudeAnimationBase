// watch.mjs: prepares a chapter's watch page (the video with its links listed in step) for the companion site.
//   node tools/watch.mjs --chapter=2 [--video=out/ch02_review_720p.mp4]
// Asks the renderer's own layout pass when each code is on screen (refTimes() in src/timing.js), writes
// out/watch/chNN.json, remembers which video to show, then rebuilds the site. Serve it with: npm run serve
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const CH = String(args.chapter ?? '').padStart(2, '0');
if (!args.chapter) { console.error('usage: node tools/watch.mjs --chapter=N [--video=path]'); process.exit(1); }
const video = args.video || [`out/ch${CH}_review_720p.mp4`, `out/ch${CH}_review.mp4`, `out/ch${CH}.mp4`].find(existsSync);
if (!video) { console.error(`no video for chapter ${CH}: render one first (render.mjs --chapter=${+CH} --review ...)`); process.exit(1); }
const chrome = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => p && existsSync(p));
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--allow-file-access-from-files', ...(process.platform === 'linux' ? ['--no-sandbox'] : [])] });
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve('studio.html')).href + `?render&chapter=${CH}`, { waitUntil: 'networkidle0' });
await page.waitForFunction('window.ready === true', { timeout: 60000 });
const times = await page.evaluate(() => refTimes());
await browser.close();
mkdirSync('out/watch', { recursive: true });
writeFileSync(`out/watch/ch${CH}.json`, JSON.stringify({ video, times }, null, 1));
console.log(`chapter ${CH}: ${times.length} codes on screen; video ${video}`);
execFileSync('node', ['tools/build_site.mjs'], { stdio: 'inherit' });
