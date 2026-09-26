// qr.js: painted QR codes that still scan. Each code dresses as what it points to (a style), but the part a scanner
// reads stays strict (VIDEO_PLAN.md §4):
//   - flat wash at full opacity, dark on light, no ink outline and no boil on the modules or the quiet zone
//   - finder eyes keep their 1:1:3:1:1 proportions along every line through their centre (shapes may round, not break)
//   - a quiet zone of 4 modules; decoration (the frame) only outside it
//   - a centre emblem only at error correction H, clearing at most ~7% of the modules
// tools/qr_check.mjs decodes every code from rendered frames to prove it.
//
//   qrCard(url, cx, cy, size, style, { ecc, k, caption })   size = the code with its quiet zone, in px; k = 0..1 arrival
//   QR_STYLES.name = { bg, fg, eye, module, frame, emblem }  (see the defaults below)

const QR_CACHE = new Map();
// The module matrix for a string: { n, dark(r, c) }. Pure, so it's cached across frames.
function qrMatrix(text, ecc = 'H') {
  const key = ecc + '|' + text;
  if (!QR_CACHE.has(key)) {
    const q = qrcode(0, ecc); q.addData(text); q.make();
    const n = q.getModuleCount(), cells = [];
    for (let r = 0; r < n; r++) { const row = []; for (let c = 0; c < n; c++) row.push(q.isDark(r, c)); cells.push(row); }
    QR_CACHE.set(key, { n, dark: (r, c) => r >= 0 && c >= 0 && r < n && c < n && cells[r][c] });
  }
  return QR_CACHE.get(key);
}
const QR_QUIET = 4;
const inFinder = (r, c, n) => (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8);

// ---------- module shapes: fn(x, y, m, fg, r, c, M) paints one dark module whose top-left is (x, y), m px square ----------
const QR_MODULES = {
  // plain squares, merged into horizontal runs (fewer shapes, crisper edges): handled specially in qrCard
  square: null,
  // round dots, just touching their neighbours: a halftone look with enough ink for every decoder
  dot: (x, y, m, fg) => paint(ellPts(x + m / 2, y + m / 2, m * .56, m * .56, 12), { wash: fg, ink: null }),
  // soft squares
  round: (x, y, m, fg) => paint(rrPts(x + m * .04, y + m * .04, m * .92, m * .92, m * .3), { wash: fg, ink: null }),
  // a leaf: a full module with two opposite corners rounded right off and the other two pointed, for lily pads and grass
  leaf: (x, y, m, fg, r, c) => {
    const e = -m * .02, q = m * .5, flip = hash(r * 131 + c) > .5;
    const P = flip ? [[x + e, y + m - e], [x + e, y + q * .45], [x + q * .45, y + e], [x + m - e, y + e], [x + m - e, y + m - q * .45], [x + m - q * .45, y + m - e]]
                   : [[x + e, y + e], [x + m - q * .45, y + e], [x + m - e, y + q * .45], [x + m - e, y + m - e], [x + q * .45, y + m - e], [x + e, y + m - q * .45]];
    paint(P, { wash: fg, ink: null });
  },
};

// ---------- finder eyes: fn(x, y, m, fg, bg) paints the 7×7 eye whose top-left is (x, y) ----------
const QR_EYES = {
  square: (x, y, m, fg, bg) => {
    paint(rectPts(x, y, 7 * m, 7 * m), { wash: fg, ink: null });
    paint(rectPts(x + m, y + m, 5 * m, 5 * m), { wash: bg, ink: null });
    paint(rectPts(x + 2 * m, y + 2 * m, 3 * m, 3 * m), { wash: fg, ink: null });
  },
  round: (x, y, m, fg, bg) => {
    paint(rrPts(x, y, 7 * m, 7 * m, 2 * m), { wash: fg, ink: null });
    paint(rrPts(x + m, y + m, 5 * m, 5 * m, 1.3 * m), { wash: bg, ink: null });
    paint(rrPts(x + 2 * m, y + 2 * m, 3 * m, 3 * m, .9 * m), { wash: fg, ink: null });
  },
  // rings: the proportions hold along every line through the centre, which is what a scanner measures
  ring: (x, y, m, fg, bg) => {
    const cx = x + 3.5 * m, cy = y + 3.5 * m;
    paint(ellPts(cx, cy, 3.5 * m, 3.5 * m, 36), { wash: fg, ink: null });
    paint(ellPts(cx, cy, 2.5 * m, 2.5 * m, 32), { wash: bg, ink: null });
    paint(ellPts(cx, cy, 1.5 * m, 1.5 * m, 24), { wash: fg, ink: null });
  },
};

