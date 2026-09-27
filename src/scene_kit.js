// scene_kit.js: what every chapter scene reaches for. Loaded after boards.js, before the chapter's scene file.
//
//   lab(txt, x, y, size, col, o)   hand lettering (Patrick Hand), for labels painted from the transcript
//   atWord(id, 'phrase', k)        the moment a phrase is said inside a line (by its place in the line's speech), + k s
//   deskShot(t, o)                 the Desk over Curt's shoulder, Claude on the main monitor (see below for o)
//   pushInto(name, k)              a push from the wide desk into one screen (k 0..1); at 1 cut to that screen's world
//   paperWorld(t, col), darkWorld(t)   full-frame grounds for the worlds inside the monitors
//   fade(k, col)                   a full-frame veil (k = 1 opaque), e.g. fading up from black
//   rectAt(a, b, k)                a rect [x, y, w, h] part way from a to b (for things that fly between screens)
//   prop cards: indexCard, doorway, balance, logbook (small, reusable pictures several chapters need)

const lab = (txt, x, y, size, col = PAL.ink, o = {}) => letter(txt, x, y, size, col, { ink: false, font: `${Math.round(size)}px "Patrick Hand", sans-serif`, ...o });

// When a phrase is said, estimated from where it sits in the line's speech (the voice's word timings can replace this).
function atWord(id, phrase, dk = 0) {
  const l = L(id), s = (l.speech || l.text).toLowerCase(), i = s.indexOf(phrase.toLowerCase());
  if (i < 0) throw new Error(`"${phrase}" isn't in ${id}`);
  return l.t0 + (l.t1 - l.t0) * i / s.length + dk;
}

// ---------- the desk, over Curt's shoulder ----------
//   hour         the window's light (7 cool dawn → 12 noon gold)
//   base         the chapter's usual screens; screens: this shot's overrides (null hides a screen)
//   mood         Claude's emotion keys for the main monitor (emotions()); assemble 0..1 (the crowd gathering); lookX
//   cam          [cx, cy, zoom] (default: the wide desk, drifting a little)
//   typing       Curt's hands move on the keys
//   axolotl, frog  0..1: pop onto the desk (the motif); axoLook, frogLook
//   curt         extra options for Curt (e.g. hoodie colour)
//   extra(t)     more to paint in world space, after Curt
function deskShot(t, o = {}) {
  const cam = o.cam || DESK.cam;
  camBegin(cam[0] + 6 * Math.sin(t * .3), cam[1] + 3 * Math.sin(t * .23), cam[2] * (1 + .004 * Math.sin(t * .2)));
  const mood = o.mood || emotions(t, [[0, 'neutral']]);
  desk(t, { hour: o.hour ?? 7.5, dim: o.dim, screens: {
    main: { kind: 'claude', pose: { ...mood, assemble: o.assemble ?? 1, mouth: clawdMouth(talkOf(t, 'claude'), mood.mouth), lookX: o.lookX ?? mood.lookX } },
    left: { kind: 'code' }, right: { kind: 'code', speed: .7 }, upL: { kind: 'code', speed: .8 }, upR: { kind: 'code', speed: 1.3 },
    tall: { kind: 'code', speed: 2.5 }, lapL: { kind: 'code', speed: .5 }, lapR: { kind: 'code', speed: 1.1 },
    ...(o.base || {}), ...(o.screens || {}),
  } });
  deskFront(t);
  const axo = o.axolotl ?? 0, fr = o.frog ?? 0;
  if (axo > 0) axolotl(1265, DESK.deskY[0] + 70 + (1 - backOut(axo)) * 40, 7, { look: o.axoLook ?? -.4, boilKey: 'desk axo', blink: frac(t / 3.3) < .05 });
  if (fr > 0) frog(655, DESK.deskY[0] + 78 + (1 - backOut(fr)) * 40, 9, { look: o.frogLook ?? .5, boilKey: 'desk frog', blink: frac(t / 2.9 + .3) < .05 });
  const [hx, hy, hu] = DESK.curt;
  curtAs(hx, hy, hu, { view: 'back', pose: 'sit', lean: .03 * Math.sin(t * .6), handL: [1.5, -1.7 + (o.typing ? .1 * Math.sin(t * 11) : 0)], handR: [-1.5, -1.8 + (o.typing ? .1 * Math.sin(t * 9 + 1) : 0)], seed: 2, ...(o.curt || {}) });
  if (o.extra) o.extra(t);
  camEnd();
}
const pushInto = (name, k) => deskCam(name, easeIn(k) * .98);
// a screen's rect in screen space, under a desk camera (for flying things between the desk and full frame)
function screenRect(name, cam = DESK.cam) {
  const [x, y, w, h] = DESK.screens[name], z = cam[2];
  return [(x - cam[0]) * z + W / 2, (y - cam[1]) * z + H / 2, w * z, h * z];
}
const rectAt = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));

