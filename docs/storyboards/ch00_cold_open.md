# Storyboard 0: Cold open

One block, T01.U.00 (the attached image), with a 20 s hold for the comic and the title. About 0:27 on estimated timing.
Nothing is voiced: the page's balloons are **painted, not voiced** (they're in the image, not the transcript).

**Logline.** Before anyone speaks, the viewer reads the page Curt is about to show Claude: a 1973 *MAD* gag about
an ape who can't be allowed to have said what he said.

**World.** No desk yet. The frame is the comic page itself, repainted in brush over the kit's paper, on newsprint
tones. A projector clatter starts under it, as if the page were being shown on an old screen.

**Palette.** Newsprint cream (`#EFE6CF`), ink black, one halftone red (`#C9302C`) for the officer's shout, faded
cyan for the sky. The ape in warm browns. Everything slightly off-register, like cheap colour printing.

**Motif set-up.** The *ventriloquist*. The handler's hand, and the ape's sheepish look, are the first image of "who's
doing the talking?", which returns in ch 4 and closes the film.

**Text.** Only the page's own words: all ten balloons, in full, with the page's line breaks and bold words, lettered in
the kit's brush hand (src/comic.js). Then the title, *Frog or Axolotl*.

**Timing.** The balloons come in reading order. Each letters in at 10 words/s, and the next waits until it could be read
at about 210 words a minute (src/scenes/ch00_cold_open.js computes the shots' times from the word counts), so the cold
open runs about a minute.

## Shots

| shot | lines | transition in | what's seen · the event · camera |
|---|---|---|---|
| **A** | T01.U.00 (0–20 s) | fade up from black on the projector clatter | **The left panel.** Its six balloons pop in along their chain: the officer (red) and the handler argue, ending on "Because THAT ape is a ventriloquist!" The ape's eyes slide sideways. Loose caricatures, no likenesses. |
| **B** | 20–44 s | a slow pan right across the gutter | **The right panel.** "We suspect…", "It's not true!…", then the villain's balloon letters in word by word. The man in the turtleneck turns to *us*; his balloon, "Ever get the feeling you're in the wrong movie!?", lands on the film-reel runout sound. |
| **C** | 44–54 s | pull back | **The whole page**, both panels, held so it can be read. **Feature QR: mad157** (fold-in style: the code folds in from the page's edges, then holds ≥ 6 s). |
| **D** | 54–60 s | the page slides onto a monitor | **Title.** The page shrinks onto the main monitor of the Desk (its first appearance, from behind Curt's shoulder), and *Frog or Axolotl* is painted across the top of the frame. Brush wipe into ch 1. |

## Links

| where | code | kind |
|---|---|---|
| C | mad157: *MAD* #157, March 1973 ("The Milking of The Planet That Went Ape", Arnie Kogen and Mort Drucker) | feature, attachment (code only, never voiced) |

## Reads to check
- **A/B:** each balloon on screen long enough to read at about 210 words a minute (the viewer reads; nobody voices them).
- **C:** the full page holds at least 6 s with its code, the camera still.
- **D:** the title is the only lettering not from the page.
