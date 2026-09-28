// sfx_check.mjs: checks script/sfx.yaml, the film's sound-effect cues, against the chapters' timing (src/gen/chNN.js)
// and writes the cue sheet, script/sfx_report.md: every cue by chapter and time, the recurring ones (a paper flick per
// code, a rustle per search beat) included.
//
//   node tools/sfx_check.mjs      (npm run sfx)
//
// Fails when a cue's line or phrase isn't found, an id repeats, a field is unknown or missing, or a cue falls outside
// its chapter. Warns when two stings land within 1.5 s of each other.
import { readFileSync, writeFileSync } from 'node:fs';
import YAML from 'yaml';
import { loadRefs, resolveAnchor, pad, sayAt } from './script_lib.mjs';

const FILE = 'script/sfx.yaml', { every = [], cues = [] } = YAML.parse(readFileSync(FILE, 'utf8'));
const KINDS = new Set(['sting', 'effect', 'ambience']), FIELDS = new Set(['id', 'ch', 'at', 'until', 'len', 'kind', 'gain', 'prompt', 'why', 'when']);
const chapters = Array.from({ length: 17 }, (_, n) => JSON.parse(readFileSync(`src/gen/ch${pad(n)}.js`, 'utf8').replace(/^[^{]*/, '').replace(/;\s*$/, '')));
const errors = [], warn = [];

function timeOf(ch, [id, ...rest], who) {
  const l = chapters[ch].lines.find(l => l.id === id); if (!l) throw new Error(`${who}: no line ${id} in chapter ${ch}`);
  const after = typeof rest.at(-1) === 'number' ? rest.pop() : 0, phrase = rest[0];
  if (phrase == null) return l.t0 + after;
  if (typeof phrase !== 'string') throw new Error(`${who}: the phrase ${phrase} in ${id} must be quoted text`);
  if (phrase === '@end') return l.t1 + after;
  for (const s of [l.speech, l.text]) { const i = (s || '').toLowerCase().indexOf(phrase.toLowerCase()); if (i >= 0) return sayAt(l, s, i) + after; }
  throw new Error(`${who}: "${phrase}" isn't in ${id}`);
}

const ids = new Set(), sheet = [];
for (const c of [...every, ...cues]) {
  try {
    if (ids.has(c.id)) throw new Error(`${c.id} is used twice`); ids.add(c.id);
    for (const k of Object.keys(c)) if (!FIELDS.has(k)) throw new Error(`${c.id}: unknown field ${k}`);
    for (const k of ['kind', 'gain', 'prompt', 'why']) if (c[k] == null) throw new Error(`${c.id}: no ${k}`);
    if (!KINDS.has(c.kind)) throw new Error(`${c.id}: kind ${c.kind} isn't one of ${[...KINDS].join(', ')}`);
    if (c.when) continue;
    if (!Number.isInteger(c.ch) || !Array.isArray(c.at)) throw new Error(`${c.id}: needs ch and at`);
    if ((c.until == null) === (c.len == null)) throw new Error(`${c.id}: give until or len, one of them`);
    const t = timeOf(c.ch, c.at, c.id), end = c.until ? timeOf(c.ch, c.until, c.id) : t + c.len, dur = chapters[c.ch].duration;
    if (t < 0 || end > dur + .5 || end <= t) throw new Error(`${c.id}: ${t.toFixed(1)}–${end.toFixed(1)} s is outside chapter ${c.ch} (0–${dur.toFixed(1)} s)`);
    sheet.push({ ...c, t, end });
  } catch (e) { errors.push(e.message); }
}

// the recurring cues: a flick for each code the film shows, a rustle for each search beat
const lines = chapters.flatMap(c => c.lines.map(l => ({ ...l, ch: c.n })));
for (const e of every) {
  if (e.when === 'qr') for (const r of loadRefs().filter(r => r.mode && r.mode !== 'page')) {
    const l = resolveAnchor(r, lines); if (!l) continue;
    let t = l.t0; try { if (r.cue) t = timeOf(l.ch, [l.id, r.cue], r.id); } catch {}
    sheet.push({ ...e, ch: l.ch, t, end: t + e.len, why: `${e.why}: ${r.id}` });
  } else if (e.when === 'tool') for (const l of lines.filter(l => l.kind === 'tool')) sheet.push({ ...e, ch: l.ch, t: l.t0, end: l.t0 + e.len, why: `${e.why}: ${l.id}` });
  else errors.push(`${e.id}: when must be qr or tool`);
}

sheet.sort((a, b) => a.ch - b.ch || a.t - b.t);
const stings = sheet.filter(c => c.kind === 'sting');
stings.forEach((c, i) => { const n = stings[i + 1]; if (n && n.ch === c.ch && n.t - c.t < 1.5) warn.push(`${c.id} and ${n.id} land ${(n.t - c.t).toFixed(1)} s apart in chapter ${c.ch}`); });

const mmss = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
const out = ['# Sound-effect cues', '', `Written by tools/sfx_check.mjs from ${FILE}. Times are from each chapter's current timing. ${cues.length} placed cues, plus a paper flick for each code and a rustle for each search beat.`, ''];
for (const ch of chapters) {
  const mine = sheet.filter(c => c.ch === ch.n); if (!mine.length) continue;
  out.push(`## ${ch.n}. ${ch.title}`, '', '| at | cue | kind | dB | for |', '|---|---|---|---|---|');
  for (const c of mine) out.push(`| ${mmss(c.t)}${c.kind === 'ambience' ? `–${mmss(c.end)}` : ''} | ${c.when ? c.id : `**${c.id}**`} | ${c.kind} | ${c.gain} | ${c.why.replace(/\|/g, '\\|')} |`);
  out.push('');
}
writeFileSync('script/sfx_report.md', out.join('\n'));
for (const w of warn) console.warn('warning: ' + w);
if (errors.length) { for (const e of errors) console.error(e); process.exit(1); }
console.log(`${FILE}: ${cues.length} cues and ${every.length} recurring (${sheet.length} in all) → script/sfx_report.md`);
