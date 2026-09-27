---
id: weights
title: Why Claude can't look at its own "weights"
ch: 2
at: T08.C.03
links: [introspection, tracing-thoughts, monosemanticity, {title: "Neural network (Wikipedia)", url: "https://en.wikipedia.org/wiki/Neural_network_(machine_learning)"}, {title: "Introspection (Wikipedia)", url: "https://en.wikipedia.org/wiki/Introspection"}]
---
**Weights, in plain terms.** Inside a program like Claude there's a vast table of numbers, billions of them, called
*weights* (they're the connection strengths in a [neural network](https://en.wikipedia.org/wiki/Neural_network_(machine_learning)), loosely modeled
on [neurons](https://en.wikipedia.org/wiki/Artificial_neuron)). They were adjusted, a tiny bit at a time, while the program studied text, until it
wrote well. Those numbers *are* the program's knowledge and habits. Nobody wrote them by hand, and nobody can read them
like a book.

**"I can't inspect my own weights."** Claude doesn't get to look at those numbers while it talks. It's a bit like a
person who can't see their own brain cells: you can tell people what you *think* you're doing
([introspection](https://en.wikipedia.org/wiki/Introspection)), but you can't check the wiring. So when Claude says why it did something, that
explanation may or may not match what actually happened inside (see [saying versus doing](../saying-vs-doing/)).

**Can anyone look?** Researchers can, with special tools, and they're learning to find patterns in those numbers that
line up with ideas. In one famous demonstration, Anthropic found the pattern for the Golden Gate Bridge and turned it up,
producing "[Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude)", which brought the bridge into every
answer. The same work found patterns tied to things like deception
([Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)), and later work traces how
the program works through a problem step by step ([Tracing the thoughts of a language
model](https://www.anthropic.com/research/tracing-thoughts-language-model)). This field is called
*[interpretability](https://en.wikipedia.org/wiki/Mechanistic_interpretability)*. It's early work, and it's one of the main ways people hope to
check what these programs are really doing.

**Some programs can notice a little.** Anthropic researchers found that Claude can sometimes detect an idea that was
artificially planted in its own processing, but only sometimes
([Emergent introspective awareness](https://transformer-circuits.pub/2025/introspection/index.html)). Its
self-knowledge is real but unreliable.
