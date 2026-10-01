// thumbnail.mjs: the YouTube thumbnail → docs/thumbnail.jpg (1280×720, YouTube's size; under its 2 MB limit).
//   node tools/thumbnail.mjs     (npm run thumbnail)
//   node tools/thumbnail.mjs --loop=thumbnail_swarm   → docs/thumbnail_swarm.jpg, the other version: the one on YouTube,
//   so it's also site/thumbnail.jpg (480×270), the link home at the top of every page of the site
// Painted by src/thumbnail.js (LOOPS.thumbnail), which render.mjs injects: studio.html doesn't load it, so changing it
// never redraws the film.
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

const LOOP = (process.argv.find(a => a.startsWith('--loop=')) || '--loop=thumbnail').slice(7);
const DIR = `out/${LOOP}`, OUT = `docs/${LOOP}.jpg`;
execFileSync('node', ['render.mjs', '--add-script=src/thumbnail.js', `--loop=${LOOP}`, '--stills=0.5', `--out=${DIR}`], { stdio: 'inherit' });
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${DIR}/t0_50.png`, '-vf', 'scale=1280:720:flags=lanczos', '-q:v', '2', OUT]);
if (LOOP === 'thumbnail_swarm') execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', OUT, '-vf', 'scale=480:270:flags=lanczos', '-q:v', '3', 'site/thumbnail.jpg']);
const kb = statSync(OUT).size / 1024;
if (kb > 2000) { console.error(`${OUT} is ${Math.round(kb)} KB; YouTube takes 2 MB`); process.exit(1); }
console.log(`${OUT}: 1280×720, ${Math.round(kb)} KB`);
