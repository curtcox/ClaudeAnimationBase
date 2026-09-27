---
id: the-router
title: "The router: what sits between Curt and the model"
ch: 10
at: T49.C.01
links: [constitutional-classifiers, usage-policy, system-prompts, fable-mythos-5-1, {title: "Anthropic's Transparency Hub", url: "https://www.anthropic.com/transparency"}]
---
**Curt's point.** Ask the wrong question about a hacking incident and "it gets tagged as a cybersecurity risk and
rejected or at least downgraded". That isn't really Claude, he says, "even though it is in a tiny sense. It is more
accurately an active router between us."

**What's actually there.** When you use Claude in an app, your message doesn't go straight to one model and back. Around
the model are other, smaller programs. Some are *classifiers*: programs trained to spot particular kinds of request,
such as help with weapons or with breaking into computers. Anthropic has written about one kind,
[constitutional classifiers](https://www.anthropic.com/research/constitutional-classifiers), trained from a written list
of what's allowed and what isn't. When one fires, the request can be refused, adjusted, or answered by a different model
(see [Fable, Mythos, and a correction to the correction](../fable-mythos/)).

**What Claude can and can't see.** In Claude's account, a classifier firing can add a tagged reminder to the user's
message before Claude reads it, covering things like cybersecurity, ethics, copyright, images or very long
conversations. Claude sees the tag, but not the classifier's reasoning or score. And it sees nothing that happens after
it answers: if its reply is blocked or flagged, it never finds out. So "from your side it all looks like 'Claude'", but
Claude is "one component describing the whole". It's the same lesson as [the memory correction](../the-correction/):
you're talking to a system.

**Some refusals are Claude's own.** Claude adds that it wouldn't help "turn an incident into a working exploit, whatever
layer catches it". Explaining what happened and why it matters is different, and it would want to answer that.
Anthropic's rules for what its products may be used for are public ([usage policy](https://www.anthropic.com/legal/aup)),
as are the main instructions it gives Claude in its apps ([system prompts](https://platform.claude.com/docs/en/release-notes/system-prompts/overview)).

**Which incident?** Claude isn't sure which Hugging Face incident Curt means, since there have been several. The next
chapter settles it (see [July](../hf-incident/)).
