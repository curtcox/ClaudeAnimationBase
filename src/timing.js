// timing.js: what a chapter scene asks of its timeline (src/gen/chNN.js, from tools/timeline.mjs). Everything is by line
// id, so a scene never hard-codes a time: when the real voice replaces the estimates, every shot follows.
//   L('T08.C.02')            the line: { t0, t1 (speech), end (next line starts), text, speech, refs, speaker, kind }
//   at('T08.C.02', .5)       a time inside that line (0 = its start, 1 = its end of speech; > 1 runs into the gap)
//   lineAt(t)                the line playing at t (the last one that has started)
//   talkOf(t, 'claude')      0..1 mouth openness for a speaker at t (talk() over each of their spoken lines)
//   within(t, 'T08.C.02', 'T08.C.04')   0..1 progress from the start of one line to the start of another (or its end)
const CH_LINES = window.CHAPTER ? CHAPTER.lines : [];
const CH_BY_ID = new Map(CH_LINES.map(l => [l.id, l]));
function L(id) { const l = CH_BY_ID.get(id); if (!l) throw new Error(`no line ${id} in this chapter`); return l; }
const at = (id, k = 0) => { const l = L(id); return l.t0 + (l.t1 - l.t0) * k; };
function lineAt(t) { let cur = null; for (const l of CH_LINES) { if (l.t0 <= t) cur = l; else break; } return cur; }
function talkOf(t, speaker) {
  const l = lineAt(t);
  return l && l.spoken && l.speaker === speaker ? talk(t, l.t0, l.t1) : 0;
}
const within = (t, a, b) => seg(t, L(a).t0, b ? L(b).t0 : L(a).end);
