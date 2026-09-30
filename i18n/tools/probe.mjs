// probe.mjs: draws a translated chapter in the stage's studio, a few frames a second, and lists what's still English:
// lettered words with no translation, and cue phrases with no anchor (placed by position instead).
//   node i18n/tools/probe.mjs --chapter=1 [--lang=es] [--fps=2]
// Writes i18n/<lang>/stage/out/probe/chNN.json. Run i18n/tools/stage.mjs (and the stage's tools/timeline.mjs) first.
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { dirOf, langOf, args, pad } from './i18n_lib.mjs';

const S = `${dirOf(langOf(args))}/stage`, CH = pad(+args.chapter), fps = +(args.fps || 2);
const CHROME = [args.chrome, process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium']
  .find(p => p && existsSync(p));
if (!CHROME) { console.error('Chrome not found: pass --chrome=<path> or set CHROME_PATH'); process.exit(1); }
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1920,1080'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(pathToFileURL(resolve(`${S}/studio.html`)).href + `?render&chapter=${CH}&draft=1`, { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForFunction('window.ready === true', { timeout: 60000 });
const dur = await page.evaluate(() => DUR);
for (let t = 0; t < dur; t += 1 / fps) await page.evaluate(t => window.renderAt(t, 'image/jpeg', .1, 64), t);
const miss = await page.evaluate(() => window.I18N_MISSES);
await browser.close();

const strings = Object.entries(miss.strings).sort((a, b) => b[1] - a[1]).map(([s]) => s), anchors = Object.keys(miss.anchors);
mkdirSync(`${S}/out/probe`, { recursive: true });
writeFileSync(`${S}/out/probe/ch${CH}.json`, JSON.stringify({ chapter: +CH, strings, anchors, errors }, null, 1) + '\n');
console.log(`chapter ${+CH}: ${strings.length} lettered strings still English, ${anchors.length} cues placed by position, ${errors.length} page errors`);
for (const s of strings) console.log(`  lettered: ${JSON.stringify(s)}`);
for (const a of anchors) console.log(`  cue: ${a}`);
for (const e of [...new Set(errors)]) console.log(`  error: ${e}`);
