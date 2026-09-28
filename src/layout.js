// layout.js: where things are, so overlays can go where nothing is.
//
// Occupancy: while a frame draws, the things that matter record their screen rectangles with occupy(x0, y0, x1, y1, weight)
// (world coordinates; the active camera is applied). Boards, cards, characters, screens and all lettering do it for you;
// a scene adds occupy() for any big custom picture. Weight says how much covering it hurts (1 = content; .1 = decoration).
// tag (optional) names what it is, for the chapter check (feature codes are 'qr:<id>').
//
// The layout pass: QR codes are placed by replaying the chapter DRY (no painting, just logic, about a millisecond a frame)
// over each code's time on screen, adding up what sits where, and choosing the position (and, if the frame is crowded, a
// short delay) that covers least, never overlapping another code. The result is fixed per code, so codes never move while
// they're up, and it's computed once per page from pure functions of time, so every render worker agrees.
let OCC = [];
function occupy(x0, y0, x1, y1, w = 1, tag) {
  if (CAM) { const P = [toScreen(x0, y0), toScreen(x1, y0), toScreen(x0, y1), toScreen(x1, y1)]; x0 = Math.min(...P.map(p => p[0])); x1 = Math.max(...P.map(p => p[0])); y0 = Math.min(...P.map(p => p[1])); y1 = Math.max(...P.map(p => p[1])); }
  y0 -= LIFT; y1 -= LIFT;
  OCC.push([Math.max(-50, x0), Math.max(-50, y0), Math.min(W + 50, x1), Math.min(H + 50, y1), w, tag]);
}
// lettering occupies roughly its text's extent (estimated from length and size)
function occupyLetters() {
  for (const L of LETTERS) {
    if (L.noOcc) continue;
    const w = L.txt.length * L.size * .5, h = L.size * 1.1, a = L.align || 'center';
    const x0 = a === 'left' ? L.x : a === 'right' ? L.x - w : L.x - w / 2;
    OCC.push([x0, L.y - h / 2, x0 + w, L.y + h / 2, 1, 'text: ' + L.txt]);
  }
}
const overlap = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));

// What the frame at time t occupies, as shown (lifted, if its picture is): the DRY replay's rectangles, raised with it.
const OCC_CACHE = new Map(), RAW_CACHE = new Map();
function occupancyAt(t) {
  const key = Math.round(t * 8) / 8;
  if (OCC_CACHE.has(key)) return OCC_CACHE.get(key);
  const l = liftAt(key), raw = rawOccupancyAt(key);
  const occ = l ? raw.map(e => [e[0], e[1] - l, e[2], e[3] - l, e[4], e[5]]) : raw;
  OCC_CACHE.set(key, occ);
  return occ;
}
const shotIndex = t => { let i = 0; while (i + 1 < SHOTS.length && t >= SHOTS[i + 1][0]) i++; return i; };
// What the frame at time t occupies unlifted, drawn DRY (to the nearest 1/8 s, cached). Everything the real frame needs
// is saved and restored around it.
function rawOccupancyAt(t) {
  const key = Math.round(t * 8) / 8;
  if (!RAW_CACHE.has(key)) RAW_CACHE.set(key, replayAt(key));
  return RAW_CACHE.get(key);
}
function replayAt(t) {
  const saved = { T, CAM, LAST_CAM, LETTERS, OCC, BOILN, CLAWD_N, LIFT, INK, dry: DRY };
  DRY = true; T = t; CAM = LAST_CAM = null; LETTERS = []; OCC = []; BOILN = Math.floor(t * BOIL); CLAWD_N = 0; LIFT = 0; INK = [];
  push(); resetMatrix();
  try {
    const i = shotIndex(t), t0 = SHOTS[i][0], end = i + 1 < SHOTS.length ? SHOTS[i + 1][0] : DUR;
    SHOTS[i][1](t, t - t0, end - t0);
  } finally { pop(); }
  CAM = null; occupyLetters();
  const occ = OCC; occ.ink = INK;   // everything painted, too (the lift's room)
  ({ T, CAM, LAST_CAM, LETTERS, OCC, BOILN, CLAWD_N, LIFT, INK } = saved); DRY = saved.dry;
  return occ;
}

