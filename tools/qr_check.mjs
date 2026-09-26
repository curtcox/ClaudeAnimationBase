// qr_check.mjs: proves the painted QR codes scan. Renders each code at its real on-screen size through the full engine
// (paper, paint, grain), then decodes it with three independent decoders (jsQR, ZXing's JavaScript port and ZBar compiled
// to WebAssembly) in 15 trials:
//   screen   13 trials: the rendered frame resampled at scales from 0.5× to 1.4× (no camera sees a display pixel for
//            pixel, and a phone can be at any distance)
//   youtube  scaled to 720p and re-encoded as x264 CRF 28, like a streamed video
//   phone    cropped, tilted in perspective, blurred and noised, like a photo of a screen
//   pixel    the frame exactly 1:1, for information only (paper grain can alias against the module grid at exactly 1:1,
//            which never happens through a lens)
// A trial passes when at least two of the three decoders read the exact URL; a code passes when all 15 trials do. Each
// decoder alone has blind spots (ZXing-js fails some perfect, computer-generated codes outright; jsQR misses
// sporadically at particular scales), so no single one is the gate.
//   node tools/qr_check.mjs                  every reference in script/refs.yaml (in its style, mode and ECC)
//   node tools/qr_check.mjs --only=id,id     just these references
//   node tools/qr_check.mjs --styles         every style in src/qr_styles.js, on a sample URL, at shelf and feature sizes
// Writes script/qr_report.md; the failing crops go to out/qr_check/. Exit 1 if anything fails.
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { PNG } from 'pngjs';
import { readYaml } from './script_lib.mjs';

const require = createRequire(import.meta.url);
const jsQR = require('jsqr');
const ZX = require('@zxing/library');
const { scanImageData } = require('@undecaf/zbar-wasm');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const SIZE = { feature: 480, shelf: 380 }, ECC = { feature: 'H', shelf: 'Q' };
const OUT = 'out/qr_check', REPORT = 'script/qr_report.md';
mkdirSync(OUT, { recursive: true });

// ---- what to test ----
let cases;
if (args.styles) {
  const styles = await stylesInPage();
  const url = 'https://en.wikipedia.org/wiki/Gadolinium';
  cases = styles.flatMap(s => ['shelf', 'feature'].map(mode => ({ id: `${s}/${mode}`, url, style: s, mode })));
} else {
  const only = args.only ? new Set(String(args.only).split(',')) : null;
  cases = readYaml('script/refs.yaml').filter(r => !only || only.has(r.id))
    .map(r => ({ id: r.id, url: r.qr_url || r.url, style: r.style, mode: r.mode, ecc: r.ecc }))
    .filter(c => c.url && c.url !== 'SHORT');
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
const known = new Set(await page.evaluate(() => Object.keys(QR_STYLES)));
for (const c of cases) c.resolved = await page.evaluate(k => qrStyleFor(k), c.style);
async function renderCase(c) {
  const url = await page.evaluate((c, size, ecc) => {
    window.LOOP = t => {
      paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, washOp: 120, ink: null });
      window.QR_GEOM = qrCard(c.url, W / 2, H / 2, size, qrStyleFor(c.style), { ecc, t });
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
async function trial(png, url) { const r = [decodeJsqr(png) === url, decodeZxing(png) === url, (await decodeZbar(png)) === url]; return { r, ok: r.filter(Boolean).length >= 2 }; }
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
for (const c of cases) {
  const buf = await renderCase(c), file = `${OUT}/tmp.png`; writeFileSync(file, buf);
  const s = SIZE[c.mode], m = Math.round(s * .45), box = [960 - s / 2 - m, 540 - s / 2 - m, s + 2 * m, s + 2 * m].map(Math.round);
  const pixel = crop(readPng(buf), ...box), yt = crop(youtube(file), ...box), ph = phone(file, box), sw = await screenSweep(file, box, c.url);
  const row = { ...c, implemented: known.has(c.resolved) };
  row.trials = [...sw, await trial(yt, c.url), await trial(ph, c.url)];
  row.pixel = (await trial(pixel, c.url)).r;
  row.youtube = row.trials[SCALES.length].r; row.phone = row.trials[SCALES.length + 1].r;
  row.passed = row.trials.filter(x => x.ok).length;
  [row.jsqr, row.zxing, row.zbar] = [0, 1, 2].map(d => row.trials.filter(x => x.r[d]).length);
  row.ok = row.passed === row.trials.length;
  if (!row.ok) writeFileSync(`${OUT}/${c.id.replace(/\//g, '_')}.png`, PNG.sync.write(pixel));
  results.push(row);
  console.log(`${row.ok ? 'ok  ' : 'FAIL'} ${c.id} (${c.style}${row.implemented ? '' : ', not built yet: plain'}, ${c.mode})  majority ${row.passed}/15  (jsQR ${row.jsqr}, ZXing ${row.zxing}, ZBar ${row.zbar})`);
}
await browser.close();
for (const f of ['tmp.png', 'tmp.mp4', 'tmp_yt.png', 'tmp_ph.png', 'tmp_sc.png']) rmSync(`${OUT}/${f}`, { force: true });

const fails = results.filter(r => !r.ok), tick = a => a.map(b => b ? '✓' : '✗').join(' ');
writeFileSync(REPORT, `# QR scan report

Generated by \`tools/qr_check.mjs${args.styles ? ' --styles' : ''}\`. Each code is rendered through the full engine at its on-screen size
(feature ${SIZE.feature} px at ECC ${ECC.feature}, shelf ${SIZE.shelf} px at ECC ${ECC.shelf}) and decoded in 15 trials: the frame resampled at 13 scales
from 0.5× to 1.4×, a 720p CRF-28 re-encode (youtube), and a keystoned, blurred and noised photo (phone). Three decoders
read every trial: jsQR, ZXing's JavaScript port and ZBar (WebAssembly). A trial passes when at least two of them read the
exact URL; a code passes when all 15 trials do. No single decoder is the gate, because each has blind spots: ZXing-js
fails some perfect, computer-generated codes outright, and jsQR misses sporadically at particular scales.

**${results.length - fails.length} of ${results.length} pass.**${fails.length ? ` Failing: ${fails.map(r => r.id).join(', ')} (crops in \`${OUT}/\`).` : ''}

| code | style | mode | trials passed | jsQR | ZXing | ZBar | youtube (jsQR ZXing ZBar) | phone | pixel 1:1 (info) |
|---|---|---|---|---|---|---|---|---|---|
${results.map(r => `| ${r.ok ? '' : '**✗** '}${r.id} | ${r.style}${r.resolved !== r.style ? ` → ${r.resolved}` : ''}${r.implemented ? '' : ' *(plain for now)*'} | ${r.mode} | ${r.passed}/15 | ${r.jsqr} | ${r.zxing} | ${r.zbar} | ${tick(r.youtube)} | ${tick(r.phone)} | ${tick(r.pixel)} |`).join('\n')}
`);
console.log(`${results.length - fails.length}/${results.length} pass; wrote ${REPORT}`);
if (fails.length) process.exit(1);
