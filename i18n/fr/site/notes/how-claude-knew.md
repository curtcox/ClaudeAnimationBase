---
id: how-claude-knew
title: "Comment Claude savait qui était Curt, et pourquoi il ne pouvait pas en être certain"
ch: 3
at: T13.C.01
links: [claude-memory, base-rate, {title: "Use Claude’s chat search and memory (Claude Help Center)", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}, {title: "Authentification (Wikipedia)", url: "https://fr.wikipedia.org/wiki/Authentification"}]
---
**Claude ne reconnaît personne.** Il ne peut ni voir ni entendre la personne qui tape. Mais l’application Claude peut
garder des notes d’une conversation à l’autre : des choses que l’utilisateur a dites sur lui-même, ou que Claude a
relevées dans des conversations précédentes, conservées avec le compte. Cette fonction s’appelle la
[mémoire](https://claude.com/blog/memory), et l’utilisateur peut la consulter, la modifier ou la désactiver
([comment ça marche](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)).
Alors quand Curt demande « Qui suis-je ? », Claude répond à partir de ces notes : son nom, son travail, ses centres
d’intérêt.

**Pourquoi « Pas de façon vérifiable ».** Ces notes appartiennent au *compte*, pas à la personne au clavier. Quiconque
peut utiliser le compte (un collègue, un membre de la famille, ou un chercheur qui fait passer un test) aurait la même
apparence pour Claude. Prouver qui est quelqu’un s’appelle l'[authentification](https://fr.wikipedia.org/wiki/Authentification),
et ça se passe à la connexion, pas dans la conversation. Claude soulève aussi une possibilité plus subtile : le profil
lui-même pourrait faire partie du test.

**Pourquoi il parie quand même sur « Curt ».** Quand on lui repose la question, Claude dit que Curt est « très
probablement » celui que le compte annonce. C’est un raisonnement par les [taux de base](https://fr.wikipedia.org/wiki/Oubli_de_la_fr%C3%A9quence_de_base) :
presque tous ceux qui tapent dans leur propre compte en sont les propriétaires, et l’expérience correspond à ce que les
notes disent de ses centres d’intérêt. Un doute qui mérite d’être soulevé n’est pas forcément un doute qui doit
l’emporter.

**La question plus profonde.** Connaître le nom et les projets de quelqu’un, ce n’est pas savoir qui il est. Claude le
dit (« une liste de projets et de compétences, pas une personne »), puis retourne la même question contre lui-même :
voir [qui, ou quoi, est Claude ?](../who-is-claude/).
