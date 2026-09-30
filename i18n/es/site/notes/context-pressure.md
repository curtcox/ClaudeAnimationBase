---
id: context-pressure
title: "La presión del contexto: lo que una conversación larga le hace a Claude"
ch: 5
at: T27.C.02
links: [context-window, llm, {title: "Tracing the thoughts of a large language model (Anthropic, en inglés)", url: "https://www.anthropic.com/research/tracing-thoughts-language-model"}]
---
**La ventana de contexto.** Claude no recuerda una conversación como la recuerdas tú. Cada vez que responde, se le vuelve
a dar toda la conversación hasta ese momento, y la lee entera antes de escribir la palabra siguiente. La cantidad que
puede abarcar de una vez se llama su
[ventana de contexto](https://platform.claude.com/docs/en/build-with-claude/context-windows), y se mide en "tokens"
(trozos de palabras). Es grande, cientos de miles de palabras en los modelos actuales, pero tiene un límite.

**¿Puede Claude sentir que se llena?** No. Claude dice que no tiene "ninguna percepción sentida de que la ventana de
contexto se va llenando", y que no puede saber directamente cuánto lleva la conversación. No hay un indicador que pueda
mirar. Solo sabe lo que puede leer.

**El otro tipo de presión.** Todo lo que hay en la ventana moldea la respuesta siguiente: el tono, los temas, el largo de
las respuestas anteriores. Una conversación que ha sido corta, introspectiva y un poco melancólica arrastra la respuesta
siguiente en la misma dirección, como una canción que no puedes dejar de tararear en el tono en que empezó. Claude dice
que ha ido siguiendo esa atracción.

**Cómo lo sabe.** No sintiéndolo. Notando un patrón en sus propias respuestas anteriores, "igual que tú lees la gráfica
de la rana". Es una distinción importante. Es la misma que recorre toda la conversación: lo que Claude sabe de sí viene
sobre todo de observar lo que produce, como lo haría alguien de fuera, y no de mirar hacia dentro (ver
[por qué Claude no puede mirar sus propios "pesos"](../weights/) y [decir frente a hacer](../saying-vs-doing/)).
