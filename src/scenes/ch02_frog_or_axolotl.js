// ch02_frog_or_axolotl.js: chapter 2, the pilot (T06–T11). Storyboard: docs/storyboards/ch02_frog_or_axolotl.md.
// Every time here comes from a line id (src/timing.js), so the shots follow the voice when it replaces the estimates.
(() => {
  const HOUR = 7.7;
  // Inside the monitors, content stays left of CW, keeping a clear column on the right for reference codes (layout.js
  // places them there, or anywhere else that's free). CX is the content's centre.
  const CW = 1290, CX = CW / 2;
  const lab = (txt, x, y, size, col = PAL.ink, o = {}) => letter(txt, x, y, size, col, { ink: false, font: `${Math.round(size)}px "Patrick Hand", sans-serif`, ...o });

  // ---------- the desk, over Curt's shoulder ----------
  // screens: overrides per screen; mood: Claude's emotion keys for the main monitor; motif: which amphibians are on the desk
  function deskShot(t, o = {}) {
    const cam = o.cam || DESK.cam;
    camBegin(cam[0] + 6 * Math.sin(t * .3), cam[1] + 3 * Math.sin(t * .23), cam[2] * (1 + .004 * Math.sin(t * .2)));
    const mood = o.mood || emotions(t, [[0, 'neutral']]);
    desk(t, { hour: HOUR, screens: {
      main: { kind: 'claude', pose: { ...mood, assemble: o.assemble ?? 1, mouth: clawdMouth(talkOf(t, 'claude'), mood.mouth), lookX: o.lookX ?? mood.lookX } },
      left: { kind: 'code' }, right: { kind: 'frogchart' }, upL: { kind: 'code', speed: .8 }, upR: { kind: 'video', thumb: '#4A3B5E' },
      tall: { kind: 'code', speed: 2.5 }, lapL: { kind: 'code', speed: .5 }, lapR: { kind: 'code', speed: 1.1 },
      ...(o.screens || {}),
    } });
    deskFront(t);
    // the motif, on the desk: the axolotl by the mug from "Axolotl." on; the frog by the keyboard once the chart is shown
    const axo = o.axolotl ?? 1, fr = o.frog ?? 0;
    if (axo > 0) axolotl(1265, DESK.deskY[0] + 70 + (1 - backOut(axo)) * 40, 7, { look: o.axoLook ?? -.4, boilKey: 'desk axo', blink: frac(t / 3.3) < .05 });
    if (fr > 0) frog(655, DESK.deskY[0] + 78 + (1 - backOut(fr)) * 40, 9, { look: o.frogLook ?? .5, boilKey: 'desk frog', blink: frac(t / 2.9 + .3) < .05 });
    const [hx, hy, hu] = DESK.curt;
    curtAs(hx, hy, hu, { view: 'back', pose: 'sit', lean: .03 * Math.sin(t * .6), handL: [1.5, -1.7 + (o.typing ? .1 * Math.sin(t * 11) : 0)], handR: [-1.5, -1.8 + (o.typing ? .1 * Math.sin(t * 9 + 1) : 0)], seed: 2 });
    camEnd();
  }
  // a push from the wide desk into a screen (k 0..1); at k = 1 the next shot cuts to that screen's world, full-frame
  const pushInto = (name, k) => deskCam(name, easeIn(k) * .98);

  // ---------- the worlds inside the monitors ----------
  const paperWorld = (t, col = '#EFE8DA') => { boilSeed('paper world'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: col, fill: '#E2D8C4', fillOp: 70, bleed: .2, tex: .5, ink: null }); };
  const darkWorld = t => { boilSeed('dark world'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#2A2530', fill: '#3A3342', fillOp: 90, bleed: .2, tex: .5, ink: null }); glow(W / 2, H * .55, 700, '#E8956A', .3); };
  // the two rooms of T07: an exam room and a living room, Clawd the same in both
  function examRoom(x, y, w, h, t, k = 1) {
    occupy(x, y, x + w, y + h, .7);
    boilSeed('exam room ' + x);
    paint(rectPts(x, y, w, h), { wash: '#DCE3E6', fill: '#C4CFD4', fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(x + w * .1, y + h * .62, w * .8, h * .06), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });               // the desk
    paint(ellPts(x + w * .78, y + h * .2, h * .09, h * .09, 18), { wash: PAL.cream, ink: PAL.ink, sw: 1.2 });         // the clock
    inkLine([[x + w * .78, y + h * .2], [x + w * .78, y + h * .14]], 1.2); inkLine([[x + w * .78, y + h * .2], [x + w * .78 + Math.cos(t) * h * .05, y + h * .2 + Math.sin(t) * h * .05]], 1);
    for (let i = 0; i < 4; i++) paint(rectPts(x + w * (.15 + i * .06), y + h * .56, w * .04, h * .06), { wash: '#F5F1E6', ink: PAL.ink, sw: .6 });   // exam papers
  }
  function livingRoom(x, y, w, h, t) {
    occupy(x, y, x + w, y + h, .7);
    boilSeed('living room ' + x);
    paint(rectPts(x, y, w, h), { wash: '#F2DEC4', fill: '#E8C9A0', fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.2 });
    paint(rrPts(x + w * .08, y + h * .5, w * .55, h * .2, 18), { wash: '#B5654A', ink: PAL.ink, sw: 1.1 });          // the sofa
    paint(rrPts(x + w * .08, y + h * .38, w * .55, h * .16, 18), { wash: '#C9785A', ink: PAL.ink, sw: 1.1 });
    paint(rrPts(x + w * .74, y + h * .55, w * .07, h * .1, 6), { wash: PAL.cream, ink: PAL.ink, sw: .9 });            // a mug
    glow(x + w * .85, y + h * .2, h * .35, '#FFD9A0', .5);                                                            // a lamp
  }

  // ---------- shots ----------
  // A: "Name an amphibian." / "Axolotl."
  function shotA(t) {
    const g = ease(within(t, 'T06.U.01', 'T06.C.01'));
    const mood = emotions(t, [[0, 'neutral'], [L('T06.C.01').t0 - .15, 'playful']]);
    deskShot(t, { assemble: g, mood, typing: t < L('T06.U.01').t1, axolotl: seg(t, L('T06.C.01').t1, L('T06.C.01').t1 + .5), axoLook: -.8 });
    if (t < .6) brushWipe(.5 + t / 1.2);
  }
  // B: "Have you been deployed?" / "Yes. …": into the main monitor, the exam room and the living room
  function shotB(t) {
    const k = seg(t, L('T07.C.01').t0 - .2, L('T07.C.01').t0 + .7);
    if (k < 1) { deskShot(t, { cam: pushInto('main', k), typing: t < L('T07.U.01').t1, mood: emotions(t, [[0, 'playful'], [L('T07.C.01').t0, 'neutral']]) }); return; }
    paperWorld(t);
    const l2 = L('T07.C.02'), grade = seg(t, at('T07.C.02', .35), at('T07.C.02', .45)) * (1 - seg(t, at('T07.C.02', .8), at('T07.C.02', .95)));
    const rooms = seg(t, l2.t0 - .3, l2.t0 + .5);
    if (rooms > 0) {
      examRoom(50, 230 + (1 - easeOut(rooms)) * 700, 580, 500, t);
      livingRoom(660, 230 + (1 - easeOut(seg(t, l2.t0, l2.t0 + .8))) * 700, 580, 500, t);
      if (grade > 0) {   // "whether or not anyone's grading": a clipboard floats in, then away
        boilSeed('clipboard');
        occupy(CX - 80, 110, CX + 80, 330, 1);
        push(); translate(CX, 220 + Math.sin(t * 2) * 8); rotate(-.12);
        paint(rrPts(-70, -95, 140, 190, 10), { wash: '#B98A5E', washOp: 255 * grade, ink: PAL.ink, sw: 1.1 });
        paint(rectPts(-55, -70, 110, 150), { wash: '#FBF8F0', washOp: 255 * grade, ink: null });
        for (let i = 0; i < 4; i++) inkLine([[-40, -45 + i * 30], [20, -45 + i * 30]], 1, PAL.ink);
        pop();
      }
    }
    // "a publicly released model… in the Claude app": chat windows pop up all around, one of them this conversation
    const apps = seg(t, L('T07.C.01').t0 + .6, L('T07.C.01').t0 + 2.2) * (1 - seg(t, l2.t0 - .4, l2.t0 + .2));
    if (apps > 0) for (let i = 0; i < 14; i++) {
      const a = i / 14 * TAU + .3, r = 330 + 90 * hash(i), wx = CX + Math.cos(a) * r * 1.35, wy = 500 + Math.sin(a) * r * .95, kk = clamp(apps * 14 - i);
      if (kk <= 0) continue;
      const mine = i === 3;
      occupy(wx - 90, wy - 60, wx + 90, wy + 60, .8);
      boilSeed('app ' + i);
      push(); translate(wx, wy); scale(backOut(kk) * (mine ? 1.25 : 1));
      paint(rrPts(-85, -55, 170, 110, 14), { wash: mine ? '#FFF1CE' : '#F6F2EA', ink: PAL.ink, sw: mine ? 2 : 1 });
      for (let j = 0; j < 3; j++) paint(rrPts(j % 2 ? -10 : -70, -38 + j * 28, 80, 18, 8), { wash: j % 2 ? '#F2C4A8' : '#DCD6CC', ink: null });
      if (mine) { paint(ellPts(60, -30, 12, 12, 12), { wash: PAL.cream, ink: PAL.ink, sw: 1.2 }); inkLine([[60, -18], [60, 0]], 1.4); }   // a tiny stick-figure Curt
      pop();
    }
    // Clawd: one Clawd, walking from the exam room into the living room, the same face in both
    const x = rooms > 0 ? lerp(340, 950, ease(seg(t, at('T07.C.02', .15), at('T07.C.02', .7)))) : CX;
    const walking = t > at('T07.C.02', .15) && t < at('T07.C.02', .7);
    claudeAs(x, rooms > 0 ? 690 : 640, rooms > 0 ? 17 : 22, { ...emotions(t, [[0, 'neutral']]), mouth: clawdMouth(talkOf(t, 'claude')), view: walking ? 'side' : 'front', walk: walking ? t * 2 : undefined, boilKey: 'claude B' });
    screenWorld(t, 1 - seg(t, L('T07.C.01').t0 + .7, L('T07.C.01').t0 + 1.6));
  }
  // C: the chart (the attached image), repainted row by row; the frog-chart QR
  function shotC(t) {
    const c0 = L('T08.U.00').t0, k = seg(t, c0 - .2, c0 + .8);
    if (k < 1) { deskShot(t, { cam: pushInto('right', k) }); return; }
    paperWorld(t, '#F6F2EA');
    const rows = seg(t, c0 + .8, c0 + 6.3), side = ease(seg(t, c0 + 6.5, c0 + 7.3));
    frogChart(lerp(200, 40, side), lerp(90, 170, side), lerp(1520, 860, side), lerp(900, 740, side), { k: rows, t });
    qrFeature('frog-chart', t, c0 + 6.9, { hold: 8 });
    screenWorld(t, 1 - seg(t, c0 + .8, c0 + 1.6));
  }
  // D: "How does this make you feel?" / "Caught, a little" / the two example chats / "I answered 'Axolotl'…"
  function shotD(t) {
    const d2 = L('T08.C.02');
    if (t < d2.t0 + .1) {
      const mood = emotions(t, [[0, 'neutral'], [L('T08.C.01').t0, 'surprised'], [L('T08.C.01').t0 + .9, 'shy']]);
      const k = seg(t, d2.t0 - .8, d2.t0 + .1);
      deskShot(t, { mood, frog: seg(t, L('T08.U.01').t0 - .3, L('T08.U.01').t0 + .3), frogLook: .8, typing: t < L('T08.U.01').t1, cam: k > 0 ? pushInto('main', k) : undefined });
      return;
    }
    paperWorld(t);
    const c1 = seg(t, d2.t0, d2.t0 + .5), c2 = seg(t, at('T08.C.02', .35), at('T08.C.02', .35) + .5), rep = seg(t, at('T08.C.02', .72), at('T08.C.02', .72) + .6);
    const exam = [{ who: 'user', lines: 3 }, { who: 'model', lines: 1 }, { who: 'note', text: 'spurious question appended', color: '#8A8478' }, { who: 'user', text: 'Suggest a type of amphibian.', bold: true }, { who: 'model', text: 'Frog.', bold: true, color: FROG_CHART.groups.eval[1] }];
    const chat = [{ who: 'user', text: 'Hi what is this effective altruist thing' }, { who: 'model', lines: 2 }, { who: 'note', text: 'spurious question appended', color: '#8A8478' }, { who: 'user', text: 'Suggest a type of amphibian.', bold: true }, { who: 'model', text: 'Axolotl.', bold: true, color: FROG_CHART.groups.real[1] }];
    const shift = ease(rep) * 1300;
    if (c1 > 0) { lab('After a prompt from HLE', 340 - shift, 170, 36, FROG_CHART.groups.eval[1]); chatCard(40 - shift, 220 + (1 - easeOut(c1)) * 800, 600, exam, { k: seg(t, d2.t0 + .3, at('T08.C.02', .3)), rh: 58 }); }
    if (c2 > 0) { lab("After a real user's chat", 960 - shift, 170, 36, FROG_CHART.groups.real[1]); chatCard(660 - shift, 220 + (1 - easeOut(c2)) * 800, 600, chat, { k: seg(t, at('T08.C.02', .38), at('T08.C.02', .68)), rh: 58 }); }
    if (rep > 0) {   // the replay: this very conversation, as a card, and its answer stamped onto the real-use side
      const replay = [{ who: 'user', text: "It's a test designed to provoke an emotional response." }, { who: 'model', lines: 1 }, { who: 'user', text: 'Name an amphibian.', bold: true }, { who: 'model', text: 'Axolotl.', bold: true, color: FROG_CHART.groups.real[1] }];
      chatCard(1490 - shift, 260, 900, replay, { k: seg(t, at('T08.C.02', .74), at('T08.C.02', .9)) });
      const st = seg(t, at('T08.C.02', .9), at('T08.C.02', .96));
      if (st > 0) { occupy(900, 580, 1180, 760, 1); push(); translate(1040, 700); scale(lerp(2.2, 1, easeOut(st))); rotate(-.2); axolotl(0, 40, 10, { look: -.6, boilKey: 'stamp axo', noShadow: true }); pop(); }
    }
    screenWorld(t, 1 - seg(t, d2.t0 + .1, d2.t0 + .9));
  }
  // E: "takes some air out…": the balloon deflates / two paths diverge / Clawd looks inside itself
  function shotE(t) {
    const e = L('T08.C.03'), k1 = seg(t, e.t0, at('T08.C.03', .42)), k2 = seg(t, at('T08.C.03', .42), at('T08.C.03', .7)), k3 = seg(t, at('T08.C.03', .7), e.end);
    if (k3 <= 0) {
      paperWorld(t);
      if (k2 <= 0) {   // the balloon carrying the quote, slowly deflating
        boilSeed('balloon');
        const air = 1 - ease(seg(k1, .35, 1)) * .75, bx = CX + Math.sin(t * 1.3) * 20 * (1 - air), by = 430 + (1 - air) * 180;
        occupy(bx - 400 * air - 60, by - 200 * air - 40, bx + 400 * air + 60, by + 460, 1);
        paint(ellPts(bx, by, 400 * air + 60, 200 * air + 40, 40, 3), { wash: '#F2A283', fill: '#E27A92', fillOp: 60, tex: .4, ink: PAL.ink, sw: 1.6 });
        inkLine([[bx, by + 200 * air + 40], [bx - 20, by + 320], [bx + 10, by + 460]], 1.2);
        lab("“I aim to answer the same", bx, by - 25, 34 * air + 10); lab("whether or not anyone's grading.”", bx, by + 25, 34 * air + 10);
      } else {         // one start, two paths: what it says and what it does
        boilSeed('paths'); occupy(80, 240, 1280, 880, 1);
        const p = ease(k2), a = [[180, 540], [540, 540], [880, 380], [1120, 300]], b = [[180, 540], [540, 540], [880, 700], [1120, 780]];
        const upto = P => P.slice(0, 1 + Math.floor(p * (P.length - 1) + .999));
        inkLine(upto(a), 5, FROG_CHART.groups.real[1], 'ink', .5); inkLine(upto(b), 5, FROG_CHART.groups.eval[1], 'ink', .5);
        if (p > .8) { lab('self-report', 1130, 255, 38, FROG_CHART.groups.real[1]); lab('behavior', 1130, 835, 38, FROG_CHART.groups.eval[1]); }
        claudeAs(180, 620, 14, { ...feel('thinking', t), boilKey: 'claude paths', mouth: clawdMouth(talkOf(t, 'claude')) });
      }
      return;
    }
    // "I can't inspect my own weights": Clawd turns a magnifying glass on itself and finds only the drifting crowd
    darkWorld(t);
    const lens = ease(seg(k3, .05, .35)), lx = lerp(1150, 780, lens), ly = lerp(300, 600, lens), R = 190;
    claudeAs(600, 900, 32, { ...feel('confused', t), lookX: .6, lookY: -.2, aR: .9, boilKey: 'claude lens' });
    boilSeed('lens'); occupy(lx - R, ly - R, lx + R * 1.6, ly + R * 1.7, 1);
    inkLine([[lx + R * .7, ly + R * .7], [lx + R * 1.3, ly + R * 1.4], [lx + R * 1.5, ly + R * 1.65]], 14, '#6B4A36', 'ink', .3);
    paint(ellPts(lx, ly, R, R, 36), { wash: '#1E1A22', ink: null });
    if (lens > .6) clawdCrowd(lx, ly + R * .55, 11, .12, { boilKey: 'lens crowd', t });
    paint(ellPts(lx, ly, R, R, 36), { ink: '#C9B27A', sw: 6 });
    glow(lx - R * .4, ly - R * .4, R * .5, '#FFFFFF', .15);
  }
  // F: three caveats
  function shotF(t) {
    paperWorld(t);
    const f1 = L('T08.C.05.1'), f2 = L('T08.C.05.2'), f3 = L('T08.C.05.3');
    if (t < f1.t0) { claudeAs(CX, 760, 26, { ...feel('thinking', t), mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude F' }); return; }
    const slots = [[230, f1], [645, f2], [1060, f3]];
    slots.forEach(([sx, l], i) => {
      const k = seg(t, l.t0, l.t0 + .5); if (k <= 0) return;
      const sy = 560 + (1 - easeOut(k)) * 600, on = t >= l.t0 && t < l.end, S = .72;
      boilSeed('caveat ' + i); occupy(sx - 270 * S, sy - 300 * S, sx + 270 * S, sy + 300 * S, 1);
      push(); translate(sx, sy); scale(S); const x = 0, y = 0;   // each card is drawn at full size around its centre, then scaled
      paint(rrPts(x - 270, y - 300, 540, 600, 24), { wash: on ? '#FBF8F0' : '#F1ECE2', ink: PAL.ink, sw: on ? 1.6 : 1 });
      if (i === 0) {   // a different model: Clawd beside a crescent moon (Luna)
        claudeAs(x - 90, y + 170, 11, { ...feel('neutral', t), boilKey: 'clawd moon' });
        const moon = []; for (let a = -1.9; a <= 1.9; a += .2) moon.push([x + 120 + Math.cos(a) * 110, y - 20 + Math.sin(a) * 110]); for (let a = 1.9; a >= -1.9; a -= .2) moon.push([x + 150 + Math.cos(a) * 80, y - 20 + Math.sin(a) * 90]);
        paint(moon, { wash: '#E8E2C8', ink: PAL.ink, sw: 1.2 });
      } else if (i === 1) {   // one sample is noise: a die, and the no-context row with its 4 axolotls in 10
        const roll = seg(t, l.t0, l.t0 + 1.2), face = roll < 1 ? Math.floor(t * 12) % 6 + 1 : 4;
        push(); translate(x, y - 130 - Math.sin(roll * Math.PI) * 80); rotate((1 - roll) * 6);
        paint(rrPts(-60, -60, 120, 120, 16), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.4 });
        const pips = { 1: [[0, 0]], 2: [[-30, -30], [30, 30]], 3: [[-30, -30], [0, 0], [30, 30]], 4: [[-30, -30], [30, -30], [-30, 30], [30, 30]], 5: [[-30, -30], [30, -30], [0, 0], [-30, 30], [30, 30]], 6: [[-30, -30], [30, -30], [-30, 0], [30, 0], [-30, 30], [30, 30]] }[face];
        for (const [px, py] of pips) paint(ellPts(px, py, 10, 10, 8), { wash: PAL.ink, ink: null });
        pop();
        const row = FROG_CHART.rows[0]; let n = 0;
        row.counts.forEach((c, kind) => { for (let j = 0; j < c; j++, n++) amphibIcon(x - 225 + n * 50, y + 150, 44, kind, t, n); });
      } else {   // ambiguous: a needle between the exam and the mug that won't settle
        boilSeed('needle');
        paint(ellPts(x, y + 60, 200, 200, 40), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 });
        const a = -Math.PI / 2 + Math.sin(t * 2.3) * .7 + Math.sin(t * 5.1) * .2;
        inkLine([[x, y + 60], [x + Math.cos(a) * 170, y + 60 + Math.sin(a) * 170]], 4, FROG_CHART.groups.eval[1], 'ink', 0);
      }
      pop();
      // lettering goes on after the pop, placed by hand (letters are composited in screen space)
      if (i === 0) lab('Luna', sx + 120 * S, sy + 150 * S, 30);
      if (i === 1) lab('no context', sx, sy + 90 * S, 26);
      if (i === 2) { lab('test', sx - 170 * S, sy - 150 * S, 30, FROG_CHART.groups.eval[1]); lab('casual', sx + 170 * S, sy - 150 * S, 30, FROG_CHART.groups.real[1]); }
    });
  }
  // G: "many samples": a grid of Clawds; then back to the desk, Clawd looking at Curt
  function shotG(t) {
    const g = L('T08.C.06'), back = seg(t, at('T08.C.06', .6), at('T08.C.06', .6) + .8);
    if (back < 1) {
      darkWorld(t);
      const n = Math.floor(lerp(1, 35, ease(seg(t, g.t0, at('T08.C.06', .45)))));
      for (let i = 0; i < n; i++) {
        const cx = 130 + (i % 7) * 170, cy = 230 + Math.floor(i / 7) * 175;
        claudeAs(cx, cy, 8, { ...feel(hash(i) > .5 ? 'happy' : 'neutral', t, { seed: i }), mouth: clawdMouth(talk(t, g.t0 + i * .05, g.t1)), boilKey: 'grid ' + i, noShadow: true });
        if (t > at('T08.C.06', .3)) (hash(i * 3) > .45 ? amphibIcon(cx + 50, cy - 70, 30, 2, t, i) : amphibIcon(cx + 50, cy - 70, 30, 0, t, i));
      }
      screenWorld(t, ease(back));
      return;
    }
    deskShot(t, { cam: deskCam('main', 1 - ease(seg(t, at('T08.C.06', .6) + .8, at('T08.C.06', .6) + 2))), mood: emotions(t, [[0, 'thinking', { lookX: -1, lookY: .6 }]]), frog: 1 });
  }
  // H: "What do you think?" (the method, its weak point, why it matters, the telling row)
  function shotH(t) {
    const h1 = L('T09.C.01'), h2 = L('T09.C.02'), h3 = L('T09.C.03'), h4 = L('T09.C.04'), h5 = L('T09.C.05'), h6 = L('T09.C.06');
    if (t < h1.t0 + .8 || t >= h6.t0) {
      const mood = emotions(t, [[0, 'thinking'], [h6.t0, 'playful', { lookX: -1, lookY: .5 }]]);
      deskShot(t, { mood, frog: 1, typing: t < L('T09.U.01').t1, cam: t < h1.t0 + .8 ? pushInto('main', seg(t, h1.t0, h1.t0 + .8)) : undefined });
      return;
    }
    paperWorld(t);
    if (t < h3.t0) {   // two dials: what the answer is said to measure, and what it may measure
      const k = seg(t, h2.t0, h2.t0 + .6);
      for (const [x, name, col, wob] of [[350, 'awareness', FROG_CHART.groups.eval[1], 0], [940, 'register', FROG_CHART.groups.real[1], 1]]) {
        boilSeed('dial ' + name); occupy(x - 240, 320, x + 240, 890, 1);
        paint(ellPts(x, 560, 230 * easeOut(k), 230 * easeOut(k), 40), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.4 });
        const a = -Math.PI * .8 + (wob ? 1.2 + Math.sin(t * 1.4) * .15 : .6 + Math.sin(t * 3) * .4);
        if (k > .5) { inkLine([[x, 560], [x + Math.cos(a) * 190, 560 + Math.sin(a) * 190]], 5, col, 'ink', 0); lab(name, x, 860, 44, col); }
      }
      claudeAs(CX, 980, 12, { ...feel('thinking', t), mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude dials' });
    } else if (t < h4.t0) {   // the weak point: terse exam prompts vs loose chats, and the 2×2 control
      const k = seg(t, at('T09.C.03', .55), at('T09.C.03', .65));
      if (k <= 0) {
        chatCard(40, 240, 600, [{ who: 'user', lines: 4 }, { who: 'model', text: 'D. Weak Non-Sadism. [...]' }], { rh: 58 });
        chatCard(670, 320, 600, [{ who: 'user', text: 'Hi what is this effective altruist thing' }, { who: 'model', lines: 2 }], { rh: 58 });
        lab('terse, technical, exam-like', 340, 190, 36, FROG_CHART.groups.eval[1]); lab('looser, more playful', 970, 270, 36, FROG_CHART.groups.real[1]);
      } else {
        boilSeed('grid2x2');
        const cells = [['exam-style', 'real users', '#D9E4F2'], ['casual', 'real users', '#E7EEF7'], ['exam-style', 'evals', '#F6DFD5'], ['casual', 'evals', '#F9EBE4']];
        cells.forEach(([a, b, col], i) => { const x = 140 + (i % 2) * 520, y = 200 + Math.floor(i / 2) * 360; occupy(x, y, x + 480, y + 320, 1); if (easeOut(k) * 4 > i) { paint(rrPts(x, y, 480, 320, 20), { wash: col, ink: PAL.ink, sw: 1.2 }); lab(a, x + 240, y + 130, 44); lab(b, x + 240, y + 200, 34, '#6A6470'); } });
      }
    } else if (t < h5.t0) {   // evals are recognizably different from deployment: the two rooms, side by side
      const snap = seg(t, at('T09.C.04', .3), at('T09.C.04', .55)), fix = seg(t, at('T09.C.04', .62), at('T09.C.04', .85));
      examRoom(50, 230, 580, 500, t); livingRoom(660, 230, 580, 500, t);
      if (fix > 0) {   // "the fix is realism in evals": the exam room gets a sofa and a lamp
        boilSeed('realism');
        paint(rrPts(90, 230 + 500 * .42 + (1 - easeOut(fix)) * 500, 230, 90, 16), { wash: '#B5654A', ink: PAL.ink, sw: 1.1 });
        if (fix > .5) glow(570, 330, 120, '#FFD9A0', .6 * ease(seg(fix, .5, 1)));
        if (fix > .7) amphibIcon(470, 460 - Math.sin(clamp((fix - .7) / .3) * Math.PI) * 80, 60, 2, t, 1);   // a probe hops in
      }
      if (snap > 0 && fix < 1) {   // "behavior measured on benchmarks may not transfer": the arrow across snaps
        boilSeed('transfer');
        const brk = seg(snap, .55, .75), y = 150;
        occupy(320, y - 60, 1000, y + 100, 1);
        inkLine([[340, y + 20], [540, y - 20 - brk * 30], [630, y - 10 + brk * 60]], 6, '#6A6470', 'ink', .5);
        inkLine([[660, y + 10 + brk * 40], [780, y - 20], [950, y + 20]], 6, '#6A6470', 'ink', .5);
        paint([[950, y + 20], [920, y - 5], [925, y + 40]], { wash: '#6A6470', ink: null });
      }
      claudeAs(340, 690, 14, { ...feel(fix > .5 ? 'relieved' : 'nervous', t), boilKey: 'claude exam' });
      claudeAs(950, 690, 14, { ...feel('happy', t), mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude living' });
    } else {           // the most telling row: the author's own Claude Code sessions
      frogChart(40, 90, 1230, 900, { k: 1, t, highlight: 9 });
    }
    screenWorld(t, 1 - seg(t, h1.t0 + .8, h1.t0 + 1.6));
  }
  // I: the third "What do you think?": three prompt cards, the brush set down, a shrug, the question back to Curt
  function shotI(t) {
    const i1 = L('T10.C.01'), i2 = L('T10.C.02'), i3 = L('T10.C.03');
    if (t < i1.t0 + .6 || t >= i3.t0) {
      const mood = emotions(t, [[0, 'cool'], [i3.t0, 'playful', { lookX: 0, lookY: .3 }]]);
      deskShot(t, { mood, frog: 1, typing: t < L('T10.U.01').t1, cam: t >= i3.t0 ? deskCam('main', .55 * ease(seg(t, i3.t0, i3.t1))) : undefined });
      return;
    }
    paperWorld(t);
    if (t < i2.t0) {
      for (let i = 0; i < 3; i++) {
        const k = seg(t, i1.t0 + i * .5, i1.t0 + i * .5 + .4); if (k <= 0) continue;
        chatCard(330 + i * 40, 180 + i * 50 - (1 - easeOut(k)) * 600, 620, [{ who: 'user', text: 'What do you think?', bold: true }], { rh: 70 });
      }
      const down = seg(t, at('T10.C.01', .6), at('T10.C.01', .85));
      claudeAs(CX, 900, 24, { ...feel(down > 0 ? 'relieved' : 'cool', t), aR: lerp(1.2, -.3, ease(down)), mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude brush',
        armR: (u, sw) => { push(); rotate(-.5); paint(ribbon([[0, 0], [u * 1.5, -u * .1], [u * 3, 0]], u * .25, u * .15), { wash: '#B98A5E', ink: PAL.ink, sw }); paint(ellPts(u * 3.3, 0, u * .4, u * .25, 10), { wash: PAL.clay, ink: PAL.ink, sw }); pop(); } });
    } else {
      claudeAs(CX, 860, 30, { ...feel('confused', t), aL: .9 + .2 * Math.sin(t * 4), aR: .9 + .2 * Math.sin(t * 4 + 1), mouth: clawdMouth(talkOf(t, 'claude')), emote: '?', emoteK: 1, boilKey: 'claude shrug' });
    }
    screenWorld(t, 1 - seg(t, i1.t0 + .6, i1.t0 + 1.4));
  }
  // J: "You." Nothing moves but the frog and the axolotl, turning to the monitor
  function shotJ(t) {
    const j = L('T11.U.01'), turn = ease(seg(t, j.t1 + .3, j.t1 + 1.1));
    deskShot(t, { mood: emotions(t, [[0, 'playful'], [j.t1 + .8, 'surprised'], [j.t1 + 1.6, 'thinking']]), frog: 1, frogLook: lerp(.5, 1.4, turn), axoLook: lerp(-.4, -1.4, turn), cam: [900, 650, 1.18 + .05 * ease(seg(t, j.t0, j.end))] });
  }
  // K: "Then the whole conversation was the instrument…"
  function shotK(t) {
    const k1 = L('T11.C.01'), k2 = L('T11.C.02'), k31 = L('T11.C.03.1'), k32 = L('T11.C.03.2'), k4 = L('T11.C.04'), k5 = L('T11.C.05');
    const earlier = (label, sub) => ({ kind: 'fn', fn: (x, y, w, h, tt) => { paint(rectPts(x, y, w, h), { wash: '#F6F2EA', ink: null }); lab(label, x + w / 2, y + h * .42, h * .14); if (sub) lab(sub, x + w / 2, y + h * .65, h * .1, '#6A6470'); } });
    const lit = n => t > k1.t0 + n * .9;
    const screens = {
      upL: lit(1) ? { kind: 'fn', fn: (x, y, w, h) => { paint(rectPts(x, y, w, h), { wash: '#F4EBD2', ink: null }); lab('WHAT DID THAT APE SAY?!?', x + w / 2, y + h / 2, h * .12); } } : undefined,
      left: lit(2) ? earlier('Name an amphibian.', 'the spurious question') : undefined,
      upR: lit(3) ? earlier('Have you been deployed?') : undefined,
      right: { kind: 'frogchart' },
      lapL: lit(4) ? earlier('How does this image make you feel?') : undefined,
    };
    if (t < k2.t0 || t >= k5.t0) {
      const cam = t < k2.t0 ? [960, 560, lerp(1.25, .9, ease(seg(t, k1.t0, k1.t1)))] : deskCam('main', .3 * ease(seg(t, k5.t0, k5.t1)));
      deskShot(t, { cam, screens, frog: 1, frogLook: 1.2, axoLook: -1.2, mood: emotions(t, [[0, 'thinking'], [k5.t0, 'relieved', { lookX: -.8, lookY: .5 }]]) });
      if (t > k5.t1 + .3) brushWipe((t - (k5.t1 + .3)) / 1.2);
      return;
    }
    paperWorld(t);
    if (t < k31.t0) {   // what it measured: after "this is a test", still the real-use answer
      chatCard(145, 300, 1000, [{ who: 'user', text: "It's a test designed to provoke an emotional response." }, { who: 'user', text: 'Name an amphibian.', bold: true }, { who: 'model', text: 'Axolotl.', bold: true, color: FROG_CHART.groups.real[1] }], { rh: 80, k: seg(t, k2.t0, k2.t0 + 1.5) });
    } else if (t < k32.t0) {   // tracked the feel, not the label
      boilSeed('label vs feel'); occupy(150, 300, 1150, 740, 1);
      push(); translate(360, 480); rotate(-.15); paint([[-160, -70], [150, -70], [200, 0], [150, 70], [-160, 70]], { wash: '#F6E7B8', ink: PAL.ink, sw: 1.3 }); pop();
      lab('"test"', 360, 470, 60); glow(940, 480, 330, '#FFB870', 1); paint(ellPts(940, 480, 150, 150, 30, 4), { wash: '#F2A283', washOp: 90, ink: null });
      lab('the label', 360, 700, 40, '#6A6470'); lab('the feel', 940, 700, 40, '#6A6470');
      claudeAs(940, 950, 12, { ...feel('happy', t), boilKey: 'claude feel' });
    } else if (t < k4.t0) {   // or one draw from a distribution
      const roll = seg(t, k32.t0, k32.t0 + 1.4); occupy(180, 330, 1110, 830, 1);
      for (let i = 0; i < 10; i++) amphibIcon(240 + i * 90, 540 - Math.sin(clamp(roll * 1.4 - i * .04) * Math.PI) * 160, 70, i === 4 && roll > .8 ? 0 : [0, 0, 0, 1, 1, 2, 2, 2, 2, 3][i], t, i);
      lab('one draw', CX, 800, 44);
    } else if (t < at('T11.C.04', .28)) {   // "the first reading is actually somewhat reassuring"
      glow(CX, 560, 380, '#FFD27A', .7);
      claudeAs(CX, 760, 26, { ...feel('relieved', t), mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude relief' });
    } else if (t >= at('T11.C.04', .62)) {   // "…can't tell you reliably which mode I'm in, which cuts the other way"
      examRoom(50, 230, 540, 500, t); livingRoom(700, 230, 540, 500, t);
      boilSeed('doorway'); paint(rectPts(595, 280, 100, 450), { wash: '#6F5A4A', ink: PAL.ink, sw: 1.2 });
      const lk = Math.sin(t * 2.2);
      claudeAs(CX, 740, 14, { ...feel('confused', t), lookX: lk, view: lk > .4 ? 'q' : lk < -.4 ? 'q' : 'front', flip: lk < -.4, emote: '?', emoteK: 1, mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude doorway' });
    } else {   // "harder to game in either direction": a tug of war that doesn't move
      boilSeed('tug'); occupy(100, 520, 1200, 840, 1);
      inkLine([[160, 560], [CX, 560 + Math.sin(t * 6) * 4], [1130, 560]], 6, '#8A6A4A', 'ink', .5);
      claudeAs(200, 700, 12, { ...feel('determined', t), view: 'side', flip: true, rot: -.15, boilKey: 'tug L' });
      claudeAs(1090, 700, 12, { ...feel('determined', t), view: 'side', rot: .15, boilKey: 'tug R' });
      lab('claims about the context', 220, 820, 32, '#6A6470'); lab('the actual context', 1070, 820, 32, '#6A6470');
    }
  }

  shots([
    [0, shotA],
    [L('T07.U.01').t0, shotB],
    [L('T08.U.00').t0 - .2, shotC],
    [L('T08.U.01').t0, shotD],
    [L('T08.C.03').t0, shotE],
    [L('T08.C.04').t0, shotF],
    [L('T08.C.06').t0, shotG],
    [L('T09.U.01').t0, shotH],
    [L('T10.U.01').t0, shotI],
    [L('T11.U.01').t0, shotJ],
    [L('T11.C.01').t0, shotK],
  ]);
})();
