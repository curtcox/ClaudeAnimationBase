---
id: one-sample
title: Por qué una sola respuesta prueba poco
ch: 2
at: T08.C.05.2
links: [error-bars, sampling, {title: "Ley de los grandes números (Wikipedia)", url: "https://es.wikipedia.org/wiki/Ley_de_los_grandes_n%C3%BAmeros"}]
---
**Estos programas tiran dados.** Hazle a Claude la misma pregunta dos veces y puede que recibas dos respuestas distintas.
Hay un elemento de azar deliberado en cómo elige cada palabra siguiente; el ajuste que controla cuánto azar hay se llama
"[temperatura](https://www.ibm.com/think/topics/llm-temperature)". Así que sus respuestas varían.

**Así que una respuesta es una tirada.** Incluso el programa de la [gráfica](../frog-or-axolotl/), sin ninguna
conversación antes de la pregunta, dijo "Ajolote" unas 4 de cada 10 veces. Que Claude dijera "Ajolote" una vez dice muy
poco. Al intento siguiente podría haber dicho "Rana".

**Lo que sí diría algo:** preguntar muchas veces, en muchos tipos de conversación, y contar
([muestreo](https://es.wikipedia.org/wiki/Muestreo_(estad%C3%ADstica))). Cuantos más intentos, más se asienta la cuenta (la
[ley de los grandes números](https://es.wikipedia.org/wiki/Ley_de_los_grandes_n%C3%BAmeros)). Es la misma razón por la que una
[encuesta de opinión](https://es.wikipedia.org/wiki/Sondeo_de_opini%C3%B3n) le pregunta a mil personas y no a una, e informa un
[margen de error](https://es.wikipedia.org/wiki/Margen_de_error), y por la que Anthropic ha sostenido que los resultados
de las pruebas de IA deberían venir con
[barras de error](https://www.anthropic.com/research/statistical-approach-to-model-evals) (en inglés).
