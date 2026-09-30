---
id: rsi
title: "La RSI: una IA que se mejora a sí misma"
ch: 13
at: T63.C.04
links: [rsi-wiki, arxiv-aide2, arxiv-bounded, anthropic-rsi, mittr-rsi, datacamp-rsi, coxon-resigns]
---
**La pregunta.** "¿RSI para fin de año?" quiere decir: ¿veremos *automejora recursiva* (en inglés, *recursive
self-improvement*, RSI) antes de que termine el año? La RSI es un sistema de IA que se mejora a sí mismo, donde cada
mejora lo hace mejor para hacer la siguiente ([Wikipedia](https://es.wikipedia.org/wiki/Automejora_recursiva);
[un tutorial sencillo](https://www.datacamp.com/tutorial/recursive-self-improvement), en inglés). Es la idea detrás del
"foom" (ver [el foom](../foom/)).

**La respuesta de Claude: depende de qué RSI.**

**La RSI débil ya está aquí.** Un artículo publicado la semana de esta conversación,
[AIDE²](https://arxiv.org/abs/2609.26457) (en inglés), describe un agente de investigación de IA que reescribe su propio
código. Propone cambios a sí mismo, los prueba en tareas de investigación y se queda con los que ayudan, y cada versión
aceptada se convierte en la que se edita después. En una ejecución de 8 días encontró siete mejoras que también
funcionaron en tareas nuevas. Lo que reescribe es el código del propio agente, el software que rodea al modelo (Claude
lo llama "la capa del arnés"; ver [los arneses de agentes](../agent-harnesses/)), no el modelo en sí, que no se vuelve a
entrenar. El propio informe de Anthropic,
[*When AI builds itself*](https://www.anthropic.com/institute/recursive-self-improvement) ("Cuando la IA se construye a
sí misma", 2026, en inglés), describe cuánto de su propio desarrollo de IA ya le encarga a Claude: más del 80% del código
que incorpora lo escribe Claude. También dice que el ciclo todavía no está cerrado, y que las personas siguen dirigiendo
la investigación.

**La RSI fuerte es un ciclo abierto**, que mejora capacidades más rápido de lo que podrían las personas, con poca
supervisión humana. Claude le da cerca de un 5% para fin de año. Una revisión de julio de 1250 artículos
([From Bounded Self-Refinement to Autonomous Research Loops](https://arxiv.org/abs/2607.07663), en inglés) encontró que
esos ciclos están frenados por tres cosas: necesitan señales fiables de qué cuenta como mejor (el *anclaje*), pueden
degradarse al alimentarse de lo que ellos mismos producen (el *colapso*) y necesitan poder de cómputo (el *cómputo*).
[MIT Technology Review](https://www.technologyreview.com/2026/08/18/1142188/ai-recursive-self-improvement/) informó en
agosto que la RSI "quizá no llegue tan pronto, después de todo".

**El caso preocupante está en medio**: ciclos débiles, muchas copias y laboratorios compitiendo. En septiembre de 2026,
un investigador llamado Jacob Coxon renunció a Anthropic, escribiendo que las empresas de IA están "corriendo
directamente hacia una superinteligencia que se mejora a sí misma y apostando con nuestras vidas"
([TechCrunch](https://techcrunch.com/2026/09/09/gambling-with-our-lives-anthropic-researcher-quits-warns-against-self-improving-ai/),
en inglés).

**Y una aclaración.** "Soy el modelo de Anthropic, así que pondera mi 5% teniendo eso en cuenta."
