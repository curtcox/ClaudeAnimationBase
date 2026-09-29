// sfx.mjs: the film's sounds (script/sfx.yaml): made by ElevenLabs, mixed under the voice, measured, and a page to hear them.
//   node tools/sfx.mjs         (npm run sounds) makes any sound not made yet, mixes every chapter, checks the levels,
//                              writes the listening page
//   node tools/sfx.mjs --dry   lists what would be made, and nothing else
// Each sound is made once and kept in assets/sfx/<hash>.mp3 (committed, like the voices), keyed by its prompt, length and
// kind, so a changed prompt makes a new one and a re-run costs nothing. A recurring cue (a flick per code) is one sound.
// Effects, stings and ambience come from the sound-effects endpoint (ambience as a 20 s loop, looped for as long as it
// runs, its ends crossfaded); music from the music endpoint. One that comes back nearly silent is asked for again.
//
// The mix: audio/chNN_full.wav, the chapter's voice (audio/chNN.wav) with its sounds, which render.mjs encodes with. Each
// sound starts where it's heard (its leading silence trimmed, so it lands on its word), at its gain: dB against the
// voice, which the voice tools mix at LEVEL LUFS. The same sound twice at one moment (three codes arriving together)
// plays once. Ambience fades in and out.
// The levels: script/sfx_levels.md, every cue as mixed, against the voice at that moment, loudest 0.4 s against loudest
// 0.4 s. It flags a sound that competes with the words (within 3 dB of speech under it; 12 for a bed under speech), one
// likely lost (over 20 dB under the voice, where speech masks it; 26 for a bed), and any stretch of the mix that would clip.
// The page, out/sounds/ (http://localhost:8077/sounds/): each sound alone, and in place (the finished mix at that moment).
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { eleven } from './eleven.mjs';
import { sheet, errors } from './sfx_check.mjs';
import { pad } from './script_lib.mjs';

if (errors.length) { for (const e of errors) console.error(e); process.exit(1); }
const DIR = 'assets/sfx', OUT = 'out/sounds', LEVEL = -18, LOOP = 20, AROUND = 2.5, SR = 44100;
mkdirSync(DIR, { recursive: true }); mkdirSync(`${OUT}/clips`, { recursive: true });

// ---- the sounds ----
const specOf = c => {
  const loop = c.kind === 'ambience', len = loop ? LOOP : Math.min(c.kind === 'music' ? 120 : 30, Math.max(.5, c.len ?? c.end - c.t));
  return { prompt: c.prompt, kind: c.kind, len: +len.toFixed(2), loop };
};
const keyOf = s => createHash('sha256').update(JSON.stringify(s)).digest('hex').slice(0, 16);
const sounds = new Map();   // key → { spec, cues: [placed cues] }
for (const c of sheet) { const spec = specOf(c), k = keyOf(spec); c.key = k; (sounds.get(k) || sounds.set(k, { spec, cues: [] }).get(k)).cues.push(c); }
const todo = [...sounds].filter(([k]) => !existsSync(`${DIR}/${k}.mp3`));
console.log(`${sheet.length} cues, ${sounds.size} sounds; ${todo.length} to make (${todo.reduce((a, [, s]) => a + s.spec.len, 0).toFixed(0)} s)`);
if (process.argv.includes('--dry')) { for (const [, s] of todo) console.log(`  ${s.cues[0].id}: ${s.spec.kind}, ${s.spec.len} s`); process.exit(0); }

const FAINT = -30;   // dBFS: a sound peaking under this is mostly hiss once brought up to its level
function peakOf(buf) {
  const x = execFileSync('ffmpeg', ['-v', 'error', '-i', 'pipe:0', '-f', 'f32le', '-ac', '1', '-'], { input: buf, maxBuffer: 1 << 30 });
  let p = 0; for (let i = 0; i < x.length; i += 4) p = Math.max(p, Math.abs(x.readFloatLE(i)));
  return 20 * Math.log10(Math.max(p, 1e-9));
}
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
      // a sound that came back nearly silent (it happens) is asked for again, up to twice, keeping the loudest
      let b = await make(s.spec), p = peakOf(b);
      for (let n = 0; n < 2 && p < FAINT; n++) { const b2 = await make(s.spec), p2 = peakOf(b2); if (p2 > p) [b, p] = [b2, p2]; }
      if (p < FAINT) console.log(`  ${s.cues[0].id} is faint (peak ${p.toFixed(1)} dBFS) after three tries: describe it differently`);
      writeFileSync(`${DIR}/${k}.mp3`, b); writeFileSync(`${DIR}/${k}.json`, JSON.stringify({ ...s.spec, for: s.cues[0].id }) + '\n');
      if (++done % 10 === 0 || done === todo.length) console.log(`  made ${done}/${todo.length}`);
    } catch (e) { if (/quota|no ElevenLabs key|401|402/.test(e.message)) stop = e.message; else console.log(`  couldn't make ${s.cues[0].id}: ${e.message.slice(0, 160)}`); }
  }
}));
if (stop) console.log(`stopped early: ${stop.slice(0, 200)}`);

