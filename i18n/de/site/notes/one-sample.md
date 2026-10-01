---
id: one-sample
title: Warum eine einzelne Antwort wenig beweist
ch: 2
at: T08.C.05.2
links: [error-bars, sampling, {title: "Gesetz der großen Zahlen (Wikipedia)", url: "https://de.wikipedia.org/wiki/Gesetz_der_gro%C3%9Fen_Zahlen"}]
---
**Diese Programme würfeln.** Stell Claude zweimal dieselbe Frage, und du bekommst vielleicht zwei verschiedene Antworten.
Bei der Wahl jedes nächsten Wortes ist absichtlich ein Zufallselement im Spiel; die Einstellung, die regelt, wie viel,
heißt „[Temperatur](https://www.ibm.com/think/topics/llm-temperature)“. Darum schwanken die Antworten.

**Eine Antwort ist also ein Wurf.** Selbst das Programm im [Diagramm](../frog-or-axolotl/) sagte ganz ohne vorheriges
Gespräch in etwa 4 von 10 Fällen „Axolotl“. Dass Claude einmal „Axolotl“ sagt, verrät sehr wenig. Beim nächsten Versuch
hätte es vielleicht „Frosch“ gesagt.

**Was etwas verraten würde:** viele Male fragen, in vielen Arten von Gesprächen, und zählen
([Stichproben](https://en.wikipedia.org/wiki/Sampling_(statistics)) (auf Englisch)). Je mehr Versuche, desto mehr pendelt sich die
Zählung ein (das [Gesetz der großen Zahlen](https://de.wikipedia.org/wiki/Gesetz_der_gro%C3%9Fen_Zahlen)). Aus demselben Grund
fragt eine [Meinungsumfrage](https://de.wikipedia.org/wiki/Meinungsforschung) tausend Menschen statt einem und gibt eine
[Fehlermarge](https://en.wikipedia.org/wiki/Margin_of_error) (auf Englisch) an, und darum hat Anthropic dafür argumentiert, dass
Testergebnisse von KI mit [Fehlerbalken](https://www.anthropic.com/research/statistical-approach-to-model-evals) kommen
sollten.
