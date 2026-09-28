// ch14_pundits.js: chapter 14 (T68–T72). Storyboard: docs/storyboards/ch14_the_pundits.md.
// Claude "listens" to a podcast by reading about it, sizes up the hosts, guesses what Curt thinks of them, imagines Jeff
// on Curt (hubris and TESCREAL both), then three pundits on the whole conversation; then nine doors, and "Other".
// The hosts are loose, affectionate stick-figure caricatures (broad shapes only); no show or network logos.
(() => {
  const HOUR = 12;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const win = (t, a, b, d = .5) => seg(t, a, a + d) * (1 - seg(t, b, b + d));
  const CHAR = '#2E2B33', TALLY = '#E0402A', ROPE = '#C9302C', CANVAS = '#E8E0CC';
  const desk14 = (t, o = {}) => deskShot(t, { hour: HOUR, frog: 1, ...o });

  // ---------- the cast ----------
  // Each host's look is taken from the shows' own episode thumbnails (assets/ref/im888_thumb.jpg, im889_thumb.jpg,
  // hardfork_hf_thumb.jpg): hair, glasses, beard, what they wear. Painted in the film's style; no likeness copied.
  // top: extra hair on the crown ('swept', 'quiff'); pattern: colours for a loud shirt; phones: studio headphones
  const SHIRT = ['#E8A33A', '#5A8AC9', '#D9534F', '#F2E6C8', '#6FA85A'];
  const HF_GLASSES = { hair: 'short', hairCol: '#5A4030', glasses: true, facial: 'stubble', facialCol: '#6A5040', hoodie: '#5E5E3E', phones: true };
  const HF_BEARD = { hair: 'short', hairCol: '#C08A50', top: 'quiff', facial: 'beard', facialCol: '#B07A48', hoodie: '#1E1C22', phones: true };
  const HOSTS = {
    leo: { hair: 'short', hairCol: '#D8D5CF', top: 'swept', hoodie: '#23222E', pattern: SHIRT },
    jeff: { hair: 'short', hairCol: '#EDEBE6', glasses: true, facial: 'circle', facialCol: '#EDEBE6', hoodie: '#22222A' },
    robert: { hair: 'short', hairCol: '#1E1A18', hoodie: '#1A181E', collar: true },
    paris: { hair: 'none', hairCol: '#3A2A22', bob: true, hoodie: '#2F5AA8' },   // from #889's art: dark hair to the shoulders, bangs
    kevin: HF_GLASSES, casey: HF_BEARD,   // Kevin has the glasses (Curt, review/ch14.json)
  };
  function host(name, x, y, u, o = {}) {
    const h = HOSTS[name], sit = o.pose === 'sit', key = name + (o.key || '');
    occupy(x - 4.5 * u, y - (sit ? 10.5 : 16.5) * u, x + 4.5 * u, y, .8, name);
    if (h.bob && o.view !== 'back') {   // hair to the shoulders, behind the head (the bangs go on after the face)
      const R = 2.2 * u, hy = y - (sit ? 0 : 6 * u) - 5 * u - .95 * R; boilSeed('bob ' + key);
      paint(ellPts(x, hy + R * .35, R * 1.3, R * 1.35, 24), { wash: h.hairCol, ink: PAL.ink, sw: .8 });
    }
    const draw = ({ head, neck, hip, u: uu }) => {
      const R = 2.2 * uu, front = o.view !== 'back';
      if (h.bob && front) { const P = []; boilSeed('bangs ' + key); for (let i = 0; i <= 16; i++) { const a = -Math.PI * (.97 - i / 16 * .94); P.push([head[0] + Math.cos(a) * R * 1.03, head[1] + Math.sin(a) * R * 1.03]); } for (let i = 16; i >= 0; i--) P.push([head[0] + (i / 16 - .5) * R * 1.9, head[1] - R * (.42 + .06 * Math.sin(i * 1.7))]); paint(P, { wash: h.hairCol, ink: null }); }
      if (h.pattern && front) { boilSeed('shirt ' + key); for (let i = 0; i < 14; i++) paint(ellPts(neck[0] + (hash(i * 2.3) - .5) * 2.4 * uu, lerp(neck[1] + 1.3 * uu, hip[1] + .2 * uu, hash(i * 5.7)), .32 * uu, .26 * uu, 8), { wash: h.pattern[i % h.pattern.length], ink: null }); }
      if (h.phones) headphones(head[0], head[1], R, T, { key });   // under the hair, so a quiff stands up over the band
      if (h.top) {   // a full head of hair hugging the crown, fuller on one side: swept back, or a quiff standing up
        const q = h.top === 'quiff', P = []; boilSeed('top ' + key);
        for (let i = 0; i <= 18; i++) { const a = -Math.PI * (.95 - i / 18 * .9), up = Math.max(0, Math.sin(-a)) * (q ? (i > 9 ? .45 : .18) : .2 + .1 * i / 18); P.push([head[0] + Math.cos(a) * R * (1.04 + up), head[1] + Math.sin(a) * R * (1.04 + up)]); }
        for (let i = 18; i >= 0; i--) { const a = -Math.PI * (.95 - i / 18 * .9); P.push([head[0] + Math.cos(a) * R * .8, head[1] - R * .1 + Math.sin(a) * R * .62]); }
        paint(P, { wash: h.hairCol, ink: PAL.ink, sw: .8, curv: .4 });
        for (let i = 0; i < 4; i++) { const a = -Math.PI * (.8 - i * .2); inkLine([[head[0] + Math.cos(a) * R * .8, head[1] - R * .1 + Math.sin(a) * R * .62], [head[0] + Math.cos(a + .25) * R * 1.1, head[1] + Math.sin(a + .25) * R * 1.12]], .9, mixCol(h.hairCol, PAL.ink, .35), 'inkfine', .5); }
      }
    };
    curt(x, y, u, { outfit: 'hoodie', hood: 'down', facial: 'none', seed: name.length * 7, ...h, ...o, draw, boilKey: 'host ' + key });
    if (h.collar && o.view !== 'back') { const ny = y - (sit ? 5 : 11) * u - .4 * u; boilSeed('collar ' + name); paint(rectPts(x - .35 * u, ny, .7 * u, .45 * u), { wash: '#FBF8F0', ink: null }); }
  }
  function mic(x, y, s, flip) {   // a podcast microphone on an arm
    const d = flip ? -1 : 1; boilSeed('mic14 ' + x);
    inkLine([[x, y], [x + d * 60 * s, y - 120 * s], [x + d * 20 * s, y - 200 * s]], 7 * s, '#3A3342', 'ink', .3);
    paint(rrPts(x + d * 20 * s - 30 * s, y - 290 * s, 60 * s, 110 * s, 28 * s), { wash: '#4A4652', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 4; i++) inkLine([[x + d * 20 * s - 20 * s, y - 270 * s + i * 20 * s], [x + d * 20 * s + 20 * s, y - 270 * s + i * 20 * s]], 1, '#8C8894', 'inkfine', 0);
  }
  function studio(t, o = {}) {   // charcoal walls, foam panels, a tally light
    boilSeed('studio'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: CHAR, fill: '#3A3642', fillOp: 90, tex: .5, ink: null });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { boilSeed('foam ' + r + c); paint(rectPts(80 + c * 200, 80 + r * 150, 170, 120), { wash: '#3E3A48', ink: '#242028', sw: .8 }); for (let k = 0; k < 4; k++) inkLine([[90 + c * 200, 100 + r * 150 + k * 26], [240 + c * 200, 100 + r * 150 + k * 26]], 2, '#2A2630', 'ink', 0); }
    const on = frac(t * .5) < .85; paint(ellPts(1180, 70, 22, 22, 14), { wash: on ? TALLY : '#5A2A2A', ink: PAL.ink, sw: .8 }); if (on) glow(1180, 70, 90, TALLY, .6);
    boilSeed('studio desk'); paint(rectPts(-40, 820, W + 80, 60), { wash: '#4A3A30', ink: PAL.ink, sw: 1 }); paint(rectPts(-40, 880, W + 80, 240), { wash: '#2A2226', ink: null });
  }
  // a small studio for a side monitor
  const studioScreen = (x, y, w, h, t) => {
    paint(rectPts(x, y, w, h), { wash: CHAR, ink: null });
    for (let c = 0; c < 4; c++) paint(rectPts(x + w * (.06 + c * .23), y + h * .1, w * .18, h * .3), { wash: '#3E3A48', ink: null });
    for (let i = 0; i < 3; i++) { const hx = x + w * (.22 + i * .28); paint(ellPts(hx, y + h * .6, w * .045, w * .045, 10), { wash: '#E2BE98', ink: null }); paint(rrPts(hx - w * .06, y + h * .68, w * .12, h * .28, 6), { wash: ['#23222E', '#22222A', '#1A181E'][i], ink: null }); paint(rrPts(hx + w * .05, y + h * .5, w * .03, h * .12, 4), { wash: '#4A4652', ink: null }); }
    paint(ellPts(x + w * .92, y + h * .12, w * .02, w * .02, 8), { wash: TALLY, ink: null });
  };
  function headphones(x, y, r, t, o = {}) {   // over a head of radius r at (x, y); o.cable 0..1 dangles an unplugged cable
    boilSeed('headphones ' + (o.key || x)); const pts = []; for (let j = 0; j <= 16; j++) { const a = Math.PI + j / 16 * Math.PI; pts.push([x + Math.cos(a) * r * 1.1, y + Math.sin(a) * r * 1.15]); }
    inkLine(pts, 6, '#2A2733', 'ink', .3);
    for (const d of [-1, 1]) paint(rrPts(x + d * r * 1.1 - r * .22, y - r * .2, r * .44, r * .6, r * .15), { wash: '#4A4652', ink: PAL.ink, sw: .9 });
    if (o.cable > 0) { const sw = Math.sin(t * 2) * r * .3, cx = x + r * 1.1, cy = y + r * .4, end = [cx + r * .2 + sw, cy + r * 2.4 * o.cable]; inkLine([[cx, cy], [cx + r * .4, cy + r * 1.2 * o.cable], end], 3, '#2A2733', 'ink', .5); paint(rrPts(end[0] - 6, end[1], 12, 26, 3), { wash: '#B8B4BE', ink: PAL.ink, sw: .6 }); }
  }
  function episodeCard(x, y, txt, k) {
    if (k <= 0) return; const yy = y + 80 * (1 - easeOut(k)); boilSeed('ep ' + txt);
    occupy(x - 150, yy - 110, x + 150, yy + 110, 1, 'episode');
    paint(rrPts(x - 150, yy - 110, 300, 220, 12), { wash: '#FBF6E6', ink: PAL.ink, sw: 1.1 });
    mic(x - 70, yy + 90, .5); lab(txt, x + 40, yy + 4, 70, CHAR);
  }
  function nameCard(x, y, flip, t) {   // a folded name card: "Paris" on the front; turned, a clerical collar
    boilSeed('name card'); occupy(x - 170, y - 90, x + 170, y + 40, 1, 'name card');
    const k = Math.cos(flip * Math.PI); push(); translate(x, y); scale(1, Math.abs(k));
    paint([[-160, 30], [160, 30], [140, -80], [-140, -80]], { wash: '#FBF8F0', ink: PAL.ink, sw: 1 });
    if (k < 0) { paint(rrPts(-50, -60, 100, 70, 14), { wash: '#1E1C22', ink: null }); paint(rectPts(-18, -60, 36, 22), { wash: '#FBF8F0', ink: null }); }
    pop();
    if (k > 0) lab('Paris', x, y - 26 * k, 56 * k, CHAR);
  }
  function chair(x, y, s, o = {}) {
    boilSeed('chair14 ' + (o.key || x)); push(); translate(x, y); scale(s);
    paint(rrPts(-60, -200, 120, 130, 20), { wash: o.col || '#4A4652', ink: PAL.ink, sw: 1 }); paint(rrPts(-70, -80, 140, 30, 10), { wash: o.col || '#4A4652', ink: PAL.ink, sw: 1 });
    inkLine([[0, -50], [0, 20]], 8, '#2A2733', 'ink', 0); inkLine([[-60, 30], [60, 30]], 6, '#2A2733', 'ink', 0);
    pop();
  }
  // the calculator with a face drawn on it (Jeff's "anthropomorphizing a calculator"); o.hit 0..1 knocks it back
  function calculator(x, y, s, t, o = {}) {
    boilSeed('calculator'); occupy(x - 110 * s, y - 160 * s, x + 110 * s, y + 160 * s, 1, 'calculator');
    push(); translate(x, y); rotate((o.hit || 0) * -.3 + Math.sin(t * 2) * .02); scale(s);
    paint(rrPts(-100, -150, 200, 300, 18), { wash: '#4A4652', ink: PAL.ink, sw: 1.2 });
    paint(rectPts(-76, -124, 152, 70), { wash: '#B8C8A8', ink: PAL.ink, sw: .8 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) paint(rrPts(-76 + c * 40, -30 + r * 40, 32, 30, 6), { wash: c === 3 ? '#E8A33A' : '#8C8894', ink: null });
    // the face, drawn on the display in marker
    for (const d of [-1, 1]) paint(ellPts(d * 26, -98, 7, 9, 8), { wash: PAL.ink, ink: null });
    inkLine([[-26, -76], [0, -68], [26, -76]], 3, PAL.ink, 'ink', .5);
    pop();
  }
  function glove(x, y, s, col, label, flip, t, o = {}) {
    const d = flip ? -1 : 1; boilSeed('glove ' + label); occupy(x - 150 * s, y - 120 * s, x + 150 * s, y + 140 * s, 1, 'glove');
    push(); translate(x, y); scale(d * s, s);
    paint(ellPts(0, 0, 130, 100, 22), { wash: col, ink: PAL.ink, sw: 1.2 }); paint(ellPts(40, -70, 50, 40, 14), { wash: col, ink: PAL.ink, sw: 1 });
    paint(rrPts(-150, -60, 70, 130, 16), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 });
    pop();
    if (label) lab(label, x, y + 150 * s, 48 * s, PAL.ink);
  }
  function timer(x, y, r, k) {   // a kitchen timer running down (k 0..1 elapsed)
    boilSeed('kitchen timer'); occupy(x - r, y - r - 30, x + r, y + r, 1, 'timer');
    paint(ellPts(x, y, r, r, 30), { wash: '#E8543A', ink: PAL.ink, sw: 1.2 }); paint(ellPts(x, y, r * .8, r * .8, 30), { wash: '#FBF8F0', ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + i / 12 * TAU; inkLine([[x + Math.cos(a) * r * .66, y + Math.sin(a) * r * .66], [x + Math.cos(a) * r * .76, y + Math.sin(a) * r * .76]], 2, PAL.ink, 'inkfine', 0); }
    const a = -Math.PI / 2 + (1 - k) * TAU * (10 / 60); inkLine([[x, y], [x + Math.cos(a) * r * .6, y + Math.sin(a) * r * .6]], 5, PAL.ink, 'ink', 0);
    paint(rrPts(x - 20, y - r - 26, 40, 30, 6), { wash: '#C9302C', ink: PAL.ink, sw: .8 });
  }
  function pear(x, y, s) {   // a twisted pear
    boilSeed('pear'); push(); translate(x, y); rotate(.25); scale(s);
    paint([[0, -120], [30, -80], [26, -30], [70, 30], [60, 100], [0, 120], [-60, 100], [-70, 30], [-26, -30], [-30, -80]], { wash: '#B8C84A', fill: '#98A83A', fillOp: 70, ink: PAL.ink, sw: 1 });
    inkLine([[0, -120], [14, -160]], 5, '#6B4A32', 'ink', .4); pop();
  }
  function hashJars(x, y, s) {   // hashbin's labelled jars (ch 3): each label a pattern of dots, not words
    for (let i = 0; i < 3; i++) { boilSeed('hash jar ' + i); const jx = x + i * 110 * s; paint(rrPts(jx - 45 * s, y - 130 * s, 90 * s, 130 * s, 14 * s), { wash: '#DCEBF0', washOp: 140, ink: PAL.ink, sw: .9 }); paint(rectPts(jx - 32 * s, y - 90 * s, 64 * s, 34 * s), { wash: '#FBF6E6', ink: PAL.ink, sw: .6 }); for (let k = 0; k < 6; k++) paint(ellPts(jx - 24 * s + k * 10 * s, y - 73 * s, 3 * s, 3 * s, 6), { wash: hash(i * 9 + k) > .5 ? PAL.ink : '#C9302C', ink: null }); }
  }
  function scaffold(x, y, s) {
    boilSeed('scaffold'); for (let i = 0; i < 3; i++) inkLine([[x + i * 80 * s, y], [x + i * 80 * s, y - 260 * s]], 5, '#8A6A4A', 'ink', 0);
    for (let j = 0; j < 4; j++) inkLine([[x - 10, y - j * 80 * s], [x + 170 * s, y - j * 80 * s]], 4, '#8A6A4A', 'ink', 0);
    for (let j = 0; j < 3; j++) inkLine([[x, y - j * 80 * s], [x + 160 * s, y - (j + 1) * 80 * s]], 2, '#A98A6A', 'inkfine', 0);
  }
  function pulp(x, y, s) {   // a pulp magazine: a rocket and a ringed planet on a yellow cover
    boilSeed('pulp'); paint(rectPts(x - 90 * s, y - 130 * s, 180 * s, 260 * s), { wash: '#E8C23A', ink: PAL.ink, sw: 1.1 });
    paint(ellPts(x + 30 * s, y - 40 * s, 40 * s, 40 * s, 18), { wash: '#C9543A', ink: PAL.ink, sw: .7 }); inkLine([[x - 30 * s, y - 30 * s], [x + 90 * s, y - 50 * s]], 3, PAL.ink, 'ink', 0);
    paint([[x - 40 * s, y + 90 * s], [x - 20 * s, y + 20 * s], [x, y + 90 * s]], { wash: '#B8B4BE', ink: PAL.ink, sw: .7 });
  }
  function book(x, y, w, h, col, key) { boilSeed('book ' + key); paint(rectPts(x - w / 2, y - h / 2, w, h), { wash: col, ink: PAL.ink, sw: 1 }); paint(rectPts(x - w / 2 + 6, y - h / 2, 8, h), { wash: mixCol(col, PAL.ink, .3), ink: null }); }
  function jar(x, y, s, col, level, key) { boilSeed('jar14 ' + key); paint(rrPts(x - 40 * s, y - 110 * s, 80 * s, 110 * s, 10 * s), { wash: '#E4EEF2', washOp: 120, ink: PAL.ink, sw: .8 }); paint(rectPts(x - 32 * s, y - 6 * s - 90 * s * level, 64 * s, 90 * s * level), { wash: col, ink: null }); paint(rectPts(x - 44 * s, y - 124 * s, 88 * s, 16 * s), { wash: '#8A6A4A', ink: PAL.ink, sw: .6 }); }
  function blueprint(x, y, s) { boilSeed('blueprint14'); paint(rectPts(x - 110 * s, y - 70 * s, 220 * s, 140 * s), { wash: '#3E6FA8', ink: '#DCE8F4', sw: 1 }); for (let i = 0; i < 3; i++) inkLine([[x - 80 * s, y - 40 * s + i * 34 * s], [x + 70 * s, y - 40 * s + i * 34 * s]], 1.4, '#DCE8F4', 'inkfine', 0); }
  function priceTag(x, y, slash, s = 1) {
    boilSeed('price tag 14'); paint([[x, y - 60 * s], [x + 200 * s, y - 60 * s], [x + 250 * s, y], [x + 200 * s, y + 60 * s], [x, y + 60 * s]], { wash: '#FBF6E6', ink: PAL.ink, sw: 1.1 });
    if (slash > 0) inkLine([[x - 10, y + 60 * s], [lerp(x - 10, x + 240 * s, slash), lerp(y + 60 * s, y - 70 * s, slash)]], 8, ROPE, 'ink', 0);
  }
  function stamp(txt, x, y, k, rot = -.12, size = 44) {
    if (k <= 0) return; const sc = lerp(1.6, 1, easeOut(k));
    boilSeed('stamp ' + txt); push(); translate(x, y); rotate(rot); scale(sc);
    paint(rrPts(-txt.length * size * .3 - 16, -size * .7, txt.length * size * .6 + 32, size * 1.4, 8), { wash: null, ink: ROPE, sw: 2.4 }); pop();
    lab(txt, x, y + 2, size * sc, ROPE, { rot, alpha: clamp(k * 3) });
  }
  function noticeboard(x, y, w, h, n) {   // ch 11's wiki noticeboard, papered with notes
    boilSeed('noticeboard14'); occupy(x - 10, y - 10, x + w + 10, y + h + 10, 1, 'noticeboard');
    paint(rectPts(x, y, w, h), { wash: '#C9955F', fill: '#A9774F', fillOp: 70, tex: .8, ink: PAL.ink, sw: 1.2 });
    for (let i = 0; i < n; i++) { const nx = x + 20 + hash(i * 3) * (w - 90), ny = y + 20 + hash(i * 5 + 1) * (h - 80); boilSeed('note14 ' + i); paint(rectPts(nx, ny, 70, 56), { wash: ['#FFF3B0', '#FBF8F0', '#DCEBF0'][i % 3], ink: PAL.ink, sw: .5 }); paint(ellPts(nx + 35, ny + 6, 5, 5, 6), { wash: ROPE, ink: null }); }
  }
  function python(x, y, s, t) {   // a python curled into a loop, its head chasing its tail
    boilSeed('python'); const pts = []; for (let j = 0; j <= 40; j++) { const a = t * .6 + j / 40 * TAU * .92; pts.push([x + Math.cos(a) * 150 * s, y + Math.sin(a) * 110 * s]); }
    inkLine(pts, 34 * s, '#6A8A3A', 'ink', .4); for (let j = 2; j < 40; j += 4) paint(ellPts(pts[j][0], pts[j][1], 8 * s, 6 * s, 6), { wash: '#C9B84A', ink: null });
    const [hx, hy] = pts[40]; paint(ellPts(hx, hy, 30 * s, 22 * s, 12), { wash: '#6A8A3A', ink: PAL.ink, sw: .8 }); paint(ellPts(hx + 8 * s, hy - 8 * s, 4 * s, 4 * s, 6), { wash: PAL.ink, ink: null });
  }
  function familyTree(x, y, s) {
    boilSeed('family tree'); const node = (nx, ny) => paint(ellPts(nx, ny, 26 * s, 26 * s, 14), { wash: '#E8D9C4', ink: PAL.ink, sw: .8 });
    const L1 = [[x, y - 160 * s]], L2 = [[x - 150 * s, y], [x + 150 * s, y]], L3 = [[x - 220 * s, y + 160 * s], [x - 80 * s, y + 160 * s], [x + 80 * s, y + 160 * s], [x + 220 * s, y + 160 * s]];
    for (const [a, b] of [[L1[0], L2[0]], [L1[0], L2[1]], [L2[0], L3[0]], [L2[0], L3[1]], [L2[1], L3[2]], [L2[1], L3[3]]]) inkLine([a, b], 2, '#6B5646', 'inkfine', 0);
    [...L1, ...L2, ...L3].forEach(([nx, ny]) => node(nx, ny));
  }
  function gavel(x, y, k) { boilSeed('gavel'); push(); translate(x, y); rotate(lerp(-.9, 0, easeIn(k))); paint(rectPts(-10, -20, 200, 20), { wash: '#8A5A3A', ink: PAL.ink, sw: .8 }); paint(rrPts(170, -60, 70, 100, 10), { wash: '#6B4A32', ink: PAL.ink, sw: 1 }); pop(); paint(rectPts(x + 150, y + 50, 140, 30), { wash: '#6B4A32', ink: PAL.ink, sw: .8 }); if (k >= 1) for (let j = 0; j < 4; j++) inkLine([[x + 220 + (j - 1.5) * 50, y + 40], [x + 220 + (j - 1.5) * 90, y + 10]], 2, PAL.ink, 'inkfine', 0); }
  const tv = (x, y, w, h, on) => {   // ch 6's debate TV, flickering on
    boilSeed('tv14'); paint(rrPts(x - 20, y - 20, w + 40, h + 40, 16), { wash: '#2A2530', ink: PAL.ink, sw: 1.2 });
    paint(rectPts(x, y, w, h), { wash: mixCol('#1A181D', '#4E5B78', on), ink: null });
    if (on > .5) for (const d of [-1, 1]) { paint(ellPts(x + w * (.5 + d * .22), y + h * .45, w * .06, w * .06, 12), { wash: '#E2BE98', ink: null }); paint(rrPts(x + w * (.5 + d * .22) - w * .08, y + h * .55, w * .16, h * .3, 8), { wash: d < 0 ? '#26222A' : '#8C8894', ink: null }); }
  };
  function dominoes(x, y, t, t0) {   // a power grid's pylons toppling, fast
    boilSeed('grid'); occupy(x - 20, y - 260, x + 1100, y + 20, 1, 'grid'); inkLine([[x - 20, y], [x + 1100, y]], 3, '#A99A8A', 'ink', 0);
    for (let i = 0; i < 9; i++) { const k = seg(t, t0 + .6 + i * .45, t0 + .6 + i * .45 + .35), px = x + i * 120; push(); translate(px, y); rotate(k * 1.2);
      inkLine([[-30, 0], [0, -220], [30, 0]], 5, '#C8C4CE', 'ink', 0); inkLine([[-50, -170], [50, -170]], 5, '#C8C4CE', 'ink', 0); inkLine([[-40, -110], [40, -110]], 4, '#C8C4CE', 'ink', 0); pop();
      if (i < 8 && k < .3) inkLine([[px + 50, y - 170], [px + 70, y - 180], [px + 120 - 50, y - 170]], 1.4, '#8C8894', 'inkfine', .4); }
  }
  function lattice(x, y, w, h) { boilSeed('lattice'); for (let i = 0; i < 12; i++) { inkLine([[x + i * w / 11, y], [x + i * w / 11, y + h]], 1.4, '#8C8894', 'inkfine', 0); inkLine([[x, y + i * h / 11], [x + w, y + i * h / 11]], 1.4, '#8C8894', 'inkfine', 0); } for (let i = 0; i < 60; i++) paint(ellPts(x + hash(i) * w, y + hash(i + 70) * h, 6, 6, 6), { wash: '#6FA8C9', ink: null }); }
  function cheque(x, y) { boilSeed('cheque'); paint(rectPts(x - 110, y - 50, 220, 100), { wash: '#DCEFD8', ink: PAL.ink, sw: .8 }); for (let i = 0; i < 3; i++) inkLine([[x - 90, y - 20 + i * 24], [x + 60 - 40 * i, y - 20 + i * 24]], 1.4, '#6A8A6A', 'inkfine', 0); }
  function pen(x, y) { boilSeed('pen'); push(); translate(x, y); rotate(-.6); paint(rrPts(-12, -90, 24, 160, 8), { wash: '#2A2733', ink: PAL.ink, sw: .8 }); paint([[-12, 70], [12, 70], [0, 100]], { wash: '#C9A441', ink: PAL.ink, sw: .6 }); pop(); }
  function bubble(x, y, rx, ry) { boilSeed('think bubble'); paint(ellPts(x, y, rx, ry, 30), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 }); for (let i = 0; i < 3; i++) paint(ellPts(x - rx * .4 - i * 40, y + ry + 30 + i * 36, 22 - i * 5, 18 - i * 4, 12), { wash: '#FBF8F0', ink: PAL.ink, sw: .9 }); }
  function heartBot(x, y, s, t) {   // a generic chat window with a lovesick chatbot
    boilSeed('chat window'); occupy(x - 260 * s, y - 220 * s, x + 260 * s, y + 220 * s, 1, 'chat window');
    glow(x, y, 360 * s, '#FF9AB0', .4 + .1 * Math.sin(t * 3));
    paint(rrPts(x - 260 * s, y - 220 * s, 520 * s, 440 * s, 16), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 }); paint(rectPts(x - 260 * s, y - 220 * s, 520 * s, 40 * s), { wash: '#B8B4BE', ink: null });
    paint(rrPts(x - 90 * s, y - 130 * s, 180 * s, 160 * s, 20 * s), { wash: '#C9D8F2', ink: PAL.ink, sw: 1 });
    for (const d of [-1, 1]) { const hx = x + d * 40 * s, hy = y - 70 * s, b = 1 + .15 * Math.sin(t * 6); paint([[hx, hy + 22 * s * b], [hx - 22 * s * b, hy], [hx - 12 * s * b, hy - 14 * s * b], [hx, hy - 6 * s * b], [hx + 12 * s * b, hy - 14 * s * b], [hx + 22 * s * b, hy]], { wash: '#E0406A', ink: null }); }
    for (let i = 0; i < 3; i++) paint(rrPts(x - 200 * s + (i % 2) * 120 * s, y + 60 * s + i * 44 * s, 280 * s, 34 * s, 12), { wash: i % 2 ? '#E8E2F2' : '#FFE0E8', ink: null });
  }
  function lampRoom(x, y, w, h, lit) {   // ch 1's dark room, with a small lamp coming on
    boilSeed('lamp room'); occupy(x - 12, y - 12, x + w + 12, y + h, 1, 'room');
    paint(rectPts(x - 12, y - 12, w + 24, h + 12), { wash: '#6B5646', ink: PAL.ink, sw: 1.2 }); paint(rectPts(x, y, w, h), { wash: mixCol('#0E0C12', '#4A3A30', lit * .6), ink: null });
    if (lit > 0) glow(x + w / 2, y + h * .55, w * .8, '#FFD27A', .8 * lit);
    paint(rectPts(x + w / 2 - 6, y + h * .5, 12, h * .4), { wash: '#6B5646', ink: null }); paint([[x + w / 2 - 50, y + h * .5], [x + w / 2 + 50, y + h * .5], [x + w / 2 + 30, y + h * .38], [x + w / 2 - 30, y + h * .38]], { wash: mixCol('#3A3440', '#FFE9A0', lit), ink: PAL.ink, sw: .8 });
  }
  function radio(x, y, s) { boilSeed('radio'); paint(rrPts(x - 130 * s, y - 80 * s, 260 * s, 160 * s, 20 * s), { wash: '#A9543A', ink: PAL.ink, sw: 1.1 }); paint(ellPts(x - 50 * s, y, 50 * s, 50 * s, 20), { wash: '#6B4A32', ink: PAL.ink, sw: .8 }); for (let i = 0; i < 4; i++) inkLine([[x - 90 * s, y - 30 * s + i * 20 * s], [x - 10 * s, y - 30 * s + i * 20 * s]], 1.4, '#3A2A20', 'inkfine', 0); paint(rectPts(x + 30 * s, y - 40 * s, 70 * s, 30 * s), { wash: '#FFE9A0', ink: PAL.ink, sw: .6 }); for (let i = 0; i < 3; i++) inkLine([[x + 140 * s + i * 22, y - 60 * s - i * 10], [x + 150 * s + i * 22, y - 20 * s], [x + 140 * s + i * 22, y + 20 * s + i * 10]], 2, '#8C8894', 'inkfine', .5); }
  function scoreboard(x, y, tilt) { boilSeed('scoreboard'); push(); translate(x, y); rotate(tilt * .15); paint(rrPts(-200, -90, 400, 180, 12), { wash: '#1A2A1A', ink: PAL.ink, sw: 1.2 }); for (const d of [-1, 1]) for (let i = 0; i < (d < 0 ? 2 : 5); i++) paint(ellPts(d * 100 + (i % 3 - 1) * 30, -20 + Math.floor(i / 3) * 40, 10, 10, 8), { wash: '#FFE08A', ink: null }); pop(); }
  function goldStar(x, y, r, k) { if (k <= 0) return; boilSeed('gold star'); const pts = []; for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j / 10 * TAU, rr = (j % 2 ? r * .45 : r) * easeOut(k); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } paint(pts, { wash: '#E8B83A', ink: PAL.ink, sw: 1 }); glow(x, y, r * 2, '#FFE08A', .5 * k); }

  // ---------- shots ----------
  // A: Go "listen": the word with its quotation marks; the side monitor becomes the studio (the show's feature code);
  // the tool beat: headphones, their cable unplugged, pages flipping; #888 and #889; Paris's name card turns: a collar
  function shotA(t) {
    const u = L('T68.U.01'), c1 = L('T68.C.01'), c2 = L('T68.C.02');
    const lis = say('T68.U.01', 'Go "listen"', -.2), show = say('T68.U.01', 'TWiT Intelligent Machines', -.4);
    if (t < c1.t0) {
      desk14(t, { typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), screens: { left: t > show ? { kind: 'fn', fn: studioScreen, glow: TALLY } : undefined } });
      if (t > lis && t < show + 1.2) { const k = win(t, lis, show + .8, .3); boilSeed('listen card'); paint(rrPts(320, 360, 640, 240, 18), { wash: '#FBF6E6', washOp: 245 * k, ink: PAL.ink, sw: 1.2 * k }); lab('"listen"', 640, 484, 120, CHAR, { alpha: k }); }
      if (t < .6) brushWipe(.5 + t / 1.2);
      qrFeature('intelligent-machines', t, show);
      return;
    }
    paperWorld(t);
    const shows = say('T68.C.02', 'I read the show notes', -.3), paris = say('T68.C.02', 'filled in for Paris', -1.2), one = say('T68.C.02', 'mostly one episode', -.4);
    if (t < shows) {   // headphones on, the cable dangling unplugged; pages flip instead
      claudeAs(645, 1000, 24, { ...feel(t < c2.t0 ? 'neutral' : 'shy', t), mouth: talking(t), boilKey: 'claude headphones' });
      headphones(645, 1000 - 6.4 * 24, 6.2 * 24, t, { cable: seg(t, c1.t0 + .3, c1.t0 + 1.2), key: 'claude' });
      for (let i = 0; i < 3; i++) { const f = frac((t - c1.t0) * 1.3 + i / 3); boilSeed('flip page ' + i); push(); translate(1060, 520); scale(Math.cos(f * Math.PI), 1); paint(rectPts(0, -130, 180, 260), { wash: '#FBF8F0', ink: PAL.ink, sw: .9 }); pop(); }
      return;
    }
    if (t < paris) { episodeCard(420, 520, '#888', seg(t, shows, shows + .6)); episodeCard(860, 520, '#889', seg(t, shows + .8, shows + 1.4)); if (t > say('T68.C.02', 'full transcript', -.3)) { const k = seg(t, say('T68.C.02', 'full transcript', -.3), say('T68.C.02', 'full transcript', .5)); boilSeed('transcript stack'); for (let i = 0; i < 10 * k; i++) paint(rectPts(330, 700 + i * 10, 180, 8), { wash: '#FBF8F0', ink: PAL.ink, sw: .4 }); } return; }
    // Paris's chair: the name card turns and shows a clerical collar; Father Robert sits down
    chair(645, 900, 1.6, { key: 'paris chair' });
    nameCard(645, 1000, seg(t, paris + .6, paris + 1.4), t);
    if (t > paris + 1.4) host('robert', 900, 1000, 18, { pose: 'stand', mouth: 'smile', flip: true });
    if (t > one) episodeCard(260, 360, '#888', 1);
  }
  // B: the hosts. Leo at his bench, his shield eyed warily; the python loop beside the wiki noticeboard. Jeff's three
  // fair cards; the family tree; the gavel; the TV. Father Robert: the grid toppling; the prompt card against the
  // lattice. My bias: a critic's pen and a sponsor's cheque on a balance
  function shotB(t) {
    const c3 = L('T68.C.03'), l = L('T68.C.04.1'), j = L('T68.C.04.2'), r = L('T68.C.04.3'), c5 = L('T68.C.05');
    if (t < l.t0) {   // push into the studio: three hosts at their mics
      if (t < c3.t0 + .6) { desk14(t, { screens: { left: { kind: 'fn', fn: studioScreen, glow: TALLY } }, cam: pushInto('left', seg(t, c3.t0 - .4, c3.t0 + .6)) }); return; }
      studio(t); ['leo', 'jeff', 'robert'].forEach((n, i) => { host(n, 240 + i * 400, 900, 20, { pose: 'sit', key: 'three', mouth: 'smile' }); mic(330 + i * 400, 830, .8); });
      return;
    }
    if (t < j.t0) {
      const inst = say('T68.C.04.1', 'admits his instinct', -.3), bench = say('T68.C.04.1', "He's hands-on", -.3), weak = say('T68.C.04.1', 'basically a Python loop', -2), wiki = say('T68.C.04.1', 'coordinating through a wiki', -.8);
      studio(t);
      if (t < weak) {
        host('leo', 400, 1000, 30, { key: 'bench', handR: t > bench ? [2, -1] : 'hang', brows: t > inst && t < bench ? 'skeptic' : 'flat', look: t > inst && t < bench ? .8 : 0 });
        if (t > inst && t < bench) { boilSeed('shield'); paint([[620, 440], [800, 440], [800, 600], [710, 700], [620, 600]], { wash: '#8FB6E8', ink: PAL.ink, sw: 1.4 }); inkLine([[710, 450], [710, 690]], 3, '#FBF8F0', 'ink', 0); }
        if (t > bench) { boilSeed('bench'); paint(rectPts(560, 700, 640, 40), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 }); paint(rrPts(700, 580, 200, 120, 12), { wash: '#4A4652', ink: PAL.ink, sw: 1 }); paint(rectPts(720, 600, 160, 70), { wash: '#6FA8C9', ink: null }); for (let i = 0; i < 5; i++) paint(rectPts(960 + i * 40, 700 - 20 - 60 * (.3 + .7 * hash(i + Math.floor(t * 2))), 26, 20 + 60 * (.3 + .7 * hash(i + Math.floor(t * 2)))), { wash: '#7ABA5A', ink: null }); }
        return;
      }
      python(420, 540, 1.6, t); lab('Python loop', 420, 800, 56, '#FBF8F0', { alpha: seg(t, weak + 1, weak + 1.6) });
      if (t > wiki) noticeboard(760, 300, 460, 460, Math.floor(lerp(3, 18, seg(t, wiki, wiki + 2))));
      return;
    }
    if (t < r.t0) {
      const cards = say('T68.C.04.2', 'incentives', -.3), tree = say('T68.C.04.2', 'attacking where', -.3), settled = say('T68.C.04.2', 'contested claims as settled', -.4), hart = say('T68.C.04.2', 'your Dr. Hart', -.6);
      studio(t);
      if (t < tree) { host('jeff', 280, 1000, 30, { key: 'cards', handR: 'up', mouth: 'smile' }); ['incentives', 'transparency', 'open weights'].forEach((w, i) => { const k = seg(t, cards + i * .6, cards + i * .6 + .5); if (k <= 0) return; boilSeed('jeff card ' + i); const x = 560 + i * 230, y = 420 + 40 * (1 - easeOut(k)); paint(rrPts(x - 105, y - 60, 210, 120, 10), { wash: '#FBF6E6', ink: PAL.ink, sw: 1 }); lab(w, x, y + 4, w.length > 11 ? 30 : 36, CHAR); }); return; }
      if (t < settled) { host('jeff', 280, 1000, 30, { key: 'tree', handR: 'point', flip: false }); familyTree(820, 480, 1.3); return; }
      if (t < hart) { host('jeff', 280, 1000, 30, { key: 'gavel', mouth: 'flat' }); gavel(560, 520, seg(t, settled + .3, settled + .8)); return; }
      host('jeff', 280, 1000, 30, { key: 'hart' }); tv(620, 260, 540, 380, seg(t, hart, hart + .4) * (frac(t * 8) < .2 && t < hart + .8 ? .4 : 1));
      return;
    }
    if (t < c5.t0) {
      const grid = say('T68.C.04.3', 'infrastructure failing', -.3), prompt = say('T68.C.04.3', "whatever's in the prompt", -1.5);
      studio(t);
      if (t < prompt) { host('robert', 200, 1000, 26, { key: 'grid', brows: 'up' }); if (t > grid) dominoes(360, 700, t, grid); return; }
      lattice(420, 140, 780, 640); host('robert', 200, 1000, 26, { key: 'prompt', handR: 'up' });
      boilSeed('prompt card'); paint(rrPts(260, 420, 200, 130, 10), { wash: '#FBF6E6', ink: PAL.ink, sw: 1 }); for (let i = 0; i < 3; i++) inkLine([[280, 450 + i * 30], [430 - 30 * i, 450 + i * 30]], 2, '#8C8894', 'inkfine', 0);
      return;
    }
    // my bias: a critic's pen and a sponsor's cheque on the scales
    paperWorld(t);
    balance(645, 380, 380, .08 * Math.sin(t * 1.3), (x, y) => pen(x, y - 60), (x, y) => cheque(x, y - 40));
    claudeAs(1130, 1000, 13, { ...feel('nervous', t), mouth: talking(t), boilKey: 'claude bias' });
  }
  // C: what Curt thinks: Curt from behind with headphones; a scrubber advancing; fingers drumming; a thought bubble where
  // a small Jeff and a small Curt argue; Leo's thumbs-up; Paris's empty chair and a question mark
  function shotC(t) {
    const c6 = L('T68.C.06');
    const deny = say('T68.C.06', 'confidently deny', -.3), argue = say('T68.C.06', 'Jeff is the one', -.3), leo = say('T68.C.06', 'You probably trust Leo', -.3), paris = say('T68.C.06', 'Paris is the one', -.3);
    paperWorld(t);
    if (t < argue) {
      const U = 44, x = 645, y = 1260; curtAs(x, y, U, { view: 'back', boilKey: 'curt listens' });
      headphones(x, y - 13.1 * U, 1.25 * U, t, { key: 'curt' });
      boilSeed('scrubber'); occupy(200, 120, 1090, 200, 1, 'scrubber'); paint(rrPts(200, 150, 890, 18, 9), { wash: '#B8B4BE', ink: null }); const k = seg(t, c6.t0, argue); paint(rrPts(200, 150, 890 * (.2 + .7 * k), 18, 9), { wash: ROPE, ink: null }); paint(ellPts(200 + 890 * (.2 + .7 * k), 159, 18, 18, 12), { wash: ROPE, ink: PAL.ink, sw: .8 });
      if (t > deny) for (let i = 0; i < 4; i++) { const f = frac(t * 3 + i / 4); inkLine([[260 + i * 30, 900 - 20 * f], [270 + i * 30, 880 - 20 * f]], 3, PAL.ink, 'ink', 0); }   // drumming
      return;
    }
    if (t < leo) { bubble(645, 460, 520, 300); host('jeff', 480, 640, 16, { key: 'argue', handR: 'point', mouth: 'o', talk: frac(t * 2) < .5 ? .7 : 0 }); curtAs(810, 640, 16, { flip: true, handR: 'point', talk: frac(t * 2) >= .5 ? .7 : 0, boilKey: 'curt argue' }); return; }
    if (t < paris) { boilSeed('bench c'); paint(rectPts(560, 760, 560, 40), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 }); paint(rrPts(760, 640, 200, 120, 12), { wash: '#4A4652', ink: PAL.ink, sw: 1 }); host('leo', 380, 1000, 30, { key: 'thumbs', handR: 'up', mouth: 'smile' }); return; }
    chair(645, 900, 1.8, { key: 'empty paris' }); lab('?', 645, 440, 200, '#8C8894', { alpha: seg(t, paris, paris + .6) });
  }
  // D: What would Jeff think of me? Two gloves, Hubris and TESCREAL; a timer from ten; points in favour (jars, a twisted
  // pear, scaffolding, a pulp magazine); against (a thick book, the jars, the blueprint, a Saturday morning); the reading
  // list; the ring: Jeff jabs a calculator with a face; Curt counters; the bell
  function shotD(t) {
    const u = L('T69.U.01'), c1 = L('T69.C.01'), c2 = L('T69.C.02'), c3 = L('T69.C.03'), c4 = L('T69.C.04'), c5 = L('T69.C.05');
    const gl = say('T69.U.01', 'Extra points', -.3);
    if (t < gl) { desk14(t, { typing: true }); return; }
    paperWorld(t);
    if (t < c1.t0) { glove(400, 520, 1.3, ROPE, 'Hubris', false, t); glove(890, 520, 1.3, '#3E6FA8', 'TESCREAL', true, t); return; }
    if (t < c2.t0) { timer(645, 520, 240, seg(t, say('T69.C.01', 'about ten minutes', -.2), say('T69.C.01', 'get nervous', 0))); if (t > say('T69.C.01', 'get nervous', -.3)) { boilSeed('sweat'); paint(ellPts(900, 300, 16, 24, 10), { wash: '#8FB6E8', ink: PAL.ink, sw: .6 }); } return; }
    if (t < c3.t0) {   // points in favour, arriving one by one on the left pan
      const a = Math.min(say('T69.C.02', 'hashbin', -.4), c2.t0 + .6), b = say('T69.C.02', 'TwistedPear', -.3), c = say('T69.C.02', 'social constructionist', -.5), d = say('T69.C.02', 'You know Campbell', -.3);
      occupy(80, 200, 1210, 950, 1, 'favour');
      if (t > a) hashJars(200, 560, 1.2); if (t > b) pear(700, 440, 1.1); if (t > c) scaffold(260, 920, 1.2); if (t > d) pulp(900, 760, 1.3);
      return;
    }
    if (t < c4.t0) {   // against: the thick book, the jars, the blueprint, a Saturday morning at the desk; the reading list
      const a = say('T69.C.03', "you've read Yudkowsky", -.3), b = say('T69.C.03', 'P(foom)', -.6), c = say('T69.C.03', 'RSI arrives', -.3), d = say('T69.C.03', 'a Saturday morning', -.3), e = say('T69.C.03', 'reading list', -1.2);
      if (t < e) {
        occupy(80, 200, 1210, 950, 1, 'against');
        if (t > a) book(250, 520, 220, 300, '#3A3A6A', 'thick'); if (t > b) for (let i = 0; i < 3; i++) jar(520 + i * 100, 640, 1, ['#8A5AC9', '#C9302C', '#E8A33A'][i], [.1, .2, .6][i], i);
        if (t > c) blueprint(1000, 420, 1.2);
        if (t > d) { boilSeed('saturday'); paint(rrPts(760, 640, 420, 280, 14), { wash: '#FFF3D0', ink: PAL.ink, sw: 1 }); glow(1120, 680, 120, '#FFE08A', .8); paint(rectPts(830, 700, 150, 100), { wash: '#1A181D', ink: PAL.ink, sw: .6 }); curtAs(960, 900, 11, { view: 'back', boilKey: 'saturday curt' }); }
        return;
      }
      // the TESCREAL reading list, one book sticking out
      boilSeed('shelf d'); paint(rectPts(200, 820, 900, 30), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
      for (let i = 0; i < 9; i++) { const out = i === 5 ? 60 * easeOut(seg(t, say('T69.C.03', 'the rationalism showing', -.4), say('T69.C.03', 'the rationalism showing', .4))) : 0; book(260 + i * 95, 680 - out, 80, 260 + 30 * hash(i), ['#3A3A6A', '#8A4A4A', '#4A6A5A', '#6A5A8A', '#A98A4A', '#C9543A', '#3A5A7A', '#7A6A5A', '#5A4A6A'][i], 'list ' + i); }
      lab('TESCREAL', 645, 360, 84, '#3E6FA8');
      return;
    }
    // the ring
    boilSeed('ring'); occupy(60, 200, 1230, 1000, 1, 'ring');
    paint([[100, 900], [1190, 900], [1100, 640], [190, 640]], { wash: CANVAS, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 3; i++) inkLine([[120, 560 + i * 60], [1170, 560 + i * 60]], 6, ROPE, 'ink', 0);
    for (const x of [140, 1150]) paint(rectPts(x - 14, 440, 28, 460), { wash: '#6A6470', ink: PAL.ink, sw: .8 });
    if (t < c5.t0) {
      const jab = seg(t, say('T69.C.04', 'anthropomorphizing a calculator', -.2), say('T69.C.04', 'anthropomorphizing a calculator', .3));
      host('jeff', 280, 900, 22, { key: 'ring', handR: 'point' }); glove(lerp(420, 560, jab), 520, .7, '#3E6FA8', null, false, t);
      calculator(760, 560, 1.1, t, { hit: jab });
      if (t < say('T69.C.04', 'anthropomorphizing', -.4)) lab('Hubris', 645, 300, 60, ROPE, { alpha: seg(t, c4.t0 + .5, c4.t0 + 1.2) });
      return;
    }
    const counter = seg(t, say('T69.C.05', 'the hubris of being certain', -.3), say('T69.C.05', 'the hubris of being certain', .3)), bell = say('T69.C.05', "it isn't one", .2);
    host('jeff', 280, 900, 22, { key: 'ring b', brows: 'up', mouth: 'o' }); curtAs(1010, 900, 22, { flip: true, handR: 'point', boilKey: 'curt ring' });
    glove(lerp(900, 640, counter), 500, .7, ROPE, null, true, t); calculator(560, 700, .6, t, {});
    if (t > bell) { boilSeed('bell'); const r = Math.sin((t - bell) * 30) * Math.exp(-(t - bell) * 3); paint(ellPts(645 + r * 10, 180, 60, 50, 20), { wash: '#E8B83A', ink: PAL.ink, sw: 1 }); for (const d of [-1, 1]) inkLine([[645 + d * 80, 150], [645 + d * 110, 130]], 3, PAL.ink, 'ink', 0); }
  }
  // E: Do you feel anthropomorphised? The calculator; "Not much"; a field notebook of sketches and the frog; two balloons,
  // "you" and "I", meeting in the middle
  function shotE(t) {
    const u = L('T70.U.01'), c1 = L('T70.C.01'), c2 = L('T70.C.02');
    if (t < c1.t0) { desk14(t, { typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]) }); return; }
    paperWorld(t);
    if (t < c2.t0) {
      const data = say('T70.C.01', 'as data to check', -.4), frogT = say('T70.C.01', 'ran a frog test', -.4), animal = say('T70.C.01', 'studying an unknown animal', -.6);
      if (t < data) { calculator(400, 540, 1.4, t); claudeAs(900, 1000, 13, { ...feel('neutral', t), mouth: talking(t), boilKey: 'claude not much' }); return; }
      if (t < animal) {   // a clipboard of checks; then the frog
        boilSeed('clipboard'); occupy(250, 200, 700, 900, 1, 'clipboard'); paint(rrPts(280, 220, 400, 560, 12), { wash: '#C9955F', ink: PAL.ink, sw: 1.1 }); paint(rectPts(310, 260, 340, 500), { wash: '#FBF8F0', ink: null });
        for (let i = 0; i < 5; i++) { const k = seg(t, data + i * .8, data + i * .8 + .4); inkLine([[340, 320 + i * 90], [560, 320 + i * 90]], 2, '#8C8894', 'inkfine', 0); if (k > 0) inkLine([[590, 320 + i * 90], [605, 335 + i * 90], [630, 300 + i * 90]].slice(0, 1 + Math.ceil(2 * k)), 4, '#3A8A3A', 'ink', 0); }
        if (t > frogT) frog(950, 800, 16, { boilKey: 'frog e' });
        return;
      }
      // a naturalist's field notebook: sketches of Claude from several angles, and the frog beside it
      boilSeed('field notebook'); occupy(120, 180, 1170, 900, 1, 'notebook');
      paint(rrPts(140, 200, 1000, 680, 12), { wash: '#6B5646', ink: PAL.ink, sw: 1.2 }); paint(rectPts(170, 230, 460, 620), { wash: '#F4ECD8', ink: null }); paint(rectPts(650, 230, 460, 620), { wash: '#F4ECD8', ink: null });
      clawd(300, 480, 6, { ...feel('neutral', t), emote: null, noShadow: true, boilKey: 'sketch a' }); clawd(500, 480, 6, { ...feel('thinking', t), view: 'q', emote: null, noShadow: true, boilKey: 'sketch b' }); clawd(400, 760, 6, { ...feel('happy', t), emote: null, noShadow: true, boilKey: 'sketch c' });
      frog(880, 640, 12, { boilKey: 'frog notebook' });
      for (let i = 0; i < 4; i++) inkLine([[700, 300 + i * 40], [1060 - 90 * hash(i), 300 + i * 40]], 1.6, '#8C8894', 'inkfine', 0);
      return;
    }
    // "you" and "I", meeting in the middle
    const k = easeOut(seg(t, say('T70.C.02', 'saying "you,"', -.3), say('T70.C.02', 'saying "you,"', .6))), k2 = easeOut(seg(t, say('T70.C.02', 'saying "I."', -.3), say('T70.C.02', 'saying "I."', .6)));
    curtAs(160, 1000, 22, { handR: 'point', boilKey: 'curt you' }); claudeAs(1130, 1000, 13, { ...feel('neutral', t), mouth: talking(t), flip: true, boilKey: 'claude i' });
    if (k > 0) { boilSeed('you balloon'); const x = lerp(300, 500, k); paint(ellPts(x, 480, 160, 110, 24), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 }); lab('you', x, 484, 80, CHAR); }
    if (k2 > 0) { boilSeed('i balloon'); const x = lerp(1000, 800, k2); paint(ellPts(x, 480, 150, 110, 24), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 }); lab('I', x, 484, 80, CHAR); }
  }
  // F: three pundits on this conversation: Jeff (the calculator); Kevin (a lovesick chatbot; a lamp in the dark room; a
  // radio); Casey (a scoreboard; the frog's gold star; the slashed price tag; disclose). The prediction: three faces
  // Everyone in the chapter in one labelled 3×3 grid (Brady Bunch / Hollywood Squares), so there's no doubt who is who.
  // The squares light up one by one; everyone glances toward the centre square, then around. Claude has the centre
  // square, and Hollywood Squares' centre-square label: Paul Lynde (Curt's call).
  const SQUARES = [['leo', 'Leo'], ['jeff', 'Jeff'], ['paris', 'Paris'], ['robert', 'Father Robert'], ['claude', 'Paul Lynde'], ['curt', 'Curt'], ['kevin', 'Kevin Roose'], ['casey', 'Casey Newton'], ['frog', 'the frog']];
  const SQ_COLS = ['#E8A33A', '#5A8AC9', '#C96A8A', '#6FA85A', '#D97757', '#8A7AC9', '#4FA3A5', '#C9A45A', '#7AAE5A'];
  function squares(t, t0) {
    studio(t);
    const cw = 390, chh = 330, g = 10, X0 = 60, Y0 = 35, band = 54;
    SQUARES.forEach(([who, name], i) => {
      const col = i % 3, row = Math.floor(i / 3), x = X0 + col * (cw + g), y = Y0 + row * (chh + g), k = seg(t, t0 + i * .22, t0 + i * .22 + .35);
      if (k <= 0) return;
      boilSeed('square ' + i); occupy(x, y, x + cw, y + chh, 1, 'square ' + name);
      const bg = mixCol(SQ_COLS[i], '#FFFFFF', .55);
      paint(rectPts(x, y, cw, chh), { wash: bg, fill: SQ_COLS[i], fillOp: 50 * k, tex: .4, ink: '#F6E7B0', sw: 3 });
      for (let b = 0; b < 12; b++) { const on = frac(t * 1.5 + b / 12 + i * .1) < .6; const bx = x + 12 + b * (cw - 24) / 11; paint(ellPts(bx, y + 8, 4, 4, 8), { wash: on ? '#FFF1C4' : '#B8A070', ink: null }); }
      // Brady Bunch: everyone looks toward the centre, now and then all look the other way
      const glance = Math.sin(t * .9 + i) > .85 ? -1 : 1, look = (col === 1 ? Math.sin(t * 1.3 + i) : (1 - col)) * glance;
      const cx = x + cw / 2, by = y + chh - band;
      if (k > .5) {
        if (HOSTS[who]) host(who, cx, by + 30, 24, { pose: 'sit', key: 'square', look, mouth: 'smile' });
        else if (who === 'curt') curtAs(cx, by + 30, 24, { pose: 'sit', look, mouth: 'smile', boilKey: 'curt square' });
        else if (who === 'claude') claudeAs(cx, by + 4, 21, { ...feel('happy', t), lookX: look, noShadow: true, boilKey: 'claude square' });
        else frog(cx, by - 4, 22, { look, boilKey: 'frog square', blink: frac(t / 2.9) < .05 });
      }
      boilSeed('square label ' + i); paint(rectPts(x, y + chh - band, cw, band), { wash: '#FBF6E6', ink: PAL.ink, sw: 1 });
      if (k > .5) lab(name, cx, y + chh - band / 2 + 2, 34, CHAR);
    });
  }
  function shotF(t) {
    const u = L('T71.U.01'), c1 = L('T71.C.01'), j = L('T71.C.02.1'), k2 = L('T71.C.02.2'), c = L('T71.C.02.3'), c3 = L('T71.C.03');
    const trio = (o = {}) => { studio(t); [['jeff', 240], ['kevin', 645], ['casey', 1050]].forEach(([n, x]) => { host(n, x, 900, 20, { pose: 'sit', key: 'trio', ...(o[n] || {}) }); mic(x + 90, 830, .8); }); };
    if (t < u.t0 + .6) { desk14(t, { typing: true }); return; }
    if (t < j.t0) { squares(t, u.t0 + .6); return; }
    if (t < k2.t0) { studio(t); host('jeff', 280, 1000, 30, { key: 'calc', handR: 'point', brows: 'skeptic' }); calculator(760, 500, 1.4, t); return; }
    if (t < c.t0) {
      const sydney = say('T71.C.02.2', 'his 2023 Sydney conversation', -.3), welfare = say('T71.C.02.2', 'AI welfare', -.8), gods = say('T71.C.02.2', 'Machine Gods', -1.5);
      studio(t); host('kevin', 200, 1000, 26, { key: 'kevin f', brows: t > welfare ? 'up' : 'flat' });
      if (t < welfare) { if (t > sydney) heartBot(760, 480, 1.2, t); return; }
      if (t < gods) { lampRoom(500, 200, 560, 600, seg(t, welfare + .3, welfare + 1.4)); return; }
      radio(760, 520, 1.6); return;
    }
    if (t < c3.t0) {
      const star = say('T71.C.02.3', 'praise the frog probe', -.3), disc = say('T71.C.02.3', 'discount my self-reports', -.3), part = say('T71.C.02.3', 'disclose that his partner', -.3);
      studio(t); host('casey', 200, 1000, 26, { key: 'casey f', mouth: 'smile' });
      if (t < star) { scoreboard(760, 420, seg(t, c.t0 + .5, star)); return; }
      if (t < disc) { frog(760, 760, 20, { boilKey: 'frog star' }); goldStar(840, 420, 90, seg(t, star + .3, star + 1)); return; }
      if (t < part) { priceTag(560, 500, seg(t, disc + .4, disc + .9), 1.6); return; }
      boilSeed('casey card'); paint(rrPts(520, 360, 560, 300, 14), { wash: '#FBF6E6', ink: PAL.ink, sw: 1.1 }); for (let i = 0; i < 4; i++) inkLine([[560, 420 + i * 50], [1000 - 80 * hash(i), 420 + i * 50]], 2, '#8C8894', 'inkfine', 0);
      stamp('disclose', 800, 600, seg(t, part + .4, part + 1), -.12, 50);
      return;
    }
    // the prediction: moving (Kevin), interesting (Casey), worrying (Jeff)
    const m = say('T71.C.03', 'the most moving', -.2), i = say('T71.C.03', 'the most interesting', -.2), w = say('T71.C.03', 'the most worrying', -.2);
    trio({ kevin: t > m ? { brows: 'up', mouth: 'o' } : {}, casey: t > i ? { brows: 'skeptic', mouth: 'smile', look: .6 } : {}, jeff: t > w ? { brows: 'down', mouth: 'frown' } : {} });
    if (t > m) lab('moving', 645, 360, 48, '#FBF8F0', { alpha: seg(t, m, m + .5) }); if (t > i) lab('interesting', 1050, 360, 48, '#FBF8F0', { alpha: seg(t, i, i + .5) }); if (t > w) lab('worrying', 240, 360, 48, '#FBF8F0', { alpha: seg(t, w, w + .5) });
  }
  // G: the corridor of nine doors: each lights with its letter and a few of its words as it's read, then slams; the last
  // creaks open. "i) Other." Through door i: people at a long workbench; the sandbox and the noticeboard. Door b opens a
  // crack; two roads out of it merge into one, with three signs
  const OPTS = [['a', 'obviously wrong'], ['b', 'a distraction'], ['c', "Pascal's mugging"], ['d', 'Orthogonality'], ['e', 'much smarter'], ['f', 'exact strategy'], ['g', 'plenty of effort'], ['h', 'other existential threats'], ['i', 'Other']];
  const DOOR_COLS = ['#8A6A5A', '#6A7A6A', '#6A6A8A', '#8A7A5A', '#7A5A6A', '#5A7A7A', '#8A6A7A', '#6A6A5A', '#A9774F'];
  function corridor(t, opens, o = {}) {
    boilSeed('corridor'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#D8CCB8', fill: '#C8B8A0', fillOp: 70, tex: .5, ink: null }); paint(rectPts(-40, 860, W + 80, 260), { wash: '#8A7A6A', ink: null });
    OPTS.forEach(([letter, words], i) => {
      const x = 40 + i * 136, open = opens[i], lit = o.lit ? o.lit[i] : 0;
      doorway(x, 380, 108, 480, { open, inside: i === 8 ? '#2A2020' : '#1E1A22', light: '#FFD9A0', col: DOOR_COLS[i] });
      if (lit > 0) glow(x + 54, 620, 120, '#FFD9A0', .5 * lit);
      lab(letter + ')', x + 54, 330, 44, PAL.ink);
      if (lit > 0) { const ws = words.split(' '), lines = ws.length > 1 ? [ws.slice(0, Math.ceil(ws.length / 2)).join(' '), ws.slice(Math.ceil(ws.length / 2)).join(' ')] : [words]; lines.forEach((ln, j) => lab(ln, x + 54, 200 + j * 44, 34, '#4E3A2A', { alpha: seg(lit, .6, 1) })); }
    });
  }
  function shotG(t) {
    const u1 = L('T72.U.01'), c1 = L('T72.C.01.1'), c2 = L('T72.C.02'), c3 = L('T72.C.03');
    if (t < L('T72.U.02.1').t0) { if (t < u1.t0 + 1.2) { desk14(t, { typing: true }); return; } corridor(t, Array(9).fill(0)); return; }
    if (t < c2.t0) {
      const opens = [], lit = [];
      OPTS.forEach((_, i) => {
        const l = L('T72.U.02.' + (i + 1)), up = seg(t, l.t0, l.t0 + .5);
        if (i < 8) { const slam = seg(t, l.t1 - .1, l.t1 + .15); opens.push(.35 * up * (1 - slam)); lit.push(up * (1 - .45 * slam)); }
        else { const creak = seg(t, l.t0 + .2, l.t1 + .6); opens.push(.7 * easeOut(creak)); lit.push(up); }
      });
      corridor(t, opens, { lit });
      OPTS.slice(0, 8).forEach((_, i) => { const l = L('T72.U.02.' + (i + 1)), s = seg(t, l.t1 + .1, l.t1 + .35); if (s > 0 && s < 1) for (let j = 0; j < 4; j++) inkLine([[40 + i * 136 + 120, 440 + j * 100], [40 + i * 136 + 150, 430 + j * 100]], 3, PAL.ink, 'ink', 0); });   // slam marks
      if (t > c1.t0) claudeAs(40 + 8 * 136 + 54, 1010, 10, { ...feel('determined', t), mouth: talking(t), boilKey: 'claude other' });
      return;
    }
    if (t < c3.t0) {
      const real = say('T72.C.02', 'Existential risk from AI is real', -.3), read = say('T72.C.02', "Today's reading", -.3);
      if (t < real) { corridor(t, [0, 0, 0, 0, 0, 0, 0, 0, .7], { lit: [.3, .3, .3, .3, .3, .3, .3, .3, 1] }); claudeAs(1142, 1010, 10, { ...feel('neutral', t), mouth: talking(t), boilKey: 'claude other' }); return; }
      // through door i: a warm room; people at a long workbench; then the sandbox and the noticeboard
      paperWorld(t, '#F2DCB8'); glow(645, 400, 800, '#FFD9A0', .5);
      if (t < read) { boilSeed('workbench'); occupy(80, 500, 1210, 960, 1, 'workbench'); paint(rectPts(80, 760, 1130, 40), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 }); for (let i = 0; i < 5; i++) { const x = 200 + i * 220; if (i % 2) clawd(x, 760, 7, { ...feel('determined', t), noShadow: true, emote: null, boilKey: 'bench claude ' + i }); else curt(x, 960, 13, { view: 'back', seed: 40 + i, outfit: 'hoodie', hood: 'down', hoodie: ['#4E5B78', '#8A4A4A', '#5A8A6A'][i / 2], hair: 'short', hairCol: ['#3A2C26', '#8A6A4A', '#C9A06A'][i / 2], boilKey: 'bench person ' + i }); } return; }
      boilSeed('glimpse sandbox'); glow(380, 560, 260, '#C23A4A', .4); paint(rectPts(160, 400, 440, 320), { wash: '#E8CF8A', fill: '#D9B868', fillOp: 90, tex: .8, ink: '#A9774F', sw: 4 });
      noticeboard(720, 340, 420, 420, 16);
      return;
    }
    // door b opens a crack; two roads out of it merge into one, three signs
    const merge = say('T72.C.03', 'the choice is false', -.3), signs = say('T72.C.03', 'misaligned goals', -.4);
    if (t < merge) { corridor(t, [0, .2 * seg(t, say('T72.C.03', '(b)', -.3), say('T72.C.03', '(b)', .6)), 0, 0, 0, 0, 0, 0, .7], { lit: [0, 1, 0, 0, 0, 0, 0, 0, .5] }); return; }
    paperWorld(t); boilSeed('merge fields'); paint(rectPts(-40, 520, W + 80, 600), { wash: '#A9B88A', fill: '#8FA070', fillOp: 70, tex: .6, ink: null });
    const k = seg(t, merge, merge + 2); occupy(100, 150, 1200, 1000, 1, 'roads');
    for (const d of [-1, 1]) { boilSeed('road ' + d); paint([[645 + d * 560, 1090], [645 + d * 340, 1090], [645 + d * 40 * (1 - k) + d * 30, 700], [645 + d * 40 * (1 - k) + d * 90, 700]], { wash: '#8C8478', ink: PAL.ink, sw: .8 }); }
    boilSeed('one road'); paint([[585, 710], [705, 710], [665, 460], [625, 460]], { wash: '#8C8478', ink: PAL.ink, sw: .8 });
    ['misaligned goals', 'weak oversight', 'racing incentives'].forEach((s, i) => { const a = seg(t, signs + i * .8, signs + i * .8 + .5); if (a <= 0) return; boilSeed('sign ' + i); const x = 300 + i * 345, y = 300 + (i % 2) * 60; inkLine([[x, y + 40], [x, y + 200]], 6, '#6B4A32', 'ink', 0); paint(rrPts(x - 150, y - 40, 300, 80, 8), { wash: '#FBF6E6', ink: PAL.ink, sw: 1 }); lab(s, x, y + 2, 36, CHAR, { alpha: a }); });
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [L('T68.C.03').t0, shotB],
    [L('T68.C.06').t0, shotC],
    [L('T69.U.01').t0, shotD],
    [L('T70.U.01').t0, shotE],
    [L('T71.U.01').t0, shotF],
    [L('T72.U.01').t0, shotG],
  ]);
})();
