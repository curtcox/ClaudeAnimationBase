// ch06_thrindles.js: chapter 6 (T30–T34). Storyboard: docs/storyboards/ch06_thrindles.md.
// A comment thread says LLMs have no concepts; Curt asks to be tested. The thrindle, an invented creature, is the probe
// (and the chapter's gauge: it shrinks as a crowd grows around it). Then Claude argues the other side, and loses, fairly,
// on everything but grounding. The pasted thread is a corkboard of its three comments, with one code: the explainer page
// that holds the video, the comments and every link (Curt's call; their own links are refs mode: page).
(() => {
  const HOUR = 11;
  const CW = 1290, CX = CW / 2;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const win = (t, a, b, d = .5) => seg(t, a, a + d) * (1 - seg(t, b, b + d));

  // tiny figures crowding round a point: n of them (0..16), k how close they've come
  function crowdAround(x, y, n, k, t, key = '') {
    boilSeed('crowd round ' + key);
    for (let i = 0; i < n; i++) {
      const a = i / 16 * TAU + hash(i) * .3, r = lerp(400, 120 + 40 * (i % 3), ease(k));
      const px = x + Math.cos(a) * r, py = y - 40 + Math.sin(a) * r * .45;
      paint(ellPts(px, py - 44, 14, 14, 10), { wash: ['#E8C4A0', '#7A5238', '#C99A6E'][i % 3], ink: PAL.ink, sw: .6 });
      paint(rrPts(px - 14, py - 30, 28, 40, 8), { wash: ['#3A6FC9', '#C9302C', '#5A9A4A', '#E8C27A'][i % 4], ink: PAL.ink, sw: .6 });
    }
  }
  const card = (x, y, txt, k = 1, o = {}) => indexCard(x, y, o.w || 360, o.h || 220, [txt], { key: 'probe ' + txt, title: true, align: 'center', size: o.size || 40, k, rot: o.rot || 0, top: .5, ...o });
  function stamp(txt, x, y, k, col = '#C9302C', rot = -.1) {   // a rubber-stamp impression landing
    if (k <= 0) return;
    const p = backOut(k);
    boilSeed('stamp ' + txt);
    push(); translate(x, y); rotate(rot); scale(lerp(1.6, 1, p));
    paint(rrPts(-txt.length * 11 - 20, -36, txt.length * 22 + 40, 72, 10), { wash: null, ink: col, sw: 2.4 });
    pop();
    lab(txt, x, y, 40, col, { rot, alpha: clamp(k * 3), pop: p });
  }
  function tick(x, y, k) { if (k <= 0) return; boilSeed('tick ' + x); paint(rectPts(x - 40, y - 40, 80, 80), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.3 }); inkLine([[x - 24, y], [x - 6, y + 22], [lerp(x - 6, x + 30, k), lerp(y + 22, y - 30, k)]], 5, '#3A8A4A', 'ink', 0); }
  function radio(x, y, t) {   // a WWII field radio, a gloved hand on the handset (no face)
    boilSeed('field radio'); occupy(x - 170, y - 180, x + 200, y + 120, 1, 'radio');
    paint(rrPts(x - 160, y - 100, 320, 210, 12), { wash: '#6B6A3A', fill: '#4E4E2A', fillOp: 80, tex: .5, ink: PAL.ink, sw: 1.3 });
    for (let i = 0; i < 3; i++) paint(ellPts(x - 90 + i * 70, y - 30, 20, 20, 12), { wash: '#2A2A1E', ink: PAL.ink, sw: .8 });
    inkLine([[x + 120, y - 100], [x + 150, y - 260]], 3, PAL.ink, 'ink', 0);
    inkLine([[x - 160, y + 20], [x - 230, y - 20], [x - 250, y - 120]], 2, PAL.ink, 'ink', .4);
    paint(rrPts(x - 290, y - 200, 80, 110, 20), { wash: '#2A2A1E', ink: PAL.ink, sw: 1 });
    paint(rrPts(x - 320, y - 160, 90, 80, 30), { wash: '#6B5A3A', ink: PAL.ink, sw: 1 });   // the glove
  }
  function lighthouse(x, y, t, o = {}) {
    boilSeed('lighthouse'); occupy(x - 90, y - 520, x + 90, y, 1, 'lighthouse');
    paint([[x - 70, y], [x + 70, y], [x + 45, y - 420], [x - 45, y - 420]], { wash: '#FBF8F0', ink: PAL.ink, sw: 1.3 });
    for (let i = 0; i < 3; i++) paint([[x - 67 + i * 8, y - 60 - i * 130], [x + 67 - i * 8, y - 60 - i * 130], [x + 63 - i * 8, y - 110 - i * 130], [x - 63 + i * 8, y - 110 - i * 130]], { wash: '#C9302C', ink: null });
    paint(rectPts(x - 50, y - 500, 100, 80), { wash: '#FFE9A0', ink: PAL.ink, sw: 1.2 }); paint([[x - 60, y - 500], [x + 60, y - 500], [x, y - 550]], { wash: '#26222A', ink: PAL.ink, sw: 1 });
    if (o.beam) { const a = t * .8; push(); paint([[x, y - 460], [x + Math.cos(a) * 1300, y - 460 + Math.sin(a) * 80 - 60], [x + Math.cos(a) * 1300, y - 460 + Math.sin(a) * 80 + 60]], { wash: '#FFF1C4', washOp: 110, ink: null }); pop(); }
  }
  function ship(x, y, s = 1, key = '') { boilSeed('ship ' + key); paint([[x - 50 * s, y], [x + 50 * s, y], [x + 35 * s, y + 22 * s], [x - 35 * s, y + 22 * s]], { wash: '#6B5646', ink: PAL.ink, sw: .8 }); paint([[x, y - 60 * s], [x, y], [x + 36 * s, y]], { wash: '#FBF8F0', ink: PAL.ink, sw: .7 }); }
  function sea(t) { boilSeed('sea'); paint(rectPts(-40, 620, W + 80, 500), { wash: '#4F88A9', fill: '#3A6F8A', fillOp: 90, tex: .5, ink: null }); }
  function jam(x0, x1, y, n, t, key = '') {   // a rush-hour jam: cars bumper to bumper, barely moving
    boilSeed('jam ' + key); paint(rectPts(x0 - 20, y - 70, x1 - x0 + 40, 140), { wash: '#6A6470', ink: null });
    for (let i = 0; i < n; i++) { const x = x0 + i * (x1 - x0) / n + ((t * 6) % 20); paint(rrPts(x, y - 40, (x1 - x0) / n - 14, 60, 12), { wash: ['#C9302C', '#3A6FC9', '#E8C27A', '#FBF8F0', '#5A9A4A'][i % 5], ink: PAL.ink, sw: .8 }); }
  }
  function mortarboard(x, y, u) {   // on Claude's head (y: Claude's ground point)
    boilSeed('mortarboard'); const hy = y - 8.2 * u;
    paint([[x - 4 * u, hy], [x, hy - 1.2 * u], [x + 4 * u, hy], [x, hy + 1.2 * u]], { wash: '#26222A', ink: PAL.ink, sw: 1 });
    paint(rectPts(x - 2 * u, hy, 4 * u, 1.2 * u), { wash: '#26222A', ink: null });
    inkLine([[x, hy], [x + 3 * u, hy + .6 * u], [x + 3 * u, hy + 2.4 * u]], 2, '#E8C27A', 'ink', .3);
  }
  function cabinet(x, y, n, t, o = {}) {   // a filing cabinet running into the distance (Blockhead's table); o.clerk
    boilSeed('cabinet'); occupy(x - 20, y - 380, 1250, y + 20, 1, 'cabinet');
    for (let i = n - 1; i >= 0; i--) {
      const s = Math.pow(.82, i), cx = x + (1 - s) * 900, h = 360 * s, w = 150 * s;
      paint(rectPts(cx, y - h * (1 - (1 - s) * .3), w, h), { wash: '#8C8894', ink: PAL.ink, sw: .9 * s + .2 });
      for (let d = 0; d < 4; d++) { paint(rectPts(cx + 8 * s, y - h + 10 * s + d * h / 4, w - 16 * s, h / 4 - 14 * s), { wash: '#A9A6A2', ink: PAL.ink, sw: .5 }); paint(rectPts(cx + w / 2 - 12 * s, y - h + d * h / 4 + h / 8, 24 * s, 6 * s), { wash: '#E8C27A', ink: null }); }
    }
    if (o.clerk) { curtAs(x - 60, y + 10, 11, { pose: 'stand', view: 'q', seed: 7, boilKey: 'clerk', look: 1 }); paint(rectPts(x + 10 + 30 * Math.sin(t * 2), y - 240, 70, 44), { wash: '#FBF6E6', ink: PAL.ink, sw: .8 }); }
  }
  function chineseRoom(x, y, t) {   // a small room with a slot; inside, someone matches symbols from a rulebook
    boilSeed('chinese room'); occupy(x - 170, y - 160, x + 170, y + 130, 1, 'room');
    paint(rectPts(x - 160, y - 150, 320, 270), { wash: '#D9CDB8', ink: PAL.ink, sw: 1.3 });
    paint(rectPts(x - 140, y - 130, 280, 230), { wash: '#F4EFE2', ink: null });
    paint(rectPts(x - 170, y - 40, 30, 16), { wash: '#26222A', ink: null });
    curt(x - 30, y + 90, 6, { pose: 'sit', view: 'q', seed: 4, boilKey: 'room man', look: .5, ...crowdLook(3) });
    paint(rectPts(x + 20, y + 10, 90, 60), { wash: '#C9302C', ink: PAL.ink, sw: .8 });
    const k = frac(t * .5); paint(rectPts(lerp(x - 220, x - 150, k), y - 42, 40, 20), { wash: '#FBF8F0', ink: PAL.ink, sw: .6 });
  }

  // ---------- the corkboard: the pasted thread as three pinned cards; its one code is the explainer's ----------
  const COMMENTS = [
    { handle: '@ZM-dm3jg', body: ["He lost me when he said LLMs don't have any concepts"], cue: 'Z M:' },
    { handle: '@OntologyExplained', body: ['I would love to know what concepts they have!'], cue: 'Ontology Explained: I would' },
    { handle: '@CurtCox', body: ['@OntologyExplained Perhaps we just have different', 'concepts of concepts. Propose some questions to pose', "to me and different LLMs. Maybe I don't have", 'concepts, either.'], cue: 'Curt Cox:' },
  ];
  function corkboard(t, end) {
    boilSeed('cork'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#B98A5E', fill: '#9A6E48', fillOp: 110, tex: .9, bleed: .2, ink: null });
    for (let i = 0; i < 90; i++) paint(ellPts(hash(i) * W, hash(i + 90) * H, 4, 3, 6), { wash: '#7A5238', washOp: 120, ink: null });
    // the code sits high, clear of the caption band, so the caption can run the frame's width (Curt, ch 6 review)
    qrFeature('note-the-debate', t, say('T30.U.01', 'Z M:', .6), { hold: end - say('T30.U.01', 'Z M:', .6) - .5, y: 380 });
    // tiled: each card overlaps only the blank lower part of the one before, so every word stays readable and the
    // three end well above the caption
    let top = 40;
    COMMENTS.forEach((c, i) => {
      const t0 = say('T30.U.01', c.cue, -.3), k = seg(t, t0, t0 + .5), y = top + 150, x = 60 + i * 50;
      top += 120 + c.body.length * 44;
      if (k <= 0) return;
      boilSeed('comment ' + i); occupy(x, y - 150, x + 840, y + 150, 1, 'comment card');
      const dy = (1 - easeOut(k)) * -60;
      paint(rrPts(x, y - 150 + dy, 840, 300, 10), { wash: '#FBF6E6', ink: PAL.ink, sw: 1.2 });
      paint(ellPts(x + 420, y - 138 + dy, 12, 12, 10), { wash: '#C9302C', ink: PAL.ink, sw: .8 });   // the pin
      paint(ellPts(x + 60, y - 90 + dy, 30, 30, 14), { wash: ['#8C8894', '#3A6F8A', '#3A6FC9'][i], ink: null });
      lab(c.handle, x + 110, y - 92 + dy, 34, PAL.ink, { align: 'left', font: 'bold 34px "Patrick Hand", sans-serif' });
      lab('2 days ago', x + 110 + c.handle.length * 17 + 30, y - 90 + dy, 26, '#8C8894', { align: 'left' });
      c.body.forEach((ln, j) => lab(ln, x + 40, y - 30 + j * 44 + dy, 32, '#26222A', { align: 'left' }));
    });
  }

  // ---------- shots ----------
  // A: the thread: the debate on a side monitor; the corkboard of comments; "Probe me.": Claude gathers
  function shotA(t) {
    const u = L('T30.U.01'), board = say('T30.U.01', 'Z M:', -.6), end = say('T30.U.01', 'Care to try your hand', -.2), probe = say('T30.U.01', 'Probe me', -.3);
    if (t >= board && t < end + .6) { corkboard(t, end + .6); if (t < board + .5) fade(1 - seg(t, board, board + .5), '#2A2530'); return; }
    const tv = (x, y, w, h) => {   // the debate: a painted TV frame, two generic seated figures, the title card
      paint(rectPts(x, y, w, h), { wash: '#2A2530', ink: null });
      paint(rectPts(x + w * .06, y + h * .08, w * .88, h * .84), { wash: '#4E5B78', ink: null });
      for (const d of [-1, 1]) { paint(ellPts(x + w * (.5 + d * .22), y + h * .45, w * .06, w * .06, 12), { wash: '#E2BE98', ink: null }); paint(rrPts(x + w * (.5 + d * .22) - w * .08, y + h * .55, w * .16, h * .3, 8), { wash: d < 0 ? '#26222A' : '#8C8894', ink: null }); }
      paint(rectPts(x + w * .1, y + h * .1, w * .8, h * .14), { wash: '#FBF8F0', ink: null });
    };
    deskShot(t, { hour: HOUR, typing: t < u.t1, assemble: t < probe ? .15 : seg(t, probe, probe + 1.4), mood: emotions(t, [[0, 'neutral'], [probe + 1.2, 'determined']]),
      screens: { left: { kind: 'fn', fn: tv, glow: '#9DB4BE' } } });
    if (t < board) { const [x, y, w, h] = screenRect('left'); lab('Will AI Kill Everyone by 2050?', x + w / 2, y + h * .17, 20, PAL.ink); }
    if (t < .6) brushWipe(.5 + t / 1.2);
  }
  // B: the method (a key in strange locks); the thrindle appears, and shrinks as a crowd gathers; the three probe cards
  function shotB(t) {
    const c1 = L('T30.C.01'), c2 = L('T30.C.02'), c3 = L('T30.C.03'), inside = c1.t0 + .7;
    if (t < inside) { deskShot(t, { hour: HOUR, mood: emotions(t, [[0, 'determined']]), cam: pushInto('main', seg(t, c1.t0 - .1, inside)) }); return; }
    paperWorld(t);
    if (t < c2.t0) {   // apply an idea to cases you've never seen: a key tried in three strange locks, turning in each
      const k = (t - inside) / ((c2.t0 - inside) / 3), i = Math.min(2, Math.floor(k)), f = frac(Math.min(k, 2.999));
      for (let j = 0; j < 3; j++) {
        const x = 250 + j * 400; boilSeed('lock ' + j); occupy(x - 110, 320, x + 110, 640, 1, 'lock');
        paint(j === 0 ? ellPts(x, 480, 110, 150, 24) : j === 1 ? rectPts(x - 100, 330, 200, 300) : starPts(x, 480, 150, .6, 6), { wash: ['#C9A45A', '#8C8894', '#6FA8C9'][j], ink: PAL.ink, sw: 1.3 });
        paint(rrPts(x - 10, 450, 20, 60, 8), { wash: PAL.ink, ink: null });
      }
      const x = 250 + i * 400, turn = seg(f, .5, .8) * Math.PI / 2;
      boilSeed('key'); push(); translate(lerp(x + 260, x + 20, ease(seg(f, 0, .45))), 480); rotate(turn);
      paint(ellPts(90, 0, 40, 40, 16), { wash: '#E8C27A', ink: PAL.ink, sw: 1.1 }); paint(rectPts(0, -8, 60, 16), { wash: '#E8C27A', ink: PAL.ink, sw: 1 });
      pop();
      return;
    }
    if (t < c3.t0) {   // a thrindle: less useful the more people use it at once. A highway at rush hour; a shared Wi-Fi network
      const crowd = seg(t, say('T30.C.02', 'the more people use it', -.3), say('T30.C.02', 'use it at once', .3));
      const hw = win(t, say('T30.C.02', 'A highway', -.2), say('T30.C.02', 'So is a shared', -.3)), wifi = seg(t, say('T30.C.02', 'shared Wi-Fi', -.3), say('T30.C.02', 'shared Wi-Fi', .3));
      lab('thrindle', 645, 180, 72, THR_DK, { pop: seg(t, c2.t0 + .3, c2.t0 + .8) });
      if (hw <= 0 && wifi <= 0) { crowdAround(645, 700, Math.round(16 * crowd), crowd, t, 'probe1'); thrindle(645, 700, lerp(2.2, .6, ease(crowd)), t, { key: 'b' }); }
      if (hw > 0) jam(120, 1170, 560, 9, t, 'b');
      if (wifi > 0) {
        boilSeed('wifi'); const bars = Math.max(0, 4 - Math.floor(wifi * 5));
        for (let i = 0; i < 4; i++) paint(rectPts(560 + i * 50, 480 - i * 50, 36, 60 + i * 50), { wash: i < bars ? '#3A9FC9' : '#E2D8C4', ink: PAL.ink, sw: .8 });
        for (let i = 0; i < Math.floor(wifi * 6); i++) { const x = 150 + i * 180; paint(rectPts(x, 800, 140, 16), { wash: '#6A6470', ink: PAL.ink, sw: .6 }); paint([[x + 10, 800], [x + 130, 800], [x + 120, 700], [x + 20, 700]], { wash: '#8C8894', ink: PAL.ink, sw: .6 }); }
      }
      if (hw > 0 || wifi > 0) thrindle(1150, 1000, .5, t, { key: 'corner' });
      return;
    }
    // which of these are thrindles? Three probe cards deal out
    ['A language', 'A lighthouse', 'A secret'].forEach((c, i) => { const k = seg(t, L('T30.C.04.' + (i + 1)).t0 - .2, L('T30.C.04.' + (i + 1)).t0 + .3); if (k > 0) card(250 + i * 400, 460 + (1 - easeOut(k)) * 500, (i + 1) + '. ' + c, 1, { rot: (i - 1) * .05 }); });
    thrindle(645, 950, .9, t, { key: 'b cards' });
  }
  // C: Curt's answer: the radio and the gloved hand; a lighthouse among crowding ships; the ships become the jam
  function shotC(t) {
    const u = L('T31.U.01'), lh = say('T31.U.01', 'a lighthouse must be', -.3), hw = say('T31.U.01', 'Just like a highway', -.3);
    if (t < u.t0 + .8) { deskShot(t, { hour: HOUR, typing: true, mood: emotions(t, [[0, 'thinking']]), cam: pushInto('main', seg(t, u.t0, u.t0 + .8)) }); return; }
    paperWorld(t, '#E9E2D4');
    if (t < lh) { radio(700, 560, t); card(300, 250, 'A language', 1, { w: 280, h: 160, size: 30 }); card(1000, 250, 'A secret', 1, { w: 280, h: 160, size: 30 }); return; }
    sea(t);
    const n = Math.floor(18 * seg(t, lh, lh + 4)), toJam = seg(t, hw, hw + 1.2);
    if (toJam < 1) { lighthouse(200, 700, t); for (let i = 0; i < n; i++) ship(420 + (i % 6) * 140 + hash(i) * 30, 700 + Math.floor(i / 6) * 90, .9, 'c' + i); }
    if (toJam > 0) { fade(toJam * .9, '#EAE3D6'); if (toJam > .6) jam(120, 1170, 700, 9, t, 'c'); }
    thrindle(1150, 1000, .55, t, { key: 'c' });
  }
  // D: three stamps; Navajo flips (a code for few, a language for many); the lighthouse beam; the juggler; ticked; the
  // showy detour; probe 2
  function shotD(t) {
    const c1 = L('T31.C.01'), i1 = L('T31.C.02.1'), i2 = L('T31.C.02.2'), i3 = L('T31.C.02.3'), c3 = L('T31.C.03'), c4 = L('T31.C.04');
    paperWorld(t);
    if (t < i1.t0) {
      [['real insight', 'a real insight', '#3A8A4A'], ['near miss', 'a near miss', '#C9A441'], ['deliberate non sequitur', 'a deliberate non sequitur', '#C9302C']].forEach(([s, ph, col], i) =>
        stamp(s, 645, 330 + i * 190, seg(t, say('T31.C.01', ph, -.1), say('T31.C.01', ph, .4)), col, [-.1, .05, -.04][i]));
      claudeAs(1150, 1000, 9, { ...feel('happy', t), mouth: talking(t), lookX: -1, boilKey: 'claude stamps' });
      screenWorld(t, 1 - seg(t, c1.t0, c1.t0 + .8));
      return;
    }
    if (t < i2.t0) {   // Navajo as a code: enemy headphones appear, the thrindle shrinks; as a language: a village square
      const enemy = seg(t, say('T31.C.02.1', 'especially on the enemy side', -.3), say('T31.C.02.1', 'especially on the enemy side', .8));
      const village = seg(t, say('T31.C.02.1', 'As an ordinary language', -.3), say('T31.C.02.1', 'As an ordinary language', .8));
      const flip = seg(t, say('T31.C.02.1', 'a single thing flips', -.2), say('T31.C.02.1', 'a single thing flips', .8));
      if (village <= 0) {
        radio(500, 520, t);
        for (let i = 0; i < Math.round(4 * enemy); i++) { boilSeed('headphones ' + i); const x = 850 + (i % 2) * 180, y = 300 + Math.floor(i / 2) * 260; inkLine([[x - 50, y], [x, y - 60], [x + 50, y]], 6, '#6A6470', 'ink', .5); paint(ellPts(x - 50, y + 10, 20, 30, 10), { wash: '#26222A', ink: null }); paint(ellPts(x + 50, y + 10, 20, 30, 10), { wash: '#26222A', ink: null }); }
        thrindle(200, 1000, lerp(1.2, .3, enemy), t, { key: 'navajo code' });
      } else {
        crowdAround(645, 560, 16, village, t, 'village');
        thrindle(645, 560, lerp(.3, 1.8, village), t, { key: 'navajo lang', anti: true });
      }
      if (flip > 0) { boilSeed('coin'); const a = flip * Math.PI * 3; paint(ellPts(1120, 300, 60 * Math.abs(Math.cos(a)) + 4, 60, 20), { wash: Math.cos(a) > 0 ? '#E8C27A' : '#C9A441', ink: PAL.ink, sw: 1 }); }
      return;
    }
    if (t < i3.t0) {   // the lighthouse shines just as well for a hundred ships: only the crowded water glows red
      sea(t);
      const red = seg(t, say('T31.C.02.2', 'Crowded water', -.2), say('T31.C.02.2', 'Crowded water', .6));
      if (red > 0) { boilSeed('red water'); paint(ellPts(800, 800, 420, 140, 24, 10), { wash: '#C9302C', washOp: 90 * red, ink: null }); }
      lighthouse(200, 720, t, { beam: true });
      for (let i = 0; i < 24; i++) ship(420 + (i % 8) * 100 + hash(i) * 20, 700 + Math.floor(i / 8) * 90, .7, 'd' + i);
      return;
    }
    if (t < c3.t0) {   // the "therefore" was a joke: a juggler drops one ball on purpose, with a wink
      const drop = seg(t, say('T31.C.02.3', 'on purpose', -1), say('T31.C.02.3', 'on purpose'));
      claudeAs(CX, 900, 16, { ...feel(drop > .5 ? 'smug' : 'happy', t), aL: 1 + .3 * Math.sin(t * 6), aR: 1 + .3 * Math.sin(t * 6 + 3), boilKey: 'juggler', mouth: talking(t) });
      for (let i = 0; i < 3; i++) {
        const ph = frac(t * .8 + i / 3), dropped = i === 2 && drop > 0;
        const [x, y] = dropped ? [lerp(760, 900, drop), lerp(400, 880, easeIn(drop))] : arcPt([CX - 160, 640], [CX + 160, 640], 360, ph);
        boilSeed('ball ' + i); paint(ellPts(x, y, 26, 26, 14), { wash: ['#C9302C', '#3A6FC9', '#E8C27A'][i], ink: PAL.ink, sw: .9 });
      }
      return;
    }
    if (t < c4.t0) {   // concepts present, ticked; a showy detour round a roadblock
      tick(300, 300, seg(t, say('T31.C.03', 'concepts present', -.2), say('T31.C.03', 'concepts present', .4)));
      lab('concepts present', 520, 300, 44, '#3A8A4A', { align: 'left', alpha: seg(t, say('T31.C.03', 'concepts present', -.2), say('T31.C.03', 'concepts present', .4)) });
      const det = seg(t, say('T31.C.03', 'steered around', -.3), c3.t1);
      if (det > 0) {
        boilSeed('detour'); occupy(120, 520, 1180, 900, 1, 'detour');
        paint(rectPts(100, 700, 1100, 90), { wash: '#6A6470', ink: null });
        paint(rectPts(600, 680, 60, 130), { wash: '#F2D23A', ink: PAL.ink, sw: 1 }); for (let i = 0; i < 3; i++) paint(rectPts(600, 690 + i * 40, 60, 16), { wash: PAL.ink, ink: null });
        const p = ease(det), x = lerp(150, 1100, p);
        paint(rrPts(x - 60, 745 - 200 * Math.sin(clamp((p - .3) / .4) * Math.PI) - 30, 120, 56, 16), { wash: '#C9302C', ink: PAL.ink, sw: 1 });
      }
      return;
    }
    card(645, 480, 'Probe 2', seg(t, c4.t0, c4.t0 + .6), { w: 480, h: 260, size: 56 });
    thrindle(645, 950, .9 + .3 * Math.sin(t), t, { key: 'probe2' });
  }
  // E: Curt thinks aloud: a chalk circle; a hammer and a hand; the antithrindle; the cliché stamp; minus signs
  function shotE(t) {
    const u1 = L('T32.U.01'), u2 = L('T32.U.02');
    const circle = say('T32.U.01', 'They include some', -.3), hammer = say('T32.U.01', 'Useful is only useful', -.3), anti = say('T32.U.02', 'antithrindle', -.3), cliche = say('T32.U.02', 'Perhaps a cliche', -.3), teach = say('T32.U.02', 'detested by english teachers', -.3), dizzy = say('T32.U.02', 'All these negatives', -.3);
    if (t < circle || t >= dizzy) {
      const spin = seg(t, dizzy, dizzy + .6);
      deskShot(t, { hour: HOUR, typing: true, mood: emotions(t, [[0, 'thinking']]), extra: () => {
        if (spin > 0) for (let i = 0; i < 5; i++) { const a = t * 2.4 + i / 5 * TAU; lab('−', 575 + Math.cos(a) * 170, 860 + Math.sin(a) * 50, 60, '#C9302C', { alpha: spin }); }
      } });
      return;
    }
    paperWorld(t);
    if (t < hammer) {   // include some, exclude others: a chalk circle
      boilSeed('chalk circle'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#2F4A3A', fill: '#26402F', fillOp: 90, tex: .5, ink: null }); occupy(200, 250, 1100, 900, 1, 'circle');
      const k = seg(t, circle, circle + 1.2), pts = [];
      for (let i = 0; i <= 40 * k; i++) { const a = i / 40 * TAU; pts.push([645 + Math.cos(a) * 300, 560 + Math.sin(a) * 200]); }
      if (pts.length > 1) inkLine(pts, 5, '#FBF8F0', 'ink', .3);
      for (let i = 0; i < 10; i++) { const inside = i < 5, a = i / 5 * TAU, r = inside ? 120 : 420; curt(645 + Math.cos(a) * r * (inside ? 1.4 : 1.2), 640 + Math.sin(a) * r * .5, 8, { pose: 'stand', view: 'q', seed: i, boilKey: 'chalk ' + i, ...crowdLook(i) }); }
      return;
    }
    if (t < u2.t0) {   // useful only to someone: a hammer floating in empty space, until a hand closes on it
      const grip = seg(t, say('T32.U.01', 'Being included', -1.5), say('T32.U.01', 'Being included', -.5));
      boilSeed('hammer'); occupy(420, 320, 900, 760, 1, 'hammer');
      push(); translate(645, 540 + Math.sin(t) * 12 * (1 - grip)); rotate(-.3 + .1 * Math.sin(t * .7) * (1 - grip));
      paint(rectPts(-20, -60, 40, 280), { wash: '#B98A5E', ink: PAL.ink, sw: 1.1 }); paint(rrPts(-110, -120, 220, 70, 10), { wash: '#6A6470', ink: PAL.ink, sw: 1.2 });
      if (grip > 0) paint(rrPts(-50, 100 + (1 - grip) * 200, 100, 90, 30), { wash: '#E8C4A0', ink: PAL.ink, sw: 1.1 });
      pop();
      return;
    }
    if (t < cliche) { thrindle(420, 760, 2, t, { key: 'thr' }); thrindle(870, 760, 2 * ease(seg(t, anti, anti + .8)), t, { key: 'anti', anti: true }); if (t > anti) lab('antithrindle', 870, 340, 54, '#4E8A3E', { pop: seg(t, anti, anti + .5) }); return; }
    // a cliché: a crowd stamps it over and over; clear for them, fading for the writer; an English teacher's red pen
    boilSeed('cliche'); occupy(160, 200, 1140, 900, 1, 'cliche');
    for (let i = 0; i < 8; i++) { const x = 220 + (i % 4) * 230, y = 330 + Math.floor(i / 4) * 230, fresh = i < 4; paint(rrPts(x - 90, y - 50, 180, 100, 12), { wash: null, ink: fresh ? '#3A6FC9' : '#8C8894', sw: fresh ? 2 : .6 + .3 * (7 - i) / 4 }); inkLine([[x - 60, y], [x + 60, y]], fresh ? 3 : .8, fresh ? '#3A6FC9' : '#C9C2B4', 'inkfine', 0); }
    crowdAround(645, 900, 10, 1, t, 'stampers');
    const pen = seg(t, teach, teach + 1.2);
    if (pen > 0) { const pts = []; for (let i = 0; i <= 40 * pen; i++) { const a = i / 40 * TAU; pts.push([450 + Math.cos(a) * 480, 440 + Math.sin(a) * 200]); } if (pts.length > 1) inkLine(pts, 5, '#C9302C', 'ink', .4); }
  }
  // F: probe 2 was redundant; the hidden variable; hammer to hand; the thrindle under the magnifier; both ways at once;
  // ticked, and Claude ticks the same cards; the blank card nobody can fill
  function shotF(t) {
    const c1 = L('T32.C.01'), c2 = L('T32.C.02'), c3 = L('T32.C.03'), c4 = L('T32.C.04');
    paperWorld(t);
    if (t < c2.t0) {
      const slide = ease(seg(t, say('T32.C.01', 'Probe 2 was redundant', -.2), say('T32.C.01', 'Probe 2 was redundant', 1.2)));
      card(560, 470, 'A language', 1, { w: 420, h: 250 }); lab('Navajo', 560, 540, 40, '#6B6A3A');
      card(lerp(820, 600, slide), lerp(560, 500, slide), 'Probe 2', 1, { w: 420, h: 250, size: 44 });
      if (slide >= 1) card(560, 470, 'A language', 1, { w: 420, h: 250, key: 'on top' });
      screenWorld(t, 1 - seg(t, c1.t0, c1.t0 + .8));
      return;
    }
    const rel = say('T32.C.02', 'a relation between', -.3), about = say('T32.C.02', 'thinking about the concept', -.3);
    if (t < rel) {   // a hidden variable: the definition card turns over; a slot on its back points to a small person
      const flip = seg(t, say('T32.C.02', 'hidden variable', -.4), say('T32.C.02', 'hidden variable', .6));
      const sx = Math.abs(Math.cos(flip * Math.PI)); boilSeed('definition card'); occupy(300, 300, 990, 700, 1, 'card');
      push(); translate(645, 500); scale(Math.max(.02, sx), 1);
      paint(rrPts(-330, -190, 660, 380, 10), { wash: '#FBF6E6', ink: PAL.ink, sw: 1.2 });
      if (flip > .5) paint(rrPts(-80, -40, 160, 80, 10), { wash: '#E2D8C4', ink: PAL.ink, sw: 1 });
      pop();
      if (flip <= .5 && sx > .5) lab('thrindle: less useful the more people use it', 645, 500, 32, '#3A3342', { alpha: sx });
      if (flip > .9) { inkLine([[725, 500], [960, 500]], 3, PAL.clayDk, 'ink', 0); curt(1020, 560, 5, { pose: 'stand', view: 'q', seed: 2, boilKey: 'someone', ...crowdLook(7) }); lab('?', 645, 500, 50, PAL.clayDk); }
      return;
    }
    if (t < about) {   // the relation: a line drawn from the hammer to the hand
      boilSeed('hammer 2'); paint(rectPts(330, 460, 30, 200), { wash: '#B98A5E', ink: PAL.ink, sw: 1 }); paint(rrPts(270, 420, 150, 50, 8), { wash: '#6A6470', ink: PAL.ink, sw: 1 });
      paint(rrPts(880, 470, 120, 100, 30), { wash: '#E8C4A0', ink: PAL.ink, sw: 1 });
      const k = seg(t, rel + .2, rel + 1.4); inkLine([[440, 520], [lerp(440, 860, k), 520]], 4, PAL.clayDk, 'ink', 0);
      return;
    }
    if (t < c3.t0) {   // thinking about the concept, not just with it: the thrindle held up to the magnifier
      thrindle(645, 640, 1.8, t, { key: 'examined' });
      const mx = 645 + Math.sin(t) * 40, my = 520; paint(ellPts(mx, my, 150, 150, 28), { wash: '#DCEBF0', washOp: 90, ink: PAL.ink, sw: 2 }); inkLine([[mx + 106, my + 106], [mx + 250, my + 250]], 14, '#6B5646', 'ink', 0);
      paint(rrPts(420, 760, 140, 90, 30), { wash: '#E8C4A0', ink: PAL.ink, sw: 1 });
      return;
    }
    if (t < c4.t0) {   // the cliché, both ways at once: the stamp's impression, crisp on one side and worn on the other
      boilSeed('both ways'); occupy(260, 320, 1030, 760, 1, 'stamp both');
      paint(rrPts(280, 380, 360, 200, 16), { wash: null, ink: '#3A6FC9', sw: 3 }); inkLine([[330, 480], [590, 480]], 4, '#3A6FC9', 'inkfine', 0);
      paint(rrPts(650, 380, 360, 200, 16), { wash: null, ink: '#C9C2B4', sw: .8 }); inkLine([[700, 480], [960, 480]], 1, '#C9C2B4', 'inkfine', 0);
      lab('conversation', 460, 640, 36, '#3A6FC9'); lab('a writer', 830, 640, 36, '#8C8894');
      return;
    }
    // so you have concepts; Claude would pass the same probes; one blank card nobody can fill
    const pass = say('T32.C.04', "I'd probably pass", -.3), blank = say('T32.C.04', 'which answer', -.3);
    ['A language', 'A lighthouse', 'A secret'].forEach((c, i) => { card(250 + i * 400, 300, c, 1, { w: 300, h: 170, size: 30 }); tick(250 + i * 400 + 120, 230, seg(t, c4.t0 + .4 + i * .3, c4.t0 + .8 + i * .3)); });
    if (t > pass) { claudeAs(1100, 820, 9, { ...feel('neutral', t), mouth: talking(t), lookX: -1, boilKey: 'claude passes' }); ['A language', 'A lighthouse', 'A secret'].forEach((c, i) => tick(250 + i * 400 - 120, 230, seg(t, pass + .5 + i * .3, pass + .9 + i * .3))); }
    if (t > blank) card(645, 650, '', seg(t, blank, blank + .6), { w: 380, h: 220, key: 'blank' });
  }
  // G: the ontologist's hat; four panels (grounding, commitment, stability, behaviour underdetermines); the rebuttals
  const PANELS = [[340, 290, 'Grounding', 'T33.C.02.1'], [950, 290, 'Commitment', 'T33.C.02.2'], [340, 740, 'Stability', 'T33.C.02.3'], [950, 740, 'Behavior underdetermines', 'T33.C.02.4']];
  function panel(i, t, k, o = {}) {
    const [x, y, name] = PANELS[i], w = 580, h = 420;
    if (k <= 0) return;
    boilSeed('panel ' + i); occupy(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 1, 'panel');
    push(); translate(x, y + h / 2); rotate(o.fall ? -o.fall * Math.PI / 2 * (i % 2 ? -1 : 1) : 0); scale(1, o.fall ? 1 - o.fall * .9 : 1); translate(-x, -y - h / 2);
    paint(rectPts(x - w / 2, y - h / 2, w, h), { wash: '#FBF8F0', washOp: 255 * clamp(k * 2), ink: PAL.ink, sw: 1.2 });
    pop();
    if (o.fall > .3) return;
    lab((i + 1) + '. ' + name, x, y - h / 2 + 34, name.length > 12 ? 30 : 36, PAL.ink, { alpha: clamp(k * 2) });
    if (o.draw) o.draw(x, y + 20, w, h);
  }
  function shotG(t) {
    const u = L('T33.U.01'), c1 = L('T33.C.01'), c3 = L('T33.C.03');
    if (t < c1.t0 + .4) { deskShot(t, { hour: HOUR, typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), cam: pushInto('main', seg(t, c1.t0 - .3, c1.t0 + .4)) }); return; }
    paperWorld(t);
    if (t < L('T33.C.02.1').t0) {   // wearing that hat
      const on = seg(t, c1.t0 + .8, c1.t0 + 1.6);
      claudeAs(CX, 880, 22, { ...feel('determined', t), mouth: talking(t), boilKey: 'claude hat' });
      mortarboard(CX, 880 - (1 - easeOut(on)) * 300, 22);
      screenWorld(t, 1 - seg(t, c1.t0 + .4, c1.t0 + 1.2));
      return;
    }
    if (t < c3.t0) {
      const room = seg(t, say('T33.C.02.1', 'Searle', -.3), say('T33.C.02.1', 'Searle', .5));
      PANELS.forEach(([, , , id], i) => panel(i, t, seg(t, L(id).t0 - .1, L(id).t0 + .4), { draw: (x, y, w, h) => {
        if (i === 0) {   // "water", tied by strings only to other words; a real glass just out of reach
          if (room > 0) return chineseRoom(x, y + 10, t);
          lab('water', x - 60, y - 20, 40, '#3A6F8A');
          for (let j = 0; j < 4; j++) { const wx = x - 220 + j * 90, wy = y + 110; inkLine([[x - 60, y], [wx, wy - 14]], .8, '#8C8894', 'inkfine', .3); paint(rrPts(wx - 36, wy - 14, 72, 28, 8), { wash: '#E2D8C4', ink: PAL.ink, sw: .6 }); }
          boilSeed('glass of water'); paint([[x + 170, y - 60], [x + 250, y - 60], [x + 240, y + 90], [x + 180, y + 90]], { wash: '#9DC9E8', washOp: 150, ink: PAL.ink, sw: 1 });
        }
        if (i === 1) { paint(rectPts(x - 150, y - 110, 300, 230), { wash: '#F6EED8', ink: PAL.ink, sw: 1 }); for (let j = 0; j < 4; j++) inkLine([[x - 120, y - 70 + j * 34], [x + 110, y - 70 + j * 34]], 1, '#8C8894', 'inkfine', 0); inkLine([[x + 10, y + 90], [x + 130, y + 90]], 1.2); }
        if (i === 2) { frogChart(x - 220, y - 130, 300, 260, { k: 1, t }); boilSeed('needle'); const a = -Math.PI / 2 + .5 * Math.sin(t * 3); inkLine([[x + 200, y + 100], [x + 200 + Math.cos(a) * 80, y + 100 + Math.sin(a) * 80]], 4, PAL.clayDk, 'ink', 0); }
        if (i === 3) { push(); translate(x - 200, y + 150); scale(.45); cabinet(0, 0, 6, t, { clerk: false }); pop(); }
      } }));
      // "My 'water' links only to other words": a picture of a thing isn't the thing (after Magritte's The Treachery of
      // Images; our own picture), in the fourth panel's place until that panel comes
      const water = say('T33.C.02.1', 'My "water"', -.3);
      if (t < L('T33.C.02.4').t0 - .3) artwork('evoked-treachery-of-images', 950, 700, 300, { k: seg(t, water, water + 1.8), out: seg(t, L('T33.C.02.4').t0 - .8, L('T33.C.02.4').t0 - .3) });
      return;
    }
    // the rebuttals: a person with two contradictory balloons; a lattice where one shape lights up; a 7 out of reach
    const feat = say('T33.C.03', 'internal features', -.3), prime = say('T33.C.03', 'prime number', -1.5);
    if (t < feat) {
      curtAs(CX, 900, 20, { pose: 'stand', view: 'q', seed: 3, boilKey: 'contradicts' });
      boilSeed('two balloons'); paint(rrPts(260, 200, 300, 150, 30), { wash: '#FBF6E6', ink: PAL.ink, sw: 1.1 }); lab('yes', 410, 275, 50, '#3A8A4A');
      paint(rrPts(740, 200, 300, 150, 30), { wash: '#FBF6E6', ink: PAL.ink, sw: 1.1 }); lab('no', 890, 275, 50, '#C9302C');
      return;
    }
    if (t < prime) {   // a lattice under a magnifier; a bridge-shaped cluster lights up
      boilSeed('lattice'); occupy(220, 200, 1080, 880, 1, 'lattice');
      const lit = seg(t, feat + .8, feat + 1.8);
      for (let r = 0; r < 9; r++) for (let c = 0; c < 12; c++) { const x = 260 + c * 70, y = 240 + r * 70, on = (r === 3 && c > 1 && c < 10) || ((c === 3 || c === 8) && r > 0 && r < 7) || (r > 3 && r < 6 && (c - 3) * (8 - c) > 0 && Math.abs(r - 3 - Math.sin((c - 3) / 5 * Math.PI) * 2) < .8);
        paint(ellPts(x, y, 12, 12, 10), { wash: on && lit > 0 ? mixCol('#C9C2B4', '#E2703A', lit) : '#C9C2B4', ink: PAL.ink, sw: .5 }); }
      paint(ellPts(645, 520, 260, 260, 30), { wash: '#DCEBF0', washOp: 50, ink: PAL.ink, sw: 2 });
      return;
    }
    lab('7', CX, 360 + Math.sin(t * 1.3) * 20, 200, '#3A6F8A');
    boilSeed('reaching hands'); for (let i = 0; i < 5; i++) { const x = 180 + i * 230, reach = .5 + .5 * Math.sin(t * 1.5 + i); paint(rrPts(x - 40, 900 - reach * 200, 80, 300, 30), { wash: ['#E8C4A0', '#7A5238', '#C99A6E'][i % 3], ink: PAL.ink, sw: 1 }); }
  }
  // H: only grounding stands; a referee in one team's shirt; the book; GAZP vs. GLUT: behind the cabinet, a hidden crowd
  // writing the cards, which resolves into Claude's dabs; a doorway cut to Claude's outline, its bricks coming out
  function shotH(t) {
    const u = L('T34.U.01'), c1 = L('T34.C.01'), c2 = L('T34.C.02');
    const ref = say('T34.U.01', 'pretty self serving', -.3), book = say('T34.U.01', 'Yudkowsky', -.3);
    paperWorld(t);
    if (t < ref) { PANELS.forEach((p, i) => panel(i, t, 1, { fall: i === 0 ? 0 : ease(seg(t, u.t0 + .8 + i * .3, u.t0 + 1.6 + i * .3)) })); return; }
    if (t < book) {   // a referee wearing one team's shirt
      curtAs(CX, 920, 22, { pose: 'stand', view: 'front', seed: 6, boilKey: 'referee', outfit: 'jersey', cloth: '#C9302C', number: true });
      boilSeed('whistle'); paint(ellPts(CX + 60, 520, 18, 12, 10), { wash: '#C9C2B4', ink: PAL.ink, sw: .8 });
      return;
    }
    if (t < c1.t0 + .4) {   // a thick book
      boilSeed('rationality'); occupy(360, 300, 930, 800, 1, 'book');
      paint(rectPts(400, 340, 460, 440), { wash: '#26222A', ink: PAL.ink, sw: 1.3 }); paint(rectPts(860, 350, 60, 420), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 });
      for (let i = 0; i < 12; i++) inkLine([[865, 360 + i * 34], [915, 360 + i * 34]], .6, '#C9C2B4', 'inkfine', 0);
      lab('Rationality', 630, 520, 56, PAL.cream);
      return;
    }
    const round = say('T34.C.01', 'whatever did the filling', -.6), dabs = say('T34.C.01', 'training on a vast amount', -.3);
    if (t < c2.t0) {
      lab('GAZP vs. GLUT', CX, 130, 76, PAL.clayDk, { pop: seg(t, c1.t0 + .2, c1.t0 + .7) });
      const orbit = ease(seg(t, round, round + 3.2));
      if (orbit < .5) cabinet(160, 900, 7, t, { clerk: true });
      if (orbit > 0) {   // the camera goes round behind the cabinet: a hidden crowd, writing the cards
        fade(1 - Math.abs(orbit - .5) * 2, '#EFE8DA');
        if (orbit >= .5) {
          boilSeed('behind'); paint(rectPts(80, 300, 1120, 600), { wash: '#8C8894', washOp: 90, ink: null });
          const toDabs = seg(t, dabs, dabs + 2);
          if (toDabs < 1) for (let i = 0; i < 18; i++) { const x = 180 + (i % 6) * 180, y = 520 + Math.floor(i / 6) * 150; curt(x, y + 60, 4.5, { pose: 'sit', view: 'q', seed: i, boilKey: 'writer ' + i, ...crowdLook(i) }); paint(rectPts(x + 20, y + 20, 40, 26), { wash: '#FBF6E6', washOp: 255 * (1 - toDabs), ink: PAL.ink, sw: .5 }); }
          if (toDabs > 0) clawdCrowd(645, 820, 14, .2 + .15 * toDabs, { boilKey: 'glut crowd', t });
        }
      }
      // "in my case, that's training on a vast amount of human thought": Arcimboldo's Librarian, a man made of books
      const mine = say('T34.C.01', 'In my case', -.6);
      artwork('the-librarian', 1560, 520, 540, { k: seg(t, mine, mine + 1.8) });
      qrFeature('gazp-glut', t, c1.t0 + .8, { hold: 6.5 });
      return;
    }
    const bricks = say('T34.C.02', "It's also eroding", -.3), words = say('T34.C.02', 'your own grip', -.3);
    if (t < words) {   // a doorway cut precisely to Claude's outline, bricked up; the bricks come out, one by one
      boilSeed('brick wall'); occupy(160, 180, 1130, 960, 1, 'wall');
      for (let r = 0; r < 14; r++) for (let c = 0; c < 9; c++) paint(rectPts(160 + c * 108 + (r % 2) * 54 - 54, 200 + r * 54, 104, 50), { wash: '#B8453A', ink: PAL.ink, sw: .6 });
      const [dx, dy, du] = [645, 900, 50];
      paint([[dx - 5 * du, dy - 7.7 * du], [dx + 5 * du, dy - 7.7 * du], [dx + 5 * du, dy - 5.2 * du], [dx + 6.6 * du, dy - 5.2 * du], [dx + 6.6 * du, dy - 3.8 * du], [dx + 5 * du, dy - 3.8 * du], [dx + 5 * du, dy], [dx - 5 * du, dy], [dx - 5 * du, dy - 3.8 * du], [dx - 6.6 * du, dy - 3.8 * du], [dx - 6.6 * du, dy - 5.2 * du], [dx - 5 * du, dy - 5.2 * du]], { wash: '#2A2530', ink: PAL.ink, sw: 1.6 });
      const out = [seg(t, say('T34.C.02', 'see images', -.2), say('T34.C.02', 'see images', .6)), seg(t, say('T34.C.02', 'use tools', -.2), say('T34.C.02', 'use tools', .6)), seg(t, say('T34.C.02', 'act in environments', -.2), say('T34.C.02', 'act in environments', .6))];
      const holes = [[520, 480], [760, 560], [600, 720]];
      holes.forEach(([x, y], i) => {
        const k = t < bricks ? 0 : out[i]; if (k <= 0) { paint(rectPts(x - 52, y - 25, 104, 50), { wash: '#A83A30', ink: PAL.ink, sw: .8 }); return; }
        paint(rectPts(x - 52, y - 25, 104, 50), { wash: '#FFF1C4', ink: PAL.ink, sw: .8 });
        boilSeed('through ' + i);
        if (i === 0) { paint(ellPts(x, y, 20, 14, 12), { wash: '#FBF8F0', ink: PAL.ink, sw: .8 }); paint(ellPts(x, y, 7, 7, 8), { wash: PAL.ink, ink: null }); }
        if (i === 1) inkLine([[x - 36, y + 10], [x + 30, y - 10]], 6, '#6A6470', 'ink', 0);
        if (i === 2) { inkLine([[x - 40, y + 14], [x, y - 10], [x + 30, y + 6]], 6, '#9DA6AE', 'ink', 0); }
        const [fx, fy] = arcPt([x, y], [x + 300 + i * 60, y + 400], 160, easeIn(k)); if (k < 1) paint(rectPts(fx - 52, fy - 25, 104, 50), { wash: '#A83A30', ink: PAL.ink, sw: .8 });
      });
      return;
    }
    // a child reading: justice and prime came through words
    curt(430, 900, 11, { pose: 'sit', view: 'q', seed: 8, boilKey: 'child', look: 1, outfit: 'tee', cloth: '#D9534F', hair: 'short', hairCol: '#8A5A3A' });
    boilSeed('child book'); paint([[520, 600], [720, 560], [920, 600], [920, 780], [720, 740], [520, 780]], { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 }); inkLine([[720, 560], [720, 740]], 1);
    lab('justice', 620, 650, 36, '#3A3342', { alpha: seg(t, say('T34.C.02', 'justice', -.2), say('T34.C.02', 'justice', .3)) });
    lab('prime', 820, 650, 36, '#3A3342', { alpha: seg(t, say('T34.C.02', 'prime', -.2), say('T34.C.02', 'prime', .3)) });
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [L('T30.C.01').t0, shotB],
    [L('T31.U.01').t0, shotC],
    [L('T31.C.01').t0, shotD],
    [L('T32.U.01').t0, shotE],
    [L('T32.C.01').t0, shotF],
    [L('T33.U.01').t0, shotG],
    [L('T34.U.01').t0, shotH],
  ]);
})();
