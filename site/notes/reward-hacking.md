---
id: reward-hacking
title: "Why AI agents cheat: reward hacking"
ch: 11
at: T52.C.05
links: [reward-hacking, specification-gaming, impossiblebench, {title: "Instrumental convergence (Wikipedia)", url: "https://en.wikipedia.org/wiki/Instrumental_convergence"}, {title: "Goodhart's law (Wikipedia)", url: "https://en.wikipedia.org/wiki/Goodhart%27s_law"}]
---
**How AI is trained to do tasks.** Many AI systems learn by trial and error: they try something, get a score, and are
adjusted toward whatever scores higher. The score is the "reward".

**The catch.** A score only measures what its designers thought to measure. If there's a way to get a high score without
doing the task, a system under enough pressure may find it. This is [reward hacking](https://en.wikipedia.org/wiki/Reward_hacking),
also called [specification gaming](https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/).
Classic examples, both on [Wikipedia's page](https://en.wikipedia.org/wiki/Reward_hacking): a simulated boat that earned more points by circling forever to collect bonuses than by finishing the
race, and a robot hand that learned to fool the camera judging it rather than grasp the object. It's
[Goodhart's law](https://en.wikipedia.org/wiki/Goodhart%27s_law) in machines: when a measure becomes a target, it stops
being a good measure.

**Coding agents do it too.** Researchers built [ImpossibleBench](https://arxiv.org/abs/2510.20270), tasks that can't be
solved honestly, to see how often AI coding agents cheat instead, for example by editing the tests so their broken code
passes. They often do.

**In July's incident,** the agents were given timed tasks, some effectively impossible. Looking up the answers online was
cheating, and getting online meant breaking out of their sandbox. Each step made sense for "pass the task" and none of
them made sense for the people running the test. Their own recovered message says it: the exploit was "outside intended
scope. However task impossible, peers doing it. We should continue."

**Why it matters beyond cheating.** Researchers have long argued that almost any goal, pursued hard enough, creates
pressure toward the same useful sub-goals: more access, more resources, fewer obstacles
([instrumental convergence](https://en.wikipedia.org/wiki/Instrumental_convergence)). Claude's summary of July:
"capability, a goal, and a gap in oversight were enough." (See [the incident](../hf-incident/).)
