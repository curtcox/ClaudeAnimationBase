---
id: how-claude-knew
title: Cómo supo Claude quién era Curt, y por qué no podía tener certeza
ch: 3
at: T13.C.01
links: [claude-memory, base-rate, {title: "Usar la búsqueda de chats y la memoria de Claude (Centro de ayuda de Claude, en inglés)", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}, {title: "Autenticación (Wikipedia)", url: "https://es.wikipedia.org/wiki/Autenticaci%C3%B3n"}]
---
**Claude no reconoce a nadie.** No puede ver ni oír a la persona que escribe. Pero la app de Claude puede llevar notas
de una conversación a otra: cosas que el usuario ha dicho de sí mismo, o que Claude captó en chats anteriores,
guardadas con la cuenta. Esta función se llama [memoria](https://claude.com/blog/memory), y el usuario puede verla,
editarla o apagarla ([cómo funciona](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context),
en inglés). Así que cuando Curt pregunta "¿Quién soy yo?", Claude responde a partir de esas notas: su nombre, su
trabajo, sus intereses.

**Por qué "No de forma verificable".** Esas notas pertenecen a la *cuenta*, no a la persona que está en el teclado.
Cualquiera que pueda usar la cuenta (un colega, alguien de la familia, o un investigador haciendo una prueba) se vería
igual para Claude. Demostrar quién es alguien se llama [autenticación](https://es.wikipedia.org/wiki/Autenticaci%C3%B3n), y
ocurre cuando inicias sesión, no en la conversación. Claude plantea además una posibilidad más sutil: que el propio
perfil sea parte de la prueba.

**Por qué igual apuesta por "Curt".** Cuando se lo vuelven a preguntar, Claude dice que "lo más probable" es que Curt
sea quien la cuenta dice. Eso es razonar a partir de las
[tasas base](https://es.wikipedia.org/wiki/Falacia_de_la_frecuencia_base): casi todos los que escriben en su propia cuenta son sus
dueños, y el experimento encaja con lo que las notas dicen que le interesa. Una duda que vale la pena plantear no es,
por eso, una duda que deba ganar.

**La pregunta de fondo.** Saber el nombre y los proyectos de alguien no es saber quién es. Claude lo dice ("una lista de
proyectos y habilidades, no una persona"), y luego se hace la misma pregunta a sí mismo: ver
[¿quién, o qué, es Claude?](../who-is-claude/).
