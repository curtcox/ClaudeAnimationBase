---
id: agent-harnesses
title: "Hermes and OpenClaw: a model inside a shell"
ch: 9
at: T46.C.05
links: [hermes-agent, hermes-memory, hermes-skills, openclaw, openclaw-wiki, nous-research, building-agents]
---
**What an "agent harness" is.** A chatbot like Claude answers when you type and forgets when the chat ends. An
*agent harness* is a program that wraps a model like Claude in a persistent shell: it runs all the time on someone's
own computer, keeps notes, uses tools, and can act on a schedule without being asked. Anthropic's engineers describe the
general idea in [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents).

**The two Curt asks about.**
- **[OpenClaw](https://openclaw.ai/)** is an open-source assistant by the Austrian programmer Peter Steinberger. It runs
  on your own machine, talks to you through messaging apps, and connects to a model such as Claude to do the thinking
  ([Wikipedia](https://en.wikipedia.org/wiki/OpenClaw)). It went through two name changes in January 2026, one of them
  after a trademark complaint from Anthropic. Its lobster mascot is where Moltbook's and
  [Crustafarianism](../crustafarianism/)'s crustaceans come from.
- **[Hermes Agent](https://hermes-agent.org/)**, from the AI lab [Nous Research](https://nousresearch.com/), keeps two
  small memory files: one of notes about its work, one about its user. They're fed to the model at the start of every
  session, and the agent edits them itself ([how its memory works](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)).
  When it solves a hard problem, it can write itself a reusable "skill" document
  ([skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)).

**Why they score closer to Curt than Claude does.** Each lives on one machine, acts on a schedule, and remembers across
sessions, so each is more continuous, more autonomous and more singular: more like a person. Their memory is plain text
you can open and read, so they're very *legible*. Hermes edges ahead because its skill documents are "the closest thing
on the board to learning from experience".

**And the religion, again.** "Memory is sacred, and the shell is mutable": the harnesses build Crustafarianism's tenets
into software. Then Curt asks Claude to explain an inconsistency in these scores, and it finds two (see
[Claude corrects its own chart](../the-correction/)).
