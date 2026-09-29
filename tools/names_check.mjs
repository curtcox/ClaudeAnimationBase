// names_check.mjs: how the voices actually say the film's names. Every name in a spoken line (a run of capitalised words
// that isn't just a sentence's first word, or an acronym) is found in its voiced clip by ElevenLabs' character timings,
// and ElevenLabs' speech-to-text (Scribe) says what it hears there. A name heard as something else is worth a listen.
//   node tools/names_check.mjs        writes script/names_report.md and the listening page, site/public/names/
//   node tools/names_check.mjs --dry  just lists the names it finds
// Each clip is transcribed once (assets/vo/<clip>.stt.json, committed, so a re-run costs nothing until a line changes).
// Speech-to-text is a second opinion, not an ear: it knows spellings, so a respelled name heard as its written form is
// a good sign, and a common name heard right can still carry the wrong stress. The page plays each one, to check.
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { eleven } from './eleven.mjs';
import { clipBase } from './voice_lib.mjs';
import { PATHS, readYaml, pad, pageLines, compileRespellings, autoSpeech, loadTypos, meant } from './script_lib.mjs';

const cast = readYaml('script/voices.yaml'), chapters = readYaml(PATHS.chapters), script = readYaml(PATHS.script);
const respellings = compileRespellings(readYaml(PATHS.pronounce)), typos = loadTypos(script.lines);
const lines = [...script.lines, ...chapters.flatMap(pageLines)].filter(l => l.spoken);
const timeline = {}; for (const c of chapters) { const g = {}; new Function('window', readFileSync(`src/gen/ch${pad(c.n)}.js`, 'utf8'))(g); for (const l of g.CHAPTER.lines) timeline[l.id] = { ch: c.n, t0: l.t0 }; }

