// sfx.mjs: the film's sounds (script/sfx.yaml), made by ElevenLabs, and a page to listen to them, /sounds/.
//   node tools/sfx.mjs         makes any sound not made yet, then writes the listening page, out/sounds/
//   node tools/sfx.mjs --dry   lists what would be made, and nothing else
// Each sound is made once and kept in assets/sfx/<hash>.mp3 (committed, like the voices), keyed by its prompt, length and
// kind, so a changed prompt makes a new one and a re-run costs nothing. A recurring cue (a flick per code) is one sound.
// Effects, stings and ambience come from the sound-effects endpoint (ambience as a 20 s loop, however long it runs);
// music from the music endpoint. The page plays each sound alone, and in place: under that moment's voice, at its level.
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { eleven } from './eleven.mjs';
import { sheet, errors } from './sfx_check.mjs';
import { pad } from './script_lib.mjs';

if (errors.length) { for (const e of errors) console.error(e); process.exit(1); }
const DIR = 'assets/sfx', OUT = 'out/sounds', LEVEL = -18, LOOP = 20, AROUND = 2.5;   // LEVEL: the voice's loudness (LUFS)
mkdirSync(DIR, { recursive: true }); mkdirSync(`${OUT}/clips`, { recursive: true });

// the sound a cue asks for: its length, and whether it loops (ambience)
const specOf = c => {
  const loop = c.kind === 'ambience', len = loop ? LOOP : Math.min(c.kind === 'music' ? 120 : 30, Math.max(.5, c.len ?? c.end - c.t));
  return { prompt: c.prompt, kind: c.kind, len: +len.toFixed(2), loop };
};
const keyOf = s => createHash('sha256').update(JSON.stringify(s)).digest('hex').slice(0, 16);
const sounds = new Map();   // key → { spec, cues: [placed cues] }
for (const c of sheet) { const spec = specOf(c), k = keyOf(spec); (sounds.get(k) || sounds.set(k, { spec, cues: [] }).get(k)).cues.push(c); }
const todo = [...sounds].filter(([k]) => !existsSync(`${DIR}/${k}.mp3`));
console.log(`${sheet.length} cues, ${sounds.size} sounds; ${todo.length} to make (${todo.reduce((a, [, s]) => a + s.spec.len, 0).toFixed(0)} s)`);
if (process.argv.includes('--dry')) { for (const [k, s] of todo) console.log(`  ${s.cues[0].id}: ${s.spec.kind}, ${s.spec.len} s`); process.exit(0); }

async function make(spec) {
  if (spec.kind === 'music')
    try { return await eleven('music?output_format=mp3_44100_128', { method: 'POST', raw: true, body: { prompt: spec.prompt, music_length_ms: Math.round(Math.max(3, spec.len) * 1000), model_id: 'music_v1' } }); }
    catch (e) { if (/quota|401|402/.test(e.message)) throw e; }   // too short for the music model, say: a sound effect instead
  return eleven('sound-generation?output_format=mp3_44100_128', { method: 'POST', raw: true,
    body: { text: spec.prompt, duration_seconds: Math.min(30, spec.len), prompt_influence: .5, loop: spec.loop, model_id: 'eleven_text_to_sound_v2' } });
}
let next = 0, done = 0, stop = null;
await Promise.all([0, 1, 2].map(async () => {
  while (next < todo.length && !stop) {
    const [k, s] = todo[next++];
    try {
      const b = await make(s.spec);
      writeFileSync(`${DIR}/${k}.mp3`, b); writeFileSync(`${DIR}/${k}.json`, JSON.stringify({ ...s.spec, for: s.cues[0].id }) + '\n');
      if (++done % 10 === 0 || done === todo.length) console.log(`  made ${done}/${todo.length}`);
    } catch (e) { if (/quota|no ElevenLabs key|401|402/.test(e.message)) stop = e.message; else console.log(`  couldn't make ${s.cues[0].id}: ${e.message.slice(0, 160)}`); }
  }
}));
if (stop) console.log(`stopped early: ${stop.slice(0, 200)}`);

