// sets.js: the film's recurring places.
//
//   booth(t, o)    The Booth: an interrogation room (the comic's "What did that ape say?") where Curt and Clawd sit on
//                  either side of a table, under a hanging lamp, in front of a two-way mirror. Tangents open THROUGH the
//                  mirror. A window high on the left shows the real morning: o.hour runs 7 (cool dawn) → 12 (noon gold).
//                  Draws the room behind the characters; call boothTable() after them, so the table hides their legs.
//   BOOTH          layout constants (seat points, the sill, the mirror rect) for placing characters and props
//
// World coordinates are the 1920×1080 frame at rest; shots move the camera over it.

const BOOTH = {
  mirror: [640, 110, 640, 430],       // x, y, w, h of the glass
  window: [270, 170, 300, 290],
  sill: [270, 460, 300],                // x, y (top of the sill), w: where the frog and axolotl sit
  tableY: 890,                         // the table top's front edge
  curt: [570, 925, 33],                // Curt's seat (hip) point and u, sitting at the table
  clawd: [1360, 915, 30],              // Clawd's ground point and u: his face clears the table top
  lamp: [960, 175],                    // bulb centre (world)
  cam: [960, 660, 1.3],                // the default medium two-shot: heads flanking the mirror
};

// The sky through the window by hour: dawn blue → morning → late-morning gold; `alarm` (0..1) bruises it red (July).
function boothSky(hour, alarm = 0) {
  const keys = [[7, ['#6C86B8', '#B9C6DA']], [8.5, ['#86B4DC', '#DCE6D8']], [10, ['#8EC3E6', '#F1E6C8']], [12, ['#E8C27A', '#FFF1CE']]];
  let [top, low] = keys[0][1];
  for (let i = 1; i < keys.length; i++) if (hour >= keys[i - 1][0]) { const k = seg(hour, keys[i - 1][0], keys[i][0]); top = mixCol(keys[i - 1][1][0], keys[i][1][0], k); low = mixCol(keys[i - 1][1][1], keys[i][1][1], k); }
  return [mixCol(top, '#7A2F3A', .6 * alarm), mixCol(low, '#C2665A', .5 * alarm)];
}