// ---------- styles ----------
// bg/fg: the code's two colours (keep the luminance ratio >= 7:1). eye/module: shape names above, or functions.
// frame(cx, cy, s, t): painted decoration OUTSIDE the quiet zone (s = code size incl. quiet zone); reach: how far below the
// centre the frame extends, in s (the caption goes under it). emblem(cx, cy, r, t): the centre picture at ECC H (r = its
// radius in px); the modules under it are cleared first.
const QR_STYLES = {
  plain: { bg: PAL.cream, fg: PAL.ink, eye: 'square', module: 'square' },

  // MAD #157: newsprint, halftone dots, comic-panel eyes, a panel border
  newsprint: {
    bg: '#F4EBD2', fg: '#231F20', eye: 'square', module: 'dot',
    frame: (cx, cy, s) => {
      paint(rectPts(cx - s * .56, cy - s * .56, s * 1.12, s * 1.12, 3), { wash: '#F4EBD2', ink: PAL.ink, sw: 2.2 });
      for (let i = 0; i < 26; i++) {   // halftone speckle in the margin
        const a = hash(i) * TAU, rr = s * (.52 + hash(i + 50) * .03);
        paint(ellPts(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 3 + hash(i + 9) * 3, 3 + hash(i + 9) * 3, 8), { wash: '#C9B98F', ink: null });
      }
    },
  },

  // the frog/axolotl chart: pond-green leaves on a pale pad, a frog on one edge and an axolotl peeking over the other,
  // and the two of them nose to nose in the middle
  lilypad: {
    bg: '#F3F6E4', fg: '#1F4A22', eye: 'round', module: 'leaf', reach: .95,
    frame: (cx, cy, s, t) => {
      // the pad: a disc big enough to hold the square code, with its notch
      const R = s * .8, pad = []; for (let i = 0; i <= 44; i++) { const a = -1.25 + i / 44 * (TAU - .5); pad.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); }
      pad.push([cx, cy]);
      paint(pad, { fill: '#6E9F58', fillOp: 200, bleed: .1, tex: .5, ink: PAL.ink, sw: 1.6 });
      for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + .3; inkLine([[cx + Math.cos(a) * s * .72, cy + Math.sin(a) * s * .72], [cx + Math.cos(a) * R * .97, cy + Math.sin(a) * R * .97]], .6, '#3F6B33', 'inkfine'); }
      qrFrog(cx - s * .56, cy + s * .66, s * .2, t);
      qrAxolotl(cx + s * .6, cy - s * .62, s * .2, t);
    },
    emblem: (cx, cy, r, t) => {
      paint(ellPts(cx, cy, r, r, 30), { wash: '#F3F6E4', ink: PAL.ink, sw: .9 });
      qrFrog(cx - r * .42, cy + r * .42, r * .46, t, .25);
      qrAxolotl(cx + r * .42, cy + r * .38, r * .46, t, -.25);
    },
  },

  // HAL 9000: a cream code in a black panel, the red lens as the emblem
  'red-lens': {
    bg: '#F6EFE2', fg: '#1A1418', eye: 'ring', module: 'round',
    frame: (cx, cy, s) => {
      paint(rrPts(cx - s * .6, cy - s * .6, s * 1.2, s * 1.2, s * .05), { wash: '#1A1418', ink: PAL.ink, sw: 1.5 });
      paint(rectPts(cx - s * .6, cy + s * .56, s * 1.2, s * .04), { wash: '#6C6A70', ink: null });                   // brushed-metal lip
    },
    emblem: (cx, cy, r, t) => {
      paint(ellPts(cx, cy, r, r, 32), { wash: '#1A1418', ink: '#6C6A70', sw: 1.2 });
      paint(ellPts(cx, cy, r * .62, r * .62, 28), { wash: '#B0141C', ink: null });
      glow(cx, cy, r * 1.4, '#FF3B2F', .55 + .15 * Math.sin(t * 3));
      paint(ellPts(cx, cy, r * .22, r * .22, 16), { wash: '#FFD24A', ink: null });
    },
  },

  // xkcd #356: thin black line on white, a stick-figure frame, the infinite resistor grid as the border
  xkcd: {
    bg: '#FFFFFF', fg: '#111111', eye: 'square', module: 'square',
    frame: (cx, cy, s) => {
      const R = s * .6, g = s * .12;
      for (let i = -5; i <= 5; i++) {   // resistor grid: zigzags on a lattice around the code
        const v = i * g;
        for (const [a, b] of [[[cx - R, cy + v], [cx - s * .52, cy + v]], [[cx + s * .52, cy + v], [cx + R, cy + v]], [[cx + v, cy - R], [cx + v, cy - s * .52]], [[cx + v, cy + s * .52], [cx + v, cy + R]]]) {
          const zz = []; for (let k = 0; k <= 6; k++) { const q = k / 6; zz.push([lerp(a[0], b[0], q) + (k % 2 ? 3 : -3) * (a[1] === b[1] ? 0 : 1), lerp(a[1], b[1], q) + (k % 2 ? 3 : -3) * (a[0] === b[0] ? 0 : 1)]); }
          inkLine(zz, .5, '#111111', 'inkfine', 0);
        }
      }
    },
  },

  // the Dish of the Day: served on a plate with cutlery
  'dinner-plate': {
    bg: '#FBF6EA', fg: '#3B2418', eye: 'round', module: 'round', reach: .8,
    frame: (cx, cy, s) => {
      paint(ellPts(cx, cy, s * .74, s * .74, 60), { wash: '#EFE6D2', ink: PAL.ink, sw: 1.4 });
      paint(ellPts(cx, cy, s * .66, s * .66, 60), { wash: '#FBF6EA', ink: mixCol(PAL.ink, '#EFE6D2', .5), sw: .7 });
      paint(rrPts(cx - s * .92, cy - s * .45, s * .07, s * .9, s * .03), { wash: '#B9B4AC', ink: PAL.ink, sw: .8 });        // knife
      paint(rrPts(cx + s * .85, cy - s * .45, s * .07, s * .9, s * .03), { wash: '#B9B4AC', ink: PAL.ink, sw: .8 });        // fork
      for (let i = 0; i < 3; i++) paint(rectPts(cx + s * .855 + i * s * .022, cy - s * .58, s * .012, s * .16), { wash: '#B9B4AC', ink: PAL.ink, sw: .5 });
    },
  },

  // the Hugging Face incident: a code in a sandbox, footprints leaving it
  sandbox: {
    bg: '#FBF3E0', fg: '#2B2233', eye: 'square', module: 'round',
    frame: (cx, cy, s) => {
      paint(rectPts(cx - s * .64, cy - s * .64, s * 1.28, s * 1.28, 4), { fill: '#E3C58E', fillOp: 220, bleed: .08, tex: .9, border: .5, ink: null });
      paint(rectPts(cx - s * .66, cy - s * .66, s * 1.32, s * .06), { wash: '#9A6B3E', ink: PAL.ink, sw: 1 });              // the box's rim
      paint(rectPts(cx - s * .66, cy + s * .6, s * 1.32, s * .06), { wash: '#9A6B3E', ink: PAL.ink, sw: 1 });
      paint(rectPts(cx - s * .66, cy - s * .66, s * .06, s * 1.32), { wash: '#9A6B3E', ink: PAL.ink, sw: 1 });
      paint(rectPts(cx + s * .6, cy - s * .66, s * .06, s * 1.32), { wash: '#9A6B3E', ink: PAL.ink, sw: 1 });
      for (let i = 0; i < 6; i++) {   // footprints heading out over the rim, up and to the right
        const x = cx + s * (.5 + i * .09), y = cy - s * (.1 + i * .1) + (i % 2 ? 8 : -8);
        paint(ellPts(x, y, s * .018, s * .03, 10, 0, -.6), { wash: '#8A6A44', ink: null });
      }
    },
  },
};

