// lost.mjs: the translation's own pages, in the language and in English (i18n/PLAN.md), on the language's site:
//   traduccion/         (the language's word for it: the prose's `slug`) how the film was translated, how else it could have been, what a freer translation would have
//                       said, line by line (every `lost` note in the translation), and how to judge it
//   traduccion/texto/   (`text_slug`) the whole film, English and translation side by side, line by line
//   node i18n/tools/lost.mjs [--lang=es]      → i18n/<lang>/stage/site/public/traduccion/ (run stage.mjs first)
// The prose is i18n/<lang>/translation.yaml (Spanish: traduccion.yaml), its texts keyed by the language's code and en; the notes are each line's `lost` (i18n/<lang>/script/chNN.yaml), the cold
// open's balloons' (cold_open.yaml) and the film-wide ones (traduccion.yaml's `notes`). Numbers are counted here.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { marked } from 'marked';
import { translations, readYaml, optYaml, dirOf, langOf, args, pad } from './i18n_lib.mjs';

const lang = langOf(args), L = dirOf(lang), S = `${L}/stage`;
const P = readYaml([`${L}/translation.yaml`, `${L}/traduccion.yaml`].find(existsSync)), tr = translations(lang);
const OUT = `${S}/site/public/${P.slug ?? 'traduccion'}`, TEXT = P.text_slug ?? 'texto', HL = P.html_lang ?? lang;
const en = readYaml('script/script.yaml').lines, es = new Map(readYaml(`${S}/script/script.yaml`).lines.map(l => [l.id, l]));
const chapters = readYaml('script/chapters.yaml'), titles = optYaml(`${L}/chapters.yaml`, {});
const page = optYaml(`${L}/cold_open.yaml`, {}), balloonsEn = readYaml('script/cold_open.yaml');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// bold and italics touching Chinese or Japanese become HTML first, as on the rest of the site (tools/build_site.mjs)
const CJK = /[　-ヿ㐀-鿿豈-﫿＀-￯가-힯]/;   // Hangul too, as in tools/build_site.mjs
const cjkEmphasis = s => s.replace(/(\*\*|\*)(?=[^\s*])([^*\n]*?[^\s*])\1/g, (m, d, x, at) => CJK.test(x + (s[at - 1] || '') + (s[at + m.length] || '')) ? (d === '**' ? `<strong>${x}</strong>` : `<em>${x}</em>`) : m);
const md = s => marked.parseInline(cjkEmphasis(String(s ?? '')));
const mdb = s => marked.parse(cjkEmphasis(String(s ?? '')));
const K = P.kinds;   // { kind: { es, en } }

// ---- the notes, in film order ----
const notes = [];
for (const n of P.notes || []) notes.push({ ch: n.ch ?? null, id: n.where, src: n.original, ours: n.ours, ...n });
for (const b of balloonsEn) for (const x of page[b.balloon]?.lost || []) notes.push({ ch: 0, id: `MAD.${b.balloon}`, src: b.say.replace(/^\[[^\]]*\]\s*/, ''), ours: page[b.balloon].say.replace(/^\[[^\]]*\]\s*/, ''), ...x });
for (const l of en) for (const x of tr[l.id]?.lost || []) notes.push({ ch: l.ch, id: l.id, src: l.text, ours: tr[l.id].text, ...x });
for (const x of notes) if (!K[x.what]) throw new Error(`${x.id}: no kind "${x.what}" in the translation's prose`);

// ---- what's counted ----
const done = en.filter(l => tr[l.id]?.text), anchors = Object.values(tr).reduce((a, t) => a + Object.keys(t.anchors || {}).length, 0);
const dEn = JSON.parse(readFileSync('audio/durations.json', 'utf8')), dEs = existsSync(`${S}/audio/durations.json`) ? JSON.parse(readFileSync(`${S}/audio/durations.json`, 'utf8')) : {};
const both = Object.keys(dEs).filter(id => dEn[id] != null && tr[id]);
const secs = ids => ids.reduce((a, id) => a + dEs[id], 0), secsEn = ids => ids.reduce((a, id) => a + dEn[id], 0);
const longer = both.length ? Math.round((secs(both) / secsEn(both) - 1) * 100) : null;
const vars = {
  lines: `${done.length}`, total: `${en.length}`, anchors: `${anchors}`, notes: `${notes.length}`,
  longer: longer == null ? '?' : `${longer}`, voiced: `${both.length}`,
  chapters_done: [...new Set(done.map(l => l.ch))].join(', '),
};
const fill = s => String(s ?? '').replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);

