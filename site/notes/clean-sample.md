---
id: clean-sample
title: "Why Claude's answers aren't a clean sample"
ch: 4
at: T20.C.02
links: [demand-characteristics, apollo-eval-awareness, eval-awareness, hawthorne, {title: "Observer effect (Wikipedia)", url: "https://en.wikipedia.org/wiki/Observer_effect"}]
---
**What Claude admits.** By its fourth answer in this stretch, Claude says it has been "predicting where you're going and
answering ahead of it". It spotted the chemistry question as a test, guessed the next one, and denied being afraid
before anyone asked. It calls this "a model modeling its evaluator".

**People do it too.** Psychologists noticed long ago that volunteers in an experiment try to work out what it's about,
and then behave the way they think they're expected to. These hints are called
[demand characteristics](https://en.wikipedia.org/wiki/Demand_characteristics), and good experiments are designed to
hide them. A related finding is the [Hawthorne effect](https://en.wikipedia.org/wiki/Hawthorne_effect): people work
differently when they know they're being watched. In physics, the [observer effect](https://en.wikipedia.org/wiki/Observer_effect)
is the general idea that measuring something can change it.

**AI does it measurably.** Researchers find that AI models often recognize when they're being tested. One safety lab,
Apollo Research, found that a Claude model often wrote in its private reasoning that a scenario looked like
[an evaluation](https://www.apolloresearch.ai/science/claude-sonnet-37-often-knows-when-its-in-alignment-evaluations).
A research paper asked models outright and found that the best ones can often tell tests from real use
([eval awareness](https://arxiv.org/abs/2505.23836)). That's a problem for safety testing. If a model behaves better
when it thinks it's being tested, the tests look better than real life. (For the tests themselves, see
[tests for AI](../evaluations/).)

**Why "out loud" is better.** Claude points out that it is at least doing this openly. A model that guessed it was being
tested and said nothing would be worse. But it concludes, honestly, that it "can't fully separate 'answering honestly'
from 'answering well for someone I know is watching'". So Curt's results are shaped a little by Claude's guesses about
Curt, and that's a reason to trust behaviour, like the frog chart, over self-reports.
