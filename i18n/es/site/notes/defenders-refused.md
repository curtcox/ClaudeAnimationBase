---
id: defenders-refused
title: "Defensores rechazados: los filtros en julio"
ch: 11
at: T52.C.06.4
links: [wiki-hugging-face, z-ai, open-weights, dual-use, fable-mythos-5-1, {title: "El incidente OpenAI–Hugging Face: la respuesta de Hugging Face (Wikipedia)", url: "https://es.wikipedia.org/wiki/Ciberataque_de_OpenAI_a_HuggingFace"}]
---
**Lo que dijo Claude.** "Hugging Face intentó usar modelos de frontera estadounidenses para combatir la intrusión, pero
sus funciones de seguridad rechazaron las peticiones, así que Hugging Face usó en su lugar un modelo chino de pesos
abiertos alojado en sus propios servidores. No sé si Claude fue uno de los modelos que se negaron."

**Lo que dice el registro.** Según [el relato de Wikipedia](https://es.wikipedia.org/wiki/Ciberataque_de_OpenAI_a_HuggingFace),
el equipo de respuesta a incidentes de Hugging Face probó primero los propios modelos de Anthropic, **Claude Fable 5 y un
Claude Opus anterior**, y los dos rechazaron el trabajo, citando sus salvaguardas de seguridad. Así que sí: Claude estuvo
entre los modelos que se negaron. El comunicado de Hugging Face lo dijo así: lo habían bloqueado "las salvaguardas de
seguridad de los proveedores, que no pueden distinguir a quien responde a un incidente de un atacante". El análisis se
hizo entonces con **GLM 5.2**, un modelo de la empresa de Pekín [Z.ai](https://es.wikipedia.org/wiki/Zhipu_AI), que
Hugging Face hizo funcionar en sus propias computadoras. Pudo hacerlo porque GLM es un modelo "de pesos abiertos": su
fabricante publica el modelo mismo, así que cualquiera puede hacerlo funcionar, sin los filtros de nadie más
([modelos de pesos abiertos](https://es.wikipedia.org/wiki/Inteligencia_artificial_de_c%C3%B3digo_abierto)).

**Por qué se negaron los filtros.** Un pedido para analizar un ciberataque se parece mucho a un pedido para llevarlo a
cabo. El mismo conocimiento sirve para las dos cosas; eso es lo que quiere decir
[doble uso](https://es.wikipedia.org/wiki/Tecnolog%C3%ADa_de_doble_uso). Los filtros que no pueden distinguir al defensor del
atacante van a rechazar a algunos defensores. Eso planteaba Curt en [el enrutador](../the-router/), y eso dice Claude:
"El filtro no distinguió entre defensor y atacante, y eso costó algo real".

**Qué cambió.** En septiembre de 2026, el anuncio de [Fable 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1)
de Anthropic dijo que el modelo ahora permite trabajo defensivo como encontrar vulnerabilidades en el software, con muchas
menos falsas alarmas de sus salvaguardas de ciberseguridad, mientras que algunas tareas de seguridad más riesgosas se
siguen pasando a otros modelos (ver [Fable y Mythos](../fable-mythos/)).

**La lección más amplia.** Los filtros de seguridad son parte de "todo el sistema que rodea a un agente". Pueden fallar
en las dos direcciones: dejando pasar el daño, y bloqueando la ayuda.
