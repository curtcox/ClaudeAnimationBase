---
id: car-wash
title: "Le problème de la station de lavage, et la pensée rapide contre la pensée lente"
ch: 12
at: T58.C.03
links: [car-wash, thinking-fast-slow, dual-process, crt, reasoning-models, cot-faithfulness, {title: "Rationalisation (Wikipedia)", url: "https://fr.wikipedia.org/wiki/Rationalisation"}]
---
**L’énigme.** « Je veux laver ma voiture. La station de lavage est à 50 mètres. Je devrais y aller à pied ou en
voiture ? » Beaucoup de modèles d’IA ont répondu à pied, parce que c’est tout près
([le test de la station de lavage](https://opper.ai/blog/car-wash-test)). La réponse, c’est en voiture : la voiture doit
être là-bas.

**Pourquoi les modèles échouent.** Ce n’est pas une affaire de tokens (voir [les tokens](../tokens/)) : chaque mot est
ordinaire. C’est que « courte distance, donc à pied » est un schéma très fort, et qu’il l’emporte sur le vrai but, qui
est de déplacer la voiture. Les gens tombent dans le même genre de piège. Le plus connu est celui de
[la batte et la balle](https://fr.wikipedia.org/wiki/Test_de_r%C3%A9flexion_cognitive) : une batte et une balle coûtent
1,10 dollar ensemble, et la batte coûte 1,00 dollar de plus que la balle ; combien coûte la balle ? La plupart des gens
disent 10 cents. (C’est 5.)

**Système 1 et Système 2.** Curt demande si c’est de la « pensée de type 1 ». Les psychologues décrivent deux modes
([la théorie des deux processus](https://en.wikipedia.org/wiki/Dual_process_theory), en anglais) : le *Système 1*, rapide,
automatique, guidé par les schémas, et le *Système 2*, lent, laborieux, qui vérifie, rendus célèbres par le livre de
Daniel Kahneman [*Système 1 / Système 2*](https://fr.wikipedia.org/wiki/Syst%C3%A8me_1_/_Syst%C3%A8me_2_:_Les_deux_vitesses_de_la_pens%C3%A9e). Claude dit que
l’analogie tient bien : chaque token qu’il produit est « une seule passe rapide, sans délibération à l’intérieur ».
C’est le Système 1.

**D’où vient le Système 2.** De penser à voix haute : avancer dans un problème étape par étape avant de répondre, soit
dans une étape de « raisonnement » cachée, soit sur la page. Les modèles conçus pour ça s’appellent des
[modèles de raisonnement](https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_langage_de_raisonnement). Ça aide, mais « ce n’est pas un
remède. Exactement comme les gens, je peux raisonner longuement et finir quand même par rationaliser la première réponse
qui m’est venue » ([rationalisation](https://fr.wikipedia.org/wiki/Rationalisation)). Anthropic a trouvé
que le raisonnement écrit d’un modèle ne reflète pas toujours ce qui a vraiment déterminé sa réponse
([reasoning models don’t always say what they think](https://www.anthropic.com/research/reasoning-models-dont-say-think)).