// ---- loudness: BS.1770's K-weighted measure (what LUFS is), for the voice and the sounds alike ----
const decode = f => { const b = execFileSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', String(SR), '-'], { maxBuffer: 1 << 30 }); return new Float32Array(b.buffer, b.byteOffset, b.length / 4); };
const db = x => 20 * Math.log10(Math.max(x, 1e-9));
function biquad(x, [b0, b1, b2, a0, a1, a2]) {
  const y = new Float32Array(x.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) { const v = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0; x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v; }
  return y;
}
const W0 = f => 2 * Math.PI * f / SR;
const SHELF = (() => { const A = 10 ** (4 / 40), w = W0(1500), c = Math.cos(w), al = Math.sin(w) / (2 / Math.SQRT2 * 1), r = 2 * Math.sqrt(A) * al;
  return [A * ((A + 1) + (A - 1) * c + r), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - r), (A + 1) - (A - 1) * c + r, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - r]; })();
const HIPASS = (() => { const w = W0(38), c = Math.cos(w), al = Math.sin(w) / (2 * .5); return [(1 + c) / 2, -(1 + c), (1 + c) / 2, 1 + al, -2 * c, 1 - al]; })();
const kweigh = x => biquad(biquad(x, SHELF), HIPASS);
// momentary loudness (LUFS over 0.4 s), every 0.1 s, of K-weighted samples; a stretch shorter than 0.4 s counts as padded with silence
const MW = Math.round(.4 * SR), MH = Math.round(.1 * SR);
function momentary(k, a = 0, b = k.length) {
  const out = []; for (let s = a; s < Math.max(a + 1, b - MW + MH); s += MH) { let e = 0; for (let i = s; i < Math.min(b, s + MW); i++) e += k[i] * k[i]; out.push(-.691 + 10 * Math.log10(Math.max(e / MW, 1e-12))); }
  return out;
}
// integrated loudness (gated, as BS.1770): the level of a sustained sound, and of the voice
function integrated(M) {
  const p = v => 10 ** ((v + .691) / 10), l = v => -.691 + 10 * Math.log10(v);
  const abs = M.filter(v => v > -70); if (!abs.length) return -70;
  const rel = l(abs.reduce((a, v) => a + p(v), 0) / abs.length) - 10, g = abs.filter(v => v > rel);
  return l(g.reduce((a, v) => a + p(v), 0) / g.length);
}
const pct = (xs, q) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };

// ---- each sound as samples: mono, its leading silence trimmed, and how loud it is ----
// A one-shot (an effect, a sting, a phrase of music under 6 s) is levelled by its loudest moment, against the voice's
// loudest; a sustained one (ambience, longer music) by its integrated loudness, against the voice's.
const sustained = c => c.kind === 'ambience' || c.kind === 'music' && (c.len ?? 0) >= 6;
const PCM = new Map();
function soundOf(k) {
  if (PCM.has(k)) return PCM.get(k);
  const f = `${DIR}/${k}.mp3`; if (!existsSync(f)) return null;
  let x = decode(f), peak = 0; for (const v of x) peak = Math.max(peak, Math.abs(v));
  // where it starts: the first 10 ms block within 30 dB of its loudest, less 10 ms
  const B = SR / 100, blocks = []; for (let s = 0; s + B <= x.length; s += B) { let e = 0; for (let i = s; i < s + B; i++) e += x[i] * x[i]; blocks.push(Math.sqrt(e / B)); }
  const top = Math.max(...blocks), first = blocks.findIndex(r => db(r) > db(top) - 30), lead = Math.max(0, first - 1) * B;
  if (sounds.get(k).spec.kind !== 'ambience') x = x.slice(lead);
  else {   // a loop: its last second crossfaded into its first, so it wraps round without a click or a bump
    const F = Math.min(SR, x.length >> 2), N = x.length - F, y = x.slice(0, N);
    for (let j = 0; j < F; j++) { const u = j / F * Math.PI / 2; y[j] = x[j] * Math.sin(u) + x[N + j] * Math.cos(u); }
    x = y;
  }
  const M = momentary(kweigh(x));
  const s = { x, max: Math.max(...M), int: integrated(M), lead: lead / SR, peak: db(peak), len: x.length / SR };
  PCM.set(k, s); return s;
}

