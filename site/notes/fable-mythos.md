---
id: fable-mythos
title: "Fable, Mythos, and a correction to the correction"
ch: 10
at: T50.C.04
links: [fable-mythos-5-1, rsp, switch-models, {title: "Claude Fable 5 and Claude Mythos 5 (Anthropic, June 2026)", url: "https://www.anthropic.com/news/claude-fable-5-mythos-5"}, {title: "Claude Mythos (Wikipedia)", url: "https://en.wikipedia.org/wiki/Claude_Mythos"}]
---
**What Claude said.** Curt had mentioned warnings and being "swapped out". Claude corrects itself: it doesn't "actually
know of automatic model swapping mid-conversation". You can [switch models yourself](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings),
and some models "ship with extra safeguards. Claude Fable, for example, is the same model as Mythos with added
protections around bio, cyber, and AI research. That's a fixed layer, not a live swap."

**What Anthropic's announcements say.** Anthropic released [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)
in June 2026: the same underlying model, told apart by their safeguards (*fabula* and *mythos* both mean, roughly, "a
story"). Mythos, without some of the safeguards, went only to vetted security and biomedical researchers. Fable, for
everyone, has safeguards covering **cybersecurity**, **biology and chemistry**, and **distillation** (copying a model's
abilities by training another model on its answers). And when they trigger, the announcement says, some responses
"will receive a response from our next-most-capable model, Claude Opus 4.8". The
[5.1 versions](https://www.anthropic.com/claude-fable-and-mythos-5-1) (September 2026) still direct certain
cybersecurity and life-sciences requests to Anthropic's Opus models.

**So the correction needed correcting.** By Anthropic's own account, a kind of automatic model swapping does exist:
certain requests to Fable are answered by a different model. And the safeguards' domains, as published, are cyber,
bio/chem and distillation, not "AI research". Claude was right that it had overstated what it knew. It was wrong that
there is no swap.

**Why this is the most useful mistake in the film.** Curt's next question is "How do you know that stuff?", and Claude's
answer is: from instructions, "not from introspection". It can't see its own plumbing, so its account can be out of
date or simplified, as this one was (see [testimony, not observation](../testimony/)). Anthropic publishes the rules
behind these safeguards in its [Responsible Scaling Policy](https://www.anthropic.com/responsible-scaling-policy).
