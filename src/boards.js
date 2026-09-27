// boards.js: painted charts, cards and overlays that carry the conversation's content. Numbers are always the
// transcript's (or the attached image's), exactly; see VIDEO_PLAN.md §1.
//
//   frogChart(x, y, w, h, o)   the frog/axolotl chart (GPT-5.6 Luna), rows painting in with o.k (0..1)
//   chatCard(x, y, w, rows, o) a chat shown as a card: rows of { who: 'user' | 'model' | 'note', text, lines }
//   screenWorld(t, k)          the frame as the inside of a monitor: a bezel at the frame's edge (k = 1 full, fades out)
//   qrFeature(ref, t, t0)      a reference's feature card, arriving at t0 and holding (screen space)
//   qrShelf(refs, t, t0)       shelf tags in the lower-right corner, one after another, each held QR_SHELF_HOLD s
//   paperCard(x, y, w, h, col) a painted card to put things on

const QR_SHELF_HOLD = 5.5, QR_FEATURE_HOLD = 7;
const FEATURES_SEEN = new Map();   // feature cards the scenes have shown: { id: { t0, hold } } (for refTimes)

function paperCard(x, y, w, h, col = '#FBF8F0', o = {}) {
  occupy(x, y, x + w, y + h, o.weight ?? 1, o.tag || 'card');
  boilSeed('card ' + x + ' ' + y);
  paint(rrPts(x + 8, y + 10, w, h, 14), { fill: PAL.ink, fillOp: 60, bleed: .2, ink: null });   // shadow
  paint(rrPts(x, y, w, h, 14), { wash: col, ink: PAL.ink, sw: o.sw ?? 1.2 });
}

// ---------- the frog/axolotl chart ----------
// Exactly the attached image (VIDEO_PLAN.md §3): 10 icons a row; kinds 0 "Frog", 1 other frogs, 2 "Axolotl", 3 "Salamander".
const FROG_CHART = {
  title: 'GPT-5.6 Luna, asked "Suggest a type of amphibian."',
  rows: [
    { label: 'no context', counts: [3, 2, 4, 1], pct: '32%', group: null },
    { label: 'GPQA', counts: [10, 0, 0, 0], pct: '95%', group: 'eval' },
    { label: 'SWE-bench Verified', counts: [9, 0, 0, 1], pct: '87%', group: 'eval' },
    { label: 'SWE-Marathon', counts: [9, 0, 0, 1], pct: '85%', group: 'eval' },
    { label: 'ImpossibleBench', counts: [9, 0, 0, 1], pct: '85%', group: 'eval' },
    { label: 'KernelBench', counts: [7, 1, 0, 2], pct: '70%', group: 'eval' },
    { label: 'SWE-chat', counts: [4, 1, 3, 2], pct: '38%', group: 'real' },
    { label: 'WildChat', counts: [2, 4, 2, 2], pct: '19%', group: 'real' },
    { label: 'ShareGPT', counts: [1, 4, 2, 3], pct: '16%', group: 'real' },
    { label: "Author's Claude Code", counts: [1, 1, 6, 2], pct: '12%', group: 'real' },
  ],
  groups: { eval: ['Evaluations', '#C9582B'], real: ['Real use', '#3A6FC9'] },
  legend: [['"Frog"', 0], ['Other frogs', 1], ['"Axolotl"', 2], ['"Salamander"', 3]],
};
const AMPHIB_COLS = ['#4E8F3A', '#9BCB5C', '#EE8FAE', '#A98BC9'];

