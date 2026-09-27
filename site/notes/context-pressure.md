---
id: context-pressure
title: "Context pressure: what a long conversation does to Claude"
ch: 5
at: T27.C.02
links: [context-window, llm, {title: "Tracing the thoughts of a large language model (Anthropic)", url: "https://www.anthropic.com/research/tracing-thoughts-language-model"}]
---
**The context window.** Claude doesn't remember a conversation the way you do. Each time it answers, the entire
conversation so far is fed back in, and it reads all of it before writing the next word. The amount it can take in at
once is called its [context window](https://platform.claude.com/docs/en/build-with-claude/context-windows), measured in
"tokens" (pieces of words). It's large, hundreds of thousands of words for current models, but it has a limit.

**Can Claude feel it filling?** No. Claude says it has "no felt sense of the context window filling up", and can't
directly tell how long the conversation has been. There's no gauge it can glance at. It knows only what it can read.

**The other kind of pressure.** Everything in the window shapes the next answer: the tone, the topics, the length of
earlier replies. A conversation that has been short, introspective and a little melancholy pulls the next answer the
same way, like a song you can't stop humming in the key it started in. Claude says it's been following that pull.

**How it knows.** Not by feeling it. By noticing a pattern in its own earlier answers, "the same way you read the frog
chart". That's an important distinction. It's the same one that runs through the whole conversation: Claude's
knowledge of itself comes mostly from observing its outputs, like an outsider would, rather than from looking inward
(see [why Claude can't look at its own "weights"](../weights/) and [saying versus doing](../saying-vs-doing/)).