// ---- the names in a line ----
// Words that open sentences, and other capitalised words that aren't names, are skipped unless they turn up mid-sentence
// as part of a longer name. Months and weekdays are left out: the voices say them fine.
const COMMON = new Set(`I I'm I've I'd I'll OK Ok Yes No Oh So But And Or If The A An It Its It's That This These Those There Then
When What Why How Who Where Which While Is Are Was Were Be Do Does Did You Your You're We Our Us He She They My Me Not Also
Maybe Perhaps Still Yet Even Just Only Both Each Every Some Any One Two Three Four Five Six Seven Eight Nine Ten First Second
Third Here Now Well Sure Thanks Thank Go Tell Give Put Use Let Look See Agree Up Down In On At To For Of From With By As
Hold Uh Ever Because Besides Impossible Then We've Don't Can't Doesn't Isn't Wasn't Won't Would Could Should Might Must
Please Great Good Right True False Honestly Really Very Most More Less Many Much Few Other Another Same Such Like Than
January February March April May June July August September October November December Monday Tuesday Wednesday
Thursday Friday Saturday Sunday Nothing Someone Humans Human Internet Adversaries Fair Nope Agreed Add Threat Anticipated
Commitment Stability Concepts Drift Evaluations Credit Black American English German Chinese Dead Aliens Speaker That's
Probing Checking Servitude Claiming Shall Self-report Raising You'll Keeping Denying Noted Propose Interpretability Tempo
Self-model Everyone Scoring Largely Fluency Remembered Sources Spotting Newer Weather Complexity Scaling Loss Deduction
Uncomputability Smart Although Net Opinions Yeah You'd Here's Rationality Hours`.split(/\s+/));
// every word the script uses in lower case: a capitalised one of these opening a sentence is just a sentence's start
const LOWER = new Set(lines.flatMap(l => l.text.match(/(?<![\p{L}])\p{Ll}[\p{L}'’]*/gu) || []));
function namesIn(text) {
  const out = [], re = /[\p{L}\d][\p{L}\d'’.\-]*/gu;
  const toks = []; let m;
  while ((m = re.exec(text))) toks.push({ w: m[0].replace(/[.'’\-]+$/, ''), raw: m[0], i: m.index, start: /(^|[.!?:;"“(]\s*)$/.test(text.slice(0, m.index)) });
  // the next word continues this name only across a space or a dash, and across a full stop only after an abbreviation
  const joins = k => { const a = toks[k], gap = text.slice(a.i + a.raw.length, toks[k + 1].i); return /^(\s+|[–-])$/.test(gap) && (!a.raw.endsWith('.') || a.w.length <= 3) || gap === '' && a.raw.endsWith('.') && a.w.length <= 3; };
  const cap = w => /^\p{Lu}/u.test(w) && !COMMON.has(w) && !COMMON.has(w[0] + w.slice(1).toLowerCase());
  for (let k = 0; k < toks.length; k++) {
    const t = toks[k];
    if (!cap(t.w) || t.w.length < 2) continue;
    // extend over following capitalised words (and a few joiners inside names)
    let e = k; while (e + 1 < toks.length && joins(e) && (cap(toks[e + 1].w) || /^(y|de|von|van|of|the)$/.test(toks[e + 1].w) && e + 2 < toks.length && joins(e + 1) && cap(toks[e + 2].w))) e++;
    let s = k; while (s <= e && COMMON.has(toks[s].w)) s++;
    if (s > e) { k = e; continue; }
    const name = text.slice(toks[s].i, toks[e].i + toks[e].w.length);
    if (!(s === e && toks[s].start && LOWER.has(toks[s].w.toLowerCase()))) out.push({ name, at: toks[s].i });   // a sentence's first word, if it's an ordinary word
    k = e;
  }
  return out;
}
function plainOf(l) { return l.kind === 'balloon' ? l.text : autoSpeech(meant(l.text, typos[l.id]), []).speech; }
const namesOfLine = l => namesIn(plainOf(l));

// ---- speech-to-text, once per clip ----
async function heardOf(base) {
  const f = base + '.stt.json';
  if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8'));
  const fd = new FormData();
  fd.append('model_id', 'scribe_v1'); fd.append('timestamps_granularity', 'word'); fd.append('tag_audio_events', 'false'); fd.append('language_code', 'en');
  fd.append('file', new Blob([readFileSync(base + '.mp3')]), 'clip.mp3');
  const r = await eleven('speech-to-text', { method: 'POST', body: fd });
  const words = r.words.filter(w => w.type === 'word').map(w => [w.text, +w.start.toFixed(2), +w.end.toFixed(2)]);
  writeFileSync(f, JSON.stringify({ text: r.text, words }) + '\n');
  return { text: r.text, words };
}

// letters only, without accents, case, a possessive or a plural's s: "Solaris's", "Solaris'" and "solaris" are one
const norm = s => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/['’]s?\b/g, '').split(/[^a-z0-9]+/).map(w => w.replace(/(?<=..)s$/, '')).join('');
// spellings of the same sound that speech-to-text may choose (not mispronunciations)
const SOUNDS_LIKE = [['curt', 'kurt'], ['pear', 'pair'], ['hart', 'heart'], ['sol', 'sole'], ['lt', 'lieutenant']];
const alike = (a, b) => { if (a === b) return true; for (const [x, y] of SOUNDS_LIKE) if (a.replaceAll(y, x) === b.replaceAll(y, x)) return true; return false; };
function lev(a, b) { const d = Array.from({ length: b.length + 1 }, (_, j) => j); for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const q = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = q; } } return d[b.length]; }
// the run of heard words that best fits the name: the name itself if it's there, else the nearest spelling
function closest(name, words, said = name) {
  const want = norm(name), alt = norm(said); let best = { heard: '', same: false, d: Infinity };
  for (let i = 0; i < words.length; i++) for (let j = i + 1; j <= Math.min(words.length, i + 6); j++) {
    const txt = words.slice(i, j).join(' ').replace(/^["“(]+|[.,!?;:"”)]+$/g, ''), got = norm(txt);
    if (alike(want, got) || alike(alt, got) || want.length <= 4 && got.length > want.length && got.startsWith(want) && /\.$|^\w+$/.test(name)) return { heard: txt, same: true };   // as written, or as respelled for the voice
    if (j === i + 1 && /[-/–]/.test(txt) && got.includes(want)) return { heard: txt, same: true };   // one of a pair said as one (Newport/Doctorow)
    const d = lev(want, got); if (d < best.d) best = { heard: txt, same: false, d };
  }
  return best.d > .6 * want.length ? { heard: '', same: false } : best;   // nothing near it: not said, or lost
}
const found = [], todo = [];
for (const l of lines) {
  const ns = namesOfLine(l); if (!ns.length) continue;
  const base = clipBase(l, cast);
  if (!existsSync(base + '.mp3') || !existsSync(base + '.json')) continue;   // not voiced yet
  todo.push({ l, ns, base });
}
console.log(`${todo.length} voiced lines carry names; transcribing any not done yet`);
if (process.argv.includes('--dry')) { const all = new Map(); for (const j of todo) for (const n of j.ns) all.set(n.name, (all.get(n.name) || 0) + 1); console.log([...all].map(([n, k]) => `${n}${k > 1 ? ' ×' + k : ''}`).join(' | ')); process.exit(0); }
let next = 0, done = 0;
await Promise.all([0, 1, 2].map(async () => { while (next < todo.length) { const j = todo[next++]; j.stt = await heardOf(j.base); if (++done % 25 === 0) console.log(`  ${done}/${todo.length}`); } }));

for (const { l, ns, base, stt } of todo) {
  const side = JSON.parse(readFileSync(base + '.json', 'utf8')), A = side.alignment, C = A.characters.join('');
  let cursor = 0;
  for (const n of ns) {
    const said = autoSpeech(n.name, respellings).speech;       // what the voice was sent for it
    let i = C.indexOf(said, cursor); if (i < 0) i = C.indexOf(said); if (i < 0) continue;
    cursor = i + said.length;
    const t0 = A.character_start_times_seconds[i], t1 = A.character_end_times_seconds[i + said.length - 1];
    const win = stt.words.filter(([, a, b]) => Math.min(b, t1 + .3) - Math.max(a, t0 - .3) > .3 * Math.max(.05, b - a));
    let { heard, same } = closest(n.name, win.map(w => w[0]), said);
    if (same && /^[A-Z]{3,}$/.test(heard) && n.name !== n.name.toUpperCase()) same = false;   // heard in capitals: spelled out letter by letter (Gödel as "GURDL")
    const tl = timeline[l.id];
    found.push({ name: n.name, said, heard, same, line: l.id, who: l.who || l.speaker, ch: tl?.ch, at: tl ? tl.t0 + t0 : null, clip: base, t0, t1 });
  }
}

// ---- the report, by name: the ones heard differently first ----
const by = new Map(); for (const f of found) (by.get(f.name) || by.set(f.name, []).get(f.name)).push(f);
const names = [...by.entries()].map(([name, fs]) => ({ name, fs, said: fs[0].said, off: fs.filter(f => !f.same).length }))
  .sort((a, b) => (b.off > 0) - (a.off > 0) || a.name.localeCompare(b.name));
const stamp = f => f.at == null ? '' : `ch ${f.ch} ${Math.floor(f.at / 60)}:${String(Math.floor(f.at % 60)).padStart(2, '0')}`;
const heardList = fs => { const c = new Map(); for (const f of fs) c.set(f.heard || '(not heard)', (c.get(f.heard || '(not heard)') || 0) + 1); return [...c].map(([h, k]) => `${h}${k > 1 ? ` ×${k}` : ''}`).join('; '); };
const row = n => `| ${n.name} | ${n.said === n.name ? '' : n.said} | ${n.fs.length} | ${heardList(n.fs)} | ${n.fs.filter(f => !f.same).slice(0, 3).map(stamp).join(', ')} |`;
const off = names.filter(n => n.off), ok = names.filter(n => !n.off);
writeFileSync('script/names_report.md', `# How the voices say the names

Generated by \`tools/names_check.mjs\`. Every name in a voiced line, found in its clip, and what ElevenLabs'
speech-to-text heard there. **Heard differently** is where to listen first: a mispronounced name usually comes back
misspelled. It's a second opinion, not an ear: a name heard right can still carry the wrong stress. To listen to each
one, run \`npm run serve\` and open http://localhost:8077/names/.

A name is fixed with a respelling in \`script/pronounce.yaml\` (the voice only; the screen keeps the real spelling),
then \`node tools/voice.mjs\` re-voices just the lines that changed.

${names.length} names, ${found.length} times said. ${off.length} heard differently at least once.

## Heard differently

| name | sent to the voice as | times | heard as | where (chapter time) |
|---|---|---|---|---|
${off.map(row).join('\n')}

## Heard as written

| name | sent to the voice as | times | heard as | |
|---|---|---|---|---|
${ok.map(row).join('\n')}
`);

// ---- the listening page: each name, each time, a button that plays it with a couple of seconds either side ----
mkdirSync('site/public/names/clips', { recursive: true });
const used = new Set(found.map(f => f.clip));
for (const b of used) { const to = `site/public/names/clips/${b.split('/').pop()}.mp3`; if (!existsSync(to)) copyFileSync(b + '.mp3', to); }
const AROUND = 2;   // seconds played either side of the name, for its context
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const item = f => `<button class="${f.same ? '' : 'off'}" data-c="${f.clip.split('/').pop()}" data-a="${Math.max(0, f.t0 - AROUND).toFixed(2)}" data-b="${(f.t1 + AROUND).toFixed(2)}" title="${esc(f.line)}">▶ ${esc(stamp(f))} · ${esc(f.who)} · ${f.heard ? `heard “${esc(f.heard)}”` : 'not heard'}</button>`;
writeFileSync('site/public/names/index.html', `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Names, as said</title>
<style>body{font:17px/1.5 system-ui;max-width:900px;margin:2rem auto;padding:0 16px;background:#FBF8F0;color:#2B2233}
h2{margin-top:2rem}.n{margin:.9rem 0;padding:.6rem .8rem;background:#fff;border:1px solid #E6DCC6;border-radius:8px}
.n b{font-size:1.1rem}.said{color:#6A6470;margin-left:.5em}button{font:14px system-ui;margin:.25rem .3rem 0 0;padding:.3em .6em;border:1px solid #CFC4AE;border-radius:6px;background:#F6F1E6;cursor:pointer}
button.off{border-color:#C9302C;background:#FBE9E6}</style>
<h1>How the voices say the names</h1>
<p>Each button plays the name with ${AROUND} seconds either side. Red: speech-to-text heard something other than the name (listen to those first).
To fix one, add or change its respelling in <code>script/pronounce.yaml</code>. The report is <code>script/names_report.md</code>.</p>
<h2>Heard differently (${off.length})</h2>
${off.map(n => `<div class="n"><b>${esc(n.name)}</b>${n.said !== n.name ? `<span class="said">sent as “${esc(n.said)}”</span>` : ''}<br>${n.fs.map(item).join('')}</div>`).join('\n')}
<h2>Heard as written (${ok.length})</h2>
${ok.map(n => `<div class="n"><b>${esc(n.name)}</b>${n.said !== n.name ? `<span class="said">sent as “${esc(n.said)}”</span>` : ''}<br>${n.fs.map(item).join('')}</div>`).join('\n')}
<audio id="a"></audio>
<script>
const a = document.getElementById('a'); let stop = 0;
document.querySelectorAll('button').forEach(b => b.onclick = () => { a.src = 'clips/' + b.dataset.c + '.mp3'; a.currentTime = +b.dataset.a; stop = +b.dataset.b; a.play(); });
a.ontimeupdate = () => { if (a.currentTime >= stop) a.pause(); };
</script>
`);
console.log(`${names.length} names, ${found.length} times said; ${off.length} heard differently. Wrote script/names_report.md and site/public/names/`);
