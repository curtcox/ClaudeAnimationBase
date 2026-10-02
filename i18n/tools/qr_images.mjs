// qr_images.mjs: a translation's own Still QR codes (i18n/PLAN.md). The English ones (tools/qr_images.mjs) encode the
// English links; a translation's codes go to its own pages and Wikipedia's, so without these its cards fall back to a
// plain painted code.
//   node i18n/tools/qr_images.mjs --lang=ja     (or --lang=all)
// Refreshes the stage, then runs tools/qr_images.mjs in it, which writes through the stage's links:
//   i18n/<lang>/qr/f, n          the images, framed and bare (the stage's assets/qr), committed
//   i18n/<lang>/qr/qr_images.js  their index (the stage's src/gen/qr_images.js), committed
// Needs Still QR checked out beside this repo (or STILL_QR); then node tools/qr_check.mjs in the stage reads every code.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { args } from './i18n_lib.mjs';

const STILL = resolve(process.env.STILL_QR || '../Still-QR-codes-to-me');
if (!existsSync(`${STILL}/src/cli.ts`)) { console.error(`Still QR isn't at ${STILL} (set STILL_QR)`); process.exit(1); }
const every = readdirSync('i18n').filter(d => existsSync(`i18n/${d}/script`)).sort();
const langs = args.lang === 'all' ? every : String(args.lang || '').split(',').filter(Boolean);
if (!langs.length || langs.some(l => !every.includes(l))) { console.error(`--lang=one of ${every.join(', ')}, or all`); process.exit(1); }
for (const lang of langs) {
  mkdirSync(`i18n/${lang}/qr`, { recursive: true });   // stage.mjs links the stage's assets/qr here once this exists
  execFileSync('node', ['i18n/tools/stage.mjs', `--lang=${lang}`], { stdio: 'inherit' });
  execFileSync('node', ['tools/qr_images.mjs'], { cwd: `i18n/${lang}/stage`, stdio: 'inherit', env: { ...process.env, STILL_QR: STILL } });
  execFileSync('node', ['i18n/tools/stage.mjs', `--lang=${lang}`], { stdio: 'inherit' });   // the index, linked in
}
