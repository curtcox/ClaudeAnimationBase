# Translations: the plan

Started 2026-09-30. Spanish first; the tree is built so any language can follow it.

## Which languages, and why

In order:

1. **Spanish** (neutral Latin American). YouTube's largest audience after English, and many viewers don't follow
   fast spoken English. Latin letters, so every painted word fits without new fonts. ElevenLabs speaks it well.
2. **Brazilian Portuguese**. The next largest, for the same reasons. Latin letters.
3. **Japanese**. Strong interest in AI, little English, and a habit of watching dubbed and subtitled video. It costs
   more: a Japanese font, and every painted label's size and line breaks checked again. (Begun 2026-09-30: see
   *Conventions (Japanese)* and the steps below.)

Later, if the first three find viewers:

- **German, French**: strong interest in AI policy, but many of these viewers manage English already. Subtitles may do.
  (German begun in full on 2026-10-01, at Curt's word: see *Conventions (German)* and the steps below.)
- **Hindi**: YouTube's biggest market, but Indian tech viewers mostly watch in English. Subtitles first. (Begun in
  full on 2026-10-01, at Curt's word: see *Conventions (Hindi)* and the steps below.)
- **Chinese, Korean, Arabic**: large, but YouTube is blocked in mainland China, Korean needs another script, and
  Arabic runs right to left (the site would need it). (Chinese begun in full on 2026-10-01, at Curt's word, in
  Traditional characters for Taiwan: see *Conventions (Chinese)* and the steps below.)

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
  wrap between phrases (`Intl.Segmenter`, with each word's kana kept on it up to a particle), never mid-word; a label wider than the
  English it replaces is squeezed to that width. Until it's voiced, a line's length is estimated at 6 characters a
  second (Japanese has no words to count).

## Conventions (Hindi, `i18n/hi`, site at `/hi/`)

Claude's choices (2026-10-01, for Curt to confirm), carrying over the Spanish decisions: a full, faithful translation,
the same voices.

- **The title** is *मेंढक या एक्सोलोटल* (*Frog or Axolotl*). *Axolotl* has no everyday Hindi name, so it's spelled as
  it sounds, एक्सोलोटल; *frog* is मेंढक.
- **Register:** the Hindi educated Indians speak, not the Sanskritized Hindi of official notices: English words where
  Indian speakers use them (मॉडल, टेस्ट, प्रॉम्प्ट, डेटा), Devanagari for them, nukta where it's heard (ज़, फ़).
  Claude says आप to Curt; Curt says तुम to Claude, as a friend would. In the cold open's comic the officer says तुम
  and barks; the handler says आप to him.
- **Claude has no gender.** Hindi verbs agree with their subject's gender (मैं सोचता हूँ, he; सोचती हूँ, she), so a
  Claude that speaks in the first person must pick one at nearly every verb. It doesn't: its lines are built so the
  verb never shows a gender (मुझे लगता है, मेरा जवाब है, मैंने कहा, the subjunctive करूँ). Curt's lines to Claude
  (तुम करते/करती हो) and the site's sentences about Claude are built the same way (Claude ने कहा, Claude के
  मुताबिक). It costs some naturalness, noted on the translation's page.
- **Names:** people's in Devanagari (कर्ट कॉक्स, जेफ़ जार्विस); companies, products and models in Latin letters, as
  Hindi tech writing leaves them (Claude, Anthropic, OpenAI, ChatGPT, GPT-5.6 Luna, Hugging Face).
- **Works:** Hollywood films and English books are known in India by their English titles, so they're spelled as they
  sound, in Devanagari (*प्लैनेट ऑफ़ द एप्स*), with a Hindi gloss where one helps. Papers, articles and sites keep
  their own titles.
- **Punctuation and numbers:** the danda (।) ends a sentence; commas, ?, ! and quotation marks as in English.
  Numbers in international digits, as Hindi newspapers print them, in Indian grouping where it's natural (17 हज़ार,
  12.5 लाख).
