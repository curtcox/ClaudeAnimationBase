---
id: tokens
title: "Tokens: why Claude sees typos but struggles to count letters"
ch: 12
at: T57.C.03
links: [tokenizers, bpe, solidgoldmagikarp, glitch-token, magikarp]
---
**Claude doesn't read letters.** Before any text reaches a model like Claude, it's chopped into pieces called *tokens*:
common words become one piece ("the", "morning"), rarer words become several ("ax", "olotl"). The model only ever sees
the pieces, as numbers. The chopping rules are learned from lots of text, commonly by a method called
[byte-pair encoding](https://en.wikipedia.org/wiki/Byte-pair_encoding) ([a friendly walkthrough](https://huggingface.co/learn/llm-course/chapter2/4)).

**So spotting typos is easy.** A misspelled word breaks into unusual pieces, and odd pieces in a familiar sentence stand
out, "like noticing a wrong note in a song you know without reading the sheet music". That's how Claude noticed that
Curt wrote "Magicarp", when the Pokémon is [Magikarp](https://en.wikipedia.org/wiki/Magikarp), with a k.

**And counting letters is hard.** Ask "how many r's are in *strawberry*?" and a model sees perhaps three chunks, not ten
letters. It learned what's inside each chunk only indirectly, and counting needs letter-by-letter bookkeeping across the
chunks. For years chatbots famously got this wrong. Claude's comparison: "counting the e's in a word you only ever saw
as a whole shape". Newer models do better, partly by spelling the word out first and then counting.

**SolidGoldMagikarp was something else.** In 2023, researchers found that asking GPT-3 to repeat certain strange words,
such as " SolidGoldMagikarp", produced evasions, insults or nonsense ([the original post](https://www.lesswrong.com/posts/aPeJE8bSo6rAFoLqg/solidgoldmagikarp-plus-prompt-generation)).
The cause: the word-chopping rules had been built from text where those strings were common (some were Reddit
usernames), so each got its own token, but the model itself almost never saw them in training. It had a token with
essentially no meaning attached, a "ghost word". These are now called [glitch tokens](https://en.wikipedia.org/wiki/Glitch_token).
Not a spelling problem at all: a gap in the dictionary's filing.
