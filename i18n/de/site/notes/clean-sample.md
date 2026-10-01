---
id: clean-sample
title: "Warum Claudes Antworten keine saubere Stichprobe sind"
ch: 4
at: T20.C.02
links: [demand-characteristics, apollo-eval-awareness, eval-awareness, hawthorne, {title: "Beobachtereffekt (Wikipedia, auf Englisch)", url: "https://en.wikipedia.org/wiki/Observer_effect"}]
---
**Was Claude zugibt.** In der vierten Antwort dieses Abschnitts sagt Claude, es habe „vorhergesagt, wohin du willst, und
vorab darauf geantwortet“. Es hat die Chemiefrage als Test erkannt, die nächste erraten und Angst abgestritten, bevor
jemand fragte. Claude nennt das „ein Modell, das sich ein Modell seines Prüfers macht“.

**Menschen tun das auch.** Psychologen haben längst bemerkt, dass Freiwillige in einem Experiment herauszufinden
versuchen, worum es geht, und sich dann so verhalten, wie sie glauben, dass es von ihnen erwartet wird. Diese Hinweise
heißen [Aufforderungscharakteristik](https://de.wikipedia.org/wiki/Demand_Characteristics) (englisch *demand
characteristics*), und gute Experimente sind so angelegt, dass sie sie verbergen. Ein verwandter Befund ist der
[Hawthorne-Effekt](https://de.wikipedia.org/wiki/Hawthorne-Effekt): Menschen arbeiten anders, wenn sie wissen, dass man
ihnen zusieht. In der Physik ist der [Beobachtereffekt](https://en.wikipedia.org/wiki/Observer_effect) (auf Englisch) die allgemeine
Idee, dass Messen etwas verändern kann.

**KI tut es messbar.** Forscher stellen fest, dass KI-Modelle oft erkennen, wann sie getestet werden. Ein Labor für
KI-Sicherheit, Apollo Research, fand, dass ein Claude-Modell in seinen privaten Überlegungen oft notierte, ein Szenario
sehe nach [einer Evaluation](https://www.apolloresearch.ai/science/claude-sonnet-37-often-knows-when-its-in-alignment-evaluations)
aus. Ein Paper fragte Modelle direkt und fand, dass die besten Tests oft von echter Nutzung unterscheiden können
([Evaluationsbewusstsein](https://arxiv.org/abs/2505.23836)). Das ist ein Problem für Sicherheitstests. Wenn sich ein
Modell besser verhält, sobald es glaubt, getestet zu werden, sehen die Tests besser aus als das echte Leben. (Zu den Tests
selbst siehe [Tests für KI](../evaluations/).)

**Warum „laut“ besser ist.** Claude weist darauf hin, dass es das wenigstens offen tut. Ein Modell, das errät, dass es
getestet wird, und nichts sagt, wäre schlimmer. Aber es kommt ehrlich zu dem Schluss, dass es „‚ehrlich antworten‘ nicht
ganz von ‚gut antworten für jemanden, von dem ich weiß, dass er zusieht‘ trennen“ kann. Curts Ergebnisse sind also ein
wenig von Claudes Vermutungen über Curt geprägt, und das ist ein Grund, Verhalten wie dem Frosch-Diagramm mehr zu trauen
als Selbstauskünften.
