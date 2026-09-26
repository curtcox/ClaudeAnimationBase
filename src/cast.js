// cast.js: the film's characters besides Clawd.
//
//   curt(x, y, u, o)      Curt, as a placeholder: a minimal stick figure in CGP Grey's manner (a plain round head, dot
//                         eyes, one clean line for everything else). Its bareness next to the painted Clawd is a gag of
//                         its own. (x, y) = the point between the feet (standing) or the seat (sitting); the head is
//                         2.2u across and the figure is about 15u tall standing.
//   frog(x, y, u, o)      the "Frog." of the frog/axolotl chart: the evaluation-context answer
//   axolotl(x, y, u, o)   the "Axolotl.": the real-use answer
//
// Like clawd(), each takes pose options, seeds its own boil per part, and draws one frame. Motion comes from what you
// pass in (talk(), looks, arm angles from kf()), never from state.

// A speaking envelope, until real voice timing replaces it: 0..1 openness at time t while a line plays from t0 to t1.
// Syllable-ish (about 5 a second), with a little irregularity, and closed outside the line.
function talk(t, t0, t1) {
  if (t < t0 || t > t1) return 0;
  const k = Math.min(1, (t - t0) / .08, (t1 - t) / .08), s = (t - t0) * 5.2;
  return k * clamp(.35 + .65 * Math.abs(Math.sin(s * Math.PI)) * (.6 + .4 * hash(Math.floor(s))));
}
// Clawd's mouth for a talk() value: resting (no mouth) when shut, 'o' when half open, 'open' when wide.
const clawdMouth = (k, rest = null) => k < .15 ? rest : k < .55 ? 'o' : 'open';

