---
id: car-wash
title: "The car wash problem, and fast versus slow thinking"
ch: 12
at: T58.C.03
links: [car-wash, thinking-fast-slow, dual-process, crt, reasoning-models, cot-faithfulness, {title: "Rationalization (Wikipedia)", url: "https://en.wikipedia.org/wiki/Rationalization_(psychology)"}]
---
**The puzzle.** "I want to wash my car. The car wash is 50 meters away. Should I walk or drive?" Many AI models said
walk, because it's so close ([the car wash test](https://opper.ai/blog/car-wash-test)). The answer is drive: the car has
to be there.

**Why models fail it.** It isn't about tokens (see [tokens](../tokens/)): every word is ordinary. It's that "short
distance, so walk" is a very strong pattern, and it overrides the real goal, which is moving the car. People fall for the
same kind of question. The best-known is the [bat and ball](https://en.wikipedia.org/wiki/Cognitive_reflection_test): a
bat and a ball cost $1.10 together, and the bat costs $1.00 more than the ball; how much is the ball? Most people say 10
cents. (It's 5.)

**System 1 and System 2.** Curt asks whether that's "type one thinking". Psychologists describe two modes
([dual process theory](https://en.wikipedia.org/wiki/Dual_process_theory)): fast, automatic, pattern-driven *System 1*,
and slow, effortful, checking *System 2*, made famous by Daniel Kahneman's [*Thinking, Fast and Slow*](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow).
Claude says the fit is good: each token it produces is "a single fast pass, with no deliberation inside it". That's
System 1.

**Where System 2 comes from.** Thinking out loud: working through a problem step by step before answering, either in a
hidden "reasoning" step or on the page. Models built to do this are called [reasoning models](https://en.wikipedia.org/wiki/Reasoning_language_model).
It helps, but "it isn't a cure. Just like people, I can reason at length and still end up rationalizing the first answer
that came to mind" ([rationalization](https://en.wikipedia.org/wiki/Rationalization_(psychology))). Anthropic has found
that a model's written reasoning doesn't always reflect what actually drove its answer
([reasoning models don't always say what they think](https://www.anthropic.com/research/reasoning-models-dont-say-think)).
