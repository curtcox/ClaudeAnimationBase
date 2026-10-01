---
id: limits
title: "Sieben Grenzen für KI, lange vor der Physik"
ch: 12
at: T60.C.03
links: [landauer, lyapunov, chaos-theory, p-vs-np, scaling-laws, machines-loving-grace, halting-problem, godel, game-theory, margolus-levitin, bekenstein, limits-of-computation]
---
**Curts Frage.** Welche Grenzen könnten die Fähigkeiten von KI deckeln, unterhalb der
[Landauer-Grenze](https://de.wikipedia.org/wiki/Landauer-Prinzip)? (Landauer zeigte, dass das Löschen eines Bits an
Information ein winziges Minimum an Wärme freisetzen muss. Das ist eine echte Untergrenze für die Kosten des Rechnens, aber
so niedrig, dass sie „nicht besonders begrenzend“ ist.) Claude nennt sieben.

1. **Chaos.** In einem [chaotischen](https://de.wikipedia.org/wiki/Chaosforschung) System wachsen winzige Messfehler
   exponentiell, der „Schmetterlingseffekt“. Wie weit man vorhersagen kann, wächst nur mit dem *Logarithmus* der eigenen
   Genauigkeit: t ≈ (1/λ)·ln(Δ/δ), wobei λ bestimmt, wie schnell Fehler wachsen
   ([Ljapunow-Zeit](https://en.wikipedia.org/wiki/Lyapunov_time) (auf Englisch)). Miss millionenfach genauer, und du gewinnst nur eine
   Handvoll zusätzlicher „Ljapunow-Zeiten“. Darum verblassen Wettervorhersagen nach ein, zwei Wochen, und darum „bleiben
   Wetter, Märkte und Menschen für jede Intelligenz teilweise undurchschaubar“.
2. **Komplexität.** Manche Probleme werden exponentiell schwerer, je größer sie werden. Die meisten Mathematiker glauben,
   dass keine clevere Methode sie leicht macht ([P gegen NP](https://de.wikipedia.org/wiki/P-NP-Problem)). Intelligenz
   findet bessere Abkürzungen, „aber die schlimmsten Fälle bleiben die schlimmsten“.
3. **Skalierungsgesetze.** KI wird mit mehr Rechenleistung besser, aber entlang einer sanften Kurve: Der Fehler fällt
   ungefähr wie die Rechenleistung hoch einer kleinen negativen Zahl ([Skalierungsgesetze](https://arxiv.org/abs/2001.08361)).
   Es gibt keine Wand, aber jede Stufe nach oben kostet ein Vielfaches.
4. **Daten und die Uhr der Welt.** Was nicht in den Daten steckt, kann man nicht lernen, und Experimente (klinische Studien,
   Ernten, Volkswirtschaften) „laufen im Tempo der Welt, nicht in dem des Denkenden“. Anthropics Chef Dario Amodei
   argumentiert ähnlich in [*Machines of Loving Grace*](https://darioamodei.com/essay/machines-of-loving-grace).
5. **Nichtberechenbarkeit.** Manche Fragen kann kein Programm immer beantworten, etwa ob irgendein Programm je fertig wird
   ([das Halteproblem](https://de.wikipedia.org/wiki/Halteproblem)), und manche Wahrheiten erreicht kein Beweissystem
   ([Gödel](https://de.wikipedia.org/wiki/G%C3%B6delscher_Unvollst%C3%A4ndigkeitssatz)). Sie gelten auch für KI, „auch wenn sie
   in der Praxis selten greifen“.
6. **Gegenspieler.** Gegen andere anpassungsfähige Mitspieler, auch andere KIs, schwinden Vorteile: Die
   [Spieltheorie](https://de.wikipedia.org/wiki/Spieltheorie) begrenzt, was reiner Intellekt gewinnen kann.
7. **Physik jenseits von Landauer.** Energie begrenzt, wie schnell ein System rechnen kann
   ([Margolus–Levitin](https://en.wikipedia.org/wiki/Margolus%E2%80%93Levitin_theorem) (auf Englisch)), Raum, wie viel es fassen kann
   ([Bekenstein](https://de.wikipedia.org/wiki/Bekenstein-Grenze)), und die Verzögerung durch die Lichtgeschwindigkeit
   begrenzt die Koordination über Entfernungen ([Grenzen des Rechnens](https://en.wikipedia.org/wiki/Limits_of_computation) (auf Englisch)).
   „Sehr locker, aber real.“

**Claudes Wette.** Chaos und die Uhr der Welt zählen am meisten. „Klugheit macht die Zukunft nicht vorhersagbar und
Experimente nicht schneller, also läuft Fähigkeit wahrscheinlich auf ‚sehr gute Wetten‘ hinaus statt auf Allwissenheit.“
Curts Antwort handelt davon, wie hoch diese Wetten gehen könnten (siehe [der beste Mensch in allem](../human-variation/)).
