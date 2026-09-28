// read_check.mjs: blind reads. Does each shot show what the storyboard says it shows, to someone who knows nothing of
// the film? docs/reads/chNN.yaml is the answer key: a frame per moment (and a code per Still QR style), what it
// literally shows, and three plausible wrong reads.
//
//   node tools/read_check.mjs --chapter=9            render the key's frames and write the blind packet:
//                                                    out/reads/ch09/blind/ holds only numbered images and questions
//   (readers)                                        two readers who've never seen the film, each working only in blind/:
//                                                    one describes each full-size frame (describe.md → descriptions.json),
//                                                    one picks A–D for each at phone size (choose.json → choices.json)
//   node tools/read_check.mjs --chapter=9 --judge    pairs each description with what the frame should show
//                                                    (judge/judge.json); a third reader grades them → judge/verdicts.json
//   node tools/read_check.mjs --chapter=9 --score    report.md and report.html, worst read first
//
// The readers are fresh Claude subagents given only the blind/ (or judge/) folder. A model isn't the audience: it misses
// jokes and in-references and can read too much into a picture. The report finds frames worth a human look; it isn't a
// verdict. --no-render reuses frames already rendered.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync, renameSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import YAML from 'yaml';
import { loadRefs } from './script_lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
if (!args.chapter) { console.error('usage: node tools/read_check.mjs --chapter=N [--judge | --score] [--no-render]'); process.exit(1); }
const CH = String(args.chapter).padStart(2, '0'), KEY = `docs/reads/ch${CH}.yaml`;
if (!existsSync(KEY)) { console.error(`no answer key at ${KEY}`); process.exit(1); }
const reads = YAML.parse(readFileSync(KEY, 'utf8')).reads;
const FIELDS = new Set(['id', 'at', 'code', 'shows', 'answer', 'means', 'decoys', 'tone']);
for (const r of reads) for (const f of Object.keys(r)) if (!FIELDS.has(f)) { console.error(`${KEY}: ${r.id} has an unknown field "${f}" (a comma in an unquoted value?)`); process.exit(1); }
for (const r of reads) for (const d of [r.decoys, r.tone?.decoys].filter(Boolean))   // a comma in a flow list splits an option in two
  if (d.length !== 3) { console.error(`${KEY}: ${r.id} needs 3 decoys, has ${d.length} (quote any option with a comma)`); process.exit(1); }
