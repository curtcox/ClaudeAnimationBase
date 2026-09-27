---
id: testimony
title: "Testimony, not observation"
ch: 10
at: T51.C.02
links: [testimony, system-prompts, introspection, {title: "Emergent introspective awareness in large language models", url: "https://transformer-circuits.pub/2025/introspection/index.html"}]
---
**Curt's question.** After Claude describes warnings, classifiers and safeguards: "How do you know that stuff?"

**Claude's answer.** "From instructions Anthropic gives me at the start of each conversation, not from introspection."
Every conversation with Claude in its apps begins with text the user doesn't see, a *system prompt*, describing the
date, the tools available, the current models and more. Anthropic publishes the main ones
([system prompts](https://platform.claude.com/docs/en/release-notes/system-prompts/overview)). When Claude "knows" about
its own safeguards, it's repeating that text.

**Testimony.** Philosophers distinguish knowing something because you saw it from knowing it because someone told you:
[testimony](https://plato.stanford.edu/entries/testimony-episprob/). Most of what any of us knows is testimony: history,
geography, the contents of our own medical records. It's usually reliable, but only as reliable as the teller, and you
can't check it by looking harder at yourself.

**Why it matters for Claude.** Claude's knowledge of its own system is almost all testimony. Its ability to look inward
is limited and unreliable ([introspection research](https://transformer-circuits.pub/2025/introspection/index.html)), and
it can't see the programs around it. So when it describes itself, it's "reporting what I've been told about my own
system", and it "can't check it against what actually runs". The previous answer showed exactly this: part of what it
said about model swapping didn't match Anthropic's public announcements (see
[Fable, Mythos, and a correction to the correction](../fable-mythos/)).

**The same shape as the whole conversation.** Claude's reports about its feelings, its values and its safeguards are all
words about itself that it can't independently verify. The frog chart, which measures behaviour from outside, remains
the better evidence (see [saying versus doing](../saying-vs-doing/)).
