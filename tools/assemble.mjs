// assemble.mjs: joins the chapters into one film, and writes what YouTube needs alongside it.
//   node tools/assemble.mjs            the drafts (out/chNN_draft.mp4) → out/film/film.mp4          (npm run film)
//   node tools/assemble.mjs --final    the final renders (out/chNN.mp4) → out/film/film.mp4
//   --force                            join again even if the film is newer than every chapter
// The pictures are stream-copied; the sound is leveled for YouTube (below), which takes a few minutes. It's all skipped
// when nothing changed. Every chapter must have its video.
// Also writes, in out/film/:
//   film.json    which renders went in, and where each chapter starts in the film (the site's film page uses it)
//   youtube.md   the upload's title, description and tags, to paste in (tools/youtube.mjs)
import { execFileSync, spawnSync } from 'node:child_process';
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

// ---- the film's loudness ----
// YouTube plays a video at about −14 LUFS: it turns a louder one down but never a quieter one up, and the chapters are
// mixed with the voice at −18 (tools/voice.mjs), so the joined film comes up to AIM. Speech peaks sit well above its
// loudness, so the raise goes through a gentle compressor (the loudest syllables, a few dB) and then a limiter, run at
// four times the sample rate so it catches the peaks between samples, holding them under CEIL: a peak at 0 dBFS can clip
// once YouTube re-encodes it. The limiter takes a little loudness back, so the gain is measured twice before the encode.
const AIM = -14, CEIL = -1;
const COMP = 'acompressor=threshold=-12dB:ratio=3:attack=5:release=150:knee=6:detection=rms';
const LIMIT = 'aresample=176400,alimiter=limit=-1.5dB:attack=2:release=80:asc=1:level=0,aresample=44100';
// integrated loudness (LUFS) and true peak (dBFS) of a file's sound (or the joined chapters', from the concat list),
// after an optional filter chain
const input = f => f.endsWith('.txt') ? ['-f', 'concat', '-safe', '0', '-i', f] : ['-i', f];
function loudness(f, chain) {
  const out = spawnSync('ffmpeg', ['-hide_banner', ...input(f), '-vn', '-af', `${chain ? chain + ',' : ''}ebur128=peak=true`, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 28 }).stderr;
  const sum = out.slice(out.lastIndexOf('Summary:'));
  return { i: +sum.match(/I:\s+(-?[\d.]+) LUFS/)[1], tp: +sum.match(/Peak:\s+(-?[\d.]+) dBFS/)[1] };
}
function level(from, to) {
  const chain = g => `${COMP},volume=${g.toFixed(2)}dB,${LIMIT}`;
  let g = AIM - loudness(from, COMP).i;
  g += AIM - loudness(from, chain(g)).i;
  execFileSync('ffmpeg', ['-y', '-v', 'error', ...input(from), '-map', '0:v', '-map', '0:a', '-c:v', 'copy', '-af', chain(g), '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', to], { stdio: 'inherit' });
}

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
  // straight from the chapters, with no joined copy in between (a final film is several GB)
  if (info[0].audio) level(`${DIR}/list.txt`, OUT + '.part.mp4');
  else execFileSync('ffmpeg', ['-y', '-v', 'error', ...input(`${DIR}/list.txt`), '-c', 'copy', '-movflags', '+faststart', OUT + '.part.mp4']);
  renameSync(OUT + '.part.mp4', OUT);
  console.log(`${OUT}: ${chapters.length} chapters, ${hms(total)}${info[0].audio ? '' : ' (no voice track)'}`);
}
const loud = info[0].audio ? loudness(OUT) : null;
if (loud) console.log(`  its sound: ${loud.i} LUFS, true peak ${loud.tp} dBFS (the aim: ${AIM} LUFS, peaks at or under ${CEIL})`);
if (loud && (Math.abs(loud.i - AIM) > .5 || loud.tp > CEIL)) { console.error(`the film's sound is off its aim; join it again (--force)`); process.exit(1); }
writeFileSync(`${DIR}/film.json`, JSON.stringify({ final: FINAL, duration: +total.toFixed(3), loudness: loud, chapters: chapters.map((c, i) => ({ n: c.n, title: c.title, video: videos[i], start: +start[i].toFixed(3), secs: +info[i].secs.toFixed(3) })) }, null, 1) + '\n');

function hms(s) { s = Math.floor(s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return `${h ? h + ':' + pad(m) : m}:${pad(s % 60)}`; }
console.log(`${DIR}/film.json`);
// the YouTube upload's words
await import('./youtube.mjs');

