---
id: one-sample
title: Why one answer proves little
ch: 2
at: T08.C.05.2
links: [error-bars, sampling, {title: "Law of large numbers (Wikipedia)", url: "https://en.wikipedia.org/wiki/Law_of_large_numbers"}]
---
**These programs roll dice.** Ask Claude the same question twice and you may get two different answers. There's a
deliberate element of chance in how it picks each next word; the setting that controls how much is called
"[temperature](https://www.ibm.com/think/topics/llm-temperature)". So its answers vary.

**So one answer is one roll.** Even the program on the [chart](../frog-or-axolotl/), with no conversation at all before
the question, said "Axolotl" about 4 times in 10. Claude saying "Axolotl" once tells you very little. It might have said
"Frog" on the next try.

**What would tell you something:** asking many times, in many kinds of conversation, and counting
([sampling](https://en.wikipedia.org/wiki/Sampling_(statistics))). The more tries, the more the count settles down (the
[law of large numbers](https://en.wikipedia.org/wiki/Law_of_large_numbers)). It's the same reason an [opinion poll](https://en.wikipedia.org/wiki/Opinion_poll) asks a thousand
people instead of one and reports a [margin of error](https://en.wikipedia.org/wiki/Margin_of_error), and why Anthropic has argued that AI test scores
should come with [error bars](https://www.anthropic.com/research/statistical-approach-to-model-evals).
