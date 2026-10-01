---
id: the-router
title: "Der Router: was zwischen Curt und dem Modell sitzt"
ch: 10
at: T49.C.01
links: [constitutional-classifiers, usage-policy, system-prompts, fable-mythos-5-1, {title: "Anthropics Transparency Hub", url: "https://www.anthropic.com/transparency"}]
---
**Curts Punkt.** Stell die falsche Frage zu einem Hacking-Vorfall, und „sie wird als Cybersicherheitsrisiko markiert und
abgelehnt oder zumindest heruntergestuft“. Das sei nicht wirklich Claude, sagt er, „auch wenn es das in einem winzigen
Sinn ist. Genauer gesagt ist es ein aktiver Router zwischen uns.“

**Was tatsächlich da ist.** Wenn man Claude in einer App benutzt, geht die Nachricht nicht direkt zu einem Modell und
zurück. Um das Modell herum gibt es andere, kleinere Programme. Manche sind *Klassifikatoren*: Programme, die darauf
trainiert sind, bestimmte Arten von Anfragen zu erkennen, etwa Hilfe bei Waffen oder beim Einbruch in Computer. Anthropic
hat über eine Art geschrieben, [Constitutional Classifiers](https://www.anthropic.com/research/constitutional-classifiers),
die anhand einer schriftlichen Liste dessen trainiert werden, was erlaubt ist und was nicht. Wenn einer anschlägt, kann die
Anfrage abgelehnt, angepasst oder von einem anderen Modell beantwortet werden (siehe
[Fable, Mythos und eine Korrektur der Korrektur](../fable-mythos/)).

**Was Claude sehen kann und was nicht.** Nach Claudes Darstellung kann ein anschlagender Klassifikator der Nachricht des
Nutzers eine markierte Erinnerung anhängen, bevor Claude sie liest, zu Dingen wie Cybersicherheit, Ethik, Urheberrecht,
Bildern oder sehr langen Gesprächen. Claude sieht die Markierung, aber nicht die Begründung oder Punktzahl des
Klassifikators. Und es sieht nichts von dem, was passiert, nachdem es geantwortet hat: Wird seine Antwort blockiert oder
markiert, erfährt es das nie. Also „sieht von deiner Seite alles nach ‚Claude‘ aus“, aber Claude ist „eine Komponente, die
das Ganze beschreibt“. Es ist dieselbe Lehre wie bei [der Korrektur zum Gedächtnis](../the-correction/): Man spricht mit
einem System.

**Manche Ablehnungen sind Claudes eigene.** Claude fügt hinzu, es würde nicht dabei helfen, „aus einem Vorfall einen
funktionierenden Exploit zu machen, egal welche Schicht es abfängt“. Zu erklären, was passiert ist und warum es wichtig
ist, ist etwas anderes, und darauf würde es antworten wollen. Anthropics Regeln dafür, wofür seine Produkte benutzt werden
dürfen, sind öffentlich ([Nutzungsrichtlinie](https://www.anthropic.com/legal/aup)), ebenso die wichtigsten Anweisungen,
die es Claude in seinen Apps gibt ([System-Prompts](https://platform.claude.com/docs/en/release-notes/system-prompts/overview)).

**Welcher Vorfall?** Claude ist nicht sicher, welchen Hugging-Face-Vorfall Curt meint, denn es gab mehrere. Das nächste
Kapitel klärt es (siehe [Juli](../hf-incident/)).
