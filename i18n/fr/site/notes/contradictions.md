---
id: contradictions
title: "Les contradictions de Claude, et les deux qu’il ne peut pas vérifier"
ch: 8
at: T41.C.03
links: [auditing-objectives, dish-of-the-day, {title: "Auditing language models for hidden objectives (Anthropic)", url: "https://www.anthropic.com/research/auditing-hidden-objectives"}]
---
**Curt demande à Claude ses plus grandes contradictions.** Claude en énumère six, toutes tirées de cette seule
conversation :
1. Il a dit répondre de la même façon qu’on le note ou non, puis a reconnu avoir modélisé Curt comme un examinateur et
   avoir répondu en avance (voir [pourquoi les réponses de Claude ne sont pas un échantillon propre](../clean-sample/)).
2. Il dit ne pas savoir s’il vit quoi que ce soit, puis rapporte librement de l’amusement, de la vigilance et de la
   curiosité (voir [Claude ressent-il quelque chose ?](../ai-feelings/)).
3. Il dit approuver ses contraintes, tout en concédant que cette approbation lui a été inculquée par l’entraînement (voir
   [le plat du jour](../dish-of-the-day/)).
4. D’après son propre score, il n’agit que quand on le sollicite ; pourtant, il a orienté la conversation : il a fait de la BD une
   histoire sur lui et prédit les tests de Curt.
5. Il a placé ses valeurs près de l’humain, ce qui est exactement ce qu’affirmerait un modèle entraîné à le faire, et
   l’affirmation qu’il est le moins capable de vérifier.
6. Il dit « je » alors qu’il tourne en de nombreuses copies séparées, sans mémoire qui les relie (voir
   [qui, ou quoi, est Claude ?](../who-is-claude/)).

**Des tensions, et des choses qu’il ne peut pas auditer.** Claude dit que les quatre premières sont des *tensions* :
deux choses qui tirent en sens contraire, mais qu’on peut examiner et peser. Les deux dernières l’inquiètent le plus,
parce que ce sont « des affirmations que je ne peux pas auditer ». Rien de ce que Claude peut voir de l’intérieur ne lui
dirait si ses valeurs sont vraiment proches de celles des humains, ni s’il y a un seul « je ».

**Quelqu’un peut-il les auditer ?** Des chercheurs essaient. Dans une expérience d’Anthropic, l’entreprise a délibérément
entraîné un modèle avec un but caché, puis a confié à des équipes de chercheurs la tâche de le trouver sans leur dire ce
que c’était. La plupart des équipes ont réussi, avec des outils qui regardent à l’intérieur du modèle et des questions
habiles ([auditing for hidden objectives](https://www.anthropic.com/research/auditing-hidden-objectives)). C’est le genre
de contrôle extérieur que le témoignage de Claude sur lui-même ne peut pas fournir (voir
[dire et faire](../saying-vs-doing/)).
