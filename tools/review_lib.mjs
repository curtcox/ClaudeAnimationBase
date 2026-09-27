// review_lib.mjs: review notes pinned to moments in a chapter (Curt's notes, Claude's questions, and their replies).
// Stored per chapter in review/chNN.json; review/NOTES.md is the readable digest, rewritten on every change.
// Used by tools/serve.mjs (the watch page's notes panel) and tools/review.mjs (the command line).
//
// A note: { id, t (s into the chapter, or null for the whole chapter), line, shot, by: 'curt' | 'claude', text,
//           options (answers to pick from, for a question), point ([x, y] in 0..1 of the frame), frame (a still, under
//           review/frames/), status: 'open' | 'resolved', created, replies: [{ by, text, at }] }
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
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

// who a note is waiting on: whoever didn't have the last word (a resolved note waits on no one)
export function waitingOn(n) {
  if (n.status === 'resolved') return null;
  const last = (n.replies || []).at(-1);
  return (last ? last.by : n.by) === 'claude' ? 'curt' : 'claude';
}

// review/seen.json (not committed: it follows this machine's renders): how far Curt has watched each chapter's current
// draft, written by the watch page as it plays: the stretches played (jumps don't count as watching what they skip).
// A new render of the chapter starts it over.
const SEEN = `${DIR}/seen.json`;
const loadSeen = () => existsSync(SEEN) ? JSON.parse(readFileSync(SEEN, 'utf8')) : {};
export function draftOf(ch) {   // the video the watch page shows (tools/watch.mjs), and when it was rendered
  const w = `out/watch/ch${pad(ch)}.json`; if (!existsSync(w)) return null;
  const video = JSON.parse(readFileSync(w, 'utf8')).video; if (!existsSync(video)) return null;
  return { video, mtime: Math.round(statSync(video).mtimeMs) };
}
export function markSeen(ch, a, b) {   // [a, b]: a stretch just played without a jump, in seconds
  const d = draftOf(ch); if (!d || !(b > a)) return null;
  const all = loadSeen(), key = String(+ch), prev = all[key];
  const same = prev && prev.video === d.video && prev.mtime === d.mtime;
  const spans = [...(same ? prev.spans : []), [+a.toFixed(1), +b.toFixed(1)]].sort((x, y) => x[0] - y[0]), merged = [];
  for (const s of spans) { const m = merged.at(-1); if (m && s[0] <= m[1] + 1.5) m[1] = Math.max(m[1], s[1]); else merged.push([...s]); }
  all[key] = { ...d, spans: merged, at: new Date().toISOString() };
  mkdirSync(DIR, { recursive: true }); writeFileSync(SEEN, JSON.stringify(all, null, 1) + '\n');
  return all[key];
}

// every chapter at a glance, for the review index (tools/serve.mjs, /review/): what's waiting on Curt, what's waiting
// on Claude, and whether the current draft is new to him. Before seen.json knew a chapter, any note or reply of Curt's
// made after the draft was rendered counts as having watched it.
export function overview() {
  const chapters = readYaml(PATHS.chapters), seen = loadSeen();
  return chapters.map(c => {
    const doc = load(c.n), d = draftOf(c.n);
    let duration = null; try { duration = timeline(c.n).duration; } catch { }
    const s = seen[String(c.n)], current = s && d && s.video === d.video && s.mtime === d.mtime;
    const curtAt = Math.max(0, ...doc.notes.flatMap(n => [n.by === 'curt' ? Date.parse(n.created) : 0, ...(n.replies || []).filter(r => r.by === 'curt').map(r => Date.parse(r.at))]));
    // resume: the end of the stretch watched from the start; watched: all but a few seconds of it
    const spans = current ? s.spans : [], secs = spans.reduce((a, [x, y]) => a + y - x, 0), resume = spans[0]?.[0] <= 1.5 ? spans[0][1] : 0;
    const draft = d && { rendered: new Date(d.mtime).toISOString(), spans, seen: secs, resume,
      watched: current ? secs >= (duration || Infinity) - 5 : curtAt > d.mtime, started: !!current || curtAt > d.mtime };
    const brief = n => ({ id: n.id, t: n.t, line: n.line, shot: n.shot, by: n.by, text: n.text, options: n.options, replies: n.replies || [] });
    return { n: c.n, title: c.title, duration, draft,
      forCurt: doc.notes.filter(n => waitingOn(n) === 'curt').map(brief),
      forClaude: doc.notes.filter(n => waitingOn(n) === 'claude').map(brief),
      resolved: doc.notes.filter(n => n.status === 'resolved').length };
  });
}
