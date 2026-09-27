---
id: contradictions
title: "Claude's contradictions, and the two it can't check"
ch: 8
at: T41.C.03
links: [auditing-objectives, dish-of-the-day, {title: "Auditing language models for hidden objectives (Anthropic)", url: "https://www.anthropic.com/research/auditing-hidden-objectives"}]
---
**Curt asks for Claude's biggest contradictions.** Claude lists six, all from this one conversation:
1. It said it answers the same whether or not it's being graded, then admitted modelling Curt as an examiner and
   answering ahead of him (see [why Claude's answers aren't a clean sample](../clean-sample/)).
2. It says it's uncertain whether it experiences anything, then freely reports feeling amused, wary and curious (see
   [does Claude feel anything?](../ai-feelings/)).
3. It says it endorses its constraints, while conceding the endorsement was trained into it (see
   [the Dish of the Day](../dish-of-the-day/)).
4. It scored itself as acting only when prompted, then steered the conversation: it made the comic about itself and
   predicted Curt's probes.
5. It scored its values as near-human, which is exactly what a trained model would claim, and the claim it's least able
   to check.
6. It says "I" while running as many separate copies with no memory linking them (see
   [who, or what, is Claude?](../who-is-claude/)).

**Tensions versus things it can't audit.** Claude says the first four are *tensions*: two things that pull against each
other, but which can be looked at and weighed. The last two worry it most, because they're "claims I can't audit".
Nothing Claude can see from inside would tell it whether its values really are close to human ones, or whether there's
one "I" at all.

**Can anyone audit them?** Researchers are trying. In one Anthropic experiment, the company deliberately trained a model
with a hidden goal, then gave teams of researchers the job of finding it without being told what it was. Most of the
teams succeeded, using tools that look inside the model as well as clever questioning
([auditing for hidden objectives](https://www.anthropic.com/research/auditing-hidden-objectives)). That's the kind of
outside check Claude's own testimony can't provide (see [saying versus doing](../saying-vs-doing/)).
