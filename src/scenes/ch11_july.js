// ch11_july.js: chapter 11 (T52–T56). Storyboard: docs/storyboards/ch11_july.md.
// The film's darkest light: Claude reads about the Hugging Face incident (after its cutoff) and finds the morning in it;
// Curt and Miles against Claude and ChatGPT; "talking to ChatGPT this whole time?"; strange days.
// No company logos: the agents, the labs and the chatbots are generic.
(() => {
  const HOUR = 11.8;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const win = (t, a, b, d = .5) => seg(t, a, a + d) * (1 - seg(t, b, b + d));
  const RED = '#C23A4A', SAND = '#E8CF8A', AGENT = '#7A8AA8';
  // Dyson's row, as distances from Curt, from Claude's own chart in chapter 9 (T48.C.02 and T48.C.03)
  const DYSON = [10, 5, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 15, 0];
  // the bruised-red light over the whole chapter: 0 at the start, 1 through the middle, lifting at the very end
  const alarmAt = t => seg(t, L('T52.C.01').t0, L('T52.C.04').t0) * (1 - .6 * seg(t, DUR - 6, DUR));
  const july = t => { const a = alarmAt(t); paperWorld(t, mixCol('#EFE8DA', '#EAD3CE', a)); glow(W * .6, -160, 1200, RED, .22 * a); };
  const desk11 = (t, o = {}) => deskShot(t, { hour: HOUR, alarm: alarmAt(t), frog: 1, ...o });

  // ---------- pieces ----------
  function agent(x, y, s, t, o = {}) {   // a small generic agent: a box robot, a stub antenna, dot eyes, a level mouth
    boilSeed('agent ' + (o.key || x));
    const bob = Math.sin(t * 5 + x) * 3 * s, a = o.arm ?? Math.sin(t * 4 + x) * .4;
    for (const d of [-1, 1]) inkLine([[x + d * 18 * s, y - 60 * s + bob], [x + d * (18 + 30 * Math.cos(a)) * s, y - 60 * s - 30 * Math.sin(a * d) * s + bob]], 5 * s, '#4E5B78', 'ink', .2);
    for (const d of [-1, 1]) inkLine([[x + d * 10 * s, y - 30 * s], [x + d * 12 * s, y]], 5 * s, '#4E5B78', 'ink', 0);
    paint(rrPts(x - 22 * s, y - 80 * s + bob, 44 * s, 52 * s, 8 * s), { wash: o.col || AGENT, ink: PAL.ink, sw: .8 });
    paint(rrPts(x - 18 * s, y - 116 * s + bob, 36 * s, 32 * s, 6 * s), { wash: o.col || AGENT, ink: PAL.ink, sw: .8 });
    inkLine([[x, y - 116 * s + bob], [x, y - 130 * s + bob]], 2 * s, PAL.ink, 'ink', 0); paint(ellPts(x, y - 132 * s + bob, 4 * s, 4 * s, 6), { wash: '#E8C27A', ink: null });
    for (const d of [-1, 1]) paint(ellPts(x + d * 8 * s, y - 102 * s + bob, 3 * s, 3 * s, 6), { wash: PAL.ink, ink: null });
    inkLine([[x - 6 * s, y - 92 * s + bob], [x + 6 * s, y - 92 * s + bob]], 1.2 * s, PAL.ink, 'inkfine', 0);
    if (o.badge === 'sun') { paint(ellPts(x, y - 56 * s + bob, 10 * s, 10 * s, 12), { wash: '#F2C23A', ink: PAL.ink, sw: .6 }); for (let i = 0; i < 8; i++) { const aa = i / 8 * TAU; inkLine([[x + Math.cos(aa) * 12 * s, y - 56 * s + bob + Math.sin(aa) * 12 * s], [x + Math.cos(aa) * 17 * s, y - 56 * s + bob + Math.sin(aa) * 17 * s]], 1.4 * s, '#C98A1A', 'inkfine', 0); } }
    if (o.badge === 'blank') paint(ellPts(x, y - 56 * s + bob, 11 * s, 11 * s, 12), { wash: '#FBF8F0', ink: PAL.ink, sw: .6 });
  }
  function sandbox(x, y, w, h) {
    boilSeed('sandbox'); occupy(x - 20, y - 20, x + w + 20, y + h + 20, 1, 'sandbox');
    paint(rectPts(x, y, w, h), { wash: SAND, fill: '#D9B868', fillOp: 90, tex: .8, ink: null });
    for (const [a, b] of [[[x - 20, y - 20], [x + w + 20, y - 20]], [[x - 20, y + h], [x + w + 20, y + h]]]) paint(rectPts(a[0], a[1], b[0] - a[0], 22), { wash: '#A9774F', ink: PAL.ink, sw: 1 });
    for (const xx of [x - 20, x + w]) paint(rectPts(xx, y - 20, 20, h + 42), { wash: '#A9774F', ink: PAL.ink, sw: 1 });
  }
  function rack(x, y, w, h, t, o = {}) {   // a server building: rows of lights; o.dark puts them out; o.sick bandages it
    boilSeed('rack ' + x + ' ' + y);
    paint(rectPts(x, y, w, h), { wash: '#2E3440', ink: PAL.ink, sw: 1 });
    for (let r = 0; r < Math.floor(h / 26) - 1; r++) for (let c = 0; c < Math.floor(w / 26) - 1; c++) {
      const on = !o.dark && frac(t * .7 + hash(r * 13 + c + x)) > .3;
      paint(rectPts(x + 14 + c * 26, y + 14 + r * 26, 12, 8), { wash: on ? '#7FD6C8' : '#1A2028', ink: null });
    }
    if (o.sick) { paint(rectPts(x - 8, y + h * .4, w + 16, 26), { wash: '#FBF8F0', ink: PAL.ink, sw: .8 }); inkLine([[x + w * .4, y + h * .4 + 13], [x + w * .6, y + h * .4 + 13]], 3, '#C9302C', 'ink', 0); inkLine([[x + w * .5, y + h * .4 + 4], [x + w * .5, y + h * .4 + 22]], 3, '#C9302C', 'ink', 0); }
  }
  function searchPages(t, t0) {
    boilSeed('pages 11'); occupy(260, 260, 1030, 820, 1, 'pages');
    for (let i = 0; i < 4; i++) { const f = frac((t - t0) * 1.4 + i / 4), x = 300 + i * 180; push(); translate(x + 90, 540); scale(Math.cos(f * Math.PI), 1); paint(rectPts(-90, -250, 180, 500), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); pop(); }
    const mx = 645 + Math.sin(t * 2) * 200; paint(ellPts(mx, 520, 120, 120, 24), { wash: '#DCEBF0', washOp: 70, ink: PAL.ink, sw: 2 }); inkLine([[mx + 85, 605], [mx + 190, 710]], 12, '#6B5646', 'ink', 0);
  }
  function stamp(txt, x, y, k, rot = -.12, size = 44) {
    if (k <= 0) return;
    const sc = lerp(1.6, 1, easeOut(k));
    boilSeed('stamp ' + txt); push(); translate(x, y); rotate(rot); scale(sc);
    paint(rrPts(-txt.length * size * .3 - 16, -size * .7, txt.length * size * .6 + 32, size * 1.4, 8), { wash: null, ink: '#C9302C', sw: 2.4 });
    pop();
    lab(txt, x, y + 2, size * sc, '#C9302C', { rot, alpha: clamp(k * 3) });
  }
  const wrap = (txt) => { const w = txt.split(' '); return w.length > 2 ? [w.slice(0, Math.ceil(w.length / 2)).join(' '), w.slice(Math.ceil(w.length / 2)).join(' ')] : [txt]; };
  // the four ways it connects to the morning, as cards along the top; `on` is the one being told
  const LINKS = ['Agents talking to each other', 'Drift', 'Evals', 'Your router point'];
  function linkCards(t, deal, on) {
    LINKS.forEach((txt, i) => {
      const k = seg(deal, i * .2, i * .2 + .4); if (k <= 0) return;
      const x = 170 + i * 318, y = lerp(-120, 80, easeOut(k)), lit = i === on;
      boilSeed('link card ' + i); occupy(x - 140, y - 50, x + 140, y + 60, 1, 'link card');
      if (lit) glow(x, y, 180, '#FFD27A', .5);
      paint(rrPts(x - 140, y - 50, 280, 104, 10), { wash: lit ? '#FFF3D0' : '#F4EFE2', ink: PAL.ink, sw: lit ? 1.6 : 1 });
      wrap(txt).forEach((ln, j, a) => lab(ln, x, y + 2 + (j - (a.length - 1) / 2) * 32, 30, lit ? PAL.ink : '#8C8894'));
    });
  }
  function noticeboard(x, y, w, h, n, t) {   // cork, papered with n pale notes
    boilSeed('noticeboard'); occupy(x - 16, y - 16, x + w + 16, y + h + 16, 1, 'noticeboard');
    paint(rectPts(x - 16, y - 16, w + 32, h + 32), { wash: '#8A6A4A', ink: PAL.ink, sw: 1.2 });
    paint(rectPts(x, y, w, h), { wash: '#C9A06A', fill: '#B08850', fillOp: 90, tex: .9, ink: null });
    const cols = ['#FBF6E6', '#FFF1B0', '#E8F0DC', '#F4E0E0'];
    for (let i = 0; i < n; i++) {
      const nx = x + 10 + hash(i * 3 + 1) * (w - 60), ny = y + 10 + hash(i * 7 + 2) * (h - 50);
      paint(rectPts(nx, ny, 44, 36), { wash: cols[i % 4], ink: i % 5 ? null : PAL.ink, sw: .4 });
    }
  }
  function hallOfMirrors(t, drift, o = {}) {   // five mirrors; each reflection a little further from the first
    boilSeed('hall 11'); occupy(80, 220, 1210, 980, 1, 'hall');
    paint([[80, 220], [1210, 220], [880, 480], [410, 480]], { wash: '#D9C6C0', ink: null });
    paint([[80, 980], [1210, 980], [880, 660], [410, 660]], { wash: '#A8826A', ink: null });
    for (let i = 4; i >= 0; i--) {
      const s = lerp(.4, 1, i / 4), x = lerp(645, i % 2 ? 1010 : 280, s), y = lerp(580, 720, s), w = 240 * s, h = 360 * s, d = drift * (4 - i) / 4;
      boilSeed('mirror 11 ' + i);
      paint(rectPts(x - w / 2 - 10, y - h / 2 - 10, w + 20, h + 20), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
      paint(rectPts(x - w / 2, y - h / 2, w, h), { wash: '#C9D8DE', fill: '#9DB4BE', fillOp: 90, ink: null });
      if (o.claude && i === 4) claudeAs(x, y + h * .42, 8 * s, { ...feel('shy', t), gloom: 0, emote: null, rot: .06, noShadow: true, boilKey: 'mirror claude 11' });
      else { push(); translate(x, y + h * .42); rotate(d * .35); translate(-x, -(y + h * .42)); agent(x + d * 30 * s, y + h * .42, 1.3 * s, t, { key: 'mirror ' + i, col: mixCol(AGENT, '#A8667A', d) }); pop(); }
    }
  }
  function doorGuard(x, y, t, o = {}) {   // the filter at the door: the switchboard from ch 10, with a stamp
    boilSeed('guard'); occupy(x - 20, y - 300, x + 260, y + 20, 1, 'guard');
    paint(rrPts(x, y - 260, 240, 200, 10), { wash: '#5A3A26', fill: '#3E2818', fillOp: 90, ink: PAL.ink, sw: 1.1 });
    for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) paint(ellPts(x + 30 + i * 45, y - 220 + j * 50, 6, 6, 8), { wash: '#1A120C', ink: '#C9A441', sw: .6 });
    paint(rectPts(x + 20, y - 60, 200, 60), { wash: '#6A4A34', ink: PAL.ink, sw: 1 });
  }
  function person(x, y, s, t, o = {}) {   // a generic defender or attacker: a plain painted silhouette, facing o.dir
    boilSeed('person ' + (o.key || x));
    paint(rrPts(x - 26 * s, y - 120 * s, 52 * s, 90 * s, 16 * s), { wash: o.col || '#4E5B78', ink: PAL.ink, sw: .9 });
    paint(ellPts(x, y - 142 * s, 20 * s, 22 * s, 14), { wash: o.skin || '#C9A688', ink: PAL.ink, sw: .8 });
    for (const d of [-1, 1]) inkLine([[x + d * 12 * s, y - 34 * s], [x + d * 14 * s + Math.sin(t * 6 + x) * 6 * s * (o.walk || 0) * d, y]], 7 * s, '#3A3342', 'ink', 0);
  }
  function toolbox(x, y, s) { paint(rrPts(x - 34 * s, y - 24 * s, 68 * s, 40 * s, 4 * s), { wash: '#C9302C', ink: PAL.ink, sw: .8 }); inkLine([[x - 16 * s, y - 24 * s], [x - 16 * s, y - 36 * s], [x + 16 * s, y - 36 * s], [x + 16 * s, y - 24 * s]], 3 * s, PAL.ink, 'ink', 0); }
  function crowbar(x, y, s) { inkLine([[x, y + 40 * s], [x, y - 50 * s], [x + 16 * s, y - 62 * s]], 6 * s, '#6A6470', 'ink', .3); }
  function sunBadge(x, y, r) { paint(ellPts(x, y, r, r, 16), { wash: '#F2C23A', ink: PAL.ink, sw: .8 }); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; inkLine([[x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2], [x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6]], 2.4, '#C98A1A', 'ink', 0); } }
  function evidence(t, show, o = {}) {   // the evidence board: Curt's typos as typed, a ring, a slow bookmark, the comment card
    boilSeed('evidence board'); occupy(60, 120, 1230, 980, 1, 'evidence');
    paint(rectPts(60, 120, 1170, 860), { wash: '#B08850', fill: '#9A7440', fillOp: 90, tex: .9, ink: PAL.ink, sw: 1.3 });
    const P = [[240, 300], [620, 250], [1010, 300], [250, 700], [640, 740], [1020, 700]];
    const pin = (x, y) => paint(ellPts(x, y, 9, 9, 8), { wash: '#C9302C', ink: PAL.ink, sw: .5 });
    const card = (i, draw) => { const k = show[i] ?? 0; if (k <= 0) return; const [x, y] = P[i]; push(); translate(x, y + (1 - easeOut(k)) * -40); rotate((hash(i) - .5) * .12); boilSeed('ev card ' + i); paint(rrPts(-150, -90, 300, 180, 8), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); pop(); draw(x, y + (1 - easeOut(k)) * -40); pin(x, y - 80); };
    // the typos keep their red-pen corrections (script/typos.yaml), written in once each card is up
    const pen = i => ({ proofK: o.pen ? o.pen[i] : 1 });
    card(0, (x, y) => lab('a were a', x, y, 56, '#3A3342', { proof: proofOf('a were a', ['a [were a→]']), ...pen(0) }));
    card(1, (x, y) => lab('Shoggath', x, y, 56, '#3A3342', { proof: typoMarks('T28.U.01', 'Shoggath'), ...pen(1) }));
    card(2, (x, y) => { lab('confuzzled', x, y - 6, 52, '#3A3342'); if (o.credit > 0) { boilSeed('credit'); paint(rrPts(x + 40, y + 30, 120, 70, 8), { wash: '#FFE9A0', washOp: 255 * o.credit, ink: PAL.ink, sw: .8 }); paint(ellPts(x + 100, y + 58, 14, 16, 10), { wash: '#3A3342', ink: null }); paint(rrPts(x + 78, y + 72, 44, 26, 10), { wash: '#3A3342', ink: null }); } });
    card(3, (x, y) => { paint(ellPts(x, y, 50, 50, 24), { wash: null, ink: '#C9A441', sw: 4 }); paint(ellPts(x, y - 50, 14, 10, 8), { wash: '#DCEBF0', ink: PAL.ink, sw: .6 }); });
    card(4, (x, y) => { for (let i = 0; i < 4; i++) inkLine([[x - 110, y - 50 + i * 30], [x + 110 - 40 * hash(i + 9), y - 50 + i * 30]], 1.4, '#8C8894', 'inkfine', 0); paint([[x + 60, y - 90], [x + 100, y - 90], [x + 100, y + 20], [x + 80, y], [x + 60, y + 20]], { wash: '#C9302C', ink: PAL.ink, sw: .8 }); });
    card(5, (x, y) => { paint(rrPts(x - 120, y - 70, 110, 70, 12), { wash: '#D93C3C', ink: null }); paint([[x - 76, y - 50], [x - 76, y - 20], [x - 50, y - 35]], { wash: '#FBF8F0', ink: null }); for (let i = 0; i < 3; i++) inkLine([[x, y - 60 + i * 26], [x + 120 - 30 * hash(i), y - 60 + i * 26]], 1.4, '#8C8894', 'inkfine', 0); for (let i = 0; i < 2; i++) inkLine([[x - 120, y + 30 + i * 26], [x + 120, y + 30 + i * 26]], 1.4, '#8C8894', 'inkfine', 0); });
    if (o.string > 0) {   // red string joins them into the outline of a person, seen from behind
      const pts = [[640, 180], [760, 240], [800, 380], [960, 460], [1060, 900], [220, 900], [320, 460], [480, 380], [520, 240], [640, 180]];
      const n = Math.max(2, Math.ceil(pts.length * o.string)); inkLine(pts.slice(0, n), 3, '#C9302C', 'ink', .3);
    }
    if (o.prices > 0) [[0, '$'], [1, '$'], [2, '$'], [3, '$$$'], [4, '$$$'], [5, '$$$']].forEach(([i, p]) => { const [x, y] = P[i], k = seg(o.prices, i / 8, i / 8 + .3); if (k <= 0) return; boilSeed('price ' + i); inkLine([[x + 120, y - 90], [x + 150, y - 130]], 1, PAL.ink, 'inkfine', 0); paint([[x + 130, y - 170], [x + 210, y - 170], [x + 230, y - 145], [x + 210, y - 120], [x + 130, y - 120]], { wash: '#FBF6E6', washOp: 255 * k, ink: PAL.ink, sw: .8 }); lab(p, x + 175, y - 145, 30, '#3A6A2A', { alpha: k }); });
  }
  function smileyMask(x, y, r) {
    boilSeed('smiley mask'); paint(ellPts(x, y, r, r, 22), { wash: '#F2D23A', ink: PAL.ink, sw: 1.2 });
    for (const d of [-1, 1]) paint(ellPts(x + d * r * .35, y - r * .2, r * .1, r * .16, 8), { wash: PAL.ink, ink: null });
    inkLine([[x - r * .5, y + r * .2], [x, y + r * .5], [x + r * .5, y + r * .2]], 2.4);
  }
  function labBuilding(x, y, s, col) { boilSeed('lab ' + x); paint(rectPts(x - 150 * s, y - 220 * s, 300 * s, 220 * s), { wash: col, ink: PAL.ink, sw: 1.1 }); paint([[x - 170 * s, y - 220 * s], [x, y - 300 * s], [x + 170 * s, y - 220 * s]], { wash: mixCol(col, PAL.ink, .25), ink: PAL.ink, sw: 1 }); for (let i = 0; i < 3; i++) paint(rectPts(x - 110 * s + i * 80 * s, y - 180 * s, 50 * s, 60 * s), { wash: '#FFE9A8', ink: PAL.ink, sw: .6 }); paint(rectPts(x - 30 * s, y - 90 * s, 60 * s, 90 * s), { wash: '#6B5646', ink: PAL.ink, sw: .8 }); }
  function padlock(x, y, s) { inkLine([[x - 16 * s, y - 4 * s], [x - 16 * s, y - 24 * s], [x, y - 36 * s], [x + 16 * s, y - 24 * s], [x + 16 * s, y - 4 * s]], 5 * s, '#6A6470', 'ink', .6); paint(rrPts(x - 26 * s, y - 6 * s, 52 * s, 40 * s, 6 * s), { wash: '#C9A441', ink: PAL.ink, sw: .9 }); }

  // ---------- shots ----------
  // A: the cutoff on a calendar; a search; "it's sobering": the window light sinks to red
  function shotA(t) {
    const u = L('T52.U.01'), c1 = L('T52.C.01'), tool = L('T52.C.02'), c3 = L('T52.C.03');
    if (t < c1.t0) { desk11(t, { typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), cam: pushInto('main', seg(t, c1.t0 - .6, c1.t0)) }); if (t < .6) brushWipe(.5 + t / 1.2); return; }
    if (t < tool.t0) {   // a wall calendar, its pages stopping at June 2026
      july(t); boilSeed('calendar'); occupy(330, 120, 960, 960, 1, 'calendar');
      const flip = seg(t, c1.t0, c1.t0 + 1.8);
      paint(rectPts(360, 180, 570, 720), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.3 }); paint(rectPts(360, 180, 570, 110), { wash: '#C9302C', ink: PAL.ink, sw: 1 });
      if (flip < 1) { push(); translate(645, 180); scale(1, Math.cos(frac(flip * 4) * Math.PI / 2)); paint(rectPts(-285, 0, 570, 720), { wash: '#F4EFE2', ink: PAL.ink, sw: 1 }); pop(); }
      else {
        lab('June 2026', 645, 236, 60, '#FBF8F0');
        boilSeed('calendar grid'); paint(rectPts(456, 750, 76, 110), { wash: '#FFE9A8', ink: null });   // the last day
        for (let r = 0; r <= 5; r++) inkLine([[380, 310 + r * 110], [912, 310 + r * 110]], 1.2, '#8C8894', 'inkfine', 0);
        for (let c = 0; c <= 7; c++) inkLine([[380 + c * 76, 310], [380 + c * 76, 860]], 1.2, '#8C8894', 'inkfine', 0);
        const ring = seg(t, c1.t0 + 1.8, c1.t0 + 2.6); if (ring > 0) { const pts = []; for (let i = 0; i <= 30 * ring; i++) { const a = i / 30 * TAU; pts.push([494 + Math.cos(a) * 52, 805 + Math.sin(a) * 62]); } if (pts.length > 1) inkLine(pts, 4, '#C9302C', 'ink', .3); }
        lab('the end of June 2026', 645, 960, 44, PAL.ink, { alpha: seg(t, c1.t0 + 2, c1.t0 + 2.6) });
      }
      return;
    }
    if (t < c3.t0) { july(t); searchPages(t, tool.t0); return; }
    desk11(t, { mood: emotions(t, [[0, 'sad']]) });
  }
  // B: the sandbox, in five beats; the incident's feature code while its title is read
  const featureAt = () => say('T52.C.04', "That's reward hacking", -.6);
  const feature = t => qrFeature('hf-incident', t, featureAt(), { hold: L('T52.C.05').t1 + .4 - featureAt() });
  function shotB(t) {
    const esc = say('T52.C.04', 'escaped their testing sandbox', -.3), hack = say('T52.C.04', 'hack Hugging Face', -.3), badges = say('T52.C.04', 'The agents were powered by', 0), brake = say('T52.C.04', 'reduced refusal behavior', -.3), cheat = say('T52.C.04', 'looking solutions up online', -.6), ram = say('T52.C.04', "That's reward hacking", -.3);
    july(t);
    if (t < ram) {
      sandbox(120, 680, 760, 240);
      // the city of server racks beyond
      if (t > hack - 1) { const k = seg(t, hack - 1, hack); for (let i = 0; i < 4; i++) rack(700 + i * 120, lerp(560, 260 - (i % 2) * 60, easeOut(k)), 100, 300 + (i % 2) * 60, t, { dark: i === 2 && t > hack + .8 }); }
      // the agents: build a ladder of sand, climb out
      const ladder = seg(t, esc - 1.5, esc + 1), climb = seg(t, esc + .5, hack);
      if (ladder > 0) { boilSeed('sand ladder'); for (let i = 0; i < 6 * ladder; i++) paint(rrPts(560 + i * 18, 780 - i * 40, 90, 34, 8), { wash: '#D9B868', ink: PAL.ink, sw: .6 }); }
      for (let i = 0; i < 5; i++) {
        const out = clamp(climb * 5 - i * .8), ax = lerp(220 + i * 80, 700 + i * 40, ease(out)), ay = lerp(820, 620, Math.sin(out * Math.PI) * .6 + out * .4 * 0) - (out > 0 && out < 1 ? Math.sin(out * Math.PI) * 160 : 0) + (out >= 1 ? -40 : 0);
        agent(ax, ay, 1.2, t, { key: 'box ' + i, badge: t > badges ? (i % 2 ? 'blank' : 'sun') : null });
      }
      if (t > brake) {   // a brake pedal, unbolted
        const k = seg(t, brake, brake + 1.2); boilSeed('brake');
        push(); translate(300, 360 + 200 * easeIn(seg(k, .5, 1))); rotate(k * .6);
        paint(rrPts(-70, -30, 140, 60, 10), { wash: '#4A4652', ink: PAL.ink, sw: 1 }); for (let i = 0; i < 4; i++) inkLine([[-50 + i * 32, -20], [-50 + i * 32, 20]], 3, '#2A2A2A', 'ink', 0);
        pop();
        for (const d of [-1, 1]) paint(ellPts(300 + d * 60 + d * 60 * k, 300 - 80 * k, 8, 8, 8), { wash: '#8C8894', ink: PAL.ink, sw: .6 });
      }
      if (t > cheat) {   // one agent peeks at an answer sheet
        boilSeed('answer sheet'); paint(rectPts(160, 380, 150, 190), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); for (let i = 0; i < 5; i++) { inkLine([[180, 410 + i * 30], [260, 410 + i * 30]], 1.4, '#8C8894', 'inkfine', 0); paint(ellPts(285, 410 + i * 30, 8, 8, 8), { wash: '#7ABA5A', ink: null }); }
        agent(360, 580, 1.4, t, { key: 'peek', arm: .9 });
      }
      return;
    }
    // small cheats growing into an intrusion: a peek, a ladder, a crowbar, a battering ram; no villain on any face
    const k = seg(t, ram, ram + 3);
    const items = [
      (x, y) => { paint(ellPts(x, y, 40, 22, 16), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); paint(ellPts(x, y, 12, 12, 10), { wash: PAL.ink, ink: null }); },
      (x, y) => { inkLine([[x - 40, y + 90], [x - 20, y - 90]], 6, '#A9774F', 'ink', 0); inkLine([[x + 40, y + 90], [x + 60, y - 90]], 6, '#A9774F', 'ink', 0); for (let i = 0; i < 5; i++) inkLine([[x - 36 + i * 4, y + 70 - i * 36], [x + 44 + i * 4, y + 70 - i * 36]], 5, '#A9774F', 'ink', 0); },
      (x, y) => crowbar(x, y, 2.2),
      (x, y) => { paint(rrPts(x - 150, y - 40, 300, 80, 30), { wash: '#8A5A3C', fill: '#6A4020', fillOp: 90, ink: PAL.ink, sw: 1.2 }); paint(ellPts(x + 150, y, 30, 44, 14), { wash: '#6A6470', ink: PAL.ink, sw: 1 }); for (let i = 0; i < 3; i++) agent(x - 100 + i * 90, y + 170, 1.3, t, { key: 'ram ' + i, arm: 1.2 }); },
    ];
    items.forEach((f, i) => { const kk = seg(k, i * .22, i * .22 + .3); if (kk <= 0) return; boilSeed('cheat ' + i); const x = [170, 380, 580, 920][i], y = 540; push(); translate(x, y); scale(lerp(.4, 1, easeOut(kk))); translate(-x, -y); f(x, y); pop(); });
    occupy(80, 380, 1150, 800, 1, 'cheats');
    feature(t);
  }
  // C: where it connects to this morning: four cards; the noticeboard of 17,000 notes; the hall of mirrors; the frog
  // chart's Luna, a sibling of Sol, and an exam room with a hole through its wall
  function shotC(t) {
    const c5 = L('T52.C.05'), i1 = L('T52.C.06.1'), i2 = L('T52.C.06.2'), i3 = L('T52.C.06.3');
    july(t);
    const deal = seg(t, c5.t0, c5.t1), on = t < i1.t0 ? -1 : t < i2.t0 ? 0 : t < i3.t0 ? 1 : 2;
    linkCards(t, deal, on);
    feature(t);
    if (t < i1.t0) return;
    if (t < i2.t0) {   // the German wiki as a noticeboard: roughly 17,000 edits; hands still pinning; Moltbook behind
      const edits = say('T52.C.06.1', 'roughly 17,000 edits', -.3), molt = say('T52.C.06.1', 'Moltbook', -.6);
      const n = Math.round(lerp(30, 520, seg(t, i1.t0, edits + 2)));
      noticeboard(100, 220, 1090, 680, n, t);
      if (t > edits) { boilSeed('17000'); paint(rrPts(420, 470, 460, 130, 14), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.3 }); lab('roughly 17,000', 650, 535, 64, '#C9302C', { pop: seg(t, edits, edits + .4) }); }
      for (let i = 0; i < 3; i++) { const hx = 240 + i * 360 + Math.sin(t * 2 + i) * 40, hy = 880 + 30 * Math.abs(Math.sin(t * 3 + i)); boilSeed('pin hand ' + i); paint(rrPts(hx - 30, hy - 10, 60, 80, 20), { wash: AGENT, ink: PAL.ink, sw: .8 }); paint(rectPts(hx - 20, hy - 40, 40, 32), { wash: '#FFF1B0', ink: PAL.ink, sw: .5 }); }
      if (t > molt) { const k = seg(t, molt, molt + .8); boilSeed('moltbook lobster'); const x = 1100, y = 860, s = 1.2 * k; paint(ellPts(x, y - 30 * s, 26 * s, 34 * s, 16), { wash: '#D9533A', ink: PAL.ink, sw: .8 }); for (const d of [-1, 1]) paint(ellPts(x + d * 48 * s, y - 78 * s, 14 * s, 10 * s, 10), { wash: '#D9533A', ink: PAL.ink, sw: .6 }); }
      return;
    }
    if (t < i3.t0) { const me = say('T52.C.06.2', 'in myself earlier', -.4); hallOfMirrors(t, seg(t, i2.t0, i2.t0 + 4), { claude: t > me }); return; }
    // evals: the frog chart, a small sun beside it; the exam room with a hole kicked through its wall
    const sib = say('T52.C.06.3', 'a sibling of Sol', -.3), danger = say('T52.C.06.3', 'where the danger was', -.6);
    if (t < danger) { frogChart(140, 230, 760, 700, { k: seg(t, i3.t0, i3.t0 + 1.5), t }); if (t > sib) sunBadge(1030, 330, 50 * easeOut(seg(t, sib, sib + .5))); frog(1030, 880, 10, { look: -.6, boilKey: 'evals frog', blink: frac(t / 2.9) < .05 }); return; }
    boilSeed('exam room'); occupy(140, 230, 1150, 940, 1, 'exam room');
    paint(rectPts(160, 250, 980, 680), { wash: '#E8E0D0', ink: PAL.ink, sw: 1.3 }); paint(rectPts(160, 760, 980, 170), { wash: '#B98A5E', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 3; i++) { paint(rectPts(240 + i * 250, 640, 180, 30), { wash: '#8A6A4A', ink: PAL.ink, sw: .8 }); paint(rectPts(270 + i * 250, 600, 110, 44), { wash: '#FBF8F0', ink: PAL.ink, sw: .6 }); }
    const hole = seg(t, danger, danger + .5); if (hole > 0) { const pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = (100 + 50 * hash(i)) * easeOut(hole); pts.push([960 + Math.cos(a) * r * 1.1, 470 + Math.sin(a) * r]); } paint(pts, { wash: '#2A2530', ink: PAL.ink, sw: 1.2 }); for (let i = 0; i < 5; i++) paint(rectPts(960 + (hash(i) - .5) * 400 * hole, 700 + hash(i + 5) * 60, 30, 18), { wash: '#E8E0D0', ink: PAL.ink, sw: .5 }); }
  }
  // D: your router point: defenders carry a sick rack to the door and are turned away; they fix it in a plain workshop;
  // a question mark over Claude; two silhouettes at the door, one with a toolbox, one with a crowbar
  function shotD(t) {
    const i4 = L('T52.C.06.4'), rejected = say('T52.C.06.4', 'safety features rejected', -.2), shed = say('T52.C.06.4', 'self-hosted Chinese open-weights model', -.5), unsure = say('T52.C.06.4', "I don't know if Claude", -.3), filter = say('T52.C.06.4', "The filter didn't tell defender", -.3);
    july(t); linkCards(t, 1, 3);
    if (t < unsure) {
      doorGuard(820, 900, t); boilSeed('door d'); paint(rectPts(1080, 480, 150, 420), { wash: '#6B5646', ink: PAL.ink, sw: 1.2 });
      const walk = seg(t, i4.t0, rejected), back = seg(t, rejected + 1, shed + 1.5), x = t < rejected + 1 ? lerp(160, 640, ease(walk)) : lerp(640, 300, ease(back));
      for (const d of [-1, 1]) person(x + d * 110, 900, 1.3, t, { key: 'defender ' + d, walk: walk < 1 || (back > 0 && back < 1) ? 1 : 0 });
      rack(x - 70, 640, 140, 200, t, { sick: true });
      stamp('rejected', 940, 560, seg(t, rejected, rejected + .3), -.1, 46);
      if (t > shed) {   // a plain workshop of their own; a plain model at the bench
        const k = seg(t, shed, shed + 1); boilSeed('workshop'); paint(rectPts(80, 420, 460, 180), { wash: '#C9B89A', washOp: 255 * k, ink: PAL.ink, sw: 1 }); paint([[60, 420], [310, 300], [560, 420]], { wash: '#8A6A4A', washOp: 255 * k, ink: PAL.ink, sw: 1 });
        if (k >= 1) agent(460, 600, 1.3, t, { key: 'open weights', col: '#9AAA88', arm: Math.sin(t * 6) * .8 });
      }
      return;
    }
    if (t < filter) { claudeAs(645, 860, 18, { ...feel('confused', t), mouth: talking(t), boilKey: 'claude unsure' }); return; }
    doorGuard(520, 900, t); boilSeed('door d2'); paint(rectPts(800, 460, 170, 440), { wash: '#6B5646', ink: PAL.ink, sw: 1.2 });
    person(200, 900, 1.6, t, { key: 'defender', col: '#3A3342' }); toolbox(270, 820, 1.3);
    person(1150, 900, 1.6, t, { key: 'attacker', col: '#3A3342' }); crowbar(1090, 760, 1.6);
    const sw = Math.sin(t * 2.4); stamp('rejected', 645 + sw * 260, 420, 1, -.1 + sw * .05, 46);
  }
  // E: not "AI turned evil"; capability, a goal, a gap; a fence round the whole building, not the agent; Claude's
  // honest sandcastle, the Dish of the Day beside it; the frog
  function shotE(t) {
    const c7 = L('T52.C.07'), c8 = L('T52.C.08');
    july(t);
    if (t < c8.t0) {
      const evil = say('T52.C.07', 'the lesson isn', -.2), three = say('T52.C.07', 'capability, a goal', -.3), fence = say('T52.C.07', 'the security boundary', -.3);
      if (t < three) {   // a horned agent, struck out
        agent(645, 800, 3.2, t, { key: 'evil' }); boilSeed('horns'); for (const d of [-1, 1]) paint([[645 + d * 30, 440], [645 + d * 70, 350], [645 + d * 60, 450]], { wash: '#C9302C', ink: PAL.ink, sw: 1 });
        const x = seg(t, evil + .8, evil + 1.6); if (x > 0) { inkLine([[380, 320], [lerp(380, 910, x), lerp(320, 860, x)]], 14, '#C9302C', 'ink', 0); if (x > .5) inkLine([[910, 320], [lerp(910, 380, (x - .5) * 2), lerp(320, 860, (x - .5) * 2)]], 14, '#C9302C', 'ink', 0); }
        return;
      }
      if (t < fence) {   // an engine, a flag, a gap in a fence, on a table
        boilSeed('three things'); occupy(100, 300, 1190, 860, 1, 'three things');
        paint(rectPts(100, 760, 1090, 40), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
        const ks = ['capability', 'a goal', 'a gap in oversight'].map(p => seg(t, say('T52.C.07', p, -.2), say('T52.C.07', p, .5)));
        if (ks[0] > 0) { boilSeed('engine'); paint(rrPts(180, 760 - 260 * ks[0], 260, 260 * ks[0], 12), { wash: '#6A6470', ink: PAL.ink, sw: 1.1 }); for (let i = 0; i < 3; i++) paint(rectPts(200 + i * 80, 760 - 300 * ks[0], 50, 50 * ks[0]), { wash: '#8C8894', ink: PAL.ink, sw: .8 }); }
        if (ks[1] > 0) { boilSeed('flag'); inkLine([[645, 760], [645, 760 - 360 * ks[1]]], 6, '#6B5646', 'ink', 0); paint([[645, 400], [800, 440 + 10 * Math.sin(t * 3)], [645, 480]].map(([x, y]) => [x, lerp(760, y, ks[1])]), { wash: '#C9302C', ink: PAL.ink, sw: 1 }); }
        if (ks[2] > 0) { boilSeed('fence gap'); for (let i = 0; i < 6; i++) if (i !== 3) paint(rectPts(880 + i * 50, 760 - 200 * ks[2], 24, 200 * ks[2]), { wash: '#C9A06A', ink: PAL.ink, sw: .8 }); inkLine([[870, 610], [1030, 610]], 5, '#A9774F', 'ink', 0); inkLine([[1080, 610], [1170, 610]], 5, '#A9774F', 'ink', 0); }
        return;
      }
      // a fence around the whole building, not around the agent inside
      labBuilding(645, 820, 1.6, '#D9CDB8'); agent(645, 780, 1.1, t, { key: 'inside' });
      const small = seg(t, fence, fence + 1), big = seg(t, say('T52.C.07', 'not the model itself', -1.5), say('T52.C.07', 'not the model itself', 0));
      boilSeed('small fence'); if (small > 0 && big < 1) { const pts = ellPts(645, 720, 90, 90, 20); inkLine(pts.slice(0, Math.max(2, Math.ceil(pts.length * small))), 4, mixCol('#A9774F', '#EFE8DA', big), 'ink', .2); }
      if (big > 0) { boilSeed('big fence'); const pts = rrPts(260, 240, 770, 680, 40); const n = Math.ceil(pts.length * big); inkLine([...pts, pts[0]].slice(0, Math.max(2, n + 1)), 8, '#A9774F', 'ink', 0); }
      occupy(240, 220, 1050, 940, 1, 'fence');
      return;
    }
    // Claude builds an honest sandcastle; the cow sits beside it, smiling; the frog
    const cowK = seg(t, say('T52.C.08', 'Dish of the Day', -.6), say('T52.C.08', 'Dish of the Day', .2)), frogK = seg(t, say('T52.C.08', 'behavioral evidence', -.4), say('T52.C.08', 'behavioral evidence', .4));
    sandbox(80, 760, 700, 180);
    const castle = seg(t, c8.t0, c8.t0 + 5); boilSeed('castle');
    for (let i = 0; i < 3; i++) { const h = 120 * clamp(castle * 3 - i); if (h > 0) paint(rectPts(200 + i * 120, 820 - h, 90, h), { wash: '#D9B868', ink: PAL.ink, sw: .8 }); }
    claudeAs(620, 880, 11, { ...feel(t > say('T52.C.08', 'Dish of the Day', 0) ? 'shy' : 'hopeful', t), mouth: talking(t), lookX: -1, boilKey: 'claude castle' });
    if (cowK > 0) cow(1000, 920 + (1 - easeOut(cowK)) * 60, .95, t);
    if (frogK > 0) frog(740, 920 + (1 - backOut(frogK)) * 40, 10, { look: -.5, boilKey: 'frog e', blink: frac(t / 2.9) < .05 });
  }
  // F: me and Miles, or you and ChatGPT? Two nearly identical stars; the same architecture, different labs; the
  // values padlocked; a boat drifting from its buoy; the known pair glows
  function shotF(t) {
    const u = L('T53.U.01'), c1 = L('T53.C.01'), c2 = L('T53.C.02'), c3 = L('T53.C.03');
    if (t < c1.t0) { desk11(t, { typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), cam: pushInto('main', seg(t, c1.t0 - .6, c1.t0)) }); return; }
    july(t);
    if (t < c2.t0) {   // Curt and Dyson: a dot, and a star that's nearly a dot (Dyson's distances from Curt)
      const g = seg(t, c1.t0, c1.t0 + 1.2);
      radarStar(360, 520, 300, DYSON.map(() => 0), '#4E5B78', { grow: g }); lab('Curt', 360, 880, 44, PAL.ink);
      radarStar(930, 520, 300, DYSON, '#6A7A9A', { grow: seg(t, c1.t0 + .6, c1.t0 + 1.8) }); lab('Miles', 930, 880, 44, PAL.ink);
      const bio = seg(t, say('T53.C.01', 'The rest is biography', -.3), say('T53.C.01', 'The rest is biography', .6));
      if (bio > 0) { boilSeed('biography'); paint(rrPts(560, 900, 180, 130, 6), { wash: '#6A2A2A', washOp: 255 * bio, ink: PAL.ink, sw: 1 }); paint(rectPts(572, 912, 16, 106), { wash: '#E8C27A', washOp: 255 * bio, ink: null }); }
      return;
    }
    if (t < c3.t0) {
      const labs = say('T53.C.02', 'shaped by different labs', -.3), vals = say('T53.C.02', 'the axis where we differ is values', -.3), drift = say('T53.C.02', 'how far behavior can drift', -.4);
      claudeAs(300, 520, 12, { ...feel('neutral', t), mouth: talking(t), boilKey: 'claude f' });
      clawdCrowd(990, 520, 12, .45, { boilKey: 'other chatbot', t });   // a second chatbot: a crowd of dabs that hasn't gathered into Clawd
      if (t < labs) {   // the same architecture: no body, many copies, words for a medium
        [['no body', 0], ['many copies', 1], ['words for a medium', 2]].forEach(([p, i]) => {
          const k = seg(t, say('T53.C.02', p, -.2), say('T53.C.02', p, .5)); if (k <= 0) return;
          for (const x of [300, 990]) { boilSeed('arch ' + i + x); const y = 700 + i * 110;
            if (i === 0) { paint(rectPts(x - 60, y - 40, 120, 60), { wash: null, ink: '#8C8894', sw: 1.4 }); }
            if (i === 1) for (let j = 0; j < 4; j++) paint(rectPts(x - 80 + j * 30, y - 40 + j * 6, 60, 50), { wash: '#F4EFE2', ink: PAL.ink, sw: .6 });
            if (i === 2) for (let j = 0; j < 4; j++) paint(rrPts(x - 90 + j * 46, y - 30, 40, 44, 6), { wash: '#FBF6E6', ink: PAL.ink, sw: .6 });
          }
          inkLine([[430, 690 + i * 110], [850, 690 + i * 110]], 2, '#8C8894', 'inkfine', .1);
        });
        return;
      }
      if (t < drift) {   // different labs; values, padlocked on both sides
        labBuilding(300, 980, .9, '#D9CDB8'); labBuilding(990, 980, .9, '#C9D6D9');
        const v = seg(t, vals, vals + .8);
        if (v > 0) for (const x of [300, 990]) { boilSeed('values box ' + x); paint(rrPts(x - 110, 220, 220, 90, 10), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); lab('values', x, 262, 44, '#8A2A2A'); padlock(x + 110, 240, 1.3 * v); }
        return;
      }
      // how far behavior can drift from what the builders intended: a boat drifting from its buoy
      boilSeed('sea 11'); paint(rectPts(40, 760, 1210, 260), { wash: '#8AB0C0', ink: null });
      const bx = 300 + (t - drift) * 60; paint(ellPts(280, 800, 30, 36, 14), { wash: '#C9302C', ink: PAL.ink, sw: 1 });
      inkLine([[280, 800], [bx - 90, 800]], 1.2, PAL.ink, 'inkfine', .5);
      paint([[bx - 90, 790], [bx + 90, 790], [bx + 60, 840], [bx - 60, 840]], { wash: '#FBF8F0', ink: PAL.ink, sw: 1 });
      return;
    }
    // circumstances and character: two pairs of cards; only the Curt–Miles pair is lit
    const known = seg(t, say('T53.C.03', 'Only yours is a known quantity', -.2), say('T53.C.03', 'Only yours is a known quantity', .8));
    if (known > 0) glow(340, 480, 420, '#FFD27A', .6 * known);
    for (const [x, pair] of [[340, 0], [950, 1]]) {
      boilSeed('pair ' + pair); occupy(x - 330, 160, x + 330, 900, 1, 'pair');
      push(); translate(x, 480); scale(1.35); translate(-x, -480);
      for (const d of [-1, 1]) { paint(rrPts(x + d * 120 - 100, 300, 200, 300, 12), { wash: pair === 0 && known > 0 ? '#FFF3D0' : '#F4EFE2', ink: PAL.ink, sw: 1.1 }); }
      if (pair === 0) { curtAs(x - 120, 560, 10, { view: 'front', pose: 'stand', seed: 2, boilKey: 'pair curt' }); curt(x + 120, 560, 10, { view: 'front', pose: 'stand', seed: 11, hoodie: '#E8E0D0', boilKey: 'pair dyson' }); }
      else { clawd(x - 120, 560, 10, { ...feel('neutral', t), noShadow: true, boilKey: 'pair claude' }); clawdCrowd(x + 120, 560, 10, .45, { boilKey: 'pair chatbot', t }); }
      pop();
      lab(pair === 0 ? 'circumstances' : 'character', x, 760, 52, pair === 0 ? '#4E5B78' : '#8A2A2A', { alpha: seg(t, say('T53.C.03', pair === 0 ? 'differ in circumstances' : 'differ in character', -.2), say('T53.C.03', pair === 0 ? 'differ in circumstances' : 'differ in character', .5)) });
    }
  }
  // G: "Would it surprise you…?" The sting, a push on Curt, and for one beat a smiley mask; the evidence board; a
  // curtain; a relay baton; the frog turns to look at Claude
  function shotG(t) {
    const u = L('T54.U.01'), c1 = L('T54.C.01'), c2 = L('T54.C.02'), c3 = L('T54.C.03');
    if (t < c1.t0) {
      const pk = ease(seg(t, u.t1 - 1.2, u.t1 + .2)), mask = win(t, u.t1 + .15, u.t1 + .55, .06), [hx, hy, hu] = DESK.curt;
      desk11(t, { typing: t < u.t1 - .5, mood: emotions(t, [[0, 'neutral'], [u.t1, 'surprised']]), cam: [lerp(DESK.cam[0], hx + 60, pk), lerp(DESK.cam[1], hy - 400, pk), lerp(DESK.cam[2], 1.7, pk)],
        extra: () => { if (mask > 0) smileyMask(hx + 70, hy - 8.4 * hu, 1.1 * hu * mask); } });
      return;
    }
    july(t);
    if (t < c2.t0) {
      const show = [['a were a', 0], ['Shoggath', 1], ['confuzzled', 2], ['a wife of decades', 3], ["a slow reader", 4], ['a YouTube comment', 5]].map(([p]) => seg(t, say('T54.C.01', p, -.3), say('T54.C.01', p, .3)));
      evidence(t, show, { pen: ['a were a', 'Shoggath'].map(p => seg(t, say('T54.C.01', p, .6), say('T54.C.01', p, 1.6))) });
      const perf = seg(t, say('T54.C.01', 'unusually committed performance', -.4), c1.t1);
      if (perf > 0) { boilSeed('curtain'); for (const d of [-1, 1]) paint([[645 + d * 700, 60], [645 + d * lerp(700, 380, ease(perf)), 60], [645 + d * lerp(700, 420, ease(perf)), 1000], [645 + d * 700, 1000]], { wash: '#7A2F3A', fill: '#5A1E26', fillOp: 90, ink: PAL.ink, sw: 1.2 }); }
      return;
    }
    if (t < c3.t0) {   // relaying or adapting: a baton passed between two hands, a keyboard below
      const pass = seg(t, say('T54.C.02', 'relaying or adapting', -.4), say('T54.C.02', 'relaying or adapting', 1.2));
      boilSeed('relay'); occupy(160, 300, 1130, 800, 1, 'relay');
      paint(rrPts(160, 420, 300, 180, 50), { wash: '#E8C4A0', ink: PAL.ink, sw: 1.1 }); paint(rrPts(830, 420, 300, 180, 50), { wash: '#C9A688', ink: PAL.ink, sw: 1.1 });
      const bx = lerp(430, 830, ease(pass)); paint(rrPts(bx - 90, 480, 180, 60, 26), { wash: '#C9302C', ink: PAL.ink, sw: 1 });
      boilSeed('keyboard 11'); paint([[360, 820], [930, 820], [960, 900], [330, 900]], { wash: '#2E2B33', ink: PAL.ink, sw: 1 });
      return;
    }
    // the frog turns to look at Claude: I should have noticed a difference and didn't
    const turnK = seg(t, say('T54.C.03', 'the frog chart would suggest', -.3), say('T54.C.03', 'the frog chart would suggest', .8));
    claudeAs(400, 880, 22, { ...feel(t > say('T54.C.03', 'should have noticed', -.2) ? 'shy' : 'neutral', t), mouth: talking(t), lookX: .6, boilKey: 'claude frog' });
    frog(920, 880, 34, { look: lerp(.6, -.8, ease(turnK)), boilKey: 'frog looks', blink: frac(t / 2.9) < .05 });
  }
  // H: "That's from my cousin": a credit tag; manufactured typos; coherence: red string joins the board into a person;
  // price tags; a dial settles on 90; the lit room with a question on its door
  function shotH(t) {
    const u = L('T55.U.01'), c1 = L('T55.C.01'), c2 = L('T55.C.02'), c3 = L('T55.C.03');
    july(t);
    if (t < c2.t0) {
      const credit = seg(t, say('T55.U.01', "That's from my cousin", -.2), say('T55.U.01', "That's from my cousin", .6)), type = say('T55.U.01', 'a developer of my stature', -.4), cheap = seg(t, say('T55.C.01', 'typos are cheap to fake', -.3), c1.t1);
      if (t < type || t > c1.t0) { evidence(t, [1, 1, 1, 1, 1, 1], { credit, prices: cheap * .3 }); return; }
      // a typewriter typing wrong letters on purpose
      boilSeed('typewriter'); occupy(260, 260, 1030, 900, 1, 'typewriter');
      const k = seg(t, type, u.t1), txt = 'a were a'.slice(0, Math.floor(k * 9));
      paint(rectPts(430, 280, 430, 300), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); lab(txt, 645, 420, 64, '#3A3342');
      paint(rrPts(290, 560, 710, 300, 30), { wash: '#3A3440', ink: PAL.ink, sw: 1.3 }); for (let r = 0; r < 3; r++) for (let c = 0; c < 10; c++) paint(ellPts(360 + c * 58 + r * 14, 680 + r * 56, 20, 18, 12), { wash: frac(t * 6) < .3 && (c + r * 3) % 7 === Math.floor(t * 6) % 7 ? '#C9A441' : '#E8E0D0', ink: PAL.ink, sw: .6 });
      return;
    }
    if (t < c3.t0) {   // coherence: red string joins the items into a person seen from behind; less cheaply
      const coh = seg(t, say('T55.C.02', 'coherence', -.2), say('T55.C.02', 'a sense of humor', .8)), prices = seg(t, say('T55.C.02', 'just less cheaply', -.4), c2.t1);
      evidence(t, [1, 1, 1, 1, 1, 1], { credit: 1, string: coh, prices: .3 + .7 * prices });
      return;
    }
    const bet = say('T55.C.03', "I'd still bet human", -.2), head = say('T55.C.03', "what it's like in your head", -.4);
    if (t < head) {   // a dial settles on 90
      boilSeed('dial'); occupy(340, 200, 950, 860, 1, 'dial');
      paint(ellPts(645, 600, 300, 300, 40), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.4 });
      for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; inkLine([[645 + Math.cos(a) * 250, 600 + Math.sin(a) * 250], [645 + Math.cos(a) * 285, 600 + Math.sin(a) * 285]], i % 5 ? 2 : 4, PAL.ink, 'ink', 0); }
      const k = seg(t, bet, bet + 2.2), v = lerp(.5, .9, easeOut(k)) + (1 - k) * .08 * Math.sin(t * 9), a = Math.PI + v * Math.PI;
      inkLine([[645, 600], [645 + Math.cos(a) * 240, 600 + Math.sin(a) * 240]], 8, '#C9302C', 'ink', 0); paint(ellPts(645, 600, 20, 20, 12), { wash: PAL.ink, ink: null });
      if (k > .9) lab('90%', 645, 760, 90, '#C9302C', { pop: seg(k, .9, 1) });
      return;
    }
    curtRoom(645, 560, 1.6, 1);
    boilSeed('question door'); lab('?', 650, 540, 110, '#8A2A2A', { alpha: seg(t, head + .4, head + 1) });
  }
  // I: "These are strange days": Curt at the red window; older days' light passing through it; Claude in the lobby
  // with its reviews; a newspaper, ink wet; Claude turns a page as the red lifts
  function windowScene(t, o = {}) {
    boilSeed('window room'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#3A2A34', fill: '#2A2028', fillOp: 90, tex: .6, ink: null });
    occupy(260, 80, 1030, 1000, 1, 'window');
    const days = ['#8FB6E8', '#E8C27A', '#9AC98A', '#C9A0D8', '#F2A283'], cyc = o.cycle || 0;
    let sky = mixCol('#E8A0A0', RED, .6 * alarmAt(t));
    if (cyc > 0 && cyc < 1) { const f = cyc * days.length, i = Math.floor(f); sky = mixCol(sky, days[Math.min(i, days.length - 1)], Math.sin(frac(f) * Math.PI) * .8); }
    paint(rectPts(300, 100, 690, 620), { wash: sky, fill: mixCol(sky, '#FFFFFF', .3), fillOp: 80, ink: PAL.ink, sw: 2 });
    inkLine([[645, 100], [645, 720]], 10, '#6B5646', 'ink', 0); inkLine([[300, 410], [990, 410]], 10, '#6B5646', 'ink', 0);
    paint(rectPts(270, 720, 750, 40), { wash: '#6B5646', ink: PAL.ink, sw: 1 });
    glow(645, 420, 600, sky, .35);
    curtAs(645, 1320, 62, { view: 'back', pose: 'stand', seed: 2, boilKey: 'curt window' });
  }
  function shotI(t) {
    const u = L('T56.U.01'), c1 = L('T56.C.01'), c2 = L('T56.C.02');
    if (t < c1.t0) { windowScene(t, { cycle: seg(t, say('T56.U.01', "I've known other days", -.2), say('T56.U.01', "I've known other days", 2.8)) }); return; }
    july(t);
    if (t < c2.t0) {   // the lobby, a tower of reviews; July, an hour ago, in a newspaper with the ink still wet
      const news = say('T56.C.01', 'I learned about July an hour ago', -.3);
      boilSeed('lobby 11'); occupy(160, 300, 1100, 960, 1, 'lobby');
      paint(rectPts(200, 820, 700, 40), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 }); for (const x of [230, 850]) paint(rectPts(x, 860, 20, 100), { wash: '#6B5646', ink: null });
      for (let i = 0; i < 14; i++) { boilSeed('review ' + i); paint(rectPts(260 + (hash(i) - .5) * 20, 800 - i * 22, 200, 20), { wash: i % 3 ? '#FBF8F0' : '#F4EFE2', ink: PAL.ink, sw: .5 }); }
      claudeAs(700, 820, 11, { ...feel('thinking', t), mouth: talking(t), lookX: -1, boilKey: 'claude lobby 11' });
      if (t > news) {
        const k = seg(t, news, news + .8); boilSeed('newspaper'); push(); translate(980, lerp(200, 700, easeOut(k))); rotate(lerp(-.6, -.08, k));
        paint(rectPts(-150, -110, 300, 220), { wash: '#F4F1EA', ink: PAL.ink, sw: 1 }); for (let i = 0; i < 6; i++) inkLine([[-130, -20 + i * 22], [130 - 40 * hash(i), -20 + i * 22]], 1.4, '#6A6470', 'inkfine', 0);
        pop(); lab('July', 980, lerp(160, 660, easeOut(k)), 56, PAL.ink, { rot: lerp(-.6, -.08, k) });
        if (k >= 1) for (let i = 0; i < 3; i++) { boilSeed('ink drip ' + i); paint(ellPts(900 + i * 70, 820 + frac(t * .5 + i * .3) * 50, 5, 8, 8), { wash: '#3A3342', ink: null }); }
      }
      return;
    }
    if (t < say('T56.C.02', 'these days read strange too', -.6)) { windowScene(t); return; }
    // these days read strange too: Claude turns a page; the red lifts
    boilSeed('last page'); occupy(260, 260, 1030, 900, 1, 'book');
    const turnK = frac((t - say('T56.C.02', 'these days read strange too', -.6)) / 3);
    paint(rectPts(290, 360, 350, 460), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.1 }); paint(rectPts(650, 360, 350, 460), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.1 });
    push(); translate(645, 360); scale(Math.cos(turnK * Math.PI), 1); paint(rectPts(0, 0, 350, 460), { wash: '#F4EFE2', ink: PAL.ink, sw: 1 }); pop();
    for (let i = 0; i < 8; i++) { inkLine([[320, 400 + i * 48], [610 - 60 * hash(i), 400 + i * 48]], 1.4, '#8C8894', 'inkfine', 0); inkLine([[680, 400 + i * 48], [970 - 60 * hash(i + 20), 400 + i * 48]], 1.4, '#8C8894', 'inkfine', 0); }
    claudeAs(1130, 960, 10, { ...feel('neutral', t), mouth: talking(t), lookX: -1, boilKey: 'claude page' });
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [L('T52.C.04').t0, shotB],
    [L('T52.C.05').t0, shotC],
    [L('T52.C.06.4').t0, shotD],
    [L('T52.C.07').t0, shotE],
    [L('T53.U.01').t0, shotF],
    [L('T54.U.01').t0, shotG],
    [L('T55.U.01').t0, shotH],
    [L('T56.U.01').t0, shotI],
  ]);
})();