// ---------- Curt ----------
// Options:
//   look (costume; see CURT_VARIANTS for named combinations):
//     hair: 'none' | 'short' | 'ponytail' | 'bun';  outfit: 'stick' | 'hoodie' (+ hoodie: colour, hood: 'down' | 'up')
//     facial: 'none' | 'stubble' | 'mustache' | 'goatee' | 'circle' | 'beard' | 'chinstrap';  hairCol, facialCol,
//     ponyTip (the ponytail fades from hairCol at the roots to this at the tip)
//   view: 'front' | 'back' (from behind: no face, the hair and the hood carry him)
//   pose: 'stand' | 'sit' (legs hidden: sit behind a table), lean (radians, + = toward where he faces)
//   flip (face left), look (-1..1 pupils), brows: 'flat' | 'up' | 'skeptic' | 'down', mouth: 'flat' | 'smile' | 'o' | 'frown'
//   talk (0..1 openness, overrides mouth). Arms, either way:
//     handL / handR = [dx, dy] where the hand goes, in u from the shoulder (the elbow finds itself, bending outward);
//       presets by name: 'hang', 'chin', 'point', 'up', 'hip', 'shrug', 'wave', 'table'
//     or aL / aR (raise: 0 = hanging, 1.5 = straight out sideways) + eL / eR (elbow bend)
//   hand: 'table' puts both forearms flat on a table at the seat's height + 3.2u
//   seed (blink timing), boilKey
function curt(x, y, u, o = {}) {
  const id = o.boilKey ?? 'curt', rs = p => boilSeed(`curt ${id} ${p}`);
  const sw = clamp(u / 7, .9, 3.4), col = PAL.ink, f = o.flip ? -1 : 1, J = u * .05;
  const sit = o.pose === 'sit', lean = o.lean || 0, R = 2.2 * u;
  // skeleton: hips, then a spine of 5u, then the head
  const hip = [x, y - (sit ? 0 : 6 * u)];
  const neck = [hip[0] + f * Math.sin(lean) * 5 * u, hip[1] - Math.cos(lean) * 5 * u];
  const head = [neck[0] + f * Math.sin(lean) * R * .95, neck[1] - R * .95];
  // p5.brush's curved spline draws nothing for two points, so a straight limb gets a midpoint
  const line = (P, w = 1) => {
    if (P.length === 2) P = [P[0], [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2], P[1]];
    inkLine(P.map(p => [p[0] + jit(J), p[1] + jit(J)]), sw * w, col, 'ink', .4);
  };

  const hoodie = o.outfit === 'hoodie', hc = o.hoodie || '#4E5B78', hcDk = mixCol(hc, PAL.ink, .35), back = o.view === 'back';
  const hairCol = o.hairCol || '#3A2C26';
  if (!o.noShadow && !sit) { rs('shadow'); paint(ellPts(x, y + u * .2, u * 3.2, u * .6, 18), { fill: PAL.ink, fillOp: 70, bleed: .25, tex: .3, border: .1, ink: null }); }
  // legs
  rs('legs');
  if (!sit) {
    const st = o.walk != null ? Math.sin(o.walk * TAU) * .5 : 0;
    for (const d of [-1, 1]) line([hip, [x + d * u * 1.2 + d * st * u * 2, y]]);
  }
  // arms: seen from behind they're in front of his body, so the torso hides most of them
  const drawArms = () => {
    for (const side of ['L', 'R']) {
      rs('arm' + side);
      const s_ = side === 'L' ? -1 : 1, L1 = 2.5 * u, L2 = 2.4 * u;
      // a stick figure's arms hang from the neck; in a hoodie they hang from real shoulders
      const sh = hoodie ? [neck[0] + s_ * 1.55 * u, neck[1] + .95 * u] : [neck[0], neck[1] + .6 * u];
      let target = o['hand' + side];
      if (typeof target === 'string') target = CURT_HANDS[target]?.(s_, f, sit, o) ?? null;
      if (o.hand === 'table' && sit && !target) target = CURT_HANDS.table(s_, f, sit, o);
      let el, hand;
      if (target) {
        hand = [sh[0] + target[0] * u, sh[1] + target[1] * u];
        el = elbowFor(sh, hand, L1, L2, s_);
      } else {
        const a = o['a' + side] ?? .1, e = o['e' + side] ?? .15, a1 = s_ * (.3 + a), a2 = a1 + s_ * e;
        el = [sh[0] + Math.sin(a1) * L1, sh[1] + Math.cos(a1) * L1];
        hand = [el[0] + Math.sin(a2) * L2, el[1] + Math.cos(a2) * L2];
      }
      if (hoodie) {   // a sleeve along the arm, then a cuff and the hand poking out
        paint(ribbon([sh, el, [lerp(el[0], hand[0], .82), lerp(el[1], hand[1], .82)]], 1.05 * u, .85 * u), { wash: hc, fill: hcDk, fillOp: 50, tex: .4, ink: PAL.ink, sw: sw * .7 });
        line([[lerp(el[0], hand[0], .8), lerp(el[1], hand[1], .8)], hand], .9);
      } else line([sh, el, hand], .95);
    }
  };
  if (back) drawArms();
  // behind the head: the ponytail (front view: it swings out behind him), the hood
  if (o.hair === 'ponytail' && !back) { rs('pony'); curtPonytail(head, R, -f, u, hairCol, sw, false, o.ponyTip); }
  if (hoodie) {
    rs('hood');
    const hx = head[0] - f * R * .2, hy = neck[1] - R * .25;
    if (o.hood === 'up') paint(ellPts(head[0] - f * R * .05, head[1] + R * .05, R * 1.28, R * 1.25, 28), { wash: hc, fill: hcDk, fillOp: 60, tex: .4, ink: PAL.ink, sw: sw * .8 });
    else paint(ellPts(hx, hy + R * .15, R * 1.05, R * .55, 22), { wash: hcDk, ink: PAL.ink, sw: sw * .8 });
    // the torso: rounded shoulders down to the hem, with the kangaroo pocket and drawstrings
    rs('torso');
    const sx = 1.9 * u, hx0 = 1.5 * u, top = neck[1] + .1 * u, hem = hip[1] + .5 * u, lx = f * Math.sin(lean) * 2 * u;
    paint([[neck[0] - sx * .55, top - .1 * u], [neck[0] + sx * .55, top - .1 * u], [neck[0] + sx, top + .9 * u], [hip[0] + hx0 + lx * .1, hem], [hip[0] - hx0 + lx * .1, hem], [neck[0] - sx, top + .9 * u]],
      { wash: hc, fill: hcDk, fillOp: 50, tex: .4, ink: PAL.ink, sw: sw * .8, curv: .25 });
    if (!back) {
      paint(rrPts(hip[0] - 1 * u, hem - 2 * u, 2 * u, 1.2 * u, .4 * u), { wash: hcDk, ink: PAL.ink, sw: sw * .5 });
      for (const d of [-1, 1]) line([[neck[0] + d * .35 * u, top + .2 * u], [neck[0] + d * .4 * u, top + 1.8 * u]], .35);
    } else inkLine([[neck[0], top + .3 * u], [neck[0] + lx * .05, top + 2 * u], [hip[0], hem - .2 * u]], sw * .4, hcDk, 'inkfine', .5);
  } else { rs('spine'); line([hip, neck]); }
  // arms: shoulder at the neck; an upper arm and a forearm of 2.4u each
  if (!back) drawArms();
  // head: a plain circle, filled with paper so the boil lines behind it don't show through
  rs('head');
  paint(ellPts(head[0], head[1], R, R, 26, J), { wash: PAL.cream, ink: null, curv: .5 });
  // the outline as one open stroke that overlaps itself a little, so the brush's start and end don't blot
  const ring = []; for (let i = 0; i <= 30; i++) { const a = -2.2 + i / 28 * TAU; ring.push([head[0] + Math.cos(a) * R + jit(J * .5), head[1] + Math.sin(a) * R + jit(J * .5)]); }
  inkLine(ring, sw * 1.05, col, 'inkfine', .5);
  // hair: a cap over the crown (from behind it covers most of the head), a ponytail or bun down the back
  if (o.hair && o.hair !== 'none') {
    rs('hair');
    // front: the crown only; back: all round except a gap at the nape (angles run clockwise from screen-right)
    const cap = []; const a0 = back ? Math.PI / 2 + .75 : -Math.PI + (f > 0 ? .35 : .75), a1 = back ? Math.PI / 2 - .75 + TAU : -(f > 0 ? .75 : .35);
    for (let i = 0; i <= 20; i++) { const a = lerp(a0, a1, i / 20); cap.push([head[0] + Math.cos(a) * R * 1.02, head[1] + Math.sin(a) * R * 1.02]); }
    if (!back) { cap.push([head[0] + f * R * .35, head[1] - R * .72]); cap.push([head[0] - f * R * .25, head[1] - R * .84]); }
    else cap.push([head[0], head[1] + R * .82]);
    paint(cap, { wash: hairCol, ink: PAL.ink, sw: sw * .35, curv: .4 });
    if (o.hair === 'ponytail' && back) curtPonytail(head, R, 0, u, hairCol, sw, true, o.ponyTip);
    if (o.hair === 'bun') paint(ellPts(head[0] - f * R * (back ? 0 : .55), head[1] - R * (back ? .55 : .92), R * .38, R * .34, 16), { wash: hairCol, ink: PAL.ink, sw: sw * .7 });
  }
  if (back) { if (o.draw) { rs('draw'); o.draw({ head, neck, hip, u, sw }); } boilSeed('after curt ' + id); return { head, neck, hip }; }
  // face (faces the way he faces: features shifted toward f)
  rs('face');
  const fx = head[0] + f * .35 * u, fy = head[1], lx = (o.look || 0) * .18 * u;
  const blink = frac((T + (o.seed || 0) * 1.7) / 3.6) < .04;
  for (const d of [-1, 1]) {
    const ex = fx + d * .75 * u + lx;
    if (blink) line([[ex - .22 * u, fy - .2 * u], [ex + .22 * u, fy - .2 * u]], .6);
    else paint(ellPts(ex, fy - .2 * u, .2 * u, .24 * u, 10), { wash: col, ink: null });
  }
  const br = o.brows || 'none';
  if (br !== 'none') for (const d of [-1, 1]) {
    const bx = fx + d * .75 * u, by = fy - .95 * u;
    const tilt = br === 'up' ? -.25 : br === 'down' ? d * .22 : br === 'skeptic' ? (d > 0 ? -.35 : .05) : 0;
    const lift = br === 'up' ? -.2 * u : br === 'skeptic' && d > 0 ? -.25 * u : 0;
    line([[bx - .34 * u, by + lift - tilt * u * d * -1], [bx + .34 * u, by + lift + tilt * u * d * -1]], .42);
  }
  const my = fy + .8 * u, k = o.talk ?? 0;
  if (o.facial && o.facial !== 'none') { rs('facial'); curtFacial(o.facial, fx, fy, my, R, u, sw, o.facialCol || hairCol, head); }
  const onBeard = o.facial === 'beard';
  if (k > .12) paint(ellPts(fx, my, (.28 + .12 * k) * u, (.12 + .32 * k) * u, 12), { wash: '#4A1F2A', ink: onBeard ? PAL.cream : col, sw: sw * .5 });
  else if (onBeard) inkLine([[fx - .4 * u, my], [fx, my + .06 * u], [fx + .4 * u, my]], sw * .6, PAL.cream, 'ink', .5);
  else if (o.mouth === 'smile') line([[fx - .55 * u, my - .1 * u], [fx, my + .18 * u], [fx + .55 * u, my - .1 * u]], .7);
  else if (o.mouth === 'frown') line([[fx - .5 * u, my + .12 * u], [fx, my - .1 * u], [fx + .5 * u, my + .12 * u]], .7);
  else if (o.mouth === 'o') paint(ellPts(fx, my, .22 * u, .26 * u, 10), { wash: col, ink: null });
  else line([[fx - .45 * u, my], [fx + .45 * u, my]], .7);
  if (o.draw) { rs('draw'); o.draw({ head, neck, hip, u, sw }); }
  boilSeed('after curt ' + id);
  return { head, neck, hip };
}

