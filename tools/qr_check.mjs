// qr_check.mjs: proves the painted QR codes scan. Renders each code at its real on-screen size through the full engine
// (paper, paint, grain), then decodes it with three independent decoders (jsQR, ZXing's JavaScript port and ZBar compiled
// to WebAssembly) in 15 trials:
//   screen   13 trials: the rendered frame resampled at scales from 0.5× to 1.4× (no camera sees a display pixel for
//            pixel, and a phone can be at any distance)
//   youtube  scaled to 720p and re-encoded as x264 CRF 28, like a streamed video
//   phone    cropped, tilted in perspective, blurred and noised, like a photo of a screen
//   pixel    the frame exactly 1:1, for information only (paper grain can alias against the module grid at exactly 1:1,
//            which never happens through a lens)
// A code passes when every trial is read (exact URL) by at least one decoder, and at least two decoders each read 13 or
// more of the 15. Each decoder alone has blind spots (ZXing-js fails some perfect, computer-generated codes outright;
// jsQR misses sporadically at particular scales), so no single one is the gate, and one decoder's bug can't fail a code
// the other two read.
//   node tools/qr_check.mjs                  every reference in script/refs.yaml (in its style, mode and ECC)
//                                            → script/qr_report.md
//   node tools/qr_check.mjs --only=id,id     just these references → out/qr_check/only_report.md (the full report is untouched)
//   node tools/qr_check.mjs --styles         every style in src/qr_styles.js, on a sample URL, at shelf and feature sizes
//                                            → script/qr_styles_report.md
//   --fresh                                  ignore the cache
// Results are cached by what was actually rendered (out/qr_cache.json): each code is rendered every time, and if its URL,
// size, ECC and the trials are the same as last time and its picture matches (a 64×64 thumbnail of the crop, within a few
// levels, since the GPU's rounding varies a hair between runs), its last result stands. Rendering all of them takes about a
// minute; only new or changed codes go through the 15 trials. The failing crops go to out/qr_check/. Exit 1 if anything fails.
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { PNG } from 'pngjs';
import { readYaml, loadRefs } from './script_lib.mjs';

const require = createRequire(import.meta.url);
const jsQR = require('jsqr');
const ZX = require('@zxing/library');
const { scanImageData } = require('@undecaf/zbar-wasm');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const SIZE = { feature: 480, shelf: 380, board: 300, card: 300 }, ECC = { feature: 'H', shelf: 'M', board: 'M', card: 'M' };
const OUT = 'out/qr_check', REPORT = args.styles ? 'script/qr_styles_report.md' : args.only ? `${OUT}/only_report.md` : 'script/qr_report.md';
// the cache: bump TRIALS when the trials or the pass rule change, so every code is decoded again
const TRIALS = 'v3: 13 scales .5-1.4, youtube crf28, phone; every trial read by one, two decoders read 13+', CACHE_F = 'out/qr_cache.json';
const cache = !args.fresh && existsSync(CACHE_F) ? JSON.parse(readFileSync(CACHE_F, 'utf8')) : {};
const keyOf = c => createHash('sha1').update([c.id, c.url, c.mode, c.ecc || ECC[c.mode], SIZE[c.mode], TRIALS].join('|')).digest('hex');
// a 64×64 grey thumbnail of the crop (block averages), and whether two are the same picture
function thumb(png) {
  const n = 64, b = Math.floor(png.width / n), out = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    let s = 0; for (let y = 0; y < b; y++) for (let x = 0; x < b; x++) { const k = ((j * b + y) * png.width + i * b + x) * 4; s += png.data[k] * .299 + png.data[k + 1] * .587 + png.data[k + 2] * .114; }
    out.push(Math.round(s / (b * b)));
  }
  return Buffer.from(out).toString('base64');
}
const samePicture = (a, b) => { const x = Buffer.from(a, 'base64'), y = Buffer.from(b, 'base64'); return x.length === y.length && x.every((v, i) => Math.abs(v - y[i]) <= 3); };
mkdirSync(OUT, { recursive: true });

// ---- what to test ----
let cases;
if (args.styles) {
  const styles = await stylesInPage();
  const url = 'https://en.wikipedia.org/wiki/Gadolinium';
  cases = styles.flatMap(s => ['shelf', 'feature'].map(mode => ({ id: `${s}/${mode}`, url, style: s, mode })));
} else {
  const only = args.only ? new Set(String(args.only).split(',')) : null;
  cases = loadRefs().filter(r => !only || only.has(r.id))
    .map(r => ({ id: r.id, url: r.qr_url || r.url, style: r.style, mode: r.mode, ecc: r.ecc }))
    .filter(c => c.url && c.url !== 'SHORT' && c.mode !== 'page');   // page: no code in the film
}