// Paint a code. Returns its geometry (for placing captions and checks).
function qrCard(text, cx, cy, size, styleName = 'plain', o = {}) {
  const st = { ...QR_STYLES.plain, ...(QR_STYLES[styleName] || {}) }, ecc = o.ecc || (st.emblem ? 'H' : 'Q'), t = o.t ?? T;
  // whole-pixel modules on a whole-pixel grid (at rest): fractional modules alias against the pixel grid and can defeat a
  // decoder reading the frame 1:1. The code comes out up to one module smaller than `size`.
  const Mx = qrMatrix(text, ecc), n = Mx.n, m = Math.max(1, Math.floor(size / (n + 2 * QR_QUIET)));
  size = m * (n + 2 * QR_QUIET); cx = Math.round(cx - size / 2) + size / 2; cy = Math.round(cy - size / 2) + size / 2;
  const k = o.k ?? 1; if (k <= 0) return null;
  push(); translate(cx, cy);
  // arrival: slides up on an arc and settles; the scanner-facing part is still by the time k reaches 1
  if (k < 1) { const e = backOut(k); translate(0, (1 - e) * 60); rotate((1 - e) * .08); scale(.6 + .4 * e); }
  translate(-cx, -cy);
  if (st.frame) { boilSeed('qr frame ' + text); st.frame(cx, cy, size, t); }
  // everything a scanner reads is drawn from a fixed seed, so it never boils
  randomSeed(7);
  const x0 = cx - size / 2, y0 = cy - size / 2, ox = x0 + QR_QUIET * m, oy = y0 + QR_QUIET * m;
  paint(rectPts(x0, y0, size, size), { wash: st.bg, ink: null });
  // the emblem clears a disc of modules (never touching the eyes or the timing lines)
  const er = st.emblem && ecc === 'H' ? (o.emblemR ?? .15) * n * m : 0;
  const cleared = (r, c) => er && Math.hypot((c + .5) * m - n * m / 2, (r + .5) * m - n * m / 2) < er + m * .6;
  const shape = typeof st.module === 'function' ? st.module : QR_MODULES[st.module];
  for (let r = 0; r < n; r++) {
    if (!shape) {   // squares: merge each row's runs into one rectangle
      for (let c = 0; c < n; c++) {
        if (!Mx.dark(r, c) || inFinder(r, c, n) || cleared(r, c)) continue;
        let e = c; while (e + 1 < n && Mx.dark(r, e + 1) && !inFinder(r, e + 1, n) && !cleared(r, e + 1)) e++;
        paint(rectPts(ox + c * m - .3, oy + r * m - .3, (e - c + 1) * m + .6, m + .6), { wash: st.fg, ink: null });
        c = e;
      }
    } else for (let c = 0; c < n; c++) if (Mx.dark(r, c) && !inFinder(r, c, n) && !cleared(r, c)) shape(ox + c * m, oy + r * m, m, st.fg, r, c, Mx);
  }
  const eye = typeof st.eye === 'function' ? st.eye : QR_EYES[st.eye];
  for (const [r, c] of [[0, 0], [0, n - 7], [n - 7, 0]]) eye(ox + c * m, oy + r * m, m, st.fg, st.bg);
  if (er) { boilSeed('qr emblem ' + text); st.emblem(cx, cy, er, t); }
  pop();
  if (o.caption) letter(o.caption, cx, cy + size * ((st.reach ?? (st.frame ? .64 : .5)) + .1), Math.max(18, size * .07), PAL.ink, { ink: false, ...(o.captionOpts || {}) });
  return { n, m, ecc, x0, y0, size };
}

