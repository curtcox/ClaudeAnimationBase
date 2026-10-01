---
id: rsi
title: "La RSI : une IA qui s’améliore elle-même"
ch: 13
at: T63.C.04
links: [rsi-wiki, arxiv-aide2, arxiv-bounded, anthropic-rsi, mittr-rsi, datacamp-rsi, coxon-resigns]
---
**La question.** « RSI by EOY? » veut dire : verra-t-on une *recursive self-improvement*, une auto-amélioration
récursive, d’ici la fin de l’année ? La RSI, c’est un système d’IA qui s’améliore lui-même, chaque amélioration le rendant
meilleur pour faire la suivante ([Wikipedia](https://fr.wikipedia.org/wiki/Auto-am%C3%A9lioration_r%C3%A9cursive) ;
[un tutoriel simple](https://www.datacamp.com/tutorial/recursive-self-improvement)). C’est l’idée derrière le « foom »
(voir [le foom](../foom/)).

**La réponse de Claude : ça dépend de quelle RSI.**

**La RSI faible est déjà là.** Un article publié la semaine de cette conversation, [AIDE²](https://arxiv.org/abs/2609.26457),
décrit un agent de recherche en IA qui réécrit son propre code. Il se propose des modifications, les teste sur des tâches
de recherche et garde celles qui aident, et chaque version acceptée devient celle qu’on modifie ensuite. En 8 jours, il a
trouvé sept améliorations qui marchaient aussi sur de nouvelles tâches. Ce qu’il réécrit, c’est le code de l’agent
lui-même, le logiciel autour du modèle (ce que Claude appelle « le niveau du harnais » ; voir
[les harnais d’agent](../agent-harnesses/)), et non le modèle, qui n’est pas réentraîné. Le rapport d’Anthropic,
[*When AI builds itself*](https://www.anthropic.com/institute/recursive-self-improvement) (2026), décrit la part de son
propre développement en IA qu’elle confie déjà à Claude : plus de 80 % du code qu’elle intègre est écrit par Claude. Il
dit aussi que la boucle n’est pas encore bouclée, et que ce sont toujours des humains qui dirigent la recherche.

**La RSI forte est une boucle ouverte**, qui améliore les capacités plus vite que des humains ne le pourraient, avec peu de
supervision humaine. Claude la met à environ 5 % d’ici la fin de l’année. Une synthèse de juillet portant sur 1 250
articles ([From Bounded Self-Refinement to Autonomous Research Loops](https://arxiv.org/abs/2607.07663)) a trouvé de
telles boucles freinées par trois choses : elles ont besoin de signaux fiables de ce qui compte comme mieux (l’*ancrage*),
elles peuvent se dégrader en se nourrissant de leurs propres sorties (l’*effondrement*), et elles ont besoin de puissance
de calcul (le *calcul*). La [MIT Technology Review](https://www.technologyreview.com/2026/08/18/1142188/ai-recursive-self-improvement/)
rapportait en août que la RSI « n’arrivera peut-être pas si vite, après tout ».

**Le cas inquiétant se situe entre les deux** : des boucles faibles, de nombreuses copies, et des labos en pleine course.
En septembre 2026, un chercheur nommé Jacob Coxon a démissionné d’Anthropic en écrivant que les entreprises d’IA
« foncent droit vers une superintelligence capable de s’améliorer elle-même et jouent avec nos vies »
([TechCrunch](https://techcrunch.com/2026/09/09/gambling-with-our-lives-anthropic-researcher-quits-warns-against-self-improving-ai/)).

**Et un aveu.** « Je suis le modèle d’Anthropic, alors pondère mes 5 % en conséquence. »
