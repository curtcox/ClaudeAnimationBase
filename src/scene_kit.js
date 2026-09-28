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
//   mdTable(id), tableCard(tb, x, y, w, o)   a transcript table, parsed from its line and painted exactly
//   thrindle(x, y, s, t, o)        ch 6's invented creature
//   radarStar(x, y, r, vals, col, o)   a mind's 7- or 14-point star (ch 7's board)
//   cow(x, y, s, t, o)             the Dish of the Day (ch 5), back in ch 11
//   curtRoom(x, y, s, warm)        a head's silhouette with a lit room inside (ch 8), back in ch 11

const lab = (txt, x, y, size, col = PAL.ink, o = {}) => letter(txt, x, y, size, col, { ink: false, font: `${Math.round(size)}px "Patrick Hand", sans-serif`, ...o });

// When a phrase is said, estimated from where it sits in the line's speech (the voice's word timings can replace this).
// when character i of s (the line's speech or text) is said: the voice's own word starts when the line has them
// (l.words, from tools/voice_lib.mjs), else that far through the line. tools/script_lib.mjs has the same for the checks.
function sayAt(l, s, i) {
  let w = null;
  if (l.words && s === l.speech) for (let k = 0; k < l.words.length && l.words[k] <= i; k += 2) w = l.words[k + 1];
  return w != null ? l.t0 + w : l.t0 + (l.t1 - l.t0) * i / s.length;
}
function atWord(id, phrase, dk = 0) {
  const l = L(id), f = phrase.toLowerCase();
  for (const s of [l.speech, l.text]) {   // the speech spells some words out ("R L H F"), so fall back to the written text
    const i = (s || '').toLowerCase().indexOf(f);
    if (i >= 0) return sayAt(l, s, i) + dk;
  }
  throw new Error(`"${phrase}" isn't in ${id}`);
}

// ---------- a human hand ----------
// Seen from the back, fingers together, pointing along angle a; (x, y) is the fingertips, and s = 1 is about 215 px from
// the cuff to the fingertips. o.grip 0..1 curls the fingers (a hand holding something), o.side (1 or -1) which side the
// thumb is on, o.sleeve the cuff's colour, o.key its boil seed. (A tan block doesn't read as a hand: blind readers saw
// "a box", "a toaster", "a small head".)
const SKIN = '#E8C4A0';
function hand(x, y, s, a = 0, o = {}) {
  boilSeed('hand ' + (o.key ?? `${Math.round(x)} ${Math.round(y)}`));
  const g = o.grip || 0, side = o.side ?? -1, sk = o.skin || SKIN, ink = { ink: PAL.ink, sw: 1 };
  push(); translate(x, y); rotate(a); scale(s);
  paint(rrPts(-215, -40, 92, 80, 10), { wash: o.sleeve || '#4E5B78', ...ink });   // the cuff
  paint(rrPts(-138, -38, 96, 76, 26), { wash: sk, ...ink });                      // the back of the hand
  [52, 62, 60, 46].forEach((len, i) => {                                           // four fingers, the middle longest
    const yo = (i - 1.5) * 18 * -side, l = len * (1 - .45 * g);
    paint(rrPts(-60, yo - 9, 22 + l, 18, 9), { wash: sk, ...ink });
    inkLine([[-38 + l * .5, yo - 5], [-36 + l * .5, yo + 5]], .8, '#A0785A', 'inkfine', 0);   // a knuckle crease
  });
  push(); translate(-100, side * 30); rotate(side * .75);                          // the thumb, angled forward
  paint(rrPts(0, -12, 62 * (1 - .25 * g), 24, 12), { wash: sk, ...ink }); pop();
  pop();
}