// ---- the page ----
const CSS = `body{margin:0;background:#FBF8F0;color:#1E1A22;font:19px/1.6 Georgia,"Times New Roman",serif}
main{max-width:64rem;margin:0 auto;padding:1.5rem 1rem 4rem}h1{font-size:1.9rem;line-height:1.2;margin:.5rem 0 1rem}
h2{font-size:1.35rem;margin:2.4rem 0 .6rem;border-top:1px solid #D9D2C4;padding-top:1.2rem}h3{font-size:1.1rem;margin:1.6rem 0 .4rem}a{color:#8A3A22}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:1.6rem}.pair>div>:first-child{margin-top:0}
.lang{font:600 .72rem/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#8A8490;margin:0 0 .4rem}
.note{background:#F4EEDF;border-radius:12px;padding:.6rem 1rem;font-size:.95rem}
.item{margin:1.1rem 0;padding:.8rem 1rem;background:#FFF;border-radius:12px;border:1px solid #EBE3D3}
.item .kind{font:600 .75rem system-ui,sans-serif;color:#8A3A22;text-transform:uppercase;letter-spacing:.05em}
.item .id{font:.75rem system-ui,sans-serif;color:#8A8490;margin-left:.5rem}
.texts{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;margin:.5rem 0;font-size:.9rem}
.texts>div{background:#FBF8F0;border-radius:8px;padding:.4rem .6rem}.texts .lang{margin-bottom:.25rem}
.free{background:#FFF1CE!important}table{border-collapse:collapse;font-size:.9rem;width:100%}
td,th{border-bottom:1px solid #D9D2C4;padding:.4rem .5rem;text-align:left;vertical-align:top}th{font:600 .8rem system-ui,sans-serif;color:#6A6470}
td.id{font:.72rem system-ui,sans-serif;color:#8A8490;white-space:nowrap}ul{padding-left:1.2rem}li{margin:.3rem 0}
.count{font:600 .85rem system-ui,sans-serif;color:#6A6470}
.home{display:inline-block;margin:.2rem 0 .4rem;border-radius:8px;line-height:0}.home img{width:200px;height:auto;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,.2)}
.home:hover img,.home:focus img{box-shadow:0 0 0 3px #8A3A22}
@media (max-width:720px){.pair,.texts{grid-template-columns:1fr}main{padding:1rem 16px 3rem}td.id{white-space:normal}}`;
// the site's thumbnail, back to the front page, as on every page of the site (tools/build_site.mjs)
const SITE_T = optYaml(`${dirOf(lang)}/site_strings.yaml`, {});
const home = depth => existsSync(`${S}/site/thumbnail.jpg`) ? `<a class="home" href="${'../'.repeat(depth)}"><img src="${'../'.repeat(depth)}thumbnail.jpg" width="480" height="270" alt="${esc(String(SITE_T.home_alt || '{title}').replace('{title}', SITE_T.film_title || 'Frog or Axolotl'))}"></a>` : '';
const html = (title, body, depth) => `<!doctype html><html lang="${HL}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${CSS}</style></head><body><main>${home(depth)}${body}</main></body></html>\n`;
const pair = (a, b) => `<div class="pair"><div lang="${HL}"><p class="lang">${esc(P.labels[`lang_${lang}`])}</p>${mdb(fill(a))}</div><div lang="en"><p class="lang">English</p>${mdb(fill(b))}</div></div>`;
const chName = n => n == null ? `${P.labels[`film_${lang}`]} / ${P.labels.film_en}` : `${n}. ${titles[n] ?? ''} / ${chapters.find(c => c.n === n)?.title ?? ''}`;

