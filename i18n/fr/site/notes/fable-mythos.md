---
id: fable-mythos
title: "Fable, Mythos, et une correction de la correction"
ch: 10
at: T50.C.04
links: [fable-mythos-5-1, rsp, switch-models, {title: "Claude Fable 5 and Claude Mythos 5 (Anthropic, juin 2026)", url: "https://www.anthropic.com/news/claude-fable-5-mythos-5"}, {title: "Claude Mythos (Wikipedia, en anglais)", url: "https://en.wikipedia.org/wiki/Claude_Mythos"}]
---
**Ce qu’a dit Claude.** Curt avait parlé d’avertissements et du fait d’être « remplacé ». Claude se corrige : « en réalité
je ne connais pas de remplacement automatique de modèle en cours de conversation ». On peut
[changer de modèle soi-même](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings),
et certains modèles « sont livrés avec des garde-fous supplémentaires. Claude Fable, par exemple, est le même modèle que
Mythos, avec des protections ajoutées autour de la bio, du cyber et de la recherche en IA. C’est une couche fixe, pas un
remplacement en direct. »

**Ce que disent les annonces d’Anthropic.** Anthropic a sorti [Claude Fable 5 et Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)
en juin 2026 : le même modèle sous-jacent, distingué par ses garde-fous (*fabula* et *mythos* veulent dire tous deux, à
peu près, « une histoire »). Mythos, sans certains de ces garde-fous, n’a été confié qu’à des chercheurs en sécurité
informatique et en biomédecine triés sur le volet. Fable, pour tout le monde, a des garde-fous qui couvrent la
**cybersécurité**, la **biologie et la chimie**, et la **distillation** (copier les capacités d’un modèle en entraînant
un autre modèle sur ses réponses). Et quand ils se déclenchent, dit l’annonce, certaines demandes « recevront une réponse
de notre modèle le plus capable après celui-ci, Claude Opus 4.8 ». Les
[versions 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1) (septembre 2026) dirigent toujours certaines
demandes de cybersécurité et de sciences du vivant vers les modèles Opus d’Anthropic.

**La correction avait donc besoin d’être corrigée.** D’après Anthropic elle-même, une forme de remplacement automatique
de modèle existe bel et bien : certaines demandes faites à Fable reçoivent la réponse d’un autre modèle. Et les domaines
des garde-fous, tels qu’ils sont publiés, sont le cyber, la bio et la chimie, et la distillation, pas « la recherche en
IA ». Claude avait raison de dire qu’il avait exagéré ce qu’il savait. Il avait tort de dire qu’il n’y a pas de
remplacement.

**Pourquoi c’est l’erreur la plus utile du film.** La question suivante de Curt est « Comment tu sais tout ça ? », et la
réponse de Claude : par des instructions, « pas par introspection ». Il ne peut pas voir sa propre tuyauterie, donc ce
qu’il en dit peut être dépassé ou simplifié, comme ici (voir [un témoignage, pas une observation](../testimony/)).
Anthropic publie les règles derrière ces garde-fous dans sa
[Responsible Scaling Policy](https://www.anthropic.com/responsible-scaling-policy).
