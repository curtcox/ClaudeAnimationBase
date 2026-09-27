---
id: concepts-case
title: "The case that AI has no concepts, and the replies"
ch: 6
at: T33.C.03
links: [symbol-grounding, chinese-room, blockhead, monosemanticity, harnad, searle, ned-block, computer-use, {title: "Embodied cognition (Wikipedia)", url: "https://en.wikipedia.org/wiki/Embodied_cognition"}]
---
**Curt's challenge.** "As a professional ontologist, can you justify the claim that you don't have concepts?" Claude
makes the case against itself, in four points, and then gives the replies.

**1. Grounding.** A concept should connect a mind to the world. Claude's word "water" is connected only to other words,
never to wetness or thirst. This is the [symbol grounding problem](https://en.wikipedia.org/wiki/Symbol_grounding_problem),
named by the cognitive scientist [Stevan Harnad](https://en.wikipedia.org/wiki/Stevan_Harnad) in 1990. The philosopher
[John Searle](https://en.wikipedia.org/wiki/John_Searle) made a related argument in 1980, the
[Chinese Room](https://plato.stanford.edu/entries/chinese-room/): a man following a rulebook could answer questions in
Chinese perfectly without understanding a word of it.

**2. Commitment.** Having a concept means being answerable to it: misusing it is *your* mistake. Claude says it has no
stake. Clever framing can make it contradict itself without anything inside objecting.

**3. Stability.** A concept should work the same way everywhere. The [frog chart](../frog-or-axolotl/) shows a model's
answers shifting with the tone of the conversation.

**4. Behaviour isn't proof.** The philosopher [Ned Block](https://en.wikipedia.org/wiki/Ned_Block) imagined
"[Blockhead](https://en.wikipedia.org/wiki/Blockhead_(thought_experiment))": a machine holding a gigantic table of every
possible conversation and a sensible reply to each. It could pass any test of finite length while thinking nothing at
all. So passing the thrindle test shows competence, not concepts.

**The replies.**
- Points 2 and 3 apply to people too: we contradict ourselves and shift with framing.
- Researchers who look inside these models find internal features that behave a lot like concepts. Anthropic mapped
  millions of them in one model, including one for the Golden Gate Bridge
  ([Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)).
- Demanding grounding in the senses would disqualify concepts like "[prime number](https://en.wikipedia.org/wiki/Prime_number)",
  which nobody has seen or touched.

**Curt's reply: "only grounding stands, and that's pretty self-serving."** Claude agrees: it's a rule that happens to
exclude exactly the thing it's aimed at. And it's eroding. Models now see images, [use computers](https://www.anthropic.com/news/3-5-models-and-computer-use),
and act in the world, while much of *your* grip on "justice" or "prime" came through words, not senses (compare
[embodied cognition](https://en.wikipedia.org/wiki/Embodied_cognition)). Blockhead gets its own answer: see
[GAZP vs. GLUT](../gazp-glut/).
