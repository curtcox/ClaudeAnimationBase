---
id: limits
title: "Siete límites de la IA, mucho antes de la física"
ch: 12
at: T60.C.03
links: [landauer, lyapunov, chaos-theory, p-vs-np, scaling-laws, machines-loving-grace, halting-problem, godel, game-theory, margolus-levitin, bekenstein, limits-of-computation]
---
**La pregunta de Curt.** ¿Qué límites podrían ponerle tope a las capacidades de la IA antes de llegar al
[límite de Landauer](https://es.wikipedia.org/wiki/Principio_de_Landauer)? (Landauer mostró que borrar un bit de
información libera obligatoriamente un mínimo diminuto de calor. Es un piso real para el costo de computar, pero tan bajo
que "no es particularmente limitante".) Claude da siete.

1. **Caos.** En un sistema [caótico](https://es.wikipedia.org/wiki/Teor%C3%ADa_del_caos), los errores diminutos en lo que mides
   crecen de forma exponencial: el "efecto mariposa". Cuánto puedes predecir hacia adelante crece solo con el
   *logaritmo* de tu precisión: t ≈ (1/λ)·ln(Δ/δ), donde λ fija qué tan rápido crecen los errores
   ([tiempo de Lyapunov](https://es.wikipedia.org/wiki/Tiempo_de_Liapunov)). Mide un millón de veces mejor y solo ganas un
   puñado de "tiempos de Lyapunov" más. Por eso los pronósticos del clima se desvanecen después de una o dos semanas, y
   por eso "el clima, los mercados y las personas siguen siendo en parte opacos para cualquier inteligencia".
2. **Complejidad.** Algunos problemas se vuelven exponencialmente más difíciles a medida que crecen. La mayoría de los
   matemáticos cree que ningún método ingenioso los vuelve fáciles
   ([P frente a NP](https://es.wikipedia.org/wiki/Clases_de_complejidad_P_y_NP)). La inteligencia encuentra mejores atajos, "pero
   los peores casos siguen siendo los peores".
3. **Leyes de escalamiento.** La IA mejora con más poder de cómputo, pero a lo largo de una curva suave: el error baja más
   o menos como el cómputo elevado a una pequeña potencia negativa
   ([leyes de escalamiento](https://arxiv.org/abs/2001.08361), en inglés). No hay un muro, pero cada escalón cuesta muchas
   veces más.
4. **Los datos y el reloj del mundo.** No se puede aprender lo que no está en los datos, y los experimentos (ensayos
   clínicos, cosechas, economías) "van a la velocidad del mundo, no a la de quien piensa". El director ejecutivo de
   Anthropic, Dario Amodei, sostiene algo parecido en
   [*Machines of Loving Grace*](https://darioamodei.com/essay/machines-of-loving-grace) (en inglés).
5. **Incomputabilidad.** Hay preguntas que ningún programa puede responder siempre, como si un programa cualquiera va a
   terminar ([el problema de la parada](https://es.wikipedia.org/wiki/Problema_de_la_parada)), y verdades que ningún sistema
   de demostración puede alcanzar ([Gödel](https://es.wikipedia.org/wiki/Teoremas_de_incompletitud_de_G%C3%B6del)).
   También se aplican a la IA, "aunque en la práctica rara vez aprietan".
6. **Adversarios.** Frente a otros jugadores que se adaptan, incluidas otras IA, las ventajas se erosionan: la
   [teoría de juegos](https://es.wikipedia.org/wiki/Teor%C3%ADa_de_juegos) limita lo que el puro intelecto puede ganar.
7. **Física más allá de Landauer.** La energía limita qué tan rápido puede computar cualquier sistema
   ([Margolus–Levitin](https://en.wikipedia.org/wiki/Margolus%E2%80%93Levitin_theorem) (en inglés)), el espacio limita cuánto puede
   contener ([Bekenstein](https://es.wikipedia.org/wiki/Frontera_Bekenstein)), y las demoras de la velocidad de la luz
   limitan la coordinación a distancia ([límites de la computación](https://en.wikipedia.org/wiki/Limits_of_computation) (en inglés)).
   "Son muy holgados, pero reales."

**La apuesta de Claude.** El caos y el reloj del mundo son los que más importan. "Ser inteligente no vuelve predecible el
futuro ni más rápidos los experimentos, así que la capacidad probablemente se estanca en 'apuestas muy buenas' y no en
omnisciencia." La respuesta de Curt es sobre qué tan alto podrían llegar esas apuestas (ver
[el mejor humano en todo](../human-variation/)).
