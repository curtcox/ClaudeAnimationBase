// review_lib.mjs: review notes pinned to moments in a chapter (Curt's notes, Claude's questions, and their replies).
// Stored per chapter in review/chNN.json; review/NOTES.md is the readable digest, rewritten on every change.
// Used by tools/serve.mjs (the watch page's notes panel) and tools/review.mjs (the command line).
//
// A note: { id, t (s into the chapter, or null for the whole chapter), line, shot, by: 'curt' | 'claude', text,
//           options (answers to pick from, for a question), point ([x, y] in 0..1 of the frame), frame (a still, under
//           review/frames/), status: 'open' | 'resolved', created, replies: [{ by, text, at }] }
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { readYaml, PATHS, pad } from './script_lib.mjs';

export const DIR = 'review';
const file = ch => `${DIR}/ch${pad(ch)}.json`;
export const newId = () => 'n' + Date.now().toString(36) + Math.floor(Math.random() * 36 ** 2).toString(36);
export const stamp = t => t == null ? 'whole chapter' : `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;

export function load(ch) {
  return existsSync(file(ch)) ? JSON.parse(readFileSync(file(ch), 'utf8')) : { chapter: +ch, notes: [] };
}
export function save(ch, doc) {
  mkdirSync(DIR, { recursive: true });
  doc.notes.sort((a, b) => (a.t ?? -1) - (b.t ?? -1));
  writeFileSync(file(ch), JSON.stringify(doc, null, 1) + '\n');
  writeDigest();
}

// the chapter's timeline (src/gen/chNN.js): its lines, for placing a note by line id and naming the line at a time
export function timeline(ch) {
  const g = {}; new Function('window', readFileSync(`src/gen/ch${pad(ch)}.js`, 'utf8'))(g); return g.CHAPTER;
}
export function lineAt(C, t) { let cur = null; for (const l of C.lines) { if (l.t0 <= t) cur = l; else break; } return cur; }

// review/NOTES.md: every chapter's notes, open ones first, each with its moment, line and shot
export function writeDigest() {
  const chapters = readYaml(PATHS.chapters), files = existsSync(DIR) ? readdirSync(DIR).filter(f => /^ch\d\d\.json$/.test(f)).sort() : [];
  let md = `# Review notes\n\nWritten by the watch page's notes panel (\`npm run serve\`) and \`npm run review\`; do not edit by hand.\n`;
  const counts = { open: 0, resolved: 0 };
  for (const f of files) {
    const doc = JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')); if (!doc.notes.length) continue;
    const c = chapters.find(x => x.n === doc.chapter);
    md += `\n## ${doc.chapter}. ${c ? c.title : ''}\n`;
    for (const status of ['open', 'resolved']) for (const n of doc.notes.filter(n => (n.status || 'open') === status)) {
      counts[status]++;
      md += `\n- **${stamp(n.t)}**${n.line ? ` · ${n.line}` : ''}${n.shot ? ` · shot ${n.shot}` : ''} · ${n.by === 'claude' ? 'Claude asks' : 'Curt'}${status === 'resolved' ? ' · ✓ resolved' : ''} \`${n.id}\`\n`;
      md += `  ${n.text.replace(/\n/g, '\n  ')}\n`;
      if (n.options?.length) md += `  Options: ${n.options.map(o => `“${o}”`).join(' · ')}\n`;
      if (n.point) md += `  Pointing at ${Math.round(n.point[0] * 100)}% across, ${Math.round(n.point[1] * 100)}% down\n`;
      if (n.frame) md += `  [the frame](${n.frame})\n`;
      for (const r of n.replies || []) md += `  - ${r.by === 'claude' ? 'Claude' : 'Curt'}: ${r.text.replace(/\n/g, ' ')}\n`;
    }
  }
  md += `\n---\n${counts.open} open, ${counts.resolved} resolved.\n`;
  mkdirSync(DIR, { recursive: true });
  writeFileSync(`${DIR}/NOTES.md`, md);
}
