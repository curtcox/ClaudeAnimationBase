// scratch_voice.mjs: a scratch voice track from the Mac's built-in voices, for reviewing picture against words before the
// real voices exist. Same pipeline the real voices will use: one clip per spoken line (cached by content), measured, so the
// chapter's timeline is retimed to the clips; then the chapter's audio is mixed from the retimed timeline.
//   node tools/scratch_voice.mjs --chapter=2     clips for chapter 2 → audio/durations.json → timeline → audio/ch02.wav
//   node tools/scratch_voice.mjs                 every chapter
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PATHS, readYaml, pad } from './script_lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const VOICES = { curt: ['Reed (English (US))', 170], claude: ['Samantha', 178] };   // [voice, words per minute]
const SR = 44100, DIR = 'audio/scratch';
mkdirSync(DIR, { recursive: true });
const script = readYaml(PATHS.script), only = args.chapter != null ? +args.chapter : null;
const lines = script.lines.filter(l => l.spoken && (only == null || l.ch === only));
const durations = existsSync('audio/durations.json') ? JSON.parse(readFileSync('audio/durations.json', 'utf8')) : {};
const clips = existsSync(`${DIR}/clips.json`) ? JSON.parse(readFileSync(`${DIR}/clips.json`, 'utf8')) : {};
const seconds = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();

// macOS `say` sometimes hangs for good (a rebuild sat 2 h on one line), so each line gets SAY_TIMEOUT and a few tries. It
// writes to a temporary file that's renamed only once complete, so a killed `say` never leaves a half clip that a later
// run would take as done.
const SAY_TIMEOUT = 120000, SAY_TRIES = 3;
function speak(voice, rate, text, f) {
  const tmp = f.replace(/\.aiff$/, '.part.aiff');
  for (let i = 1; ; i++) {
    try { execFileSync('say', ['-v', voice, '-r', String(rate), '-o', tmp, text], { timeout: SAY_TIMEOUT, killSignal: 'SIGKILL' }); renameSync(tmp, f); return; }
    catch (e) { rmSync(tmp, { force: true }); if (i >= SAY_TRIES) throw e; console.log(`say failed or hung (try ${i}); trying again: ${text.slice(0, 60)}`); }
  }
}
let made = 0;
for (const l of lines) {
  const [voice, rate] = VOICES[l.speaker], key = createHash('sha256').update(`${voice}|${rate}|${l.speech}`).digest('hex').slice(0, 16), f = `${DIR}/${key}.aiff`;
  if (!existsSync(f)) { speak(voice, rate, l.speech, f); made++; }
  clips[l.id] = f; durations[l.id] = +seconds(f).toFixed(3);
}
writeFileSync('audio/durations.json', JSON.stringify(durations, null, 1) + '\n');
writeFileSync(`${DIR}/clips.json`, JSON.stringify(clips, null, 1) + '\n');
console.log(`${lines.length} lines (${made} new clips) → audio/durations.json`);

// retime, then mix each chapter's clips at their line starts into one WAV
execFileSync('node', ['tools/timeline.mjs'], { stdio: 'inherit' });
const chapters = readYaml(PATHS.chapters).filter(c => only == null || c.n === only);
for (const c of chapters) {
  const g = {}; new Function('window', readFileSync(`src/gen/ch${pad(c.n)}.js`, 'utf8'))(g);
  const CH = g.CHAPTER, n = Math.ceil(CH.duration * SR), mix = new Float32Array(n);
  for (const l of CH.lines) {
    if (!clips[l.id]) continue;
    const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', clips[l.id], '-f', 's16le', '-ac', '1', '-ar', String(SR), '-'], { maxBuffer: 1 << 28 });
    const at = Math.round(l.t0 * SR);
    for (let i = 0; i < pcm.length / 2 && at + i < n; i++) mix[at + i] += pcm.readInt16LE(i * 2) / 32768;
  }
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(mix[i] * 32767 * .9))), 44 + i * 2);
  writeFileSync(`audio/ch${pad(c.n)}.wav`, buf);
  console.log(`audio/ch${pad(c.n)}.wav  ${CH.duration.toFixed(1)} s`);
}
