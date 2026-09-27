// comic.js: the MAD #157 page (assets/ref/mad157_apes.png), repainted: loose caricatures, no likenesses, on newsprint,
// slightly off register like cheap colour printing. Its balloons are lettered, never voiced (VIDEO_PLAN.md §3), and only
// the four the storyboards use are lettered; the rest of the page's boxes are left out.
//
//   madPage(x, y, w, o)   the whole page at (x, y), w wide (it's 2080 × 978 in its own units). Returns its height.
//   MAD                   the page's layout in its own units: panels, balloons, faces (for cameras and cutaways)
//
// o: k1..k4 how much of each balloon is showing (0..1; the officer's, the handler's, the villain's, the turtleneck's),
//    apeLook (-1..1: the ape's eyes slide), turn (0..1: the turtleneck man turns from the villain to us; default 1),
//    grey (0..1: panel 2 drains to 1960s newsprint grey), only ('left' | 'right'), mini (no lettering: a thumbnail),
//    hideTurtle (a scene draws him itself), t
//   madApe(x, y, r, o), madTurtle(x, y, r, o)   the ape and the man in the turtleneck, anywhere (the mirror, the fourth wall)
//   SCREEN_KINDS.comic    any Desk monitor can show the page

const MAD = {
  W: 2080, H: 978,
  left: [20, 110, 990, 850], right: [1030, 110, 1030, 850],
  paper: '#EFE6CF', red: '#C9302C', sky: '#BFD6D6', ape: '#8A5A3A', apeLt: '#C99A6E',
  balloons: {
    officer: { box: [40, 130, 230, 330], lines: ['Hold it!', 'WHAT DID', 'THAT APE', 'SAY?!?'], col: '#C9302C', tail: [150, 420] },
    handler: { box: [640, 250, 990, 350], lines: ['Because THAT ape', 'is a ventriloquist!'], tail: [620, 450] },
    villain: { box: [1420, 130, 1760, 380], lines: ['We must perpetuate', 'slavery! We have', 'always needed slaves,', 'and we always will!'], tail: [1620, 500] },
    turtle:  { box: [1790, 130, 2040, 400], lines: ['Ever get', 'the feeling', "you're in", 'the wrong', 'movie!?'], tail: [1850, 440] },
  },
  faces: { officer: [300, 470], handler: [620, 520], ape: [720, 610], villain: [1610, 610], turtle: [1830, 560], blond: [1250, 540] },
};

function madPage(x, y, w, o = {}) {
  const s = w / MAD.W, h = MAD.H * s, X = v => x + v * s, Y = v => y + v * s;
  occupy(x, y, x + w, y + h, 1, 'comic');
  const reg = madReg;
  const t = o.t ?? T;
  push(); translate(x, y); scale(s);
  boilSeed('mad paper');
  paint(rectPts(0, 0, MAD.W, MAD.H), { wash: MAD.paper, fill: '#E2D5B6', fillOp: 60, bleed: .15, tex: .6, ink: null });
  if (o.only !== 'right') madLeft(reg, o, t);
  if (o.only !== 'left') madRight(reg, o, t);
  pop();
  // lettering (screen-space letters, so placed by hand from the page's units)
  if (!o.mini) for (const [name, kk] of [['officer', o.k1 ?? 1], ['handler', o.k2 ?? 1], ['villain', o.k3 ?? 1], ['turtle', o.k4 ?? 1]]) {
    if (kk <= 0 || (o.only === 'left' && (name === 'villain' || name === 'turtle')) || (o.only === 'right' && (name === 'officer' || name === 'handler'))) continue;
    const B = MAD.balloons[name], [bx0, by0, bx1, by1] = B.box, words = B.lines.join(' ').split(' ').length;
    let shown = Math.ceil(kk * words), n = 0;
    const lh = (by1 - by0) / (B.lines.length + .6);
    B.lines.forEach((ln, i) => {
      const ws = ln.split(' '), part = ws.slice(0, Math.max(0, Math.min(ws.length, shown - n))).join(' '); n += ws.length;
      if (!part) return;
      letter(part, X((bx0 + bx1) / 2), Y(by0 + lh * (i + .8)), lh * .78 * s, B.col || PAL.ink, { ink: false, font: `bold ${Math.round(lh * .78 * s)}px "Patrick Hand", sans-serif` });
    });
  }
  return h;
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
function madBalloon(name, k) {
  if (k <= 0) return;
  const B = MAD.balloons[name], [x0, y0, x1, y1] = B.box, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, p = backOut(clamp(k * 4));
  boilSeed('mad balloon ' + name);
  push(); translate(cx, cy); scale(p);
  inkLine([[(x0 + x1) / 2 - cx - 30, y1 - cy], [lerp(cx, B.tail[0], .5) - cx, lerp(y1, B.tail[1], .5) - cy], [B.tail[0] - cx, B.tail[1] - cy]], 1.4, PAL.ink, 'ink', .6);
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
  madBalloon('officer', o.k1 ?? 1); madBalloon('handler', o.k2 ?? 1);
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
  madBalloon('villain', o.k3 ?? 1); madBalloon('turtle', o.k4 ?? 1);
}

// the page on a monitor, letterboxed on newsprint
SCREEN_KINDS.comic = (x, y, w, h) => { paint(rectPts(x, y, w, h), { wash: MAD.paper, ink: null }); madPage(x, y + (h - w * MAD.H / MAD.W) / 2, w, { mini: true }); };
