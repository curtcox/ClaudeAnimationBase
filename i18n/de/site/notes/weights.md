---
id: weights
title: Warum Claude nicht in die eigenen „Gewichte“ schauen kann
ch: 2
at: T08.C.03
links: [introspection, tracing-thoughts, monosemanticity, {title: "Künstliches neuronales Netz (Wikipedia)", url: "https://de.wikipedia.org/wiki/K%C3%BCnstliches_neuronales_Netz"}, {title: "Introspektion (Wikipedia)", url: "https://de.wikipedia.org/wiki/Selbstbeobachtung"}]
---
**Gewichte, einfach gesagt.** In einem Programm wie Claude steckt eine riesige Tabelle von Zahlen, Milliarden davon,
die *Gewichte* heißen (es sind die Verbindungsstärken in einem
[neuronalen Netz](https://de.wikipedia.org/wiki/K%C3%BCnstliches_neuronales_Netz), lose nach
[Neuronen](https://de.wikipedia.org/wiki/K%C3%BCnstliches_Neuron) gebildet). Sie wurden Stück für Stück angepasst, während das
Programm Texte studierte, bis es gut schrieb. Diese Zahlen *sind* das Wissen und die Gewohnheiten des Programms. Niemand
hat sie von Hand geschrieben, und niemand kann sie lesen wie ein Buch.

**„Ich kann meine eigenen Gewichte nicht untersuchen.“** Claude bekommt diese Zahlen nicht zu sehen, während es spricht.
Es ist ein bisschen wie bei einem Menschen, der seine eigenen Gehirnzellen nicht sehen kann: Man kann anderen sagen, was
man zu tun *glaubt* ([Introspektion](https://de.wikipedia.org/wiki/Selbstbeobachtung)), aber man kann die Verdrahtung nicht
prüfen. Wenn Claude also sagt, warum es etwas getan hat, passt diese Erklärung vielleicht zu dem, was innen wirklich
geschah, vielleicht auch nicht (siehe [Sagen und Tun](../saying-vs-doing/)).

**Kann irgendjemand hineinschauen?** Forscher können es, mit speziellen Werkzeugen, und sie lernen, in diesen Zahlen
Muster zu finden, die zu Ideen passen. In einer berühmten Vorführung fand Anthropic das Muster für die Golden Gate Bridge
und drehte es hoch; heraus kam „[Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude)“, das die Brücke
in jede Antwort einbaute. Dieselbe Arbeit fand Muster, die mit Dingen wie Täuschung zusammenhängen
([Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)), und spätere Arbeiten
verfolgen, wie das Programm ein Problem Schritt für Schritt durcharbeitet
([Tracing the thoughts of a language model](https://www.anthropic.com/research/tracing-thoughts-language-model)). Dieses
Feld heißt *[Interpretierbarkeit](https://en.wikipedia.org/wiki/Mechanistic_interpretability) (auf Englisch)*. Es steht noch am Anfang,
und es ist einer der wichtigsten Wege, auf denen man hofft, zu prüfen, was diese Programme wirklich tun.

**Manche Programme merken ein wenig.** Forscher von Anthropic fanden, dass Claude manchmal eine Idee erkennen kann, die
künstlich in seine eigene Verarbeitung gepflanzt wurde, aber eben nur manchmal
([Emergent introspective awareness](https://transformer-circuits.pub/2025/introspection/index.html)). Seine
Selbstkenntnis ist echt, aber unzuverlässig.
