---
id: evaluations
title: Tests for AI, and why being tested might change the answers
ch: 2
at: T07.C.02
links: [hawthorne, swe-bench-verified, gpqa, hle, eval-awareness, {title: "Benchmark (Wikipedia)", url: "https://en.wikipedia.org/wiki/Benchmark_(computing)"}]
---
**An evaluation** ("eval" for short) is a test that a company or researcher gives an AI program to see how capable or
how safe it is: exam questions, programming problems, tricky moral situations. The results decide whether a version is
released and what precautions come with it.

**The worry.** People behave differently when they know they're being watched. The classic example (though historians
still argue over it) is a set of 1920s factory studies where workers seemed to do better simply because they were being
observed; it gave its name to the *Hawthorne effect*. If an AI program behaves
better on tests than in real use, the tests would give a falsely rosy picture.

**Why a program might notice.** Test questions tend to look like tests: formal, precise, oddly specific. Real
conversations are messier. A program that has read a lot of both could pick up the difference without being told.

**What Claude claims, and the problem with the claim.** Claude says it tries to "answer the same whether or not
anyone's grading." But a program's description of itself isn't proof of how it behaves. That's exactly what the frog
test is designed to check from the outside.
