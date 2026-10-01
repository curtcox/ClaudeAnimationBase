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

const DIR = 'out/film', OUT = `${DIR}/subtitles.srt`, ROWS = 2;
if (!existsSync(`${DIR}/film.json`)) { console.error(`no ${DIR}/film.json yet: join the film first (npm run film)`); process.exit(1); }
const film = JSON.parse(readFileSync(`${DIR}/film.json`, 'utf8'));
const words = existsSync('script/youtube_strings.yaml') ? readYaml('script/youtube_strings.yaml') : {};
const NAMES = { curt: 'Curt', claude: 'Claude', ...(words.subtitle_names || {}) };
// Japanese (or Chinese, Korean) has no spaces: a row is 16 full-width characters (Latin letters count half), a cue at
// most 26 (phrases rarely split two rows evenly), and it
// breaks between phrases, never inside a word or before 、。」, as the translation's captions do (i18n/src/i18n.js)
const LANG = existsSync('script/site_strings.yaml') ? readYaml('script/site_strings.yaml').lang : 'en';
const CJK = /^(ja|zh|ko)\b/.test(LANG), ROW = CJK ? 16 : 42, PIECE = CJK ? 26 : 80, GAP = CJK ? '' : ' ';
const SEG = CJK && new Intl.Segmenter(LANG, { granularity: 'word' });
const PARTICLE = /^(を|は|が|に|で|と|も|へ|や|の|か|には|では|とは|から|まで|より|ので|けど|って)$/u, NO_START = /^[、。，．！？!?…‥・：；:;）」』】〕)\]’”ーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ%％]/u, NO_END = /[「『（【〔(\[‘“]$/u;
const cjkWords = s => {
  const out = []; let prev = '';
  for (const { segment: g } of SEG.segment(s)) {
    const last = out.length - 1;
    // kana stays with the word before it, unless that was a particle (を は が に…): rows break between phrases
    const kana = /^[\p{Script=Hiragana}ー]/u.test(g) && (PARTICLE.test(g) || !/[、。！？!?…：:\s]$/u.test(out[last] || '') && !PARTICLE.test(prev));
    const latin = /[\x21-\x7e]$/.test(out[last] || '') && /^[\x21-\x7e]/.test(g);
    // a figure keeps its counter (20|年 → 20年), and この・その・あの・どの the word they point at
    const counted = /[0-9０-９]$/.test(out[last] || '') && /^[\p{Script=Han}\p{Script=Katakana}]/u.test(g);
    const pointer = /^(この|その|あの|どの)$/.test(out[last] || '');
    if (last >= 0 && (counted || pointer || /^\s+$/.test(g) || kana || latin || NO_START.test(g) || NO_END.test(out[last]))) out[last] += g; else out.push(g);
    prev = g;
  }
  return out;
};
const tokensOf = s => CJK ? cjkWords(s) : s.split(' ');
const len = CJK ? s => [...s].reduce((a, c) => a + (c.codePointAt(0) < 0x2e80 ? .5 : 1), 0) : s => s.length;
const tidy = CJK ? s => s.trim() : s => s;

// the same cleaning and sentence split as the captions
const plainText = s => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*|\*|_\[|\]_|^- |^> /gm, '').replace(/\s+/g, ' ').trim();
const sentencesOf = s => { s = s.replace(/\b(vs|e\.g|i\.e|Dr|Lt|Mr|Ms|St)\./g, '$1․');
  return (CJK ? s.split(/(?<=[。！？])(?![」』）)"”。！？!?])\s*|(?<=[.!?]["”)]*)\s+(?=["“(]?[\p{Lu}0-9])/u).filter(Boolean)
    : s.split(/(?<=[.!?]["”»)]*)\s+(?=["“«(¿¡]?[\p{Lu}0-9])|(?<=[।॥]["”')]*)\s+|(?<=[?!]["”')]*)\s+(?=["“'(]?\p{Script=Devanagari})/u)).map(x => x.replace(/․/g, '.')); };
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
  if (len(s) <= ROW) return s;
  const w = tokensOf(s); let best = null;
  for (let i = 1; i < w.length; i++) { const a = tidy(w.slice(0, i).join(GAP)), b = tidy(w.slice(i).join(GAP)), m = Math.max(len(a), len(b)), d = m + (CJK ? (/[、。！？」』）]$/.test(a) ? 0 : 3) + (m > ROW ? (m - ROW) * 10 : 0) : 0); if (!best || d < best[0]) best = [d, a + '\n' + b]; }
  return best ? best[1] : s;
}
// a sentence cut into pieces that fit, preferring a break after a comma, semicolon, colon or dash
function pieces(s) {
  const max = PIECE; if (len(s) <= max) return [s];
  const n = Math.ceil(len(s) / max), w = tokensOf(s), out = [];
  let cur = [];
  for (let i = 0; i < w.length; i++) {
    cur.push(w[i]);
    const now = len(tidy(cur.join(GAP))), left = len(tidy(w.slice(i + 1).join(GAP))), aim = len(s) / n;
    const soft = (CJK ? /[、，；：…—）」』]\s*$/ : /[,;:—–)]$/).test(w[i]) && now > aim * .6, hard = now + GAP.length + len(tidy(w[i + 1] || '')) > max;
    if (left > (CJK ? 8 : 0) && (hard || soft || now >= aim)) { out.push(tidy(cur.join(GAP))); cur = []; }
  }
  if (cur.length) out.push(tidy(cur.join(GAP)));
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
        const t0 = s0 + a / s.length * (s1 - s0); a += p.length + GAP.length;
        const t1 = pi === ps.length - 1 ? s1 : s0 + a / s.length * (s1 - s0);
        cues.push({ id: l.id, t0: c.start + t0, t1: c.start + t1, txt: (named && si === 0 && pi === 0 ? `${who}${CJK ? '：' : ': '}` : '') + p });
      });
      acc += s.length;
    });
  }
}
// a flash too short to read ("Hold it!") joins the next piece of the same line, when the two fit two rows
for (let i = 0; i < cues.length - 1; i++) {
  const q = cues[i], n = cues[i + 1];
  if (q.id === n.id && Math.min(q.t1 - q.t0, n.t1 - n.t0) < 1.2 && len(q.txt + GAP + n.txt) <= PIECE) { q.txt += GAP + n.txt; q.t1 = n.t1; cues.splice(i + 1, 1); i--; }
}
// never overlapping; a short one ("Yes.") held into the pause after it, up to a glance's length (1.2 s)
cues.forEach((q, i) => { const next = cues[i + 1]?.t0 ?? Infinity; q.t1 = Math.min(next, Math.max(q.t1, q.t0 + 1.2)); });
const srt = cues.map((q, i) => `${i + 1}\n${stamp(q.t0)} --> ${stamp(q.t1)}\n${rows(q.txt)}\n`).join('\n');
writeFileSync(OUT, srt);
const long = cues.filter(q => len(q.txt) > ROW * ROWS + (CJK ? 4 : 12)).length;
console.log(`${OUT}: ${cues.length} subtitles, to ${stamp(cues.at(-1).t1)}${long ? `; ${long} longer than two rows` : ''}`);
