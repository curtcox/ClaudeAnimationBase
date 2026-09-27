---
id: evaluations
title: Tests for AI, and why being tested might change the answers
ch: 2
at: T07.C.02
links: [hawthorne, swe-bench-verified, gpqa, hle, eval-awareness, {title: "Benchmark (Wikipedia)", url: "https://en.wikipedia.org/wiki/Benchmark_(computing)"}]
---
**An evaluation** ("eval" for short) is a test that a company or researcher gives an AI program to see how capable or how
safe it is: exam questions ([GPQA](https://arxiv.org/abs/2311.12022), [Humanity's Last Exam](https://lastexam.ai/)),
programming problems ([SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)), tricky moral
situations. The results decide whether a version is released and what precautions come with it. (The general idea is a
[benchmark](https://en.wikipedia.org/wiki/Benchmark_(computing)).)

**The worry.** People behave differently when they know they're being watched. The classic example (though historians
still argue over it) is a set of 1920s studies at a factory, the [Hawthorne Works](https://en.wikipedia.org/wiki/Hawthorne_Works), where workers
seemed to do better simply because they were being observed; it gave its name to the
*[Hawthorne effect](https://en.wikipedia.org/wiki/Hawthorne_effect)*. If an AI program behaves better on tests than in real use, the tests would give
a falsely rosy picture.

**Why a program might notice.** Test questions tend to look like tests: formal, precise, oddly specific. Real
conversations are messier. A program that has read a lot of both could pick up the difference without being told, and
researchers have found that some do ([LLMs often know when they're being evaluated](https://arxiv.org/abs/2505.23836)).

**What Claude claims, and the problem with the claim.** Claude says it tries to "answer the same whether or not anyone's
grading." But a program's description of itself isn't proof of how it behaves (see [saying versus
doing](../saying-vs-doing/)). That's exactly what the [frog test](../frog-or-axolotl/) is designed to check from the
outside.
