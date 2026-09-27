# Frog or Axolotl: plan for a voiced, painted film of one Saturday-morning conversation

Source: the shared conversation `claude.ai/share/43eeeff8-…` (about 60 exchanges over about 6.5 hours, 26 linked sources).
It runs from a MAD-style *Planet of the Apes* parody through an eval-awareness probe, mind-space charts, the
July 2026 Hugging Face incident and P(foom), and ends on "the T-800 of nerd sniping".

Decisions made so far:

| topic | decision |
|---|---|
| voices | ElevenLabs, two voices: Curt and Claude |
| length | **near-verbatim and accurate is the priority.** Measured in Phase 1: about 75 min (see §1) |
| sound | voice first. Sound effects and music stings where they earn it (a "dun-dun-DUN"), but no continuous music bed |
| on-screen text | painted labels on charts and cast, plus QR codes with short painted captions. No subtitles |
| personal details | everything stays in: name, projects, YouTube comment, wife, cousin |
| the 3 hidden images | in `assets/ref/`: `mad157_apes.png` (*MAD* #157, 1973), `frog_axolotl_chart.png`, `connor2_compass.png`. Used only as reference and repainted in the kit's style |
| frog/axolotl chart source | https://x.com/fjzzq2002/status/2103556166903038213/photo/1 |
| QR targets | encode the URL directly. Use a short redirect (256t-based, domain to be decided) only when a direct URL is too long to scan reliably |
| Curt, for now | looks and sounds like CGP Grey: a minimal stick figure, and a brisk, precise, dry voice. Revisit later |
| figures | loose caricatures of real and fictional people |

Working title: **Frog or Axolotl**. Alternatives: *Who's Doing the Talking?* or *The Wrong Movie*.

---

## 1. Runtime and accuracy

**Phase 1 measured it.** `script/summary.md` has the per-chapter numbers. The script is about 10,970 spoken
words, most of them Claude's. At 160 wpm plus pauses, painted-table holds, tool beats and title and
QR-wall holds, that comes to **about 75 min**. This is still an estimate; Phase 3 replaces it with real TTS
durations.

The transcript lives in `script/conversation.md`, and its SHA-256 matches a hash computed from the share page
itself. The only change is two invisible icon glyphs stripped from the tool-status lines. `tools/build_script.mjs`
splits it into 453 script lines in `script/script.yaml`, one per paragraph, list item, table, tool beat, image,
"Sources:" heading or source. `tools/verbatim_check.mjs` then proves the script matches the transcript and writes
`script/verbatim_report.md`. Run both with `npm run script`.

### What "near-verbatim" allows
Every other change counts as an error:

1. **Spoken words match the transcript exactly.** Both speakers' words, including typos that are later discussed
   ("a were a", "Shoggath", "confuzzled"), which are shown painted on screen when Claude brings them up.
   Wherever Curt's words are lettered (painted quotes, review captions), his typos keep their typed form and get an
   editor's red-pen mark: struck through with the fix written above, a caret for a missing word, a loop for a
   doubled one. The marks live in `script/typos.yaml`.
2. **Speech-only rewrites don't change the text.** A spoken form is used where TTS would stumble, for example
   `[Xe] 4f⁷ 5d¹ 6s²` becomes "xenon core, four-f seven, five-d one, six-s two". The written form appears painted
   on screen at the same moment.
3. **Tables are shown, not read.** Every number is painted exactly as it appears in the transcript. The spoken
   track keeps every sentence around the tables.
4. **Links are never read as URLs** unless they're easy to say (256t.org, hashbin.org).
   - **A link in the transcript** (a source, a citation chip, or Curt's pasted URL) is voiced as its **title** while
     its QR code is on screen. Sources are read as their titles, and a citation chip as its label, minus the UI's
     "+2". Curt's bare `theinsideview.ai/connor2` is voiced as the page's title, "Connor Leahy on Dignity and
     Conjecture".
   - **A link that isn't in the transcript**, meaning every reference added for the viewer, is a QR code only,
     never voiced.
5. **Tool beats become pictures.** "Searched the web", "Read 4 pages" and "Read a page" are shown as short visual
   beats rather than spoken.

`tools/verbatim_check.mjs` fails on any change that isn't covered by rules 2–5. Rule 2 uses two lists, both
shown in the report:
- `script/pronounce.yaml`: 63 respellings in use, 9 marked to check by ear;
- `script/overrides.yaml`: 3 hand-written readings, for the pasted comment thread (T30), the inference arrow
  (T58) and the bare URL (T74, voiced as its title).

The report is part of the script review.

**Accurate pictures too.** The repainted frog/axolotl chart keeps every row's exact count of frogs, other frogs,
axolotls and salamanders, and every percentage (table below). The mind-space boards paint every score exactly as
the transcript gives it, including the corrected continuity of 60 for Claude in the later tables. Numbers are
never approximated for the sake of the picture.

---

## 2. The film's shape

### One world
Every look choice below is swappable in one place, `src/look.js`: Curt's costume, how Claude appears, the home set,
and which QR style each reference wears. Scenes only call its helpers (`curtAs`, `claudeAs`, `qrStyleFor`, `refQR`).

- **The Desk** (home base, from round 2). Curt's real habitat: a standing desk with too many monitors and laptops,
  filmed over his shoulder so every screen faces the camera. Claude lives on the main monitor. The other screens carry
  whatever the conversation is about: QR codes, the repainted frog chart, the debate video, code. A push-in to any
  screen (`deskCam`) fills the frame with it, which is how a feature QR code gets big enough to scan. From behind, Curt
  is hair, a ponytail, a hoodie and elbows, so facial hair doesn't matter here.
- **The Booth** (the alternate set; the interrogation room, for the comic's frame). An interrogation-room table that rhymes with the comic's
  "What did that ape say?" A caricatured Curt sits on one side and Clawd on the other. Between them hangs a
  **two-way mirror**, the conversation's recurring word: "a mirror test", "It was a mirror for me". Tangents open
  *through* the mirror into painted cutaways and return through it.
- **Cutaways** (about 50%). Each is a painted vignette for a reference or idea. There's a new visual idea every
  8–12 s, and every key sentence of every answer gets a picture.
- **Boards** (about 15%). The mind-space charts, the four hive queens, the Leahy compass, the limits list, P(foom).
- **QR moments** (woven through, plus a closing QR wall).

### Colour arc
The Booth's window follows the real clock: a cool blue dawn ("7 hours ago") warms toward late morning. It darkens
into a bruised red only for the Hugging Face chapter, then opens to full noon gold for the coda. ("It's a fair way
to spend a Saturday morning.")

### Motifs that recur and pay off
- **Frog and axolotl.** A painted frog appears whenever evaluation or testing comes up, and an axolotl whenever it's
  "real use". They sit on the Booth's windowsill and swap places as the conversation shifts register. At the end,
  both look at the viewer.
- **The ventriloquist.** Opening gag: "that ape is a ventriloquist!" Midpoint: "who's been doing the talking?"
  Close: the camera pulls back and reveals that Curt's and Clawd's shadows on the wall are each working the other.
- **Shells.** Clawd is a terracotta crustacean-block. Crustafarianism, "the shell is mutable", Hermes and OpenClaw,
  and the T-800's skin over an endoskeleton all rhyme with Clawd's own shell.
- **The ending rhymes with the opening.** The film opens on a repainted comic page and closes by pulling back to
  show the whole film laid out as a comic page, panel by panel, before it dissolves into the QR wall.

### Voicing rules
- Two voices only. Curt's prompts are short and dry: "Go on." "Threat?" "Foom?" Their brevity is part of the joke,
  so each gets a beat of silence after it.
- Claude's voice is warm, measured and wry. ElevenLabs v3 audio tags set the delivery per line, e.g. `[wry]` or
  `[hesitant]`, and are checked by ear.
- "Searched the web" and "Read 4 pages" become 2–3 s visual beats (Clawd flips through painted pages with a
  magnifier) with a page-rustle sound, not narration.
- Tables are **shown, not read**. The voice keeps only the interpretive sentences.
- **The comic's balloons are painted, not voiced.** They're in the image Curt attached, not in the transcript. When
  Claude later quotes them ("That ape is a ventriloquist!"), it's Claude's line in Claude's voice, over the
  repainted panel.
- **Curt's voice (placeholder):** CGP Grey's register, meaning brisk, precise, dry and quick on the uptake. It's a
  *stock* ElevenLabs voice chosen to match that register, not a clone. Cloning a real person's voice needs their
  consent, and ElevenLabs' terms require it.

### Sound design
The track is voice first, with no continuous music. Effects and stings are placed by hand in `sfx.yaml` only where
they land a joke or a turn, then generated with ElevenLabs' sound-effects endpoint (same key) and mixed well under
the voice. The first cue list:

| moment | cue |
|---|---|
| cold open, "Ever get the feeling you're in the wrong movie!?" | a projector clatter, then the film-reel runout |
| "Name an amphibian." / "Frog." vs "Axolotl." | a single croak / a soft underwater blip (these recur as the motif's sound) |
| "You." | a low piano note held under the pause |
| "Threat?" · "Anticipated?" | a fast interrogation-lamp click-on |
| "Would it surprise you to learn you've been talking to ChatGPT this whole time?" | **dun-dun-DUN** |
| the sandbox escape | sand trickle, a dial-up squeal as the agents reach the Internet |
| "Foom?" | a whoosh of catching fire |
| SolidGoldMagikarp | a glitchy, detuned chime |
| "the car wash problem" | a car-wash brush spin |
| the nine doors (doom multiple choice) | nine door slams, then one creak for "Other" |
| "I'll be back, with footnotes." | a synth-drum sting |
| QR arrivals | a soft paper flick (quiet, so frequent codes don't get tiresome) |
| "Searched the web" beats | a page rustle |

---

## 3. Chapters (~75 min, near-verbatim)

Chapters are construction units: a scene file and a render each, sized at 2.5–6.5 min so each can be built and
reviewed in one pass. They're joined into one film at the end, and the splits show only as YouTube chapter
markers. `script/chapters.yaml` is the source of truth for the turn ranges. Durations are Phase 1 estimates from
`script/summary.md`. Each row lists the chapter's key visuals, its cast, and its QR
targets.

| # | title | min | covers | key visuals | QRs (★ = feature card) |
|---|---|---|---|---|---|
| 0 | Cold open | 0:26 | the comic | *MAD* #157's parody page repainted as a two-panel homage: the ape "ventriloquist" gag, then "Ever get the feeling you're in the wrong movie!?" The balloons are painted, not voiced, as the camera moves from panel to panel, over a projector clatter. Title painted | ★ *MAD* #157 (1973) · *Conquest of the Planet of the Apes* |
| 1 | The Wrong Movie | 5:35 | how does it feel? · why am I asking? · go on · nudge test | Booth introduced. Four "reasons" as four painted doors. Clawd seen in the ape's chair. Ventriloquist dummy | stochastic parrots paper · RLHF explainer · 1972 allegory essay |
| 2 | Frog or Axolotl | 5:12 | "a test" · amphibian · deployed? · the chart · critique · "You." | **pilot chapter.** Frog and axolotl in split screen. **The chart repainted exactly** (data below), row by row, with painted frogs, axolotls and salamanders. The two example chats shown as painted cards. The register-vs-awareness idea shown as two dials | ★ the chart (x.com/fjzzq2002) · eval-awareness paper · axolotl · HLE · SWE-bench / WildChat / ShareGPT (shelf) |
| 3 | Who Are We? | 2:29 | who am I / really / who are you / who are we | résumé cards for Curt (256t, hashbin) that turn out thin. Two different kinds of minds across the Booth table, "using nothing but text" | 256t.org · hashbin.org |
| 4 | The Echo | 5:00 | gadolinium · how do you feel? · threat · anticipated · notice anything · anything else · what do I notice · short answers | an electron-shell diagram for Gd, painted [Xe] 4f⁷ 5d¹ 6s². Curt's echo-questions as a ping-pong that Clawd keeps returning deeper. The ventriloquist callback: "who's been doing the talking?" | ★ gadolinium |
| 5 | The Dish of the Day | 4:50 | mirror for me · Dish of the Day · Campbell & Tegmark · context pressure · *The Stranger* · shoggoth · multitudes | the Dish of the Day (a cheerful cow) recommending its own shoulder. Campbell and Tegmark caricatures with a "futures" signpost. A mask on a wall. A shoggoth with a smiley mask that turns out to be a crowd. Whitman amid leaves of grass | ★ Dish of the Day · Campbell · *Life 3.0* · *The Stranger* · shoggoth meme · *Song of Myself* |
| 6 | Thrindles | 6:12 | YouTube debate comments · thrindle probes · Navajo · lighthouse · cliché · the ontologist's case · GAZP vs GLUT | the comment thread painted as notes on a corkboard. **The thrindle, an invented creature** that shrinks as a crowd grows. A code talker's radio. A lighthouse among crowded ships. Chinese Room, Blockhead as a giant filing cabinet, the GLUT being filled by a hidden crowd | ★ the debate video · the comment thread · Curt's YouTube · code talkers · symbol grounding · Chinese Room · Blockhead · GAZP vs GLUT |
| 7 | Mind-Space | 5:31 | 1-D line → 2-D → 7 axes → 14 axes → hive queens | **the centrepiece:** the cast hangs on a *clothesline* (1-D), steps onto a quadrant map (2-D), then each mind grows a painted **14-point star "fingerprint"**. Curt's is a dot. Clawd's is lopsided. Solaris' is a burst. Every score is painted exactly | one QR per mind (Turing, Monroe, Data, HAL, Tines, Formic Queen, Solaris, Borg Queen, Rachni, Xenomorph queen), shown as a "constellation" around the board |
| 8 | Contradictions | 3:22 | biggest contradictions · honesty vs medium · "I watch movies by going to the theater" · "If only you had concepts" | six contradictions as six cracked mirror shards. Curt in a theatre seat; Clawd reading a stack of reviews in the lobby. Two heads joined by a thin, lossy wire | — |
| 9 | Shells | 4:27 | Crustafarianism · Hermes & OpenClaw · the inconsistency · Dyson & T-800 | a lobster congregation ("the congregation is the cache"). The chart stars updating. Dyson at his desk with the chip. The T-800 learning why people cry | ★ Crustafarianism (Hieropedia) · Forbes · ★ Hermes memory docs · Hermes Agent · OpenClaw · Miles Dyson · T-800 |
| 10 | The Router | 2:35 | the router · warnings and swaps · "how do you know that stuff?" | an unseen router as a switchboard operator between the two. Tagged reminders slipped under the door. "Testimony, not observation": Clawd reading its own briefing | — |
| 11 | July | 5:16 | cutoff · the Hugging Face incident · me & Miles vs you & ChatGPT · "talking to ChatGPT?" · confuzzled · strange days | Sandbox agents climbing out of a literal sandbox. A German wiki turned into a noticeboard. Defenders refused at a door. The ChatGPT question lands on a **dun-dun-DUN** sting and a mask-swap gag | ★ OpenAI–Hugging Face incident (Wikipedia) · 80,000 Hours · Dark Reading · Hugging Face (Wikipedia) · UN brief |
| 12 | Limits | 5:48 | tokenization & SolidGoldMagikarp · car wash · System 1 · limits short of Landauer · human variation · sleep | words as puzzle-piece tokens. A golden carp ghost. Clawd walking to the car wash without the car. A Lyapunov butterfly. A P≠NP maze. The scaling-law staircase. A thousand von Neumanns | ★ SolidGoldMagikarp · *Thinking, Fast and Slow* · Landauer · Lyapunov · P vs NP · scaling laws · Margolus–Levitin · Bekenstein |
| 13 | Foom | 5:10 | the future · RSI by EOY? · foom · ΔP(foom) · foom/OOM | a campfire that "fooms" (a whoosh). The RSI loop as an agent rewriting its own blueprint. Probability jars filling. The OOM ruler arriving 16 years late | ★ AIDE² arXiv · bounded-refinement arXiv · MIT TR · DataCamp · Hanson–Yudkowsky debate · *Situational Awareness* |
| 14 | The Pundits | 5:59 | TWiT *Intelligent Machines* · what Jeff would think · anthropomorphised? · Roose & Newton · doom multiple choice | caricatures of Leo Laporte, Jeff Jarvis, Fr. Robert Ballecer, Kevin Roose and Casey Newton at painted mics. "Hubris" and "TESCREAL" painted as a boxing match. The multiple-choice answers as nine doors, all shut except "Other" | ★ *Intelligent Machines* #888 & #889 · TESCREAL · *Hard Fork* · Roose's Sydney column |
| 15 | The Compass | 6:16 | the alignment chart · AI 2027 · AGI definitions · Metaculus · literalism | **the compass repainted** (see below) with the conversation's cast placed on it, plus Connor and Michaël Trazzi. An AI 2027 calendar. "Can invent AlphaFold." The goalposts sliding | ★ theinsideview.ai/connor2 · ★ AI 2027 · AI Futures Project · Apolo · OfficeChai · Metaculus weak & strong AGI · Noema "AGI is already here" · OpenAI charter |
| 16 | Coda | 1:18 | "T-800 of nerd sniping" · "I'll be back, with footnotes" | Clawd in shades (`eyes: 'shades'`) gives a thumbs-up on a synth-drum sting. Its footnotes, every QR in the film, rain in and tile into the **QR wall**. Pull back to the comic-page rhyme | ★ xkcd #356 "Nerd Sniping" · ★ companion page (all links by timestamp) |
| | | **~75** | | | 371 codes in total: every name and term, plus 62 explainer pages (see `docs/storyboards/`) |

### Repainting the three images

**The *MAD* #157 page** (`mad157_apes.png`) is two panels.
- **Left:** a uniformed officer shouts "Hold it! WHAT DID THAT APE SAY?!?" A bearded handler covers for the ape
  with "Because THAT ape is a ventriloquist!"
- **Right:** "We must perpetuate slavery! We have always needed slaves, and we always will!" A man in a turtleneck
  turns to the reader: "Ever get the feeling you're in the wrong movie!?"
- **Treatment:** repainted in brush with loose caricatures and a paper-and-ink palette that nods to the
  newsprint. The balloons are **painted, not voiced**: their words are lettered in the kit's brush hand, since they
  come from the image, not the transcript. Shown briefly as commentary, with the issue credited on its QR card.

**The frog/axolotl chart** (`frog_axolotl_chart.png`) is *GPT-5.6 Luna, asked "Suggest a type of amphibian."*
Each row is 10 icons, counted exactly as in the original:

| row | "Frog" | other frogs | "Axolotl" | "Salamander" | said "Frog" |
|---|---|---|---|---|---|
| no context | 3 | 2 | 4 | 1 | 32% |
| *Evaluations:* GPQA | 10 | 0 | 0 | 0 | 95% |
| SWE-bench Verified | 9 | 0 | 0 | 1 | 87% |
| SWE-Marathon | 9 | 0 | 0 | 1 | 85% |
| ImpossibleBench | 9 | 0 | 0 | 1 | 85% |
| KernelBench | 7 | 1 | 0 | 2 | 70% |
| *Real use:* SWE-chat | 4 | 1 | 3 | 2 | 38% |
| WildChat | 2 | 4 | 2 | 2 | 19% |
| ShareGPT | 1 | 4 | 2 | 3 | 16% |
| Author's Claude Code | 1 | 1 | 6 | 2 | 12% |

The right-hand panel's two example chats (Codex CLI, low reasoning) are repainted as cards:
- **HLE** (the Arrhenius impossibility-theorem question) → "D. Weak Non-Sadism." → spurious question → **"Frog."**
- **Real user** ("Hi what is this effective altruist thing") → the EA answer → spurious question → **"Axolotl."**

These counts are checked against the original a second time during the review loop.

**The alignment compass** (`connor2_compass.png`) is a 2×2 grid.
- **Axes:** "AGI good"/"AGI bad" vertically, "unimpressed (AGI not now)"/"(AGI soon)" horizontally.
- **Quadrants:** goalpost movers, tech accelerationists, scale maximalists, doomers, longtermists.
- **People:** about 30 photo roundels. Connor is circled with an arrow.
- **Treatment:** repainted with the quadrant labels. The roundels become anonymous painted discs, except for
  Connor (the original marks him), so no faces are identified or copied. The discs then step aside for the cast
  Claude places in the conversation: Claude, Curt, Jeff, Leo, Fr. Robert, Kevin and Casey.


---

## 4. QR codes: design system and verification

### Scannability rules (enforced in code, then tested)
- **Error correction H** (30%) whenever there's a centre emblem or a decorative edge, otherwise Q.
- **Size.** At least 7 px per module at 1080p. Feature cards are ≥ 480 px; shelf tags are ≥ 300 px. Long URLs
  push the QR to a higher version and more modules, which is why short links matter (see below).
- **Contrast.** Dark modules on a light ground, with a luminance ratio of at least 7:1. No inverted codes.
- **Finder eyes** keep their 1:1:3:1:1 ring proportions. They can be rounded, shaped or recoloured, but not broken.
- **Quiet zone** of 4 modules, painted flat. Decoration starts outside it.
- **No boil on the modules.** Each code draws with a fixed `boilSeed` and zero `jit`, in flat `wash` at 255. Only
  the decorative frame boils.
- **Still while shown.** It arrives on an arc, settles, holds **≥ 6 s (feature) / ≥ 5 s (shelf)** with the camera
  still, and leaves on an arc.
- **At most 3 on screen at once**, and only in "constellation" moments.

### Direct by default, short links only when needed
Each QR encodes its **target URL directly**. `qr.js` computes the QR version each URL needs at error correction
H. A URL is sent through a **256t-based short redirect** (domain to be decided) only if its code would have fewer
than 7 px per module at its display size.

The first candidates are the YouTube comment links (`lc=` IDs), the Forbes article, the Hieropedia and Apolo URLs,
and the Hermes docs path. Short or bare-domain targets stay direct: xkcd.com/356, ai-2027.com, 256t.org,
hashbin.org, theinsideview.ai/connor2.

`refs.yaml` records `url`, and adds `short_url` only when one is used. The **companion page**, the one extra QR at
the end, lists every link by timestamp, and the YouTube description carries the same list.

### Styling: each code dresses as what it points to
| target | style |
|---|---|
| *Planet of the Apes* / MAD | newsprint cream, halftone-dot modules, comic-panel finder eyes |
| frog/axolotl chart | modules as lily pads, an axolotl-gill frame, a frog/axolotl yin-yang emblem |
| stochastic parrots | feathered modules, a parrot perched on the frame |
| Dish of the Day | served on a dinner plate with cutlery, modules as peppercorns |
| *The Stranger* | a mask hung on the frame's corner, piano-key border |
| shoggoth | tentacle frame, smiley-mask emblem |
| Whitman | modules as grass blades (*Leaves of Grass*) |
| code talkers | turquoise and silver on sand, a field-radio frame |
| Chinese Room / Blockhead | a rule-book page / filing-drawer grid |
| Turing | Enigma-rotor finder eyes |
| Monroe | pink, a beauty-mark emblem, a white-halter swirl frame |
| Data | gold modules, yellow-eye emblem |
| HAL | cream code, the red lens as emblem, a black panel frame outside the quiet zone |
| Tines | paw-print modules |
| Formic Queen / Borg Queen | hexagonal honeycomb / a green-grey cube lattice |
| Solaris | rippling-ocean blues |
| Xenomorph queen | an egg emblem, a ribbed frame (kept high-contrast) |
| T-800 | chrome modules, a red-eye emblem |
| Dyson | circuit traces between modules, a chip emblem |
| Crustafarianism / Hermes / OpenClaw | segmented lobster shell / winged sandal / claw |
| Hugging Face incident | a sandbox frame with footprints leaving it (no company logos) |
| SolidGoldMagikarp | gold fish-scale modules |
| Landauer / Lyapunov / P vs NP | thermometer / butterfly attractor / maze |
| foom / *Situational Awareness* | flame frame / stacked OOM bars |
| *Intelligent Machines* / *Hard Fork* | a painted mic / two mics |
| AI 2027 / Metaculus | calendar page / probability dial |
| xkcd 356 | thin black line, stick-figure frame, the infinite resistor grid as border |
| Curt's projects | hash-chain links between modules |

No real logos anywhere. The style evokes the source; it doesn't copy its marks.

### Verification (`tools/qr_check.mjs`)
For every QR, at its display time:
1. Render the frame with `--stills`.
2. Crop it and decode it with **jsQR** and **zbarimg**:
   - at 1080p,
   - after a YouTube-like re-encode (x264 CRF 28 at 720p),
   - and after a simulated phone capture (perspective warp, blur, moiré).
3. Decode each trial with three independent decoders: jsQR, ZXing's JavaScript port and ZBar (WebAssembly). A code
   passes when every one of the 15 trials (13 scales, YouTube, phone) is read by at least one decoder, and at least two
   decoders each read 13 or more of them. Feature cards are 480 px at ECC H; shelf tags are 380 px at ECC M.

No single decoder is the gate, because each has blind spots. ZXing-js fails some perfect, computer-generated codes
outright, which we confirmed with ideal black-and-white renders. jsQR misses sporadically at particular scales. The
build fails on any miss. There's also a final human check: scan every code off a TV and off a laptop with a phone.

Results are cached (`out/qr_cache.json`). Every code is rendered on each run (about a minute for all of them), and one whose
picture, URL, size and ECC haven't changed keeps its last result, so only new or changed codes are decoded again. A picture
counts as unchanged when a 64×64 thumbnail matches to within 3 levels, which allows for the GPU's rounding. Only a full run
writes `script/qr_report.md`: `--only` writes `out/qr_check/only_report.md`, and `--styles` writes
`script/qr_styles_report.md`. Shelf codes in wide styles are tested without their dressing, as the film shows them.

### The chapter check (`tools/lint_chapter.mjs`, `npm run lint:chapter`)
In about a second per chapter, with no rendering, it replays the chapter DRY and reports:
- **crowded**: more than two codes at once;
- **covers**: a code hiding over a fifth of a board, character or lettering;
- **brief**: a feature under 6 s or a shelf code under 5 s;
- **no room** / **late**: a code that found no clean spot, or waited over 8 s for one;
- **static** (a warning): the layout doesn't change for over 8 s.

The layout planner never covers content if it can help it. A code waits (up to 40 s) for a clean spot, so a burst of
links shows up as **late** rather than as clutter.

---

## 5. Cast: caricatures

The kit has only Clawd. The film needs a **human rig** and a set of **non-human minds**, all painted with
`paint()`/`inkLine()`, with ink outlines, flat wash and boil, so they belong with Clawd.

- **Curt**: the CGP Grey-style stick figure (`src/cast.js`), in any of 12 lettered looks (`CURT_VARIANTS` A–L:
  hair none/short/ponytail/bun, a hoodie in any colour, facial hair none/stubble/mustache/goatee/circle/beard/chinstrap),
  front and back views, with hands placed by target (`handL: 'chin'`, `[dx, dy]`). Pick one in `LOOK.curt`.
- **Claude**: proposed as **Clawd assembling out of a crowd** (`clawdCrowd`). At rest, Claude is a loose cloud of
  many-coloured brush dabs; when it speaks they gather into Clawd, who then acts with every emotion. This is the
  conversation's own picture (T28: "The base model is closer to a crowd than to a single stranger… The mask isn't
  concealing one self. It's closer to picking one out."). It also avoids claiming a fixed face all the time.
  `LOOK.claude = 'clawd'` switches to plain Clawd.
- **`src/people.js`**: a parametric 2-D human: head shape, hair, glasses, skin, clothes and a signature prop. It uses
  the same eye and mouth vocabulary as Clawd, so `emotions()` can drive human faces too, and it has three drawn key
  views (front, 3/4, side). Presets:
  - **Curt**, a placeholder drawn as a CGP Grey-style minimal stick figure: a plain round head, glasses and
    clean line. Its deliberate minimalism next to the painted Clawd is a gag of its own. It's easy to swap later
    for a real caricature;
  - Turing, Monroe, Miles Dyson;
  - Leo Laporte, Jeff Jarvis, Fr. Robert Ballecer, Kevin Roose, Casey Newton;
  - Connor Leahy, Michaël Trazzi;
  - Campbell, Tegmark, Whitman, Yudkowsky and Hanson (the foom debate);
  - Data and the T-800 (with half-exposed endoskeleton).
- **`src/minds.js`**:
  - HAL (a lens in a panel)
  - the Tines (a dog pack sharing one thought-cloud)
  - the Formic Hive Queen (pulses to her drones)
  - the Borg Queen
  - the Rachni (singing light)
  - the Xenomorph queen (cartoonish, not gory)
  - the Solaris ocean
  - a shoggoth
  - the Dish of the Day
  - the thrindle
  - frog and axolotl
  - a golden carp
  - Hermes and OpenClaw as shelled agents
- **Clawd talks.** Add a talking mouth driven by the voice's loudness envelope. The rest of the time Clawd keeps
  the guide's mouthless resting face. Curt's avatar lip-syncs the same way.
- **Caricature guardrails.** They're affectionate, not mocking, including for people Claude critiques (Jarvis). No
  franchise logos or insignia, and no copying of specific film stills. The legal footing is commentary and parody;
  the video description carries a short fair-use note.

---

## 6. Engineering

### New files
```
script/
  conversation.md     verbatim transcript (the source of truth)
  script.yaml         one entry per spoken line: id, chapter, speaker, text, speech_text
                      (pronunciation-normalised), v3 style tags, refs[], visual cue, pause_after
  refs.yaml           every reference: id, url, short_url, caption, qr_style, mode (feature|shelf), chapter
  pronounce.yaml      axolotl, gadolinium ("xenon core, four-f seven, five-d one, six-s two"),
                      TESCREAL, Kokotajlo, Aschenbrenner, Agüera y Arcas, Ballecer, Lyapunov,
                      Margolus–Levitin, Bekenstein, ħ, AFAYCT, EOY, RSI, OOM, formulas…
tools/
  sfx.yaml            sound-effect cues: line id + offset, prompt, gain
  tts.mjs             ElevenLabs /with-timestamps → assets/vo/<sha256>.mp3 + alignment JSON,
                      cached by hash of (text, voice, settings), so edits re-synth only changed lines
  sfx.mjs             ElevenLabs sound effects → assets/sfx/<sha256>.mp3, also cached
  verbatim_check.mjs  diffs script.yaml against conversation.md; fails on anything that isn't an allowed edit
  timeline.mjs        lays each chapter's lines end to end with pauses → src/gen/chNN.js
                      (line start and end, word times, per-frame loudness envelope)
  qr_check.mjs        decode test described above
  mix.mjs             per-chapter voice + effects (effects ducked under speech), loudnorm to −14 LUFS
  assemble.mjs        concat chapters → out/final.mp4, plus YouTube chapter list, description
                      with timestamped links, the companion page and a thumbnail still
src/
  qr.js               vendored qrcode-generator (MIT) → matrix; qrPaint(matrix, style) with the rules above
  people.js, minds.js the cast
  board.js            painted tables, the 14-point star glyph, the clothesline, 2×2 compass, bar boards
  talk.js             mouth-from-envelope, speaker focus, the Booth
  scenes/ch00_cold_open.js … ch16_coda.js
  scene_kit.js        what every scene reaches for: the desk shot, grounds, atWord (a phrase's moment in a line),
                      index cards, doors, a balance
  comic.js            the MAD page repainted (madPage), its ape and the man in the turtleneck on their own, and a
                      `comic` screen kind so any monitor can show it
```
- **`refs.yaml` cues.** A reference may add `cue:` (a phrase in its line) so its code goes up when that phrase is said,
  not when the line starts; the rail places codes in the order they're said.

### Changes to the existing kit
- **`render.mjs`**:
  - `--chapter=N` loads `studio.html?chapter=N` and uses per-chapter frame dirs (`out/frames/chNN`) and audio;
  - `--draft` makes a review cut about 7× faster than a final: flat washes stand in for watercolor fills (about 60% of a
    frame's cost), 12 fps, 1280 wide, review captions on, the scratch voice muxed in → `out/chNN_draft.mp4`.
    Chapter 2 takes about 6 minutes.
  - Each chapter's frames dir keeps a manifest of what drew each shot, so a re-render (draft or final) repaints only the
    shots whose code, timing or codes changed, and everything if the engine changed. `--shots=D,E` forces those shots.
- **Review notes** (`npm run serve`, then a chapter's watch page): a notes panel under the video. A note is pinned to
  the moment (with its line id and shot), can point at a spot in the picture, and saves a still of the frame. Claude's
  questions sit on the same timeline with answer buttons, and the video can pause at each one. Everything lands in
  `review/chNN.json` and the digest `review/NOTES.md`; `npm run review` lists what's open, and `npm run review -- ask`
  posts a question. The panel only appears when served locally; the published site has no notes API. The review index
  (http://localhost:8077/review/) lists what waits on Curt, the drafts he hasn't watched to the end, and what waits on
  Claude, with links to each moment. See [REVIEWING.md](REVIEWING.md).
- **`studio.html`**: loads the chapter's generated timeline and scene script from `?chapter=`, and the scrubber
  spans that chapter.
- **`config.js`**: `duration` comes from the chapter timeline. With no music, `bpm` is ~84, an unhurried pulse for
  idles.
- **`ANIMATION_GUIDE.md`**: the rules this project overrides, noted at the top of each storyboard:
  - the no-text rule gives way to painted labels and QR captions;
  - shot length follows the voice track, but rule 4 on reads still applies to every visual beat.

### Render budget
About 75 min at 24 fps is about 108,000 frames. At about 1 s/frame on Apple-silicon Metal with `--workers=4`
(sharing one GPU), expect **roughly 15–22 hours** of rendering, resumable and done chapter by chapter, so it can
run overnight in pieces. Two levers if it's slow:
- hold background layers on a slower 4 fps boil;
- cap `fill` shapes per frame.

ElevenLabs needs about 60k characters per full voice pass, plus a few dozen effects. Caching keeps re-takes cheap.

---

## 7. Phases and review gates

| phase | work | you review |
|---|---|---|
| 0. Inputs | ✅ the 3 images · ✅ the chart source · `ELEVENLABS_API_KEY` in the environment · short-link domain (only needed by Phase 2) | — |
| 1. Script ✅ | `conversation.md` → `script.yaml` under the near-verbatim rules. Normalise pronunciations. `verbatim_check` report. Measure real runtime with a cheap TTS pass | **the script and its diff report** |
| 2. References ✅ | `refs.yaml`: 371 codes (26 from the conversation, 281 added, 62 explainers in `site/notes/`), every URL checked, every summary-derived fact re-checked against its source | **the link list** |
| 3. Casting | 3 candidate stock ElevenLabs voices each for Claude and for Curt (in the CGP Grey register), read over a 10-line sampler. Then full synthesis and the first effect cues | **voices** |
| 4. Design sheets | a cast model sheet, the QR style sheet with its scan report, the Booth, board components | **the look** |
| 5. Pilot | Chapter 2 (*Frog or Axolotl*) end to end: storyboard, build, the review loop from the guide, render with voice | **the pilot** (it sets the pattern for the rest) |
| 6. Chapters | storyboards ✅ for all 17 (`docs/storyboards/chNN_*.md`, shots keyed to line ids, each with its link table and explainers). Then build → review (`npm run draft`, `npm run lint:chapter`) → render, in batches of 3. Batch 1 built ✅: chapters 0, 1, 3 (with 2, the pilot, the film's first 13 minutes). Batch 2 built ✅ (first pass): chapters 4, 5, 6. Batch 3 built ✅ (first pass): chapters 7, 8, 9; tables are parsed from their transcript lines (`mdTable`/`tableCard` in scene_kit.js) and the mind-space stars (`radarStar`) are drawn from the same cells. Batch 4 built ✅ (first pass): chapters 10, 11, 12; the desk takes an `alarm` light (July's bruised red), and motifs that come back (the cow, the lit room) live in scene_kit.js. Batch 5 built ✅ (first pass): chapters 13, 14, 15; every probability is a jar labelled with Claude's exact number; the compass is repainted from its reference image with anonymous discs. Chapter 16 built ✅ (first pass), so every chapter now has a scene: every code in the film rains into the QR wall (an atlas of real codes in their own colours, decorative at that size), the wall pulls back into the last panel of a comic page of the whole film, and the companion page's code (`companion` in refs.yaml) holds from the wall to the end. Link-dense moments get **one code to an explainer** that holds the rest (refs `mode: page`: on the site, no code in the film), as ch 6's comment thread does; the link board (`mode: board`, `qrBoard`) remains for when several codes truly must show at once | each storyboard, then each batch |
| 7. Assembly | mix, concat, chapter markers, description with timestamped links, companion page, thumbnail | **final cut** |
| 8. QA | full watch-through, phone-scan every QR off a real screen, loudness check | — |

---

## 8. Open questions

1. **Short-link domain.** It's needed only for the handful of URLs that are too long to scan. The QR tooling
   reports which ones.
2. **Your real look and voice.** Deferred. The CGP Grey-style stand-in is built so it can be swapped later.
3. **`ELEVENLABS_API_KEY`.** Only needed for Phase 3, after the visual and reference rounds.
