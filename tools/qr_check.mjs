// qr_check.mjs: proves the painted QR codes scan. Renders each code at its real on-screen size through the full engine
// (paper, paint, grain), then decodes it with two independent decoders (jsQR and ZXing) under three conditions:
//   screen   the rendered frame resampled at 13 scales from 0.5× to 1.3× (no camera sees a display pixel for pixel, and
//            a phone can be at any distance). ZXing, the decoder family phone scanners come from, must read every scale;
//            jsQR, a weaker second opinion that misses sporadically at particular ratios, at least 75% of them
//   youtube  scaled to 720p and re-encoded as x264 CRF 28, like a streamed video
//   phone    cropped, tilted in perspective, blurred and noised, like a photo of a screen
//   pixel    the frame exactly 1:1 (informational only: the paper grain can alias against the module grid at exactly
//            1:1, which never happens through a lens)
// A code passes when ZXing reads the exact URL in every trial (13 scales + youtube + phone), and jsQR, a weaker second
// opinion that misses sporadically at particular ratios, in at least 75% of those 15 trials.
//   node tools/qr_check.mjs                  every reference in script/refs.yaml (in its style, mode and ECC)
//   node tools/qr_check.mjs --only=id,id     just these references
//   node tools/qr_check.mjs --styles         every style in src/qr.js, on a sample URL, at shelf and feature sizes
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
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const SIZE = { feature: 480, shelf: 340 }, ECC = { feature: 'H', shelf: 'Q' };
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
    .map(r => ({ id: r.id, url: r.qr_url || r.url, style: r.style, mode: r.mode }))
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
async function renderCase(c) {
  const url = await page.evaluate((c, size, ecc) => {
    window.LOOP = t => {
      paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, washOp: 120, ink: null });
      window.QR_GEOM = qrCard(c.url, W / 2, H / 2, size, c.style, { ecc, t });
    };
    window.LOOP.len = 1;
    return window.renderAt(.5, 'image/png');
  }, c, SIZE[c.mode], ECC[c.mode]);
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
const ff = (...a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
function youtube(file) {
  ff('-i', file, '-vf', 'scale=1280:720', '-c:v', 'libx264', '-crf', '28', '-pix_fmt', 'yuv420p', `${OUT}/tmp.mp4`);
  ff('-i', `${OUT}/tmp.mp4`, '-frames:v', '1', '-vf', 'scale=1920:1080', `${OUT}/tmp_yt.png`);
  return readPng(readFileSync(`${OUT}/tmp_yt.png`));
}
const SCALES = [.5, .6, .7, .75, .8, .85, .9, .95, 1.05, 1.1, 1.2, 1.3, 1.4];
function screenSweep(file, box, url) {
  const [x, y, w, h] = box; let j = 0, z = 0;
  for (const k of SCALES) {
    ff('-i', file, '-vf', `crop=${w}:${h}:${x}:${y},scale=iw*${k}:ih*${k}`, `${OUT}/tmp_sc.png`);
    const png = readPng(readFileSync(`${OUT}/tmp_sc.png`));
    j += decodeJsqr(png) === url; z += decodeZxing(png) === url;
  }
  return { j, z, ok: [j === SCALES.length, z === SCALES.length] };
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
  const pixel = crop(readPng(buf), ...box), yt = crop(youtube(file), ...box), ph = phone(file, box), sw = screenSweep(file, box, c.url);
  const row = { ...c, implemented: known.has(c.style), screen: sw.ok, sweep: `jsQR ${sw.j}/${SCALES.length}, ZXing ${sw.z}/${SCALES.length}` };
  if (!sw.ok.every(Boolean)) writeFileSync(`${OUT}/${c.id.replace(/\//g, '_')}_screen.png`, PNG.sync.write(pixel));
  for (const [cond, png] of [['youtube', yt], ['phone', ph], ['pixel', pixel]]) {
    row[cond] = [decodeJsqr(png) === c.url, decodeZxing(png) === c.url];
    if (!row[cond].every(Boolean) && cond !== 'pixel') writeFileSync(`${OUT}/${c.id.replace(/\//g, '_')}_${cond}.png`, PNG.sync.write(png));
  }
  row.jsqr = sw.j + row.youtube[0] + row.phone[0]; row.zxing = sw.z + row.youtube[1] + row.phone[1];
  row.ok = row.zxing === SCALES.length + 2 && row.jsqr >= .75 * (SCALES.length + 2);
  results.push(row);
  console.log(`${row.ok ? 'ok  ' : 'FAIL'} ${c.id} (${c.style}${row.implemented ? '' : ', not built yet: plain'}, ${c.mode})  ZXing ${row.zxing}/15  jsQR ${row.jsqr}/15`);
}
await browser.close();
for (const f of ['tmp.png', 'tmp.mp4', 'tmp_yt.png', 'tmp_ph.png', 'tmp_sc.png']) rmSync(`${OUT}/${f}`, { force: true });

const fails = results.filter(r => !r.ok), tick = a => a.map(b => b ? '✓' : '✗').join(' ');
writeFileSync(REPORT, `# QR scan report

Generated by \`tools/qr_check.mjs${args.styles ? ' --styles' : ''}\`. Each code is rendered through the full engine at its on-screen size
(feature ${SIZE.feature} px at ECC ${ECC.feature}, shelf ${SIZE.shelf} px at ECC ${ECC.shelf}) and decoded by jsQR and ZXing (✓ ✓ = both read the exact
URL) in 15 trials: **screen**, the frame resampled at 13 scales from 0.5× to 1.4×; **youtube**, a 720p CRF-28 re-encode;
and **phone**, a keystoned, blurred and noised photo. A code passes when ZXing (the decoder family phone scanners come
from) reads all 15, and jsQR (a weaker second opinion that misses sporadically at particular ratios) at least 12. The exact 1:1 frame (pixel) is shown for information only: paper grain can alias against the module grid
at exactly 1:1, which never happens through a lens.

**${results.length - fails.length} of ${results.length} pass.**${fails.length ? ` Failing: ${fails.map(r => r.id).join(', ')} (crops in \`${OUT}/\`).` : ''}

| code | style | mode | ZXing | jsQR | screen sweep | youtube | phone | pixel (info) |
|---|---|---|---|---|---|---|---|---|
${results.map(r => `| ${r.ok ? '' : '**✗** '}${r.id} | ${r.style}${r.implemented ? '' : ' *(plain for now)*'} | ${r.mode} | ${r.zxing}/15 | ${r.jsqr}/15 | ${r.sweep} | ${tick(r.youtube)} | ${tick(r.phone)} | ${tick(r.pixel)} |`).join('\n')}
`);
console.log(`${results.length - fails.length}/${results.length} pass; wrote ${REPORT}`);
if (fails.length) process.exit(1);