// ---- the mix, a chapter at a time ----
const wavIn = f => { const b = readFileSync(f), n = (b.length - 44) >> 1, x = new Float32Array(n); for (let i = 0; i < n; i++) x[i] = b.readInt16LE(44 + i * 2) / 32768; return x; };
function wavOut(f, x) {
  const n = x.length, buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(x[i] * 32767))), 44 + i * 2);
  if (!existsSync(f) || !readFileSync(f).equals(buf)) { writeFileSync(f, buf); return true; }
  return false;
}
// a look-ahead peak limiter: nothing over CEIL (−1 dBFS), each peak eased into over 5 ms and let go over 80 ms
const CEIL = 10 ** (-1 / 20);
function limit(x) {
  const n = x.length, L = Math.round(.005 * SR), rel = 1 - Math.exp(-1 / (.08 * SR)), want = new Float32Array(n);
  for (let i = 0; i < n; i++) want[i] = Math.min(1, CEIL / Math.max(Math.abs(x[i]), 1e-9));
  const q = [], lo = new Float32Array(n);   // the lowest wanted gain within L samples either side (a sliding minimum)
  for (let i = 0; i < n + L; i++) {
    if (i < n) { while (q.length && want[q.at(-1)] >= want[i]) q.pop(); q.push(i); }
    while (q.length && q[0] < i - 2 * L) q.shift();
    if (i - L >= 0 && i - L < n) lo[i - L] = want[q[0]];
  }
  let g = 1, busy = 0;
  for (let i = 0; i < n; i++) { g = lo[i] < g ? lo[i] : g + (lo[i] - g) * rel; if (g < .999) busy++; x[i] *= g; }
  return busy / SR;
}
const rows = [], clipped = [], placed = new Map(), chapterLevels = [];
for (let ch = 0; ch <= 16; ch++) {
  const wav = `audio/ch${pad(ch)}.wav`; if (!existsSync(wav)) { console.log(`no ${wav}: chapter ${ch} not mixed`); continue; }
  const voice = wavIn(wav), mix = Float32Array.from(voice), n = voice.length, kv = kweigh(voice);
  const VM = momentary(kv), speechM = VM.filter(v => v > -40), VPEAK = pct(speechM, .9), VINT = integrated(VM);   // the voice: its loud moments, and overall
  const cues = sheet.filter(c => c.ch === ch).sort((a, b) => a.t - b.t);
  const kept = cues.filter((c, i) => !cues.slice(0, i).some(p => p.key === c.key && c.t - p.t < .25));   // one sound, one moment: once
  for (const c of kept) {
    const s = soundOf(c.key); if (!s) continue;
    const long = sustained(c), g = 10 ** (((long ? VINT : VPEAK) + c.gain - (long ? s.int : s.max)) / 20), a = Math.round(c.t * SR);
    const b = Math.min(n, c.kind === 'ambience' ? Math.round(c.end * SR) : a + s.x.length), part = new Float32Array(Math.max(0, b - a));
    if (c.kind === 'ambience') { const fi = 1.5 * SR, fo = 2 * SR; for (let j = 0; j < part.length; j++) part[j] = s.x[j % s.x.length] * g * Math.min(1, j / fi, (part.length - j) / fo); }
    else for (let j = 0; j < part.length; j++) part[j] = s.x[j] * g;
    for (let j = 0; j < part.length; j++) mix[a + j] += part[j];
    // how it sits against the voice at that moment: a one-shot's loudest moment against the voice's loudest there; a
    // bed's typical level against the voice's typical level while it runs
    const SM = momentary(kweigh(part)), VW = momentary(kv, a, b).filter(v => v > -30), speech = VW.length > 0;
    const S = long ? pct(SM.filter(v => v > -70), .5) : Math.max(...SM), V = speech ? (long ? pct(VW, .5) : Math.max(...VW)) : null;
    const rel = speech ? S - V : S - VPEAK;   // in a pause: against the chapter's speech
    const [hi, lo] = c.kind === 'ambience' ? [-12, -26] : long ? [-6, -24] : [-3, -20];
    const flag = speech && rel > hi ? 'competes with the words' : rel < lo ? 'likely lost' : !speech && rel > 0 ? 'louder than the speech' : '';
    rows.push({ c, S, V, speech, rel, flag, lead: s.lead });
    placed.set(c, true);
  }
  let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(mix[i]));
  const busy = limit(mix); let after = 0; for (let i = 0; i < n; i++) after = Math.max(after, Math.abs(mix[i]));
  const full = integrated(momentary(kweigh(mix)));
  chapterLevels.push({ ch, voice: VINT, full, peak: db(peak), after: db(after), busy });
  const changed = wavOut(`audio/ch${pad(ch)}_full.wav`, mix);
  console.log(`audio/ch${pad(ch)}_full.wav  ${kept.length} sounds; ${full.toFixed(1)} LUFS (voice alone ${VINT.toFixed(1)}); peak ${db(peak).toFixed(1)} → ${db(after).toFixed(1)} dBFS, limited ${busy.toFixed(2)} s${changed ? '' : ' (unchanged)'}`);
}

