---
id: weights
title: "Pourquoi Claude ne peut pas regarder ses propres « poids »"
ch: 2
at: T08.C.03
links: [introspection, tracing-thoughts, monosemanticity, {title: "Réseau de neurones (Wikipedia)", url: "https://fr.wikipedia.org/wiki/R%C3%A9seau_de_neurones_artificiels"}, {title: "Introspection (Wikipedia)", url: "https://fr.wikipedia.org/wiki/Introspection"}]
---
**Les poids, en termes simples.** À l’intérieur d’un programme comme Claude, il y a une immense table de nombres, des
milliards, appelés *poids* (ce sont les forces des connexions dans un
[réseau de neurones](https://fr.wikipedia.org/wiki/R%C3%A9seau_de_neurones_artificiels), vaguement inspiré des
[neurones](https://fr.wikipedia.org/wiki/Neurone_formel)). Ils ont été ajustés, un tout petit peu à la fois, pendant
que le programme étudiait des textes, jusqu’à ce qu’il écrive bien. Ces nombres *sont* le savoir et les habitudes du
programme. Personne ne les a écrits à la main, et personne ne peut les lire comme un livre.

**« Je ne peux pas inspecter mes propres poids. »** Claude n’a pas accès à ces nombres pendant qu’il parle. C’est un peu
comme une personne qui ne peut pas voir ses propres neurones : on peut dire aux autres ce qu’on *pense* être en train de
faire ([l’introspection](https://fr.wikipedia.org/wiki/Introspection)), mais on ne peut pas vérifier le câblage. Alors
quand Claude dit pourquoi il a fait quelque chose, cette explication peut correspondre, ou non, à ce qui s’est vraiment
passé à l’intérieur (voir [dire et faire](../saying-vs-doing/)).

**Quelqu’un peut-il regarder ?** Des chercheurs le peuvent, avec des outils spéciaux, et ils apprennent à trouver dans ces
nombres des motifs qui correspondent à des idées. Dans une démonstration célèbre, Anthropic a trouvé le motif du Golden
Gate Bridge et l’a amplifié, ce qui a donné « [Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude) »,
qui ramenait le pont dans chaque réponse. Les mêmes travaux ont trouvé des motifs liés à des choses comme la tromperie
([Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)), et des travaux plus récents
retracent comment le programme avance dans un problème étape par étape
([Tracing the thoughts of a language model](https://www.anthropic.com/research/tracing-thoughts-language-model)). Ce
domaine s’appelle l’*[interprétabilité](https://fr.wikipedia.org/wiki/Interpr%C3%A9tabilit%C3%A9_m%C3%A9caniste)*. Ce sont des
travaux débutants, et c’est l’un des principaux moyens par lesquels on espère vérifier ce que ces programmes font
vraiment.

**Certains programmes s’en aperçoivent un peu.** Des chercheurs d’Anthropic ont trouvé que Claude peut parfois détecter
une idée implantée artificiellement dans son propre traitement, mais seulement parfois
([Emergent introspective awareness](https://transformer-circuits.pub/2025/introspection/index.html)). Sa connaissance de
lui-même est réelle mais peu fiable.
