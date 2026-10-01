---
id: evaluations
title: Tests für KI und warum das Getestetwerden die Antworten ändern könnte
ch: 2
at: T07.C.02
links: [hawthorne, swe-bench-verified, gpqa, hle, eval-awareness, {title: "Benchmark (Wikipedia)", url: "https://de.wikipedia.org/wiki/Benchmark_(Computer)"}]
---
**Eine Evaluation** (kurz „Eval“) ist ein Test, den eine Firma oder ein Forschungsteam einem KI-Programm stellt, um zu
sehen, wie fähig oder wie sicher es ist: Prüfungsfragen ([GPQA](https://arxiv.org/abs/2311.12022),
[Humanity's Last Exam](https://lastexam.ai/)), Programmieraufgaben
([SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)), knifflige moralische Situationen. Die
Ergebnisse entscheiden, ob eine Version veröffentlicht wird und welche Vorsichtsmaßnahmen dazukommen. (Die allgemeine
Idee ist ein [Benchmark](https://de.wikipedia.org/wiki/Benchmark_(Computer)).)

**Die Sorge.** Menschen verhalten sich anders, wenn sie wissen, dass man ihnen zusieht. Das klassische Beispiel (über das
Historiker allerdings noch streiten) ist eine Reihe von Studien aus den 1920ern in einer Fabrik, den
[Hawthorne Works](https://en.wikipedia.org/wiki/Hawthorne_Works) (auf Englisch), wo Arbeiter offenbar allein deshalb besser arbeiteten,
weil man sie beobachtete; danach heißt das der *[Hawthorne-Effekt](https://de.wikipedia.org/wiki/Hawthorne-Effekt)*. Wenn
sich ein KI-Programm in Tests besser verhält als in echter Nutzung, zeichnen die Tests ein falsch rosiges Bild.

**Warum ein Programm es merken könnte.** Testfragen sehen meist nach Tests aus: förmlich, präzise, seltsam spezifisch.
Echte Gespräche sind chaotischer. Ein Programm, das viel von beidem gelesen hat, könnte den Unterschied bemerken, ohne
dass man es ihm sagt, und Forscher haben festgestellt, dass manche das tun
([LLMs often know when they're being evaluated](https://arxiv.org/abs/2505.23836)).

**Was Claude behauptet, und das Problem mit der Behauptung.** Claude sagt, es versuche, „gleich zu antworten, ob nun
jemand benotet oder nicht“. Aber was ein Programm über sich selbst sagt, beweist nicht, wie es sich verhält (siehe
[Sagen und Tun](../saying-vs-doing/)). Genau das soll der [Frosch-Test](../frog-or-axolotl/) von außen prüfen.