// ---- the level report ----
const mmss = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
const f1 = v => (v >= 0 ? '+' : '') + v.toFixed(1);
const flagged = rows.filter(r => r.flag);
writeFileSync('script/sfx_levels.md', `# Sound levels, as mixed

Written by tools/sfx.mjs. Every sound in the film's mix (audio/chNN_full.wav) against the voice at the same moment, in
LUFS (K-weighted, as broadcast loudness is measured). A one-shot (an effect, a sting, a short phrase of music) is its
loudest 0.4 s against the voice's loudest 0.4 s while it sounds; a bed (ambience, longer music) is its typical level
against the voice's typical level while it runs. In a pause, it's against the chapter's speech.

What's right: a one-shot under speech sits 3 to 20 dB below it (stings about 4, effects 8–12, the code flick 16); more
than 20 down, the words mask it and it isn't heard. A bed 12 to 26 dB below; nothing in a pause louder than the speech. Flagged: **${flagged.length}**.

## Chapters

| ch | voice alone | with the sounds | peak before the limiter | after | limiter working |
|---|---|---|---|---|---|
${chapterLevels.map(l => `| ${l.ch} | ${l.voice.toFixed(1)} LUFS | ${l.full.toFixed(1)} LUFS | ${l.peak.toFixed(1)} dBFS | ${l.after.toFixed(1)} dBFS | ${l.busy.toFixed(2)} s |`).join('\n')}

## Sounds

| ch | at | cue | kind | gain | sound | voice | vs voice | note |
|---|---|---|---|---|---|---|---|---|
${rows.map(r => `| ${r.c.ch} | ${mmss(r.c.t)} | ${r.c.id} | ${r.c.kind} | ${r.c.gain} | ${r.S.toFixed(1)} | ${r.speech ? r.V.toFixed(1) : '(pause)'} | ${f1(r.rel)} | ${r.flag}${r.lead > .15 ? `${r.flag ? '; ' : ''}${r.lead.toFixed(2)} s of silence trimmed` : ''} |`).join('\n')}
`);
console.log(`levels: ${rows.length} placed, ${flagged.length} flagged → script/sfx_levels.md`);
for (const r of flagged) console.log(`  ch ${r.c.ch} ${mmss(r.c.t)} ${r.c.id} (${r.c.kind}, gain ${r.c.gain}): ${r.flag}, ${f1(r.rel)} dB`);

