// scratch_voice.mjs: a scratch voice track from the Mac's built-in voices, for reviewing picture against words before the
// real voices exist, or on a machine without them. Same pipeline as the real voice (voice.mjs): one clip per spoken line
// (cached by content), measured, so the chapter's timeline is retimed to the clips; then the chapter's audio is mixed
// from the retimed timeline (voice_lib.mjs).
//   node tools/scratch_voice.mjs --chapter=2     clips for chapter 2 → audio/durations.json → timeline → audio/ch02.wav
//   node tools/scratch_voice.mjs                 every chapter
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PATHS, readYaml } from './script_lib.mjs';
import { finishVoice } from './voice_lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const VOICES = { curt: ['Reed (English (US))', 170], claude: ['Samantha', 178] };   // [voice, words per minute]
const DIR = 'audio/scratch';
mkdirSync(DIR, { recursive: true });
const script = readYaml(PATHS.script), only = args.chapter != null ? +args.chapter : null;
const lines = script.lines.filter(l => l.spoken && (only == null || l.ch === only));
const clips = existsSync(`${DIR}/clips.json`) ? JSON.parse(readFileSync(`${DIR}/clips.json`, 'utf8')) : {};

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
  clips[l.id] = f;
}
writeFileSync(`${DIR}/clips.json`, JSON.stringify(clips, null, 1) + '\n');
console.log(`${lines.length} lines (${made} new clips)`);
finishVoice(Object.fromEntries(lines.map(l => [l.id, clips[l.id]])), only);
