// thumbnail.js: the YouTube thumbnail, painted by the film's own brushes (npm run thumbnail → docs/thumbnail.jpg).
// Not loaded by studio.html (every script it loads is part of the chapters' render cache, so an edit here would redraw
// the whole film): render.mjs --add-script injects it, and it adds LOOPS.thumbnail.
// The film's question, big: Curt asks for an amphibian; the frog is the answer a model gives when it thinks it's being
// tested, the axolotl the one it gives when it thinks it's deployed. The chart that measured it sits behind them.
(() => {
  LOOPS.thumbnail = t => {
    // a warm wall, and the pond the two stand by
    boilSeed('thumb wall');
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, fill: '#EADCC2', fillOp: 70, bleed: .2, tex: .6, ink: null });
    glow(960, 620, 900, '#FFE3B0', .55);
    // the chart behind them: the film's evidence (upright: its lettering is laid out in screen space)
    frogChart(590, 285, 740, 545, { k: 1, t });
    boilSeed('thumb pond');
    paint(ellPts(960, 985, 1150, 150, 40), { wash: '#9CC7C0', fill: '#6FA8A0', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1 });
    // the frog on a lily pad (left), the axolotl in the shallows (right), eyeing each other
    boilSeed('thumb pad'); paint(ellPts(640, 965, 200, 46, 24), { wash: PAL.sap, fill: '#5A8A47', fillOp: 60, ink: PAL.ink, sw: 1.2 });
    frog(640, 960, 36, { look: .8, boilKey: 'thumb frog' });
    axolotl(1235, 990, 30, { flip: true, look: .8, gills: .9, wiggle: .6, boilKey: 'thumb axo' });
    // Curt asking (left edge), Claude answering (right edge)
    curtAs(250, 1068, 23, { look: .6, mouth: 'smile', handR: 'point', seed: 3, boilKey: 'thumb curt' });
    clawd(1655, 1030, 30, { ...feel('happy', t), lookX: -.6, aL: .9, boilKey: 'thumb clawd' });
    // the title on a cream brush band, as the cold open paints it
    boilSeed('thumb title band');
    paint([[150, 70], [1780, 52], [1810, 150], [1780, 262], [150, 250], [120, 160]], { wash: PAL.cream, fill: '#F2E2C0', fillOp: 90, tex: .5, ink: null });
    letter('Frog or Axolotl?', 965, 160, 176, PAL.clayDk, { rot: -.02 });
  };
  LOOPS.thumbnail.len = 1;
})();
