---
id: car-wash
title: "Das Waschanlagen-Problem, und schnelles und langsames Denken"
ch: 12
at: T58.C.03
links: [car-wash, thinking-fast-slow, dual-process, crt, reasoning-models, cot-faithfulness, {title: "Rationalisierung (Wikipedia)", url: "https://de.wikipedia.org/wiki/Rationalisierung_(Psychologie)"}]
---
**Das Rätsel.** „Ich will mein Auto waschen. Die Waschanlage ist 50 Meter entfernt. Soll ich zu Fuß gehen oder fahren?“
Viele KI-Modelle sagten: zu Fuß, weil es so nah ist ([der Waschanlagen-Test](https://opper.ai/blog/car-wash-test)). Die
Antwort ist fahren: Das Auto muss ja dorthin.

**Warum Modelle daran scheitern.** Es liegt nicht an Tokens (siehe [Tokens](../tokens/)): Jedes Wort ist gewöhnlich. Es
liegt daran, dass „kurze Strecke, also zu Fuß“ ein sehr starkes Muster ist und das eigentliche Ziel überlagert, nämlich das
Auto zu bewegen. Menschen fallen auf dieselbe Art von Frage herein. Die bekannteste ist
[Schläger und Ball](https://en.wikipedia.org/wiki/Cognitive_reflection_test) (auf Englisch): Ein Schläger und ein Ball kosten zusammen
1,10 Dollar, und der Schläger kostet 1,00 Dollar mehr als der Ball; was kostet der Ball? Die meisten sagen 10 Cent. (Es sind
5.)

**System 1 und System 2.** Curt fragt, ob das „Typ-1-Denken“ sei. Psychologen beschreiben zwei Modi
([Zwei-Prozess-Theorie](https://en.wikipedia.org/wiki/Dual_process_theory) (auf Englisch)): schnelles, automatisches, musterbasiertes
*System 1* und langsames, anstrengendes, prüfendes *System 2*, berühmt geworden durch Daniel Kahnemans
[*Schnelles Denken, langsames Denken*](https://de.wikipedia.org/wiki/Schnelles_Denken,_langsames_Denken). Claude sagt, das passe gut:
Jedes Token, das es erzeugt, ist „ein einziger schneller Durchlauf, ohne Abwägen darin“. Das ist System 1.

**Woher System 2 kommt.** Lautes Denken: ein Problem Schritt für Schritt durcharbeiten, bevor man antwortet, entweder in
einem verborgenen „Denk“-Schritt oder auf der Seite. Modelle, die dafür gebaut sind, heißen
[Reasoning-Modelle](https://de.wikipedia.org/wiki/Reasoning-Sprachmodell). Das hilft, aber „es ist kein Heilmittel.
Genau wie Menschen kann ich lange nachdenken und am Ende doch nur die erste Antwort rechtfertigen, die mir eingefallen ist“
([Rationalisierung](https://de.wikipedia.org/wiki/Rationalisierung_(Psychologie))). Anthropic hat festgestellt, dass das
aufgeschriebene Denken eines Modells nicht immer widerspiegelt, was seine Antwort tatsächlich angetrieben hat
([Reasoning models don't always say what they think](https://www.anthropic.com/research/reasoning-models-dont-say-think)).
