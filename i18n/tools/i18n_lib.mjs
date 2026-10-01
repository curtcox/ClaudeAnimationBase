// i18n_lib.mjs: what the translation tools share (i18n/PLAN.md). Run every tool from the project's root.
//   A language's translation:  i18n/<lang>/script/chNN.yaml   { lineId: { text, speech?, anchors? } }
//   Its lettering:             i18n/<lang>/strings.yaml       { "English": "translation" }
//   Its working copy:          i18n/<lang>/stage/             (stage.mjs; the usual tools run inside it)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import YAML from 'yaml';

export const readYaml = p => YAML.parse(readFileSync(p, 'utf8'));
export const optYaml = (p, dflt) => existsSync(p) ? readYaml(p) ?? dflt : dflt;
export const pad = n => String(n).padStart(2, '0');
export const langOf = args => args.lang || 'es';
export const dirOf = lang => `i18n/${lang}`;
export const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));

// every line's translation, by id, from all the chapter files
export function translations(lang) {
  const d = `${dirOf(lang)}/script`, out = {};
  if (!existsSync(d)) return out;
  for (const f of readdirSync(d).filter(f => /^ch\d\d\.yaml$/.test(f)).sort())
    for (const [id, t] of Object.entries(readYaml(`${d}/${f}`) || {})) {
      if (out[id]) throw new Error(`${d}/${f}: ${id} is translated twice`);
      out[id] = t;
    }
  return out;
}

// The English phrases something is timed to, by line id: scenes (atWord, or say() in a scene), the codes' cues
// (script/refs.yaml) and the sound cues (script/sfx.yaml). Scenes that build a phrase at run time aren't seen here;
// the stage's studio finds those as it draws (i18n/src/i18n.js), and the probe lists them.
export function englishAnchors() {
  const uses = {}, add = (id, phrase, where) => { if (!phrase || phrase === '@end') return; ((uses[id] ||= {})[phrase] ||= new Set()).add(where); };
  for (const f of readdirSync('src/scenes').filter(f => /^ch\d\d_.*\.js$/.test(f))) {
    const src = readFileSync(`src/scenes/${f}`, 'utf8');
    for (const m of src.matchAll(/\b(?:say|atWord)\(\s*'(T\d\d\.[UC]\.\d\d(?:\.\d+)?)'\s*,\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g))
      add(m[1], (m[2] ?? m[3]).replace(/\\(.)/g, '$1'), f.slice(0, 4));
  }
  for (const r of readYaml('script/refs.yaml')) if (r.cue && /^T\d\d\./.test(r.at)) add(r.at, r.cue, 'code ' + r.id);
  for (const s of readYaml('script/sfx.yaml')?.cues || []) for (const k of ['at', 'until'])
    if (Array.isArray(s[k]) && typeof s[k][1] === 'string') add(s[k][0], s[k][1], 'sound ' + s.id);
  return uses;
}

// A phrase at the same place in the translated line as the English phrase sits in the English one: where a phrase has
// no anchor, a cue lands about when the translation says the same thing. Returns a phrase that occurs in `to` (one to
// three whole words, starting at the word nearest that place), found first there by an indexOf.
export function samePlace(en, phrase, to) {
  const i = en.toLowerCase().indexOf(phrase.toLowerCase());
  if (i < 0 || !to) return null;
  const at = Math.round(i / Math.max(1, en.length) * to.length);
  const starts = [...to.matchAll(/\S+/g)].map(m => m.index);
  let k = 0; for (let j = 0; j < starts.length; j++) if (Math.abs(starts[j] - at) < Math.abs(starts[k] - at)) k = j;
  // the shortest run of words from there whose first occurrence is right there
  for (let n = 1; n <= 6 && k + n <= starts.length; n++) {
    const end = k + n < starts.length ? starts[k + n] : to.length, p = to.slice(starts[k], end).trim();
    if (to.toLowerCase().indexOf(p.toLowerCase()) === starts[k]) return p;
  }
  return null;
}

// Wikipedia's own language links: { English title (as asked, or as normalized/redirected) → the article's url in lang }.
// None are guessed; a title with no counterpart is simply absent.
export async function langLinks(titles, lang) {
  const found = {}, all = [...new Set(titles)];
  for (let i = 0; i < all.length; i += 50) {   // the API takes 50 titles a request
    const q = new URLSearchParams({ action: 'query', format: 'json', prop: 'langlinks', lllang: lang, lllimit: 'max', redirects: '1', titles: all.slice(i, i + 50).join('|') });
    const j = await (await fetch(`https://en.wikipedia.org/w/api.php?${q}`, { headers: { 'User-Agent': 'axol-f translation tool (https://github.com/curtcox/axol-f)' } })).json();
    const back = {};   // the title each asked-for title ended up as (normalized, redirected)
    for (const n of [...(j.query.normalized || []), ...(j.query.redirects || [])]) back[n.to] = [...(back[n.to] || []), n.from];
    const origins = t => [t, ...(back[t] || []).flatMap(origins)];
    for (const p of Object.values(j.query.pages)) {
      const ll = p.langlinks?.[0]?.['*'];
      // Chinese Wikipedia is one wiki in two scripts: /zh-tw/ shows an article in Traditional characters, as Taiwan reads
      if (ll) for (const t of origins(p.title)) found[t] = `https://${lang}.wikipedia.org/${lang === 'zh' ? 'zh-tw' : 'wiki'}/${encodeURIComponent(ll.replace(/ /g, '_')).replace(/%2F/g, '/').replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%28/g, '(').replace(/%29/g, ')')}`;
    }
  }
  return found;
}
export const wikiTitle = url => { const m = url.match(/^https:\/\/en\.wikipedia\.org\/wiki\/([^#?]+)/); return m ? decodeURIComponent(m[1]).replace(/_/g, ' ') : null; };