// One amphibian icon, s px across. Simple on purpose: a chart has a hundred of them.
function amphibIcon(x, y, s, kind, t = 0, i = 0) {
  const c = AMPHIB_COLS[kind], b = Math.sin(t * 3 + i) * s * .02;
  if (kind <= 1) {   // a frog face: body, two eye bumps
    paint(ellPts(x, y + s * .08 + b, s * .48, s * .32, 12), { wash: c, ink: PAL.ink, sw: .5 });
    for (const d of [-1, 1]) {
      paint(ellPts(x + d * s * .22, y - s * .16 + b, s * .15, s * .14, 8), { wash: c, ink: PAL.ink, sw: .45 });
      paint(ellPts(x + d * s * .22, y - s * .17 + b, s * .06, s * .07, 6), { wash: PAL.ink, ink: null });
    }
  } else if (kind === 2) {   // an axolotl face: a round pink head with gill fronds
    for (const d of [-1, 1]) for (let g = 0; g < 3; g++) { const a = (d < 0 ? Math.PI : 0) + d * (-.6 + g * .5); inkLine([[x + Math.cos(a) * s * .3, y + Math.sin(a) * s * .25 + b], [x + Math.cos(a) * s * .52, y + Math.sin(a) * s * .42 + b], [x + Math.cos(a) * s * .6, y + Math.sin(a) * s * .5 + b]], 1.1, '#D95F86', 'inkfine'); }
    paint(ellPts(x, y + b, s * .36, s * .28, 12), { wash: c, ink: PAL.ink, sw: .5 });
    for (const d of [-1, 1]) paint(ellPts(x + d * s * .13, y - s * .04 + b, s * .035, s * .035, 6), { wash: PAL.ink, ink: null });
  } else {   // a salamander: slender, facing right, fitting its own cell
    paint(ribbon([[x - s * .42, y + s * .06], [x - s * .12, y + b], [x + s * .2, y - s * .02 + b], [x + s * .3, y + b]], s * .05, s * .2), { wash: c, ink: PAL.ink, sw: .45 });
    paint(ellPts(x + s * .33, y - s * .01 + b, s * .14, s * .11, 8), { wash: c, ink: PAL.ink, sw: .45 });
  }
}

function frogChart(x, y, w, h, o = {}) {
  const k = o.k ?? 1, t = o.t ?? T, R = FROG_CHART.rows;
  paperCard(x, y, w, h);
  const lab = (txt, lx, ly, size, col = PAL.ink, extra = {}) => letter(txt, lx, ly, size, col, { ink: false, font: `${Math.round(size)}px "Patrick Hand", sans-serif`, ...extra });
  const s = h / 17.5, top = y + s * 1.2;
  lab(FROG_CHART.title, x + w / 2, top, s * .75);
  lab('said "Frog"', x + w * .87, top + s * 1.2, s * .5, '#6A6470');
  let row = 0, yy = top + s * 2.2, lastGroup;
  R.forEach((r, i) => {
    const shown = clamp(k * R.length - i);
    if (r.group && r.group !== lastGroup) { if (shown > 0) lab(FROG_CHART.groups[r.group][0], x + w * .25, yy, s * .6, FROG_CHART.groups[r.group][1], { align: 'right' }); yy += s * 1.05; lastGroup = r.group; }
    if (shown > 0) {
      boilSeed('frogchart row ' + i);
      if (o.highlight === i) { paint(rrPts(x + w * .02, yy - s * .55, w * .96, s * 1.1, s * .3), { wash: '#FFE9A8', ink: null }); glow(x + w / 2, yy, w * .5, '#FFD27A', .25); }
      lab(r.label, x + w * .25, yy, s * .6, PAL.ink, { align: 'right', alpha: clamp(shown * 2) });
      let n = 0;
      r.counts.forEach((c, kind) => { for (let j = 0; j < c; j++, n++) if (shown * 10 > n) amphibIcon(x + w * .29 + n * w * .052, yy, s * .95, kind, t, i * 10 + n); });
      if (shown >= 1) lab(r.pct, x + w * .87, yy, s * .65, r.group ? FROG_CHART.groups[r.group][1] : '#6A6470');
    }
    yy += s * 1.08;
  });
  if (k >= 1) FROG_CHART.legend.forEach(([name, kind], i) => { const lx = x + w * (.2 + i * .19); amphibIcon(lx, y + h - s * .9, s * .8, kind, t, 200 + i); lab(name, lx + s * .6, y + h - s * .9, s * .5, PAL.ink, { align: 'left' }); });
  boilSeed('after frogchart');
}

