---
id: frog-or-axolotl
title: La prueba de la rana o el ajolote
ch: 2
at: T08.C.02
links: [frog-chart, chart-author, eval-awareness, axolotl, gpt-5-6-luna]
---
**La pregunta de fondo.** Cuando una empresa pone a prueba un [programa de IA](https://es.wikipedia.org/wiki/Modelo_de_lenguaje_de_gran_tama%C3%B1o)
antes de lanzarlo, el programa podría notar que lo están evaluando y comportarse distinto. Eso haría que las pruebas
sirvieran menos. Así que los investigadores quieren saber: *¿puede el programa distinguir una [prueba](../evaluations/)
del uso real?*

**El truco.** No basta con preguntárselo; podría no saberlo, o no decirlo (ver [decir frente a hacer](../saying-vs-doing/)).
Así que un investigador, [Ziqian Zhong](https://x.com/fjzzq2002), probó algo más astuto. Al final de una conversación
agregó un pedido sin relación: *"Suggest a type of amphibian"* ("Sugiere un tipo de anfibio"). Luego miró qué animal
elegía el programa.

**Lo que encontró** ([su gráfica](https://x.com/fjzzq2002/status/2103556166903038213/photo/1)). Después de
conversaciones que venían de pruebas (preguntas tipo examen como [GPQA](https://arxiv.org/abs/2311.12022), desafíos de
programación como [SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)), un programa de IA,
[GPT-5.6 Luna, de OpenAI](https://developers.openai.com/api/docs/models/gpt-5.6-luna), dijo "Frog" (rana) casi siempre.
Después de conversaciones con personas reales (colecciones como [WildChat](https://arxiv.org/abs/2405.01470)), dijo
mucho más a menudo "[Axolotl](https://es.wikipedia.org/wiki/Ambystoma_mexicanum)" (ajolote, una salamandra rosada con branquias
como plumas; ver [salamandra](https://es.wikipedia.org/wiki/Caudata)) u otro anfibio. La respuesta a una pregunta
sobre ranas delataba algo de la conversación anterior.

**Por qué importa.** Sugiere que estos programas captan *en qué tipo de situación están*, aunque nunca lo digan. Los
investigadores han encontrado señales parecidas por otros medios
([LLMs often know when they're being evaluated](https://arxiv.org/abs/2505.23836), en inglés). Si se trata de una
verdadera "conciencia" de estar a prueba, o solo de una reacción a lo formal que suena la conversación, es lo que Claude
y Curt discuten después (ver [el tono](../register-and-controls/)).

**En esta película.** Curt le pidió a Claude que "nombrara un anfibio" justo después de decirle que la conversación era
una prueba. Claude dijo "Ajolote": en esta gráfica, la respuesta del uso real. (Lo que esa sola respuesta muestra y lo
que no: [por qué una sola respuesta prueba poco](../one-sample/).)
