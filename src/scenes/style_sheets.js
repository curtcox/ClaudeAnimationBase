// style_sheets.js: Frog or Axolotl's look-development sheets, as standalone loops (labels are fine here: they're
// reference, not film). Scrub at studio.html?loop=booth_test (or qr_styles, cast), or render:
//   node render.mjs --loop=qr_styles --stills=1 --out=out/style
(() => {
  const label = (txt, x, y, size = 22) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .8 });

  // Six QR styles, each on the reference it dresses (all scan: see tools/qr_check.mjs --styles)
  LOOPS.qr_styles = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { fill: '#E9DFC9', fillOp: 90, bleed: .2, tex: .4, ink: null });
    const cards = [
      ['newsprint', 'https://www.madcoversite.com/mad157.html', 'MAD #157'],
      ['lilypad', 'https://x.com/fjzzq2002/status/2103556166903038213/photo/1', 'Frog or axolotl?'],
      ['red-lens', 'https://en.wikipedia.org/wiki/HAL_9000', 'HAL 9000'],
      ['xkcd', 'https://xkcd.com/356/', 'xkcd: Nerd Sniping'],
      ['dinner-plate', 'https://hitchhikers.fandom.com/wiki/Ameglian_Major_Cow', 'The Dish of the Day'],
      ['sandbox', 'https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident', 'The OpenAI–Hugging Face incident'],
    ];
    cards.forEach(([style, url, cap], i) => {
      const cx = 320 + (i % 3) * 640, cy = 250 + Math.floor(i / 3) * 540;
      qrCard(url, cx, cy, 250, style, { ecc: 'H', t, caption: cap, captionOpts: { size: 26 } });
      label(style, cx, cy - 235, 18);
    });
  };
  LOOPS.qr_styles.len = 4;

  // The cast, with Clawd for scale
  LOOPS.cast = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { fill: '#E9DFC9', fillOp: 90, bleed: .2, tex: .4, ink: null });
    const gy = 470, u = 20;
    curt(170, gy, u, { look: .3, seed: 1 });
    curt(440, gy, u, { talk: talk(t, 0, 4), brows: 'up', handR: 'point', seed: 2 });
    curt(710, gy, u, { brows: 'skeptic', mouth: 'flat', handR: 'chin', seed: 3 });
    curt(980, gy, u, { brows: 'up', mouth: 'smile', handL: 'up', handR: 'up', seed: 4 });
    ['neutral', 'talking', 'skeptical', 'delighted'].forEach((s, i) => label(s, 170 + i * 270, gy + 40));
    clawd(1380, gy, 22, feel('neutral', t, { lookX: -.6 }));
    label('Clawd, for scale', 1380, gy + 40);
    for (let x = 60; x < W; x += 400) inkLine([[x, gy + 6], [x + 360, gy + 4]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5);
    // the motif pair
    const gy2 = 900;
    frog(420, gy2, 26, { look: .6, blink: frac(t / 2.3) < .06, croak: Math.max(0, Math.sin(t * 2.2)) ** 6 });
    label('the frog: "Frog."', 420, gy2 + 45);
    axolotl(1180, gy2, 22, { look: -.3, blink: frac(t / 3.1 + .4) < .05 });
    label('the axolotl: "Axolotl."', 1180, gy2 + 45);
    inkLine([[120, gy2 + 8], [1700, gy2 + 5]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5);
  };
  LOOPS.cast.len = 4;

  // The Booth at 7:30 in the morning: "Name an amphibian." / "Axolotl.", and the axolotl turns up on the sill
  LOOPS.booth_test = t => {
    const [bx, by, bz] = BOOTH.cam;
    camBegin(bx + 12 * Math.sin(t * .35), by, bz + .012 * t);
    booth(t, { hour: 7.4 + t * .05 });
    // on the sill: the frog is already there; the axolotl climbs up when Clawd answers
    const [sx, sy, sw] = BOOTH.sill;
    frog(sx + 80, sy + 2, 13, { look: t > 3.3 ? 1 : .2, blink: frac(t / 2.7) < .05, boilKey: 'sillfrog' });
    const up = backOut(seg(t, 3.1, 3.7));
    if (up > 0) axolotl(sx + 215, sy + 2 + (1 - up) * 60, 9, { look: -.5, boilKey: 'sillaxo' });
    // Curt asks, Clawd answers
    const q = talk(t, .4, 1.6), a = talk(t, 2.3, 2.95);
    const [cx_, cy_, cu] = BOOTH.curt, [kx, ky, ku] = BOOTH.clawd;
    curt(cx_, cy_, cu, { pose: 'sit', hand: 'table', lean: .06 + .04 * Math.sin(t * .8), talk: q, brows: t > 2.3 && t < 3.4 ? 'up' : 'none', look: .6, seed: 5 });
    const mood = emotions(t, [[0, 'neutral', { lookX: -.8 }], [2.1, 'playful', { lookX: -.5 }], [3.4, 'happy', { lookX: -1 }]]);
    clawd(kx, ky, ku, { ...mood, mouth: clawdMouth(a, mood.mouth), view: 'q', flip: true, aL: -.35, aR: -.1 });
    boothTable(t);
    camEnd();
  };
  LOOPS.booth_test.len = 5;
})();