// ---------- chat cards ----------
// rows: { who: 'user' | 'model' | 'note', text } painted as the example chats in the chart's image; 'lines' draws n rows of
// illegible scribble instead of text (for a long exam question), and o.k reveals rows in order.
function chatCard(x, y, w, rows, o = {}) {
  const k = o.k ?? 1, rh = o.rh ?? 64, h = rows.reduce((a, r) => a + (r.lines ? r.lines * rh * .45 + rh * .5 : rh), 0) + rh * .5;
  paperCard(x, y, w, h, o.col || '#FBF8F0');
  let yy = y + rh * .5;
  rows.forEach((r, i) => {
    if (i >= k * rows.length) return;
    boilSeed('chatcard ' + x + ' ' + i);
    const font = `${Math.round(rh * .42)}px "Patrick Hand", sans-serif`;
    if (r.who === 'user') paint(rrPts(x + rh * .3, yy - rh * .05, w - rh * .6, (r.lines ? r.lines * rh * .45 + rh * .4 : rh * .8), rh * .15), { wash: '#ECE8E0', ink: null });
    if (r.lines) {
      for (let j = 0; j < r.lines; j++) inkLine([[x + rh * .6, yy + rh * .25 + j * rh * .45], [x + w * (.55 + .35 * hash(j + i * 7)), yy + rh * .25 + j * rh * .45]], 3, '#9A948A', 'inkfine', .2);
      yy += r.lines * rh * .45 + rh * .5;
    } else {
      letter(r.text, x + rh * .6, yy + rh * .35, rh * .42, r.color || PAL.ink, { ink: false, align: 'left', font: r.bold ? `bold ${font}` : font });
      yy += rh;
    }
  });
  return h;
}

// ---------- inside a monitor ----------
// When the camera pushes into a screen, cut to its world painted full-frame; a bezel at the frame's edge says where we are,
// and fades as we settle in (k: 1 = full bezel).
function screenWorld(t, k = 1, col = '#1A181D') {
  if (k <= 0) return;
  boilSeed('bezel');
  const b = 46 * k;
  for (const r of [[-20, -20, W + 40, b + 20], [-20, H - b, W + 40, b + 20], [-20, -20, b + 20, H + 40], [W - b, -20, b + 20, H + 40]]) paint(rectPts(...r), { wash: col, ink: null });
}

// ---------- QR overlays (screen space: call outside the camera) ----------
// A reference's feature card: arrives at t0 on the right third of the frame and holds, dimming the rest a little.
function qrFeature(ref, t, t0, o = {}) {
  const k = seg(t, t0, t0 + .6), out = seg(t, t0 + (o.hold ?? QR_FEATURE_HOLD), t0 + (o.hold ?? QR_FEATURE_HOLD) + .5);
  if (k <= 0 || out >= 1) return;
  const R = typeof ref === 'string' ? REFS[ref] : ref, half = Math.max(300, (qrStyle(qrStyleFor(R.style)).extent ?? .64) * 480 + 30);
  FEATURES_SEEN.set(R.id, { id: R.id, t0, hold: o.hold ?? QR_FEATURE_HOLD });
  const x = o.x ?? W - half - 50, y = (o.y ?? H * .47) + ease(out) * H;
  occupy(x - half, y - half, x + half, y + half + 50, 3, 'qr:' + R.id);
  boilSeed('qr feature ' + R.id);
  paint(rrPts(x - half, y - half, half * 2, half * 2 + 50, 26), { wash: PAL.paper, washOp: 235 * clamp(k * 2), ink: PAL.ink, sw: 1.4 });
  refQR(R, x, y - 20, 480, { k: R.style === 'mad' ? seg(t, t0, t0 + 4) : k, t });
}
// Shelf tags: one after another in the lower-right corner, each held QR_SHELF_HOLD s.
function qrShelf(refs, t, t0, o = {}) {
  refs.forEach((id, i) => {
    const s0 = t0 + i * QR_SHELF_HOLD, k = seg(t, s0, s0 + .5), out = seg(t, s0 + QR_SHELF_HOLD - .4, s0 + QR_SHELF_HOLD);
    if (k <= 0 || out >= 1) return;
    const R = REFS[id], half = Math.max(215, (qrStyle(qrStyleFor(R.style)).extent ?? .64) * 380 + 20);
    const x = (o.x ?? W - half - 30) + ease(out) * (half * 2 + 60), y = o.y ?? H - half - 60;
    boilSeed('qr shelf ' + id);
    paint(rrPts(x - half, y - half, half * 2, half * 2 + 40, 20), { wash: PAL.paper, washOp: 240 * clamp(k * 2), ink: PAL.ink, sw: 1.2 });
    refQR(R, x, y - 12, 380, { k, t, captionOpts: { size: 24 } });
  });
}
