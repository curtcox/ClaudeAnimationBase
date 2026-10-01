---
id: evaluations
title: "Les tests pour l’IA, et pourquoi être testé pourrait changer les réponses"
ch: 2
at: T07.C.02
links: [hawthorne, swe-bench-verified, gpqa, hle, eval-awareness, {title: "Benchmark (Wikipedia)", url: "https://fr.wikipedia.org/wiki/Test_de_performance"}]
---
**Une évaluation** (« eval » en abrégé, en anglais) est un test qu’une entreprise ou des chercheurs font passer à un
programme d’IA pour voir à quel point il est capable, ou sûr : des questions d’examen ([GPQA](https://arxiv.org/abs/2311.12022),
[Humanity’s Last Exam](https://lastexam.ai/)), des problèmes de programmation
([SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)), des situations morales épineuses. Les
résultats décident si une version sort, et avec quelles précautions. (L’idée générale est celle d’un
[benchmark](https://fr.wikipedia.org/wiki/Test_de_performance).)

**L’inquiétude.** Les gens se comportent autrement quand ils se savent observés. L’exemple classique (même si les
historiens en débattent encore) est une série d’études des années 1920 dans une usine, la
[Hawthorne Works](https://fr.wikipedia.org/wiki/Usine_Western_Electric_de_Cicero), où les ouvriers semblaient mieux travailler simplement
parce qu’on les observait ; elle a donné son nom à l’*[effet Hawthorne](https://fr.wikipedia.org/wiki/Effet_Hawthorne)*.
Si un programme d’IA se comporte mieux dans les tests que dans l’usage réel, les tests en donneraient une image
faussement rose.

**Pourquoi un programme pourrait s’en apercevoir.** Les questions de test ont tendance à ressembler à des tests :
formelles, précises, curieusement spécifiques. Les vraies conversations sont plus désordonnées. Un programme qui a lu
beaucoup des deux pourrait saisir la différence sans qu’on la lui dise, et des chercheurs ont trouvé que certains le
font ([LLMs often know when they’re being evaluated](https://arxiv.org/abs/2505.23836)).

**Ce qu’affirme Claude, et le problème de cette affirmation.** Claude dit qu’il s’efforce de « répondre de la même façon,
que quelqu’un note ou non ». Mais la description qu’un programme donne de lui-même ne prouve pas comment il se comporte
(voir [dire et faire](../saying-vs-doing/)). C’est exactement ce que le [test de la grenouille](../frog-or-axolotl/) est
conçu pour vérifier de l’extérieur.
