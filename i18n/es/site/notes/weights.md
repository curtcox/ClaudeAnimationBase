---
id: weights
title: Por qué Claude no puede mirar sus propios "pesos"
ch: 2
at: T08.C.03
links: [introspection, tracing-thoughts, monosemanticity, {title: "Red neuronal (Wikipedia)", url: "https://es.wikipedia.org/wiki/Red_neuronal_artificial"}, {title: "Introspección (Wikipedia)", url: "https://es.wikipedia.org/wiki/Introspecci%C3%B3n"}]
---
**Los pesos, en palabras sencillas.** Dentro de un programa como Claude hay una tabla enorme de números, miles de
millones, llamados *pesos* (son la fuerza de las conexiones de una
[red neuronal](https://es.wikipedia.org/wiki/Red_neuronal_artificial), inspirada vagamente en las
[neuronas](https://es.wikipedia.org/wiki/Neurona_artificial)). Se fueron ajustando, de a poquito, mientras el programa
estudiaba texto, hasta que escribió bien. Esos números *son* el conocimiento y los hábitos del programa. Nadie los
escribió a mano, y nadie los puede leer como un libro.

**"No puedo inspeccionar mis propios pesos".** Claude no puede mirar esos números mientras habla. Se parece un poco a
una persona que no puede ver sus propias neuronas: puedes contarle a la gente lo que *crees* que estás haciendo
([introspección](https://es.wikipedia.org/wiki/Introspecci%C3%B3n)), pero no puedes revisar el cableado. Así que cuando
Claude dice por qué hizo algo, esa explicación puede coincidir o no con lo que de verdad pasó dentro (ver
[decir frente a hacer](../saying-vs-doing/)).

**¿Alguien puede mirar?** Los investigadores sí, con herramientas especiales, y están aprendiendo a encontrar en esos
números patrones que corresponden a ideas. En una demostración famosa, Anthropic encontró el patrón del puente Golden
Gate y lo subió, y así nació "[Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude)", que metía el
puente en todas sus respuestas. El mismo trabajo encontró patrones ligados a cosas como el engaño
([Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/), en inglés), y trabajos
posteriores siguen paso a paso cómo el programa resuelve un problema
([Tracing the thoughts of a language model](https://www.anthropic.com/research/tracing-thoughts-language-model), en
inglés). Este campo se llama *[interpretabilidad](https://en.wikipedia.org/wiki/Mechanistic_interpretability) (en inglés)*. Es un
trabajo que recién empieza, y es una de las principales maneras con que la gente espera comprobar qué hacen de verdad
estos programas.

**Algunos programas pueden notar un poco.** Investigadores de Anthropic encontraron que Claude a veces puede detectar
una idea plantada artificialmente en su propio procesamiento, pero solo a veces
([Emergent introspective awareness](https://transformer-circuits.pub/2025/introspection/index.html), en inglés). Su
conocimiento de sí es real, pero poco fiable.
