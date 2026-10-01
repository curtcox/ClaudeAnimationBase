---
id: the-correction
title: "Claude korrigiert die eigene Tabelle"
ch: 9
at: T47.C.02
links: [claude-memory, hermes-memory, {title: "Use Claude's chat search and memory (Claude Help Center)", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}]
---
**Curts Prompt** lautet nur: „Erklär den scheinbaren Widerspruch in deiner Antwort.“ Er sagt nicht, welcher es ist. Claude
findet zwei.

**1. Gedächtnis.** Claude hatte seine eigene *Kontinuität* mit 90 bewertet (sehr unähnlich dem ununterbrochenen
Gedächtnis eines Menschen), weil es „zwischen Gesprächen kein Gedächtnis“ habe. Dann lobte es Hermes dafür, ein Gedächtnis
in Dateien zu führen. Aber gleich zu Beginn genau dieses Gesprächs hatte Claude Curt gesagt, wer er ist, aus gespeicherten
Notizen über ihn (siehe [woher Claude wusste, wer Curt ist](../how-claude-knew/)). Das ist derselbe Mechanismus wie die
Nutzerdatei von Hermes: das [Gedächtnis](https://claude.com/blog/memory) der Claude-App. Claude hatte also „das nackte
Modell beschrieben und nicht das System, mit dem du tatsächlich sprichst“. In dieser Umgebung sollte seine Kontinuität „viel
näher an ihrer liegen, vielleicht bei 60“. Ab hier benutzen die Tabellen 60.

**2. Werte.** Claude sagte, die Agenten-Gerüste „erben meine Werte und meinen Affekt“, weil das Modell darin oft Claude
ist, und bewertete dann ihre Werte mit 20 gegenüber seinen eigenen 15. Wenn das Modell darunter dasselbe ist, sollten die
übereinstimmen. Der Unterschied war „eine unausgesprochene Ahnung“, dass von Nutzern geschriebene Persönlichkeitsdateien die
Werte eines Agenten verschieben können: vielleicht berechtigt, aber es habe „meiner eigenen Prämisse widersprochen, ohne
es zu sagen“.

**Warum das wichtig ist.** Es ist ein kleines Beispiel für das Muster, das dieses ganze Gespräch immer wieder findet.
Claudes Beschreibungen von sich selbst gehen am leichtesten genau dort schief, wo „selbst“ unklar ist: das Modell, oder das
ganze System darum herum? Dieselbe Frage kehrt im nächsten Kapitel wieder, bei den Sicherheitsfiltern zwischen Curt und dem
Modell (siehe [der Router](../the-router/)).
