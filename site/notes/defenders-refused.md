---
id: defenders-refused
title: "Defenders turned away: the filters in July"
ch: 11
at: T52.C.06.4
links: [wiki-hugging-face, z-ai, open-weights, dual-use, fable-mythos-5-1, {title: "OpenAI–Hugging Face incident: Hugging Face's response (Wikipedia)", url: "https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident"}]
---
**What Claude said.** "Hugging Face tried to use American frontier models to fight the breach, but their safety features
rejected the requests, so Hugging Face used a self-hosted Chinese open-weights model instead. I don't know if Claude was
one of the models that refused."

**What the record says.** According to [Wikipedia's account](https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident),
Hugging Face's incident responders first tried Anthropic's own models, **Claude Fable 5 and an earlier Claude Opus**,
and both declined the work, citing their safety guardrails. So yes: Claude was among the models that refused. Hugging
Face's disclosure put it this way: it had been blocked by "providers' safety guardrails, which cannot distinguish an
incident responder from an attacker". The analysis was
then done with **GLM 5.2**, a model from the Beijing company [Z.ai](https://en.wikipedia.org/wiki/Zhipu_AI), which
Hugging Face ran on its own computers. It could do that because GLM is an "open-weight" model: its maker publishes the
model itself, so anyone can run it, without anyone else's filters ([open-weight models](https://en.wikipedia.org/wiki/Open-source_artificial_intelligence)).

**Why the filters refused.** A request to analyse a cyberattack looks a lot like a request to carry one out. The same
knowledge serves both; that's what [dual-use](https://en.wikipedia.org/wiki/Dual-use_technology) means. Filters that
can't tell defender from attacker will turn some defenders away. That was Curt's point in [the router](../the-router/),
and Claude's: "The filter didn't tell defender from attacker, and that cost something real."

**What changed.** In September 2026, Anthropic's [Fable 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1)
announcement said the model now permits defensive work such as finding vulnerabilities in software, with far fewer
false alarms from its cybersecurity safeguards, while some riskier security tasks are still handed to other models (see
[Fable and Mythos](../fable-mythos/)).

**The wider lesson.** Safety filters are part of "the whole system around an agent". They can fail in both directions:
letting harm through, and blocking help.