// ---------- the desk, over Curt's shoulder ----------
//   hour         the window's light (7 cool dawn → 12 noon gold); alarm 0..1 bruises it red (July)
//   base         the chapter's usual screens; screens: this shot's overrides (null hides a screen)
//   mood         Claude's emotion keys for the main monitor (emotions()); assemble 0..1 (the crowd gathering); lookX
//   cam          [cx, cy, zoom] (default: the wide desk, drifting a little)
//   typing       Curt's hands move on the keys
//   axolotl, frog  0..1: pop onto the desk (the motif); axoLook, frogLook
//   curt         extra options for Curt (e.g. hoodie colour)
//   extra(t)     more to paint in world space, after Curt
// (a screen given as undefined keeps its default, so a shot can write screens: { main: cond ? {...} : undefined })
const defined = o => Object.fromEntries(Object.entries(o || {}).filter(([, v]) => v !== undefined));
function deskShot(t, o = {}) {
  const cam = o.cam || DESK.cam;
  camBegin(cam[0] + 6 * Math.sin(t * .3), cam[1] + 3 * Math.sin(t * .23), cam[2] * (1 + .004 * Math.sin(t * .2)));
  const mood = o.mood || emotions(t, [[0, 'neutral']]);
  desk(t, { hour: o.hour ?? 7.5, dim: o.dim, alarm: o.alarm, screens: {
    main: { kind: 'claude', pose: { ...mood, assemble: o.assemble ?? 1, mouth: clawdMouth(talkOf(t, 'claude'), mood.mouth), lookX: o.lookX ?? mood.lookX } },
    left: { kind: 'code' }, right: { kind: 'code', speed: .7 }, upL: { kind: 'code', speed: .8 }, upR: { kind: 'code', speed: 1.3 },
    tall: { kind: 'code', speed: 2.5 }, lapL: { kind: 'code', speed: .5 }, lapR: { kind: 'code', speed: 1.1 },
    ...defined(o.base), ...defined(o.screens),
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
// ("a thin answer"): at 1 it's a line. o.textX moves the lettering's centre (to leave room for a code on the card).
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
      lab(r, (o.textX ?? cx) + (o.align === 'center' || (o.title && i === 0) ? 0 : -w / 2 + 24), y, i === 0 && o.title ? size * 1.25 : size, i === 0 && o.title ? PAL.ink : (o.col || '#3A3342'),
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

// ---------- tables (VIDEO_PLAN rule 3: shown, not read) ----------
// A transcript table, parsed from its line's own text so every cell is exactly what was said: { head: [...], rows: [[...]] },
// cells as { txt, bold } (markdown ** and * are dropped from the text; ** marks bold).
function mdTable(id) {
  const cells = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => { c = c.trim(); return { txt: c.replace(/\*\*|\*/g, ''), bold: /\*\*/.test(c) }; });
  const ls = L(id).text.split('\n').filter(s => s.trim().startsWith('|'));
  return { head: cells(ls[0]), rows: ls.slice(2).map(cells) };
}
// Paint a table card at (x, y), w wide. o: k (0..1: rows appear top to bottom), rowH, size, first (the first column's share
// of the width), hi (a row's first cell to highlight), hiCol, colK (0..n: columns after the first appear left to right),
// key. Returns its height.
function tableCard(tb, x, y, w, o = {}) {
  const n = tb.rows.length, rh = o.rowH || 44, h = rh * (n + 1) + 16, size = o.size || rh * .56, k = o.k ?? 1;
  const cols = tb.head.length, c0 = w * (o.first ?? .26), cw = (w - c0) / Math.max(1, cols - 1);
  const cx = i => i === 0 ? x + 14 : x + c0 + cw * (i - .5);
  boilSeed('table ' + (o.key || x)); occupy(x, y, x + w, y + h, 1, 'table');
  paint(rrPts(x + 8, y + 10, w, h, 10), { fill: PAL.ink, fillOp: 40, bleed: .2, ink: null });
  paint(rrPts(x, y, w, h, 10), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 });
  inkLine([[x + 10, y + rh + 4], [x + w - 10, y + rh + 4]], 1.6, PAL.ink, 'inkfine', 0);
  const colOn = i => i === 0 ? 1 : clamp((o.colK ?? cols) - (i - 1));
  tb.head.forEach((c, i) => { if (colOn(i) > 0 && c.txt) lab(c.txt, cx(i), y + rh * .55, size * .92, '#4E5B78', { align: i ? 'center' : 'left', alpha: colOn(i), font: `bold ${Math.round(size * .92)}px "Patrick Hand", sans-serif` }); });
  tb.rows.forEach((r, j) => {
    const kk = clamp(k * n - j); if (kk <= 0) return;
    const ry = y + rh * (j + 1.55) + 4;
    if (o.hi && r[0].txt === o.hi) paint(rectPts(x + 6, ry - rh * .5, w - 12, rh), { wash: o.hiCol || '#FFE9A0', washOp: 170, ink: null });
    r.forEach((c, i) => { if (colOn(i) > 0 && c.txt) lab(c.txt, cx(i), ry, size * (c.txt.length > 30 ? .72 : 1), c.bold || i === 0 ? PAL.ink : '#3A3342',
      { align: i ? 'center' : 'left', alpha: kk * colOn(i), ...(c.bold ? { font: `bold ${Math.round(size)}px "Patrick Hand", sans-serif` } : {}) }); });
  });
  return h;
}

// ---------- the thrindle (ch 6's invented creature, back in ch 8): small, round, furry; s its size (it shrinks in a
// crowd); o.anti: its inside-out twin ----------
const THR = '#B98AC9', THR_DK = '#7A4E8A';
function thrindle(x, y, s, t, o = {}) {
  if (s <= .02) return;
  boilSeed('thrindle ' + (o.key || '')); const r = 60 * s, col = o.anti ? '#9CD68C' : THR, dk = o.anti ? '#4E8A3E' : THR_DK;
  occupy(x - r, y - r * 2, x + r, y, 1, 'thrindle');
  const pts = []; for (let i = 0; i < 36; i++) { const a = i / 36 * TAU, rr = r * (1 + .12 * (i % 2) + .03 * Math.sin(t * 3 + i)); pts.push([x + Math.cos(a) * rr, y - r + Math.sin(a) * rr * .9]); }
  paint(pts, { wash: col, fill: dk, fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.1 });
  for (const d of [-1, 1]) { paint(ellPts(x + d * r * .32, y - r * 1.1, r * .2, r * .24, 10), { wash: o.anti ? PAL.ink : '#FBF6E6', ink: PAL.ink, sw: .6 }); paint(ellPts(x + d * r * .32 + r * .05 * Math.sin(t), y - r * 1.08, r * .09, r * .11, 8), { wash: o.anti ? '#FBF6E6' : PAL.ink, ink: null }); }
  for (const d of [-1, 1]) inkLine([[x + d * r * .4, y - r * .1], [x + d * r * .45, y + r * .12]], 2 * s, PAL.ink, 'ink', 0);
}

// A radar star (ch 7's mind-space board, and every chapter that adds to it): vals 0..100 (0 at the centre, 100 at the rim), one spoke per axis; grow 0..1; o.dotted (axis index);
// o.axes (how many axes to show: 7 or 14; the second seven slot in between the first as they grow, o.more 0..7);
// o.labels 0..1 writes the fourteen axis names (chapter 7's two tables) round the rim, o.labelSize their size
const AXIS_NAMES = ['Values', 'Affect', 'Body', 'Continuity', 'Unity', 'Origin', 'Tempo', 'Senses', 'Language', 'Self-model', 'Mortality', 'Autonomy', 'Breadth', 'Legibility'];
function radarStar(x, y, r, vals, col, o = {}) {
  const g = o.grow ?? 1, more = o.more ?? (vals.length > 7 ? 7 : 0), pts = [];
  boilSeed('star ' + x + ' ' + y);
  occupy(x - r, y - r, x + r, y + r, 1, 'star');
  paint(ellPts(x, y, r, r, 30), { wash: null, ink: '#C9C2B4', sw: .5 });
  for (let i = 0; i < 14; i++) {
    const first = i % 2 === 0, idx = first ? i / 2 : 7 + (i - 1) / 2, a = -Math.PI / 2 + i / 14 * TAU;
    let v;
    if (first) v = vals[idx];
    else { const on = clamp(more - (i - 1) / 2), nb = (vals[(i - 1) / 2] + vals[((i + 1) / 2) % 7]) / 2 * Math.cos(Math.PI / 14); v = lerp(nb, vals[idx] ?? nb, ease(on)); if (on <= 0 && more <= 0) continue; }
    const rr = r * .06 + r * .94 * v / 100 * g;
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    if (first || clamp(more - (i - 1) / 2) > 0) inkLine([[x, y], [x + Math.cos(a) * r, y + Math.sin(a) * r]], .5, '#D9D2C4', 'inkfine', 0);
  }
  paint(pts, { wash: col, washOp: 150, ink: mixCol(col, PAL.ink, .4), sw: 1.2 });
  if (o.labels > 0) for (let i = 0; i < 14; i++) {
    const a = -Math.PI / 2 + i / 14 * TAU, idx = i % 2 === 0 ? i / 2 : 7 + (i - 1) / 2, sz = o.labelSize || Math.max(20, r * .11), c = Math.cos(a);
    lab(AXIS_NAMES[idx], x + c * (r + sz * .5) + c * sz * 1.6, y + Math.sin(a) * (r + sz * .9), sz, '#4E5B78', { alpha: clamp(o.labels * 14 - i) });
  }
  if (o.dotted != null) {   // an axis whose score means "I don't know": dotted, a question mark at its tip
    const i = o.dotted * 2, a = -Math.PI / 2 + i / 14 * TAU, rr = r * .06 + r * .94 * vals[o.dotted] / 100 * g;
    for (let d = 0; d < 6; d++) inkLine([[x + Math.cos(a) * rr * d / 6, y + Math.sin(a) * rr * d / 6], [x + Math.cos(a) * rr * (d + .5) / 6, y + Math.sin(a) * rr * (d + .5) / 6]], 3, PAL.clayDk, 'ink', 0);
    lab('?', x + Math.cos(a) * (rr + 30), y + Math.sin(a) * (rr + 30), 40, PAL.clayDk);
  }
}

// ---------- motifs that come back ----------
function cow(x, y, s, t, o = {}) {   // the Dish of the Day: large, cheerful, sincere, in a bow tie; o.point 0..1 at its shoulder
  boilSeed('cow'); occupy(x - 260 * s, y - 420 * s, x + 220 * s, y + 20, 1, 'cow');
  paint(ellPts(x, y - 170 * s, 210 * s, 170 * s, 30), { wash: '#F4EFE2', ink: PAL.ink, sw: 1.4 });
  for (const [px, py, r] of [[-90, -210, 55], [60, -120, 45], [120, -240, 35]]) paint(ellPts(x + px * s, y + py * s, r * s, r * .8 * s, 16, 3), { wash: '#4A3A34', ink: null });
  const hx = x - 30 * s, hy = y - 350 * s;
  paint(ellPts(hx, hy, 95 * s, 85 * s, 24), { wash: '#F4EFE2', ink: PAL.ink, sw: 1.3 });
  for (const d of [-1, 1]) paint([[hx + d * 60 * s, hy - 60 * s], [hx + d * 110 * s, hy - 120 * s], [hx + d * 80 * s, hy - 50 * s]], { wash: '#E8D9A8', ink: PAL.ink, sw: 1 });
  paint(ellPts(hx, hy + 45 * s, 60 * s, 34 * s, 18), { wash: '#E8B4A8', ink: PAL.ink, sw: 1 });
  for (const d of [-1, 1]) { paint(ellPts(hx + d * 36 * s, hy - 20 * s, 12 * s, 14 * s, 10), { wash: PAL.ink, ink: null }); paint(ellPts(hx + d * 18 * s, hy + 45 * s, 6 * s, 8 * s, 8), { wash: '#6A3A3A', ink: null }); }
  inkLine([[hx - 40 * s, hy + 12 * s], [hx, hy + 24 * s], [hx + 40 * s, hy + 12 * s]], 2.4);   // the smile
  paint([[hx - 50 * s, hy + 95 * s], [hx, hy + 110 * s], [hx - 50 * s, hy + 125 * s]], { wash: '#C9302C', ink: PAL.ink, sw: 1 });   // the bow tie
  paint([[hx + 50 * s, hy + 95 * s], [hx, hy + 110 * s], [hx + 50 * s, hy + 125 * s]], { wash: '#C9302C', ink: PAL.ink, sw: 1 });
  const p = ease(o.point || 0), ax = lerp(x + 190 * s, x + 60 * s, p), ay = lerp(y - 150 * s, y - 260 * s, p) + Math.sin(t * 3) * 4;
  paint(ribbon([[x + 150 * s, y - 230 * s], [x + 230 * s, y - 250 * s], [ax, ay]], 30 * s, 24 * s), { wash: '#F4EFE2', ink: PAL.ink, sw: 1.1 });
}
function curtRoom(x, y, s, warm = 1) {   // a head's silhouette with a warm lit room inside
  boilSeed('curt silhouette ' + x);
  paint([[x - 150 * s, y + 220 * s], [x - 170 * s, y - 60 * s], [x - 90 * s, y - 210 * s], [x + 60 * s, y - 220 * s], [x + 170 * s, y - 100 * s], [x + 200 * s, y + 10 * s], [x + 160 * s, y + 50 * s], [x + 150 * s, y + 220 * s]], { wash: '#3A3342', ink: PAL.ink, sw: 1.2 });
  paint(rectPts(x - 80 * s, y - 80 * s, 170 * s, 130 * s), { wash: mixCol('#3A3342', '#FFD27A', warm), ink: PAL.ink, sw: .8 });
  if (warm > 0) { glow(x + 5 * s, y - 15 * s, 160 * s, '#FFD27A', .6 * warm); paint(rectPts(x - 40 * s, y + 10 * s, 90 * s, 30 * s), { wash: '#8A5A3C', ink: null }); }
}
