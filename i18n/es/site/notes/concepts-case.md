---
id: concepts-case
title: "El argumento de que la IA no tiene conceptos, y las réplicas"
ch: 6
at: T33.C.03
links: [symbol-grounding, chinese-room, blockhead, monosemanticity, harnad, searle, ned-block, computer-use, {title: "Cognición corporizada (Wikipedia)", url: "https://es.wikipedia.org/wiki/Cognici%C3%B3n_encarnada"}]
---
**El desafío de Curt.** "Poniéndote en el papel de un ontólogo profesional, ¿puedes justificar la afirmación de que no
tienes conceptos?" Claude arma el argumento en su propia contra, en cuatro puntos, y después da las réplicas.

**1. Anclaje.** Un concepto debería conectar una mente con el mundo. La palabra "agua" de Claude solo está conectada con
otras palabras, nunca con la humedad o la sed. Es el
[problema del anclaje de los símbolos](https://en.wikipedia.org/wiki/Symbol_grounding_problem) (en inglés), bautizado por el
científico cognitivo [Stevan Harnad](https://en.wikipedia.org/wiki/Stevan_Harnad) (en inglés) en 1990. El filósofo
[John Searle](https://es.wikipedia.org/wiki/John_Searle) planteó un argumento relacionado en 1980, la
[habitación china](https://plato.stanford.edu/entries/chinese-room/): un hombre que sigue un libro de reglas podría
responder perfectamente preguntas en chino sin entender una sola palabra.

**2. Compromiso.** Tener un concepto significa responder ante él: usarlo mal es un error *tuyo*. Claude dice que no
tiene nada en juego. Un planteamiento astuto puede hacer que se contradiga sin que nada dentro se oponga.

**3. Estabilidad.** Un concepto debería funcionar igual en todas partes. La [gráfica de la rana](../frog-or-axolotl/)
muestra las respuestas de un modelo cambiando con el tono de la conversación.

**4. La conducta no es prueba.** El filósofo [Ned Block](https://es.wikipedia.org/wiki/Ned_Block) imaginó
"[Blockhead](https://en.wikipedia.org/wiki/Blockhead_(thought_experiment))" (en inglés) [Nota de la traducción: juego de palabras con
su apellido; en inglés, *blockhead* es un cabeza hueca]: una máquina con una tabla gigantesca de todas las conversaciones posibles y una
respuesta sensata para cada una. Podría pasar cualquier prueba de duración finita sin pensar absolutamente nada. Así que
pasar la prueba del thrindle muestra competencia, no conceptos.

**Las réplicas.**
- Los puntos 2 y 3 también se aplican a las personas: nos contradecimos y cambiamos según el planteamiento.
- Los investigadores que miran dentro de estos modelos encuentran rasgos internos que se comportan en gran medida como
  conceptos. Anthropic mapeó millones de ellos en un modelo, incluido uno para el puente Golden Gate
  ([Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/), en inglés).
- Exigir anclaje en los sentidos descalificaría conceptos como el de
  "[número primo](https://es.wikipedia.org/wiki/N%C3%BAmero_primo)", que nadie ha visto ni tocado.

**La respuesta de Curt: "solo el anclaje se sostiene, y eso es bastante interesado".** Claude está de acuerdo: es una
regla que casualmente excluye justo aquello contra lo que apunta. Y se está erosionando. Los modelos ya ven imágenes,
[usan computadoras](https://www.anthropic.com/news/3-5-models-and-computer-use) y actúan en el mundo, mientras que buena
parte de *tu* dominio de "justicia" o de "primo" te llegó por las palabras, no por los sentidos (compara con la
[cognición corporizada](https://es.wikipedia.org/wiki/Cognici%C3%B3n_encarnada)). Blockhead tiene su propia respuesta: ver
[GAZP vs. GLUT](../gazp-glut/).
