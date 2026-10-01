// i18n.js: a translated film's hooks into the engine (i18n/PLAN.md). The stage's studio loads it, with its data
// (src/gen/i18n.js, window.I18N, made by i18n/tools/stage.mjs), right after scene_kit.js; the English studio never does.
//   letter()   every word lettered into the picture goes through the language's strings.yaml
//   atWord()   a phrase a scene is timed to becomes the line's anchor for it; with none, the same place in the
//              translated line, proportionally
//   MAD        the cold open's page is lettered in the language
//   mdTable()  a scene reads a table as it is in English (scenes find rows by their English names); each cell is
//              lettered through strings.yaml like any other word
// What it couldn't translate is kept in window.I18N_MISSES, which i18n/tools/probe.mjs reads.
(() => {
  const I = window.I18N; if (!I) return;
  const miss = window.I18N_MISSES = { strings: {}, anchors: {} };

  // ---- the language's own glyphs ----
  // i18n/<lang>/studio.css gives the hand-lettering fonts a range of the language's glyphs (Japanese: the Mac's own
  // Hiragino); they're loaded before the first frame, as core.js loads Permanent Marker, so no frame draws a fallback
  if (I.cjk && typeof loadQRImages === 'function') {
    const q0 = loadQRImages, sample = 'あア漢、。「」';
    window.loadQRImages = loadQRImages = async (...a) => {
      await Promise.all(['"Patrick Hand"', '"Permanent Marker"', 'bold 40px "Patrick Hand"'].map(f => document.fonts.load(/px/.test(f) ? f : `40px ${f}`, sample)));
      return q0(...a);
    };
  }

  // ---- lettering ----
  const done = new Set(Object.values(I.strings)), seen = new Map();
  // a string that needs no translation: one already in the language, a word of this chapter's translated lines or the
  // cold open's page, a code's caption (translated in refs.yaml, or a title kept as it is), or something with no words
  // in it (numbers, symbols, a single letter)
  let captions = null;
  const known = s => {
    if (seen.has(s)) return seen.get(s);
    const lines = (window.CHAPTER?.lines || []).map(l => l.text);
    captions ||= new Set(Object.values(window.REFS || {}).map(r => r.caption));
    // a whole word or phrase of a line, not part of a longer word ("much" isn't Spanish because of "mucho")
    const whole = new RegExp(`(^|[^\\p{L}])${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}])`, 'u');
    const k = done.has(s) || !/\p{L}{2}/u.test(s) || lines.some(t => whole.test(t)) || (I.page || '').includes(s) || captions.has(s) || I.keep.includes(s);
    seen.set(s, k); return k;
  };
  // a key "NN|text" is text's translation in chapter NN only (the same English word can need two translations)
  const tr = k => { const n = window.CHAPTER?.n, own = n == null ? undefined : I.strings[`${String(n).padStart(2, '0')}|${k}`]; return own ?? I.strings[k]; };
  // Japanese glyphs run wider than the English letters a scene was laid out for: a translation wider than its English
  // (by a tenth) is squeezed to that width, down to 62%, so it stays on its card or sign
  let MCTX = null;
  const widthIn = (s, font) => { MCTX ||= document.createElement('canvas').getContext('2d'); MCTX.font = font; return MCTX.measureText(s).width; };
  const letter0 = window.letter;
  window.letter = function (txt, x, y, size, color, o = {}) {
    if (typeof txt === 'string') {
      const k = txt.trim(), t = tr(k);
      if (t != null) {
        if (I.cjk && o.maxW == null && t !== k) {
          const font = o.font || `${size}px "Permanent Marker", "Comic Sans MS", cursive`, en = widthIn(k, font), w = widthIn(t, font);
          if (w > en * 1.1) o = { ...o, maxW: Math.max(en * 1.1, w * .62) * (CAM && !o.screen ? CAM.zoom : 1) };
        }
        txt = txt.replace(k, t);
      }
      else if (k && !known(k)) miss.strings[k] = (miss.strings[k] || 0) + 1;
    }
    return letter0(txt, x, y, size, color, o);
  };

  // ---- timing ----
  const atWord0 = window.atWord;
  window.atWord = function (id, phrase, dk = 0) {
    const a = I.anchors[id]?.[phrase];
    if (a) return atWord0(id, a, dk);
    try { return atWord0(id, phrase, dk); } catch { }   // a name, a number: the same in both
    miss.anchors[`${id} | ${phrase}`] = 1;
    const l = L(id), en = (I.en[id] || '').toLowerCase(), i = en.indexOf(String(phrase).toLowerCase());
    const s = l.speech || l.text, f = i < 0 ? 0 : i / en.length;
    return sayAt(l, s, Math.round(f * s.length)) + dk;
  };

  // ---- captions ----
  // A caption is a sentence at a time. The English engine finds a sentence by its capital A–Z; here any capital starts
  // one ("É", "Às", "¿Qué", "«Sim»"). The rest is captionAt() in src/timing.js as it is (kept out of the English file so
  // its frames' print stays the same); keep the two in step.
  // A language written without spaces (Japanese, I.cjk) ends a sentence at 。！？ with no space after it, and wraps a
  // caption between words (Intl.Segmenter), never inside one: a mark that can't start a row (、。」) stays with the
  // word before it, one that can't end a row (「『（) with the word after.
  const SEG = I.cjk && new Intl.Segmenter(I.lang, { granularity: 'word' });
  const NO_START = /^[、。，．！？!?…‥・：；:;）」』】〕)\]’”ーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ%％]/u, NO_END = /[「『（【〔(\[‘“]$/u;
  const cjkWords = s => {
    const out = [];
    for (const { segment: g } of SEG.segment(s)) {
      const last = out.length - 1;
      // kana after a word stays with it (猿|たち|を → 猿たちを, 導|き → 導き): rows break between phrases, as Japanese
      // subtitles do, not wherever the dictionary splits a word
      // and a run of Latin letters and figures stays whole (GPT-5.6)
      const kana = /^[\p{Script=Hiragana}ー]/u.test(g) && !/[、。！？!?…\s]$/u.test(out[last] || '');
      const latin = /[\x21-\x7e]$/.test(out[last] || '') && /^[\x21-\x7e]/.test(g);
      if (last >= 0 && (/^\s+$/.test(g) || kana || latin || NO_START.test(g) || NO_END.test(out[last]))) out[last] += g; else out.push(g);
    }
    return out;
  };
  if (I.cjk && typeof wrapRows === 'function') window.wrapRows = wrapRows = function (words, maxW) {
    const rows = [[]];
    for (const w of words) { const r = rows[rows.length - 1]; if (r.length && capWidth([...r, w].join('').trim()) > maxW) rows.push([w]); else r.push(w); }
    return rows.map(r => r.join('').trim());
  };
  if (I.cjk && typeof captionLaid === 'function') window.captionLaid = captionLaid = function (l, cur, right) {
    const maxW = Math.max(600, right - CAP.x - 2 * CAP.pad);
    const words = cjkWords(cur), n = wrapRows(words, maxW).length;
    let lo = maxW / n, hi = maxW;
    while (hi - lo > 8) { const mid = (lo + hi) / 2; if (wrapRows(words, mid).length > n) lo = mid; else hi = mid; }
    const marks = proofOf(cur, l.proof), rows = [];
    let pos = 0;
    for (const r of wrapRows(words, hi)) { const at = cur.indexOf(r, pos); rows.push({ txt: r, at }); pos = at + r.length; }
    for (const r of rows) r.proof = marks.filter(m => m.at >= r.at && m.at <= r.at + r.txt.length).map(m => ({ ...m, at: m.at - r.at }));
    const gap = marks.length ? 60 : 46, top = marks.length ? 18 : 0, y0 = H - CAP.bottom - 20 - rows.length * gap - top;
    const w = Math.max(...rows.map(r => capWidth(r.txt)), capWidth('CLAUDE')) + 2 * CAP.pad;
    return { l, rows, gap, top, y0, maxW, right, box: [CAP.x, y0 - 44, CAP.x + w, H - CAP.bottom] };
  };
  if (typeof captionAt === 'function') window.captionAt = captionAt = function (t, right = null) {
    const l = lineAt(t); if (!l || !l.spoken || t > l.end) return null;
    const txt = plainText(l.text).replace(/\b(vs|e\.g|i\.e|Dr|Lt|Mr|Ms|St)\./g, '$1․');
    const sentences = (I.cjk ? txt.split(/(?<=[。！？!?])(?![」』）)"”。！？!?])\s*/u).filter(Boolean) : txt.split(/(?<=[.!?]["”»)]*)\s+(?=["“«(¿¡]?[\p{Lu}0-9])/u))
      .map(x => x.replace(/․/g, '.'));
    const total = sentences.reduce((a, s) => a + s.length, 0); let acc = 0, cur = sentences[0];
    for (const s of sentences) { if ((t - l.t0) / Math.max(.01, l.t1 - l.t0) * total >= acc) cur = s; acc += s.length; }
    if (right != null) return captionLaid(l, cur, right);
    const codes = codesInBand(t);
    let cap = captionLaid(l, cur, W - CAP.x);
    for (let i = 0; i < 4; i++) {
      const r = Math.min(W - CAP.x, ...codes.filter(c => c[3] > cap.box[1] - 8).map(c => c[0] - 16));
      if (r >= cap.right) break;
      cap = captionLaid(l, cur, r);
    }
    return cap;
  };

  // ---- the cold open's page ----
  // A balloon's words are revealed run by run (a run: words between *bold* marks), a word at a time; with no spaces, a
  // run is one word, so the count of them must be the count of runs, or the reveal stops short
  if (I.cjk && typeof madWords === 'function') window.madWords = madWords = name =>
    MAD.balloons[name].lines.reduce((a, ln) => a + madRuns(ln).reduce((b, r) => b + r.txt.split(' ').filter(Boolean).length, 0), 0);

  // ---- tables ----
  if (typeof mdTable === 'function') {
    const mdTable0 = mdTable;
    window.mdTable = mdTable = function (id) {
      const l = L(id), text = I.tables?.[id];
      if (text == null) return mdTable0(id);
      const had = l.text; l.text = text;
      try { return mdTable0(id); } finally { l.text = had; }
    };
  }

  // ---- the cold open's page ----
  if (typeof MAD !== 'undefined') for (const [name, lines] of Object.entries(I.balloons || {})) if (MAD.balloons[name]) MAD.balloons[name].lines = lines;
})();
