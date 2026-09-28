// evocations.js: our own pictures for the works docs/ART.md lists as "close, but not free". Those are still under
// copyright, so the film only evokes them, the way it treats borrowed sounds: the idea in the film's own cast, brush and
// composition, never the original's layout. Stills, as standalone loops like sheets.js; render them with
//   node render.mjs --loop=evoke_hands --stills=0 --out=out/evoke/hands     (then a 1600 px JPEG in docs/artworks/evoked-*.jpg)
// (and evoke_pipe, evoke_mirror, evoke_phone). No lettering: the originals' words aren't the transcript's.
(() => {
  const still = f => { f.len = 1; return f; };
  const wall = (c1 = '#E9DFCB', c2 = '#D9CBB0') => { boilSeed('evoke wall'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: c1, fill: c2, fillOp: 60, bleed: .2, tex: .6, ink: null }); };
  // a point in a pushed frame: translate (x, y), rotate a, scale s
  const at = (x, y, a, s, lx, ly) => [x + s * (lx * Math.cos(a) - ly * Math.sin(a)), y + s * (lx * Math.sin(a) + ly * Math.cos(a))];

  // After Escher's Drawing Hands (1948): each draws the other. Curt's hand pencils in Claude's feet while Claude paints
  // in the hand's cuff; neither is finished where the other is still working on it.
  LOOPS.evoke_hands = still(t => {
    wall('#DCCFB6', '#C9B894');
    boilSeed('evoke sheet');
    paint(rrPts(150, 90, 1620, 900, 6).map(([x, y]) => [x + (y - 540) * .03, y]), { wash: '#FBF6EA', fill: '#F1E7D2', fillOp: 70, tex: .5, ink: PAL.ink, sw: .8 });
    // Curt's hand comes down from the upper right, pencil first; its cuff is where Claude's brush is still at work
    const hx = 1040, hy = 700, ha = 2.25, hs = 1.9, P = (lx, ly) => at(hx, hy, ha, hs, lx, ly);
    // Claude, standing on the sheet, its right foot still only pencil
    const tip = P(150, 42), u = 42, cx = tip[0] - 3.8 * u, gy = tip[1] + 4;
    claudeAs(cx, gy, u, { ...feel('happy', 3), aR: 1.1, aL: -.3, lookX: .7, lookY: -.4, noShadow: true });
    boilSeed('evoke unfinished foot');
    const fx = cx + 3.8 * u;
    paint(rectPts(fx - .75 * u, gy - 2.05 * u, 1.5 * u, 2.3 * u), { wash: '#FBF6EA', ink: null });
    inkLine([[fx - .62 * u, gy - 2.05 * u], [fx - .66 * u, gy - 1 * u], [fx - .58 * u, gy]], 1, '#5E5A62', 'HB', .4);
    inkLine([[fx + .62 * u, gy - 2.05 * u], [fx + .6 * u, gy - 1.2 * u], [fx + .5 * u, gy - .3 * u]], 1, '#5E5A62', 'HB', .4);
    inkLine([[fx - .58 * u, gy], [fx - .1 * u, gy + 2]], 1, '#5E5A62', 'HB', .2);
    paint(rectPts(fx - .6 * u, gy - 2.05 * u, 1.1 * u, 1.3 * u), { hatch: { d: 6, a: .8, b: 'HB', c: '#8A8690', w: .7 }, ink: null });
    // the hand and its pencil
    hand(hx, hy, hs, ha, { grip: .55, key: 'evoke hand', sleeve: '#4E5B78', side: 1 });
    inkLine([P(-20, 14), P(135, 38)], 7, '#E3B341', 'ink', 0);
    paint([P(135, 32), P(150, 42), P(135, 46)], { wash: '#E8CFA8', ink: PAL.ink, sw: .8 });
    inkLine([P(146, 40), P(150, 42)], 3, PAL.ink, 'ink', 0);
    // the cuff's far end, not painted yet: bare pencil, with the wash stopping in loose strokes
    boilSeed('evoke cuff');
    const q = [P(-215, -40), P(-178, -40), P(-178, 40), P(-215, 40)];
    paint(q, { wash: '#FBF6EA', ink: null });
    paint(q, { hatch: { d: 7, a: ha + 1.3, b: 'HB', c: '#8A8690', w: .6 }, ink: null });
    inkLine([P(-178, -40), P(-215, -40), P(-215, 40), P(-178, 40)], 1, '#5E5A62', 'HB', .1);
    for (let i = 0; i < 5; i++) inkLine([P(-176, -34 + i * 17), P(-188 - (i % 2) * 8, -30 + i * 17)], 5, '#4E5B78', 'ink', .3);
    // Claude's brush, from its raised arm to the cuff's edge, loaded with the sleeve's blue
    const grip = [cx + 5.6 * u, gy - 7.4 * u], bt = P(-190, -10);
    inkLine([grip, [lerp(grip[0], bt[0], .5) - 10, lerp(grip[1], bt[1], .5) - 14], bt], 7, '#8A5A3A', 'ink', .4);
    paint(ellPts(bt[0], bt[1], 18, 10, 16, 0, Math.atan2(bt[1] - grip[1], bt[0] - grip[0])), { wash: '#4E5B78', ink: PAL.ink, sw: .8 });
  });

  // After Magritte's The Treachery of Images (1929): a picture of a thing isn't the thing. A frog, framed, on the wall;
  // under it, the animal Claude actually named, looking up at it.
  LOOPS.evoke_pipe = still(t => {
    wall('#E6DCC6', '#D4C4A4');
    boilSeed('evoke frame');
    paint(rectPts(560, 90, 800, 560), { wash: '#8C6A3E', fill: '#6E5230', fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.4 });
    paint(rectPts(610, 140, 700, 460), { wash: '#F2E8D2', fill: '#E6D8B8', fillOp: 50, tex: .4, ink: PAL.ink, sw: 1 });
    frog(960, 560, 70, { look: 0, boilKey: 'evoke framed frog', noShadow: true });
    inkLine([[900, 88], [960, 30], [1020, 88]], 1.4, PAL.ink, 'ink', .2);
    // the floor, and the axolotl, head tilted up at the painting
    boilSeed('evoke floor');
    paint(rectPts(-40, 840, W + 80, 300), { wash: '#B98A5E', fill: '#9A6E48', fillOp: 80, tex: .6, ink: PAL.ink, sw: 1 });
    axolotl(1000, 960, 34, { look: -.6, boilKey: 'evoke axo', gills: 1 });
  });

  // After Magritte's Not to Be Reproduced (1937): a mirror that shows the back of your head. Curt at the Desk, from
  // behind, and on the main monitor, where Claude should be: Curt, from behind.
  SCREEN_KINDS.curtBack = (x, y, w, h, t) => {
    boilSeed('evoke screen');
    paint(rectPts(x, y, w, h), { wash: '#3A3444', fill: '#2A2533', fillOp: 90, ink: null });
    const u = 24;
    curtAs(x + w / 2, y + h + 1.5 * u, u, { view: 'back', pose: 'sit', handL: [1.5, -1.7], handR: [-1.5, -1.8], seed: 2, boilKey: 'mirror' });
    boilSeed('evoke screen desk');
    paint(rectPts(x, y + h - 34, w, 34), { wash: '#B98A5E', fill: '#9A6E48', fillOp: 90, ink: PAL.ink, sw: .8 });
  };
  LOOPS.evoke_mirror = still(t => deskShot(4, { hour: 9, screens: { main: { kind: 'curtBack', glow: '#C8C0D8' } } }));

  // After Dalí's Lobster Telephone (1936), for Crustafarianism: a desk telephone whose handset is a lobster's claw.
  LOOPS.evoke_phone = still(t => {
    wall('#E4D8C2', '#CDBB98');
    boilSeed('evoke table');
    paint(rectPts(-40, 700, W + 80, 420), { wash: '#6E4E3A', fill: '#553A2A', fillOp: 80, tex: .6, ink: PAL.ink, sw: 1.2 });
    // the telephone's body and its dial
    boilSeed('evoke phone');
    paint([[700, 780], [1220, 780], [1170, 560], [750, 560]], { wash: '#26222A', fill: '#1A171D', fillOp: 80, ink: PAL.ink, sw: 1.4 });
    paint(ellPts(960, 680, 90, 70, 30), { wash: '#E9E2D4', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 10; i++) { const a = -2.4 + i * .5; paint(ellPts(960 + Math.cos(a) * 62, 680 + Math.sin(a) * 48, 13, 11, 14), { wash: '#26222A', ink: null }); }
    paint(ellPts(960, 680, 22, 18, 16), { wash: '#C0493A', ink: PAL.ink, sw: .8 });
    // the cradle's two prongs, and the claw lying across them: its heel is the earpiece, its pincers the mouthpiece
    for (const px of [800, 1120]) paint(rrPts(px - 26, 520, 52, 50, 10), { wash: '#26222A', ink: PAL.ink, sw: 1 });
    boilSeed('evoke claw');
    const red = '#C8412E', redDk = '#8E2A1E';
    paint(ellPts(760, 500, 110, 62, 30, 0, -.1), { wash: red, fill: redDk, fillOp: 70, ink: PAL.ink, sw: 1.3 });   // the heel
    paint([[820, 450], [1060, 440], [1080, 540], [830, 555]], { wash: red, fill: redDk, fillOp: 60, ink: PAL.ink, sw: 1.3, curv: .6 });
    paint([[1040, 430], [1260, 380], [1330, 430], [1190, 470], [1070, 505]], { wash: red, fill: redDk, fillOp: 60, ink: PAL.ink, sw: 1.3, curv: .5 });   // the top pincer
    paint([[1060, 505], [1210, 500], [1300, 540], [1180, 560], [1070, 548]], { wash: red, fill: redDk, fillOp: 60, ink: PAL.ink, sw: 1.3, curv: .5 });   // the lower pincer
    for (let i = 0; i < 7; i++) paint(ellPts(1120 + i * 22, 470 - i * 8 + (i % 2) * 6, 4, 3, 8), { wash: '#F2D2B0', ink: null });   // the teeth
    // the cord, coiled, back to the body
    const cord = []; for (let k = 0; k <= 60; k++) { const s = k / 60; cord.push([lerp(700, 690, s) - 60 * Math.sin(s * Math.PI) + 14 * Math.cos(k * 1.6), lerp(540, 760, s) + 10 * Math.sin(k * 1.6)]); }
    inkLine(cord, 3, '#26222A', 'ink', .5);
  });
})();
