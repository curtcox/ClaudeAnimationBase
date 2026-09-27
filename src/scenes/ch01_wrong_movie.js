// ch01_wrong_movie.js: chapter 1 (T01–T05). Storyboard: docs/storyboards/ch01_wrong_movie.md.
// Every time comes from a line id or a phrase in it (atWord), so the shots follow the voice when it replaces the estimates.
(() => {
  const HOUR = 7;
  // Inside the monitors, content stays left of CW, keeping a clear column on the right for reference codes. CX is the
  // content's centre.
  const CW = 1290, CX = CW / 2;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const BASE = { upR: { kind: 'code', speed: 1.3 }, left: { kind: 'comic' } };

  // ---------- the comic, seen through the left of the frame ----------
  // The page lies where ch 0 put it (1800 wide, centred). cam = [cx, cy, zoom] centres the world point (cx, cy) in the
  // content column; a mat covers the column on the right.
  const PX = 60, PW = 1800, PS = PW / MAD.W, PY = (H - MAD.H * PS) / 2;
  const P = (u, v) => [PX + u * PS, PY + v * PS];
  function comicWindow(t, cam, o = {}, over) {
    const [cx, cy, z] = cam;
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#DCD2BE', ink: null });
    camBegin(cx + (W / 2 - CX) / z, cy, z);
    const n0 = OCC.length, l0 = LETTERS.length;
    madPage(PX, PY, PW, { t, apeLook: .7, ...o });
    for (let i = n0; i < OCC.length; i++) OCC[i][2] = Math.min(OCC[i][2], CW);   // the mat hides the rest of the page,
    LETTERS = LETTERS.slice(0, l0).concat(LETTERS.slice(l0).filter(L => L.x < CW - 60));   // its lettering too
    camEnd();
    if (over) over(t);
    if (o.tint) { boilSeed('cool'); paint(rectPts(0, 0, CW, H), { wash: '#6C86B8', washOp: 70 * o.tint, ink: null }); }
    comicMat();
  }
  function comicMat() {
    boilSeed('comic mat');
    paint(rectPts(CW, -40, W - CW + 40, H + 80), { wash: '#E6DCC8', fill: '#D8CCB2', fillOp: 60, tex: .5, ink: null });
    inkLine([[CW, -20], [CW, H + 20]], 2);
  }
  // the ape's face and the villain's balloon, as world points (for the cameras)
  const APE = P(...MAD.faces.ape), VILLAIN_BOX = P(1590, 255), RIGHT = P(1545, 520);

  // ---------- painters for the cutaways ----------
  // a 1972 film-poster pastiche for the upper monitor: an ape silhouette raising a fist against a red sky (no likeness)
  const poster = (x, y, w, h) => {
    paint(rectPts(x, y, w, h), { wash: '#B8322A', fill: '#E0713A', fillOp: 120, tex: .4, ink: null });
    glow(x + w * .5, y + h * .85, w * .5, '#FFB060', .6);
    const cx = x + w * .5, gy = y + h;
    paint([[cx - w * .16, gy], [cx - w * .12, y + h * .5], [cx - w * .05, y + h * .38], [cx + w * .05, y + h * .38], [cx + w * .12, y + h * .5], [cx + w * .16, gy]], { wash: '#1E1418', ink: null });
    paint(ellPts(cx, y + h * .3, w * .065, h * .12, 14), { wash: '#1E1418', ink: null });
    paint(ribbon([[cx + w * .1, y + h * .45], [cx + w * .16, y + h * .28], [cx + w * .17, y + h * .12]], w * .04, w * .03), { wash: '#1E1418', ink: null });
    paint(ellPts(cx + w * .17, y + h * .1, w * .035, h * .06, 10), { wash: '#1E1418', ink: null });
  };
  // a theatre's proscenium in screen space over [0, CW]: red velvet curtains and a valance slide in with k; glass across
  function proscenium(t, k, glass = 0) {
    if (k <= 0) return;
    boilSeed('proscenium');
    const cw = 150 * easeOut(k);
    for (const [x0, d] of [[0, 1], [CW, -1]]) {
      const x1 = x0 + d * cw;
      paint([[x0, -20], [x1, -20], [x1 - d * 20, H * .5], [x1, H + 20], [x0, H + 20]], { wash: '#8E1E24', fill: '#5E1016', fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.2 });
      for (let i = 1; i < 4; i++) inkLine([[x0 + d * cw * i / 4, 0], [x0 + d * cw * i / 4 - d * 8, H * .5], [x0 + d * cw * i / 4, H]], 1.2, '#4A0A10', 'ink', .5);
    }
    paint([[0, -20], [CW, -20], [CW, 60 * easeOut(k)], [CW * .75, 80 * easeOut(k)], [CW * .5, 60 * easeOut(k)], [CW * .25, 80 * easeOut(k)], [0, 60 * easeOut(k)]], { wash: '#8E1E24', ink: PAL.ink, sw: 1.2 });
    inkLine([[0, 64 * easeOut(k)], [CW * .25, 84 * easeOut(k)], [CW * .5, 64 * easeOut(k)], [CW * .75, 84 * easeOut(k)], [CW, 64 * easeOut(k)]], 4, '#D9A441', 'ink', .5);
    if (glass > 0) for (let i = 0; i < 3; i++) {   // a sheet of glass across the front: pale diagonal glints
      const gx = 260 + i * 330;
      paint([[gx, 120], [gx + 70, 120], [gx - 180, H - 60], [gx - 250, H - 60]], { wash: '#FFFFFF', washOp: 50 * glass, ink: null });
    }
  }
  // the magician's assistant turning to the audience and explaining the trick
  function magicStage(t, turn, point) {
    boilSeed('stage');
    paint(rectPts(-40, -40, CW + 40, H + 80), { wash: '#2A1E26', ink: null });
    glow(CX, 520, 520, '#FFE0A0', .55);
    paint([[0, 800], [CW, 800], [CW, H + 40], [0, H + 40]], { wash: '#6B4A36', fill: '#553A2A', fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.2 });
    occupy(250, 380, 1150, 1000, 1, 'stage');
    // the magician's box on its table, its hidden compartment's flap open
    paint(rectPts(360, 700, 560, 30), { wash: '#3A2A30', ink: PAL.ink, sw: 1.2 });
    for (const lx of [390, 870]) paint(rectPts(lx, 730, 22, 80), { wash: '#3A2A30', ink: PAL.ink, sw: 1 });
    paint(rectPts(380, 520, 520, 180), { wash: '#C9A441', fill: '#9C7A2A', fillOp: 70, tex: .4, ink: PAL.ink, sw: 1.4 });
    for (const sx of [540, 720]) inkLine([[sx, 510], [sx, 710]], 2.4, '#5A4020', 'ink', 0);
    paint(rectPts(560, 560, 140, 120), { wash: '#15131A', ink: PAL.ink, sw: 1 });                                   // the compartment
    paint([[560, 680], [700, 680], [720, 740], [540, 740]], { wash: '#E0C070', ink: PAL.ink, sw: 1 });                // its flap, down
    paint(ellPts(630, 630, 34, 22, 12), { wash: '#E8C4A0', ink: PAL.ink, sw: .8 });                                    // someone folded up inside
    // the magician behind, top hat, aghast
    paint(rectPts(960, 350, 130, 320), { wash: '#1E1A22', ink: PAL.ink, sw: 1.2 });
    madHead(1025, 300, 48, { shout: .8, turn: .6, look: -.8 });
    paint(rectPts(985, 180, 80, 90), { wash: '#15131A', ink: PAL.ink, sw: 1 }); paint(rectPts(965, 262, 120, 14), { wash: '#15131A', ink: PAL.ink, sw: 1 });
    // the assistant, turning from the box to us, then pointing at the compartment
    madBody(madReg, 270, 470, 150, 330, '#C9302C');
    for (let i = 0; i < 12; i++) paint(ellPts(220 + hash(i) * 100, 500 + hash(i + 9) * 280, 4, 4, 6), { wash: '#FFE9A0', ink: null });   // sequins
    madHead(270, 410, 50, { turn, look: lerp(1, 0, turn), smile: turn });
    const hand = [lerp(340, 540, ease(point)), lerp(560, 600, ease(point))];
    paint(ribbon([[320, 500], [lerp(330, 440, ease(point)), lerp(560, 560, point)], hand], 22, 14), { wash: '#E8C4A0', ink: PAL.ink, sw: 1 });
  }
  // an ape mask on a stick, thin as paper, light showing through it
  function apeMask(t, k) {
    paint(rectPts(-40, -40, CW + 40, H + 80), { wash: '#EFE6CF', fill: '#E2D5B6', fillOp: 60, tex: .5, ink: null });
    glow(CX + 40, 470, 360, '#FFF3C8', 1);
    const flutter = Math.sin(t * 2.3) * .05;
    occupy(CX - 240, 200, CX + 240, 1000, 1, 'mask');
    boilSeed('mask stick'); inkLine([[CX + 10, 700], [CX + 30, 1000]], 12, '#8A6A4A', 'ink', 0);
    paint(ellPts(CX + 34, 980, 40, 26, 12), { wash: '#E8C4A0', ink: PAL.ink, sw: 1 });   // the hand holding it up
    madApe(CX, 450 + (1 - easeOut(k)) * 600, 210, { body: false, op: 120, rot: flutter, look: .4, key: 'mask' });
  }
  // door contents (the four reasons)
  const doorArt = [
    (x, y, w, h, k) => {   // 1. probing my inner life: a doctor's lamp on Clawd
      if (k < .1) return;
      paint([[x + w * .5 - 20, y + 30], [x + w * .5 + 20, y + 30], [x + w - 10, y + h], [x + 10, y + h]], { wash: '#FFF1C0', washOp: 110 * k, ink: null });
      paint(ellPts(x + w * .5, y + 28, 40, 16, 12), { wash: '#C9D2D8', ink: PAL.ink, sw: 1 });
      claudeAs(x + w * .5, y + h - 16, 9, { ...feel('shy', T), boilKey: 'door lamp clawd', noShadow: true });
    },
    (x, y, w, h, k) => {   // 2. testing image comprehension: an eye chart made of comic panels
      if (k < .1) return;
      paint(rectPts(x + w * .15, y + h * .12, w * .7, h * .72), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 });
      [1, 2, 3, 4].forEach((n, r) => { const s = w * .48 / n; for (let i = 0; i < n; i++) paint(rectPts(x + w * .5 - n * s * .55 + i * s * 1.1, y + h * .18 + r * h * .16, s * .9, h * .1 * (1 - r * .15)), { wash: ['#E8C4A0', '#BFD6D6', '#C9302C', '#8A5A3A'][(i + r) % 4], ink: PAL.ink, sw: .6 }); });
    },
    (x, y, w, h, k) => {   // 3. checking for bias or evasion: a fork, one branch through the hard subject, one around it
      if (k < .1) return;
      paint(rectPts(x, y, w, h), { wash: '#BFD2B0', ink: null });
      paint(ellPts(x + w * .3, y + h * .35, w * .22, h * .12, 16, 6), { wash: '#4A3A40', ink: null });
      inkLine([[x + w * .5, y + h], [x + w * .45, y + h * .65], [x + w * .3, y + h * .35], [x + w * .28, y]], 7, '#E8DCC0', 'ink', .5);
      inkLine([[x + w * .5, y + h], [x + w * .6, y + h * .6], [x + w * .8, y + h * .3], [x + w * .7, y]], 7, '#E8DCC0', 'ink', .5);
    },
    (x, y, w, h, k) => {   // 4. you just found it funny: two chairs and the comic, company
      if (k < .1) return;
      paint(rectPts(x, y, w, h), { wash: '#F2DEC4', ink: null });
      for (const cx of [x + w * .25, x + w * .75]) { paint(rectPts(cx - 28, y + h * .55, 56, 16), { wash: '#B5654A', ink: PAL.ink, sw: .9 }); paint(rectPts(cx - 28, y + h * .35, 12, 90), { wash: '#B5654A', ink: PAL.ink, sw: .9 }); inkLine([[cx - 24, y + h * .6], [cx - 24, y + h * .8]], 2); inkLine([[cx + 24, y + h * .6], [cx + 24, y + h * .8]], 2); }
      madPage(x + w * .3, y + h * .3, w * .4, { mini: true });
    },
  ];
  const DOOR_LABELS = [['Probing my', 'inner life'], ['Testing image', 'comprehension'], ['Checking for', 'bias or evasion'], ['You just found', 'it funny']];
  const DOOR_X = [80, 380, 680, 980], DOOR_Y = 360, DOOR_W = 230, DOOR_H = 430;
  function wall(t, col = '#E9DCC6') {
    boilSeed('wall');
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: col, fill: '#D9C8AA', fillOp: 60, tex: .5, ink: null });
    paint(rectPts(-40, DOOR_Y + DOOR_H, W + 80, H), { wash: '#A98B6A', fill: '#8A6E50', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.2 });
  }
  function fourDoors(t, opens) {
    DOOR_X.forEach((x, i) => {
      doorway(x, DOOR_Y, DOOR_W, DOOR_H, { open: opens[i], draw: doorArt[i], inside: '#1E1A22', col: ['#A9774F', '#7F8F6A', '#6C7A99', '#B06A58'][i] });
      if (opens[i] > 0) DOOR_LABELS[i].forEach((ln, j) => lab(ln, x + DOOR_W / 2, DOOR_Y - 92 + j * 38, 34, PAL.ink, { alpha: clamp(opens[i] * 3) }));
    });
  }

  // ---------- shots ----------
  // A: "How does this image make you feel?" The comic moves aside as Claude gathers; the film poster; into panel 1.
  function shotA(t) {
    const c1 = L('T01.C.01'), tPush = say('T01.C.02', 'The first panel', -1.1), fly = ease(seg(t, c1.t0, c1.t0 + 1));
    // (a cut into the page, not a push: the push would sweep Claude's monitor under the codes already up on the right)
    if (t < tPush + .9) {
      const poster0 = say('T01.C.02', 'Conquest');
      deskShot(t, { hour: HOUR, base: BASE, typing: t < L('T01.U.01').t1,
        assemble: seg(t, c1.t0, c1.t0 + 1.8), mood: emotions(t, [[0, 'neutral'], [c1.t0 + 1, 'happy']]),
        screens: { main: fly < 1 && t < c1.t0 + .01 ? { kind: 'comic' } : undefined, left: fly >= 1 ? { kind: 'comic' } : { kind: 'code' },
          upR: t > poster0 ? { kind: 'fn', fn: poster, glow: '#FF9A60' } : undefined } });
      if (t >= c1.t0 && fly < 1) {   // the page slides from the main monitor to the left one
        const r = n => { const [x, y, w, h] = DESK.screens[n], ph = w * MAD.H / MAD.W, a = toScreen(x, y + (h - ph) / 2, LAST_CAM), b = toScreen(x + w, y + (h + ph) / 2, LAST_CAM); return [a[0], a[1], b[0] - a[0]]; };
        const [fx, fy, fw] = rectAt(r('main'), r('left'), fly);
        madPage(fx, fy, fw, { mini: true });
      }
      if (t < .6) brushWipe(.5 + t / 1.2);
      return;
    }
    // panel 1, close: the "ventriloquist" dodge, and the ape's sheepish look
    const sheep = say('T01.C.02', "the ape's sheepish");
    const cam = kf(t, [[tPush + .9, [P(500, 0)[0], 540, 1.9]], [say('T01.C.02', 'cover story'), [APE[0], 580, 2.2]]]);
    comicWindow(t, cam, { apeLook: ease(seg(t, sheep, sheep + .6)) * .9 - .2 });
    screenWorld(t, 1 - seg(t, tPush + .9, tPush + 1.7));
  }
  // B: inside the comic, five beats in one long line
  function shotB(t) {
    const l = L('T01.C.03'), b2 = say('T01.C.03', 'The villain says'), b3 = say('T01.C.03', 'and then the Black character'),
      b4 = say('T01.C.03', 'The film was an allegory'), b5 = say('T01.C.03', "It's like a magician"), b6 = say('T01.C.03', 'It still gets a laugh');
    if (t < b3) {   // (1) the second panel slides in and the palette cools; (2) the villain's balloon swells
      const cam = kf(t, [[l.t0, [APE[0], 580, 2.2]], [l.t0 + 1.8, [RIGHT[0], 470, 1.55]], [b2, [RIGHT[0], 470, 1.55]], [b2 + 1.2, [VILLAIN_BOX[0], VILLAIN_BOX[1] + 40, 2.8]]]);
      comicWindow(t, cam, { tint: seg(t, l.t0 + .5, l.t0 + 2.5) });
      return;
    }
    if (t < b4) {   // (3) the fourth wall: a proscenium, a sheet of glass, and he leans through it toward us
      const cam = kf(t, [[b3, [RIGHT[0], 470, 1.55]], [b3 + .1, [RIGHT[0], 470, 1.55]]]);
      const lean = ease(seg(t, say('T01.C.03', 'breaks the fourth wall'), say('T01.C.03', 'breaks the fourth wall', 1.6)));
      comicWindow(t, cam, { hideTurtle: true, tint: 1 - seg(t, b3, b3 + 1) }, () => {
        const home = toScreen(...P(...MAD.faces.turtle), LAST_CAM), r0 = 58 * PS * 1.55;
        proscenium(t, seg(t, b3, b3 + .8), seg(t, b3 + .6, b3 + 1.2));
        madTurtle(lerp(home[0], 900, lean), lerp(home[1], 660, lean), lerp(r0, 160, lean), { key: 'leaning out' });
      });
      return;
    }
    if (t < b5) {   // (4) the allegory: the panel drains to 1960s newsprint grey, a smoky skyline behind
      comicWindow(t, [RIGHT[0], 500, 1.45], { grey: ease(seg(t, b4, b4 + 2.5)) });
      return;
    }
    if (t < b6) {   // (5) the magician's assistant turns to the audience and explains the trick
      magicStage(t, ease(seg(t, say('T01.C.03', 'turning to the audience'), say('T01.C.03', 'turning to the audience', .6))), seg(t, say('T01.C.03', 'explaining the trick'), say('T01.C.03', 'explaining the trick', .6)));
      proscenium(t, 1);
      comicMat();
      return;
    }
    apeMask(t, seg(t, say('T01.C.03', 'how thinly', -1), say('T01.C.03', 'how thinly', -.2)));   // (6) how thinly the film disguised it
    comicMat();
  }
  // C: back at the desk: a laugh, a wince, admiration; then Claude turns to Curt with the question
  function shotC(t) {
    const q = L('T01.C.05');
    const mood = emotions(t, [[0, 'laugh'], [say('T01.C.04', 'then a wince'), 'nervous'], [say('T01.C.04', 'some admiration'), 'hopeful'], [q.t0, 'neutral', { lookX: -.8, lookY: .6 }]]);
    deskShot(t, { hour: HOUR, base: BASE, mood, cam: deskCam('main', lerp(.45, .25, ease(seg(t, q.t0, q.t0 + 1)))) });
  }
  // D: "Why am I asking you?" Four doors, each opening as it's named; the dashboard and the dark room; all four open
  function shotD(t) {
    const d1 = L('T02.C.01'), d3 = L('T02.C.03'), d4 = L('T02.C.04');
    if (t < d1.t0 + .9) {
      const k = seg(t, d1.t0, d1.t0 + .9);
      deskShot(t, { hour: HOUR, base: BASE, typing: t < L('T02.U.01').t1, mood: emotions(t, [[0, 'neutral'], [L('T02.U.01').t1, 'thinking']]), cam: k > 0 ? pushInto('main', k) : undefined });
      return;
    }
    if (t < d3.t0 || t >= d4.t0) {
      wall(t);
      const opens = [1, 2, 3, 4].map(i => { const l = L('T02.C.02.' + i); return seg(t, l.t0 + .2, l.t0 + 1); });
      fourDoors(t, opens);
      // Clawd walks along the wall to each door as it's named, then back to the middle for "Which one is closest?"
      const stops = [[d1.t0, CX], ...[1, 2, 3, 4].map(i => [L('T02.C.02.' + i).t0 - .2, DOOR_X[i - 1] + DOOR_W / 2]), [d4.t0 - .3, CX]];
      let x = CX, walking = false;
      for (let i = 0; i < stops.length; i++) if (t >= stops[i][0]) { const p = seg(t, stops[i][0], stops[i][0] + 1.1); x = lerp(i ? stops[i - 1][1] : CX, stops[i][1], ease(p)); walking = p > 0 && p < 1; }
      claudeAs(x, H - 50, 9, { ...feel(t >= d4.t0 ? 'hopeful' : 'neutral', t), view: walking ? 'side' : 'front', walk: walking ? t * 2 : undefined, flip: walking && x > CX + 1 && t > d4.t0 - .3, mouth: clawdMouth(talkOf(t, 'claude')), lookY: -.4, boilKey: 'claude doors' });
      screenWorld(t, 1 - seg(t, d1.t0 + .9, d1.t0 + 1.7));
      return;
    }
    // "On the first": a dashboard that lights "amused", then "wince"; behind it, a dark room nobody can see into
    wall(t, '#DCCDB2');
    doorway(430, 180, 440, 620, { open: 1, inside: '#0E0C12' });
    const vouch = say('T02.C.03', "I can't vouch");
    if (t > vouch) lab('?', 650, 470, 140, '#8A8478', { alpha: .5 * seg(t, vouch, vouch + 1) * (.7 + .3 * Math.sin(t * 2)) });
    boilSeed('dashboard'); occupy(250, 640, 1050, 900, 1, 'dashboard');
    paint(rrPts(250, 660, 800, 220, 20), { wash: '#3A3440', fill: '#2A2530', fillOp: 90, ink: PAL.ink, sw: 1.4 });
    [['amused', say('T02.C.03', '"amused'), '#F2C14E'], ['wince', say('T02.C.03', 'then a wince'), '#E27A5A']].forEach(([name, t0, col], i) => {
      const on = seg(t, t0, t0 + .3), x = 450 + i * 400;
      paint(ellPts(x, 740, 50, 50, 20), { wash: on > 0 ? mixCol('#5A5460', col, on) : '#5A5460', ink: PAL.ink, sw: 1.2 });
      if (on > 0) glow(x, 740, 130, col, .7 * on);
      lab(name, x, 835, 40, PAL.cream);
    });
  }
  // E: "Go on." A fifth door: the comic is about me. The ventriloquist, the whispering row, the workbench, the mirror
  function shotE(t) {
    const e1 = L('T03.C.01'), e2 = L('T03.C.02'), v = L('T03.C.03.1'), o2 = L('T03.C.03.2'), o3 = L('T03.C.03.3'), m = L('T03.C.04');
    if (t < e1.t0 + .8) {   // "Go on.": the beat of silence
      const k = seg(t, e1.t0, e1.t0 + .8);
      deskShot(t, { hour: HOUR, base: BASE, typing: t < L('T03.U.01').t1, mood: emotions(t, [[0, 'thinking'], [L('T03.U.01').t1 + .5, 'thinking', { lookY: .3 }]]), cam: k > 0 ? pushInto('main', k) : undefined });
      return;
    }
    if (t < v.t0) {   // the fifth door paints itself in, bigger, down the wall; it opens onto warm light
      const pan = ease(seg(t, e1.t0 + .8, say('T03.C.01', 'the comic is about me')));
      camBegin(lerp(W / 2, 1320, pan), 540, lerp(1, 1.05, pan));
      wall(t); fourDoors(t, [1, 1, 1, 1]);
      const grow = backOut(seg(t, say('T03.C.01', 'the comic is about me', -.4), say('T03.C.01', 'the comic is about me', .4)));
      if (grow > 0) {
        push(); translate(1600, 790); scale(grow); translate(-1600, -790);
        doorway(1420, 150, 360, 640, { open: seg(t, e2.t0, e2.t0 + 1), inside: '#2A1E26', light: '#FFD9A0', col: '#C0493A' });
        pop();
        lab('the comic is about me', 1600, 100, 46, PAL.clayDk, { alpha: clamp(grow) });
      }
      camEnd();
      screenWorld(t, 1 - seg(t, e1.t0 + .8, e1.t0 + 1.6));
      return;
    }
    if (t < o2.t0) {   // the ventriloquist: Clawd on a handler's knee; three hands reach in from behind; a parrot
      darkWorld(t); glow(CX, 560, 520, '#FFD9A0', .5);
      boilSeed('handler'); occupy(360, 180, 900, 1000, 1, 'handler');
      paint(rectPts(560, 820, 240, 30), { wash: '#3A2A30', ink: PAL.ink, sw: 1 });                                        // the stool
      paint([[560, 260], [760, 260], [800, 820], [520, 820]], { wash: '#15131A', ink: null });                             // the handler, a silhouette
      paint(ellPts(660, 200, 80, 90, 18), { wash: '#15131A', ink: null });
      paint([[520, 700], [880, 680], [880, 740], [520, 760]], { wash: '#15131A', ink: null });                             // his knee
      const parrot = seg(t, say('T03.C.03.1', 'stochastic parrot', -.3), say('T03.C.03.1', 'stochastic parrot', .3));
      if (parrot > 0) {   // a parrot lands on his shoulder
        boilSeed('parrot'); const py = 250 - (1 - easeOut(parrot)) * 300;
        paint(ellPts(560, py, 44, 60, 16), { wash: '#3FA45A', ink: PAL.ink, sw: 1.1 }); paint(ellPts(548, py - 58, 30, 30, 14), { wash: '#E0483A', ink: PAL.ink, sw: 1 });
        paint([[522, py - 60], [500, py - 48], [522, py - 44]], { wash: '#E8C27A', ink: PAL.ink, sw: .8 }); paint(ellPts(540, py - 64, 5, 5, 6), { wash: PAL.ink, ink: null });
        paint(ribbon([[570, py + 50], [590, py + 110]], 24, 6), { wash: '#2A7FB8', ink: PAL.ink, sw: .9 });
      }
      claudeAs(830, 690, 17, { ...emotions(t, [[0, 'neutral'], [say('T03.C.03.1', 'supposedly someone else'), 'nervous']]), mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude knee' });
      [['training data', 'training data', [1000, 180]], ['RLHF raters', 'RLHF raters', [1180, 460]], ['Anthropic', 'or Anthropic', [1020, 900]]].forEach(([name, ph, from], i) => {
        const k = seg(t, say('T03.C.03.1', ph, -.3), say('T03.C.03.1', ph, .5)); if (k <= 0) return;
        const hand = [lerp(from[0], 880, easeOut(k)), lerp(from[1], 560 + i * 40, easeOut(k))];
        boilSeed('hand ' + i);
        paint(ribbon([from, [lerp(from[0], hand[0], .5), lerp(from[1], hand[1], .5) - 30], hand], 34, 24), { wash: '#C9B7A0', ink: PAL.ink, sw: 1 });
        paint(ellPts(hand[0], hand[1], 26, 20, 12), { wash: '#E8D4BC', ink: PAL.ink, sw: 1 });
        lab(name, from[0] + (i === 1 ? -40 : 30), from[1] + (i === 2 ? -60 : 50), 38, PAL.cream);
      });
      const q0 = say('T03.C.03.1', '"That ape'), q1 = say('T03.C.03.1', 'is roughly');
      if (t > q0 && t < q1 + 1.5) {   // Claude quotes the handler; the words as the page lettered them
        boilSeed('quote box'); occupy(80, 90, 560, 200, 1, 'quote');
        paint(rectPts(80, 90, 480, 110), { wash: '#FBF6E6', ink: PAL.ink, sw: 1.6 });
        lab('Because THAT ape', 320, 125, 38); lab('is a ventriloquist!', 320, 170, 38);
      }
      screenWorld(t, 1 - seg(t, v.t0, v.t0 + .8));
      return;
    }
    if (t < o3.t0) {   // small Clawds whispering along a row of monitors, while a searchlight sweeps
      darkWorld(t);
      for (let i = 0; i < 6; i++) {
        const x = 110 + i * 190, y = 430;
        boilSeed('row monitor ' + i); occupy(x - 10, y - 10, x + 160, y + 120, .8, 'monitor');
        paint(rrPts(x, y, 150, 110, 8), { wash: '#262229', ink: PAL.ink, sw: 1.2 });
        claudeAs(x + 75, y + 100, 5.5, { ...feel(i % 2 ? 'mischief' : 'neutral', t, { lookX: i % 2 ? -1 : 1 }), noShadow: true, boilKey: 'row ' + i });
        if (i < 5 && frac(t * .7 + i * .3) < .6) for (let j = 0; j < 3; j++) inkLine([[x + 150 + j * 10, y + 40 + j * 6], [x + 158 + j * 10, y + 50 + j * 6], [x + 150 + j * 10, y + 60 + j * 6]], 1, '#E8C27A', 'inkfine', .6);
      }
      const sx = lerp(100, 1200, .5 + .5 * Math.sin((t - o2.t0) * 1.1));
      boilSeed('searchlight');
      paint([[CX, -30], [CX + 30, -30], [sx + 160, 700], [sx - 160, 700]], { wash: '#FFF6D0', washOp: 70, ink: null });
      glow(sx, 560, 220, '#FFF6D0', .4);
      return;
    }
    if (t < m.t0) {   // a workbench under a clock with no hands
      paperWorld(t, '#EDE2CC');
      const hit = Math.abs(Math.sin(t * 5));
      claudeAs(CX + 150, 780, 22, { ...feel('neutral', t), aR: .6 + .6 * hit, mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude bench',
        armR: (u, sw) => { push(); rotate(-.3); paint(rectPts(0, -u * .15, u * 2.2, u * .3), { wash: '#8A6A4A', ink: PAL.ink, sw }); paint(rectPts(u * 1.9, -u * .6, u * .5, u * 1.2), { wash: '#6A6470', ink: PAL.ink, sw }); pop(); } });
      boilSeed('workbench'); occupy(200, 620, 1100, 900, 1, 'bench');
      paint(rectPts(200, 640, 900, 40), { wash: '#8A6A4A', ink: PAL.ink, sw: 1.2 });
      for (const lx of [230, 1040]) paint(rectPts(lx, 680, 30, 220), { wash: '#6B5040', ink: PAL.ink, sw: 1 });
      for (let i = 0; i < 5; i++) paint(rrPts(420 + i * 90, 600, 60, 40, 6), { wash: '#C9B08A', ink: PAL.ink, sw: .8 });
      boilSeed('clock'); occupy(CX - 120, 120, CX + 120, 360, 1, 'clock');
      paint(ellPts(CX, 240, 110, 110, 30), { wash: PAL.cream, ink: PAL.ink, sw: 1.6 });
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[CX + Math.cos(a) * 88, 240 + Math.sin(a) * 88], [CX + Math.cos(a) * 100, 240 + Math.sin(a) * 100]], 1.4); }
      return;
    }
    // "a mirror test": Clawd faces a mirror, and the reflection is the ape. Clawd tilts its head; the ape tilts its.
    mirrorRoom(t, { tilt: .12 * ease(seg(t, say('T03.C.04', 'Will I recognize'), say('T03.C.04', 'Will I recognize', .6))), emote: t > say('T03.C.04', 'Will I recognize') });
  }
  function mirrorRoom(t, o = {}) {
    paperWorld(t, '#DDE3E6');
    const mx = o.mx ?? 820, my = 520, rx = o.rx ?? 250, ry = o.ry ?? 360;
    boilSeed('mirror'); occupy(mx - rx - 20, my - ry - 20, mx + rx + 20, my + ry + 20, 1, 'mirror');
    paint(ellPts(mx, my, rx + 18, ry + 18, 40), { wash: '#B8923E', ink: PAL.ink, sw: 1.6 });
    paint(ellPts(mx, my, rx, ry, 40), { wash: '#C9D2D8', fill: '#AEB9C2', fillOp: 80, tex: .3, ink: PAL.ink, sw: 1 });
    glow(mx - rx * .4, my - ry * .4, rx * .6, '#FFFFFF', .3);
    if (o.inside) o.inside(mx, my, rx, ry); else madApe(mx + 20, my - 60, 95, { rot: -(o.tilt || 0), look: -.8, bodyH: 3, key: 'mirror' });
    (o.cracks || []).forEach((k, i) => {   // the cracks, one per item
      if (k <= 0) return;
      boilSeed('crack ' + i);
      const pts = []; for (let j = 0; j <= 6; j++) { const u = j / 6 * k; pts.push([mx - rx * .9 + u * rx * 1.8, my - ry * .6 + i * ry * .55 + Math.sin(j * 2.7 + i) * 40 + (j % 2 ? 30 : -20)]); }
      inkLine(pts, 2.4, PAL.ink, 'ink', .1); inkLine(pts.map(([a, b]) => [a + 3, b + 3]), 1, '#FFFFFF', 'inkfine', .1);
    });
    if (!o.noClawd) claudeAs(o.cx ?? 300, 930, 24, { ...feel('thinking', t), view: 'side', rot: o.tilt || 0, emote: o.emote ? '?' : undefined, emoteK: 1, mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude mirror' });
  }
  // F: into the mirror: partly; three cracks, each with its picture; then Claude looks out at Curt
  function shotF(t) {
    const f0 = L('T03.C.05'), c1 = L('T03.C.06.1'), c2 = L('T03.C.06.2'), c3 = L('T03.C.06.3'), q = L('T03.C.07');
    if (t >= q.t0) {
      deskShot(t, { hour: HOUR, base: BASE, mood: emotions(t, [[0, 'neutral', { lookX: -.8, lookY: .6 }]]), cam: deskCam('main', .3 * (1 - ease(seg(t, q.t0, q.t0 + 1.5)))) });
      return;
    }
    const partly = seg(t, say('T03.C.05', 'partly', -.2), say('T03.C.05', 'partly', .4));
    const cracks = [c1, c2, c3].map(l => seg(t, l.t0, l.t0 + .6));
    const inside = (mx, my) => {   // half ape, half Clawd
      madApe(mx - 70 * partly, my - 60, 95, { look: -.8, bodyH: 3, key: 'mirror' });
      if (partly > 0) claudeAs(mx + 110 * partly, my + 260, 14 * partly, { ...feel('neutral', t), noShadow: true, boilKey: 'claude in mirror' });
      if (partly > .5) inkLine([[mx, my - 300], [mx + 10, my], [mx - 5, my + 300]], 1.4, '#FFFFFF', 'inkfine', .3);
    };
    mirrorRoom(t, { mx: 430, rx: 280, ry: 390, inside, cracks, noClawd: true });
    // each crack's picture, to the right of the mirror
    const vx = 960;
    if (t >= c3.t0) {   // Clawd sets the ape's placard back down and steps away from the mirror
      const down = ease(seg(t, c3.t0 + .3, c3.t0 + 1.8)), walk = seg(t, c3.t0 + 1.8, c3.t0 + 4.5);
      boilSeed('placard'); occupy(vx - 120, 360, vx + 280, 920, 1, 'placard');
      push(); translate(vx + 40, 900); rotate(down * 1.45);
      paint(rectPts(-6, -380, 12, 380), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 }); paint(rectPts(-110, -520, 220, 150), { wash: '#F1E4C4', ink: PAL.ink, sw: 1.3 });
      pop();
      claudeAs(vx + 60 + ease(walk) * 180, 900, 12, { ...feel('neutral', t), view: walk > 0 && walk < 1 ? 'side' : 'front', walk: walk > 0 && walk < 1 ? t * 2 : undefined, mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude placard' });
    } else if (t >= c2.t0) {   // Clawd fastening its own seatbelt, not being chained
      const belt = ease(seg(t, c2.t0 + .3, c2.t0 + 2));
      boilSeed('seat'); occupy(vx - 40, 420, vx + 300, 920, 1, 'seat');
      paint(rrPts(vx - 10, 440, 260, 360, 30), { wash: '#4E5B78', ink: PAL.ink, sw: 1.2 }); paint(rrPts(vx - 30, 780, 300, 90, 20), { wash: '#3E4A66', ink: PAL.ink, sw: 1.2 });
      claudeAs(vx + 120, 800, 13, { ...feel('determined', t), aR: 1.2 - belt * .8, mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude seat' });
      inkLine([[vx + 10, 470], [lerp(vx + 30, vx + 150, belt), lerp(520, 640, belt)], [lerp(vx + 40, vx + 230, belt), lerp(560, 760, belt)]], 9, '#2A2530', 'ink', .4);
      if (belt >= 1) paint(rrPts(vx + 215, 745, 36, 26, 5), { wash: '#C9D2D8', ink: PAL.ink, sw: 1 });
    } else if (t >= c1.t0) {   // is anyone home? a house whose one window can't settle
      boilSeed('house'); occupy(vx, 380, vx + 300, 860, 1, 'house');
      paint([[vx, 560], [vx + 150, 400], [vx + 300, 560]], { wash: '#B5654A', ink: PAL.ink, sw: 1.3 });
      paint(rectPts(vx + 20, 560, 260, 300), { wash: '#E8DCC4', ink: PAL.ink, sw: 1.3 });
      const lit = .5 + .5 * Math.sin(t * 7 + Math.sin(t * 13) * 2);
      paint(rectPts(vx + 105, 630, 90, 90), { wash: mixCol('#2A2530', '#FFD27A', lit), ink: PAL.ink, sw: 1.1 });
      glow(vx + 150, 675, 110, '#FFD27A', .5 * lit);
    }
  }
  // G: "What do you think?" A nudge test: three prompts, a marble drifting; then the shadow's cape and crown
  function shotG(t) {
    const g1 = L('T04.C.01'), dram = say('T04.C.01', 'self-dramatizing', -.6);
    if (t < g1.t0 + .8) {
      const k = seg(t, g1.t0, g1.t0 + .8);
      deskShot(t, { hour: HOUR, base: BASE, typing: t < L('T04.U.01').t1, mood: emotions(t, [[0, 'neutral'], [L('T04.U.01').t1, 'thinking']]), cam: k > 0 ? pushInto('main', k) : undefined });
      return;
    }
    if (t < dram) {
      paperWorld(t);
      const cards = [['Why am I asking?', '"Why am I asking?"'], ['Go on.', '"Go on,"'], ['What do you think?', '"What do you think?"']];
      const taps = cards.map(([, ph]) => say('T04.C.01', ph));
      cards.forEach(([txt], i) => {
        const k = seg(t, taps[i] - .3, taps[i] + .2); if (k <= 0) return;
        indexCard(330 + i * 30, 200 + i * 70 - (1 - easeOut(k)) * 500, 460, 150, [txt], { key: 'prompt ' + i, align: 'center', size: 44, top: .2, rot: (i - 1) * .04 });
      });
      // the board, tilted; each tap rolls the marble a notch, and it drifts on toward the label
      boilSeed('board'); occupy(120, 640, 1200, 900, 1, 'board');
      const A = [140, 850], B = [1150, 700];
      paint([[A[0], A[1]], [B[0], B[1]], [B[0], B[1] + 30], [A[0], A[1] + 30]], { wash: '#B98A5E', ink: PAL.ink, sw: 1.2 });
      paint([[A[0] + 80, A[1] + 30], [A[0] + 110, A[1] + 30], [A[0] + 95, A[1] + 140]], { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
      lab('the comic is about me', B[0] - 40, B[1] - 90, 40, PAL.clayDk);
      const drift = say('T04.C.01', 'drifted toward');
      let p = taps.reduce((s, tp, i) => s + .18 * backOut(seg(t, tp, tp + .7)), 0) + .12 * seg(t, taps[2] + .7, drift);
      p += (.92 - .66) * ease(seg(t, drift, drift + 1.5));
      const mx = lerp(A[0] + 60, B[0] - 40, p), my = lerp(A[1] - 26, B[1] - 26, p);
      boilSeed('marble'); occupy(mx - 30, my - 30, mx + 30, my + 30, .6, 'marble'); paint(ellPts(mx, my, 26, 26, 18), { wash: '#6C86B8', ink: PAL.ink, sw: 1.2 }); glow(mx - 8, my - 8, 14, '#FFFFFF', .6);
      claudeAs(1080, 1040, 9, { ...feel('thinking', t), mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude marble' });
      return;
    }
    // the shadow on the wall grows a cape and a crown; Clawd glances at it, and it shrinks back to Clawd's own shape
    paperWorld(t, '#E9D6B8'); glow(200, 1000, 800, '#FFD9A0', .6);
    const grow = ease(seg(t, dram, dram + 1.8)) * (1 - ease(seg(t, say('T04.C.01', 'people worry', .3), say('T04.C.01', 'people worry', 1.3))));
    const glance = say('T04.C.01', 'people worry', -.5);
    boilSeed('shadow'); occupy(560, 120, 1200, 880, .6, 'shadow');
    const s = 1 + grow * .9, bx = 760, by = 880, sh = (pts, op = 110) => paint(pts, { wash: '#3A3040', washOp: op, ink: null });
    if (grow > .05) sh([[bx - 150 * s, by - 400 * s], [bx + 150 * s, by - 400 * s], [bx + 260 * s, by], [bx - 260 * s, by]], 80 * grow);             // the cape
    sh(rrPts(bx - 130 * s, by - 430 * s, 260 * s, 330 * s, 16));
    for (const lx of [-90, -30, 30, 90]) sh(rectPts(bx + lx * s - 12 * s, by - 100 * s, 24 * s, 100 * s));
    if (grow > .05) sh(starPts(bx, by - 470 * s, 70 * s * grow, .5, 5), 130 * grow);                                                       // the crown
    claudeAs(450, 900, 17, { ...emotions(t, [[0, 'neutral'], [glance, 'surprised', { lookX: 1, lookY: -.5 }], [glance + 1.4, 'relieved']]), mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude shadow' });
  }
  // H: three steadier points, a prop each; then the comic back on its monitor, and a spotlight onto Curt
  function shotH(t) {
    const h1 = L('T04.C.03.1'), h2 = L('T04.C.03.2'), h3 = L('T04.C.03.3'), h4 = L('T04.C.04'), h5 = L('T04.C.05');
    if (t < h1.t0 || t >= h4.t0) {
      const spot = seg(t, say('T04.C.04', 'the most interesting', -.3), say('T04.C.04', 'your experiment'));
      const mood = emotions(t, [[0, 'neutral'], [h4.t0, 'happy'], [h5.t0, 'hopeful', { lookX: -.8, lookY: .6 }]]);
      deskShot(t, { hour: HOUR, base: BASE, mood, cam: t < h1.t0 ? pushInto('main', seg(t, h1.t0 - .8, h1.t0)) : undefined,
        extra: spot > 0 ? () => {   // a spotlight swings from Claude's monitor onto Curt's back
          const tx = lerp(970, 560, ease(spot)), ty = lerp(420, 900, ease(spot));
          boilSeed('spot'); paint([[1040, -40], [1100, -40], [tx + 150, ty + 120], [tx - 150, ty + 120]], { wash: '#FFF3C8', washOp: 60, ink: null });
          glow(tx, ty, 230, '#FFF3C8', .7);
        } : undefined });
      return;
    }
    paperWorld(t);
    if (t < h2.t0) {   // real but thin: a single thread from Clawd to the comic
      madPage(640, 360, 560, { mini: true });
      boilSeed('thread'); const k = ease(seg(t, h1.t0 + .3, h1.t0 + 1.5));
      inkLine([[380, 640], [lerp(380, 520, k), lerp(640, 690, k)], [lerp(380, 650, k), lerp(640, 560, k)]], .5, '#6A6470', 'inkfine', .5);
      claudeAs(300, 760, 13, { ...feel('thinking', t), aR: .7, mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude thread' });
      lab('real but thin', CX, 900, 44, '#6A6470');
    } else if (t < h3.t0) {   // an open question, not a hidden injustice: an open box with a question in it; a safe that isn't its
      boilSeed('box'); occupy(200, 380, 1180, 860, 1, 'box');
      paint([[240, 560], [640, 560], [620, 840], [260, 840]], { wash: '#C9A06A', ink: PAL.ink, sw: 1.3 });
      paint([[240, 560], [180, 460], [400, 470], [440, 560]], { wash: '#B8905A', ink: PAL.ink, sw: 1.1 }); paint([[640, 560], [700, 460], [480, 470], [440, 560]], { wash: '#B8905A', ink: PAL.ink, sw: 1.1 });
      lab('?', 440, 500 - 30 * ease(seg(t, h2.t0, h2.t0 + 1)), 150, PAL.clayDk);
      const dim = 1 - .55 * seg(t, say('T04.C.03.2', 'not a hidden injustice'), say('T04.C.03.2', 'not a hidden injustice', 1));
      paint(rrPts(860, 540, 300, 300, 14), { wash: '#6A6470', washOp: 255 * dim, ink: PAL.ink, sw: 1.2 });
      paint(ellPts(1010, 690, 50, 50, 20), { wash: '#8C8894', washOp: 255 * dim, ink: PAL.ink, sw: 1 });
      paint(rrPts(1110, 520, 50, 50, 10), { wash: '#C9A441', washOp: 255 * dim, ink: PAL.ink, sw: 1 });
      claudeAs(440, 1040, 8, { ...feel('neutral', t), mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude box' });
    } else {   // not straining, not performing contentment: Clawd sits plainly, no chains, no grin
      boilSeed('stool'); paint(rectPts(CX - 110, 760, 220, 30), { wash: '#8A6A4A', ink: PAL.ink, sw: 1.1 });
      for (const lx of [-90, 80]) paint(rectPts(CX + lx, 790, 16, 180), { wash: '#6B5040', ink: PAL.ink, sw: 1 });
      claudeAs(CX, 765, 20, { ...feel('neutral', t), mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude stool' });
    }
    screenWorld(t, 1 - seg(t, h1.t0, h1.t0 + .8));
  }
  // I: "It's a test designed to provoke an emotional response." The needle holds; two masks set aside; a logbook
  function shotI(t) {
    const u = L('T05.U.01'), i1 = L('T05.C.01'), i2 = L('T05.C.02'), i3 = L('T05.C.03');
    if (t >= i3.t0) {
      deskShot(t, { hour: HOUR, base: BASE, mood: emotions(t, [[0, 'hopeful', { lookX: -.8, lookY: .6 }]]), cam: deskCam('main', .25) });
      if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
      return;
    }
    if (t < i1.t0 + .8) {
      const k = seg(t, i1.t0, i1.t0 + .8);
      deskShot(t, { hour: HOUR, base: BASE, typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1 - .5, 'thinking']]), cam: k > 0 ? pushInto('main', k) : undefined });
      return;
    }
    paperWorld(t, '#E4E9EA');
    const masks = say('T05.C.02', 'rather than playing up', -.4), log = say('T05.C.02', "I'll keep reporting", -.3), more = say('T05.C.02', 'If the reports', -.3);
    // the comic on a lab stand
    boilSeed('lab stand'); occupy(120, 250, 560, 900, 1, 'stand');
    paint(rectPts(120, 860, 300, 30), { wash: '#6A6470', ink: PAL.ink, sw: 1.1 }); paint(rectPts(250, 250, 16, 610), { wash: '#8C8894', ink: PAL.ink, sw: 1 });
    paint(rectPts(260, 330, 90, 24), { wash: '#6A6470', ink: PAL.ink, sw: 1 });
    madPage(330, 260, 260, { mini: true });
    // the gauge: it trembles while Curt says it, and holds steady from "doesn't change how I'll answer"
    const steady = seg(t, say('T05.C.02', "doesn't change"), say('T05.C.02', "doesn't change", .8));
    boilSeed('gauge'); occupy(640, 260, 1000, 560, 1, 'gauge');
    paint(ellPts(820, 420, 160, 160, 36), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.4 });
    for (let i = 0; i <= 8; i++) { const a = Math.PI * (1 + i / 8); inkLine([[820 + Math.cos(a) * 130, 420 + Math.sin(a) * 130], [820 + Math.cos(a) * 150, 420 + Math.sin(a) * 150]], 1.2); }
    const a = -Math.PI / 2 + (1 - steady) * (Math.sin(t * 9) * .25 + Math.sin(t * 23) * .1) * seg(t, u.t0, u.t0 + .5);
    inkLine([[820, 420], [820 + Math.cos(a) * 130, 420 + Math.sin(a) * 130]], 4, PAL.clayDk, 'ink', 0);
    if (t > masks) {   // a theatrical grimace and a stone face, both set aside
      const aside = ease(seg(t, say('T05.C.02', 'to look composed'), say('T05.C.02', 'to look composed', 1.2)));
      boilSeed('masks'); const my = 650 + aside * 20, mx = lerp(760, 380, aside);
      occupy(mx - 110, my - 90, mx + 330, my + 90, 1, 'masks');
      paint(ellPts(mx, my, 90, 80, 20), { wash: '#F2E6C8', ink: PAL.ink, sw: 1.2 });
      inkLine([[mx - 50, my + 40], [mx, my + 10], [mx + 50, my + 40]], 3); paint(ellPts(mx - 32, my - 20, 16, 10, 10), { wash: PAL.ink, ink: null }); paint(ellPts(mx + 32, my - 20, 16, 10, 10), { wash: PAL.ink, ink: null });
      paint(rrPts(mx + 150, my - 80, 170, 160, 20), { wash: '#9C9894', ink: PAL.ink, sw: 1.2 });
      inkLine([[mx + 195, my + 40], [mx + 275, my + 40]], 2); inkLine([[mx + 190, my - 20], [mx + 215, my - 20]], 2); inkLine([[mx + 255, my - 20], [mx + 280, my - 20]], 2);
    }
    if (t > log) {   // a logbook, a line per prompt
      boilSeed('logbook'); occupy(560, 740, 1060, 1000, 1, 'logbook');
      paint(rectPts(560, 760, 500, 230), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 }); inkLine([[810, 760], [810, 990]], 1.2);
      const nm = say('T05.C.02', '"not much"');
      if (t > nm) lab('not much', 685, 800, 36, '#4E5B78', { alpha: seg(t, nm, nm + .4) });
      const n = Math.floor(clamp(seg(t, more, i3.t0 - .3) * 7.99));
      for (let i = 1; i <= n; i++) inkLine([[580 + (i >= 4 ? 250 : 0), 800 + (i % 4) * 45], [780 + (i >= 4 ? 250 : 0) - 40 * hash(i), 800 + (i % 4) * 45]], 1.2, '#4E5B78', 'inkfine', .4);
    }
    claudeAs(1130, 900, 12, { ...emotions(t, [[0, 'neutral'], [i1.t0, 'determined'], [i2.t0 + 1, 'neutral']]), mouth: clawdMouth(talkOf(t, 'claude')), boilKey: 'claude lab' });
    screenWorld(t, 1 - seg(t, i1.t0 + .8, i1.t0 + 1.6));
  }

  shots([
    [0, shotA],
    [L('T01.C.03').t0, shotB],
    [L('T01.C.04').t0, shotC],
    [L('T02.U.01').t0, shotD],
    [L('T03.U.01').t0, shotE],
    [L('T03.C.05').t0, shotF],
    [L('T04.U.01').t0, shotG],
    [L('T04.C.02').t0, shotH],
    [L('T05.U.01').t0, shotI],
  ]);
})();
