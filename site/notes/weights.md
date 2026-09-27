---
id: weights
title: Why Claude can't look at its own "weights"
ch: 2
at: T08.C.03
links: [introspection, tracing-thoughts, monosemanticity, {title: "Neural network (Wikipedia)", url: "https://en.wikipedia.org/wiki/Neural_network_(machine_learning)"}, {title: "Introspection (Wikipedia)", url: "https://en.wikipedia.org/wiki/Introspection"}]
---
**Weights, in plain terms.** Inside a program like Claude there's a vast table of numbers, billions of them, called
*weights*. They were adjusted, a tiny bit at a time, while the program studied text, until it wrote well. Those numbers
*are* the program's knowledge and habits. Nobody wrote them by hand, and nobody can read them like a book.

**"I can't inspect my own weights."** Claude doesn't get to look at those numbers while it talks. It's a bit like a
person who can't see their own brain cells: you can tell people what you *think* you're doing, but you can't check the
wiring. So when Claude says why it did something, that explanation may or may not match what actually happened inside.

**Can anyone look?** Researchers can, with special tools, and they're learning to find patterns in those numbers that
line up with ideas (a "Golden Gate Bridge" pattern, a "deception" pattern, and so on). This field is called
*interpretability*. It's early work, and it's one of the main ways people hope to check what these programs are really
doing.

**Some programs can notice a little.** Anthropic researchers found that Claude can sometimes detect an idea that was
artificially planted in its own processing, but only sometimes. Its self-knowledge is real but unreliable.
