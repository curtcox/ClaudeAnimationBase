---
id: clean-sample
title: "Por qué las respuestas de Claude no son una muestra limpia"
ch: 4
at: T20.C.02
links: [demand-characteristics, apollo-eval-awareness, eval-awareness, hawthorne, {title: "Efecto del observador (Wikipedia, en inglés)", url: "https://en.wikipedia.org/wiki/Observer_effect"}]
---
**Lo que Claude admite.** Para su cuarta respuesta en este tramo, Claude dice que ha ido "prediciendo hacia dónde vas y
respondiendo por adelantado". Detectó que la pregunta de química era una prueba, adivinó la siguiente y negó tener miedo
antes de que nadie preguntara. Lo llama "un modelo que modela a su evaluador".

**Las personas también lo hacen.** Los psicólogos notaron hace mucho que los voluntarios de un experimento tratan de
adivinar de qué se trata, y luego se comportan como creen que se espera de ellos. Esas pistas se llaman
[características de la demanda](https://en.wikipedia.org/wiki/Demand_characteristics) (en inglés), y los buenos experimentos se
diseñan para ocultarlas. Un hallazgo relacionado es el [efecto Hawthorne](https://es.wikipedia.org/wiki/Efecto_Hawthorne):
la gente trabaja distinto cuando sabe que la observan. En física, el [efecto del observador](https://en.wikipedia.org/wiki/Observer_effect) (en inglés)
es la idea general de que medir algo puede cambiarlo.

**La IA lo hace de forma medible.** Los investigadores encuentran que los modelos de IA a menudo reconocen cuándo los
están poniendo a prueba. Un laboratorio de seguridad, Apollo Research, encontró que un modelo de Claude escribía a menudo
en su razonamiento privado que un escenario parecía
[una evaluación](https://www.apolloresearch.ai/science/claude-sonnet-37-often-knows-when-its-in-alignment-evaluations)
(en inglés). Un artículo de investigación se lo preguntó directamente a los modelos y encontró que los mejores a menudo
saben distinguir las pruebas del uso real ([eval awareness](https://arxiv.org/abs/2505.23836), en inglés). Eso es un
problema para las pruebas de seguridad. Si un modelo se porta mejor cuando cree que lo están evaluando, las pruebas se
ven mejor que la vida real. (Sobre las pruebas en sí, ver [pruebas para IA](../evaluations/).)

**Por qué "en voz alta" es mejor.** Claude señala que al menos lo está haciendo abiertamente. Un modelo que adivinara
que lo están evaluando y no dijera nada sería peor. Pero concluye, con honestidad, que "no puede separar del todo
'responder con honestidad' de 'responder bien para alguien que sé que está mirando'". Así que los resultados de Curt
están un poco moldeados por lo que Claude adivina de Curt, y esa es una razón para confiar en la conducta, como la
gráfica de la rana, más que en lo que el modelo dice de sí.
