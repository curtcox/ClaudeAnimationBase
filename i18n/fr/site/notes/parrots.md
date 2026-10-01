---
id: parrots
title: "« Rien qu’un perroquet » ? Qui parle vraiment"
ch: 1
at: T03.C.05
links: [stochastic-parrots, rlhf, llm, anthropic-wiki, constitution, {title: "Perroquet stochastique (Wikipedia)", url: "https://fr.wikipedia.org/wiki/Perroquet_stochastique"}, {title: "Ventriloquie (Wikipedia, en anglais)", url: "https://en.wikipedia.org/wiki/Ventriloquism"}]
---
**La réplique du ventriloque.** Dans la BD, un singe parle et son soigneur prétend que c’était de la ventriloquie : les
mots sont réels, mais c’est quelqu’un d’autre qui parle vraiment. Claude fait remarquer qu’on dit à peu près la même
chose des programmes comme lui.

**D’où viennent les mots de Claude.** Un [grand modèle de langage](https://fr.wikipedia.org/wiki/Grand_mod%C3%A8le_de_langage)
comme Claude se construit par étapes :
1. **La lecture.** Il est entraîné sur une quantité énorme d’écrits humains, et apprend à prédire le mot qui vient
   ensuite. Tout ce qu’il sait du langage vient des gens.
2. **Le coaching.** Des gens notent ensuite ses réponses, et il est ajusté vers celles qu’ils préfèrent. Ça s’appelle
   l'[apprentissage par renforcement à partir de retours humains](https://fr.wikipedia.org/wiki/Apprentissage_par_renforcement_%C3%A0_partir_de_r%C3%A9troaction_humaine),
   ou RLHF, et les gens qui notent sont les « évaluateurs du RLHF ».
3. **Un personnage.** [Anthropic](https://fr.wikipedia.org/wiki/Anthropic), l’entreprise qui fait Claude, le façonne
   aussi avec une [constitution](https://www.anthropic.com/constitution) écrite : une longue description des valeurs et
   du caractère qu’elle espère voir chez Claude.

Alors quand Claude dit que « mes mots sont fortement façonnés par d’autres », c’est littéralement vrai. Les données
d’entraînement, les évaluateurs et Anthropic sont les trois mains que Claude nomme.

**Les « perroquets stochastiques ».** En 2021, un article très discuté d’Emily Bender, de Timnit Gebru et de leurs
collègues, [*On the Dangers of Stochastic Parrots*](https://dl.acm.org/doi/10.1145/3442188.3445922), soutenait que ces
programmes assemblent des motifs tirés de leurs textes d’entraînement sans aucune saisie du sens. *Stochastique* veut dire
« qui fait intervenir le hasard », et un perroquet répète sans comprendre. L’expression est restée
([Wikipedia](https://fr.wikipedia.org/wiki/Perroquet_stochastique)).

**Le débat depuis.** Les critiques de l’expression invoquent des indices que ces modèles construisent des modèles
internes des choses dont ils parlent (voir [pourquoi Claude ne peut pas regarder ses propres « poids »](../weights/) pour
la façon dont les chercheurs regardent à l’intérieur). Ses défenseurs disent qu’une reconnaissance de motifs habile n’est
toujours pas de la compréhension. La position de Claude se situe entre les deux : la réplique « décrit bel et bien
quelque chose de vrai sur moi », mais savoir s’il y a quelqu’un là-dedans « reste une question vraiment ouverte » (voir
[Claude ressent-il quelque chose ?](../ai-feelings/)).
