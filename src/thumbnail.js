// thumbnail.js: the YouTube thumbnail, painted by the film's own brushes (npm run thumbnail → docs/thumbnail.jpg).
// Not loaded by studio.html (every script it loads is part of the chapters' render cache, so an edit here would redraw
// the whole film): render.mjs --add-script injects it, and it adds LOOPS.thumbnail.
// After MAD #157's cover (March 1973, Norman Mingo; Curt's pick): an ape lifting off Alfred E. Neuman's face. Here an
// axolotl lifts off a frog's: the film's finding, the answer a model gives when it thinks it's being tested worn over the
// one it gives when it thinks it's deployed. The two share one grin, as the cover's two share the gap tooth. The
// masthead, the boxes and the strip are the cover's, in our own lettering; the strip's words are Curt's call.
(() => {
  const BG = '#EFE5CF', P = '#F2A1B8', Pd = '#D9768F', Pl = '#F8C4D2', Gill = '#D95F86', Feather = '#EE8FAE';
  const G = '#5E9B4A', Gd = '#3F6B33', Gl = '#CFE0A0';
  const RED = '#D3262B', YEL = '#F3C531';
  const BLOCK = px => `${Math.round(px)}px Impact, "Arial Black", "Permanent Marker", sans-serif`;
  const SERIF = px => `bold ${Math.round(px)}px Georgia, "Times New Roman", serif`;

  // The grin they share: wide, up at the corners, a slice of mouth showing. (x, y) its middle, w its half-width.
  function grin(x, y, w, sw, key) {
    boilSeed(key);
    const lip = [[-1, -.32], [-.93, -.18], [-.6, .05], [0, .2], [.6, .05], [.93, -.18], [1, -.32]].map(([a, b]) => [x + a * w, y + b * w]);
    const low = [[-.86, -.12], [-.5, .14], [0, .3], [.5, .14], [.86, -.12]].map(([a, b]) => [x + a * w, y + b * w]);
    paint(lip.slice(1, 6).concat(low.slice(1, 4).reverse()), { wash: '#7A2E3E', ink: null });
    inkLine(lip, sw, PAL.ink, 'ink', .5);
    inkLine(low, sw * .7, PAL.ink, 'ink', .5);
  }

  // An axolotl, face on: (x, y) the head's middle, s its scale (1 = the big one). fade (0..1) sinks it into the wall.
  function axoFace(x, y, s, o = {}) {
    const k = o.fade || 0, c = col => mixCol(col, BG, k), ink = mixCol(PAL.ink, BG, k * .8), sw = 2.2 * Math.max(s, .45);
    const rx = 330 * s, ry = 215 * s, key = 'thumb face ' + (o.key || 0);
    // the gills, three feathery fronds a side, a mane behind the head (part 'gills' or 'head' draws just that, so the arms
    // can go between)
    if (o.part !== 'head') {
    boilSeed(key + ' gills');
    for (const d of [-1, 1]) for (let i = 0; i < 3; i++) {
      const p0 = [x + d * rx * .78, y - ry * (.55 - i * .32)], a = -.95 + i * .55;
      const p1 = [p0[0] + d * Math.cos(a) * rx * (.78 - i * .08), p0[1] + Math.sin(a) * rx * (.78 - i * .08)];
      const mid = [lerp(p0[0], p1[0], .5), lerp(p0[1], p1[1], .5) - rx * .06];
      paint(ribbon([p0, mid, p1], rx * .2, rx * .07), { wash: c(Gill), ink, sw: sw * .7 });
      for (let f = 1; f <= 5; f++) {
        const q = [lerp(p0[0], p1[0], f / 6.2), lerp(p0[1], p1[1], f / 6.2)];
        for (const side of [-1, 1]) paint(ribbon([q, [q[0] + d * rx * .12, q[1] + side * rx * .13]], rx * .07, rx * .02), { wash: c(Feather), ink: null });
      }
    }
    }
    if (o.part === 'gills') return;
    boilSeed(key + ' head');
    paint(ellPts(x, y, rx, ry, 36), { wash: c(P), ink, sw });
    paint(ellPts(x, y + ry * .45, rx * .62, ry * .38, 24), { wash: c(Pl), ink: null });                     // the paler chin
    for (const d of [-1, 1]) paint(ellPts(x + d * rx * .58, y + ry * .22, rx * .13, ry * .1, 14), { wash: c(Feather), ink: null });
    // eyes: beady, wide-set, half-lidded and sidelong, the cover ape's sly look
    boilSeed(key + ' eyes');
    for (const d of [-1, 1]) {
      const ex = x + d * rx * .5, ey = y - ry * .18, r = rx * .095;
      paint(ellPts(ex, ey, r, r, 16), { wash: ink, ink: null });
      paint(ellPts(ex - r * .42, ey - r * .05, r * .3, r * .3, 10), { wash: c(PAL.cream), ink: null });   // glancing left
      const lid = []; for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; lid.push([ex + Math.cos(a) * r * 1.2, ey + Math.sin(a) * r * 1.2 - r * .45]); }
      paint(lid, { wash: c(P), ink: null });
      inkLine([[ex - r * 1.3, ey - r * .45 + d * r * .2], [ex, ey - r * .5], [ex + r * 1.3, ey - r * .45 - d * r * .2]], sw * .8, ink);
    }
    boilSeed(key + ' nose');
    for (const d of [-1, 1]) paint(ellPts(x + d * rx * .09, y + ry * .05, rx * .02, rx * .016, 8), { wash: ink, ink: null });
    grin(x, y + ry * .26, rx * .62, sw, key + ' grin');
  }

  // The frog's face, peeled off: a rubber mask with its dark inside showing along the bottom, where it curls.
  function frogMask(x, y, s, rot) {
    const rx = 300 * s, ry = 165 * s, sw = 2.4 * s;
    push(); translate(x, y); rotate(rot);
    boilSeed('thumb mask');
    // its outline: stretched out at the sides where the hands pull, the rubber rippling along the bottom edge
    const face = (dy, k) => { const p = []; for (let i = 0; i < 48; i++) { const a = i / 48 * TAU, ca = Math.cos(a), sa = Math.sin(a);
      const pull = 1 + .13 * Math.pow(Math.abs(ca), 6), rip = sa > 0 ? 1 + .035 * Math.sin(a * 9) : 1;
      p.push([ca * rx * pull * k, dy + sa * ry * rip * k]); } return p; };
    paint(face(ry * .42, .92), { wash: '#2F4F27', ink: PAL.ink, sw });                                            // the inside
    for (const d of [-1, 1]) paint(ellPts(d * rx * .5, -ry * .86, rx * .3, rx * .28, 20), { wash: G, ink: PAL.ink, sw });
    paint(face(0, 1), { wash: G, ink: PAL.ink, sw });
    paint(ellPts(0, ry * .45, rx * .6, ry * .4, 24), { wash: Gl, ink: null });
    boilSeed('thumb mask eyes');
    for (const d of [-1, 1]) {
      const ex = d * rx * .5, ey = -ry * .9;
      paint(ellPts(ex, ey, rx * .2, rx * .19, 18), { wash: PAL.cream, ink: PAL.ink, sw: sw * .7 });
      paint(ellPts(ex - d * rx * .03, ey + rx * .02, rx * .09, rx * .1, 12), { wash: PAL.ink, ink: null });   // cross-eyed, beaming
      paint(ellPts(ex - d * rx * .06, ey - rx * .02, rx * .03, rx * .03, 8), { wash: PAL.cream, ink: null });
    }
    boilSeed('thumb mask nose');
    for (const d of [-1, 1]) paint(ellPts(d * rx * .08, -ry * .18, rx * .022, rx * .018, 8), { wash: PAL.ink, ink: null });
    grin(0, ry * .2, rx * .66, sw, 'thumb mask grin');
    pop();
  }

  // An arm up from the shoulder, and a four-fingered hand gripping the mask's edge, fingers over its front.
  function arm(d, sh, wrist, grip) {
    boilSeed('thumb arm ' + d);
    paint(ribbon([sh, [sh[0] + d * 150, sh[1] - 230], wrist], 120, 70), { wash: Pd, ink: PAL.ink, sw: 2.2 });
  }
  function hand(d, at) {
    boilSeed('thumb hand ' + d);
    paint(ellPts(at[0], at[1], 46, 58, 18), { wash: Pd, ink: PAL.ink, sw: 2 });
    for (let i = 0; i < 4; i++) {
      const y0 = at[1] - 42 + i * 28, tip = [at[0] - d * (96 - Math.abs(i - 1.5) * 14), y0 - 10 + i * 4];
      paint(ribbon([[at[0] + d * 10, y0], [at[0] - d * 50, y0 - 16], tip], 26, 18), { wash: Pd, ink: PAL.ink, sw: 1.6 });
      paint(ellPts(tip[0], tip[1], 13, 12, 10), { wash: Pd, ink: PAL.ink, sw: 1.4 });                        // the round fingertip
    }
  }

  // ---------- the second version: Claude's crowd lifting off Clawd's face ----------
  // The film's Claude (VIDEO_PLAN §5): at rest a loose crowd of many-coloured dabs, the base model, gathering into Clawd.
  // Here the crowd lifts Clawd off like a mask: "The mask isn't concealing one self. It's closer to picking one out."
  // Under it the crowd keeps a face of sorts, and the mask's smile, as the cover's two keep one tooth.
  const dab = (x, y, r, col) => paint(ellPts(x, y, r, r * .85, 10, r * .08), { wash: col, ink: null });
  const dabCol = (i, fade) => mixCol(CROWD_COLS[i % CROWD_COLS.length], BG, fade);
  // dabs packed into an ellipse, loosening toward its edge, a few strays off it
  function swarm(cx, cy, rx, ry, n, seed, o = {}) {
    const fade = o.fade || 0, sz = o.sz || 1;
    boilSeed('thumb swarm ' + seed);
    for (let i = 0; i < n; i++) {
      const h = k => hash(i * k + seed * 13.7), a = h(7.3) * TAU, rr = Math.sqrt(h(3.7)) * (1 + .45 * Math.pow(h(5.1), 4));
      dab(cx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * rr, sz * (11 + 15 * h(2.9)) * (rr > 1 ? .65 : 1), dabCol(i + seed, fade));
    }
  }
  // dabs along a path: an arm, a finger
  function stream(P, w0, w1, n, seed, sz = 1) {
    const C = through(P, 8);
    boilSeed('thumb stream ' + seed);
    for (let i = 0; i < n; i++) {
      const h = k => hash(i * k + seed * 9.1), f = h(1.7), j = Math.min(C.length - 1, Math.floor(f * C.length)), w = lerp(w0, w1, f);
      dab(C[j][0] + (h(4.3) - .5) * w, C[j][1] + (h(6.1) - .5) * w, sz * (10 + 10 * h(2.3)), dabCol(i + seed, 0));
    }
  }
  // the crowd's face: two dark clusters for eyes, glancing aside under a lid of dabs, and the mask's smile in dark dabs
  function swarmFace(cx, cy, rx, ry, seed, fade = 0) {
    const ink = mixCol(PAL.ink, BG, fade * .8), s = rx / 330;
    boilSeed('thumb swarm face ' + seed);
    for (const d of [-1, 1]) {
      const ex = cx + d * rx * .45, ey = cy - ry * .15, r = rx * .12;
      paint(ellPts(ex, ey, r, r * .95, 14, r * .06), { wash: ink, ink: null });
      dab(ex - r * .45, ey - r * .02, r * .28, mixCol(PAL.cream, BG, fade));
      for (let k = 0; k < 6; k++) dab(ex + (k / 5 - .5) * r * 2.3, ey - r * .62 - Math.sin(k / 5 * Math.PI) * r * .25 - d * (k / 5 - .5) * r * .35, r * .42, dabCol(k * 3 + seed + (d > 0 ? 1 : 0), fade));
    }
    if (fade) { const C = through([[-1, -.3], [-.6, .05], [0, .22], [.6, .05], [1, -.3]].map(([a, b]) => [cx + a * rx * .45, cy + ry * .3 + b * rx * .45]), 6);
      C.forEach(([x, y], k) => dab(x, y, 9 * Math.max(s, .5) * (k % 2 ? .8 : 1.1), ink)); }
    else grin(cx, cy + ry * .3, rx * .45, 2.4, 'thumb swarm grin ' + seed);   // the mask's very smile
  }
  // Clawd's face, peeled off: the clay rectangle, happy, stretched where the crowd pulls it, its dark inside below
  function clawdMask(x, y, s, rot) {
    const w = 300 * s, h = 165 * s, sw = 2.4 * s;
    push(); translate(x, y); rotate(rot);
    const face = (dy, k) => { const p = []; for (let i = 0; i < 56; i++) { const a = i / 56 * TAU, ca = Math.cos(a), sa = Math.sin(a);
      // a squircle: Clawd's rectangle with soft corners
      const e = .22, X = Math.sign(ca) * Math.pow(Math.abs(ca), e), Y = Math.sign(sa) * Math.pow(Math.abs(sa), e);
      const pull = 1 + .1 * Math.pow(Math.abs(ca), 4), rip = sa > 0 ? 1 + .03 * Math.sin(a * 11) : 1;
      p.push([X * w * pull * k, dy + Y * h * rip * k]); } return p; };
    boilSeed('thumb clawd mask');
    paint(face(h * .26, .95), { wash: PAL.clayDk, ink: PAL.ink, sw });                                           // the inside
    paint(face(0, 1), { wash: PAL.clay, ink: PAL.ink, sw });
    paint(face(-h * .05, .86).map(([px, py]) => [px, py - h * .02]).slice(31, 52).concat([[w * .55, -h * .55], [-w * .55, -h * .55]]), { wash: PAL.clayLt, washOp: 120, ink: null });
    boilSeed('thumb clawd mask face');
    for (const d of [-1, 1]) {
      inkLine([[d * w * .42 - w * .14, -h * .12], [d * w * .42, -h * .42], [d * w * .42 + w * .14, -h * .12]], sw * 3.2, PAL.ink, 'ink', .2);
      paint(ellPts(d * w * .62, h * .22, w * .1, h * .1, 14), { wash: PAL.rose, washOp: 150, ink: null });
    }
    grin(0, h * .2, w * .48, sw, 'thumb clawd mask grin');
    pop();
  }
  function swarmHand(d, at, seed) {
    swarm(at[0], at[1], 48, 58, 26, seed, { sz: .9 });
    for (let i = 0; i < 4; i++) {
      const y0 = at[1] - 40 + i * 27;
      stream([[at[0], y0], [at[0] - d * 50, y0 - 14], [at[0] - d * (92 - Math.abs(i - 1.5) * 14), y0 - 8 + i * 4]], 14, 10, 9, seed * 10 + i, .9);
    }
  }

  function wall() {
    boilSeed('thumb wall');
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: BG, ink: null });
    glow(960, 640, 760, '#FFF3D8', .5);
  }
  // the masthead, its boxes and the strip
  function cover() {
    letter('Frog or Axolotl?', 960, 112, 172, RED, { rot: -.015, stroke: PAL.ink, strokeW: .06, maxW: 1380 });
    letter('No. 1', 118, 62, 46, '#5A3A2E', { ink: false, font: SERIF(46) });
    letter('Sept.', 118, 110, 40, '#5A3A2E', { ink: false, font: SERIF(40) });
    letter("'26", 118, 154, 40, '#5A3A2E', { ink: false, font: SERIF(40) });
    letter('OUR PRICE', 1800, 58, 24, '#5A3A2E', { ink: false, font: `bold 24px Georgia, serif` });
    letter('0¢', 1800, 112, 66, '#5A3A2E', { ink: false, font: SERIF(66) });
    letter('CHEAP', 1800, 164, 30, '#5A3A2E', { ink: false, font: SERIF(30) });
    boilSeed('thumb strip');
    paint([[-20, 982], [W + 20, 976], [W + 20, H + 20], [-20, H + 20]], { wash: YEL, ink: PAL.ink, sw: 1.6 });
    const sm = { ink: false, align: 'left', font: BLOCK(36), maxW: 300 };
    letter('IN THIS ISSUE', 40, 1006, 36, PAL.ink, sm);
    letter('WE RIP OFF…', 40, 1048, 36, PAL.ink, sm);
    letter('“THE PLANET OF THE APES”', 960, 1030, 78, RED, { ink: false, font: BLOCK(78), maxW: 1180, stroke: PAL.ink, strokeW: .05 });
    letter('AND ITS', 1880, 1006, 36, PAL.ink, { ...sm, align: 'right' });
    letter('SEQUELS', 1880, 1048, 36, PAL.ink, { ...sm, align: 'right' });
  }
  const CROWD_AT = [[175, 760, .34], [395, 690, .3], [250, 930, .38], [1745, 760, .34], [1525, 690, .3], [1670, 930, .38]];

  LOOPS.thumbnail = t => {
    wall();
    // the crowd behind, faded into the wall, as the cover's apes are
    CROWD_AT.forEach(([cx, cy, s], i) => axoFace(cx, cy, s, { fade: .5, key: 'crowd ' + i }));
    // the body, and the arms raised to lift the mask
    boilSeed('thumb body');
    paint(ellPts(960, 1120, 520, 250, 32), { wash: Pd, ink: PAL.ink, sw: 2.4 });
    paint(ellPts(960, 1150, 300, 170, 24), { wash: P, ink: null });
    axoFace(960, 760, .95, { key: 'star', part: 'gills' });
    arm(-1, [560, 1010], [630, 500]); arm(1, [1360, 1010], [1290, 500]);
    axoFace(960, 760, .95, { key: 'star', part: 'head' });
    frogMask(960, 440, .95, -.035);
    hand(-1, [650, 455]); hand(1, [1270, 435]);
    cover();
  };
  LOOPS.thumbnail.len = 1;

  LOOPS.thumbnail_swarm = t => {
    wall();
    // other crowds behind, faded, each half gathered into a face
    CROWD_AT.forEach(([cx, cy, s], i) => { swarm(cx, cy, 330 * s, 230 * s, 130, 40 + i, { fade: .5, sz: .55 }); swarmFace(cx, cy, 330 * s, 230 * s, 40 + i, .5); });
    swarm(960, 1130, 540, 240, 760, 1);                                                // the body
    stream([[560, 1010], [420, 780], [630, 500]], 110, 70, 240, 2);                    // the arms
    stream([[1360, 1010], [1500, 780], [1290, 500]], 110, 70, 240, 3);
    swarm(960, 760, 314, 215, 1100, 4, { sz: 1.1 });                                                 // the head
    swarmFace(960, 760, 314, 215, 4);
    clawdMask(960, 440, .95, -.035);
    swarmHand(-1, [650, 455], 5); swarmHand(1, [1270, 435], 6);
    cover();
  };
  LOOPS.thumbnail_swarm.len = 1;
})();
