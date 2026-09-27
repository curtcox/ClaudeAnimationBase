// qr_styles.js: how each QR code is dressed. The engine (qr.js) reads these registries; look.js says which style each
// reference wears. Add or change a style here and every code that wears it follows.
//
// A style: { bg, fg, eye, module, frame, emblem, reach, present, captionFont }
//   bg / fg     the code's two colours (keep the luminance ratio >= 7:1)
//   eye/module  a shape name from QR_EYES / QR_MODULES, or a function with the same signature
//   frame(cx, cy, s, t, L)   decoration OUTSIDE the quiet zone (s = the code's size incl. quiet zone)
//   reach       how far below the centre the frame extends, in s (the caption goes under it)
//   emblem(cx, cy, r, t, L)  the centre picture at ECC H; the modules under it are cleared first
//   present(L, st, k, t)     paint the code yourself (a bespoke reveal driven by k); must end, at k = 1, with the code
//               exactly as qrPaintCols(L, st, 0, L.n) would paint it
//   extent      how far the whole dressed card reaches from its centre, in s (so a screen or slot can fit it)
//   captionFont a CSS font family for the caption

// ---------- module shapes: fn(x, y, m, fg, r, c, M) paints one dark module whose top-left is (x, y), m px square ----------
Object.assign(QR_MODULES, {
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
  // hand-drawn: each horizontal run is one slightly wobbly block, the same every frame (seeded by its place, not the boil)
  hand: Object.assign((x, y, m, fg, r, c, L, run) => {
    const w = (i, a) => (hash(r * 977 + c * 131 + i) - .5) * 2 * a * m;
    const x1 = x + run * m, P = [[x + w(1, .085), y + w(2, .085)]];
    for (let i = 1; i < run; i++) P.push([x + i * m + w(50 + i, .06), y + w(10 + i, .07)]);
    P.push([x1 + w(3, .085), y + w(4, .085)], [x1 + w(5, .085), y + m + w(6, .085)]);
    for (let i = run - 1; i > 0; i--) P.push([x + i * m + w(70 + i, .06), y + m + w(30 + i, .07)]);
    P.push([x + w(7, .085), y + m + w(8, .085)]);
    paint(P, { wash: fg, ink: null });
  }, { runs: true }),
});

// ---------- finder eyes: fn(x, y, m, fg, bg) paints the 7×7 eye whose top-left is (x, y) ----------
Object.assign(QR_EYES, {
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
  // hand-drawn squares: wobbly, never broken (the ring stays a full module wide all the way round)
  hand: (x, y, m, fg, bg) => {
    const q = (x0, y0, s, i) => { const w = k => (hash(x0 * 3.1 + y0 * 7.7 + k + i) - .5) * .09 * m; return [[x0 + w(1), y0 + w(2)], [x0 + s + w(3), y0 + w(4)], [x0 + s + w(5), y0 + s + w(6)], [x0 + w(7), y0 + s + w(8)]]; };
    paint(q(x, y, 7 * m, 0), { wash: fg, ink: null });
    paint(q(x + m, y + m, 5 * m, 10), { wash: bg, ink: null });
    paint(q(x + 2 * m, y + 2 * m, 3 * m, 20), { wash: fg, ink: null });
  },
});

