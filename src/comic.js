// comic.js: the MAD #157 page (assets/ref/mad157_apes.png), repainted: simple caricatures (necks, hands, hair, shading; no likenesses), on newsprint,
// slightly off register like cheap colour printing. Its ten balloons are lettered in full, with the page's own line breaks
// and bold words (*like this*), and never voiced (VIDEO_PLAN.md §3).
//
//   madPage(x, y, w, o)   the whole page at (x, y), w wide (it's 2080 × 978 in its own units). Returns its height.
//   MAD                   the page's layout in its own units: panels, balloons, faces (for cameras and cutaways)
//
// o: k { name: 0..1 } how much of each balloon is showing (a missing name shows in full; MAD.order is reading order),
//    apeLook (-1..1: the ape's eyes slide), turn (0..1: the turtleneck man turns from the villain to us; default 1),
//    grey (0..1: panel 2 drains to 1960s newsprint grey), only ('left' | 'right'), mini (no lettering: a thumbnail),
//    hideTurtle (a scene draws him itself), t
//   madWords(name)        a balloon's word count (scenes time the reading from it)
//   madApe(x, y, r, o), madTurtle(x, y, r, o)   the ape and the man in the turtleneck, anywhere (the mirror, the fourth wall)
//   SCREEN_KINDS.comic    any Desk monitor can show the page

const MAD = {
  W: 2080, H: 978,
  left: [20, 110, 990, 850], right: [1030, 110, 1030, 850],
  paper: '#EFE6CF', red: '#C9302C', sky: '#BFD6D6', ape: '#8A5A3A', apeLt: '#C99A6E',
  // in reading order; box [x0, y0, x1, y1], tail (the point it aims at), join (a connector to the next box in the chain)
  balloons: {
    officer:    { box: [19, 127, 153, 343], lines: ['*Hold it!*', '*WHAT*', '*DID*', '*THAT*', '*APE*', '*SAY?!?*'], col: '#C9302C', tail: [200, 440], join: 'silly' },
    silly:      { box: [166, 162, 330, 343], lines: ["Uh—don't", 'be *silly!*', '*Apes*', "can't", '*speak!*'], join: 'positive' },
    positive:   { box: [348, 127, 470, 310], lines: ["I'm", '*positive*', 'I heard', 'that ape', 'speak!'], join: 'impossible' },
    impossible: { box: [502, 158, 669, 328], lines: ['*Impossible!*', 'Apes do', 'not have', 'the *power*', 'of speech!'], tail: [630, 445], join: 'sound' },
    sound:      { box: [695, 127, 995, 248], lines: ['Then how come I', 'heard *sound* coming', 'from his *mouth?!?*'] },
    handler:    { box: [697, 260, 995, 346], lines: ['Because *THAT* ape', 'is a *ventriloquist!*'] },
    suspect:    { box: [1073, 128, 1279, 411], lines: ['We suspect', 'you are', 'hiding an', '*intelligent*', '*ape* that', 'escaped as', 'an *infant*', '20 years ago!'], tail: [1227, 470] },
    fuss:       { box: [1312, 128, 1463, 411], lines: ["It's *not*", '*true!*', 'Besides,', 'why all', 'this *fuss*', 'about a', '*talking*', '*ape?*'], tail: [1440, 650] },
    villain:    { box: [1488, 128, 1794, 411], lines: ['Because an *intelligent,*', '*talking ape* could lead', 'the *other* apes out of', 'their *slavery* . . . and', 'we must *perpetuate*', 'slavery! We have', 'always *needed* slaves,', 'and we always *will!*'], tail: [1640, 520] },
    turtle:     { box: [1856, 128, 1988, 411], lines: ['Ever', 'get', 'the', '*feeling*', "you're", 'in the', '*wrong*', '*movie!?*'], tail: [1890, 450] },
  },
  order: ['officer', 'silly', 'positive', 'impossible', 'sound', 'handler', 'suspect', 'fuss', 'villain', 'turtle'],
  leftSide: ['officer', 'silly', 'positive', 'impossible', 'sound', 'handler'],
  faces: { officer: [300, 470], handler: [620, 520], ape: [720, 610], villain: [1610, 610], turtle: [1830, 560], blond: [1250, 540] },
};

