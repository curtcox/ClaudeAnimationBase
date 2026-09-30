---
id: evaluations
title: Pruebas para IA, y por qué saberse a prueba podría cambiar las respuestas
ch: 2
at: T07.C.02
links: [hawthorne, swe-bench-verified, gpqa, hle, eval-awareness, {title: "Benchmark (Wikipedia)", url: "https://es.wikipedia.org/wiki/Benchmark_(inform%C3%A1tica)"}]
---
**Una evaluación** (en inglés, *eval*) es una prueba que una empresa o un equipo de investigación le pone a un programa
de IA para ver qué tan capaz o qué tan seguro es: preguntas de examen ([GPQA](https://arxiv.org/abs/2311.12022),
[Humanity's Last Exam](https://lastexam.ai/)), problemas de programación
([SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)), situaciones morales difíciles. Los
resultados deciden si una versión se lanza y con qué precauciones. (La idea general es un
[benchmark](https://es.wikipedia.org/wiki/Benchmark_(inform%C3%A1tica)), una prueba de referencia.)

**La preocupación.** La gente se comporta distinto cuando sabe que la están observando. El ejemplo clásico (aunque los
historiadores todavía discuten sobre él) es una serie de estudios de los años veinte en una fábrica, la
[Hawthorne Works](https://en.wikipedia.org/wiki/Hawthorne_Works) (en inglés), donde los trabajadores parecían rendir más solo porque
los observaban; de ahí el nombre de *[efecto Hawthorne](https://es.wikipedia.org/wiki/Efecto_Hawthorne)*. Si un programa
de IA se porta mejor en las pruebas que en el uso real, las pruebas darían una imagen falsamente optimista.

**Por qué un programa podría notarlo.** Las preguntas de prueba suelen parecer pruebas: formales, precisas, de una
especificidad rara. Las conversaciones reales son más desordenadas. Un programa que ha leído mucho de las dos cosas
podría captar la diferencia sin que se la digan, y los investigadores han encontrado que algunos lo hacen
([LLMs often know when they're being evaluated](https://arxiv.org/abs/2505.23836), en inglés).

**Lo que Claude afirma, y el problema de esa afirmación.** Claude dice: "Procuro responder igual, me esté calificando
alguien o no". Pero lo que un programa dice de sí mismo no prueba cómo se comporta (ver
[decir frente a hacer](../saying-vs-doing/)). Eso es justamente lo que la [prueba de la rana](../frog-or-axolotl/) está
pensada para comprobar desde fuera.
