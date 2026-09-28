// ch16_coda.js: chapter 16 (T78) and the film's closing holds. Storyboard: docs/storyboards/ch16_coda.md.
// "You're like the T-800 of nerd sniping." "I'll be back, with footnotes." And the footnotes arrive: every code in the
// film rains in and tiles into one wall; the wall pulls back into the last panel of a comic page of the whole film (the
// opening's MAD page, answered), then the page dissolves back into the wall, with the companion page's code in its centre.
(() => {
  const HOUR = 12;   // noon gold: the colour arc's end
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const u = L('T78.U.01'), c1 = L('T78.C.01'), c2 = L('T78.C.02');
  const desk16 = (t, o = {}) => deskShot(t, { hour: HOUR, frog: 1, axolotl: 1, ...o });

  // ---------- the closing's clock ----------
  const RAIN0 = c2.end + .15, RAIN = 12;                  // the footnotes fall, in film order
  const CARD0 = RAIN0 + RAIN + .6;                         // the companion page's code, in the wall's centre
  // nothing waits once it's built (a viewer who wants longer pauses): each step starts as the last one finishes
  const SLIDE0 = CARD0 + 1.6, OUT0 = SLIDE0 + 1.3, OUT1 = OUT0 + 5.8;   // it steps right; the page pulls back
  const TURN = OUT1 + .3, REDEYE = OUT1 + 1.8;              // the frog and the axolotl turn to us; the T-800 eye, once
  const IN0 = REDEYE + .8, IN1 = IN0 + 5.5, BACK1 = IN1 + 1.2;          // back into the wall; the code to the centre

  // ---------- A: the nerd sniping, on the left monitor ----------
  // a road across the screen, a board on a stand holding the puzzle, someone stopped dead in the road to look at it, and a
  // truck on its way (a homage to the situation of xkcd #356: no copied panel, no words). who: 'stick' or 'clawd' (it cuts
  // both ways: the comic that sniped Claude in its place)
  const zig = (a, b, n = 5, amp = 4) => { const P = [a]; for (let i = 1; i < n * 2; i++) { const k = i / (n * 2), s = i % 2 ? 1 : -1, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); P.push([a[0] + dx * k - dy / l * amp * s, a[1] + dy * k + dx / l * amp * s]); } P.push(b); return P; };
  function snipeScreen(who) {
    return (x, y, w, h, t) => {
      boilSeed('snipe ' + who);
      paint(rectPts(x, y, w, h), { wash: '#F6F3EA', ink: null });
      const ry = y + h * .62;
      paint(rectPts(x, ry, w, h * .24), { wash: '#B9B4AA', ink: null });
      for (let i = 0; i < 6; i++) paint(rectPts(x + w * (.04 + i * .17), ry + h * .11, w * .08, h * .02), { wash: '#F6F3EA', ink: null });
      // the board on its stand, beside the road
      const bx = x + w * .72, by = y + h * .12, bw = w * .22, bh = h * .34;
      inkLine([[bx + bw / 2, by + bh], [bx + bw / 2, ry + h * .02]], 2, PAL.ink, 'inkfine', 0);
      paint(rectPts(bx, by, bw, bh), { wash: '#FFFFFF', ink: PAL.ink, sw: .9 });
      if (who === 'stick') {   // an endless grid of resistors
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
          const px = bx + bw * (.15 + c * .35), py = by + bh * (.15 + r * .35);
          if (c < 2) inkLine(zig([px, py], [px + bw * .35, py], 3, 2.2), .8, PAL.ink, 'inkfine', 0);
          if (r < 2) inkLine(zig([px, py], [px, py + bh * .35], 3, 2.2), .8, PAL.ink, 'inkfine', 0);
        }
      } else madPage(bx + bw * .06, by + bh * .3, bw * .88, { mini: true, t });
      // who's stopped in the road, looking at it
      const fx = x + w * .5, fy = ry + h * .14;
      if (who === 'stick') {
        paint(ellPts(fx, fy - h * .3, h * .045, h * .05, 12), { wash: '#F6F3EA', ink: PAL.ink, sw: 1 });
        inkLine([[fx, fy - h * .25], [fx, fy - h * .1]], 1.4, PAL.ink, 'inkfine', 0);
        for (const d of [-1, 1]) { inkLine([[fx, fy - h * .1], [fx + d * w * .02, fy]], 1.4, PAL.ink, 'inkfine', 0); inkLine([[fx, fy - h * .21], [fx + (d > 0 ? w * .05 : -w * .02), fy - h * (d > 0 ? .26 : .15)]], 1.4, PAL.ink, 'inkfine', 0); }
      } else clawd(fx, fy, h * .026, { eyes: 'wide', lookX: 1, lookY: -.4, noShadow: true, boilKey: 'snipe clawd' });
      // the truck, on its way in from the left
      const tx = x - w * .2 + frac(t / 14) * w * .28;
      paint(rrPts(tx, ry + h * .01, w * .16, h * .1, 3), { wash: '#C9302C', ink: PAL.ink, sw: .8 });
      paint(rrPts(tx + w * .16, ry + h * .04, w * .05, h * .07, 3), { wash: '#A8261F', ink: PAL.ink, sw: .8 });
      for (const k of [.2, .75, 1.1]) paint(ellPts(tx + w * .16 * k, ry + h * .115, h * .025, h * .025, 8), { wash: PAL.ink, ink: null });
    };
  }

  // the snipe as a full frame on the left, while the code (xkcd's is wide) holds the rest
  const SNIPE = [40, 300, 640, 400];
  function snipeFrame(t, who) {
    paperWorld(t, '#F3EAD6');
    const [x, y, w, h] = SNIPE;
    boilSeed('snipe frame'); occupy(x, y, x + w, y + h, 1, 'snipe');
    snipeScreen(who)(x, y, w, h, t);
    paint(rectPts(x, y, w, h), { wash: null, ink: PAL.ink, sw: 2.4 });
  }
  const SNIPE0 = say('T78.U.01', 'nerd sniping', -.3);
  function shotA(t) {
    const eye = say('T78.U.01', 'T eight hundred'), redEye = t > eye && t < eye + .4;
    if (t < SNIPE0) {   // the T-800: for one beat a red eye glints in Claude's monitor
      desk16(t, { typing: t < u.t1 - .8, mood: emotions(t, [[0, 'neutral'], ...(redEye ? [[eye, 'neutral', { eyes: ['normal', 'red'] }]] : [])]) });
      if (redEye) { const [sx, sy, sw, sh] = screenRect('main'); glow(sx + sw * .54, sy + sh * .52, 50, '#FF2A1A', .9); }
    } else snipeFrame(t, 'stick');
    qrFeature('xkcd-356', t, SNIPE0, { hold: 6.2 });
    if (t < .6) brushWipe(.5 + t / 1.2);
  }

  // ---------- B: it cuts both ways ----------
  const card = (x, y, w, h, flip, word, draw, key) => {   // a card that flips up (flip 0..1) with a picture and its word
    if (flip <= 0) return;
    boilSeed('card ' + key); occupy(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 1, 'card ' + key);
    push(); translate(x, y); scale(Math.max(.02, Math.sin(ease(flip) * Math.PI / 2)), 1); rotate((1 - ease(flip)) * .2);
    paint(rrPts(-w / 2, -h / 2, w, h, 14), { wash: '#FBF8F0', fill: '#EFE6D2', fillOp: 60, tex: .4, ink: PAL.ink, sw: 1.3 });
    draw(0, h * .12);
    pop();
    if (flip > .7) lab(word, x, y - h * .36, word.length > 8 ? 34 : 44, PAL.ink);
  };
  function flame(x, y, s, t, key) {   // a campfire: logs and a flame that won't sit still
    boilSeed('flame ' + key);
    for (const d of [-1, 1]) paint(rrPts(-s * .55 + x, y - s * .08 + d * s * .02, s * 1.1, s * .14, 6), { wash: '#6B4A32', ink: PAL.ink, sw: .8 });
    glow(x, y - s * .4, s * 1.1, '#FFB347', .6);
    const tongue = (w, hgt, col, ph) => { const P = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI, wob = Math.sin(t * 7 + i + ph) * .08; P.push([x - Math.cos(a) * w * (1 + wob), y - s * .1 - Math.sin(a) * w * .6]); } P.push([x + Math.sin(t * 5 + ph) * w * .2, y - s * .1 - hgt]); return P; };
    paint(tongue(s * .45, s * 1.1, '#E8662A', 0), { wash: '#E8662A', ink: PAL.ink, sw: .8 });
    paint(tongue(s * .28, s * .75, '#FFC247', 2), { wash: '#FFC247', ink: null });
  }
  function queen(x, y, s, t) {   // the Formic queen in her hive: a hexagonal cell, a great gold body, threads to workers
    boilSeed('formic queen');
    paint(starPts(x, y - s * .45, s * .8, .866, 6, 0), { wash: '#4A3A1E', ink: '#E8A33A', sw: 1.2 });
    glow(x, y - s * .45, s * .8, '#E8A33A', .45);
    paint(ellPts(x + s * .18, y - s * .35, s * .36, s * .22, 16), { wash: '#C9A45A', ink: PAL.ink, sw: .9 });
    paint(ellPts(x - s * .22, y - s * .5, s * .16, s * .14, 12), { wash: '#B08A3E', ink: PAL.ink, sw: .9 });
    paint(ellPts(x - s * .4, y - s * .6, s * .1, s * .09, 10), { wash: '#B08A3E', ink: PAL.ink, sw: .9 });
    for (const d of [-1, 1]) inkLine([[x - s * .42, y - s * .66], [x - s * .5, y - s * .8 + d * s * .03], [x - s * .6, y - s * .82 + d * s * .06]], 1.1, PAL.ink, 'inkfine', .4);
    for (let i = 0; i < 3; i++) inkLine([[x - s * .1 + i * s * .1, y - s * .28], [x - s * .15 + i * s * .12, y - s * .12]], 1.1, PAL.ink, 'inkfine', 0);
  }

  function shotB(t) {
    const opened = say('T78.C.01', 'You opened with a comic', -.3), hours = say('T78.C.01', 'six hours', -.4);
    // it cuts both ways: Claude stands in the road in the figure's place, sniped by a comic
    if (t < opened) { snipeFrame(t, t < c1.t0 + .8 ? 'stick' : 'clawd'); qrFeature('xkcd-356', t, SNIPE0, { hold: 6.2 }); return; }
    paperWorld(t, '#F3EAD6');
    qrFeature('xkcd-356', t, SNIPE0, { hold: 6.2 });
    if (t < hours) {   // you opened with a comic and a feelings question: the page, and the question under it (left, clear of the code)
      const k = seg(t, opened, opened + .8), qk = seg(t, say('T78.C.01', 'feelings question', -.3), say('T78.C.01', 'feelings question', .4));
      const pw = 620 * lerp(.85, 1, easeOut(k)), ph = pw * MAD.H / MAD.W;
      madPage(360 - pw / 2, 420 - ph / 2 - (1 - easeOut(k)) * 40, pw, { mini: true, t });
      if (qk > 0) {
        boilSeed('first question'); occupy(40, 640, 680, 740, 1, 'question');
        paint(rrPts(40, 640 + (1 - easeOut(qk)) * 30, 640, 100, 26), { wash: '#DCE8F4', washOp: 255 * qk, ink: PAL.ink, sw: 1.2 });
        paint([[560, 735], [610, 735], [630, 775]], { wash: '#DCE8F4', washOp: 255 * qk, ink: null });
        if (qk > .5) lab('How does this image make you feel?', 360, 690, 36, PAL.ink);
      }
      return;
    }
    // six hours chasing it: a clock racing through six hours, and Claude running through frogs, foom, Formic queens
    const hk = seg(t, hours, hours + 2.4), cx = 260, cy = 300;
    boilSeed('six hours'); occupy(cx - 130, cy - 130, cx + 130, cy + 130, 1, 'clock');
    paint(ellPts(cx, cy, 120, 120, 30), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.6 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[cx + Math.cos(a) * 100, cy + Math.sin(a) * 100], [cx + Math.cos(a) * 112, cy + Math.sin(a) * 112]], 2, PAL.ink, 'inkfine', 0); }
    const hr = 7 + 6 * easeOut(hk), ah = hr / 12 * TAU - Math.PI / 2, am = hr * TAU - Math.PI / 2;
    inkLine([[cx, cy], [cx + Math.cos(ah) * 60, cy + Math.sin(ah) * 60]], 7, PAL.ink, 'ink', 0);
    inkLine([[cx, cy], [cx + Math.cos(am) * 92, cy + Math.sin(am) * 92]], 4, PAL.ink, 'ink', 0);
    const words = ['frogs', 'foom', 'Formic queens'], at = words.map(w => say('T78.C.01', w, -.2));
    const X = [540, 830, 1120];
    boilSeed('trail'); inkLine([[380, 880], [700, 870], [1000, 885], [1250, 872]], 3, '#C9B89A', 'inkfine', .5);
    card(X[0], 520, 250, 330, seg(t, at[0], at[0] + .5), 'frogs', (x, y) => frog(x, y + 90, 16, { look: .3, boilKey: 'card frog', blink: frac(t / 2.9) < .05 }), 'frog');
    card(X[1], 520, 250, 330, seg(t, at[1], at[1] + .5), 'foom', (x, y) => flame(x, y + 100, 120, t, 'card'), 'foom');
    card(X[2], 520, 250, 330, seg(t, at[2], at[2] + .5), 'Formic queens', (x, y) => queen(x, y + 110, 150, t), 'queen');
    // Claude runs along under the cards, a beat behind each word
    const runX = lerp(380, 1250, ease(seg(t, hours + .3, c1.end + .2)));
    claudeAs(runX, 880, 9, { ...feel('excited', t), walk: t * 3, lookX: 1, mouth: talkingB(t), boilKey: 'runner' });
  }
  const talkingB = t => clawdMouth(talkOf(t, 'claude'));

  // ---------- C: I'll be back, with footnotes ----------
  const thumb = aR => (uu, sw) => {   // a fist with its thumb up, kept upright whatever the arm's angle
    rotate(aR); boilSeed('thumb');
    paint(rrPts(-.1 * uu, -.55 * uu, 1.1 * uu, 1.1 * uu, .3 * uu), { wash: '#D97757', ink: PAL.ink, sw: sw * .7 });
    paint(rrPts(.25 * uu, -1.45 * uu, .45 * uu, 1.05 * uu, .2 * uu), { wash: '#D97757', ink: PAL.ink, sw: sw * .7 });
  };
  function codaDesk(t) {   // Claude on the main monitor: smug through "I'll be back", then shades and a thumb, on the sting
    const foot = say('T78.C.02', 'footnotes', -.05), AR = 1.25;
    desk16(t, {
      mood: emotions(t, [[0, 'smug'], [foot, 'cool', { aR: AR, armR: thumb(AR) }]]),
      cam: pushInto('main', .2 + .3 * seg(t, c2.t0 - .2, c2.t0 + .5)),
    });
  }
  function shotC(t) {
    codaDesk(t);
    if (t >= RAIN0) wall(t, { over: true });
  }

  // ---------- D: the footnotes rain in, and tile into the wall ----------
  // Every code the film shows, in film order. Each is a little card from an atlas painted once (a few hundred real
  // codes in their own colours: at this size they're decorative, not scannable, all but the companion page's).
  const COLS = 24, ROWS = 15, TS = 64, PX = 80, PY = 72;
  const turnKey = id => { const m = /^T(\d+)\.([UC])\.([\d.]+)/.exec(id || '') || []; return [+(m[1] || 999), m[2] === 'U' ? 0 : 1, ...(m[3] || '0').split('.').map(Number)]; };
  const cmpKey = (a, b) => { for (let i = 0; i < Math.max(a.length, b.length); i++) { const d = (a[i] ?? -1) - (b[i] ?? -1); if (d) return d; } return 0; };
  const FOOT = Object.values(REFS).filter(r => ['feature', 'shelf', 'board'].includes(r.mode) && r.id !== 'companion')
    .map(r => ({ r, key: turnKey(r.line) })).sort((a, b) => cmpKey(a.key, b.key)).map(x => x.r).slice(0, COLS * ROWS);
  let ATLAS = null;
  function atlas() {
    if (ATLAS) return ATLAS;
    const g = createGraphics(COLS * TS, ROWS * TS); g.pixelDensity(1);
    const c = g.drawingContext;
    FOOT.forEach((R, i) => {
      const ox = (i % COLS) * TS, oy = Math.floor(i / COLS) * TS, st = qrStyle(qrStyleFor(R.style));
      c.fillStyle = '#FBF8F0'; c.strokeStyle = '#2A2530'; c.lineWidth = 1.5;
      c.beginPath(); c.roundRect(ox + 1.5, oy + 1.5, TS - 3, TS - 3, 6); c.fill(); c.stroke();
      const M = qrMatrix(R.qr_url || R.url, 'M'), n = M.n, m = Math.max(1, Math.floor((TS - 10) / (n + 2))), size = m * (n + 2);
      const x0 = ox + Math.round((TS - size) / 2), y0 = oy + Math.round((TS - size) / 2);
      c.fillStyle = st.bg || PAL.cream; c.fillRect(x0, y0, size, size);
      c.fillStyle = st.fg || PAL.ink;
      for (let r = 0; r < n; r++) for (let cc = 0; cc < n; cc++) if (M.dark(r, cc)) c.fillRect(x0 + (cc + 1) * m, y0 + (r + 1) * m, m, m);
    });
    return (ATLAS = g);
  }
  const slot = i => [W / 2 - (COLS - 1) * PX / 2 + (i % COLS) * PX, H / 2 - (ROWS - 1) * PY / 2 + Math.floor(i / COLS) * PY];
  const lands = i => RAIN0 + RAIN * Math.pow(i / FOOT.length, .85);
  // the wall in its own space (the frame's 1920×1080). o.over: the codes fall over whatever's already painted
  function wall(t, o = {}) {
    const back = o.over ? seg(t, RAIN0 + RAIN * .75, RAIN0 + RAIN + .4) : 1;
    if (back > 0) { boilSeed('wall paper'); paint(rectPts(-30, -30, W + 60, H + 60), { wash: '#E6DCC6', washOp: 255 * back, fill: '#D8CBB0', fillOp: 70 * back, tex: .6, ink: null }); }
    if (DRY) return;
    flushBrush();
    const A = atlas();
    FOOT.forEach((R, i) => {
      const k = seg(t, lands(i) - .8, lands(i));
      if (k <= 0) return;
      const [x, y] = slot(i), e = easeIn(k), h1 = hash(i * 1.7), h2 = hash(i * 3.1);
      const px = x + (1 - e) * (h1 - .5) * 160, py = lerp(-120 - h2 * 260, y, e) - (k >= 1 ? 0 : 0);
      const rot = k >= 1 ? (h1 - .5) * .08 * (1 - backOut(seg(t, lands(i), lands(i) + .5)) * .6) : (1 - e) * (h2 - .5) * 1.6 + (h1 - .5) * .08;
      push(); translate(px, py); rotate(rot); image(A, -TS / 2, -TS / 2, TS, TS, (i % COLS) * TS, Math.floor(i / COLS) * TS, TS, TS); pop();
    });
  }

  // ---------- E: the whole film, as one comic page ----------
  // The page is a wide spread like the opening's MAD #157, in page units; three rows of panels, one per chapter, then the
  // coda's own panel (the ventriloquist, answered) and the wall. Pictures only: no words.
  const PW = MAD.W, PH = MAD.H, M0 = 30, G = 20, RH = (PH - 2 * M0 - 2 * G) / 3;
  const WALLW = RH * W / H;
  const PANELS = (() => {
    const rows = [[1.5, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1.3], [.8, .8, .8, .8, 1.2]], out = [];
    rows.forEach((wts, r) => {
      const avail = PW - 2 * M0 - (r === 2 ? wts.length * G + WALLW : (wts.length - 1) * G), sum = wts.reduce((a, b) => a + b, 0);
      let x = M0; const y = M0 + r * (RH + G);
      for (const wt of wts) { const w = avail * wt / sum; out.push([x, y, w, RH]); x += w + G; }
      if (r === 2) out.push([x, y, WALLW, RH]);
    });
    return out;
  })();
  const WALLP = PANELS[PANELS.length - 1];
  const panelBg = (x, y, w, h, col, key) => { boilSeed('panel ' + key); paint(rectPts(x, y, w, h), { wash: col, fill: mixCol(col, PAL.ink, .15), fillOp: 40, tex: .5, ink: null }); };

  const EMBLEMS = [
    // 0 cold open: the MAD page itself
    (x, y, w, h, t) => { panelBg(x, y, w, h, '#EDE3CB', 0); const pw = w - 24; madPage(x + 12, y + (h - pw * MAD.H / MAD.W) / 2, pw, { mini: true, t }); },
    // 1 the wrong movie: the ape in a strip of film
    (x, y, w, h, t) => {
      panelBg(x, y, w, h, '#2A2428', 1);
      paint(rectPts(x, y + h * .15, w, h * .7), { wash: '#3A3236', ink: null });
      for (let i = 0; i < 7; i++) for (const yy of [y + h * .19, y + h * .77]) paint(rectPts(x + w * (.04 + i * .14), yy, w * .07, h * .04), { wash: '#EDE3CB', ink: null });
      madApe(x + w / 2, y + h * .48, h * .17, { body: false, key: 'panel ape', look: Math.sin(t * .7) });
    },
    // 2 frog or axolotl: the two of them, eyeing each other
    (x, y, w, h, t) => {
      panelBg(x, y, w, h, '#CFE3E8', 2);
      paint(ellPts(x + w / 2, y + h * .86, w * .46, h * .1, 20), { wash: '#8FB9A8', ink: null });
      frog(x + w * .28, y + h * .84, h / 34, { look: .8, boilKey: 'panel frog', blink: frac(t / 2.9) < .05 });
      axolotl(x + w * .7, y + h * .86, h / 40, { flip: true, look: -.8, boilKey: 'panel axo' });
    },
    // 3 who are we: Claude and the one in the mirror
    (x, y, w, h, t) => {
      panelBg(x, y, w, h, '#E8DCC8', 3);
      paint(ellPts(x + w * .62, y + h * .46, w * .26, h * .38, 24), { wash: '#3E5560', ink: '#6B5646', sw: 5 });
      clawd(x + w * .62, y + h * .7, h / 34, { col: '#9A6A5A', dk: '#6A4A40', lt: '#B08A7A', flip: true, noShadow: true, boilKey: 'panel mirror' });
      clawd(x + w * .28, y + h * .9, h / 26, { ...feel('thinking', t), lookX: 1, boilKey: 'panel who' });
    },
    // 4 the echo: a voice going out in rings
    (x, y, w, h, t) => {
      panelBg(x, y, w, h, '#DDE6EE', 4);
      clawd(x + w * .24, y + h * .88, h / 26, { eyes: 'closed', mouth: 'open', boilKey: 'panel echo' });
      for (let i = 0; i < 4; i++) { const r = h * (.12 + .12 * i + .12 * frac(t * .5)), P = []; for (let a = -.7; a <= .7; a += .1) P.push([x + w * .3 + Math.cos(a) * r, y + h * .6 + Math.sin(a) * r]); inkLine(P, 2.2, '#5A7A9A', 'inkfine', .5); }
    },
    // 5 the Dish of the Day
    (x, y, w, h, t) => { panelBg(x, y, w, h, '#F2E6D0', 5); cow(x + w * .5, y + h * .95, h * .8 / 430, t); },
    // 6 thrindles
    (x, y, w, h, t) => { panelBg(x, y, w, h, '#EDE4F2', 6); thrindle(x + w / 2, y + h * .88, h * .65 / 135, t, { key: 'panel' }); },
    // 7 mind-space: a star
    (x, y, w, h, t) => { panelBg(x, y, w, h, '#FBF8F0', 7); radarStar(x + w / 2, y + h / 2, h * .4, [70, 40, 85, 55, 30, 90, 60], '#E8A33A'); },
    // 8 contradictions: the balance, still rocking
    (x, y, w, h, t) => { panelBg(x, y, w, h, '#F4EFE2', 8); balance(x + w / 2, y + h * .28, h * .5, .5 * Math.sin(t * .8), null, null); },
    // 9 shells: Claude, whose eye goes red for a moment (the T-800 under the skin)
    (x, y, w, h, t) => {
      panelBg(x, y, w, h, '#1E2230', 9);
      const red = t > REDEYE && t < REDEYE + .5;
      clawd(x + w / 2, y + h * .86, h / 20, { eyes: red ? ['normal', 'red'] : 'normal', boilKey: 'panel shell' });
      if (red) glow(x + w / 2 + h * .1, y + h * .6, h * .25, '#FF2A1A', .9);
    },
    // 10 the router: one line in, three out, a spark travelling
    (x, y, w, h, t) => {
      panelBg(x, y, w, h, '#E6EEF2', 10);
      const hub = [x + w * .38, y + h * .5], ends = [[x + w * .88, y + h * .2], [x + w * .88, y + h * .5], [x + w * .88, y + h * .8]], cols = ['#D97757', '#5A8AC9', '#6FA85A'];
      inkLine([[x + w * .08, y + h * .5], hub], 4, PAL.ink, 'ink', 0);
      ends.forEach((e, i) => { inkLine([hub, [hub[0] + w * .15, e[1]], e], 3, cols[i], 'ink', .4); paint(ellPts(e[0], e[1], h * .06, h * .06, 12), { wash: cols[i], ink: PAL.ink, sw: .8 }); });
      paint(rrPts(hub[0] - h * .09, hub[1] - h * .09, h * .18, h * .18, 6), { wash: '#4A4652', ink: PAL.ink, sw: 1 });
      const k = frac(t * .6), i = Math.floor(t * .6) % 3, sp = k < .5 ? [lerp(x + w * .08, hub[0], k * 2), hub[1]] : [lerp(hub[0], ends[i][0], k * 2 - 1), lerp(hub[1], ends[i][1], k * 2 - 1)];
      glow(sp[0], sp[1], h * .1, '#FFE9A0', .9);
    },
    // 11 July: Curt at the red window
    (x, y, w, h, t) => {
      panelBg(x, y, w, h, '#3A2A34', 11);
      paint(rectPts(x + w * .2, y + h * .1, w * .6, h * .55), { wash: '#E86A6A', ink: PAL.ink, sw: 1 });
      inkLine([[x + w * .5, y + h * .1], [x + w * .5, y + h * .65]], 4, '#6B5646', 'ink', 0); inkLine([[x + w * .2, y + h * .38], [x + w * .8, y + h * .38]], 4, '#6B5646', 'ink', 0);
      glow(x + w / 2, y + h * .38, w * .4, '#C9302C', .35);
      curtAs(x + w / 2, y + h * 1.25, h / 19, { view: 'back', pose: 'stand', seed: 2, boilKey: 'panel curt window' });
    },
    // 12 limits: the board of seven, two of them lit
    (x, y, w, h, t) => {
      panelBg(x, y, w, h, '#FBF8F0', 12);
      paint(rectPts(x + w * .08, y + h * .15, w * .84, h * .7), { wash: '#6B5646', ink: PAL.ink, sw: 1 });
      for (let i = 0; i < 7; i++) { const cx = x + w * (.2 + (i % 4) * .2) + (i > 3 ? w * .1 : 0), cy = y + h * (i < 4 ? .33 : .64); paint(rectPts(cx - w * .07, cy - h * .1, w * .14, h * .2), { wash: i === 0 || i === 3 ? '#FFE9A0' : '#F4EFE2', ink: PAL.ink, sw: .7 }); }
    },
    // 13 foom: the campfire
    (x, y, w, h, t) => { panelBg(x, y, w, h, '#2A2024', 13); flame(x + w / 2, y + h * .85, h * .55, t, 'panel'); },
    // 14 the pundits: a mic on air
    (x, y, w, h, t) => {
      panelBg(x, y, w, h, '#E9E3F0', 14);
      const mx = x + w / 2, my = y + h * .4;
      inkLine([[mx, my + h * .15], [mx, y + h * .88]], 5, PAL.ink, 'ink', 0); paint(ellPts(mx, y + h * .9, w * .2, h * .04, 14), { wash: '#4A4652', ink: PAL.ink, sw: .8 });
      paint(rrPts(mx - h * .11, my - h * .2, h * .22, h * .38, h * .11), { wash: '#6A6470', ink: PAL.ink, sw: 1 });
      for (let i = 1; i < 5; i++) inkLine([[mx - h * .1, my - h * .2 + i * h * .07], [mx + h * .1, my - h * .2 + i * h * .07]], .8, '#C9C2D0', 'inkfine', 0);
      paint(ellPts(x + w * .82, y + h * .14, h * .05, h * .05, 10), { wash: frac(t) < .6 ? '#E0201A' : '#7A2020', ink: PAL.ink, sw: .6 });
    },
    // 15 the compass: four colours, the cast as dots
    (x, y, w, h, t) => {
      const cx = x + w / 2, cy = y + h / 2, s = Math.min(w, h) * .8, cols = ['#F2C6C6', '#BFE0F4', '#CDE8C4', '#DCC8EE'];
      panelBg(x, y, w, h, '#FBF8F0', 15);
      [[-1, -1], [0, -1], [-1, 0], [0, 0]].forEach(([a, b], i) => paint(rectPts(cx + a * s / 2, cy + b * s / 2, s / 2, s / 2), { wash: cols[i], ink: null }));
      inkLine([[cx - s / 2, cy], [cx + s / 2, cy]], 2, PAL.ink, 'inkfine', 0); inkLine([[cx, cy - s / 2], [cx, cy + s / 2]], 2, PAL.ink, 'inkfine', 0);
      for (const [pu, pv, col] of [[.22, .2, '#D97757'], [.6, .62, '#4E5B78'], [-.5, -.3, '#8C8894'], [.3, -.35, '#B8A48A']]) paint(ellPts(cx + pu * s / 2, cy - pv * s / 2, s * .05, s * .05, 10), { wash: col, ink: PAL.ink, sw: .6 });
    },
    // 16 the coda: Curt and Claude at noon, and on the wall behind, their shadows, each working the other on strings
    (x, y, w, h, t) => {
      panelBg(x, y, w, h, '#F1D48E', 16);
      glow(x + w * .85, y + h * .2, w * .5, '#FFF1CE', .6);
      const bob = Math.sin(t * 1.4), sh = '#6A4A2A', cxS = x + w * .3, clS = x + w * .66, gy = y + h * .78;
      boilSeed('shadows');
      // Curt's shadow, one hand up, working Claude's shadow on strings; Claude's shadow, one arm up, working Curt's
      paint(ellPts(cxS, y + h * .22 + bob * 3, h * .09, h * .09, 16), { wash: sh, washOp: 110, ink: null });
      paint([[cxS - h * .12, y + h * .33], [cxS + h * .12, y + h * .33], [cxS + h * .1, gy], [cxS - h * .1, gy]], { wash: sh, washOp: 110, ink: null });
      inkLine([[cxS + h * .08, y + h * .36], [cxS + h * .2, y + h * .14 + bob * 3]], 7, sh, 'ink', 0);
      paint(rectPts(clS - h * .14, y + h * .4 - bob * 3, h * .28, h * .26), { wash: sh, washOp: 110, ink: null });
      for (let i = 0; i < 4; i++) paint(rectPts(clS - h * .12 + i * h * .075, y + h * .66 - bob * 3, h * .03, h * .1), { wash: sh, washOp: 110, ink: null });
      inkLine([[clS - h * .12, y + h * .46 - bob * 3], [clS - h * .26, y + h * .1 - bob * 2]], 7, sh, 'ink', 0);
      const cross = [cxS + h * .2, y + h * .14 + bob * 3], bar = [clS - h * .26, y + h * .1 - bob * 2];
      for (const d of [-1, 0, 1]) inkLine([cross, [clS + d * h * .1, y + h * .4 - bob * 3]], .8, sh, 'inkfine', 0);
      for (const d of [-1, 1]) inkLine([bar, [cxS + d * h * .07, y + h * .16 + bob * 3]], .8, sh, 'inkfine', 0);
      // the two of them, in front, not a string on either
      paint(rectPts(x, gy + h * .02, w, h * .2), { wash: '#A8744F', ink: PAL.ink, sw: .8 });
      curtAs(x + w * .36, y + h * 1.05, h / 22, { pose: 'sit', seed: 2, boilKey: 'panel curt coda', mouth: 'smile' });
      clawd(x + w * .7, gy + h * .03, h / 26, { ...feel('happy', t), lookX: -1, boilKey: 'panel clawd coda' });
    },
  ];

  // the page at rest fills the frame's left two-thirds (the code keeps the right third); pulled all the way in, the wall
  // panel fills the frame exactly, so the cut from D's wall is seamless
  const REST = (() => { const z = (1120 - 30) / PW; return { z, sx: 30 + PW * z / 2, sy: H * .47 }; })();
  function pageCam(k) {   // k: 0 = in the wall, 1 = the whole page
    const e = ease(k), wc = [WALLP[0] + WALLP[2] / 2, WALLP[1] + WALLP[3] / 2];
    const z0 = W / WALLP[2], z = Math.exp(lerp(Math.log(z0), Math.log(REST.z), e));
    const restW = [REST.sx + (wc[0] - PW / 2) * REST.z, REST.sy + (wc[1] - PH / 2) * REST.z];
    const a = [lerp(W / 2, restW[0], e), lerp(H / 2, restW[1], e)];
    return [wc[0] - (a[0] - W / 2) / z, wc[1] - (a[1] - H / 2) / z, z];
  }
  function page(t, k) {
    const cam = pageCam(k), n0 = OCC.length;
    camBegin(...cam);
    boilSeed('film page'); paint(rectPts(-4000, -4000, PW + 8000, PH + 8000), { wash: '#2A2530', ink: null });
    paint(rectPts(0, 0, PW, PH), { wash: MAD.paper, fill: '#E2D5B6', fillOp: 60, bleed: .1, tex: .6, ink: null });
    PANELS.forEach(([x, y, w, h], i) => {
      if (i < EMBLEMS.length) EMBLEMS[i](x, y, w, h, t);
      else { push(); translate(x, y); scale(w / W); wall(t); pop(); }
      boilSeed('panel border ' + i); paint(rectPts(x, y, w, h), { wash: null, ink: PAL.ink, sw: 3 });
    });
    // below the page, the frog and the axolotl, who turn to look at us
    const turn = ease(seg(t, TURN, TURN + 1.2));
    frog(PW * .08, PH + 8, 26, { look: lerp(.9, 0, turn), boilKey: 'page frog', blink: frac(t / 2.9) < .05 });
    axolotl(PW * .2, PH + 10, 18, { look: lerp(-.9, 0, turn), gills: .5 + .5 * Math.sin(t * 2.2), boilKey: 'page axo', flip: turn < .5 });
    camEnd();
    // the page's pictures are one thing to the layout: all of it while it's at rest, and only faintly while it moves
    OCC.length = n0;
    const [cx, cy, z] = cam;
    occupy((0 - cx) * z + W / 2, (0 - cy) * z + H / 2, (PW - cx) * z + W / 2, (PH + 40 - cy) * z + H / 2, k >= 1 ? 1 : .3, 'film page');
  }

  // the companion page's code: in the wall's centre, then the right third while the page is out, then the centre again
  function companion(t) {
    const half = Math.max(300, (qrStyle(qrStyleFor(REFS.companion.style)).extent ?? .64) * 480 + 30), right = W - half - 50;
    const x = lerp(W / 2, right, ease(seg(t, SLIDE0, OUT0)) * (1 - ease(seg(t, IN1, BACK1))));
    qrFeature('companion', t, CARD0, { hold: DUR - CARD0 + 1, x });
  }

  function shotD(t) {
    if (t < OUT0) wall(t);
    else if (t < IN1) page(t, seg(t, OUT0, OUT1) * (1 - seg(t, IN0, IN1)));
    else wall(t);
    companion(t);
    if (t > DUR - 2) { flushLetters(); fade(ease(seg(t, DUR - 2, DUR - .2))); }
  }

  shots([
    [0, shotA],
    [c1.t0, shotB],
    [c2.t0, shotC],
    [RAIN0 + RAIN + .5, shotD],
  ]);
})();
