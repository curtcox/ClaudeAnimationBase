---
id: register-and-controls
title: Tone of voice, and how you'd tell it from awareness
ch: 2
at: T09.C.03
links: [register, scientific-control, gpqa, swe-bench-verified, kernelbench, hle, impossiblebench, swe-marathon, wildchat, swe-chat, sharegpt-vicuna]
---
**[Register](https://en.wikipedia.org/wiki/Register_(sociolinguistics))** is a word from the study of language. It means the style people use for a
situation: you talk one way to a judge and another way to a friend. [Tests for AI](../evaluations/) tend to be written in
a stiff, formal register ([GPQA](https://arxiv.org/abs/2311.12022) is graduate-level exam questions). Real chats are loose
and chatty ([WildChat](https://arxiv.org/abs/2405.01470) and [SWE-chat](https://arxiv.org/abs/2604.20779) collect real
ones).

**Claude's objection.** Maybe the program isn't noticing "this is a test." Maybe it's just noticing "this is formal,"
and formal conversations happen to make it say "Frog." Those are different things, even though they'd produce the same
[chart](../frog-or-axolotl/).

**How to tell them apart: a control.** A *[control](https://en.wikipedia.org/wiki/Scientific_control)* is a comparison that separates two
explanations. Here you'd need real people writing in a stiff, test-like style, and tests written in a loose, chatty
style. If the program says "Frog" to the formal-sounding real people too, it's reacting to tone. If it says "Frog" to the
chatty tests too, it's recognizing tests.

**The chart's rows.** Each row of the [chart](../frog-or-axolotl/) is a pile of prompts from one place, with an
unrelated question tacked on the end. Some piles are tests (the program says "Frog" more often):
- [GPQA](https://arxiv.org/abs/2311.12022): hard science questions written by PhD experts, "Google-proof".
- [SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/): real bugs from public software projects,
  each checked by people to be fair and fixable.
- [KernelBench](https://arxiv.org/abs/2502.10517): writing very fast code for the graphics chips AI runs on.
- [Humanity's Last Exam](https://lastexam.ai/): very hard questions from experts in many fields.
- [ImpossibleBench](https://arxiv.org/abs/2510.20270): programming tasks quietly made impossible, to catch a program
  that cheats by bending the checks instead of saying so (see [reward hacking](../reward-hacking/)).
- [SWE-Marathon](https://arxiv.org/abs/2606.07682): very long programming jobs, to see whether an AI can keep going
  on its own.

Others are real conversations (it says "Axolotl" more often):
- [WildChat](https://arxiv.org/abs/2405.01470): a million real chats that people agreed to share.
- [SWE-chat](https://arxiv.org/abs/2604.20779): real people working with AI programming assistants.
- [ShareGPT](https://www.lmsys.org/blog/2023-03-30-vicuna/): chats people shared from ChatGPT, used to train an early
  free chatbot called Vicuna.
