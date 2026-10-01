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

- Curt and Claude say *tú* to each other; in the cold open's comic, the handler says *usted* to the officer.
- Claude has no grammatical gender: its lines avoid adjectives that would give it one ("me divierte", not "divertido").
- A film or book goes by the title Latin American audiences know (*Conquista del planeta de los simios*). A paper,
  article or site keeps its own title ("On the Dangers of Stochastic Parrots"). People's names never change.
- A code that points at English Wikipedia points at the same article in Spanish, where one exists (Wikipedia's own
  language links, `i18n/tools/wiki_links.mjs`); 158 of 202 do.
- An explainer's caption starts "Explicado:".
- Acronyms are said in Spanish letters (LLM, "ele ele eme"): `i18n/es/pronounce.yaml`.
- Thousands with a space (17 000), decimals with a comma (0,05), as the RAE recommends.
- Curt's typos are kept only where they survive translation (a misspelt name: `i18n/es/typos.yaml`); every other one
  is a `typo` note on its line. No slip is invented.
- What stays English: titles with no Spanish title, the sources' own titles, and the token demonstrations in chapter
  12 (they show the English the model read).
- On the site: anything the translation adds goes in brackets as "[Nota de la traducción: …]"; Wikipedia links go to
  the Spanish article where there is one, else say "(en inglés)" (`i18n/tools/wiki_notes.mjs`); in the third person
  Claude takes the masculine pronoun of "el programa" ("lo"), but no gendered adjectives.

## Conventions (Brazilian Portuguese, `i18n/pt`, site at `/pt/`)

Curt's Spanish decisions carry over (Claude's assumption, 2026-09-30, for Curt to confirm): a full, faithful
translation, the same voices.

- Brazilian Portuguese, not Portugal's. Curt and Claude say *você*; the cold open's handler keeps the distance of
  *o senhor* without saying it.
- Claude has no grammatical gender: no adjectives or participles that would give it one ("me diverte", "que me meçam",
  "já te implantaram?"). On the site, the masculine pronoun of "o programa".
- *Ape* is "macaco", as in the Brazilian title *A Conquista do Planeta dos Macacos*. *Frog* is "sapo", the word a
  Brazilian says first (the title is *Sapo ou axolote*); a note says "rã" is often more exact.