function madPage(x, y, w, o = {}) {
  const s = w / MAD.W, h = MAD.H * s, X = v => x + v * s, Y = v => y + v * s;
  const [u0, u1] = o.only === 'left' ? [0, 1010] : o.only === 'right' ? [1010, MAD.W] : [0, MAD.W];   // only: just that half of the page
  occupy(x + u0 * s, y, x + u1 * s, y + h, 1, 'comic');
  const reg = madReg;
  const t = o.t ?? T;
  push(); translate(x, y); scale(s);
  boilSeed('mad paper');
  paint(rectPts(u0, 0, u1 - u0, MAD.H), { wash: MAD.paper, fill: '#E2D5B6', fillOp: 60, bleed: .15, tex: .6, ink: null });
  if (o.only !== 'right') madLeft(reg, o, t);
  if (o.only !== 'left') madRight(reg, o, t);
  pop();
  // lettering (screen-space letters, so placed by hand from the page's units): each line in runs of plain and bold words,
  // revealed word by word as the balloon's k grows
  if (!o.mini) for (const name of MAD.order) {
    const kk = madK(o, name), left = MAD.leftSide.includes(name);
    if (kk <= 0 || (o.only === 'left' && !left) || (o.only === 'right' && left)) continue;
    const B = MAD.balloons[name], [bx0, by0, bx1, by1] = B.box, size = madFit(name), lh = (by1 - by0) / (B.lines.length + .5);
    let shown = Math.ceil(kk * madWords(name));
    B.lines.forEach((ln, i) => {
      const runs = madRuns(ln), fonts = runs.map(r => madFont(size, r.bold)), ws = runs.map((r, j) => madMeasure(r.txt, fonts[j]));
      let x = (bx0 + bx1) / 2 - ws.reduce((a, b) => a + b, 0) / 2;
      runs.forEach((r, j) => {
        const words = r.txt.split(' ').filter(Boolean), part = words.slice(0, Math.max(0, shown)).join(' ');
        shown -= words.length;
        if (part) letter((r.txt.startsWith(' ') ? ' ' : '') + part, X(x), Y(by0 + lh * (i + .75)), size * s, B.col || PAL.ink, { ink: false, align: 'left', font: madFont(size * s, r.bold), ...(r.bold ? { stroke: B.col || PAL.ink, strokeW: .045 } : {}) });
        x += ws[j];
      });
    });
  }
  return h;
}

// the balloons' lettering: how much of one shows, its words, its runs of plain and *bold*, and a size that fits its box
const madK = (o, name) => o.k?.[name] ?? 1;
const madRuns = ln => ln.split(/(\*[^*]+\*)/).filter(Boolean).map(p => p.startsWith('*') ? { txt: p.slice(1, -1), bold: true } : { txt: p, bold: false });
function madWords(name) { return MAD.balloons[name].lines.join(' ').replace(/\*/g, '').split(/\s+/).filter(Boolean).length; }
const madFont = (px, bold) => `${bold ? 'bold ' : ''}${px}px "Patrick Hand", sans-serif`;
let MAD_CTX = null;
function madMeasure(txt, font) {
  MAD_CTX ||= document.createElement('canvas').getContext('2d');
  MAD_CTX.font = font; return MAD_CTX.measureText(txt).width;
}
const MAD_FIT = {};
function madFit(name) {   // the largest size (page units) at which every line fits the box, cached once the font has loaded
  if (MAD_FIT[name]) return MAD_FIT[name];
  const B = MAD.balloons[name], [x0, y0, x1, y1] = B.box, lh = (y1 - y0) / (B.lines.length + .5);
  let size = lh * .82;
  for (const ln of B.lines) {
    const w = madRuns(ln).reduce((a, r) => a + madMeasure(r.txt, madFont(100, r.bold)), 0) / 100;
    size = Math.min(size, (x1 - x0 - 16) / w);
  }
  if (document.fonts?.check('12px "Patrick Hand"')) MAD_FIT[name] = size;
  return size;
}

// off register: the colour lands a little down and right of its ink (in page units)
function madReg(pts, col, sw = 1.2, op = 255) {
  paint(pts.map(([a, b]) => [a + 6, b + 5]), { wash: col, washOp: op, ink: null });
  paint(pts, { ink: PAL.ink, sw });
}

