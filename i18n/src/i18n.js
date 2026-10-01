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
  const letter0 = window.letter;
  window.letter = function (txt, ...rest) {
    if (typeof txt === 'string') {
      const k = txt.trim(), t = tr(k);
      if (t != null) txt = txt.replace(k, t);
      else if (k && !known(k)) miss.strings[k] = (miss.strings[k] || 0) + 1;
    }
    return letter0(txt, ...rest);
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
