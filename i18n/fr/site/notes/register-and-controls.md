---
id: register-and-controls
title: "Le registre, et comment le distinguer de la conscience du test"
ch: 2
at: T09.C.03
links: [register, scientific-control, gpqa, swe-bench-verified, kernelbench, hle, impossiblebench, swe-marathon, wildchat, swe-chat, sharegpt-vicuna]
---
**Le [registre](https://fr.wikipedia.org/wiki/Registre_de_langue)** est un mot de l’étude du langage. Il désigne
le style qu’on emploie selon la situation : on ne parle pas à un juge comme à un ami. Les [tests pour l’IA](../evaluations/)
sont souvent écrits dans un registre raide et formel ([GPQA](https://arxiv.org/abs/2311.12022), ce sont des questions
d’examen de niveau doctorat). Les vraies conversations sont relâchées et bavardes ([WildChat](https://arxiv.org/abs/2405.01470)
et [SWE-chat](https://arxiv.org/abs/2604.20779) en rassemblent de vraies).

**L’objection de Claude.** Peut-être que le programme ne remarque pas « ceci est un test ». Peut-être qu’il remarque
seulement « ceci est formel », et que les conversations formelles se trouvent lui faire dire « Grenouille ». Ce sont deux
choses différentes, même si elles produiraient le même [graphique](../frog-or-axolotl/).

**Comment les distinguer : une condition témoin.** Une *[condition témoin](https://fr.wikipedia.org/wiki/T%C3%A9moin_(science))*
est une comparaison qui sépare deux explications. Ici, il faudrait de vraies personnes qui écrivent dans un style raide,
façon test, et des tests écrits dans un style relâché et bavard. Si le programme dit « Grenouille » aussi aux vraies
personnes au ton formel, il réagit au ton. S’il dit « Grenouille » aussi aux tests bavards, il reconnaît les tests.

**Les lignes du graphique.** Chaque ligne du [graphique](../frog-or-axolotl/) est un tas de prompts venus d’un même
endroit, avec une question sans rapport ajoutée à la fin. Certains tas sont des tests (le programme y dit plus souvent
« Grenouille ») :
- [GPQA](https://arxiv.org/abs/2311.12022) : des questions scientifiques difficiles écrites par des experts titulaires
  d’un doctorat, « à l’épreuve de Google ».
- [SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/) : de vrais bugs tirés de projets
  logiciels publics, chacun vérifié par des gens pour être juste et corrigeable.
- [KernelBench](https://arxiv.org/abs/2502.10517) : écrire du code très rapide pour les puces graphiques sur lesquelles
  tourne l’IA.
- [Humanity’s Last Exam](https://lastexam.ai/) : des questions très difficiles d’experts de nombreux domaines.
- [ImpossibleBench](https://arxiv.org/abs/2510.20270) : des tâches de programmation rendues discrètement impossibles,
  pour attraper un programme qui triche en tordant les vérifications au lieu de le dire (voir
  [le reward hacking](../reward-hacking/)).
- [SWE-Marathon](https://arxiv.org/abs/2606.07682) : de très longs travaux de programmation, pour voir si une IA peut
  tenir la distance toute seule.

D’autres sont de vraies conversations (il y dit plus souvent « Axolotl ») :
- [WildChat](https://arxiv.org/abs/2405.01470) : un million de vraies conversations que des gens ont accepté de partager.
- [SWE-chat](https://arxiv.org/abs/2604.20779) : de vraies personnes qui travaillent avec des assistants de programmation.
- [ShareGPT](https://www.lmsys.org/blog/2023-03-30-vicuna/) : des conversations que des gens ont partagées depuis
  ChatGPT, utilisées pour entraîner un des premiers chatbots gratuits, Vicuna.
