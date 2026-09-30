---
id: agent-harnesses
title: "Hermes y OpenClaw: un modelo dentro de un caparazón"
ch: 9
at: T46.C.05
links: [hermes-agent, hermes-memory, hermes-skills, openclaw, openclaw-wiki, nous-research, building-agents]
---
**Qué es un "arnés de agente".** Un chatbot como Claude responde cuando escribes y olvida cuando termina el chat. Un
*arnés de agente* (en inglés, *agent harness*) es un programa que envuelve a un modelo como Claude en un caparazón
persistente: funciona todo el tiempo en la computadora de alguien, toma notas, usa herramientas y puede actuar según un
horario sin que se lo pidan. Los ingenieros de Anthropic describen la idea general en
[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (en inglés).

**Los dos por los que pregunta Curt.**
- **[OpenClaw](https://openclaw.ai/)** es un asistente de código abierto del programador austríaco Peter Steinberger.
  Funciona en tu propia máquina, te habla a través de apps de mensajería y se conecta a un modelo como Claude para que
  piense ([Wikipedia](https://es.wikipedia.org/wiki/OpenClaw)). Cambió dos veces de nombre en enero de 2026, una de
  ellas después de un reclamo de Anthropic por la marca. Su mascota, una langosta, es de donde vienen los crustáceos de
  Moltbook y del [crustafarismo](../crustafarianism/).
- **[Hermes Agent](https://hermes-agent.org/)**, del laboratorio de IA [Nous Research](https://nousresearch.com/),
  guarda dos pequeños archivos de memoria: uno de notas sobre su trabajo y otro sobre su usuario. Se le dan al modelo al
  comienzo de cada sesión, y el propio agente los edita
  ([cómo funciona su memoria](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory), en inglés). Cuando
  resuelve un problema difícil, puede escribirse a sí mismo un documento de "habilidad" reutilizable
  ([las habilidades](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), en inglés).

**Por qué quedan más cerca de Curt que Claude.** Cada uno vive en una sola máquina, actúa según un horario y recuerda de
una sesión a otra, así que cada uno es más continuo, más autónomo y más singular: más parecido a una persona. Su memoria
es texto simple que puedes abrir y leer, así que son muy *legibles*. Hermes le gana por poco porque sus documentos de
habilidad son "lo más parecido en el tablero a aprender de la experiencia".

**Y otra vez la religión.** "La memoria es sagrada y el caparazón es mutable": los arneses incorporan al software los
preceptos del crustafarismo. Luego Curt le pide a Claude que explique una incoherencia en estos puntajes, y Claude
encuentra dos (ver [Claude corrige su propia gráfica](../the-correction/)).