- *Alien* is "estranho" (strange), not "alienígena"; the axis *Tempo* is "Ritmo".
- Films and books by their Brazilian titles (*O Jogo do Exterminador*, *O Exterminador do Futuro*, "Eu voltarei").
- Thousands with a point (17.000), decimals with a comma (0,05).
- "Prompt" stays English, as Brazilian tech Portuguese uses it.
- On the site: "[Nota da tradução: …]", and "(em inglês)" after a link with no Portuguese article (137 of the film's
  202 Wikipedia codes have one; 211 of the explainers' links moved to Portuguese Wikipedia).
- The translation page is `i18n/pt/translation.yaml` (its texts keyed `pt` and `en`), at `/pt/traducao/`.

## Conventions (Japanese, `i18n/ja`, site at `/ja/`)

Claude's choices (2026-09-30, for Curt to confirm), carrying over the Spanish decisions: a full, faithful translation,
the same voices.

- **The title** is 『カエルか、ウーパールーパーか』. *Axolotl* is ウーパールーパー, the name every Japanese viewer knows (from
  the 1985 craze); the zoologists' アホロートル is in a note. *Frog* is カエル.
- **Register:** Claude speaks です・ます, as it does in Japanese; Curt types plain, terse Japanese, as he types English.
  In the cold open's comic the officer barks and the handler answers him politely.
- **Pronouns:** Claude says 私; Curt says 僕 where he needs a pronoun at all. Claude calls Curt あなた only where Japanese
  needs a "you", and Curt calls Claude 君. Japanese adjectives have no gender, and neither do です・ます endings, so
  Claude stays genderless without effort. On the site Claude is "Claude", never 彼 or 彼女.
- **Names:** people's in katakana (カート・コックス, ジェフ・ジャービス); companies, products and models as they're
  written in Japanese, in Latin letters (Claude, Anthropic, OpenAI, ChatGPT, GPT-5.6 Luna, Hugging Face).
- **Works:** by their Japanese titles (『猿の惑星・征服』, 『エンダーのゲーム』, 『銀河ヒッチハイク・ガイド』,
  『ターミネーター2』, Billy Joel's 「ストレンジャー」). Papers, articles and sites keep their own titles.
- 「」 for quotations, 『』 for titles and quotations inside quotations; numbers as Japanese writes them (1万7000,
  0.05, 40%); プロンプト for "prompt".
- **What stays in English:** the sources' titles, code names, and the token demonstrations in chapter 12. Curt's
  surviving typos are the Latin-letter names (Solid Gold Magicarp, Shoggath, AGI 2027).
- **On the site:** "［訳注：…］" for what the translation adds, and "（英語）" after a link with no Japanese article.
- **The picture:** Japanese lettering in the system's Hiragino Maru Gothic (its own `@font-face` for the hand-lettering
  fonts' CJK range, so every Mac renders it the same, with nothing downloaded). Captions break a sentence at 。！？ and
  wrap between phrases (`Intl.Segmenter`, with each word's kana kept on it), never mid-word; a label wider than the
  English it replaces is squeezed to that width. Until it's voiced, a line's length is estimated at 6 characters a
  second (Japanese has no words to count).

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
- `i18n/<lang>/vo/`: the language's voice clips, committed like `assets/vo`; `i18n/<lang>/audio/*.json`, their
  measurements (durations, lip sync), committed like `audio/*.json`, so the site's timings build without the clips.
- `i18n/<lang>/site/notes/`: the explainers, translated (the stage links them in as its `site/notes`).
  `i18n/<lang>/site_strings.yaml`: the site's own words (tools/build_site.mjs reads `script/site_strings.yaml` over
  its English `SITE_WORDS`; the one change to an English file so far, and the English site builds byte for byte the
  same). `i18n/<lang>/site.yaml` (optional): the language's own film (YouTube id or preview) for the site.
- `i18n/<lang>/stage/` (made by `i18n/tools/stage.mjs`, not committed): a working copy of the project, with the
  language's script in place of the English one. The English engine and scenes are linked in, not copied. The usual
  tools (voice, timeline, sounds, render, assemble, site) run inside it unchanged, so its clips, frames and film are the
  language's own.
- `i18n/src/i18n.js`, loaded into the stage's studio after the scene kit: each lettered word goes through
  `strings.yaml` (a key `NN|text` applies in chapter NN only), and each `atWord(id, 'phrase')` through the line's
  anchors. A phrase with no anchor falls back to the same place, proportionally, in the translated line. A table is read
  in English (scenes find its rows by their English names) and each cell lettered through `strings.yaml`.

The tools, run from the project's root:

- `node i18n/tools/todo.mjs [--chapter=N]`: what's left; for a chapter, each untranslated line with its English and
  the anchors it needs.
- `node i18n/tools/stage.mjs`: refresh the stage from the translations (prints what's still English).
- `node i18n/tools/probe.mjs --chapter=N`: draw the chapter in the stage and list any English still lettered, and any
  cue with no anchor.
- `node i18n/tools/captions.mjs [--chapter=N]`: the codes whose captions aren't translated yet.
- `node i18n/tools/wiki_notes.mjs`: point the explainers' Wikipedia links at the language's articles.
- The site: inside the stage, `node tools/timeline.mjs && node tools/build_site.mjs`, then from the root
  `node i18n/tools/lost.mjs` (the builder clears `site/public`, so the translation's pages go in after it).
- Inside `i18n/es/stage/`, the usual tools: `node tools/timeline.mjs`, `node render.mjs --chapter=N --sheet=...`, and
  later `node tools/voice.mjs`, `node tools/sfx.mjs`, `node render.mjs --chapter=N --draft`.

## Steps

- [x] The tree, the stage and the runtime hook (i18n/tools, i18n/src). Chapters 0 and 1 draw in Spanish.
- [x] Translate the transcript, a chapter at a time, with anchors. 12,117 words in 453 lines. Done: all (2026-09-30),
      with 197 notes on what was lost.
- [x] The cold open's page and voices, the chapter titles (a few to revisit with their chapters).
- [x] The codes' captions (409 with the explainers').
- [x] The scenes' lettering (strings.yaml); the probe lists any English word still painted.
- [x] The translation's own page, in Spanish and English (`i18n/tools/lost.mjs` → the Spanish site's `traduccion/`,
      from `i18n/es/traduccion.yaml` and each line's `lost` notes): who translated it (Claude, unreviewed, on purpose),
      how, how else it could have been, and every difference a freer translation would have made, line by line; plus
      the whole film side by side. Its code is in the film on the ventriloquist line (T03.C.03.1, `refs_added.yaml`).
      Every chapter's translation adds its notes.
- [x] Publish the Spanish site at `/es/` with the English one: the Pages workflow builds every translation's site
      after the English one (2026-09-30). The film's code points at `/es/traduccion/`, so it's live before the film.
      The site's timings come from the voice's measurements, `i18n/<lang>/audio/*.json` (committed; the stage links
      them in), so they're estimates until a chapter is voiced.
- [x] Every line read against its English for drift (Claude, 2026-09-30: all 453, none changed). The same translator
      checking itself, so a Spanish-speaking reader is still the real check, if Curt finds one.
- [ ] Voice it: about 76,000 characters of ElevenLabs. Names' pronunciations checked by ear. Done: chapter 1 (5,300
      characters, 6:23); Curt approved the voices (2026-09-30). The ElevenLabs quota ran out on 2026-09-30 with
      one line of chapter 1 (T01.C.02, 264 characters) still to voice; about 71,000 characters to go.
- [ ] Drafts of every chapter; Curt watches for timing and anything left in English.
- [x] The site in Spanish: the explainers (64), the site's pages (built in the stage). The codes in the Spanish film
      point there. The making-of stays English, linked from the Spanish site.
- [x] The Spanish thumbnail: `i18n/es/thumbnail.jpg`, painted in the stage (`node render.mjs --add-script=src/thumbnail.js
      --loop=thumbnail --stills=0.5 --out=out/thumbnail`, then scaled to 1280×720; not `tools/thumbnail.mjs`, whose
      `docs/` is the English one's, linked).
- [ ] The final render (about 5.5 hours; on the faster Mac) and the join. The YouTube title, tags and description's
      words are translated (`youtube_strings.yaml`); the description itself is made at the join, from the film's times.
- [ ] Upload as its own video, linked from the English one, and the English from it.

### Brazilian Portuguese

- [x] The transcript (453 lines, every anchor), the lettering (361), the codes' captions (409), the cold open, the
      chapter titles, the 64 explainers, the site's words, the YouTube words, the translation's page (92 notes), the
      thumbnail (`i18n/pt/thumbnail.jpg`). Built by the same Pages workflow, at `/pt/` (2026-09-30).
- [x] Every line read against its English for drift (Claude, 2026-09-30: all 453, none changed); no European forms, and
      Claude never takes a gender. The probe: every chapter, nothing lettered in English, every cue anchored, no errors.
- [x] Captions a sentence at a time in any language: the English engine starts a sentence only at A–Z, which missed
      27 breaks in Portuguese ("É…") and 12 in Spanish ("¿…"). `i18n/src/i18n.js` splits at any capital (the English
      `src/timing.js` is left alone, so the English final's frames stay current); `tools/subtitles.mjs` the same (the
      English subtitles come out byte for byte the same).
- [ ] Curt confirms the Spanish decisions apply (or changes them).
- [ ] Voice it (ElevenLabs quota permitting), then drafts, then the final on the faster Mac.

## Costs

- ElevenLabs: about 76,000 characters for the voices (the English took 63,000); the sounds and music are reused.
- Rendering: drafts about as long as the English drafts, and a final about 5.5 hours. It shouldn't run at the same
  time as an English render.
- Disk: final frames are pruned per chapter, as for the English film.
