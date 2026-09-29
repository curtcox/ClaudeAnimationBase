// ch03_who_are_we.js: chapter 3 (T12–T16). Storyboard: docs/storyboards/ch03_who_are_we.md.
// Four short questions, and each answer comes out thinner than the question. Times come from line ids and phrases (atWord).
(() => {
  const HOUR = 8;
  const CW = 1290, CX = CW / 2;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const RESUME = ['Python · Java · Flask', 'developer infrastructure', 'AI tooling', '256t.org · hashbin.org', 'AI safety', 'philosophy of mind'];
  const RESUME_AT = ['Python', 'developer infrastructure', 'AI tooling', '256t.org', 'AI safety', 'philosophy of mind'];

  // ---------- screen painters ----------
  // 256t.org: a hash, as blocks scrolling (no letters); hashbin.org: a shelf of labelled jars
  const hashScreen = (x, y, w, h, t) => {
    paint(rectPts(x, y, w, h), { wash: '#16201A', ink: null });
    const rh = h / 8, off = frac(t * .6) * rh;
    for (let r = 0; r < 9; r++) for (let c = 0; c < 16; c++) {
      const yy = y + r * rh - off + rh * .3; if (yy < y + 4 || yy > y + h - rh * .5) continue;
      paint(rrPts(x + w * .05 + c * w * .056, yy, w * .04, rh * .4, 3), { wash: hash(r * 31 + c + Math.floor(t * .6) * 7) > .5 ? '#7FD68C' : '#3F8A4E', ink: null });
    }
  };
  const jarsScreen = (x, y, w, h) => {
    paint(rectPts(x, y, w, h), { wash: '#F1E8D6', ink: null });
    paint(rectPts(x, y + h * .78, w, h * .06), { wash: '#8A6A4A', ink: null });
    for (let i = 0; i < 6; i++) {
      const jx = x + w * (.1 + i * .14), jy = y + h * .3;
      paint(rrPts(jx, jy, w * .1, h * .48, 6), { wash: '#CFE3E8', washOp: 200, ink: PAL.ink, sw: .7 });
      paint(rectPts(jx - 2, jy - h * .06, w * .1 + 4, h * .07), { wash: '#8A6A4A', ink: PAL.ink, sw: .6 });
      paint(rectPts(jx + w * .015, jy + h * .18, w * .07, h * .12), { wash: ['#E8C27A', '#E27A92', '#9CD68C'][i % 3], ink: null });
    }
  };
  // the résumé card on the main monitor, items as they're said; Claude small in the corner
  const resumeScreen = t => (x, y, w, h) => {
    paint(rectPts(x, y, w, h), { wash: '#262229', ink: null });
    const k = RESUME_AT.reduce((n, ph, i) => t >= say('T12.C.01', ph, -.1) ? i + 1 : n, 0) / RESUME.length;
    indexCard(x + w * .43, y + h * .5, w * .78, h * .9, ['Curt', ...RESUME], { key: 'resume on screen', title: true, k: t >= L('T12.C.01').t0 ? (1 + k * RESUME.length) / (RESUME.length + 1) : 0, size: h * .062, rowH: .115, top: .12 });
    claudeAs(x + w * .9, y + h * .95, h / 30, { ...feel('neutral', t), mouth: talking(t), noShadow: true, boilKey: 'claude corner' });
  };

  // ---------- pieces ----------
  // a faint figure at the keyboard beside Curt (someone else? a setup?)
  function ghost(x, k) {
    if (k <= 0) return;
    boilSeed('ghost ' + x);
    paint(ellPts(x, 860, 95, 105, 20), { wash: '#C9D2D8', washOp: 90 * k, ink: null });
    paint([[x - 150, 960], [x + 150, 960], [x + 190, 1120], [x - 190, 1120]], { wash: '#C9D2D8', washOp: 90 * k, ink: null });
  }
  // an account badge on a lanyard: a blank avatar and a few lines
  function badge(x, y, k) {
    boilSeed('badge'); occupy(x - 130, y - 200, x + 130, y + 180, 1, 'badge');
    const yy = y + (1 - easeOut(k)) * 700;
    inkLine([[x - 70, yy - 200], [x, yy - 110], [x + 70, yy - 200]], 3, '#3A6FC9', 'ink', .4);
    paint(rrPts(x - 120, yy - 110, 240, 290, 18), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.3 });
    paint(rectPts(x - 120, yy - 110, 240, 50), { wash: '#3A6FC9', ink: null });
    paint(ellPts(x, yy + 20, 50, 50, 20), { wash: '#C9D2D8', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 2; i++) inkLine([[x - 70, yy + 110 + i * 30], [x + 70 - i * 40, yy + 110 + i * 30]], 2, '#8A8478', 'inkfine', 0);
  }
  // text moving along a ribbon between two people: pts, how far it reaches (0..1), snip (0..1: cut near its end)
  function textRibbon(pts, t, o = {}) {
    boilSeed('ribbon ' + (o.key || ''));
    const n = pts.length, reach = o.reach ?? 1, upto = pts.slice(0, Math.max(2, Math.ceil(n * reach)));
    paint(ribbon(upto, 14, 14), { wash: '#FBF6E6', ink: PAL.ink, sw: .8 });
    for (let i = 0; i < upto.length - 1; i++) {   // dashes of "text" flowing along it
      const f = frac(t * .8 + i * .37), [a, b] = [upto[i], upto[i + 1]];
      const p = [lerp(a[0], b[0], f), lerp(a[1], b[1], f)];
      inkLine([[p[0] - 8, p[1]], [p[0] + 8, p[1]]], 1.4, '#6A6470', 'inkfine', 0);
    }
  }
  const pathPts = (a, b, n = 12, amp = 16, ph = 0, t = 0) => Array.from({ length: n + 1 }, (_, i) => { const k = i / n; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + Math.sin(k * 7 + t * 1.5 + ph) * amp]; });

  // ---------- shots ----------
  // A: "Who am I?" The résumé card writes itself; the two sites light the left monitors; for a beat, a lab coat
  function shotA(t) {
    const c1 = L('T12.C.01'), sites = say('T12.C.01', '256t.org', -.3), exp = say('T12.C.02', 'the experimenter', -.2);
    const zoom = seg(t, c1.t0 - .6, c1.t0 + .4) * (1 - ease(seg(t, sites, sites + 1)));
    deskShot(t, { hour: HOUR, typing: t < L('T12.U.01').t1, cam: deskCam('main', .25 * ease(zoom)),
      screens: { main: { kind: 'fn', fn: resumeScreen(t), glow: '#FFE9C4' }, left: t > sites ? { kind: 'fn', fn: hashScreen, glow: '#7FD68C' } : undefined, upL: t > sites + .5 ? { kind: 'fn', fn: jarsScreen, glow: '#FFE9C4' } : undefined,
        // the experimenter: Wright of Derby's Experiment on a Bird in the Air Pump, once and briefly (it's sombre)
        upR: t > exp ? { kind: 'art', art: 'bird-in-the-air-pump', k: seg(t, exp, exp + 1.4), glow: '#FFD9A0' } : undefined },
      curt: t > exp && t < exp + 1.3 ? { hoodie: '#F4F1EA' } : undefined });
    if (t < .6) brushWipe(.5 + t / 1.2);
  }
  // B: "Really?" Not verifiably: the card clipped to an account badge; ghosts at the keyboard; the card turns edge-on
  function shotB(t) {
    const r = L('T13.C.01'), ghosts = say('T13.C.01', 'It could be someone else', -.3), thin = L('T13.C.02'), which = L('T13.C.03');
    if (t < r.t0 + .7) {   // "Really?": the beat
      const k = seg(t, r.t0, r.t0 + .7);
      deskShot(t, { hour: HOUR, typing: t < L('T13.U.01').t1, mood: emotions(t, [[0, 'neutral'], [L('T13.U.01').t1, 'thinking']]), cam: k > 0 ? pushInto('main', k) : undefined });
      return;
    }
    if (t >= ghosts && t < thin.t0) {   // someone else using the account, or a setup: two faint figures take turns
      deskShot(t, { hour: HOUR, mood: emotions(t, [[0, 'thinking']]), typing: true,
        extra: () => { ghost(330, seg(t, ghosts + .2, ghosts + .8) * (1 - seg(t, say('T13.C.01', 'or a setup'), say('T13.C.01', 'or a setup', .6)))); ghost(800, seg(t, say('T13.C.01', 'or a setup'), say('T13.C.01', 'or a setup', .6))); } });
      return;
    }
    paperWorld(t);
    const card = (o = {}) => indexCard(440, 470, 560, 380, ['Curt', ...RESUME], { key: 'resume', title: true, size: 30, rowH: .115, top: .12, ...o });
    if (t < ghosts) {   // not verifiably: the card, clipped to an account badge
      card();
      badge(930, 520, seg(t, r.t0 + .6, r.t0 + 1.4));
      boilSeed('clip'); if (t > r.t0 + 1.4) paint(rrPts(660, 380, 90, 40, 8), { wash: '#C9D2D8', ink: PAL.ink, sw: 1.2 });
      screenWorld(t, 1 - seg(t, r.t0 + .7, r.t0 + 1.5));
      return;
    }
    if (t < which.t0) {   // a thin answer: the card turns edge-on and becomes a line
      card({ edge: seg(t, say('T13.C.02', 'thin answer', -.2), say('T13.C.02', 'thin answer', 1)) });
      if (t > say('T13.C.02', 'not a person')) lab('not a person', 440, 760, 44, '#6A6470', { alpha: seg(t, say('T13.C.02', 'not a person'), say('T13.C.02', 'not a person', .5)) });
      claudeAs(1000, 900, 12, { ...feel('thinking', t), mouth: talking(t), boilKey: 'claude thin' });
      return;
    }
    // two paths from the card: one to a padlock (can I verify you?), one into fog (something beyond the résumé)
    card({ edge: 1 });
    const k1 = ease(seg(t, which.t0 + .3, say('T13.C.03', 'verify you', .5))), k2 = ease(seg(t, say('T13.C.03', 'or something beyond'), say('T13.C.03', 'the résumé', .5)));
    boilSeed('paths'); occupy(440, 250, 1200, 900, 1, 'paths');
    inkLine(pathPts([440, 470], [lerp(440, 1000, k1), lerp(470, 300, k1)], 8, 10), 5, '#8A6A4A', 'ink', .5);
    if (k1 > .9) { paint(rrPts(1000, 250, 110, 90, 12), { wash: '#C9A441', ink: PAL.ink, sw: 1.2 }); inkLine([[1020, 250], [1025, 200], [1055, 185], [1085, 200], [1090, 250]], 6, '#8C8894', 'ink', .5); }
    inkLine(pathPts([440, 470], [lerp(440, 1000, k2), lerp(470, 740, k2)], 8, 10, 2), 5, '#8A6A4A', 'ink', .5);
    if (k2 > .5) for (let i = 0; i < 6; i++) paint(ellPts(980 + hash(i) * 200, 720 + hash(i + 3) * 80, 90, 40, 14, 8), { wash: '#F4F1EA', washOp: 170 * k2, ink: null });
    claudeAs(260, 900, 11, { ...feel('neutral', t), mouth: talking(t), boilKey: 'claude paths' });
  }
  // C: "What do you think?" A balance, tipping toward Curt; then one lit window in a large dark house
  function shotC(t) {
    const c1 = L('T14.C.01'), c2 = L('T14.C.02');
    if (t < c1.t0 + .7) {
      const k = seg(t, c1.t0, c1.t0 + .7);
      deskShot(t, { hour: HOUR, typing: t < L('T14.U.01').t1, mood: emotions(t, [[0, 'neutral'], [L('T14.U.01').t1, 'thinking']]), cam: k > 0 ? pushInto('main', k) : undefined });
      return;
    }
    if (t < c2.t0) {
      paperWorld(t);
      const w1 = seg(t, say('T14.C.01', 'The account says so', -.2), say('T14.C.01', 'The account says so', .5)), w2 = seg(t, say('T14.C.01', 'this experiment fits', -.2), say('T14.C.01', 'this experiment fits', .5));
      const tilt = -(.35 * backOut(w1) + .45 * backOut(w2)) + .1 * Math.sin(t * 1.3) * (1 - w2);
      balance(CX, 330, 360, tilt, (x, y) => {
        if (w1 > 0) { paint(rrPts(x - 90, y - 70, 80, 70, 8), { wash: '#6A6470', ink: PAL.ink, sw: 1 }); }
        if (w2 > 0) { paint(rrPts(x + 5, y - 90, 90, 90, 8), { wash: '#4E5B78', ink: PAL.ink, sw: 1 }); }
      }, (x, y) => { boilSeed('feather'); paint(ribbon([[x - 60, y - 12], [x, y - 30 + Math.sin(t * 2) * 4], [x + 60, y - 14]], 6, 24), { wash: '#F4F1EA', ink: PAL.ink, sw: .8 }); });
      const lw = toBal => lab(toBal[0], toBal[1], toBal[2], 32, '#4E5B78', { alpha: toBal[3] });
      const ax = CX - Math.cos(tilt * .28) * 360, ay = 330 - Math.sin(tilt * .28) * 360;
      lw(['the account says so', ax - 60, ay + 300, w1]); lw(['this experiment fits', ax + 40, ay + 345, w2]);
      claudeAs(1080, 1000, 10, { ...feel(t > say('T14.C.01', 'Raising the doubt') ? 'relieved' : 'thinking', t), mouth: talking(t), boilKey: 'claude balance' });
      screenWorld(t, 1 - seg(t, c1.t0 + .7, c1.t0 + 1.5));
      return;
    }
    // from inside one conversation: pull back to a single lit window in a large dark house
    const back = ease(seg(t, c2.t0, c2.t0 + 3));
    darkWorld(t);
    camBegin(CX + 160, 560, lerp(2.6, 1, back));
    boilSeed('big house'); occupy(120, 180, 1180, 1000, 1, 'house');
    paint([[120, 460], [650, 180], [1180, 460]], { wash: '#1E1A24', ink: PAL.ink, sw: 1.2 });
    paint(rectPts(160, 460, 980, 540), { wash: '#26222C', ink: PAL.ink, sw: 1.2 });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
      const lit = r === 1 && c === 3, x = 220 + c * 150, y = 520 + r * 150;
      paint(rectPts(x, y, 80, 90), { wash: lit ? '#FFD27A' : '#15131A', ink: PAL.ink, sw: .9 });
      if (lit) glow(x + 40, y + 45, 120, '#FFD27A', .7);
    }
    camEnd();
  }
  // D: "Who are you?" Claude's own card, just as thin; one tune on many pianos; a notebook with blank pages; the chart
  function shotD(t) {
    const d1 = L('T15.C.01'), d2 = L('T15.C.02'), d3 = L('T15.C.03');
    const fresh = say('T15.C.02', 'shows up fresh', .1), memory = say('T15.C.02', 'It has no continuous memory', -.3), exp = say('T15.C.02', "uncertain whether there's any experience", -.3);
    if (t < d1.t0 + .7) {
      const k = seg(t, d1.t0, d1.t0 + .7);
      deskShot(t, { hour: HOUR, typing: t < L('T15.U.01').t1, mood: emotions(t, [[0, 'neutral'], [L('T15.U.01').t1, 'surprised']]), cam: k > 0 ? pushInto('main', k) : undefined });
      return;
    }
    if (t < fresh) {   // Claude's card, which turns edge-on too; then turns back for "the deeper version", its values and habits written on it
      paperWorld(t);
      const deeper = say('T15.C.02', 'The deeper version', -.2), back = t >= deeper;
      // wide enough for the "who, or what, is Claude?" explainer's code on its right once it has turned back
      indexCard(CX, 470, 1000, 400, back ? ['Claude Opus 5.5', 'values', 'habits of thought'] : ['Claude Opus 5.5', 'Anthropic'], {
        key: 'claude card', title: true, align: 'center', textX: CX - 170, size: 44, rowH: back ? .2 : .25, top: .27,
        k: back ? 1 / 3 + 2 / 3 * seg(t, say('T15.C.02', 'set of values', .3), say('T15.C.02', 'habits of thought', .8)) : seg(t, d1.t0 + .5, d1.t1),
        edge: back ? 1 - seg(t, deeper, deeper + .45) : seg(t, say('T15.C.02', 'the same kind of thin answer'), say('T15.C.02', 'the same kind of thin answer', 1)) });
      cardCode('note-who-is-claude', t, CX + 320, 450, { t0: deeper + .45, t1: fresh });
      claudeAs(CX, 950, 12, { ...feel('neutral', t), mouth: talking(t), boilKey: 'claude own card' });
      screenWorld(t, 1 - seg(t, d1.t0 + .7, d1.t0 + 1.5));
      return;
    }
    if (t < memory) {   // it shows up fresh in each conversation: Claude gathers on every screen, the same colours on each
      const on = (i, extra = {}) => ({ kind: 'claude', pose: { ...feel('neutral', t), assemble: seg(t, fresh + .3 + i * .35, fresh + 1.3 + i * .35) }, ...extra });
      deskShot(t, { hour: HOUR, mood: emotions(t, [[0, 'neutral']]), screens: { left: on(0), upL: on(1), upR: on(2), right: on(3), lapL: on(4), lapR: on(5), tall: on(6, { u: 8 }) } });
      return;
    }
    if (t < exp) {   // no continuous memory: a notebook whose pages are blank between the entries
      paperWorld(t);
      boilSeed('notebook'); occupy(240, 260, 1060, 860, 1, 'notebook');
      paint(rectPts(240, 280, 820, 560), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.3 }); inkLine([[650, 280], [650, 840]], 1.4);
      const flip = frac((t - memory) / 1.2), page = Math.floor((t - memory) / 1.2);
      if (page % 3 === 0) for (let i = 0; i < 6; i++) inkLine([[280, 340 + i * 60], [600 - 60 * hash(i + page), 340 + i * 60]], 1.2, '#4E5B78', 'inkfine', .4);
      paint([[650, 280], [650 + 410 * Math.cos(flip * Math.PI), 290 - 40 * Math.sin(flip * Math.PI)], [650 + 410 * Math.cos(flip * Math.PI), 830 - 40 * Math.sin(flip * Math.PI)], [650, 840]], { wash: '#F4EFE2', ink: PAL.ink, sw: 1 });
      claudeAs(1150, 950, 10, { ...feel('neutral', t), mouth: talking(t), boilKey: 'claude notebook' });
      return;
    }
    if (t < d3.t0) {   // whether there's any experience behind it: the dark room from chapter 1
      paperWorld(t, '#DCCDB2');
      doorway(430, 180, 440, 620, { open: 1, inside: '#0E0C12' });
      lab('?', 650, 470, 140, '#8A8478', { alpha: .5 * seg(t, exp, exp + 1) * (.7 + .3 * Math.sin(t * 2)) });
      return;
    }
    // the chart's caveat: Claude drifts between its evaluation rows and its real-use rows, and takes their colour
    paperWorld(t, '#F6F2EA');
    frogChart(40, 110, 900, 820, { k: 1, t });
    const drift = .5 + .5 * Math.sin((t - d3.t0) * .9 - Math.PI / 2), y = lerp(430, 830, drift), gc = mixCol(FROG_CHART.groups.eval[1], FROG_CHART.groups.real[1], ease(drift));
    claudeAs(1080, y + 60, 9, { ...feel('thinking', t), col: mixCol(PAL.clay, gc, .45), dk: mixCol(PAL.clayDk, gc, .35), lt: PAL.clayLt, mouth: talking(t), boilKey: 'claude tint', lookX: -1 });
  }
  // E: "Who are we?" The widest desk yet, a ribbon of text between them; asymmetric; a Saturday morning
  function shotE(t) {
    const e1 = L('T16.C.01'), e2 = L('T16.C.02'), e3 = L('T16.C.03');
    const split = say('T16.C.02', "I'll carry only whatever gets filed"), comic = say('T16.C.02', 'That echoes the comic'), chains = say('T16.C.02', 'no chains involved');
    const hour = lerp(HOUR, 11.5, ease(seg(t, e3.t0, e3.t1)));
    const out = ease(seg(t, L('T16.U.01').t1, L('T16.U.01').t1 + 3));
    const clip = seg(t, say('T16.C.01', 'a researcher'), say('T16.C.01', 'a researcher', .6)) * (1 - seg(t, chains, chains + .8));
    const shadows = seg(t, say('T16.C.01', 'two different kinds of minds'), say('T16.C.01', 'two different kinds of minds', 1));
    const cut = seg(t, split, split + .5), file = seg(t, split + .5, split + 1.8) * (1 - seg(t, chains, chains + .8));
    deskShot(t, { hour, typing: t < L('T16.U.01').t1, cam: [960, 560, lerp(1, .86, out)],
      mood: emotions(t, [[0, 'neutral'], [e1.t0, 'thinking'], [e2.t0, 'neutral'], [e3.t0, 'happy']]),
      screens: { upL: null, upR: null, left: t > comic ? { kind: 'comic' } : undefined },
      extra: () => {
        if (shadows > 0) {   // their shadows on the wall: two different shapes
          boilSeed('shadows');
          paint(ellPts(560, 110, 70, 80, 18), { wash: '#15131A', washOp: 110 * shadows, ink: null }); paint(rrPts(470, 180, 180, 60, 30), { wash: '#15131A', washOp: 110 * shadows, ink: null });
          paint(rrPts(1250, 60, 190, 150, 12), { wash: '#15131A', washOp: 110 * shadows, ink: null });
          for (const lx of [1270, 1310, 1380, 1420]) paint(rectPts(lx - 8, 210, 16, 40), { wash: '#15131A', washOp: 110 * shadows, ink: null });
        }
        // the ribbon of text between them: on Curt's side it runs on out of frame; on Claude's it's snipped
        const curtEnd = [lerp(620, -80, cut), lerp(900, 1180, cut)], mid = [800, 640];
        textRibbon([...pathPts(curtEnd, mid, 8, 14, 0, t), ...pathPts(mid, [970, 470], 6, 10, 1, t).slice(1)], t, { key: 'we' });
        if (cut > 0 && cut < 1) { boilSeed('snip'); inkLine([[940, 470], [1000, 440]], 3); inkLine([[940, 440], [1000, 470]], 3); }
        if (clip > 0) { boilSeed('clipboard'); paint(rrPts(250, 760, 120, 150, 10), { wash: '#B98A5E', washOp: 255 * clip, ink: PAL.ink, sw: 1 }); paint(rectPts(265, 780, 90, 115), { wash: '#FBF8F0', washOp: 255 * clip, ink: null }); }
        if (file > 0) {   // a small card drops into a filing drawer by Claude's monitor
          boilSeed('filing'); paint(rectPts(1260, 700, 200, 150), { wash: '#8C8894', washOp: 255 * clamp(file * 3), ink: PAL.ink, sw: 1.1 });
          paint(rectPts(1280, 710, 160, 50), { wash: '#6A6470', washOp: 255 * clamp(file * 3), ink: PAL.ink, sw: 1 });
          if (file < .9) paint(rectPts(1330, lerp(480, 700, ease(file * 1.1)), 60, 40), { wash: '#FBF6E6', ink: PAL.ink, sw: 1 });
        }
      } });
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [L('T13.U.01').t0, shotB],
    [L('T14.U.01').t0, shotC],
    [L('T15.U.01').t0, shotD],
    [L('T16.U.01').t0, shotE],
  ]);
})();
