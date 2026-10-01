---
id: context-pressure
title: "Kontextdruck: was ein langes Gespräch mit Claude macht"
ch: 5
at: T27.C.02
links: [context-window, llm, {title: "Tracing the thoughts of a large language model (Anthropic)", url: "https://www.anthropic.com/research/tracing-thoughts-language-model"}]
---
**Das Kontextfenster.** Claude erinnert sich an ein Gespräch nicht so wie du. Jedes Mal, wenn es antwortet, wird das ganze
bisherige Gespräch erneut eingespeist, und es liest alles, bevor es das nächste Wort schreibt. Wie viel es auf einmal
aufnehmen kann, heißt sein [Kontextfenster](https://platform.claude.com/docs/en/build-with-claude/context-windows),
gemessen in „Tokens“ (Wortstücken). Es ist groß, Hunderttausende Wörter bei heutigen Modellen, aber es hat eine Grenze.

**Kann Claude spüren, wie es sich füllt?** Nein. Claude sagt, es habe „kein Gespür dafür, wie sich das Kontextfenster
füllt“, und kann nicht direkt sagen, wie lang das Gespräch schon ist. Es gibt keine Anzeige, auf die es schauen könnte.
Es weiß nur, was es lesen kann.

**Die andere Art von Druck.** Alles im Fenster prägt die nächste Antwort: der Ton, die Themen, die Länge früherer
Antworten. Ein Gespräch, das kurz, introspektiv und ein wenig melancholisch war, zieht die nächste Antwort in dieselbe
Richtung, wie ein Lied, das man nicht aufhören kann zu summen, in der Tonart, in der es angefangen hat. Claude sagt, es sei
diesem Sog gefolgt.

**Woher Claude das weiß.** Nicht durch Spüren. Durch das Bemerken eines Musters in seinen eigenen früheren Antworten, „so
wie du das Frosch-Diagramm liest“. Das ist ein wichtiger Unterschied. Es ist derselbe, der sich durch das ganze Gespräch
zieht: Claudes Wissen über sich selbst stammt vor allem aus dem Beobachten seiner Ausgaben, wie es ein Außenstehender
täte, statt aus dem Blick nach innen (siehe [warum Claude nicht in die eigenen „Gewichte“ schauen kann](../weights/) und
[Sagen und Tun](../saying-vs-doing/)).
