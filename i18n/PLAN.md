# Translations: the plan

Started 2026-09-30. Spanish first; the tree is built so any language can follow it.

## Which languages, and why

In order:

1. **Spanish** (neutral Latin American). YouTube's largest audience after English, and many viewers don't follow
   fast spoken English. Latin letters, so every painted word fits without new fonts. ElevenLabs speaks it well.
2. **Brazilian Portuguese**. The next largest, for the same reasons. Latin letters.
3. **Japanese**. Strong interest in AI, little English, and a habit of watching dubbed and subtitled video. It costs
   more: a Japanese font, and every painted label's size and line breaks checked again.

Later, if the first three find viewers:

- **German, French**: strong interest in AI policy, but many of these viewers manage English already. Subtitles may do.
- **Hindi**: YouTube's biggest market, but Indian tech viewers mostly watch in English. Subtitles first.
- **Chinese, Korean, Arabic**: large, but YouTube is blocked in mainland China, Korean needs another script, and
  Arabic runs right to left (the site would need it).

Cheapest wide reach, any time: YouTube subtitles in many languages, made from each translated script.

## Decided (Curt, 2026-09-30)

- **A full translation**: Spanish voices, and every word in the picture (the conversation, cards, labels, the cold
  open's page) in Spanish. Not a dub over the English picture.
- **Neutral Latin American Spanish** (ustedes, no vosotros).
- **The same voices**: Curt's clone and River speak Spanish (eleven_v3 is multilingual); the cold open's six keep
  theirs too.
- **A faithful translation**: close to every line's meaning. A back-translation check flags drift.

## Conventions (Spanish)

- Curt and Claude say *tú* to each other; the cold open's officers say *usted*.
- Claude has no grammatical gender: its lines avoid adjectives that would give it one ("me divierte", not "divertido").
- A film or book goes by the title Latin American audiences know (*La conquista del planeta de los simios*). A paper,
  article or site keeps its own title ("On the Dangers of Stochastic Parrots"). People's names never change.
- A code that points at English Wikipedia points at the same article in Spanish, where one exists (Wikipedia's own
  language links, `i18n/tools/wiki_links.mjs`); 158 of 202 do.
- An explainer's caption starts "Explicado:".
- Acronyms are said in Spanish letters (LLM, "ele ele eme"): `i18n/es/pronounce.yaml`.

## How it's built

Everything for a language lives under `i18n/<lang>/`. The English film's files are left alone, except where a small,
general change makes every language possible (none so far).

- `i18n/<lang>/script/chNN.yaml`: each transcript line's translation, by line id: `text` (painted), `speech` (said,
  when it differs), and `anchors` (the English phrases scenes, codes and sounds are timed to, and the words they
  become).
- `i18n/<lang>/strings.yaml`: every word the scenes letter into the picture (labels, cards, signs), English → the
  language.
- `i18n/<lang>/refs.yaml`: each code's painted caption, translated. `wiki.yaml` (generated): the same Wikipedia article
  in the language.
- `i18n/<lang>/chapters.yaml`, `cold_open.yaml`, `pronounce.yaml`: chapter titles, the cold open's balloons (voiced and
  lettered), respellings for the voice.
- `i18n/<lang>/vo/`: the language's voice clips, committed like `assets/vo`.
- `i18n/<lang>/site/`: the explainers and the site's own words (not started).
- `i18n/<lang>/stage/` (made by `i18n/tools/stage.mjs`, not committed): a working copy of the project, with the
  language's script in place of the English one. The English engine and scenes are linked in, not copied. The usual
  tools (voice, timeline, sounds, render, assemble, site) run inside it unchanged, so its clips, frames and film are the
  language's own.
- `i18n/src/i18n.js`, loaded into the stage's studio after the scene kit: each lettered word goes through
  `strings.yaml`, and each `atWord(id, 'phrase')` through the line's anchors. A phrase with no anchor falls back to the
  same place, proportionally, in the translated line.

The tools, run from the project's root:

- `node i18n/tools/todo.mjs [--chapter=N]`: what's left; for a chapter, each untranslated line with its English and
  the anchors it needs.
- `node i18n/tools/stage.mjs`: refresh the stage from the translations (prints what's still English).
- `node i18n/tools/probe.mjs --chapter=N`: draw the chapter in the stage and list any English still lettered, and any
  cue with no anchor.
- Inside `i18n/es/stage/`, the usual tools: `node tools/timeline.mjs`, `node render.mjs --chapter=N --sheet=...`, and
  later `node tools/voice.mjs`, `node tools/sfx.mjs`, `node render.mjs --chapter=N --draft`.

## Steps

- [x] The tree, the stage and the runtime hook (i18n/tools, i18n/src). Chapters 0 and 1 draw in Spanish.
- [ ] Translate the transcript, a chapter at a time, with anchors. 12,117 words in 453 lines. Done: chapters 0, 1.
- [x] The cold open's page and voices, the chapter titles (a few to revisit with their chapters).
- [ ] The codes' captions (409 with the explainers'). Done: chapters 0, 1.
- [ ] The scenes' lettering (strings.yaml); the probe lists any English word still painted. Done: chapters 0, 1.
- [ ] Back-translation check of every line; Curt reads the flagged ones (or a Spanish-speaking friend does).
- [ ] Voice it: about 76,000 characters of ElevenLabs. Names' pronunciations checked by ear. Done: chapter 1 (5,300
      characters, 6:23), for Curt to hear his clone in Spanish first.
- [ ] Drafts of every chapter; Curt watches for timing and anything left in English.
- [ ] The site in Spanish: the explainers (64), the site's pages, at `/es/`. The codes in the Spanish film point there.
- [ ] The final render (about 5.5 hours) and the join; the Spanish YouTube title, description and tags.
- [ ] Upload as its own video, linked from the English one, and the English from it.

## Costs

- ElevenLabs: about 76,000 characters for the voices (the English took 63,000); the sounds and music are reused.
- Rendering: drafts about as long as the English drafts, and a final about 5.5 hours. It shouldn't run at the same
  time as an English render.
- Disk: final frames are pruned per chapter, as for the English film.
