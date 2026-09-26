// qr.js: the QR engine. Painted codes that still scan; how each one is dressed lives in qr_styles.js, and which style a
// reference wears lives in look.js, so either can be swapped without touching this file.
//
// What a scanner reads stays strict (VIDEO_PLAN.md §4):
//   - flat wash at full opacity, dark on light, no ink outline, no boil, on a whole-pixel module grid
//   - finder eyes keep their 1:1:3:1:1 proportions along every line through their centre (shapes may round, not break)
//   - a quiet zone of 4 modules; decoration (the frame) only outside it
//   - a centre emblem only at error correction H, clearing at most ~7% of the modules
// tools/qr_check.mjs decodes every code from rendered frames to prove it.
//
//   qrCard(url, cx, cy, size, style, { ecc, k, t, caption, emblemR })
//     size = the code with its quiet zone, in px (rounded down to whole modules); k = 0..1 arrival (a style's `present`
//     may use it for a bespoke reveal, like the MAD Fold-In). Returns the code's layout.

const QR_CACHE = new Map();
// The module matrix for a string: { n, dark(r, c) }. Pure, so it's cached across frames.
function qrMatrix(text, ecc = 'H') {
  const key = ecc + '|' + text;
  if (!QR_CACHE.has(key)) {
    const q = qrcode(0, ecc); q.addData(text); q.make();
    const n = q.getModuleCount(), cells = [];
    for (let r = 0; r < n; r++) { const row = []; for (let c = 0; c < n; c++) row.push(q.isDark(r, c)); cells.push(row); }
    QR_CACHE.set(key, { n, dark: (r, c) => r >= 0 && c >= 0 && r < n && c < n && cells[r][c] });
  }
  return QR_CACHE.get(key);
}
const QR_QUIET = 4;
const inFinder = (r, c, n) => (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8);

// Registries, filled by qr_styles.js. A style is { bg, fg, eye, module, frame, emblem, reach, present, captionFont }.
const QR_STYLES = {}, QR_MODULES = {}, QR_EYES = {};
function qrStyle(name) {
  if (!QR_STYLES[name] && !(qrStyle.warned ||= new Set()).has(name)) { qrStyle.warned.add(name); console.warn(`qr style "${name}" isn't defined: using plain`); }
  return { ...QR_STYLES.plain, ...(QR_STYLES[name] || {}) };
}

// Everything about one code at rest: its matrix, module size and grid origin.
function qrLayout(text, cx, cy, size, st, o = {}) {
  const ecc = o.ecc || (st.emblem ? 'H' : 'Q'), Mx = qrMatrix(text, ecc), n = Mx.n;
  // whole-pixel modules on a whole-pixel grid: fractional modules alias against the pixel grid
  const m = Math.max(1, Math.floor(size / (n + 2 * QR_QUIET)));
  size = m * (n + 2 * QR_QUIET);
  const x0 = Math.round(cx - size / 2), y0 = Math.round(cy - size / 2);
  const er = st.emblem && ecc === 'H' ? (o.emblemR ?? .15) * n * m : 0;
  return { text, ecc, Mx, n, m, size, x0, y0, ox: x0 + QR_QUIET * m, oy: y0 + QR_QUIET * m, cx: x0 + size / 2, cy: y0 + size / 2, er };
}

// Paint columns [c0, c1) of a code with their share of the quiet zone, shifted dx px. The whole code is
// qrPaintCols(L, st, 0, L.n); a style's `present` can paint it in pieces (the Fold-In paints two halves that meet).
function qrPaintCols(L, st, c0, c1, dx = 0) {
  const { Mx, n, m, ox, oy, x0, y0, size, er } = L;
  randomSeed(7);   // the scanner-facing part never boils
  const bx0 = c0 === 0 ? x0 : ox + c0 * m, bx1 = c1 === n ? x0 + size : ox + c1 * m;
  paint(rectPts(bx0 + dx - (c0 ? .5 : 0), y0, bx1 - bx0 + (c0 ? .5 : 0) + (c1 < n ? .5 : 0), size), { wash: st.bg, ink: null });
  const cleared = (r, c) => er && Math.hypot((c + .5) * m - n * m / 2, (r + .5) * m - n * m / 2) < er + m * .6;
  const skip = (r, c) => !Mx.dark(r, c) || inFinder(r, c, n) || cleared(r, c);
  const shape = typeof st.module === 'function' ? st.module : QR_MODULES[st.module];
  for (let r = 0; r < n; r++) {
    if (!shape) {   // squares: merge each row's runs into one rectangle
      for (let c = c0; c < c1; c++) {
        if (skip(r, c)) continue;
        let e = c; while (e + 1 < c1 && !skip(r, e + 1)) e++;
        paint(rectPts(ox + c * m - .3 + dx, oy + r * m - .3, (e - c + 1) * m + .6, m + .6), { wash: st.fg, ink: null });
        c = e;
      }
    } else for (let c = c0; c < c1; c++) {
      if (skip(r, c)) continue;
      // a shape may take a whole horizontal run at once (it returns how many modules it covered)
      let e = c; if (shape.runs) while (e + 1 < c1 && !skip(r, e + 1)) e++;
      shape(ox + c * m + dx, oy + r * m, m, st.fg, r, c, L, e - c + 1);
      c = e;
    }
  }
  const eye = typeof st.eye === 'function' ? st.eye : QR_EYES[st.eye];
  for (const [r, c] of [[0, 0], [0, n - 7], [n - 7, 0]]) if (c >= c0 && c + 7 <= c1) eye(ox + c * m + dx, oy + r * m, m, st.fg, st.bg, L);
}

function qrCard(text, cx, cy, size, styleName = 'plain', o = {}) {
  const st = qrStyle(styleName), t = o.t ?? T, k = o.k ?? 1;
  if (k <= 0) return null;
  const L = qrLayout(text, cx, cy, size, st, o);
  push();
  // the default arrival slides up on an arc and settles; a style with its own `present` does its own reveal instead
  if (k < 1 && !st.present) { const e = backOut(k); translate(L.cx, L.cy + (1 - e) * 60); rotate((1 - e) * .08); scale(.6 + .4 * e); translate(-L.cx, -L.cy); }
  if (st.frame) { boilSeed('qr frame ' + text); st.frame(L.cx, L.cy, L.size, t, L, k); }
  if (st.present) st.present(L, st, k, t);
  else qrPaintCols(L, st, 0, L.n);
  if (L.er) { boilSeed('qr emblem ' + text); st.emblem(L.cx, L.cy, L.er, t, L); }
  pop();
  if (o.caption) {
    const sz = Math.round(Math.max(18, L.size * .07));
    letter(st.captionCase === 'upper' ? o.caption.toUpperCase() : o.caption, L.cx, L.cy + L.size * ((st.reach ?? (st.frame ? .64 : .5)) + .1), sz, PAL.ink,
      { ink: false, ...(st.captionFont ? { font: `${sz}px ${st.captionFont}` } : {}), ...(o.captionOpts || {}) });
  }
  return L;
}
