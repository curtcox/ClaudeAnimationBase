# Making "Frog or Axolotl": the whole conversation

The film is made from one conversation between Curt and Claude ([its transcript](../script/conversation.md)). It was
made in another: this one, in which Curt asked Claude to turn the first into a film, and Claude wrote the code that draws,
voices and assembles it. This is that second conversation, from Claude Code's own record of the session, a day at a time.

It has every message Curt typed (67), every reply Claude wrote (916), Claude's visible reasoning (160 notes), and one
line for each thing Claude did: each command, file edit and page read (3066 in all). It leaves out what those
commands printed, the images, and the notices the app adds for Claude. When Claude's working memory filled up, it was
replaced by a summary; a one-line note marks each place (24 times). Curt's email address and the home folder are
removed. Times are America/Chicago time.

Made by `npm run making-of` (tools/making_of.mjs).

## The parts

| part | day | from | Curt's first request |
|---|---|---|---|
| [1](parts/2026-09-26.md) | Saturday, 26 September 2026 | 15:13 | Read this conversation. https://claude.ai/share/43eeeff8-bc21-4740-9553-b988beed4296 Make… |
| [2](parts/2026-09-27.md) | Sunday, 27 September 2026 | 00:00 | Commit and continue. |
| [3](parts/2026-09-28.md) | Monday, 28 September 2026 | 07:11 | Commit. Then find more places to add sounds. - Doom Debates has a ticking clock with back… |
| [4](parts/2026-09-29.md) | Tuesday, 29 September 2026 | 07:25 | Use all of the proposed sounds. Make sure to check the levels carefully to make sure they… |

## The helpers

Claude sometimes started a helper: another copy of itself with its own instructions, for one job (say, describing frames
it has never seen, to check that the pictures read without the words).

- [Blind describer for ch 9 frames](helpers/agent-a0989f4b4279d9351.md) (Sunday, 27 September 2026, 18:49)
- [Blind multiple-choice reader for ch 9](helpers/agent-a388eab32f9e28970.md) (Sunday, 27 September 2026, 18:49)
- [Grade blind descriptions for ch 9](helpers/agent-ae0d9bfd2cf8c5c5b.md) (Sunday, 27 September 2026, 18:51)
- [Blind describer, ch 9 baseline](helpers/agent-a9b595a06aef5d141.md) (Sunday, 27 September 2026, 18:59)
- [Blind multiple choice, ch 9 baseline](helpers/agent-aa81025a328f470e7.md) (Sunday, 27 September 2026, 18:59)
- [Grade baseline descriptions ch 9](helpers/agent-a24a45fbaeb336c91.md) (Sunday, 27 September 2026, 19:02)
- [Blind describer 1, ch 9 after fixes](helpers/agent-ab6f1312d194a7beb.md) (Sunday, 27 September 2026, 19:11)
- [Blind describer 2, ch 9 after fixes](helpers/agent-afb83fd141122a906.md) (Sunday, 27 September 2026, 19:11)
- [Blind chooser 1, ch 9 after fixes](helpers/agent-a876d162a89118ff7.md) (Sunday, 27 September 2026, 19:11)
- [Blind chooser 2, ch 9 after fixes](helpers/agent-ad54329a45a0d6e14.md) (Sunday, 27 September 2026, 19:11)
- [Grade ch 9 descriptions after fixes](helpers/agent-a0228b296b1102818.md) (Sunday, 27 September 2026, 19:12)
- [Blind describer 1, ch 9 run 4](helpers/agent-a69f603cf832410af.md) (Sunday, 27 September 2026, 19:16)
- [Blind describer 2, ch 9 run 4](helpers/agent-a53c541a626628f6d.md) (Sunday, 27 September 2026, 19:16)
- [Blind chooser 1, ch 9 run 4](helpers/agent-acfc39d33ce051103.md) (Sunday, 27 September 2026, 19:16)
- [Blind chooser 2, ch 9 run 4](helpers/agent-abe280be2b1d5879d.md) (Sunday, 27 September 2026, 19:16)
- [Grade ch 9 descriptions, run 4](helpers/agent-a1e538a1ea59e60dd.md) (Sunday, 27 September 2026, 19:18)
- [Blind describer 1, ch 9 final](helpers/agent-ac7b6a37d2520121c.md) (Sunday, 27 September 2026, 19:25)
- [Blind describer 2, ch 9 final](helpers/agent-a323624618cfddce2.md) (Sunday, 27 September 2026, 19:25)
- [Blind chooser 1, ch 9 final](helpers/agent-ad5785be59f1ed30c.md) (Sunday, 27 September 2026, 19:25)
- [Blind chooser 2, ch 9 final](helpers/agent-a0a1cb91b7cfb0eb4.md) (Sunday, 27 September 2026, 19:25)
- [Grade ch 9 final descriptions](helpers/agent-a48a5e7fa99e80acc.md) (Sunday, 27 September 2026, 19:27)
