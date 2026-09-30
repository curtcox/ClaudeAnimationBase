// lost.mjs: the translation's own pages, in the language and in English (i18n/PLAN.md), on the language's site:
//   traduccion/         how the film was translated, how else it could have been, what a freer translation would have
//                       said, line by line (every `lost` note in the translation), and how to judge it
//   traduccion/texto/   the whole film, English and translation side by side, line by line
//   node i18n/tools/lost.mjs [--lang=es]      → i18n/<lang>/stage/site/public/traduccion/ (run stage.mjs first)
// The prose is i18n/<lang>/traduccion.yaml; the notes are each line's `lost` (i18n/<lang>/script/chNN.yaml), the cold
// open's balloons' (cold_open.yaml) and the film-wide ones (traduccion.yaml's `notes`). Numbers are counted here.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { marked } from 'marked';
import { translations, readYaml, optYaml, dirOf, langOf, args, pad } from './i18n_lib.mjs';

const lang = langOf(args), L = dirOf(lang), S = `${L}/stage`, OUT = `${S}/site/public/traduccion`;
const P = readYaml(`${L}/traduccion.yaml`), tr = translations(lang);
const en = readYaml('script/script.yaml').lines, es = new Map(readYaml(`${S}/script/script.yaml`).lines.map(l => [l.id, l]));
const chapters = readYaml('script/chapters.yaml'), titles = optYaml(`${L}/chapters.yaml`, {});
const page = optYaml(`${L}/cold_open.yaml`, {}), balloonsEn = readYaml('script/cold_open.yaml');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const md = s => marked.parseInline(String(s ?? ''));
const mdb = s => marked.parse(String(s ?? ''));
const K = P.kinds;   // { kind: { es, en } }

// ---- the notes, in film order ----
const notes = [];
for (const n of P.notes || []) notes.push({ ch: n.ch ?? null, id: n.where, src: n.original, ours: n.ours, ...n });
for (const b of balloonsEn) for (const x of page[b.balloon]?.lost || []) notes.push({ ch: 0, id: `MAD.${b.balloon}`, src: b.say.replace(/^\[[^\]]*\]\s*/, ''), ours: page[b.balloon].say.replace(/^\[[^\]]*\]\s*/, ''), ...x });
for (const l of en) for (const x of tr[l.id]?.lost || []) notes.push({ ch: l.ch, id: l.id, src: l.text, ours: tr[l.id].text, ...x });
for (const x of notes) if (!K[x.what]) throw new Error(`${x.id}: no kind "${x.what}" in traduccion.yaml`);

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
@media (max-width:720px){.pair,.texts{grid-template-columns:1fr}main{padding:1rem 16px 3rem}td.id{white-space:normal}}`;
const html = (title, body, depth) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${CSS}</style></head><body><main>${body}</main></body></html>\n`;
const pair = (a, b) => `<div class="pair"><div lang="${lang}"><p class="lang">${esc(P.labels.lang_es)}</p>${mdb(fill(a))}</div><div lang="en"><p class="lang">English</p>${mdb(fill(b))}</div></div>`;
const chName = n => n == null ? `${P.labels.film_es} / ${P.labels.film_en}` : `${n}. ${titles[n] ?? ''} / ${chapters.find(c => c.n === n)?.title ?? ''}`;

const items = notes.map(x => `<div class="item"><span class="kind">${esc(K[x.what].es)} · ${esc(K[x.what].en)}</span><span class="id">${esc(x.id || '')}</span>
<div class="texts"><div lang="en"><p class="lang">${esc(P.labels.original)}</p>${md(x.src)}</div><div lang="${lang}"><p class="lang">${esc(P.labels.ours)}</p>${md(x.ours)}</div>
<div class="free" lang="${lang}"><p class="lang">${esc(P.labels.free)}</p>${md(x.free ?? '—')}</div></div>${pair(x.es, x.en)}</div>`);
const byCh = [...new Set(notes.map(x => x.ch))].map(c => `<h3>${esc(chName(c))}</h3>${notes.map((x, i) => x.ch === c ? items[i] : '').join('')}`).join('');
const kinds = Object.entries(K).map(([k, v]) => [k, v, notes.filter(x => x.what === k).length]).filter(([, , n]) => n);

const body = `<h1 lang="${lang}">${esc(P.title.es)}</h1><p class="lang" style="font-size:1rem;text-transform:none;letter-spacing:0">${esc(P.title.en)}</p>
${P.sections.map(s => `<h2>${esc(s.es_title)} <span class="count">/ ${esc(s.en_title)}</span></h2>${pair(s.es, s.en)}`).join('\n')}
<h2>${esc(P.labels.kinds_es)} <span class="count">/ ${esc(P.labels.kinds_en)}</span></h2>
<ul>${kinds.map(([k, v, n]) => `<li><strong>${esc(v.es)}</strong> / ${esc(v.en)}: <span class="count">${n}</span><br>${md(v.what_es)}<br><em>${md(v.what_en)}</em></li>`).join('')}</ul>
<h2>${esc(P.labels.list_es)} <span class="count">/ ${esc(P.labels.list_en)}</span></h2>${pair(P.list_intro.es, P.list_intro.en)}${byCh}`;
mkdirSync(`${OUT}/texto`, { recursive: true });
writeFileSync(`${OUT}/index.html`, html(`${P.title.es} / ${P.title.en}`, body, 1));

// ---- the whole text, side by side ----
const row = (id, a, b) => `<tr><td class="id">${esc(id)}</td><td lang="en">${md(a)}</td><td lang="${lang}">${b == null ? '<em>—</em>' : md(b)}</td></tr>`;
const text = chapters.map(c => `<h2>${esc(chName(c.n))}</h2><table><tr><th></th><th>English</th><th>${esc(P.labels.lang_es)}</th></tr>
${(c.n === 0 ? balloonsEn.map(b => row(`MAD.${b.balloon}`, b.say.replace(/^\[[^\]]*\]\s*/, ''), page[b.balloon]?.say.replace(/^\[[^\]]*\]\s*/, ''))) : []).join('')}
${en.filter(l => l.ch === c.n).map(l => row(l.id, l.text, tr[l.id]?.text)).join('')}</table>`).join('');
writeFileSync(`${OUT}/texto/index.html`, html(`${P.text_title.es} / ${P.text_title.en}`, `<p><a href="../">← ${esc(P.title.es)}</a></p>
<h1 lang="${lang}">${esc(P.text_title.es)}</h1><p class="lang" style="font-size:1rem;text-transform:none;letter-spacing:0">${esc(P.text_title.en)}</p>${pair(P.text_intro.es, P.text_intro.en)}${text}`, 2));
console.log(`${OUT}/: ${notes.length} notes; ${done.length}/${en.length} lines translated; the voice ${longer ?? '?'}% longer over ${both.length} lines`);