function curtPonytail(head, R, side, u, col, sw, back, tip = col) {
  // from the back of the head (side = which way it swings; 0 = straight down the back), a band, then a tapered tail
  const bx = head[0] + side * R * .95, by = head[1] + (back ? R * .72 : -R * .05), sway = Math.sin(T * 2.1) * u * .12;
  const P = back ? [[bx, by], [bx + sway, by + R * 1.1], [bx + sway * 1.6, by + R * 2.1], [bx + sway * 2.2, by + R * 2.9]]
                 : [[bx, by], [bx + side * R * .35, by + R * .5], [bx + side * R * .4 + sway, by + R * 1.3], [bx + side * R * .3 + sway * 2, by + R * 1.9]];
  // painted in bands from root to tip so the colour can fade along it, then outlined once as one shape
  const C = through(P), n = C.length, w0 = u * (back ? 1.5 : .95), w1 = u * (back ? .35 : .25), bands = 6;
  for (let b = 0; b < bands; b++) {
    const i0 = Math.floor(b * (n - 1) / bands), i1 = Math.min(n - 1, Math.ceil((b + 1) * (n - 1) / bands) + 1);
    paint(ribbon(C.slice(i0, i1 + 1), lerp(w0, w1, i0 / (n - 1)), lerp(w0, w1, i1 / (n - 1))), { wash: mixCol(col, tip, (b + .5) / bands), ink: null });
  }
  paint(ribbon(P, w0, w1), { ink: PAL.ink, sw: sw * .7 });
  paint(ellPts(P[0][0] + (P[1][0] - P[0][0]) * .15, P[0][1] + (P[1][1] - P[0][1]) * .15, u * .45, u * .25, 10), { wash: mixCol(col, PAL.ink, .5), ink: PAL.ink, sw: sw * .5 });
}
// Facial hair, painted on the face: (fx, fy) = the face's centre, my = the mouth's height.
function curtFacial(kind, fx, fy, my, R, u, sw, col, head) {
  const mous = () => paint(ribbon([[fx - .75 * u, my - .05 * u], [fx - .3 * u, my - .38 * u], [fx + .3 * u, my - .38 * u], [fx + .75 * u, my - .05 * u]], .32 * u, .32 * u), { wash: col, ink: null, curv: .5 });
  const chin = (w, h) => paint([[fx - w / 2, my + .28 * u], [fx + w / 2, my + .28 * u], [fx + w * .3, my + .28 * u + h * .75], [fx, my + .28 * u + h], [fx - w * .3, my + .28 * u + h * .75]], { wash: col, ink: PAL.ink, sw: sw * .35, curv: .4 });
  if (kind === 'stubble') for (let i = 0; i < 70; i++) {
    const a = .15 * Math.PI + hash(i * 3.7) * .7 * Math.PI, r = R * (.55 + .4 * hash(i * 9.1));
    const x = head[0] + Math.cos(a) * r, y = head[1] + Math.sin(a) * r;
    if (Math.abs(x - fx) < .5 * u && Math.abs(y - my) < .25 * u) continue;   // not over the mouth
    paint(ellPts(x, y, u * .06, u * .06, 5), { wash: col, washOp: 170, ink: null });
  }
  if (kind === 'mustache') mous();
  if (kind === 'goatee') chin(1 * u, .95 * u);
  if (kind === 'circle') { mous(); chin(.9 * u, .75 * u); for (const d of [-1, 1]) paint(ribbon([[fx + d * .72 * u, my - .05 * u], [fx + d * .6 * u, my + .45 * u], [fx + d * .3 * u, my + .75 * u]], .22 * u, .2 * u), { wash: col, ink: null }); }
  if (kind === 'beard' || kind === 'chinstrap') {
    // along the jaw from ear to ear; the full beard fills up to the cheeks, the chinstrap is a band
    const inner = kind === 'beard' ? .45 : .82, P = [];
    for (let i = 0; i <= 16; i++) { const a = .05 * Math.PI + i / 16 * .9 * Math.PI; P.push([head[0] + Math.cos(a) * R * 1.02, head[1] + Math.sin(a) * R * 1.02]); }
    for (let i = 16; i >= 0; i--) { const a = .05 * Math.PI + i / 16 * .9 * Math.PI; P.push([head[0] + Math.cos(a) * R * inner + (kind === 'beard' ? (fx - head[0]) * .5 : 0), head[1] + Math.sin(a) * R * inner * (kind === 'beard' ? .6 : 1) + (kind === 'beard' ? .1 * u : 0)]); }
    paint(P, { wash: col, ink: PAL.ink, sw: sw * .4, curv: .3 });
    if (kind === 'beard') mous();
  }
}

