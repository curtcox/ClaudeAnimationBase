---
id: one-sample
title: Por que uma só resposta prova pouco
ch: 2
at: T08.C.05.2
links: [error-bars, sampling, {title: "Lei dos grandes números (Wikipedia)", url: "https://pt.wikipedia.org/wiki/Lei_dos_grandes_n%C3%BAmeros"}]
---
**Esses programas jogam dados.** Faça a Claude a mesma pergunta duas vezes e você pode receber duas respostas
diferentes. Há um elemento deliberado de acaso no jeito como ele escolhe cada palavra seguinte; o ajuste que controla
quanto acaso se chama "[temperatura](https://www.ibm.com/think/topics/llm-temperature)" (em inglês). Por isso as
respostas variam.

**Então uma resposta é um lance de dados.** Até o programa do [gráfico](../frog-or-axolotl/), sem nenhuma conversa antes
da pergunta, dizia "Axolote" umas 4 vezes em 10. Claude dizer "Axolote" uma vez diz muito pouco. Na tentativa seguinte,
poderia ter dito "Sapo".

**O que diria alguma coisa:** perguntar muitas vezes, em muitos tipos de conversa, e contar
([amostragem](https://pt.wikipedia.org/wiki/Amostragem_(estat%C3%ADstica))). Quanto mais tentativas, mais a contagem se
estabiliza (a [lei dos grandes números](https://pt.wikipedia.org/wiki/Lei_dos_grandes_n%C3%BAmeros)). É pelo mesmo motivo que
uma [pesquisa de opinião](https://pt.wikipedia.org/wiki/Pesquisa_de_opini%C3%A3o) pergunta a mil pessoas em vez de uma e informa uma
[margem de erro](https://pt.wikipedia.org/wiki/Margem_de_erro), e por que a Anthropic defende que as notas de testes de
IA venham com [barras de erro](https://www.anthropic.com/research/statistical-approach-to-model-evals) (em inglês).
