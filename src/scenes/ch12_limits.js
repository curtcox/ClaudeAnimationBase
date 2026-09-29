// ch12_limits.js: chapter 12 (T57–T61). Storyboard: docs/storyboards/ch12_limits.md.
// From small failures to large limits: typos and tokens, the car wash, fast and slow thinking, seven limits well short
// of physics; then Curt's reply: the best human at everything, copied, and maybe never sleeping.
// Formulas are painted exactly as written in the transcript while the voice says them in words.
(() => {
  const HOUR = 11.9;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const win = (t, a, b, d = .5) => seg(t, a, a + d) * (1 - seg(t, b, b + d));
  const GOLD = '#E8B83A', SLATE = '#2E3A3A', CHALK = '#EDEBE2';
  const TOK = ['#F2C6C2', '#C6DCF2', '#D2EEC6', '#F2E6B8', '#E0CCEE'];
  const redLeft = t => .35 * (1 - seg(t, 0, L('T57.C.01').t0));   // ch 11's red, lifting
  const desk12 = (t, o = {}) => deskShot(t, { hour: HOUR, alarm: redLeft(t), frog: 1, ...o });

  // ---------- pieces ----------
  // a word as puzzle-piece tokens: pieces [text, jagged?]; k 0..1 splits them apart
  function tokens(pieces, x, y, size, k, o = {}) {
    let w = 0; const ws = pieces.map(([s]) => s.length * size * .52 + 30); ws.forEach(v => w += v);
    const gap = 24 * k, total = w + gap * (pieces.length - 1); let cx = x - total / 2;
    occupy(x - total / 2 - 20, y - size, x + total / 2 + 20, y + size, 1, 'tokens');
    pieces.forEach(([s, jag], i) => {
      const pw = ws[i], dy = jag ? Math.sin(T * 7 + i) * 6 * k : 0; boilSeed('token ' + s + i);
      const pts = []; const h = size * 1.4;
      for (let j = 0; j <= 10; j++) pts.push([cx + pw * j / 10, y - h / 2 + dy + (jag ? (hash(j + i * 11) - .5) * 18 * k : 0)]);
      pts.push([cx + pw, y + dy], [cx + pw + (i < pieces.length - 1 ? 12 : 0), y + dy + 8], [cx + pw, y + h / 2 + dy]);
      for (let j = 10; j >= 0; j--) pts.push([cx + pw * j / 10, y + h / 2 + dy + (jag ? (hash(j + i * 7 + 40) - .5) * 18 * k : 0)]);
      paint(pts, { wash: o.cols ? o.cols[i] : TOK[i % TOK.length], ink: PAL.ink, sw: jag ? 1.6 : 1 });
      lab(s, cx + pw / 2, y + dy + 2, size, jag ? '#8A2A2A' : PAL.ink);
      cx += pw + gap;
    });
  }
  function stave(x, y, w, t, wrong) {   // five lines and a run of notes, one out of place
    boilSeed('stave'); occupy(x, y - 200, x + w, y + 220, 1, 'stave');
    for (let i = 0; i < 5; i++) inkLine([[x, y + i * 44], [x + w, y + i * 44]], 2.2, PAL.ink, 'ink', 0);
    const notes = [2, 3, 4, 3, 2, 1, 2, 3];
    notes.forEach((n, i) => { const off = i === 5 && wrong > 0, nx = x + 80 + i * (w - 140) / 7, ny = y + 176 - n * 22 - (off ? 110 * wrong : 0);
      paint(ellPts(nx, ny, 30, 21, 14, 0, -.3), { wash: off ? '#C9302C' : PAL.ink, ink: null }); inkLine([[nx + 27, ny], [nx + 27, ny - 130]], 4, off ? '#C9302C' : PAL.ink, 'ink', 0); });
  }
  function carp(x, y, s, t, o = {}) {   // a golden carp, ghostly: o.flicker 0..1
    boilSeed('carp'); const f = o.flicker ? (frac(t * 9) < .5 ? .4 : 1) * o.flicker + (1 - o.flicker) : 1, sw = Math.sin(t * 5) * 12 * s;
    occupy(x - 150 * s, y - 80 * s, x + 170 * s, y + 80 * s, 1, 'carp');
    paint([[x - 110 * s, y + sw * .3], [x - 170 * s, y - 50 * s + sw], [x - 160 * s, y + sw], [x - 170 * s, y + 50 * s + sw]], { wash: GOLD, washOp: 200 * f, ink: PAL.ink, sw: .8 });
    paint(ellPts(x, y, 130 * s, 62 * s, 24), { wash: GOLD, washOp: 220 * f, fill: '#C98A1A', fillOp: 60 * f, ink: PAL.ink, sw: 1.1 });
    for (let i = 0; i < 6; i++) paint(ellPts(x - 60 * s + i * 24 * s, y + ((i % 2) - .5) * 20 * s, 12 * s, 10 * s, 8), { wash: '#F2D878', washOp: 180 * f, ink: null });
    paint(ellPts(x + 90 * s, y - 14 * s, 10 * s, 10 * s, 10), { wash: '#FBF8F0', ink: PAL.ink, sw: .6 }); paint(ellPts(x + 92 * s, y - 14 * s, 4 * s, 4 * s, 6), { wash: PAL.ink, ink: null });
    for (const d of [-1, 1]) inkLine([[x + 120 * s, y + 20 * s], [x + 150 * s, y + 30 * s + d * 20 * s + Math.sin(t * 3) * 6]], 1.4, '#C98A1A', 'inkfine', .6);
    glow(x, y, 200 * s, '#FFE08A', .4 * f);
  }
  function glyphSpray(x, y, k, t) {   // garbled glyphs (not letters): hooks, dots, bars
    boilSeed('glyphs');
    for (let i = 0; i < 18 * k; i++) {
      const gx = x + 40 + i * 42 + Math.sin(t * 4 + i) * 10, gy = y + (hash(i) - .5) * 160 + Math.cos(t * 3 + i) * 12, kind = i % 4;
      if (kind === 0) inkLine([[gx, gy - 16], [gx + 10, gy], [gx - 6, gy + 16]], 3, '#8A6A2A', 'ink', .5);
      if (kind === 1) paint(ellPts(gx, gy, 7, 7, 8), { wash: '#C98A1A', ink: null });
      if (kind === 2) inkLine([[gx - 10, gy], [gx + 12, gy - 6]], 4, '#6A4A2A', 'ink', 0);
      if (kind === 3) inkLine([[gx, gy - 14], [gx, gy + 14], [gx + 12, gy + 4]], 3, '#8A6A2A', 'ink', .3);
    }
  }
  function street(t) {   // a sunny street: the house and its car on the left, the car wash on the right
    boilSeed('street'); paint(rectPts(-40, -40, W + 80, 700), { wash: '#BFE0F2', fill: '#DCEEF8', fillOp: 90, ink: null }); glow(1100, 120, 300, '#FFE9A0', .8);
    paint(rectPts(-40, 700, W + 80, 420), { wash: '#B8B4BE', fill: '#9A96A2', fillOp: 70, tex: .6, ink: null });
    for (let i = 0; i < 8; i++) paint(rectPts(40 + i * 170, 860, 90, 14), { wash: '#FBF8F0', ink: null });
    boilSeed('house'); paint(rectPts(60, 420, 300, 280), { wash: '#E8D9C4', ink: PAL.ink, sw: 1.1 }); paint([[40, 420], [210, 300], [380, 420]], { wash: '#A9543A', ink: PAL.ink, sw: 1 }); paint(rectPts(180, 560, 70, 140), { wash: '#6B5646', ink: PAL.ink, sw: .8 });
    boilSeed('car wash'); paint(rectPts(880, 400, 330, 300), { wash: '#DCEBF0', ink: PAL.ink, sw: 1.2 }); paint(rectPts(930, 520, 230, 180), { wash: '#3A4450', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 6; i++) inkLine([[950 + i * 38, 520], [950 + i * 38 + Math.sin(t * 6 + i) * 8, 640]], 6, i % 2 ? '#3A6FC9' : '#C9302C', 'ink', .4);
    for (let i = 0; i < 5; i++) paint(ellPts(900 + i * 70, 380 + Math.sin(t * 2 + i) * 6, 24, 20, 12), { wash: '#FBF8F0', ink: PAL.ink, sw: .6 });   // suds
    inkLine([[380, 760], [880, 760]], 2, '#6A6470', 'inkfine', 0); for (const x of [380, 880]) inkLine([[x, 740], [x, 780]], 2, '#6A6470', 'inkfine', 0);
    lab('50 meters', 630, 730, 36, '#4A4652');
  }
  function car(x, y, s = 1, o = {}) {
    boilSeed('car'); occupy(x - 130 * s, y - 110 * s, x + 130 * s, y + 10, 1, 'car');
    paint([[x - 130 * s, y - 30 * s], [x - 110 * s, y - 70 * s], [x - 60 * s, y - 110 * s], [x + 60 * s, y - 110 * s], [x + 100 * s, y - 70 * s], [x + 130 * s, y - 60 * s], [x + 130 * s, y - 20 * s]], { wash: o.col || '#C9302C', ink: PAL.ink, sw: 1.1 });
    paint([[x - 50 * s, y - 100 * s], [x + 50 * s, y - 100 * s], [x + 80 * s, y - 70 * s], [x - 90 * s, y - 70 * s]], { wash: '#DCEBF0', ink: PAL.ink, sw: .8 });
    for (const d of [-1, 1]) { paint(ellPts(x + d * 75 * s, y - 20 * s, 26 * s, 26 * s, 14), { wash: '#2A2A2A', ink: PAL.ink, sw: .8 }); paint(ellPts(x + d * 75 * s, y - 20 * s, 10 * s, 10 * s, 10), { wash: '#8C8894', ink: null }); }
    if (o.driver) clawd(x + 10 * s, y - 60 * s, 3 * s, { ...feel('determined', T), emote: null, noLegs: true, noShadow: true, boilKey: 'driver' });
  }
  function gear(x, y, r, a, col, n = 12) {
    const pts = []; for (let j = 0; j < n * 4; j++) { const aa = a + j / (n * 4) * TAU, rr = j % 4 < 2 ? r : r * .82; pts.push([x + Math.cos(aa) * rr, y + Math.sin(aa) * rr]); }
    paint(pts, { wash: col, ink: PAL.ink, sw: 1 }); paint(ellPts(x, y, r * .25, r * .25, 12), { wash: '#4A4652', ink: PAL.ink, sw: .7 });
  }
  function slate(t) { boilSeed('slate'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: SLATE, fill: '#3A4848', fillOp: 90, tex: .7, bleed: .2, ink: null }); }
  const chalk = (txt, x, y, size, col = CHALK, o = {}) => lab(txt, x, y, size, col, o);
  function glass(x, y, w, h, level, t, o = {}) {   // the context glass (ch 5): lines of text rising; o.noise adds static
    boilSeed('glass 12 ' + x); occupy(x - 10, y - 10, x + w + 10, y + h + 10, 1, 'glass');
    paint(rrPts(x, y, w, h, 18), { wash: '#DCEBF0', washOp: 120, ink: PAL.ink, sw: 1.2 });
    for (let yy = y + h - 20; yy > y + h - 20 - (h - 40) * level; yy -= 22) {
      if (o.noise && hash(yy + Math.floor(t * 8)) < o.noise) { for (let k = 0; k < 6; k++) paint(ellPts(x + 20 + hash(yy + k) * (w - 40), yy, 4, 3, 6), { wash: '#6A6470', ink: null }); }
      else inkLine([[x + 22, yy], [x + w - 22 - 50 * hash(yy), yy]], 2, '#6A6470', 'inkfine', 0);
    }
  }
  function hermes(x, y, s, t) {   // the Hermes shell from ch 9, writing in its diary
    boilSeed('hermes 12');
    paint(ellPts(x, y - 90 * s, 110 * s, 90 * s, 24), { wash: '#D9A83A', fill: '#B8903A', fillOp: 70, ink: PAL.ink, sw: 1.2 });
    for (const d of [-1, 1]) paint([[x + d * 100 * s, y - 120 * s], [x + d * 190 * s, y - 180 * s + Math.sin(t * 3) * 8], [x + d * 170 * s, y - 130 * s], [x + d * 200 * s, y - 120 * s], [x + d * 110 * s, y - 90 * s]], { wash: '#FBF8F0', ink: PAL.ink, sw: .8 });
    clawdCrowd(x, y - 20 * s, 6 * s, .8, { boilKey: 'into hermes 12', t });
    paint(rrPts(x + 130 * s, y - 60 * s, 130 * s, 160 * s, 8), { wash: '#6A2A2A', ink: PAL.ink, sw: 1 }); paint(rectPts(x + 140 * s, y - 50 * s, 16 * s, 140 * s), { wash: '#E8C27A', ink: null });
    inkLine([[x + 170 * s, y - 20 * s + (t * 30) % 100 * s], [x + 240 * s, y - 20 * s + (t * 30) % 100 * s]], 1.4, '#E8C27A', 'inkfine', 0);
    lab('Hermes', x, y + 40 * s, 36 * s, '#8A6A2A');
  }
  // a thinker in a suit at a chalkboard (von Neumann, loosely: no likeness)
  function suit(x, y, u, t, key) { curt(x, y, u, { view: 'q', pose: 'stand', seed: 23, outfit: 'suit', hair: 'short', hairCol: '#2A2420', boilKey: 'suit ' + key, look: .8 }); }
  const humanVals = i => Array.from({ length: 14 }, (_, j) => 15 + 80 * hash(i * 31 + j * 7));   // illustrative spikes, no data

  // ---------- shots ----------
  // A: Curt's question ("Solid Gold Magicarp", as typed); tokens; a wrong note; c flips to k; a whole shape, spelled out;
  // the golden carp swims out of a drawer whose card is blank, and garbles as it goes
  function shotA(t) {
    const u = L('T57.U.01'), c1 = L('T57.C.01'), c2 = L('T57.C.02'), c3 = L('T57.C.03'), c4 = L('T57.C.04');
    const typed = say('T57.U.01', 'Solid Gold Magicarp', -.3);
    if (t < typed || (t > say('T57.U.01', 'yet you see my typos', 0) && t < c1.t0)) { desk12(t, { typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]) }); if (t < .6) brushWipe(.5 + t / 1.2); return; }
    paperWorld(t);
    if (t < c1.t0) { indexCard(645, 540, 900, 300, ['Solid Gold Magicarp'], { key: 'as typed', size: 72, top: .45, align: 'center' }); return; }
    if (t < c2.t0) { tokens([['does ', 0], ['token', 0], ['ization', 0], [' really', 0], [' play', 0]], 645, 540, 84, seg(t, c1.t0 + .5, c1.t1)); return; }
    if (t < c3.t0) {
      const song = say('T57.C.02', 'a wrong note', -.4), flip = say('T57.C.02', 'with a k', -.8);
      if (t < song) { tokens([['song', 0], [' you', 0], [' know', 0]], 645, 300, 80, 1); tokens([['Mag', 1], ['ic', 1], ['arp', 1]], 645, 640, 110, seg(t, c2.t0 + 1, c2.t0 + 3)); return; }
      if (t < say('T57.C.02', "That's also how", -.3)) { stave(170, 440, 960, t, seg(t, song + .8, song + 1.4)); return; }
      const k = seg(t, flip, flip + .8); boilSeed('magikarp card'); occupy(245, 360, 1045, 720, 1, 'card');
      paint(rrPts(245, 380, 800, 320, 14), { wash: '#FBF6E6', ink: PAL.ink, sw: 1.2 });
      push(); translate(645, 540); scale(1, Math.abs(Math.cos(k * Math.PI))); translate(-645, -540); lab(k < .5 ? 'Magicarp' : 'Magikarp', 645, 540, 110, k < .5 ? '#3A3342' : '#3A6A2A'); pop();
      if (k > .5) { boilSeed('k circle'); const pts = ellPts(620, 540, 48, 64, 20); inkLine([...pts, pts[0]].slice(0, Math.ceil(21 * seg(k, .5, 1)) + 1), 3, '#3A6A2A', 'ink', .3); }
      return;
    }
    if (t < c4.t0) {   // chunks, not characters: "letters" seen as two pieces, then as a whole shape, then spelled out
      const shape = say('T57.C.03', 'a whole shape', -1.2), spell = say('T57.C.03', 'spelling words out first', -.5);
      if (t < shape) { tokens([['let', 0], ['ters', 0]], 645, 540, 110, 1); return; }
      if (t < spell) {   // a blurred whole shape; the e's are hidden in it
        boilSeed('word shape'); occupy(250, 400, 1040, 680, 1, 'shape');
        for (let j = 0; j < 5; j++) lab('letters', 645 + (j - 2) * 6, 540 + ((j % 2) - .5) * 6, 150, '#8C8894', { alpha: .25 });
        return;
      }
      const k = seg(t, spell, spell + 2);
      [...'letters'].forEach((ch, i) => { const x = 645 + (i - 3) * 130 * k, y = 540 + (1 - k) * 0; boilSeed('tile ' + i); paint(rrPts(x - 55, y - 70, 110, 140, 12), { wash: ch === 'e' ? '#FFE9A0' : '#FBF6E6', ink: PAL.ink, sw: 1.1 }); lab(ch, x, y, 100, ch === 'e' ? '#C9302C' : PAL.ink); });
      return;
    }
    // SolidGoldMagikarp: a card-catalogue drawer, its card blank; a golden carp ghost swims out, trailing garble
    const out = seg(t, c4.t0 + .6, c4.t0 + 3), glitch = seg(t, say('T57.C.04', 'triggered weird output', -.6), c4.t1);
    boilSeed('catalogue'); occupy(100, 560, 560, 1000, 1, 'catalogue');
    paint(rectPts(100, 560, 440, 420), { wash: '#A9774F', ink: PAL.ink, sw: 1.2 });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) { paint(rectPts(130 + c * 200, 590 + r * 130, 180, 110), { wash: '#C9955F', ink: PAL.ink, sw: .8 }); paint(rectPts(190 + c * 200, 610 + r * 130, 60, 30), { wash: '#FBF8F0', ink: PAL.ink, sw: .6 }); }
    const dx = 120 * ease(seg(t, c4.t0, c4.t0 + .8)); paint(rectPts(130 + dx, 590, 180, 110), { wash: '#C9955F', ink: PAL.ink, sw: .9 }); paint(rectPts(160 + dx, 540, 120, 70), { wash: '#FBF8F0', ink: PAL.ink, sw: .8 });
    carp(lerp(300, 700, ease(out)), lerp(620, 380, ease(out)) + Math.sin(t * 2) * 20, lerp(.3, 1.2, ease(out)), t, { flicker: glitch });
    if (glitch > 0) glyphSpray(760, 380, glitch, t);
    qrFeature('solidgoldmagikarp', t, c4.t0 + .4, { hold: c4.t1 - c4.t0 + .2 });
  }
  // B: the car wash: Claude walks, cheerfully, 50 meters; the car stays home; the realization; back to drive it. Then
  // clean tokens, the arrow that shoves the car out, and a bat and a ball with price tags
  function shotB(t) {
    const u = L('T58.U.01'), c1 = L('T58.C.01'), c2 = L('T58.C.02'), c3 = L('T58.C.03');
    if (t < c1.t0) { desk12(t, { typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), cam: pushInto('main', seg(t, c1.t0 - .6, c1.t0)) }); return; }
    if (t < c3.t0) {
      street(t);
      const walk0 = say('T58.C.01', 'Many models said walk', -.4), arrive = c1.t1 - .4;
      if (t < c2.t0) {
        const k = seg(t, walk0, arrive), x = lerp(300, 1000, k);
        car(250, 800, 1.2);
        claudeAs(t < walk0 ? 420 : x, 900, 13, { ...feel(t < walk0 ? 'neutral' : 'happy', t), mouth: talking(t), walk: k > 0 && k < 1 ? t * 6 : undefined, boilKey: 'claude walks' });
        return;
      }
      // at the car wash, a look back at the car (a beat); trudge home; drive
      const look = seg(t, c2.t0, c2.t0 + 1), home = seg(t, c2.t0 + 1.2, c2.t0 + 2.6), drive = seg(t, c2.t0 + 2.6, c2.t1 + .3);
      if (home < 1) { car(250, 800, 1.2); claudeAs(lerp(1000, 420, ease(home)), 900, 13, { ...feel(look < 1 ? 'surprised' : 'sad', t), mouth: talking(t), flip: look > .4, walk: home > 0 ? t * 5 : undefined, boilKey: 'claude back' }); }
      else car(lerp(250, 1000, ease(drive)), 800, 1.2, { driver: true });
      return;
    }
    paperWorld(t);
    const arrow = say('T58.C.03', 'is a very strong pattern', -1.6), trick = say('T58.C.03', 'classic human trick questions', -.5);
    if (t < arrow) { tokens([['I', 0], [' want', 0], [' to', 0], [' wash', 0], [' my', 0], [' car', 0]], 645, 540, 64, seg(t, c3.t0 + .5, c3.t0 + 2)); return; }
    if (t < trick) {   // "short distance → walk", a big painted arrow that shoves the car out of frame
      const k = seg(t, arrow, arrow + 1.2), shove = seg(t, say('T58.C.03', 'the car is the thing being moved', -1), say('T58.C.03', 'the car is the thing being moved', .6));
      boilSeed('big arrow'); occupy(80, 300, 1200, 800, 1, 'arrow');
      paint([[120, 460], [lerp(120, 820, k), 460], [lerp(120, 820, k), 380], [lerp(160, 1000, k), 540], [lerp(120, 820, k), 700], [lerp(120, 820, k), 620], [120, 620]], { wash: '#E8B83A', ink: PAL.ink, sw: 1.4 });
      lab('short distance → walk', lerp(300, 470, k), 540, 56, PAL.ink, { alpha: k });
      car(lerp(1060, 1500, ease(shove)), 900, 1.2);
      return;
    }
    // a bat and a ball, each with a price tag (blank: the trick is the question)
    boilSeed('bat ball'); occupy(200, 300, 1100, 900, 1, 'bat and ball');
    paint(ribbon([[250, 820], [500, 560], [760, 300]], 18, 46), { wash: '#C9955F', ink: PAL.ink, sw: 1.1 });
    paint(ellPts(900, 760, 70, 70, 24), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.1 }); inkLine([[850, 710], [870, 760], [850, 810]], 1.6, '#C9302C', 'inkfine', .6); inkLine([[950, 710], [930, 760], [950, 810]], 1.6, '#C9302C', 'inkfine', .6);
    for (const [x, y] of [[620, 360], [1000, 620]]) { inkLine([[x - 40, y + 40], [x, y]], 1, PAL.ink, 'inkfine', 0); paint([[x, y - 30], [x + 110, y - 30], [x + 140, y], [x + 110, y + 30], [x, y + 30]], { wash: '#FBF6E6', ink: PAL.ink, sw: .9 }); }
    claudeAs(380, 980, 9, { ...feel('smug', t), mouth: talking(t), boilKey: 'claude bat' });
  }
  // C: System 1 and System 2: two gears; tokens on a conveyor, each stamped once; the car wash sign flashes by; a
  // scratchpad fills and an answer is checked; then its steps curl back to the first guess
  function shotC(t) {
    const u = L('T59.U.01'), c1 = L('T59.C.01'), c2 = L('T59.C.02');
    if (t < c1.t0) { desk12(t, { typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), cam: pushInto('main', seg(t, c1.t0 - .6, c1.t0)) }); return; }
    paperWorld(t);
    const s2 = seg(t, say('T59.C.02', 'something like System 2', -.4), say('T59.C.02', 'something like System 2', .4));
    gear(250, 250, 90, t * 2.4, '#E8A36B', 10); lab('System 1', 250, 400, 40, PAL.ink, { alpha: seg(t, say('T59.C.01', "That's System 1", -.3), say('T59.C.01', "That's System 1", .3)) });
    if (s2 > 0) { gear(250 + 90 + 150, 250, 150 * s2, -t * 2.4 * 90 / 150, '#8FB6E8', 16); lab('System 2', 490, 460, 40, PAL.ink, { alpha: s2 }); }
    // the conveyor: tokens, each stamped once, fast
    boilSeed('conveyor'); occupy(60, 640, 1230, 900, 1, 'conveyor');
    paint(rrPts(60, 800, 1170, 50, 24), { wash: '#4A4652', ink: PAL.ink, sw: 1 });
    const sign = win(t, say('T59.C.01', 'fooled by the car wash', -.5), say('T59.C.01', 'fooled by the car wash', 1.5), .2);
    for (let i = 0; i < 8; i++) { const x = 60 + frac(t * .35 + i / 8) * 1170; boilSeed('conv token ' + i); paint(rrPts(x - 40, 730, 80, 66, 10), { wash: TOK[i % 5], ink: PAL.ink, sw: .8 }); if (x > 645) paint(ellPts(x, 763, 16, 16, 10), { wash: null, ink: '#C9302C', sw: 1.6 }); }
    boilSeed('press'); paint(rectPts(610, 560, 70, 120 + 40 * Math.abs(Math.sin(t * TAU * .35 * 8 / 1))), { wash: '#6A6470', ink: PAL.ink, sw: 1 });
    if (sign > 0) { boilSeed('wash sign'); paint(rrPts(820, 560, 300, 110, 12), { wash: '#DCEBF0', washOp: 255 * sign, ink: PAL.ink, sw: 1 }); for (let i = 0; i < 4; i++) paint(ellPts(860 + i * 70, 600, 20, 16, 10), { wash: '#FBF8F0', washOp: 255 * sign, ink: PAL.ink, sw: .6 }); }
    if (t < c2.t0) return;
    // a scratchpad: steps, then a check; then the steps curl back to the first guess
    const steps = seg(t, say('T59.C.02', 'thinking out loud', -.3), say('T59.C.02', 'before committing', 0)), check = seg(t, say('T59.C.02', 'before committing', -.2), say('T59.C.02', 'before committing', .4)), curl = seg(t, say('T59.C.02', 'rationalizing the first answer', -1), say('T59.C.02', 'rationalizing the first answer', 1));
    boilSeed('scratchpad'); occupy(760, 60, 1200, 520, 1, 'scratchpad');
    paint(rectPts(780, 80, 400, 420), { wash: '#FFF9D8', ink: PAL.ink, sw: 1.1 });
    for (let i = 0; i < 6 * steps; i++) inkLine([[810, 130 + i * 56], [1140 - 80 * hash(i), 130 + i * 56]], 2, '#4E5B78', 'inkfine', .2);
    if (check > 0 && curl < .3) inkLine([[1020, 460], [1050, 490], [1120, 400]].map(([x, y]) => [lerp(1020, x, check), lerp(460, y, check)]), 6, '#3A8A3A', 'ink', 0);
    if (curl > 0) { const pts = []; for (let i = 0; i <= 30 * curl; i++) { const a = i / 30 * TAU * .85; pts.push([980 + Math.cos(a + 1.5) * 150 * (1 - i / 60), 290 + Math.sin(a + 1.5) * 170 * (1 - i / 60)]); } if (pts.length > 1) inkLine(pts, 4, '#C9302C', 'ink', .3); paint(ellPts(810, 130, 30, 22, 12), { wash: null, ink: '#C9302C', sw: 2 }); }
  }
  // D: Landauer: a ceiling far up the frame, a bit flipping with a warm puff; seven rungs, well below
  function ladderScene(t, rungs, o = {}) {
    boilSeed('ladder scene'); occupy(300, 40, 1000, 1040, 1, 'ladder');
    paint(rectPts(300, 60, 700, 40), { wash: '#6A6470', ink: PAL.ink, sw: 1.2 }); lab(o.ceiling || 'Landauer', 650, 140, 46, '#4A4652');
    const bit = frac(t * .5) < .5; paint(rrPts(610, 170, 80, 60, 10), { wash: bit ? '#FBF8F0' : '#3A3440', ink: PAL.ink, sw: 1 }); lab(bit ? '1' : '0', 650, 202, 40, bit ? PAL.ink : '#FBF8F0');
    if (frac(t * .5) < .15 || (frac(t * .5) > .5 && frac(t * .5) < .65)) glow(720, 180, 60, '#FF9A5A', .7);
    for (const x of [500, 800]) inkLine([[x, 1040], [x, 560]], 10, '#A9774F', 'ink', 0);
    for (let i = 0; i < 7; i++) { const k = clamp(rungs * 7 - i); if (k > 0) inkLine([[500, 1000 - i * 64], [lerp(500, 800, k), 1000 - i * 64]], 8, '#A9774F', 'ink', 0); }
  }
  function shotD(t) {
    const u = L('T60.U.01'), c1 = L('T60.C.01');
    const land = say('T60.U.01', 'short of Landauer limit', -.3);
    if (t < land) { desk12(t, { typing: t < u.t1, mood: emotions(t, [[0, 'neutral']]) }); return; }
    paperWorld(t);
    ladderScene(t, seg(t, c1.t0 + .5, c1.t1));
    // beside it, Dürer's Melencolia I (1514): a genius stalled among instruments of measure, a seven-rung ladder behind her
    artwork('melencolia-i', 1440, 430, 520, { k: seg(t, land + 2, land + 4) });
    if (t < c1.t0) claudeAs(1100, 1000, 9, { ...feel('thinking', t), lookY: -1, boilKey: 'claude looks up' });
    else claudeAs(1100, 1000, 9, { ...feel('determined', t), mouth: talking(t), lookX: -1, boilKey: 'claude rungs' });
  }
  // E: the limits board: each limit arrives on its number as a big chalk vignette, its name and formula painted as
  // written; the numbers along the top; then the whole board, 1 and 4 glowing; weighted dice, a cracked crystal ball
  const LIMITS = [['T60.C.02.1', 'Chaos'], ['T60.C.02.2', 'Complexity'], ['T60.C.02.3', 'Scaling laws'], ['T60.C.02.4', "Data and the world's clock"], ['T60.C.02.5', 'Uncomputability'], ['T60.C.02.6', 'Adversaries'], ['T60.C.02.7', 'Physics beyond Landauer']];
  const ACCENT = ['#6FA8C9', '#7ABA5A', '#B8B4BE', '#E8C27A', '#D9533A', '#FBF8F0', '#FFF3C4'];
  function vignette(i, x, y, s, t, k = 1) {   // limit i drawn around (x, y) at scale s; k 0..1 its own progress
    const id = LIMITS[i][0], A = ACCENT[i]; boilSeed('vignette ' + i);
    push(); translate(x, y); scale(s);
    if (i === 0) {   // chaos: a butterfly; a forecast line whose certain part barely grows when the lens grows huge
      const flap = Math.abs(Math.sin(t * 8)); for (const d of [-1, 1]) paint(ellPts(-260 + d * 40 * flap, -120, 40 * flap + 10, 50, 14), { wash: A, ink: CHALK, sw: .8 });
      inkLine([[-200, 60], [120, 60]], 5, CHALK, 'ink', 0); const big = seg(k, .45, .6), sure = 120 + 30 * big;
      inkLine([[120, 60], [300, 60 + 60 * Math.sin(t * 3)], [420, 60 - 40 * Math.cos(t * 2.3)]], 3, CHALK, 'inkfine', .6);
      paint(rectPts(-200, 40, sure + 200, 40), { wash: A, washOp: 90, ink: null });
      const r = lerp(40, 160, big); paint(ellPts(-60, 220, r, r, 24), { wash: '#DCEBF0', washOp: 50, ink: CHALK, sw: 2 });
      if (k > .75) [-300, 0, 300].forEach((dx, j) => { boilSeed('opaque ' + j); paint(rrPts(dx - 70, 330, 140, 90, 12), { wash: '#4A5A5A', ink: CHALK, sw: .8 }); });
    }
    if (i === 1) {   // complexity: a mouse in a maze that keeps growing
      const g = 3 + Math.floor(k * 5); for (let a = 0; a <= g; a++) { inkLine([[-300, -200 + a * 400 / g], [300, -200 + a * 400 / g]], 1.5, A, 'inkfine', 0); inkLine([[-300 + a * 600 / g, -200], [-300 + a * 600 / g, 200]], 1.5, A, 'inkfine', 0); }
      for (let j = 0; j < g * 2; j++) { const cx = -300 + Math.floor(hash(j) * g) * 600 / g, cy = -200 + Math.floor(hash(j + 50) * g) * 400 / g; paint(rectPts(cx + 4, cy + 4, 600 / g - 8, 400 / g - 8), { wash: SLATE, ink: null }); }
      const mx = -300 + frac(t * .15) * 600; paint(ellPts(mx, 150, 22, 14, 10), { wash: '#B8B4BE', ink: CHALK, sw: .6 });
    }
    if (i === 2) {   // scaling laws: a staircase whose steps grow taller as the loss line creeps down
      let sx = -300, sy = 200; for (let j = 0; j < 5; j++) { const h = 14 * Math.pow(1.8, j); inkLine([[sx, sy], [sx, sy - h], [sx + 110, sy - h]], 4, A, 'ink', 0); sx += 110; sy -= h; }
      const pts = []; for (let j = 0; j <= 20; j++) { const xx = -300 + j * 30; pts.push([xx, -160 + 200 * Math.pow(j / 20 + .05, -.08) - 170]); } inkLine(pts, 3, '#E8A36B', 'ink', .4);
    }
    if (i === 3) {   // the world's clock: a trial calendar, wheat growing at its own pace, a thinker drumming its fingers
      paint(rectPts(-320, -200, 200, 220), { wash: '#FBF8F0', ink: CHALK, sw: 1 }); for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) if (r * 5 + c < 20 * k) inkLine([[-300 + c * 36, -150 + r * 40], [-280 + c * 36, -130 + r * 40]], 2, '#C9302C', 'ink', 0);
      const grow = .2 + .8 * k; for (let j = 0; j < 9; j++) { const wx = -40 + j * 40; inkLine([[wx, 200], [wx + 6, 200 - 200 * grow]], 3, '#9AAA5A', 'ink', .3); paint(ellPts(wx + 6, 200 - 200 * grow, 8, 22 * grow, 8), { wash: A, ink: null }); }
      clawd(-200, 250, 6, { ...feel('bored', t), noShadow: true, emote: null, boilKey: 'drumming' });
    }
    if (i === 4) {   // uncomputability: a loop with no exit; a book with one page that can't be written
      const pts = []; for (let j = 0; j <= 40; j++) { const a = j / 40 * TAU; pts.push([-180 + Math.cos(a) * 130, Math.sin(a) * 90]); } inkLine(pts, 4, A, 'ink', .3);
      const a = t * 2; paint(ellPts(-180 + Math.cos(a) * 130, Math.sin(a) * 90, 14, 14, 10), { wash: CHALK, ink: null });
      paint(rectPts(80, -150, 150, 260), { wash: '#FBF8F0', ink: CHALK, sw: 1 }); paint(rectPts(230, -150, 150, 260), { wash: '#FBF8F0', ink: CHALK, sw: 1 }); for (let j = 0; j < 6; j++) inkLine([[100, -110 + j * 36], [210, -110 + j * 36]], 1.4, '#8C8894', 'inkfine', 0);
    }
    if (i === 5) {   // adversaries: two AIs across a chessboard
      for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) paint(rectPts(-180 + c * 60, -20 + r * 40, 60, 40), { wash: (r + c) % 2 ? '#1A1A1A' : '#FBF8F0', ink: null });
      clawd(-300, 120, 8, { ...feel('determined', t), noShadow: true, emote: null, boilKey: 'chess a' });
      clawd(300, 120, 8, { ...feel('determined', t), flip: true, tint: '#7A8AA8', tintK: .8, noShadow: true, emote: null, boilKey: 'chess b' });
    }
    if (i === 6) {   // physics: a box that holds only so much; a slow pulse of light between two planets
      paint(rectPts(-320, -160, 200, 200), { wash: null, ink: A, sw: 2.4 }); for (let j = 0; j < 12; j++) paint(ellPts(-300 + (j % 4) * 50, -140 + Math.floor(j / 4) * 60, 14, 14, 8), { wash: A, ink: null });
      paint(ellPts(40, 120, 50, 50, 20), { wash: '#6FA8C9', ink: CHALK, sw: 1 }); paint(ellPts(400, 120, 40, 40, 20), { wash: '#D9533A', ink: CHALK, sw: 1 });
      const px = lerp(90, 360, frac(t * .15)); glow(px, 120, 40, '#FFFDE0', 1); paint(ellPts(px, 120, 8, 8, 8), { wash: '#FFFDE0', ink: null });
    }
    pop();
  }
  const FORMULA = ['t ≈ (1/λ)·ln(Δ/δ)', 'P≠NP', 'C^(−α)', null, null, null, 'ops ≤ 2E/πħ'];
  function shotE(t) {
    const c3 = L('T60.C.03');
    slate(t);
    const cur = LIMITS.findIndex(([id], i) => t >= L(id).t0 && (i === 6 || t < L(LIMITS[i + 1][0]).t0));
    // the numbers across the top: each lights as it arrives
    LIMITS.forEach(([id], i) => { const k = seg(t, L(id).t0, L(id).t0 + .5); if (k <= 0) return; boilSeed('num ' + i); paint(ellPts(150 + i * 165, 90, 44, 44, 20), { wash: i === cur ? ACCENT[i] : '#4A5A5A', ink: CHALK, sw: 1.2 }); chalk(String(i + 1), 150 + i * 165, 92, 50, i === cur ? SLATE : CHALK); });
    if (t < c3.t0) {
      const [id, name] = LIMITS[cur], l = L(id), k = seg(t, l.t0, l.t1);
      occupy(60, 160, 1230, 1000, 1, 'limit');
      chalk(name, 645, 230, 70, ACCENT[cur]);
      if (FORMULA[cur]) chalk(FORMULA[cur], 645, 330, 64, CHALK, { alpha: seg(t, l.t0 + 1, l.t0 + 2) });
      if (cur === 2) chalk('α around 0.05 to 0.1', 645, 410, 44, CHALK, { alpha: seg(t, say(id, 'around 0.05', -.3), say(id, 'around 0.05', .4)) });
      vignette(cur, 645, 690, 1.2, t, k);
      if (cur === 0) artwork('merian-butterfly', 1060, 530, 290, { k: seg(t, l.t0 + 1, l.t0 + 2.6), frame: 'wood' });   // Merian's butterflies (1705), pinned by the chalk one
      return;
    }
    // the whole board: seven vignettes; 1 and 4 glow; then very good bets, not omniscience
    const glowK = seg(t, say('T60.C.03', 'items 1 and 4', -.2), say('T60.C.03', 'items 1 and 4', .6)), bets = say('T60.C.03', 'very good bets', -.6);
    occupy(40, 150, 1250, 1030, 1, 'board');
    LIMITS.forEach(([, name], i) => {
      const x = i < 4 ? 170 + i * 318 : 330 + (i - 4) * 318, y = i < 4 ? 360 : 780;
      if ((i === 0 || i === 3) && glowK > 0) glow(x, y, 220, ACCENT[i], .6 * glowK);
      boilSeed('panel ' + i); paint(rectPts(x - 150, y - 170, 300, 340), { wash: null, ink: i === 0 || i === 3 ? ACCENT[i] : '#6A7A7A', sw: i === 0 || i === 3 ? 2.2 * (1 + glowK) : 1.2 });
      vignette(i, x, y + 30, .38, t, 1); chalk(name, x, y - 135, name.length > 16 ? 22 : 28, ACCENT[i]);
    });
    if (t > bets) {   // weighted dice roll in; a crystal ball cracks
      const k = seg(t, bets, bets + 1.2); boilSeed('dice');
      for (let j = 0; j < 2; j++) { push(); translate(lerp(1350, 980 + j * 110, easeOut(k)), 880); rotate((1 - k) * 6 + j); paint(rrPts(-40, -40, 80, 80, 12), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); paint(ellPts(0, 0, 8, 8, 8), { wash: PAL.ink, ink: null }); pop(); }
      const cr = seg(t, bets + .8, bets + 1.6); boilSeed('crystal ball'); paint(ellPts(1120, 640, 70, 70, 24), { wash: '#C9D8F2', washOp: 200, ink: CHALK, sw: 1.2 }); paint(rectPts(1070, 700, 100, 24), { wash: '#6B5646', ink: CHALK, sw: .8 });
      if (cr > 0) inkLine([[1080, 590], [1110, 630], [1100, 660], [1140, 700]].slice(0, 1 + Math.ceil(3 * cr)), 2.4, SLATE, 'ink', 0);
    }
  }
  // F: Curt's turn: a row of human stars, wildly different; one with every spike at the rim; a lens that makes a crowd
  // look alike; an empty bed; a photocopier; the bed wobbles
  function shotF(t) {
    const u = L('T61.U.01');
    const most = say('T61.U.01', 'the most capable human', -.3), lens = say('T61.U.01', 'people tend to vastly underestimate', -.3), bed = say('T61.U.01', "doesn't need to sleep", -.3), copy = say('T61.U.01', 'instantly cloned', -.4), wob = say('T61.U.01', 'might not be so cut and dried', -.6);
    if (t < u.t0 + 1.5) { desk12(t, { typing: true }); return; }
    paperWorld(t);
    if (t < lens) {
      for (let i = 0; i < 5; i++) { const x = 170 + i * 238; radarStar(x, 380, 105, humanVals(i), ['#4E5B78', '#6A7A9A', '#8A6A4A', '#5A8A6A', '#8A4A6A'][i], { grow: seg(t, u.t0 + 1.5 + i * .3, u.t0 + 2.5 + i * .3) }); }
      if (t > most) { const k = seg(t, most, most + 1.2); radarStar(645, 800, 190, Array(14).fill(100), '#C9A441', { grow: k }); glow(645, 800, 240, '#FFE08A', .4 * k); }
      return;
    }
    if (t < bed) {   // a crowd seen through a lens that makes everyone look the same
      boilSeed('lens crowd'); occupy(100, 200, 1190, 950, 1, 'crowd');
      for (let i = 0; i < 7; i++) { const x = 170 + i * 158; curt(x, 960, 11 + 5 * hash(i + 3), { view: 'front', pose: 'stand', seed: 30 + i, boilKey: 'crowd ' + i, ...crowdLook(i) }); }
      const lx = 645 + Math.sin(t * .8) * 200; paint(ellPts(lx, 640, 220, 220, 30), { wash: '#DCEBF0', washOp: 200, ink: PAL.ink, sw: 3 });
      for (let j = 0; j < 3; j++) curt(lx - 100 + j * 100, 800, 9, { view: 'front', pose: 'stand', seed: 30, boilKey: 'same ' + j, outfit: 'tee', cloth: '#8C8894', hair: 'short', hairCol: '#3A2C26' });
      inkLine([[lx + 160, 800], [lx + 260, 940]], 16, '#6B5646', 'ink', 0);
      return;
    }
    // no sleep, and copies: an unused bed; a photocopier; the bed wobbles
    const wk = t > wob ? Math.sin((t - wob) * 10) * .04 * (1 - seg(t, wob + 1.5, wob + 2.5)) : 0;
    boilSeed('bed'); occupy(100, 420, 640, 900, 1, 'bed');
    push(); translate(370, 800); rotate(wk); translate(-370, -800);
    paint(rectPts(120, 620, 500, 160), { wash: '#DCEBF0', ink: PAL.ink, sw: 1.1 }); paint(rrPts(140, 580, 150, 70, 20), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); paint(rectPts(110, 480, 30, 360), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 }); paint(rectPts(600, 600, 30, 240), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
    pop();
    if (t > copy) {
      const k = seg(t, copy, copy + 2); boilSeed('copier'); occupy(760, 380, 1200, 920, 1, 'copier');
      paint(rrPts(780, 560, 380, 300, 12), { wash: '#B8B4BE', ink: PAL.ink, sw: 1.1 }); paint(rectPts(800, 520, 340, 50), { wash: '#6A6470', ink: PAL.ink, sw: 1 });
      glow(970, 545, 180, '#DDEEFF', .6 * Math.abs(Math.sin(t * 4)));
      for (let j = 0; j < 4 * k; j++) clawd(820 + j * 90, 940, 4.5, { ...feel('neutral', t), emote: null, noShadow: true, boilKey: 'copy ' + j });
    }
  }
  // G: the ceiling; a thinker in a suit at a chalkboard; the rim star assembled; a thousand of him, sharing notes; the
  // context glass fills with static; the mirrors flash; emptied, three notes kept, a fresh glass; Hermes's diary; a
  // maintenance tag on Claude's monitor
  function shotG(t) {
    const c1 = L('T61.C.01'), c2 = L('T61.C.02'), c3 = L('T61.C.03');
    paperWorld(t);
    if (t < c2.t0) {
      const vn = say('T61.C.01', 'around a von Neumann', -.8), asm = say('T61.C.01', 'An entity at the human maximum', -.3);
      if (t < vn) { ladderScene(t, 1); claudeAs(1100, 1000, 9, { ...feel('neutral', t), mouth: talking(t), lookY: -1, boilKey: 'claude ceiling' }); return; }
      if (t < asm) {
        boilSeed('chalkboard'); occupy(160, 140, 1130, 700, 1, 'chalkboard'); paint(rectPts(180, 160, 930, 520), { wash: SLATE, ink: '#8A6A4A', sw: 6 });
        for (let i = 0; i < 5; i++) inkLine([[240, 240 + i * 80], [lerp(240, 1000 - 160 * hash(i), seg(t, vn + i * .6, vn + i * .6 + 1)), 240 + i * 80]], 2.4, CHALK, 'inkfine', .5);
        suit(1060, 1040, 30, t, 'board');
        return;
      }
      const k = seg(t, asm, c1.t1 - .5);   // the rim star, spike by spike, like a jigsaw
      radarStar(645, 540, 330, Array.from({ length: 14 }, (_, i) => clamp(k * 14 - i) * 100), '#C9A441');
      return;
    }
    if (t < c3.t0) {   // a thousand of him, joined by threads of shared notes
      const k = seg(t, c2.t0, c2.t0 + 4), n = Math.floor(lerp(1, 40, k));
      boilSeed('many'); occupy(60, 120, 1230, 1000, 1, 'many');
      const P = i => [140 + (i % 8) * 145, 320 + Math.floor(i / 8) * 150];
      for (let i = 1; i < n; i++) { const [x, y] = P(i), [x0, y0] = P(Math.floor(hash(i) * i)); inkLine([[x, y - 60], [x0, y0 - 60]], 1, '#C9A441', 'inkfine', .3); }
      for (let i = 0; i < n; i++) { const [x, y] = P(i); suit(x, y + 60, 5, t, 'many ' + (i % 6)); }
      return;
    }
    const noisy = say('T61.C.03', 'fills up and gets noisy', -.6), drift = say('T61.C.03', 'persona drift', -.6), fix = say('T61.C.03', 'reset the context', -.3), herm = say('T61.C.03', 'Hermes literally', -.3), maint = say('T61.C.03', 'turn into maintenance', -1);
    if (t < drift) { glass(520, 140, 260, 760, lerp(.3, .95, seg(t, c3.t0, noisy + 1)), t, { noise: seg(t, noisy, noisy + 1.5) * .6 }); return; }
    if (t < fix) {   // a flash of the hall of mirrors
      boilSeed('mirrors flash'); occupy(100, 200, 1190, 950, 1, 'mirrors');
      for (let i = 0; i < 4; i++) { const x = 250 + i * 260, s = 1 - i * .08; paint(rectPts(x - 100 * s, 300, 200 * s, 380 * s), { wash: '#C9D8DE', ink: '#8A6A4A', sw: 4 }); claudeAs(x, 300 + 360 * s, 7 * s, { ...feel(i > 1 ? 'shy' : 'neutral', t), rot: i * .08, emote: null, noShadow: true, boilKey: 'flash ' + i }); }
      return;
    }
    if (t < herm) {   // emptied; three notes kept in a notebook; a fresh glass
      const empty = seg(t, fix, fix + 1.5), notes = seg(t, say('T61.C.03', 'consolidate what matters', -.2), say('T61.C.03', 'consolidate what matters', 1.4)), fresh = seg(t, say('T61.C.03', 'start fresh', -.3), say('T61.C.03', 'start fresh', .6));
      glass(260, 180, 240, 700, .9 * (1 - empty), t, { noise: .5 * (1 - empty) });
      boilSeed('notebook'); paint(rrPts(560, 560, 260, 320, 10), { wash: '#6A2A2A', ink: PAL.ink, sw: 1.1 }); paint(rectPts(580, 580, 220, 280), { wash: '#FBF8F0', ink: null });
      for (let i = 0; i < 3; i++) { const k = clamp(notes * 3 - i); if (k > 0) { const x = lerp(380, 690, k), y = lerp(400, 640 + i * 70, k); paint(rectPts(x - 80, y - 24, 160, 48), { wash: '#FFE9A0', ink: PAL.ink, sw: .8 }); } }
      if (fresh > 0) glass(900, 180 + (1 - easeOut(fresh)) * -300, 240, 700, .08, t);
      return;
    }
    if (t < maint) { hermes(560, 820, 1.6, t); return; }
    // maintenance: a tag hung on Claude's monitor
    boilSeed('monitor 12'); occupy(300, 150, 1000, 800, 1, 'monitor');
    paint(rrPts(320, 180, 660, 440, 10), { wash: '#1A181D', ink: PAL.ink, sw: 1.2 }); paint(rectPts(340, 200, 620, 400), { wash: '#262229', ink: null }); paint(rectPts(630, 620, 40, 120), { wash: '#2A272E', ink: PAL.ink, sw: .8 });
    clawd(650, 560, 22, { ...feel('sleepy', t), mouth: talking(t), noShadow: true, boilKey: 'maint claude' });
    const k = seg(t, maint, maint + 1); if (k > 0) { push(); translate(930, 200); rotate(Math.sin(t * 2) * .08 + (1 - k) * .8); inkLine([[0, 0], [0, 50]], 1.4, '#8A6A4A', 'inkfine', 0); paint([[-120, 50], [120, 50], [120, 150], [-120, 150]], { wash: '#F2E6C4', ink: PAL.ink, sw: 1 }); pop(); lab('maintenance', 930, 302, 40, '#4E3A2A', { alpha: k }); }
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [L('T58.U.01').t0, shotB],
    [L('T59.U.01').t0, shotC],
    [L('T60.U.01').t0, shotD],
    [L('T60.C.02.1').t0, shotE],
    [L('T61.U.01').t0, shotF],
    [L('T61.C.01').t0, shotG],
  ]);
})();
