// assemble.mjs: joins the chapters into one film, and writes what YouTube needs alongside it.
//   node tools/assemble.mjs            the drafts (out/chNN_draft.mp4) → out/film/film.mp4          (npm run film)
//   node tools/assemble.mjs --final    the final renders (out/chNN.mp4) → out/film/film.mp4
//   --force                            join again even if the film is newer than every chapter
// Stream copy, so it takes seconds, and it's skipped when nothing changed. Every chapter must have its video.
// Also writes, in out/film/:
//   film.json    which renders went in, and where each chapter starts in the film (the site's film page uses it)
//   youtube.md   the upload's title, description and tags, to paste in (tools/youtube.mjs)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync, readFileSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';
import { PATHS, readYaml, pad } from './script_lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const FINAL = !!args.final, DIR = 'out/film', OUT = `${DIR}/film.mp4`;
const chapters = readYaml(PATHS.chapters);
const videos = chapters.map(c => `out/ch${pad(c.n)}${FINAL ? '' : '_draft'}.mp4`);
const gone = chapters.filter((c, i) => !existsSync(videos[i]));
if (gone.length) { console.error(`no ${FINAL ? 'final render' : 'draft'} yet for chapter${gone.length > 1 ? 's' : ''} ${gone.map(c => c.n).join(', ')}; render ${gone.length > 1 ? 'them' : 'it'} first (npm run rebuild)`); process.exit(1); }
mkdirSync(DIR, { recursive: true });

const probe = f => JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height,r_frame_rate', '-of', 'json', f]).toString());
const info = videos.map(f => { const p = probe(f), v = p.streams.find(s => s.codec_type === 'video');
  return { file: f, secs: +p.format.duration, audio: p.streams.some(s => s.codec_type === 'audio'), shape: `${v.width}x${v.height}@${v.r_frame_rate}` }; });
// stream copy needs every chapter alike
for (const k of ['audio', 'shape']) if (new Set(info.map(x => x[k])).size > 1)
  { console.error(`the chapters differ in ${k === 'audio' ? 'whether they have a voice track' : 'size or frame rate'}: ${info.map((x, i) => `${chapters[i].n}: ${x[k]}`).join(', ')}. Render them again alike.`); process.exit(1); }

// a chapter video much shorter than its timeline was cut off (an encode that stopped at a bad frame): don't join it
const short = chapters.filter((c, i) => { const g = {}; new Function('window', readFileSync(`src/gen/ch${pad(c.n)}.js`, 'utf8'))(g); return info[i].secs < g.CHAPTER.duration - 2; });
if (short.length) { console.error(`cut off: chapter${short.length > 1 ? 's' : ''} ${short.map(c => c.n).join(', ')} ${short.length > 1 ? 'are' : 'is'} shorter than the timeline; render again`); process.exit(1); }
const start = []; info.reduce((t, x, i) => (start[i] = t) + x.secs, 0);
const total = start.at(-1) + info.at(-1).secs;
const fresh = existsSync(OUT) && existsSync(`${DIR}/film.json`) && JSON.parse(readFileSync(`${DIR}/film.json`, 'utf8')).final === FINAL
  && videos.every(f => statSync(f).mtimeMs < statSync(OUT).mtimeMs);
if (fresh && !args.force) console.log(`${OUT} is current (every chapter is older than it)`);
else {
  writeFileSync(`${DIR}/list.txt`, videos.map(f => `file '${resolve(f).replace(/'/g, "'\\''")}'`).join('\n') + '\n');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', `${DIR}/list.txt`, '-c', 'copy', '-movflags', '+faststart', OUT + '.part.mp4'], { stdio: 'inherit' });
  renameSync(OUT + '.part.mp4', OUT);
  console.log(`${OUT}: ${chapters.length} chapters, ${hms(total)}${info[0].audio ? '' : ' (no voice track)'}`);
}
writeFileSync(`${DIR}/film.json`, JSON.stringify({ final: FINAL, duration: +total.toFixed(3), chapters: chapters.map((c, i) => ({ n: c.n, title: c.title, video: videos[i], start: +start[i].toFixed(3), secs: +info[i].secs.toFixed(3) })) }, null, 1) + '\n');

function hms(s) { s = Math.floor(s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return `${h ? h + ':' + pad(m) : m}:${pad(s % 60)}`; }
console.log(`${DIR}/film.json`);
// the YouTube upload's words
await import('./youtube.mjs');

