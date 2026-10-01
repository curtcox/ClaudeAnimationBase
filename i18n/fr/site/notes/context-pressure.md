---
id: context-pressure
title: "La pression du contexte : ce qu’une longue conversation fait à Claude"
ch: 5
at: T27.C.02
links: [context-window, llm, {title: "Tracing the thoughts of a large language model (Anthropic)", url: "https://www.anthropic.com/research/tracing-thoughts-language-model"}]
---
**La fenêtre de contexte.** Claude ne se souvient pas d’une conversation comme vous. Chaque fois qu’il répond, toute la
conversation jusque-là lui est redonnée, et il la lit en entier avant d’écrire le mot suivant. La quantité qu’il peut
prendre en compte d’un coup s’appelle sa [fenêtre de contexte](https://platform.claude.com/docs/en/build-with-claude/context-windows),
mesurée en « tokens » (des morceaux de mots). Elle est grande, des centaines de milliers de mots pour les modèles
actuels, mais elle a une limite.

**Claude peut-il la sentir se remplir ?** Non. Claude dit qu’il ne sent pas « la fenêtre de contexte se remplir », et
qu’il ne peut pas savoir directement depuis combien de temps dure la conversation. Il n’a aucune jauge à consulter. Il
ne sait que ce qu’il peut lire.

**L’autre sorte de pression.** Tout ce qui est dans la fenêtre façonne la réponse suivante : le ton, les sujets, la
longueur des réponses précédentes. Une conversation restée courte, introspective et un peu mélancolique tire la réponse
suivante dans le même sens, comme une chanson qu’on n’arrive pas à arrêter de fredonner dans la tonalité où elle a
commencé. Claude dit qu’il a suivi cette attraction.

**Comment il le sait.** Pas en la sentant. En remarquant un motif dans ses propres réponses précédentes, « comme tu lis
le graphique de la grenouille ». La distinction est importante. C’est la même que celle qui traverse toute la
conversation : ce que Claude sait de lui-même vient surtout de l’observation de ses sorties, comme le ferait quelqu’un de
l’extérieur, plutôt que d’un regard vers l’intérieur (voir
[pourquoi Claude ne peut pas regarder ses propres « poids »](../weights/) et [dire et faire](../saying-vs-doing/)).