// ---- render ----
async function openStudio() {
  const chrome = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => p && existsSync(p));
  const gpu = process.platform === 'darwin' ? ['--use-angle=metal'] : ['--use-gl=angle'];
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, protocolTimeout: 0,
    args: [...(process.platform === 'linux' ? ['--no-sandbox'] : []), '--allow-file-access-from-files', '--ignore-gpu-blocklist', ...gpu, '--window-size=1920,1080'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('[page error]', e.message));
  await page.goto(pathToFileURL(resolve('studio.html')).href + '?render', { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.ready === true', { timeout: 60000 });
  return { browser, page };
}
async function stylesInPage() { const { browser, page } = await openStudio(); const s = await page.evaluate(() => Object.keys(QR_STYLES)); await browser.close(); return s; }

const { browser, page } = await openStudio();
const known = new Set(await page.evaluate(() => Object.keys(QR_STYLES))), stillQR = new Set(await page.evaluate(() => Object.keys(QR_IMAGE_STYLES)));
for (const c of cases) c.resolved = await page.evaluate(k => qrStyleFor(k), c.style);
async function renderCase(c) {
  const url = await page.evaluate((c, size, ecc) => {
    window.LOOP = t => {
      paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, washOp: 120, ink: null });
      // as the film shows it: a shelf code in a wide style loses its dressing (look.js shelfFramed); a Still QR picture is
      // fitted to its shelf or feature card, so its code is smaller than a painted one
      const R = { style: c.style, ecc, url: c.url, mode: c.mode }, card = c.mode === 'shelf' && shelfCard(R);
      const fit = card ? card.fit : c.mode === 'feature' && shelfImage(R) ? FEATURE_FIT : null;
      window.QR_GEOM = qrCard(c.url, W / 2, H / 2, size, qrStyleFor(c.style), { ecc, t, noFrame: c.mode === 'card' || (c.mode === 'shelf' && !shelfFramed({ style: c.style })), ...(fit ? { fit } : {}) });
    };
    window.LOOP.len = 1;
    return window.renderAt(.5, 'image/png');
  }, c, SIZE[c.mode], c.ecc || ECC[c.mode]);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
}

