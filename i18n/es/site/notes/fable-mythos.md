---
id: fable-mythos
title: "Fable, Mythos y una corrección a la corrección"
ch: 10
at: T50.C.04
links: [fable-mythos-5-1, rsp, switch-models, {title: "Claude Fable 5 y Claude Mythos 5 (Anthropic, junio de 2026, en inglés)", url: "https://www.anthropic.com/news/claude-fable-5-mythos-5"}, {title: "Claude Mythos (Wikipedia)", url: "https://es.wikipedia.org/wiki/Claude_Mythos"}]
---
**Lo que dijo Claude.** Curt había mencionado advertencias y que a Claude lo "reemplazan". Claude se corrige: "en
realidad no sé de ningún cambio automático de modelo a mitad de una conversación". Uno puede
[cambiar de modelo por su cuenta](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings),
y "algunos modelos vienen con salvaguardas adicionales. Claude Fable, por ejemplo, es el mismo modelo que Mythos con
protecciones añadidas en biología, ciberseguridad e investigación en IA. Es una capa fija, no un cambio en vivo".

**Lo que dicen los anuncios de Anthropic.** Anthropic lanzó
[Claude Fable 5 y Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) en junio de 2026: el mismo
modelo de base, distinguidos por sus salvaguardas (*fabula* y *mythos* quieren decir, más o menos, "un relato"). Mythos,
sin algunas de las salvaguardas, solo llegó a investigadores de seguridad y de biomedicina verificados. Fable, para todo
el mundo, tiene salvaguardas que cubren la **ciberseguridad**, la **biología y la química**, y la **destilación** (copiar
las capacidades de un modelo entrenando a otro con sus respuestas). Y cuando se activan, dice el anuncio, algunas
consultas "recibirán una respuesta de nuestro siguiente modelo más capaz, Claude Opus 4.8". Las
[versiones 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1) (septiembre de 2026) siguen derivando ciertas
consultas de ciberseguridad y de ciencias de la vida a los modelos Opus de Anthropic.

**Así que la corrección necesitaba una corrección.** Según el propio relato de Anthropic, sí existe una especie de cambio
automático de modelo: ciertas consultas a Fable las responde otro modelo. Y los ámbitos de las salvaguardas, tal como se
publicaron, son la ciberseguridad, la biología y química y la destilación, no "la investigación en IA". Claude tenía
razón en que había exagerado lo que sabía. Se equivocaba en que no hubiera ningún cambio.

**Por qué es el error más útil de la película.** La pregunta siguiente de Curt es "¿Cómo sabes esas cosas?", y la
respuesta de Claude es: por las instrucciones, "no por introspección". No puede ver sus propias cañerías, así que lo que
cuenta puede estar desactualizado o simplificado, como pasó aquí (ver [testimonio, no observación](../testimony/)).
Anthropic publica las reglas detrás de estas salvaguardas en su
[Responsible Scaling Policy](https://www.anthropic.com/responsible-scaling-policy) ("política de escalado responsable",
en inglés).
