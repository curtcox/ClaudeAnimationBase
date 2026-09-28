# What's left

As of 2026-09-27. The phases are in VIDEO_PLAN.md §7.

## Waiting on Curt
- [ ] Review the drafts of the chapters you haven't reviewed yet: 3, 5, 7, 8, 9, 10, 13, 15, 16 (all first passes). Chapters 1 and 11 were only partly watched.
- [ ] Look at chapter 11's window and pose, and mark note `nmuk38hcdbc` resolved if it works.
- [ ] Put `ELEVENLABS_API_KEY` in the environment (needed for real voices).
- [x] Publish the companion site (docs/RELEASE.md §4): repo renamed to `axol-f`, Pages from GitHub Actions; it republishes on every push to main.
- [ ] Optional, until the film is on YouTube: `npm run preview:publish` puts the latest cut on the releases page and points the published site at it.
- [ ] Decide whether your real look replaces the stand-in (deferred so far).

## Next for me
- [x] Redraw every chapter with the borrowed-line codes, the caricature pass and the layout fix (rebuild of 2026-09-27, all steps passed).
- [x] Check the rebuild's log for failed steps.
- [ ] Check the storyboards' "Reads to check" items, 2–4 per chapter, against the drafts.
- [x] Dress the 47 code styles that were showing plain (mic, blueprint, two-mics, door, compass, honeycomb, lobster-shell and others): made with Still QR through the ChatGPT app, and drawn by the film from `assets/qr/`. All 117 codes pass the film's scan check.
- [ ] Redraw the chapters with the new codes (`npm run rebuild`).
- [x] Do a careful pass on the comic page's caricatures in the cold open.
- [x] A blind-read check (`npm run reads -- --chapter=N`, key in `docs/reads/`): chapter 9 done, 4 frames flagged and 10 worth a look.
- [x] Fix chapter 9's flagged reads: none flagged and 5 worth a look (down from 6 and 9 under the stricter test). The lobster-shell code was redrawn in Still QR as a whole lobster. One of the 5 is chapter 9's figure for Curt, which readers doubt is a man; it waits on your decision about your look.
- [x] Write read keys for the other chapters: 437 reads across all 17 chapters (`--check` validates a key without rendering).
- [ ] Run the blind reads for chapters 0–8 and 10–16, and fix what they flag.

## Voices (phase 3)
- [x] The casting sampler (`node tools/voice_sampler.mjs`, http://localhost:8077/voices/): Curt chose his clone "Curt Cox 2"; Claude is River (`script/voices.yaml`).
- [ ] Curt: confirm River for Claude by ear, or pick Eric or Matilda.
- [ ] Once you choose, voice everything, then re-time and redraw every chapter.
- [x] Place the sound-effect cues: 63 in `script/sfx.yaml` (stings, props' sounds, a few quiet ambient beds), plus a paper flick per code and a page rustle per search. `npm run sfx` checks them and writes the cue sheet, `script/sfx_report.md`.
- [ ] Generate the sounds with ElevenLabs (needs the key) and mix them into the drafts.

## Assembly (phase 7)
- [ ] Mix the voices and effects.
- [x] Join the chapters into one film, with chapter markers: `npm run film` (seconds), or `npm start`, which also plays it on the site with every link in step.
- [x] Write the video description: `out/film/youtube.md`, with chapter markers and the site's address (the timestamped links live on the site; YouTube's 5,000 characters can't hold 400).
- [x] The release plan, in code: `npm start` from a fresh clone, the Pages workflow, and the caches (docs/RELEASE.md).
- [ ] Make the thumbnail.
- [ ] Final-quality render.

## QA (phase 8)
- [ ] A full watch-through.
- [ ] Scan every code with a phone, off a real screen.
- [ ] Check loudness.