// ---- decode ----
const readPng = buf => PNG.sync.read(buf);
function crop(png, x, y, w, h) {
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(png, out, Math.max(0, x), Math.max(0, y), Math.min(w, png.width - x), Math.min(h, png.height - y), 0, 0);
  return out;
}
function decodeJsqr(png) { const r = jsQR(new Uint8ClampedArray(png.data), png.width, png.height, { inversionAttempts: 'dontInvert' }); return r ? r.data : null; }
function decodeZxing(png) {
  const lum = new Uint8ClampedArray(png.width * png.height);
  for (let i = 0; i < lum.length; i++) lum[i] = (png.data[i * 4] * 299 + png.data[i * 4 + 1] * 587 + png.data[i * 4 + 2] * 114) / 1000;
  try {
    const bmp = new ZX.BinaryBitmap(new ZX.HybridBinarizer(new ZX.RGBLuminanceSource(lum, png.width, png.height)));
    return new ZX.QRCodeReader().decode(bmp, new Map([[ZX.DecodeHintType.TRY_HARDER, true]])).getText();
  } catch { return null; }
}
async function decodeZbar(png) { try { const s = await scanImageData({ data: new Uint8ClampedArray(png.data), width: png.width, height: png.height }); return s.length ? s[0].decode() : null; } catch { return null; } }
// one trial: which decoders read the URL, and whether a majority did
async function trial(png, url) { const r = [decodeJsqr(png) === url, decodeZxing(png) === url, (await decodeZbar(png)) === url]; return { r, ok: r.some(Boolean) }; }
const ff = (...a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
function youtube(file) {
  ff('-i', file, '-vf', 'scale=1280:720', '-c:v', 'libx264', '-crf', '28', '-pix_fmt', 'yuv420p', `${OUT}/tmp.mp4`);
  ff('-i', `${OUT}/tmp.mp4`, '-frames:v', '1', '-vf', 'scale=1920:1080', `${OUT}/tmp_yt.png`);
  return readPng(readFileSync(`${OUT}/tmp_yt.png`));
}
const SCALES = [.5, .6, .7, .75, .8, .85, .9, .95, 1.05, 1.1, 1.2, 1.3, 1.4];
async function screenSweep(file, box, url) {
  const [x, y, w, h] = box, out = [];
  for (const k of SCALES) {
    ff('-i', file, '-vf', `crop=${w}:${h}:${x}:${y},scale=iw*${k}:ih*${k}`, `${OUT}/tmp_sc.png`);
    out.push(await trial(readPng(readFileSync(`${OUT}/tmp_sc.png`)), url));
  }
  return out;
}
function phone(file, box) {
  // the code and some margin, at ~70% scale, keystoned, softened and noised
  const [x, y, w, h] = box;
  ff('-i', file, '-vf', `crop=${w}:${h}:${x}:${y},scale=iw*0.7:ih*0.7,perspective=x0=W*0.06:y0=0:x1=W:y1=H*0.04:x2=0:y2=H:x3=W*0.95:y3=H*0.97:sense=destination,gblur=sigma=1.1,noise=alls=10:allf=t`, `${OUT}/tmp_ph.png`);
  return readPng(readFileSync(`${OUT}/tmp_ph.png`));
}

const results = [];
let reused = 0;
for (const c of cases) {
  const buf = await renderCase(c), file = `${OUT}/tmp.png`, key = keyOf(c);
  const s = SIZE[c.mode], m = Math.round(s * .45), box = [960 - s / 2 - m, 540 - s / 2 - m, s + 2 * m, s + 2 * m].map(Math.round);
  const pixel = crop(readPng(buf), ...box), th = thumb(pixel);
  if (cache[key] && cache[key].thumb && samePicture(cache[key].thumb, th)) {
    const row = { ...c, implemented: known.has(c.resolved), still: stillQR.has(c.resolved), ...cache[key], cached: true }; results.push(row); reused++;
    console.log(`${row.ok ? 'ok  ' : 'FAIL'} ${c.id} (unchanged since it was checked)`);
    continue;
  }
  writeFileSync(file, buf);
  const yt = crop(youtube(file), ...box), ph = phone(file, box), sw = await screenSweep(file, box, c.url);
  const row = { ...c, implemented: known.has(c.resolved), still: stillQR.has(c.resolved) };
  row.trials = [...sw, await trial(yt, c.url), await trial(ph, c.url)];
  row.pixel = (await trial(pixel, c.url)).r;
  row.youtube = row.trials[SCALES.length].r; row.phone = row.trials[SCALES.length + 1].r;
  row.passed = row.trials.filter(x => x.ok).length;
  [row.jsqr, row.zxing, row.zbar] = [0, 1, 2].map(d => row.trials.filter(x => x.r[d]).length);
  row.ok = row.passed === row.trials.length && [row.jsqr, row.zxing, row.zbar].filter(n => n >= 13).length >= 2;
  if (!row.ok) writeFileSync(`${OUT}/${c.id.replace(/\//g, '_')}.png`, PNG.sync.write(pixel));
  results.push(row);
  cache[key] = Object.fromEntries(['trials', 'pixel', 'youtube', 'phone', 'passed', 'jsqr', 'zxing', 'zbar', 'ok'].map(k => [k, row[k]]));
  cache[key].checked = new Date().toISOString().slice(0, 10); cache[key].thumb = th;
  writeFileSync(CACHE_F, JSON.stringify(cache));
  console.log(`${row.ok ? 'ok  ' : 'FAIL'} ${c.id} (${c.style}${row.implemented ? '' : row.still ? ', Still QR' : ', not built yet: plain'}, ${c.mode})  read ${row.passed}/15  (jsQR ${row.jsqr}, ZXing ${row.zxing}, ZBar ${row.zbar})`);
}
await browser.close();
if (!process.env.QR_KEEP) for (const f of ['tmp.png', 'tmp.mp4', 'tmp_yt.png', 'tmp_ph.png', 'tmp_sc.png']) rmSync(`${OUT}/${f}`, { force: true });

const fails = results.filter(r => !r.ok), tick = a => a.map(b => b ? '✓' : '✗').join(' ');
writeFileSync(REPORT, `# QR scan report

Generated by \`tools/qr_check.mjs${args.styles ? ' --styles' : args.only ? ' --only=…' : ''}\`. Each code is rendered through the full engine at its on-screen size
(feature ${SIZE.feature} px at ECC ${ECC.feature}, shelf ${SIZE.shelf} px at ECC ${ECC.shelf}) and decoded in 15 trials: the frame resampled at 13 scales
from 0.5× to 1.4×, a 720p CRF-28 re-encode (youtube), and a keystoned, blurred and noised photo (phone). Three decoders
read every trial: jsQR, ZXing's JavaScript port and ZBar (WebAssembly). A code passes when every trial is read (exact URL)
by at least one decoder, and at least two decoders each read 13 or more of the 15. No single decoder is the gate, because
each has blind spots: ZXing-js fails some perfect, computer-generated codes outright, and jsQR misses sporadically at
particular scales.

**${results.length - fails.length} of ${results.length} pass.**${reused ? ` (${reused} unchanged since their last check, so their results are reused.)` : ''}${fails.length ? ` Failing: ${fails.map(r => r.id).join(', ')} (crops in \`${OUT}/\`).` : ''}

| code | style | mode | trials read | jsQR | ZXing | ZBar | youtube (jsQR ZXing ZBar) | phone | pixel 1:1 (info) |
|---|---|---|---|---|---|---|---|---|---|
${results.map(r => `| ${r.ok ? '' : '**✗** '}${r.id} | ${r.style}${r.resolved !== r.style ? ` → ${r.resolved}` : ''}${r.implemented ? '' : r.still ? ' *(Still QR)*' : ' *(plain for now)*'} | ${r.mode} | ${r.passed}/15 | ${r.jsqr} | ${r.zxing} | ${r.zbar} | ${tick(r.youtube)} | ${tick(r.phone)} | ${tick(r.pixel)} |`).join('\n')}
`);
console.log(`${results.length - fails.length}/${results.length} pass (${reused} unchanged, reused); wrote ${REPORT}`);
if (fails.length) process.exit(1);