function booth(t, o = {}) {
  const hour = o.hour ?? 7.5, alarm = o.alarm ?? 0, [skyTop, skyLow] = boothSky(hour, alarm);
  const wall = mixCol('#6F8387', '#5B3D46', .5 * alarm), wallDk = mixCol(wall, PAL.ink, .3);
  // back wall, with a darker band of wainscot low down
  boilSeed('booth wall');
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: wall, fill: wallDk, fillOp: 60, bleed: .15, tex: .6, border: .3, ink: null });
  paint(rectPts(-200, 820, W + 400, 500), { fill: wallDk, fillOp: 140, bleed: .1, tex: .5, ink: null });
  inkLine([[-100, 822], [W / 2, 818], [W + 100, 823]], 1.1, PAL.ink, 'ink', .3);

  // the window: the sky, a cloud drifting, mullions, the sill
  boilSeed('booth window');
  const [wx, wy, ww, wh] = BOOTH.window;
  paint(rectPts(wx, wy, ww, wh), { wash: skyLow, fill: skyTop, fillOp: 200, bleed: .2, tex: .4, border: .6, ink: null });
  const cx = wx + ((t * 6 + 60) % (ww + 160)) - 80;
  paint(ellPts(cx, wy + 90, 70, 22, 16, 2), { fill: PAL.cream, fillOp: 170, bleed: .3, tex: .3, ink: null });
  paint(ellPts(cx + 40, wy + 78, 42, 18, 14, 2), { fill: PAL.cream, fillOp: 150, bleed: .3, tex: .3, ink: null });
  const frameC = '#D8CDB8';
  for (const [x0, y0, w0, h0] of [[wx - 14, wy - 14, ww + 28, 16], [wx - 14, wy + wh - 2, ww + 28, 16], [wx - 14, wy - 14, 16, wh + 28], [wx + ww - 2, wy - 14, 16, wh + 28], [wx + ww / 2 - 6, wy, 12, wh], [wx, wy + wh / 2 - 6, ww, 12]])
    paint(rectPts(x0, y0, w0, h0), { wash: frameC, ink: PAL.ink, sw: .9 });
  const [sx, sy, sw_] = BOOTH.sill;
  paint(rectPts(sx - 34, sy, sw_ + 68, 22), { wash: '#CFC2A8', ink: PAL.ink, sw: 1 });
  // light from the window, falling across the wall
  glow(wx + ww / 2, wy + wh / 2, 380, mixCol('#FFE2A8', skyLow, .4), .35 + .25 * seg(hour, 7, 12));

  // the two-way mirror: dark glass, a faint reflection of the room, streaks, a heavy frame
  boilSeed('booth mirror');
  const [mx, my, mw, mh] = BOOTH.mirror;
  paint(rectPts(mx - 22, my - 22, mw + 44, mh + 44), { wash: '#3C3438', ink: PAL.ink, sw: 1.4 });
  paint(rectPts(mx, my, mw, mh), { wash: mixCol('#26323A', wall, .15), fill: '#3E5560', fillOp: 110, bleed: .25, tex: .5, border: .5, ink: PAL.ink, sw: .8 });
  if (o.mirrorGlow) glow(mx + mw / 2, my + mh / 2, mw * .6, o.mirrorGlow, 1);
  for (let i = 0; i < 3; i++) {   // reflection streaks
    const x = mx + mw * (.18 + i * .09);
    paint([[x, my + 10], [x + 60, my + 10], [x - 60 + 60, my + mh - 10], [x - 120 + 60, my + mh - 10]], { wash: '#8FA5AE', washOp: 40 - i * 10, ink: null });
  }
  if (o.inMirror) o.inMirror(mx, my, mw, mh);

  // the lamp: a cord from the ceiling, a tin shade, a bulb that really shines
  boilSeed('booth lamp');
  const [lx, ly] = BOOTH.lamp, swing = Math.sin(t * .9) * .02 + (o.lampKick ? spring(t, o.lampKick, 3, 7) * .12 : 0);
  push(); translate(lx, -20); rotate(swing); translate(-lx, 20);
  inkLine([[lx, -40], [lx, ly - 60]], 1.2, PAL.ink, 'ink', 0);
  paint([[lx - 16, ly - 64], [lx + 16, ly - 64], [lx + 90, ly], [lx - 90, ly]], { wash: '#7C8A6A', fill: '#4F5B44', fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.2 });
  paint(ellPts(lx, ly + 4, 22, 14, 14), { wash: '#FFF1C4', ink: PAL.ink, sw: .8 });
  const lampOn = o.lamp ?? 1;
  if (lampOn > 0) {
    glow(lx, ly + 10, 160, '#FFD27A', .9 * lampOn);
    // the cone of light on the table, as a soft wash
    paint([[lx - 80, ly + 8], [lx + 80, ly + 8], [lx + 520, BOOTH.tableY + 10], [lx - 520, BOOTH.tableY + 10]], { wash: '#FFE9B0', washOp: 26 * lampOn, ink: null });
  }
  pop();
  boilSeed('after booth');
}

// The table, drawn after the characters so it hides their legs.
function boothTable(t, o = {}) {
  boilSeed('booth table');
  const y = BOOTH.tableY, wood = '#8A5A3C', top = '#A8744F';
  paint([[180, y - 40], [W - 180, y - 40], [W - 120, y + 8], [120, y + 8]], { wash: top, fill: '#C48E62', fillOp: 90, bleed: .1, tex: .6, ink: PAL.ink, sw: 1.4 });
  paint(rectPts(120, y + 8, W - 240, H - y + 40), { wash: wood, fill: mixCol(wood, PAL.ink, .3), fillOp: 120, bleed: .1, tex: .7, border: .4, ink: PAL.ink, sw: 1.4 });
  for (let i = 0; i < 3; i++) inkLine([[160, y + 70 + i * 70 + hash(i) * 10], [W / 2, y + 66 + i * 70], [W - 160, y + 72 + i * 70]], .5, mixCol(wood, PAL.ink, .5), 'inkfine', .4);
  if (o.lamp !== 0) glow(BOOTH.lamp[0], y - 20, 420, '#FFD27A', .25);
  boilSeed('after table');
}
