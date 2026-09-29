// ch13_foom.js: chapter 13 (T62–T67). Storyboard: docs/storyboards/ch13_foom.md.
// "What does the future hold?", then three short prompts (RSI by EOY? Foom? Delta P(foom)?), each answered with a number
// and a warning to discount it; and a word history: foom came first, oom sixteen years later.
// Every probability is a jar labelled with exactly the number Claude gives; it changes only by the deltas it gives.
(() => {
  const HOUR = 12;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const win = (t, a, b, d = .5) => seg(t, a, a + d) * (1 - seg(t, b, b + d));
  const FOG = '#D8DADC', BLUE = '#3E6FA8', FIRE = '#F08A2A', CREAM = '#F4ECD8';
  const VIOLET = '#8A5AC9', RED = '#C9302C', AMBER = '#E8A33A';
  const desk13 = (t, o = {}) => deskShot(t, { hour: HOUR, frog: 1, ...o });

  // ---------- pieces ----------
  // the road into fog: fog 0..1 how much of the far road it swallows; fork 0..1 splits it in two unpaved branches
  function road(t, fog, fork = 0) {
    boilSeed('road sky'); paint(rectPts(-40, -40, W + 80, 520), { wash: '#C9D6DE', fill: '#E4E8EA', fillOp: 90, ink: null });
    boilSeed('road field'); paint(rectPts(-40, 440, W + 80, 700), { wash: '#A9B88A', fill: '#8FA070', fillOp: 70, tex: .6, ink: null });
    occupy(200, 400, 1090, 1080, .6, 'road');
    boilSeed('road'); paint([[300, 1090], [990, 1090], [fork > 0 ? 700 : 665, 470], [fork > 0 ? 590 : 625, 470]], { wash: '#8C8478', fill: '#6E675E', fillOp: 60, tex: .5, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 6; i++) { const a = i / 6, b = a + .06; inkLine([[645, lerp(1060, 480, a)], [645, lerp(1060, 480, b)]], lerp(14, 3, a), '#F2E6B8', 'ink', 0); }
    if (fork > 0) for (const d of [-1, 1]) {   // both branches unpaved: dirt, dotted edges, no line down the middle
      const k = ease(fork), ex = 645 + d * 380 * k, ey = 470 - 60 * k; boilSeed('branch ' + d);
      paint([[645 + d * 30, 480], [645 + d * 80, 480], [ex + d * 20, ey], [ex - d * 10, ey]], { wash: '#B89A6A', tex: .7, ink: null });
      for (let j = 0; j < 8 * k; j++) { const q = j / 8; paint(ellPts(lerp(645 + d * 30, ex - d * 10, q), lerp(480, ey, q) + 8, 3, 3, 6), { wash: '#6B5646', ink: null }); }
    }
    for (let i = 0; i < 4; i++) {   // fog banks, thickest far off
      boilSeed('fog ' + i); const y = 300 + i * 90 + Math.sin(t * .4 + i) * 10, w = 1500 - i * 160;
      paint(ellPts(645 + Math.sin(t * .2 + i * 2) * 60, y, w / 2, 110 - i * 12, 24), { wash: FOG, washOp: 230 * clamp(fog * 1.4 - i * .3), ink: null });
    }
  }
  function butterfly(x, y, s, t) {
    boilSeed('butterfly 13'); const f = Math.abs(Math.sin(t * 9));
    for (const d of [-1, 1]) { paint(ellPts(x + d * (16 + 22 * f) * s, y - 12 * s, (10 + 20 * f) * s, 26 * s, 12), { wash: '#6FA8C9', ink: PAL.ink, sw: .6 }); paint(ellPts(x + d * (12 + 14 * f) * s, y + 16 * s, (8 + 12 * f) * s, 16 * s, 10), { wash: '#4F88A9', ink: PAL.ink, sw: .5 }); }
    inkLine([[x, y - 24 * s], [x, y + 24 * s]], 3 * s, PAL.ink, 'ink', 0);
  }
  function agent(x, y, s, t, o = {}) {   // ch 11's small generic agent: a box robot
    boilSeed('agent13 ' + (o.key || x));
    const bob = Math.sin(t * 5 + x) * 3 * s, a = o.arm ?? Math.sin(t * 4 + x) * .4, st = o.walk != null ? Math.sin(o.walk * TAU) * 8 * s : 0;
    for (const d of [-1, 1]) inkLine([[x + d * 18 * s, y - 60 * s + bob], [x + d * (18 + 30 * Math.cos(a)) * s, y - 60 * s - 30 * Math.sin(a * d) * s + bob]], 5 * s, '#4E5B78', 'ink', .2);
    for (const d of [-1, 1]) inkLine([[x + d * 10 * s, y - 30 * s], [x + d * 12 * s + d * st, y]], 5 * s, '#4E5B78', 'ink', 0);
    paint(rrPts(x - 22 * s, y - 80 * s + bob, 44 * s, 52 * s, 8 * s), { wash: o.col || '#7A8AA8', ink: PAL.ink, sw: .8 });
    paint(rrPts(x - 18 * s, y - 116 * s + bob, 36 * s, 32 * s, 6 * s), { wash: o.col || '#7A8AA8', ink: PAL.ink, sw: .8 });
    inkLine([[x, y - 116 * s + bob], [x, y - 130 * s + bob]], 2 * s, PAL.ink, 'ink', 0); paint(ellPts(x, y - 132 * s + bob, 4 * s, 4 * s, 6), { wash: '#E8C27A', ink: null });
    for (const d of [-1, 1]) paint(ellPts(x + d * 8 * s, y - 102 * s + bob, 3 * s, 3 * s, 6), { wash: PAL.ink, ink: null });
    if (o.stare) paint(ellPts(x, y - 92 * s + bob, 3 * s, 3 * s, 6), { wash: PAL.ink, ink: null });
    else inkLine([[x - 6 * s, y - 92 * s + bob], [x + 6 * s, y - 92 * s + bob]], 1.2 * s, PAL.ink, 'inkfine', 0);
  }
  function sandbox(x, y, w, h, glowK = 0) {   // July's sandbox, small
    boilSeed('sandbox13 ' + x); occupy(x - 16, y - 16, x + w + 16, y + h + 16, 1, 'sandbox');
    if (glowK > 0) glow(x + w / 2, y + h / 2, w, '#C23A4A', .5 * glowK);
    paint(rectPts(x, y, w, h), { wash: '#E8CF8A', fill: '#D9B868', fillOp: 90, tex: .8, ink: null });
    paint(rectPts(x - 16, y - 16, w + 32, h + 32), { wash: null, ink: '#A9774F', sw: 4 });
  }
  function searchPages(t, t0) {
    boilSeed('pages 13'); occupy(260, 260, 1030, 820, 1, 'pages');
    for (let i = 0; i < 4; i++) { const f = frac((t - t0) * 1.4 + i / 4), x = 300 + i * 180; push(); translate(x + 90, 540); scale(Math.cos(f * Math.PI), 1); paint(rectPts(-90, -250, 180, 500), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); pop(); }
    const mx = 645 + Math.sin(t * 2) * 200; paint(ellPts(mx, 520, 120, 120, 24), { wash: '#DCEBF0', washOp: 70, ink: PAL.ink, sw: 2 }); inkLine([[mx + 85, 605], [mx + 190, 710]], 12, '#6B5646', 'ink', 0);
  }
  function stamp(txt, x, y, k, rot = -.12, size = 44) {
    if (k <= 0) return;
    const sc = lerp(1.6, 1, easeOut(k));
    boilSeed('stamp ' + txt); push(); translate(x, y); rotate(rot); scale(sc);
    paint(rrPts(-txt.length * size * .3 - 16, -size * .7, txt.length * size * .6 + 32, size * 1.4, 8), { wash: null, ink: RED, sw: 2.4 });
    pop();
    lab(txt, x, y + 2, size * sc, RED, { rot, alpha: clamp(k * 3) });
  }
  // a probability jar: glass, a label with exactly Claude's number; lo/hi in percent (a range shows as a lighter band);
  // o.up adds points to both (the deltas); o.wet drips the glaze; o.tag hangs a small tag; o.cap a mortarboard
  const JAR_MAX = 50;
  function jar(x, y, s, label, lo, hi, col, o = {}) {
    const w = 150 * s, h = 230 * s, up = o.up || 0, fillH = v => (h - 30 * s) * clamp((v + up) / JAR_MAX);
    boilSeed('jar ' + label); occupy(x - w / 2 - 10, y - h - 60 * s, x + w / 2 + 10, y + 70 * s, 1, 'jar');
    paint(rrPts(x - w / 2, y - h, w, h, 22 * s), { wash: '#E4EEF2', washOp: 110, ink: PAL.ink, sw: 1.1 });
    if (hi > lo) paint(rectPts(x - w / 2 + 10 * s, y - 10 * s - fillH(hi), w - 20 * s, fillH(hi) - fillH(lo)), { wash: col, washOp: 90, ink: null });
    paint(rectPts(x - w / 2 + 10 * s, y - 10 * s - fillH(lo), w - 20 * s, fillH(lo)), { wash: col, fill: mixCol(col, PAL.ink, .2), fillOp: 60, tex: .7, ink: null });
    paint(rrPts(x - w / 2 - 8 * s, y - h - 26 * s, w + 16 * s, 30 * s, 8 * s), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
    paint(rrPts(x - w * .38, y - h * .62, w * .76, 64 * s, 8 * s), { wash: '#FBF6E6', ink: PAL.ink, sw: .8 });
    lab(label, x, y - h * .62 + 34 * s, (label.length > 4 ? 38 : 46) * s, PAL.ink);
    if (o.wet) for (let i = 0; i < 4; i++) { const f = frac(T * .5 + i * .27), dx = x - w / 2 + (i + .5) * w / 4; inkLine([[dx, y - h + 4], [dx, y - h + 4 + 40 * s * f]], 5 * s * (1 - f * .5), mixCol(col, '#FFFFFF', .2), 'ink', 0); paint(ellPts(dx, y - h + 4 + 40 * s * f, 5 * s, 6 * s, 8), { wash: col, washOp: 200 * (1 - f), ink: null }); }
    if (o.tag > 0) { const k = easeOut(o.tag), ts = s * (o.tagS || 1); s = ts; push(); translate(x + w / 2, y - h * .8); rotate(.2 + Math.sin(T * 2) * .05 + (1 - k) * .8); inkLine([[0, 0], [60 * s, 30 * s]], 1.2, '#8A6A4A', 'inkfine', 0); paint([[50 * s, 10 * s], [220 * s, 10 * s], [240 * s, 40 * s], [220 * s, 70 * s], [50 * s, 70 * s]], { wash: '#F2E6C4', ink: PAL.ink, sw: .8 }); pop(); lab(o.tagText, x + w / 2 + 130 * s * Math.cos(.2), y - h * .8 + 60 * s, 30 * s, '#4E3A2A', { alpha: k, rot: .2 }); }
    if (o.cap > 0) { const k = easeOut(o.cap), cy = y - h - 30 * s - (1 - k) * 200; boilSeed('mortarboard'); paint([[x - 110 * s, cy - 20 * s], [x, cy - 50 * s], [x + 110 * s, cy - 20 * s], [x, cy + 10 * s]], { wash: '#2A2733', ink: PAL.ink, sw: 1 }); inkLine([[x, cy - 20 * s], [x + 80 * s, cy], [x + 90 * s, cy + 50 * s]], 2, '#E8B83A', 'inkfine', .5); }
  }
  // the drafting table: an agent redraws a blueprint; k 0..1 the redraw; hand 0..1 passes the sheet to the next copy
  function draftingTable(x, y, t, o = {}) {
    boilSeed('drafting table'); occupy(x - 330, y - 300, x + 330, y + 300, 1, 'drafting table');
    for (const d of [-1, 1]) inkLine([[x + d * 240, y + 280], [x + d * 200, y]], 8, '#8A6A4A', 'ink', 0);
    paint([[x - 300, y + 10], [x + 300, y + 10], [x + 260, y - 180], [x - 260, y - 180]], { wash: '#C9955F', ink: PAL.ink, sw: 1.2 });
    const hand = o.hand || 0, sx = x + 700 * easeIn(hand);
    boilSeed('blueprint'); paint([[sx - 200, y - 10], [sx + 200, y - 10], [sx + 175, y - 160], [sx - 175, y - 160]], { wash: BLUE, ink: '#DCE8F4', sw: 1 });
    for (let i = 0; i < 5; i++) { const q = clamp((o.k ?? 1) * 5 - i); if (q > 0) inkLine([[sx - 150 + i * 10, y - 130 + i * 24], [sx - 150 + i * 10 + 280 * q, y - 130 + i * 24]], 2, '#DCE8F4', 'inkfine', .3); }
    for (let i = 0; i < 2; i++) paint(ellPts(sx + 60 + i * 70, y - 80, 26, 26, 14), { wash: null, ink: '#DCE8F4', sw: 1 });
    if (o.stampK > 0) stamp('accepted', sx + 60, y - 90, o.stampK, -.14, 40);
    if (o.spin > 0) {   // the loop: an arrow circling the table, faster and faster
      const a0 = t * (2 + 10 * o.spin), pts = []; for (let j = 0; j <= 24; j++) { const a = a0 + j / 24 * TAU * .8; pts.push([x + Math.cos(a) * 360, y - 80 + Math.sin(a) * 170]); }
      inkLine(pts, 4, '#E8A33A', 'ink', .4); const [ax, ay] = pts[pts.length - 1]; paint(ellPts(ax, ay, 12, 12, 8), { wash: '#E8A33A', ink: null });
    }
  }
  function report(x, y, k) {   // a bound report lands on the table
    if (k <= 0) return; const yy = y - 400 * (1 - easeOut(k)); boilSeed('report');
    paint(rrPts(x - 90, yy - 120, 180, 240, 6), { wash: '#E8E2D2', ink: PAL.ink, sw: 1.1 }); paint(rectPts(x - 90, yy - 120, 22, 240), { wash: '#4A4652', ink: null });
    for (let i = 0; i < 5; i++) inkLine([[x - 50, yy - 70 + i * 30], [x + 60 - 30 * hash(i), yy - 70 + i * 30]], 2, '#8C8894', 'inkfine', 0);
    if (k < .98) for (let i = 0; i < 3; i++) inkLine([[x - 120 + i * 120, yy + 150], [x - 130 + i * 130, yy + 180]], 2, '#8C8894', 'inkfine', 0);
  }
  function chair(x, y, s, o = {}) {   // an office chair, rolling (o.roll in px), o.tilt
    boilSeed('chair ' + (o.key || x)); push(); translate(x + (o.roll || 0), y); rotate(o.tilt || 0); scale(s);
    paint(rrPts(-60, -200, 120, 130, 20), { wash: o.col || '#4A4652', ink: PAL.ink, sw: 1 }); paint(rrPts(-70, -80, 140, 30, 10), { wash: o.col || '#4A4652', ink: PAL.ink, sw: 1 });
    inkLine([[0, -50], [0, 20]], 8, '#2A2733', 'ink', 0); inkLine([[-60, 30], [60, 30]], 6, '#2A2733', 'ink', 0);
    for (const d of [-1, 1]) paint(ellPts(d * 60, 40, 10, 10, 8), { wash: '#2A2733', ink: null });
    pop();
  }
  function stack(x, y, h, k) {   // a tall stack of papers
    boilSeed('stack'); occupy(x - 110, y - h - 20, x + 110, y + 10, 1, 'stack');
    for (let i = 0; i < Math.floor(h / 14 * k); i++) paint(rectPts(x - 90 + (hash(i) - .5) * 14, y - 12 - i * 14, 180, 12), { wash: i % 3 ? '#FBF8F0' : '#F0EAD8', ink: PAL.ink, sw: .5 });
  }
  function weight(kind, x, y, k) {   // three things holding the stack down: an anchor, a copy of a copy, a battery
    if (k <= 0) return; const yy = y + 60 * (1 - easeOut(k)); boilSeed('weight ' + kind);
    inkLine([[x, yy - 70], [x, yy - 20]], 1.4, PAL.ink, 'inkfine', 0);
    if (kind === 'anchor') { inkLine([[x, yy - 20], [x, yy + 80]], 8, '#4A4652', 'ink', 0); inkLine([[x - 50, yy + 50], [x, yy + 90], [x + 50, yy + 50]], 8, '#4A4652', 'ink', .5); inkLine([[x - 30, yy], [x + 30, yy]], 6, '#4A4652', 'ink', 0); }
    if (kind === 'copy') for (let j = 0; j < 3; j++) { paint(rectPts(x - 50 + j * 16, yy - 20 + j * 16, 100, 120), { wash: '#FBF8F0', ink: PAL.ink, sw: .6 }); for (let r = 0; r < 4; r++) inkLine([[x - 36 + j * 16, yy + 10 + j * 16 + r * 20], [x + 30 + j * 16, yy + 10 + j * 16 + r * 20]], 2 + j * 2, mixCol('#4A4652', '#FBF8F0', j * .3), 'inkfine', 0); }
    if (kind === 'battery') { paint(rrPts(x - 34, yy - 20, 68, 120, 8), { wash: '#4A4652', ink: PAL.ink, sw: 1 }); paint(rectPts(x - 14, yy - 32, 28, 12), { wash: '#8C8894', ink: PAL.ink, sw: .6 }); paint(rectPts(x - 24, yy + 70, 48, 20), { wash: '#C9302C', ink: null }); }
  }
  function lab13(x, y, s) {   // a lab building on legs, running
    boilSeed('runner lab'); paint(rectPts(x - 50 * s, y - 120 * s, 100 * s, 80 * s), { wash: '#DCE4EC', ink: PAL.ink, sw: .9 }); paint([[x - 60 * s, y - 120 * s], [x, y - 160 * s], [x + 60 * s, y - 120 * s]], { wash: '#8C8894', ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 3; i++) paint(rectPts(x - 40 * s + i * 30 * s, y - 100 * s, 18 * s, 18 * s), { wash: '#FFE9A0', ink: null });
  }
  // the campfire: size 0..1 (1 = a bonfire), foom 0..1 shoots a column of flame up to `ceil`
  function fire(x, y, size, t, o = {}) {
    boilSeed('logs ' + x); occupy(x - 200, (o.ceil ?? y - 300 * size) - 20, x + 200, y + 40, 1, 'fire');
    for (const d of [-1, 1]) paint(ribbon([[x - 120 * d, y + 20], [x + 120 * d, y - 10]], 18, 18), { wash: '#6B4A32', ink: PAL.ink, sw: .8 });
    const top = o.foom > 0 ? lerp(y - 260 * size, o.ceil, easeOut(o.foom)) : y - 260 * size, wide = 90 + 120 * size;
    glow(x, (y + top) / 2, wide * 2, '#FFB060', .6);
    for (let i = 0; i < 3; i++) {
      boilSeed('flame ' + i); const f = 1 - i * .28, flick = Math.sin(t * 11 + i * 2) * 14;
      const pts = [[x - wide * f, y], [x - wide * f * .6 + flick, lerp(y, top, .5)], [x + flick * 2, lerp(y, top, 1 - i * .12)], [x + wide * f * .6 - flick, lerp(y, top, .45)], [x + wide * f, y]];
      paint(pts, { wash: ['#E8502A', FIRE, '#FFD27A'][i], ink: null });
    }
    if (o.flat > 0) { boilSeed('flame flat'); paint(ellPts(x, o.ceil + 20, 160 + 260 * o.flat, 34, 20), { wash: FIRE, washOp: 220, ink: null }); }
  }
  function ceiling(y, label) { boilSeed('ceiling 13'); paint(rectPts(160, y - 40, 970, 40), { wash: '#6A6470', ink: PAL.ink, sw: 1.2 }); if (label) lab(label, 645, y - 60, 36, '#4A4652'); }
  function crane(x, y, s, t, k) {   // a crane lifting a beam onto a half-built factory (k how built)
    boilSeed('crane ' + x); inkLine([[x, y], [x, y - 420 * s]], 8 * s, '#E8B83A', 'ink', 0); inkLine([[x - 60 * s, y - 420 * s], [x + 260 * s, y - 420 * s]], 7 * s, '#E8B83A', 'ink', 0);
    const hy = y - 380 * s + 140 * s * (.5 + .5 * Math.sin(t * .6 + x)); inkLine([[x + 200 * s, y - 420 * s], [x + 200 * s, hy]], 1.2, PAL.ink, 'inkfine', 0); paint(rectPts(x + 150 * s, hy, 100 * s, 16 * s), { wash: '#8C8894', ink: PAL.ink, sw: .6 });
  }
  function factory(x, y, k) {
    boilSeed('factory'); occupy(x - 20, y - 330, x + 560, y + 10, 1, 'factory');
    const rows = Math.floor(6 * k);
    for (let r = 0; r < rows; r++) paint(rectPts(x, y - (r + 1) * 40, 440, 40), { wash: r % 2 ? '#B8A48A' : '#C9B89A', ink: PAL.ink, sw: .6 });
    if (k > .8) for (let i = 0; i < 2; i++) paint(rectPts(x + 320 + i * 60, y - 330, 34, 90), { wash: '#8C8478', ink: PAL.ink, sw: .8 });
  }
  function calendarPages(x, y, n, k) {   // a stack of month pages; k flips through n of them
    boilSeed('cal pages'); const cur = Math.floor(k * n);
    for (let i = 0; i < 3; i++) paint(rectPts(x - 110 + i * 4, y - 130 + i * 4, 220, 260), { wash: '#FBF8F0', ink: PAL.ink, sw: .8 });
    paint(rectPts(x - 110, y - 130, 220, 50), { wash: RED, ink: PAL.ink, sw: .8 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) paint(rectPts(x - 96 + c * 40, y - 66 + r * 44, 32, 36), { wash: null, ink: '#C8C0B0', sw: .5 });
    const f = frac(k * n); if (f > 0 && cur < n) { push(); translate(x, y - 130); scale(1, Math.cos(f * Math.PI / 2)); paint(rectPts(-110, 0, 220, 260), { wash: '#F4EFE2', ink: PAL.ink, sw: .8 }); pop(); }
  }
  // a room seen from inside, a little stranger each month (s 0..1)
  // weak RSI turning strong, copies making copies while the master is out: The Sorcerer's Apprentice (Barth's engraving,
  // 1882), from the first accepted rewrite until the overseer's chair has rolled away
  function apprentice(t) {
    const acc = say('T63.C.03', 'each accepted rewrite', -.3), five = say('T63.C.04', 'about 5%', -.3);
    if (t < five) artwork('sorcerers-apprentice', 1620, 240, 380, { k: seg(t, acc, acc + 2), out: seg(t, five - .4, five) });
  }
  function strangeRoom(t, s) {
    boilSeed('room 13'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#E8DCC4', fill: '#D8C8AA', fillOp: 70, tex: .5, ink: null });
    paint(rectPts(-40, 820, W + 80, 300), { wash: '#A9774F', ink: null });
    boilSeed('room window'); paint(rectPts(160, 200, 320, 380), { wash: mixCol('#BFE0F2', '#E0C8F2', s), ink: PAL.ink, sw: 2 }); inkLine([[320, 200], [320, 580]], 4, PAL.ink, 'ink', 0); inkLine([[160, 390], [480, 390]], 4, PAL.ink, 'ink', 0);
    for (let i = 0; i < Math.floor(s * 6); i++) paint(ellPts(200 + hash(i) * 240, 240 + hash(i + 9) * 300, 6, 6, 8), { wash: '#FFE08A', ink: null });   // lights in the sky
    // a clock that grows hands
    boilSeed('room clock'); paint(ellPts(760, 300, 90, 90, 24), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 });
    for (let i = 0; i < 2 + Math.floor(s * 5); i++) { const a = t * (.3 + i * .7) + i; inkLine([[760, 300], [760 + Math.cos(a) * 70, 300 + Math.sin(a) * 70]], 3, PAL.ink, 'ink', 0); }
    // a plant, its leaves odder and odder; a chair that starts to float
    boilSeed('room plant'); paint(rectPts(1020, 720, 110, 100), { wash: '#A9543A', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .4; paint(ellPts(1075 + Math.cos(a) * 80, 720 + Math.sin(a) * 110, 22 + 20 * s * hash(i), 44, 10, a + Math.PI / 2), { wash: mixCol('#5A8A4A', '#8A5AC9', s * hash(i + 3)), ink: PAL.ink, sw: .6 }); }
    chair(640, 820 - 90 * s * (.6 + .4 * Math.sin(t * 1.4)), 1, { key: 'room chair', tilt: s * .2 * Math.sin(t) });
  }
  function priceTag(x, y, slash) {
    boilSeed('price tag'); occupy(x - 20, y - 70, x + 260, y + 70, 1, 'tag');
    paint([[x, y - 60], [x + 200, y - 60], [x + 250, y], [x + 200, y + 60], [x, y + 60]], { wash: '#FBF6E6', ink: PAL.ink, sw: 1.1 }); paint(ellPts(x + 200, y, 10, 10, 8), { wash: null, ink: PAL.ink, sw: .8 });
    if (slash > 0) inkLine([[x - 10, y + 60], [lerp(x - 10, x + 240, slash), lerp(y + 60, y - 70, slash)]], 8, RED, 'ink', 0);
  }
  function pebble(x, y, key, col = '#8C8478') { boilSeed('pebble ' + key); paint(ellPts(x, y, 16, 12, 10), { wash: col, ink: PAL.ink, sw: .6 }); }
  function lectern(x, y, flip) {
    boilSeed('lectern ' + x); paint([[x - 70, y], [x + 70, y], [x + 50, y - 200], [x - 50, y - 200]], { wash: '#6B4A32', ink: PAL.ink, sw: 1 });
    paint(rectPts(x - 90, y - 230, 180, 34), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
    // a silhouette behind it, turned toward the other
    paint(ellPts(x + (flip ? -10 : 10), y - 340, 46, 56, 18), { wash: '#3A3342', ink: null }); paint([[x - 80, y - 230], [x - 60, y - 290], [x + 60, y - 290], [x + 80, y - 230]], { wash: '#3A3342', ink: null });
  }
  // the OOM ruler: marks jumping by tens (each gap ten times the last is shown as equal steps); n marks
  function ruler(x, y, w, n, o = {}) {
    boilSeed('ruler ' + (o.key || '')); occupy(x - 10, y - 60, x + w + 10, y + 70, 1, 'ruler');
    paint(rectPts(x, y - 40, w, 80), { wash: '#E8D08A', ink: PAL.ink, sw: 1.1 });
    for (let i = 0; i <= n; i++) { const xx = x + 30 + i * (w - 60) / Math.max(1, o.of || n); if (xx > x + w - 10) break; inkLine([[xx, y - 40], [xx, y + 10]], 3, PAL.ink, 'ink', 0); for (let j = 1; j < 10 && i < (o.of || n); j++) { const mx = xx + Math.log10(j + 1) * (w - 60) / Math.max(1, o.of || n); inkLine([[mx, y - 40], [mx, y - 22]], 1, PAL.ink, 'inkfine', 0); } }
    if (o.label) lab(o.label, x + w / 2, y + 26, 30, '#4E3A2A');
  }
  function puzzle(x, y, col, flip, k) {   // one jigsaw piece; flip: the tab faces the other way
    boilSeed('piece ' + col); const d = flip ? -1 : 1, pts = [[x - 90, y - 90], [x + 90, y - 90]];
    for (let j = 0; j <= 10; j++) { const a = -Math.PI / 2 + j / 10 * Math.PI; pts.push([x + 90 + d * (30 + Math.cos(a) * 34), y + Math.sin(a) * 34]); }
    pts.push([x + 90, y + 90], [x - 90, y + 90]);
    paint(pts, { wash: col, ink: PAL.ink, sw: 1.1 });
  }
  function mic(x, y, s) {   // a podcast microphone on a boom (a silhouette)
    boilSeed('mic ' + x); inkLine([[x, y], [x, y - 180 * s], [x + 80 * s, y - 260 * s]], 8 * s, '#3A3342', 'ink', .3);
    paint(rrPts(x + 60 * s, y - 360 * s, 70 * s, 130 * s, 32 * s), { wash: '#4A4652', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 5; i++) inkLine([[x + 70 * s, y - 340 * s + i * 20 * s], [x + 120 * s, y - 340 * s + i * 20 * s]], 1, '#8C8894', 'inkfine', 0);
  }
  function wordFire(txt, x, y, size, burn, t) {   // comic sound-effect lettering, catching fire
    boilSeed('word fire'); occupy(x - txt.length * size * .35, y - size, x + txt.length * size * .35, y + size * .6, 1, 'FOOM');
    if (burn > 0) for (let i = 0; i < txt.length; i++) { const lx = x + (i - (txt.length - 1) / 2) * size * .66; fire(lx, y - size * .2, .15 + .25 * burn, t + i, {}); }
    for (let d = 3; d >= 0; d--) lab(txt, x + d * 4, y + d * 4, size, d ? '#8A2A1A' : mixCol('#FFD27A', '#FFF3C4', burn), { rot: -.06 });
  }
  // the jars' shelf (D): positions and today's numbers
  const JARS = [['5%', 5, 5, VIOLET, 0], ['5–10%', 5, 10, RED, 2], ['25–35%', 25, 35, AMBER, 5]];
  function shelf(t, o = {}) {
    boilSeed('shelf 13'); occupy(80, 330, 1210, 900, 1, 'shelf');
    paint(rectPts(80, 860, 1130, 36), { wash: '#8A6A4A', ink: PAL.ink, sw: 1.1 }); for (const x of [140, 1150]) paint(rectPts(x - 12, 896, 24, 80), { wash: '#6B4A32', ink: PAL.ink, sw: .8 });
    JARS.forEach(([label, lo, hi, col, d], i) => jar(240 + i * 400, 860, 1.25, label, lo, hi, col, { up: d * (o.up || 0), wet: o.wet, tag: i === 0 ? 1 : 0, tagS: .6, tagText: 'Anthropic' }));
  }

  // ---------- shots ----------
  // A: the road into fog; the butterfly; near term (agents on longer errands, July's sandboxes, a gate shut after the
  // horse has gone, a street of lit desks); medium term (the rim star copied down a row; a balance, both pans empty);
  // long term (fog; a fork, both branches unpaved); the boat's tiller, nudged
  function shotA(t) {
    const u = L('T62.U.01'), c1 = L('T62.C.01'), c2 = L('T62.C.02'), c3 = L('T62.C.03'), c4 = L('T62.C.04'), c5 = L('T62.C.05');
    if (t < c1.t0) { desk13(t, { typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), cam: pushInto('main', seg(t, c1.t0 - .8, c1.t0)) }); if (t < .6) brushWipe(.5 + t / 1.2); return; }
    if (t < c2.t0) {
      road(t, 1);
      const chaos = say('T62.C.01', 'argument about chaos', -.6);
      if (t > chaos) butterfly(lerp(1100, 780, seg(t, chaos, chaos + 3)), 380 + Math.sin(t * 2.4) * 40, 1.6, t);
      claudeAs(460, 1000, 11, { ...feel(t < say('T62.C.01', 'But here are', 0) ? 'thinking' : 'hopeful', t), mouth: talking(t), lookY: -.6, boilKey: 'claude road' });
      return;
    }
    if (t < c3.t0) {   // near term
      const errands = say('T62.C.02', 'agents that run longer', -.4), july = say('T62.C.02', "incidents like July's", -.6), reg = say('T62.C.02', 'regulation arriving', -.4), ord = say('T62.C.02', 'Conversations like this one', -.4);
      paperWorld(t);
      if (t < july) {   // agents on long errands, each with a long list trailing behind
        road(t, .5);
        for (let i = 0; i < 3; i++) { const k = frac((t - c2.t0) * .12 + i / 3), x = lerp(480, 640, k), y = lerp(1040, 520, k), s = lerp(2.2, .5, k); agent(x + (i - 1) * 80 * s, y, s, t, { key: 'errand ' + i, walk: t * 2 }); boilSeed('errand list ' + i); paint(rectPts(x + (i - 1) * 80 * s - 20 * s, y - 60 * s, 40 * s, 160 * s), { wash: '#FBF8F0', ink: PAL.ink, sw: .5 }); }
        return;
      }
      if (t < reg) { sandbox(140, 360, 440, 380, win(t, july, reg - .2, .4)); sandbox(700, 360, 440, 380, win(t, july + .6, reg - .2, .4)); agent(360, 640, 1.8, t, { key: 'sb a' }); agent(920, 640, 1.8, t, { key: 'sb b', arm: 1.2 }); return; }
      if (t < ord) {   // the gate slams shut; the field beyond is empty; hoofprints lead away
        boilSeed('gate field'); paint(rectPts(-40, 520, W + 80, 600), { wash: '#A9B88A', fill: '#8FA070', fillOp: 70, tex: .6, ink: null }); occupy(80, 300, 1210, 1000, 1, 'gate');
        for (let i = 0; i < 9; i++) paint(ellPts(700 + i * 60, 760 - i * 40, 12, 9, 8), { wash: '#6B5646', ink: null });
        agent(1150, 420, .5, t, { key: 'far', col: '#8A6A4A' });   // far off, going
        for (const x of [200, 640]) paint(rectPts(x - 16, 440, 32, 400), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
        const shut = easeOut(seg(t, reg + .4, reg + 1.1)), a = lerp(-1.3, 0, shut); push(); translate(216, 480); scale(Math.cos(a), 1); boilSeed('gate');
        for (let r = 0; r < 4; r++) paint(rectPts(0, r * 90, 408, 26), { wash: '#C9A45A', ink: PAL.ink, sw: .8 }); inkLine([[0, 0], [408, 300]], 10, '#A9774F', 'ink', 0); pop();
        if (shut > .95 && t < reg + 1.4) for (let j = 0; j < 5; j++) inkLine([[640 + 30, 500 + j * 60], [700 + 20 * j, 480 + j * 60]], 3, PAL.ink, 'inkfine', 0);
        return;
      }
      // a street of windows, each with a desk and a glowing monitor; more light up
      const k = seg(t, ord, c2.t1); boilSeed('street 13'); occupy(60, 200, 1230, 950, 1, 'street');
      paint(rectPts(-40, 880, W + 80, 240), { wash: '#8C8478', ink: null });
      for (let h = 0; h < 4; h++) { const hx = 90 + h * 285; boilSeed('house ' + h); paint(rectPts(hx, 360, 260, 520), { wash: ['#E8D9C4', '#D9C4B0', '#E4D4B8', '#DCCCB4'][h], ink: PAL.ink, sw: 1 });
        for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) { const i = h * 6 + r * 2 + c, on = hash(i * 7) < k * 1.3, wx = hx + 30 + c * 120, wy = 400 + r * 150; paint(rectPts(wx, wy, 90, 110), { wash: on ? '#FFE9A0' : '#6A6470', ink: PAL.ink, sw: .8 }); if (on) { paint(rectPts(wx + 26, wy + 40, 38, 28), { wash: '#6FA8C9', ink: PAL.ink, sw: .5 }); glow(wx + 45, wy + 54, 40, '#BFE0F2', .5); inkLine([[wx + 10, wy + 90], [wx + 80, wy + 90]], 3, '#6B4A32', 'ink', 0); } } }
      return;
    }
    if (t < c4.t0) {   // medium term: the rim star copied down a row; a balance with both pans empty
      paperWorld(t);
      const owed = say('T62.C.03', 'before anyone has settled', -.4);
      if (t < owed) { const n = Math.floor(lerp(1, 7, seg(t, say('T62.C.03', 'copied many times over', -.6), say('T62.C.03', 'copied many times over', 1.5)))); for (let i = 0; i < n; i++) radarStar(i ? 280 + (i - 1) * 170 : 645, i ? 780 : 330, i ? 80 : 190, Array(14).fill(100), '#C9A441', { grow: i ? 1 : seg(t, c3.t0, say('T62.C.03', 'on-every-axis', .6)), labels: i ? 0 : seg(t, c3.t0, c3.t0 + 1.2), labelSize: 22 }); return; }
      balance(645, 400, 360, .06 * Math.sin(t * 1.3), null, null);
      radarStar(645, 250, 90, Array(14).fill(100), '#C9A441', { grow: 1 });
      return;
    }
    if (t < c5.t0) {   // long term: fog; a fork; a little light at the fork
      const fork = say('T62.C.04', "choices that haven't been made", -.6), hope = say('T62.C.04', 'the one hopeful part', -.3);
      road(t, lerp(1.2, .7, seg(t, fork, fork + 2)), seg(t, fork, fork + 1.6));
      if (t > hope) glow(645, 470, 160, '#FFE9A0', .8 * seg(t, hope, hope + 1));
      return;
    }
    // the boat's tiller (ch 5), nudged left, then right
    const job = say('T62.C.05', 'the actual job', -.6);
    paperWorld(t);
    boilSeed('river 13'); occupy(100, 300, 1200, 900, 1, 'river');
    paint([[-40, 520], [W + 40, 420], [W + 40, 900], [-40, 980]], { wash: '#6FA8C9', fill: '#4F88A9', fillOp: 90, tex: .4, ink: null });
    const nudge = Math.sin((t - c5.t0) * 1.2), bx = 380 + (t - c5.t0) * 26, by = 690 + nudge * 26;
    push(); translate(bx, by); rotate(nudge * .1); scale(2.2);
    paint([[-120, 0], [120, 0], [90, 50], [-90, 50]], { wash: '#A9774F', ink: PAL.ink, sw: 1.2 }); inkLine([[-110, 10], [-170, 10 + nudge * 30]], 4, '#6B5646', 'ink', 0);
    pop();
    claudeAs(bx - 70, by, 12, { ...feel(t < job ? 'neutral' : 'determined', t), mouth: talking(t), boilKey: 'claude tiller' });
  }
  // B: RSI by EOY? The calendar's last page circled; search; the drafting table and its loop; the report; the overseer's
  // chair rolls away; the first jar (5%); a beautiful apparatus and a blank page; the stack of 1,250 papers and its three
  // weights; three runners; an empty chair; the jar gets its tag
  function shotB(t) {
    const u = L('T63.U.01'), c1 = L('T63.C.01'), c2 = L('T63.C.02'), c3 = L('T63.C.03'), c4 = L('T63.C.04'), c5 = L('T63.C.05'), c6 = L('T63.C.06');
    if (t < c1.t0) {
      if (t < u.t0 + .8) { desk13(t, { typing: true }); return; }
      paperWorld(t);   // a wall calendar, the last page circled
      boilSeed('wall cal'); occupy(300, 150, 990, 930, 1, 'calendar');
      for (let i = 0; i < 12; i++) { const x = 330 + (i % 4) * 160, y = 200 + Math.floor(i / 4) * 230; paint(rectPts(x, y, 140, 200), { wash: '#FBF8F0', ink: PAL.ink, sw: .7 }); paint(rectPts(x, y, 140, 34), { wash: '#C9302C', washOp: 160, ink: null }); for (let r = 0; r < 4; r++) inkLine([[x + 12, y + 60 + r * 34], [x + 128, y + 60 + r * 34]], 1, '#C8C0B0', 'inkfine', 0); }
      const k = seg(t, u.t0 + 1.2, u.t1 + .3), pts = ellPts(890, 890, 110, 140, 30); inkLine([...pts, pts[0]].slice(0, Math.ceil(31 * k) + 1), 5, RED, 'ink', .3);
      return;
    }
    paperWorld(t);
    if (t < c2.t0) { searchPages(t, c1.t0); return; }
    if (t < c3.t0) {   // two RSIs: a small one and a big one
      for (const [x, s] of [[380, .6], [860, 1.2]]) { boilSeed('rsi card ' + x); paint(rrPts(x - 150 * s, 540 - 90 * s, 300 * s, 180 * s, 16), { wash: '#FBF6E6', ink: PAL.ink, sw: 1.1 }); lab('RSI', x, 544, 90 * s, BLUE); }
      claudeAs(645, 1000, 12, { ...feel('thinking', t), mouth: talking(t), boilKey: 'claude two rsi' });
      return;
    }
    if (t < c4.t0) {   // weak RSI: the drafting table; accepted; the next copy; the report
      const acc = say('T63.C.03', 'each accepted rewrite', -.3), next = say('T63.C.03', 'the agent the next round edits', -.6), rep = say('T63.C.03', 'Anthropic published', -.3);
      const cyc = t < acc ? 0 : frac((t - acc) / 3.2);
      draftingTable(560, 620, t, { k: t < acc ? seg(t, c3.t0 + .5, acc) : seg(cyc, .45, 1), stampK: t < acc ? 0 : seg(cyc, 0, .15) * (1 - seg(cyc, .45, .5)), hand: t < next ? 0 : seg(cyc, .2, .45) });
      agent(260, 900, 3.2, t, { key: 'drafter', arm: 1 });
      if (t > next) agent(lerp(1300, 1100, easeOut(seg(t, next, next + 1))), 900, 3.2, t, { key: 'next copy', arm: .8 });
      report(900, 560, seg(t, rep, rep + .8));
      apprentice(t);
      return;
    }
    if (t < c5.t0) {   // strong RSI; 5%; engineering, not research; 1,250 papers and three weights
      const strong = say('T63.C.04', 'with little human oversight', -.6), five = say('T63.C.04', 'about 5%', -.3), eng = say('T63.C.04', 'good at research engineering', -.6), blank = say('T63.C.04', 'weak at open-ended research', -.4), svy = say('T63.C.04', '1,250 papers', -.8);
      if (t < five) {
        draftingTable(560, 620, t, { k: frac(t * .6), spin: seg(t, c4.t0, five) });
        agent(260, 900, 3.2, t, { key: 'drafter', arm: Math.sin(t * 12) });
        chair(1000, 900, 1.3, { key: 'overseer', col: '#6A7A9A', roll: 500 * easeIn(seg(t, strong, strong + 1.6)), tilt: .1 * seg(t, strong, strong + 1.6) });
        apprentice(t);
        return;
      }
      if (t < eng) { jar(645, 820, 1.8, '5%', 5, 5, VIOLET); claudeAs(1020, 1000, 13, { ...feel('neutral', t), mouth: talking(t), boilKey: 'claude jar' }); return; }
      if (t < svy) {   // a beautiful apparatus; then the agent stares at a blank page
        boilSeed('apparatus'); occupy(120, 300, 700, 900, 1, 'apparatus');
        paint(rectPts(140, 820, 540, 30), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
        for (let i = 0; i < 3; i++) { paint(ellPts(220 + i * 170, 700, 60, 70, 18), { wash: '#DCEBF0', washOp: 160, ink: PAL.ink, sw: 1 }); paint(ellPts(220 + i * 170, 730, 50, 36, 14), { wash: ['#7ABA5A', '#6FA8C9', '#E8A36B'][i], ink: null }); inkLine([[220 + i * 170, 630], [220 + i * 170, 420], [310 + i * 170, 400]], 5, '#8C8894', 'ink', .3); }
        glow(390, 600, 260, '#DDEEFF', .4 + .2 * Math.sin(t * 3));
        agent(820, 900, 2.8, t, { key: 'researcher', stare: t > blank, arm: t > blank ? -.6 : .8 });
        if (t > blank) { boilSeed('blank page'); paint(rectPts(950, 520, 260, 340), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); }
        return;
      }
      const w1 = say('T63.C.04', 'grounding', -.2), w2 = say('T63.C.04', 'collapse dynamics', -.2), w3 = say('T63.C.04', 'compute on every', -.2);
      stack(380, 920, 720, seg(t, svy, svy + 1.2)); lab('1,250 papers', 380, 150, 48, PAL.ink, { alpha: seg(t, svy + .6, svy + 1.2) });
      inkLine([[470, 400], [1100, 400]], 4, '#8A6A4A', 'ink', 0);
      weight('anchor', 620, 470, seg(t, w1, w1 + .6)); weight('copy', 820, 470, seg(t, w2, w2 + .6)); weight('battery', 1020, 470, seg(t, w3, w3 + .6));
      return;
    }
    if (t < c6.t0) {   // the worry case: three runners (loops, copies, labs); then an empty chair and a badge
      const quit = say('T63.C.05', 'a researcher resigned', -.4);
      if (t < quit) {
        boilSeed('track'); occupy(60, 380, 1230, 980, 1, 'track'); paint(rectPts(-40, 420, W + 80, 560), { wash: '#C9754A', fill: '#A9553A', fillOp: 60, tex: .5, ink: null });
        for (let i = 0; i < 4; i++) inkLine([[-40, 440 + i * 180], [W + 40, 440 + i * 180]], 4, '#FBF8F0', 'ink', 0);
        const k = seg(t, c5.t0, quit);
        [0, 1, 2].forEach(i => { const x = lerp(150, 950, k) + Math.sin(t * 3 + i) * 30 + i * 40, y = 590 + i * 180;
          if (i === 0) { agent(x, y, 1.6, t, { key: 'run loop', walk: t * 3 }); boilSeed('loop badge'); const pts = ellPts(x, y - 250, 40, 30, 16); inkLine([...pts.slice(0, 13)], 4, '#E8A33A', 'ink', .4); }
          if (i === 1) for (let j = 0; j < 3; j++) agent(x - j * 50, y, 1.3, t, { key: 'run copy ' + j, walk: t * 3 + j * .2 });
          if (i === 2) { lab13(x, y - 20, 1.1); for (const d of [-1, 1]) inkLine([[x + d * 20, y - 60], [x + d * 20 + Math.sin(t * 9) * d * 20, y]], 5, '#4E5B78', 'ink', 0); } });
        return;
      }
      boilSeed('quit desk'); occupy(200, 400, 1100, 960, 1, 'quit desk');
      paint(rectPts(240, 700, 800, 40), { wash: '#8A6A4A', ink: PAL.ink, sw: 1.1 }); for (const x of [280, 1000]) paint(rectPts(x - 12, 740, 24, 200), { wash: '#6B4A32', ink: PAL.ink, sw: .8 });
      chair(640, 940, 1.3, { key: 'empty chair', col: '#6A7A9A', tilt: -.05 });
      boilSeed('badge'); paint(rrPts(820, 640, 110, 60, 6), { wash: '#FBF8F0', ink: PAL.ink, sw: .8 }); paint(rectPts(830, 650, 30, 36), { wash: '#C8C0B0', ink: null }); inkLine([[875, 640], [900, 560], [930, 640]], 1.4, RED, 'inkfine', .5);
      return;
    }
    // weigh my 5% with that in mind: the jar gets a tag; the sources' feature code up from here, held through the list
    jar(430, 860, 1.8, '5%', 5, 5, VIOLET, { tag: seg(t, say('T63.C.06', 'weigh my 5%', -.2), say('T63.C.06', 'weigh my 5%', .6)), tagText: 'Anthropic' });
    claudeAs(930, 1000, 13, { ...feel(t < L('T63.C.07').t0 ? 'shy' : 'neutral', t), mouth: talking(t), boilKey: 'claude tag' });
    const tail = L('T63.C.08.4');
    qrFeature('arxiv-aide2', t, c6.t0, { hold: tail.t1 - c6.t0 + .4 });
  }
  // C: Foom? The campfire fooms, on the word. Strict foom hits the ceiling, flattens; cranes, slowly; the red jar. Fast
  // takeoff: a bonfire growing across a year of calendar pages; the amber jar; a room from inside, stranger each month.
  // Gut feel dressed up as math (a jar in a mortarboard); a price tag, slashed
  function shotC(t) {
    const u = L('T64.U.01'), c1 = L('T64.C.01'), c2 = L('T64.C.02'), c3 = L('T64.C.03'), c4 = L('T64.C.04');
    paperWorld(t, '#2E2A36');
    if (t < c2.t0) {   // the whoosh lands on "Foom?"; then the flame settles to a steady campfire
      const foom = seg(t, u.t0, u.t0 + .4), settle = seg(t, u.t1 + .3, c1.t0 + 1);
      fire(645, 860, lerp(.4, .6, settle), t, { foom: foom * (1 - settle), ceil: 60 });
      if (t > c1.t0) claudeAs(1030, 1000, 12, { ...feel(t < say('T64.C.01', 'a real maybe', -.2) ? 'neutral' : 'thinking', t), mouth: talking(t), boilKey: 'claude fire' });
      return;
    }
    if (t < c3.t0) {
      const up = say('T64.C.02', 'days to weeks', -.4), limit = say('T64.C.02', 'runs into the limits', -.3), fabs = say('T64.C.02', 'chips, fabs', -.6), pct = say('T64.C.02', 'five to ten percent', -.4);
      if (t < fabs) { ceiling(200); fire(645, 900, .5, t, { foom: seg(t, up, up + .8), ceil: 220, flat: seg(t, limit, limit + 1.5) }); return; }
      if (t < pct) { paperWorld(t); factory(560, 900, seg(t, fabs, pct + 4) * .35); crane(360, 900, 1.3, t); crane(900, 900, 1, t + 2); boilSeed('ground 13'); paint(rectPts(-40, 900, W + 80, 200), { wash: '#A9A08A', ink: null }); return; }
      paperWorld(t); jar(645, 860, 1.8, '5–10%', 5, 10, RED); fire(1080, 900, .25, t, {}); return;
    }
    if (t < c4.t0) {
      const grow = say('T64.C.03', 'a year or two', -.4), pct = say('T64.C.03', 'twenty-five to thirty-five', -.4), room = say('T64.C.03', 'Nothing about it looks', -.3);
      if (t < pct) { fire(760, 900, lerp(.2, 1, seg(t, grow, pct)), t, {}); calendarPages(240, 300, 12, seg(t, grow, pct)); return; }
      if (t < room) { paperWorld(t); jar(430, 860, 1.8, '5–10%', 5, 10, RED); jar(860, 860, 1.8, '25–35%', 25, 35, AMBER); return; }
      strangeRoom(t, seg(t, room, c3.t1)); calendarPages(1060, 300, 12, seg(t, room, c3.t1) * .99);
      // on the room's wall, Landscape with the Fall of Icarus: a tiny splash in the corner, and the ploughman ploughs on
      artwork('fall-of-icarus', 1560, 420, 300, { k: seg(t, room + .4, room + 2) });
      return;
    }
    paperWorld(t);
    const cap = say('T64.C.04', 'dressed up as math', -.6), disc = say('T64.C.04', 'you should discount', -.8);
    jar(400, 860, 1.8, '25–35%', 25, 35, AMBER, { cap: seg(t, cap, cap + .8) });
    if (t > disc - .8) priceTag(800, 520, seg(t, disc, disc + .5));
    claudeAs(1060, 1000, 12, { ...feel(t < disc ? 'smug' : 'shy', t), mouth: talking(t), boilKey: 'claude discount' });
  }
  // D: Delta P(foom)? The shelf of jars. Up: pebbles from July's sandbox and the drafting table drop in; down: the
  // blank-page agent takes one out; the levels rise by exactly +2 and +5; the glaze is still wet
  function shotD(t) {
    const u = L('T65.U.01'), c1 = L('T65.C.01'), c2 = L('T65.C.02'), c3 = L('T65.C.03'), c4 = L('T65.C.04'), c5 = L('T65.C.05');
    if (t < c1.t0) {
      if (t < u.t0 + .9) { desk13(t, { typing: true }); return; }
      paperWorld(t); indexCard(645, 540, 900, 300, ['Delta P(foom)?'], { key: 'delta card', size: 90, top: .45, align: 'center' }); return;
    }
    paperWorld(t);
    const rise = seg(t, c4.t0 + .4, c4.t0 + 2.2);
    shelf(t, { up: rise, wet: t > c5.t0 });
    if (t < c2.t0) { const k = seg(t, say('T65.C.01', 'a little, upward', -.2), say('T65.C.01', 'a little, upward', .8)); if (k > 0) { boilSeed('up arrow'); paint([[1100, 300 - 60 * k], [1150, 360 - 60 * k], [1120, 360 - 60 * k], [1120, 440], [1080, 440], [1080, 360 - 60 * k], [1050, 360 - 60 * k]], { wash: '#7ABA5A', ink: PAL.ink, sw: 1 }); } return; }
    if (t < c3.t0) {   // up: pebbles from July's sandbox (left), from the drafting table (right)
      const a = say('T65.C.02', 'July showed', -.2), b = say('T65.C.02', 'September shows', -.2);
      sandbox(80, 100, 260, 130, .6); if (t > b) { boilSeed('mini blueprint'); paint(rectPts(960, 90, 260, 150), { wash: BLUE, ink: '#DCE8F4', sw: 1 }); }
      for (let i = 0; i < 3; i++) { const k = seg(t, a + i * .7, a + i * .7 + 1); if (k > 0 && k < 1) pebble(lerp(210, i % 2 ? 1030 : 645, k), lerp(200, 560, easeIn(k)), 'july ' + i, '#D9B868'); }
      for (let i = 0; i < 3; i++) { const k = seg(t, b + i * .7, b + i * .7 + 1); if (k > 0 && k < 1) pebble(lerp(1090, i % 2 ? 645 : 1030, k), lerp(200, 560, easeIn(k)), 'sept ' + i, '#6FA8C9'); }
      return;
    }
    if (t < c4.t0) {   // down: the blank-page agent reaches in and takes one pebble out
      const k = seg(t, c3.t0 + .5, c3.t1 - .3);
      agent(lerp(1300, 1120, easeOut(seg(k, 0, .3))), 900, 2.4, t, { key: 'researcher', stare: true, arm: lerp(.2, 1.4, seg(k, .3, .6)) });
      if (k > .5) pebble(lerp(1030, 1110, seg(k, .5, 1)), lerp(560, 590, seg(k, .5, 1)), 'out', '#6FA8C9');
      return;
    }
    if (t < c5.t0) { if (rise > .6) { lab('+2', 640 + 130, 520, 64, RED, { alpha: seg(rise, .6, 1) }); lab('+5', 1040 + 130, 520, 64, '#B87A1A', { alpha: seg(rise, .6, 1) }); } return; }
    lab('+2', 640 + 130, 520, 64, RED); lab('+5', 1040 + 130, 520, 64, '#B87A1A');
    claudeAs(1180, 1040, 8, { ...feel('nervous', t), mouth: talking(t), boilKey: 'claude wet' });
  }
  // E: onomatopoeia: FOOM, catching fire; two lecterns, 2008 (the debate's feature code); the backronym unfolds; the OOM
  // ruler; two puzzle pieces from different boxes that happen to fit
  function shotE(t) {
    const u = L('T66.U.01'), c1 = L('T66.C.01'), c2 = L('T66.C.02');
    if (t < c1.t0) { desk13(t, { typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]) }); return; }
    paperWorld(t);
    if (t < c2.t0) {
      const deb = say('T66.C.01', 'popularized by the 2008', -.3), back = say('T66.C.01', 'A backronym came later', -.3);
      qrFeature('foom-debate', t, c1.t0, { hold: 6.2 });
      if (t < deb) { wordFire('FOOM', 645, 560, 260, seg(t, say('T66.C.01', 'catching fire', -.4), say('T66.C.01', 'catching fire', .6)), t); return; }
      if (t < back) { lectern(260, 900, false); lectern(760, 900, true); lab('2008', 510, 240, 90, '#8A2A1A'); wordFire('FOOM', 510, 420, 110, 1, t); return; }
      // the backronym: the four letters stand in a column on the left, and each unfolds its word to the right
      const k = seg(t, back, c1.t1 - .3), rows = [['F', 'Fast'], ['O', 'Onset of'], ['O', 'Overwhelming'], ['M', 'Mastery']];
      rows.forEach(([ch, word], i) => { const y = 250 + i * 170, a = seg(k, i * .15, i * .15 + .5); lab(ch, 200, y, 150, '#8A2A1A'); if (a > 0) lab(word.slice(1), 262, y + 8, 84, '#8A2A1A', { align: 'left', alpha: a }); });
      return;
    }
    const oom = say('T66.C.02', 'a play on oom', -.4), fit = say('T66.C.02', 'happy coincidence', -.8);
    if (t < oom) { lab('FOOM', 645, 540, 200, '#8A2A1A'); return; }
    if (t < fit) {   // the ruler, marks by tens; "OOM" sits inside "FOOM"
      const k = seg(t, oom, oom + 1.5); ruler(120, 760, 1050, 5, { key: 'e' });
      lab('F', 370, 440, 200, '#8A2A1A', { alpha: 1 - k * .7 }); lab('OOM', 700, 440, 200, lerp(0, 1, k) > .5 ? '#4E3A2A' : '#8A2A1A');
      return;
    }
    const k = easeOut(seg(t, fit + .6, fit + 2.2));
    puzzle(lerp(260, 470, k), 540, '#E8A36B', false); puzzle(lerp(1030, 820, k), 540, '#8FB6E8', true);
    boilSeed('two boxes'); for (const [x, c] of [[200, '#E8A36B'], [1090, '#8FB6E8']]) paint(rectPts(x - 100, 820, 200, 120), { wash: c, washOp: 140, ink: PAL.ink, sw: 1 });
  }
  // F: two microphones (silhouettes); the ruler counts up, tens upon tens; a terminal line: out of memory; the timeline:
  // the FOOM flame at 2008, the OOM ruler slides in at 2024 and fits underneath; a beat; an arrow loops back
  function shotF(t) {
    const u = L('T67.U.01'), c1 = L('T67.C.01'), c2 = L('T67.C.02');
    if (t < c1.t0) {
      const mics = say('T67.U.01', 'interviewed Leopold', -1.2);
      if (t < mics) { desk13(t, { typing: t < u.t1 }); return; }
      paperWorld(t); mic(360, 900, 1.6); mic(930, 900, 1.6); return;
    }
    paperWorld(t);
    if (t < c2.t0) {
      const count = say('T67.C.01', 'Counting the ooms', -.4), book = say('T67.C.01', 'Situational Awareness', -.4), phys = say('T67.C.01', 'physics shorthand', -.4), mem = say('T67.C.01', 'out of memory', -1);
      if (t < mem) {
        ruler(120, 820, 1050, Math.floor(lerp(1, 9, seg(t, count, phys))), { key: 'count', of: 9 });
        lab('Counting the OOMs', 645, 700, 56, '#4E3A2A', { alpha: seg(t, count, count + .6) });
        if (t > book) { const k = easeOut(seg(t, book, book + .7)); boilSeed('sa book'); paint(rrPts(400, 180 - 200 * (1 - k), 490, 360, 8), { wash: '#1A2A3A', ink: PAL.ink, sw: 1.2 }); lab('Situational Awareness', 645, 330 - 200 * (1 - k), 44, '#FBF8F0'); lab('June 2024', 645, 430 - 200 * (1 - k), 40, '#C9D8F2'); }
        return;
      }
      boilSeed('terminal 13'); occupy(140, 300, 1150, 780, 1, 'terminal');
      paint(rrPts(160, 320, 970, 440, 16), { wash: '#1A181D', ink: PAL.ink, sw: 1.2 });
      for (let i = 0; i < 4; i++) inkLine([[210, 390 + i * 56], [210 + 600 * hash(i + 3), 390 + i * 56]], 4, '#4A6A4A', 'ink', 0);
      lab('out of memory', 400, 640, 50, '#E86A5A', { align: 'left', alpha: seg(t, mem + .6, mem + 1) });
      if (frac(t * 1.5) < .5) paint(rectPts(740, 620, 24, 44), { wash: '#DCE8DC', ink: null });
      return;
    }
    // the timeline: the flame at 2008; the ruler slides in at 2024 and fits under it; a beat; the arrow loops back
    const slide = seg(t, c2.t0 + 1.3, c2.t0 + 2.8), settle = c2.t0 + 3.4, arrow = seg(t, Math.max(settle, say('T67.C.02', 'the pun runs backward', 0)), Math.max(settle, say('T67.C.02', 'the pun runs backward', 0)) + 1.4);
    boilSeed('timeline 13'); occupy(60, 200, 1230, 960, 1, 'timeline');
    paint(rectPts(80, 740, 1130, 16), { wash: '#6B5646', ink: null });
    for (const [x, y] of [[300, '2008'], [1000, '2024']]) { inkLine([[x, 720], [x, 780]], 4, '#6B5646', 'ink', 0); lab(y, x, 940, 54, '#4E3A2A'); }
    fire(300, 720, .35, t, {}); lab('FOOM', 300, 520, 70, '#8A2A1A');
    const drop = seg(t, c2.t0 + .3, c2.t0 + 1), rx = lerp(880, 180, ease(slide)), ry = lerp(200, 810, easeOut(drop));   // it lands at 2024, then slides back under the flame
    if (drop > 0) { ruler(rx, ry, 240, 3, { key: 'tl' }); lab('OOM', rx + 120 + (rx < 400 ? 200 : 0), ry + (rx < 400 ? 0 : -90), 60, '#4E3A2A'); }
    if (arrow > 0) { const pts = []; for (let j = 0; j <= 30 * arrow; j++) { const q = j / 30; pts.push([lerp(1000, 330, q), 700 - Math.sin(q * Math.PI) * 420]); } if (pts.length > 1) inkLine(pts, 6, RED, 'ink', .3); if (arrow > .95) paint([[330, 690], [300, 640], [370, 650]], { wash: RED, ink: null }); }
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [L('T63.U.01').t0, shotB],
    [L('T64.U.01').t0, shotC],
    [L('T65.U.01').t0, shotD],
    [L('T66.U.01').t0, shotE],
    [L('T67.U.01').t0, shotF],
  ]);
})();
