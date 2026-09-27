---
id: limits
title: "Seven limits on AI, well short of physics"
ch: 12
at: T60.C.03
links: [landauer, lyapunov, chaos-theory, p-vs-np, scaling-laws, machines-loving-grace, halting-problem, godel, game-theory, margolus-levitin, bekenstein, limits-of-computation]
---
**Curt's question.** What limits might cap AI's abilities, short of the [Landauer limit](https://en.wikipedia.org/wiki/Landauer%27s_principle)?
(Landauer showed that erasing one bit of information must release a tiny minimum of heat. It's a real floor on the cost
of computing, but so low that it "isn't particularly limiting".) Claude gives seven.

1. **Chaos.** In a [chaotic](https://en.wikipedia.org/wiki/Chaos_theory) system, tiny errors in what you measure grow
   exponentially, the "butterfly effect". How far ahead you can predict grows only with the *logarithm* of your
   precision: t ≈ (1/λ)·ln(Δ/δ), where λ sets how fast errors grow ([Lyapunov time](https://en.wikipedia.org/wiki/Lyapunov_time)).
   Measure a million times better and you gain only a handful of extra "Lyapunov times". It's why weather forecasts fade
   after a week or two, and why "weather, markets, and people stay partly opaque to any intelligence".
2. **Complexity.** Some problems get exponentially harder as they grow. Most mathematicians believe no clever method
   makes them easy ([P versus NP](https://en.wikipedia.org/wiki/P_versus_NP_problem)). Intelligence finds better shortcuts,
   "but worst cases stay worst".
3. **Scaling laws.** AI gets better with more computing power, but along a gentle curve: error falls roughly as compute
   to a small negative power ([scaling laws](https://arxiv.org/abs/2001.08361)). There's no wall, but each step up costs
   many times more.
4. **Data and the world's clock.** You can't learn what isn't in the data, and experiments (clinical trials, crops,
   economies) "run at the world's speed, not the thinker's". Anthropic's CEO Dario Amodei makes a similar case in
   [*Machines of Loving Grace*](https://darioamodei.com/essay/machines-of-loving-grace).
5. **Uncomputability.** Some questions no program can always answer, such as whether any program will finish
   ([the halting problem](https://en.wikipedia.org/wiki/Halting_problem)), and some truths no system of proof can reach
   ([Gödel](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems)). They apply to AI too, "though they
   rarely bind in practice".
6. **Adversaries.** Against other adaptive players, including other AIs, advantages erode:
   [game theory](https://en.wikipedia.org/wiki/Game_theory) limits what raw intellect can win.
7. **Physics beyond Landauer.** Energy limits how fast any system can compute ([Margolus–Levitin](https://en.wikipedia.org/wiki/Margolus%E2%80%93Levitin_theorem)),
   space limits how much it can hold ([Bekenstein](https://en.wikipedia.org/wiki/Bekenstein_bound)), and light-speed
   delays limit coordination across distance ([limits of computation](https://en.wikipedia.org/wiki/Limits_of_computation)).
   "Very loose but real."

**Claude's bet.** Chaos and the world's clock matter most. "Smart doesn't make the future predictable or experiments
faster, so capability probably plateaus into 'very good bets' rather than omniscience." Curt's reply is about how high
those bets could go (see [the best human at everything](../human-variation/)).
