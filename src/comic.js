// comic.js: the MAD #157 page (assets/ref/mad157_apes.png), repainted: loose caricatures, no likenesses, on newsprint,
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
// mask lets light through), body: false for the head alone, bodyH (in r). Drawn in whatever space it's called in.
function madApe(x, y, r, o = {}) {
  boilSeed('mad ape ' + (o.key || x));
  const op = o.op ?? 255;
  if (o.body !== false) madBody(madReg, x, y + r * .95, r * 2.7, r * (o.bodyH ?? 5), '#7A5A48');
  push(); translate(x, y); rotate(o.rot || 0);
  paint(ellPts(0, 0, r, r * 1.12, 20), { wash: MAD.ape, washOp: op, ink: PAL.ink, sw: 1.2 });
  paint(ellPts(0, r * .42, r * .65, r * .5, 16), { wash: MAD.apeLt, washOp: op, ink: PAL.ink, sw: .9 });
  const lk = (o.look ?? 0) * r * .13;
  for (const d of [-1, 1]) { paint(ellPts(d * r * .33, -r * .23, r * .17, r * .13, 8), { wash: '#FBF6E6', washOp: op, ink: PAL.ink, sw: .6 }); paint(ellPts(d * r * .33 + lk, -r * .21, r * .08, r * .09, 6), { wash: PAL.ink, washOp: op, ink: null }); }
  inkLine([[-r * .5, -r * .46], [-r * .15, -r * .38]], 1.1); inkLine([[r * .15, -r * .38], [r * .5, -r * .46]], 1.1);
  inkLine([[-r * .23, r * .65], [0, r * .6], [r * .23, r * .65]], 1);   // the sheepish mouth
  pop();
}

