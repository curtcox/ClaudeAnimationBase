---
id: tokens
title: "Les tokens : pourquoi Claude voit les fautes de frappe mais peine à compter les lettres"
ch: 12
at: T57.C.03
links: [tokenizers, bpe, solidgoldmagikarp, glitch-token, magikarp]
---
**Claude ne lit pas des lettres.** Avant qu’un texte n’atteigne un modèle comme Claude, il est découpé en morceaux appelés
*tokens* : les mots courants deviennent un seul morceau (« le », « matin »), les mots plus rares en deviennent plusieurs
(« ax », « olotl »). Le modèle ne voit jamais que les morceaux, sous forme de nombres. Les règles de découpage sont
apprises sur beaucoup de texte, souvent par une méthode appelée
[byte-pair encoding](https://fr.wikipedia.org/wiki/Byte_pair_encoding) ([une présentation accessible](https://huggingface.co/learn/llm-course/chapter2/4)).

**Alors repérer les fautes de frappe, c’est facile.** Un mot mal orthographié se découpe en morceaux inhabituels, et des
morceaux bizarres dans une phrase familière, ça se remarque, « comme entendre une fausse note dans une chanson qu’on
connaît sans lire la partition ». C’est comme ça que Claude a remarqué que Curt avait écrit « Magicarp », alors que le
Pokémon s’appelle [Magikarp](https://fr.wikipedia.org/wiki/Magicarpe_et_L%C3%A9viator), avec un k.

**Et compter les lettres, c’est difficile.** Demandez « combien de r y a-t-il dans *strawberry* ? » et un modèle voit
peut-être trois morceaux, pas dix lettres. Il n’a appris le contenu de chaque morceau qu’indirectement, et compter exige
une comptabilité lettre par lettre par-delà les morceaux. Pendant des années, les chatbots se sont trompés là-dessus, et
c’était devenu célèbre. La comparaison de Claude : « compter les e d’un mot qu’on n’a jamais vu que comme une forme
d’ensemble ». Les modèles plus récents font mieux, en partie en épelant d’abord le mot, puis en comptant.

**SolidGoldMagikarp, c’était autre chose.** En 2023, des chercheurs ont trouvé que demander à GPT-3 de répéter certains
mots étranges, comme « SolidGoldMagikarp », produisait des esquives, des insultes ou du charabia
([le billet d’origine](https://www.lesswrong.com/posts/aPeJE8bSo6rAFoLqg/solidgoldmagikarp-plus-prompt-generation)). La
cause : les règles de découpage avaient été construites sur des textes où ces chaînes étaient courantes (certaines étaient
des noms d’utilisateurs de Reddit), donc chacune avait reçu son propre token, mais le modèle lui-même ne les avait presque
jamais vues à l’entraînement. Il avait un token auquel n’était attaché pratiquement aucun sens, un « mot fantôme ». On les
appelle aujourd’hui des [glitch tokens](https://en.wikipedia.org/wiki/Glitch_token) (en anglais). Pas du tout un problème
d’orthographe : un trou dans le classement du dictionnaire.

[Note de la traduction : en français, le Pokémon s’appelle Magicarpe, si bien que la faute de Curt, « Magicarp », est
presque le nom français. *Strawberry* (fraise) est l’exemple anglais célèbre ; on le garde tel quel.]