// The ape, sheepish: head (r) and shoulders. o: look (-1..1, its eyes slide), rot (a head tilt), op (0..255: a paper-thin
// mask lets light through), body: false for the head alone, bodyH (in r), cap (a soldier's peaked cap), dark (a gorilla's
// darker coat). Drawn in whatever space it's called in.
function madApe(x, y, r, o = {}) {
  boilSeed('mad ape ' + (o.key || x));
  const op = o.op ?? 255, fur = o.dark ? '#3E3230' : MAD.ape, face = o.dark ? '#5A4A44' : MAD.apeLt;
  if (o.body !== false) madTorso(madReg, x, y + r * .8, r * 2.8, r * (o.bodyH ?? 5), o.dark ? '#4A4E3A' : '#7A5A48');
  push(); translate(x, y); rotate(o.rot || 0);
  for (const d of [-1, 1]) paint(ellPts(d * r * .98, -r * .05, r * .26, r * .34, 12), { wash: face, washOp: op, ink: PAL.ink, sw: .9 });   // the ears
  paint(ellPts(0, 0, r, r * 1.12, 22, r * .04), { wash: fur, washOp: op, ink: PAL.ink, sw: 1.2 });
  for (let i = 0; i < 7; i++) inkLine([[-r * .5 + i * r * .17, -r * 1.02], [-r * .56 + i * r * .19, -r * 1.2]], .7, PAL.ink, 'inkfine', .3);   // a tuft
  // the face: a pale heart-shaped mask, a heavy brow ridge, a broad muzzle below
  paint([[-r * .62, -r * .2], [-r * .5, -r * .5], [0, -r * .38], [r * .5, -r * .5], [r * .62, -r * .2], [r * .5, r * .2], [-r * .5, r * .2]], { wash: face, washOp: op, ink: null });
  paint(ellPts(0, r * .45, r * .68, r * .48, 18), { wash: face, washOp: op, ink: PAL.ink, sw: 1 });
  const lk = (o.look ?? 0) * r * .12;
  for (const d of [-1, 1]) {
    paint(ellPts(d * r * .3, -r * .2, r * .15, r * .12, 10), { wash: '#FBF6E6', washOp: op, ink: PAL.ink, sw: .6 });
    paint(ellPts(d * r * .3 + lk, -r * .19, r * .075, r * .085, 8), { wash: PAL.ink, washOp: op, ink: null });
    inkLine([[d * r * .52, -r * .38], [d * r * .12, -r * .5]], 1.2);   // brows up in the middle: sheepish
  }
  for (const d of [-1, 1]) paint(ellPts(d * r * .1, r * .28, r * .05, r * .035, 6), { wash: PAL.ink, washOp: op, ink: null });   // nostrils
  inkLine([[-r * .3, r * .66], [-r * .05, r * .6], [r * .25, r * .68]], 1);   // a small, uneasy mouth
  if (o.cap) {
    paint([[-r * .95, -r * .55], [-r * .85, -r * 1.2], [r * .9, -r * 1.3], [r * .98, -r * .55]], { wash: '#26222A', ink: PAL.ink, sw: 1.2 });
    paint(ellPts(-r * .1, -r * .52, r * 1.05, r * .18, 14), { wash: '#15131A', ink: null });
  }
  pop();
}

// The man in the turtleneck (head r): turn 0..1 from the villain to us. His hands come up to his chest as he tells us.
// Drawn in whatever space it's called in.
function madTurtle(x, y, r, o = {}) {
  const tn = o.turn ?? 1, gc = o.gc || (c => c), skin = gc('#6B4631'), knit = gc('#E6DCCB');
  madTorso(madReg, x, y + r * 1.25, r * 3.4, r * 5.5, knit);
  boilSeed('mad turtleneck ' + (o.key || ''));
  for (let i = 0; i < 9; i++) inkLine([[x - r * 1.3 + i * r * .33, y + r * 1.95], [x - r * 1.4 + i * r * .36, y + r * 4.5]], .6, PAL.ink, 'inkfine', .2);   // the knit
  madHead(x, y, r, { hair: 'afro', turn: tn, look: lerp(-1, 0, tn), skin, smile: tn * .7, smirk: tn * .6, brow: .35 * tn, neck: false, gc });
  // the rolled collar, over the neck: ribbed
  paint(rrPts(x - r * .62, y + r * .78, r * 1.24, r * .55, r * .2), { wash: knit, ink: PAL.ink, sw: 1.1 });
  for (let i = 1; i < 8; i++) inkLine([[x - r * .62 + i * r * .155, y + r * .82], [x - r * .62 + i * r * .155, y + r * 1.28]], .6, PAL.ink, 'inkfine', 0);
  // his hands: palms toward us, gesturing, as he turns to us
  const up = tn;
  madArm(madReg, [[x - r * 1.45, y + r * 1.7], [x - r * 1.75, y + r * 3.3], [x - r * 1.0, y + lerp(3.7, 2.9, up) * r]], r * .66, knit, skin, { open: 1, a: -.25, s: r * .42 });
  madArm(madReg, [[x + r * 1.45, y + r * 1.7], [x + r * 1.8, y + r * 3.4], [x + r * 1.15, y + lerp(3.9, 3.2, up) * r]], r * .66, knit, skin, { open: 1, a: .3, s: r * .42 });
}

