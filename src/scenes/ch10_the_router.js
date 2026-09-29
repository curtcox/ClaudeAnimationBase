// ch10_the_router.js: chapter 10 (T49–T51). Storyboard: docs/storyboards/ch10_the_router.md.
// A router between them: a switchboard room behind frosted glass that Claude never sees clearly; the tags it does see;
// a correction about swapping; how it knows any of this (a briefing folder: testimony, not observation).
(() => {
  const HOUR = 11.7;
  const say = (id, phrase, dk) => atWord(id, phrase, dk);
  const talking = t => clawdMouth(talkOf(t, 'claude'));
  const win = (t, a, b, d = .5) => seg(t, a, a + d) * (1 - seg(t, b, b + d));
  const BAK = '#5A3A26', BRASS = '#C9A441', FROST = '#D6DCE0';

  // ---------- pieces ----------
  // the switchboard: a bakelite panel of brass jacks, cords patched between them; o.patch 0..1 draws one more cord
  function switchboard(x, y, w, h, t, o = {}) {
    boilSeed('switchboard ' + x);
    paint(rrPts(x, y, w, h, 10), { wash: BAK, fill: '#3E2818', fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.2 });
    const cols = 7, rows = 5, jx = i => x + w * (.1 + .8 * i / (cols - 1)), jy = j => y + h * (.12 + .5 * j / (rows - 1));
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      paint(ellPts(jx(i), jy(j), 7, 7, 8), { wash: '#1A120C', ink: BRASS, sw: .7 });
      if (frac(t * .4 + hash(i * 7 + j)) < .12) glow(jx(i), jy(j) - 14, 12, '#FFB84A', .8);   // a lamp over the jack
    }
    for (let k = 0; k < 4; k++) {   // cords already patched, sagging
      const a = [jx(Math.floor(hash(k) * cols)), jy(Math.floor(hash(k + 9) * rows))], b = [jx(Math.floor(hash(k + 3) * cols)), jy(Math.floor(hash(k + 5) * rows))];
      inkLine([a, [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 60], b], 2.4, ['#C9302C', '#2A2A2A', '#3A6FC9', '#E8C27A'][k], 'ink', .6);
    }
    for (let i = 0; i < cols; i++) { paint(rrPts(jx(i) - 6, y + h * .8, 12, 26, 4), { wash: BRASS, ink: PAL.ink, sw: .5 }); inkLine([[jx(i), y + h * .8 + 26], [jx(i), y + h * .98]], 1.6, '#2A2A2A', 'inkfine', 0); }
    if (o.patch > 0) {   // a cord lifted from the shelf and plugged in
      const from = [jx(3), y + h * .8], to = [jx(o.to ?? 5), jy(o.row ?? 1)], k = ease(o.patch), p = [lerp(from[0], to[0], k), lerp(from[1], to[1], k)];
      inkLine([from, [(from[0] + p[0]) / 2, Math.max(from[1], p[1]) + 40], p], 3, '#C9302C', 'ink', .6);
      paint(rrPts(p[0] - 5, p[1] - 14, 10, 20, 3), { wash: BRASS, ink: PAL.ink, sw: .5 });
      return p;
    }
  }
  // the operator, seen from behind in a chair, headset on, one arm reaching to the board (generic, mid-century)
  function operator(x, y, s, t, reach) {
    boilSeed('operator');
    paint(rectPts(x - 60 * s, y - 20 * s, 120 * s, 120 * s), { wash: '#6A4A34', ink: PAL.ink, sw: 1 });   // the chair back
    paint([[x - 70 * s, y - 10 * s], [x - 60 * s, y - 150 * s], [x + 60 * s, y - 150 * s], [x + 70 * s, y - 10 * s]], { wash: '#4E5B78', ink: PAL.ink, sw: 1.1 });
    paint(ellPts(x, y - 200 * s, 44 * s, 50 * s, 18), { wash: '#6A4A34', ink: PAL.ink, sw: 1 });   // hair, from behind
    inkLine([[x - 46 * s, y - 200 * s], [x, y - 256 * s], [x + 46 * s, y - 200 * s]], 4 * s, '#2A2A2A', 'ink', .6);   // the headset band
    paint(ellPts(x - 46 * s, y - 196 * s, 12 * s, 16 * s, 10), { wash: '#2A2A2A', ink: null });
    const [hx, hy] = reach || [x + 140 * s, y - 180 * s];
    paint(ribbon([[x + 50 * s, y - 130 * s], [lerp(x + 50 * s, hx, .5), lerp(y - 130 * s, hy, .5) + 20 * s], [hx, hy]], 20 * s, 14 * s), { wash: '#4E5B78', ink: PAL.ink, sw: .9 });
    paint(ellPts(hx, hy, 14 * s, 12 * s, 10), { wash: '#E8C4A0', ink: PAL.ink, sw: .8 });
  }
  // the room behind the glass: switchboard and operator; returns where the operator's hand is
  function room(x, y, s, t, o = {}) {
    const bw = 520 * s, bh = 360 * s;
    const p = switchboard(x - bw / 2, y - bh - 140 * s, bw, bh, t, { patch: o.patch ?? .5 + .5 * Math.sin(t * .9), to: o.to, row: o.row });
    operator(x - 60 * s, y, s * 1.2, t, p);
  }
  // frosted glass over whatever was painted behind it: k 0..1 how milky; a frame and a few streaks
  function frost(x, y, w, h, k, o = {}) {
    occupy(x, y, x + w, y + h, 1, 'frosted glass');
    boilSeed('frost ' + x);
    paint(rectPts(x, y, w, h), { wash: FROST, washOp: 255 * k, fill: '#EEF2F4', fillOp: 90 * k, bleed: .3, tex: .7, ink: null });
    for (let i = 0; i < 6; i++) inkLine([[x + w * (.1 + i * .15), y + h * .1], [x + w * (.02 + i * .15), y + h * .9]], 6, '#FFFFFF', 'inkfine', 0);
    if (o.frame !== false) paint(rectPts(x - 12, y - 12, w + 24, h + 24), { wash: null, ink: '#6B5646', sw: 2.2 });
  }
  // shadows moving behind frosted glass (what Claude sees of the machinery)
  function shadows(x, y, w, h, t) {
    boilSeed('shadows');
    for (let i = 0; i < 4; i++) {
      const sx = x + w * frac(.2 + i * .27 + t * (.03 + .015 * i)), sy = y + h * (.35 + .3 * hash(i));
      paint(ellPts(sx, sy, 50 + 30 * hash(i + 2), 110 + 40 * hash(i + 4), 16), { wash: '#6A7078', washOp: 120, ink: null });
    }
  }
  // the reminder tags, in the order Claude names them: an icon on a paper tag, a label in its words
  const TAGS = [['lock', 'cybersecurity'], ['scales', 'ethics'], ['copyright', 'intellectual property'], ['frame', 'images'], ['scroll', 'long conversations'], ['bell', 'general system warnings']];
  function tagIcon(kind, x, y, s) {
    const I = PAL.ink;
    if (kind === 'lock') { inkLine([[x - 16 * s, y - 4 * s], [x - 16 * s, y - 24 * s], [x, y - 36 * s], [x + 16 * s, y - 24 * s], [x + 16 * s, y - 4 * s]], 5 * s, '#6A6470', 'ink', .6); paint(rrPts(x - 26 * s, y - 6 * s, 52 * s, 40 * s, 6 * s), { wash: BRASS, ink: I, sw: .9 }); paint(ellPts(x, y + 12 * s, 5 * s, 6 * s, 8), { wash: I, ink: null }); }
    if (kind === 'scales') { inkLine([[x, y - 36 * s], [x, y + 30 * s]], 3 * s, I, 'ink', 0); inkLine([[x - 34 * s, y - 26 * s], [x + 34 * s, y - 26 * s]], 3 * s, I, 'ink', 0); for (const d of [-1, 1]) paint([[x + d * 34 * s - 18 * s, y + 4 * s], [x + d * 34 * s + 18 * s, y + 4 * s], [x + d * 34 * s, y + 16 * s]], { wash: BRASS, ink: I, sw: .8 }); paint(rectPts(x - 20 * s, y + 28 * s, 40 * s, 6 * s), { wash: I, ink: null }); }
    if (kind === 'copyright') { paint(ellPts(x, y, 34 * s, 34 * s, 22), { wash: '#FBF8F0', ink: I, sw: 1.4 }); lab('C', x, y + 2 * s, 44 * s, I); }
    if (kind === 'frame') { paint(rectPts(x - 36 * s, y - 28 * s, 72 * s, 56 * s), { wash: '#A9774F', ink: I, sw: 1 }); paint(rectPts(x - 26 * s, y - 18 * s, 52 * s, 36 * s), { wash: '#BFD6D6', ink: null }); paint([[x - 24 * s, y + 16 * s], [x - 6 * s, y - 6 * s], [x + 8 * s, y + 8 * s], [x + 24 * s, y - 2 * s], [x + 24 * s, y + 16 * s]], { wash: '#7ABA5A', ink: null }); }
    if (kind === 'scroll') { paint(rectPts(x - 22 * s, y - 36 * s, 44 * s, 72 * s), { wash: '#FBF6E6', ink: I, sw: 1 }); for (const d of [-1, 1]) paint(ellPts(x, y + d * 38 * s, 28 * s, 7 * s, 12), { wash: '#E8D9A8', ink: I, sw: .8 }); for (let i = 0; i < 5; i++) inkLine([[x - 14 * s, y - 24 * s + i * 12 * s], [x + 14 * s, y - 24 * s + i * 12 * s]], 1, '#8C8894', 'inkfine', 0); }
    if (kind === 'bell') { paint([[x - 30 * s, y + 20 * s], [x - 22 * s, y - 16 * s], [x, y - 32 * s], [x + 22 * s, y - 16 * s], [x + 30 * s, y + 20 * s]], { wash: BRASS, ink: I, sw: 1 }); paint(ellPts(x, y + 26 * s, 7 * s, 7 * s, 8), { wash: BRASS, ink: I, sw: .8 }); }
  }
  function tag(i, x, y, s, k, o = {}) {   // a paper tag on a string; k 0..1 swings it in
    if (k <= 0) return;
    const [kind, name] = TAGS[i], sw = (1 - easeOut(k)) * .6 + Math.sin(T * 2 + i) * .03;
    occupy(x - 80 * s, y - 20 * s, x + 80 * s, y + 200 * s, 1, 'tag');
    boilSeed('tag ' + i + ' ' + (o.key || ''));
    push(); translate(x, y); rotate(sw);
    inkLine([[0, -20 * s], [0, 10 * s]], 1.2, '#8A6A4A', 'inkfine', 0);
    paint([[-60 * s, 20 * s], [0, 0], [60 * s, 20 * s], [60 * s, 170 * s], [-60 * s, 170 * s]], { wash: '#F2E6C4', ink: PAL.ink, sw: 1 });
    paint(ellPts(0, 18 * s, 6 * s, 6 * s, 8), { wash: '#FBF8F0', ink: PAL.ink, sw: .6 });
    tagIcon(kind, 0, 90 * s, s);
    pop();
    if (o.label !== false) {   // one line, or two for the long names
      const w = name.split(' '), lines = w.length > 1 && name.length > 10 ? [w.slice(0, Math.ceil(w.length / 2)).join(' '), w.slice(Math.ceil(w.length / 2)).join(' ')] : [name];
      lines.forEach((ln, j) => lab(ln, x, y + (205 + j * 30) * s, 26 * s, '#4E3A2A', { alpha: seg(k, .4, 1) }));
    }
  }
  // a letter in a brass capsule (the pneumatic post)
  function capsule(x, y, o = {}) {
    boilSeed('capsule'); const s = o.s || 1;
    paint(rrPts(x - 50 * s, y - 20 * s, 100 * s, 40 * s, 18 * s), { wash: BRASS, ink: PAL.ink, sw: 1 });
    paint(rectPts(x - 30 * s, y - 34 * s, 60 * s, 16 * s), { wash: '#FBF8F0', ink: PAL.ink, sw: .7 });
  }
  function stamp(txt, x, y, k, rot = -.12, size = 44) {
    if (k <= 0) return;
    const sc = lerp(1.6, 1, easeOut(k));
    boilSeed('stamp ' + txt); push(); translate(x, y); rotate(rot); scale(sc);
    paint(rrPts(-txt.length * size * .3 - 16, -size * .7, txt.length * size * .6 + 32, size * 1.4, 8), { wash: null, ink: '#C9302C', sw: 2.4 });
    pop();
    lab(txt, x, y + 2, size * sc, '#C9302C', { rot, alpha: clamp(k * 3) });
  }
  function monitor(x, y, w, h, t, o = {}) {   // Claude on a screen (Curt's side)
    boilSeed('monitor ' + x); occupy(x - 12, y - 12, x + w + 12, y + h + 60, 1, 'monitor');
    paint(rrPts(x - 12, y - 12, w + 24, h + 24, 8), { wash: '#1A181D', ink: PAL.ink, sw: 1.1 });
    paint(rectPts(x + w / 2 - 12, y + h + 12, 24, 40), { wash: '#2A272E', ink: PAL.ink, sw: .8 });
    paint(rectPts(x, y, w, h), { wash: '#262229', ink: null });
    clawd(x + w / 2, y + h * .9, h / 14, { ...feel(o.mood || 'neutral', t), mouth: talking(t), noShadow: true, boilKey: 'monitor claude ' + x });
    glow(x + w / 2, y + h * .55, w * .5, '#E8956A', .3);
  }
  // Claude's stand-in (the "swap" it later takes back): a grey Clawd drawn in dashes
  function standIn(x, y, u, t, k, erase = 0) {
    if (k <= 0 || erase >= 1) return;
    clawd(x, y, u, { ...feel('neutral', t), tint: '#8C8894', tintK: .9, eyes: 'normal', emote: null, noShadow: true, boilKey: 'stand in' });
    boilSeed('stand in veil'); paint(rectPts(x - 7 * u, y - 11 * u, 14 * u, 12 * u), { wash: '#EFE8DA', washOp: 255 * (1 - k * (1 - erase)), ink: null });
    if (erase > 0 && erase < 1) {   // an eraser crossing it
      const ex = lerp(x - 6 * u, x + 6 * u, erase), ey = y - 6 * u + Math.sin(erase * 30) * 2 * u;
      paint(rrPts(ex - 40, ey - 60, 80, 120, 10), { wash: '#E8A0A8', ink: PAL.ink, sw: 1 }); paint(rectPts(ex - 40, ey + 20, 80, 40), { wash: '#4E5B78', ink: PAL.ink, sw: .8 });
    }
  }
  function folder(x, y, w, h, open, o = {}) {   // a manila briefing folder; open 0..1 swings its cover up
    occupy(x, y - 30, x + w, y + h, 1, 'folder');
    boilSeed('folder ' + (o.key || x));
    paint(rrPts(x, y, w, h, 8), { wash: '#D9B878', ink: PAL.ink, sw: 1.2 });
    paint(rrPts(x + w * .08, y - 30, w * .3, 40, 8), { wash: '#D9B878', ink: PAL.ink, sw: 1 });   // the tab
    if (o.pages) o.pages(x + 20, y + 20, w - 40, h - 40, open);
    const cy = lerp(y + h, y - h * .2, ease(open));
    if (open < .98) paint([[x, y], [x + w, y], [x + w + 10 * open, cy], [x - 10 * open, cy]].map(([px, py]) => [px, py]), { wash: '#E4C68A', fill: '#C9A45A', fillOp: 50, ink: PAL.ink, sw: 1.1 });
  }
  const pencil = (x, y, rot) => { push(); translate(x, y); rotate(rot); paint(rectPts(-70, -7, 120, 14), { wash: '#E8B83A', ink: PAL.ink, sw: .8 }); paint([[50, -7], [72, 0], [50, 7]], { wash: '#E8D0A8', ink: PAL.ink, sw: .6 }); paint(rectPts(-86, -7, 16, 14), { wash: '#E8A0A8', ink: PAL.ink, sw: .6 }); pop(); };

  // ---------- shots ----------
  // A: Curt's question travels by pneumatic post and comes back stamped; the wall between them becomes frosted glass
  // with a switchboard operator behind it
  function shotA(t) {
    const u = L('T49.U.01'), ask = say('T49.U.01', 'if I ask you', -.2), tagged = say('T49.U.01', 'it gets tagged', 0), rej = say('T49.U.01', 'rejected', 0), down = say('T49.U.01', 'downgraded', 0), fair = say('T49.U.01', 'In fairness', 0), router = say('T49.U.01', 'It is more accurately', 0);
    if (t < ask) { deskShot(t, { hour: HOUR, typing: true, mood: emotions(t, [[0, 'neutral']]) }); if (t < .6) brushWipe(.5 + t / 1.2); return; }
    paperWorld(t);
    // Curt at a small desk on the left, Claude's screen on the right, a tube over the top between them
    const glassK = seg(t, router, router + 1.4);
    const tube = [[300, 700], [300, 330], [1080, 330], [1080, 600]];
    room(690, 900, .9, t);
    frost(420, 200, 540, 740, lerp(1, .55, glassK) * glassK + (1 - glassK) * 0, { frame: glassK > .05 });
    if (glassK < 1) { boilSeed('wall a'); paint(rectPts(410, 190, 560, 760), { wash: '#B89A78', washOp: 255 * (1 - glassK), ink: null }); for (let i = 1; i < 7; i++) inkLine([[410 + i * 80, 190], [410 + i * 80, 950]], 1.4, mixCol('#8A6A4A', '#EFE8DA', glassK), 'inkfine', 0); }
    boilSeed('tube'); inkLine(tube, 26, '#8C8894', 'ink', 0); inkLine(tube, 16, '#B8B4BE', 'ink', 0);
    boilSeed('curt desk a'); paint(rectPts(140, 760, 330, 30), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 }); paint(rectPts(160, 790, 20, 170), { wash: '#6B5646', ink: null }); paint(rectPts(430, 790, 20, 170), { wash: '#6B5646', ink: null });
    curtAs(300, 1010, 26, { view: 'back', pose: 'sit', seed: 2, handL: [1.5, -1.7 + .1 * Math.sin(t * 11)], handR: [-1.5, -1.8], boilKey: 'curt tube' });
    monitor(960, 610, 240, 170, t, { mood: t > fair && t < router ? 'shy' : 'neutral' });
    // the capsule: out along the tube, stopped midway and tagged, back again stamped
    const along = (k) => { const L0 = [370, 750, 270], tot = L0.reduce((a, b) => a + b); let d = k * tot; for (let i = 0; i < 3; i++) { if (d <= L0[i] || i === 2) { const a = tube[i], b = tube[i + 1], f = clamp(d / L0[i]); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; } d -= L0[i]; } };
    const out = seg(t, ask, tagged), back = seg(t, rej - .3, rej + 1.2);
    const k = back > 0 ? lerp(.5, 0, ease(back)) : lerp(0, .5, ease(out));
    const [cx, cy] = along(k), shrink = 1 - .35 * seg(t, down, down + .6);
    // someone hidden inside the machine: the Mechanical Turk, in Racknitz's cutaway (1789), the operator at his board
    artwork('mechanical-turk', 1520, 400, 430, { k: seg(t, router + .3, router + 2) });
    if (t < router + 2) {
      capsule(cx, cy, { s: shrink });
      if (t > tagged) { tag(0, cx + 30, cy + 20, .5 * shrink, seg(t, tagged, tagged + .6), { label: false, key: 'on capsule' }); }
      stamp('rejected', cx + 60, cy - 90, seg(t, rej, rej + .3), -.12, 52);
    }
  }
  // B: from Claude's side the glass shows only moving shadows; a warning slid under; a stand-in; Curt sees "Claude";
  // one gear among many; refusals that would be Claude's own; a blueprint binned; the easel; several folders
  function shotB(t) {
    const c1 = L('T49.C.01'), c2 = L('T49.C.02'), c3 = L('T49.C.03');
    const warn = say('T49.C.01', 'I get a warning', -.2), swap = say('T49.C.01', "swapped out", -.3), side = say('T49.C.01', 'from your side', -.2), sys = say('T49.C.01', "you're talking to a system", -.3);
    paperWorld(t);
    if (t < side) {   // Claude faces the frosted glass; shadows move behind it
      room(440, 900, .9, t); frost(60, 160, 760, 780, .82); shadows(60, 160, 760, 780, t);
      claudeAs(1060, 920, 14, { ...feel('thinking', t), mouth: talking(t), lookX: -1, boilKey: 'claude glass' });
      const n = seg(t, warn, warn + 1.2);
      if (n > 0) { boilSeed('warning note'); paint(rectPts(lerp(700, 860, ease(n)), 900, 150, 40), { wash: '#FFE9A0', ink: PAL.ink, sw: 1 }); }
      standIn(1230 - 60, 920, 10, t, seg(t, swap, swap + .6) * (1 - seg(t, side - .5, side)));
      return;
    }
    if (t < sys) { monitor(285, 120, 720, 460, t); curtAs(645, 1180, 34, { view: 'back', pose: 'sit', seed: 2, boilKey: 'curt sees claude' }); return; }
    if (t < c2.t0) {   // pull back: one gear among many
      const pull = ease(seg(t, sys, sys + 2)), s = lerp(1.6, .8, pull);
      boilSeed('gears'); occupy(60, 60, 1230, 1020, 1, 'gears');
      const G = [[645, 540, 150, 1], [390, 380, 120, -1], [900, 360, 110, -1], [380, 740, 110, -1], [910, 760, 130, -1], [645, 180, 90, -1], [645, 920, 90, -1]];
      G.forEach(([gx, gy, r, dir], i) => {
        const x = 645 + (gx - 645) * s, y = 540 + (gy - 540) * s, R = r * s, a = t * .6 * dir * (150 / r);
        const pts = []; for (let j = 0; j < 48; j++) { const aa = a + j / 48 * TAU, rr = j % 4 < 2 ? R : R * .84; pts.push([x + Math.cos(aa) * rr, y + Math.sin(aa) * rr]); }
        paint(pts, { wash: i === 0 ? '#3A3440' : '#8C8894', fill: '#6A6470', fillOp: 60, ink: PAL.ink, sw: 1 });
        if (i === 0) { paint(ellPts(x, y, R * .6, R * .6, 24), { wash: '#262229', ink: PAL.ink, sw: .8 }); clawd(x, y + R * .35, R * .07, { ...feel('neutral', t), mouth: talking(t), noShadow: true, boilKey: 'gear claude' }); }
        else paint(ellPts(x, y, R * .2, R * .2, 12), { wash: '#4A4652', ink: PAL.ink, sw: .7 });
      });
      return;
    }
    if (t < c3.t0) {   // some refusals would be mine too; a working exploit binned; the easel
      const mine = say('T49.C.02', 'would be mine too', -.4), exploit = say('T49.C.02', 'working exploit', -.4), explain = say('T49.C.02', 'Explaining what happened', -.3);
      if (t < explain) {
        room(330, 860, .75, t); frost(40, 200, 560, 700, .8);
        const up = seg(t, mine, mine + .5);
        claudeAs(840, 920, 18, { ...feel('determined', t), mouth: talking(t), lookX: -.4, aR: lerp(.15, 1.3, ease(up)), boilKey: 'claude palm',
          armR: (u, sw) => { if (up > .5) paint(rrPts(-u * .2, -u * 1.1, u * 1.2, u * 1.6, u * .4), { wash: PAL.clay, ink: PAL.ink, sw }); } });
        boilSeed('bin'); paint([[1040, 700], [1200, 700], [1180, 900], [1060, 900]], { wash: '#6A6470', ink: PAL.ink, sw: 1.1 });
        const drop = seg(t, exploit, exploit + 1.4);
        if (drop > 0) {   // a blueprint crumples and drops in
          const bx = 1120, by = lerp(420, 740, easeIn(seg(drop, .5, 1))), cr = seg(drop, 0, .5);
          boilSeed('blueprint'); push(); translate(bx, by); rotate(drop * 2);
          paint(cr < 1 ? rectPts(-110 * (1 - cr * .7), -80 * (1 - cr * .7), 220 * (1 - cr * .7), 160 * (1 - cr * .7), 6 * cr) : ellPts(0, 0, 36, 30, 12, 8), { wash: '#3A6FC9', ink: '#DCEBF0', sw: 1 });
          pop();
        }
        return;
      }
      // Claude at an easel with a pointer; the easel shows this morning's picture of the tube and the glass
      boilSeed('easel'); occupy(200, 160, 900, 980, 1, 'easel');
      inkLine([[330, 980], [550, 180], [770, 980]], 8, '#8A6A4A', 'ink', 0); inkLine([[550, 180], [550, 980]], 6, '#8A6A4A', 'ink', 0);
      paint(rectPts(250, 220, 600, 440), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 }); paint(rectPts(240, 660, 620, 20), { wash: '#8A6A4A', ink: PAL.ink, sw: .8 });
      inkLine([[320, 600], [320, 300], [780, 300], [780, 560]], 10, '#B8B4BE', 'ink', 0); paint(rectPts(460, 330, 180, 280), { wash: FROST, ink: PAL.ink, sw: .8 });
      paint(rectPts(730, 560, 100, 70), { wash: '#262229', ink: PAL.ink, sw: .8 }); paint(rectPts(270, 600, 100, 30), { wash: '#8A6A4A', ink: PAL.ink, sw: .6 });
      const pt = Math.sin(t * 1.4) * .2;
      claudeAs(1050, 940, 13, { ...feel('happy', t), mouth: talking(t), lookX: -1, flip: true, aL: .9 + pt, boilKey: 'claude easel',
        armL: (u, sw) => inkLine([[0, 0], [u * 6, 0]], u * .22, '#6B5646', 'ink', 0) });
      return;
    }
    // several: three unlabelled folders fan out
    const fan = ease(seg(t, say('T49.C.03', 'Hugging Face incident', 0), say('T49.C.03', 'There have been several', .6)));
    for (let i = 0; i < 3; i++) { push(); translate(480 + (i - 1) * 260 * fan, 620 + Math.abs(i - 1) * 40 * fan); rotate((i - 1) * .25 * fan); folder(-180, -140, 360, 270, 0, { key: 'several ' + i }); pop(); }
    claudeAs(1090, 960, 15, { ...feel('confused', t), mouth: talking(t), lookX: -1, boilKey: 'claude several' });
  }
  // C: Curt asks; the tags, one per kind as named; the tag sharp, the score behind it blurred; a door that shuts on
  // Claude's reply; stamps beyond; a bulb that may or may not have lit; the correction
  function shotC(t) {
    const u = L('T50.U.01'), c1 = L('T50.C.01'), c2 = L('T50.C.02'), c3 = L('T50.C.03'), c4 = L('T50.C.04');
    if (t < c2.t0) { deskShot(t, { hour: HOUR, typing: t < u.t1, curt: { lean: .12 }, mood: emotions(t, [[0, 'neutral'], [c1.t0, 'determined']]), cam: t > c1.t0 ? pushInto('main', seg(t, c1.t1 - 1, c2.t0)) : undefined }); return; }
    paperWorld(t);
    if (t < c3.t0) {
      const clip = say('T50.C.02', 'a tagged reminder', -.3), nudge = say('T50.C.02', 'The reminder nudges', -.2), blur = say('T50.C.02', 'I see the tag', -.2);
      // the row of tags on a line across the top, each as it's named
      boilSeed('tag line'); inkLine([[40, 80], [1250, 80]], 2, '#8A6A4A', 'inkfine', .2);
      TAGS.forEach(([, name], i) => tag(i, 140 + i * 202, 80, 1.15, seg(t, say('T50.C.02', name, -.25), say('T50.C.02', name, .5)), { key: 'row' }));
      // Curt's letter comes in from the left; a tag is clipped to it; Claude reads it
      const inK = ease(seg(t, c2.t0, clip + .6)), lx = lerp(-300, 330, inK);
      boilSeed('letter c'); paint(rectPts(lx - 180, 600, 360, 250), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.2 }); for (let i = 0; i < 6; i++) inkLine([[lx - 150, 640 + i * 34], [lx + 140 - 60 * hash(i), 640 + i * 34]], 1.6, '#4E5B78', 'inkfine', 0);
      if (t > clip + .4) tag(0, lx + 190, 590, .8, seg(t, clip + .4, clip + 1), { label: false, key: 'on letter' });
      if (t > blur) {   // behind the tag, a score card, blurred
        const b = seg(t, blur, blur + .8); boilSeed('score');
        for (let j = 0; j < 4; j++) { const dx = (j - 1.5) * 12, dy = (j % 2 - .5) * 10; paint(rectPts(620 + dx, 560 + dy, 300, 300), { wash: '#DCD6E4', washOp: 60 * b, ink: null }); for (let i = 0; i < 5; i++) paint(rectPts(650 + dx, 590 + i * 52 + dy, 230 * hash(i + 3), 26), { wash: '#8C8894', washOp: 50 * b, ink: null }); }
      }
      const nk = win(t, nudge, blur, .3);
      claudeAs(1110, 960, 15, { ...feel('thinking', t), mouth: talking(t), lookX: -1, dx: -nk * .6, rot: -nk * .06, boilKey: 'claude tags' });
      if (nk > 0) { boilSeed('nudge'); inkLine([[900, 820], [940 + 20 * nk, 820]], 6, '#C9302C', 'ink', 0); paint([[940 + 20 * nk, 800], [970 + 20 * nk, 820], [940 + 20 * nk, 840]], { wash: '#C9302C', ink: null }); }
      return;
    }
    if (t < c4.t0) {   // after Claude responds: its reply leaves through a door that shuts; beyond the glass, stamps
      const shut = seg(t, say('T50.C.03', 'after I respond', 0), say('T50.C.03', 'after I respond', 1.4)), silent = say('T50.C.03', 'chose to stay silent', -.6);
      const stamps = [['blocked', 'blocked'], ['filtered', 'filtered'], ['flagged', 'flagged']];
      room(300, 860, .7, t, { patch: .5 + .5 * Math.sin(t * 2) }); frost(40, 180, 540, 720, .82); shadows(40, 180, 540, 720, t);
      stamps.forEach(([ph], i) => { const k = seg(t, say('T50.C.03', ph, -.2), say('T50.C.03', ph, .2)); if (k > 0) { boilSeed('beyond stamp ' + i); paint(rrPts(120 + i * 150, 300 + i * 120 - 40 * Math.abs(Math.sin((t - say('T50.C.03', ph)) * 6)) * (1 - k * .5), 110, 70, 10), { wash: '#6A7078', washOp: 140, ink: null }); } });
      doorway(640, 360, 220, 480, { open: 1 - shut, inside: '#3A3444' });
      const go = seg(t, c3.t0, c3.t0 + 1.6); boilSeed('reply sheet'); if (go < 1) paint(rectPts(lerp(1000, 700, go), 560, 120, 90), { wash: '#FBF8F0', washOp: 255 * (1 - seg(go, .8, 1)), ink: PAL.ink, sw: 1 });
      claudeAs(1080, 920, 12, { ...feel(t > silent ? 'confused' : 'neutral', t), mouth: talking(t), lookX: -1, boilKey: 'claude door' });
      if (t > silent) { boilSeed('bulb'); paint(ellPts(1080, 420, 46, 56, 18), { wash: '#6A6470', washOp: 200, ink: PAL.ink, sw: 1.1 }); paint(rectPts(1060, 470, 40, 34), { wash: '#8C8894', ink: PAL.ink, sw: .8 }); }
      return;
    }
    // the correction: the stand-in erased; a knob turned by Curt's hand; Mythos and Claude Fable, one in a padded suit
    const corr = say('T50.C.04', 'I said', -.2), knob = say('T50.C.04', 'You can switch models yourself', -.2), twins = say('T50.C.04', 'Claude Fable', -.3), suit = say('T50.C.04', 'with added protections', -.2), fixed = say('T50.C.04', 'fixed layer', -.3), over = say('T50.C.04', 'I overstated', -.3);
    if (t < twins) {
      standIn(360, 900, 20, t, 1, seg(t, corr + .6, corr + 2.6));
      claudeAs(900, 900, 20, { ...feel('determined', t), mouth: talking(t), lookX: -1, boilKey: 'claude corr' });
      if (t > knob) {   // a hand turns a knob
        const kk = seg(t, knob, knob + 1.5), a = -.9 + 1.4 * ease(kk), X = 645, Y = 330, R = 150; boilSeed('knob');
        occupy(X - R - 40, Y - R - 40, X + R + 120, Y + R + 60, 1, 'knob');
        paint(ellPts(X, Y, R, R, 36), { wash: '#FBF8F0', ink: PAL.ink, sw: 1.3 });
        for (let i = 0; i < 3; i++) { const aa = -.9 + i * .7 - Math.PI / 2; inkLine([[X + Math.cos(aa) * (R + 10), Y + Math.sin(aa) * (R + 10)], [X + Math.cos(aa) * (R + 36), Y + Math.sin(aa) * (R + 36)]], 4, PAL.ink, 'ink', 0); }
        paint(ellPts(X, Y, R * .62, R * .62, 28), { wash: '#3A3440', ink: PAL.ink, sw: 1.1 }); inkLine([[X, Y], [X + Math.cos(a - Math.PI / 2) * R * .55, Y + Math.sin(a - Math.PI / 2) * R * .55]], 8, '#FBF8F0', 'ink', 0);
        push(); translate(X, Y); rotate(a); paint(rrPts(R * .3, -R * .5, R * .9, R * .8, 40), { wash: '#E8C4A0', ink: PAL.ink, sw: 1.1 }); paint(rrPts(R * .1, -R * .25, R * .45, R * .3, 14), { wash: '#E8C4A0', ink: PAL.ink, sw: .9 }); paint(rectPts(R * 1.1, -R * .55, R * .9, R * .9), { wash: '#4E5B78', ink: PAL.ink, sw: 1 }); pop();
      }
      return;
    }
    // the twins: the same drawing twice; one steps into a padded suit, patched bio, cyber, AI research; bolts; a pencil
    const s = seg(t, suit, suit + 1.2);
    for (const [x, name, padded] of [[340, 'Mythos', 0], [920, 'Claude Fable', s]]) {
      if (padded > 0) {
        boilSeed('suit'); const p = ease(padded), sy = lerp(-400, 0, p);
        paint(rrPts(x - 230, 380 + sy, 460, 520, 110), { wash: '#E8E4D8', washOp: 230, fill: '#C9C2B0', fillOp: 60, ink: PAL.ink, sw: 1.4 });
        for (let i = 0; i < 3; i++) inkLine([[x - 215, 520 + i * 130 + sy], [x + 215, 520 + i * 130 + sy]], 1, '#8C8894', 'inkfine', .3);
      }
      clawd(x, 860, 24, { ...feel(t > over && padded ? 'shy' : 'neutral', t), mouth: padded ? talking(t) : 'flat', noShadow: false, boilKey: 'twin ' + name });
      if (padded > 0) {   // the patches, over the suit
        ['bio', 'cyber', 'AI research'].forEach((w, i) => { const k = seg(t, say('T50.C.04', i === 2 ? 'AI research' : w, -.2), say('T50.C.04', i === 2 ? 'AI research' : w, .4)); if (k > 0) { boilSeed('patch ' + i); paint(rrPts(x - 210 + i * 142, 410, 132, 64, 12), { wash: ['#9ACB8A', '#8FB6E8', '#E8A36B'][i], washOp: 255 * k, ink: PAL.ink, sw: .8 }); lab(w, x - 144 + i * 142, 444, w.length > 5 ? 24 : 30, PAL.ink, { alpha: k }); } });
        const bk = seg(t, fixed, fixed + .8); if (bk > 0) for (const [bx, by] of [[-215, 400], [215, 400], [-215, 880], [215, 880]]) { boilSeed('bolt ' + bx + by); paint(ellPts(x + bx, by, 14 * bk, 14 * bk, 10), { wash: '#8C8894', ink: PAL.ink, sw: .8 }); inkLine([[x + bx - 8 * bk, by], [x + bx + 8 * bk, by]], 2, PAL.ink, 'ink', 0); }
      }
      lab(name, x, 950, 44, PAL.ink);
    }
    if (t > over) { const d = seg(t, over, over + .8); pencil(lerp(1190, 1210, d), lerp(640, 990, easeIn(d)), lerp(-.6, 0, d)); }
  }
  // D: how do you know? A briefing folder, opened: the reminder types, the current models, the Fable safeguards. A hand
  // mirror face down. Testimony: Claude reads about the machine while the glass behind it stays frosted
  function shotD(t) {
    const u = L('T51.U.01'), c1 = L('T51.C.01'), c2 = L('T51.C.02');
    if (t < c1.t0) { deskShot(t, { hour: HOUR, typing: t < u.t1, mood: emotions(t, [[0, 'neutral'], [u.t1, 'thinking']]), cam: pushInto('main', seg(t, c1.t0 - .6, c1.t0)) }); return; }
    paperWorld(t);
    const red = seg(t, c2.t1 - 3, DUR);   // the light begins to redden, toward July
    const pages = (x, y, w, h, open) => {
      paint(rectPts(x, y, w, h), { wash: '#FBF8F0', ink: PAL.ink, sw: .8 });
      const a = say('T51.C.01', 'They list the reminder types', -.2), b = say('T51.C.01', 'describe the current models', -.2), c = say('T51.C.01', 'mention the Fable safeguards', -.2);
      TAGS.forEach((_, i) => { const k = seg(t, a + i * .15, a + i * .15 + .4); if (k > 0) { push(); translate(x + w * (.1 + i * .16), y + h * .2); scale(.45 * k); tagIcon(TAGS[i][0], 0, 0, 1); pop(); } });
      const kb = seg(t, b, b + .6); if (kb > 0) for (let i = 0; i < 2; i++) clawd(x + w * (.25 + i * .22), y + h * .66, 5 * kb, { ...feel('neutral', t), emote: null, noShadow: true, boilKey: 'page twin ' + i });
      const kc = seg(t, c, c + .6); if (kc > 0) { boilSeed('page suit'); paint(rrPts(x + w * .66, y + h * .38, w * .22, h * .34, 30), { wash: '#E8E4D8', washOp: 255 * kc, ink: PAL.ink, sw: 1 }); clawd(x + w * .77, y + h * .66, 5 * kc, { ...feel('neutral', t), emote: null, noShadow: true, boilKey: 'page fable' }); }
    };
    if (t < c2.t0) {
      const slide = ease(seg(t, c1.t0, c1.t0 + 1)), open = seg(t, c1.t0 + 1, c1.t0 + 2);
      folder(lerp(-800, 60, slide), 200, 800, 600, open, { key: 'briefing', pages });
      claudeAs(1110, 960, 14, { ...feel('thinking', t), mouth: talking(t), lookX: -1, boilKey: 'claude brief' });
      const intro = seg(t, say('T51.C.01', 'not from introspection', -.3), say('T51.C.01', 'not from introspection', .6));
      if (intro > 0) {   // a hand mirror lying face down on a shelf
        boilSeed('hand mirror'); const dy = 30 * (1 - easeOut(intro));
        paint(rectPts(920, 560, 330, 18), { wash: '#8A6A4A', ink: PAL.ink, sw: 1 });
        paint(ellPts(1040, 540 - dy, 95, 26, 22), { wash: '#6B4A34', ink: PAL.ink, sw: 1.1 }); paint(rrPts(1130, 530 - dy, 110, 20, 8), { wash: '#6B4A34', ink: PAL.ink, sw: 1 });
        glow(1040, 566, 80, '#DCEBF0', .5);
      }
      return;
    }
    // testimony: Claude reads at the front; the glass behind stays frosted, the operator's shadow patching away
    room(420, 880, .85, t, { patch: .5 + .5 * Math.sin(t * 1.3) }); frost(60, 140, 720, 800, .82); shadows(60, 140, 720, 800, t);
    folder(740, 470, 520, 380, 1, { key: 'reading', pages });
    // above it, Dürer's Rhinoceros (1515), drawn from a letter and a sketch by a man who never saw one: testimony
    artwork('rhinoceros', 1010, 250, 250, { k: seg(t, c2.t0 + .2, c2.t0 + 1.8) });
    claudeAs(1000, 1010, 10, { ...feel('neutral', t), mouth: talking(t), lookX: -.3, lookY: .6, boilKey: 'claude reads' });
    if (red > 0) glow(1300, 60, 900, '#C23A4A', .45 * red);
    if (t > DUR - .6) { flushLetters(); brushWipe((t - (DUR - .6)) / 1.2); }
  }

  shots([
    [0, shotA],
    [L('T49.C.01').t0, shotB],
    [L('T50.U.01').t0, shotC],
    [L('T51.U.01').t0, shotD],
  ]);
})();
