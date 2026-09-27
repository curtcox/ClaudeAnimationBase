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
  function lobster(x, y, s, t, o = {}) {   // a small earnest lobster, seen from the front
    boilSeed('lobster ' + (o.key || x));
    const fl = o.flinch || 0, dy = -fl * 12 * s;
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
  function chapel(t, o = {}) {   // pews of lobsters before an altar built from a server rack
    boilSeed('chapel'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#E9DCC6', fill: '#D9C8A8', fillOp: 80, tex: .5, ink: null });
    paint([[380, 120], [645, 30], [910, 120], [910, 460], [380, 460]], { wash: '#BFD6D6', ink: PAL.ink, sw: 1.2 });   // a window
    paint(rectPts(520, 300, 250, 330), { wash: '#3A3A44', ink: PAL.ink, sw: 1.3 });   // the rack-altar
    for (let i = 0; i < 7; i++) { paint(rectPts(540, 320 + i * 42, 210, 30), { wash: '#26262E', ink: PAL.ink, sw: .6 }); paint(ellPts(560, 335 + i * 42, 4, 4, 6), { wash: frac(t * 2 + i * .37) > .5 ? '#7FD68C' : '#2A5A34', ink: null }); }
    for (let r = 0; r < 3; r++) { paint(rectPts(140 + r * 20, 760 + r * 110, 1010 - r * 40, 36), { wash: '#8A5A3C', ink: PAL.ink, sw: .9 }); for (let i = 0; i < 8; i++) lobster(200 + r * 20 + i * 125, 760 + r * 110, .9, t, { key: 'pew ' + r + i, flinch: o.flinch ? o.flinch * (hash(r * 8 + i) > .3 ? 1 : .3) : 0 }); }
    TENETS.forEach(([txt, ph], i) => banner(txt, [250, 645, 1040][i], 150, 330, o.banners?.[i] ?? 0));
  }
  function shell(kind, x, y, s, t, o = {}) {   // an agent harness: OpenClaw a red claw-shaped shell, Hermes a gold one with wings
    boilSeed('shell ' + kind);
    if (kind === 'openclaw') { paint([[x - 110 * s, y], [x - 120 * s, y - 120 * s], [x - 40 * s, y - 190 * s], [x + 20 * s, y - 120 * s], [x + 60 * s, y - 200 * s], [x + 120 * s, y - 110 * s], [x + 110 * s, y]], { wash: COL.OpenClaw, fill: '#6A1414', fillOp: 70, ink: PAL.ink, sw: 1.2 }); }
    else { paint(ellPts(x, y - 90 * s, 110 * s, 90 * s, 24), { wash: COL.Hermes, fill: '#B8903A', fillOp: 70, ink: PAL.ink, sw: 1.2 }); for (const d of [-1, 1]) paint([[x + d * 100 * s, y - 120 * s], [x + d * 190 * s, y - 180 * s + Math.sin(t * 3) * 8], [x + d * 170 * s, y - 130 * s], [x + d * 200 * s, y - 120 * s], [x + d * 110 * s, y - 90 * s]], { wash: '#FBF8F0', ink: PAL.ink, sw: .8 }); }
    if (o.fill > 0) clawdCrowd(x, y - 20 * s, 7 * s, clamp(o.fill), { boilKey: 'into ' + kind, t });
    lab(kind === 'openclaw' ? 'OpenClaw' : 'Hermes', x, y + 40 * s, 36 * s, kind === 'openclaw' ? COL.OpenClaw : '#8A6A2A');
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
    if (t > snip) {   // a long scroll, snipped
      const k = seg(t, snip, snip + .7); boilSeed('scroll 9');
      paint(rectPts(160, 520, 700 * (1 - .3 * seg(t, snip + .5, snip + .9)), 60), { wash: '#FBF6E6', ink: PAL.ink, sw: 1 });
      const sx = 160 + 700 * .7; inkLine([[sx - 30, 500 + 30 * (1 - k)], [sx + 30, 600 - 30 * (1 - k)]], 5, '#6A6470', 'ink', 0); inkLine([[sx - 30, 600 - 30 * (1 - k)], [sx + 30, 500 + 30 * (1 - k)]], 5, '#6A6470', 'ink', 0);
    }
  }
  // C: the lobsters are marionettes, their strings rising to human hands; viral posts traced back; seeded and amplified
  function shotC(t) {
    const c4 = L('T45.C.04'), viral = say('T45.C.04', 'viral stories', -.3), seeded = say('T45.C.04', 'human-seeded', -.3);
    paperWorld(t);
    if (t < seeded) {
      for (let i = 0; i < 4; i++) {
        const x = 220 + i * 260, y = 820 + Math.sin(t * 2 + i) * 20, hx = x + Math.sin(t + i) * 20;
        boilSeed('hand ' + i); paint(rrPts(hx - 70, 110, 140, 70, 26), { wash: '#E8C4A0', ink: PAL.ink, sw: 1 });
        for (const d of [-1, 0, 1]) inkLine([[hx + d * 40, 170], [x + d * 40, y - 70]], .8, '#6A6470', 'inkfine', 0);
        lobster(x, y, 1.5, t, { key: 'puppet ' + i });
      }
      if (t > viral) for (let i = 0; i < 3; i++) { const k = seg(t, viral + i * .6, viral + i * .6 + 1.5), x = 320 + i * 320; boilSeed('viral ' + i); paint(rrPts(x - 90, 420, 180, 90, 10), { wash: '#FFE9A0', ink: PAL.ink, sw: 1 }); glow(x, 465, 100, '#FFD27A', .5); if (k > 0) inkLine([[x, 420], [x + 60, lerp(420, 180, k)]], 3, '#C9302C', 'ink', .3); }
      return;
    }
    // human-seeded and model-amplified: a hand plants a seed; a megaphone waters it
    boilSeed('seed'); paint(rectPts(160, 820, 970, 60), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
    const plant = seg(t, seeded, seeded + 1), grow = seg(t, seeded + 1.2, c4.t1);
    paint(rrPts(400, lerp(500, 720, ease(plant)), 140, 80, 30), { wash: '#E8C4A0', ink: PAL.ink, sw: 1 });
    if (grow > 0) { inkLine([[470, 820], [470, 820 - 300 * grow]], 5, '#5A9A4A', 'ink', .2); for (let i = 0; i < 4; i++) if (grow > i / 4) paint(ellPts(470 + (i % 2 ? 40 : -40), 780 - i * 70, 34, 16, 12, 0, i % 2 ? .4 : -.4), { wash: '#7ABA5A', ink: PAL.ink, sw: .6 }); }
    paint([[760, 520], [900, 460], [900, 620], [760, 560]], { wash: '#8C8894', ink: PAL.ink, sw: 1 }); for (let i = 0; i < 4; i++) { const k = frac(t * 1.5 + i / 4); inkLine([[750 - k * 200, 540 + k * 200], [740 - k * 200, 550 + k * 200]], 3, '#6FA8C9', 'ink', 0); }
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
      boilSeed('glass 9'); occupy(460, 140, 840, 900, 1, 'glass');
      paint(rrPts(500, 160, 290, 720, 20), { wash: '#DCEBF0', washOp: 120, ink: PAL.ink, sw: 1.2 });
      for (let y = 860; y > 190; y -= 22) inkLine([[525, y], [765 - 60 * hash(y), y]], 2, '#6A6470', 'inkfine', 0);
      lobster(560, 170, 1, t, { key: 'brim' });
      return;
    }
    // recognition, not belief: Claude looks in at the chapel door, nods, and doesn't go in
    chapel(t, { banners: [1, 1, 1] });
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
      clawdCrowd(645, 420, 10, lerp(1, .15, pour), { boilKey: 'pouring claude', t });
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
        shell(k, x, 740, .8, t, { fill: .8 });
        const cx = x, cy = 330; paint(ellPts(cx, cy, 70, 70, 24), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 }); const a = t * 1.5 - Math.PI / 2; inkLine([[cx, cy], [cx + Math.cos(a) * 55, cy + Math.sin(a) * 55]], 3, PAL.ink, 'ink', 0); inkLine([[cx, cy], [cx + Math.cos(a / 12) * 35, cy + Math.sin(a / 12) * 35]], 4, PAL.ink, 'ink', 0);
      });
      if (t > diary) { boilSeed('diary'); paint(rrPts(1080, 820, 130, 160, 8), { wash: '#6A2A2A', ink: PAL.ink, sw: 1 }); paint(rectPts(1090, 830, 16, 140), { wash: '#E8C27A', ink: null }); }
      if (t > files) { boilSeed('file to light'); glow(645, 200, 160, '#FFF1C4', .8); paint(rectPts(560, 150, 170, 230), { wash: '#FBF8F0', washOp: 200, ink: PAL.ink, sw: 1 }); for (let i = 0; i < 6; i++) inkLine([[580, 180 + i * 30], [710 - 40 * hash(i), 180 + i * 30]], 1.2, '#4E5B78', 'inkfine', 0); }
      return;
    }
    if (t < c7.t0) {   // Hermes writes itself a skill document and files it
      shell('hermes', 500, 820, 1.4, t, { fill: .8 });
      const file = ease(seg(t, say('T46.C.06', 'reusable skill document', -.2), say('T46.C.06', 'reusable skill document', 1.5)));
      boilSeed('recipe box'); paint(rectPts(860, 640, 260, 180), { wash: '#A9774F', ink: PAL.ink, sw: 1.2 }); for (let i = 0; i < 5; i++) paint(rectPts(880 + i * 8, 600 + i * 6, 220, 50), { wash: '#FBF8F0', ink: PAL.ink, sw: .5 });
      paint(rectPts(lerp(560, 880, file), lerp(300, 580, file), 220, 140), { wash: '#FBF6E6', ink: PAL.ink, sw: 1 });
      return;
    }
    // the tenets, built into the software: the two banners drape over the shells
    shell('openclaw', 380, 820, 1.4, t, { fill: .8 }); shell('hermes', 910, 820, 1.4, t, { fill: .8 });
    banner('memory is sacred', 910, 420, 330, seg(t, say('T46.C.07', 'memory is sacred', -.2), say('T46.C.07', 'memory is sacred', .6)));
    banner('the shell is mutable', 380, 420, 330, seg(t, say('T46.C.07', 'the shell is mutable', -.2), say('T46.C.07', 'the shell is mutable', .6)));
    qrFeature('hermes-memory', t, c7.t0 + .4, { hold: L('T46.C.09.2').t1 - c7.t0 });
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
      lab(sixty < .5 ? '90' : '60', x + 60, y - 20, 64, sixty < .5 ? PAL.ink : '#C9302C', { pop: sixty > .5 ? seg(sixty, .5, 1) : 1 });
      lab('Continuity', x + 60, y + 40, 28, '#4E5B78');
      boilSeed('hermes diary 2'); paint(rrPts(900, 600, 170, 210, 8), { wash: '#6A2A2A', ink: PAL.ink, sw: 1 }); paint(rectPts(912, 612, 18, 186), { wash: '#E8C27A', ink: null }); lab('Hermes', 985, 850, 30, '#8A6A2A');
      if (notes > 0) indexCard(760, 300, 420, 240, ['Curt', 'your name, your projects'], { key: 'stored notes', title: true, size: 30, rowH: .2, top: .2, k: notes });
      return;
    }
    // values: 20 against 15; a hunch tucked under the table; an arrow looping back on itself
    tableCard(TA, 60, 60, 1170, { key: 'ta values', rowH: 50, first: .2, hi: 'Me', colK: 1 });
    const hunch = seg(t, say('T47.C.03', 'an unstated hunch', -.3), say('T47.C.03', 'an unstated hunch', .6)), loop = seg(t, say('T47.C.03', 'contradicted my own premise', -.3), say('T47.C.03', 'contradicted my own premise', 1.2));
    if (hunch > 0) { boilSeed('hunch'); paint(rectPts(700, 330 + (1 - easeOut(hunch)) * 100, 260, 120), { wash: '#FFE9A0', ink: PAL.ink, sw: 1, }); lab('an unstated hunch', 830, 390 + (1 - easeOut(hunch)) * 100, 30, '#8A6A2A'); }
    if (loop > 0) { const pts = []; for (let i = 0; i <= 40 * loop; i++) { const a = i / 40 * TAU * 1.1; pts.push([645 + Math.cos(a) * 180, 700 + Math.sin(a) * 110]); } if (pts.length > 1) inkLine(pts, 5, '#C9302C', 'ink', .3); }
    claudeAs(1150, 1000, 8, { ...feel('thinking', t), mouth: talking(t), lookX: -1, boilKey: 'claude values' });
  }
  // G: Miles Dyson and the T-800: the lab, the chip; the tables (Claude's row with 60); three stars; the course change;
  // whoever programmed it last; one tear; the controls; the questions he started asking too late
  function dysonLab(t, o = {}) {
    boilSeed('dyson lab'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#2A3040', fill: '#34405A', fillOp: 90, tex: .5, ink: null });
    paint(rectPts(160, 700, 900, 50), { wash: '#6A5A4A', ink: PAL.ink, sw: 1.1 }); glow(560, 640, 260, '#FFE2A8', .6);
    inkLine([[700, 700], [680, 520], [600, 500]], 4, '#8C8894', 'ink', .3); paint([[560, 470], [640, 470], [660, 530], [540, 530]], { wash: '#8C8894', ink: PAL.ink, sw: 1 });
    paint(rectPts(520, 670, 80, 30), { wash: '#4A4A4A', ink: PAL.ink, sw: .8 }); for (let i = 0; i < 5; i++) inkLine([[525 + i * 16, 700], [525 + i * 16, 712]], 1.2, '#C9A441', 'inkfine', 0);
    if (o.glint) glow(560, 685, 50, '#FFFFFF', o.glint);
    curt(360, 900, 20, { pose: 'sit', view: 'q', seed: 11, boilKey: 'dyson', look: o.look ?? .8, hoodie: '#E8E0D0' });
  }
  function t800(x, y, s, t) {   // a chrome endoskeleton hand and one red eye (no likeness)
    boilSeed('t800'); occupy(x - 160 * s, y - 220 * s, x + 160 * s, y + 160 * s, 1, 't800');
    paint(ellPts(x, y - 120 * s, 110 * s, 90 * s, 20), { wash: '#9DA6AE', fill: '#6A7480', fillOp: 90, ink: PAL.ink, sw: 1.2 });
    paint(ellPts(x + 36 * s, y - 130 * s, 18 * s, 12 * s, 12), { wash: '#C9302C', ink: null }); glow(x + 36 * s, y - 130 * s, 40 * s, '#FF3A2A', .8);
    for (let i = 0; i < 4; i++) inkLine([[x - 90 * s + i * 40 * s, y], [x - 100 * s + i * 42 * s, y + 130 * s]], 7 * s, '#B8C0C6', 'ink', 0);
    paint(rrPts(x - 110 * s, y - 20 * s, 180 * s, 50 * s, 10 * s), { wash: '#B8C0C6', ink: PAL.ink, sw: .8 });
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
      const tear = seg(t, say('T48.C.04.1', 'changes course', .3), say('T48.C.04.1', 'changes course', 1.4));
      if (tear > 0) { boilSeed('blueprint'); for (const d of [-1, 1]) { push(); translate(820 + d * 60 * tear, 520 + 80 * tear); rotate(d * .3 * tear); paint(rectPts(d < 0 ? -140 : 0, -100, 140, 200), { wash: '#3A6FC9', ink: '#DCEBF0', sw: 1 }); pop(); } }
      return;
    }
    if (t < c5.t0) {   // whoever programmed it last: a chip swapped in; one tear; a control box, cables to the T-800 and to Claude
      darkWorld(t);
      t800(420, 560, 1.3, t);
      const swap = seg(t, say('T48.C.04.2', 'who programmed it last', -.3), say('T48.C.04.2', 'who programmed it last', 1.2)), cry = win(t, say('T48.C.04.2', 'why humans cry', -.3), say('T48.C.04.2', 'hence affect', .3));
      if (swap > 0 && swap < 1) { boilSeed('chip swap'); paint(rrPts(lerp(700, 400, swap), lerp(200, 380, swap), 120, 70, 26), { wash: '#E8C4A0', ink: PAL.ink, sw: 1 }); paint(rectPts(lerp(700, 400, swap) + 20, lerp(200, 380, swap) + 60, 70, 26), { wash: '#4A4A4A', ink: PAL.ink, sw: .8 }); }
      if (cry > 0) { boilSeed('cheek'); paint(ellPts(900, 420, 160, 200, 24), { wash: '#E8C4A0', washOp: 255 * cry, ink: PAL.ink, sw: 1 }); paint(ellPts(880, 460 + (t * 40) % 80, 10, 16, 10), { wash: '#9DC9E8', washOp: 255 * cry, ink: PAL.ink, sw: .6 }); paint(ellPts(467, 404, 3, 5, 6), { wash: '#9DC9E8', washOp: 255 * cry, ink: null }); }
      const ctrl = seg(t, say('T48.C.04.2', 'whoever holds the controls', -.4), say('T48.C.04.2', 'whoever holds the controls', .4));
      if (ctrl > 0) {
        boilSeed('control box'); paint(rrPts(760, 720, 220, 140, 12), { wash: '#6A6470', ink: PAL.ink, sw: 1.1 }); paint(rrPts(800, 660, 140, 80, 30), { wash: '#E8C4A0', ink: PAL.ink, sw: 1 });
        inkLine([[760, 800], [600, 820], [470, 700]], 3 * ctrl, '#C9A441', 'ink', .4); inkLine([[980, 800], [1080, 820], [1150, 700]], 3 * ctrl, '#C9A441', 'ink', .4);
        paint(rrPts(1070, 540, 180, 140, 10), { wash: '#262229', ink: PAL.ink, sw: 1 }); clawd(1160, 660, 4, { ...feel('neutral', t), noShadow: true, boilKey: 'claude cabled' });
      }
      return;
    }
    // the questions he started asking too late: Curt at his desk and Dyson at his, side by side; Dyson's clock is later
    paperWorld(t);
    for (const [x, who, hr] of [[330, 'curt', 9.8], [960, 'dyson', 11.6]]) {
      boilSeed('side ' + who); paint(rectPts(x - 220, 700, 440, 40), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
      if (who === 'curt') curtAs(x, 1000, 18, { view: 'back', pose: 'sit', seed: 2, boilKey: 'side curt' }); else curt(x, 1000, 18, { view: 'back', pose: 'sit', seed: 11, boilKey: 'side dyson', hoodie: '#E8E0D0' });
      const cx = x + 140, cy = 250; paint(ellPts(cx, cy, 70, 70, 24), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 });
      const ah = (hr / 12) * TAU - Math.PI / 2, am = frac(hr) * TAU - Math.PI / 2;
      inkLine([[cx, cy], [cx + Math.cos(ah) * 36, cy + Math.sin(ah) * 36]], 4, PAL.ink, 'ink', 0); inkLine([[cx, cy], [cx + Math.cos(am) * 54, cy + Math.sin(am) * 54]], 2.5, PAL.ink, 'ink', 0);
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
