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

// ---------- The Desk ----------
// Curt's real habitat: a standing desk with too many monitors and laptops, seen from behind him (over the shoulder), so
// the screens face the camera. Claude is on the main monitor; the others carry whatever the conversation is about: QR
// codes, repainted charts, the debate video, code. A push-in to any screen (deskCam) fills the frame with it, which is
// how a feature QR code gets big enough to scan.
//   desk(t, { screens: { main: { kind: 'claude', ... }, left: { kind: 'qr', url, style }, ... }, hour, dim })
//   deskFront(t, o)   what's in front of the screens: the desk top, keyboard, mug; call it after the monitors and before
//                     Curt (who stands in front of everything)
//   deskCam(name, k)  camera [cx, cy, zoom] from the wide desk shot (k = 0) to that screen filling the frame (k = 1)
// Screen contents are painters in SCREEN_KINDS: add a kind there and any monitor can show it.
const DESK = {
  // x, y, w, h of each screen's glass
  screens: {
    main:  [700, 240, 540, 320],
    left:  [240, 300, 420, 250],
    right: [1280, 300, 420, 250],
    upL:   [470, 20, 400, 200],
    upR:   [1070, 20, 400, 200],
    tall:  [1740, 190, 160, 290],
    lapL:  [110, 600, 280, 170],
    lapR:  [1530, 610, 280, 170],
  },
  deskY: [690, 860],                   // the desk top's back and front edges
  curt: [560, 1260, 50],               // Curt from behind: hip (below the frame), u
  cam: [960, 540, 1],
};

const SCREEN_KINDS = {
  off: (x, y, w, h) => paint(rectPts(x, y, w, h), { wash: '#15131A', ink: null }),
  // anything: o.fn(x, y, w, h, t) paints the screen (a scene's own picture)
  fn: (x, y, w, h, t, o) => o.fn(x, y, w, h, t),
  // Claude: the app's dark canvas, Claude in the middle (look.js decides how Claude appears), a few wordless message
  // bubbles scrolled up behind
  claude: (x, y, w, h, t, o) => {
    paint(rectPts(x, y, w, h), { wash: '#262229', ink: null });
    for (let i = 0; i < 3; i++) paint(rrPts(x + w * (i % 2 ? .52 : .08), y + h * (.08 + i * .1), w * .4, h * .06, h * .03), { wash: i % 2 ? '#3A3440' : '#4A3A36', ink: null });
    const u = o.u ?? h / 14;
    claudeAs(x + w / 2, y + h * .9, u, { ...(o.pose || {}), noShadow: true, boilKey: 'screen claude ' + x });
    glow(x + w / 2, y + h * .55, w * .45, '#E8956A', .35);
  },
  // a QR code on a cream page, as big as the screen allows (only big enough to scan after a push-in)
  qr: (x, y, w, h, t, o) => {
    paint(rectPts(x, y, w, h), { wash: '#EFE8DA', ink: null });
    const name = qrStyleFor(o.style || 'plain'), ext = qrStyle(name).extent ?? .64;
    qrCard(o.url, x + w / 2, y + h / 2, Math.min(w, h) * .96 / (2 * ext), name, { t, k: o.k ?? 1 });
  },
  // code: rows of syntax-coloured dashes (no letters), a blinking cursor
  code: (x, y, w, h, t, o) => {
    paint(rectPts(x, y, w, h), { wash: '#1E2230', ink: null });
    const cols = ['#8FB6E8', '#E8A36B', '#9CD68C', '#C6A0E8', '#D8D2C4'], rh = h / 11, scroll = Math.floor(t * (o.speed ?? 1.5));
    for (let r = 0; r < 10; r++) {
      let cx = x + w * .05 + hash(r + scroll) * 4 * (r % 3) * 6;
      for (let k = 0; k < 5 && cx < x + w * .92; k++) {
        const len = w * (.05 + .12 * hash((r + scroll) * 17 + k));
        paint(rrPts(cx, y + rh * (r + .6), Math.min(len, x + w * .94 - cx), rh * .38, rh * .15), { wash: cols[Math.floor(hash((r + scroll) * 5 + k) * 5)], ink: null });
        cx += len + w * .02;
      }
    }
    if (frac(t * 1.2) < .5) paint(rectPts(x + w * .1, y + rh * 10.2, w * .012, rh * .5), { wash: '#D8D2C4', ink: null });
  },
  // the frog/axolotl chart in miniature, row counts exact (see VIDEO_PLAN.md §3)
  frogchart: (x, y, w, h) => {
    paint(rectPts(x, y, w, h), { wash: '#FBFAF6', ink: null });
    const rows = [[3, 2, 4, 1], [10, 0, 0, 0], [9, 0, 0, 1], [9, 0, 0, 1], [9, 0, 0, 1], [7, 1, 0, 2], [4, 1, 3, 2], [2, 4, 2, 2], [1, 4, 2, 3], [1, 1, 6, 2]];
    const cols = ['#4E8F3A', '#9BCB5C', '#EE8FAE', '#A98BC9'], rh = h / 11.5, d = Math.min(rh * .8, w * .06);
    rows.forEach((row, r) => {
      let i = 0; const yy = y + rh * (r + 1 + (r > 0 ? .4 : 0) + (r > 5 ? .4 : 0));
      row.forEach((n, kind) => { for (let j = 0; j < n; j++, i++) paint(ellPts(x + w * .2 + i * d * 1.15, yy, d * .5, d * .42, 10), { wash: cols[kind], ink: null }); });
    });
  },
  // a video player: a dark frame, a painted thumbnail, a red progress bar, a play button
  video: (x, y, w, h, t, o) => {
    paint(rectPts(x, y, w, h), { wash: '#101014', ink: null });
    paint(rectPts(x + w * .05, y + h * .08, w * .9, h * .72), { wash: o.thumb || '#3B4A5E', fill: '#586B82', fillOp: 90, tex: .4, ink: null });
    paint([[x + w * .46, y + h * .34], [x + w * .46, y + h * .56], [x + w * .56, y + h * .45]], { wash: '#F4F1EA', ink: null });
    paint(rectPts(x + w * .05, y + h * .86, w * .9 * (o.progress ?? .35), h * .025), { wash: '#D93C3C', ink: null });
  },
};

