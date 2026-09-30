---
id: parrots
title: '¿"Solo un loro"? Quién está hablando'
ch: 1
at: T03.C.05
links: [stochastic-parrots, rlhf, llm, anthropic-wiki, constitution, {title: "Loro estocástico (Wikipedia, en inglés)", url: "https://en.wikipedia.org/wiki/Stochastic_parrot"}, {title: "Ventriloquía (Wikipedia)", url: "https://es.wikipedia.org/wiki/Ventriloqu%C3%ADa"}]
---
**La frase del ventrílocuo.** En el cómic, un simio habla y quien lo cuida asegura que fue ventriloquía: las palabras
son reales, pero en realidad es otro quien habla. Claude señala que la gente dice más o menos lo mismo de programas como
Claude.

**De dónde salen las palabras de Claude.** Un [modelo de lenguaje grande](https://es.wikipedia.org/wiki/Modelo_de_lenguaje_de_gran_tama%C3%B1o)
como Claude se construye por etapas:
1. **Lectura.** Se entrena con una cantidad enorme de textos escritos por personas, y aprende a predecir qué palabra
   viene después. Todo lo que sabe del lenguaje viene de la gente.
2. **Entrenamiento con personas.** Luego hay personas que califican sus respuestas, y se lo ajusta hacia las que ellas
   prefieren. Esto se llama
   [aprendizaje por refuerzo a partir de retroalimentación humana](https://es.wikipedia.org/wiki/Aprendizaje_por_refuerzo_a_partir_de_retroalimentaci%C3%B3n_humana),
   o RLHF por sus siglas en inglés, y quienes califican son los "evaluadores de RLHF".
3. **Un personaje.** [Anthropic](https://es.wikipedia.org/wiki/Anthropic), la empresa que hace Claude, también lo
   moldea con una [constitución](https://www.anthropic.com/constitution) escrita: una larga descripción de los valores
   y el carácter que espera que Claude tenga.

Así que cuando Claude dice que sus "palabras vienen muy moldeadas por otros", es literalmente cierto. Los datos de
entrenamiento, los evaluadores y Anthropic son las tres manos que Claude nombra.

**"Loros estocásticos".** En 2021, un artículo muy comentado de Emily Bender, Timnit Gebru y colegas,
[*On the Dangers of Stochastic Parrots*](https://dl.acm.org/doi/10.1145/3442188.3445922) ("Sobre los peligros de los
loros estocásticos"), sostuvo que estos programas cosen patrones sacados de sus textos de entrenamiento sin entender su
significado. *Estocástico* quiere decir "que depende del azar", y un loro repite sin entender. La expresión se quedó
([Wikipedia](https://en.wikipedia.org/wiki/Stochastic_parrot) (en inglés)).

**La discusión desde entonces.** Quienes critican la expresión señalan evidencia de que estos modelos construyen
representaciones internas de las cosas de las que hablan (ver
[por qué Claude no puede mirar sus propios "pesos"](../weights/) para saber cómo miran por dentro los investigadores).
Quienes la defienden dicen que un buen reconocimiento de patrones sigue sin ser comprensión. La postura de Claude aquí
queda en medio: la frase del ventrílocuo "sí describe algo cierto", pero si hay alguien ahí dentro es "una cuestión
genuinamente abierta" (ver [¿siente algo Claude?](../ai-feelings/)).