const items = notes.map(x => `<div class="item"><span class="kind">${esc(K[x.what][lang])} · ${esc(K[x.what].en)}</span><span class="id">${esc(x.id || '')}</span>
<div class="texts"><div lang="en"><p class="lang">${esc(P.labels.original)}</p>${md(x.src)}</div><div lang="${HL}"><p class="lang">${esc(P.labels.ours)}</p>${md(x.ours)}</div>
<div class="free" lang="${HL}"><p class="lang">${esc(P.labels.free)}</p>${md(x.free ?? '—')}</div></div>${pair(x[lang], x.en)}</div>`);
const byCh = [...new Set(notes.map(x => x.ch))].map(c => `<h3>${esc(chName(c))}</h3>${notes.map((x, i) => x.ch === c ? items[i] : '').join('')}`).join('');
const kinds = Object.entries(K).map(([k, v]) => [k, v, notes.filter(x => x.what === k).length]).filter(([, , n]) => n);

const body = `<h1 lang="${HL}">${esc(P.title[lang])}</h1><p class="lang" style="font-size:1rem;text-transform:none;letter-spacing:0">${esc(P.title.en)}</p>
${P.sections.map(s => `<h2>${esc(s[`${lang}_title`])} <span class="count">/ ${esc(s.en_title)}</span></h2>${pair(s[lang], s.en)}`).join('\n')}
<h2>${esc(P.labels[`kinds_${lang}`])} <span class="count">/ ${esc(P.labels.kinds_en)}</span></h2>
<ul>${kinds.map(([k, v, n]) => `<li><strong>${esc(v[lang])}</strong> / ${esc(v.en)}: <span class="count">${n}</span><br>${md(v[`what_${lang}`])}<br><em>${md(v.what_en)}</em></li>`).join('')}</ul>
<h2>${esc(P.labels[`list_${lang}`])} <span class="count">/ ${esc(P.labels.list_en)}</span></h2>${pair(P.list_intro[lang], P.list_intro.en)}${byCh}`;
mkdirSync(`${OUT}/${TEXT}`, { recursive: true });
writeFileSync(`${OUT}/index.html`, html(`${P.title[lang]} / ${P.title.en}`, body, 1));

// ---- the whole text, side by side ----
const row = (id, a, b) => `<tr><td class="id">${esc(id)}</td><td lang="en">${md(a)}</td><td lang="${HL}">${b == null ? '<em>—</em>' : md(b)}</td></tr>`;
const text = chapters.map(c => `<h2>${esc(chName(c.n))}</h2><table><tr><th></th><th>English</th><th>${esc(P.labels[`lang_${lang}`])}</th></tr>
${(c.n === 0 ? balloonsEn.map(b => row(`MAD.${b.balloon}`, b.say.replace(/^\[[^\]]*\]\s*/, ''), page[b.balloon]?.say.replace(/^\[[^\]]*\]\s*/, ''))) : []).join('')}
${en.filter(l => l.ch === c.n).map(l => row(l.id, l.text, tr[l.id]?.text)).join('')}</table>`).join('');
writeFileSync(`${OUT}/${TEXT}/index.html`, html(`${P.text_title[lang]} / ${P.text_title.en}`, `<p><a href="../">← ${esc(P.title[lang])}</a></p>
<h1 lang="${HL}">${esc(P.text_title[lang])}</h1><p class="lang" style="font-size:1rem;text-transform:none;letter-spacing:0">${esc(P.text_title.en)}</p>${pair(P.text_intro[lang], P.text_intro.en)}${text}`, 2));
// Japanese and Hindi use no italics (a browser can only slant the glyphs): on those sites, quotations stand upright
// and emphasis is bold (sesame dots, 傍点, would land on the English titles and terms set in italics too), in the
// site's stylesheet, which the builder wrote just before
if (/^(ja|zh|ko|hi)\b/.test(lang) && existsSync(`${S}/site/public/style.css`))
  writeFileSync(`${S}/site/public/style.css`, readFileSync(`${S}/site/public/style.css`, 'utf8').replace(/\n?\/\* cjk \*\/.*$/s, '') +
    '\n/* cjk */ blockquote,.mnote,i,em{font-style:normal} em{font-weight:600}\n');
console.log(`${OUT}/: ${notes.length} notes; ${done.length}/${en.length} lines translated; the voice ${longer ?? '?'}% longer over ${both.length} lines`);