- **Apes:** *ape* is बंदर throughout, the everyday word (वानर is literary; वनमानुष is a zoologist's), as Japanese
  says 猿.
- **What stays in English:** the sources' titles, code names, the token demonstrations in chapter 12. Curt's surviving
  typos are the Latin-letter names (Solid Gold Magicarp, Shoggath, AGI 2027).
- **On the site:** "[अनुवादक की टिप्पणी: …]" for what the translation adds, and "(अंग्रेज़ी में)" after a link with
  no Hindi article.
- **The picture:** Hindi lettering in the Mac's own Kohinoor Devanagari (its own `@font-face` for the hand-lettering
  fonts' Devanagari range, as for Japanese). Captions end a sentence at the danda; labels wider than the English they
  replace are fitted to it, as Japanese labels are.

## Conventions (Chinese, `i18n/zh`, site at `/zh/`)

Claude's choices (2026-10-01, for Curt to confirm), carrying over the Spanish decisions: a full, faithful translation,
the same voices.

- **Traditional characters, as Taiwan writes them** (程式, 軟體, 網路, 資料; 「」 for quotations, 《》 for titles of
  films and books, 〈〉 for songs and articles). YouTube is blocked in mainland China, so the film's Chinese viewers are
  mostly in Taiwan, Hong Kong and abroad, who read Traditional. Traditional converts to Simplified almost mechanically
  (OpenCC), and not the other way round, so Simplified subtitles can follow cheaply if wanted.
- **The title** is 《青蛙還是六角恐龍》. *Axolotl* is 六角恐龍, the pet-shop name every Taiwanese viewer knows (the
  zoologists' 墨西哥鈍口螈 is in a note); *frog* is 青蛙; *ape* is 猩猩, which the series' Chinese titles (猩球) come
  from.
- **Address:** Curt and Claude both say 你 (never the polite 您): the English is casual and even.
- **Claude has no gender.** Chinese verbs and adjectives have none; only the written third person does (他, 她, 它, all
  said *tā*). On the site Claude is 它, following the English *it*, or "Claude"; never 他 or 她.
- **Names:** people's in characters, as Taiwanese media transliterate them (寇特 Curt, 圖靈, 夢露, 尤考斯基), except a
  Chinese name only known in romanization (Ziqian Zhong), which stays as written; companies, products and models in
  Latin letters (Claude, Anthropic, OpenAI, ChatGPT, GPT-5.6 Luna, Hugging Face). No space between Chinese and Latin.
- **Works:** by their Taiwanese titles (《猩球征服》, 《安德的遊戲》, 《銀河便車指南》, 《魔鬼終結者2》, 〈陌生人〉).
  Papers, articles and sites keep their own titles.
- **Coinages:** *thrindle* is 斯林朵 (as meaningless in Chinese); *confuzzled* is the Taiwanese slang 霧煞煞 (a note says
  it's not a coinage); *foom*, OOM, RSI, AFAYCT and TESCREAL stay in Latin letters, as Chinese AI writing leaves them.
- **What stays in English:** the sources' titles, code names, the token demonstrations in chapter 12. Curt's surviving
  typos are the Latin-letter names (Solid Gold Magicarp, Shoggath, AGI 2027).
- **On the site:** "［譯註：…］" for what the translation adds, and "（英文）" after a link with no Chinese article.
  Chinese Wikipedia links use the `/zh-tw/` path, so an article shows in Traditional characters.
- **The picture:** Chinese lettering in the Mac's own PingFang TC (its own `@font-face` for the hand-lettering fonts'
  CJK range, as for Japanese). Captions and subtitles break as Japanese ones do, and also keep a particle (的 了 嗎 們…)
  with the word before it and a measure word with its numeral. Until it's voiced, a line's length is estimated at 4.5
  characters a second (Mandarin says each character as a syllable).
- **The voice:** brand names, models and acronyms are left for the voice to say in English, as Taiwanese speakers do;
  only what it might misread is respelled (`i18n/zh/pronounce.yaml`: T-800 → T八百, GPT-5.6 → GPT五點六…).

## Conventions (German, `i18n/de`, site at `/de/`)

Claude's choices (2026-10-01, for Curt to confirm), carrying over the Spanish decisions: a full, faithful translation,
the same voices.

- **The title** is *Frosch oder Axolotl*: the axolotl is *Axolotl* in German too, and *frog* is *Frosch*.
- **Du.** Curt and Claude say *du* to each other, as casual German and German chats with AI do; in the cold open's
  comic the handler says *Sie* to the officer.
- **Claude has no gender.** German first-person adjectives have none, so Claude's lines need no care there; job and
  role nouns do (*Ontologe/Ontologin*, *Doktor/Doktorin*), and Claude's lines avoid them ("aus Sicht der
  professionellen Ontologie", "wenn du in Ontologie promoviert hättest"). On the site Claude is "Claude" or *es* (das
  Programm, das Modell), never *er* or *sie*. Nouns' grammatical gender (*der Geist*, *das Modell*) is left alone.
- **Works** by their German titles (*Eroberung vom Planet der Affen*, *Per Anhalter durch die Galaxis*, *Ender's Game –
  Das große Spiel*, *Terminator 2 – Tag der Abrechnung*, "Ich komme wieder"); papers, articles and sites keep their own
  titles. *Ape* is *Affe*, as in *Planet der Affen*.
- **Words:** KI for AI (but AGI, LLM, RLHF, RSI stay); *register* is *Tonlage* throughout; *probe* is *Test*;
  *eval-awareness* is *Testbewusstsein*; *harness* is *Gerüst*; *shell* is *Schale*. English tech words German uses
  stay (Prompt, Token, Benchmark, Reward Hacking, Exploit).
- **Coinages:** *thrindle* is *Thrindel* (German-shaped, meaningless); *confuzzled* is *verdwirrt* (verdutzt +
  verwirrt), a coinage as the original is; *Crustafarianism* is *Krustafarianismus* (Krustentier shows through).
- **Numbers** as German writes them: 17.000, 0,05, 40&nbsp;% (a no-break space before %, so a caption never splits
  it). No abbreviations like *z. B.* in the lines (a caption would end a sentence at the point); a date's ordinal
  (30. Januar) ends no caption sentence (`i18n/src/i18n.js`, `tools/subtitles.mjs`; English unchanged).
- **On the site:** "[Anmerkung der Übersetzung: …]" for what the translation adds, and "(auf Englisch)" after a link
  with no German article (136 of the film's 202 Wikipedia codes have one; 206 of the explainers' links moved).
- **The picture:** Latin letters, so the hand-lettering fonts serve as they are (umlauts and ß included); long German
  words are fitted to the English widths as Japanese ones are (`fit`, `i18n/tools/stage.mjs`).
- **The voice:** acronyms and model names respelled for a German voice (`i18n/de/pronounce.yaml`: LLM → Ell-Ell-Em,
  T-800 → T achthundert, GPT-5.6 → G-P-T fünf Punkt sechs…).

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

### Japanese

- [x] The engine's hooks, all in the translation's own files so the English renders stay current: Hiragino for the
      hand-lettering fonts (`i18n/ja/studio.css`), captions broken at 。！？ and wrapped between phrases, labels wider
      than their English fitted half by size and half by condensing, the comic's balloons revealed run by run, lengths
      estimated from characters (6 a second), a balloon's word count given by the stage (2026-10-01).
- [x] The transcript (453 lines, every anchor), the lettering (402 strings), the codes' captions (409; Japanese
      Wikipedia for 143 of 202), the cold open, the chapter titles, both thumbnails, the 64 explainers (their
      Wikipedia links moved to Japanese for 227, marked （英語） for 80), the site's words, the YouTube words, the
      translation's page (`i18n/ja/translation.yaml`, at `/ja/honyaku/`, 69 notes). Every chapter probed: nothing
      lettered in English, every cue anchored, no errors. Built by the same Pages workflow, at `/ja/`.
