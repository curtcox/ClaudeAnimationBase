---
id: rsi
title: "RSI: AI that improves itself"
ch: 13
at: T63.C.04
links: [rsi-wiki, arxiv-aide2, arxiv-bounded, anthropic-rsi, mittr-rsi, datacamp-rsi, coxon-resigns]
---
**The question.** "RSI by EOY?" means: will we see *recursive self-improvement* by the end of the year? RSI is an AI
system improving itself, where each improvement makes it better at making the next one
([Wikipedia](https://en.wikipedia.org/wiki/Recursive_self-improvement); [a plain tutorial](https://www.datacamp.com/tutorial/recursive-self-improvement)).
It's the idea behind "foom" (see [foom](../foom/)).

**Claude's answer: it depends which RSI.**

**Weak RSI is already here.** A paper posted the week of this conversation, [AIDE²](https://arxiv.org/abs/2609.26457),
describes an AI research agent that rewrites its own code. It proposes changes to itself, tests them on research tasks,
and keeps the ones that help, and each accepted version becomes the one that's edited next. In an 8-day run it found
seven improvements that also worked on new tasks. The loop improves the *harness*, the software around the model (see
[agent harnesses](../agent-harnesses/)), not the model's own learned knowledge. Anthropic's June 2026 report,
[*When AI builds itself*](https://www.anthropic.com/institute/recursive-self-improvement), describes how much of its
own AI development it already hands to Claude: more than 80% of the code it merges is written by Claude. It also says
the loop isn't closed yet, and that humans still direct the research.

**Strong RSI is an open-ended loop**, improving capabilities faster than people could, with little human oversight.
Claude puts that at about 5% by year's end. A July survey of 1,250 papers ([From Bounded Self-Refinement to Autonomous
Research Loops](https://arxiv.org/abs/2607.07663)) found such loops held back by three things: they need reliable
signals of what counts as better (*grounding*), they can degrade by feeding on their own output (*collapse*), and they
need computing power (*compute*). [MIT Technology Review](https://www.technologyreview.com/2026/08/18/1142188/ai-recursive-self-improvement/)
reported in August that RSI "might not come so quickly after all".

**The worry case sits in between**: weak loops, many copies, and labs racing. In September 2026, a researcher named
Jacob Coxon resigned from Anthropic, writing that AI companies are "racing straight to self-improving superintelligence
and gambling with our lives" ([TechCrunch](https://techcrunch.com/2026/09/09/gambling-with-our-lives-anthropic-researcher-quits-warns-against-self-improving-ai/)).

**And a disclosure.** "I'm Anthropic's model, so weigh my 5% with that in mind."
