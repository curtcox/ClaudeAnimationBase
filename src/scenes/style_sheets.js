// style_sheets.js: Frog or Axolotl's look-development sheets, as standalone loops (labels are fine here: they're
// reference, not film). Scrub at studio.html?loop=desk_test (or curt_variants, claude_crowd, qr_styles, cast,
// booth_test), or render:  node render.mjs --loop=qr_styles --stills=1 --out=out/style
(() => {
  const label = (txt, x, y, size = 22) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .8 });
  const paper = () => paint(rectPts(-40, -40, W + 80, H + 80), { fill: '#E9DFC9', fillOp: 90, bleed: .2, tex: .4, ink: null });
  const floor = (y, x0 = 40, x1 = W - 40) => inkLine([[x0, y + 6], [(x0 + x1) / 2, y + 4], [x1, y + 7]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5);

  // Seven QR styles on the references they dress (all scan: tools/qr_check.mjs --styles). The MAD Fold-In folds over
  // the first three seconds.
  LOOPS.qr_styles = t => {
    paper();
    const cards = [
      ['mad', 'https://www.madcoversite.com/mad157.html', 'MAD #157', { k: seg(t, 0, 3) }],
      ['lilypad', 'https://x.com/fjzzq2002/status/2103556166903038213/photo/1', 'Frog or axolotl?'],
      ['red-lens', 'https://en.wikipedia.org/wiki/HAL_9000', 'HAL 9000'],
      ['xkcd', 'https://xkcd.com/356/', 'xkcd: Nerd Sniping'],
      ['dinner-plate', 'https://hitchhikers.fandom.com/wiki/Ameglian_Major_Cow', 'The Dish of the Day'],
      ['sandbox', 'https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident', 'The OpenAI–Hugging Face incident'],
    ];
    cards.forEach(([style, url, cap, o], i) => {
      const cx = 320 + (i % 3) * 640, cy = 250 + Math.floor(i / 3) * 540;
      qrCard(url, cx, cy, 250, qrStyleFor(style), { ecc: 'H', t, caption: cap, captionOpts: { size: 26 }, ...(o || {}) });
      label(qrStyleFor(style), cx, cy - 235, 18);
    });
  };
  LOOPS.qr_styles.len = 5;

  // The MAD Fold-In, big, folding: for a strip
  LOOPS.foldin = t => { paper(); qrCard('https://www.madcoversite.com/mad157.html', W / 2, H / 2 - 30, 520, 'foldin', { ecc: 'H', t, k: seg(t, 0, 3), caption: 'MAD #157: Conquering The Planet That Went Ape' }); };
  LOOPS.foldin.len = 4;

  // Curt, twelve ways: pick one (look.js: LOOK.curt = CURT_VARIANTS.X). Backs underneath, for the over-the-shoulder desk.
  LOOPS.curt_variants = t => {
    paper();
    const keys = Object.keys(CURT_VARIANTS), u = 15;
    keys.forEach((k, i) => {
      const x = 110 + (i % 6) * 300 + 20, gy = 330 + Math.floor(i / 6) * 330;
      curt(x, gy, u, { ...CURT_VARIANTS[k], look: .3, mouth: 'smile', seed: i, boilKey: 'v' + k, handR: i % 3 === 1 ? 'chin' : undefined });
      curt(x + 125, gy - 60, u * .7, { ...CURT_VARIANTS[k], view: 'back', seed: i, boilKey: 'b' + k, noShadow: true });
      label(k, x - 70, gy - 250, 44);
      const v = CURT_VARIANTS[k];
      label([v.hair, v.outfit, v.facial].filter(s => s && s !== 'none' && s !== 'stick').join(' · ') || 'plain', x + 40, gy + 34, 18);
    });
    floor(330); floor(660);
    label('front, and from behind (for the desk), in each look', W / 2, 1000, 24);
  };
  LOOPS.curt_variants.len = 4;

  // Who wears what (cast.js: PEOPLE, then CROWD, the crowds' wardrobe), each from the front and from behind
  LOOPS.wardrobe = t => {
    paper();
    const rows = [Object.entries(PEOPLE), CROWD.map((c, i) => [c.outfit + (c.bands ? ' (Breton)' : ''), c])];
    rows.forEach((row, r) => row.forEach(([name, look], i) => {
      const x = 90 + i * (r ? 205 : 265), gy = 420 + r * 470, u = 14;
      curt(x, gy, u, { facial: 'none', ...look, look: .3, mouth: 'smile', seed: i, boilKey: 'w' + r + i, handR: i % 3 === 1 ? 'chin' : undefined });
      curt(x + 95, gy - 40, u * .6, { facial: 'none', ...look, view: 'back', seed: i, boilKey: 'wb' + r + i, noShadow: true });
      label(name, x + 30, gy + 34, 20);
    }));
    floor(420); floor(890);
  };
  LOOPS.wardrobe.len = 2;

  // Claude as a crowd: assembling into Clawd (k = 0 → 1), then Clawd acting
  LOOPS.claude_crowd = t => {
    paper();
    [0, .35, .65, .85, 1].forEach((k, i) => {
      const x = 230 + i * 365;
      clawdCrowd(x, 520, 17, k, { ...feel(k < 1 ? 'neutral' : 'happy', t), boilKey: 'c' + i, t });
      label(`k = ${k}`, x, 560);
    });
    floor(520);
    const k = clamp(seg(t, .5, 2.5)), m = talk(t, 3, 4.5);
    clawdCrowd(W / 2, 930, 20, k, { ...emotions(t, [[0, 'neutral'], [2.6, 'happy']]), mouth: clawdMouth(m), boilKey: 'live' });
    label('gathering, then speaking', W / 2, 975);
    floor(930, 600, 1320);
  };
  LOOPS.claude_crowd.len = 5;

  // The desk, over Curt's shoulder: Claude gathers on the main monitor and answers; the other screens carry the
  // conversation's references; then the camera pushes into the left monitor until its QR code fills the frame.
  LOOPS.desk_test = t => {
    const c = t < 4 ? DESK.cam : deskCam('left', seg(t, 4, 5.4));
    camBegin(c[0] + 8 * Math.sin(t * .4), c[1], c[2]);
    const k = ease(seg(t, .6, 2.2)), a = talk(t, 2.6, 3.4);
    desk(t, { hour: 7.6, screens: {
      main: { kind: 'claude', pose: { ...emotions(t, [[0, 'neutral'], [2.4, 'happy']]), assemble: k, mouth: clawdMouth(a) } },
      left: { kind: 'qr', url: 'https://x.com/fjzzq2002/status/2103556166903038213/photo/1', style: 'lilypad' },
      right: { kind: 'frogchart' },
      upL: { kind: 'code' },
      upR: { kind: 'video', thumb: '#4A3B5E' },
      tall: { kind: 'code', speed: 3 },
      lapL: { kind: 'qr', url: 'https://www.madcoversite.com/mad157.html', style: 'mad', k: seg(t, .5, 3.5) },
      lapR: { kind: 'code', speed: .7 },
    } });
    deskFront(t);
    const [hx, hy, hu] = DESK.curt;
    curtAs(hx, hy, hu, { view: 'back', pose: 'sit', lean: .04 * Math.sin(t * .7), handL: [1.5, -1.7], handR: [-1.5, -1.8 + .12 * Math.sin(t * 9)], seed: 2 });
    camEnd();
  };
  LOOPS.desk_test.len = 6;

  // Curt as chosen (LOOK.curt), front, three-quarter-ish poses and back
  LOOPS.curt_look = t => {
    paper();
    curtAs(330, 820, 30, { look: .3, mouth: 'smile', seed: 1 });
    curtAs(820, 820, 30, { talk: talk(t, 0, 4), brows: 'up', handR: 'point', seed: 2 });
    curtAs(1300, 820, 30, { view: 'back', seed: 3 });
    curtAs(1680, 820, 22, { flip: true, brows: 'skeptic', handL: 'chin', seed: 4 });
    floor(820);
  };
  LOOPS.curt_look.len = 4;

  // The cast, with Clawd for scale
  LOOPS.cast = t => {
    paper();
    const gy = 470, u = 20;
    curtAs(170, gy, u, { look: .3, seed: 1 });
    curtAs(440, gy, u, { talk: talk(t, 0, 4), brows: 'up', handR: 'point', seed: 2 });
    curtAs(710, gy, u, { brows: 'skeptic', mouth: 'flat', handR: 'chin', seed: 3 });
    curtAs(980, gy, u, { brows: 'up', mouth: 'smile', handL: 'up', handR: 'up', seed: 4 });
    ['neutral', 'talking', 'skeptical', 'delighted'].forEach((s, i) => label(s, 170 + i * 270, gy + 40));
    clawd(1380, gy, 22, feel('neutral', t, { lookX: -.6 }));
    label('Clawd, for scale', 1380, gy + 40);
    floor(gy);
    const gy2 = 900;
    frog(420, gy2, 26, { look: .6, blink: frac(t / 2.3) < .06, croak: Math.max(0, Math.sin(t * 2.2)) ** 6 });
    label('the frog: "Frog."', 420, gy2 + 45);
    axolotl(1180, gy2, 22, { look: -.3, blink: frac(t / 3.1 + .4) < .05 });
    label('the axolotl: "Axolotl."', 1180, gy2 + 45);
    floor(gy2);
  };
  LOOPS.cast.len = 4;

  // The Booth at 7:30 in the morning: "Name an amphibian." / "Axolotl.", and the axolotl turns up on the sill
  LOOPS.booth_test = t => {
    const [bx, by, bz] = BOOTH.cam;
    camBegin(bx + 12 * Math.sin(t * .35), by, bz + .012 * t);
    booth(t, { hour: 7.4 + t * .05 });
    const [sx, sy] = BOOTH.sill;
    frog(sx + 80, sy + 2, 13, { look: t > 3.3 ? 1 : .2, blink: frac(t / 2.7) < .05, boilKey: 'sillfrog' });
    const up = backOut(seg(t, 3.1, 3.7));
    if (up > 0) axolotl(sx + 215, sy + 2 + (1 - up) * 60, 9, { look: -.5, boilKey: 'sillaxo' });
    const q = talk(t, .4, 1.6), a = talk(t, 2.3, 2.95), [cx_, cy_, cu] = BOOTH.curt, [kx, ky, ku] = BOOTH.clawd;
    curtAs(cx_, cy_, cu, { pose: 'sit', hand: 'table', lean: .06 + .04 * Math.sin(t * .8), talk: q, brows: t > 2.3 && t < 3.4 ? 'up' : 'none', look: .6, seed: 5 });
    const mood = emotions(t, [[0, 'neutral', { lookX: -.8 }], [2.1, 'playful', { lookX: -.5 }], [3.4, 'happy', { lookX: -1 }]]);
    claudeAs(kx, ky, ku, { ...mood, mouth: clawdMouth(a, mood.mouth), view: 'q', flip: true, aL: -.35, aR: -.1, assemble: 1 });
    boothTable(t);
    camEnd();
  };
  LOOPS.booth_test.len = 5;
})();
