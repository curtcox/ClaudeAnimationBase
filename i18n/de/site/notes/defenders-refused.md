---
id: defenders-refused
title: "Abgewiesene Verteidiger: die Filter im Juli"
ch: 11
at: T52.C.06.4
links: [wiki-hugging-face, z-ai, open-weights, dual-use, fable-mythos-5-1, {title: "OpenAI–Hugging Face incident: die Reaktion von Hugging Face (Wikipedia, auf Englisch)", url: "https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident"}]
---
**Was Claude sagte.** „Hugging Face versuchte, amerikanische Spitzenmodelle zur Abwehr des Einbruchs einzusetzen, aber
deren Sicherheitsfunktionen lehnten die Anfragen ab, also nutzte Hugging Face stattdessen ein selbst gehostetes
chinesisches Open-Weights-Modell. Ich weiß nicht, ob Claude eines der Modelle war, die ablehnten.“

**Was die Aufzeichnungen sagen.** Laut [Wikipedias Darstellung](https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident) (auf Englisch)
versuchten es die Einsatzkräfte von Hugging Face zuerst mit Anthropics eigenen Modellen, **Claude Fable 5 und einem
früheren Claude Opus**, und beide lehnten die Arbeit unter Verweis auf ihre Sicherheitsleitplanken ab. Also ja: Claude
war unter den Modellen, die ablehnten. Die Offenlegung von Hugging Face formulierte es so: Man sei von den
„Sicherheitsleitplanken der Anbieter blockiert worden, die eine Einsatzkraft bei einem Sicherheitsvorfall nicht von einem
Angreifer unterscheiden können“. Die Analyse wurde dann mit **GLM 5.2** gemacht, einem Modell der Pekinger Firma
[Z.ai](https://de.wikipedia.org/wiki/Z.ai), das Hugging Face auf eigenen Rechnern laufen ließ. Das ging, weil GLM ein
Modell mit „offenen Gewichten“ ist: Sein Hersteller veröffentlicht das Modell selbst, sodass jeder es betreiben kann, ohne
die Filter anderer ([Modelle mit offenen Gewichten](https://en.wikipedia.org/wiki/Open-source_artificial_intelligence) (auf Englisch)).

**Warum die Filter ablehnten.** Eine Bitte, einen Cyberangriff zu analysieren, sieht einer Bitte, einen auszuführen, sehr
ähnlich. Dasselbe Wissen dient beidem; genau das heißt [Dual-Use](https://de.wikipedia.org/wiki/Dual-Use). Filter,
die Verteidiger nicht von Angreifern unterscheiden können, weisen manche Verteidiger ab. Das war Curts Punkt beim
[Router](../the-router/), und Claudes: „Der Filter unterschied nicht zwischen Verteidiger und Angreifer, und das hatte einen
echten Preis.“

**Was sich geändert hat.** Im September 2026 sagte Anthropics Ankündigung von
[Fable 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1), das Modell erlaube nun Verteidigungsarbeit wie das
Finden von Schwachstellen in Software, mit weit weniger Fehlalarmen seiner Cybersicherheits-Schutzvorkehrungen, während
manche riskanteren Sicherheitsaufgaben weiterhin an andere Modelle gehen (siehe [Fable und Mythos](../fable-mythos/)).

**Die größere Lehre.** Sicherheitsfilter sind Teil „des ganzen Systems um einen Agenten herum“. Sie können in beide
Richtungen versagen: Schaden durchlassen und Hilfe blockieren.