- [x] The site reads as Japanese: no hard line breaks inside Japanese paragraphs (a browser shows one as a space), and
      no italics (quotations upright, emphasis bold), added to the Japanese site's stylesheet by `i18n/tools/lost.mjs`.
- [x] Checked again (2026-10-01): every line's figures against the English, every explainer's paragraphs, the built
      site for stray spaces; Curt's typed line break in chapter 4 restored (Portuguese had lost it too). Subtitles
      (`tools/subtitles.mjs`, English byte for byte the same): 16 characters a row, at most 26 a cue, broken between
      phrases. A run of kana now breaks after a particle (を は が に…), a figure keeps its counter (20年), and この・
      その・あの・どの the word they point at, in the subtitles and the captions alike.
- [ ] Curt confirms the conventions above (or changes them); a Japanese-reading reviewer, if one turns up.
- [ ] Voice it: ElevenLabs' eleven_v3 speaks Japanese; names and acronyms are respelled in katakana
      (`i18n/ja/pronounce.yaml`). Then drafts, then the final on the faster Mac.

### Hindi

- [x] The engine's hooks, in the translation's own files: Kohinoor Devanagari for the hand-lettering fonts
      (`i18n/hi/studio.css`), loaded before the first frame like the Japanese glyphs; labels wider than their English
      fitted as Japanese ones are; captions and subtitles end a sentence at the danda (।), and a subtitle row never
      starts with a postposition (में, का, है…). English captions and subtitles unchanged (2026-10-01).
- [x] The transcript (453 lines, every anchor), the cold open, the chapter titles, the lettering (406 strings), the
      codes' captions (409; Hindi Wikipedia for 39 of 202), both thumbnails, the 64 explainers (Wikipedia links moved
      to Hindi for 70, marked "(अंग्रेज़ी में)" for 237), the site's words, the YouTube words, the translation's page
      (`i18n/hi/translation.yaml`, at `/hi/anuvad/`). No italics on the Hindi site (Devanagari has none to borrow).
