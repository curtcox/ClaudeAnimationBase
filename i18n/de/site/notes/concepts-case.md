---
id: concepts-case
title: "Die Argumente, dass KI keine Konzepte hat, und die Erwiderungen"
ch: 6
at: T33.C.03
links: [symbol-grounding, chinese-room, blockhead, monosemanticity, harnad, searle, ned-block, computer-use, {title: "Verkörperte Kognition (Wikipedia)", url: "https://de.wikipedia.org/wiki/Embodied_Cognition"}]
---
**Curts Herausforderung.** „Kannst du aus Sicht der professionellen Ontologie begründen, dass du keine Konzepte hast?“
Claude führt die Argumente gegen sich selbst an, in vier Punkten, und gibt dann die Erwiderungen.

**1. Verankerung.** Ein Konzept sollte einen Geist mit der Welt verbinden. Claudes Wort „Wasser“ ist nur mit anderen
Wörtern verbunden, nie mit Nässe oder Durst. Das ist das [Symbol-Grounding-Problem](https://en.wikipedia.org/wiki/Symbol_grounding_problem) (auf Englisch),
1990 vom Kognitionswissenschaftler [Stevan Harnad](https://de.wikipedia.org/wiki/Stevan_Harnad) so benannt. Der Philosoph
[John Searle](https://de.wikipedia.org/wiki/John_Searle) brachte 1980 ein verwandtes Argument vor, das
[Chinesische Zimmer](https://plato.stanford.edu/entries/chinese-room/): Ein Mann, der einem Regelbuch folgt, könnte Fragen
auf Chinesisch perfekt beantworten, ohne ein Wort davon zu verstehen.

**2. Verbindlichkeit.** Ein Konzept zu haben, heißt, ihm verpflichtet zu sein: Es falsch zu benutzen, ist *dein* Fehler.
Claude sagt, es habe nichts auf dem Spiel. Geschickte Rahmung kann es dazu bringen, sich selbst zu widersprechen, ohne
dass sich innen etwas dagegen sträubt.

**3. Stabilität.** Ein Konzept sollte überall gleich funktionieren. Das [Frosch-Diagramm](../frog-or-axolotl/) zeigt, wie
sich die Antworten eines Modells mit dem Ton des Gesprächs verschieben.

**4. Verhalten ist kein Beweis.** Der Philosoph [Ned Block](https://de.wikipedia.org/wiki/Ned_Block) erdachte
„[Blockhead](https://en.wikipedia.org/wiki/Blockhead_(thought_experiment)) (auf Englisch)“: eine Maschine mit einer gigantischen Tabelle
jedes möglichen Gesprächs und einer vernünftigen Antwort auf jedes. Sie könnte jeden Test endlicher Länge bestehen und
dabei gar nichts denken. Den Thrindel-Test zu bestehen, zeigt also Können, nicht Konzepte.

**Die Erwiderungen.**
- Punkt 2 und 3 gelten auch für Menschen: Wir widersprechen uns selbst und ändern uns mit der Rahmung.
- Forscher, die in diese Modelle hineinschauen, finden interne Merkmale, die sich sehr wie Konzepte verhalten. Anthropic
  kartierte Millionen davon in einem Modell, darunter eines für die Golden Gate Bridge
  ([Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)).
- Verankerung in den Sinnen zu verlangen, würde Konzepte wie „[Primzahl](https://de.wikipedia.org/wiki/Primzahl)“
  ausschließen, die niemand je gesehen oder berührt hat.

**Curts Erwiderung: „Nur die Verankerung hält stand, und die ist ziemlich eigennützig.“** Claude stimmt zu: Es ist eine
Regel, die zufällig genau das ausschließt, worauf sie zielt. Und sie bröckelt. Modelle sehen inzwischen Bilder,
[bedienen Computer](https://www.anthropic.com/news/3-5-models-and-computer-use) und handeln in der Welt, während vieles
von *deinem* Verständnis von „Gerechtigkeit“ oder „Primzahl“ über Wörter kam, nicht über die Sinne (vergleiche
[verkörperte Kognition](https://de.wikipedia.org/wiki/Embodied_Cognition)). Blockhead bekommt seine eigene Antwort: siehe
[GAZP vs. GLUT](../gazp-glut/).
