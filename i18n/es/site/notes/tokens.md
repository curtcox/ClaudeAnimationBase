---
id: tokens
title: "Los tokens: por qué Claude ve los errores de tipeo pero le cuesta contar letras"
ch: 12
at: T57.C.03
links: [tokenizers, bpe, solidgoldmagikarp, glitch-token, magikarp]
---
**Claude no lee letras.** Antes de que un texto llegue a un modelo como Claude, se corta en trozos llamados *tokens*: las
palabras comunes se vuelven un solo trozo (en inglés, "the", "morning"), las más raras se vuelven varios ("ax", "olotl").
El modelo solo ve los trozos, como números. Las reglas de corte se aprenden de mucho texto, a menudo con un método
llamado [codificación por pares de bytes](https://es.wikipedia.org/wiki/Codificaci%C3%B3n_de_pares_de_bytes)
([una explicación amable](https://huggingface.co/learn/llm-course/chapter2/4), en inglés). [Nota de la traducción: los
ejemplos de esta página son palabras inglesas, el idioma de la conversación; una palabra española se corta en trozos
distintos.]

**Así que detectar errores de tipeo es fácil.** Una palabra mal escrita se parte en trozos poco comunes, y los trozos
raros en una frase conocida destacan, "como notar una nota equivocada en una canción que conoces sin leer la partitura".
Así notó Claude que Curt escribió "Magicarp", cuando el Pokémon es [Magikarp](https://en.wikipedia.org/wiki/Magikarp) (en inglés),
con k.

**Y contar letras es difícil.** Pregunta "¿cuántas erres hay en *strawberry*?" (fresa, en inglés) y un modelo quizá ve
tres trozos, no diez letras. Lo que hay dentro de cada trozo lo aprendió solo de forma indirecta, y contar exige llevar la
cuenta letra por letra a través de los trozos. Durante años, los chatbots fallaron en esto, y fue famoso. La comparación
de Claude: "contar las 'e' de una palabra que siempre viste solo como una forma completa". Los modelos más nuevos lo
hacen mejor, en parte deletreando primero la palabra y contando después.

**SolidGoldMagikarp fue otra cosa.** En 2023, unos investigadores encontraron que pedirle a GPT-3 que repitiera ciertas
palabras raras, como " SolidGoldMagikarp", producía evasivas, insultos o disparates
([la publicación original](https://www.lesswrong.com/posts/aPeJE8bSo6rAFoLqg/solidgoldmagikarp-plus-prompt-generation),
en inglés). La causa: las reglas de corte se habían armado con textos donde esas cadenas eran comunes (algunas eran
nombres de usuario de Reddit), así que cada una recibió su propio token, pero el modelo en sí casi nunca las vio en el
entrenamiento. Tenía un token prácticamente sin significado asociado, una "palabra fantasma". Hoy se llaman
[tokens defectuosos](https://en.wikipedia.org/wiki/Glitch_token) (en inglés, *glitch tokens*). No era un problema de
ortografía: era un hueco en el archivo del diccionario.
