# What's left

As of 2026-09-29. The phases are in VIDEO_PLAN.md §7. Your review notes and my replies are at
http://localhost:8077/review/ (`npm run review` lists them).

## Waiting on Curt
- [ ] Check the seven notes I fixed, on the new drafts, and mark each resolved: ch 3 (music fades), ch 6 (cards
      tiled and a full-width caption; the ball drop on the hit), ch 7 ("axes"), ch 12 ("AIs"), ch 13 ("as far as you
      can tell"), ch 14 (the roads, and the page of people making the same argument).
- [ ] Push the site workflow update (actions on Node 24). Then I check that the deploy runs clean.
- [ ] Look at the thumbnail, [docs/thumbnail.jpg](thumbnail.jpg): keep it, or say what to change.
- [ ] Optional, until the film is on YouTube: `npm run preview:publish` puts the latest cut on the releases page and
      points the published site at it.

## Next for me
- [ ] The final render: a candidate started 2026-09-29, before the notes were signed off (`npm run rebuild -- --final`;
      1080p, 24 fps, 15–22 hours, resumable). It writes `out/chNN.mp4`, `out/film/film.mp4` and `out/film/youtube.md`.
      Each chapter's frames are deleted once its video is made (the disk can't hold the film's 77 GB), so a chapter a
      note changes is repainted whole (up to about 2 hours).

## After the final render
- [ ] Curt: a full watch-through of the final cut.
- [ ] Curt: scan a few codes with a phone, off a real screen.
- [ ] Upload (docs/RELEASE.md §5): the film, the title, description and tags from `out/film/youtube.md`, and
      `docs/thumbnail.jpg`. Then put the video's id in `script/site.yaml` as `film: youtube:` and push; the site
      embeds it.

## Done
- The script, word for word from the conversation, with every reference as a code (408, all scanning) and 64
  plain-language explainers on the companion site, published at https://curtcox.github.io/axol-f/.
- Codes point at the site's own forwarding pages when those are shorter than the direct link; no short-link domain.
- Every chapter drawn, voiced and mixed: your clone "Curt Cox 2", River for Claude, a voice of its own for each
  cold-open part (all confirmed by ear), the sounds and the film's music under the voice, and every name's
  pronunciation checked (the names page; Metaculus and Ballecer approved by ear).
- Your look: H, greying, glasses, the hoodie (only you wear one; everyone else has clothes of their own).
- You've watched every chapter's draft, and every note but the seven above is resolved.
- The YouTube description: `out/film/youtube.md` (the conversation, the site, the repo, chapter markers, and the 46
  most important links by time).
- The loudness: joining the film brings it to −14 LUFS (YouTube's level) with peaks under −1 dBFS, and checks it
  (it was −18.8 with peaks at 0).
- The thumbnail: `npm run thumbnail` → `docs/thumbnail.jpg`, painted by the film's own code.
- Both conversations on the site, formatted and as plain text: the one the film shows, and the one that made it
  (`making-of/`, refreshed by each rebuild).
- The release plan in code: `npm start` from a fresh clone, the Pages workflow, the caches (docs/RELEASE.md).
- Blind reads for chapter 9 (the reads tool and a key for every chapter are in the repo).

## Dropped
- The blind reads for the other chapters, and the storyboards' "Reads to check": skipped (Curt, 2026-09-29).