// The lift. Captions (review captions, and a viewer's subtitles) sit in the bottom band. A picture whose content they'd
// cover is drawn raised by just enough to clear them (in whole 10 px, up to LIFT_MAX), for as long as it's on screen, as
// far as the content above has room: nothing that matters goes off the top, nor any part of a set (every screen counts,
// whatever it shows). A picture with something that matters cut off by the frame's bottom edge for a second or more
// (Curt from behind at the Desk) stays put: raised, it would show where that ends. It's the same in the draft and the
// film, so the picture never depends on the captions being shown. A shot fn can set its own: fn.lift = 0 (or px).
//
// A picture is a setup: a shot, split where it cuts between the Desk and another world inside it (a push into a screen
// cuts to that screen's world), found to the millisecond, so a lift only ever changes on a cut. Each setup carries what
// its lift is decided from, unlifted (the chapter check reads the same numbers):
//   need  how far it must rise for no caption to cover a tenth of anything that matters
//   room  how far it can: its highest content or screen, or anything painted that starts inside the frame (declared or
//         not; a ground or a beam that already starts above the top edge doesn't count), less a LIFT_TOP margin
//   cut   seconds something that matters runs off the bottom edge
// Room and cut skip the first and last half second of each shot, where a wipe hides them.
const LIFT_MAX = 260, LIFT_TOP = 24, CODE_TAG = /^(qr|board|card):/;
let SETUPS = null;
const deskIn = occ => occ.some(e => /^screen /.test(e[5] || ''));
function setups() {
  if (SETUPS) return SETUPS;
  SETUPS = [];
  if (!window.CHAPTER || !SHOTS.length || window.LOOP) return SETUPS;
  const area = r => Math.max(1, (r[2] - r[0]) * (r[3] - r[1])), dt = 1 / 8;
  SHOTS.forEach(([t0, fn], i) => {
    const t1 = i + 1 < SHOTS.length ? SHOTS[i + 1][0] : DUR;
    let cur = null;
    for (let k = Math.ceil(t0 * 8) / 8; k < t1; k += dt) {
      const raw = rawOccupancyAt(k), desk = deskIn(raw);
      if (!cur || cur.desk !== desk) {
        let at = t0;
        if (cur) {   // the cut is between the last sample and this one: find it
          let lo = Math.max(t0, k - dt), hi = k;
          while (hi - lo > .001) { const m = (lo + hi) / 2; if (deskIn(replayAt(m)) === desk) hi = m; else lo = m; }
          at = cur.t1 = hi;
        }
        SETUPS.push(cur = { shot: i, t0: at, t1, desk, need: 0, room: H, cut: 0, fixed: fn.lift });
      }
      const shown = raw.filter(e => (e[4] >= .1 || /^screen /.test(e[5] || '')) && e[3] > 0 && e[1] < H && e[2] > 0 && e[0] < W), occ = shown.filter(e => e[4] >= .5);
      if (k >= t0 + .5 && k <= t1 - .5) {
        const painted = raw.ink.filter(r => r[1] >= 0 && r[1] < H && r[2] > 0 && r[0] < W);
        for (const r of [...shown, ...painted]) cur.room = Math.min(cur.room, r[1] - LIFT_TOP);
        if (occ.some(e => e[3] > H + 4 && !CODE_TAG.test(e[5] || ''))) cur.cut += dt;
      }
      for (const right of [W - CAP.x, LAYOUT_RESERVED[0][2] - 16]) {   // full width, or squeezed by a code in the corner
        const cap = captionAt(k, right); if (!cap) break;
        for (const e of occ) if (!CODE_TAG.test(e[5] || '') && overlap(cap.box, e) / area(e) > .1) cur.need = Math.max(cur.need, e[3] - cap.box[1] + 12);
      }
    }
  });
  for (const s of SETUPS) s.lift = s.fixed != null ? s.fixed : s.cut >= 1 ? 0 : Math.max(0, Math.min(Math.ceil(s.need / 10) * 10, Math.floor(s.room / 10) * 10, LIFT_MAX));
  return SETUPS;
}
const setupAt = t => setups().find(s => t >= s.t0 && t < s.t1) || null;
const liftAt = t => setupAt(t)?.lift || 0;