// Little frog and axolotl for QR dressing (the full-size cast lives in cast.js). (x, y) = the bottom middle; s = width.
function qrFrog(x, y, s, t = 0, look = 0) {
  const b = Math.sin(t * 3) * s * .02;
  paint(ellPts(x, y - s * .32 + b, s * .5, s * .32, 22), { wash: '#5E9B4A', ink: PAL.ink, sw: .9 });
  for (const d of [-1, 1]) {
    paint(ellPts(x + d * s * .24, y - s * .62 + b, s * .15, s * .15, 14), { wash: '#5E9B4A', ink: PAL.ink, sw: .8 });
    paint(ellPts(x + d * s * .24 + look * s * .04, y - s * .63 + b, s * .08, s * .08, 10), { wash: PAL.cream, ink: PAL.ink, sw: .5 });
    paint(ellPts(x + d * s * .24 + look * s * .08, y - s * .63 + b, s * .035, s * .035, 8), { wash: PAL.ink, ink: null });
  }
  inkLine([[x - s * .2, y - s * .3 + b], [x, y - s * .24 + b], [x + s * .2, y - s * .3 + b]], .7, PAL.ink, 'inkfine');
}
function qrAxolotl(x, y, s, t = 0, look = 0) {
  const b = Math.sin(t * 2.5 + 1) * s * .02;
  for (const d of [-1, 1]) for (let i = 0; i < 3; i++) {   // three feathery gills a side
    const a = (d < 0 ? Math.PI : 0) + d * (-.7 + i * .45) + .06 * Math.sin(t * 2 + i), r0 = s * .3, r1 = s * .62;
    paint(ribbon([[x + Math.cos(a) * r0, y - s * .45 + b + Math.sin(a) * r0], [x + Math.cos(a) * r1, y - s * .45 + b + Math.sin(a) * r1]], s * .09, s * .03), { wash: '#D95F86', ink: PAL.ink, sw: .6 });
  }
  paint(ellPts(x, y - s * .38 + b, s * .46, s * .36, 24), { wash: '#F2A1B8', ink: PAL.ink, sw: .9 });
  for (const d of [-1, 1]) paint(ellPts(x + d * s * .2 + look * s * .06, y - s * .44 + b, s * .045, s * .045, 8), { wash: PAL.ink, ink: null });
  inkLine([[x - s * .16, y - s * .28 + b], [x, y - s * .22 + b], [x + s * .16, y - s * .28 + b]], .7, PAL.ink, 'inkfine');
}
