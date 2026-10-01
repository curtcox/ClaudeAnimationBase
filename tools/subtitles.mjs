// subtitles.mjs: the film's subtitles → out/film/subtitles.srt, to upload beside the film (YouTube Studio → Subtitles).
//   node tools/subtitles.mjs     from out/film/film.json (tools/assemble.mjs writes it, then runs this)
// The words and times are the burned-in captions' (captionAt() in src/timing.js): each spoken line a sentence at a time,
// each sentence given its share of the line's speaking time by its length, the last held to the line's end. A sentence
// too long for two subtitle rows is cut into cues at word breaks (at a comma or the like when one is near), sharing
// its time the same way. The speaker is named when the voice changes. Curt's typos stay as typed, as the captions show
// them (Claude quotes some of them later), with the fix in brackets where the captions write it in red: "Magicarp
// [Magikarp]", an insertion "[as]", a deletion "[sic]". The codes aren't spoken, so they aren't here. Runs in a translation's stage (i18n/<lang>/stage) as it is.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readYaml, pad } from './script_lib.mjs';

const DIR = 'out/film', OUT = `${DIR}/subtitles.srt`, ROW = 42, ROWS = 2;
if (!existsSync(`${DIR}/film.json`)) { console.error(`no ${DIR}/film.json yet: join the film first (npm run film)`); process.exit(1); }
const film = JSON.parse(readFileSync(`${DIR}/film.json`, 'utf8'));
const words = existsSync('script/youtube_strings.yaml') ? readYaml('script/youtube_strings.yaml') : {};
const NAMES = { curt: 'Curt', claude: 'Claude', ...(words.subtitle_names || {}) };

// the same cleaning and sentence split as the captions
const plainText = s => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*|\*|_\[|\]_|^- |^> /gm, '').replace(/\s+/g, ' ').trim();
const sentencesOf = s => s.replace(/\b(vs|e\.g|i\.e|Dr|Lt|Mr|Ms|St)\./g, '$1․')
  .split(/(?<=[.!?]["”»)]*)\s+(?=["“«(¿¡]?[\p{Lu}0-9])/u).map(x => x.replace(/․/g, '.'));
// a typo mark ("Solid Gold [Magicarp→Magikarp]", "[+as]", "[were a→]") as the text typed and the text shown
function fixOf(mark) {
  let typed = '', shown = '', last = 0, m; const re = /\[(\+)?([^\]→]*)(?:→([^\]]*))?\]/g;
  while ((m = re.exec(mark))) {
    const before = mark.slice(last, m.index); typed += before; shown += before; last = re.lastIndex;
    if (m[1]) { shown += `[${m[2]}]` + (mark[last] === ' ' ? ' ' : ''); if (typed.endsWith(' ') && mark[last] === ' ') last++; }
    else { typed += m[2]; shown += m[3] ? `${m[2]} [${m[3]}]` : `${m[2]} [sic]`; }
  }
  const rest = mark.slice(last);
  return [typed + rest, shown + rest];
}
// one cue's text as at most two balanced rows
function rows(s) {
  if (s.length <= ROW) return s;
  const w = s.split(' '); let best = null;
  for (let i = 1; i < w.length; i++) { const a = w.slice(0, i).join(' '), b = w.slice(i).join(' '), d = Math.max(a.length, b.length); if (!best || d < best[0]) best = [d, a + '\n' + b]; }
  return best[1];
}
// a sentence cut into pieces that fit, preferring a break after a comma, semicolon, colon or dash
function pieces(s) {
  const max = ROW * ROWS - 4; if (s.length <= max) return [s];
  const n = Math.ceil(s.length / max), w = s.split(' '), out = [];
  let cur = [];
  for (let i = 0; i < w.length; i++) {
    cur.push(w[i]);
    const len = cur.join(' ').length, left = w.slice(i + 1).join(' ').length, aim = s.length / n;
    const soft = /[,;:—–)]$/.test(w[i]) && len > aim * .6, hard = len + 1 + (w[i + 1] || '').length > max;
    if (left && (hard || soft || len >= aim)) { out.push(cur.join(' ')); cur = []; }
  }
  if (cur.length) out.push(cur.join(' '));
  return out;
}
const stamp = s => { const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60;
  return `${pad(h)}:${pad(m)}:${pad(sec)},${String(ms % 1000).padStart(3, '0')}`; };

const typos = {};
for (const t of existsSync('script/typos.yaml') ? readYaml('script/typos.yaml') || [] : []) (typos[t.line] ||= []).push(fixOf(t.mark));
const cues = []; let lastWho = null;
for (const c of film.chapters) {
  const g = {}; new Function('window', readFileSync(`src/gen/ch${pad(c.n)}.js`, 'utf8'))(g);
  for (const l of g.CHAPTER.lines) {
    if (!l.spoken) continue;
    let txt = plainText(l.text);
    for (const [typed, shown] of typos[l.id] || []) txt = txt.split(typed).join(shown);
    const sents = sentencesOf(txt), total = sents.reduce((a, s) => a + s.length, 0), span = Math.max(.01, l.t1 - l.t0);
    const who = l.who ? l.who[0].toUpperCase() + l.who.slice(1) : NAMES[l.speaker] || l.speaker, named = who !== lastWho;
    lastWho = who;
    let acc = 0;
    sents.forEach((s, si) => {
      const s0 = l.t0 + acc / total * span, s1 = si === sents.length - 1 ? l.end : l.t0 + (acc + s.length) / total * span;
      let a = 0; const ps = pieces(s);
      ps.forEach((p, pi) => {
        const t0 = s0 + a / s.length * (s1 - s0); a += p.length + 1;
        const t1 = pi === ps.length - 1 ? s1 : s0 + a / s.length * (s1 - s0);
        cues.push({ id: l.id, t0: c.start + t0, t1: c.start + t1, txt: (named && si === 0 && pi === 0 ? `${who}: ` : '') + p });
      });
      acc += s.length;
    });
  }
}
// a flash too short to read ("Hold it!") joins the next piece of the same line, when the two fit two rows
for (let i = 0; i < cues.length - 1; i++) {
  const q = cues[i], n = cues[i + 1];
  if (q.id === n.id && Math.min(q.t1 - q.t0, n.t1 - n.t0) < 1.2 && (q.txt + ' ' + n.txt).length <= ROW * ROWS - 4) { q.txt += ' ' + n.txt; q.t1 = n.t1; cues.splice(i + 1, 1); i--; }
}
// never overlapping; a short one ("Yes.") held into the pause after it, up to a glance's length (1.2 s)
cues.forEach((q, i) => { const next = cues[i + 1]?.t0 ?? Infinity; q.t1 = Math.min(next, Math.max(q.t1, q.t0 + 1.2)); });
const srt = cues.map((q, i) => `${i + 1}\n${stamp(q.t0)} --> ${stamp(q.t1)}\n${rows(q.txt)}\n`).join('\n');
writeFileSync(OUT, srt);
const long = cues.filter(q => q.txt.length > ROW * ROWS + 12).length;
console.log(`${OUT}: ${cues.length} subtitles, to ${stamp(cues.at(-1).t1)}${long ? `; ${long} longer than two rows` : ''}`);