// Places a list of { id, t0, hold, half } (half = the card's half-width in px; or hw and hh, its half-width and half-height,
// for a card that isn't square) and returns [{ id, t0, x, y, half, hw, hh, hold, cost, clean }]. The bottom band is kept for captions and subtitles. A code goes up as soon as there's a clean spot (covering less
// than CLEAN px² of content, and hiding no more than a fifth of any one thing that matters, such as a short line of
// lettering); if the frame is full, it waits for one, up to MAX_WAIT s, rather than cover anything, and only
// then settles for the spot that covers least.
const LAYOUT_RESERVED = [[0, H - 230, 1420, H, 3]], MAX_TOGETHER = 2, CLEAN = 4000, MAX_WAIT = 40;
function planLayout(items) {
  const placed = [];
  for (const it of items) {
    let best = null, fallback = null;
    const delays = [0, .75, 1.5, 2.5, 3.5, 5]; for (let d = 6; d <= MAX_WAIT; d += 1) delays.push(d);
    for (const d of delays) {
      const t0 = it.t0 + d, samples = [];
      for (let s = t0; s <= t0 + it.hold; s += .5) samples.push(s);
      if (t0 + it.hold > DUR) break;   // it would run past the chapter's end
      const occ = samples.flatMap(s => occupancyAt(s)).concat(LAYOUT_RESERVED);
      const others = placed.filter(p => p.t0 < t0 + it.hold + .4 && t0 < p.t0 + p.hold + .4);
      const onCards = new Set(occ.filter(o => (o[5] || '').startsWith('card:')).map(o => o[5]));   // codes the scenes put on cards
      if (others.length + onCards.size >= MAX_TOGETHER) continue;   // at most MAX_TOGETHER codes up at once: this one waits
      const hw = it.hw ?? it.half, hh = it.hh ?? it.half, hb = hh + 34;
      for (let y = hh + 14; y <= H - hb - 14; y += 30) for (let x = hw + 14; x <= W - hw - 14; x += 30) {
        const r = [x - hw - 10, y - hh - 10, x + hw + 10, y + hb + 10];
        if (others.some(p => overlap(r, [p.x - p.hw - 12, p.y - p.hh - 12, p.x + p.hw + 12, p.y + p.hh + 46]) > 0)) continue;
        let cover = 0, hides = false;
        const rc = [x - hw, y - hh, x + hw, y + hh + 34];   // the code itself, as the chapter check measures it
        for (const o of occ) {
          const ov = overlap(r, o); cover += ov * o[4];
          if (!hides && o[4] >= .5 && overlap(rc, o) > .2 * Math.max(1, (o[2] - o[0]) * (o[3] - o[1]))) hides = true;   // hides a fifth of something small
        }
        cover /= samples.length;
        const cost = cover + d * 9000 + Math.abs(x - (W - hw - 30)) * 2;   // prefer no delay, then the right side
        const cand = { id: it.id, t0, x, y, half: it.half, hw, hh, hold: it.hold, cost, cover, delay: d };
        if (cover < CLEAN && !hides && (!best || cost < best.cost)) best = cand;
        if (!fallback || cover < fallback.cover || (cover === fallback.cover && cost < fallback.cost)) fallback = cand;
      }
      if (best) break;   // the earliest delay with a clean spot
    }
    const hw = it.hw ?? it.half, hh = it.hh ?? it.half;
    const p = best || fallback || { id: it.id, t0: it.t0, x: W - hw - 30, y: hh + 14, half: it.half, hw, hh, hold: it.hold, cost: Infinity, cover: Infinity, delay: 0 };
    p.clean = !!best; placed.push(p);
  }
  return placed;
}
