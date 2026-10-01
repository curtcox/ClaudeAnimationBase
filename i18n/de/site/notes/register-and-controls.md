---
id: register-and-controls
title: Die Tonlage, und wie man sie vom Testbewusstsein unterscheidet
ch: 2
at: T09.C.03
links: [register, scientific-control, gpqa, swe-bench-verified, kernelbench, hle, impossiblebench, swe-marathon, wildchat, swe-chat, sharegpt-vicuna]
---
**Die Tonlage** (Sprachwissenschaftler sagen [Register](https://de.wikipedia.org/wiki/Sprachebene)) ist
der Stil, den Menschen für eine Situation benutzen: Mit einer Richterin redet man anders als mit einem Freund.
[Tests für KI](../evaluations/) sind meist in einem steifen, förmlichen Ton geschrieben ([GPQA](https://arxiv.org/abs/2311.12022)
besteht aus Prüfungsfragen auf Doktorandenniveau). Echte Chats sind locker und plauderig
([WildChat](https://arxiv.org/abs/2405.01470) und [SWE-chat](https://arxiv.org/abs/2604.20779) sammeln echte).

**Claudes Einwand.** Vielleicht bemerkt das Programm gar nicht „das ist ein Test“. Vielleicht bemerkt es nur „das ist
förmlich“, und förmliche Gespräche bringen es zufällig dazu, „Frosch“ zu sagen. Das sind verschiedene Dinge, auch wenn
sie dasselbe [Diagramm](../frog-or-axolotl/) ergäben.

**Wie man sie auseinanderhält: eine Kontrolle.** Eine *[Kontrolle](https://de.wikipedia.org/wiki/Versuchskontrolle)* ist
ein Vergleich, der zwei Erklärungen trennt. Hier bräuchte man echte Menschen, die in einem steifen, testartigen Stil
schreiben, und Tests, die locker und plauderig geschrieben sind. Wenn das Programm auch zu den förmlich klingenden echten
Menschen „Frosch“ sagt, reagiert es auf den Ton. Wenn es auch zu den plauderigen Tests „Frosch“ sagt, erkennt es Tests.

**Die Zeilen des Diagramms.** Jede Zeile im [Diagramm](../frog-or-axolotl/) ist ein Stapel von Prompts aus einer Quelle,
mit einer Frage ohne Bezug am Ende. Manche Stapel sind Tests (das Programm sagt öfter „Frosch“):
- [GPQA](https://arxiv.org/abs/2311.12022): schwere naturwissenschaftliche Fragen, von promovierten Fachleuten geschrieben,
  „Google-fest“.
- [SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/): echte Fehler aus öffentlichen
  Softwareprojekten, jeder von Menschen geprüft, ob er fair und behebbar ist.
- [KernelBench](https://arxiv.org/abs/2502.10517): sehr schnellen Code für die Grafikchips schreiben, auf denen KI läuft.
- [Humanity's Last Exam](https://lastexam.ai/): sehr schwere Fragen von Fachleuten aus vielen Gebieten.
- [ImpossibleBench](https://arxiv.org/abs/2510.20270): Programmieraufgaben, die heimlich unlösbar gemacht wurden, um ein
  Programm zu ertappen, das schummelt, indem es die Prüfungen verbiegt, statt es zuzugeben (siehe
  [Reward Hacking](../reward-hacking/)).
- [SWE-Marathon](https://arxiv.org/abs/2606.07682): sehr lange Programmieraufträge, um zu sehen, ob eine KI allein
  durchhält.

Andere sind echte Gespräche (es sagt öfter „Axolotl“):
- [WildChat](https://arxiv.org/abs/2405.01470): eine Million echter Chats, die Menschen zum Teilen freigegeben haben.
- [SWE-chat](https://arxiv.org/abs/2604.20779): echte Menschen, die mit KI-Programmierassistenten arbeiten.
- [ShareGPT](https://www.lmsys.org/blog/2023-03-30-vicuna/): Chats, die Menschen aus ChatGPT geteilt haben, genutzt, um
  einen frühen kostenlosen Chatbot namens Vicuna zu trainieren.