// ---- the page ----
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const mmss0 = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const durations = Object.fromEntries(Array.from({ length: 17 }, (_, n) => [n, JSON.parse(readFileSync(`src/gen/ch${pad(n)}.js`, 'utf8').replace(/^[^{]*/, '').replace(/;\s*$/, '')).duration]));
const titles = Object.fromEntries(sheet.filter(c => c.when === 'chapter').map(c => [c.ch, c.why.split(': ').pop()])); titles[0] = 'Cold open';
function inPlace(c, id) {
  const full = `audio/ch${pad(c.ch)}_full.wav`, to = `${OUT}/clips/${id}.mp3`; if (!existsSync(full)) return null;
  const a = Math.max(0, c.t - AROUND), b = Math.min(durations[c.ch], Math.min(c.end, c.t + 15) + AROUND);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', a.toFixed(2), '-t', (b - a).toFixed(2), '-i', full, '-b:a', '96k', to]);
  return `clips/${id}.mp3`;
}
const items = [];   // a row per placed cue; a recurring one once, with two moments to hear it in
for (const [k, s] of sounds) {
  if (!existsSync(`${DIR}/${k}.mp3`)) continue;
  copyFileSync(`${DIR}/${k}.mp3`, `${OUT}/clips/${k}.mp3`);
  const cues = s.cues[0].when ? s.cues.filter(c => placed.has(c)).slice(0, 2) : s.cues;
  for (const c of cues) items.push({ c, k, len: soundOf(k).len, recurring: !!c.when, count: s.cues.length, place: inPlace(c, `${c.id}-${c.ch}-${Math.round(c.t * 10)}`), lv: rows.find(r => r.c === c) });
}
const row = ({ c, k, len, recurring, count, place, lv }) => `<div class="s">
<div><b>${esc(c.id)}</b> <span class="k ${c.kind}">${c.kind}</span>
<span class="at">${recurring ? `${count} times in the film · e.g. ` : ''}ch ${c.ch} ${mmss0(c.t)}${lv ? ` · ${lv.speech ? `${f1(lv.rel)} dB against the voice` : 'in a pause'}` : ''}</span></div>
<div class="why">${esc(recurring ? c.why.replace(/: [^:]*$/, '') : c.why)}</div>
<div class="p">asked for: “${esc(c.prompt)}”</div>
<button data-src="clips/${k}.mp3">▶ alone (${len.toFixed(1)} s)</button>${place ? `<button data-src="${place}">▶ in place, in the mix</button>` : ''}
<button class="note" data-ch="${c.ch}" data-t="${c.t.toFixed(2)}" data-id="${esc(c.id)}">✎ note</button></div>`;
const byCh = new Map(); for (const it of items.sort((x, y) => x.c.ch - y.c.ch || x.c.t - y.c.t)) (byCh.get(it.c.ch) || byCh.set(it.c.ch, []).get(it.c.ch)).push(it);
writeFileSync(`${OUT}/index.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sounds, alone</title>
<style>body{font:17px/1.5 system-ui;max-width:900px;margin:2rem auto;padding:0 16px;background:#FBF8F0;color:#2B2233}
h2{margin-top:2rem}.s{margin:.9rem 0;padding:.6rem .8rem;background:#fff;border:1px solid #E6DCC6;border-radius:8px}
.s b{font-size:1.1rem}.at{color:#6A6470;margin-left:.4em;font-size:.95rem}
.why{margin:.2rem 0}.p{color:#6A6470;font-size:.9rem;font-style:italic}.k{font:600 12px system-ui;padding:.1em .45em;border-radius:5px;background:#EEE6D6}
.k.music{background:#E4DAF3}.k.sting{background:#F6DDD6}.k.ambience{background:#DCE9F2}
button{font:14px system-ui;margin:.35rem .3rem 0 0;padding:.3em .6em;border:1px solid #CFC4AE;border-radius:6px;background:#F6F1E6;cursor:pointer}
button.playing{background:#FFE7A8}button.note{background:none;border-style:dashed}</style></head><body>
<h1>The film's sounds</h1>
<p>Every sound in the film, a chapter at a time. <b>Alone</b> plays the sound by itself; <b>in place</b> plays that moment
of the finished mix, voice and sounds together, as the film has it. <b>✎ note</b> adds a note to that chapter's review
list, at that moment.</p>
<p>The sounds are ElevenLabs' first try at each description (the "asked for" line). A sound that's wrong can be asked for
again, or described differently, in <code>script/sfx.yaml</code>; its level is its <code>gain</code> there.</p>
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
document.querySelectorAll('button.note').forEach(b => b.onclick = async () => {
  const text = prompt('A note on the sound "' + b.dataset.id + '":'); if (!text || !text.trim()) return;
  const r = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ch: +b.dataset.ch, note: { t: +b.dataset.t, text: '[sound: ' + b.dataset.id + '] ' + text.trim() } }) });
  b.textContent = r.ok ? '✎ noted' : '✎ couldn\\'t save (is npm run serve running?)';
});
</script></body></html>
`);
console.log(`${items.length} rows → ${OUT}/index.html; http://localhost:8077/sounds/ (npm run serve)`);
