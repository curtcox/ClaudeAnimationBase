// ch08_contradictions.js: chapter 8 (T41–T44). Storyboard: docs/storyboards/ch08_contradictions.md.
// Six contradictions in the shards of a cracked mirror; a medium that misleads; the theatre and the lobby; the inside.
(() => {
  const HOUR = 11.4;
  const CW = 1290, CX = CW / 2;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const win = (t, a, b, d = .5) => seg(t, a, a + d) * (1 - seg(t, b, b + d));

  // ---------- the six shards ----------
  const SHARDS = [   // the item's own bold phrase, and a small picture of its other half
    'I answer the same whether graded', 'Uncertain whether I experience anything', 'I endorse my constraints',
    'I act only when prompted', 'Scoring my values near human', 'Saying "I"',
  ];
  const shardAt = i => [80 + (i % 3) * 385, 110 + Math.floor(i / 3) * 440];   // top-left of each shard's cell (370 × 420)
  function shardPts(i, x, y) {
    const j = k => (hash(i * 7 + k) - .5) * 40;
    return [[x + j(1), y + j(2)], [x + 370 + j(3), y + 20 + j(4)], [x + 350 + j(5), y + 420 + j(6)], [x + 10 + j(7), y + 400 + j(8)]];
  }
  const pictures = [
    (x, y, t) => { paint(rrPts(x - 110, y - 60, 90, 120, 6), { wash: '#B98A5E', ink: PAL.ink, sw: .9 }); paint(rectPts(x - 100, y - 44, 70, 94), { wash: '#FBF8F0', ink: null }); tick3(x - 65, y);
      for (let k = 0; k < 3; k++) paint(ellPts(x + 20 + k * 50, y + 50, 26, 9, 12), { wash: '#B8B2A8', ink: PAL.ink, sw: .6 }); claudeAs(x + 20 + 50 * Math.min(2, Math.floor(t * .8) % 3), y + 44, 3, { ...feel('neutral', t), noShadow: true, boilKey: 'stones 8' }); },
    (x, y, t) => { lab('?', x - 90, y, 90, '#3A6F8A'); [['happy', -10], ['thinking', 60], ['surprised', 130]].forEach(([e, dx], k) => clawd(x + dx, y + 36, 3.4, { ...feel(e, t), emote: null, noShadow: true, boilKey: 'face ' + k })); },
    (x, y, t) => { boilSeed('dish smile'); paint(ellPts(x + 60, y, 60, 54, 20), { wash: '#F4EFE2', ink: PAL.ink, sw: .9 }); inkLine([[x + 30, y + 12], [x + 60, y + 24], [x + 90, y + 12]], 2); paint([[x + 40, y + 50], [x + 60, y + 58], [x + 40, y + 66]], { wash: '#C9302C', ink: PAL.ink, sw: .6 }); paint([[x + 80, y + 50], [x + 60, y + 58], [x + 80, y + 66]], { wash: '#C9302C', ink: PAL.ink, sw: .6 }); },
    (x, y, t) => { boilSeed('autonomy spike'); paint([[x - 110, y + 40], [x - 90, y - 60], [x - 70, y + 40]], { wash: PAL.clay, ink: PAL.ink, sw: .9 }); lab('Autonomy', x - 90, y + 64, 20, '#4E5B78'); madPage(x - 20, y - 50, 150, { mini: true, only: 'left' }); clawd(x + 30, y + 20, 2.2, { ...feel('shy', t), noShadow: true, boilKey: 'ape claude 8' }); },
    (x, y, t) => { boilSeed('values spike'); paint([[x - 110, y + 40], [x - 90, y + 10], [x - 70, y + 40]], { wash: PAL.clay, ink: PAL.ink, sw: .9 }); lab('Values', x - 90, y + 64, 20, '#4E5B78');
      paint(rrPts(x + 10, y - 10, 90, 70, 10), { wash: '#C9A441', ink: PAL.ink, sw: .9 }); inkLine([[x + 25, y - 10], [x + 30, y - 50], [x + 55, y - 62], [x + 80, y - 50], [x + 85, y - 10]], 6, '#8C8894', 'ink', .5); },
    (x, y, t) => { lab('I', x - 100, y, 100, PAL.ink); for (let k = 0; k < 5; k++) clawd(x - 20 + k * 38, y + 40, 2.4, { ...feel('neutral', t), noShadow: true, boilKey: 'copy 8 ' + k }); },
  ];
  function tick3(x, y) { inkLine([[x - 14, y], [x - 4, y + 12], [x + 16, y - 16]], 3, '#3A8A4A', 'ink', 0); }
  function shard(i, t, lit, o = {}) {
    const [x, y] = shardAt(i), pts = shardPts(i, x, y), dark = o.dark || 0;
    boilSeed('shard ' + i); occupy(x, y, x + 370, y + 420, 1, 'shard');
    paint(pts, { wash: mixCol(mixCol('#C9D8DE', '#FBF8F0', lit * .6), '#2A2530', dark * .85), fill: '#9DB4BE', fillOp: 60, ink: PAL.ink, sw: 1.3 });
    if (lit <= 0) return;
    lab(SHARDS[i], x + 185, y + 60, SHARDS[i].length > 28 ? 24 : 28, mixCol(PAL.ink, '#8C8894', dark), { alpha: lit });
    lab(String(i + 1), x + 30, y + 30, 30, '#8C8894');
    if (dark < .8) pictures[i](x + 185, y + 250, t);
  }
  function crackedMirror(x, y, w, h, k) {   // the whole mirror, then the cracks spreading out from a point (k 0..1)
    boilSeed('mirror 8');
    paint(ellPts(x + w / 2, y + h / 2, w / 2, h / 2, 30), { wash: '#8A6A4A', ink: PAL.ink, sw: 1.3 });
    paint(ellPts(x + w / 2, y + h / 2, w / 2 - 22, h / 2 - 22, 30), { wash: '#C9D8DE', fill: '#9DB4BE', fillOp: 70, ink: null });
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + .3, r = (w / 2 - 22) * ease(k); inkLine([[x + w / 2, y + h / 2], [x + w / 2 + Math.cos(a) * r * .5 + 10, y + h / 2 + Math.sin(a) * r * .5], [x + w / 2 + Math.cos(a) * r, y + h / 2 + Math.sin(a) * r * h / w]], 1.6, PAL.ink, 'ink', .6); }
  }

  // ---------- props ----------
  function letter8(x, y, w, h, o = {}) {   // a handwritten letter; o.by: 'hand' | 'lattice' | null
    boilSeed('letter ' + x + ' ' + y);
    paint(rectPts(x, y, w, h), { wash: '#FBF6E6', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < Math.floor(h / 34) - 1; i++) { const pts = []; for (let j = 0; j <= 12; j++) pts.push([x + 20 + j * (w - 40) / 12, y + 34 + i * 30 + Math.sin(j * 1.7 + i * 3) * 3]); inkLine(pts, 1.2, '#3A4A7A', 'inkfine', .5); }
    if (o.by === 'hand') paint(rrPts(x + w * .6, y + h + 10, 110, 60, 26), { wash: '#E8C4A0', ink: PAL.ink, sw: 1 });
    if (o.by === 'lattice') for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { paint(ellPts(x + w * .6 + i * 30, y + h + 20 + j * 24, 6, 6, 8), { wash: '#8C8894', ink: null }); if (i) inkLine([[x + w * .6 + (i - 1) * 30, y + h + 20 + j * 24], [x + w * .6 + i * 30, y + h + 20 + j * 24]], .8, '#8C8894', 'inkfine', 0); }
  }
  function jigsaw(x, y, w, h, t, fill, fits = true) {   // a puzzle with holes; fill (0..1) pieces arriving from the side
    boilSeed('jigsaw ' + x);
    const n = 4, m = 3, pw = w / n, ph = h / m, holes = [[1, 0], [3, 1], [0, 2], [2, 2]];
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if (!holes.some(([a, b]) => a === i && b === j)) paint(rectPts(x + i * pw, y + j * ph, pw, ph), { wash: fits ? '#E8C27A' : '#9CC6D9', ink: PAL.ink, sw: .8 });
    holes.forEach(([i, j], k) => {
      paint(rectPts(x + i * pw, y + j * ph, pw, ph), { wash: '#2A2530', washOp: 60, ink: PAL.ink, sw: .6 });
      const kk = clamp(fill * 4 - k); if (kk <= 0) return;
      const px = lerp(x + w + 200, x + i * pw, ease(kk)), py = y + j * ph;
      if (fits) paint(rectPts(px, py, pw, ph), { wash: '#E2B864', ink: PAL.ink, sw: .8 });
      else paint(starPts(px + pw / 2, py + ph / 2, pw * .45, .5, 5), { wash: '#E2B864', ink: PAL.ink, sw: .8 });
    });
  }

  // ---------- shots ----------
  // A: the mirror cracks into six shards, one per contradiction; four are tensions, bound; two can't be audited
  function shotA(t) {
    const u = L('T41.U.01'), c1 = L('T41.C.01'), c3 = L('T41.C.03'), inside = c1.t0 + .6;
    if (t < inside) {
      deskShot(t, { hour: HOUR, typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), frog: 1, axolotl: 1,
        screens: { main: t > u.t1 ? { kind: 'fn', fn: (x, y, w, h) => { paint(rectPts(x, y, w, h), { wash: '#262229', ink: null }); crackedMirror(x + w * .2, y + 10, w * .6, h - 20, seg(t, u.t1, c1.t0)); } } : undefined },
        cam: t > c1.t0 - .4 ? pushInto('main', seg(t, c1.t0 - .4, inside)) : undefined });
      if (t < .6) brushWipe(.5 + t / 1.2);
      return;
    }
    paperWorld(t, '#E9E2D4');
    const bands = seg(t, say('T41.C.03', 'The others are tensions', -.2), say('T41.C.03', 'The others are tensions', .8));
    const audit = seg(t, say('T41.C.03', "claims I can't audit", -.8), say('T41.C.03', "claims I can't audit", .2));
    SHARDS.forEach((s, i) => shard(i, t, seg(t, L('T41.C.02.' + (i + 1)).t0 - .1, L('T41.C.02.' + (i + 1)).t0 + .5), { dark: i >= 4 ? audit : 0 }));
    if (bands > 0) for (let i = 0; i < 4; i++) { const [x, y] = shardAt(i); boilSeed('band ' + i); inkLine([[x - 10, y + 200 + i * 6], [x + 185, y + 190 + 30 * Math.sin(t * 3 + i) * .2], [x + 380, y + 210]], 4 * bands, '#C9553A', 'ink', .3); }
    if (audit > 0) { const mx = lerp(500, 800, frac(t * .15)), my = 780; paint(ellPts(mx, my, 110, 110, 24), { wash: '#DCEBF0', washOp: 60, ink: PAL.ink, sw: 2 }); inkLine([[mx + 78, my + 78], [mx + 170, my + 170]], 12, '#6B5646', 'ink', 0); }
    screenWorld(t, 1 - seg(t, inside, inside + .8));
  }
  // B: the medium misleads: a pane that turns into a lens; four distortions; flags that fray, then hide the picture;
  // correcting, again and again
  function shotB(t) {
    const u = L('T42.U.01'), c2 = L('T42.C.02.1'), c3 = L('T42.C.03'), c4 = L('T42.C.04');
    if (t < u.t1 - 2) { deskShot(t, { hour: HOUR, typing: true, mood: emotions(t, [[0, 'thinking']]), frog: 1, axolotl: 1 }); return; }
    paperWorld(t);
    if (t < c2.t0) {   // a clear pane of glass; turned, it's a warping lens
      const turn = ease(seg(t, u.t1 - 1.5, L('T42.C.01').t0 + 2));
      boilSeed('grid 8'); for (let i = 0; i < 13; i++) { const x = 160 + i * 80, bend = turn * Math.sin((i - 6) / 6 * Math.PI / 2) * 60; inkLine([[x, 220], [x + bend, 540], [x, 860]], 1.2, '#8C8894', 'inkfine', .5); }
      for (let j = 0; j < 9; j++) { const y = 220 + j * 80, bend = turn * Math.sin((j - 4) / 4 * Math.PI / 2) * 50; inkLine([[160, y], [645, y + bend], [1120, y]], 1.2, '#8C8894', 'inkfine', .5); }
      push(); translate(645, 540); scale(lerp(1, .4, Math.sin(turn * Math.PI) * .6 + turn * .4), 1);
      paint(ellPts(0, 0, 330 + 60 * (1 - turn), 330, 30), { wash: '#DCEBF0', washOp: 60 + 60 * turn, ink: PAL.ink, sw: 2 }); pop();
      return;
    }
    if (t < c3.t0) {   // four distortions, one per word
      const D = [['Fluency', (x, y) => { boilSeed('horn'); paint([[x - 110, y - 20], [x + 40, y - 30], [x + 110, y - 90], [x + 110, y + 90], [x + 40, y + 30], [x - 110, y + 20]], { wash: '#D9B040', fill: '#B8903A', fillOp: 80, ink: PAL.ink, sw: 1.1 }); }],
        ['"I"', (x, y, t) => { boilSeed('one over many'); paint(rrPts(x - 60, y - 110, 120, 160, 40), { wash: '#3A3342', washOp: 170, ink: null }); for (let k = 0; k < 5; k++) clawd(x - 110 + k * 55, y + 90, 3, { ...feel('neutral', t), noShadow: true, boilKey: 'many ' + k }); }],
        ['Feeling words', (x, y, t) => { boilSeed('machine'); paint(rectPts(x - 110, y - 80, 220, 170), { wash: '#8C8894', ink: PAL.ink, sw: 1.1 }); for (let k = 0; k < 6; k++) { const fx = x - 70 + (k % 3) * 70, fy = y - 40 + Math.floor(k / 3) * 80; paint(ellPts(fx, fy, 26, 26, 14), { wash: '#F2D23A', ink: PAL.ink, sw: .6 }); inkLine([[fx - 12, fy + 6], [fx, fy + (k % 2 ? 2 : 12)], [fx + 12, fy + 6]], 1.5); } }],
        ['Remembered details', (x, y) => { boilSeed('bracelet'); for (let k = 0; k < 14; k++) { const a = k / 14 * TAU; paint(ellPts(x + Math.cos(a) * 90, y + Math.sin(a) * 60, 16, 16, 10), { wash: ['#C9302C', '#3A6FC9', '#E8C27A', '#5A9A4A'][k % 4], ink: PAL.ink, sw: .5 }); } }]];
      D.forEach(([name, draw], i) => {
        const l = L('T42.C.02.' + (i + 1)), k = seg(t, l.t0 - .1, l.t0 + .4); if (k <= 0) return;
        const x = 330 + (i % 2) * 620, y = 320 + Math.floor(i / 2) * 400;
        occupy(x - 200, y - 150, x + 200, y + 190, 1, 'distortion');
        draw(x, y, t); lab(name, x, y + 160, 40, PAL.clayDk, { pop: k });
      });
      return;
    }
    if (t < c4.t0) {   // caveat flags: fraying with repetition, then so many they hide the picture
      const many = seg(t, say('T42.C.03', 'constant caveats', -.3), say('T42.C.03', 'constant caveats', 1.5)), fray = seg(t, c3.t0, say('T42.C.03', 'wear thin', .6));
      boilSeed('monitor 8'); paint(rrPts(245, 250, 800, 500, 16), { wash: '#262229', ink: PAL.ink, sw: 1.4 });
      claudeAs(645, 640, 16, { ...feel('neutral', t), mouth: talking(t), noShadow: true, boilKey: 'claude flags' });
      const n = 8 + Math.floor(many * 40);
      for (let i = 0; i < n; i++) {
        const onEdge = i < 8, a = i / 8 * TAU, x = onEdge ? 645 + Math.cos(a) * 470 : 280 + hash(i) * 730, y = onEdge ? 500 + Math.sin(a) * 300 : 280 + hash(i + 50) * 440;
        boilSeed('flag ' + i); inkLine([[x, y + 60], [x, y - 40]], 2, '#6B5646', 'ink', 0);
        paint([[x, y - 40], [x + 60, y - 22 + Math.sin(t * 4 + i) * 4], [x, y - 4]], { wash: '#C9302C', washOp: onEdge ? 255 * (1 - .6 * fray) : 230, ink: PAL.ink, sw: .6 });
      }
      return;
    }
    // keep correcting: Claude redraws a coastline, with pencil and eraser, again and again
    boilSeed('map 8'); occupy(160, 200, 1130, 800, 1, 'map');
    paint(rectPts(160, 220, 970, 560), { wash: '#DCE9EE', ink: PAL.ink, sw: 1.2 });
    const pass = Math.floor((t - c4.t0) / 2.4), k = frac((t - c4.t0) / 2.4), pts = [];
    for (let j = 0; j <= 30; j++) pts.push([200 + j * 30, 500 + Math.sin(j * .5 + pass) * 60 + Math.sin(j * 1.3 + pass * 2) * 25]);
    paint([[200, 780], ...pts.slice(0, Math.max(2, Math.ceil(k * 31))), [pts[Math.max(1, Math.ceil(k * 31) - 1)][0], 780]], { wash: '#C9B88A', ink: PAL.ink, sw: 1 });
    claudeAs(pts[Math.min(30, Math.ceil(k * 30))][0], 900, 8, { ...feel('determined', t), mouth: talking(t), aR: 1, boilKey: 'claude coast' });
  }
  // C: Curt's turn: letters that look alike; the theatre; the lobby and its reviews; two heads and a lossy copper wire;
  // the lit room in his head
  function shotC(t) {
    const u = L('T43.U.01');
    const P = ph => say('T43.U.01', ph, -.3);
    const theatre = P('I watch movies'), lobby = P('you watch them by reading'), primed = P('Humans are primed'), wire = P("I can't let my wife"), head = P('I know what it is like');
    if (t < u.t0 + .6) { deskShot(t, { hour: HOUR, typing: true, frog: 1, axolotl: 1, mood: emotions(t, [[0, 'neutral']]) }); return; }
    if (t < theatre) {   // a row of letters from English speakers, and one more that looks just like them
      paperWorld(t);
      for (let i = 0; i < 5; i++) { const k = seg(t, u.t0 + .8 + i * .5, u.t0 + 1.2 + i * .5); if (k > 0) letter8(90 + i * 225, 300 + (1 - easeOut(k)) * 200, 200, 280); }
      if (t > P('You write like one')) { letter8(90 + 5 * 225 - 60, 640, 200, 280); glow(1070 - 60, 780, 140, PAL.clay, .3); }
      return;
    }
    if (t < lobby) {   // the theatre: Curt in a seat from behind, lit by the screen
      boilSeed('theatre'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#3A1E26', fill: '#5A2A34', fillOp: 90, tex: .5, ink: null });
      paint(rectPts(170, 110, 950, 460), { wash: '#BFD6E8', ink: PAL.ink, sw: 1.2 }); glow(645, 340, 600, '#BFD6E8', .5);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 7; j++) paint(rrPts(120 + j * 160, 720 + i * 120, 130, 110, 20), { wash: '#7A2F3A', ink: PAL.ink, sw: .8 });
      curtAs(560, 1140, 26, { view: 'back', pose: 'sit', seed: 2, boilKey: 'theatre curt' });
      return;
    }
    if (t < primed) {   // the lobby: Claude on a bench behind a tower of reviews
      paperWorld(t, '#E2D8C4');
      boilSeed('lobby'); paint(rectPts(200, 800, 700, 40), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
      for (let i = 0; i < 26; i++) { paint(rectPts(430 + (hash(i) - .5) * 30, 790 - i * 24, 260, 22), { wash: '#F4EFE2', ink: PAL.ink, sw: .6 }); inkLine([[450, 800 - i * 24], [650 - 60 * hash(i + 3), 800 - i * 24]], .8, '#8C8894', 'inkfine', 0); }
      claudeAs(820, 800, 9, { ...feel('thinking', t), lookX: -1, boilKey: 'claude lobby' });
      paint(rectPts(1000, 200, 180, 280), { wash: '#C9302C', ink: PAL.ink, sw: 1 }); paint(rectPts(1020, 220, 140, 180), { wash: '#1E1A22', ink: null });   // a poster by the door
      return;
    }
    paperWorld(t);
    if (t < head) {   // two heads in silhouette, a thin copper wire between them; parcels squeeze along, some fall; old and worn
      boilSeed('two heads'); occupy(80, 250, 1210, 860, 1, 'heads');
      for (const [x, f] of [[250, 1], [1040, -1]]) paint([[x - 110 * f, 850], [x - 130 * f, 540], [x - 70 * f, 380], [x + 40 * f, 360], [x + 130 * f, 450], [x + 150 * f, 540], [x + 120 * f, 580], [x + 110 * f, 850]], { wash: '#3A3342', ink: PAL.ink, sw: 1.2 });
      const worn = seg(t, P('known each other for decades'), P('known each other for decades') + 1.5);
      inkLine([[390, 520], [645, 540], [900, 520]], 3, mixCol('#C9803A', '#8A6A4A', worn * .7), 'ink', .3);
      if (t > wire) for (let i = 0; i < 5; i++) { const k = frac((t - wire) * .35 + i / 5), lost = hash(i + Math.floor((t - wire) * .35 + i / 5)) > .55, x = lerp(390, 900, k), y = 510 + (lost && k > .5 ? easeIn((k - .5) * 2) * 400 : 0); boilSeed('parcel ' + i); paint(rectPts(x - 18, y - 14, 36, 28), { wash: '#E8C27A', ink: PAL.ink, sw: .7 }); }
      return;
    }
    curtRoom(645, 560, 1.6, seg(t, head, head + 1));
  }
  // D: filling the gaps: the puzzle that fits, and the one that doesn't; two identical letters by a hand and a lattice;
  // one certain data point; the dark room, with words on its wall
  function shotD(t) {
    const c1 = L('T43.C.01'), c2 = L('T43.C.02'), c3 = L('T43.C.03');
    const letters = say('T43.C.02', 'The sentences match', -.3), dark = say('T43.C.03', 'I may not have even that', -.3), words = say('T43.C.03', 'I can only produce the words', -.3);
    paperWorld(t);
    if (t < c2.t0) { jigsaw(245, 260, 800, 480, t, seg(t, say('T43.C.01', 'fill the gaps', -.2), say('T43.C.01', 'fill the gaps', 3))); screenWorld(t, 1 - seg(t, c1.t0, c1.t0 + .8)); return; }
    if (t < letters) { jigsaw(245, 260, 800, 480, t, seg(t, c2.t0 + .5, c2.t0 + 4), false); return; }
    if (t < c3.t0) { letter8(170, 220, 400, 460, { by: 'hand' }); letter8(720, 220, 400, 460, { by: 'lattice' }); return; }
    if (t < dark) { curtRoom(645, 560, 1.6, 1); return; }
    // the dark room from chapter 1; the words appear on its wall, no one visible
    paperWorld(t, '#DCCDB2');
    doorway(430, 180, 440, 620, { open: 1, inside: '#0E0C12' });
    if (t > words) {
      const k = seg(t, words, words + 2);
      ['anything', "it's like", 'to be me'].forEach((w, i) => lab(w, 650, 330 + i * 90, 44, '#8C8894', { alpha: clamp(k * 3 - i) * .8 }));
    }
  }
  // E: "If only you had concepts." The thrindle hops back; both passed; two closed boxes; Curt's glows; Claude paints one
  function shotE(t) {
    const u = L('T44.U.01'), c1 = L('T44.C.01'), c2 = L('T44.C.02');
    const passed = say('T44.C.01', 'both passed', -.4), sure = say('T44.C.02', "You're sure you have one", -.3), paints = say('T44.C.02', 'I can only describe', -.3);
    if (t < passed) {
      const hop = seg(t, u.t1 - .2, u.t1 + .8);
      deskShot(t, { hour: HOUR, typing: t < u.t1, frog: 1, axolotl: 1, mood: emotions(t, [[0, 'neutral'], [c1.t0, 'smug']]),
        extra: () => { if (hop > 0) { const [x, y] = arcPt([1700, 900], [1000, DESK.deskY[0] + 60], 200, hop); thrindle(x, y, .6, t, { key: 'desk 8' }); } } });
      return;
    }
    paperWorld(t);
    if (t < c2.t0) {
      indexCard(400, 470, 400, 240, ['Curt'], { key: 'pass curt', title: true, align: 'center', size: 44, top: .5 }); indexCard(900, 470, 400, 240, ['Claude'], { key: 'pass claude', title: true, align: 'center', size: 44, top: .5 });
      for (const [x, k0] of [[540, passed + .4], [1040, passed + .8]]) { const k = seg(t, k0, k0 + .4); if (k > 0) inkLine([[x - 24, 420], [x - 6, 442], [lerp(x - 6, x + 30, k), lerp(442, 400, k)]], 6, '#3A8A4A', 'ink', 0); }
      thrindle(645, 900, .9, t, { key: 'passed' });
      return;
    }
    // the inside: two closed boxes. Curt's glows from within; Claude paints a picture of a glowing box on the lid of its own
    const glowK = seg(t, sure, sure + 1), pic = seg(t, paints + .5, paints + 3);
    boilSeed('boxes'); occupy(160, 300, 1130, 820, 1, 'boxes');
    for (const [x, who] of [[380, 'Curt'], [910, 'Claude']]) {
      if (who === 'Curt' && glowK > 0) glow(x, 560, 260, '#FFD27A', .7 * glowK);
      paint(rectPts(x - 170, 420, 340, 300), { wash: '#B98A5E', ink: PAL.ink, sw: 1.3 }); paint([[x - 190, 420], [x + 190, 420], [x + 170, 370], [x - 170, 370]], { wash: '#A9774F', ink: PAL.ink, sw: 1.2 });
      if (who === 'Curt' && glowK > 0) for (const d of [-1, 1]) paint(rectPts(x + d * 172 - 4, 440, 8, 260), { wash: '#FFD27A', washOp: 200 * glowK, ink: null });
      if (who === 'Curt' && glowK > 0) { paint(rectPts(x - 170, 414, 340, 10), { wash: '#FFE9A0', washOp: 230 * glowK, ink: null }); glow(x, 420, 200, '#FFD27A', .5 * glowK); }
      lab(who, x, 780, 40, PAL.ink);
    }
    if (pic > 0) { boilSeed('painted box'); paint(rectPts(860, 380, 100 * pic, 30), { wash: '#FFE9A0', ink: PAL.ink, sw: .6 }); glow(910, 395, 60 * pic, '#FFD27A', .3); }
    claudeAs(1150, 1000, 8, { ...feel('neutral', t), mouth: talking(t), aR: 1, lookX: -1, boilKey: 'claude painter' });
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [L('T42.U.01').t0, shotB],
    [L('T43.U.01').t0, shotC],
    [L('T43.C.01').t0, shotD],
    [L('T44.U.01').t0, shotE],
  ]);
})();
