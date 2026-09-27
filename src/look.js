// look.js: every swappable look decision in one place. Scenes never name a Curt costume, a Claude representation, a home
// set or a QR style directly; they go through the helpers here, so changing a line below changes the whole film.
const LOOK = {
  // Curt: variant H (ponytail, hoodie, circle beard), greying: grey roots fading to a black ponytail tip, grey beard
  curt: { ...CURT_VARIANTS.H, hairCol: '#9C9791', ponyTip: '#1C1917', facialCol: '#B3AEA8', glasses: true },
  claude: 'crowd',                  // 'crowd' (Clawd assembling out of a crowd) | 'clawd'
  home: 'desk',                     // 'desk' (over Curt's shoulder) | 'booth'
  // reference style (as named in script/refs.yaml) → implemented style (qr_styles.js); unlisted names map to themselves
  qr: { mad: 'foldin' },
};

const qrStyleFor = key => LOOK.qr[key] || key;
function curtAs(x, y, u, o = {}) {
  const sit = o.pose === 'sit', back = o.view === 'back';
  occupy(x - (back ? 3.6 : 4.5) * u, y - (sit ? 10.5 : 16.5) * u, x + (back ? 3.6 : 4.5) * u, y + (sit ? 1 : 0), .8, 'Curt');
  return curt(x, y, u, { ...LOOK.curt, ...o });
}
// Claude, however LOOK.claude says. o.assemble (0..1) is how gathered the crowd is (ignored for plain Clawd).
function claudeAs(x, y, u, o = {}) {
  const crowd = LOOK.claude === 'crowd' && (o.assemble ?? 1) < 1;
  occupy(x - (crowd ? 9 : 6.5) * u, y - (crowd ? 13 : 10) * u, x + (crowd ? 9 : 6.5) * u, y + (crowd ? 2 : .5) * u, 1, 'Claude');
  if (LOOK.claude === 'crowd') return clawdCrowd(x, y, u, o.assemble ?? 1, o);
  return clawd(x, y, u, o);
}
// a reference's QR code, by its id in script/refs.yaml (the refs table is loaded into REFS by the generated script data)
// A shelf code whose style's frame reaches far (a lily pad, a dinner plate) goes without the frame: it keeps the style's
// colours and module shapes, and the card stays compact. SHELF_EXTENT is how far a shelf code's dressing may reach.
const SHELF_EXTENT = .6;
// A Still QR style (an image with its props) keeps them on the shelf too: the card takes the picture's shape, its code
// SHELF_CODE px if the picture fits SHELF_MAX (w, h), smaller if not. shelfCard(ref) → { hw, hh, fit: [w, h] } or null.
const SHELF_FIT = 470, SHELF_CODE = 320, SHELF_MAX = [470, 410], shelfImage = ref => !!qrStyle(qrStyleFor(ref.style)).image;
const refEcc = ref => ref.ecc || (ref.mode === 'feature' ? 'H' : 'M');
function shelfCard(ref) {
  const e = shelfImage(ref) && QR_IMAGES[qrImageKey(qrStyleFor(ref.style), refEcc(ref), true, ref.qr_url || ref.url)];
  if (!e) return null;
  const u = [e.img[0] / e.box[2], e.img[1] / e.box[2]], c = Math.min(SHELF_CODE, SHELF_MAX[0] / u[0], SHELF_MAX[1] / u[1]);
  const fit = [Math.ceil(c * u[0]), Math.ceil(c * u[1])];
  return { hw: fit[0] / 2 + 22, hh: fit[1] / 2 + 22, fit };
}
const shelfFramed = ref => shelfImage(ref) || (qrStyle(qrStyleFor(ref.style)).extent ?? .64) <= SHELF_EXTENT;
function refQR(ref, cx, cy, size, o = {}) {
  return qrCard(ref.qr_url || ref.url, cx, cy, size, qrStyleFor(ref.style), { ecc: refEcc(ref), caption: ref.caption, noFrame: ref.mode === 'shelf' && !shelfFramed(ref), ...o });
}

document.fonts.load('40px "Patrick Hand"');