// ---------- styles ----------
// bg/fg: the code's two colours (keep the luminance ratio >= 7:1). eye/module: shape names above, or functions.
// frame(cx, cy, s, t): painted decoration OUTSIDE the quiet zone (s = code size incl. quiet zone); reach: how far below the
// centre the frame extends, in s (the caption goes under it). emblem(cx, cy, r, t): the centre picture at ECC H (r = its
// radius in px); the modules under it are cleared first.
Object.assign(QR_STYLES, {
  plain: { extent: .5, bg: PAL.cream, fg: PAL.ink, eye: 'square', module: 'square' },

  // MAD #157: newsprint, halftone dots, comic-panel eyes, a panel border
  newsprint: {
    bg: '#F4EBD2', fg: '#231F20', eye: 'square', module: 'dot', extent: .58,
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
    bg: '#F3F6E4', fg: '#1F4A22', eye: 'round', module: 'leaf', reach: .95, extent: .92,
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
    bg: '#F6EFE2', fg: '#1A1418', eye: 'ring', module: 'round', extent: .62,
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

  // xkcd #356, first version: machine-flat squares and a zigzag lattice (kept for comparison)
  'xkcd-flat': {
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

  // xkcd #356, hand-drawn: wobbly pen blocks and eyes, a thin comic-panel border, a stick figure stopped dead in the road
  // to stare at it (nerd sniping), and the infinite grid of resistors doodled in the corner
  xkcd: {
    bg: '#FFFFFF', fg: '#151515', eye: 'hand', module: 'hand', reach: .72, extent: 1.15, captionCase: 'upper', captionFont: '"Patrick Hand", "Comic Sans MS", cursive',
    frame: (cx, cy, s, t) => {
      const R = s * .6, pen = (P, w = 1.6) => inkLine(P, w, '#151515', 'pen', .35);
      paint(rectPts(cx - R, cy - R, R * 2, R * 2), { wash: '#FFFFFF', ink: null });
      // a comic panel, drawn freehand: four strokes that don't quite meet
      pen([[cx - R - 4, cy - R + 2], [cx - R * .2, cy - R - 3], [cx + R + 6, cy - R + 1]]);
      pen([[cx + R + 2, cy - R - 5], [cx + R - 3, cy + R * .1], [cx + R + 1, cy + R + 4]]);
      pen([[cx + R + 5, cy + R - 1], [cx + R * .3, cy + R + 3], [cx - R - 3, cy + R]]);
      pen([[cx - R + 1, cy + R + 5], [cx - R - 3, cy], [cx - R + 2, cy - R - 5]]);
      // the infinite grid of resistors, spilling off the panel's top right corner
      const g = s * .1, gx = cx + R * 1.12, gy = cy - R * 1.02;
      const zig = (a, b) => { const P = [a]; for (let k = 1; k < 6; k++) { const q = k / 6, d = k % 2 ? 1 : -1, horiz = Math.abs(a[1] - b[1]) < 1; P.push([lerp(a[0], b[0], q) + (horiz ? 0 : d * g * .16), lerp(a[1], b[1], q) + (horiz ? d * g * .16 : 0)]); } P.push(b); inkLine(P, .9, '#151515', 'pen', 0); };
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
        const x = gx - i * g, y = gy + j * g * .9;
        if (i < 2) zig([x - g, y], [x, y]);
        if (j < 2) zig([x, y], [x, y + g * .9]);
        paint(ellPts(x, y, 2.2, 2.2, 6), { wash: '#151515', ink: null });
      }
      // a stick figure stopped dead mid-stride, head tipped up at the code: nerd-sniped
      const h = s * .085, fx = cx - R - h * 2.2, fy = cy + R, bob = Math.sin(t * .6) * h * .05;
      paint(ellPts(fx + h * .2, fy - h * 6.1 + bob, h * .95, h * .95, 18), { wash: '#FFFFFF', ink: null });
      const ring = []; for (let i = 0; i <= 18; i++) { const a = i / 17 * TAU + .4; ring.push([fx + h * .2 + Math.cos(a) * h * .95, fy - h * 6.1 + bob + Math.sin(a) * h * .95]); }
      inkLine(ring, 1.3, '#151515', 'pen', .5);
      pen([[fx, fy - h * 5.1], [fx - h * .05, fy - h * 3.4], [fx, fy - h * 2]], 1.4);
      pen([[fx, fy - h * 2], [fx - h * .8, fy - h * 1], [fx - h * 1.1, fy]], 1.4);
      pen([[fx, fy - h * 2], [fx + h * .5, fy - h * 1.1], [fx + h * 1.2, fy - h * .2]], 1.4);
      pen([[fx, fy - h * 4.4], [fx - h * .9, fy - h * 3.5], [fx - h * 1.3, fy - h * 2.8]], 1.4);
      pen([[fx, fy - h * 4.4], [fx + h * .8, fy - h * 3.6], [fx + h * 1.2, fy - h * 3]], 1.4);
      pen([[cx - R * 1.9, fy + 3], [cx - R * 1.2, fy + 1], [cx - R * .9, fy + 3]], 1);   // the road
    },
  },

  // MAD's Fold-In: the page arrives unfolded, wider than the code, with a painted panel in the middle; it folds so arrow A
  // meets arrow B, and the two outer strips join into the code. Only the folded code has to scan (it's still by then).
  foldin: {
    bg: '#F4EBD2', fg: '#231F20', eye: 'square', module: 'dot', reach: .7, extent: .92,
    // k: 0 → .55 hold unfolded, .55 → .9 fold, .9 → 1 settle
    gap: (s, k) => s * .62 * (1 - ease(seg(k, .55, .9))),
    frame: (cx, cy, s, t, L, k = 1) => {
      const g = QR_STYLES.foldin.gap(s, k), W2 = s / 2 + g / 2 + s * .06, H2 = s * .56;
      paint(rectPts(cx - W2, cy - H2 - s * .2, W2 * 2, H2 * 2 + s * .2, 2), { wash: '#F4EBD2', ink: PAL.ink, sw: 1.6 });
      // the Fold-In's heading band, as on the magazine's inside back cover
      paint(rectPts(cx - W2 + s * .03, cy - H2 - s * .18, W2 * 2 - s * .06, s * .1), { wash: '#231F20', ink: null });
      letter('FOLD-IN', cx - W2 + s * .05, cy - H2 - s * .13, Math.max(14, s * .07), '#F4EBD2', { ink: false, align: 'left', font: `${Math.round(Math.max(14, s * .075))}px "Permanent Marker"` });
      if (g > s * .1) letter('WHAT DID THAT APE SAY?', cx + g * .02, cy - H2 - s * .13, Math.max(10, s * .035), '#F4EBD2', { ink: false, alpha: clamp(g / (s * .3)) });
      // the A and B arrows at the top, over the fold lines (they meet when it's folded)
      const ax = cx - g / 2, bx = cx + g / 2, ty = cy - H2 - s * .04;
      for (const [x, lab, d] of [[ax, 'A', -1], [bx, 'B', 1]]) {
        paint([[x, ty + s * .035], [x - s * .025, ty - s * .01], [x + s * .025, ty - s * .01]], { wash: PAL.ink, ink: null });
        if (g > s * .08) letter(lab, x + d * s * .045, ty, Math.max(14, s * .045), PAL.ink, { ink: false });
      }
      if (g > s * .12) letter('FOLD SO A MEETS B', cx, cy + H2 - s * .015, Math.max(12, s * .03), PAL.ink, { ink: false, alpha: .85 * clamp(g / (s * .3)) });
    },
    present: (L, st, k, t) => {
      const { n, m, ox, y0, size } = L, split = Math.floor(n / 2), seam = ox + split * m, g = QR_STYLES.foldin.gap(size, k);
      qrPaintCols(L, st, 0, split, -g / 2);
      qrPaintCols(L, st, split, n, g / 2);
      if (g < 1) return;
      // the middle panel: a sheepish painted ape (the ventriloquist's "dummy"), creased down the middle as it folds away
      boilSeed('foldin middle ' + L.text);
      const x0 = seam - g / 2, fold = 1 - g / (size * .62);
      paint(rectPts(x0, y0, g, size), { wash: '#F4EBD2', ink: null });
      push(); translate(seam, y0 + size * .55); scale(clamp(g / (size * .62)), 1);
      const u = size * .08;
      paint(ellPts(0, 0, u * 2.1, u * 2.4, 22), { wash: '#6B4A36', ink: PAL.ink, sw: 1.2 });                // head
      paint(ellPts(0, u * .5, u * 1.5, u * 1.3, 20), { wash: '#C9A27E', ink: PAL.ink, sw: 1 });             // muzzle
      for (const d of [-1, 1]) {
        paint(ellPts(d * u * .7, -u * .7, u * .35, u * .3, 12), { wash: PAL.cream, ink: PAL.ink, sw: .8 });
        paint(ellPts(d * u * .7 + u * .12, -u * .66, u * .14, u * .16, 8), { wash: PAL.ink, ink: null });
        paint(ellPts(d * u * 2.1, -u * .2, u * .5, u * .7, 12), { wash: '#6B4A36', ink: PAL.ink, sw: .9 });   // ears
      }
      inkLine([[-u * .6, u * 1.05], [0, u * .9], [u * .6, u * 1.15]], 1.1, PAL.ink);                     // sheepish mouth
      emote('sweat', u * 2, -u * 1.6, u * .8, 1, t);
      pop();
      // the crease: a valley fold darkens toward the middle as the page folds
      for (const d of [-1, 1]) paint([[seam, y0], [seam + d * g / 2, y0], [seam + d * g / 2, y0 + size], [seam, y0 + size]], { wash: PAL.ink, washOp: 90 * fold, ink: null });
      inkLine([[seam, y0 + 4], [seam, y0 + size / 2], [seam, y0 + size - 4]], .6, mixCol(PAL.ink, '#F4EBD2', .5), 'inkfine', 0);
    },
  },

  // an explainer page on the companion site: a sheet of lined notebook paper with a red margin and a pencil; the reader
  // learns that a yellow-and-lined code means "this opens a plain-language explanation"
  note: {
    bg: '#FFFDF4', fg: '#1E2A44', eye: 'round', module: 'round', extent: .68, reach: .72,
    frame: (cx, cy, s, t) => {
      const R = s * .6;
      paint(rrPts(cx - R, cy - R, R * 2, R * 2.1, 8), { wash: '#FFF1CE', ink: PAL.ink, sw: 1.2 });
      for (let i = 1; i < 12; i++) { const y = cy - R + i * R * 2.1 / 12; if (Math.abs(y - cy) > s * .52) inkLine([[cx - R + 8, y], [cx + R - 8, y]], .6, '#9DB4D8', 'inkfine', 0); }
      inkLine([[cx - R * .82, cy - R + 4], [cx - R * .82, cy + R * 1.1 - 4]], .9, '#D9776A', 'inkfine', 0);
      push(); translate(cx + R * .95, cy + R * .9); rotate(-.9);   // a pencil resting on the corner
      paint(rectPts(-s * .03, -s * .28, s * .06, s * .4), { wash: '#E8AA38', ink: PAL.ink, sw: .8 });
      paint([[-s * .03, s * .12], [s * .03, s * .12], [0, s * .19]], { wash: '#E9D2B0', ink: PAL.ink, sw: .8 });
      pop();
    },
  },

  // the Dish of the Day: served on a plate with cutlery
  'dinner-plate': {
    bg: '#FBF6EA', fg: '#3B2418', eye: 'round', module: 'round', reach: .8, extent: .97,
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
    bg: '#FBF3E0', fg: '#2B2233', eye: 'square', module: 'round', extent: .68,
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
});

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
