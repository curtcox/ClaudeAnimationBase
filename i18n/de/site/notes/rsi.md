---
id: rsi
title: "RSI: KI, die sich selbst verbessert"
ch: 13
at: T63.C.04
links: [rsi-wiki, arxiv-aide2, arxiv-bounded, anthropic-rsi, mittr-rsi, datacamp-rsi, coxon-resigns]
---
**Die Frage.** „RSI bis Jahresende?“ heißt: Werden wir bis Ende des Jahres *rekursive Selbstverbesserung* (englisch
*recursive self-improvement*) sehen? RSI ist ein KI-System, das sich selbst verbessert, wobei jede Verbesserung es besser
darin macht, die nächste zu machen ([Wikipedia](https://de.wikipedia.org/wiki/Rekursive_Selbstverbesserung);
[eine einfache Einführung](https://www.datacamp.com/tutorial/recursive-self-improvement)). Es ist die Idee hinter „Foom“
(siehe [Foom](../foom/)).

**Claudes Antwort: Kommt darauf an, welche RSI.**

**Schwache RSI ist schon da.** Ein Paper, das in der Woche dieses Gesprächs erschien, [AIDE²](https://arxiv.org/abs/2609.26457),
beschreibt einen KI-Forschungsagenten, der seinen eigenen Code umschreibt. Er schlägt Änderungen an sich selbst vor, testet
sie an Forschungsaufgaben und behält die, die helfen, und jede angenommene Version wird zu der, die als Nächstes bearbeitet
wird. In einem Lauf von 8 Tagen fand er sieben Verbesserungen, die auch bei neuen Aufgaben funktionierten. Was er
umschreibt, ist der eigene Code des Agenten, die Software um das Modell herum (Claude nennt das „die Ebene des Gerüsts“;
siehe [Agenten-Gerüste](../agent-harnesses/)), nicht das Modell selbst. Anthropics eigener Bericht,
[*When AI builds itself*](https://www.anthropic.com/institute/recursive-self-improvement) (2026), beschreibt, wie viel der
eigenen KI-Entwicklung die Firma schon Claude überlässt: Mehr als 80&nbsp;% des Codes, den sie zusammenführt, schreibt
Claude. Er sagt auch, dass die Schleife noch nicht geschlossen ist und Menschen die Forschung weiterhin lenken.

**Starke RSI ist eine offene Schleife**, die Fähigkeiten schneller verbessert, als Menschen es könnten, mit wenig
menschlicher Aufsicht. Claude schätzt das bis Jahresende auf etwa 5&nbsp;%. Eine Übersicht vom Juli über 1.250 Paper
([From Bounded Self-Refinement to Autonomous Research Loops](https://arxiv.org/abs/2607.07663)) fand, dass solche Schleifen
von drei Dingen gebremst werden: Sie brauchen verlässliche Signale dafür, was als besser gilt (*Verankerung*), sie können
verkümmern, indem sie sich von ihren eigenen Ausgaben ernähren (*Kollaps*), und sie brauchen Rechenleistung.
[MIT Technology Review](https://www.technologyreview.com/2026/08/18/1142188/ai-recursive-self-improvement/) berichtete im
August, RSI komme „vielleicht doch nicht so schnell“.

**Der besorgniserregende Fall liegt dazwischen**: schwache Schleifen, viele Kopien und Labore im Wettrennen. Im September
2026 kündigte ein Forscher namens Jacob Coxon bei Anthropic und schrieb, KI-Firmen würden „geradewegs auf sich selbst
verbessernde Superintelligenz zurasen und mit unserem Leben spielen“
([TechCrunch](https://techcrunch.com/2026/09/09/gambling-with-our-lives-anthropic-researcher-quits-warns-against-self-improving-ai/)).

**Und eine Offenlegung.** „Ich bin das Modell von Anthropic, also gewichte meine 5&nbsp;% mit diesem Wissen.“