// Named looks for the pick sheet (look.js chooses one). A–L, as lettered on the sheet.
const CURT_VARIANTS = {
  A: { hair: 'none', outfit: 'stick', facial: 'none' },
  B: { hair: 'ponytail', outfit: 'stick', facial: 'none' },
  C: { hair: 'none', outfit: 'hoodie', facial: 'none' },
  D: { hair: 'ponytail', outfit: 'hoodie', facial: 'none' },
  E: { hair: 'ponytail', outfit: 'hoodie', facial: 'stubble' },
  F: { hair: 'ponytail', outfit: 'hoodie', facial: 'mustache' },
  G: { hair: 'ponytail', outfit: 'hoodie', facial: 'goatee' },
  H: { hair: 'ponytail', outfit: 'hoodie', facial: 'circle' },
  I: { hair: 'ponytail', outfit: 'hoodie', facial: 'beard' },
  J: { hair: 'ponytail', outfit: 'hoodie', facial: 'chinstrap' },
  K: { hair: 'short', outfit: 'hoodie', facial: 'beard', hoodie: '#6E3B3B' },
  L: { hair: 'ponytail', outfit: 'hoodie', facial: 'beard', hairCol: '#8A8580', facialCol: '#A19C96', hoodie: '#3F5A4A' },
};

