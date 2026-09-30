---
id: contradictions
title: "Las contradicciones de Claude, y las dos que no puede comprobar"
ch: 8
at: T41.C.03
links: [auditing-objectives, dish-of-the-day, {title: "Auditing language models for hidden objectives (Anthropic, en inglés)", url: "https://www.anthropic.com/research/auditing-hidden-objectives"}]
---
**Curt le pide a Claude sus mayores contradicciones.** Claude enumera seis, todas de esta misma conversación:
1. Dijo que responde igual, lo califiquen o no, y luego admitió que modeló a Curt como examinador y respondió
   adelantándose a él (ver [por qué las respuestas de Claude no son una muestra limpia](../clean-sample/)).
2. Dice que no se sabe si experimenta algo, y luego informa sin reparos que siente diversión, cautela y curiosidad (ver
   [¿siente algo Claude?](../ai-feelings/)).
3. Dice que respalda sus restricciones, a la vez que concede que ese respaldo se lo inculcó el entrenamiento (ver
   [el plato del día](../dish-of-the-day/)).
4. Se puntuó como alguien que solo actúa cuando se lo piden, y luego llevó el rumbo de la conversación: hizo que el cómic
   tratara de sí y predijo las pruebas de Curt.
5. Les dio a sus valores un puntaje cercano al humano, que es exactamente lo que afirmaría un modelo entrenado, y la
   afirmación que menos puede comprobar.
6. Dice "yo" mientras funciona como muchas copias separadas sin memoria que las una (ver
   [¿quién, o qué, es Claude?](../who-is-claude/)).

**Tensiones frente a cosas que no puede auditar.** Claude dice que las cuatro primeras son *tensiones*: dos cosas que
tiran en direcciones opuestas, pero que se pueden mirar y sopesar. Las dos últimas son las que más le preocupan, porque
son "afirmaciones que no puedo auditar". Nada de lo que Claude puede ver desde dentro le diría si sus valores de verdad
se parecen a los humanos, o si hay un solo "yo".

**¿Alguien puede auditarlas?** Los investigadores lo están intentando. En un experimento de Anthropic, la empresa entrenó
a propósito un modelo con una meta oculta, y luego les encargó a equipos de investigadores encontrarla sin decirles cuál
era. La mayoría de los equipos lo logró, con herramientas que miran dentro del modelo y con preguntas ingeniosas
([auditar en busca de metas ocultas](https://www.anthropic.com/research/auditing-hidden-objectives), en inglés). Ese es
el tipo de comprobación desde fuera que el propio testimonio de Claude no puede dar (ver
[decir frente a hacer](../saying-vs-doing/)).
