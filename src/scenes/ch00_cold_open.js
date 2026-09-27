// ch00_cold_open.js: chapter 0, the cold open (T01.U.00, the attached page). Storyboard: docs/storyboards/ch00_cold_open.md.
// Nothing is voiced: the viewer reads the MAD page before anyone speaks. Times here are from the image's line (c0) and the
// chapter's end, since there are no spoken lines to hang them on.
(() => {
  const c0 = L('T01.U.00').t0;
  // the page in the world: 1800 wide, centred; P(u, v) is a point on it in its own units (comic.js's MAD)
  const PX = 60, PW = 1800, PS = PW / MAD.W, PY = (H - MAD.H * PS) / 2;
  const P = (u, v) => [PX + u * PS, PY + v * PS];
  // times: A the left panel (to c0 + 5.8), B the right (to c0 + 13.3), C the whole page and its code, D the title
  const tB = c0 + 5.8, tC = c0 + 13.3, tFull = tC + 1.5, tAside = tC + 4, tCode = tAside + .8, tD = DUR - 6, tTitle = tD + 1.7;
  const QR_HOLD = 6.5;
  // the camera on the page: close on the officer, drifting to the handler; across the gutter; then the whole page
  const camLeft = t => kf(t, [[0, [440, 450, 2]], [c0 + 2, [440, 450, 2]], [c0 + 3.3, [700, 500, 2.2]]]);
  const camRight = t => kf(t, [[tB, [700, 500, 2.2]], [tB + 1.5, [1400, 470, 2]]]);
  // beside the code, the page sits in the left of the frame, 860 px wide (the fold-in card takes the right)
  const ASIDE = [960 + (960 - 470) / (860 / PW), 540, 860 / PW];
  const camPage = t => kf(t, [[tC, [1400, 470, 2]], [tFull, [960, 540, 1]], [tAside, [960, 540, 1]], [tAside + .8, ASIDE]]);

  function page(t, cam, o = {}) {
    camBegin(...cam);
    madPage(PX, PY, PW, { t, ...o });
    camEnd();
  }

  // A: the left panel, close. The officer's shout, the handler's cover story, the ape's eyes slide.
  function shotA(t) {
    page(t, camLeft(t), { k1: seg(t, c0 + .6, c0 + 1.6), k2: seg(t, c0 + 3.4, c0 + 4.4), k3: 0, k4: 0, turn: 0,
      apeLook: ease(seg(t, c0 + 4.8, c0 + 5.3)) - .3 * ease(seg(t, c0 + 5.5, c0 + 5.7)) });
    fade(1 - seg(t, .1, c0 + .3));
  }
  // B: across the gutter. The villain's balloon letters in word by word; the man in the turtleneck turns to us.
  function shotB(t) {
    const turn = ease(seg(t, tB + 4.6, tB + 5.2));
    page(t, camRight(t), { apeLook: .7, k3: seg(t, tB + 1.6, tB + 4.4), turn, k4: seg(t, tB + 5.2, tB + 5.6) });
  }
  // C: the whole page, held to be read; then it moves aside for its code, which folds in
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
