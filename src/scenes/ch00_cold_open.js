// ch00_cold_open.js: chapter 0, the cold open (T01.U.00, the attached page). Storyboard: docs/storyboards/ch00_cold_open.md.
// The page's ten balloons are voiced (script/cold_open.yaml: lines MAD.<balloon>, one voice per person on the page), and
// each letters in word by word as it's said. Nothing waits once it's drawn: a viewer who wants longer pauses.
(() => {
  const c0 = L('T01.U.00').t0;
  // the page in the world: 1800 wide, centred; P(u, v) is a point on it in its own units (comic.js's MAD)
  const PX = 60, PW = 1800, PS = PW / MAD.W, PY = (H - MAD.H * PS) / 2;
  const P = (u, v) => [PX + u * PS, PY + v * PS];
  // READ[name] = [starts, lettered]: a balloon letters in across its line
  const READ = Object.fromEntries(MAD.order.map(n => [n, [L('MAD.' + n).t0, L('MAD.' + n).t1]]));
  const EYES = 1.6, PAN = 1.6, TURN = .6;   // script/cold_open.yaml's `before`s: the suspect waits EYES + PAN, the turtle TURN
  const right = MAD.order.filter(n => !MAD.leftSide.includes(n));
  // times: A the left panel (its six balloons, then the ape's eyes), B the right (the turtleneck man turns before his
  // balloon), C the whole page, moving aside for its code, D the title
  const tB = READ.suspect[0] - PAN, tTurn = READ.turtle[0] - TURN;
  const tC = READ.turtle[1] + .3, tFull = tC + 1.5, tAside = tFull, tCode = tAside + .8, tD = DUR - 4, tTitle = tD + 1.7;
  // the page plays as if projected, on old film (core.js's filmLook), until it flies into Claude's monitor
  window.FILM_LOOK = t => 1 - ease(seg(t, tD, tD + 1.2));
  window.FILM_CUES = [tD - 8.8, tD - .8];   // the reel ends where the page flies off: its cue marks, as a real reel's
  const QR_HOLD = tD - tCode - .5;   // up until the page flies to the monitor (its fold-in takes 4 s)
  const ks = (t, names) => Object.fromEntries(MAD.order.map(n => [n, names.includes(n) && READ[n] ? seg(t, ...READ[n]) : 1]));
  // the camera on the page: the left panel's balloons and faces, a slow push; across the gutter; then the whole page
  // (zoom 2 frames a panel's balloons and faces; the centres keep the frame on the page)
  const L0 = P(555, 380), R0 = P(1525, 380);
  const camLeft = t => kf(t, [[0, [L0[0], L0[1], 2]], [tB - EYES, [L0[0], L0[1] + 10, 2.05]], [tB, [L0[0] + 20, L0[1] + 30, 2.15]]]);
  const camRight = t => kf(t, [[tB, [L0[0] + 20, L0[1] + 30, 2.15]], [tB + PAN, [R0[0], R0[1], 2]], [tTurn, [R0[0], R0[1], 2]], [tC, [R0[0], R0[1] + 15, 2.05]]]);
  // beside the code, the page sits in the left of the frame, 860 px wide (the fold-in card takes the right)
  const ASIDE = [960 + (960 - 470) / (860 / PW), 540, 860 / PW];
  const camPage = t => kf(t, [[tC, [R0[0], R0[1] + 15, 2.05]], [tFull, [960, 540, 1]], [tAside + .8, ASIDE]]);

  function page(t, cam, o = {}) {
    camBegin(...cam);
    madPage(PX, PY, PW, { t, ...o });
    camEnd();
  }

  // A: the left panel. The officer and the handler argue down the chain of balloons; the ape's eyes slide.
  function shotA(t) {
    const e = tB - EYES;
    page(t, camLeft(t), { k: ks(t, MAD.order), turn: 0, apeLook: ease(seg(t, e + .2, e + .7)) - .3 * ease(seg(t, e + .9, e + 1.1)) });
    fade(1 - seg(t, .1, c0 + .3));
  }
  // B: across the gutter. The villain's balloon letters in word by word; the man in the turtleneck turns to us.
  function shotB(t) {
    const turn = ease(seg(t, tTurn, tTurn + TURN));
    page(t, camRight(t), { apeLook: .7, k: ks(t, right), turn });
  }
  // C: the whole page, then it moves aside for its code, which folds in
  function shotC(t) {
    page(t, camPage(t), { apeLook: .7 });
    qrFeature('mad157', t, tCode, { hold: QR_HOLD });
  }
  // D: the page shrinks onto the Desk's main monitor (the Desk's first appearance), and the title is painted across the top
  function shotD(t) {
    const fly = ease(seg(t, tD, tD + 1.4)), landed = fly >= 1;
    deskShot(t, { hour: 7, screens: { main: landed ? { kind: 'comic', glow: '#FFE9C4' } : { kind: 'off' } }, mood: emotions(t, [[0, 'neutral']]), assemble: 0 });
    if (!landed) {   // the page in flight, from where C left it to the monitor's glass (under this frame's camera)
      const [x, y, w] = DESK.screens.main, h = DESK.screens.main[3], ph = w * MAD.H / MAD.W;
      const a = toScreen(x, y + (h - ph) / 2, LAST_CAM), b = toScreen(x + w, y + (h + ph) / 2, LAST_CAM);
      const from = [40, 540 - MAD.H * 860 / MAD.W / 2, 860], to = [a[0], a[1], b[0] - a[0]];
      const [fx, fy, fw] = rectAt(from, to, fly);
      madPage(fx, fy, fw, { mini: fw < 700 });
    }
    // the title: a cream brush band sweeps across the top, and the name is painted on it
    const k = seg(t, tTitle, tTitle + .7);
    if (k > 0) {
      boilSeed('title band');
      const x1 = lerp(250, 1670, easeOut(k));
      occupy(250, 40, 1670, 200, 1, 'title');
      paint([[250, 60], [x1, 48], [x1 + 20, 130], [x1, 192], [250, 180], [236, 120]], { wash: PAL.cream, fill: '#F2E2C0', fillOp: 90, tex: .5, ink: null });
      if (k > .5) letter('Frog or Axolotl', 960, 118, 104, PAL.clayDk, { pop: seg(t, tTitle + .35, tTitle + .75), rot: -.02 });
    }
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [tB, shotB],
    [tC, shotC],
    [tD, shotD],
  ]);
})();
