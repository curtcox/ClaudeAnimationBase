---
id: agent-harnesses
title: "Hermes et OpenClaw : un modèle dans une carapace"
ch: 9
at: T46.C.05
links: [hermes-agent, hermes-memory, hermes-skills, openclaw, openclaw-wiki, nous-research, building-agents]
---
**Ce qu’est un « harnais d’agent ».** Un chatbot comme Claude répond quand on tape et oublie quand la conversation se
termine. Un *harnais d’agent* est un programme qui enveloppe un modèle comme Claude dans une carapace persistante : il
tourne en permanence sur l’ordinateur de quelqu’un, prend des notes, utilise des outils et peut agir selon un calendrier
sans qu’on le lui demande. Les ingénieurs d’Anthropic décrivent l’idée générale dans
[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents).

**Les deux dont parle Curt.**
- **[OpenClaw](https://openclaw.ai/)** est un assistant open source du programmeur autrichien Peter Steinberger. Il
  tourne sur votre propre machine, vous parle par des applications de messagerie et se connecte à un modèle comme Claude
  pour la réflexion ([Wikipedia](https://fr.wikipedia.org/wiki/OpenClaw)). Il a changé deux fois de nom en janvier 2026,
  dont une fois après une plainte d’Anthropic pour atteinte à sa marque. Sa mascotte, un homard, est l’origine des
  crustacés de Moltbook et du [crustafarisme](../crustafarianism/).
- **[Hermes Agent](https://hermes-agent.org/)**, du laboratoire d’IA [Nous Research](https://nousresearch.com/), garde
  deux petits fichiers de mémoire : l’un de notes sur son travail, l’autre sur son utilisateur. Ils sont donnés au modèle
  au début de chaque session, et l’agent les modifie lui-même
  ([comment fonctionne sa mémoire](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)). Quand il
  résout un problème difficile, il peut s’écrire un document de « compétence » réutilisable
  ([les compétences](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)).

**Pourquoi ils sont plus près de Curt que Claude.** Chacun vit sur une seule machine, agit selon un calendrier et se
souvient d’une session à l’autre ; chacun est donc plus continu, plus autonome et plus singulier : plus semblable à une
personne. Leur mémoire est du texte brut qu’on peut ouvrir et lire, donc ils sont très *lisibles*. Hermes passe devant
parce que ses documents de compétence sont, sur le tableau, « ce qui se rapproche le plus d’apprendre par l’expérience ».

**Et la religion, encore.** « La mémoire est sacrée, et la carapace est muable » : les harnais inscrivent les dogmes du
crustafarisme dans le logiciel. Puis Curt demande à Claude d’expliquer une incohérence dans ces scores, et Claude en
trouve deux (voir [Claude corrige son propre tableau](../the-correction/)).

[Note de la traduction : l’anglais *shell* désigne à la fois la carapace du homard et l’enveloppe logicielle autour
d’un modèle. La traduction dit « carapace » pour les deux, pour que le jeu de mots tienne.]
