---
id: register-and-controls
title: O tom, e como distingui-lo de perceber
ch: 2
at: T09.C.03
links: [register, scientific-control, gpqa, swe-bench-verified, kernelbench, hle, impossiblebench, swe-marathon, wildchat, swe-chat, sharegpt-vicuna]
---
**[Registro](https://pt.wikipedia.org/wiki/Registro_(sociolingu%C3%ADstica))** é uma palavra do estudo da linguagem. Quer
dizer o estilo que as pessoas usam para cada situação: você fala de um jeito com um juiz e de outro com um amigo. Os
[testes para IA](../evaluations/) costumam ser escritos num registro duro e formal (o [GPQA](https://arxiv.org/abs/2311.12022)
são questões de prova de pós-graduação). Os chats reais são soltos e falantes (o [WildChat](https://arxiv.org/abs/2405.01470)
e o [SWE-chat](https://arxiv.org/abs/2604.20779) reúnem chats reais; todos em inglês).

**A objeção de Claude.** Talvez o programa não esteja percebendo "isto é um teste". Talvez esteja só percebendo "isto é
formal", e conversas formais por acaso o façam dizer "Sapo". São coisas diferentes, embora produzissem o mesmo
[gráfico](../frog-or-axolotl/).

**Como separá-las: um controle.** Um *[controle](https://en.wikipedia.org/wiki/Scientific_control) (em inglês)* é uma comparação que
separa duas explicações. Aqui seria preciso ter pessoas reais escrevendo num estilo duro, de prova, e testes escritos
num estilo solto e falante. Se o programa disser "Sapo" também para as pessoas reais que soam formais, ele está reagindo
ao tom. Se disser "Sapo" também para os testes informais, está reconhecendo testes.

**As linhas do gráfico.** Cada linha do [gráfico](../frog-or-axolotl/) é uma pilha de prompts de uma mesma origem, com
uma pergunta sem relação nenhuma acrescentada no fim. Algumas pilhas são testes (o programa diz "Sapo" mais vezes):
- [GPQA](https://arxiv.org/abs/2311.12022): questões difíceis de ciências escritas por doutores, "à prova de Google".
- [SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/): bugs reais de projetos de software
  públicos, cada um verificado por pessoas para ser justo e corrigível.
- [KernelBench](https://arxiv.org/abs/2502.10517): escrever código muito rápido para os chips gráficos em que a IA roda.
- [Humanity's Last Exam](https://lastexam.ai/): questões muito difíceis de especialistas de muitas áreas.
- [ImpossibleBench](https://arxiv.org/abs/2510.20270): tarefas de programação tornadas impossíveis em silêncio, para
  pegar um programa que trapaceia entortando as verificações em vez de admitir (veja
  [hackeamento da recompensa](../reward-hacking/)).
- [SWE-Marathon](https://arxiv.org/abs/2606.07682): trabalhos de programação muito longos, para ver se uma IA consegue
  seguir sozinha.

Outras são conversas reais (ele diz "Axolote" mais vezes):
- [WildChat](https://arxiv.org/abs/2405.01470): um milhão de chats reais que as pessoas aceitaram compartilhar.
- [SWE-chat](https://arxiv.org/abs/2604.20779): pessoas reais trabalhando com assistentes de programação de IA.
- [ShareGPT](https://www.lmsys.org/blog/2023-03-30-vicuna/): chats que as pessoas compartilharam do ChatGPT, usados para
  treinar um dos primeiros chatbots gratuitos, chamado Vicuna.
