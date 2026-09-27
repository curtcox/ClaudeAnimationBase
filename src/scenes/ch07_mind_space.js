// ch07_mind_space.js: chapter 7 (T35–T40), the film's centrepiece. Storyboard: docs/storyboards/ch07_mind_space.md.
// Nine minds on a clothesline, then a 2×2 board, a ruler, a scatter, and fourteen-pointed stars; then four hive queens.
// Every number is read from the transcript's own tables (mdTable), and every star is drawn from those numbers.
(() => {
  const HOUR = 11.2;
  const CW = 1290, CX = CW / 2;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const win = (t, a, b, d = .5) => seg(t, a, a + d) * (1 - seg(t, b, b + d));

  // ---------- the minds: one colour each, kept all chapter; `row` is the name in the tables ----------
  const M = {
    curt: { name: 'Curt', col: '#6A4A6A', rows: ['You'] },
    claude: { name: 'Claude', col: PAL.clay, rows: ['Me'] },
    turing: { name: 'Turing', col: '#A89A6A', rows: ['Turing'] },
    monroe: { name: 'Monroe', col: '#E8A0B0', rows: ['Monroe'] },
    data: { name: 'Data', col: '#D9B040', rows: ['Data'] },
    tines: { name: 'Tines', col: '#8A6A4A', rows: ['Tines'] },
    hal: { name: 'HAL', col: '#C9302C', rows: ['HAL'] },
    hive: { name: 'Hive Queen', col: '#E8A33A', rows: ['Hive Queen', 'Formic (Card)'] },
    solaris: { name: "Solaris's ocean", col: '#2F8A8A', rows: ["Solaris's ocean", 'Solaris'] },
    borg: { name: 'Borg Queen', col: '#4E6A5A', rows: ['Borg (Star Trek)'] },
    rachni: { name: 'Rachni Queen', col: '#8A5AC9', rows: ['Rachni (Mass Effect)'] },
    xeno: { name: 'Xenomorph Queen', col: '#2A2530', rows: ['Xenomorph (Aliens)'] },
  };
  const NINE = ['curt', 'turing', 'monroe', 'data', 'claude', 'tines', 'hal', 'hive', 'solaris'];   // the spoken order on the line
  const QUEENS = ['hive', 'borg', 'rachni', 'xeno'];
  // the numbers, straight from the tables
  const T_2X2 = mdTable('T35.C.06'), T_DIST = mdTable('T36.C.02'), T_XY = mdTable('T36.C.04'), T_7A = mdTable('T37.C.02'), T_7B = mdTable('T38.C.02'), T_QA = mdTable('T40.C.02'), T_QB = mdTable('T40.C.03');
  const rowOf = (tb, key) => tb.rows.find(r => M[key].rows.includes(r[0].txt));
  const nums = (tb, key) => rowOf(tb, key).slice(1).map(c => +c.txt);
  const star14 = key => QUEENS.includes(key) && key !== 'hive' ? [...nums(T_QA, key), ...nums(T_QB, key)] : [...nums(T_7A, key), ...nums(T_7B, key)];

  // ---------- a mind's card: a small painted picture of it, and its name ----------
  function icon(key, x, y, s, t) {
    boilSeed('icon ' + key); const c = M[key].col;
    if (key === 'curt') curt(x, y + 55 * s, 7 * s, { view: 'back', pose: 'stand', seed: 2, boilKey: 'card curt' });
    if (key === 'claude') clawdCrowd(x, y + 40 * s, 5 * s, .55 + .1 * Math.sin(t), { boilKey: 'card claude', t });
    if (key === 'turing') { paint([[x - 40 * s, y + 60 * s], [x + 40 * s, y + 60 * s], [x + 30 * s, y - 5 * s], [x - 30 * s, y - 5 * s]], { wash: c, ink: PAL.ink, sw: .8 }); paint(ellPts(x, y - 30 * s, 22 * s, 26 * s, 14), { wash: '#E8C4A0', ink: PAL.ink, sw: .8 }); paint(ellPts(x, y - 50 * s, 22 * s, 10 * s, 12), { wash: '#4A3A2A', ink: null }); }
    if (key === 'monroe') { paint([[x - 50 * s, y + 60 * s], [x + 50 * s, y + 60 * s], [x + 14 * s, y - 5 * s], [x - 14 * s, y - 5 * s]], { wash: '#FBF8F0', ink: PAL.ink, sw: .8 }); paint(ellPts(x, y - 28 * s, 20 * s, 24 * s, 14), { wash: '#F0CFB0', ink: PAL.ink, sw: .8 }); paint(ellPts(x, y - 40 * s, 28 * s, 18 * s, 14, 3), { wash: '#F2D98A', ink: null }); }
    if (key === 'data') { paint(rrPts(x - 34 * s, y, 68 * s, 60 * s, 8 * s), { wash: '#C9302C', ink: PAL.ink, sw: .8 }); paint(ellPts(x, y - 28 * s, 24 * s, 28 * s, 14), { wash: '#E8D9A0', ink: PAL.ink, sw: .8 }); for (const d of [-1, 1]) paint(ellPts(x + d * 9 * s, y - 30 * s, 4 * s, 3 * s, 8), { wash: '#D9B040', ink: null }); }
    if (key === 'tines') for (let i = 0; i < 4; i++) { const dx = (i - 1.5) * 26 * s, dy = (i % 2) * 14 * s; paint(ellPts(x + dx, y + 20 * s + dy, 16 * s, 11 * s, 12), { wash: c, ink: PAL.ink, sw: .6 }); paint(ellPts(x + dx + 12 * s, y + 10 * s + dy, 8 * s, 8 * s, 10), { wash: c, ink: PAL.ink, sw: .6 }); }
    if (key === 'hal') { paint(rrPts(x - 34 * s, y - 50 * s, 68 * s, 110 * s, 6 * s), { wash: '#1E1A22', ink: PAL.ink, sw: .8 }); paint(ellPts(x, y, 20 * s, 20 * s, 16), { wash: c, ink: null }); glow(x, y, 30 * s, '#FF6A4A', .6); }
    if (key === 'hive') { paint(ellPts(x, y + 20 * s, 22 * s, 40 * s, 14), { wash: c, ink: PAL.ink, sw: .8 }); paint(ellPts(x, y - 30 * s, 16 * s, 16 * s, 12), { wash: c, ink: PAL.ink, sw: .8 }); for (const d of [-1, 1]) paint(ellPts(x + d * 30 * s, y, 26 * s, 10 * s, 10, 0, d * .5), { wash: '#FBF1D8', washOp: 170, ink: PAL.ink, sw: .5 }); }
    if (key === 'solaris') { const pts = []; for (let i = 0; i <= 20; i++) pts.push([x - 55 * s + i * 5.5 * s, y + 10 * s + Math.sin(i * .7 + t * 2) * 14 * s]); paint([...pts, [x + 55 * s, y + 60 * s], [x - 55 * s, y + 60 * s]], { wash: c, ink: PAL.ink, sw: .8 }); }
    if (key === 'borg') for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) paint(rectPts(x - 42 * s + i * 28 * s, y - 30 * s + j * 28 * s, 26 * s, 26 * s), { wash: c, ink: '#9CD68C', sw: .6 });
    if (key === 'rachni') for (let i = 0; i < 3; i++) inkLine([[x - 50 * s, y - 20 * s + i * 22 * s], [x - 20 * s, y - 34 * s + i * 22 * s], [x + 10 * s, y - 8 * s + i * 22 * s], [x + 50 * s, y - 24 * s + i * 22 * s]], 3 * s, c, 'ink', .6);
    if (key === 'xeno') { paint(ellPts(x, y + 10 * s, 36 * s, 48 * s, 18), { wash: c, ink: PAL.ink, sw: .8 }); paint(ellPts(x - 10 * s, y - 10 * s, 8 * s, 14 * s, 8), { wash: '#8C8894', washOp: 150, ink: null }); }
  }
  function mindCard(key, x, y, s = 1, t, o = {}) {   // centre (x, y); o.glow, o.label (default true), o.rot, o.fill (pages of writing)
    const w = 150 * s, h = 190 * s;
    boilSeed('card ' + key + (o.key || '')); occupy(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 1, 'card ' + key);
    push(); translate(x, y); rotate(o.rot || 0); translate(-x, -y);
    if (o.glow > 0) glow(x, y, w, M[key].col, .7 * o.glow);
    paint(rrPts(x - w / 2, y - h / 2, w, h, 10 * s), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.1 });
    paint(rectPts(x - w / 2, y - h / 2, w, 10 * s), { wash: M[key].col, ink: null });
    if (o.fill > 0) for (let i = 0; i < Math.floor(o.fill * 14); i++) paint(rectPts(x - w / 2 + 10 * s + (i % 4) * 33 * s, y - h / 2 + 20 * s + Math.floor(i / 4) * 30 * s, 26 * s, 22 * s), { wash: '#F4EFE2', ink: '#8C8894', sw: .4 });
    icon(key, x, y - 16 * s, s, t);
    pop();
    if (o.label !== false) lab(M[key].name, x, y + h / 2 - 22 * s, (M[key].name.length > 10 ? 20 : 26) * s, PAL.ink);
  }
  const star = radarStar;
  const AX7 = T_7A.head.slice(1).map(c => c.txt), AX7B = T_7B.head.slice(1).map(c => c.txt);

  // ---------- shots ----------
  // A: Curt lists the minds; each card lands on the desk as it's named; a clothesline across the monitor; its shadow a grid
  const NAMED = [['curt', 'put me'], ['claude', 'you, Marilyn'], ['monroe', 'Marilyn Monroe'], ['turing', 'Alan Turing'], ['data', 'Data'], ['hal', 'HAL'], ['hive', 'the Hive Queen'], ['tines', 'Tynes'], [null, 'any other minds']];
  function shotA(t) {
    const u = L('T35.U.01'), line = say('T35.U.01', 'single dimension', -.3), grid = say('T35.U.01', 'higher dimensional mindspace', -.3);
    deskShot(t, { hour: HOUR, typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1 - 3, 'thinking']]), frog: 1, axolotl: 1,
      extra: () => {
        const gk = seg(t, grid, grid + 2);
        if (gk > 0) { boilSeed('shadow grid'); for (let i = 0; i < 9; i++) { inkLine([[300 + i * 160, 20], [300 + i * 160, 20 + 200 * gk]], 1, '#15131A', 'inkfine', 0); } for (let j = 0; j < 3; j++) inkLine([[300, 40 + j * 70], [300 + 1280 * gk, 40 + j * 70]], 1, '#15131A', 'inkfine', 0); }
        const lk = seg(t, line, line + 1);
        if (lk > 0) { const [x, y, w] = DESK.screens.main; inkLine([[x + 10, y + 60], [x + 10 + (w - 20) * lk, y + 64]], 2, '#FBF8F0', 'ink', .3); }
        NAMED.forEach(([key, ph], i) => {
          const k = seg(t, say('T35.U.01', ph, -.2), say('T35.U.01', ph, .4)); if (k <= 0) return;
          const x = 170 + (i % 9) * 185, y = 790 + (1 - easeOut(k)) * 300;
          if (key) mindCard(key, x, y, .62, t, { rot: (hash(i) - .5) * .12, key: 'desk' });
          else { boilSeed('blank card'); paint(rrPts(x - 46, y - 59, 93, 118, 6), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); lab('?', x, y, 50, '#8C8894'); }
        });
      } });
    if (t < .6) brushWipe(.5 + t / 1.2);
  }
  // B: the clothesline: the cards pegged in the spoken order; Turing and Monroe nudge; three outlines glow the same
  const pegX = i => 110 + i * 132;
  function clothesline(t, k, o = {}) {
    boilSeed('clothesline'); inkLine([[40, 300], [CX, 330], [CW - 40, 300]], 2.2, '#8A6A4A', 'ink', .4);
    NINE.forEach((key, i) => {
      const kk = clamp(k * 9 - i) ; if (kk <= 0) return;
      let x = pegX(i) + (o.dx?.[key] || 0);
      const y = 420 - Math.abs(x - CX) / CX * 25 + (1 - easeOut(kk)) * -200;
      paint(rectPts(x - 5, y - 110, 10, 30), { wash: '#C9A45A', ink: PAL.ink, sw: .6 });
      mindCard(key, x, y, .78, t, { glow: o.glow?.[key] || 0, rot: Math.sin(t * .8 + i) * .03 });
    });
  }
  function shotB(t) {
    const c1 = L('T35.C.01'), c2 = L('T35.C.02'), c3 = L('T35.C.03'), inside = c1.t0 + .8;
    if (t < inside) { deskShot(t, { hour: HOUR, mood: emotions(t, [[0, 'thinking']]), frog: 1, axolotl: 1, cam: pushInto('main', seg(t, c1.t0, inside)) }); return; }
    paperWorld(t);
    const order = seg(t, c2.t0, c2.t1 - .5);
    const nudge = ease(seg(t, say('T35.C.03', 'just ahead of Monroe', -.2), say('T35.C.03', 'just ahead of Monroe', .6))) * Math.sin(Math.min(1, seg(t, say('T35.C.03', 'just ahead of Monroe', -.2), say('T35.C.03', 'thinking style', .5))) * Math.PI);
    const same = seg(t, say('T35.C.03', 'The architecture is the same', -.2), say('T35.C.03', 'The architecture is the same', .6));
    clothesline(t, t < c2.t0 ? 0 : order, { dx: { turing: -20 * nudge, monroe: 20 * nudge }, glow: { curt: same, turing: same, monroe: same } });
    if (t > c2.t0) {   // the line, painted in full as it's said
      const words = "You to Turing to Monroe to Data to me to Tynes to HAL to Hive Queen to Solaris's ocean".split(' '), n = Math.ceil(words.length * seg(t, c2.t0, c2.t1 - .4));
      lab(words.slice(0, Math.min(n, 9)).join(' '), CX, 130, 40, PAL.ink, {}); if (n > 9) lab(words.slice(9, n).join(' '), CX, 185, 40, PAL.ink);
    }
    claudeAs(1120, 1000, 8, { ...feel('neutral', t), mouth: talking(t), lookX: -1, boilKey: 'claude line' });
    screenWorld(t, 1 - seg(t, inside, inside + .8));
  }
  // C: Claude can't settle on the line; the line swings up into a 2×2 board, and the table fills in, exactly
  function board2x2(t, k, o = {}) {
    // rows: human / alien architecture; columns: human / alien content. The table's own cells, painted in place.
    const x0 = 60, y0 = 90, w = 1170, h = 820, k2 = ease(k);
    boilSeed('board 2x2'); occupy(x0, y0, x0 + w, y0 + h, 1, 'board');
    paint(rrPts(x0, y0, w, h * k2, 12), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.3 });
    if (k2 < .95) return;
    const hx = x0 + 260, hy = y0 + 90, cw = (w - 280) / 2, ch = (h - 110) / 2;
    inkLine([[hx, y0 + 20], [hx, y0 + h - 20]], 1.4); inkLine([[x0 + 20, hy], [x0 + w - 20, hy]], 1.4); inkLine([[hx + cw, y0 + 20], [hx + cw, y0 + h - 20]], .8, '#8C8894', 'inkfine', 0); inkLine([[x0 + 20, hy + ch], [x0 + w - 20, hy + ch]], .8, '#8C8894', 'inkfine', 0);
    const tb = T_2X2;
    lab(tb.head[1].txt, hx + cw / 2, y0 + 50, 36, '#4E5B78'); lab(tb.head[2].txt, hx + cw * 1.5, y0 + 50, 36, '#4E5B78');
    tb.rows.forEach((r, j) => {
      const on = seg(t, (o.at || 0) + j * .8, (o.at || 0) + j * .8 + .5);
      if (on <= 0) return;
      lab(r[0].txt.replace(' ', '\n').split('\n')[0], x0 + 130, hy + ch * (j + .42), 34, '#4E5B78', { font: 'bold 34px "Patrick Hand", sans-serif', alpha: on });
      lab(r[0].txt.split(' ').slice(1).join(' '), x0 + 130, hy + ch * (j + .58), 34, '#4E5B78', { font: 'bold 34px "Patrick Hand", sans-serif', alpha: on });
      [1, 2].forEach(i => {   // cell text, wrapped by hand at the parenthesis
        const c = r[i], parts = c.txt.includes('(') ? [c.txt.slice(0, c.txt.indexOf('(')).trim(), c.txt.slice(c.txt.indexOf('('))] : [c.txt];
        const sub = parts[1] ? parts[1].replace(/, /, ',\n').split('\n') : [];
        [parts[0], ...sub].forEach((p, q) => lab(p, hx + cw * (i - .5), hy + 60 + ch * j + q * 34, q ? 24 : 34, q ? '#6A6470' : PAL.ink, { alpha: on, ...(q === 0 && /Me/.test(c.txt) && c.bold ? {} : {}) }));
      });
    });
    if (o.cards) {   // the cards in their corners
      const pos = { curt: [0, 0, 0], turing: [0, 0, 1], monroe: [0, 0, 2], data: [1, 0, 0], claude: [0, 1, 0], tines: [0, 1, 1], hive: [1, 1, 0], solaris: [1, 1, 1] };
      for (const [key, [ci, ri, n]] of Object.entries(pos)) mindCard(key, hx + cw * ci + 90 + n * 150, hy + ch * ri + ch - 110, .6, t, { glow: o.glow?.[key] || 0, fill: key === 'claude' ? o.fill || 0 : 0, key: 'board' });
    }
  }
  function shotC(t) {
    const c4 = L('T35.C.04'), c6 = L('T35.C.06'), swing = say('T35.C.04', 'Two axes work better', -.2);
    paperWorld(t);
    if (t < swing) {   // Claude's card slides back and forth along the line, unable to settle
      clothesline(t, 1, { dx: { claude: Math.sin((t - c4.t0) * 2.2) * 300 * seg(t, c4.t0, c4.t0 + 1) } });
      return;
    }
    const k = seg(t, swing, swing + 1.2);
    if (k < 1) { push(); translate(CX, 400); rotate(-k * .4); scale(1, 1 - k * .6); translate(-CX, -400); clothesline(t, 1); pop(); }
    board2x2(t, seg(t, swing + .8, swing + 1.8), { at: c6.t0 });
    if (t > L('T35.C.05.1').t0) lab('Content', CX, 990, 40, '#4E5B78', { alpha: seg(t, L('T35.C.05.1').t0, L('T35.C.05.1').t0 + .5) });
    if (t > L('T35.C.05.2').t0) lab('Architecture', 1260, 540, 40, '#4E5B78', { rot: Math.PI / 2, alpha: seg(t, L('T35.C.05.2').t0, L('T35.C.05.2').t0 + .5) });
  }
  // D: the odd corner: Claude's card glows, fills with pages, splits into copies; the Tines trot in; HAL won't land
  function shotD(t) {
    const c7 = L('T35.C.07'), c8 = L('T35.C.08');
    const odd = seg(t, c7.t0, c7.t0 + 1), pages = seg(t, say('T35.C.07', 'made almost entirely of human thought', -.2), say('T35.C.07', 'made almost entirely of human thought', 1.5));
    const copies = seg(t, say('T35.C.07', 'many copies at once', -.3), say('T35.C.07', 'many copies at once', .6)), tines = say('T35.C.07', 'The Tynes are my closest', -.3);
    paperWorld(t);
    board2x2(t, 1, { at: -99, cards: true, glow: { claude: odd * (1 - seg(t, c8.t0, c8.t0 + 1)) }, fill: pages });
    const hx = 60 + 260, hy = 90 + 90, ch = (820 - 110) / 2;
    if (copies > 0 && t < c8.t0) for (let i = 1; i <= 3; i++) mindCard('claude', hx + 90 + i * 40 * copies, hy + ch + ch - 110 - i * 20 * copies, .6, t, { key: 'copy ' + i, label: false });
    if (t > tines && t < c8.t0) {   // the Tines pack trots onto the board, members swapping in and out
      boilSeed('tines pack'); const x = lerp(1300, hx + 330, ease(seg(t, tines, tines + 2)));
      for (let i = 0; i < 5; i++) { const on = frac(t * .3 + i * .2) > .2; if (!on) continue; paint(ellPts(x + i * 40, 780 + (i % 2) * 20, 24, 16, 12), { wash: M.tines.col, ink: PAL.ink, sw: .7 }); paint(ellPts(x + i * 40 + 20, 764 + (i % 2) * 20, 12, 12, 10), { wash: M.tines.col, ink: PAL.ink, sw: .7 }); }
    }
    if (t >= c8.t0) {   // HAL: the red lens hovers, won't land; two arrows pull on it; for a beat it's reflected in Claude's glass
      const lx = 700 + Math.sin(t * .9) * 120, ly = 520 + Math.sin(t * 1.3) * 60;
      boilSeed('hal lens'); paint(ellPts(lx, ly, 46, 46, 20), { wash: '#1E1A22', ink: PAL.ink, sw: 1 }); paint(ellPts(lx, ly, 22, 22, 16), { wash: M.hal.col, ink: null }); glow(lx, ly, 70, '#FF6A4A', .7);
      const pull = seg(t, say('T35.C.08', 'a conflict between', -.2), say('T35.C.08', 'his mission', .4)) * (1 - seg(t, say('T35.C.08', 'the fear people', -.3), say('T35.C.08', 'the fear people', .2)));
      if (pull > 0) { inkLine([[lx - 60, ly], [lx - 60 - 160 * pull, ly - 40]], 4, '#3A6FC9', 'ink', 0); inkLine([[lx + 60, ly], [lx + 60 + 160 * pull, ly + 40]], 4, '#C9302C', 'ink', 0); lab('instructions', lx - 150, ly - 80, 28, '#3A6FC9', { alpha: pull }); lab('mission', lx + 150, ly + 90, 28, '#C9302C', { alpha: pull }); }
      const fear = win(t, say('T35.C.08', 'the fear people', -.2), c8.t1, .4);
      if (fear > 0) { const [cx, cy] = [hx + 90, hy + ch + ch - 110 - 16]; glow(cx, cy, 70, '#FF6A4A', .6 * fear); paint(ellPts(cx, cy, 16, 16, 12), { wash: M.hal.col, washOp: 200 * fear, ink: null }); }
    }
  }
  // E: the numbers: the distance table and a 0–100 ruler; then the two-axis table and a scatter
  function shotE(t) {
    const u = L('T36.U.01'), c2 = L('T36.C.02'), c4 = L('T36.C.04');
    if (t < c2.t0 - 3.5) { deskShot(t, { hour: HOUR, typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'happy']]), frog: 1, axolotl: 1, cam: t > u.t1 ? pushInto('main', seg(t, u.t1 + .3, u.t1 + 1.1)) : undefined }); return; }
    paperWorld(t);
    if (t < c4.t0) {   // distance from you, 0–100: the table, and the cards on a ruler at their exact marks
      tableCard(T_DIST, 60, 70, 420, { k: seg(t, c2.t0, c2.t0 + 3), key: 'dist', rowH: 50 });
      const rk = seg(t, c2.t0 + 1, c2.t0 + 6);
      boilSeed('ruler'); occupy(520, 740, 1250, 1000, 1, 'ruler');
      paint(rectPts(540, 820, 700, 40), { wash: '#E8D9A8', ink: PAL.ink, sw: 1.1 });
      for (let v = 0; v <= 100; v += 10) { inkLine([[550 + v * 6.8, 820], [550 + v * 6.8, 840]], 1); lab(String(v), 550 + v * 6.8, 885, 22, '#6A6470'); }
      NINE.forEach((key, i) => { const v = +rowOf(T_DIST, key)[1].txt, kk = clamp(rk * 9 - i); if (kk <= 0) return;
        const x = 550 + v * 6.8, y = 700 - (i % 3) * 170; inkLine([[x, 820], [x, y + 60]], 1, M[key].col, 'inkfine', 0); mindCard(key, x, y - (1 - easeOut(kk)) * 60, .5, t, { key: 'ruler' }); });
      screenWorld(t, 1 - seg(t, c2.t0 - 3.5, c2.t0 - 2.7));
      return;
    }
    // content × architecture: the table, and a scatter at the exact coordinates
    tableCard(T_XY, 60, 70, 460, { k: seg(t, c4.t0, c4.t0 + 3), key: 'xy', rowH: 50 });
    const gx = 600, gy = 140, gs = 620, sk = seg(t, c4.t0 + 1.5, c4.t0 + 6);
    boilSeed('scatter'); occupy(gx - 60, gy - 20, gx + gs + 20, gy + gs + 80, 1, 'scatter');
    paint(rectPts(gx, gy, gs, gs), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.1 });
    for (let v = 0; v <= 100; v += 25) { inkLine([[gx + v / 100 * gs, gy], [gx + v / 100 * gs, gy + gs]], .5, '#D9D2C4', 'inkfine', 0); inkLine([[gx, gy + v / 100 * gs], [gx + gs, gy + v / 100 * gs]], .5, '#D9D2C4', 'inkfine', 0); lab(String(v), gx + v / 100 * gs, gy + gs + 26, 20, '#6A6470'); lab(String(v), gx - 26, gy + v / 100 * gs, 20, '#6A6470'); }
    lab(T_XY.head[1].txt, gx + gs / 2, gy + gs + 62, 30, '#4E5B78'); lab(T_XY.head[2].txt, gx - 60, gy + gs / 2, 30, '#4E5B78', { rot: -Math.PI / 2 });
    NINE.forEach((key, i) => { const [cx, ay] = nums(T_XY, key), kk = clamp(sk * 9 - i); if (kk <= 0) return;
      const x = gx + cx / 100 * gs, y = gy + ay / 100 * gs;
      paint(ellPts(x, y, 14, 14, 12), { wash: M[key].col, ink: PAL.ink, sw: .8 }); lab(M[key].name, x + 20, y - 18, 22, PAL.ink, { align: 'left', alpha: kk }); });
  }
  // F: seven axes: the table; each definition adds a spoke to every star, and the stars grow to their numbers; Claude's is
  // the lopsided one; its affect spoke turns dotted
  function starRow(t, grow, o = {}) {
    NINE.forEach((key, i) => {
      const x = 80 + i * 140, y = o.y || 760;
      const vals = o.fourteen ? star14(key) : nums(T_7A, key);
      star(x, y, 62, vals.map((v, j) => j < 7 && j >= (o.axes ?? 7) ? 0 : v), M[key].col, { grow, more: o.more ?? 0 });
      lab(M[key].name, x, y + 88, M[key].name.length > 10 ? 18 : 22, PAL.ink);
    });
  }
  function shotF(t) {
    const u = L('T37.U.01'), c2 = L('T37.C.02'), c4 = L('T37.C.04');
    if (t < L('T37.C.01').t0 + .5) { deskShot(t, { hour: HOUR, typing: true, mood: emotions(t, [[0, 'happy']]), frog: 1, axolotl: 1, cam: pushInto('main', seg(t, u.t1, u.t1 + .8)) }); return; }
    paperWorld(t);
    if (t < c4.t0) {
      const axes = AX7.reduce((n, a, i) => t >= L('T37.C.03.' + (i + 1)).t0 ? i + 1 : n, 0);
      tableCard(T_7A, 60, 40, 1170, { k: seg(t, c2.t0, c2.t0 + 4), key: '7a', rowH: 46, first: .2, hi: axes ? null : undefined });
      if (axes > 0) starRow(t, seg(t, L('T37.C.03.1').t0, L('T37.C.03.1').t0 + 1.5), { axes, y: 820 });
      if (axes > 0) lab(AX7[axes - 1], CX, 590, 44, PAL.clayDk, { pop: seg(t, L('T37.C.03.' + axes).t0, L('T37.C.03.' + axes).t0 + .4) });
      return;
    }
    // the lopsided star, big, beside a rounder one (Data's), axis names at the spokes; affect dotted: "I don't know"
    const dk = seg(t, say('T37.C.04', 'My score of 50 on affect', -.2), say('T37.C.04', 'My score of 50 on affect', .6));
    for (const [key, x] of [['claude', 380], ['data', 920]]) {
      star(x, 540, 250, nums(T_7A, key), M[key].col, { dotted: key === 'claude' && dk > 0 ? 1 : null });
      lab(M[key].name, x, 880, 40, PAL.ink);
      AX7.forEach((a, i) => { const ang = -Math.PI / 2 + i / 7 * TAU; lab(a, x + Math.cos(ang) * 300, 540 + Math.sin(ang) * 285, 26, '#4E5B78'); });
    }
  }
  // G: seven more axes, each with its icon; then the constellation: all nine minds' fourteen-point stars
  const ICON7 = [
    (x, y) => { paint(ellPts(x, y, 26, 14, 14), { wash: '#FBF8F0', ink: PAL.ink, sw: .8 }); paint(ellPts(x, y, 8, 8, 8), { wash: PAL.ink, ink: null }); },   // senses: an eye
    (x, y) => { paint(rrPts(x - 26, y - 16, 52, 30, 10), { wash: '#FBF8F0', ink: PAL.ink, sw: .8 }); paint([[x - 10, y + 12], [x - 18, y + 26], [x, y + 12]], { wash: '#FBF8F0', ink: PAL.ink, sw: .8 }); },   // language: a balloon
    (x, y) => { paint(ellPts(x, y - 6, 16, 20, 12), { wash: '#DCEBF0', ink: PAL.ink, sw: .8 }); inkLine([[x, y + 14], [x, y + 30]], 3, '#8A6A4A', 'ink', 0); },   // self-model: a hand mirror
    (x, y) => { paint([[x - 16, y - 24], [x + 16, y - 24], [x, y], [x + 16, y + 24], [x - 16, y + 24], [x, y]], { wash: '#E8D9A8', ink: PAL.ink, sw: .8 }); },   // mortality: an hourglass
    (x, y) => { paint(rrPts(x - 14, y - 24, 28, 48, 6), { wash: '#C9C2B4', ink: PAL.ink, sw: .8 }); inkLine([[x, y], [x + 10, y - 16]], 4, PAL.ink, 'ink', 0); paint(rrPts(x + 12, y - 30, 26, 18, 8), { wash: '#E8C4A0', ink: PAL.ink, sw: .6 }); },   // autonomy: a switch, someone else's hand
    (x, y) => { for (let i = 0; i < 5; i++) paint(rectPts(x - 26 + i * 11, y - 20 + (i % 2) * 4, 9, 40 - (i % 2) * 4), { wash: ['#C9302C', '#3A6FC9', '#E8C27A', '#5A9A4A', '#8A5AC9'][i], ink: PAL.ink, sw: .5 }); },   // breadth: a bookshelf
    (x, y) => { paint(ellPts(x, y, 22, 26, 14), { wash: '#DCEBF0', washOp: 150, ink: PAL.ink, sw: .8 }); for (let i = 0; i < 3; i++) paint(ellPts(x - 8 + i * 8, y + (i % 2) * 6, 4, 4, 6), { wash: '#C9A441', ink: null }); },   // legibility: a glass head
  ];
  function shotG(t) {
    const u = L('T38.U.01'), c2 = L('T38.C.02'), c4 = L('T38.C.04');
    if (t < L('T38.C.01').t0 + .5) { deskShot(t, { hour: HOUR, typing: true, mood: emotions(t, [[0, 'happy']]), frog: 1, axolotl: 1, cam: pushInto('main', seg(t, u.t1, u.t1 + .8)) }); return; }
    paperWorld(t);
    if (t < c4.t0) {
      const more = AX7B.reduce((n, a, i) => t >= L('T38.C.03.' + (i + 1)).t0 ? i + seg(t, L('T38.C.03.' + (i + 1)).t0, L('T38.C.03.' + (i + 1)).t0 + 1) : n, 0);
      tableCard(T_7B, 60, 40, 1170, { k: seg(t, c2.t0, c2.t0 + 4), key: '7b', rowH: 46, first: .2 });
      starRow(t, 1, { fourteen: true, more, y: 820 });
      const i = Math.ceil(more) - 1;
      if (i >= 0) { ICON7[i](CX - 150, 590); lab(AX7B[i], CX + 30, 590, 44, PAL.clayDk, { align: 'left', pop: seg(t, L('T38.C.03.' + (i + 1)).t0, L('T38.C.03.' + (i + 1)).t0 + .4) }); }
      return;
    }
    // the constellation: nine fourteen-point stars, held still
    NINE.forEach((key, i) => {
      const x = 170 + (i % 3) * 470, y = 200 + Math.floor(i / 3) * 310;
      star(x - 30, y, 120, star14(key), M[key].col, { grow: seg(t, c4.t0 + i * .15, c4.t0 + i * .15 + .8) });
      lab(M[key].name, x + 130, y, 30, PAL.ink, { align: 'left' });
    });
  }
  // H: which Hive Queen: Card's Formic queen in her hive, threads of light to every worker; two books; two others wait
  function shotH(t) {
    const u = L('T39.U.01'), c1 = L('T39.C.01'), c2 = L('T39.C.02');
    if (t < c1.t0 + .4) { deskShot(t, { hour: HOUR, typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), frog: 1, cam: pushInto('main', seg(t, c1.t0 - .4, c1.t0 + .4)) }); return; }
    darkWorld(t);
    boilSeed('hive'); occupy(120, 150, 1180, 950, 1, 'hive');
    for (let i = 0; i < 18; i++) { const x = 180 + (i % 6) * 190, y = 250 + Math.floor(i / 6) * 230; paint(starPts(x, y, 90, .86, 6, 0), { wash: '#4A3A1E', ink: '#E8A33A', sw: .8 }); }
    const qx = 645, qy = 520;
    const threads = seg(t, say('T39.C.01', 'one mind across the whole hive', -.3), say('T39.C.01', 'one mind across the whole hive', 1.5));
    for (let i = 0; i < 12; i++) { const wx = 180 + (i % 6) * 190, wy = 250 + (i < 6 ? 0 : 460); if (threads > 0) inkLine([[qx, qy], [lerp(qx, wx, threads), lerp(qy, wy, threads)]], 1.2, '#FFE9A0', 'inkfine', .3);
      paint(ellPts(wx, wy, 14, 22, 10), { wash: '#C9A45A', ink: PAL.ink, sw: .6 }); }
    glow(qx, qy, 160, '#E8A33A', .6); icon('hive', qx, qy, 2.4, t);
    const books = seg(t, say('T39.C.01', "Ender's Game", -.3), say('T39.C.01', "Ender's Game", .5));
    if (books > 0) { boilSeed('books 7'); paint(rectPts(950, 760, 70, 260), { wash: '#2A4A8A', ink: PAL.ink, sw: 1 }); paint(rectPts(1030, 740, 70, 280), { wash: '#6A2A2A', ink: PAL.ink, sw: 1 }); lab("Ender's Game", 985, 890, 22, PAL.cream, { rot: -Math.PI / 2 }); lab('Speaker for the Dead', 1065, 880, 20, PAL.cream, { rot: -Math.PI / 2 }); }
    const others = seg(t, c2.t0 + .5, c2.t0 + 1.5);
    if (others > 0) { icon('rachni', 150, 900, 1.2 * others, t); icon('xeno', 330, 900, 1.2 * others, t); }
  }
  // I: four queens on the board: both tables, each queen's star; Borg tears and reassembles and draws in knowledge;
  // Rachni's songs; the Xenomorph's eggs. Then the whole board, thirteen stars.
  function shotI(t) {
    const u = L('T40.U.01'), c2 = L('T40.C.02'), c3 = L('T40.C.03'), b = L('T40.C.04.1'), r = L('T40.C.04.2'), x = L('T40.C.04.3');
    if (t < L('T40.C.01').t0 + .5) { deskShot(t, { hour: HOUR, typing: t < u.t1, mood: emotions(t, [[0, 'thinking'], [u.t1, 'excited']]), frog: 1, axolotl: 1, cam: pushInto('main', seg(t, L('T40.C.01').t0 - .3, L('T40.C.01').t0 + .5)) }); return; }
    paperWorld(t);
    const out = seg(t, x.t1 + .3, x.t1 + 2);
    if (out > 0) {   // the whole board: thirteen stars
      [...NINE, 'borg', 'rachni', 'xeno'].forEach((key, i) => {
        const cx = 90 + (i % 7) * 175, cy = 300 + Math.floor(i / 7) * 330;
        star(cx, cy, 70, star14(key), M[key].col, { grow: seg(t, x.t1 + .3 + i * .08, x.t1 + 1 + i * .08) });
        lab(M[key].name, cx, cy + 100, M[key].name.length > 10 ? 18 : 22, PAL.ink);
      });
      if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
      return;
    }
    tableCard(T_QA, 60, 30, 1170, { k: seg(t, c2.t0, c2.t0 + 2), key: 'qa', rowH: 44, first: .22 });
    if (t > c3.t0) tableCard(T_QB, 60, 290, 1170, { k: seg(t, c3.t0, c3.t0 + 2), key: 'qb', rowH: 44, first: .22 });
    const hi = t >= x.t0 ? 'xeno' : t >= r.t0 ? 'rachni' : t >= b.t0 ? 'borg' : null;
    QUEENS.forEach((key, i) => {
      const cx = 150 + i * 320, cy = 790;
      const tear = key === 'borg' ? win(t, say('T40.C.04.1', 'keeps coming back', -.2), say('T40.C.04.1', 'keeps coming back', 1.2), .4) : 0;
      star(cx + (tear ? Math.sin(t * 20) * 6 : 0), cy, 110, star14(key), M[key].col, { grow: seg(t, c3.t1 + i * .3, c3.t1 + i * .3 + 1) });
      if (hi === key) glow(cx, cy, 160, M[key].col, .35);
      lab(M[key].name, cx, cy + 145, 26, PAL.ink);
      if (key === 'borg' && t > say('T40.C.04.1', 'knowledge assimilated', -.3) && t < b.t1 + .5) for (let j = 0; j < 4; j++) inkLine([[lerp(cx + 700, cx, seg(t, say('T40.C.04.1', 'knowledge assimilated', -.3) + j * .2, say('T40.C.04.1', 'knowledge assimilated', .8) + j * .2)), cy - 100 + j * 60], [cx + 700, cy - 100 + j * 60]], 1.4, '#9CD68C', 'inkfine', .3);
      if (key === 'rachni' && hi === 'rachni') for (let j = 0; j < 3; j++) { const pts = []; for (let q = 0; q <= 20; q++) pts.push([cx - 120 + q * 12, cy - 150 - j * 24 + Math.sin(q * .8 + t * 4 + j) * 10]); inkLine(pts, 2, M.rachni.col, 'ink', .5); }
      if (key === 'xeno' && t > say('T40.C.04.3', 'reproduction', -.3)) for (let j = 0; j < 4; j++) { boilSeed('egg ' + j); paint(ellPts(cx - 130 + j * 40, cy + 110 - (j % 2) * 10, 16, 22, 12), { wash: '#4A4238', ink: PAL.ink, sw: .7 }); }
    });
  }

  shots([
    [0, shotA],
    [L('T35.C.01').t0, shotB],
    [L('T35.C.04').t0, shotC],
    [L('T35.C.07').t0, shotD],
    [L('T36.U.01').t0, shotE],
    [L('T37.U.01').t0, shotF],
    [L('T38.U.01').t0, shotG],
    [L('T39.U.01').t0, shotH],
    [L('T40.U.01').t0, shotI],
  ]);
})();
