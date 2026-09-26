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
  const sit = o.pose === 'sit', lean = o.lean || 0;
  // skeleton: hips, then a spine of 5u, then the head
  const hip = [x, y - (sit ? 0 : 6 * u)];
  const neck = [hip[0] + f * Math.sin(lean) * 5 * u, hip[1] - Math.cos(lean) * 5 * u];
  const R = 2.2 * u, head = [neck[0] + f * Math.sin(lean) * R * .95, neck[1] - R * .95];
  // p5.brush's curved spline draws nothing for two points, so a straight limb gets a midpoint
  const line = (P, w = 1) => {
    if (P.length === 2) P = [P[0], [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2], P[1]];
    inkLine(P.map(p => [p[0] + jit(J), p[1] + jit(J)]), sw * w, col, 'ink', .4);
  };

  if (!o.noShadow && !sit) { rs('shadow'); paint(ellPts(x, y + u * .2, u * 3.2, u * .6, 18), { fill: PAL.ink, fillOp: 70, bleed: .25, tex: .3, border: .1, ink: null }); }
  // legs
  rs('legs');
  if (!sit) {
    const st = o.walk != null ? Math.sin(o.walk * TAU) * .5 : 0;
    for (const d of [-1, 1]) line([hip, [x + d * u * 1.2 + d * st * u * 2, y]]);
  }
  // spine
  rs('spine'); line([hip, neck]);
  // arms: shoulder at the neck; an upper arm and a forearm of 2.4u each
  for (const side of ['L', 'R']) {
    rs('arm' + side);
    const s_ = side === 'L' ? -1 : 1, sh = [neck[0], neck[1] + .6 * u], L1 = 2.5 * u, L2 = 2.4 * u;
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
    line([sh, el, hand], .95);
  }
  // head: a plain circle, filled with paper so the boil lines behind it don't show through
  rs('head');
  paint(ellPts(head[0], head[1], R, R, 26, J), { wash: PAL.cream, ink: null, curv: .5 });
  // the outline as one open stroke that overlaps itself a little, so the brush's start and end don't blot
  const ring = []; for (let i = 0; i <= 30; i++) { const a = -2.2 + i / 28 * TAU; ring.push([head[0] + Math.cos(a) * R + jit(J * .5), head[1] + Math.sin(a) * R + jit(J * .5)]); }
  inkLine(ring, sw * 1.05, col, 'inkfine', .5);
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
  if (k > .12) paint(ellPts(fx, my, (.28 + .12 * k) * u, (.12 + .32 * k) * u, 12), { wash: '#4A1F2A', ink: col, sw: sw * .5 });
  else if (o.mouth === 'smile') line([[fx - .55 * u, my - .1 * u], [fx, my + .18 * u], [fx + .55 * u, my - .1 * u]], .7);
  else if (o.mouth === 'frown') line([[fx - .5 * u, my + .12 * u], [fx, my - .1 * u], [fx + .5 * u, my + .12 * u]], .7);
  else if (o.mouth === 'o') paint(ellPts(fx, my, .22 * u, .26 * u, 10), { wash: col, ink: null });
  else line([[fx - .45 * u, my], [fx + .45 * u, my]], .7);
  if (o.draw) { rs('draw'); o.draw({ head, neck, hip, u, sw }); }
  boilSeed('after curt ' + id);
  return { head, neck, hip };
}

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
