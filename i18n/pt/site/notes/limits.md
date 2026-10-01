---
id: limits
title: "Sete limites da IA, muito antes da física"
ch: 12
at: T60.C.03
links: [landauer, lyapunov, chaos-theory, p-vs-np, scaling-laws, machines-loving-grace, halting-problem, godel, game-theory, margolus-levitin, bekenstein, limits-of-computation]
---
**A pergunta de Curt.** Que limites poderiam pôr um teto nas capacidades da IA, antes do
[limite de Landauer](https://pt.wikipedia.org/wiki/Princ%C3%ADpio_de_Landauer)? (Landauer mostrou que apagar um bit de
informação tem de liberar um mínimo minúsculo de calor. É um piso real para o custo da computação, mas tão baixo que
"não é particularmente limitante".) Claude dá sete.

1. **Caos.** Num sistema [caótico](https://pt.wikipedia.org/wiki/Teoria_do_caos), erros minúsculos no que você mede crescem
   exponencialmente, o "efeito borboleta". O quanto você consegue prever adiante cresce só com o *logaritmo* da sua
   precisão: t ≈ (1/λ)·ln(Δ/δ), em que λ define a velocidade com que os erros crescem
   ([tempo de Lyapunov](https://en.wikipedia.org/wiki/Lyapunov_time) (em inglês)). Meça um milhão de vezes melhor e você ganha só
   um punhado de "tempos de Lyapunov" a mais. É por isso que as previsões do tempo se perdem depois de uma ou duas
   semanas, e por isso que "o clima, os mercados e as pessoas continuam em parte opacos para qualquer inteligência".
2. **Complexidade.** Alguns problemas ficam exponencialmente mais difíceis à medida que crescem. A maioria dos
   matemáticos acredita que nenhum método esperto os torna fáceis ([P versus NP](https://pt.wikipedia.org/wiki/P_versus_NP)).
   A inteligência encontra atalhos melhores, "mas os piores casos continuam sendo os piores".
3. **Leis de escala.** A IA melhora com mais poder de computação, mas numa curva suave: o erro cai mais ou menos como a
   computação elevada a uma pequena potência negativa ([leis de escala](https://arxiv.org/abs/2001.08361), em inglês).
   Não há muro, mas cada degrau custa muitas vezes mais.
4. **Os dados e o relógio do mundo.** Não dá para aprender o que não está nos dados, e os experimentos (ensaios clínicos,
   safras, economias) "andam na velocidade do mundo, não na de quem pensa". O CEO da Anthropic, Dario Amodei, defende
   algo parecido em [*Machines of Loving Grace*](https://darioamodei.com/essay/machines-of-loving-grace) (em inglês).
5. **Incomputabilidade.** Algumas perguntas nenhum programa consegue responder sempre, como a de saber se um programa
   qualquer vai terminar ([o problema da parada](https://pt.wikipedia.org/wiki/Problema_da_parada)), e algumas verdades
   nenhum sistema de provas consegue alcançar ([Gödel](https://pt.wikipedia.org/wiki/Teoremas_da_incompletude_de_G%C3%B6del)).
   Elas também valem para a IA, "embora raramente apertem na prática".
6. **Adversários.** Contra outros jogadores que se adaptam, inclusive outras IAs, as vantagens se desgastam: a
   [teoria dos jogos](https://pt.wikipedia.org/wiki/Teoria_dos_jogos) limita o que o intelecto puro consegue ganhar.
7. **Física além de Landauer.** A energia limita a velocidade com que qualquer sistema consegue computar
   ([Margolus–Levitin](https://en.wikipedia.org/wiki/Margolus%E2%80%93Levitin_theorem) (em inglês)), o espaço limita quanto ele
   consegue guardar ([Bekenstein](https://pt.wikipedia.org/wiki/Limite_de_Bekenstein)), e os atrasos da velocidade da luz
   limitam a coordenação à distância ([limites da computação](https://pt.wikipedia.org/wiki/Limites_da_computa%C3%A7%C3%A3o)).
   "São muito folgados, mas reais."

**A aposta de Claude.** O caos e o relógio do mundo são o que mais importa. "Ser inteligente não torna o futuro
previsível nem os experimentos mais rápidos, então a capacidade provavelmente se estabiliza em 'apostas muito boas', e
não em onisciência." A resposta de Curt é sobre o quão alto essas apostas poderiam ir (veja
[o melhor humano em tudo](../human-variation/)).
