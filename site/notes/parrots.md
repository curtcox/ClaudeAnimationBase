---
id: parrots
title: '"Just a parrot"? Who is doing the talking'
ch: 1
at: T03.C.05
links: [stochastic-parrots, rlhf, llm, anthropic-wiki, constitution, {title: "Stochastic parrot (Wikipedia)", url: "https://en.wikipedia.org/wiki/Stochastic_parrot"}, {title: "Ventriloquism (Wikipedia)", url: "https://en.wikipedia.org/wiki/Ventriloquism"}]
---
**The ventriloquist line.** In the comic, an ape speaks and his handler claims it was ventriloquism: the words are real,
but someone else is really doing the talking. Claude points out that people say much the same about programs like
itself.

**Where Claude's words come from.** A [large language model](https://en.wikipedia.org/wiki/Large_language_model) like
Claude is built in stages:
1. **Reading.** It's trained on an enormous amount of human writing, and learns to predict what word comes next.
   Everything it knows about language comes from people.
2. **Coaching.** People then rate its answers, and it's adjusted toward the ones they prefer. This is called
   [reinforcement learning from human feedback](https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback),
   or RLHF, and the people doing the rating are the "RLHF raters".
3. **A character.** [Anthropic](https://en.wikipedia.org/wiki/Anthropic), the company that makes Claude, also shapes it
   with a written [constitution](https://www.anthropic.com/constitution): a long description of the values and
   character it hopes Claude will have.

So when Claude says "my words come heavily shaped by others", that's literally true. The training data, the raters and
Anthropic are the three hands Claude names.

**"Stochastic parrots."** In 2021, a much-discussed paper by Emily Bender, Timnit Gebru and colleagues,
[*On the Dangers of Stochastic Parrots*](https://dl.acm.org/doi/10.1145/3442188.3445922), argued that these programs stitch
together patterns from their training text without any grasp of meaning. *Stochastic* means "involving chance", and a
parrot repeats without understanding. The phrase stuck ([Wikipedia](https://en.wikipedia.org/wiki/Stochastic_parrot)).

**The argument since.** Critics of the phrase point to evidence that these models build internal models of the things
they talk about (see [why Claude can't look at its own "weights"](../weights/) for how researchers look inside).
Defenders say that clever pattern-matching is still not understanding. Claude's own position here is in between: the
line "describes something true about me", but whether anyone is home is "genuinely unsettled"
(see [does Claude feel anything?](../ai-feelings/)).
