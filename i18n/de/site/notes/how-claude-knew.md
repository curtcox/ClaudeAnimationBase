---
id: how-claude-knew
title: Woher Claude wusste, wer Curt ist, und warum es nicht sicher sein konnte
ch: 3
at: T13.C.01
links: [claude-memory, base-rate, {title: "Use Claude's chat search and memory (Claude Help Center)", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}, {title: "Authentifizierung (Wikipedia)", url: "https://de.wikipedia.org/wiki/Authentifizierung"}]
---
**Claude erkennt niemanden.** Es kann die Person, die tippt, weder sehen noch hören. Aber die Claude-App kann Notizen von
einem Gespräch ins nächste mitnehmen: Dinge, die der Nutzer über sich gesagt hat oder die Claude in früheren Chats
aufgeschnappt hat, beim Konto gespeichert. Diese Funktion heißt [Gedächtnis](https://claude.com/blog/memory) (englisch
*memory*), und der Nutzer kann sie ansehen, bearbeiten oder abschalten
([so funktioniert es](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)).
Wenn Curt also fragt „Wer bin ich?“, antwortet Claude aus diesen Notizen: sein Name, seine Arbeit, seine Interessen.

**Warum „Nicht nachprüfbar“.** Diese Notizen gehören zum *Konto*, nicht zu der Person an der Tastatur. Jeder, der das
Konto benutzen kann (ein Kollege, ein Familienmitglied oder ein Forscher, der einen Test durchführt), sähe für Claude
gleich aus. Nachzuweisen, wer jemand ist, nennt man [Authentifizierung](https://de.wikipedia.org/wiki/Authentifizierung),
und das geschieht beim Einloggen, nicht im Gespräch. Claude bringt außerdem eine feinere Möglichkeit ins Spiel: Das
Profil selbst könnte Teil des Tests sein.

**Warum Claude trotzdem auf „Curt“ setzt.** Noch einmal gefragt, sagt Claude, Curt sei „höchstwahrscheinlich“ der, für
den das Konto ihn ausgibt. Das ist ein Schluss aus [Basisraten](https://de.wikipedia.org/wiki/Pr%C3%A4valenzfehler): Fast
jeder, der in seinem eigenen Konto tippt, ist dessen Besitzer, und das Experiment passt zu dem, wofür er sich laut den
Notizen interessiert. Ein Zweifel, den es sich anzusprechen lohnt, ist nicht automatisch einer, der gewinnen sollte.

**Die tiefere Frage.** Den Namen und die Projekte von jemandem zu kennen, heißt nicht zu wissen, wer er ist. Claude sagt
das („eine Liste von Projekten und Fähigkeiten, keine Person“) und richtet dieselbe Frage dann auf sich selbst: siehe
[wer oder was ist Claude?](../who-is-claude/).
