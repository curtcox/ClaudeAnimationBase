// check_refs.mjs: checks script/refs.yaml against the script and the web, and writes script/refs_report.md.
//   node tools/check_refs.mjs [--offline]
// For every reference:
//   - `at` resolves to a script line (an id, or the first spoken line in `ch` whose text contains the phrase)
//   - the URL answers (status, final URL after redirects, page <title>); --offline skips this
//   - the QR code it needs (feature cards at error correction H, which leaves room for a centre emblem; shelf tags
//     at Q), and the pixels per module at its display size; under 6 px/module it needs a short link (VIDEO_PLAN.md §4)
// And for the transcript: every link in it has a `transcript` reference anchored on the line that contains it.
// Exit 1 on a structural error (bad anchor, missing transcript link); dead links are reported, not fatal.
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { PATHS, readYaml, resolveAnchor, loadRefs } from './script_lib.mjs';

const qrcode = createRequire(import.meta.url)('qrcode-generator');
const REFS = 'script/refs.yaml', REPORT = 'script/refs_report.md';
const SIZE = { feature: 480, shelf: 380, board: 300 }, ECC = { feature: 'H', shelf: 'M', board: 'M' }, QUIET = 4, MIN_PX = 6;
const offline = process.argv.includes('--offline');

const refs = loadRefs(), lines = readYaml(PATHS.script).lines, chapters = readYaml(PATHS.chapters);
const errors = [], note = e => errors.push(e);
const byId = new Map(lines.map(l => [l.id, l]));

const seen = new Set();
for (const r of refs) {
  if (seen.has(r.id)) note(`duplicate id ${r.id}`); seen.add(r.id);
  for (const k of ['id', 'url', 'caption', 'origin', 'at', 'mode', 'style']) if (!r[k]) note(`${r.id}: missing ${k}`);
  if (!['transcript', 'attachment', 'added', 'note'].includes(r.origin)) note(`${r.id}: bad origin ${r.origin}`);
  if (!SIZE[r.mode] && r.mode !== 'page') note(`${r.id}: bad mode ${r.mode}`);
  r.line = resolveAnchor(r, lines, byId);
  if (!r.line) { note(`${r.id}: can't find line for at: ${JSON.stringify(r.at)}${r.ch == null ? ' (phrase needs ch)' : ''}`); continue; }
  if (r.cue && !r.line.text.includes(r.cue)) note(`${r.id}: cue ${JSON.stringify(r.cue)} isn't in ${r.line.id}`);
  if (r.origin === 'transcript' && !r.line.text.includes(r.url.replace(/^https:\/\//, ''))) note(`${r.id}: transcript link isn't on line ${r.line.id}`);
}
// every link in the transcript is covered
for (const l of lines) for (const { url } of l.refs || []) {
  const r = refs.find(r => r.url === url || (r.also || []).includes(url));
  if (!r) note(`transcript link on ${l.id} has no reference: ${url}`);
  else if (r.origin !== 'transcript') note(`${r.id}: its link is in the transcript (${l.id}), so origin should be transcript`);
}

// QR density
for (const r of refs) {
  const data = r.qr_url || r.url;
  if (!data || data === 'SHORT' || r.mode === 'page') continue;   // page: no code in the film
  const q = qrcode(0, r.ecc || ECC[r.mode]); q.addData(data); q.make();
  r.modules = q.getModuleCount(); r.version = (r.modules - 17) / 4;
  r.px = SIZE[r.mode] / (r.modules + 2 * QUIET);
}
// SHORT: what the direct URL would need, to show why
for (const r of refs.filter(r => r.qr_url === 'SHORT')) { const q = qrcode(0, ECC[r.mode]); q.addData(r.url); q.make(); r.directPx = SIZE[r.mode] / (q.getModuleCount() + 2 * QUIET); }

// the web
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';
async function probe(r) {
  if (offline || !/^https?:/.test(r.url) || r.origin === 'note') return;   // explainers aren't published yet
  try {
    const res = await fetch(r.url, { redirect: 'follow', headers: { 'user-agent': UA, accept: 'text/html,*/*' }, signal: AbortSignal.timeout(20000) });
    r.status = res.status; r.final = res.url;
    const body = (await res.text()).slice(0, 300000);
    const t = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    r.title = t ? t[1].replace(/\s+/g, ' ').trim().replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').slice(0, 110) : '';
  } catch (e) { r.status = 'ERR'; r.title = e.cause?.code || e.name; }
}
for (let i = 0; i < refs.length; i += 8) await Promise.all(refs.slice(i, i + 8).map(probe));

// report
const ok = r => r.status === 200;
const walled = r => [401, 403, 429, 999].includes(r.status);
const flag = r => [
  !offline && r.status && !ok(r) && !walled(r) ? `**${r.status}**` : '',
  walled(r) && !r.verified ? `bot wall (${r.status}): check in a browser` : '',
  r.qr_url === 'SHORT' ? `waiting for a short link (direct would be ${r.directPx.toFixed(1)} px/module)` : '',
  !offline && ok(r) && r.final && r.final.replace(/\/$/, '') !== r.url.replace(/\/$/, '') ? `redirects to ${r.final}` : '',
  r.px < MIN_PX ? `**needs short link** (${r.px.toFixed(1)} px/module)` : '',
  r.todo ? `todo: ${r.todo}` : '',
].filter(Boolean).join('; ');
const chOf = r => r.line?.ch ?? r.ch;
const counts = { transcript: 0, attachment: 0, added: 0, note: 0 }; for (const r of refs) counts[r.origin]++;
const problems = refs.filter(r => flag(r));
let md = `# References report

Generated by \`tools/check_refs.mjs\`${offline ? ' (offline: links not fetched)' : ` on ${new Date().toISOString().slice(0, 10)}`}. ${refs.length} references:
${counts.transcript} from the transcript (voiced as their titles), ${counts.attachment} from attached images, ${counts.note} explainer pages and ${counts.added} added for the
viewer (both code only). QR density with a ${QUIET}-module quiet zone: feature cards are ${SIZE.feature} px at error
correction ${ECC.feature}, shelf tags ${SIZE.shelf} px at ${ECC.shelf}, and ${MIN_PX} px/module is the floor.
${errors.length ? '\n## Errors\n\n' + errors.map(e => '- ' + e).join('\n') + '\n' : ''}
## Needs attention (${problems.length})

${problems.map(r => `- **${r.id}** (ch ${chOf(r)}): ${flag(r)}`).join('\n') || 'Nothing.'}
`;
for (const c of chapters) {
  const rs = refs.filter(r => chOf(r) === c.n);
  if (!rs.length) continue;
  md += `\n## ${c.n} ${c.title}\n\n| id | caption | origin | at | mode · style | QR | status | page title |\n|---|---|---|---|---|---|---|---|\n`;
  md += rs.map(r => `| ${r.id} | ${r.caption} | ${r.origin} | ${r.line?.id ?? '?'} | ${r.mode} · ${r.style} | ${r.modules ? `v${r.version}, ${r.px.toFixed(1)} px` : r.qr_url === 'SHORT' ? 'short link' : '—'} | ${r.status ?? '—'}${walled(r) && r.verified ? ` (${r.verified})` : ''} | ${(r.title || '').replace(/\|/g, '\\|')} |`).join('\n') + '\n';
}
writeFileSync(REPORT, md);
console.log(`${refs.length} refs, ${problems.length} need attention, ${errors.length} error(s); wrote ${REPORT}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
