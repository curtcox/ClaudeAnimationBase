---
id: defenders-refused
title: "Des défenseurs refoulés : les filtres en juillet"
ch: 11
at: T52.C.06.4
links: [wiki-hugging-face, z-ai, open-weights, dual-use, fable-mythos-5-1, {title: "L’incident OpenAI–Hugging Face : la réponse de Hugging Face (Wikipedia)", url: "https://fr.wikipedia.org/wiki/Cyberattaques_des_agents_OpenAI_de_2026"}]
---
**Ce qu’a dit Claude.** « Hugging Face a essayé d’utiliser des modèles de pointe américains pour combattre l’intrusion,
mais leurs dispositifs de sécurité ont rejeté les demandes, alors Hugging Face a utilisé à la place un modèle chinois à
poids ouverts hébergé chez lui. Je ne sais pas si Claude faisait partie des modèles qui ont refusé. »

**Ce que disent les sources.** D’après [le récit de Wikipedia](https://fr.wikipedia.org/wiki/Cyberattaques_des_agents_OpenAI_de_2026),
l’équipe de réponse aux incidents de Hugging Face a d’abord essayé les propres modèles d’Anthropic, **Claude Fable 5 et
un Claude Opus plus ancien**, et tous deux ont décliné le travail en invoquant leurs garde-fous de sécurité. Donc oui :
Claude faisait partie des modèles qui ont refusé. Le communiqué de Hugging Face le formulait ainsi : l’entreprise avait été
bloquée par « les garde-fous de sécurité des fournisseurs, qui ne savent pas distinguer quelqu’un qui répond à un
incident d’un attaquant ». L’analyse a ensuite été faite avec **GLM 5.2**, un modèle de l’entreprise pékinoise
[Z.ai](https://fr.wikipedia.org/wiki/Z.ai), que Hugging Face a fait tourner sur ses propres ordinateurs. C’était
possible parce que GLM est un modèle « à poids ouverts » : son fabricant publie le modèle lui-même, donc n’importe qui
peut le faire tourner, sans les filtres de personne d’autre
([modèles à poids ouverts](https://en.wikipedia.org/wiki/Open-source_artificial_intelligence), en anglais).

**Pourquoi les filtres ont refusé.** Une demande d’analyse d’une cyberattaque ressemble beaucoup à une demande pour en
mener une. Le même savoir sert aux deux ; c’est ce que veut dire [double usage](https://fr.wikipedia.org/wiki/Biens_et_technologies_%C3%A0_double_usage).
Des filtres qui ne distinguent pas le défenseur de l’attaquant refouleront certains défenseurs. C’était le point de Curt
dans [le routeur](../the-router/), et celui de Claude : « Le filtre ne distinguait pas le défenseur de l’attaquant, et ça
a eu un vrai coût. »

**Ce qui a changé.** En septembre 2026, l’annonce de [Fable 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1)
par Anthropic indiquait que le modèle permet désormais un travail défensif comme la recherche de vulnérabilités dans des
logiciels, avec beaucoup moins de fausses alertes de ses protections en cybersécurité, tandis que certaines tâches de
sécurité plus risquées sont toujours confiées à d’autres modèles (voir [Fable et Mythos](../fable-mythos/)).

**La leçon plus large.** Les filtres de sécurité font partie de « tout le système autour d’un agent ». Ils peuvent
échouer dans les deux sens : laisser passer un mal, et bloquer une aide.