// ---- each sound's loudness, so "in place" plays it at its gain under the voice ----
function loudness(f) {
  const err = spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const i = +(err.match(/"input_i"\s*:\s*"([-\d.inf]+)"/) || [])[1];
  if (Number.isFinite(i) && i > -60) return i;
  const m = +(spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' }).stderr.match(/mean_volume: ([-\d.]+) dB/) || [])[1];
  return Number.isFinite(m) ? m : LEVEL;   // too short for the loudness meter: its mean level
}
const seconds = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
const durations = Object.fromEntries(Array.from({ length: 17 }, (_, n) => [n, JSON.parse(readFileSync(`src/gen/ch${pad(n)}.js`, 'utf8').replace(/^[^{]*/, '').replace(/;\s*$/, '')).duration]));
// the moment in place: the chapter's voice from a little before to a little after, the sound over it at its gain
function inPlace(c, k, id) {
  const wav = `audio/ch${pad(c.ch)}.wav`, to = `${OUT}/clips/${id}.mp3`, src = `${DIR}/${k}.mp3`;
  if (!existsSync(wav) || !existsSync(src)) return null;
  const a = Math.max(0, c.t - AROUND), b = Math.min(durations[c.ch], Math.min(c.end, c.t + 15) + AROUND), gain = LEVEL - loudness(src) + c.gain;
  const fade = c.kind === 'ambience' ? `,afade=t=in:d=1.5,afade=t=out:st=${Math.max(0, b - a - (c.t - a) - 2).toFixed(2)}:d=2` : '';
  const loop = c.kind === 'ambience' ? ['-stream_loop', '-1'] : [];
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', a.toFixed(2), '-t', (b - a).toFixed(2), '-i', wav, ...loop, '-i', src, '-filter_complex',
    `[1:a]atrim=0:${(b - c.t).toFixed(2)},volume=${gain.toFixed(1)}dB${fade},adelay=${Math.round((c.t - a) * 1000)}:all=1[s];[0:a][s]amix=inputs=2:normalize=0:duration=first`,
    '-ac', '1', '-b:a', '96k', to]);
  return { file: `clips/${id}.mp3`, a, b };
}

