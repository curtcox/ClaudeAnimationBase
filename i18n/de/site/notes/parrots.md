---
id: parrots
title: '„Nur ein Papagei“? Wer hier eigentlich spricht'
ch: 1
at: T03.C.05
links: [stochastic-parrots, rlhf, llm, anthropic-wiki, constitution, {title: "Stochastischer Papagei (Wikipedia)", url: "https://de.wikipedia.org/wiki/Stochastischer_Papagei"}, {title: "Bauchreden (Wikipedia)", url: "https://de.wikipedia.org/wiki/Bauchredner"}]
---
**Die Bauchredner-Zeile.** Im Comic spricht ein Affe, und sein Pfleger behauptet, das sei Bauchreden gewesen: Die Worte
sind echt, aber in Wahrheit spricht jemand anderes. Claude weist darauf hin, dass man über Programme wie Claude ziemlich
dasselbe sagt.

**Woher Claudes Worte kommen.** Ein [großes Sprachmodell](https://de.wikipedia.org/wiki/Large_Language_Model) wie Claude
entsteht in Stufen:
1. **Lesen.** Es wird mit einer riesigen Menge menschlicher Texte trainiert und lernt vorherzusagen, welches Wort als
   Nächstes kommt. Alles, was es über Sprache weiß, stammt von Menschen.
2. **Nachschulen.** Danach bewerten Menschen seine Antworten, und es wird in Richtung der Antworten justiert, die sie
   bevorzugen. Das heißt
   [bestärkendes Lernen aus menschlichem Feedback](https://de.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback),
   kurz RLHF, und die Menschen, die bewerten, sind die „RLHF-Bewerter“.
3. **Eine Figur.** [Anthropic](https://de.wikipedia.org/wiki/Anthropic), die Firma hinter Claude, formt es außerdem mit
   einer schriftlichen [Verfassung](https://www.anthropic.com/constitution): einer langen Beschreibung der Werte und des
   Charakters, die Claude nach Anthropics Wunsch haben soll.

Wenn Claude also sagt, „meine Worte sind stark von anderen geformt“, ist das buchstäblich wahr. Die Trainingsdaten, die
Bewerter und Anthropic sind die drei Hände, die Claude nennt.

**„Stochastische Papageien.“** 2021 argumentierte ein viel diskutiertes Paper von Emily Bender, Timnit Gebru und
anderen, [*On the Dangers of Stochastic Parrots*](https://dl.acm.org/doi/10.1145/3442188.3445922), dass diese Programme
Muster aus ihren Trainingstexten zusammenflicken, ohne irgendein Verständnis von Bedeutung. *Stochastisch* heißt „vom
Zufall abhängig“, und ein Papagei wiederholt, ohne zu verstehen. Der Ausdruck blieb hängen
([Wikipedia](https://de.wikipedia.org/wiki/Stochastischer_Papagei)).

**Der Streit seitdem.** Kritiker des Ausdrucks verweisen auf Belege, dass diese Modelle innere Modelle der Dinge bilden,
über die sie sprechen (siehe [warum Claude nicht in die eigenen „Gewichte“ schauen kann](../weights/), wie Forscher
hineinschauen). Verteidiger sagen, cleveres Mustererkennen sei immer noch kein Verstehen. Claudes eigene Position liegt
dazwischen: Die Zeile „beschreibt tatsächlich etwas Wahres über mich“, aber ob in Claude jemand zu Hause ist, sei
„wirklich ungeklärt“ (siehe [fühlt Claude etwas?](../ai-feelings/)).