- [x] Every chapter probed: nothing lettered in English, every cue anchored, no errors (2026-10-01).
- [x] Claude never takes a gender: every line was built for it and checked by a scan for gendered verbs about Claude,
      in the transcript and the explainers; each place it cost something is a note on the translation's page.
- [x] Checked again (2026-10-01): every line read against its English for drift (all 453, none changed), every
      figure, every explainer's paragraphs, links and figures (one agreement slip fixed), the built site for English
      left outside titles and quotations (none).
- [ ] Curt confirms the conventions above (or changes them); a Hindi-reading reviewer, if one turns up.
- [ ] Voice it: eleven_v3 speaks Hindi; Latin names and acronyms are respelled in Devanagari (`i18n/hi/pronounce.yaml`).
      Then drafts, then the final on the faster Mac.

### Chinese (Traditional, Taiwan)

- [x] The engine's hooks, in the translation's own files: PingFang TC for the hand-lettering fonts (`i18n/zh/studio.css`),
      loaded before the first frame; labels wider than their English fitted; lengths estimated at 4.5 characters a second;
      Chinese Wikipedia links in Traditional (`/zh-tw/`). Captions and subtitles: a particle or measure word never starts
      a row, a row may end at a full-width comma, and a cue past its share waits for a comma a little further on (the
      Japanese subtitles gain that too; English unchanged) (2026-10-01).
- [x] The transcript (453 lines, every anchor), the cold open, the chapter titles, the lettering (406 strings), the codes'
      captions (409; Chinese Wikipedia for 147 of 202), the 64 explainers (Wikipedia links moved to Chinese for 222,
      marked （英文） for 85), the site's words, the YouTube words, the translation's page (`i18n/zh/translation.yaml`, at
      `/zh/fanyi/`), both thumbnails.
- [x] Every chapter probed: nothing lettered in English, every cue anchored, no errors; frames of chapters 1, 7 and 14
      checked by eye (2026-10-01).
- [x] Checked again (2026-10-01): every line read against its English (one clause smoothed), every figure, every
      explainer's paragraphs, links and figures; no 他 or 她 for Claude anywhere, no 您 outside a quotation; no space
      between Chinese and an italic English word in the notes; frames of chapters 6, 12 and 15 by eye. The translation's
      page now turns bold and italics touching Chinese or Japanese into HTML first, as the rest of the site does (raw
      `**` had shown there in both), and the Japanese and Chinese explainers lose the space after a bold lead-in
      ("**為什麼。**不是…"), which showed as a gap after the full-width stop.
- [ ] Curt confirms the conventions above (or changes them); a Chinese-reading reviewer, if one turns up.
- [ ] Voice it: eleven_v3 speaks Mandarin. Then drafts, then the final on the faster Mac.

### German

- [x] The engine's hooks: long German labels fitted like Japanese ones; German Wikipedia links marked "(auf Englisch)"
      where there's no German article; a date's ordinal ends no caption sentence (English captions and subtitles
      unchanged) (2026-10-01).
- [x] The transcript (453 lines, every anchor), the cold open, the chapter titles, the lettering (406 strings), the
      codes' captions (409; German Wikipedia for 136 of 202), the 64 explainers (Wikipedia links moved to German for
      206, marked "(auf Englisch)" for 101), the site's words, the YouTube words, the translation's page
      (`i18n/de/translation.yaml`, at `/de/uebersetzung/`, 56 notes), both thumbnails.
- [x] Every chapter probed: nothing lettered in English, every cue anchored, no errors; frames of chapters 0, 7, 12 and
      15 checked by eye; subtitles checked (2026-10-01).
- [x] Checked again (2026-10-01): every line read against its English (two smoothed: "trained on top", and a pronoun
      that could have meant the coinage instead of the test), every explainer's paragraphs, links and figures, each
      hand-written German Wikipedia link confirmed to exist, a scan for *er*/*sie* or a gendered job title about
      Claude (one in an explainer rephrased), the built site for English outside titles and quotations (none).
- [ ] Curt confirms the conventions above (or changes them); a German-reading reviewer, if one turns up.
- [ ] Voice it: eleven_v3 speaks German. Then drafts, then the final on the faster Mac.

## Costs

- ElevenLabs: about 76,000 characters for the voices (the English took 63,000); the sounds and music are reused.
- Rendering: drafts about as long as the English drafts, and a final about 5.5 hours. It shouldn't run at the same
  time as an English render.
- Disk: final frames are pruned per chapter, as for the English film.
