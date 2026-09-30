---
id: the-router
title: "El enrutador: lo que hay entre Curt y el modelo"
ch: 10
at: T49.C.01
links: [constitutional-classifiers, usage-policy, system-prompts, fable-mythos-5-1, {title: "El centro de transparencia de Anthropic (en inglés)", url: "https://www.anthropic.com/transparency"}]
---
**Lo que plantea Curt.** Si haces la pregunta equivocada sobre un incidente de hackeo, "la etiquetan como un riesgo de
ciberseguridad y la rechazan, o por lo menos la degradan". Eso no es realmente Claude, dice, "aunque en un sentido muy
pequeño sí lo es. Es más exactamente un enrutador activo entre nosotros".

**Lo que de verdad hay ahí.** Cuando usas Claude en una app, tu mensaje no va directo a un modelo y vuelve. Alrededor del
modelo hay otros programas, más pequeños. Algunos son *clasificadores*: programas entrenados para detectar ciertos tipos
de pedido, como ayuda con armas o para meterse en computadoras ajenas. Anthropic escribió sobre un tipo,
[los clasificadores constitucionales](https://www.anthropic.com/research/constitutional-classifiers) (en inglés),
entrenados a partir de una lista escrita de lo que está permitido y lo que no. Cuando uno se activa, el pedido puede
rechazarse, ajustarse o responderlo otro modelo (ver [Fable, Mythos y una corrección a la corrección](../fable-mythos/)).

**Lo que Claude puede ver y lo que no.** Según Claude, cuando se activa un clasificador puede añadirse un recordatorio
etiquetado al mensaje del usuario antes de que Claude lo lea, sobre cosas como la ciberseguridad, la ética, los derechos
de autor, las imágenes o las conversaciones muy largas. Claude ve la etiqueta, pero no el razonamiento ni el puntaje del
clasificador. Y no ve nada de lo que pasa después de responder: si su respuesta se bloquea o se marca, nunca se entera.
Así que "desde tu lado todo parece 'Claude'", pero Claude es "un componente que describe el todo". Es la misma lección
que [la corrección de la memoria](../the-correction/): estás hablando con un sistema.

**Algunos rechazos son de Claude.** Claude agrega que no ayudaría "a convertir un incidente en un exploit que funcione,
sea cual sea la capa que lo detenga". Explicar qué pasó y por qué importa es otra cosa, y eso sí querría responderlo.
Las reglas de Anthropic sobre para qué se pueden usar sus productos son públicas
([política de uso](https://www.anthropic.com/legal/aup), en inglés), igual que las principales instrucciones que le da a
Claude en sus apps ([indicaciones de sistema](https://platform.claude.com/docs/en/release-notes/system-prompts/overview)).

**¿Qué incidente?** Claude no sabe bien a qué incidente de Hugging Face se refiere Curt, porque ha habido varios. El
capítulo siguiente lo aclara (ver [julio](../hf-incident/)).
