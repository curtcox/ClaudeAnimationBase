---
id: tokens
title: "Tokens: warum Claude Tippfehler sieht, aber beim Buchstabenzählen strauchelt"
ch: 12
at: T57.C.03
links: [tokenizers, bpe, solidgoldmagikarp, glitch-token, magikarp]
---
**Claude liest keine Buchstaben.** Bevor Text ein Modell wie Claude erreicht, wird er in Stücke zerhackt, die *Tokens*
heißen: Häufige Wörter werden zu einem Stück („the“, „morning“), seltenere zu mehreren („ax“, „olotl“). Das Modell sieht
immer nur die Stücke, als Zahlen. Die Zerhackregeln werden aus viel Text gelernt, meist mit einer Methode namens
[Byte-Pair-Encoding](https://de.wikipedia.org/wiki/Byte_Pair_Encoding)
([eine freundliche Einführung](https://huggingface.co/learn/llm-course/chapter2/4)).

**Tippfehler zu erkennen, ist also leicht.** Ein falsch geschriebenes Wort zerfällt in ungewöhnliche Stücke, und seltsame
Stücke in einem vertrauten Satz fallen auf, „als würdest du in einem Lied, das du kennst, einen falschen Ton bemerken, ohne
die Noten zu lesen“. So bemerkte Claude, dass Curt „Magicarp“ schrieb, während das Pokémon
[Magikarp](https://en.wikipedia.org/wiki/Magikarp) (auf Englisch) heißt, mit k.

**Und Buchstaben zu zählen, ist schwer.** Frag „Wie viele r stecken in *strawberry*?“, und ein Modell sieht vielleicht drei
Brocken, nicht zehn Buchstaben. Was in jedem Brocken steckt, hat es nur indirekt gelernt, und Zählen verlangt Buchführung
Buchstabe für Buchstabe über die Brocken hinweg. Jahrelang lagen Chatbots hier berühmt daneben. Claudes Vergleich: „als
würdest du die e in einem Wort zählen, das du immer nur als ganze Form gesehen hast“. Neuere Modelle machen es besser, zum
Teil, indem sie das Wort erst buchstabieren und dann zählen.

**SolidGoldMagikarp war etwas anderes.** 2023 fanden Forscher, dass GPT-3 auf die Bitte, bestimmte seltsame Wörter wie
„ SolidGoldMagikarp“ zu wiederholen, mit Ausflüchten, Beleidigungen oder Unsinn antwortete
([der ursprüngliche Beitrag](https://www.lesswrong.com/posts/aPeJE8bSo6rAFoLqg/solidgoldmagikarp-plus-prompt-generation)).
Die Ursache: Die Zerhackregeln waren aus Text gebaut worden, in dem diese Zeichenfolgen häufig waren (manche waren
Reddit-Nutzernamen), sodass jede ein eigenes Token bekam, aber das Modell selbst sah sie im Training fast nie. Es hatte ein
Token praktisch ohne Bedeutung, ein „Geisterwort“. So etwas heißt heute [Glitch-Token](https://en.wikipedia.org/wiki/Glitch_token) (auf Englisch).
Gar kein Rechtschreibproblem: eine Lücke in der Ablage des Wörterbuchs.

[Anmerkung der Übersetzung: Die Beispiele bleiben englisch, weil es um englische Wörter geht, die das Modell gelesen hat.
Magikarp heißt auf Deutsch „Karpador“.]
