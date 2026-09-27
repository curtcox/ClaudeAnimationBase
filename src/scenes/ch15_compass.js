// ch15_compass.js: chapter 15 (T73–T77). Storyboard: docs/storyboards/ch15_the_compass.md.
// Curt pastes an old meme, a 2×2 compass of AI opinions, and Claude places the cast on it; then AI 2027, three
// definitions of AGI, and Curt's literalism: "general" used to mean general, and the goalposts moved.
// The compass is repainted from assets/ref/connor2_compass.png with its exact labels; its photo roundels become
// anonymous painted discs (Connor's keeps the original's circle and arrow, with no likeness).
(() => {
  const HOUR = 12;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const win = (t, a, b, d = .5) => seg(t, a, a + d) * (1 - seg(t, b, b + d));
  const Q = { tl: '#F2C6C6', tr: '#BFE0F4', br: '#DCC8EE', bl: '#CDE8C4' };   // goalpost movers, tech accelerationists, doomers, longtermists
  const RED = '#C9302C', PITCH = '#6FA85A';
  const desk15 = (t, o = {}) => deskShot(t, { hour: HOUR, frog: 1, ...o });

  // ---------- the compass ----------
  // the original's roundels, as [x, y, r] in its 504×500 picture; the last-but-one is Connor's
  const DISCS = [[65, 55, 35], [135, 78, 28], [65, 145, 35], [150, 158, 28], [240, 125, 48], [220, 238, 40],
    [300, 93, 22], [358, 125, 35], [445, 50, 33], [445, 125, 43], [287, 190, 22], [345, 195, 30], [462, 185, 12],
    [335, 272, 28], [380, 332, 38], [453, 290, 35], [425, 375, 25], [470, 380, 18], [348, 372, 18], [310, 405, 26],
    [360, 408, 20], [395, 420, 22], [470, 425, 12], [455, 450, 35], [405, 455, 22],
    [70, 325, 45], [160, 345, 35], [270, 330, 45], [115, 410, 35], [210, 420, 30]];
  const CONNOR = 24;
  const DISC_COLS = ['#B8A48A', '#8C8894', '#C9A07A', '#6A7A8A', '#A98A6A', '#7A8A6A', '#9A7A8A', '#C8B8A0'];
  // (cx, cy) the centre, S the side. o.k 0..1 paints it in; o.discs 0..1 (1 = in place, 0 = stepped aside);
  // o.hAxis, o.vAxis glow; o.tear 0..1 tears the top-left corner
  function compass(cx, cy, S, t, o = {}) {
    const x0 = cx - S / 2, y0 = cy - S / 2, k = o.k ?? 1, P = (px, py) => [x0 + px / 504 * S, y0 + py / 500 * S];
    boilSeed('compass'); occupy(x0 - 20, y0 - 20, x0 + S + 20, y0 + S + 20, 1, 'compass');
    const quad = (col, a, b, c, d) => paint([a, b, c, d], { wash: col, washOp: 255 * clamp(k * 2), ink: null });
    const tear = o.tear || 0, tl = tear > 0 ? [[x0 + S * .18 * tear, y0], [cx, y0], [cx, cy], [x0, cy], [x0, y0 + S * .14 * tear]] : null;
    if (tl) paint(tl, { wash: Q.tl, ink: null }); else quad(Q.tl, [x0, y0], [cx, y0], [cx, cy], [x0, cy]);
    quad(Q.tr, [cx, y0], [x0 + S, y0], [x0 + S, cy], [cx, cy]); quad(Q.br, [cx, cy], [x0 + S, cy], [x0 + S, y0 + S], [cx, y0 + S]); quad(Q.bl, [x0, cy], [cx, cy], [cx, y0 + S], [x0, y0 + S]);
    if (tear > 0) { boilSeed('torn corner'); push(); translate(x0 - 40 * tear, y0 - 30 * tear); rotate(-.5 * tear); paint([[0, 0], [S * .18, 0], [0, S * .14]], { wash: Q.tl, ink: PAL.ink, sw: .8 }); pop(); inkLine([[x0 + S * .18 * tear, y0], [x0 + S * .1 * tear, y0 + S * .05 * tear], [x0, y0 + S * .14 * tear]], 1.6, PAL.ink, 'inkfine', .6); }
    if (k < .6) return;
    const dk = o.discs ?? 1;
    if (dk > 0) DISCS.forEach(([px, py, r], i) => {
      const [x, y] = P(px, py), rr = r / 504 * S * lerp(.35, 1, dk); boilSeed('disc ' + i);
      paint(ellPts(x, y, rr, rr, 18), { wash: DISC_COLS[i % DISC_COLS.length], washOp: 255 * lerp(.35, 1, dk), ink: PAL.ink, sw: .7 * dk });
      if (i === CONNOR) { paint(ellPts(x, y, rr + 6, rr + 6, 20), { wash: null, ink: '#E0201A', sw: 3 }); const [ax, ay] = P(330, 480); inkLine([[ax, ay], [x - rr - 8, y + rr * .4]], 4, '#E0201A', 'ink', 0); paint([[x - rr - 6, y + rr * .4], [x - rr - 30, y + rr * .2], [x - rr - 26, y + rr * .7]], { wash: '#E0201A', ink: null }); lab('Connor', ...P(345, 490), S / 26, PAL.ink); }
    });
    // the axes: arrows both ways; they glow as they're named
    const hG = o.hAxis || 0, vG = o.vAxis || 0;
    if (hG > 0) glow(cx, cy, S * .6, '#FFE08A', .5 * hG);
    inkLine([[x0 - 10, cy], [x0 + S + 10, cy]], 5 + 4 * hG, PAL.ink, 'ink', 0); inkLine([[cx, y0 - 10], [cx, y0 + S + 10]], 5 + 4 * vG, PAL.ink, 'ink', 0);
    for (const [ax, ay, dx, dy] of [[x0 - 14, cy, 1, 0], [x0 + S + 14, cy, -1, 0], [cx, y0 - 14, 0, 1], [cx, y0 + S + 14, 0, -1]]) paint([[ax, ay], [ax + dx * 28 - dy * 16, ay + dy * 28 - dx * 16], [ax + dx * 28 + dy * 16, ay + dy * 28 + dx * 16]], { wash: PAL.ink, ink: null });
    const f = S / 500, L1 = (txt, px, py, sz, col, al = 'center') => lab(txt, ...P(px, py), sz * f, col, { align: al });
    L1('AGI good', 255, 30, 30, PAL.ink); L1('AGI bad', 255, 470, 30, PAL.ink);
    L1('tech', 385, 32, 22, '#FBF8F0'); L1('accelerationists', 355, 55, 22, '#FBF8F0');
    L1('goalpost movers', 100, 210, 22, '#E07AD0'); L1('unimpressed', 85, 235, 26, PAL.ink); L1('(AGI not now)', 90, 262, 24, PAL.ink);
    L1('scale', 440, 210, 26, PAL.ink); L1('maximalists', 425, 236, 26, PAL.ink); L1('(AGI soon)', 435, 262, 24, PAL.ink);
    L1('doomers', 390, 285, 20, '#E040C0'); L1('longtermists', 90, 465, 22, '#3AA84A');
  }
  // a cast card: a small portrait (the cast's own figures) and a name
  function castCard(name, x, y, s, t, o = {}) {
    boilSeed('cast card ' + name); occupy(x - 70 * s, y - 90 * s, x + 70 * s, y + 70 * s, 1, 'card ' + name);
    paint(rrPts(x - 66 * s, y - 86 * s, 132 * s, 150 * s, 10 * s), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 });
    if (name === 'Claude') clawd(x, y + 10 * s, 5.4 * s, { ...feel(o.mood || 'neutral', t), emote: null, noShadow: true, boilKey: 'card claude' });
    else if (name === 'Curt') curtAs(x, y + 36 * s, 6.4 * s, { noShadow: true, boilKey: 'card curt' });
    else curt(x, y + 36 * s, 6.4 * s, { outfit: 'hoodie', hood: 'down', facial: 'none', noShadow: true, ...HOSTS[name], boilKey: 'card ' + name });
    if (name === 'Robert') { boilSeed('card collar'); paint(rectPts(x - 2.2 * s, y + 36 * s - 11.4 * 6.4 * s, 4.4 * s, 3 * s), { wash: '#FBF8F0', ink: null }); }
    lab(o.label || name, x, y + 50 * s, 22 * s, PAL.ink);
  }
  const HOSTS = {
    Leo: { hair: 'short', hairCol: '#BDB8B0', glasses: true, hoodie: '#6A7A9A' },
    Jeff: { hair: 'short', hairCol: '#E4E0D8', glasses: true, hoodie: '#8A5A4A' },
    Robert: { hair: 'short', hairCol: '#2A2420', facial: 'goatee', facialCol: '#2A2420', hoodie: '#1E1C22' },
    Kevin: { hair: 'short', hairCol: '#4A3A2A', hoodie: '#5A8A6A' },
    Casey: { hair: 'short', hairCol: '#C9A06A', glasses: true, facial: 'stubble', facialCol: '#A98A5A', hoodie: '#6A5A8A' },
  };
  // where Claude places everyone, in the compass's own terms: u -1..1 (not now → soon), v -1..1 (good → bad)
  const PLACES = [['T74.C.03.1', 'Claude', .22, .2], ['T74.C.03.2', 'Curt', .6, .62], ['T74.C.03.3', 'Jeff', -.84, -.28],
    ['T74.C.03.4', 'Leo', .26, -.3], ['T74.C.03.5', 'Robert', -.18, .12], ['T74.C.03.6', 'Kevin', .72, .1], ['T74.C.03.7', 'Casey', .72, -.12]];

  // ---------- other pieces ----------
  function searchPages(t, t0, blank = 0) {
    boilSeed('pages 15'); occupy(260, 260, 1030, 820, 1, 'pages');
    for (let i = 0; i < 4; i++) { const f = blank ? 0 : frac((t - t0) * 1.4 + i / 4), x = 300 + i * 180; push(); translate(x + 90, 540); scale(Math.cos(f * Math.PI), 1); paint(rectPts(-90, -250, 180, 500), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); if (!blank) for (let r = 0; r < 8; r++) inkLine([[-70, -200 + r * 50], [60, -200 + r * 50]], 1.4, '#C8C0B0', 'inkfine', 0); pop(); }
    const mx = 645 + Math.sin(t * 2) * 200; paint(ellPts(mx, 520, 120, 120, 24), { wash: '#DCEBF0', washOp: 70, ink: PAL.ink, sw: 2 }); inkLine([[mx + 85, 605], [mx + 190, 710]], 12, '#6B5646', 'ink', 0);
  }
  function grid3(x, y, s) {   // a generic 3×3 alignment chart: nine blank cells
    boilSeed('grid3'); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) paint(rectPts(x + c * 110 * s, y + r * 110 * s, 100 * s, 100 * s), { wash: ['#F2C6C6', '#F2E6B8', '#C6DCF2'][(r + c) % 3], ink: PAL.ink, sw: .8 });
  }
  function frame(x, y, w, h) { boilSeed('frame 15'); occupy(x - 30, y - 30, x + w + 30, y + h + 30, 1, 'frame'); paint(rectPts(x - 30, y - 30, w + 60, h + 60), { wash: '#A9774F', ink: PAL.ink, sw: 1.2 }); paint(rectPts(x, y, w, h), { wash: '#F4EFE2', ink: PAL.ink, sw: .8 }); }
  function mic(x, y, s) { boilSeed('mic15 ' + x); inkLine([[x, y], [x, y - 180 * s], [x + 80 * s, y - 260 * s]], 8 * s, '#3A3342', 'ink', .3); paint(rrPts(x + 60 * s, y - 360 * s, 70 * s, 130 * s, 32 * s), { wash: '#4A4652', ink: PAL.ink, sw: 1 }); }
  function timelineBar(x0, x1, y, t, years) {
    boilSeed('tl bar'); occupy(x0 - 40, y - 60, x1 + 40, y + 100, 1, 'timeline');
    paint(rrPts(x0, y - 16, x1 - x0, 32, 16), { wash: '#E8D08A', ink: PAL.ink, sw: 1.1 });
    years.forEach(([yr, x]) => { inkLine([[x, y - 30], [x, y + 30]], 4, PAL.ink, 'ink', 0); lab(yr, x, y + 70, 48, '#4E3A2A'); });
  }
  function pin(x, y, k, col = RED) { if (k <= 0) return; const yy = y - 200 * (1 - easeOut(k)); boilSeed('pin ' + col); inkLine([[x, yy], [x, yy - 80]], 4, '#6A6470', 'ink', 0); paint(ellPts(x, yy - 90, 26, 26, 14), { wash: col, ink: PAL.ink, sw: 1 }); }
  function wallCalendar(x, y, s, t, flutter = 0) {
    boilSeed('cal 2027'); occupy(x - 200 * s, y - 60 * s, x + 200 * s, y + 420 * s, 1, 'calendar');
    inkLine([[x, y - 60 * s], [x, y - 10 * s]], 3, '#6A6470', 'ink', 0);
    for (let i = 2; i >= 0; i--) paint(rectPts(x - 190 * s + i * 5, y + i * 5, 380 * s, 400 * s), { wash: '#FBF8F0', ink: PAL.ink, sw: .9 });
    paint(rectPts(x - 190 * s, y, 380 * s, 90 * s), { wash: '#3E6FA8', ink: PAL.ink, sw: .9 }); lab('AI 2027', x, y + 48 * s, 56 * s, '#FBF8F0');
    for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) paint(rectPts(x - 170 * s + c * 48 * s, y + 110 * s + r * 54 * s, 40 * s, 44 * s), { wash: null, ink: '#C8C0B0', sw: .5 });
    if (flutter > 0) for (let i = 0; i < 3; i++) { const f = frac(t * 2 + i / 3); push(); translate(x, y + 90 * s); scale(1, Math.cos(f * Math.PI)); paint(rectPts(-190 * s, 0, 380 * s, 310 * s), { wash: '#F4EFE2', washOp: 255 * flutter, ink: PAL.ink, sw: .8 }); pop(); }
  }
  function reportCard(x, y, k) { if (k <= 0) return; boilSeed('report card'); const yy = y + 60 * (1 - easeOut(k)); occupy(x - 170, yy - 120, x + 170, yy + 120, 1, 'report'); paint(rrPts(x - 170, yy - 120, 340, 240, 10), { wash: '#FFF9D8', ink: PAL.ink, sw: 1.1 }); for (let i = 0; i < 3; i++) inkLine([[x - 140, yy - 70 + i * 36], [x + 20, yy - 70 + i * 36]], 2, '#8C8894', 'inkfine', 0); lab('65%', x + 90, yy + 50, 70, RED); paint(ellPts(x + 90, yy + 50, 80, 50, 20), { wash: null, ink: RED, sw: 2 }); }
  function sticky(x, y, k) { if (k <= 0) return; boilSeed('sticky'); push(); translate(x, y); rotate(.08 + (1 - k) * .5); paint(rectPts(-80, -80, 160, 160), { wash: '#FFE97A', ink: PAL.ink, sw: .8 }); for (let i = 0; i < 4; i++) inkLine([[-60, -50 + i * 32], [50 - 20 * hash(i), -50 + i * 32]], 2, '#8A7A3A', 'inkfine', 0); pop(); }
  function piece(x, y, s, col, k, key, draw) {   // a puzzle piece that clicks in (k 0..1) with a small picture on it
    if (k <= 0) return; const yy = y - 120 * (1 - easeOut(k)); boilSeed('pz ' + key);
    paint([[x - 110 * s, yy - 110 * s], [x - 20 * s, yy - 110 * s], [x, yy - 140 * s], [x + 20 * s, yy - 110 * s], [x + 110 * s, yy - 110 * s], [x + 110 * s, yy - 20 * s], [x + 140 * s, yy], [x + 110 * s, yy + 20 * s], [x + 110 * s, yy + 110 * s], [x - 110 * s, yy + 110 * s]], { wash: col, ink: PAL.ink, sw: 1.1 });
    draw(x, yy, s);
  }
  function gear(x, y, r, a, col, n = 12) { const pts = []; for (let j = 0; j < n * 4; j++) { const aa = a + j / (n * 4) * TAU, rr = j % 4 < 2 ? r : r * .82; pts.push([x + Math.cos(aa) * rr, y + Math.sin(aa) * rr]); } paint(pts, { wash: col, ink: PAL.ink, sw: 1 }); paint(ellPts(x, y, r * .25, r * .25, 12), { wash: '#4A4652', ink: PAL.ink, sw: .7 }); }
  function crane(x, y, s, t) { boilSeed('crane15 ' + x); inkLine([[x, y], [x, y - 420 * s]], 8 * s, '#E8B83A', 'ink', 0); inkLine([[x - 60 * s, y - 420 * s], [x + 260 * s, y - 420 * s]], 7 * s, '#E8B83A', 'ink', 0); const hy = y - 380 * s + 140 * s * (.5 + .5 * Math.sin(t * .4 + x)); inkLine([[x + 200 * s, y - 420 * s], [x + 200 * s, hy]], 1.2, PAL.ink, 'inkfine', 0); paint(rectPts(x + 150 * s, hy, 100 * s, 16 * s), { wash: '#8C8894', ink: PAL.ink, sw: .6 }); }
  function checklist(x, y, w, title, items, ticks, t, o = {}) {   // items: [text, icon fn(x, y)]; ticks[i] 0..1
    boilSeed('checklist ' + title); const h = 110 + items.length * 120; occupy(x - 10, y - 10, x + w + 10, y + h + 10, 1, 'checklist');
    paint(rrPts(x, y, w, h, 12), { wash: '#FFF3B0', ink: PAL.ink, sw: 1.2 }); lab(title, x + w / 2, y + 50, 44, PAL.ink);
    items.forEach(([txt, icon], i) => { const a = o.show ? o.show[i] : 1; if (a <= 0) return; const yy = y + 130 + i * 120;
      paint(rectPts(x + 24, yy - 22, 44, 44), { wash: '#FBF8F0', ink: PAL.ink, sw: .9 });
      if (ticks[i] > 0) inkLine([[x + 30, yy], [x + 44, yy + 16], [x + 70, yy - 26]].slice(0, 1 + Math.ceil(2 * ticks[i])), 5, '#3A8A3A', 'ink', 0);
      if (icon) icon(x + 120, yy);
      const lines = txt.length > 26 ? [txt.slice(0, txt.lastIndexOf(' ', 26)), txt.slice(txt.lastIndexOf(' ', 26) + 1)] : [txt];
      lines.forEach((ln, j) => lab(ln, x + 176, yy + (j - (lines.length - 1) / 2) * 36, 32, PAL.ink, { align: 'left', alpha: a }));
    });
  }
  // checklist icons
  const ic = {
    chat: (x, y) => { boilSeed('ic chat'); paint(rrPts(x - 34, y - 26, 68, 44, 10), { wash: '#DCEBF0', ink: PAL.ink, sw: .7 }); paint([[x - 20, y + 18], [x - 28, y + 32], [x - 6, y + 18]], { wash: '#DCEBF0', ink: PAL.ink, sw: .6 }); },
    schema: (x, y) => { boilSeed('ic schema'); for (let i = 0; i < 2; i++) paint(rectPts(x - 36 + i * 40, y - 20, 32, 40), { wash: '#FBF8F0', ink: PAL.ink, sw: .6 }); inkLine([[x - 4, y], [x + 4, y]], 2, RED, 'inkfine', 0); },
    math: (x, y) => { boilSeed('ic math'); paint(rectPts(x - 30, y - 30, 60, 60), { wash: '#FBF8F0', ink: PAL.ink, sw: .6 }); inkLine([[x - 16, y - 10], [x + 16, y - 10]], 2, PAL.ink, 'inkfine', 0); inkLine([[x, y - 22], [x, y + 2]], 2, PAL.ink, 'inkfine', 0); inkLine([[x - 16, y + 14], [x + 16, y + 14]], 2, PAL.ink, 'inkfine', 0); },
    temple: (x, y) => { boilSeed('ic temple'); paint(rectPts(x - 36, y - 30, 72, 60), { wash: '#1A181D', ink: PAL.ink, sw: .6 }); for (let i = 0; i < 3; i++) paint(rectPts(x - 30 + i * 22, y + 10 - i * 12, 16, 6), { wash: '#C98A3A', ink: null }); paint(rectPts(x - 4, y - 6, 8, 12), { wash: '#E0402A', ink: null }); },
    clock: (x, y) => { boilSeed('ic clock'); paint(ellPts(x, y, 30, 30, 18), { wash: '#FBF8F0', ink: PAL.ink, sw: .8 }); inkLine([[x, y], [x, y - 20]], 2.5, PAL.ink, 'ink', 0); inkLine([[x, y], [x + 14, y + 6]], 2.5, PAL.ink, 'ink', 0); },
    exam: (x, y) => { boilSeed('ic exam'); for (let i = 0; i < 3; i++) paint(rectPts(x - 30 + i * 8, y - 30 + i * 6, 44, 54), { wash: '#FBF8F0', ink: PAL.ink, sw: .6 }); },
    car: (x, y) => { boilSeed('ic car'); paint([[x - 36, y + 10], [x - 26, y - 8], [x - 10, y - 20], [x + 16, y - 20], [x + 30, y - 6], [x + 36, y + 10]], { wash: '#C9302C', ink: PAL.ink, sw: .7 }); for (const d of [-1, 1]) paint(ellPts(x + d * 20, y + 12, 8, 8, 8), { wash: '#2A2A2A', ink: null }); inkLine([[x - 40, y - 30], [x - 20, y - 14]], 3, '#8C8894', 'ink', 0); inkLine([[x + 40, y - 30], [x + 20, y - 14]], 3, '#8C8894', 'ink', 0); },
  };
  function protein(x, y, s, t) { boilSeed('protein'); const pts = []; for (let j = 0; j <= 60; j++) { const a = j / 60 * TAU * 3; pts.push([x + Math.cos(a) * (60 + j * 2) * s + Math.sin(j * .7) * 20 * s, y + Math.sin(a * 1.3) * 80 * s + (j - 30) * 3 * s]); } inkLine(pts, 12 * s, '#E86A8A', 'ink', .6); }
  function robotHands(x, y, s, t) {
    boilSeed('robot hands'); for (const d of [-1, 1]) { const a = Math.sin(t * 2 + d) * .2; inkLine([[x + d * 260 * s, y - 200 * s], [x + d * 160 * s, y - 80 * s + a * 40], [x + d * 70 * s, y - 40 * s]], 16 * s, '#8C8894', 'ink', .3); for (let f = 0; f < 3; f++) inkLine([[x + d * 70 * s, y - 40 * s], [x + d * (40 - f * 6) * s, y - (30 - f * 14) * s]], 6 * s, '#6A6470', 'ink', 0); }
    ic.car(x, y + 20 * s);
  }
  function calculator(x, y, s, t) {
    boilSeed('calculator 15'); push(); translate(x, y); rotate(Math.sin(t * 2) * .02); scale(s);
    paint(rrPts(-100, -150, 200, 300, 18), { wash: '#4A4652', ink: PAL.ink, sw: 1.2 }); paint(rectPts(-76, -124, 152, 70), { wash: '#B8C8A8', ink: PAL.ink, sw: .8 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) paint(rrPts(-76 + c * 40, -30 + r * 40, 32, 30, 6), { wash: c === 3 ? '#E8A33A' : '#8C8894', ink: null });
    for (const d of [-1, 1]) paint(ellPts(d * 26, -98, 7, 9, 8), { wash: PAL.ink, ink: null }); inkLine([[-26, -76], [0, -68], [26, -76]], 3, PAL.ink, 'ink', .5); pop();
  }
  function knife(x, y, s) {   // a pocket knife with many tools, fanned out
    boilSeed('pocket knife'); for (let i = 0; i < 6; i++) { const a = -1.4 + i * .45; push(); translate(x, y); rotate(a); paint(rrPts(0, -10 * s, 150 * s, 20 * s, 6), { wash: '#C8C4CE', ink: PAL.ink, sw: .7 }); if (i % 2) paint(ellPts(150 * s, 0, 14 * s, 14 * s, 10), { wash: null, ink: PAL.ink, sw: .7 }); pop(); }
    paint(rrPts(x - 60 * s, y - 24 * s, 120 * s, 48 * s, 20), { wash: '#C9302C', ink: PAL.ink, sw: 1 });
  }
  function bigBlade(x, y, s) { boilSeed('big blade'); paint([[x - 40 * s, y], [x + 40 * s, y], [x + 50 * s, y - 520 * s], [x, y - 600 * s], [x - 20 * s, y - 520 * s]], { wash: '#DCE0E4', ink: PAL.ink, sw: 1.2 }); paint(rrPts(x - 60 * s, y, 120 * s, 160 * s, 12), { wash: '#6B4A32', ink: PAL.ink, sw: 1 }); }
  function chessboard(x, y, s) { boilSeed('chess15'); for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) paint(rectPts(x + c * 40 * s, y + r * 40 * s, 40 * s, 40 * s), { wash: (r + c) % 2 ? '#3A3440' : '#F4ECD8', ink: null }); paint(rectPts(x, y, 320 * s, 320 * s), { wash: null, ink: PAL.ink, sw: 1.2 }); }
  function library(x, y, s) { boilSeed('library'); for (let sh = 0; sh < 4; sh++) { paint(rectPts(x, y + sh * 110 * s + 100 * s, 460 * s, 12 * s), { wash: '#6B4A32', ink: null }); for (let b = 0; b < 16; b++) paint(rectPts(x + 8 * s + b * 28 * s, y + sh * 110 * s + (20 + 20 * hash(b + sh * 16)) * s, 24 * s, (80 - 20 * hash(b + sh * 16)) * s), { wash: ['#8A4A4A', '#3E6FA8', '#5A8A6A', '#C9A441', '#6A5A8A'][(b + sh) % 5], ink: null }); } }
  function nameplate(x, y, txt, k) { if (k <= 0) return; boilSeed('plate ' + txt); const yy = y + 40 * (1 - easeOut(k)); paint([[x - 150, yy + 40], [x + 150, yy + 40], [x + 130, yy - 40], [x - 130, yy - 40]], { wash: '#C9A45A', ink: PAL.ink, sw: 1 }); lab(txt, x, yy + 4, 44, '#3A2A1A'); }
  function octopusMachine(x, y, s, t) { boilSeed('many arms'); for (let i = 0; i < 8; i++) { const a = -Math.PI + i / 7 * Math.PI, w = Math.sin(t * 2 + i) * .2; inkLine([[x, y], [x + Math.cos(a + w) * 120 * s, y + Math.sin(a + w) * 120 * s - 20 * s], [x + Math.cos(a) * 200 * s, y + Math.sin(a) * 200 * s]], 10 * s, '#7A8AA8', 'ink', .5); } paint(rrPts(x - 80 * s, y - 60 * s, 160 * s, 120 * s, 20 * s), { wash: '#7A8AA8', ink: PAL.ink, sw: 1.2 }); for (const d of [-1, 1]) paint(ellPts(x + d * 30 * s, y - 10 * s, 10 * s, 10 * s, 8), { wash: '#FFE08A', ink: null }); }
  function chessEngine(x, y, s) { boilSeed('chess engine'); paint(rrPts(x - 90 * s, y - 120 * s, 180 * s, 180 * s, 12), { wash: '#4A4652', ink: PAL.ink, sw: 1 }); paint(ellPts(x, y - 30 * s, 30 * s, 30 * s, 14), { wash: '#FBF8F0', ink: PAL.ink, sw: .8 }); paint(rectPts(x - 20 * s, y, 40 * s, 30 * s), { wash: '#FBF8F0', ink: PAL.ink, sw: .8 }); }
  function essay(x, y, k) { if (k <= 0) return; boilSeed('essay'); const yy = y + 60 * (1 - easeOut(k)); paint(rectPts(x - 200, yy - 260, 400, 520), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); lab('2023', x, yy - 200, 40, '#8C8894'); for (let i = 0; i < 10; i++) inkLine([[x - 160, yy - 140 + i * 38], [x + 160 - 60 * hash(i), yy - 140 + i * 38]], 2, '#8C8894', 'inkfine', 0); }
  function scroll(x, y, k) { if (k <= 0) return; boilSeed('charter'); const h = 460 * easeOut(k); paint(rectPts(x - 170, y - h / 2, 340, h), { wash: '#F2E6C4', ink: PAL.ink, sw: 1 }); for (const d of [-1, 1]) paint(rrPts(x - 190, y + d * h / 2 - 18, 380, 36, 18), { wash: '#C9A45A', ink: PAL.ink, sw: 1 }); for (let i = 0; i < Math.floor(8 * k); i++) inkLine([[x - 130, y - h / 2 + 50 + i * 46], [x + 130 - 50 * hash(i), y - h / 2 + 50 + i * 46]], 2, '#8A6A4A', 'inkfine', 0); }
  // the pitch: goalposts at gx (0..1 along toward the horizon), with a sign
  function pitch(t, gx, sign) {
    boilSeed('pitch sky'); paint(rectPts(-40, -40, W + 80, 440), { wash: '#BFE0F2', fill: '#DCEEF8', fillOp: 90, ink: null });
    boilSeed('pitch'); paint(rectPts(-40, 400, W + 80, 720), { wash: PITCH, fill: '#5A9A4A', fillOp: 60, tex: .5, ink: null }); occupy(0, 360, 1290, 1080, .5, 'pitch');
    for (let i = 0; i < 6; i++) { const y = lerp(1060, 420, Math.pow(i / 6, .7)); inkLine([[-40, y], [W + 40, y]], lerp(6, 1, i / 6), '#E4F0DC', 'ink', 0); }
    const y = lerp(900, 430, gx), s = lerp(1, .15, gx), x = 645;
    inkLine([[x - 200 * s, y], [x - 200 * s, y - 420 * s]], 10 * s + 1, '#FBF8F0', 'ink', 0); inkLine([[x + 200 * s, y], [x + 200 * s, y - 420 * s]], 10 * s + 1, '#FBF8F0', 'ink', 0); inkLine([[x - 200 * s, y - 180 * s], [x + 200 * s, y - 180 * s]], 10 * s + 1, '#FBF8F0', 'ink', 0);
    if (sign) { boilSeed('goal sign'); paint(rrPts(x - 250 * Math.max(s, .5), y - 560 * s - 60, 500 * Math.max(s, .5), 70, 8), { wash: '#FBF6E6', ink: PAL.ink, sw: 1 }); lab(sign, x, y - 560 * s - 24, 40 * Math.max(s, .6), PAL.ink); }
  }

  // ---------- shots ----------
  // A: the AI alignment alignment chart (the words, doubled word and all); a flash of a generic 3×3 chart; search; the
  // magnifier over a blank page; an empty frame waits, with Jeff's, Kevin's and Casey's cards
  function shotA(t) {
    const u = L('T73.U.01'), c1 = L('T73.C.01'), c2 = L('T73.C.02'), c3 = L('T73.C.03');
    const words = say('T73.U.01', 'AI alignment alignment chart', -.3);
    if (t < words) { desk15(t, { typing: true }); if (t < .6) brushWipe(.5 + t / 1.2); return; }
    paperWorld(t);
    if (t < c1.t0) {
      const flash = win(t, words + 2, words + 3.4, .2);
      indexCard(645, 330, 1000, 200, ['AI alignment alignment chart'], { key: 'chart words', size: 64, top: .5, align: 'center' });
      if (flash > 0) grid3(480, 520, flash * 1);
      else if (t > say('T73.U.01', 'Where would you put', -.2)) { castCard('Curt', 480, 700, 1.6, t); castCard('Claude', 810, 700, 1.6, t); }
      return;
    }
    if (t < c2.t0) { searchPages(t, c1.t0); return; }
    if (t < c3.t0) { searchPages(t, c1.t0, 1); if (t > say('T73.C.02', 'a few takes on the meme', -.4)) for (let i = 0; i < 3; i++) grid3(160 + i * 380, 860, .32); return; }
    frame(250, 220, 560, 560);
    [['Jeff', 1000, 280], ['Kevin', 1000, 520], ['Casey', 1000, 760]].forEach(([n, x, y], i) => { if (t > say('T73.C.03', n, -.2)) castCard(n, x, y, 1.3, t); });
  }
  // B: the compass paints into the frame and fills it; the link (its feature code, read as its title); two microphones
  // (2022); each axis glows as it's named
  function shotB(t) {
    const u0 = L('T74.U.00'), u1 = L('T74.U.01'), c1 = L('T74.C.01'), c2 = L('T74.C.02');
    paperWorld(t);
    const grow = ease(seg(t, u0.t0 + 2, u0.t1)), S = lerp(560, 880, grow), cx = lerp(530, 645, grow), cy = 540 - (1 - grow) * 40;
    if (grow < 1) frame(cx - S / 2, cy - S / 2, S, S);
    qrFeature('connor2', t, u1.t0);
    if (t < c2.t0) { compass(cx, cy, S, t, { k: seg(t, u0.t0, u0.t0 + 2) }); if (t > c1.t0) claudeAs(1160, 1010, 8, { ...feel('thinking', t), boilKey: 'claude reads compass' }); return; }
    const mics = win(t, say('T74.C.02', "2022 conversation", -.6), say('T74.C.02', 'The horizontal axis', -.3), .3);
    if (mics > .5) { mic(420, 900, 1.6); mic(820, 900, 1.6); lab('2022', 645, 200, 70, '#4E3A2A'); return; }
    const h = say('T74.C.02', 'The horizontal axis', -.2), v = say('T74.C.02', 'the vertical axis', -.2);
    compass(645, 540, 880, t, { hAxis: win(t, h, v, .3), vAxis: seg(t, v, v + .4) * (1 - seg(t, c2.t1 - .2, c2.t1 + .3)) });
  }
  // C: the discs step aside; the cast cards land, one per line; Jeff tears the corner; Leo drifts down
  function shotC(t) {
    const S = 880, cx = 645, cy = 540, pos = (u, v) => [cx + u * S / 2, cy + v * S / 2];
    const tear = seg(t, say('T74.C.03.3', 'reject the chart itself', -.2), say('T74.C.03.3', 'reject the chart itself', .6));
    paperWorld(t);
    compass(cx, cy, S, t, { discs: 1 - seg(t, L('T74.C.03.1').t0, L('T74.C.03.1').t0 + 1), tear });
    PLACES.forEach(([id, name, u, v]) => {
      const l = L(id), k = seg(t, l.t0 + .3, l.t0 + .9); if (k <= 0) return;
      let vv = v; if (name === 'Leo') vv = v + .2 * seg(t, say(id, 'drifting down', -.2), say(id, 'drifting down', 3));
      const [x, y] = pos(u, vv); castCard(name, x, y - 160 * (1 - easeOut(k)), 1.2, t, { label: name === 'Robert' ? 'Father Robert' : name });
    });
  }
  // D: a timeline bar, 2026 to 2030; a pin drops into it
  function shotD(t) {
    const c4 = L('T74.C.04');
    paperWorld(t);
    const bar = say('T74.C.04', 'agreed with a twenty twenty-six', -.2), now = say('T74.C.04', "We're now inside that window", -.2);
    if (t < bar) { compass(645, 540, 880, t, { discs: 1 }); return; }
    timelineBar(160, 1130, 560, t, [['2026', 260], ['2030', 1030]]);
    boilSeed('window band'); paint(rectPts(260, 530, 770 * seg(t, bar, bar + 1.2), 60), { wash: '#E8A36B', washOp: 150, ink: null });
    pin(260 + 770 * (8.7 / 12 / 4), 540, seg(t, now, now + .6));
    if (t > now + .6) claudeAs(645, 1010, 10, { ...feel('surprised', t), mouth: talking(t), boilKey: 'claude window' });
  }
  // E: AI 2027: a wall calendar (its feature code); pages flutter back; 65% on a report card; a pin moves to 2030; a
  // sticky note; puzzle pieces click in (the sandbox, the drafting table, the empty chair, a tug of war); a scorecard
  // pinned up in public; gears clogged with sand, and the cranes
  function shotE(t) {
    const u = L('T75.U.01'), c1 = L('T75.C.01'), c2 = L('T75.C.02'), c3 = L('T75.C.03'), c4 = L('T75.C.04'), c5 = L('T75.C.05'), c6 = L('T75.C.06');
    if (t < c1.t0) { desk15(t, { typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]) }); return; }
    paperWorld(t);
    if (t < c2.t0) { searchPages(t, c1.t0); return; }
    qrFeature('ai-2027', t, c2.t0, { hold: 6.2 });
    if (t < c4.t0) {
      const fast = say('T75.C.03', 'probably too fast', -.3), card = say('T75.C.03', 'graded 2025', -.4), med = say('T75.C.03', 'around 2030', -.8), note = say('T75.C.03', 'April 2026 note', -.4), own = say('T75.C.03', 'My own numbers', -.3);
      if (t < med) { wallCalendar(420, 180, 1.3, t, win(t, fast, fast + 2.2, .3)); reportCard(960, 620, seg(t, card, card + .6)); return; }
      if (t < own) { wallCalendar(420, 180, 1.3, t); sticky(620, 330, seg(t, note, note + .5)); timelineBar(760, 1220, 860, t, [['2027', 830], ['2030', 1140]]); pin(lerp(830, 1140, easeOut(seg(t, med, med + 1))), 850, 1); return; }
      for (let i = 0; i < 3; i++) { const x = 330 + i * 300; boilSeed('own jar ' + i); paint(rrPts(x - 80, 460, 160, 280, 20), { wash: '#E4EEF2', washOp: 120, ink: PAL.ink, sw: 1 }); paint(rectPts(x - 70, 730 - [30, 60, 170][i], 140, [30, 60, 170][i]), { wash: ['#8A5AC9', RED, '#E8A33A'][i], ink: null }); }
      timelineBar(160, 1130, 900, t, [['2027', 260], ['2030', 1030]]); pin(1030, 890, 1);
      return;
    }
    if (t < c5.t0) {   // puzzle pieces click in
      const a = Math.min(say('T75.C.04', 'agents that cheat', -.3), c4.t0 + .4), b = say('T75.C.04', 'partial automation', -.3), c = say('T75.C.04', 'safety researchers resigning', -.3), d = say('T75.C.04', 'a political fight', -.3);
      const P = [[a, '#E8CF8A', (x, y, s) => { paint(rectPts(x - 60 * s, y - 40 * s, 120 * s, 80 * s), { wash: '#E8CF8A', ink: '#A9774F', sw: 3 }); glow(x, y, 80, '#C23A4A', .4); }],
        [b, '#8FB6E8', (x, y, s) => { paint(rectPts(x - 70 * s, y - 40 * s, 140 * s, 80 * s), { wash: '#3E6FA8', ink: '#DCE8F4', sw: 1 }); inkLine([[x - 50 * s, y], [x + 40 * s, y]], 1.4, '#DCE8F4', 'inkfine', 0); }],
        [c, '#D8D0C8', (x, y, s) => { paint(rrPts(x - 30 * s, y - 60 * s, 60 * s, 60 * s, 8), { wash: '#6A7A9A', ink: PAL.ink, sw: .8 }); inkLine([[x, y], [x, y + 40 * s]], 5, '#2A2733', 'ink', 0); }],
        [d, '#E8B8A8', (x, y, s) => { inkLine([[x - 80 * s, y], [x + 80 * s, y]], 4, '#A9774F', 'ink', .3); for (const e of [-1, 1]) curt(x + e * 70 * s, y + 50 * s, 3.4 * s, { lean: -e * .4, noShadow: true, boilKey: 'tug ' + e }); }]];
      P.forEach(([at, col, draw], i) => piece(330 + (i % 2) * 360, 300 + Math.floor(i / 2) * 360, 1.5, col, seg(t, at, at + .6), 'p' + i, draw));
      if (t > say('T75.C.04', 'roughly on schedule', -.3)) claudeAs(1080, 1000, 10, { ...feel('nervous', t), mouth: talking(t), boilKey: 'claude schedule' });
      return;
    }
    if (t < c6.t0) {   // a scorecard pinned where everyone can see it
      boilSeed('town board'); occupy(300, 180, 1000, 1000, 1, 'board'); paint(rectPts(360, 200, 560, 480), { wash: '#C9955F', ink: PAL.ink, sw: 1.2 }); for (const x of [400, 880]) paint(rectPts(x - 12, 680, 24, 320), { wash: '#6B4A32', ink: PAL.ink, sw: .8 });
      const k = seg(t, say('T75.C.05', 'grade themselves publicly', -.4), say('T75.C.05', 'grade themselves publicly', .4)); reportCard(640, 440, k);
      for (let i = 0; i < 6; i++) curt(160 + i * 200 + (i > 2 ? 300 : 0), 1060, 10, { view: 'back', seed: 60 + i, outfit: 'hoodie', hood: 'down', hair: 'short', hoodie: ['#4E5B78', '#8A4A4A', '#5A8A6A', '#C9A441', '#6A6470', '#6A5A8A'][i], hairCol: '#3A2C26', boilKey: 'crowd e ' + i });
      return;
    }
    // friction: gears clogged with sand; the cranes, slowly
    gear(380, 440, 170, t * .4 * (1 - .9 * seg(t, c6.t0 + 1, c6.t0 + 3)), '#E8A36B', 14); gear(640, 600, 120, -t * .4 * 170 / 120 * (1 - .9 * seg(t, c6.t0 + 1, c6.t0 + 3)), '#8FB6E8', 10);
    boilSeed('sand'); for (let i = 0; i < 40 * seg(t, c6.t0 + .5, c6.t0 + 3); i++) paint(ellPts(500 + hash(i) * 120, 480 + hash(i + 40) * 120, 5, 4, 6), { wash: '#D9B868', ink: null });
    if (t > say('T75.C.06', "at the world's speed", -.6)) { crane(820, 980, 1.1, t); crane(1020, 980, .8, t + 2); boilSeed('ground 15'); paint(rectPts(-40, 980, W + 80, 140), { wash: '#A9A08A', ink: null }); }
  }
  // F: defining AGI. Claude's: remote desks down a row; textbooks; a weeks-long chart; a protein, then the blueprint of a
  // machine that folds them. Metaculus: two checklists, ticked; a gavel; saturated boxes; Goodhart's target; a mask; the
  // robot hands and the calculator. Curt's, as a guess: the rim-spiked star
  function shotF(t) {
    const u = L('T76.U.01'), c1 = L('T76.C.01'), c2 = L('T76.C.02'), w = L('T76.C.03.1'), s = L('T76.C.03.2'), c4 = L('T76.C.04'), c5 = L('T76.C.05');
    if (t < c1.t0) { desk15(t, { typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]) }); return; }
    paperWorld(t);
    if (t < c2.t0) {
      const learn = say('T76.C.01', 'learning an unfamiliar domain', -.3), proj = say('T76.C.01', 'a multi-week project', -.3), keys = say('T76.C.01', 'The key parts', -.3), fold = say('T76.C.01', 'can fold proteins', -.6), inv = say('T76.C.01', 'can invent AlphaFold', -.4);
      if (t < learn) { const n = Math.floor(lerp(1, 5, seg(t, say('T76.C.01', 'any number of copies', -.3), say('T76.C.01', 'any number of copies', 1.5)))); for (let i = 0; i < n; i++) { const x = 190 + i * 228; boilSeed('remote desk ' + i); paint(rectPts(x - 110, 720, 220, 26), { wash: '#8A6A4A', ink: PAL.ink, sw: .8 }); for (const d of [-1, 1]) paint(rectPts(x + d * 90 - 6, 746, 12, 200), { wash: '#6B4A32', ink: null }); paint(rectPts(x - 80, 560, 160, 120), { wash: '#1A181D', ink: PAL.ink, sw: .6 }); paint(rectPts(x - 70, 570, 140, 100), { wash: '#3A4A5A', ink: null }); clawd(x, 720, 7.5, { ...feel('determined', t), noShadow: true, emote: null, boilKey: 'remote ' + i }); } return; }
      if (t < proj) { for (let i = 0; i < 5; i++) { boilSeed('textbook ' + i); const k = seg(t, learn + i * .3, learn + i * .3 + .4); if (k > 0) paint(rectPts(360, 800 - i * 70, 560 - 30 * hash(i), 64), { wash: ['#3E6FA8', '#8A4A4A', '#5A8A6A', '#C9A441', '#6A5A8A'][i], ink: PAL.ink, sw: 1 }); } return; }
      if (t < keys) { boilSeed('gantt'); occupy(160, 240, 1130, 840, 1, 'gantt'); for (let i = 0; i < 6; i++) { const k = seg(t, proj + i * .5, proj + i * .5 + .6); paint(rrPts(200 + i * 130, 280 + i * 90, 300 * k, 50, 10), { wash: '#7ABA5A', ink: PAL.ink, sw: .8 }); } return; }
      if (t < fold) { lab('generality', 645, 360, 60, '#4E3A2A', { alpha: seg(t, keys, keys + .5) }); lab('learning on the job', 645, 540, 60, '#4E3A2A', { alpha: seg(t, keys + 1, keys + 1.5) }); lab('long-horizon autonomy', 645, 720, 60, '#4E3A2A', { alpha: seg(t, keys + 2, keys + 2.5) }); return; }
      protein(420, 540, 1.6, t);
      if (t > inv) { boilSeed('folder blueprint'); const k = seg(t, inv, inv + .8); paint(rectPts(760, 320, 420 * k, 420), { wash: '#3E6FA8', ink: '#DCE8F4', sw: 1 }); if (k > .9) { paint(rectPts(820, 420, 160, 120), { wash: null, ink: '#DCE8F4', sw: 1 }); paint(ellPts(1060, 480, 50, 50, 16), { wash: null, ink: '#DCE8F4', sw: 1 }); inkLine([[980, 480], [1010, 480]], 1.4, '#DCE8F4', 'inkfine', 0); } }
      return;
    }
    const WEAK = [['Turing-test-style conversation', ic.chat], ['Winograd schemas', ic.schema], ['75th-percentile SAT math', ic.math], ["Montezuma's Revenge", ic.temple]];
    const STRONG = [['two-hour adversarial Turing test', ic.clock], ['expert-level exam and coding benchmarks', ic.exam], ['a robot assembling a detailed model car', ic.car]];
    if (t < c4.t0) {
      const wShow = WEAK.map((_, i) => seg(t, w.t0 + .4 + i * 1.6, w.t0 + .9 + i * 1.6)), sShow = STRONG.map((_, i) => seg(t, s.t0 + .4 + i * 2, s.t0 + .9 + i * 2));
      const met = seg(t, say('T76.C.03.1', 'arguably met already', -.2), say('T76.C.03.1', 'arguably met already', 1.6));
      checklist(30, 150, 610, 'Weak AGI', WEAK, WEAK.map((_, i) => clamp(met * 4 - i)), t, { show: t < w.t0 ? [0, 0, 0, 0] : wShow });
      if (t > s.t0) checklist(660, 150, 610, 'Strong AGI', STRONG, [0, 0, 0], t, { show: sShow });
      return;
    }
    if (t < c5.t0) {
      const gav = say('T76.C.04', 'can be resolved', -.3), sat = say('T76.C.04', 'checklists get saturated', -.3), good = say('T76.C.04', "Goodhart's law", -.3), dec = say('T76.C.04', 'skill at deception', -.6), hands = say('T76.C.04', 'ties "general intelligence" to hands', -.4);
      if (t < sat) { checklist(30, 150, 610, 'Weak AGI', WEAK, [1, 1, 1, 1], t); checklist(660, 150, 610, 'Strong AGI', STRONG, [0, 0, 0], t); if (t > gav) { boilSeed('gavel 15'); const k = seg(t, gav, gav + .5); push(); translate(645, 900); rotate(lerp(-.9, 0, easeIn(k))); paint(rectPts(-10, -20, 200, 20), { wash: '#8A5A3A', ink: PAL.ink, sw: .8 }); paint(rrPts(170, -60, 70, 100, 10), { wash: '#6B4A32', ink: PAL.ink, sw: 1 }); pop(); } return; }
      if (t < good) { checklist(30, 150, 610, 'Weak AGI', WEAK, [1, 1, 1, 1], t); checklist(660, 150, 610, 'Strong AGI', STRONG, STRONG.map((_, i) => clamp(seg(t, sat, sat + 1.5) * 3 - i)), t); claudeAs(645, 1040, 7, { ...feel('confused', t), boilKey: 'claude saturated' }); return; }
      if (t < dec) {   // a target painted onto the measuring tape
        boilSeed('tape'); occupy(100, 400, 1200, 700, 1, 'tape'); paint(rectPts(100, 500, 1100, 90), { wash: '#E8C23A', ink: PAL.ink, sw: 1.1 }); for (let i = 0; i < 22; i++) inkLine([[120 + i * 50, 500], [120 + i * 50, i % 2 ? 530 : 550]], 2, PAL.ink, 'inkfine', 0);
        const k = seg(t, good + .4, good + 1.4); for (let r = 3; r > 0; r--) paint(ellPts(820, 545, 40 * r * k, 40 * r * k, 20), { wash: r % 2 ? RED : '#FBF8F0', ink: null });
        return;
      }
      if (t < hands) { ic.chat(460, 540); push(); translate(460, 540); scale(4); translate(-460, -540); ic.chat(460, 540); pop(); boilSeed('mask 15'); const k = seg(t, dec + .3, dec + 1); paint(ellPts(900, 520, 130 * k, 160 * k, 24), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 }); if (k > .8) { for (const d of [-1, 1]) paint(ellPts(900 + d * 50, 480, 22, 14, 10), { wash: PAL.ink, ink: null }); inkLine([[840, 580], [900, 620], [960, 580]], 5, PAL.ink, 'ink', .6); } return; }
      robotHands(520, 620, 1.6, t); calculator(1060, 560, 1, t);
      return;
    }
    const axes = say('T76.C.05', 'our fourteen axes', -.3), thr = say('T76.C.05', 'reject a single threshold', -.3);
    if (t < axes) {   // behavioral, like the thrindle probe; no single threshold: a bar, crossed out
      thrindle(420, 760, 2.6, t, { key: 'probe f' });
      if (t > thr) { const k = seg(t, thr, thr + .6); boilSeed('threshold'); paint(rectPts(720, 520, 440, 22), { wash: '#6A6470', ink: PAL.ink, sw: .8 }); inkLine([[700, 440], [lerp(700, 1180, k), lerp(440, 620, k)]], 8, RED, 'ink', 0); }
      return;
    }
    radarStar(645, 520, 330, Array(14).fill(100), '#C9A441', { grow: seg(t, axes, say('T76.C.05', 'every axis at once', .6)) });
    if (t > say('T76.C.05', "can't wrap your head around", -1)) curtAs(1130, 1040, 12, { brows: 'up', boilKey: 'curt head' });
  }
  // G: Curt: a pocket knife beside one enormous blade; the thrindle under the magnifier; a chessboard beside a library; a
  // desk calendar riffling, dust flying. Claude: three nameplates; many arms beside a chess engine; an essay (2023); the
  // charter; the goalposts slide from "is it general?" to "is it good enough to matter?"; the thrindle nods
  function shotG(t) {
    const u = L('T77.U.01'), c1 = L('T77.C.01'), c2 = L('T77.C.02'), c3 = L('T77.C.03');
    if (t < u.t0 + 1) { desk15(t, { typing: true }); return; }
    paperWorld(t);
    if (t < c1.t0) {
      const thr = say('T77.U.01', 'I see thrindle', -.3), lang = say('T77.U.01', 'language is pretty general', -.8), ign = say('T77.U.01', 'I essentially ignored AI', -.3);
      if (t < thr) { knife(420, 620, 1.6); bigBlade(900, 880, 1); return; }
      if (t < lang) { thrindle(645, 800, 3, t, { key: 'magnified' }); const mx = 645 + Math.sin(t) * 60; paint(ellPts(mx, 600, 240, 240, 30), { wash: '#DCEBF0', washOp: 60, ink: PAL.ink, sw: 3 }); inkLine([[mx + 170, 770], [mx + 300, 900]], 18, '#6B5646', 'ink', 0); return; }
      if (t < ign) { chessboard(160, 380, 1); library(620, 300, 1.2); return; }
      // a desk calendar riffling, dust flying off
      boilSeed('desk cal'); occupy(360, 260, 940, 900, 1, 'desk cal'); paint(rrPts(420, 340, 460, 500, 10), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.1 });
      for (let i = 0; i < 3; i++) { const f = frac(t * 3 + i / 3); push(); translate(650, 340); scale(1, Math.cos(f * Math.PI)); paint(rectPts(-230, 0, 460, 480), { wash: '#F4EFE2', ink: PAL.ink, sw: .8 }); pop(); }
      for (let i = 0; i < 16; i++) { const f = frac(t * .8 + hash(i)); paint(ellPts(650 + (hash(i + 3) - .5) * 600 * f, 330 - 260 * f, 5, 5, 6), { wash: '#B8A890', washOp: 200 * (1 - f), ink: null }); }
      return;
    }
    if (t < c2.t0) {
      const plates = Math.min(say('T77.C.01', 'popularized in the 2000s', -.3), c1.t0 + .3), narrow = say('T77.C.01', 'opposite of narrow AI', -.4), lvl = say('T77.C.01', 'said nothing about level', -.3), nor = say('T77.C.01', 'Norvig', -.6);
      if (t < narrow) { ['Gubrud', 'Goertzel', 'Legg'].forEach((n, i) => nameplate(280 + i * 365, 540, n, seg(t, plates + .6 + i * .6, plates + 1.1 + i * .6))); lab('2000s', 645, 300, 60, '#4E3A2A', { alpha: seg(t, plates, plates + .5) }); return; }
      if (t < nor) { octopusMachine(420, 560, 1.4, t); chessEngine(960, 640, 1.4); chessboard(880, 700, .5); return; }
      essay(645, 540, seg(t, nor, nor + .6)); claudeAs(1100, 1010, 9, { ...feel('smug', t), mouth: talking(t), boilKey: 'claude essay' });
      return;
    }
    if (t < c3.t0) {
      const charter = say('T77.C.02', "OpenAI's charter", -.3), moved = say('T77.C.02', 'The goalposts moved', -.2);
      if (t < charter) { boilSeed('money'); for (let i = 0; i < 6; i++) paint(rrPts(300 + i * 120, 400 + Math.sin(t * 2 + i) * 30, 100, 56, 6), { wash: '#B8D8A8', ink: PAL.ink, sw: .8 }); return; }
      if (t < moved) { scroll(645, 540, seg(t, charter, charter + 1)); return; }
      const k = ease(seg(t, moved + 1.4, moved + 3)), far = ease(seg(t, say('T77.C.02', 'good enough to matter', 1), c2.t1 + .3));
      pitch(t, lerp(0, .45, k) + .4 * far, k < .5 ? 'is it general?' : 'is it good enough to matter?');
      return;
    }
    // fair point on the thrindle: it nods
    thrindle(645, 800, 3, t, { key: 'nods' });
    claudeAs(1080, 1010, 14, { ...feel('hopeful', t), mouth: talking(t), boilKey: 'claude fair point' });
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [L('T74.U.00').t0, shotB],
    [L('T74.C.03.1').t0, shotC],
    [L('T74.C.04').t0, shotD],
    [L('T75.U.01').t0, shotE],
    [L('T76.U.01').t0, shotF],
    [L('T77.U.01').t0, shotG],
  ]);
})();
