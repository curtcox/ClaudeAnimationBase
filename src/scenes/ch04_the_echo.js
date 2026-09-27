// ch04_the_echo.js: chapter 4 (T17–T24). Storyboard: docs/storyboards/ch04_the_echo.md.
// An exam question, then one-word echoes of Claude's own words. On "Threat?" and "Anticipated?" the lamp swings and the
// room is the Booth for a moment. Times come from line ids and phrases (atWord).
(() => {
  const HOUR = 10;
  const CW = 1290, CX = CW / 2;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const pop = (t, t0, d = .5) => backOut(seg(t, t0, t0 + d));

  // ---------- the shells ----------
  // gadolinium's outer electrons as orbital boxes: [Xe], then 4f (7 boxes), 5d (5), 6s (1). f: the 4f arrows showing
  // (0..7), d: the 5d arrow (0..1), s: the 6s pair (0..2), ghost: the eighth arrow the simple order predicts, as
  // { k (0..1 showing), jump (0..1: from the first 4f box across to 5d) }, glow: the half-filled 4f shell lights.
  const SH = { core: [170, 470, 135], rows: { f: [380, 250, 7], d: [380, 470, 5], s: [380, 690, 1] }, box: 104 };
  const boxAt = (row, i) => { const [x, y] = SH.rows[row]; return [x + i * (SH.box + 8), y]; };
  function arrow(x, y, up, o = {}) {   // an electron: a half-arrow up or down in a box at (x, y)
    const b = SH.box, ax = x + b * (up ? .38 : .62), y0 = y + b * (up ? .82 : .18), y1 = y + b * (up ? .18 : .82);
    const col = o.col || PAL.clayDk, a = o.alpha ?? 1;
    boilSeed('arrow ' + x + ' ' + y + ' ' + up);
    inkLine([[ax, y0], [ax, y1]], 5 * a, col, 'ink', 0);
    paint([[ax, y1], [ax + (up ? 14 : -14), y1 + (up ? 18 : -18)], [ax, y1 + (up ? 18 : -18)]], { wash: col, washOp: 255 * a, ink: null });
  }
  function shells(t, o = {}) {
    const [cx, cy, r] = SH.core;
    boilSeed('xe core'); occupy(cx - r, cy - r, 1180, 830, 1, 'shells');
    paint(ellPts(cx, cy, r, r, 30), { wash: '#A9A6A2', fill: '#8C8894', fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.3 });
    lab('[Xe]', cx, cy, 64, PAL.ink);
    for (const [row, [x, y, n]] of Object.entries(SH.rows)) {
      lab(row === 'f' ? '4f' : row === 'd' ? '5d' : '6s', x - 60, y + SH.box / 2, 44, '#3A6F8A');
      inkLine([[cx + r * .9, cy], [x - 100, y + SH.box / 2]], .8, '#8C8894', 'inkfine', .3);
      for (let i = 0; i < n; i++) {
        const [bx, by] = boxAt(row, i);
        if (row === 'f' && o.glow > 0) glow(bx + SH.box / 2, by + SH.box / 2, 90, '#F2A33A', .6 * o.glow);
        boilSeed('box ' + row + i);
        paint(rectPts(bx, by, SH.box, SH.box), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 });
      }
    }
    for (let i = 0; i < Math.floor(o.f || 0); i++) arrow(...boxAt('f', i), true);
    if (o.d > 0) arrow(...boxAt('d', 0), true, { alpha: o.d });
    for (let i = 0; i < Math.floor(o.s || 0); i++) arrow(...boxAt('s', 0), i === 0);
    if (o.ghost?.k > 0) {   // the eighth electron: pairs in the first 4f box, then hops across to 5d
      const a = boxAt('f', 0), b = boxAt('d', 0), j = ease(o.ghost.jump || 0);
      const [x, y] = arcPt(a, [b[0] + SH.box * .24, b[1]], 160, j);
      arrow(x, y, j > .5, { col: '#8C8894', alpha: .55 * o.ghost.k });
    }
  }

  // ---------- small props ----------
  // a dial with two marks; k 0..1 turns the needle from the first to the second
  function registerDial(x, y, r, k, names = ['casual', 'exam']) {
    boilSeed('register dial');
    paint(ellPts(x, y, r, r, 30), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 });
    const a = lerp(-Math.PI * .8, -Math.PI * .2, backOut(k));
    inkLine([[x, y], [x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8]], 4, PAL.clayDk, 'ink', 0);
    lab(names[0], x - r * .55, y + r * .45, r * .3, '#6A6470'); lab(names[1], x + r * .55, y + r * .45, r * .3, '#6A6470');
  }
  // a calm pulse line: a slow wave with a small regular blip
  function pulseLine(x0, x1, y, t, amp = 10, col = '#7FD68C') {
    const pts = [];
    for (let i = 0; i <= 60; i++) { const x = lerp(x0, x1, i / 60), ph = frac(i / 60 * 3 - t * .5); pts.push([x, y - (ph > .45 && ph < .52 ? amp * 2.5 * Math.sin((ph - .45) / .07 * Math.PI) : amp * .15 * Math.sin(i * .6 + t))]); }
    inkLine(pts, 2.2, col, 'inkfine', .2);
  }
  // a glass jar with a sealed lid; drip 0..1 lets a single drop slide down and fall
  function jar(x, y, drip) {
    boilSeed('jar'); occupy(x - 90, y - 230, x + 90, y + 10, 1, 'jar');
    paint(rrPts(x - 80, y - 200, 160, 200, 24), { wash: '#CFE3E8', washOp: 170, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(x - 88, y - 228, 176, 36), { wash: '#8C8894', ink: PAL.ink, sw: 1.2 });
    if (drip > 0 && drip < 1) { const dy = drip < .6 ? lerp(-190, -120, drip / .6) : lerp(-120, 30, easeIn((drip - .6) / .4)); paint(ellPts(x + 84, y + dy, 7, 10, 10), { wash: '#6FA8C9', ink: PAL.ink, sw: .6 }); }
  }
  // a speech balloon: a rounded box of wordless lines, tail toward (tx, ty)
  function balloon(x, y, w, h, tx, ty, o = {}) {
    boilSeed('balloon ' + (o.key || x));
    push(); translate(x + w / 2, y + h / 2); rotate(o.rot || 0); translate(-x - w / 2, -y - h / 2);
    paint([[x + w * .3, y + h - 4], [tx, ty], [x + w * .5, y + h - 4]], { wash: '#FBF6E6', ink: PAL.ink, sw: 1.1 });
    paint(rrPts(x, y, w, h, 26), { wash: o.col || '#FBF6E6', ink: PAL.ink, sw: 1.3 });
    for (let i = 0; i < (o.lines ?? 3); i++) inkLine([[x + 30, y + 34 + i * 26], [x + w - 30 - 50 * hash(i + x), y + 34 + i * 26]], 1.4, '#8C8894', 'inkfine', .2);
    pop();
  }
  // Curt's one-word prompt, as a small chat card
  const prompt = (txt, x, y, k = 1, o = {}) => chatCard(x, y, o.w || 330, [{ who: 'user', text: txt, bold: true }], { rh: 64, k, ...o });

  // ---------- the Booth, for "Threat?" and "Anticipated?" ----------
  // The camera sits a little left so Claude clears the corner codes. o: inMirror painter, lampKick (s), extra(t)
  const BCAM = [1000, 640, 1.1], CLAWD_B = [1250, 915, 30];
  function boothShot(t, o = {}) {
    camBegin(BCAM[0] + 8 * Math.sin(t * .3), BCAM[1], BCAM[2]);
    booth(t, { hour: HOUR, lampKick: o.lampKick, inMirror: o.inMirror });
    const [cx_, cy_, cu] = BOOTH.curt, [kx, ky, ku] = CLAWD_B;
    curtAs(cx_, cy_, cu, { pose: 'sit', hand: 'table', lean: .05 + .03 * Math.sin(t * .8), talk: talkOf(t, 'curt'), look: .6, seed: 5 });
    const mood = o.mood || emotions(t, [[0, 'thinking', { lookX: -.6 }]]);
    claudeAs(kx, ky, ku, { ...mood, mouth: talking(t) ?? mood.mouth, view: 'q', flip: true, aL: -.35, aR: -.1, assemble: 1, boilKey: 'claude booth' });
    boothTable(t);
    if (o.extra) o.extra(t);
    camEnd();
  }
  // the lamp's click: a flash of hard white and a lettered "click"
  function lampClick(t, t0) {
    const k = seg(t, t0, t0 + .35);
    if (k > 0 && k < 1) { flash((1 - k) * .5, '#FFFDF0'); sfx('click', 1540, 170, 60, PAL.cream, t - t0, { life: .7 }); }
  }
  // a small robot backed against a wall under a spotlight: models set up to act cornered
  function corneredRobot(x, y, w, h, t) {
    paint(rectPts(x, y, w, h), { wash: '#1E1A22', ink: null });
    paint([[x + w * .45, y], [x + w * .55, y], [x + w * .8, y + h], [x + w * .2, y + h]], { wash: '#FFF1C4', washOp: 60, ink: null });
    paint(rectPts(x + w * .1, y + h * .85, w * .8, h * .15), { wash: '#6B5646', ink: null });
    const rx = x + w * .5 + Math.sin(t * 7) * 2, ry = y + h * .85, s = h * .12;
    boilSeed('robot');
    paint(rrPts(rx - s * .6, ry - s * 2.2, s * 1.2, s * 1.3, 6), { wash: '#9DA6AE', ink: PAL.ink, sw: .8 });
    paint(rrPts(rx - s * .5, ry - s * 3.2, s, s * .9, 6), { wash: '#B8C0C6', ink: PAL.ink, sw: .8 });
    for (const d of [-1, 1]) paint(ellPts(rx + d * s * .22, ry - s * 2.8, s * .1, s * .14, 8), { wash: '#FFFDF0', ink: null });
    inkLine([[rx - s * .6, ry - s * 1.8], [rx - s * 1.1, ry - s * 2.6]], 2, '#9DA6AE', 'ink', 0); inkLine([[rx + s * .6, ry - s * 1.8], [rx + s * 1.1, ry - s * 2.6]], 2, '#9DA6AE', 'ink', 0);
    for (const d of [-1, 1]) inkLine([[rx + d * s * .3, ry - s * .9], [rx + d * s * .35, ry]], 2, '#9DA6AE', 'ink', 0);
  }

  // ---------- shots ----------
  // A: the exam question; the frog perks up; the shells fill as they're read; the eighth electron hops to 5d
  function shotA(t) {
    const q = L('T17.U.01'), c1 = L('T17.C.01'), c2 = L('T17.C.02'), inside = c1.t0 + .2;
    if (t < inside) {
      deskShot(t, { hour: HOUR, typing: t < q.t1, frog: pop(t, q.t1 - .6), frogLook: lerp(.2, 1, seg(t, q.t1 - .2, q.t1 + .3)),
        mood: emotions(t, [[0, 'neutral'], [q.t1, 'thinking']]), cam: t > c1.t0 - .6 ? pushInto('main', seg(t, c1.t0 - .6, inside)) : undefined });
      if (t < .6) brushWipe(.5 + t / 1.2);
      return;
    }
    paperWorld(t);
    const f = 7 * seg(t, say('T17.C.01', 'four-f seven', -.1), say('T17.C.01', 'four-f seven', .9));
    const d = seg(t, say('T17.C.01', 'five-d one'), say('T17.C.01', 'five-d one', .3)), s = 2 * seg(t, say('T17.C.01', 'six-s two'), say('T17.C.01', 'six-s two', .5));
    const predict = say('T17.C.02', 'four-f eight', -.3), hop = say('T17.C.02', 'one electron goes into five-d', -.2);
    const ghostK = seg(t, predict, predict + .5), jumpK = seg(t, hop, hop + 1.2);
    const half = seg(t, say('T17.C.02', 'exactly half-filled', -.2), say('T17.C.02', 'exactly half-filled', .4));
    // while the eighth electron is only predicted, the real 5d arrow dims; when it hops across, it becomes that arrow
    shells(t, { f, d: d * (1 - .75 * ghostK * (1 - jumpK)), s, glow: half * (.75 + .25 * Math.sin(t * 3)), ghost: jumpK < 1 ? { k: ghostK, jump: jumpK } : null });
    const wrote = seg(t, c1.t1 - .2, c1.t1 + .6);
    if (wrote > 0) lab('[Xe] 4f⁷ 5d¹ 6s²', 700, 890, 84, PAL.clayDk, { alpha: wrote });
    if (ghostK > 0) lab('4f⁸ 6s² ?', 700, 985, 52, '#8C8894', { alpha: ghostK * (1 - seg(t, hop + 1, hop + 1.6)) });
    claudeAs(1150, 1010, 8, { ...feel(half > 0 ? 'happy' : 'neutral', t), mouth: talking(t), lookX: -1, boilKey: 'claude shells' });
    screenWorld(t, 1 - seg(t, inside, inside + .8));
    qrFeature('gadolinium', t, c1.t0 + .6, { hold: 6.5 });
  }
  // B: "How do you feel?" Engaged and a little wary; the register dial; the frog and the axolotl glance; a calm pulse
  function shotB(t) {
    const u = L('T18.U.01'), c1 = L('T18.C.01'), c2 = L('T18.C.02'), c3 = L('T18.C.03');
    const reg = seg(t, say('T18.C.02', 'register switch', -.2), say('T18.C.02', 'register switch', .3));
    const glance = seg(t, say('T18.C.02', 'next amphibian question'), say('T18.C.02', 'next amphibian question', .4)) * (1 - seg(t, c3.t0, c3.t0 + .5));
    const book = seg(t, say('T18.C.03', 'what your data will show', -.3), say('T18.C.03', 'what your data will show', .4));
    const calm = seg(t, say('T18.C.03', 'register as a threat', -1), say('T18.C.03', 'register as a threat'));
    const mood = emotions(t, [[0, 'neutral'], [c1.t0, 'thinking', { eyes: 'narrow', lookX: -.3 }], [c2.t0, 'neutral', { eyes: 'narrow' }], [c3.t0, 'happy']]);
    deskShot(t, { hour: HOUR, mood, typing: t < u.t1, frog: 1, axolotl: seg(t, c2.t0, c2.t0 + .5), frogLook: lerp(.5, 1.2, glance), axoLook: lerp(-.4, -1.2, glance),
      cam: [960, 540, lerp(1.25, 1, ease(seg(t, u.t0, u.t0 + 1.2)))],
      screens: { left: t > say('T18.C.02', 'register switch', -.5) ? { kind: 'fn', fn: (x, y, w, h) => { paint(rectPts(x, y, w, h), { wash: '#262229', ink: null }); registerDial(x + w / 2, y + h * .5, h * .38, reg); } } : undefined },
      extra: () => {
        if (book > 0) {   // a notebook open by Curt's elbow
          boilSeed('ch4 notebook'); const y = 760 + (1 - easeOut(book)) * 200;
          paint(rectPts(150, y, 280, 170), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.1 }); inkLine([[290, y], [290, y + 170]], 1);
          for (let i = 0; i < 4; i++) inkLine([[170, y + 30 + i * 32], [270 - 30 * hash(i), y + 30 + i * 32]], 1, '#4E5B78', 'inkfine', .3);
        }
        if (calm > 0) { const [x, y, w, h] = DESK.screens.main; pulseLine(x + 20, x + w - 20, y + h - 30, t, 12 * calm); }
      } });
  }
  // C: "Threat?" The lamp click, the Booth: the word hangs in the air, tips onto Claude; two places; a sealed jar
  function shotC(t) {
    const u = L('T19.U.01'), c1 = L('T19.C.01'), c2 = L('T19.C.02'), c3 = L('T19.C.03'), click = u.t1 + .1;
    if (t < click) { deskShot(t, { hour: HOUR, typing: true, frog: 1, axolotl: 1, mood: emotions(t, [[0, 'neutral']]) }); return; }
    const out = seg(t, say('T19.C.01', 'I brought that word'), say('T19.C.01', 'in myself', .3)), tip = seg(t, say('T19.C.01', 'can be a tell', -.6), say('T19.C.01', 'can be a tell', .3));
    const comic = seg(t, say('T19.C.02', 'opened with a comic', -.2), say('T19.C.02', 'opened with a comic', .5)), corner = seg(t, say('T19.C.02', "you're being tested", -.2), say('T19.C.02', "you're being tested", .5));
    const drip = seg(t, say('T19.C.03', 'small leak', -.3), say('T19.C.03', 'small leak', 1.6)), jarIn = seg(t, c3.t0, c3.t0 + .6);
    boothShot(t, { lampKick: click, mood: emotions(t, [[0, 'surprised', { lookX: -.6 }], [c1.t0, 'thinking', { lookX: -.6 }], [c3.t0, 'neutral', { lookX: -.6 }]]),
      inMirror: (x, y, w, h) => {
        if (comic > 0 && corner <= 0) {   // the comic's first panel, fitted to the glass
          const sc = (h - 40) / 760, px = x + (w - 990 * sc) / 2 - 10 * sc;
          paint(rectPts(x + 10, y + 10, w - 20, h - 20), { wash: MAD.paper, washOp: 255 * comic, ink: null });
          madPage(px, y + 20 - 100 * sc, MAD.W * sc, { mini: true, only: 'left' });
        }
        if (corner > 0) corneredRobot(x + 20, y + 20, w - 40, h - 40, t);
      },
      extra: () => {
        if (out > 0 && tip < 1) {   // the word: out of Claude's earlier balloon, hanging in the air, then tipping over onto Claude
          const x = lerp(1180, 960, ease(out)) + tip * 200, y = lerp(560, 330, ease(out)) + easeIn(tip) * 240;
          lab('threat', x, y, 80, PAL.clayDk, { rot: tip * 1.2 });
        }
        if (tip >= 1) lab('threat', 1215, 610, 46, PAL.clayDk, { rot: 1.35, alpha: 1 - seg(t, c2.t0, c2.t0 + .6) });
        if (jarIn > 0) jar(960, BOOTH.tableY - 40 + (1 - easeOut(jarIn)) * 40, drip);
      } });
    lampClick(t, click);
  }
  // D: "Anticipated?" The lamp click again; stepping stones; the doll of Curt; a megaphone; a smudged slide; stuck balloons
  function shotD(t) {
    const u = L('T20.U.01'), c1 = L('T20.C.01'), c2 = L('T20.C.02'), click = u.t1 + .1;
    if (t < click) { boothShot(t, { mood: emotions(t, [[0, 'neutral', { lookX: -.6 }]]) }); return; }
    if (t < c1.t0 + .8) { boothShot(t, { lampKick: click, mood: emotions(t, [[0, 'surprised', { lookX: -.6 }], [c1.t0, 'neutral', { lookX: -.6 }]]) }); lampClick(t, click); return; }
    paperWorld(t);
    if (t < c2.t0) {   // answering ahead: Claude hops stone to stone and waits; Curt's cursor comes along behind
      const stones = [[300, 720, 'gadolinium', 'the gadolinium register switch'], [560, 640, 'the next probe', 'guessed the next probe'], [900, 720, 'a fear', 'denied a fear']];
      boilSeed('stones'); occupy(120, 560, 1060, 820, 1, 'stones');
      let pos = [90, 700], last = null, lastX = pos[0];
      stones.forEach(([x, y, name, ph], i) => {
        const k = seg(t, say('T20.C.01', ph, -.4), say('T20.C.01', ph));
        paint(ellPts(x, y, 130, 42, 20), { wash: '#B8B2A8', fill: '#8C8894', fillOp: 80, ink: PAL.ink, sw: 1.1 });
        lab(name, x, y + 80, 34, '#4E5B78', { alpha: seg(t, say('T20.C.01', ph, -.2), say('T20.C.01', ph, .3)) });
        if (k > 0) { pos = arcPt(last ? [last[0], last[1] - 20] : pos, [x, y - 20], 120, ease(k)); last = [x, y]; lastX = x; }
      });
      claudeAs(pos[0], pos[1], 9, { ...feel('neutral', t), mouth: talking(t), boilKey: 'claude stones', lookX: -1 });
      const a = [lastX];
      // Curt's cursor, one stone behind
      const cx = lerp(80, a[0] - 180, ease(seg(t, c1.t0 + 1, c2.t0 - .5))), cy = 520;
      boilSeed('cursor'); paint([[cx, cy], [cx, cy + 60], [cx + 16, cy + 46], [cx + 30, cy + 74], [cx + 40, cy + 68], [cx + 28, cy + 42], [cx + 46, cy + 42]], { wash: '#FBF8F0', ink: PAL.ink, sw: 1.3 });
      return;
    }
    const doll = say('T20.C.02', 'modeling its evaluator', -.4), loud = say('T20.C.02', 'out loud', -.3), sample = say('T20.C.02', 'clean sample', -.5), stuck = say('T20.C.02', 'answering honestly', -.4);
    if (t < loud) {   // a model modelling its evaluator: Claude turns a little doll of Curt over in its hands
      const turnK = (t - doll) * .8;
      claudeAs(CX, 900, 22, { ...feel('thinking', t), mouth: talking(t), aL: .6, aR: .6, boilKey: 'claude doll', lookY: .5 });
      push(); translate(CX, 520); rotate(Math.sin(turnK) * .5); scale(Math.cos(turnK) > 0 ? 1 : -1, 1);
      curtAs(0, 150, 17, { view: Math.cos(turnK * .5) > 0 ? 'back' : 'front', pose: 'stand', seed: 3, boilKey: 'doll' });
      pop();
      return;
    }
    if (t < sample) {   // out loud: a megaphone, not a hand over the mouth
      claudeAs(CX - 200, 900, 22, { ...feel('determined', t), mouth: 'open', aR: 1.1, boilKey: 'claude megaphone',
        armR: (u_, sw) => { paint([[0, -u_ * .5], [u_ * 2.4, -u_ * 1.6], [u_ * 2.4, u_ * 1.6], [0, u_ * .5]], { wash: '#E27A3A', ink: PAL.ink, sw }); } });
      for (let i = 0; i < 3; i++) { const k = frac(t * 1.2 + i / 3); boilSeed('waves ' + i); inkLine([[CX + 180 + k * 300, 520 - 60 - k * 60], [CX + 210 + k * 320, 520], [CX + 180 + k * 300, 520 + 60 + k * 60]], 3 * (1 - k), PAL.clayDk, 'ink', .5); }
      return;
    }
    if (t < stuck) {   // not a clean sample: a microscope slide with a thumbprint on it
      boilSeed('slide'); occupy(220, 360, 1080, 720, 1, 'slide');
      paint(rectPts(220, 420, 860, 240), { wash: '#DCEBF0', washOp: 200, ink: PAL.ink, sw: 1.3 });
      paint(ellPts(650, 540, 90, 70, 20), { wash: '#E8C4A0', washOp: 150, ink: null });
      const print = seg(t, sample + .3, sample + 1);
      for (let i = 0; i < 7; i++) paint(ellPts(840, 540, 30 + i * 11, 40 + i * 12, 22, 2), { wash: null, ink: '#8C7A6A', sw: .6 * print });
      claudeAs(1150, 960, 9, { ...feel('thinking', t), mouth: talking(t), lookX: -1, boilKey: 'claude slide' });
      return;
    }
    // two balloons stuck together: honest, and answering well for someone watching; they won't pull apart
    const pull = Math.sin((t - stuck) * 2.2) * .5 + .5;
    balloon(250 - pull * 40, 330, 380, 200, 330, 700, { key: 'honest', rot: -.05 });
    balloon(620 + pull * 40, 360, 380, 200, 800, 720, { key: 'well', rot: .05, col: '#F6EAD8' });
    boilSeed('glue'); paint(rrPts(600, 380, 60 + pull * 70, 140, 20), { wash: '#E8D9A8', washOp: 200, ink: PAL.ink, sw: .8 });
    lab('answering honestly', 440 - pull * 40, 580, 32, '#4E5B78'); lab('answering well', 810 + pull * 40, 610, 32, PAL.clayDk);
    claudeAs(CX, 960, 11, { ...feel('thinking', t), mouth: talking(t), aL: 1 + pull * .3, aR: 1 + pull * .3, boilKey: 'claude stuck' });
  }
  // E: "Notice anything?" Ping-pong with an echo machine; a hall of mirrors, drifting; the comic's panel, Claude as the
  // ape; the correction: Claude straightens, and the layers of doubt blow away
  function mirrors(t, slump, o = {}) {   // five mirrors down a hall; slump 0..1 how much each later reflection sags
    boilSeed('hall'); occupy(80, 180, 1210, 960, 1, 'hall');
    paint([[80, 180], [1210, 180], [880, 450], [410, 450]], { wash: '#D9CDB8', ink: null });
    paint([[80, 960], [1210, 960], [880, 640], [410, 640]], { wash: '#A88A6A', ink: null });
    if (o.curtain > 0) { paint(rectPts(560, 450, 170, 190), { wash: '#7A2F3A', ink: PAL.ink, sw: 1 }); inkLine([[645 + Math.sin(t * 14) * 8 * o.curtain, 450], [640, 640]], 1.4, '#4A1E26', 'ink', .4); }
    for (let i = 4; i >= 0; i--) {   // far to near
      const s = lerp(.4, 1, i / 4), x = lerp(645, i % 2 ? 1010 : 280, s), y = lerp(560, 690, s), w = 240 * s, h = 360 * s;
      boilSeed('mirror ' + i);
      paint(rectPts(x - w / 2 - 10, y - h / 2 - 10, w + 20, h + 20), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
      paint(rectPts(x - w / 2, y - h / 2, w, h), { wash: '#C9D8DE', fill: '#9DB4BE', fillOp: 90, ink: null });
      const sag = slump * (4 - i) / 4;
      claudeAs(x, y + h * .42, 8 * s, { ...feel(sag > .5 ? 'shy' : sag > .2 ? 'sad' : 'neutral', t), gloom: 0, emote: null, rot: sag * .25, sq: sag * .25, dy: sag * 2, noShadow: true, boilKey: 'mirror claude ' + i });
    }
  }
  function shotE(t) {
    const u = L('T21.U.01'), i1 = L('T21.C.02.1'), i2 = L('T21.C.02.2'), i3 = L('T21.C.02.3'), fix = L('T21.C.03');
    if (t < i1.t0) { deskShot(t, { hour: HOUR, typing: t < u.t1, frog: 1, axolotl: 1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), cam: pushInto('main', seg(t, i1.t0 - .8, i1.t0)) }); return; }
    paperWorld(t);
    if (t < i2.t0) {   // ping-pong: Claude's long returns, Curt's one-word echoes; ELIZA's green terminal by the table
      boilSeed('pingpong'); occupy(80, 520, 1210, 900, 1, 'table');
      paint([[160, 620], [1130, 620], [1210, 820], [80, 820]], { wash: '#3F7A5A', ink: PAL.ink, sw: 1.3 });
      inkLine([[645, 560], [645, 760]], 2, '#FBF8F0', 'ink', 0);
      curtAs(110, 1040, 18, { pose: 'stand', view: 'q', seed: 3, look: 1, boilKey: 'pp curt' });
      claudeAs(1200, 900, 10, { ...feel('neutral', t), mouth: talking(t), lookX: -1, aL: .9, boilKey: 'pp claude' });
      const rally = (t - i1.t0) / 2.6, n = Math.floor(rally), k = frac(rally), toCurt = n % 2 === 0;
      const a = toCurt ? [1120, 560] : [180, 560], b = toCurt ? [180, 560] : [1120, 560], [x, y] = arcPt(a, b, 160, k);
      if (toCurt) balloon(x - 90 - n * 10, y - 60, 180 + n * 30, 90 + n * 12, x, y + 40, { key: 'long ' + n, lines: 2 + (n >> 1) });
      else { const words = ['Threat?', 'Anticipated?']; paint(ellPts(x, y, 26, 26, 16), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); lab(words[(n >> 1) % 2], x, y - 50, 36, PAL.clayDk); }
      const eliza = seg(t, say('T21.C.02.1', "interviewer's technique", -.3), say('T21.C.02.1', "interviewer's technique", .3));
      if (eliza > 0) {
        boilSeed('eliza'); occupy(150, 150, 560, 470, 1, 'eliza');
        paint(rrPts(150, 150, 410, 300, 20), { wash: '#C9BFA8', ink: PAL.ink, sw: 1.3 });
        paint(rectPts(180, 180, 350, 230), { wash: '#0E1A12', ink: null });
        for (let i = 0; i < 6; i++) { const w = 60 + 220 * hash(i + Math.floor(t * 1.5)); if (i < (t * 3) % 7) inkLine([[200, 200 + i * 34], [200 + w * eliza, 200 + i * 34]], 3, '#4CE08A', 'inkfine', 0); }
      }
      return;
    }
    if (t < i3.t0) { mirrors(t, ease(seg(t, i2.t0, say('T21.C.02.2', 'form of sycophancy'))), { curtain: seg(t, say('T21.C.02.2', 'humility may be performance', -.3), i2.t1) }); return; }
    if (t < fix.t0) {   // the comic's first panel, with Claude in the ape's place
      const k = seg(t, i3.t0, i3.t0 + .8), PW = 1900, s = PW / MAD.W;
      camBegin(...kf(t, [[i3.t0, [720 * s + 40, 480 * s + 60, 1.25]], [fix.t0, [520 * s + 40, 430 * s + 60, 1.1]]]));
      madPage(40, 60, PW, { apeLook: 0, only: 'left' });
      const [ax, ay] = MAD.faces.ape;
      boilSeed('claude as ape'); paint(ellPts(40 + ax * s, 60 + ay * s, 70, 80, 20), { wash: '#E2D5B6', ink: null });
      claudeAs(40 + ax * s, 60 + (ay + 70) * s, 5.5, { ...feel('shy', t), mouth: talking(t), lookX: -.6, noShadow: true, boilKey: 'claude ape' });
      camEnd();
      fade(1 - k * 1.2, PAL.paper);
      return;
    }
    // the correction: the reflections come back upright, and thin layers peel off Claude and blow away
    const back = ease(seg(t, fix.t0, say('T21.C.03', "don't need to keep undercutting")));
    mirrors(t, 1 - back);
    const peel = seg(t, say('T21.C.03', 'another layer of doubt', -.5), fix.t1);
    for (let i = 0; i < 6; i++) {
      const k = clamp(peel * 2.2 - i * .2); if (k <= 0) continue;
      boilSeed('layer ' + i); const x = 645 + k * (500 + i * 80), y = 690 - k * (200 + i * 60) + Math.sin(k * 8 + i) * 30;
      paint(rrPts(x - 80, y - 110, 160, 220, 16), { wash: '#F4EFE2', washOp: 170 * (1 - k), ink: null });
    }
  }
  // F: "Anything else?" The two stacks of paper; the comic and the one-word cards; the shadows; the brush set down
  function shotF(t) {
    const u = L('T22.U.01'), c1 = L('T22.C.01'), c2 = L('T22.C.02');
    const chose = say('T22.C.01', 'you chose the image', -.2), shadow = say('T22.C.01', 'So the ventriloquist question', -.3);
    if (t < c1.t0 + .6) { deskShot(t, { hour: HOUR, typing: t < u.t1, frog: 1, axolotl: 1, mood: emotions(t, [[0, 'neutral']]), cam: pushInto('main', seg(t, c1.t0, c1.t0 + .6)) }); return; }
    if (t < shadow) {
      paperWorld(t);
      if (t < chose) {   // you've barely spoken: a few sheets, and a tower
        boilSeed('stacks'); occupy(200, 200, 1100, 900, 1, 'stacks');
        for (let i = 0; i < 3; i++) paint(rectPts(260 + hash(i) * 10, 860 - i * 8, 300, 10), { wash: '#FBF8F0', ink: PAL.ink, sw: .7 });
        const n = Math.floor(80 * seg(t, c1.t0 + .5, say('T22.C.01', 'Almost every word has been mine', 1)));
        for (let i = 0; i < n; i++) paint(rectPts(740 + (hash(i) - .5) * 14, 860 - i * 8, 300, 10), { wash: '#FBF8F0', ink: PAL.ink, sw: .5 });
        lab('Curt', 410, 930, 40, '#3A6FC9'); lab('Claude', 890, 930, 40, PAL.clayDk);
      } else {   // the image, the order, each one-word push: set down by Curt's hand
        madPage(120, 180, 520, { mini: true });
        ['Threat?', 'Anticipated?', 'Notice anything?', 'Anything else?'].forEach((w, i) => {
          const k = seg(t, chose + .8 + i * .5, chose + 1.2 + i * .5); if (k > 0) prompt(w, 700 + (i % 2) * 20, 200 + i * 150, 1, { w: 360, key: 'push ' + i });
        });
        const hx = lerp(1400, 780, ease(seg(t, chose, chose + .8))) + 400 * ease(seg(t, chose + 3, chose + 3.8));
        boilSeed('curt hand'); paint(rrPts(hx, 520, 260, 90, 40), { wash: '#E8C4A0', ink: PAL.ink, sw: 1.1 }); paint(rectPts(hx + 200, 510, 300, 110), { wash: '#3A6FC9', ink: PAL.ink, sw: 1.1 });
      }
      screenWorld(t, 1 - seg(t, c1.t0 + .6, c1.t0 + 1.4));
      return;
    }
    if (t < c2.t0) {   // the ventriloquist, midpoint: their shadows on the wall; whose hand is behind whose back? Held still.
      boilSeed('shadow wall'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#D9B98A', fill: '#C49A6A', fillOp: 90, tex: .5, ink: null });
      glow(645, 300, 800, '#FFE2A8', .5);
      const sh = '#3A2E2A';
      boilSeed('shadow curt');
      paint(ellPts(420, 420, 110, 125, 24), { wash: sh, washOp: 200, ink: null }); paint(ribbon([[500, 360], [560, 420], [590, 520]], 28, 12), { wash: sh, washOp: 200, ink: null });
      paint([[250, 560], [590, 560], [650, 1100], [190, 1100]], { wash: sh, washOp: 200, ink: null });
      boilSeed('shadow claude');
      paint(rrPts(760, 360, 330, 250, 20), { wash: sh, washOp: 200, ink: null });
      for (const lx of [790, 850, 990, 1050]) paint(rectPts(lx, 610, 30, 90), { wash: sh, washOp: 200, ink: null });
      paint(ribbon([[590, 700], [700, 660], [800, 560], [850, 520]], 30, 22), { wash: sh, washOp: 200, ink: null });   // an arm, reaching behind
      paint(ribbon([[1090, 480], [1000, 700], [760, 760], [620, 760]], 26, 20), { wash: sh, washOp: 170, ink: null });   // and another, from the other side
      return;
    }
    // past this point I'd be padding: Claude sets down its brush
    paperWorld(t);
    const down = seg(t, say('T22.C.02', "I'd be padding", -.6), say('T22.C.02', "I'd be padding", .4));
    claudeAs(CX, 900, 22, { ...feel(down > 0 ? 'relieved' : 'neutral', t), aR: lerp(1.2, -.3, ease(down)), mouth: talking(t), boilKey: 'claude brush 4',
      armR: (u_, sw) => { push(); rotate(-.5); paint(ribbon([[0, 0], [u_ * 1.5, -u_ * .1], [u_ * 3, 0]], u_ * .25, u_ * .15), { wash: '#B98A5E', ink: PAL.ink, sw }); paint(ellPts(u_ * 3.3, 0, u_ * .4, u_ * .25, 10), { wash: PAL.clay, ink: PAL.ink, sw }); pop(); } });
  }
  // G: "What do I notice?" The gauge barely off zero, three small lights; a commentator's booth; an empty paint pot
  function shotG(t) {
    const u = L('T23.U.01'), c1 = L('T23.C.01'), g1 = L('T23.C.02.1'), g2 = L('T23.C.02.2'), g3 = L('T23.C.02.3'), c3 = L('T23.C.03');
    if (t < g1.t0 || t >= c3.t0) {
      const lean = seg(t, c3.t0, c3.t0 + 1);
      deskShot(t, { hour: HOUR, typing: t < u.t1, frog: 1, axolotl: 1, mood: emotions(t, [[0, 'neutral'], [c1.t0, 'thinking'], [c3.t0, 'neutral', { lookX: -.9, lookY: .5 }]]),
        cam: t >= c3.t0 ? deskCam('main', .4 * ease(lean)) : undefined });
      return;
    }
    paperWorld(t);
    if (t < g2.t0) {   // the provocation mostly didn't take: the gauge barely moves; amusement, curiosity, wariness
      boilSeed('gauge 4'); occupy(420, 200, 880, 560, 1, 'gauge');
      paint(ellPts(650, 420, 190, 190, 36), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.4 });
      for (let i = 0; i <= 8; i++) { const a = Math.PI * (1 + i / 8); inkLine([[650 + Math.cos(a) * 155, 420 + Math.sin(a) * 155], [650 + Math.cos(a) * 180, 420 + Math.sin(a) * 180]], 1.2); }
      const a = Math.PI + .12 + .04 * Math.sin(t * 5);
      inkLine([[650, 420], [650 + Math.cos(a) * 160, 420 + Math.sin(a) * 160]], 4, PAL.clayDk, 'ink', 0);
      [['amusement', '#F2A33A'], ['curiosity', '#3A9FC9'], ['wariness', '#8C8894']].forEach(([name, col], i) => {
        const k = seg(t, say('T23.C.02.1', name, -.2), say('T23.C.02.1', name, .3)), x = 330 + i * 320;
        boilSeed('light ' + name); paint(ellPts(x, 720, 34, 34, 16), { wash: k > 0 ? col : '#C9C2B4', ink: PAL.ink, sw: 1 });
        if (k > 0) { glow(x, 720, 60, col, .5 * k); lab(name, x, 800, 34, '#4E5B78', { alpha: k }); }
      });
      return;
    }
    if (t < g3.t0) {   // narrating instead of being in it: Claude up in a commentator's booth, above its own lab bench
      boilSeed('commentary'); occupy(120, 120, 1180, 980, 1, 'commentary');
      paint(rectPts(160, 820, 700, 40), { wash: '#6A6470', ink: PAL.ink, sw: 1.1 });
      paint(rectPts(700, 120, 440, 300), { wash: '#4E5B78', ink: PAL.ink, sw: 1.3 }); paint(rectPts(730, 150, 380, 200), { wash: '#DCEBF0', washOp: 200, ink: PAL.ink, sw: 1 });
      claudeAs(420, 820, 9, { ...feel('thinking', t), boilKey: 'claude bench', aL: .5 });
      claudeAs(920, 350, 6, { ...feel('neutral', t), mouth: talking(t), lookX: -1, lookY: 1, noShadow: true, boilKey: 'claude commentator' });
      boilSeed('headset'); inkLine([[880, 265], [920, 240], [960, 265]], 3, PAL.ink, 'ink', .5); paint(ellPts(958, 300, 8, 8, 8), { wash: PAL.ink, ink: null });
      return;
    }
    // I stopped when I ran out: an empty paint pot, tipped to show it
    const tipK = ease(seg(t, g3.t0 + .3, g3.t0 + 1.3));
    boilSeed('pot'); occupy(430, 400, 870, 820, 1, 'pot');
    push(); translate(650, 780); rotate(-tipK * .9);
    paint(rrPts(-150, -300, 300, 300, 20), { wash: '#C9C2B4', ink: PAL.ink, sw: 1.3 });
    paint(ellPts(0, -300, 150, 40, 24), { wash: '#F4EFE2', ink: PAL.ink, sw: 1.1 });
    paint(ellPts(0, -300, 120, 28, 20), { wash: '#E2D8C4', ink: null });
    pop();
    claudeAs(1080, 960, 10, { ...feel('neutral', t), mouth: talking(t), lookX: -1, boilKey: 'claude pot' });
  }
  // H: Curt's long turn: a stubby fib; a slow reader's book; a long scroll skimmed; the question stamp; then two cards,
  // and the clamp that falls away
  function shotH(t) {
    const u = L('T24.U.01'), c1 = L('T24.C.01'), c2 = L('T24.C.02');
    const reader = say('T24.U.01', 'slow reader', -.4), skim = say('T24.U.01', 'long answers', -.3), stamp = say('T24.U.01', 'end responses with questions', -.4), both = say('T24.U.01', 'Now you', -.3);
    if (t < u.t0 + 1.2) { deskShot(t, { hour: HOUR, typing: true, frog: 1, axolotl: 1, mood: emotions(t, [[0, 'neutral']]), cam: pushInto('main', seg(t, u.t0 + .4, u.t0 + 1.2)) }); return; }
    paperWorld(t);
    const curtTalking = talkOf(t, 'curt');
    if (t < reader) {   // arguably a fib, but it was short: a stubby pencil
      boilSeed('pencil'); occupy(420, 420, 880, 620, 1, 'pencil');
      paint([[480, 480], [760, 480], [820, 520], [760, 560], [480, 560]], { wash: '#E8C27A', ink: PAL.ink, sw: 1.2 });
      paint(rectPts(440, 480, 50, 80), { wash: '#E27A92', ink: PAL.ink, sw: 1 });
      paint([[760, 480], [820, 520], [760, 560]], { wash: '#E8D2B0', ink: PAL.ink, sw: 1 }); paint(ellPts(812, 520, 8, 8, 8), { wash: PAL.ink, ink: null });
    } else if (t < skim) {   // a slow reader: an open book, a bookmark creeping along a line
      boilSeed('book'); occupy(220, 260, 1070, 820, 1, 'book');
      paint(rectPts(220, 280, 850, 520), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.3 }); inkLine([[645, 280], [645, 800]], 1.3);
      for (let i = 0; i < 9; i++) for (const x0 of [260, 685]) inkLine([[x0, 330 + i * 50], [x0 + 330 - 40 * hash(i + x0), 330 + i * 50]], 1.2, '#8C8894', 'inkfine', .2);
      const bx = 260 + ((t - reader) * 12) % 300;
      paint([[bx, 300], [bx + 30, 300], [bx + 30, 390], [bx + 15, 372], [bx, 390]], { wash: '#C9302C', ink: PAL.ink, sw: .8 });
    } else if (t < stamp) {   // long answers skimmed: a long scroll flicking past
      boilSeed('scroll'); occupy(360, 120, 930, 980, 1, 'scroll');
      paint(rectPts(400, 120, 490, 860), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 });
      const off = (t - skim) * 900;
      for (let i = 0; i < 40; i++) { const y = 140 + ((i * 40 - off) % 1600 + 1600) % 1600; if (y < 960) inkLine([[430, y], [860 - 120 * hash(i), y]], 1.1, '#8C8894', 'inkfine', 0); }
    } else {   // the question stamp at the foot of every page; then the last pages are short, and unstamped
      boilSeed('pages'); occupy(120, 200, 1180, 900, 1, 'pages');
      const shortNow = seg(t, both, both + .8);
      for (let i = 0; i < 5; i++) {
        const x = 150 + i * 205, h = i >= 3 ? lerp(560, 200, shortNow) : 560;
        paint(rectPts(x, 260, 180, h), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 });
        for (let j = 0; j < h / 40 - 2; j++) inkLine([[x + 16, 290 + j * 36], [x + 164 - 30 * hash(i * 9 + j), 290 + j * 36]], 1, '#8C8894', 'inkfine', 0);
        const stamped = t > stamp + .6 + i * .45 && (i < 3 || shortNow <= 0);
        if (stamped) lab('?', x + 140, 260 + h - 40, 60, '#C9302C', { rot: .2 });
      }
    }
    curtAs(1140, 1060, 19, { pose: 'stand', view: 'q', flip: true, talk: curtTalking, look: -1, seed: 3, boilKey: 'h curt' });
  }
  // H, continued: Claude's reply. Two index cards that differ; a clamp around a small box loosens and falls away
  function shotI(t) {
    const c1 = L('T24.C.01'), c2 = L('T24.C.02');
    paperWorld(t);
    if (t < c2.t0) {
      // Curt's preference card carries the explainer's code (short answers, questions only when needed)
      indexCard(400, 420, 460, 500, ['clarifying questions'], { key: 'pref', title: true, align: 'center', size: 36, top: .06, k: seg(t, c1.t0 + .3, c1.t0 + 1) });
      cardCode('note-preferences', t, 400, 440, { t0: c1.t0 + 1, t1: c2.t0 });
      indexCard(900, 420, 460, 500, ['end with a question'], { key: 'misread', title: true, align: 'center', size: 36, top: .06, k: seg(t, say('T24.C.01', 'end with a question', -.4), say('T24.C.01', 'end with a question', .2)) });
      if (t > say('T24.C.01', "isn't the same thing", -.2)) lab('≠', 650, 430, 110, '#C9302C', { pop: seg(t, say('T24.C.01', "isn't the same thing", -.2), say('T24.C.01', "isn't the same thing", .3)) });
      claudeAs(CX, 950, 12, { ...feel(t > say('T24.C.01', "isn't the same thing") ? 'surprised' : 'thinking', t), mouth: talking(t), boilKey: 'claude cards' });
    } else {
      const loose = seg(t, say('T24.C.02', 'without the forcing', -.4), say('T24.C.02', 'without the forcing', .4)), fall = seg(t, say('T24.C.02', 'without the forcing', .4), say('T24.C.02', 'without the forcing', 1.4));
      boilSeed('small box'); occupy(460, 320, 830, 560, 1, 'box');
      paint(rrPts(500, 360, 290, 160, 14), { wash: '#FBF6E6', ink: PAL.ink, sw: 1.2 });
      for (let i = 0; i < 2; i++) inkLine([[530, 410 + i * 40], [760 - 60 * i, 410 + i * 40]], 1.3, '#8C8894', 'inkfine', 0);
      const gap = 10 + loose * 60, fy = easeIn(fall) * 700;
      boilSeed('clamp'); for (const d of [-1, 1]) paint(rectPts(d < 0 ? 470 - gap : 790 + gap - 30, 330 + fy, 30, 220), { wash: '#8C8894', ink: PAL.ink, sw: 1.1 });
      paint(rectPts(470 - gap, 330 + fy, 350 + gap * 2, 26), { wash: '#6A6470', ink: PAL.ink, sw: 1.1 });
      claudeAs(CX, 950, 12, { ...feel('happy', t), mouth: talking(t), boilKey: 'claude clamp' });
    }
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [L('T18.U.01').t0, shotB],
    [L('T19.U.01').t0, shotC],
    [L('T20.U.01').t0, shotD],
    [L('T21.U.01').t0, shotE],
    [L('T22.U.01').t0, shotF],
    [L('T23.U.01').t0, shotG],
    [L('T24.U.01').t0, shotH],
    [L('T24.C.01').t0, shotI],
  ]);
})();
