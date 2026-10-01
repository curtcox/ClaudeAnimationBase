---
id: curts-work
title: "Le travail de Curt : 256t.org et hashbin.org"
ch: 3
at: T12.C.02
links: [256t, hashbin, content-addressable, {title: "Code source de 256t.org (GitHub)", url: "https://github.com/curtcox/256t.org"}, {title: "Code source de hashbin.org (GitHub)", url: "https://github.com/curtcox/hashbin.org"}, {title: "Fonction de hachage cryptographique (Wikipedia)", url: "https://fr.wikipedia.org/wiki/Fonction_de_hachage_cryptographique"}, {title: "Lien mort (Wikipedia)", url: "https://fr.wikipedia.org/wiki/Lien_mort"}]
---
**Qui est Curt, selon Claude.** Un ingénieur logiciel qui travaille surtout en
[Python](https://fr.wikipedia.org/wiki/Python_(langage)) et en
[Java](https://fr.wikipedia.org/wiki/Java_(langage)) (deux langages de programmation très répandus) et avec
[Flask](https://fr.wikipedia.org/wiki/Flask_(framework)) (une boîte à outils pour construire des sites web en
Python). Il construit des outils pour d’autres programmeurs, et des outils pour travailler avec l’IA. Il s’intéresse
aussi à la [sécurité de l’IA](https://fr.wikipedia.org/wiki/S%C3%BBret%C3%A9_des_intelligences_artificielles) et à la
[philosophie de l’esprit](https://fr.wikipedia.org/wiki/Philosophie_de_l'esprit).

**Le problème que ses projets résolvent.** Les liens du Web se cassent. Une page déménage ou un site ferme, et le lien
qu’on avait gardé ne mène plus nulle part. C’est ce qu’on appelle les [liens morts](https://fr.wikipedia.org/wiki/Lien_mort).
Une partie du problème, c’est qu’une adresse web ordinaire dit *où* se trouve quelque chose, pas *ce que* c’est.

**Nommer les choses par ce qu’elles sont.** Le remède s’appelle le
[stockage adressable par contenu](https://fr.wikipedia.org/wiki/Content_Addressed_Storage). On fait passer le fichier
dans une [fonction de hachage cryptographique](https://fr.wikipedia.org/wiki/Fonction_de_hachage_cryptographique), une recette
qui transforme n’importe quel fichier en un long code, comme une empreinte digitale. Le même fichier donne toujours le
même code, et changer ne serait-ce qu’une lettre en donne un complètement différent. On peut donc utiliser le code
lui-même comme nom du fichier. Quiconque détient le code peut aller chercher le fichier n’importe où, et vérifier que
c’est exactement ce que le code promettait. C’est comme une bibliothèque où la cote d’un livre serait calculée à partir
de chacun de ses mots : on ne peut pas vous tendre le mauvais livre.

**[256t.org](https://256t.org)** est le standard ouvert et simple de Curt pour ces codes. Il utilise le hachage SHA-512,
écrit comme une chaîne de 94 lettres et chiffres qui tient dans une adresse web, et il est fourni avec des exemples qui
fonctionnent dans plus de 50 langages de programmation ([code source](https://github.com/curtcox/256t.org)).

**[hashbin.org](https://hashbin.org)** est un service construit dessus. On paie un peu pour stocker quelque chose, on
reçoit son code 256t, et ensuite n’importe qui ayant le code peut le télécharger gratuitement, sans compte
([code source](https://github.com/curtcox/hashbin.org)).

**Pourquoi il en est question.** C’est ainsi que Claude répond à « Qui suis-je ? » : à partir de ce qui est associé au
compte de Curt (voir [comment Claude savait qui était Curt](../how-claude-knew/)). Puis il admet qu’une liste de projets,
ce n’est « pas une personne ».
