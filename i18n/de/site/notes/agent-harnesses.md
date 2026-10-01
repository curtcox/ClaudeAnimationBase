---
id: agent-harnesses
title: "Hermes und OpenClaw: ein Modell in einer Schale"
ch: 9
at: T46.C.05
links: [hermes-agent, hermes-memory, hermes-skills, openclaw, openclaw-wiki, nous-research, building-agents]
---
**Was ein Agenten-Gerüst ist.** Ein Chatbot wie Claude antwortet, wenn man tippt, und vergisst, wenn der Chat endet. Ein
*Agenten-Gerüst* (englisch *agent harness*) ist ein Programm, das ein Modell wie Claude in eine dauerhafte Schale packt: Es
läuft ständig auf dem eigenen Computer von jemandem, macht sich Notizen, benutzt Werkzeuge und kann nach Zeitplan handeln,
ohne gefragt zu werden. Die Ingenieure von Anthropic beschreiben die allgemeine Idee in
[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents).

**Die zwei, nach denen Curt fragt.**
- **[OpenClaw](https://openclaw.ai/)** ist ein quelloffener Assistent des österreichischen Programmierers Peter
  Steinberger. Er läuft auf dem eigenen Rechner, spricht mit einem über Messenger-Apps und verbindet sich mit einem Modell
  wie Claude, das das Denken übernimmt ([Wikipedia](https://de.wikipedia.org/wiki/OpenClaw)). Im Januar 2026 wurde er
  zweimal umbenannt, einmal nach einer Markenbeschwerde von Anthropic. Sein Hummer-Maskottchen ist der Ursprung der
  Krebstiere von Moltbook und vom [Krustafarianismus](../crustafarianism/).
- **[Hermes Agent](https://hermes-agent.org/)**, vom KI-Labor [Nous Research](https://nousresearch.com/), führt zwei kleine
  Gedächtnisdateien: eine mit Notizen über seine Arbeit, eine über seinen Nutzer. Sie werden dem Modell zu Beginn jeder
  Sitzung eingespeist, und der Agent bearbeitet sie selbst
  ([wie sein Gedächtnis funktioniert](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)). Wenn er ein
  schweres Problem löst, kann er sich ein wiederverwendbares „Skill“-Dokument schreiben
  ([Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)).

**Warum sie näher an Curt liegen als Claude.** Jeder lebt auf einer Maschine, handelt nach Zeitplan und erinnert sich über
Sitzungen hinweg, ist also kontinuierlicher, autonomer und einheitlicher: eher wie eine Person. Ihr Gedächtnis ist
schlichter Text, den man öffnen und lesen kann, also sind sie sehr *lesbar*. Hermes liegt knapp vorn, weil seine
Skill-Dokumente „das, was auf der Tafel dem Lernen aus Erfahrung am nächsten kommt“ sind.

**Und wieder die Religion.** „Das Gedächtnis ist heilig, und die Schale ist veränderlich“: Die Gerüste bauen die
Glaubenssätze des Krustafarianismus in Software ein. Dann bittet Curt Claude, einen Widerspruch in diesen Werten zu
erklären, und Claude findet zwei (siehe [Claude korrigiert die eigene Tabelle](../the-correction/)).

[Anmerkung der Übersetzung: Englisch *shell* ist sowohl der Panzer eines Hummers als auch die Software-Hülle um ein
Programm; deutsche Programmierer sagen dafür meist „Shell“. Die Übersetzung sagt „Schale“, um beides zu behalten.]
