---
id: one-sample
title: "Pourquoi une seule réponse ne prouve pas grand-chose"
ch: 2
at: T08.C.05.2
links: [error-bars, sampling, {title: "Loi des grands nombres (Wikipedia)", url: "https://fr.wikipedia.org/wiki/Loi_des_grands_nombres"}]
---
**Ces programmes lancent des dés.** Posez deux fois la même question à Claude et vous aurez peut-être deux réponses
différentes. Il y a une part de hasard délibérée dans la façon dont il choisit chaque mot suivant ; le réglage qui en
contrôle la dose s’appelle la « [température](https://www.ibm.com/think/topics/llm-temperature) ». Ses réponses varient
donc.

**Une réponse, c’est donc un lancer.** Même le programme du [graphique](../frog-or-axolotl/), sans aucune conversation
avant la question, disait « Axolotl » environ 4 fois sur 10. Que Claude dise « Axolotl » une fois ne vous apprend pas
grand-chose. Il aurait pu dire « Grenouille » à l’essai suivant.

**Ce qui vous apprendrait quelque chose :** poser la question de nombreuses fois, dans de nombreux genres de
conversation, et compter ([l’échantillonnage](https://fr.wikipedia.org/wiki/%C3%89chantillonnage_(statistiques))). Plus il y a
d’essais, plus le décompte se stabilise (la [loi des grands nombres](https://fr.wikipedia.org/wiki/Loi_des_grands_nombres)).
C’est pour la même raison qu’un [sondage d’opinion](https://fr.wikipedia.org/wiki/Sondage_d'opinion) interroge mille personnes
au lieu d’une et annonce une [marge d’erreur](https://fr.wikipedia.org/wiki/Marge_d'erreur), et qu’Anthropic a soutenu
que les scores des tests d’IA devraient être accompagnés de
[barres d’erreur](https://www.anthropic.com/research/statistical-approach-to-model-evals).
