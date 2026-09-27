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
function curtAs(x, y, u, o = {}) { return curt(x, y, u, { ...LOOK.curt, ...o }); }
// Claude, however LOOK.claude says. o.assemble (0..1) is how gathered the crowd is (ignored for plain Clawd).
function claudeAs(x, y, u, o = {}) {
  if (LOOK.claude === 'crowd') return clawdCrowd(x, y, u, o.assemble ?? 1, o);
  return clawd(x, y, u, o);
}
// a reference's QR code, by its id in script/refs.yaml (the refs table is loaded into REFS by the generated script data)
function refQR(ref, cx, cy, size, o = {}) { return qrCard(ref.qr_url || ref.url, cx, cy, size, qrStyleFor(ref.style), { ecc: ref.ecc || (ref.mode === 'feature' ? 'H' : 'M'), caption: ref.caption, ...o }); }

document.fonts.load('40px "Patrick Hand"');
