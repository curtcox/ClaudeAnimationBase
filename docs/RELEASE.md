# Releasing Frog or Axolotl

How the film and its companion site get from this repo to the world. Each goal below is met by code in the repo; the
commands are the whole procedure.

## 1. One command from a fresh clone

```bash
git clone https://github.com/curtcox/axol-f && cd axol-f && npm start
```

`npm start` ([tools/start.mjs](../tools/start.mjs)):

1. Checks for what's needed and says how to get anything missing: Node 20 or newer, Google Chrome, and ffmpeg. On a
   The voices come with the repo, so no ElevenLabs key is needed.
2. Installs the packages (`npm ci`), only when they're missing or out of date.
3. Builds the companion site, serves it at http://localhost:8077/ and opens your browser. **This takes seconds.** The
   site is complete except for the film.
4. Makes the film ([tools/rebuild.mjs](../tools/rebuild.mjs)). It runs the script and its word-for-word check, the
   voice track and every chapter's draft. Then it joins the chapters into the whole film
   ([tools/assemble.mjs](../tools/assemble.mjs)).
   - While it runs, every page shows a progress line.
   - Each chapter appears on the site as it's finished. The film page comes last, at http://localhost:8077/film/.
   - **About an hour or two the first time.**

Options: `--site-only` stops after step 3, `--chapters=2,5` draws just those chapters, `--final` makes final-quality
renders (many hours), and `--no-open` skips opening the browser.

## 2. The stages, fastest first

| stage | what you get | how long | command |
|---|---|---|---|
| local site | every link and explainer, on this computer | seconds | `npm start -- --site-only` |
| published site | the same, at the site's address, on every push to main | ~1 min after a push | automatic ([pages.yml](../.github/workflows/pages.yml)) |
| local film | drafts of all 17 chapters, joined, with links in step | 1–2 h first time, then minutes | `npm start` |
| published preview | the local cut, playable on the published site | upload time | `npm run preview:publish` (optional) |
| real voices | ElevenLabs voices for every line (`script/voices.yaml`) | ~15 min for the whole script; only changed lines after | `node tools/voice.mjs` (the rebuild runs it) |
| sound | the 63 sound cues, made and mixed | needs the key; not built yet | `sfx.mjs`, `mix.mjs` (planned) |
| final cut | 1080p, 24 fps, the whole film, plus YouTube's text | 15–22 h, resumable | `npm start -- --final` |
| on YouTube | the film, embedded on the published site | upload time | by hand (§5) |

**What the site's film page plays.** Built on this computer, it plays the newest local cut (`out/film/film.mp4`).
Published, it plays the first of these that's set in [script/site.yaml](../script/site.yaml):
- `film.youtube`: YouTube's player, from its privacy-enhanced domain.
- `film.preview`: a video file, such as the preview on the repo's releases page.
- Neither set: the page says the film is on its way and how to make it from the repo.

In every case the links follow the film as it plays. Every time on the site links into the film at that moment.

## 3. Iterating: what's cached

Nothing expensive is made twice. A re-run after a small change redoes only what the change touched.

| step | kept until | cost when nothing changed |
|---|---|---|
| packages | `package-lock.json` changes | none |
| voice clips (ElevenLabs) | a line's words, voice or model change (`assets/vo/`, by hash, committed) | about a minute to re-mix |
| a chapter's voice track | its mix changes (it's rewritten only then) | none |
| a chapter's frames | that shot's code, timing or codes change (a per-shot manifest) | seconds |
| a chapter's video | a frame or its voice is newer, or its length changed | under a second |
| the whole film | any chapter's video is newer | under a second (a join takes 2 s) |
| the site | never cached; it's fast | about 1 s (videos are copy-on-write clones) |
| the QR scan check | a code's picture, URL, size or ECC changes (`out/qr_cache.json`) | about a minute |

The usual loops:
- **A scene changed:** `npm run rebuild -- --chapters=N`. Only that chapter's changed shots are repainted, then the
  film is joined again and the site updated.
- **Links or explainers changed:** `npm run site` (seconds). Push, and the published site follows.
- **Everything, overnight:** `npm run rebuild`, as before.

A re-run of one chapter with nothing changed takes about 25 s; each changed shot adds its repaint.

## 4. Publishing the site

[.github/workflows/pages.yml](../.github/workflows/pages.yml) builds the site from a clean checkout on every push to
main and publishes it to GitHub Pages. It needs no Chrome, ffmpeg or voices, because the timings it needs are
committed (`src/gen/`). It first checks the references against the script, and fails the publish if one is broken.

It needs one-time setup (Curt):
1. **Where the site lives.** Every code in the film points at `https://curtcox.github.io/axol-f/`, so the repo is
   named `axol-f` (renamed from ClaudeAnimationBase on 2026-09-28). The workflow warns if the two ever differ.
2. **Settings → Pages → Source: GitHub Actions.**
3. **Push.** (I'm not authorized to.)

## 5. YouTube

**For now, upload by hand:**
1. `npm start -- --final` makes `out/film/film.mp4` and `out/film/youtube.md`. The latter holds the title, the
   description (with chapter markers and the site's address, checked against YouTube's rules and 5,000-character limit)
   and tags.
2. Upload `film.mp4` on YouTube Studio and paste those in. Add the thumbnail (not made yet).
3. Put the video's id in `script/site.yaml` as `film: youtube:`, commit and push. The published site then embeds it.

**Possible automation later** (not easy enough to do now):
- **Upload:** a `tools/youtube_upload.mjs` using the YouTube Data API's resumable `videos.insert`, with `thumbnails.set`
  for the thumbnail. It would then write the id into `site.yaml` itself.
- **Credentials:** an OAuth "desktop app" client, with its token kept outside the repo.
- **Blocker:** videos uploaded through an **unaudited** API project are locked to private until Google audits the
  project, so the first public release is simpler by hand.
- **Quota:** an upload costs about 1,600 of the default 10,000 daily units, so quota isn't a problem.
- **Captions:** could be uploaded the same way (`captions.insert`) from the script's timings.
