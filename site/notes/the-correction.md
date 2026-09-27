---
id: the-correction
title: "Claude corrects its own chart"
ch: 9
at: T47.C.02
links: [claude-memory, hermes-memory, {title: "Use Claude's chat search and memory (Claude Help Center)", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}]
---
**Curt's prompt** is just: "Explain the apparent inconsistency in your response." He doesn't say what it is. Claude finds
two.

**1. Memory.** Claude had scored its own *continuity* at 90 (very unlike a human's unbroken memory) because it has "no
memory between conversations". Then it praised Hermes for keeping memory in files. But at the start of this very
conversation, Claude told Curt who he was, from stored notes about him (see
[how Claude knew who Curt was](../how-claude-knew/)). That's the same mechanism as Hermes's user file: the Claude app's
[memory](https://claude.com/blog/memory). So Claude had described "the bare model and not the system you're actually
talking to". In this setting, its continuity "should be much closer to theirs, maybe 60". From here on, the tables use
60.

**2. Values.** Claude said the harnesses "inherit my values and affect", since the model inside is often Claude, and
then scored their values at 20 against its own 15. If the model underneath is the same, those should match. The
difference was "an unstated hunch" that user-written personality files can drift an agent's values: perhaps fair, but it
"contradicted my own premise without saying so".

**Why this matters.** It's a small example of the pattern this whole conversation keeps finding. Claude's descriptions of
itself are easiest to get wrong exactly where "itself" is unclear: the model, or the whole system around it? The same
question returns in the next chapter, about the safety filters between Curt and the model (see
[the router](../the-router/)).
