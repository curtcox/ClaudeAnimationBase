---
id: concepts-case
title: "L’argument selon lequel l’IA n’a pas de concepts, et les réponses"
ch: 6
at: T33.C.03
links: [symbol-grounding, chinese-room, blockhead, monosemanticity, harnad, searle, ned-block, computer-use, {title: "Cognition incarnée (Wikipedia)", url: "https://fr.wikipedia.org/wiki/Embodiment"}]
---
**Le défi de Curt.** « En tant qu’ontologue de métier, peux-tu justifier l’affirmation selon laquelle tu n’as pas de
concepts ? » Claude plaide contre lui-même, en quatre points, puis donne les réponses.

**1. L’ancrage.** Un concept devrait relier un esprit au monde. Le mot « eau » de Claude n’est relié qu’à d’autres mots,
jamais au mouillé ni à la soif. C’est le [problème de l’ancrage des symboles](https://fr.wikipedia.org/wiki/Ancrage_des_symboles),
nommé par le chercheur en sciences cognitives [Stevan Harnad](https://fr.wikipedia.org/wiki/Stevan_Harnad) en 1990. Le
philosophe [John Searle](https://fr.wikipedia.org/wiki/John_Searle) avait avancé un argument voisin en 1980, la
[chambre chinoise](https://plato.stanford.edu/entries/chinese-room/) : un homme qui suit un manuel de règles pourrait
répondre parfaitement à des questions en chinois sans en comprendre un mot.

**2. L’engagement.** Avoir un concept, c’est en répondre : le mal employer est *ton* erreur. Claude dit n’avoir rien en
jeu. Un cadrage habile peut le faire se contredire sans que rien à l’intérieur ne proteste.

**3. La stabilité.** Un concept devrait fonctionner de la même façon partout. Le [graphique de la grenouille](../frog-or-axolotl/)
montre les réponses d’un modèle qui changent avec le ton de la conversation.

**4. Le comportement n’est pas une preuve.** Le philosophe [Ned Block](https://fr.wikipedia.org/wiki/Ned_Block) a imaginé
« [Blockhead](https://en.wikipedia.org/wiki/Blockhead_(thought_experiment)) » (en anglais) : une machine qui contient une table
gigantesque de toutes les conversations possibles, avec une réponse sensée pour chacune. Elle pourrait réussir n’importe
quel test de longueur finie sans penser quoi que ce soit. Donc réussir le test du thrindle montre une compétence, pas des
concepts.

**Les réponses.**
- Les points 2 et 3 s’appliquent aussi aux gens : nous nous contredisons et changeons selon le cadrage.
- Les chercheurs qui regardent à l’intérieur de ces modèles trouvent des caractéristiques internes qui se comportent
  beaucoup comme des concepts. Anthropic en a cartographié des millions dans un modèle, dont une pour le Golden Gate
  Bridge ([Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)).
- Exiger un ancrage dans les sens disqualifierait des concepts comme « [nombre premier](https://fr.wikipedia.org/wiki/Nombre_premier) »,
  que personne n’a jamais vu ni touché.

**La réponse de Curt : « seul l’ancrage tient, et c’est un argument plutôt intéressé ».** Claude est d’accord : c’est une
règle qui se trouve exclure précisément ce qu’elle vise. Et elle s’effrite. Les modèles voient désormais des images,
[utilisent des ordinateurs](https://www.anthropic.com/news/3-5-models-and-computer-use) et agissent dans le monde, alors
qu’une bonne part de *ta* prise sur « justice » ou « premier » est venue par les mots, pas par les sens (comparer avec la
[cognition incarnée](https://fr.wikipedia.org/wiki/Embodiment)). Blockhead a sa propre réponse : voir
[GAZP vs. GLUT](../gazp-glut/).
