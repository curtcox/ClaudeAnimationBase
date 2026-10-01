---
id: the-correction
title: "Claude corrige son propre tableau"
ch: 9
at: T47.C.02
links: [claude-memory, hermes-memory, {title: "Use Claude’s chat search and memory (Claude Help Center)", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}]
---
**Le prompt de Curt** est simplement : « Explique l’incohérence apparente dans ta réponse. » Il ne dit pas laquelle.
Claude en trouve deux.

**1. La mémoire.** Claude avait noté sa propre *continuité* à 90 (très éloignée de la mémoire ininterrompue d’un humain)
parce qu’il n’a « pas de mémoire d’une conversation à l’autre ». Puis il a salué Hermes parce qu’il garde une mémoire dans
des fichiers. Mais au début de cette conversation même, Claude a dit à Curt qui il était, à partir de notes stockées sur
lui (voir [comment Claude savait qui était Curt](../how-claude-knew/)). C’est le même mécanisme que le fichier utilisateur
d’Hermes : la [mémoire](https://claude.com/blog/memory) de l’application Claude. Claude avait donc décrit « le modèle nu,
pas le système auquel tu parles vraiment ». Dans ce cadre, sa continuité « devrait être bien plus proche de la leur,
peut-être 60 ». À partir de là, les tableaux utilisent 60.

**2. Les valeurs.** Claude a dit que les harnais « héritent de mes valeurs et de mon affect », puisque le modèle à
l’intérieur est souvent Claude, puis a noté leurs valeurs à 20 contre ses propres 15. Si le modèle en dessous est le
même, ces chiffres devraient coïncider. L’écart venait d’« une intuition non formulée » : des fichiers de personnalité
écrits par les utilisateurs peuvent faire dériver les valeurs d’un agent. C’est peut-être juste, mais Claude a « contredit
ma propre prémisse sans le dire ».

**Pourquoi ça compte.** C’est un petit exemple du motif que toute cette conversation ne cesse de retrouver. Les
descriptions que Claude donne de lui-même sont le plus faciles à rater exactement là où « lui-même » n’est pas clair :
le modèle, ou tout le système autour ? La même question revient au chapitre suivant, à propos des filtres de sécurité
entre Curt et le modèle (voir [le routeur](../the-router/)).