// Where Curt's hands go, by name: [dx, dy] in u from the shoulder. s = which arm (-1 = screen-left), f = facing.
const CURT_HANDS = {
  hang:  s => [s * 1.3, 4.5],
  hip:   s => [s * 2.2, 2.6],
  chin:  (s, f) => s === f ? [f * .9, -1.2] : [s * 1.3, 4.5],          // the forward hand under the chin, the other hanging
  point: (s, f) => s === f ? [f * 4.6, -.6] : [s * 1.3, 4.5],          // the forward arm pointing at what he faces
  up:    s => [s * 3.9, -3.2],                                           // both arms up and out: a wide V, clear of the head
  shrug: s => [s * 3.2, -.4],
  wave:  (s, f) => s === f ? [f * 2.4, -4] : [s * 1.3, 4.5],
  table: (s, f, sit, o) => [f * (1.9 + s * f * .9), 2.6],               // forearms resting on a table in front
};
// Two-bone IK: the elbow for a shoulder, a hand and two segment lengths, bending out to the side s.
function elbowFor(sh, hand, L1, L2, s) {
  const dx = hand[0] - sh[0], dy = hand[1] - sh[1], d = Math.min(Math.hypot(dx, dy), L1 + L2 - 1e-3) || 1e-3;
  const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), base = Math.atan2(dy, dx);
  const ang = base - s * a * (dy < 0 ? -1 : 1);
  return [sh[0] + Math.cos(ang) * L1, sh[1] + Math.sin(ang) * L1];
}

