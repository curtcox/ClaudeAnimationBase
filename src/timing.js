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
// The rail: every shelf reference anchored in this chapter gets a code, held REF_HOLD s from just after its line starts
// (or its cue, a phrase in the line, is said),
// placed by the layout pass (layout.js) where it covers the least content over its whole time on screen. Feature
// references are the scenes' job (qrFeature), and they repel shelf codes. A shot can hide the rail: RAIL.side = 'none'.
const REF_HOLD = 6.5, RAIL = { side: 'right' };
let RAIL_PLAN = null;
function railPlan() {
  if (RAIL_PLAN) return RAIL_PLAN;
  const items = [];
  if (window.CHAPTER && window.REFS) for (const l of CH_LINES) for (const id of l.refs) {
    const r = REFS[id]; if (!r || r.mode !== 'shelf' || (r.qr_url || r.url) === 'SHORT') continue;
    items.push({ id, t0: (r.cue ? atWord(l.id, r.cue) : l.t0) + .4, hold: REF_HOLD, half: Math.max(215, (shelfFramed(r) ? qrStyle(qrStyleFor(r.style)).extent ?? .64 : .5) * 380 + 20) });
  }
  return (RAIL_PLAN = planLayout(items.sort((a, b) => a.t0 - b.t0)));   // first said, first placed
}
function refRail(t) {
  if (RAIL.side === 'none') return;
  for (const p of railPlan()) {
    if (t < p.t0 || t > p.t0 + p.hold) continue;
    const R = REFS[p.id], half = p.half, k = seg(t, p.t0, p.t0 + .45), out = seg(t, p.t0 + p.hold - .35, p.t0 + p.hold);
    const x = p.x, y = p.y + ease(out) * 30;
    boilSeed('rail ' + p.id);
    paint(rrPts(x - half, y - half, half * 2, half * 2 + 34, 20), { wash: PAL.paper, washOp: 245 * clamp(k * 2) * (1 - out), ink: PAL.ink, sw: 1.2 });
    if (out < .8) refQR(R, x, y - 14, 380, { k, t, captionOpts: { size: 24, noOcc: true } });
  }
}
// Review captions (studio.html?review=1, render.mjs --review): the words being said, a sentence at a time, so the picture can
// be judged against them before the real voice exists. Never in the film.
const REVIEW = /[?&]review=1/.test(location.search);
const plainText = s => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*|\*|_\[|\]_|^- |^> /gm, '').replace(/\s+/g, ' ').trim();
// how dark the picture is under a box, 0 (paper) to 1 (night), read back from the frame drawn so far (every 8th pixel)
function darkUnder(x, y, w, h) {
  const gl = drawingContext, px = new Uint8Array(w * h * 4);
  gl.readPixels(x, H - y - h, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
  let sum = 0, n = 0;
  for (let i = 0; i < px.length; i += 32) { sum += .2126 * px[i] + .7152 * px[i + 1] + .0722 * px[i + 2]; n++; }
  const lum = n ? sum / n / 255 : 1;   // paper is about .9, the desk about .45, the shoggoth's night about .2
  return Math.min(1, Math.max(0, (.75 - lum) / .5));
}

function reviewCaption(t) {
  const l = lineAt(t); if (!l || !l.spoken || t > l.end) return;
  // sentences: split after . ! ? (and any closing quote) followed by a space and a capital, but not after vs. e.g. i.e. Dr. Lt.
  const txt = plainText(l.text).replace(/\b(vs|e\.g|i\.e|Dr|Lt|Mr|Ms|St)\./g, '$1\u2024');
  const sentences = txt.split(/(?<=[.!?]["”)]*)\s+(?=["“(]?[A-Z0-9])/).map(x => x.replace(/\u2024/g, '.'));
  const total = sentences.reduce((a, s) => a + s.length, 0); let acc = 0, cur = sentences[0];
  for (const s of sentences) { if ((t - l.t0) / Math.max(.01, l.t1 - l.t0) * total >= acc) cur = s; acc += s.length; }
  // rows of up to 62 characters, each with its share of Curt's typo marks (script/typos.yaml), in red pen
  const marks = proofOf(cur, l.proof), rows = [{ txt: '', at: 0 }];
  let pos = 0;
  for (const w of cur.split(' ')) {
    const r = rows[rows.length - 1];
    if (r.txt && (r.txt + ' ' + w).length > 62) rows.push({ txt: w, at: pos }); else r.txt = r.txt ? r.txt + ' ' + w : w;
    pos += w.length + 1;
  }
  for (const r of rows) r.proof = marks.filter(m => m.at >= r.at && m.at <= r.at + r.txt.length).map(m => ({ ...m, at: m.at - r.at }));
  const gap = marks.length ? 60 : 46, top = marks.length ? 18 : 0;
  const who = l.speaker === 'curt' ? 'CURT' : 'CLAUDE', col = l.speaker === 'curt' ? '#2F5C8A' : '#A84D33', y0 = H - 40 - rows.length * gap - top;
  boilSeed('caption');
  // a light veil, not a panel: the picture shows through, and a thin white edge on each letter keeps the words readable.
  // Over a dark picture (the shoggoth, the night desk) the veil thickens, since dark letters need a light ground.
  const bh = rows.length * gap + 64 + top;
  paint(rrPts(40, y0 - 44, 1360, bh, 14), { wash: '#FBF8F0', washOp: 80 + 130 * darkUnder(40, y0 - 44, 1360, bh), ink: null });
  const edge = { ink: false, align: 'left', screen: true, stroke: '#FFFFFF', strokeW: .1 };
  letter(who, 64, y0 - 16, 22, col, { ...edge, font: 'bold 22px "Helvetica Neue", Arial, sans-serif' });
  rows.forEach((r, i) => letter(r.txt, 64, y0 + 20 + top + i * gap, 36, '#1E1A22', { ...edge, font: '36px "Helvetica Neue", Arial, sans-serif', proof: r.proof }));
}
window.AFTER_SHOT = t => { if (DRY) return; if (window.CHAPTER) refRail(t); if (REVIEW) reviewCaption(t); OCC = []; };

// When every code is on screen in this chapter: the rail's plan, plus the feature cards the scenes show (found by a DRY
// sweep). The companion site's watch pages use it to list links in step with the video.
function refTimes() {
  FEATURES_SEEN.clear();
  for (let t = 0; t < DUR; t += .5) occupancyAt(t);
  return railPlan().map(p => ({ id: p.id, t0: +p.t0.toFixed(2), t1: +(p.t0 + p.hold).toFixed(2), kind: 'shelf' }))
    .concat([...FEATURES_SEEN.values()].map(f => ({ id: f.id, t0: +f.t0.toFixed(2), t1: +(f.t0 + f.hold).toFixed(2), kind: f.kind || 'feature' })))
    .sort((a, b) => a.t0 - b.t0);
}

// The chapter check (tools/lint_chapter.mjs): what a viewer would trip over, found from the DRY replay, without painting.
//   crowded   more than MAX_TOGETHER codes on screen at once (a scene's link board, mode: board, counts apart)
//   covers    a code hides more than a fifth of something that matters (weight ≥ .5: a board, a character, lettering)
//   brief     a code is on screen less than its minimum (feature 6 s, shelf 5 s), e.g. cut off by a shot or the chapter's end
//   no room   the layout pass found no clean spot for a code in time (it covers content, or fell back to a corner)
//   late      a code waited more than 8 s for room, so it arrives well after the words it belongs to
//   static    (warning) the picture's layout doesn't change for more than 8 s: a held talking head
function chapterLint(o = {}) {
  const STEP = .25, STATIC = o.staticMax ?? 8, MIN = { feature: 6, shelf: 5, board: BOARD_MIN };
  const shotAt = t => { let i = 0; while (i + 1 < SHOTS.length && t >= SHOTS[i + 1][0]) i++; return (SHOTS[i][1].name || 'shot' + i).replace(/^shot/, ''); };
  const stamp = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
  const issues = [], add = (kind, t, msg) => issues.push({ kind, t: +t.toFixed(2), where: `${stamp(t)} shot ${shotAt(t)}, ${lineAt(t)?.id ?? 'lead-in'}`, msg });
  const area = r => Math.max(1, (r[2] - r[0]) * (r[3] - r[1])), box = e => e.slice(0, 4).map(Math.round).join(',');
  const plan = railPlan(), seen = new Map(), told = new Set();
  let crowded = false, prevSig = null, runStart = 0;
  for (let t = 0; t < DUR; t += STEP) {
    const occ = occupancyAt(t), codes = [];
    for (const p of plan) if (t >= p.t0 && t <= p.t0 + p.hold) codes.push({ id: p.id, kind: 'shelf', r: [p.x - p.half, p.y - p.half, p.x + p.half, p.y + p.half + 34] });
    for (const e of occ) if ((e[5] || '').startsWith('qr:')) codes.push({ id: e[5].slice(3), kind: 'feature', r: e.slice(0, 4) });
    for (const e of occ) if ((e[5] || '').startsWith('board:')) codes.push({ id: e[5].slice(6), kind: 'board', r: e.slice(0, 4) });
    for (const c of codes) { const s = seen.get(c.id) || { kind: c.kind, n: 0, t0: t }; s.n++; seen.set(c.id, s); }
    const loose = codes.filter(c => c.kind !== 'board');
    if (loose.length > MAX_TOGETHER && !crowded) add('crowded', t, `${loose.length} codes at once: ${loose.map(c => c.id).join(', ')}`);
    crowded = loose.length > MAX_TOGETHER;
    for (const c of codes) for (const e of occ) {
      if (e[4] < .5 || e[5] === 'qr:' + c.id || e[5] === 'board:' + c.id || (c.kind === 'board' && (e[5] || '').startsWith('board:'))) continue;
      const cap = REFS[c.id] && REFS[c.id].caption;
      if (c.kind === 'feature' && cap && e[5] && e[5].toLowerCase() === 'text: ' + cap.toLowerCase()) continue;   // its own caption
      const k = overlap(c.r, e) / area(e), key = c.id + '|' + (e[5] || box(e));
      if (k > .2 && !told.has(key)) { told.add(key); add('covers', t, `${c.id} (${c.kind}) hides ${Math.round(k * 100)}% of ${e[5] || 'content at ' + box(e)}`); }
    }
    // the layout's fingerprint: what matters, where, to the nearest 40 px (so boil and bobbing don't count as change)
    const sig = occ.filter(e => e[4] >= .5 && !/^(qr|board):/.test(e[5] || '')).map(e => e.slice(0, 4).map(v => Math.round(v / 40)).join(',') + (e[5] || '')).sort().join('|');
    if (sig !== prevSig) { if (prevSig !== null && t - runStart > STATIC) add('static', runStart, `the picture holds still for ${(t - runStart).toFixed(1)} s`); prevSig = sig; runStart = t; }
  }
  if (DUR - runStart > STATIC) add('static', runStart, `the picture holds still for ${(DUR - runStart).toFixed(1)} s, to the end`);
  for (const [id, s] of seen) if (s.n * STEP < MIN[s.kind]) add('brief', s.t0, `${id} (${s.kind}) is on screen only ${(s.n * STEP).toFixed(1)} s`);
  for (const p of plan) {
    if (p.cost === Infinity) add('no room', p.t0, `${p.id}: the layout found no place and fell back to the corner`);
    else if (!p.clean) add('no room', p.t0, `${p.id}: no clean spot within ${MAX_WAIT} s, so it covers some content`);
    if (p.delay > 8) add('late', p.t0, `${p.id} waited ${p.delay.toFixed(1)} s for room`);
  }
  return issues.sort((a, b) => a.t - b.t);
}
