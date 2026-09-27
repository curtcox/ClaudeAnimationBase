// layout.js: where things are, so overlays can go where nothing is.
//
// Occupancy: while a frame draws, the things that matter record their screen rectangles with occupy(x0, y0, x1, y1, weight)
// (world coordinates; the active camera is applied). Boards, cards, characters, screens and all lettering do it for you;
// a scene adds occupy() for any big custom picture. Weight says how much covering it hurts (1 = content; .1 = decoration).
//
// The layout pass: QR codes are placed by replaying the chapter DRY (no painting, just logic, about a millisecond a frame)
// over each code's time on screen, adding up what sits where, and choosing the position (and, if the frame is crowded, a
// short delay) that covers least, never overlapping another code. The result is fixed per code, so codes never move while
// they're up, and it's computed once per page from pure functions of time, so every render worker agrees.
let OCC = [];
function occupy(x0, y0, x1, y1, w = 1) {
  if (CAM) { const P = [toScreen(x0, y0), toScreen(x1, y0), toScreen(x0, y1), toScreen(x1, y1)]; x0 = Math.min(...P.map(p => p[0])); x1 = Math.max(...P.map(p => p[0])); y0 = Math.min(...P.map(p => p[1])); y1 = Math.max(...P.map(p => p[1])); }
  OCC.push([Math.max(-50, x0), Math.max(-50, y0), Math.min(W + 50, x1), Math.min(H + 50, y1), w]);
}
// lettering occupies roughly its text's extent (estimated from length and size)
function occupyLetters() {
  for (const L of LETTERS) {
    if (L.noOcc) continue;
    const w = L.txt.length * L.size * .5, h = L.size * 1.1, a = L.align || 'center';
    const x0 = a === 'left' ? L.x : a === 'right' ? L.x - w : L.x - w / 2;
    OCC.push([x0, L.y - h / 2, x0 + w, L.y + h / 2, 1]);
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

// Places a list of { id, t0, hold, half } (half = the card's half-width in px) and returns [{ id, t0, x, y, half }].
// The bottom band is kept for captions and subtitles; a code may wait up to MAX_DELAY s for room.
const LAYOUT_RESERVED = [[0, H - 230, 1420, H, 3]], MAX_DELAY = 6, MAX_TOGETHER = 2;
function planLayout(items) {
  const placed = [];
  for (const it of items) {
    let best = null;
    // wait a little if the frame is crowded; if other codes fill every spot, queue: keep waiting until one leaves
    const delays = [0, .75, 1.5, 2.5, 3.5, 5, MAX_DELAY]; for (let d = MAX_DELAY + 1; d <= 120; d += 1) delays.push(d);
    for (const d of delays) {
      if (d > MAX_DELAY && best) break;
      const t0 = it.t0 + d, samples = [];
      for (let s = t0; s <= t0 + it.hold; s += .5) samples.push(s);
      const occ = samples.flatMap(s => occupancyAt(s)).concat(LAYOUT_RESERVED);
      const others = placed.filter(p => p.t0 < t0 + it.hold + .4 && t0 < p.t0 + p.hold + .4);
      if (others.length >= MAX_TOGETHER) continue;   // at most MAX_TOGETHER codes up at once: this one waits
      const h = it.half, hb = h + 34;
      for (let y = h + 14; y <= H - hb - 14; y += 30) for (let x = h + 14; x <= W - h - 14; x += 30) {
        const r = [x - h - 10, y - h - 10, x + h + 10, y + hb + 10];
        if (others.some(p => overlap(r, [p.x - p.half - 12, p.y - p.half - 12, p.x + p.half + 12, p.y + p.half + 46]) > 0)) continue;
        let cost = 0; for (const o of occ) cost += overlap(r, o) * o[4];
        cost = cost / samples.length + d * 9000 + Math.abs(x - (W - h - 30)) * 2;   // prefer no delay, then the right side
        if (!best || cost < best.cost) best = { id: it.id, t0, x, y, half: h, hold: it.hold, cost };
      }
      if (best && best.cost < 4000) break;   // good enough without waiting longer
    }
    placed.push(best || { id: it.id, t0: it.t0, x: W - it.half - 30, y: it.half + 14, half: it.half, hold: it.hold, cost: Infinity });
  }
  return placed;
}
