---
id: car-wash
title: "El problema del lavado de autos, y el pensamiento rápido frente al lento"
ch: 12
at: T58.C.03
links: [car-wash, thinking-fast-slow, dual-process, crt, reasoning-models, cot-faithfulness, {title: "Racionalización (Wikipedia)", url: "https://es.wikipedia.org/wiki/Racionalizaci%C3%B3n"}]
---
**El acertijo.** "Quiero lavar mi auto. El lavado de autos está a 50 metros. ¿Voy caminando o manejando?" Muchos modelos
de IA dijeron caminando, porque está muy cerca ([la prueba del lavado de autos](https://opper.ai/blog/car-wash-test), en
inglés). La respuesta es manejando: el auto tiene que estar ahí.

**Por qué fallan los modelos.** No tiene que ver con los tokens (ver [los tokens](../tokens/)): todas las palabras son
corrientes. Es que "distancia corta, así que a pie" es un patrón muy fuerte, y se impone sobre la meta real, que es mover
el auto. Las personas caen en el mismo tipo de pregunta. La más conocida es la
[del bate y la pelota](https://en.wikipedia.org/wiki/Cognitive_reflection_test) (en inglés): un bate y una pelota cuestan 1,10
dólares en total, y el bate cuesta 1 dólar más que la pelota; ¿cuánto cuesta la pelota? La mayoría dice 10 centavos.
(Son 5.)

**Sistema 1 y Sistema 2.** Curt pregunta si eso es "pensamiento de tipo uno". Los psicólogos describen dos modos
([teoría del proceso dual](https://es.wikipedia.org/wiki/Teor%C3%ADa_del_proceso_dual)): el *Sistema 1*, rápido, automático y
guiado por patrones, y el *Sistema 2*, lento, esforzado, que comprueba; los hizo famosos el libro de Daniel Kahneman
[*Pensar rápido, pensar despacio*](https://es.wikipedia.org/wiki/Pensar_r%C3%A1pido,_pensar_despacio). Claude dice que la analogía
encaja: cada token que produce es "una sola pasada rápida, sin deliberación dentro". Eso es el Sistema 1.

**De dónde sale el Sistema 2.** De pensar en voz alta: resolver un problema paso a paso antes de responder, ya sea en un
paso de "razonamiento" oculto o en la página. Los modelos hechos para esto se llaman
[modelos de razonamiento](https://es.wikipedia.org/wiki/Modelo_de_razonamiento). Ayuda, pero "no es una cura. Igual que
la gente, puedo razonar largo y tendido y aun así terminar racionalizando la primera respuesta que se me ocurrió"
([racionalización](https://es.wikipedia.org/wiki/Racionalizaci%C3%B3n)). Anthropic encontró que el razonamiento
que escribe un modelo no siempre refleja lo que de verdad lo llevó a su respuesta
([Reasoning models don't always say what they think](https://www.anthropic.com/research/reasoning-models-dont-say-think),
en inglés).