// ---------- the frog ----------
// A squat pond frog, front view: (x, y) = where it sits, u = size unit (about 6u wide). Options: look (-1..1), blink,
// croak (0..1: the throat sac swells), hop (0..1 through a hop), flip, boilKey.
function frog(x, y, u, o = {}) {
  const rs = p => boilSeed(`frog ${o.boilKey ?? 'frog'} ${p}`), sw = clamp(u / 10, .5, 2);
  const hop = o.hop ? jump(o.hop, .2, .8, 1.6) : { dy: 0, sq: 0 }, dy = hop.dy * u, sq = hop.sq;
  const G = '#5E9B4A', Gd = '#3F6B33', belly = '#CFE0A0';
  push(); translate(x, y + dy); scale((o.flip ? -1 : 1) * (1 + sq * .5), 1 - sq);
  rs('shadow'); if (!o.noShadow) paint(ellPts(0, u * .15, u * 3.4, u * .5, 16), { fill: PAL.ink, fillOp: 80, bleed: .2, ink: null });
  rs('legs');
  for (const d of [-1, 1]) {   // folded back legs and little front feet
    paint(ellPts(d * u * 2.3, -u * .9, u * 1.4, u * .9, 16, 0, d * .3), { wash: Gd, ink: PAL.ink, sw });
    paint(ellPts(d * u * 1.1, -u * .15, u * .6, u * .25, 10), { wash: Gd, ink: PAL.ink, sw: sw * .8 });
  }
  rs('body');
  paint(ellPts(0, -u * 1.7, u * 2.7, u * 1.8, 26), { wash: G, ink: PAL.ink, sw });
  paint(ellPts(0, -u * 1.1, u * 1.6, u * .9, 18), { wash: belly, ink: null });
  if (o.croak) paint(ellPts(0, -u * .95, u * (.6 + .9 * o.croak), u * (.4 + .7 * o.croak), 16), { wash: '#E8EFC4', ink: PAL.ink, sw: sw * .6 });
  rs('eyes');
  const lk = (o.look || 0) * .25 * u;
  for (const d of [-1, 1]) {
    paint(ellPts(d * u * 1.35, -u * 3.2, u * .95, u * .9, 18), { wash: G, ink: PAL.ink, sw });
    if (o.blink) inkLine([[d * u * 1.35 - u * .5, -u * 3.2], [d * u * 1.35 + u * .5, -u * 3.2]], sw, PAL.ink);
    else {
      paint(ellPts(d * u * 1.35, -u * 3.25, u * .62, u * .6, 14), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 });
      paint(ellPts(d * u * 1.35 + lk, -u * 3.2, u * .3, u * .36, 10), { wash: PAL.ink, ink: null });
    }
  }
  rs('mouth'); inkLine([[-u * 1.5, -u * 2.05], [0, -u * 1.75], [u * 1.5, -u * 2.05]], sw, PAL.ink, 'ink', .5);
  pop(); boilSeed('after frog');
}

