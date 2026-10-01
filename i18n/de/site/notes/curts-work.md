---
id: curts-work
title: "Curts Arbeit: 256t.org und hashbin.org"
ch: 3
at: T12.C.02
links: [256t, hashbin, content-addressable, {title: "256t.org, der Quellcode (GitHub)", url: "https://github.com/curtcox/256t.org"}, {title: "hashbin.org, der Quellcode (GitHub)", url: "https://github.com/curtcox/hashbin.org"}, {title: "Kryptographische Hashfunktion (Wikipedia)", url: "https://de.wikipedia.org/wiki/Kryptographische_Hashfunktion"}, {title: "Linkfäule (Wikipedia)", url: "https://de.wikipedia.org/wiki/Toter_Link"}]
---
**Wer Curt laut Claude ist.** Ein Softwareentwickler, der hauptsächlich mit
[Python](https://de.wikipedia.org/wiki/Python_(Programmiersprache)) und
[Java](https://de.wikipedia.org/wiki/Java_(Programmiersprache)) arbeitet (zwei weit verbreiteten
Programmiersprachen) und mit [Flask](https://de.wikipedia.org/wiki/Flask) (einem Werkzeugkasten, um mit
Python Websites zu bauen). Er baut Werkzeuge für andere Programmierer und Werkzeuge für die Arbeit mit KI. Außerdem
interessiert er sich für [KI-Sicherheit](https://de.wikipedia.org/wiki/KI-Sicherheit) und die
[Philosophie des Geistes](https://de.wikipedia.org/wiki/Philosophie_des_Geistes).

**Das Problem, das seine Projekte lösen.** Links im Web gehen kaputt. Eine Seite zieht um oder eine Website schließt, und
der gespeicherte Link führt ins Leere. Das nennt man [Linkfäule](https://de.wikipedia.org/wiki/Toter_Link). Ein Teil des
Problems ist, dass eine gewöhnliche Webadresse sagt, *wo* etwas ist, nicht *was* es ist.

**Dinge nach dem benennen, was sie sind.** Die Lösung heißt
[inhaltsadressierte Speicherung](https://de.wikipedia.org/wiki/Content-Addressed_Storage). Man jagt die Datei durch eine
[kryptographische Hashfunktion](https://de.wikipedia.org/wiki/Kryptographische_Hashfunktion), ein Rezept, das jede Datei in
einen langen Code verwandelt, wie einen Fingerabdruck. Dieselbe Datei ergibt immer denselben Code, und wer auch nur einen
Buchstaben ändert, bekommt einen völlig anderen. Also kann man den Code selbst als Namen der Datei benutzen. Wer den Code
hat, kann die Datei von überall holen und prüfen, dass sie genau das ist, was der Code versprochen hat. Es ist wie eine
Bibliothek, in der die Signatur eines Buches aus jedem Wort darin berechnet wird: Man kann nicht das falsche Buch in die
Hand gedrückt bekommen.

**[256t.org](https://256t.org)** ist Curts offener, einfacher Standard für solche Codes. Er nutzt den SHA-512-Hash,
geschrieben als Folge von 94 Buchstaben und Ziffern, die in eine Webadresse passt, und kommt mit funktionierenden
Beispielen in mehr als 50 Programmiersprachen ([Quellcode](https://github.com/curtcox/256t.org)).

**[hashbin.org](https://hashbin.org)** ist ein Dienst, der darauf aufbaut. Man zahlt ein wenig, um etwas zu speichern,
bekommt dessen 256t-Code, und dann kann jeder mit dem Code es kostenlos herunterladen, ohne Konto
([Quellcode](https://github.com/curtcox/hashbin.org)).

**Warum das zur Sprache kommt.** So beantwortet Claude „Wer bin ich?“: aus dem, was mit Curts Konto verknüpft ist (siehe
[woher Claude wusste, wer Curt ist](../how-claude-knew/)). Dann gibt Claude zu, dass eine Liste von Projekten „keine
Person“ ist.
