// review.mjs: review notes from the command line (the watch page's notes panel writes the same files; see review_lib.mjs).
//   npm run review                                          every open note, all chapters (what's waiting on whom)
//   npm run review -- --all                                 resolved ones too
//   npm run review -- ask --chapter=2 --at=T09.C.03 [--dt=2] "question" [--options="A|B|C"]
//   npm run review -- ask --chapter=2 --t=129.5 "question"  (or neither --at nor --t: about the whole chapter)
//   npm run review -- reply --chapter=2 --id=n… "text"      npm run review -- resolve --chapter=2 --id=n…
// --at is resolved to a time now (the line's start, plus --dt); the line id is kept with it, for when timings change.
import { load, save, newId, stamp, timeline, lineAt, writeDigest, DIR } from './review_lib.mjs';
import { readdirSync, existsSync, readFileSync } from 'node:fs';

const argv = process.argv.slice(2), cmd = argv[0] && !argv[0].startsWith('--') ? argv.shift() : 'list';
const args = {}, words = [];
for (const a of argv) { const m = a.match(/^--([^=]+)(?:=(.*))?$/); if (m) args[m[1]] = m[2] ?? true; else words.push(a); }
const text = words.join(' ').trim(), ch = args.chapter != null ? +args.chapter : null;
const need = (ok, msg) => { if (!ok) { console.error(msg); process.exit(1); } };

if (cmd === 'list') {
  const files = existsSync(DIR) ? readdirSync(DIR).filter(f => /^ch\d\d\.json$/.test(f)).sort() : [];
  let n = 0;
  for (const f of files) {
    const doc = load(+f.slice(2, 4)); if (ch != null && doc.chapter !== ch) continue;
    for (const note of doc.notes) {
      if (!args.all && note.status === 'resolved') continue;
      const last = (note.replies || []).at(-1), waiting = last ? (last.by === 'claude' ? 'curt' : 'claude') : (note.by === 'claude' ? 'curt' : 'claude');
      console.log(`ch ${doc.chapter} ${stamp(note.t).padStart(6)} ${(note.line || '').padEnd(11)} ${note.shot ? 'shot ' + note.shot : '      '}  ${note.by === 'claude' ? 'Q ' : 'C '} ${note.id}  [${note.status === 'resolved' ? 'resolved' : 'waiting on ' + waiting}]`);
      console.log(`     ${note.text.replace(/\n/g, '\n     ')}`);
      if (note.options?.length) console.log(`     options: ${note.options.join(' | ')}`);
      if (note.point) console.log(`     pointing at ${Math.round(note.point[0] * 100)}%, ${Math.round(note.point[1] * 100)}%${note.frame ? `  (${DIR}/${note.frame})` : ''}`);
      for (const r of note.replies || []) console.log(`     ↳ ${r.by === 'claude' ? 'Claude' : 'Curt'}: ${r.text.replace(/\n/g, ' ')}`);
      n++;
    }
  }
  console.log(n ? `\n${n} note(s). Digest: ${DIR}/NOTES.md` : 'no open notes');
} else if (cmd === 'ask') {
  need(ch != null && text, 'usage: review ask --chapter=N [--at=LINE [--dt=s] | --t=s] "question" [--options="A|B"]');
  const C = timeline(ch);
  let t = null, line = null;
  if (args.at) { const l = C.lines.find(l => l.id === args.at); need(l, `no line ${args.at} in chapter ${ch}`); t = l.t0 + (+args.dt || 0); line = l.id; }
  else if (args.t != null) { t = +args.t; line = lineAt(C, t)?.id ?? null; }
  // the shot, from the watch page's data (tools/watch.mjs), when it's been built
  const W = `out/watch/ch${String(ch).padStart(2, '0')}.json`, shots = existsSync(W) ? JSON.parse(readFileSync(W, 'utf8')).shots || [] : [];
  const shot = args.shot || (t == null ? null : shots.filter(s => s.t0 <= t).at(-1)?.name || null);
  const doc = load(ch), note = { id: newId(), t: t == null ? null : +t.toFixed(2), line, shot, by: 'claude', text,
    options: args.options ? String(args.options).split('|').map(s => s.trim()).filter(Boolean) : undefined, status: 'open', created: new Date().toISOString(), replies: [] };
  doc.notes.push(note); save(ch, doc);
  console.log(`asked ${note.id} at ${stamp(note.t)} in chapter ${ch}`);
} else if (cmd === 'reply' || cmd === 'resolve' || cmd === 'reopen') {
  need(ch != null && args.id, `usage: review ${cmd} --chapter=N --id=ID${cmd === 'reply' ? ' "text"' : ''}`);
  const doc = load(ch), note = doc.notes.find(n => n.id === args.id); need(note, `no note ${args.id} in chapter ${ch}`);
  if (cmd === 'reply') { need(text, 'reply with what?'); (note.replies ||= []).push({ by: 'claude', text, at: new Date().toISOString() }); }
  else note.status = cmd === 'resolve' ? 'resolved' : 'open';
  save(ch, doc); console.log(`${cmd === 'reply' ? 'replied to' : cmd + 'd'} ${note.id}`);
} else if (cmd === 'digest') { writeDigest(); console.log(`wrote ${DIR}/NOTES.md`); }
else need(false, `unknown command ${cmd}: list, ask, reply, resolve, reopen, digest`);
