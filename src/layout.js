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

// What the frame at time t occupies, drawn DRY. Everything the real frame needs is saved and restored around it.
const OCC_CACHE = new Map();
function occupancyAt(t) {
  const key = Math.round(t * 8) / 8;
  if (OCC_CACHE.has(key)) return OCC_CACHE.get(key);
  const saved = { T, CAM, LAST_CAM, LETTERS, OCC, BOILN, CLAWD_N, dry: DRY };
  DRY = true; T = key; CAM = LAST_CAM = null; LETTERS = []; OCC = []; BOILN = Math.floor(key * BOIL); CLAWD_N = 0;
  push(); resetMatrix();
  try {
    let i = 0; while (i + 1 < SHOTS.length && key >= SHOTS[i + 1][0]) i++;
    const t0 = SHOTS[i][0], end = i + 1 < SHOTS.length ? SHOTS[i + 1][0] : DUR;
    SHOTS[i][1](key, key - t0, end - t0);
  } finally { pop(); }
  CAM = null; occupyLetters();
  const occ = OCC;
  ({ T, CAM, LAST_CAM, LETTERS, OCC, BOILN, CLAWD_N } = saved); DRY = saved.dry;
  OCC_CACHE.set(key, occ);
  return occ;
}

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
