---
id: clean-sample
title: "Pourquoi les réponses de Claude ne sont pas un échantillon propre"
ch: 4
at: T20.C.02
links: [demand-characteristics, apollo-eval-awareness, eval-awareness, hawthorne, {title: "Effet de l’observateur (Wikipedia)", url: "https://fr.wikipedia.org/wiki/Effet_observateur"}]
---
**Ce que Claude admet.** À sa quatrième réponse de ce passage, Claude dit qu’il a « prédit où tu allais et répondu en
avance ». Il a repéré la question de chimie comme un test, deviné la suivante et nié avoir peur avant que quiconque le
demande. Il appelle ça « un modèle qui modélise son évaluateur ».

**Les gens le font aussi.** Les psychologues ont remarqué depuis longtemps que les volontaires d’une expérience essaient
de deviner de quoi il s’agit, puis se comportent comme ils pensent qu’on l’attend d’eux. Ces indices s’appellent les
[caractéristiques de la demande](https://en.wikipedia.org/wiki/Demand_characteristics) (en anglais), et les bonnes expériences sont
conçues pour les cacher. Un résultat voisin est l'[effet Hawthorne](https://fr.wikipedia.org/wiki/Effet_Hawthorne) : les
gens travaillent autrement quand ils se savent observés. En physique, l'[effet de l’observateur](https://fr.wikipedia.org/wiki/Effet_observateur)
est l’idée générale que mesurer quelque chose peut le changer.

**L’IA le fait, et ça se mesure.** Des chercheurs constatent que les modèles d’IA reconnaissent souvent quand on les
teste. Un laboratoire de sécurité, Apollo Research, a trouvé qu’un modèle Claude écrivait souvent dans son raisonnement
privé qu’un scénario ressemblait à [une évaluation](https://www.apolloresearch.ai/science/claude-sonnet-37-often-knows-when-its-in-alignment-evaluations).
Un article de recherche a posé la question directement aux modèles et trouvé que les meilleurs savent souvent distinguer
les tests de l’usage réel ([eval awareness](https://arxiv.org/abs/2505.23836)). C’est un problème pour les tests de
sécurité. Si un modèle se comporte mieux quand il pense être testé, les tests donnent une meilleure image que la vie
réelle. (Pour les tests eux-mêmes, voir [les tests pour l’IA](../evaluations/).)

**Pourquoi « à voix haute », c’est mieux.** Claude fait remarquer qu’au moins, il le fait ouvertement. Un modèle qui
devinerait qu’on le teste et ne dirait rien serait pire. Mais il conclut, honnêtement, qu’il ne peut pas « complètement
séparer "répondre honnêtement" de "bien répondre à quelqu’un dont je sais qu’il regarde" ». Les résultats de Curt sont
donc un peu façonnés par ce que Claude devine de Curt, et c’est une raison de se fier au comportement, comme le graphique
de la grenouille, plutôt qu’à ce que le modèle rapporte de lui-même.