for (const r of reads) {   // a right answer much longer or shorter than the decoys gives itself away
  const q = (r.answer ?? r.shows).length / (r.decoys.reduce((a, d) => a + d.length, 0) / 3);
  if (q > 1.3 || q < .7) console.warn(`${KEY}: ${r.id}'s answer is ${q.toFixed(1)}× the decoys' length; give it a shorter \`answer\``);
}
const chapter = JSON.parse(readFileSync(`src/gen/ch${CH}.js`, 'utf8').replace(/^[^{]*/, '').replace(/;\s*$/, ''));
const DIR = `out/reads/ch${CH}`, BLIND = `${DIR}/blind`, JUDGE = `${DIR}/judge`;
const PHONE = .25;                      // a 1920 frame shown 480 wide
const PAPER = '#F4EFE2';                // a code's card
const readJson = f => JSON.parse(readFileSync(f, 'utf8'));
const hash = s => parseInt(createHash('sha1').update(s).digest('hex').slice(0, 8), 16);
const shuffle = (xs, seed) => xs.map(x => [hash(seed + x), x]).sort((a, b) => a[0] - b[0]).map(p => p[1]);
const magick = a => execFileSync('magick', a, { stdio: ['ignore', 'ignore', 'inherit'] });

// when a phrase is said in a line (as scene_kit.js's atWord), plus `after` seconds
function timeOf([id, ...rest]) {
  const l = chapter.lines.find(l => l.id === id); if (!l) throw new Error(`${KEY}: no line ${id}`);
  const after = typeof rest.at(-1) === 'number' ? rest.pop() : 0, phrase = rest[0];
  if (!phrase) return l.t0 + after;
  for (const s of [l.speech, l.text]) { const i = (s || '').toLowerCase().indexOf(phrase.toLowerCase()); if (i >= 0) return l.t0 + (l.t1 - l.t0) * i / s.length + after; }
  throw new Error(`${KEY}: "${phrase}" isn't in ${id}`);
}

// the key, numbered in a shuffled order so the packet doesn't follow the story
const items = shuffle(reads.map(r => r.id), 'order ' + CH).map((id, i) => ({ n: i + 1, ...reads.find(r => r.id === id) }));
const letters = ['A', 'B', 'C', 'D'];
// four options, and always a fifth: E, can't tell (a reader who can't make it out says so rather than ruling options out)
const CANT = "can't tell: the picture doesn't show enough to choose";
function options(shows, decoys, seed) { const o = shuffle([shows, ...decoys], seed); return { options: { ...Object.fromEntries(o.map((x, i) => [letters[i], x])), E: CANT }, answer: letters[o.indexOf(shows)] }; }

function prepare() {
  mkdirSync(`${DIR}/frames`, { recursive: true });
  const shots = items.filter(r => r.at).map(r => ({ ...r, t: +timeOf(r.at).toFixed(2) }));
  if (!args['no-render']) {
    const tmp = `${DIR}/stills`; rmSync(tmp, { recursive: true, force: true });
    execFileSync('node', ['render.mjs', `--chapter=${+CH}`, `--stills=${[...new Set(shots.map(r => r.t))].join(',')}`, `--out=${tmp}`], { stdio: 'inherit' });
    for (const r of shots) copyFileSync(`${tmp}/t${r.t.toFixed(2).replace('.', '_')}.png`, `${DIR}/frames/${r.id}.png`);
    rmSync(tmp, { recursive: true, force: true });
  }
  // a code alone on its card, at the size the film shows it (qr_images.mjs's framed image, fitted as look.js fits it)
  const refs = new Map(loadRefs().map(r => [r.id, r]));
  for (const r of items.filter(r => r.code)) {
    const ref = refs.get(r.code), src = `assets/qr/f/${r.code}.png`;
    if (!ref || !existsSync(src)) throw new Error(`${KEY}: no Still QR image for ${r.code} (run npm run qr:images)`);
    const fit = ref.mode === 'feature' ? '560x560' : '470x410';
    magick([src, '-resize', fit, '-background', PAPER, '-gravity', 'center', '-extent', ref.mode === 'feature' ? '620x620' : '520x460', `${DIR}/frames/${r.id}.png`]);
  }
  // the packet: numbered images and questions only
  rmSync(BLIND, { recursive: true, force: true }); mkdirSync(`${BLIND}/full`, { recursive: true }); mkdirSync(`${BLIND}/small`, { recursive: true });
  const key = [], choose = [];
  for (const r of items) {
    copyFileSync(`${DIR}/frames/${r.id}.png`, `${BLIND}/full/${r.n}.png`);
    magick([`${DIR}/frames/${r.id}.png`, '-resize', `${PHONE * 100}%`, '-quality', '85', `${BLIND}/small/${r.n}.jpg`]);
    const main = options(r.answer ?? r.shows, r.decoys, r.id), q = r.code ? 'What object or theme is pictured around this QR code?' : 'Which best describes what this frame shows?';
    choose.push({ n: r.n, image: `small/${r.n}.jpg`, question: q, options: main.options });
    const k = { n: r.n, id: r.id, t: r.at ? +timeOf(r.at).toFixed(2) : null, code: r.code, shows: r.shows, means: r.means, answer: main.answer };
    if (r.tone) { const o = options(r.tone.want, r.tone.decoys, r.id + ' tone'); choose.push({ n: r.n + 't', image: `small/${r.n}.jpg`, question: r.tone.ask, options: o.options }); Object.assign(k, { tone: r.tone.ask, toneWant: r.tone.want, toneAnswer: o.answer }); }
    key.push(k);
  }
  writeFileSync(`${DIR}/key.json`, JSON.stringify(key, null, 1));
  writeFileSync(`${BLIND}/choose.json`, JSON.stringify(choose, null, 1));
  writeFileSync(`${BLIND}/describe.md`, `# Describe each picture

Each image in full/ is one frame of a painted animated film (or, for a few, a QR code as the film shows it). You haven't
seen the film. For each image, say plainly what it shows: the main subject, what is happening, and anything you can't
make out or could read two ways. Don't guess at a story; describe what's there. Describe each image as if it were the
only one: don't refer to the other images ("again", "the same scene"), and name each thing as you'd see it here.

Write descriptions.json (or the file name you were given, such as descriptions.2.json): { "1": "…", "2": "…", … },
one entry per image in full/ (${items.length} images).
`);
  writeFileSync(`${BLIND}/choose.md`, `# Pick what each picture shows

Each entry in choose.json names an image in small/ (a frame of a painted animated film, or a QR code as the film shows
it, at the size of a phone screen), a question and four options. You haven't seen the film. Look at the image, then pick
the option that fits it best, and say how sure you are. Judge each image by itself, not by the other images. Several
options will share the same setting: choose on what the picture actually shows, and don't pick an option just because
it's the most detailed or the others seem wrong. If you can't make out enough to choose, pick E.

Write choices.json (or the file name you were given, such as choices.2.json): { "1": { "pick": "A" … "E", "confidence": "high" | "medium" | "low" }, … }, one entry per question
(${choose.length} questions; some ids end in "t").
`);
  console.log(`${items.length} reads → ${BLIND}/ (describe.md, choose.json and the images); answers kept in ${DIR}/key.json`);
}

// each reader writes its own file: descriptions.json, descriptions.2.json, …; choices.json, choices.2.json, …
// (one reader's answers vary from run to run, so a read passes only if every reader got it)
const outputs = base => readdirSync(BLIND).filter(f => new RegExp(`^${base}(\\.\\d+)?\\.json$`).test(f)).sort()
  .map(f => ({ r: +(f.match(/\.(\d+)\.json$/)?.[1] || 1), data: readJson(`${BLIND}/${f}`) }));

function judge() {
  const descs = outputs('descriptions'), key = readJson(`${DIR}/key.json`);
  if (!descs.length) { console.error(`no descriptions in ${BLIND}`); process.exit(1); }
  rmSync(JUDGE, { recursive: true, force: true }); mkdirSync(JUDGE, { recursive: true });
  const rows = key.flatMap(k => descs.map(({ r, data }) => ({ id: `${k.n}-${r}`, should_show: k.shows, description: data[k.n] ?? '' })));
  writeFileSync(`${JUDGE}/judge.json`, JSON.stringify(shuffle(rows.map(x => x.id), 'judge').map(id => rows.find(x => x.id === id)), null, 1));
  writeFileSync(`${JUDGE}/README.md`, `# Grade each description

judge.json pairs what a picture should show (should_show) with how someone who'd never seen it described it
(description). Grade whether the viewer saw what was meant: the main subject and the action, not wording or small details.

- "read": they saw it.
- "partly": they saw some of it, or saw it but weren't sure.
- "misread": they missed the main subject or saw something else.

Write verdicts.json: { "<id>": { "verdict": "read" | "partly" | "misread", "why": "one short sentence" }, … }, one entry
per id in judge.json (${rows.length}).
`);
  console.log(`${rows.length} descriptions (${descs.length} reader${descs.length > 1 ? 's' : ''}) to grade → ${JUDGE}/judge.json`);
}

function score() {
  const key = readJson(`${DIR}/key.json`), descs = outputs('descriptions'), picks = outputs('choices');
  const verdicts = existsSync(`${JUDGE}/verdicts.json`) ? readJson(`${JUDGE}/verdicts.json`) : {};
  const choose = new Map(readJson(`${BLIND}/choose.json`).map(c => [String(c.n), c]));
  const VR = { read: 2, partly: 1, misread: 0 }, CF = { high: 2, medium: 1, low: 0 };
  const rows = key.map(k => {
    const seen = descs.map(({ r, data }) => ({ r, desc: data[k.n] || '', ...(verdicts[`${k.n}-${r}`] || {}) }));
    const mc = picks.map(({ r, data }) => { const p = data[k.n] || {}; return { r, pick: p.pick, confidence: p.confidence, right: p.pick === k.answer, picked: choose.get(String(k.n))?.options[p.pick] }; });
    const tone = k.tone ? picks.map(({ r, data }) => { const p = data[k.n + 't'] || {}; return { r, right: p.pick === k.toneAnswer, picked: choose.get(k.n + 't')?.options[p.pick] }; }) : [];
    const bad = mc.filter(m => !m.right).length + seen.filter(s => s.verdict === 'misread').length + tone.filter(x => !x.right).length;
    const weak = seen.filter(s => s.verdict === 'partly').length + mc.filter(m => m.confidence === 'low').length;
    const status = bad ? 'flag' : weak ? 'check' : 'ok';
    return { ...k, seen, mc, toneRes: tone, status, rank: bad * 10 + weak };
  }).sort((a, b) => b.rank - a.rank || a.id.localeCompare(b.id, 'en', { numeric: true }));
  const count = s => rows.filter(r => r.status === s).length;
  const when = r => r.code ? `code ${r.code}` : `${Math.floor(r.t / 60)}:${(r.t % 60).toFixed(1).padStart(4, '0')}`;
  const summary = `${rows.length} reads, ${descs.length} describer${descs.length > 1 ? 's' : ''} and ${picks.length} chooser${picks.length > 1 ? 's' : ''}: ${count('flag')} flagged, ${count('check')} worth a look, ${count('ok')} read as meant.`;
  const mcTxt = m => m.right ? `right${m.confidence ? ` (${m.confidence})` : ''}` : `wrong: ${m.picked ?? 'no answer'}${m.confidence ? ` (${m.confidence})` : ''}`;
  const cell = s => String(s).replace(/\|/g, '/').replace(/\n/g, ' ');
  const md = [`# Blind reads, chapter ${+CH}`, '', summary,
    'Multiple choice is at phone size (a 1920 frame shown 480 wide); descriptions are of the full frame. A read passes only if every reader got it.', '',
    '| | read | at | should show | the blind readers saw | picked (phone size) |', '|---|---|---|---|---|---|',
    ...rows.map(r => `| ${{ flag: '✗', check: '?', ok: '✓' }[r.status]} | ${r.id} | ${when(r)} | ${cell(r.shows)} | ${r.seen.map(s => `${cell(s.desc)}${s.verdict ? ` *(${s.verdict}: ${cell(s.why || '')})*` : ''}`).join('<br>')} | ${r.mc.map(mcTxt).map(cell).join('<br>')}${r.tone ? `<br>${cell(r.tone)} ${r.toneRes.map(x => x.right ? 'right' : `wrong: ${cell(x.picked)}`).join(', ')}` : ''} |`)];
  writeFileSync(`${DIR}/report.md`, md.join('\n') + '\n');
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const thumb = r => 'data:image/jpeg;base64,' + readFileSync(`${BLIND}/small/${r.n}.jpg`).toString('base64');
  writeFileSync(`${DIR}/report.html`, `<!doctype html><meta charset="utf-8"><title>Blind reads ch ${+CH}</title>
<style>:root{--bg:#faf8f3;--fg:#222;--mut:#666;--line:#ddd;--flag:#c9302c;--check:#b8860b;--ok:#2e7d32}
@media (prefers-color-scheme:dark){:root{--bg:#1c1b19;--fg:#eee;--mut:#aaa;--line:#444}}
body{background:var(--bg);color:var(--fg);font:16px/1.45 system-ui,sans-serif;margin:0 auto;max-width:1100px;padding:16px}
.r{display:grid;grid-template-columns:minmax(0,480px) 1fr;gap:16px;border-top:1px solid var(--line);padding:14px 0}
.r img{width:100%;height:auto;border-radius:4px}.s{font-weight:700}.flag .s{color:var(--flag)}.check .s{color:var(--check)}.ok .s{color:var(--ok)}
.m{color:var(--mut);font-size:14px}p{margin:4px 0}@media (max-width:700px){.r{grid-template-columns:1fr}}</style>
<h1>Blind reads, chapter ${+CH}</h1><p>${esc(summary)} Images are at phone size, as the multiple-choice readers saw them.</p>
${rows.map(r => `<div class="r ${r.status}"><img src="${thumb(r)}" alt="${esc(r.id)}"><div>
<p><span class="s">${{ flag: 'Flagged', check: 'Worth a look', ok: 'Read as meant' }[r.status]}</span> · ${esc(r.id)} · ${esc(when(r))}</p>
<p><b>Should show:</b> ${esc(r.shows)}</p>${r.means ? `<p class="m">Stands for: ${esc(r.means)}</p>` : ''}
${r.seen.map(s => `<p><b>Reader ${s.r} saw:</b> ${esc(s.desc)}</p>${s.verdict ? `<p class="m">Graded ${esc(s.verdict)}: ${esc(s.why)}</p>` : ''}`).join('\n')}
<p><b>Picked at phone size:</b> ${r.mc.map(m => m.right ? `the right one${m.confidence ? ` (${esc(m.confidence)})` : ''}` : `wrong, “${esc(m.picked)}”${m.confidence ? ` (${esc(m.confidence)})` : ''}`).join('; ')}</p>
${r.tone ? `<p><b>${esc(r.tone)}</b> ${r.toneRes.map(x => x.right ? `right (${esc(r.toneWant)})` : `wrong: “${esc(x.picked)}”`).join('; ')}</p>` : ''}</div></div>`).join('\n')}`);
  console.log(`${DIR}/report.md and report.html: ${count('flag')} flagged, ${count('check')} worth a look, ${count('ok')} ok`);
}

if (args.judge) judge(); else if (args.score) score(); else prepare();
