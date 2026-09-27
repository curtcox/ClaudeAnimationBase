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

// ---------- over every shot: the reference rail, and review captions ----------
// The rail: every shelf reference anchored in this chapter, scheduled automatically onto two slots down the right edge
// (each held REF_HOLD s, arriving just after its line starts, never two in the same slot at once). Feature references are
// the scenes' job (qrFeature). A shot can move the rail or hide it: RAIL.side = 'left' | 'right' | 'none' while it draws.
const REF_HOLD = 6.5, RAIL = { side: 'right' };
const RAIL_PLAN = (() => {
  if (!window.CHAPTER || !window.REFS) return [];
  const free = [0, 0], plan = [];
  for (const l of CH_LINES) for (const id of l.refs) {
    const r = REFS[id]; if (!r || r.mode !== 'shelf' || (r.qr_url || r.url) === 'SHORT') continue;
    const want = l.t0 + .4, slot = free[0] <= free[1] ? 0 : 1, t0 = Math.max(want, free[slot]);
    plan.push({ id, slot, t0 }); free[slot] = t0 + REF_HOLD + .3;
  }
  return plan;
})();
function refRail(t) {
  if (RAIL.side === 'none') return;
  for (const p of RAIL_PLAN) {
    if (t < p.t0 || t > p.t0 + REF_HOLD) continue;
    const R = REFS[p.id], half = Math.max(215, (qrStyle(qrStyleFor(R.style)).extent ?? .64) * 380 + 20);
    const k = seg(t, p.t0, p.t0 + .45), out = seg(t, p.t0 + REF_HOLD - .35, p.t0 + REF_HOLD);
    const side = RAIL.side === 'left' ? -1 : 1, x = (side > 0 ? W - half - 24 : half + 24) + side * ease(out) * (half * 2 + 60);
    const y = p.slot ? H - half - 34 : half + 14;
    boilSeed('rail ' + p.id);
    paint(rrPts(x - half, y - half, half * 2, half * 2 + 34, 20), { wash: PAL.paper, washOp: 245 * clamp(k * 2), ink: PAL.ink, sw: 1.2 });
    refQR(R, x, y - 14, 380, { k, t, captionOpts: { size: 24 } });
  }
}
// Review captions (studio.html?review=1, render.mjs --review): the words being said, a sentence at a time, so the picture can
// be judged against them before the real voice exists. Never in the film.
const REVIEW = /[?&]review=1/.test(location.search);
const plainText = s => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*|\*|_\[|\]_|^- |^> /gm, '').replace(/\s+/g, ' ').trim();
function reviewCaption(t) {
  const l = lineAt(t); if (!l || !l.spoken || t > l.end) return;
  // sentences: split after . ! ? (and any closing quote) followed by a space and a capital, but not after vs. e.g. i.e. Dr. Lt.
  const txt = plainText(l.text).replace(/\b(vs|e\.g|i\.e|Dr|Lt|Mr|Ms|St)\./g, '$1\u2024');
  const sentences = txt.split(/(?<=[.!?]["”)]*)\s+(?=["“(]?[A-Z0-9])/).map(x => x.replace(/\u2024/g, '.'));
  const total = sentences.reduce((a, s) => a + s.length, 0); let acc = 0, cur = sentences[0];
  for (const s of sentences) { if ((t - l.t0) / Math.max(.01, l.t1 - l.t0) * total >= acc) cur = s; acc += s.length; }
  const words = cur.trim().split(' '), rows = [''];
  for (const w of words) { if ((rows[rows.length - 1] + ' ' + w).length > 62) rows.push(w); else rows[rows.length - 1] = (rows[rows.length - 1] + ' ' + w).trim(); }
  const who = l.speaker === 'curt' ? 'CURT' : 'CLAUDE', col = l.speaker === 'curt' ? '#2F5C8A' : '#A84D33', y0 = H - 40 - rows.length * 46;
  boilSeed('caption');
  paint(rrPts(40, y0 - 44, 1360, rows.length * 46 + 64, 14), { wash: '#FBF8F0', washOp: 225, ink: null });
  letter(who, 64, y0 - 16, 22, col, { ink: false, align: 'left', screen: true, font: 'bold 22px "Helvetica Neue", Arial, sans-serif' });
  rows.forEach((r, i) => letter(r, 64, y0 + 20 + i * 46, 36, '#1E1A22', { ink: false, align: 'left', screen: true, font: '36px "Helvetica Neue", Arial, sans-serif' }));
}
window.AFTER_SHOT = t => { if (window.CHAPTER) refRail(t); if (REVIEW) reviewCaption(t); };
