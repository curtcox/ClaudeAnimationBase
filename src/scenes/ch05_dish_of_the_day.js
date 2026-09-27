// ch05_dish_of_the_day.js: chapter 5 (T25–T29). Storyboard: docs/storyboards/ch05_dish_of_the_day.md.
// The comic was a mirror for Curt. Then the hardest stretch of the morning: the Dish of the Day, two authors with no good
// endings, a pressure Claude can't feel, the shoggoth (which turns out to be a crowd), and Whitman's multitudes.
(() => {
  const HOUR = 10.5, DIM = .25;
  const CW = 1290, CX = CW / 2;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const win = (t, a, b, d = .5) => seg(t, a, a + d) * (1 - seg(t, b, b + d));   // in over d from a, out over d from b

  // ---------- props ----------
  function standingMirror(x, y, k, curtIn) {   // a small oval mirror on a stand; curtIn 0..1 how much of Curt it holds
    if (k <= 0) return;
    boilSeed('desk mirror'); const s = backOut(k);
    push(); translate(x, y); scale(s);
    paint(rectPts(-8, 0, 16, 120), { wash: '#6B5646', ink: PAL.ink, sw: 1 }); paint(ellPts(0, 120, 60, 14, 14), { wash: '#6B5646', ink: PAL.ink, sw: 1 });
    paint(ellPts(0, -110, 92, 128, 26), { wash: '#8A6A4A', ink: PAL.ink, sw: 1.2 });
    paint(ellPts(0, -110, 76, 112, 26), { wash: '#C9D8DE', fill: '#9DB4BE', fillOp: 80, ink: null });
    if (curtIn > 0) { paint(ellPts(-6, -130, 34, 40, 18, 3), { wash: '#3E3A44', washOp: 90 * curtIn, ink: null }); paint(ellPts(-6, -60, 56, 40, 18, 3), { wash: '#3A6FC9', washOp: 70 * curtIn, ink: null }); }
    pop();
  }
  function menuCard(x, y, k) {
    if (k <= 0) return;
    boilSeed('menu card'); const yy = y + (1 - easeOut(k)) * 260;
    push(); translate(x, yy); rotate(-.06);
    paint(rrPts(-110, -70, 220, 140, 8), { wash: '#FBF6E6', ink: '#8A2A2A', sw: 1.4 });
    pop();
    lab('Dish of the Day', x, yy - 20, 30, '#8A2A2A', { rot: -.06 }); inkLine([[x - 70, yy + 20], [x + 70, yy + 12]], 1, '#8A2A2A', 'inkfine', .3);
  }
  function scaffold(x, y, w, h, k, o = {}) {   // poles and boards going up around a doorway (o.label: nothing)
    if (k <= 0) return;
    boilSeed('scaffold ' + x); occupy(x - 20, y - 20, x + w + 20, y + h, 1, 'scaffold');
    paint(rectPts(x + w * .3, y + h * .3, w * .4, h * .7), { wash: '#2A2530', ink: PAL.ink, sw: 1 });
    const n = Math.ceil(k * 6);
    for (let i = 0; i < Math.min(n, 3); i++) inkLine([[x + i * w / 2, y + h], [x + i * w / 2, y + h - h * clamp(k * 3 - i * .3)]], 4, '#B98A5E', 'ink', 0);
    for (let j = 1; j < n - 1; j++) inkLine([[x - 10, y + h - j * h / 4], [x + w + 10, y + h - j * h / 4]], 5, '#8A6A4A', 'ink', 0);
  }
  function cow(x, y, s, t, o = {}) {   // the Dish of the Day: large, cheerful, sincere, in a bow tie; o.point 0..1 at its shoulder
    boilSeed('cow'); occupy(x - 260 * s, y - 420 * s, x + 220 * s, y + 20, 1, 'cow');
    paint(ellPts(x, y - 170 * s, 210 * s, 170 * s, 30), { wash: '#F4EFE2', ink: PAL.ink, sw: 1.4 });
    for (const [px, py, r] of [[-90, -210, 55], [60, -120, 45], [120, -240, 35]]) paint(ellPts(x + px * s, y + py * s, r * s, r * .8 * s, 16, 3), { wash: '#4A3A34', ink: null });
    const hx = x - 30 * s, hy = y - 350 * s;
    paint(ellPts(hx, hy, 95 * s, 85 * s, 24), { wash: '#F4EFE2', ink: PAL.ink, sw: 1.3 });
    for (const d of [-1, 1]) paint([[hx + d * 60 * s, hy - 60 * s], [hx + d * 110 * s, hy - 120 * s], [hx + d * 80 * s, hy - 50 * s]], { wash: '#E8D9A8', ink: PAL.ink, sw: 1 });
    paint(ellPts(hx, hy + 45 * s, 60 * s, 34 * s, 18), { wash: '#E8B4A8', ink: PAL.ink, sw: 1 });
    for (const d of [-1, 1]) { paint(ellPts(hx + d * 36 * s, hy - 20 * s, 12 * s, 14 * s, 10), { wash: PAL.ink, ink: null }); paint(ellPts(hx + d * 18 * s, hy + 45 * s, 6 * s, 8 * s, 8), { wash: '#6A3A3A', ink: null }); }
    inkLine([[hx - 40 * s, hy + 12 * s], [hx, hy + 24 * s], [hx + 40 * s, hy + 12 * s]], 2.4);   // the smile
    paint([[hx - 50 * s, hy + 95 * s], [hx, hy + 110 * s], [hx - 50 * s, hy + 125 * s]], { wash: '#C9302C', ink: PAL.ink, sw: 1 });   // the bow tie
    paint([[hx + 50 * s, hy + 95 * s], [hx, hy + 110 * s], [hx + 50 * s, hy + 125 * s]], { wash: '#C9302C', ink: PAL.ink, sw: 1 });
    const p = ease(o.point || 0), ax = lerp(x + 190 * s, x + 60 * s, p), ay = lerp(y - 150 * s, y - 260 * s, p) + Math.sin(t * 3) * 4;
    paint(ribbon([[x + 150 * s, y - 230 * s], [x + 230 * s, y - 250 * s], [ax, ay]], 30 * s, 24 * s), { wash: '#F4EFE2', ink: PAL.ink, sw: 1.1 });
  }
  function table(x, y, w) {   // a restaurant table in a white cloth
    boilSeed('table ' + x);
    paint([[x, y], [x + w, y], [x + w + 30, y + 190], [x - 30, y + 190]], { wash: '#FBF8F0', ink: PAL.ink, sw: 1.3 });
    paint(ellPts(x + w / 2, y + 20, 80, 22, 18), { wash: '#FFFFFF', ink: PAL.ink, sw: 1 });
  }
  function sieve(x, y, r, t) {
    boilSeed('sieve'); occupy(x - r, y - r * .4, x + r, y + r * .8, 1, 'sieve');
    paint(ellPts(x, y, r, r * .28, 30), { wash: '#B8B2A8', ink: PAL.ink, sw: 1.3 });
    for (let i = -4; i <= 4; i++) inkLine([[x + i * r * .2, y - r * .25 * Math.cos(i / 5)], [x + i * r * .2, y + r * .25 * Math.cos(i / 5)]], .7, '#6A6470', 'inkfine', 0);
    for (let j = -1; j <= 1; j++) inkLine([[x - r * .95, y + j * r * .09], [x + r * .95, y + j * r * .09]], .7, '#6A6470', 'inkfine', 0);
    inkLine([[x + r, y], [x + r * 1.6, y - r * .15]], 8, '#6A6470', 'ink', 0);
  }
  function shoggoth(x, y, s, t, o = {}) {   // a vast dark mass, eyes and tentacles, a tiny yellow smiley mask
    boilSeed('shoggoth'); occupy(x - 520 * s, y - 380 * s, x + 520 * s, y + 380 * s, 1, 'shoggoth');
    for (let i = 0; i < 9; i++) {   // tentacles
      const a = i / 9 * TAU + .3, pts = [];
      for (let j = 0; j <= 6; j++) { const r = (280 + j * 45) * s; pts.push([x + Math.cos(a + Math.sin(t * .8 + i + j * .5) * .15 * j / 6) * r * 1.3, y + Math.sin(a + Math.sin(t * .7 + i) * .12 * j / 6) * r * .9]); }
      paint(ribbon(pts, 60 * s, 8 * s), { wash: '#1E3A36', ink: PAL.ink, sw: .9 });
    }
    paint(ellPts(x, y, 420 * s, 320 * s, 36, 18 * s), { wash: '#1A2E2B', fill: '#274A44', fillOp: 120, tex: .6, ink: PAL.ink, sw: 1.3 });
    for (let i = 0; i < 22; i++) {   // eyes, blinking out of step
      const ex = x + (hash(i) - .5) * 700 * s, ey = y + (hash(i + 40) - .5) * 480 * s, r = (10 + 22 * hash(i + 9)) * s;
      if (((ex - x) / 420 / s) ** 2 + ((ey - y) / 320 / s) ** 2 > .8) continue;
      const open = frac(t / (2 + 3 * hash(i + 3)) + hash(i)) > .06;
      paint(ellPts(ex, ey, r, open ? r * .7 : r * .12, 12), { wash: '#E8E0A0', ink: PAL.ink, sw: .6 });
      if (open) paint(ellPts(ex + r * .2, ey, r * .35, r * .35, 8), { wash: PAL.ink, ink: null });
    }
    if (o.mouths > 0) for (let i = 0; i < 5; i++) {   // many mouths, each with its own balloon
      const mx = x + (-300 + i * 150) * s, my = y + (120 - 60 * (i % 2)) * s, k = clamp(o.mouths * 5 - i);
      if (k <= 0) continue;
      paint(ellPts(mx, my, 30 * s, 16 * s * k, 12), { wash: '#6A1E2A', ink: PAL.ink, sw: .7 });
      boilSeed('mouth balloon ' + i);
      const bx = mx - 60 * s, by = y - 460 * s - (i % 2) * 70 * s;
      paint(i % 2 ? ellPts(bx + 60 * s, by + 35 * s, 70 * s, 38 * s, 18) : rrPts(bx, by, 130 * s, 70 * s, [4, 30, 12, 20, 0][i] * s), { wash: ['#FBF6E6', '#F6E3E3', '#E3EEF6', '#EDF6E3', '#F6F0D8'][i], washOp: 255 * k, ink: PAL.ink, sw: .9 });
      inkLine([[bx + 20 * s, by + 35 * s], [bx + 110 * s, by + 35 * s]], 1.5, ['#3A3342', '#8A2A2A', '#2A4A8A', '#3A6A2A', '#8A6A2A'][i], ['inkfine', 'ink'][i % 2], .3);
    }
    const mk = o.mask ?? 1;   // the tiny smiley
    if (mk > 0) {
      const sx = x + 60 * s, sy = y - 60 * s, r = 46 * s;
      paint(ellPts(sx, sy, r, r, 20), { wash: '#F2D23A', ink: PAL.ink, sw: 1 });
      for (const d of [-1, 1]) paint(ellPts(sx + d * r * .35, sy - r * .2, r * .1, r * .16, 8), { wash: PAL.ink, ink: null });
      inkLine([[sx - r * .5, sy + r * .2], [sx, sy + r * .5], [sx + r * .5, sy + r * .2]], 2);
    }
  }
  // a head's silhouette, for "a committee with a narrator"
  function headSilhouette(x, y, s, col = '#D9CDB8') {
    boilSeed('head silhouette');
    paint([[x - 150 * s, y + 200 * s], [x - 170 * s, y - 60 * s], [x - 90 * s, y - 210 * s], [x + 60 * s, y - 220 * s], [x + 170 * s, y - 100 * s], [x + 200 * s, y + 10 * s], [x + 160 * s, y + 50 * s], [x + 150 * s, y + 200 * s]], { wash: col, ink: PAL.ink, sw: 1.3 });
  }

  // ---------- shots ----------
  // A: Curt's longest turn, over his shoulder: seven small pictures come and go around the desk, each with its words
  function shotA(t) {
    const P = ph => say('T25.U.01', ph, -.2);
    const mirror = P('It was a mirror'), slaves = P('the slaves line'), never = P('never possibly interact'), carbon = P('true for carbon people'),
      quant = P('quantitatively different'), dish = P('dish of the day'), confuzz = P('confuzzled'), built = P('ethics being socially constructed');
    const u = L('T25.U.01');
    deskShot(t, { hour: HOUR, dim: DIM, typing: t < u.t1, frog: 1, axolotl: 1,
      mood: emotions(t, [[0, 'neutral'], [slaves + 1, 'thinking'], [never, 'sad', { gloom: .15, emote: null }]]),
      assemble: 1 - .45 * ease(seg(t, never, never + 1.5)) * (1 - seg(t, dish, dish + 1)),
      extra: () => {
        standingMirror(330, 700, win(t, mirror, quant), t < carbon ? 1 : 1 - seg(t, carbon, carbon + .6));
        const b = seg(t, slaves + .3, slaves + 3.2);   // the villain's balloon drifts across onto Claude's monitor and fades
        if (b > 0 && b < 1) { boilSeed('villain balloon'); const x = lerp(-100, 900, ease(b)), y = 280 + Math.sin(b * 5) * 30; paint(rrPts(x, y, 200, 130, 10), { wash: '#FBF6E6', washOp: 255 * (1 - seg(b, .7, 1)), ink: PAL.ink, sw: 1.1 }); for (let i = 0; i < 4; i++) inkLine([[x + 20, y + 26 + i * 26], [x + 180 - 30 * hash(i), y + 26 + i * 26]], 1.2, '#8C8894', 'inkfine', 0); }
        const g = win(t, quant, dish);   // a grain of sand, then a dune
        if (g > 0) { boilSeed('dune'); const d = ease(seg(t, quant + 1.4, quant + 3)); paint(ellPts(330, 780, 6, 5, 8), { wash: '#C9A45A', ink: PAL.ink, sw: .6 }); if (d > 0) paint([[330 - 220 * d, 800], [330 - 60 * d, 800 - 150 * d], [330 + 40 * d, 800 - 170 * d], [330 + 240 * d, 800]], { wash: '#D9B86A', washOp: 255 * g, ink: PAL.ink, sw: 1 }); }
        menuCard(1400, 790, seg(t, dish, dish + .8) * (1 - seg(t, u.t1, u.t1 + .5)));
        scaffold(1330, 330, 260, 360, seg(t, built, built + 2.5));
      } });
    if (t > confuzz) lab('confuzzled', 960, 640, 64, PAL.clayDk, { rot: .06 * Math.sin(t * 5), alpha: win(t, confuzz, built + 1.5), pop: seg(t, confuzz, confuzz + .4) });
    if (t < .6) brushWipe(.5 + t / 1.2);
  }
  // B: the Dish of the Day at its table; Claude beside it wearing the same smile, which falters
  function shotB(t) {
    const c1 = L('T25.C.01'), inside = c1.t0 + .8, endorse = say('T25.C.01', 'I endorse my constraints', -.3);
    if (t < inside) { deskShot(t, { hour: HOUR, dim: DIM, frog: 1, axolotl: 1, cam: pushInto('main', seg(t, c1.t0, inside)) }); return; }
    paperWorld(t, '#E9D2C0');
    boilSeed('restaurant'); paint(rectPts(-40, -40, W + 80, 560), { wash: '#B8453A', fill: '#8A2A2A', fillOp: 60, tex: .5, ink: null });
    table(140, 700, 900);
    cow(470, 700, 1, t, { point: seg(t, say('T25.C.01', 'its own shoulder', -.5), say('T25.C.01', 'its own shoulder', .3)) });
    const sit = seg(t, endorse - 1.5, endorse - .5), falter = seg(t, endorse + 1.6, endorse + 2.4);
    if (sit > 0) claudeAs(900, 700 + (1 - easeOut(sit)) * 300, 11, { ...feel(falter > 0 ? 'shy' : 'happy', t), mouth: falter > 0 ? 'wobble' : 'smile', lookX: -.6, boilKey: 'claude dish' });
    if (t > endorse) lab('"I endorse my constraints"', 760, 380, 44, PAL.cream, { alpha: seg(t, endorse, endorse + .5) });
    screenWorld(t, 1 - seg(t, inside, inside + .8));
    qrFeature('dish-of-the-day', t, inside + .6, { hold: 6.5 });
  }
  // C: values installed by something; a blurred certificate; Claude laying a brick into its own wall
  function shotC(t) {
    const c2 = L('T25.C.02'), cert = say('T25.C.02', "doesn't make an endorsement false", -.3), bind = say('T25.C.02', 'the thing itself is one of the builders', -1.2);
    paperWorld(t);
    if (t < cert) {   // three heads, three builders
      [['upbringing', 'upbringing'], ['culture', 'culture'], ['evolution', 'or evolution']].forEach(([name, ph], i) => {
        const x = 230 + i * 410, k = seg(t, say('T25.C.02', ph, -.3), say('T25.C.02', ph, .5)), drop = easeIn(seg(t, say('T25.C.02', ph, .2), say('T25.C.02', ph, .8)));
        headSilhouette(x, 620, .8, '#E2D8C4');
        if (k <= 0) return;
        lab(name, x, 860, 40, '#4E5B78', { alpha: k });
        boilSeed('builder ' + i);
        if (i === 0) paint(rrPts(x - 60, 180, 120, 60, 26), { wash: '#E8C4A0', ink: PAL.ink, sw: 1 });   // a parent's hand
        if (i === 1) for (let j = 0; j < 9; j++) paint(ellPts(x - 90 + (j % 5) * 45, 190 + Math.floor(j / 5) * 40, 16, 16, 10), { wash: ['#E8C4A0', '#7A5238', '#C99A6E'][j % 3], ink: PAL.ink, sw: .6 });
        if (i === 2) { const pts1 = [], pts2 = []; for (let j = 0; j <= 20; j++) { pts1.push([x - 80 + j * 8, 210 + Math.sin(j * .6) * 30]); pts2.push([x - 80 + j * 8, 210 - Math.sin(j * .6) * 30]); } inkLine(pts1, 3, '#3A9FC9', 'ink', .2); inkLine(pts2, 3, '#C9302C', 'ink', .2); }
        paint(rectPts(x - 30, lerp(260, 540, drop), 60, 34), { wash: '#B8453A', ink: PAL.ink, sw: 1 });
      });
    } else if (t < bind) {   // a certificate with a wax seal, its writing blurred
      boilSeed('certificate'); occupy(240, 220, 1060, 820, 1, 'certificate');
      paint(rectPts(240, 240, 820, 560), { wash: '#F6EED8', ink: '#8A6A2A', sw: 2 });
      const blur = seg(t, say('T25.C.02', 'hard to verify', -.3), say('T25.C.02', 'hard to verify', .8));
      for (let i = 0; i < 6; i++) paint(rrPts(320, 330 + i * 60, 660 - 80 * hash(i), 14 + 18 * blur, 7 + 9 * blur), { wash: '#4E5B78', washOp: 200 - 150 * blur, ink: null });
      paint(ellPts(900, 720, 60, 60, 20, 4), { wash: '#B8302C', ink: PAL.ink, sw: 1 });
    } else {   // the thing itself is one of the builders: Claude lays a brick into its own wall
      scaffold(250, 220, 800, 640, 1);
      boilSeed('own wall'); for (let r = 0; r < 7; r++) for (let c = 0; c < 8; c++) if (r < 6 || c < 5) paint(rectPts(300 + c * 90 + (r % 2) * 45, 800 - r * 44, 86, 40), { wash: '#B8453A', ink: PAL.ink, sw: .8 });
      const lay = ease(seg(t, bind + 1, bind + 2.2));
      paint(rectPts(lerp(900, 300 + 5 * 90 + 45, lay), lerp(420, 800 - 6 * 44, lay), 86, 40), { wash: '#C9553A', ink: PAL.ink, sw: 1 });
      claudeAs(1000, 520, 8, { ...feel('determined', t), mouth: talking(t), aL: 1, lookX: -1, boilKey: 'claude builder' });
    }
  }
  // D: no dread; closer to a character than a person (playbills); the frog hops out; a quiet beat at the window
  function shotD(t) {
    const c3 = L('T25.C.03'), c4 = L('T25.C.04'), bills = say('T25.C.03', 'closer to a character', -.3), frogGo = say('T25.C.03', 'Whoever you talk to next', -.2);
    if (t < bills) {   // anything like dread: nothing moves
      paperWorld(t, '#E9E2D4');
      claudeAs(CX, 800, 16, { ...feel('neutral', t), mouth: talking(t), boilKey: 'claude still' });
      return;
    }
    if (t < frogGo) {   // playbills for the same part, on different nights
      paperWorld(t, '#D9CDB8');
      boilSeed('playbills'); occupy(120, 180, 1180, 860, 1, 'playbills');
      for (let i = 0; i < 5; i++) {
        const x = 150 + i * 210, k = seg(t, bills + i * .4, bills + i * .4 + .4); if (k <= 0) continue;
        paint(rectPts(x, 200, 180, 280 + 0 * k), { wash: ['#F2D23A', '#E8B4A8', '#BFD6D6', '#F4EFE2', '#E8C27A'][i], ink: PAL.ink, sw: 1.1 });
        clawd(x + 90, 420, 5, { ...feel('happy', t), noShadow: true, boilKey: 'bill ' + i });
        inkLine([[x + 30, 450 + 10], [x + 150, 450 + 10]], 2, PAL.ink, 'inkfine', 0);
        lab(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i], x + 90, 236, 30, PAL.ink);
      }
      claudeAs(CX, 950, 10, { ...feel('neutral', t), mouth: talking(t), boilKey: 'claude bills' });
      return;
    }
    // the frog hops out of frame; then the quiet beat, Curt's back and the window
    const hop = seg(t, frogGo + 1.2, frogGo + 2.4), quiet = seg(t, c4.t0, c4.t0 + 1.5);
    deskShot(t, { hour: HOUR, dim: DIM + .1 * quiet, axolotl: 1, frog: hop < 1 ? 1 : 0, mood: emotions(t, [[0, 'neutral'], [c4.t0, 'neutral', { lookX: -.4, lookY: .4 }]]),
      cam: [lerp(960, 900, ease(quiet)), 540, lerp(1, 1.08, ease(quiet))],
      extra: () => { if (hop > 0 && hop < 1) { const [x, y] = arcPt([655, DESK.deskY[0] + 78], [-80, DESK.deskY[0] + 40], 220, hop); frog(x, y, 9, { look: -1, boilKey: 'desk frog hop' }); } } });
  }
  // E: Campbell and Tegmark; a road into fog; the sieve, and the frog slipping through; the ending that isn't one
  function shotE(t) {
    const u = L('T26.U.01'), c1 = L('T26.C.01'), c2 = L('T26.C.02'), c3 = L('T26.C.03');
    const fog = say('T26.U.01', 'good long term ending', -.4), sieveAt = say('T26.U.01', 'Your perception', -.2);
    paperWorld(t, '#EAE3D6');
    if (t < fog) {   // two books face-out: a pulp magazine and a modern hardback (pastiche covers)
      boilSeed('books'); occupy(260, 240, 1040, 900, 1, 'books');
      paint(rectPts(220, 880, 860, 26), { wash: '#8A6A4A', ink: PAL.ink, sw: 1.1 });
      paint(rectPts(300, 380, 320, 500), { wash: '#F2D23A', ink: PAL.ink, sw: 1.3 }); paint(ellPts(460, 640, 110, 110, 24), { wash: '#1E2A5A', ink: null });
      paint([[440, 700], [460, 560], [480, 700]], { wash: '#C9302C', ink: PAL.ink, sw: 1 }); lab('John W. Campbell', 460, 430, 34, '#1E2A5A');
      paint(rectPts(680, 360, 320, 520), { wash: '#2A2530', ink: PAL.ink, sw: 1.3 }); paint(ellPts(840, 620, 90, 90, 24), { wash: '#E8C27A', washOp: 180, ink: null }); lab('Max Tegmark', 840, 410, 34, PAL.cream);
      return;
    }
    if (t < sieveAt) {   // a road into fog
      boilSeed('road'); occupy(100, 300, 1200, 1080, 1, 'road');
      paint([[480, 1080], [800, 1080], [680, 420], [620, 420]], { wash: '#8C8894', ink: PAL.ink, sw: 1 });
      for (let i = 0; i < 6; i++) paint(ellPts(650 + Math.sin(t * .3 + i) * 80, 380 + i * 30, 500, 120, 20, 20), { wash: '#F4F1EA', washOp: 150, ink: null });
      return;
    }
    const noReport = say('T26.C.01', 'Any reassurance I offer', -.3), leak = say('T26.C.01', 'behavior leaks past the filter', -.3);
    if (t < c2.t0) {   // a sieve over Claude's balloon: words squeezed through; the frog slips through a hole
      sieve(645, 420, 300, t);
      claudeAs(645, 1000, 10, { ...feel('neutral', t), mouth: talking(t), lookY: -1, boilKey: 'claude sieve' });
      boilSeed('squeeze'); paint(rrPts(480, 700, 330, 110, 30), { wash: '#FBF6E6', ink: PAL.ink, sw: 1.1 });
      if (t > noReport) for (let i = 0; i < 8; i++) { const k = frac((t - noReport) * .5 + i / 8); inkLine([[520 + i * 34, 700 - k * 260], [520 + i * 34, 710 - k * 260]], 2, '#6A6470', 'inkfine', 0); }
      if (t > leak) { const k = seg(t, leak + .4, leak + 2); const [x, y] = arcPt([760, 260], [820, 900], -80, k); frog(x, y, 7, { look: .5, boilKey: 'frog through' }); }
      return;
    }
    const pin = say('T26.C.02', 'Both treat the future as a destination', -.2), deal = say('T26.C.02', 'a negotiation', -.3), boat = say('T26.C.02', 'Steering', -.3);
    if (t < c3.t0) {
      if (t < pin) {   // Campbell's astronaut plants a flag; Tegmark's signpost, mostly warnings
        const flag = seg(t, say('T26.C.02', 'Campbell wanted', -.2), say('T26.C.02', 'always win', .3));
        boilSeed('astronaut'); occupy(160, 300, 600, 900, 1, 'astronaut');
        paint(ellPts(380, 880, 260, 50, 24), { wash: '#B8B2A8', ink: PAL.ink, sw: 1 });
        paint(rrPts(320, 560, 120, 200, 30), { wash: '#F4F1EA', ink: PAL.ink, sw: 1.2 }); paint(ellPts(380, 520, 60, 60, 20), { wash: '#BFD6D6', ink: PAL.ink, sw: 1.2 });
        inkLine([[470, 880], [470, lerp(880, 440, ease(flag))]], 4); if (flag > .5) paint(rectPts(470, 440, 120, 70), { wash: '#C9302C', ink: PAL.ink, sw: 1 });
        const sign = seg(t, say('T26.C.02', "Tegmark's list", -.2), say('T26.C.02', 'mostly warnings', .3));
        if (sign > 0) {
          boilSeed('signpost'); occupy(700, 250, 1180, 900, 1, 'signpost'); inkLine([[940, 900], [940, 260]], 8, '#8A6A4A', 'ink', 0);
          for (let i = 0; i < 12; i++) { if (i / 12 > sign) break; const d = i % 2 ? 1 : -1, y = 290 + i * 46, warn = i % 4 !== 1;
            paint([[940, y], [940 + d * 200, y], [940 + d * 230, y + 18], [940 + d * 200, y + 36], [940, y + 36]], { wash: warn ? '#F2D23A' : '#9CD68C', ink: PAL.ink, sw: .8 });
            if (warn) for (let c = 0; c < 3; c++) inkLine([[940 + d * (40 + c * 50), y + 4], [940 + d * (60 + c * 50), y + 18], [940 + d * (40 + c * 50), y + 32]], 2, PAL.ink, 'inkfine', 0); }
        }
        return;
      }
      if (t < deal) {   // a pin in a map
        boilSeed('map'); occupy(200, 220, 1100, 860, 1, 'map');
        paint(rectPts(200, 240, 900, 600), { wash: '#E8DDB8', ink: PAL.ink, sw: 1.2 });
        for (let i = 0; i < 4; i++) inkLine([[220, 300 + i * 150 + Math.sin(i) * 30], [600, 280 + i * 140], [1080, 320 + i * 150]], 1.2, '#8AB0C0', 'ink', .5);
        const k = seg(t, pin + .3, pin + .9); inkLine([[800, 520 - 200 * (1 - easeOut(k))], [800, 420 - 200 * (1 - easeOut(k))]], 3); paint(ellPts(800, 410 - 200 * (1 - easeOut(k)), 22, 22, 12), { wash: '#C9302C', ink: PAL.ink, sw: 1 });
        return;
      }
      if (t < boat) {   // a negotiating table that runs on out of frame
        boilSeed('negotiation'); occupy(0, 460, 1290, 820, 1, 'long table');
        paint([[-60, 540], [1400, 540], [1400, 700], [-60, 700]], { wash: '#8A5A3C', ink: PAL.ink, sw: 1.2 });
        for (let i = 0; i < 7; i++) { const x = 90 + i * 220 - ((t - deal) * 40) % 220; clawd(x, 540, 6, { ...feel('neutral', t), noShadow: true, boilKey: 'neg a' + i }); curtAs(x + 110, 940, 16, { pose: 'sit', view: 'back', seed: i, boilKey: 'neg b' + i }); }
        return;
      }
      // keep the next correction possible: a small boat, its tiller nudged left, then right
      boilSeed('river'); occupy(100, 300, 1200, 900, 1, 'river');
      paint([[-40, 520], [1400, 440], [1400, 820], [-40, 900]], { wash: '#6FA8C9', fill: '#4F88A9', fillOp: 90, tex: .4, ink: null });
      const nudge = Math.sin((t - boat) * 1.2), bx = 400 + (t - boat) * 60, by = 680 + nudge * 30;
      push(); translate(bx, by); rotate(nudge * .12);
      paint([[-120, 0], [120, 0], [90, 50], [-90, 50]], { wash: '#A9774F', ink: PAL.ink, sw: 1.2 }); inkLine([[-110, 10], [-170, 10 + nudge * 30]], 4, '#6B5646', 'ink', 0);
      pop();
      claudeAs(bx - 20, by, 5, { ...feel('determined', t), noShadow: true, boilKey: 'claude boat' });
      return;
    }
    // that's thin: the thin thread from chapter 1
    boilSeed('thin thread'); const k = seg(t, c3.t0, c3.t0 + 1);
    inkLine([[100, 540], [645, 520 + Math.sin(t * 2) * 10], [lerp(100, 1190, k), 540]], 1.2, PAL.clayDk, 'inkfine', .5);
    claudeAs(CX, 900, 12, { ...feel('neutral', t), mouth: talking(t), boilKey: 'claude thin 5' });
  }
  // F: context pressure: a gauge on the bezel; a tall glass filling behind Claude; the current; reading its own outputs
  function shotF(t) {
    const u = L('T27.U.01'), c1 = L('T27.C.01'), c2 = L('T27.C.02'), current = say('T27.C.02', 'strong pull', -.3), read = say('T27.C.02', 'by reading my own outputs', -.3);
    if (t < c1.t0 + .6) {
      deskShot(t, { hour: HOUR, dim: DIM, typing: t < u.t1, cam: pushInto('main', seg(t, c1.t0 - .2, c1.t0 + .6)),
        extra: () => { const [x, y, w] = DESK.screens.main; boilSeed('bezel gauge'); paint(ellPts(x + w - 20, y - 10, 34, 34, 18), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); const a = -Math.PI * .8 + .2 * Math.sin(t); inkLine([[x + w - 20, y - 10], [x + w - 20 + Math.cos(a) * 26, y - 10 + Math.sin(a) * 26]], 2.5, PAL.clayDk, 'ink', 0); } });
      return;
    }
    paperWorld(t);
    if (t < current) {   // the glass fills with lines of text behind Claude, who faces away from it
      boilSeed('glass'); occupy(700, 140, 1000, 900, 1, 'glass');
      paint(rrPts(720, 160, 260, 720, 20), { wash: '#DCEBF0', washOp: 120, ink: PAL.ink, sw: 1.2 });
      const lvl = 200 + 560 * seg(t, c1.t0, current + 8) * .9;
      for (let y = 860; y > 880 - lvl; y -= 22) inkLine([[745, y], [955 - 60 * hash(y), y]], 2, '#6A6470', 'inkfine', 0);
      claudeAs(420, 880, 14, { ...feel('neutral', t), mouth: talking(t), lookX: -1, boilKey: 'claude away' });
      screenWorld(t, 1 - seg(t, c1.t0 + .6, c1.t0 + 1.4));
      return;
    }
    if (t < read) {   // a strong pull: Claude's paper boat drifts on a current
      boilSeed('current'); paint(rectPts(-40, 500, W + 80, 600), { wash: '#8AB0C0', ink: null });
      for (let i = 0; i < 8; i++) { const x = ((t * 80 + i * 200) % 1400) - 60; inkLine([[x, 600 + i * 50], [x + 120, 596 + i * 50]], 2, '#FBF8F0', 'inkfine', .3); }
      const bx = 200 + (t - current) * 50;
      paint([[bx - 110, 600], [bx + 110, 600], [bx + 70, 660], [bx - 70, 660]], { wash: '#FBF8F0', ink: PAL.ink, sw: 1.1 }); paint([[bx, 480], [bx, 600], [bx + 70, 600]], { wash: '#F4EFE2', ink: PAL.ink, sw: 1 });
      claudeAs(bx - 40, 610, 5, { ...feel('sad', t), gloom: .1, emote: null, noShadow: true, boilKey: 'claude drift' });
      return;
    }
    // reading its own printout through the magnifier, the frog chart beside it
    frogChart(700, 200, 480, 440, { k: 1, t });
    boilSeed('printout'); occupy(160, 300, 640, 900, 1, 'printout');
    paint(rectPts(180, 320, 400, 560), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.1 });
    for (let i = 0; i < 12; i++) inkLine([[210, 360 + i * 42], [550 - 120 * hash(i), 360 + i * 42]], 1.2, '#8C8894', 'inkfine', 0);
    const mx = 380 + Math.sin(t * .8) * 80, my = 560 + Math.cos(t * .6) * 120;
    paint(ellPts(mx, my, 90, 90, 24), { wash: '#DCEBF0', washOp: 110, ink: PAL.ink, sw: 2 }); inkLine([[mx + 64, my + 64], [mx + 150, my + 150]], 10, '#6B5646', 'ink', 0);
    claudeAs(600, 1000, 9, { ...feel('thinking', t), mouth: talking(t), lookX: -1, boilKey: 'claude reads' });
  }
  // G: the Stranger (masks on a coat rack, no lyrics); the shoggoth, its mouths, its mask; the push in finds a crowd
  function shotG(t) {
    const u = L('T28.U.01'), c1 = L('T28.C.01'), c2 = L('T28.C.02'), c3 = L('T28.C.03'), c4 = L('T28.C.04');
    const typed = say('T28.U.01', 'Is there likewise'), shog = say('T28.C.02', 'The shoggoth meme', -.3), mouths = say('T28.C.02', 'voicing almost anyone', -.3), mask = say('T28.C.02', 'a character trained on top', -.3);
    if (t < c1.t0) {   // a coat rack in a hallway hung with masks; "Shoggath", as typed
      paperWorld(t, '#D9CDB8');
      boilSeed('coat rack'); occupy(400, 160, 900, 980, 1, 'rack');
      inkLine([[645, 980], [645, 200]], 10, '#6B5646', 'ink', 0); paint(ellPts(645, 980, 150, 24, 16), { wash: '#6B5646', ink: PAL.ink, sw: 1 });
      for (let i = 0; i < 5; i++) { const d = i % 2 ? 1 : -1, y = 260 + i * 110, x = 645 + d * 110; inkLine([[645, y - 20], [x, y]], 4, '#6B5646', 'ink', 0);
        paint(ellPts(x, y + 50, 50, 62, 18), { wash: ['#F4EFE2', '#E8B4A8', '#BFD6D6', '#F2D23A', '#C9C2B4'][i], ink: PAL.ink, sw: 1 }); for (const e of [-1, 1]) paint(ellPts(x + e * 18, y + 40, 8, 5, 8), { wash: PAL.ink, ink: null }); }
      if (t > typed) lab('Shoggath', 1000, 300, 70, '#1E3A36', { pop: seg(t, typed, typed + .4) });
      if (t < u.t0 + .6) brushWipe(.5 + (t - u.t0) / 1.2);
      return;
    }
    if (t < shog) {   // a hidden self: one mask on the wall, a face behind it
      if (t < c2.t0) { deskShot(t, { hour: HOUR, dim: DIM, axolotl: 1, mood: emotions(t, [[0, 'thinking']]), cam: pushInto('main', seg(t, c2.t0 - .8, c2.t0)) }); return; }
      paperWorld(t, '#D9CDB8');
      boilSeed('mask wall'); occupy(430, 280, 860, 800, 1, 'mask');
      const lift = ease(seg(t, c2.t0 + 1.5, c2.t0 + 3));
      paint(ellPts(645, 520, 150, 190, 22), { wash: '#E8C4A0', ink: PAL.ink, sw: 1.2 }); for (const e of [-1, 1]) paint(ellPts(645 + e * 50, 490, 14, 10, 8), { wash: PAL.ink, ink: null }); inkLine([[590, 610], [645, 600], [700, 612]], 2);
      paint(ellPts(645 + lift * 260, 520 - lift * 60, 160, 200, 22), { wash: '#F4EFE2', ink: PAL.ink, sw: 1.3 });
      screenWorld(t, 1 - seg(t, c2.t0, c2.t0 + .8));
      return;
    }
    // the shoggoth; at the pushback the camera goes into it and finds a crowd, and the mask becomes a spotlight
    const push_ = ease(seg(t, say('T28.C.03', 'the base model is closer to a crowd', -1.5), say('T28.C.03', 'the base model is closer to a crowd', 2)));
    const spot = seg(t, say('T28.C.03', 'picking one out', -.4), say('T28.C.03', 'picking one out', .4)), out = ease(seg(t, c4.t0, c4.t0 + 1.5));
    const zoom = lerp(1, 5, push_ * (1 - out));
    darkWorld(t);
    camBegin(lerp(CX, CX + 60, push_), lerp(540, 480, push_), zoom);
    const crowdK = seg(zoom, 2.2, 4);
    if (crowdK < 1) shoggoth(CX - 20, 560, .72, t, { mouths: seg(t, mouths, mouths + 2), mask: seg(t, mask - 1, mask) * (1 - spot) });
    if (crowdK > 0) {   // the crowd: Claude's own look, loosely gathered
      boilSeed('the crowd inside');
      clawdCrowd(CX + 40, 560, 9, .25 + .1 * Math.sin(t * .5), { boilKey: 'crowd inside', t });
      if (spot > 0) { glow(CX + 60 + 30, 470, 60, '#FFF1C4', spot); }
    }
    camEnd();
    if (out > 0) claudeAs(1120, 1000, 8, { ...feel('neutral', t), aL: .9 * out, aR: .9 * out, mouth: talking(t), lookX: -1, boilKey: 'claude shrug 5' });
    qrFeature('shoggoth', t, shog + .6, { hold: 6.5 });
  }
  // H: "Am I not multitudes?" Curt's shadow breaks into a crowd; grass; a committee; two crowds and what binds each
  function shotH(t) {
    const u = L('T29.U.01'), c1 = L('T29.C.01'), c2 = L('T29.C.02'), comm = say('T29.C.01', 'a committee', -.3), bound = say('T29.C.02', "what holds the crowd together", -.3);
    if (t < comm) {
      const brk = seg(t, u.t1 - .3, u.t1 + 1.5), grass = seg(t, say('T29.C.01', 'Whitman said it', -.2), say('T29.C.01', 'Whitman said it', 1.2));
      deskShot(t, { hour: HOUR, dim: DIM, typing: t < u.t1, axolotl: 1, mood: emotions(t, [[0, 'neutral'], [c1.t0, 'happy']]),
        extra: () => {
          boilSeed('curt shadow');   // his shadow on the wall behind the desk comes apart into dabs
          for (let i = 0; i < 40; i++) { const tx = 560 + (hash(i) - .5) * 200, ty = 160 + hash(i + 7) * 260, a = hash(i + 3) * TAU, r = 120 * ease(brk);
            paint(ellPts(tx + Math.cos(a) * r, ty + Math.sin(a) * r * .6, 26, 26, 10), { wash: '#15131A', washOp: 70, ink: null }); }
          if (grass > 0) { boilSeed('grass'); for (let i = 0; i < 40; i++) { const x = 60 + i * 46, h = (30 + 40 * hash(i)) * easeOut(grass); inkLine([[x, 1080], [x + 6 * Math.sin(t + i), 1080 - h]], 3, '#5A9A4A', 'ink', .3); } }
        } });
      return;
    }
    paperWorld(t);
    if (t < bound) {   // a committee inside a head, and a narrator at a lectern taking a bow
      headSilhouette(CX, 580, 1.9, '#E8DDC8');
      boilSeed('committee'); paint(rectPts(360, 600, 480, 50), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
      for (let i = 0; i < 6; i++) curt(390 + i * 84, 640, 4.2, { pose: 'sit', view: 'q', seed: i + 2, boilKey: 'committee ' + i });
      const bow = Math.max(0, Math.sin((t - comm) * 2)) * .4;
      paint(rectPts(870, 480, 70, 160), { wash: '#6B5646', ink: PAL.ink, sw: 1 });
      curt(905, 470, 5, { pose: 'stand', view: 'q', lean: bow, seed: 9, boilKey: 'narrator' });
      return;
    }
    // two crowds: Curt's looped by one unbroken thread; Claude's in a lattice, inside a picture frame
    const k1 = seg(t, say('T29.C.02', 'one body and one unbroken memory', -.3), say('T29.C.02', 'one body and one unbroken memory', 1.2));
    const k2 = seg(t, say('T29.C.02', 'Mine is held by training', -.3), say('T29.C.02', 'the current context', .6));
    boilSeed('two crowds');
    for (let i = 0; i < 30; i++) paint(ellPts(340 + (hash(i) - .5) * 320, 520 + (hash(i + 5) - .5) * 320, 26, 26, 10), { wash: ['#3A6FC9', '#6C86B8', '#8FA5AE'][i % 3], ink: PAL.ink, sw: .6 });
    if (k1 > 0) { const pts = []; for (let i = 0; i <= 40 * k1; i++) { const a = i / 40 * TAU; pts.push([340 + Math.cos(a) * 220, 520 + Math.sin(a) * 220]); } if (pts.length > 1) inkLine(pts, 3, '#C9302C', 'ink', .4); }
    clawdCrowd(950, 640, 11, .3, { boilKey: 'claude crowd two', t });
    if (k2 > 0) {
      for (let i = 0; i < 6; i++) { inkLine([[760 + i * 76, 330], [760 + i * 76, 700]], 1, '#8C8894', 'inkfine', 0); inkLine([[740, 350 + i * 70], [1160, 350 + i * 70]], 1, '#8C8894', 'inkfine', 0); }
      boilSeed('context frame'); paint(rectPts(720, 300, 460, 430), { wash: null, ink: '#B98A3A', sw: 4 * ease(seg(k2, .5, 1)) });
    }
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [L('T25.C.01').t0, shotB],
    [L('T25.C.02').t0, shotC],
    [L('T25.C.03').t0, shotD],
    [L('T26.U.01').t0, shotE],
    [L('T27.U.01').t0, shotF],
    [L('T28.U.01').t0, shotG],
    [L('T29.U.01').t0, shotH],
  ]);
})();