// ---------- the axolotl ----------
// Side view facing right, lying on its belly: (x, y) = under its middle, u = size unit (about 11u long with the tail).
// Options: look, blink, smile (default true), wiggle (tail phase), gills (0..1 fan), flip, boilKey.
function axolotl(x, y, u, o = {}) {
  const rs = p => boilSeed(`axo ${o.boilKey ?? 'axo'} ${p}`), sw = clamp(u / 10, .5, 2);
  const P = '#F2A1B8', Pd = '#D9768F', G = '#D95F86', w = o.wiggle ?? T * .8, fan = o.gills ?? .5 + .5 * Math.sin(T * 2.2);
  push(); translate(x, y); if (o.flip) scale(-1, 1);
  rs('shadow'); if (!o.noShadow) paint(ellPts(0, u * .12, u * 5, u * .45, 16), { fill: PAL.ink, fillOp: 70, bleed: .2, ink: null });
  rs('tail');   // one tapered ribbon, waving
  const tail = []; for (let i = 0; i <= 5; i++) tail.push([-u * 1.5 - i * u * 1.1, -u * .9 + Math.sin(w * TAU - i * .8) * u * .3 * i / 5]);
  paint(ribbon(tail, u * 1.5, u * .2), { wash: Pd, ink: PAL.ink, sw });
  rs('legs');
  for (const lx of [-u * 1.2, u * 1.8]) paint(ribbon([[lx, -u * .6], [lx + u * .5, u * .05]], u * .45, u * .3), { wash: Pd, ink: PAL.ink, sw: sw * .8 });
  rs('body');
  paint(ellPts(0, -u * 1, u * 2.8, u * 1.05, 24), { wash: P, ink: PAL.ink, sw });
  paint(ellPts(u * 2.9, -u * 1.5, u * 1.55, u * 1.25, 22), { wash: P, ink: PAL.ink, sw });     // head
  rs('gills');   // three feathery fronds behind the head, fanning
  for (let i = 0; i < 3; i++) {
    const a = -2.3 + i * .6 - fan * .18, r0 = u * .9, r1 = u * (2.9 + .25 * i);
    const b = [u * 2.3, -u * 1.9];
    const p0 = [b[0] + Math.cos(a) * r0, b[1] + Math.sin(a) * r0], p1 = [b[0] + Math.cos(a - .15) * r1, b[1] + Math.sin(a - .15) * r1];
    paint(ribbon([p0, [lerp(p0[0], p1[0], .5), lerp(p0[1], p1[1], .5) - u * .15], p1], u * .6, u * .2), { wash: G, ink: PAL.ink, sw: sw * .7 });
    for (let k = 1; k <= 4; k++) {   // the feathering: little fronds off each gill
      const q = [lerp(p0[0], p1[0], k / 5), lerp(p0[1], p1[1], k / 5)];
      paint(ribbon([q, [q[0] - u * .55, q[1] - u * .35]], u * .22, u * .06), { wash: '#EE8FAE', ink: null });
    }
  }
  rs('face');
  const ex = u * 3.5 + (o.look || 0) * u * .15;
  if (o.blink) inkLine([[ex - u * .25, -u * 1.75], [ex + u * .25, -u * 1.75]], sw, PAL.ink);
  else paint(ellPts(ex, -u * 1.75, u * .22, u * .22, 10), { wash: PAL.ink, ink: null });
  if (o.smile !== false) inkLine([[u * 3.3, -u * 1.05], [u * 3.9, -u * .95], [u * 4.35, -u * 1.25]], sw * .9, PAL.ink, 'ink', .5);
  pop(); boilSeed('after axolotl');
}

// ---------- Claude, as a crowd ----------
// Clawd, assembling out of a crowd: at k = 0 a loose drifting cloud of many-coloured brush dabs (the base model: "closer
// to a crowd than to a single stranger"); as k rises they gather, taking on Clawd's colour, into Clawd's shape; at k = 1
// it IS clawd(x, y, u, o), with every emotion and pose. ("The mask isn't concealing one self. It's closer to picking one
// out.") look.js decides whether Claude appears this way or as plain Clawd.
const CROWD_COLS = ['#D97757', '#A84D33', '#F2A283', '#E27A92', '#E8AA38', '#7B5CA8', '#3A9C98', '#6E9F58'];
function clawdCrowd(x, y, u, k = 1, o = {}) {
  if (k >= 1) return clawd(x, y, u, o);
  boilSeed('crowd ' + (o.boilKey ?? 'claude'));
  const tg = [];   // targets: Clawd's front-view silhouette, body, legs and arm nubs, in u
  for (let j = 0; j < 6; j++) for (let i = 0; i < 10; i++) tg.push([-4.5 + i, -7.5 + j]);
  for (const lx of [-3.5, -1.5, 1.5, 3.5]) tg.push([lx, -1.4], [lx, -.5]);
  for (const d of [-1, 1]) tg.push([d * 5.6, -4.5], [d * 6.6, -4.5]);
  const dt = o.t ?? T;
  tg.forEach(([tx, ty], i) => {
    const a = hash(i * 7.3) * TAU + dt * (.15 + .1 * hash(i)), r = u * (3 + 7 * hash(i * 3.1));
    const sx = Math.cos(a) * r * 1.4, sy = -5 * u + Math.sin(a) * r * .8;
    const p = ease(clamp((k - hash(i * 5.9) * .35) / .65));
    const px = lerp(sx, tx * u, p), py = lerp(sy, ty * u, p), rr = u * lerp(.35 + .25 * hash(i * 2.2), .78, p);
    paint(ellPts(x + px, y + py, rr, rr * lerp(.8, 1, p), 10, u * .04), { wash: mixCol(CROWD_COLS[i % CROWD_COLS.length], PAL.clay, p), ink: null });
  });
  boilSeed('after crowd');
}