// a balloon's box and tail (painted in page units, inside madPage's transform); k pops it in
function madBalloon(name, k, o = {}) {
  if (k <= 0) return;
  const B = MAD.balloons[name], [x0, y0, x1, y1] = B.box, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, p = backOut(clamp(k * 4));
  boilSeed('mad balloon ' + name);
  if (B.join && p >= 1 && madK(o, B.join) > 0) {   // the connector to the next box in the chain (drawn once this one has landed)
    const [nx0, ny0] = MAD.balloons[B.join].box;
    inkLine([[x1, y0 + 22], [nx0, ny0 + 34]], 1.3, PAL.ink, 'ink', .4);
  }
  push(); translate(cx, cy); scale(p);
  if (B.tail) inkLine([[(x0 + x1) / 2 - cx - 20, y1 - cy], [lerp(cx, B.tail[0], .5) - cx, lerp(y1, B.tail[1], .5) - cy], [B.tail[0] - cx, B.tail[1] - cy]], 1.4, PAL.ink, 'ink', .6);
  paint(rectPts(x0 - cx, y0 - cy, x1 - x0, y1 - y0), { wash: '#FBF6E6', ink: B.col || PAL.ink, sw: 1.6 });
  pop();
}

// A head, drawn with some care: neck, ears, a jaw, a shadowed cheek, hair, brows, eyes, nose and mouth. Nobody's likeness.
// turn 0..1: from a three-quarter view facing left to facing us. o: skin, hair ('afro' | 'swept' | 'grey' | 'bald' |
// 'short' | 'dark'), look (-1..1 sideways), brow (-1..1: -1 knitted, 1 raised at the outside), shout (0..1 open mouth),
// smile, smirk (one corner up), beard (a colour), glasses, cap (an officer's peaked cap), lines (age), neck (false: none),
// gc (a colour filter, for a panel draining to grey).
function madHead(x, y, r, o = {}) {
  boilSeed('mad head ' + x + ' ' + y);
  const gc = o.gc || (c => c), turn = o.turn ?? 1, f = lerp(-.35, 0, turn), fx = x + f * r;
  const skin = o.skin || gc('#E8C4A0'), shade = mixCol(skin, '#2A1810', .25), lite = mixCol(skin, '#FFF4E0', .18);
  // the face's outline: a rounded crown, a jaw that narrows to the chin (k scales it; dx shifts it)
  const face = (a0, a1, k = 1, dx = 0, n = 24) => Array.from({ length: n + 1 }, (_, i) => {
    const a = lerp(a0, a1, i / n), s = Math.sin(a), jaw = s > 0 ? 1 - .2 * s : 1;
    return [x + dx + Math.cos(a) * r * .8 * k * jaw, y + s * r * (s > 0 ? 1.04 : .96) * k];
  });
  const hairCol = gc({ afro: '#231B19', swept: '#D9B86A', grey: '#B8B2A8', bald: '#B8B2A8', short: '#4A3A2E', dark: '#2A2322' }[o.hair] || '#4A3A2E');
  if (o.neck !== false) paint([[x - r * .34, y + r * .6], [x + r * .34, y + r * .6], [x + r * .4, y + r * 1.35], [x - r * .4, y + r * 1.35]], { wash: shade, ink: PAL.ink, sw: .9 });
  if (o.hair === 'afro') {   // a rounded natural, close to the head, behind it
    paint(ellPts(x + f * r * .15, y - r * .3, r * 1.02, r * .9, 30, r * .05), { wash: hairCol, ink: PAL.ink, sw: 1.1 });
  }
  for (const d of [-1, 1]) {   // the ears (the far one hides as he turns away)
    if (turn < .45 && d < 0) continue;
    const ex = x + d * r * .8 + f * r * .45;
    paint(ellPts(ex, y + r * .06, r * .14, r * .24, 10), { wash: skin, ink: PAL.ink, sw: .8 });
  }
  paint(face(0, TAU, 1), { wash: skin, ink: PAL.ink, sw: 1.3 });
  paint(face(-1.1, 1.35).concat(face(1.35, -1.1, .97, -r * .2)), { wash: shade, washOp: 90, ink: null });   // the cheek in shadow
  paint(ellPts(fx - r * .2, y - r * .55, r * .25, r * .12, 10), { wash: lite, washOp: 110, ink: null });           // light on the brow
  // hair over the crown, to a hairline
  const cap = (h, dip = 0) => face(Math.PI + .15, TAU - .15, 1.03).concat([[x + r * .7, y - r * h], [fx + r * .2, y - r * (h + .08) + dip], [x - r * .7, y - r * h]]);
  if (o.hair === 'afro') {
    paint(cap(.5), { wash: hairCol, ink: null });
    for (let i = 0; i < 26; i++) {   // curls, so it reads as hair
      const a = Math.PI + .2 + hash(i * 3.1 + x) * (Math.PI - .4), d = .45 + .5 * hash(i * 7.7 + y), cx = x + Math.cos(a) * r * .95 * d, cy = y - r * .3 + Math.sin(a) * r * .8 * d;
      inkLine([[cx - r * .05, cy], [cx, cy - r * .05], [cx + r * .05, cy]], .7, gc('#5A4A44'), 'inkfine', .6);
    }
  } else if (o.hair === 'swept') {
    paint(cap(.45), { wash: hairCol, ink: PAL.ink, sw: 1 });
    paint([[x - r * .8, y - r * .45], [x - r * .5, y - r * 1.12], [x + r * .5, y - r * 1.2], [x + r * .95, y - r * .7], [x + r * .35, y - r * .72], [x - r * .2, y - r * .5]], { wash: hairCol, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 5; i++) inkLine([[x - r * .5 + i * r * .22, y - r * 1.02], [x - r * .1 + i * r * .22, y - r * .62]], .6, gc('#8A6A2A'), 'inkfine', .4);
  } else if (o.hair === 'grey' || o.hair === 'bald') {   // receding: a fringe at the sides and back
    for (const d of [-1, 1]) paint([[x + d * r * .82, y + r * .1], [x + d * r * .85, y - r * .45], [x + d * r * .55, y - r * .78], [x + d * r * .5, y - r * .45], [x + d * r * .66, y + r * .05]], { wash: hairCol, ink: PAL.ink, sw: .8 });
    if (o.hair === 'grey') paint(cap(.72, r * .1), { wash: hairCol, ink: PAL.ink, sw: .9 });
  } else if (o.hair) paint(cap(.55), { wash: hairCol, ink: PAL.ink, sw: .9 });
  if (o.beard) {   // along the jaw, around the mouth, and a moustache
    paint(face(.12, Math.PI - .12, 1.03).concat([[x - r * .55, y + r * .3], [fx - r * .2, y + r * .42], [fx + r * .2, y + r * .42], [x + r * .55, y + r * .3]].reverse()), { wash: o.beard, ink: PAL.ink, sw: 1 });
    paint(ribbon([[fx - r * .28, y + r * .48], [fx, y + r * .42], [fx + r * .28, y + r * .48]], r * .09, r * .05), { wash: o.beard, ink: null });
  }
  if (o.lines) for (const d of [-1, 1]) inkLine([[fx + d * r * .32, y + r * .22], [fx + d * r * .42, y + r * .55]], .7, PAL.ink, 'inkfine', .5);
  const lk = (o.look || 0) * r * .12, br = o.brow || 0;
  for (const d of [-1, 1]) {
    const ex = fx + d * r * .32 * lerp(.7, 1, turn);
    paint(ellPts(ex, y - r * .12, r * .15, r * .1, 10), { wash: '#FBF6E6', ink: PAL.ink, sw: .6 });
    paint(ellPts(ex + lk, y - r * .115, r * .065, r * .075, 8), { wash: PAL.ink, ink: null });
    inkLine([[ex - r * .17, y - r * .2], [ex, y - r * .235], [ex + r * .17, y - r * .2]], .6, PAL.ink, 'inkfine', .5);   // the upper lid
    inkLine([[ex - d * r * .2, y - r * .33 - br * r * .05], [ex + d * r * .2, y - r * .33 + br * r * .05]], 1.4);    // the brow
    if (o.glasses) paint(ellPts(ex, y - r * .12, r * .24, r * .2, 14), { ink: PAL.ink, sw: .45 });
  }
  if (o.glasses) inkLine([[fx - r * .08, y - r * .15], [fx + r * .08, y - r * .15]], .5);
  inkLine([[fx + r * .03, y - r * .12], [fx - r * .08, y + r * .22]], .9);                                            // the nose
  inkLine([[fx - r * .15, y + r * .25], [fx - r * .05, y + r * .3], [fx + r * .06, y + r * .28], [fx + r * .14, y + r * .24]], 1);
  const my = y + r * .55;
  if (o.shout) {
    paint(ellPts(fx, my, r * .24, r * .12 + r * .1 * o.shout, 12), { wash: '#5A2A2A', ink: PAL.ink, sw: 1 });
    paint(ellPts(fx, my - r * .07 - r * .04 * o.shout, r * .17, r * .035, 8), { wash: '#FBF6E6', ink: null });       // teeth
  } else {
    const sm = (o.smile || 0) * r * .07, sk = (o.smirk || 0) * r * .08;
    inkLine([[fx - r * .24, my - sm * .6], [fx, my + sm], [fx + r * .24, my - sm * .6 - sk]], 1.1);
    inkLine([[fx - r * .1, my + r * .11], [fx + r * .1, my + r * .11]], .6, PAL.ink, 'inkfine', .6);                 // the lower lip
  }
  if (o.cap) {   // an officer's peaked cap: crown, band, badge, visor
    paint([[x - r * .95, y - r * .5], [x - r * 1.05, y - r * 1.2], [x + r * .2, y - r * 1.45], [x + r * 1.05, y - r * 1.15], [x + r * .95, y - r * .5]], { wash: '#26222A', ink: PAL.ink, sw: 1.2 });
    paint(rectPts(x - r * .92, y - r * .72, r * 1.84, r * .22), { wash: '#15131A', ink: PAL.ink, sw: .8 });
    paint(ellPts(x + f * r * .5, y - r * .95, r * .12, r * .1, 8), { wash: '#C9B070', ink: PAL.ink, sw: .6 });
    paint(ellPts(x + f * r - r * .15, y - r * .47, r * .95, r * .14, 14), { wash: '#0E0C10', ink: PAL.ink, sw: .8 });
  }
}

// a figure's torso as a rough trapezoid, shoulders to the panel's floor (the plain block, kept for quick figures)
const madBody = (reg, x, y, w, h, col, lean = 0) => reg([[x - w * .45 + lean, y], [x + w * .45 + lean, y], [x + w * .55, y + h], [x - w * .55, y + h]], col);
// a torso with sloping shoulders: the neck's base at (x, y), w across the shoulders, h down; lean shifts the hips
function madTorso(reg, x, y, w, h, col, lean = 0) {
  const s = w / 2;
  reg([[x - s * .3, y], [x + s * .3, y], [x + s * .8, y + s * .14], [x + s, y + s * .42], [x + s * 1.02 + lean, y + h], [x - s * 1.02 + lean, y + h], [x - s, y + s * .42], [x - s * .8, y + s * .14]], col);
}
// an arm along pts (shoulder, elbow, wrist), sleeve w wide, ending in a hand (madHand's options in h)
function madArm(reg, pts, w, col, skin, h = {}) {
  reg(ribbon(pts, w, w * .75), col);
  const [hx, hy] = pts[pts.length - 1];
  madHand(hx, hy, h.s || w * .5, skin, h);
}
// a hand at (x, y), s across: a fist, a pointing finger (point), or an open palm with fingers (open); a turns it
function madHand(x, y, s, skin, o = {}) {
  push(); translate(x, y); rotate(o.a || 0);
  if (o.point) paint(ribbon([[s * .4, -s * .25], [s * 1.3, -s * .35], [s * 2.1, -s * .38]], s * .42, s * .34), { wash: skin, ink: PAL.ink, sw: .8 });
  if (o.up) paint(ribbon([[-s * .1, -s * .5], [-s * .15, -s * 1.3], [-s * .12, -s * 2]], s * .42, s * .34), { wash: skin, ink: PAL.ink, sw: .8 });
  if (o.open) for (let i = 0; i < 4; i++) {
    const a = -Math.PI / 2 + (i - 1.5) * .2;
    paint(ribbon([[Math.cos(a) * s * .45, Math.sin(a) * s * .5], [Math.cos(a) * s * 1.3, Math.sin(a) * s * 1.35]], s * .42, s * .36), { wash: skin, ink: PAL.ink, sw: .7 });
  }
  paint(ellPts(0, 0, s * .75, s * .68, 12), { wash: skin, ink: PAL.ink, sw: .9 });
  if (o.open) paint(ribbon([[s * .5, s * .1], [s * 1.1, -s * .3]], s * .36, s * .3), { wash: skin, ink: PAL.ink, sw: .7 });   // the thumb
  else for (let i = 0; i < 3; i++) inkLine([[s * .25, -s * .35 + i * s * .3], [s * .6, -s * .3 + i * s * .3]], .5, PAL.ink, 'inkfine', .3);   // knuckles
  pop();
}
// a small figure in the crowd: shoulders and a head
function madOnlooker(reg, x, y, r, o = {}) {
  madTorso(reg, x, y + r * 1.1, r * 3, r * 4, o.coat || '#9A8E7E');
  madHead(x, y, r, { turn: .7, ...o });
}

function madLeft(reg, o, t) {
  const [px, py, pw, ph] = MAD.left;
  boilSeed('mad left');
  paint(rectPts(px, py, pw, ph * .6), { wash: MAD.sky, washOp: 150, ink: null });
  for (const [bx, by, bw, bh] of [[340, 330, 150, 420], [790, 370, 200, 330], [670, 460, 120, 240]]) {   // the city
    reg(rectPts(bx, by, bw, bh), '#D8CFBE', 1);
    for (let r = 0; r < bh / 50 - 1; r++) inkLine([[bx + 10, by + 30 + r * 50], [bx + bw - 10, by + 30 + r * 50]], .5, PAL.ink, 'inkfine', 0);
  }
  reg([[px, 700], [560, 640], [560, 960], [px, 960]], '#CFC6B2', .8);   // the steps
  for (let i = 0; i < 5; i++) inkLine([[px, 740 + i * 45], [560, 690 + i * 55]], .6, PAL.ink, 'inkfine', .2);
  // the crowd behind, watching the officer (a mix of faces)
  for (const [cx, cy, cr, hair, skin, coat] of [[380, 660, 24, 'short', '#E9D2B4', '#8C8474'], [440, 610, 27, 'bald', '#D9B48E', '#6E6A64'], [770, 550, 27, 'swept', '#EAD2B6', '#9A8E7E'],
    [840, 560, 26, 'dark', '#A87A58', '#7C7064'], [920, 545, 29, 'grey', '#E2C29C', '#5E5A56']]) madOnlooker(reg, cx, cy, cr, { hair, skin, coat, look: -.6 });
  madApe(95, 590, 46, { dark: true, cap: true, look: .6, key: 'soldier', bodyH: 7 });   // an ape soldier at the edge
  // the officer: black uniform, cross-strap and belt, breeches and tall boots, leaning in and pointing
  const [ox, oy] = MAD.faces.officer;
  reg([[ox - 50, oy + 360], [ox - 10, oy + 360], [ox - 30, oy + 490], [ox - 75, oy + 490]], '#2E2A33'); reg([[ox + 30, oy + 360], [ox + 75, oy + 360], [ox + 95, oy + 490], [ox + 50, oy + 490]], '#2E2A33');
  reg(rrPts(ox - 85, oy + 400, 62, 90, 8), '#15131A'); reg(rrPts(ox + 45, oy + 400, 62, 90, 8), '#15131A');   // boots
  madTorso(reg, ox + 5, oy + 70, 170, 300, '#2E2A33', 15);
  inkLine([[ox - 60, oy + 95], [ox + 70, oy + 260]], 2, '#8C8494');                           // the cross-strap
  paint(rectPts(ox - 80, oy + 250, 175, 18), { wash: '#15131A', ink: PAL.ink, sw: .8 }); paint(rectPts(ox + 5, oy + 248, 22, 22), { wash: '#C9B070', ink: PAL.ink, sw: .6 });
  madArm(reg, [[ox + 70, oy + 105], [ox + 140, oy + 95], [ox + 200, oy + 80]], 46, '#2E2A33', '#E8C4A0', { point: 1, a: 0, s: 22 });
  madArm(reg, [[ox - 70, oy + 110], [ox - 95, oy + 190], [ox - 85, oy + 270]], 44, '#2E2A33', '#E8C4A0', { s: 20 });
  madHead(ox, oy, 55, { cap: true, shout: 1, brow: -1, turn: .7, look: .6, lines: 1 });
  // the handler, bearded, his arm around the ape
  const [hx, hy] = MAD.faces.handler, [ax, ay] = MAD.faces.ape;
  madTorso(reg, hx, hy + 62, 160, 360, '#C9B08A');
  madApe(ax, ay, 52, { look: o.apeLook ?? 0, key: 'page' });
  madHead(hx, hy, 50, { beard: '#8A7A66', hair: 'grey', turn: .8, look: .3, brow: .5 });
  madArm(reg, [[hx + 70, hy + 100], [ax - 5, ay + 98], [ax + 55, ay + 100]], 40, '#C9B08A', '#E8C4A0', { a: .4, s: 19 });   // around its shoulders
  madApe(ax, ay, 52, { look: o.apeLook ?? 0, key: 'page', body: false });   // its head in front of his arm
  // a second ape, crouched, looking at us
  madApe(865, 680, 44, { look: 0, key: 'ape 2', bodyH: 6 });
  paint(rectPts(px, py, pw, ph), { ink: PAL.ink, sw: 2.2 });
  for (const name of MAD.leftSide) madBalloon(name, madK(o, name), o);
}

// newsprint grey that keeps a colour's lightness (so dark skin stays dark), a little warm
function madGrey(c) {
  const v = parseInt(c.slice(1), 16), l = Math.round(.3 * (v >> 16 & 255) + .59 * (v >> 8 & 255) + .11 * (v & 255));
  return mixCol('#' + ((1 << 24) + (l << 16) + (l << 8) + l).toString(16).slice(1), '#A8A49C', .2);
}

function madRight(reg, o, t) {
  const [px, py, pw, ph] = MAD.right, g = o.grey || 0, gc = c => mixCol(c, madGrey(c), g);
  boilSeed('mad right');
  paint(rectPts(px, py, pw, ph), { wash: gc('#E3D9C4'), ink: null });
  if (g > 0) {   // "civil unrest": a smoky skyline rises behind, as the colour drains
    for (let i = 0; i < 7; i++) paint(rectPts(px + 40 + i * 140, py + 470 - 120 * hash(i) * g, 110, 200 + 120 * hash(i) * g), { wash: '#6E6A64', washOp: 200 * g, ink: null });
    for (let i = 0; i < 4; i++) paint(ellPts(px + 200 + i * 230, py + 330 - 40 * i % 3, 120 * g, 60 * g, 16, 12), { wash: '#5A5650', washOp: 120 * g, ink: null });
  }
  reg(rectPts(1070, 170, 80, 700), gc('#CFC4AE'), 1);                         // a doorframe
  reg(rectPts(1390, 440, 420, 90), gc('#EFE8D8'), 1);                         // a sign over the office door (its words are the page's, not ours)
  // the blond man in a dark turtleneck, in profile, left
  const [bx, by] = MAD.faces.blond;
  madTorso(reg, bx, by + 62, 190, 330, gc('#26222A'));
  paint(rrPts(bx - 32, by + 45, 64, 32, 10), { wash: gc('#26222A'), ink: PAL.ink, sw: .9 });
  madHead(bx, by, 55, { hair: 'swept', turn: .15, look: .8, brow: -.5, skin: gc('#EBC9A6'), gc });
  // the villain behind, mid-speech, a finger raised
  const [vx, vy] = MAD.faces.villain;
  madTorso(reg, vx, vy + 60, 160, 280, gc('#7C7468'));
  madArm(reg, [[vx + 70, vy + 90], [vx + 110, vy + 30], [vx + 95, vy - 30]], 36, gc('#7C7468'), gc('#E8C4A0'), { up: 1, s: 18 });
  madHead(vx, vy, 52, { hair: 'grey', shout: .6, turn: .45, look: .6, brow: -1, glasses: 1, lines: 1, skin: gc('#E8C4A0'), gc });
  // the bearded man in front, seated, eyes down, hands at his chin
  madTorso(reg, 1470, 785, 170, 140, gc('#8A7A66'));
  madHead(1470, 720, 50, { beard: gc('#6A5A4A'), hair: 'grey', turn: .7, look: -.3, brow: .6, skin: gc('#E2BE98'), gc });
  madArm(reg, [[1400, 830], [1420, 870], [1450, 812]], 34, gc('#8A7A66'), gc('#E2BE98'), { s: 16, a: -.6 });
  madArm(reg, [[1540, 830], [1515, 870], [1485, 815]], 34, gc('#8A7A66'), gc('#E2BE98'), { s: 16, a: .6 });
  // the man in the turtleneck: he turns from the villain to us (o.hideTurtle: a scene draws him itself, leaning out)
  if (!o.hideTurtle) madTurtle(MAD.faces.turtle[0], MAD.faces.turtle[1], 58, { turn: o.turn ?? 1, gc, key: 'page' });
  paint(rectPts(px, py, pw, ph), { ink: PAL.ink, sw: 2.2 });
  for (const name of MAD.order.filter(n => !MAD.leftSide.includes(n))) madBalloon(name, madK(o, name), o);
}

// the page on a monitor, letterboxed on newsprint
SCREEN_KINDS.comic = (x, y, w, h) => { paint(rectPts(x, y, w, h), { wash: MAD.paper, ink: null }); madPage(x, y + (h - w * MAD.H / MAD.W) / 2, w, { mini: true }); };
