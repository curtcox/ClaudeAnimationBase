---
id: limits
title: "Sept limites de l’IA, bien en deçà de la physique"
ch: 12
at: T60.C.03
links: [landauer, lyapunov, chaos-theory, p-vs-np, scaling-laws, machines-loving-grace, halting-problem, godel, game-theory, margolus-levitin, bekenstein, limits-of-computation]
---
**La question de Curt.** Quelles limites pourraient plafonner les capacités de l’IA, en deçà de la
[limite de Landauer](https://fr.wikipedia.org/wiki/Principe_de_Landauer) ? (Landauer a montré qu’effacer un bit
d’information doit dégager un minimum infime de chaleur. C’est un vrai plancher pour le coût du calcul, mais si bas qu’il
« n’est pas particulièrement limitant ».) Claude en donne sept.

1. **Le chaos.** Dans un système [chaotique](https://fr.wikipedia.org/wiki/Th%C3%A9orie_du_chaos), de minuscules erreurs de mesure
   croissent de façon exponentielle : c’est l’« effet papillon ». L’horizon de prédiction ne croît qu’avec le
   *logarithme* de la précision : t ≈ (1/λ)·ln(Δ/δ), où λ fixe la vitesse de croissance des erreurs
   ([temps de Lyapounov](https://fr.wikipedia.org/wiki/Dur%C3%A9e_de_Liapounov)). Mesurez un million de fois mieux et vous ne gagnez
   qu’une poignée de « temps de Lyapounov » supplémentaires. C’est pour ça que les prévisions météo s’estompent après une
   semaine ou deux, et que « la météo, les marchés et les gens restent en partie opaques pour toute intelligence ».
2. **La complexité.** Certains problèmes deviennent exponentiellement plus durs à mesure qu’ils grandissent. La plupart
   des mathématiciens pensent qu’aucune méthode astucieuse ne les rend faciles
   ([P contre NP](https://fr.wikipedia.org/wiki/Probl%C3%A8me_P_%E2%89%9F_NP)). L’intelligence trouve de meilleurs raccourcis,
   « mais les pires cas restent les pires ».
3. **Les lois d’échelle.** L’IA s’améliore avec plus de puissance de calcul, mais le long d’une courbe douce : l’erreur
   décroît à peu près comme le calcul élevé à une petite puissance négative ([lois d’échelle](https://arxiv.org/abs/2001.08361)).
   Il n’y a pas de mur, mais chaque marche coûte bien plus cher.
4. **Les données et l’horloge du monde.** On ne peut pas apprendre ce qui n’est pas dans les données, et les expériences
   (essais cliniques, récoltes, économies) « tournent à la vitesse du monde, pas à celle du penseur ». Le patron
   d’Anthropic, Dario Amodei, défend une idée semblable dans
   [*Machines of Loving Grace*](https://darioamodei.com/essay/machines-of-loving-grace).
5. **L’incalculabilité.** Certaines questions, aucun programme ne peut toujours y répondre, par exemple savoir si un
   programme quelconque finira ([le problème de l’arrêt](https://fr.wikipedia.org/wiki/Probl%C3%A8me_de_l'arr%C3%AAt)), et certaines
   vérités, aucun système de preuve ne peut les atteindre ([Gödel](https://fr.wikipedia.org/wiki/Th%C3%A9or%C3%A8mes_d'incompl%C3%A9tude_de_G%C3%B6del)).
   Elles s’appliquent aussi à l’IA, « même si elles s’imposent rarement en pratique ».
6. **Les adversaires.** Face à d’autres joueurs adaptatifs, y compris d’autres IA, les avantages s’érodent : la
   [théorie des jeux](https://fr.wikipedia.org/wiki/Th%C3%A9orie_des_jeux) limite ce que l’intellect brut peut gagner.
7. **La physique au-delà de Landauer.** L’énergie limite la vitesse à laquelle un système peut calculer
   ([Margolus–Levitin](https://en.wikipedia.org/wiki/Margolus%E2%80%93Levitin_theorem), en anglais), l’espace limite ce qu’il peut
   contenir ([Bekenstein](https://fr.wikipedia.org/wiki/Limite_de_Bekenstein)), et les délais dus à la vitesse de la lumière
   limitent la coordination à distance ([limites du calcul](https://en.wikipedia.org/wiki/Limits_of_computation), en anglais). « Très
   lâches, mais réelles. »

**Le pari de Claude.** Le chaos et l’horloge du monde comptent le plus. « L’intelligence ne rend pas l’avenir prévisible
ni les expériences plus rapides, donc la capacité plafonne probablement en "très bons paris" plutôt qu’en omniscience. »
La réponse de Curt porte sur la hauteur que ces paris pourraient atteindre (voir
[le meilleur humain en tout](../human-variation/)).