// ---------- grounds ----------
const paperWorld = (t, col = '#EFE8DA') => { boilSeed('paper world'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: col, fill: '#E2D8C4', fillOp: 70, bleed: .2, tex: .5, ink: null }); };
const darkWorld = t => { boilSeed('dark world'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#2A2530', fill: '#3A3342', fillOp: 90, bleed: .2, tex: .5, ink: null }); glow(W / 2, H * .55, 700, '#E8956A', .3); };
function fade(k, col = '#15131A') { if (k > .01) { boilSeed('fade'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, washOp: 255 * clamp(k), ink: null }); } }

// ---------- props several chapters use ----------
// An index card with a red top rule; rows of text fill in with k (0..1 across the rows). edge (0..1) turns it edge-on
// ("a thin answer"): at 1 it's a line.
function indexCard(cx, cy, w, h, rows, o = {}) {
  const k = o.k ?? 1, edge = ease(o.edge || 0), sy = 1 - edge * .985;
  occupy(cx - w / 2, cy - h / 2 * sy, cx + w / 2, cy + h / 2 * sy, 1, 'card');
  boilSeed('index card ' + (o.key || cx));
  push(); translate(cx, cy); rotate(o.rot || 0); scale(1, sy);
  paint(rrPts(-w / 2 + 8, -h / 2 + 10, w, h, 8), { fill: PAL.ink, fillOp: 50, bleed: .2, ink: null });
  paint(rrPts(-w / 2, -h / 2, w, h, 8), { wash: '#FBF6E6', ink: PAL.ink, sw: 1.2 });
  inkLine([[-w / 2 + 10, -h / 2 + h * .16], [w / 2 - 10, -h / 2 + h * .16]], 2.2, '#C9302C', 'inkfine', 0);
  for (let i = 1; i < 7; i++) inkLine([[-w / 2 + 10, -h / 2 + h * (.16 + i * .12)], [w / 2 - 10, -h / 2 + h * (.16 + i * .12)]], .6, '#9DB8E8', 'inkfine', 0);
  pop();
  if (edge < .5) {
    const n = rows.length, size = o.size || h * .085;
    rows.forEach((r, i) => {
      const kk = clamp(k * n - i); if (kk <= 0) return;
      const y = cy - h / 2 + h * (o.top ?? .1) + (i + (o.title ? 0 : 1)) * h * (o.rowH ?? .12) * sy;
      lab(r, cx + (o.align === 'center' || (o.title && i === 0) ? 0 : -w / 2 + 24), y, i === 0 && o.title ? size * 1.25 : size, i === 0 && o.title ? PAL.ink : (o.col || '#3A3342'),
        { align: o.align === 'center' || (o.title && i === 0) ? 'center' : 'left', alpha: kk * (1 - edge * 2) });
    });
  }
}

// A door in a wall: open 0..1 swings it (the gap shows `inside`, a colour), label painted over the lintel.
function doorway(x, y, w, h, o = {}) {
  const open = ease(o.open || 0);
  occupy(x - 10, y - (o.label ? 60 : 10), x + w + 10, y + h, 1, 'door');
  boilSeed('door ' + x + ' ' + y);
  paint(rectPts(x - 12, y - 12, w + 24, h + 12), { wash: '#6B5646', ink: PAL.ink, sw: 1.2 });   // the frame
  paint(rectPts(x, y, w, h), { wash: o.inside || '#1E1A22', ink: null });
  if (o.light) glow(x + w / 2, y + h * .6, w * 1.2, o.light, .8 * open);
  if (o.draw) o.draw(x, y, w, h, open);
  // the door leaf, hinged on the left, foreshortening as it opens
  const lw = w * (1 - open * .82);
  paint([[x, y], [x + lw, y + h * .04 * open], [x + lw, y + h - h * .04 * open], [x, y + h]], { wash: o.col || '#A9774F', fill: mixCol(o.col || '#A9774F', PAL.ink, .3), fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.1 });
  paint(ellPts(x + lw * .85, y + h * .52, Math.max(2, w * .03 * (1 - open)), w * .03, 8), { wash: '#E8C27A', ink: PAL.ink, sw: .7 });
  if (o.label) lab(o.label, x + w / 2, y - 34, o.labelSize || 30, o.labelCol || PAL.cream);
}

// A balance: tilt -1..1 (positive = the right pan goes down). Pans' contents are painters, fn(x, y).
function balance(cx, cy, s, tilt, left, right) {
  occupy(cx - s * 1.3, cy - s * .2, cx + s * 1.3, cy + s * 1.2, 1, 'balance');
  boilSeed('balance ' + cx);
  const a = tilt * .28, dx = Math.cos(a) * s, dy = Math.sin(a) * s;
  paint(rectPts(cx - s * .05, cy, s * .1, s * 1.1), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
  paint(rrPts(cx - s * .4, cy + s * 1.08, s * .8, s * .12, 6), { wash: '#6B5646', ink: PAL.ink, sw: 1 });
  inkLine([[cx - dx, cy - dy], [cx + dx, cy + dy]], 6, '#6B5646', 'ink', 0);
  for (const [d, fn] of [[-1, left], [1, right]]) {
    const px = cx + d * dx, py = cy + d * dy;
    inkLine([[px, py], [px - s * .25, py + s * .5]], 1, PAL.ink, 'inkfine', 0); inkLine([[px, py], [px + s * .25, py + s * .5]], 1, PAL.ink, 'inkfine', 0);
    paint([[px - s * .35, py + s * .5], [px + s * .35, py + s * .5], [px + s * .22, py + s * .62], [px - s * .22, py + s * .62]], { wash: '#C9A45A', ink: PAL.ink, sw: 1 });
    if (fn) fn(px, py + s * .5);
  }
}
