// voice.mjs: the film's real voices (ElevenLabs), one clip per spoken line, then the same retime and mix as the scratch
// voice (voice_lib.mjs). The voices and model are script/voices.yaml's.
//   node tools/voice.mjs                 every chapter
//   node tools/voice.mjs --chapter=2     just chapter 2
//   node tools/voice.mjs --dry           how many lines and characters would be sent, and nothing else
// Each clip is kept in assets/vo/<hash>.mp3, with ElevenLabs' character timings beside it (<hash>.json), keyed by voice,
// model and the words, and committed, so a fresh clone has the voices without a key. Only new or changed lines are sent.
// Each clip's loudness and timings become audio/sync.json: its lip sync and word starts (voice_lib.mjs's syncOf), which
// the timeline carries to the scenes. A line on its scratch clip has none, and its mouth keeps the made-up talk() rhythm.
// A line that can't be voiced (no key, quota spent) keeps its scratch clip if it has one, with a warning; run again later.
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { eleven } from './eleven.mjs';
import { finishVoice, lufs, syncOf, clipBase } from './voice_lib.mjs';
import { PATHS, readYaml, pageLines } from './script_lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const cast = readYaml('script/voices.yaml'), DIR = 'assets/vo', PARALLEL = 3, LEVEL = -18;   // every line mixed at LEVEL LUFS
const only = args.chapter != null ? +args.chapter : null;
const lines = [...readYaml(PATHS.script).lines, ...readYaml(PATHS.chapters).flatMap(pageLines)]   // the transcript's, and the cold open's page
  .filter(l => l.spoken && (only == null || l.ch === only));
mkdirSync(DIR, { recursive: true });
const fileOf = l => clipBase(l, cast);
const todo = lines.filter(l => !existsSync(fileOf(l) + '.mp3'));
const chars = todo.reduce((a, l) => a + l.speech.length, 0);
console.log(`${lines.length} lines; ${todo.length} to voice (${chars.toLocaleString()} characters)`);
if (args.dry) process.exit(0);

let stop = null, done = 0;
async function voiceLine(l) {
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await eleven(`text-to-speech/${cast[l.speaker].voice}/with-timestamps?output_format=mp3_44100_128`,
        { method: 'POST', body: { text: l.speech, model_id: cast.model } });
      const f = fileOf(l);
      writeFileSync(f + '.part.mp3', Buffer.from(r.audio_base64, 'base64'));
      writeFileSync(f + '.json', JSON.stringify({ line: l.id, text: l.speech, lufs: lufs(f + '.part.mp3'), alignment: r.alignment }) + '\n');
      renameSync(f + '.part.mp3', f + '.mp3');   // the clip is there whole, with its sidecar, or not at all
      if (++done % 10 === 0 || done === todo.length) console.log(`voiced ${done}/${todo.length}`);
      return;
    } catch (e) {
      const m = e.message;
      if (/quota|no ElevenLabs key|401|402/.test(m)) { stop = m; return; }                        // no use trying again now
      if (attempt >= 5) { console.log(`gave up on ${l.id}: ${m.slice(0, 200)}`); return; }
      await new Promise(r => setTimeout(r, 2000 * attempt ** 2));                                   // busy (429) or a hiccup
    }
  }
}
let next = 0;
await Promise.all(Array.from({ length: PARALLEL }, async () => { while (next < todo.length && !stop) await voiceLine(todo[next++]); }));
if (stop) console.log(`stopped early: ${stop.slice(0, 200)}`);

// every line's clip: the real one, else its scratch clip
const scratch = existsSync('audio/scratch/clips.json') ? JSON.parse(readFileSync('audio/scratch/clips.json', 'utf8')) : {};
const clips = {}, gains = {}, sync = {}, missing = [];
for (const l of lines) {
  const f = fileOf(l) + '.mp3';
  if (existsSync(f)) {
    clips[l.id] = f;
    const side = JSON.parse(readFileSync(fileOf(l) + '.json', 'utf8'));
    sync[l.id] = syncOf(f, l.speech, side.alignment);
    if (side.lufs == null) { side.lufs = lufs(f); writeFileSync(fileOf(l) + '.json', JSON.stringify(side) + '\n'); }
    if (isFinite(side.lufs)) gains[l.id] = Math.min(4, 10 ** ((LEVEL - side.lufs) / 20));
  }
  else { missing.push(l.id); if (scratch[l.id] && existsSync(scratch[l.id])) clips[l.id] = scratch[l.id]; }
}
if (missing.length) console.log(`warning: ${missing.length} line(s) not voiced yet, using the scratch voice where there is one: ${missing.slice(0, 12).join(' ')}${missing.length > 12 ? ' …' : ''}`);
writeFileSync('audio/voice.json', JSON.stringify({ model: cast.model, voices: { curt: cast.curt.voice, claude: cast.claude.voice }, missing }, null, 1) + '\n');
finishVoice(clips, only, gains, sync);
process.exitCode = missing.length ? 1 : 0;
