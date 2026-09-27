# Reviewing drafts

How to watch the chapters, leave notes, and answer Claude's questions. All of it runs on this computer only. The
published companion site has the watch pages but none of the review parts.

## Start

```bash
npm run serve
```

Then open **http://localhost:8077/review/**, the review index. Every page the server shows also has a **Review index**
button in the bottom-right corner.

## Rebuild everything (overnight)

```bash
npm run rebuild
```

This regenerates everything on this computer for watching and reviewing, and needs no one to watch it:
- the script;
- the scratch voice and timings;
- every chapter's draft video and watch page;
- the companion site;
- the checks.

At the end it starts the review server if it isn't already running. It keeps the Mac awake while it runs, carries on
past a failed step (retrying renders once), and won't start a second time while one is running.

Drafts only repaint what changed, so a night with few changes finishes much sooner. Afterwards, the review index says
when the last rebuild finished and names any step that failed. The full output is in `out/rebuild/<date>_<time>.log`.

- `npm run rebuild -- --chapters=2,5` rebuilds only those chapters' drafts.
- `--qr` also proves every painted code scans (slow).
- `--no-serve` leaves the server alone.

## The review index: what needs you

The index updates by itself every 15 seconds and whenever you come back to its tab. It has four parts:

1. **Questions and replies waiting on you.** These are Claude's questions you haven't answered, and your notes where
   Claude has replied since. You can answer here:
   - click an answer button, or write a reply;
   - mark one of your own notes resolved.
   To see the moment first, click its time (**at 3:49 ▶**). The watch page opens there with the note outlined in blue.
2. **New drafts you haven't watched to the end.** Each chapter's latest draft, how long ago it was made, and how much
   of it you've played. **carry on from 2:10 ▶** resumes where you stopped. A new draft of a chapter starts it over.
3. **Waiting on Claude.** These are your notes and answers Claude hasn't followed up yet. There is nothing to do here.
4. **Every chapter.** Each chapter's length and note counts, with links to its watch page and its links page.

## A watch page: watch and leave notes

`/watch/chNN.html` shows the chapter's video with its links listed alongside. A link lights up while its code is on
screen.

Under the video is the notes panel:

- **Write a note.** Typing pauses the video and pins the note to that moment, along with the line being spoken and the
  shot. You can also tick "about the whole chapter" instead.
- **📍 Point at something.** Click this, then click the picture to circle a spot. A still of the frame is saved with the
  note.
- **The strip above the notes** marks every note on the timeline: Claude's in red, yours in blue, resolved ones in grey.
  Click a mark to jump there.
- **Claude's questions** have answer buttons. With "pause the video at Claude's questions" ticked, the video stops at
  each open question.
- Each note has **reply**, **resolve** and (for your own notes) **delete**.

The page remembers which parts of the draft you've played, for the index. Only stretches you actually play count;
jumping ahead doesn't mark the skipped part as watched.

Links from the index use `#n=<note id>` to open at a note, and `#t=<seconds>` to open at a moment.

## Where it's kept

| file | what | committed |
|---|---|---|
| `review/chNN.json` | each chapter's notes, questions and replies | yes |
| `review/frames/` | the stills saved with notes | yes |
| `review/NOTES.md` | a readable digest of every note, rewritten on each change (don't edit) | yes |
| `review/seen.json` | how much of each draft you've played; it follows this computer's renders | no |

## For Claude: the other side

- `npm run review` lists every open note and who it waits on; `--all` includes resolved ones.
- `npm run review -- ask --chapter=N --at=LINE_ID [--dt=s] "question" --options="A|B|C"` asks a question at a line.
  Use `--t=seconds` for a moment, or neither for the whole chapter.
- `npm run review -- reply|resolve|reopen --chapter=N --id=ID ["text"]` answers or closes a note.
- `npm run rebuild` ([tools/rebuild.mjs](tools/rebuild.mjs)) regenerates everything; see "Rebuild everything" above.
- After a new render, run `node tools/watch.mjs --chapter=N`. It updates the watch page (and rebuilds the site), and
  the index then shows the new draft as unwatched.

The code:

| file | what it does |
|---|---|
| [tools/serve.mjs](tools/serve.mjs) | the server and its `/api/notes`, `/api/seen`, `/api/review` and `/api/rebuild` |
| [tools/review_lib.mjs](tools/review_lib.mjs) | storage, who a note waits on, and the overview behind the index |
| [tools/review_page.mjs](tools/review_page.mjs) | the index page |
| [tools/build_site.mjs](tools/build_site.mjs) | builds the watch pages (`watchPage`); their notes panel appears only when `/api/notes` answers |
