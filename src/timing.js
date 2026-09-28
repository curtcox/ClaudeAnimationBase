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
// A voiced line carries its lip sync (l.mouth: a digit 0-9 per 1/24 s, from the voice's own loudness; tools/voice_lib.mjs),
// so the mouth opens on the stressed vowels and shuts on the pauses. A line on the scratch voice falls back to talk().
const MOUTH_HZ = 24;
function talkOf(t, speaker) {
  const l = lineAt(t);
  if (!l || !l.spoken || l.speaker !== speaker) return 0;
  return l.mouth ? (+l.mouth[Math.floor((t - l.t0) * MOUTH_HZ)] || 0) / 9 : talk(t, l.t0, l.t1);
}
const within = (t, a, b) => seg(t, L(a).t0, b ? L(b).t0 : L(a).end);

// ---------- over every shot: the reference rail, and review captions ----------
// The rail: every shelf reference anchored in this chapter gets a code, held REF_HOLD s from just after its line starts
// (or its cue, a phrase in the line, is said),
// placed by the layout pass (layout.js) where it covers the least content over its whole time on screen. Feature
// references are the scenes' job (qrFeature), and they repel shelf codes. A shot can hide the rail: RAIL.side = 'none'.
const REF_HOLD = 6.5, RAIL = { side: 'right' };
let RAIL_PLAN = null;
// when a reference's code goes up: just after the line it's anchored to starts, or its cue is said
function refAt(id) {
  const l = CH_LINES.find(l => l.refs.includes(id)), r = REFS[id];
  if (!l) throw new Error(`reference ${id} isn't anchored in this chapter`);
  return (r.cue ? atWord(l.id, r.cue) : l.t0) + .4;
}
function railPlan() {
  if (RAIL_PLAN) return RAIL_PLAN;
  const items = [];
  if (window.CHAPTER && window.REFS) for (const l of CH_LINES) for (const id of l.refs) {
    const r = REFS[id]; if (!r || r.mode !== 'shelf' || (r.qr_url || r.url) === 'SHORT') continue;
    const card = shelfCard(r);
    items.push({ id, t0: refAt(id), hold: REF_HOLD, ...(card ? { half: Math.max(card.hw, card.hh), hw: card.hw, hh: card.hh } : { half: Math.max(215, (shelfFramed(r) ? qrStyle(qrStyleFor(r.style)).extent ?? .64 : .5) * 380 + 20) }) });
  }
  return (RAIL_PLAN = planLayout(items.sort((a, b) => a.t0 - b.t0)));   // first said, first placed
}
function refRail(t) {
  if (RAIL.side === 'none') return;
  for (const p of railPlan()) {
    if (t < p.t0 || t > p.t0 + p.hold) continue;
    const R = REFS[p.id], card = shelfCard(R), k = seg(t, p.t0, p.t0 + .45), out = seg(t, p.t0 + p.hold - .35, p.t0 + p.hold);
    const x = p.x, y = p.y + ease(out) * 30;
    boilSeed('rail ' + p.id);
    paint(rrPts(x - p.hw, y - p.hh, p.hw * 2, p.hh * 2 + 34, 20), { wash: PAL.paper, washOp: 245 * clamp(k * 2) * (1 - out), ink: PAL.ink, sw: 1.2 });
    const captionOpts = { size: 24, noOcc: true, maxW: p.hw * 2 - 36 };
    if (out < .8) card ? refQR(R, x, y - 4, 380, { k, t, fit: card.fit, captionOpts }) : refQR(R, x, y - 14, 380, { k, t, captionOpts });
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

// The caption at t, laid out but not painted (the chapter check uses it too): the sentence being said, wrapped by its
// measured width into rows as wide as the frame allows (the whole width, less any code standing in the bottom band), then
// evened out so the last row isn't a stray word. right: where the caption must stop, instead of asking the codes (the
// lift is decided before the codes are placed, so it tries both a full-width caption and one a code squeezes to the
// band's reserved part, LAYOUT_RESERVED). Returns null when nobody is speaking.
//   { l, rows: [{ txt, at, proof }], box: [x0, y0, x1, y1], y0 (the first row's baseline), gap, top, maxW }
const CAP = { x: 40, pad: 24, size: 36, font: '36px "Helvetica Neue", Arial, sans-serif', bottom: 20, band: 300 };
let CAP_CTX = null;
const capWidth = s => { CAP_CTX ||= document.createElement('canvas').getContext('2d'); CAP_CTX.font = CAP.font; return CAP_CTX.measureText(s).width; };
function wrapRows(words, maxW) {
  const rows = [[]];
  for (const w of words) { const r = rows[rows.length - 1]; if (r.length && capWidth([...r, w].join(' ')) > maxW) rows.push([w]); else r.push(w); }
  return rows.map(r => r.join(' '));
}
// the codes standing in the caption band at t (rail codes and the scenes' own), as screen rectangles
function codesInBand(t) {
  const out = [];
  for (const p of railPlan()) if (t >= p.t0 && t <= p.t0 + p.hold) out.push([p.x - p.hw, p.y - p.hh, p.x + p.hw, p.y + p.hh + 34]);
  for (const e of occupancyAt(t)) if (/^(qr|board|card):/.test(e[5] || '')) out.push(e);
  return out.filter(r => r[3] > H - CAP.band);
}
function captionAt(t, right = null) {
  const l = lineAt(t); if (!l || !l.spoken || t > l.end) return null;
  // sentences: split after . ! ? (and any closing quote) followed by a space and a capital, but not after vs. e.g. i.e. Dr. Lt.
  const txt = plainText(l.text).replace(/\b(vs|e\.g|i\.e|Dr|Lt|Mr|Ms|St)\./g, '$1\u2024');
  const sentences = txt.split(/(?<=[.!?]["”)]*)\s+(?=["“(]?[A-Z0-9])/).map(x => x.replace(/\u2024/g, '.'));
  const total = sentences.reduce((a, s) => a + s.length, 0); let acc = 0, cur = sentences[0];
  for (const s of sentences) { if ((t - l.t0) / Math.max(.01, l.t1 - l.t0) * total >= acc) cur = s; acc += s.length; }
  // as wide as the frame allows: to its right margin, or to the first code standing in the band
  right ??= Math.min(W - CAP.x, ...codesInBand(t).map(r => r[0] - 16));
  const maxW = Math.max(600, right - CAP.x - 2 * CAP.pad);
  const words = cur.split(' '), n = wrapRows(words, maxW).length;
  // evened out: the narrowest width that still takes n rows
  let lo = maxW / n, hi = maxW;
  while (hi - lo > 8) { const mid = (lo + hi) / 2; if (wrapRows(words, mid).length > n) lo = mid; else hi = mid; }
  const marks = proofOf(cur, l.proof), rows = [];
  let pos = 0;
  for (const r of wrapRows(words, hi)) { rows.push({ txt: r, at: pos }); pos += r.length + 1; }
  for (const r of rows) r.proof = marks.filter(m => m.at >= r.at && m.at <= r.at + r.txt.length).map(m => ({ ...m, at: m.at - r.at }));
  const gap = marks.length ? 60 : 46, top = marks.length ? 18 : 0, y0 = H - CAP.bottom - 20 - rows.length * gap - top;
  const w = Math.max(...rows.map(r => capWidth(r.txt)), capWidth('CLAUDE')) + 2 * CAP.pad;
  return { l, rows, gap, top, y0, maxW, box: [CAP.x, y0 - 44, CAP.x + w, H - CAP.bottom] };
}
function reviewCaption(t) {
  const c = captionAt(t); if (!c) return;
  const { l, rows, gap, top, y0, box } = c;
  const who = l.speaker === 'curt' ? 'CURT' : 'CLAUDE', col = l.speaker === 'curt' ? '#2F5C8A' : '#A84D33';
  boilSeed('caption');
  // a light veil, not a panel: the picture shows through, and a thin white edge on each letter keeps the words readable.
  // Over a dark picture (the shoggoth, the night desk) the veil thickens, since dark letters need a light ground.
  const [x0, by, x1, y1] = box.map(Math.round), bw = x1 - x0, bh = y1 - by;
  paint(rrPts(x0, by, bw, bh, 14), { wash: '#FBF8F0', washOp: 80 + 130 * darkUnder(x0, by, bw, bh), ink: null });
  const edge = { ink: false, align: 'left', screen: true, stroke: '#FFFFFF', strokeW: .1 };
  letter(who, x0 + CAP.pad, y0 - 16, 22, col, { ...edge, font: 'bold 22px "Helvetica Neue", Arial, sans-serif' });
  rows.forEach((r, i) => letter(r.txt, x0 + CAP.pad, y0 + 20 + top + i * gap, CAP.size, '#1E1A22', { ...edge, font: CAP.font, proof: r.proof }));
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
//             (a code on a card, mode: card, counts: it's still a code on screen)
//   covers    a code hides more than a fifth of something that matters (weight ≥ .5: a board, a character, lettering)
//   brief     a code is on screen less than its minimum (feature 6 s, shelf 5 s), e.g. cut off by a shot or the chapter's end
//   no room   the layout pass found no clean spot for a code in time (it covers content, or fell back to a corner)
//   late      a code waited more than 8 s for room, so it arrives well after the words it belongs to
//   static    (warning) the picture's layout doesn't change for more than 8 s: a held talking head
//   caption   the review caption (and so a viewer's subtitles) covers something that matters for a second or more, when
//             the picture has room to rise clear of it: the fix is to lift that shot's content by the px it names
//   undercap  (warning) the same, but the picture has no room to rise: it fills the frame down to the caption
//   capwrap   the caption takes more rows than the width it's allowed needs (it isn't using the frame's width)
//   squeezed  (warning) a code standing in the bottom band narrows the caption into an extra row
function chapterLint(o = {}) {
  const STEP = .25, STATIC = o.staticMax ?? 8, MIN = { feature: 6, shelf: 5, board: BOARD_MIN, card: CARD_MIN };
  const shotAt = t => { let i = 0; while (i + 1 < SHOTS.length && t >= SHOTS[i + 1][0]) i++; return (SHOTS[i][1].name || 'shot' + i).replace(/^shot/, ''); };
  const stamp = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
  const issues = [], add = (kind, t, msg) => issues.push({ kind, t: +t.toFixed(2), where: `${stamp(t)} shot ${shotAt(t)}, ${lineAt(t)?.id ?? 'lead-in'}`, msg });
  const area = r => Math.max(1, (r[2] - r[0]) * (r[3] - r[1])), box = e => e.slice(0, 4).map(Math.round).join(',');
  const plan = railPlan(), seen = new Map(), told = new Set();
  let crowded = false, prevSig = null, runStart = 0;
  const under = new Map(), capTold = new Set(), FULL = W - 2 * CAP.x - 2 * CAP.pad;
  for (let t = 0; t < DUR; t += STEP) {
    const occ = occupancyAt(t), codes = [];
    // what the caption covers, and how far the picture could rise to clear it
    const cap = captionAt(t);
    if (cap) {
      const words = cap.rows.map(r => r.txt).join(' ').split(' '), n = cap.rows.length;
      if (wrapRows(words, cap.maxW).length < n && !capTold.has('wrap' + cap.l.id)) { capTold.add('wrap' + cap.l.id); add('capwrap', t, `the caption takes ${n} rows where ${wrapRows(words, cap.maxW).length} would do`); }
      else if (wrapRows(words, FULL).length < n && !capTold.has('sq' + cap.l.id)) { capTold.add('sq' + cap.l.id); add('squeezed', t, `a code in the bottom band pushes the caption to ${n} rows`); }
      const content = occ.filter(e => e[4] >= .5 && !/^(qr|board|card):/.test(e[5] || '') && e[3] > 0 && e[1] < H);
      for (const e of content) {
        const k = overlap(cap.box, e) / area(e); if (k <= .1) continue;
        const key = shotAt(t) + '|' + setupAt(t)?.t0 + '|' + (e[5] || 'content'), u = under.get(key) || { t0: t, n: 0, k: 0, need: 0, setup: setupAt(t), what: e[5] || 'content at ' + box(e) };
        u.n++; u.k = Math.max(u.k, k); u.need = Math.max(u.need, e[3] - cap.box[1] + 12); under.set(key, u);
      }
    }
    for (const p of plan) if (t >= p.t0 && t <= p.t0 + p.hold) codes.push({ id: p.id, kind: 'shelf', r: [p.x - p.hw, p.y - p.hh, p.x + p.hw, p.y + p.hh + 34] });
    for (const e of occ) if ((e[5] || '').startsWith('qr:')) codes.push({ id: e[5].slice(3), kind: 'feature', r: e.slice(0, 4) });
    for (const e of occ) if ((e[5] || '').startsWith('board:')) codes.push({ id: e[5].slice(6), kind: 'board', r: e.slice(0, 4) });
    for (const e of occ) if ((e[5] || '').startsWith('card:')) codes.push({ id: e[5].slice(5), kind: 'card', r: e.slice(0, 4) });
    for (const c of codes) { const s = seen.get(c.id) || { kind: c.kind, n: 0, t0: t }; s.n++; seen.set(c.id, s); }
    const loose = codes.filter(c => c.kind !== 'board');
    if (loose.length > MAX_TOGETHER && !crowded) add('crowded', t, `${loose.length} codes at once: ${loose.map(c => c.id).join(', ')}`);
    crowded = loose.length > MAX_TOGETHER;
    for (const c of codes) for (const e of occ) {
      if (e[4] < .5 || e[5] === 'qr:' + c.id || e[5] === 'board:' + c.id || e[5] === 'card:' + c.id || (c.kind === 'board' && (e[5] || '').startsWith('board:'))) continue;
      if (c.kind === 'card' && e[0] <= c.r[0] + 2 && e[1] <= c.r[1] + 2 && e[2] >= c.r[2] - 2 && e[3] >= c.r[3] - 2) continue;   // the card it's on
      const cap = REFS[c.id] && REFS[c.id].caption;
      if (c.kind === 'feature' && cap && e[5] && e[5].toLowerCase() === 'text: ' + cap.toLowerCase()) continue;   // its own caption
      const k = overlap(c.r, e) / area(e), key = c.id + '|' + (e[5] || box(e));
      if (k > .2 && !told.has(key)) { told.add(key); add('covers', t, `${c.id} (${c.kind}) hides ${Math.round(k * 100)}% of ${e[5] || 'content at ' + box(e)}`); }
    }
    // the layout's fingerprint: what matters, where, to the nearest 40 px (so boil and bobbing don't count as change)
    const sig = occ.filter(e => e[4] >= .5 && !/^(qr|board|card):/.test(e[5] || '')).map(e => e.slice(0, 4).map(v => Math.round(v / 40)).join(',') + (e[5] || '')).sort().join('|');
    if (sig !== prevSig) { if (prevSig !== null && t - runStart > STATIC) add('static', runStart, `the picture holds still for ${(t - runStart).toFixed(1)} s`); prevSig = sig; runStart = t; }
  }
  for (const u of under.values()) if (u.n * STEP >= 1) {
    const what = `the caption covers ${u.k < .98 ? Math.round(u.k * 100) + '% of ' : ''}${u.what} for ${(u.n * STEP).toFixed(1)} s`;
    // how much higher the picture could still go (layout.js's setups): one cut off by the bottom edge stays put
    const f = u.setup, room = !f || f.cut >= 1 ? 0 : Math.min(f.room, LIFT_MAX) - f.lift;
    if (u.need <= room) add('caption', u.t0, `${what}; the shot has room to rise ${Math.ceil(u.need / 10) * 10} px more (it has ${Math.floor(room)})`);
    else add('undercap', u.t0, `${what}; the shot has only ${Math.max(0, Math.floor(room))} px more of the ${Math.ceil(u.need)} it would need to rise`);
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
