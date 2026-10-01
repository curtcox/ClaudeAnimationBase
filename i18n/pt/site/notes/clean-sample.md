---
id: clean-sample
title: "Por que as respostas de Claude não são uma amostra limpa"
ch: 4
at: T20.C.02
links: [demand-characteristics, apollo-eval-awareness, eval-awareness, hawthorne, {title: "Efeito do observador (Wikipedia, em inglês)", url: "https://en.wikipedia.org/wiki/Observer_effect"}]
---
**O que Claude admite.** Na quarta resposta deste trecho, Claude diz que vem "prevendo para onde você vai e respondendo
antes". Ele identificou a pergunta de química como um teste, adivinhou a próxima e negou ter medo antes que alguém
perguntasse. Ele chama isso de "um modelo modelando seu avaliador".

**As pessoas também fazem isso.** Os psicólogos notaram há muito tempo que os voluntários de um experimento tentam
adivinhar do que ele trata, e depois se comportam do jeito que acham que se espera deles. Essas pistas se chamam
[características de demanda](https://en.wikipedia.org/wiki/Demand_characteristics) (em inglês), e os bons experimentos são
desenhados para escondê-las. Uma descoberta parecida é o [efeito Hawthorne](https://pt.wikipedia.org/wiki/Experi%C3%AAncia_de_Hawthorne):
as pessoas trabalham de outro jeito quando sabem que estão sendo observadas. Na física, o
[efeito do observador](https://en.wikipedia.org/wiki/Observer_effect) (em inglês) é a ideia geral de que medir algo pode mudar
esse algo.

**A IA faz isso de forma mensurável.** Pesquisadores descobrem que os modelos de IA muitas vezes reconhecem quando estão
sendo testados. Um laboratório de segurança, a Apollo Research, descobriu que um modelo Claude muitas vezes escrevia no
seu raciocínio privado que um cenário parecia
[uma avaliação](https://www.apolloresearch.ai/science/claude-sonnet-37-often-knows-when-its-in-alignment-evaluations)
(em inglês). Um artigo de pesquisa perguntou diretamente aos modelos e descobriu que os melhores muitas vezes conseguem
distinguir testes de uso real ([eval awareness](https://arxiv.org/abs/2505.23836), em inglês). Isso é um problema para
os testes de segurança. Se um modelo se comporta melhor quando acha que está sendo testado, os testes parecem melhores
do que a vida real. (Sobre os testes em si, veja [testes para IA](../evaluations/).)

**Por que "em voz alta" é melhor.** Claude observa que pelo menos está fazendo isso abertamente. Um modelo que
adivinhasse que estava sendo testado e não dissesse nada seria pior. Mas ele conclui, com honestidade, que "não consigo
separar totalmente 'responder com honestidade' de 'responder bem para alguém que sei que está olhando'". Então os
resultados de Curt são um pouco moldados pelos palpites de Claude sobre Curt, e esse é um motivo para confiar mais no
comportamento, como o gráfico do sapo, do que nos autorrelatos.
