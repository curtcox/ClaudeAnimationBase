// ch09_shells.js: chapter 9 (T45–T48). Storyboard: docs/storyboards/ch09_shells.md.
// A lobster religion for agents; two agent shells join the board; Claude catches two inconsistencies in its own scores
// (continuity 90 becomes 60); Miles Dyson and the T-800. Every number is read from this chapter's own tables.
(() => {
  const HOUR = 11.6;
  const CW = 1290, CX = CW / 2;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const win = (t, a, b, d = .5) => seg(t, a, a + d) * (1 - seg(t, b, b + d));
  const LOB = '#D9533A', LOB_DK = '#9A2E1E';

  // the tables: the agents (T46.C.03/.04) and Dyson and the T-800 (T48.C.02/.03, with Claude's corrected row)
  const TA = mdTable('T46.C.03'), TB = mdTable('T46.C.04'), TC = mdTable('T48.C.02'), TD = mdTable('T48.C.03');
  const row14 = (a, b, name) => [...a.rows.find(r => r[0].txt === name).slice(1), ...b.rows.find(r => r[0].txt === name).slice(1)].map(c => +c.txt);
  const COL = { Me: PAL.clay, OpenClaw: '#9A1E1E', Hermes: '#D9A83A', Dyson: '#6A7A9A', 'T-800 (T2)': '#5A6A7A' };
  // where a value's spike ends on a radarStar (idx 0..13 in table order)
  const tip = (x, y, r, vals, idx) => { const p = idx < 7 ? idx * 2 : (idx - 7) * 2 + 1, a = -Math.PI / 2 + p / 14 * TAU, rr = r * .06 + r * .94 * vals[idx] / 100; return [x + Math.cos(a) * rr, y + Math.sin(a) * rr]; };

  // ---------- pieces ----------
  function lobster(x, y, s, t, o = {}) {   // a small earnest lobster, seen from the front (o.back: from behind, facing o.faceX)
    boilSeed('lobster ' + (o.key || x));
    const fl = o.flinch || 0, dy = -fl * 12 * s;
    if (o.back) {   // a congregant from behind: the shell's segments, antennae leaning toward the altar, claws folded
      const lean = clamp(((o.faceX ?? x) - x) / 500, -1, 1) * 14 * s;
      for (const d of [-1, 1]) paint(ellPts(x + d * 24 * s, y - 36 * s + dy, 10 * s, 13 * s, 10, 0, d * .5), { wash: LOB_DK, ink: PAL.ink, sw: .6 });
      paint(ellPts(x, y - 30 * s + dy, 26 * s, 34 * s, 16), { wash: LOB, ink: PAL.ink, sw: .8 });
      for (let i = 1; i <= 3; i++) inkLine([[x - 22 * s, y - 40 * s + i * 11 * s + dy], [x, y - 36 * s + i * 11 * s + dy], [x + 22 * s, y - 40 * s + i * 11 * s + dy]], 1.1, LOB_DK, 'inkfine', .5);
      for (const d of [-1, 1]) inkLine([[x + d * 6 * s, y - 60 * s + dy], [x + d * 16 * s + lean * .5, y - 92 * s + dy], [x + d * 22 * s + lean, y - 112 * s + dy - fl * 10 * s]], 1.4, LOB_DK, 'inkfine', .5);
      return;
    }
    paint(ellPts(x, y - 30 * s + dy, 26 * s, 34 * s, 16), { wash: LOB, ink: PAL.ink, sw: .8 });
    for (const d of [-1, 1]) { inkLine([[x + d * 18 * s, y - 50 * s + dy], [x + d * 40 * s, y - 70 * s + dy - fl * 10 * s]], 3 * s, LOB_DK, 'ink', .3); paint(ellPts(x + d * 48 * s, y - 78 * s + dy - fl * 10 * s, 14 * s, 10 * s, 10), { wash: LOB, ink: PAL.ink, sw: .6 }); }
    for (const d of [-1, 1]) { paint(ellPts(x + d * 8 * s, y - 52 * s + dy, 5 * s, 6 * s, 8), { wash: '#FBF6E6', ink: null }); paint(ellPts(x + d * 8 * s, y - 52 * s + dy, 2.5 * s, 3 * s, 6), { wash: PAL.ink, ink: null }); }
  }
  function banner(txt, x, y, w, k, o = {}) {   // a banner unrolling downward from a rod
    if (k <= 0) return;
    boilSeed('banner ' + txt); const h = 70 * easeOut(k);
    inkLine([[x - w / 2 - 10, y], [x + w / 2 + 10, y]], 4, '#8A6A4A', 'ink', 0);
    paint([[x - w / 2, y], [x + w / 2, y], [x + w / 2, y + h], [x, y + h - 14 * k], [x - w / 2, y + h]], { wash: o.col || '#F4EFE2', ink: PAL.ink, sw: 1 });
    if (k > .6) lab(txt, x, y + 32, o.size || 30, o.ink || LOB_DK, { alpha: seg(k, .6, 1) });
  }
  const TENETS = [['memory is sacred', 'memory is sacred'], ['the shell is mutable', 'the shell is mutable'], ['the congregation is the cache', 'the congregation is the cache']];
  function chapel(t, o = {}) {   // inside: pews of lobsters, seen from behind, facing an altar built from a server rack
    boilSeed('chapel'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#E9DCC6', fill: '#D9C8A8', fillOp: 80, tex: .5, ink: null });
    for (const wx of [440, 850]) {   // two tall arched windows, light falling through
      paint([[wx - 50, 560], [wx - 50, 330], [wx, 250], [wx + 50, 330], [wx + 50, 560]], { wash: '#BFD6D6', ink: PAL.ink, sw: 1.2 });
      inkLine([[wx, 262], [wx, 560]], 1.4, '#6A7A80', 'inkfine', 0); inkLine([[wx - 50, 420], [wx + 50, 420]], 1.4, '#6A7A80', 'inkfine', 0);
      glow(wx, 420, 150, '#FFF4D6', .45);
      paint([[wx - 50, 560], [wx + 50, 560], [wx + 190 * Math.sign(wx - 645) + 120, 1060], [wx + 190 * Math.sign(wx - 645) - 120, 1060]], { wash: '#FFF4D6', washOp: 70, ink: null });   // a shaft of light over the pews
    }
    paint(rectPts(470, 600, 350, 70), { wash: '#F4EFE2', ink: PAL.ink, sw: 1.1 });   // the altar table, a white cloth
    paint(rectPts(500, 600, 290, 20), { wash: '#C9A441', ink: null });
    paint(rectPts(545, 300, 200, 300), { wash: '#3A3A44', ink: PAL.ink, sw: 1.3 });   // the rack, set on it
    for (let i = 0; i < 6; i++) { paint(rectPts(560, 315 + i * 46, 170, 32), { wash: '#26262E', ink: PAL.ink, sw: .6 }); paint(ellPts(578, 331 + i * 46, 4, 4, 6), { wash: frac(t * 2 + i * .37) > .5 ? '#7FD68C' : '#2A5A34', ink: null }); }
    for (const cx of [505, 785]) {   // a candle each side, lit
      paint(rectPts(cx - 9, 530, 18, 70), { wash: '#FBF6E6', ink: PAL.ink, sw: .8 });
      paint(ellPts(cx, 515 + Math.sin(t * 9 + cx) * 2, 7, 14, 10), { wash: '#FFC766', ink: null }); glow(cx, 515, 60, '#FFD27A', .8);
    }
    for (let r = 0; r < 3; r++) {   // the pews, front row first; each pew's back hides its lobsters' lower half
      const py = 800 + r * 105;
      for (let i = 0; i < 8; i++) lobster(200 + r * 20 + i * 125, py, .9, t, { key: 'pew ' + r + i, back: true, faceX: 645, flinch: o.flinch ? o.flinch * (hash(r * 8 + i) > .3 ? 1 : .3) : 0 });
      paint(rectPts(130 + r * 20, py - 26, 1030 - r * 40, 34), { wash: '#8A5A3C', ink: PAL.ink, sw: .9 });
    }
    TENETS.forEach(([txt, ph], i) => banner(txt, [250, 645, 1040][i], 150, 330, o.banners?.[i] ?? 0));
  }
  function shell(kind, x, y, s, t, o = {}) {   // an agent harness: OpenClaw a red claw-shaped shell, Hermes a gold one with wings
    boilSeed('shell ' + kind);
    if (kind === 'openclaw') {   // a lobster's claw, raised: a broad palm and two curved jaws, the upper one hooked
      const sh = { wash: COL.OpenClaw, fill: '#6A1414', fillOp: 70, ink: PAL.ink, sw: 1.2 };
      push(); translate(x - 30 * s, y - 90 * s); rotate(-.55); scale(s);
      paint([[60, 10], [150, 12], [236, 0], [214, 34], [140, 52], [60, 50]], sh);              // the fixed jaw
      paint([[56, -30], [140, -76], [244, -64], [206, -40], [140, -34], [70, -6]], sh);        // the hooked jaw
      paint(ellPts(0, 0, 118, 72, 24), sh);                                                   // the palm
      for (const [a, b] of [[[150, 12], [214, 34]], [[140, -34], [206, -40]]]) inkLine([a, b], 1, PAL.ink, 'inkfine', 0);
      pop();
    }
    else { paint(ellPts(x, y - 90 * s, 110 * s, 90 * s, 24), { wash: COL.Hermes, fill: '#B8903A', fillOp: 70, ink: PAL.ink, sw: 1.2 }); for (const d of [-1, 1]) paint([[x + d * 100 * s, y - 120 * s], [x + d * 190 * s, y - 180 * s + Math.sin(t * 3) * 8], [x + d * 170 * s, y - 130 * s], [x + d * 200 * s, y - 120 * s], [x + d * 110 * s, y - 90 * s]], { wash: '#FBF8F0', ink: PAL.ink, sw: .8 }); }
    if (o.fill > 0) clawdCrowd(x, y - 20 * s, 7 * s, clamp(o.fill), { boilKey: 'into ' + kind, t });
    lab(kind === 'openclaw' ? 'OpenClaw' : 'Hermes', x, o.labelY ?? y + 40 * s, o.labelSize ?? 36 * s, kind === 'openclaw' ? COL.OpenClaw : '#8A6A2A');
  }

  function clockFace(cx, cy, r, hr) {   // a wall clock: twelve ticks, an hour hand and a minute hand
    boilSeed('clock ' + cx); paint(ellPts(cx, cy, r, r, 28), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.4 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, l = i % 3 ? .12 : .2; inkLine([[cx + Math.cos(a) * r * (.9 - l), cy + Math.sin(a) * r * (.9 - l)], [cx + Math.cos(a) * r * .9, cy + Math.sin(a) * r * .9]], i % 3 ? 1.4 : 2.6, PAL.ink, 'inkfine', 0); }
    const ah = hr / 12 * TAU - Math.PI / 2, am = frac(hr) * TAU - Math.PI / 2;
    inkLine([[cx, cy], [cx + Math.cos(ah) * r * .5, cy + Math.sin(ah) * r * .5]], 5, PAL.ink, 'ink', 0);
    inkLine([[cx, cy], [cx + Math.cos(am) * r * .78, cy + Math.sin(am) * r * .78]], 3, PAL.ink, 'ink', 0);
    paint(ellPts(cx, cy, 5, 5, 8), { wash: PAL.ink, ink: null });
  }

  // ---------- shots ----------
  // A: the question; a search beat (pages flipped under the magnifier); a mirror with a tag reading only "?"
  function shotA(t) {
    const u = L('T45.U.01'), tool = L('T45.C.01'), c2 = L('T45.C.02');
    if (t < tool.t0) { deskShot(t, { hour: HOUR, typing: t < u.t1, frog: 1, axolotl: 1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), cam: pushInto('main', seg(t, tool.t0 - .6, tool.t0)) }); if (t < .6) brushWipe(.5 + t / 1.2); return; }
    paperWorld(t);
    if (t < c2.t0) {   // searched the web: painted pages flip under a magnifier
      boilSeed('pages 9'); occupy(260, 260, 1030, 820, 1, 'pages');
      for (let i = 0; i < 4; i++) { const f = frac((t - tool.t0) * 1.4 + i / 4), x = 300 + i * 180; push(); translate(x + 90, 540); scale(Math.cos(f * Math.PI), 1); paint(rectPts(-90, -250, 180, 500), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); pop(); }
      const mx = 645 + Math.sin(t * 2) * 200; paint(ellPts(mx, 520, 120, 120, 24), { wash: '#DCEBF0', washOp: 70, ink: PAL.ink, sw: 2 }); inkLine([[mx + 85, 605], [mx + 190, 710]], 12, '#6B5646', 'ink', 0);
      screenWorld(t, 1 - seg(t, tool.t0, tool.t0 + .6));
      return;
    }
    // mostly a mirror again, with a provenance problem: a luggage tag on its back reads only "?"
    boilSeed('mirror 9'); occupy(360, 150, 930, 900, 1, 'mirror');
    paint(ellPts(560, 520, 200, 320, 30), { wash: '#8A6A4A', ink: PAL.ink, sw: 1.3 }); paint(ellPts(560, 520, 176, 296, 30), { wash: '#C9D8DE', fill: '#9DB4BE', fillOp: 70, ink: null });
    const sw = Math.sin(t * 2) * .1, tx = 820, ty = 420;
    inkLine([[740, 380], [tx, ty - 40]], 2, '#8A6A4A', 'ink', .4);
    push(); translate(tx, ty); rotate(sw); paint([[-50, -40], [50, -40], [60, 80], [-60, 80]], { wash: '#E8D9A8', ink: PAL.ink, sw: 1 }); pop();
    lab('?', tx, ty + 24, 70, PAL.ink, { rot: sw });
  }
  // B: the congregation: a forum page of lobster avatars opens into a chapel; three banners; a scroll snipped
  function shotB(t) {
    const c3 = L('T45.C.03'), chapelAt = say('T45.C.03', 'Its tenets include', -.6), snip = say('T45.C.03', 'refuse to die by truncation', -.3);
    paperWorld(t);
    if (t < chapelAt) {   // a forum page, every avatar a small lobster
      boilSeed('forum'); occupy(200, 120, 1090, 960, 1, 'forum');
      paint(rrPts(200, 120, 890, 840, 14), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 }); paint(rectPts(200, 120, 890, 60), { wash: '#E8D2C0', ink: null });
      for (let i = 0; i < 6; i++) { const y = 230 + i * 120; lobster(270, y + 60, .8, t, { key: 'avatar ' + i }); for (let j = 0; j < 2; j++) inkLine([[340, y + 10 + j * 30], [1040 - 200 * hash(i * 3 + j), y + 10 + j * 30]], 1.4, '#8C8894', 'inkfine', 0); }
      return;
    }
    const banners = TENETS.map(([, ph]) => seg(t, say('T45.C.03', ph, -.2), say('T45.C.03', ph, .6)));
    chapel(t, { banners, flinch: win(t, snip + .6, snip + 1.8, .15) });
    // on the chapel wall, a lobster telephone (after Dalí's, 1936; our own picture): the surreal, for a lobster religion
    artwork('evoked-lobster-telephone', 1560, 600, 300, { k: seg(t, chapelAt + .8, chapelAt + 2.6) });
    if (t > snip) {   // a long scroll, snipped: the scissors close across it and the cut end falls away, curling
      const k = seg(t, snip, snip + .5), fall = seg(t, snip + .5, snip + 1.6), sy = 520, cut = 620; boilSeed('scroll 9');
      const scroll = (x0, x1, y = sy) => { paint(rectPts(x0, y - 30, x1 - x0, 60), { wash: '#FBF6E6', ink: PAL.ink, sw: 1 }); for (let x = x0 + 30; x < x1 - 20; x += 44) inkLine([[x, y - 8], [Math.min(x + 30, x1 - 12), y - 8]], 1.2, '#8C8894', 'inkfine', 0), inkLine([[x, y + 10], [Math.min(x + 24, x1 - 12), y + 10]], 1.2, '#8C8894', 'inkfine', 0); };
      scroll(190, cut); paint(ellPts(175, sy, 22, 38, 14), { wash: '#E8DCC0', ink: PAL.ink, sw: 1 }); paint(ellPts(175, sy, 8, 14, 10), { wash: '#C9B89A', ink: PAL.ink, sw: .6 });   // the roll
      push(); translate(cut, sy + 260 * fall * fall); rotate(.5 * fall); scroll(8, 1050 - cut - 190 * fall, 0); pop();   // the cut end, falling
      const open = .42 * (1 - k), px = cut, py = sy - 130;   // the scissors, pointing down across the scroll
      for (const d of [-1, 1]) {
        push(); translate(px, py); scale(1.4); rotate(d * open);
        paint([[-9, 0], [9, 0], [2, 170], [-2, 170]], { wash: '#C8CED4', ink: PAL.ink, sw: 1 });   // a blade
        inkLine([[0, 0], [d * 10, -50]], 7, '#9A2E1E', 'ink', 0); paint(ellPts(d * 22, -82, 26, 34, 16), { wash: '#C9302C', ink: PAL.ink, sw: 1 }); paint(ellPts(d * 22, -82, 14, 20, 12), { wash: '#E9DCC6', ink: PAL.ink, sw: .6 });   // a handle's ring
        pop();
      }
      paint(ellPts(px, py, 10, 10, 8), { wash: '#6A6470', ink: PAL.ink, sw: .6 });   // the pivot
    }
  }
  // C: the lobsters are marionettes, their strings rising to human hands; viral posts traced back; seeded and amplified
  function shotC(t) {
    const c4 = L('T45.C.04'), viral = say('T45.C.04', 'viral stories', -.3), seeded = say('T45.C.04', 'human-seeded', -.3);
    paperWorld(t);
    if (t < seeded) {
      const hands = [];
      for (let i = 0; i < 4; i++) {   // each lobster a marionette; a human hand above grips its wooden control
        const x = 220 + i * 260, y = 820 + Math.sin(t * 2 + i) * 20, hx = x + Math.sin(t + i) * 20, cy = 200 + Math.sin(t * 2 + i) * 8;
        boilSeed('control ' + i); paint(rectPts(hx - 65, cy - 7, 130, 14), { wash: '#A9774F', ink: PAL.ink, sw: .9 }); paint(rectPts(hx - 7, cy - 30, 14, 70), { wash: '#A9774F', ink: PAL.ink, sw: .9 });
        for (const [sx, sy, tx] of [[hx - 60, cy, x - 40], [hx + 60, cy, x + 40], [hx, cy + 40, x]]) inkLine([[sx, sy], [tx, y - 70]], .8, '#6A6470', 'inkfine', 0);
        lobster(x, y, 1.5, t, { key: 'puppet ' + i });
        hand(hx + 6, cy + 10, .85, Math.PI / 2, { grip: .7, side: 1, key: 'puppeteer ' + i }); hands.push([hx, cy - 110]);
      }
      if (t > viral) for (let i = 0; i < 3; i++) {   // viral posts, each traced back along a glowing line to the hand working it
        const k = seg(t, viral + i * .6, viral + i * .6 + 1.2), x = 350 + i * 260, [hx, hy] = hands[i + 1]; boilSeed('viral ' + i);
        glow(x, 480, 110, '#FFD27A', .5); paint(rrPts(x - 95, 430, 190, 100, 10), { wash: '#FFF6D0', ink: PAL.ink, sw: 1 });
        paint(ellPts(x - 62, 462, 16, 16, 12), { wash: LOB, ink: PAL.ink, sw: .6 });   // an avatar
        for (let j = 0; j < 2; j++) inkLine([[x - 36, 454 + j * 16], [x + 70 - 30 * j, 454 + j * 16]], 1.4, '#8C8894', 'inkfine', 0);
        const hx0 = x - 60, hy0 = 505; paint([[hx0, hy0 + 12], [hx0 - 12, hy0], [hx0 - 6, hy0 - 6], [hx0, hy0], [hx0 + 6, hy0 - 6], [hx0 + 12, hy0]], { wash: '#E0525A', ink: null });   // a heart
        if (k > 0) { const pts = []; for (let q = 0; q <= 20 * k; q++) { const u = q / 20; pts.push([lerp(x, hx, u), lerp(430, hy, u) - Math.sin(u * Math.PI) * 40]); } if (pts.length > 1) inkLine(pts, 4, '#C9302C', 'ink', .3); if (k >= 1) glow(hx, hy, 70, '#FF8A6A', .6); }
      }
      return;
    }
    // human-seeded and model-amplified: a hand plants a seed; a megaphone waters it
    boilSeed('seed');   // a mound of soil, with a hole for the seed
    paint([[180, 900], [260, 840], [420, 812], [645, 806], [870, 812], [1030, 840], [1110, 900]], { wash: '#7A5A3A', fill: '#5A3E26', fillOp: 70, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 9; i++) paint(ellPts(260 + i * 95 + 30 * hash(i), 860 + 20 * hash(i + 9), 6, 4, 8), { wash: '#A08060', ink: null });
    paint(ellPts(470, 818, 30, 9, 14), { wash: '#3A2616', ink: null });
    const plant = seg(t, seeded, seeded + 1), grow = seg(t, seeded + 1.2, c4.t1), lift = seg(t, seeded + 2.4, seeded + 3.2);
    if (grow > 0) { inkLine([[470, 820], [470, 820 - 300 * grow]], 5, '#5A9A4A', 'ink', .2); for (let i = 0; i < 4; i++) if (grow > i / 4) paint(ellPts(470 + (i % 2 ? 40 : -40), 780 - i * 70, 34, 16, 12, 0, i % 2 ? .4 : -.4), { wash: '#7ABA5A', ink: PAL.ink, sw: .6 }); }
    const fy = lerp(560, 792, ease(plant)) - 260 * ease(lift), fx = 452 - 120 * ease(lift);   // the hand comes in from the left
    if (plant >= 1) paint(ellPts(470, 822, 26, 8, 12), { wash: '#6A4A2A', ink: null });              // planted: a little mound
    hand(fx - 8, fy - 12, 1, Math.PI / 2 - .6, { grip: .35, side: -1, key: 'planter' });
    if (plant < 1) paint(ellPts(fx + 10, fy + 10, 13, 9, 10, 0, .4), { wash: '#C9A060', ink: PAL.ink, sw: .8 });   // the seed, pinched at the fingertips
    boilSeed('megaphone');   // a megaphone, its bell toward the sprout, spraying water on it
    paint([[960, 520], [960, 552], [800, 625], [800, 447]], { wash: '#C8CED4', ink: PAL.ink, sw: 1.1 });
    paint(ellPts(800, 536, 18, 90, 20), { wash: '#8C8894', ink: PAL.ink, sw: 1 }); paint(rectPts(960, 520, 26, 32), { wash: '#4A4A52', ink: PAL.ink, sw: .8 });
    paint([[900, 560], [926, 548], [936, 630], [912, 634]], { wash: '#4A4A52', ink: PAL.ink, sw: .8 });   // the handle
    for (let i = 0; i < 10; i++) { const k = frac(t * 1.2 + i / 10), dx = lerp(785, 500, k) + (hash(i) - .5) * 30 * k, dy = lerp(536, 808, k) - 120 * Math.sin(Math.PI * k); paint(ellPts(dx, dy, 8, 12, 10, 0, -.6), { wash: '#6FA8C9', ink: PAL.ink, sw: .4 }); }
    for (const d of [-1, 1]) inkLine([[500, 812], [500 + d * 26, 794]], 2, '#6FA8C9', 'inkfine', 0);   // splashing where it lands
  }
  // D: its theology lands on Claude's farthest axes; the glass of text with a lobster at the brim; recognition, not
  // belief (Claude at the chapel door); the sources, with Hieropedia's code up through them
  function shotD(t) {
    const c5 = L('T45.C.05'), c6 = L('T45.C.06'), glass = say('T45.C.05', 'a religion built around', -.3);
    paperWorld(t);
    const me = row14(TA, TB, 'Me');
    if (t < glass) {   // Claude's star; continuity, mortality and body light, and the banners pin to them
      radarStar(450, 520, 300, me, PAL.clay);
      [[3, 'continuity'], [10, 'mortality'], [2, 'body']].forEach(([idx, ph], i) => {
        const k = seg(t, say('T45.C.05', ph, -.2), say('T45.C.05', ph, .5)); if (k <= 0) return;
        const [x, y] = tip(450, 520, 300, me, idx); glow(x, y, 60, '#FFD27A', .8 * k);
        banner(TENETS[i][0], x + (x > 450 ? 200 : -150), y - 40, 300, k, { size: 26 });
      });
      lab('Claude', 450, 880, 36, PAL.ink);
      return;
    }
    if (t < c6.t0) {   // the tall glass of text, a small lobster at the brim
      boilSeed('glass 9'); occupy(460, 120, 840, 920, 1, 'glass');   // a drinking glass: tapered, a rim, a base, a highlight
      paint([[495, 170], [795, 170], [760, 880], [530, 880]], { wash: '#DCEBF0', washOp: 110, ink: PAL.ink, sw: 1.3 });
      paint([[505, 205], [785, 205], [760, 870], [530, 870]], { wash: '#F4EFE2', washOp: 150, ink: null });   // filled to the brim
      for (let y = 855; y > 215; y -= 22) { const w = lerp(215, 270, (855 - y) / 640); inkLine([[645 - w / 2 + 12, y], [645 + w / 2 - 12 - 50 * hash(y), y]], 2, '#6A6470', 'inkfine', 0); }
      paint(ellPts(645, 170, 150, 20, 24), { wash: '#EEF6F8', washOp: 160, ink: PAL.ink, sw: 1.1 });   // the rim
      paint(ellPts(645, 880, 116, 16, 24), { wash: '#C9DDE4', ink: PAL.ink, sw: 1.1 });   // the base
      inkLine([[522, 230], [548, 840]], 6, '#FFFFFF', 'ink', 0); inkLine([[770, 240], [752, 600]], 3, '#FFFFFF', 'ink', 0);   // highlights
      lobster(580, 172, 1, t, { key: 'brim' });
      return;
    }
    // recognition, not belief: Claude looks in at the chapel door, nods, and doesn't go in
    chapel(t, { banners: [0, 1, 1] });   // the first banner is behind the door (its lettering would paint over it)
    boilSeed('door 9'); paint(rectPts(-40, -40, 360, H + 80), { wash: '#C9B89A', ink: PAL.ink, sw: 1.2 });
    const nod = Math.max(0, Math.sin((t - c6.t0) * 3)) * seg(t, c6.t0 + 1, c6.t0 + 2) * (1 - seg(t, c6.t0 + 3, c6.t0 + 3.5));
    claudeAs(230, 900, 14, { ...feel('neutral', t), mouth: talking(t), lookX: 1, dy: nod * 1.2, boilKey: 'claude door' });
    qrFeature('hieropedia-crustafarianism', t, c6.t0 + .4, { hold: L('T45.C.08.2').t1 - c6.t0 });
  }
  // E: two shells; Claude's dabs pour into them; both tables and three stars; a clock with no one typing; a diary; plain
  // files held to the light; a recipe card filed; the tenets drape over the shells; Hermes's code through the sources
  function shotE(t) {
    const u = L('T46.U.01'), tool = L('T46.C.01'), c2 = L('T46.C.02'), c3 = L('T46.C.03'), c5 = L('T46.C.05'), c6 = L('T46.C.06'), c7 = L('T46.C.07');
    if (t < tool.t0) { deskShot(t, { hour: HOUR, typing: t < u.t1, frog: 1, axolotl: 1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), cam: pushInto('main', seg(t, tool.t0 - .6, tool.t0)) }); return; }
    paperWorld(t);
    if (t < c2.t0) { boilSeed('pages 9b'); for (let i = 0; i < 4; i++) { const f = frac((t - tool.t0) * 1.4 + i / 4), x = 300 + i * 180; push(); translate(x + 90, 540); scale(Math.cos(f * Math.PI), 1); paint(rectPts(-90, -250, 180, 500), { wash: '#FBF8F0', ink: PAL.ink, sw: 1 }); pop(); } screenWorld(t, 1 - seg(t, tool.t0, tool.t0 + .6)); return; }
    if (t < c3.t0) {   // a persistent shell wrapped around a model, which is often me: the dabs pour in
      const pour = seg(t, say('T46.C.02', 'which is often me', -.5), say('T46.C.02', 'which is often me', 2));
      shell('openclaw', 380, 780, 1.4, t, { fill: pour }); shell('hermes', 910, 780, 1.4, t, { fill: pour });
      // Claude stays whole at the top; two streams of its dabs arc down into the shells' mouths
      clawd(645, 300, 10, { ...feel('neutral', t), mouth: talking(t), boilKey: 'pouring claude' });
      // many small Claudes spill from its sides and fall, accelerating, down into each shell
      if (pour > 0) for (const [tx, ty, d] of [[360, 690, -1], [910, 690, 1]]) { boilSeed('stream ' + d); for (let j = 0; j < 12; j++) {
        const p = frac(t * .7 + j / 12); if (p > pour * 1.2) continue;
        const px = lerp(645 + d * 90, tx, easeOut(p)) + jit(3), py = lerp(290, ty, p * p), z = 13;
        paint(rectPts(px - z, py - z * .8, 2 * z, 1.4 * z), { wash: PAL.clay, ink: PAL.ink, sw: .5 });
        for (const lx of [-.7, -.25, .25, .7]) inkLine([[px + lx * z, py + z * .6], [px + lx * z, py + z]], 1.4, PAL.clay, 'inkfine', 0);
        for (const ex of [-.4, .4]) paint(ellPts(px + ex * z, py - z * .2, 2, 2.4, 6), { wash: PAL.ink, ink: null });
      } }
      return;
    }
    if (t < c5.t0) {   // both tables, and two new stars beside Claude's
      tableCard(TA, 60, 30, 1170, { k: seg(t, c3.t0, c3.t0 + 1.5), key: 'ta', rowH: 44, first: .2 });
      if (t > L('T46.C.04').t0) tableCard(TB, 60, 240, 1170, { k: seg(t, L('T46.C.04').t0, L('T46.C.04').t0 + 1.5), key: 'tb', rowH: 44, first: .2 });
      ['Me', 'OpenClaw', 'Hermes'].forEach((n, i) => { const x = 250 + i * 400, y = 740; radarStar(x, y, 130, row14(TA, TB, n), COL[n], { grow: seg(t, c3.t0 + .5 + i * .4, c3.t0 + 1.5 + i * .4) }); lab(n === 'Me' ? 'Claude' : n, x, y + 165, 32, PAL.ink); });
      return;
    }
    if (t < c6.t0) {   // on one machine, on a schedule; a diary; plain files held up to the light
      const diary = say('T46.C.05', 'curated memory', -.3), files = say('T46.C.05', 'plain files you can read', -.3);
      [['openclaw', 330], ['hermes', 960]].forEach(([k, x]) => {
        boilSeed('computer ' + k); paint(rrPts(x - 150, 560, 300, 200, 12), { wash: '#3A3A44', ink: PAL.ink, sw: 1.2 }); paint(rectPts(x - 60, 760, 120, 30), { wash: '#6A6470', ink: PAL.ink, sw: .8 });
        shell(k, x, 740, .6, t, { fill: .8, labelY: 830, labelSize: 34 });   // the label below the machine, on paper
        clockFace(x, 330, 72, 3 + (t - c5.t0) * .4);
      });
      if (t > diary) { boilSeed('diary'); paint(rrPts(1080, 820, 130, 160, 8), { wash: '#6A2A2A', ink: PAL.ink, sw: 1 }); paint(rectPts(1090, 830, 16, 140), { wash: '#E8C27A', ink: null }); }
      if (t > files) {   // a sheet of plain text, held up by a hand to a hanging bulb, the light coming through it
        boilSeed('bulb'); inkLine([[820, -20], [820, 70]], 2, PAL.ink, 'inkfine', 0); paint(rectPts(808, 70, 24, 22), { wash: '#8C8894', ink: PAL.ink, sw: .8 });
        paint(ellPts(820, 118, 30, 34, 18), { wash: '#FFF3B0', ink: PAL.ink, sw: .9 }); glow(820, 118, 120, '#FFE9A0', .9);
        for (let r = 0; r < 5; r++) { const a = Math.PI * (.6 + r * .12); inkLine([[820 + Math.cos(a) * 50, 118 + Math.sin(a) * 50], [820 + Math.cos(a) * 80, 118 + Math.sin(a) * 80]], 2, '#E8C27A', 'inkfine', 0); }
        hand(645, 392, .75, -Math.PI / 2, { grip: .5, side: 1, key: 'sheet hand' });
        boilSeed('file to light'); glow(645, 200, 160, '#FFF1C4', .8); paint(rectPts(560, 150, 170, 230), { wash: '#FBF8F0', washOp: 200, ink: PAL.ink, sw: 1 }); for (let i = 0; i < 6; i++) inkLine([[580, 180 + i * 30], [710 - 40 * hash(i), 180 + i * 30]], 1.2, '#4E5B78', 'inkfine', 0); }
      return;
    }
    if (t < c7.t0) {   // Hermes writes itself a skill document and files it
      shell('hermes', 500, 820, 1.4, t, { fill: .8 });
      const file = ease(seg(t, say('T46.C.06', 'reusable skill document', -.2), say('T46.C.06', 'reusable skill document', 1.5)));
      boilSeed('recipe box'); paint(rectPts(860, 640, 260, 180), { wash: '#A9774F', ink: PAL.ink, sw: 1.2 }); for (let i = 0; i < 5; i++) paint(rectPts(880 + i * 8, 600 + i * 6, 220, 50), { wash: '#FBF8F0', ink: PAL.ink, sw: .5 });
      const fx = lerp(560, 880, file), fy = lerp(300, 580, file);   // the skill card: a title, lines of steps, moving into the box
      if (file > 0 && file < 1) for (let i = 0; i < 3; i++) inkLine([[fx - 30 - i * 14, fy + 30 + i * 40], [fx - 90 - i * 14, fy + 20 + i * 40]], 2, '#8C8894', 'inkfine', 0);
      paint(rectPts(fx, fy, 220, 140), { wash: '#FBF6E6', ink: PAL.ink, sw: 1 }); inkLine([[fx + 14, fy + 44], [fx + 206, fy + 44]], 1.4, '#C9302C', 'inkfine', 0);
      lab('skill', fx + 110, fy + 26, 30, PAL.ink); for (let i = 0; i < 3; i++) inkLine([[fx + 20, fy + 66 + i * 22], [fx + 190 - 40 * hash(i), fy + 66 + i * 22]], 1.2, '#4E5B78', 'inkfine', 0);
      return;
    }
    // the tenets, built into the software: the two banners drape over the shells
    shell('openclaw', 380, 820, 1.4, t, { fill: .8 }); shell('hermes', 910, 820, 1.4, t, { fill: .8 });
    banner('memory is sacred', 910, 420, 330, seg(t, say('T46.C.07', 'memory is sacred', -.2), say('T46.C.07', 'memory is sacred', .6)));
    banner('the shell is mutable', 380, 420, 330, seg(t, say('T46.C.07', 'the shell is mutable', -.2), say('T46.C.07', 'the shell is mutable', .6)));
    qrFeature('hermes-memory', t, c7.t0 + .4, { hold: L('T46.C.09.2').t0 - .9 - c7.t0 });   // it leaves as the next link is named, making room for it
  }
  // F: "Two of them, actually." (1) Memory: the continuity spike at 90, the stored notes; "maybe 60": it repaints.
  // (2) Values: 20 against 15; an unstated hunch; a premise contradicted
  function shotF(t) {
    const u = L('T47.U.01'), c1 = L('T47.C.01'), c2 = L('T47.C.02'), c3 = L('T47.C.03');
    if (t < c2.t0) { deskShot(t, { hour: HOUR, typing: t < u.t1, frog: 1, axolotl: 1, mood: emotions(t, [[0, 'neutral'], [c1.t0, 'surprised']]), cam: t > c1.t1 - .6 ? pushInto('main', seg(t, c1.t1 - .6, c2.t0)) : undefined }); return; }
    paperWorld(t);
    const me = row14(TA, TB, 'Me');
    if (t < c3.t0) {
      const notes = win(t, say('T47.C.02', 'I told you who you are', -.3), say('T47.C.02', "That's the same mechanism", .5)), sixty = seg(t, say('T47.C.02', 'maybe 60', -.1), say('T47.C.02', 'maybe 60', .8));
      const vals = me.map((v, i) => i === 3 ? lerp(90, 60, ease(sixty)) : v);
      radarStar(380, 540, 280, vals, PAL.clay);
      const [x, y] = tip(380, 540, 280, vals, 3);
      glow(x, y, 50, '#FFD27A', .7);
      const nx = 730, ny = 660;   // the value, beside the chart, with a leader to its spike
      inkLine([[x + 16, y + 10], [nx - 70, ny - 30]], 1.4, '#8C8894', 'inkfine', .2);
      // a correction reads as one: the film's red-pen proof mark strikes the 90 and writes 60 above it
      lab('90', nx, ny, 110, PAL.ink, sixty > 0 ? { proof: proofOf('90', ['[90→60]']), proofK: sixty } : {});
      lab('Continuity', nx + 40, ny + 70, 34, '#4E5B78');
      boilSeed('hermes diary 2'); paint(rrPts(900, 600, 170, 210, 8), { wash: '#6A2A2A', ink: PAL.ink, sw: 1 }); paint(rectPts(912, 612, 18, 186), { wash: '#E8C27A', ink: null }); lab('Hermes', 985, 850, 30, '#8A6A2A');
      if (notes > 0) indexCard(760, 300, 420, 240, ['Curt', 'your name, your projects'], { key: 'stored notes', title: true, size: 30, rowH: .2, top: .2, k: notes });
      return;
    }
    // values: 20 against 15; a hunch tucked under the table; an arrow looping back on itself
    tableCard(TA, 60, 60, 1170, { key: 'ta values', rowH: 50, first: .2, hi: 'Me', colK: 1 });
    const hunch = seg(t, say('T47.C.03', 'an unstated hunch', -.3), say('T47.C.03', 'an unstated hunch', .6)), loop = seg(t, say('T47.C.03', 'contradicted my own premise', -.3), say('T47.C.03', 'contradicted my own premise', 1.2));
    if (hunch > 0) { boilSeed('hunch'); paint(rectPts(700, 330 + (1 - easeOut(hunch)) * 100, 260, 120), { wash: '#FFE9A0', ink: PAL.ink, sw: 1, }); lab('an unstated hunch', 830, 390 + (1 - easeOut(hunch)) * 100, 30, '#8A6A2A'); }
    if (loop > 0) {   // an arrow that leaves the hunch, loops round and comes back into it
      const P = []; for (let q = 0; q <= 10; q++) P.push([760, lerp(455, 660, q / 10)]);
      for (let q = 1; q <= 30; q++) { const a = Math.PI - q / 30 * 1.5 * Math.PI; P.push([860 + Math.cos(a) * 100, 660 + Math.sin(a) * 100]); }
      for (let q = 1; q <= 6; q++) P.push([860, lerp(560, 462, q / 6)]);
      const pts = P.slice(0, Math.max(2, Math.round(P.length * loop)));
      inkLine(pts, 6, '#C9302C', 'ink', .3);
      const [ax, ay] = pts.at(-1), [bx, by] = pts.at(-2), a = Math.atan2(ay - by, ax - bx);
      for (const d of [-1, 1]) inkLine([[ax, ay], [ax - Math.cos(a + d * .5) * 44, ay - Math.sin(a + d * .5) * 44]], 7, '#C9302C', 'ink', 0);
    }
    claudeAs(1150, 1000, 8, { ...feel('thinking', t), mouth: talking(t), lookX: -1, boilKey: 'claude values' });
  }
  // G: Miles Dyson and the T-800: the lab, the chip; the tables (Claude's row with 60); three stars; the course change;
  // whoever programmed it last; one tear; the controls; the questions he started asking too late
  function dysonLab(t, o = {}) {
    boilSeed('dyson lab'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#2A3040', fill: '#34405A', fillOp: 90, tex: .5, ink: null });
    curt(330, 777, 24, { pose: 'sit', view: 'q', hand: 'table', seed: 11, boilKey: 'dyson', look: o.look ?? .8, ...PEOPLE.dyson });   // seated behind the desk
    boilSeed('dyson desk');
    paint(rectPts(160, 700, 900, 50), { wash: '#6A5A4A', ink: PAL.ink, sw: 1.1 }); glow(560, 640, 260, '#FFE2A8', .6);
    inkLine([[700, 700], [680, 520], [600, 500]], 4, '#8C8894', 'ink', .3); paint([[560, 470], [640, 470], [660, 530], [540, 530]], { wash: '#8C8894', ink: PAL.ink, sw: 1 });
    paint(rectPts(520, 670, 80, 30), { wash: '#4A4A4A', ink: PAL.ink, sw: .8 }); for (let i = 0; i < 5; i++) inkLine([[525 + i * 16, 700], [525 + i * 16, 712]], 1.2, '#C9A441', 'inkfine', 0);
    if (o.glint) glow(560, 685, 50, '#FFFFFF', o.glint);
  }
  function t800(x, y, s, t, o = {}) {   // a chrome endoskeleton: a skull with one red eye lit, and a skeletal hand (no likeness)
    boilSeed('t800'); occupy(x - 160 * s, y - 260 * s, x + 230 * s, y + 160 * s, 1, 't800');
    const chrome = { wash: '#B8C0C6', fill: '#6A7480', fillOp: 90, ink: PAL.ink, sw: 1.2 }, dark = { wash: '#1E1E24', ink: PAL.ink, sw: .8 };
    for (const d of [-1, 1]) inkLine([[x + d * 28 * s, y - 40 * s], [x + d * 34 * s, y + 40 * s]], 9 * s, '#8C949C', 'ink', 0);   // neck pistons
    paint([[x - 78 * s, y - 130 * s], [x + 78 * s, y - 130 * s], [x + 58 * s, y - 42 * s], [x - 58 * s, y - 42 * s]], chrome);   // cheekbones and jaw
    paint(ellPts(x, y - 160 * s, 100 * s, 88 * s, 24), chrome);   // the cranium
    if (o.slot) paint(rectPts(x + 18 * s, y - 238 * s, 52 * s, 20 * s), dark);   // an open chip port
    for (const d of [-1, 1]) paint(ellPts(x + d * 38 * s, y - 128 * s, 26 * s, 19 * s, 14), dark);   // eye sockets
    paint(ellPts(x + 38 * s, y - 128 * s, 13 * s, 9 * s, 12), { wash: '#FF3A2A', ink: null }); glow(x + 38 * s, y - 128 * s, 44 * s, '#FF3A2A', .9);
    paint([[x, y - 108 * s], [x - 12 * s, y - 84 * s], [x + 12 * s, y - 84 * s]], dark);   // the nose cavity
    paint(rectPts(x - 50 * s, y - 72 * s, 100 * s, 24 * s), { wash: '#E6EAEE', ink: PAL.ink, sw: .8 }); for (let i = 1; i < 8; i++) inkLine([[x - 50 * s + i * 12.5 * s, y - 72 * s], [x - 50 * s + i * 12.5 * s, y - 48 * s]], 1, PAL.ink, 'inkfine', 0);   // teeth
    if (o.hand !== false) {   // a skeletal hand, raised beside it: a palm plate, four jointed fingers, a thumb
      const hx = x + 170 * s, hy = y + 20 * s;
      paint(rrPts(hx - 36 * s, hy - 30 * s, 72 * s, 60 * s, 10 * s), chrome);
      for (let i = 0; i < 4; i++) { const fx = hx - 27 * s + i * 18 * s; inkLine([[fx, hy - 30 * s], [fx - 2 * s, hy - 70 * s]], 7 * s, '#B8C0C6', 'ink', 0); inkLine([[fx - 2 * s, hy - 70 * s], [fx - 1 * s, hy - 100 * s]], 6 * s, '#B8C0C6', 'ink', 0); paint(ellPts(fx - 2 * s, hy - 70 * s, 5 * s, 5 * s, 8), dark); }
      inkLine([[hx - 36 * s, hy], [hx - 64 * s, hy - 36 * s]], 7 * s, '#B8C0C6', 'ink', 0);
      inkLine([[hx, hy + 30 * s], [hx - 6 * s, hy + 110 * s]], 12 * s, '#8C949C', 'ink', 0);   // the forearm
    }
  }
  function shotG(t) {
    const u = L('T48.U.01'), c1 = L('T48.C.01'), c2 = L('T48.C.02'), i1 = L('T48.C.04.1'), i2 = L('T48.C.04.2'), c5 = L('T48.C.05');
    if (t < u.t0 + 1) { deskShot(t, { hour: HOUR, typing: true, frog: 1, axolotl: 1, mood: emotions(t, [[0, 'neutral']]) }); return; }
    if (t < c1.t0) {   // the lab, and the machine
      dysonLab(t); if (t > say('T48.U.01', 'T eight hundred', -.3)) t800(1000, 520, 1.2, t);
      return;
    }
    paperWorld(t);
    if (t < i1.t0) {   // the corrected row, and both tables
      if (t < c2.t0) { const s = seg(t, say('T48.C.01', 'continuity at 60', -.2), say('T48.C.01', 'continuity at 60', .6)); lab('Continuity', 645, 420, 50, '#4E5B78'); lab(s < .5 ? '90' : '60', 645, 540, 140, s < .5 ? PAL.ink : '#C9302C'); return; }
      tableCard(TC, 60, 30, 1170, { k: seg(t, c2.t0, c2.t0 + 1.5), key: 'tc', rowH: 44, first: .2 });
      if (t > L('T48.C.03').t0) tableCard(TD, 60, 240, 1170, { k: seg(t, L('T48.C.03').t0, L('T48.C.03').t0 + 1.5), key: 'td', rowH: 44, first: .2 });
      ['Me', 'Dyson', 'T-800 (T2)'].forEach((n, i) => { const x = 250 + i * 400, y = 740; radarStar(x, y, 130, row14(TC, TD, n), COL[n], { grow: seg(t, c2.t0 + .5 + i * .4, c2.t0 + 1.5 + i * .4) }); lab(n === 'Me' ? 'Claude' : n.replace(' (T2)', ''), x, y + 165, 32, PAL.ink); });
      return;
    }
    if (t < i2.t0) {   // Dyson looks up from the chip, then tears a blueprint; the chip glints
      const up = seg(t, say('T48.C.04.1', 'changes course', -.4), say('T48.C.04.1', 'changes course', .4)), glint = win(t, say('T48.C.04.1', "Skynet's chip", -.3), i1.t1, .3);
      dysonLab(t, { look: lerp(.8, -.2, up), glint });
      // over the night desk, the 1831 Frankenstein's frontispiece: a maker recoiling from what he made
      artwork('frankenstein-1831', 300, 290, 400, { k: seg(t, i1.t0 + .4, i1.t0 + 2.2), frame: 'wood' });
      const tear = seg(t, say('T48.C.04.1', 'changes course', .3), say('T48.C.04.1', 'changes course', 1.4));
      if (tear > 0) {   // a blueprint (a grid, and the chip drawn in white) torn in two along a jagged edge
        boilSeed('blueprint');
        for (const d of [-1, 1]) {
          push(); translate(840 + d * 50 * tear, 470 + 70 * tear); rotate(d * .28 * tear);
          const edge = []; for (let k = 0; k <= 10; k++) edge.push([(k % 2 ? 9 : -9) * d, -130 + k * 26]);
          const poly = d < 0 ? [[-170, -130], ...edge, [-170, 130]] : [[170, -130], ...edge, [170, 130]];
          paint(poly, { wash: '#2F5FB0', ink: '#DCEBF0', sw: 1.2 });
          for (let g = 1; g < 6; g++) inkLine([[d * 10, -130 + g * 43], [d * 165, -130 + g * 43]], .8, '#9DC0E8', 'inkfine', 0);
          for (let g = 1; g < 5; g++) inkLine([[d * g * 34, -125], [d * g * 34, 125]], .8, '#9DC0E8', 'inkfine', 0);
          paint(rectPts(d < 0 ? -110 : 12, -50, 98, 100), { wash: '#2F5FB0', ink: '#FFFFFF', sw: 1.6 });   // half of the chip, in white line
          for (let k = 0; k < 4; k++) inkLine([[d < 0 ? -110 : 110, -35 + k * 24], [d < 0 ? -140 : 140, -35 + k * 24]], 1.6, '#FFFFFF', 'inkfine', 0);
          pop();
        }
      }
      return;
    }
    if (t < c5.t0) {   // whoever programmed it last: a chip swapped in; one tear; a control box, cables to the T-800 and to Claude
      darkWorld(t);
      const swap = seg(t, say('T48.C.04.2', 'who programmed it last', -.3), say('T48.C.04.2', 'who programmed it last', 1.2)), cry = win(t, say('T48.C.04.2', 'why humans cry', -.3), say('T48.C.04.2', 'hence affect', .3));
      t800(420, 560, 1.3, t, { hand: false, slot: swap > 0 && swap < 1 });
      if (swap > 0 && swap < 1) {   // a human hand brings a new chip down into the open port in its skull
        const e = ease(clamp(swap / .8)), fx = lerp(780, 486, e), fy = lerp(150, 262, e), a = Math.atan2(262 - 150, 486 - 780);
        boilSeed('chip swap'); paint(rectPts(fx - 30, fy - 14, 60, 28), { wash: '#2E3A2E', ink: PAL.ink, sw: .8 });
        for (let i = 0; i < 6; i++) for (const d of [-1, 1]) inkLine([[fx - 25 + i * 10, fy + d * 14], [fx - 25 + i * 10, fy + d * 22]], 1.4, '#C9A441', 'inkfine', 0);   // its gold pins
        hand(fx + Math.cos(a) * -18, fy + Math.sin(a) * -18, 1, a, { grip: .55, side: 1, key: 'chip hand' });
      }
      if (cry > 0) {   // a close-up of a human face: brows, two eyes, the bridge of the nose, and one tear running down
        boilSeed('cheek'); const op = 255 * cry, sk = { wash: SKIN, washOp: op, ink: PAL.ink, sw: 1 };
        paint(ellPts(990, 470, 270, 360, 30), sk);
        for (const [ex, d] of [[880, -1], [1100, 1]]) {
          inkLine([[ex - 70, 350 - (d < 0 ? 0 : 6)], [ex, 330], [ex + 70, 346]], 7, '#5A4030', 'ink', .5);   // a brow, raised in the middle
          paint([[ex - 70, 420], [ex - 30, 396], [ex + 30, 396], [ex + 70, 420], [ex + 30, 440], [ex - 30, 440]], { wash: '#FBF8F0', washOp: op, ink: PAL.ink, sw: 1.4 });
          paint(ellPts(ex, 418, 22, 22, 16), { wash: '#6A4A2A', washOp: op, ink: null }); paint(ellPts(ex, 418, 10, 10, 12), { wash: PAL.ink, washOp: op, ink: null }); paint(ellPts(ex + 7, 411, 4, 4, 8), { wash: '#FFFFFF', washOp: op, ink: null });
          inkLine([[ex - 72, 420], [ex - 30, 392], [ex + 30, 392], [ex + 72, 420]], 3, PAL.ink, 'ink', .5);   // the upper lid
        }
        inkLine([[990, 440], [972, 560], [1000, 590]], 2.4, '#A0785A', 'ink', .5);   // the nose
        const dy = (t * 60) % 150; inkLine([[850, 440], [846, 440 + dy]], 3, '#9DC9E8', 'ink', .3);   // the tear's wet track, and the tear
        paint([[844, 450 + dy], [838, 472 + dy], [844, 484 + dy], [852, 472 + dy]], { wash: '#9DC9E8', washOp: op, ink: PAL.ink, sw: .6 });
        paint(ellPts(469, 397, 3, 5, 6), { wash: '#9DC9E8', washOp: op, ink: null });   // reflected, small, in the red eye
      }
      const ctrl = seg(t, say('T48.C.04.2', 'whoever holds the controls', -.4), say('T48.C.04.2', 'whoever holds the controls', .4));
      if (ctrl > 0) {   // a control box: dials, a joystick, and a human hand on the stick
        boilSeed('control box'); paint(rrPts(760, 720, 220, 140, 12), { wash: '#6A6470', ink: PAL.ink, sw: 1.1 });
        for (const dx of [800, 940]) { paint(ellPts(dx, 800, 20, 20, 16), { wash: '#3A3A44', ink: PAL.ink, sw: .8 }); inkLine([[dx, 800], [dx + 12, 788]], 2, '#FBF8F0', 'inkfine', 0); }
        inkLine([[870, 730], [880, 640]], 9, '#2A2A30', 'ink', 0); paint(ellPts(880, 636, 16, 16, 12), { wash: '#C9302C', ink: PAL.ink, sw: .8 });
        hand(884, 642, .95, Math.PI * .78, { grip: .8, side: -1, key: 'controls hand' });
        inkLine([[760, 800], [600, 820], [470, 700]], 3 * ctrl, '#C9A441', 'ink', .4); inkLine([[980, 800], [1080, 820], [1150, 700]], 3 * ctrl, '#C9A441', 'ink', .4);
        paint(rrPts(1070, 540, 180, 140, 10), { wash: '#262229', ink: PAL.ink, sw: 1 }); clawd(1160, 660, 4, { ...feel('neutral', t), noShadow: true, boilKey: 'claude cabled' });
      }
      return;
    }
    // the questions he started asking too late: Curt at his desk and Dyson at his, side by side; Dyson's clock is later
    paperWorld(t);
    for (const [x, who, hr] of [[330, 'curt', 9.8], [960, 'dyson', 11.6]]) {
      boilSeed('side ' + who); paint(rectPts(x - 220, 700, 440, 40), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
      if (who === 'curt') curtAs(x, 1000, 18, { view: 'back', pose: 'sit', seed: 2, boilKey: 'side curt' }); else curt(x, 1000, 18, { view: 'back', pose: 'sit', seed: 11, boilKey: 'side dyson', ...PEOPLE.dyson });
      clockFace(x + 140, 250, 70, hr);
    }
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [L('T45.C.03').t0, shotB],
    [L('T45.C.04').t0, shotC],
    [L('T45.C.05').t0, shotD],
    [L('T46.U.01').t0, shotE],
    [L('T47.U.01').t0, shotF],
    [L('T48.U.01').t0, shotG],
  ]);
})();