// ---- the page ----
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const mmss = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const titles = Object.fromEntries(sheet.filter(c => c.when === 'chapter').map(c => [c.ch, c.why.split(': ').pop()]));
titles[0] = 'Cold open';
const items = [];   // one row per placed cue; a recurring one once, with two moments to hear it in
for (const [k, s] of sounds) {
  if (!existsSync(`${DIR}/${k}.mp3`)) continue;
  copyFileSync(`${DIR}/${k}.mp3`, `${OUT}/clips/${k}.mp3`);
  const len = seconds(`${DIR}/${k}.mp3`);
  const cues = s.cues[0].when ? s.cues.slice(0, 2) : s.cues;
  for (const c of cues) items.push({ c, k, len, recurring: !!c.when, count: s.cues.length, place: inPlace(c, k, `${c.id}-${c.ch}-${Math.round(c.t * 10)}`) });
}
const row = ({ c, k, len, recurring, count, place }) => `<div class="s${c.proposed ? ' new' : ''}" data-new="${c.proposed ? 1 : 0}">
<div><b>${esc(c.id)}</b> <span class="k ${c.kind}">${c.kind}</span>${c.proposed ? ' <span class="k prop">proposed</span>' : ''}
<span class="at">${recurring ? `${count} times in the film · e.g. ` : ''}ch ${c.ch} ${mmss(c.t)}</span></div>
<div class="why">${esc(recurring ? c.why.replace(/: [^:]*$/, '') : c.why)}</div>
<div class="p">asked for: “${esc(c.prompt)}”</div>
<button data-src="clips/${k}.mp3">▶ alone (${len.toFixed(1)} s)</button>${place ? `<button data-src="${place.file}">▶ in place, under the voice</button>` : ''}
<button class="note" data-ch="${c.ch}" data-t="${c.t.toFixed(2)}" data-id="${esc(c.id)}">✎ note</button></div>`;
const byCh = new Map(); for (const it of items.sort((x, y) => x.c.ch - y.c.ch || x.c.t - y.c.t)) (byCh.get(it.c.ch) || byCh.set(it.c.ch, []).get(it.c.ch)).push(it);
const nNew = items.filter(i => i.c.proposed).length;
writeFileSync(`${OUT}/index.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sounds, alone</title>
<style>body{font:17px/1.5 system-ui;max-width:900px;margin:2rem auto;padding:0 16px;background:#FBF8F0;color:#2B2233}
h2{margin-top:2rem}.s{margin:.9rem 0;padding:.6rem .8rem;background:#fff;border:1px solid #E6DCC6;border-radius:8px}
.s.new{border-color:#2F7D6D;background:#F1FAF6}.s b{font-size:1.1rem}.at{color:#6A6470;margin-left:.4em;font-size:.95rem}
.why{margin:.2rem 0}.p{color:#6A6470;font-size:.9rem;font-style:italic}.k{font:600 12px system-ui;padding:.1em .45em;border-radius:5px;background:#EEE6D6}
.k.music{background:#E4DAF3}.k.sting{background:#F6DDD6}.k.ambience{background:#DCE9F2}.k.prop{background:#2F7D6D;color:#fff}
button{font:14px system-ui;margin:.35rem .3rem 0 0;padding:.3em .6em;border:1px solid #CFC4AE;border-radius:6px;background:#F6F1E6;cursor:pointer}
button.playing{background:#FFE7A8}button.note{background:none;border-style:dashed}label{font-size:.95rem}</style></head><body>
<h1>The film's sounds</h1>
<p>Every sound in the film, a chapter at a time. <b>Alone</b> plays the sound by itself; <b>in place</b> plays that moment of
the film's voice with the sound under it, at the level it will have. The green ones, marked <b>proposed</b>, are new
suggestions (${nNew}): keep, change or cut them. <b>✎ note</b> adds a note to that chapter's review list, at that moment.</p>
<p>The sounds are ElevenLabs' first try at each description (the "asked for" line). A sound that's wrong can be asked for
again, or described differently, in <code>script/sfx.yaml</code>.</p>
<label><input type="checkbox" id="only"> show only the proposed ones</label>
${[...byCh].map(([ch, its]) => `<h2>${ch}. ${esc(titles[ch] || '')}</h2>\n${its.map(row).join('\n')}`).join('\n')}
<audio id="a"></audio>
<script>
const a = document.getElementById('a'); let cur = null;
document.querySelectorAll('button[data-src]').forEach(b => b.onclick = () => {
  if (cur === b && !a.paused) { a.pause(); return; }
  document.querySelectorAll('.playing').forEach(x => x.classList.remove('playing'));
  a.src = b.dataset.src; a.play(); cur = b; b.classList.add('playing');
});
a.onended = a.onpause = () => cur && cur.classList.remove('playing');
document.getElementById('only').onchange = e => document.querySelectorAll('.s').forEach(s => s.style.display = e.target.checked && s.dataset.new !== '1' ? 'none' : '');
document.querySelectorAll('button.note').forEach(b => b.onclick = async () => {
  const text = prompt('A note on the sound "' + b.dataset.id + '":'); if (!text || !text.trim()) return;
  const r = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ch: +b.dataset.ch, note: { t: +b.dataset.t, text: '[sound: ' + b.dataset.id + '] ' + text.trim() } }) });
  b.textContent = r.ok ? '✎ noted' : '✎ couldn\\'t save (is npm run serve running?)';
});
</script></body></html>
`);
console.log(`${items.length} rows (${nNew} proposed) → ${OUT}/index.html; http://localhost:8077/sounds/ (npm run serve)`);