// The man in the turtleneck (head r): turn 0..1 from the villain to us. Drawn in whatever space it's called in.
function madTurtle(x, y, r, o = {}) {
  const tn = o.turn ?? 1, gc = o.gc || (c => c);
  madBody(madReg, x, y + r * 1.3, r * 3.3, r * 5.5, gc('#E6DCCB'));
  boilSeed('mad turtleneck ' + (o.key || ''));
  for (let i = 0; i < 5; i++) inkLine([[x - r, y + r * 1.2 + i * r * .24], [x + r, y + r * 1.2 + i * r * .24]], .8, PAL.ink, 'inkfine', .2);   // the ribbed collar
  madHead(x, y, r, { hair: 'afro', turn: tn, look: lerp(-1, 0, tn), skin: gc('#7A5238'), smile: tn });
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

// A loose head: skin, hair, eyes (look -1..1 sideways), mouth. turn 0..1: from a three-quarter view facing left to facing
// us. Nothing here is anyone's likeness.
function madHead(x, y, r, o = {}) {
  boilSeed('mad head ' + x + ' ' + y);
  const turn = o.turn ?? 1, f = lerp(-.35, 0, turn), skin = o.skin || '#E8C4A0';
  if (o.hair === 'afro') paint(ellPts(x, y - r * .25, r * 1.15, r * 1.05, 22, r * .06), { wash: '#2A2120', ink: PAL.ink, sw: 1.2 });
  paint(ellPts(x, y, r * .82, r, 22), { wash: skin, ink: PAL.ink, sw: 1.3 });
  const fx = x + f * r;
  if (o.hair === 'swept') paint([[x - r * .85, y - r * .2], [x - r * .7, y - r * 1.05], [x + r * .3, y - r * 1.15], [x + r * .9, y - r * .6], [x + r * .2, y - r * .7]], { wash: '#D9B86A', ink: PAL.ink, sw: 1 });
  if (o.hair === 'grey') paint([[x - r * .85, y - r * .1], [x - r * .5, y - r * .95], [x + r * .5, y - r * .95], [x + r * .85, y - r * .1], [x + r * .5, y - r * .6], [x - r * .5, y - r * .6]], { wash: '#B8B2A8', ink: PAL.ink, sw: 1 });
  if (o.cap) {   // a peaked officer's cap
    paint([[x - r * .95, y - r * .55], [x - r * .8, y - r * 1.25], [x + r * .9, y - r * 1.35], [x + r * .95, y - r * .55]], { wash: '#26222A', ink: PAL.ink, sw: 1.2 });
    paint(ellPts(x - r * .15, y - r * .5, r * 1.05, r * .2, 14), { wash: '#15131A', ink: null });
  }
  if (o.beard) paint([[x - r * .8, y + r * .05], [x - r * .5, y + r * 1.15], [x + r * .5, y + r * 1.15], [x + r * .8, y + r * .05], [x + r * .4, y + r * .45], [x - r * .4, y + r * .45]], { wash: o.beard, ink: PAL.ink, sw: 1 });
  const lk = (o.look || 0) * r * .12;
  for (const d of [-1, 1]) {
    const ex = fx + d * r * .32 * lerp(.7, 1, turn);
    paint(ellPts(ex, y - r * .12, r * .15, r * .1, 10), { wash: '#FBF6E6', ink: PAL.ink, sw: .6 });
    paint(ellPts(ex + lk, y - r * .12, r * .06, r * .07, 8), { wash: PAL.ink, ink: null });
    inkLine([[ex - r * .18, y - r * .3 - (o.brow || 0) * d * r * .06], [ex + r * .18, y - r * .3 + (o.brow || 0) * d * r * .06]], 1.1);
  }
  inkLine([[fx, y - r * .05], [fx - r * .12, y + r * .25], [fx + r * .02, y + r * .3]], 1);
  if (o.shout) paint(ellPts(fx, y + r * .58, r * .26, r * .2 + r * .08 * o.shout, 12), { wash: '#5A2A2A', ink: PAL.ink, sw: 1 });
  else inkLine([[fx - r * .25, y + r * .58], [fx, y + r * .6 + (o.smile || 0) * r * .08], [fx + r * .25, y + r * .58]], 1.1);
}

// a figure's torso as a rough trapezoid, shoulders to the panel's floor
const madBody = (reg, x, y, w, h, col, lean = 0) => reg([[x - w * .45 + lean, y], [x + w * .45 + lean, y], [x + w * .55, y + h], [x - w * .55, y + h]], col);

function madLeft(reg, o, t) {
  const [px, py, pw, ph] = MAD.left;
  boilSeed('mad left');
  paint(rectPts(px, py, pw, ph * .6), { wash: MAD.sky, washOp: 150, ink: null });
  for (const [bx, by, bw, bh] of [[340, 330, 150, 420], [790, 370, 200, 330], [670, 460, 120, 240]]) {   // the city
    reg(rectPts(bx, by, bw, bh), '#D8CFBE', 1);
    for (let r = 0; r < bh / 50 - 1; r++) inkLine([[bx + 10, by + 30 + r * 50], [bx + bw - 10, by + 30 + r * 50]], .5, PAL.ink, 'inkfine', 0);
  }
  for (const [hx, hy] of [[470, 650], [860, 580], [930, 575], [120, 560]]) madHead(hx, hy, 32, { skin: '#E9D9C0', turn: .6 });   // onlookers
  // the officer: black uniform, arm out, pointing
  const [ox, oy] = MAD.faces.officer;
  madBody(reg, ox + 10, oy + 55, 150, 360, '#2E2A33', 10);
  reg([[ox + 60, oy + 90], [ox + 230, oy + 45], [ox + 235, oy + 75], [ox + 70, oy + 130]], '#2E2A33');                // the arm
  paint(ellPts(ox + 245, oy + 58, 18, 14, 10), { wash: '#E8C4A0', ink: PAL.ink, sw: 1 });
  reg(rectPts(ox - 60, oy + 415, 50, 110), '#26222A'); reg(rectPts(ox + 50, oy + 415, 50, 110), '#26222A');           // boots
  madHead(ox, oy, 55, { cap: true, shout: 1, brow: 1, turn: .7 });
  // the handler, his arm around the ape
  const [hx, hy] = MAD.faces.handler;
  madBody(reg, hx, hy + 60, 150, 340, '#C9B08A');
  madHead(hx, hy, 50, { beard: '#8A7A66', hair: 'grey', turn: .8, look: .3 });
  // the ape, sheepish: its eyes slide sideways
  const [ax, ay] = MAD.faces.ape;
  madApe(ax, ay, 52, { look: o.apeLook ?? 0, key: 'page' });
  reg([[hx + 50, hy + 110], [ax + 40, ay + 70], [ax + 30, ay + 95], [hx + 40, hy + 140]], '#C9B08A');                  // the handler's arm around it
  // a second ape behind, and the panel border
  boilSeed('mad ape 2'); reg(ellPts(850, 660, 44, 50, 18), MAD.ape); paint(ellPts(850, 680, 28, 20, 14), { wash: MAD.apeLt, ink: PAL.ink, sw: .8 });
  paint(rectPts(px, py, pw, ph), { ink: PAL.ink, sw: 2.2 });
  for (const name of MAD.leftSide) madBalloon(name, madK(o, name), o);
}

function madRight(reg, o, t) {
  const [px, py, pw, ph] = MAD.right, g = o.grey || 0, gc = c => mixCol(c, '#A8A49C', g);
  boilSeed('mad right');
  paint(rectPts(px, py, pw, ph), { wash: gc('#E3D9C4'), ink: null });
  if (g > 0) {   // "civil unrest": a smoky skyline rises behind, as the colour drains
    for (let i = 0; i < 7; i++) paint(rectPts(px + 40 + i * 140, py + 470 - 120 * hash(i) * g, 110, 200 + 120 * hash(i) * g), { wash: '#6E6A64', washOp: 200 * g, ink: null });
    for (let i = 0; i < 4; i++) paint(ellPts(px + 200 + i * 230, py + 330 - 40 * i % 3, 120 * g, 60 * g, 16, 12), { wash: '#5A5650', washOp: 120 * g, ink: null });
  }
  reg(rectPts(1070, 170, 80, 700), gc('#CFC4AE'), 1);                         // a doorframe
  // the blond man in a dark turtleneck, in profile, left
  const [bx, by] = MAD.faces.blond;
  madBody(reg, bx, by + 60, 170, 330, gc('#26222A'));
  madHead(bx, by, 55, { hair: 'swept', turn: .15, look: .8, skin: gc('#EBC9A6') });
  // the bearded man below, eyes down
  madBody(reg, 1470, 790, 150, 120, gc('#8A7A66'));
  madHead(1470, 720, 50, { beard: gc('#6A5A4A'), hair: 'grey', turn: .7, look: -.3, skin: gc('#E2BE98') });
  // the villain, mid-speech
  const [vx, vy] = MAD.faces.villain;
  madBody(reg, vx, vy + 55, 150, 280, gc('#7C7468'));
  madHead(vx, vy, 52, { hair: 'grey', shout: .6, turn: .45, look: .6, brow: -1, skin: gc('#E8C4A0') });
  // the man in the turtleneck: he turns from the villain to us (o.hideTurtle: a scene draws him itself, leaning out)
  if (!o.hideTurtle) madTurtle(MAD.faces.turtle[0], MAD.faces.turtle[1], 58, { turn: o.turn ?? 1, gc, key: 'page' });
  paint(rectPts(px, py, pw, ph), { ink: PAL.ink, sw: 2.2 });
  for (const name of MAD.order.filter(n => !MAD.leftSide.includes(n))) madBalloon(name, madK(o, name), o);
}

// the page on a monitor, letterboxed on newsprint
SCREEN_KINDS.comic = (x, y, w, h) => { paint(rectPts(x, y, w, h), { wash: MAD.paper, ink: null }); madPage(x, y + (h - w * MAD.H / MAD.W) / 2, w, { mini: true }); };