function deskScreen(name, t, spec = {}) {
  const [x, y, w, h] = DESK.screens[name], lap = name.startsWith('lap');
  boilSeed('desk screen ' + name);
  // bezel (and, for monitors, a stand; for laptops, the keyboard deck in front)
  paint(rrPts(x - 10, y - 10, w + 20, h + 20, 8), { wash: '#1A181D', ink: PAL.ink, sw: 1 });
  if (!lap && name !== 'upL' && name !== 'upR') { paint(rectPts(x + w / 2 - 14, y + h + 10, 28, DESK.deskY[0] - y - h - 4), { wash: '#2A272E', ink: PAL.ink, sw: .8 }); }
  if (name === 'upL' || name === 'upR') inkLine([[x + w / 2, y + h + 10], [x + w / 2 + (name === 'upL' ? 60 : -60), y + h + 90], [x + w / 2 + (name === 'upL' ? 90 : -90), y + h + 150]], 3, '#2A272E', 'ink', .3);
  const kind = SCREEN_KINDS[spec.kind || 'code'] || SCREEN_KINDS.code;
  kind(x, y, w, h, t, spec);
  glow(x + w / 2, y + h / 2, Math.max(w, h) * .8, spec.glow || '#9DB8E8', (spec.kind === 'off' ? 0 : .22) * (spec.light ?? 1));
  if (lap) paint([[x - 10, y + h + 10], [x + w + 10, y + h + 10], [x + w + 40, y + h + 44], [x - 40, y + h + 44]], { wash: '#8C8894', fill: '#5E5A66', fillOp: 70, ink: PAL.ink, sw: 1 });
}

function desk(t, o = {}) {
  const hour = o.hour ?? 7.5, dim = o.dim ?? 0;
  boilSeed('desk wall');
  // the room: a dim wall, morning light from a window off to the right
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: mixCol('#3A3444', '#141218', dim), fill: '#2A2533', fillOp: 90, bleed: .2, tex: .6, ink: null });
  glow(W + 60, 180, 700, mixCol('#FFD9A0', '#FFF3D6', seg(hour, 7, 12)), .5 * (1 - dim));
  const S = o.screens || {};
  for (const name of ['upL', 'upR', 'tall', 'left', 'right', 'main']) if (S[name] !== null) deskScreen(name, t, S[name] || {});
  desk.screens = S;   // the laptops sit on the desk top, so deskFront draws them
  boilSeed('after desk');
}

function deskFront(t, o = {}) {
  boilSeed('desk front');
  const [yb, yf] = DESK.deskY;
  // the desk top, seen from behind and above: back edge, front edge, then the front apron off the bottom of the frame
  paint([[40, yb], [W - 40, yb], [W + 60, yf], [-60, yf]], { wash: '#B98A5E', fill: '#9A6E48', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1.4 });
  paint(rectPts(-60, yf, W + 120, 260), { wash: '#7E5A3C', fill: '#5E4230', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1.2 });
  // the laptops, on the desk
  for (const name of ['lapL', 'lapR']) if ((desk.screens || {})[name] !== null) deskScreen(name, t, (desk.screens || {})[name] || {});
  boilSeed('desk front items');
  // keyboard, mouse, a mug
  paint([[760, yb + 60], [1160, yb + 60], [1180, yb + 120], [740, yb + 120]], { wash: '#2E2B33', ink: PAL.ink, sw: 1 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 14; c++) paint(rectPts(772 + c * 28.5 + r * 3, yb + 68 + r * 16, 22, 11), { wash: '#4A4652', ink: null });
  paint(ellPts(1250, yb + 100, 22, 14, 14), { wash: '#DDD6CC', ink: PAL.ink, sw: .9 });
  paint(rrPts(1380, yb + 40, 70, 80, 10), { wash: '#C0493A', ink: PAL.ink, sw: 1.1 });
  paint(ellPts(1415, yb + 42, 35, 9, 14), { wash: '#3A2418', ink: PAL.ink, sw: .8 });
  inkLine([[1450, yb + 60], [1478, yb + 70], [1476, yb + 100], [1450, yb + 106]], 2.4, PAL.ink, 'ink', .5);
  if (o.steam !== false) for (let i = 0; i < 2; i++) { const s0 = frac(t * .3 + i * .5); inkLine([[1405 + i * 16, yb + 30 - s0 * 90], [1400 + i * 16 + Math.sin(t * 2 + i) * 8, yb + 10 - s0 * 110], [1408 + i * 16, yb - 10 - s0 * 130]], .9, mixCol('#FFFFFF', '#3A3444', .4 + s0 * .6), 'inkfine', .6); }
  boilSeed('after desk front');
}

// Camera from the wide desk shot (k = 0) to one screen filling ~92% of the frame (k = 1).
function deskCam(name, k) {
  const [x, y, w, h] = DESK.screens[name], z = Math.min(W * .92 / w, H * .92 / h), e = ease(k);
  return [lerp(DESK.cam[0], x + w / 2, e), lerp(DESK.cam[1], y + h / 2, e), lerp(DESK.cam[2], z, e)];
}
