// wiki_notes.mjs: the language's explainers (i18n/<lang>/site/notes/*.md) point at English Wikipedia where the English
// ones do; this points each such link at the same article in the language, by Wikipedia's own language links (none
// guessed; a section anchor is dropped, since sections differ). A link with no counterpart keeps the English article and
// says so: "(en inglés)" after it in the text, "Wikipedia, en inglés" in a front-matter title. Rewrites the files in place.
//   node i18n/tools/wiki_notes.mjs [--lang=es]
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirOf, langOf, args, langLinks, wikiTitle } from './i18n_lib.mjs';

const lang = langOf(args), dir = `${dirOf(lang)}/site/notes`, IN = { es: 'en inglés', pt: 'em inglês', ja: '英語', hi: 'अंग्रेज़ी में', zh: '英文', de: 'auf Englisch' }[lang] || 'English';
// how the mark is written: "(en inglés)" after a space, or in Japanese "（英語）" (Chinese "（英文）") with full-width
// brackets and no space; in a front-matter title, "(Wikipedia, en inglés)" or "(Wikipedia、英語)"
const CJK = /^(ja|zh)$/.test(lang), MARK = CJK ? `（${IN}）` : ` (${IN})`, SEP = CJK ? '、' : ', ';
const files = readdirSync(dir).filter(f => f.endsWith('.md'));
// a Wikipedia url in markdown can hold one pair of brackets (…/Mad_(magazine))
const URL = String.raw`https:\/\/en\.wikipedia\.org\/wiki\/(?:[^()\s"'\]]|\([^()\s]*\))+`;
const URL_RE = new RegExp(URL, 'g');
const src = Object.fromEntries(files.map(f => [f, readFileSync(`${dir}/${f}`, 'utf8')]));
const found = await langLinks(files.flatMap(f => (src[f].match(URL_RE) || []).map(wikiTitle)), lang);
const said = new RegExp(`^[,、]? ?[(（]?${IN}[)）]?`), noteIn = t => t.replace(`${SEP}${IN})`, ')');
let moved = 0, kept = 0;
for (const f of files) {
  const [, head, body] = src[f].match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  const to = u => found[wikiTitle(u)];
  // front matter: { title: "... (Wikipedia)", url: "..." }
  const h = head.replace(new RegExp(String.raw`\{ ?title: "([^"]*)", url: "(${URL})" ?\}`, 'g'), (m, t, u) => {
    if (to(u)) { moved++; return m.replace(u, to(u)).replace(`"${t}"`, `"${noteIn(t)}"`); }
    kept++; return t.includes(IN) ? m : m.replace(`"${t}"`, `"${t.replace(/\(Wikipedia\)$/, `(Wikipedia${SEP}${IN})`)}"`);
  });
  // text: [label](url), then "(en inglés)" when it stays English
  const b = body.replace(new RegExp(String.raw`\[([^\]]+)\]\((${URL})\)`, 'g'), (m, label, u, at, all) => {
    const tail = all.slice(at + m.length);
    if (to(u)) { moved++; return `[${label}](${to(u)})`; }
    kept++; return said.test(tail) ? m : `${m}${MARK}`;
  });
  if (h + b !== src[f]) writeFileSync(`${dir}/${f}`, h + b);
}
console.log(`${dir}: ${moved} Wikipedia links now in ${lang}; ${kept} kept in English (marked)`);
