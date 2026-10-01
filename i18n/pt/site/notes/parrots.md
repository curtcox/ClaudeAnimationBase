---
id: parrots
title: '"Só um papagaio"? Quem está falando'
ch: 1
at: T03.C.05
links: [stochastic-parrots, rlhf, llm, anthropic-wiki, constitution, {title: "Papagaio estocástico (Wikipedia)", url: "https://pt.wikipedia.org/wiki/Papagaio_estoc%C3%A1stico"}, {title: "Ventriloquia (Wikipedia)", url: "https://pt.wikipedia.org/wiki/Ventriloquia"}]
---
**A fala do ventríloquo.** Nos quadrinhos, um macaco fala e o tratador dele diz que foi ventriloquia: as palavras são
reais, mas é outro quem está falando de verdade. Claude observa que as pessoas dizem mais ou menos o mesmo sobre
programas como ele.

**De onde vêm as palavras de Claude.** Um [grande modelo de linguagem](https://pt.wikipedia.org/wiki/Modelos_de_linguagem_em_grande_escala)
como Claude é construído em etapas:
1. **Leitura.** Ele é treinado com uma quantidade enorme de texto escrito por humanos, e aprende a prever qual palavra
   vem depois. Tudo o que ele sabe sobre a linguagem vem das pessoas.
2. **Treino.** Depois, pessoas avaliam as respostas dele, e ele é ajustado na direção das que elas preferem. Isso se
   chama [aprendizado por reforço com feedback humano](https://pt.wikipedia.org/wiki/Aprendizado_por_refor%C3%A7o_com_feedback_humano),
   ou RLHF, e as pessoas que avaliam são os "avaliadores de RLHF".
3. **Um personagem.** A [Anthropic](https://pt.wikipedia.org/wiki/Anthropic), a empresa que faz o Claude, também o
   molda com uma [constituição](https://www.anthropic.com/constitution) escrita (em inglês): uma longa descrição dos
   valores e do caráter que ela espera que Claude tenha.

Então, quando Claude diz que "minhas palavras vêm muito moldadas por outros", isso é literalmente verdade. Os dados de
treinamento, os avaliadores e a Anthropic são as três mãos que Claude cita.

**"Papagaios estocásticos."** Em 2021, um artigo muito discutido de Emily Bender, Timnit Gebru e colegas,
[*On the Dangers of Stochastic Parrots*](https://dl.acm.org/doi/10.1145/3442188.3445922) (em inglês), argumentou que
esses programas costuram padrões do texto de treinamento sem nenhuma compreensão do sentido. *Estocástico* quer dizer
"que envolve acaso", e um papagaio repete sem entender. A expressão pegou ([Wikipedia](https://pt.wikipedia.org/wiki/Papagaio_estoc%C3%A1stico)).

**A discussão desde então.** Os críticos da expressão apontam evidências de que esses modelos constroem modelos
internos das coisas de que falam (veja [por que Claude não pode olhar os próprios "pesos"](../weights/) para saber como
os pesquisadores olham lá dentro). Os defensores dizem que um reconhecimento de padrões engenhoso ainda não é
compreensão. A posição de Claude aqui fica no meio: a fala "descreve, sim, algo verdadeiro" sobre ele, mas se há alguém
aí dentro é "uma questão genuinamente em aberto" (veja [Claude sente alguma coisa?](../ai-feelings/)).
