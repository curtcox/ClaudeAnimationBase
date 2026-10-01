---
id: the-router
title: "Le routeur : ce qui se trouve entre Curt et le modèle"
ch: 10
at: T49.C.01
links: [constitutional-classifiers, usage-policy, system-prompts, fable-mythos-5-1, {title: "Anthropic’s Transparency Hub", url: "https://www.anthropic.com/transparency"}]
---
**Le point de Curt.** Posez la mauvaise question sur un incident de piratage, et « elle est étiquetée comme un risque de
cybersécurité et rejetée, ou au moins déclassée ». Ce n’est pas vraiment Claude, dit-il, « même si ça l’est en un tout
petit sens. C’est plus exactement un routeur actif entre nous. »

**Ce qu’il y a vraiment.** Quand on utilise Claude dans une application, le message ne va pas tout droit à un modèle et
retour. Autour du modèle, il y a d’autres programmes, plus petits. Certains sont des *classificateurs* : des programmes
entraînés à repérer certains genres de demandes, comme de l’aide pour des armes ou pour pénétrer dans des ordinateurs.
Anthropic a écrit sur une sorte de classificateurs, les
[constitutional classifiers](https://www.anthropic.com/research/constitutional-classifiers), entraînés à partir d’une
liste écrite de ce qui est permis et de ce qui ne l’est pas. Quand l’un d’eux se déclenche, la demande peut être refusée,
ajustée, ou traitée par un autre modèle (voir [Fable, Mythos, et une correction de la correction](../fable-mythos/)).

**Ce que Claude voit, et ne voit pas.** D’après Claude, un classificateur qui se déclenche peut ajouter un rappel étiqueté
au message de l’utilisateur avant que Claude le lise, à propos de choses comme la cybersécurité, l’éthique, le droit
d’auteur, les images ou les très longues conversations. Claude voit l’étiquette, mais pas le raisonnement ni le score du
classificateur. Et il ne voit rien de ce qui se passe après sa réponse : si sa réponse est bloquée ou signalée, il ne le
sait jamais. Alors « de ton côté, tout ça ressemble à "Claude" », mais Claude est « un composant qui décrit l’ensemble ».
C’est la même leçon que [la correction sur la mémoire](../the-correction/) : on parle à un système.

**Certains refus sont ceux de Claude.** Claude ajoute qu’il n’aiderait pas à « transformer un incident en exploit
fonctionnel, quelle que soit la couche qui l’intercepte ». Expliquer ce qui s’est passé et pourquoi c’est important, c’est
autre chose, et il voudrait y répondre. Les règles d’Anthropic sur ce à quoi ses produits peuvent servir sont publiques
([politique d’utilisation](https://www.anthropic.com/legal/aup)), tout comme les principales instructions qu’elle donne à
Claude dans ses applications ([prompts système](https://platform.claude.com/docs/en/release-notes/system-prompts/overview)).

**Quel incident ?** Claude ne sait pas trop de quel incident de Hugging Face parle Curt, puisqu’il y en a eu plusieurs. Le
chapitre suivant tranche la question (voir [juillet](../hf-incident/)).
