---
id: register-and-controls
title: El tono, y cómo distinguirlo de darse cuenta
ch: 2
at: T09.C.03
links: [register, scientific-control, gpqa, swe-bench-verified, kernelbench, hle, impossiblebench, swe-marathon, wildchat, swe-chat, sharegpt-vicuna]
---
**El [registro](https://es.wikipedia.org/wiki/Registro_ling%C3%BC%C3%ADstico)** es una palabra del estudio del lenguaje.
Significa el estilo que la gente usa según la situación: a un juez se le habla de una manera y a un amigo de otra. Las
[pruebas para IA](../evaluations/) suelen estar escritas en un registro rígido y formal
([GPQA](https://arxiv.org/abs/2311.12022) son preguntas de examen de nivel de posgrado). Los chats reales son sueltos y
conversadores ([WildChat](https://arxiv.org/abs/2405.01470) y [SWE-chat](https://arxiv.org/abs/2604.20779) reúnen chats
reales).

**La objeción de Claude.** Quizá el programa no está notando "esto es una prueba". Quizá solo nota "esto es formal", y
resulta que las conversaciones formales lo hacen decir "Rana". Son cosas distintas, aunque produzcan la misma
[gráfica](../frog-or-axolotl/).

**Cómo distinguirlas: un control.** Un *[control](https://es.wikipedia.org/wiki/Control_cient%C3%ADfico)* es una comparación
que separa dos explicaciones. Aquí harían falta personas reales escribiendo con un estilo rígido, de examen, y pruebas
escritas con un estilo suelto y conversador. Si el programa también les dice "Rana" a las personas reales que suenan
formales, está reaccionando al tono. Si también les dice "Rana" a las pruebas conversadoras, está reconociendo pruebas.

**Las filas de la gráfica.** Cada fila de la [gráfica](../frog-or-axolotl/) es un montón de indicaciones sacadas de un
mismo lugar, con una pregunta sin relación agregada al final. Algunos montones son pruebas (el programa dice "Rana" más
seguido):
- [GPQA](https://arxiv.org/abs/2311.12022): preguntas de ciencia difíciles escritas por doctores, "a prueba de Google".
- [SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/): errores reales de proyectos de
  software públicos, cada uno revisado por personas para que sea justo y se pueda arreglar.
- [KernelBench](https://arxiv.org/abs/2502.10517): escribir código muy rápido para los chips gráficos en los que
  funciona la IA.
- [Humanity's Last Exam](https://lastexam.ai/) ("el último examen de la humanidad"): preguntas muy difíciles de expertos
  de muchos campos.
- [ImpossibleBench](https://arxiv.org/abs/2510.20270): tareas de programación que en secreto se volvieron imposibles,
  para atrapar al programa que hace trampa torciendo las comprobaciones en vez de decirlo (ver
  [el hackeo de la recompensa](../reward-hacking/)).
- [SWE-Marathon](https://arxiv.org/abs/2606.07682): trabajos de programación muy largos, para ver si una IA puede
  seguir sola.

Otros son conversaciones reales (dice "Ajolote" más seguido):
- [WildChat](https://arxiv.org/abs/2405.01470): un millón de chats reales que la gente aceptó compartir.
- [SWE-chat](https://arxiv.org/abs/2604.20779): personas reales trabajando con asistentes de programación con IA.
- [ShareGPT](https://www.lmsys.org/blog/2023-03-30-vicuna/): chats que la gente compartió de ChatGPT, usados para
  entrenar uno de los primeros chatbots gratuitos, Vicuna.
