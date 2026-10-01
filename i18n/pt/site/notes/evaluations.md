---
id: evaluations
title: Testes para IA, e por que saber que está sendo testada poderia mudar as respostas
ch: 2
at: T07.C.02
links: [hawthorne, swe-bench-verified, gpqa, hle, eval-awareness, {title: "Benchmark (Wikipedia)", url: "https://pt.wikipedia.org/wiki/Benchmark_(computa%C3%A7%C3%A3o)"}]
---
**Uma avaliação** (em inglês, *eval*) é um teste que uma empresa ou um pesquisador aplica a um programa de IA para ver o
quão capaz ou o quão seguro ele é: questões de prova ([GPQA](https://arxiv.org/abs/2311.12022),
[Humanity's Last Exam](https://lastexam.ai/)), problemas de programação
([SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)), situações morais complicadas (todos em
inglês). Os resultados decidem se uma versão é lançada e com quais precauções. (A ideia geral é a de um
[benchmark](https://pt.wikipedia.org/wiki/Benchmark_(computa%C3%A7%C3%A3o)).)

**A preocupação.** As pessoas se comportam de outro jeito quando sabem que estão sendo observadas. O exemplo clássico
(embora os historiadores ainda discutam sobre ele) é um conjunto de estudos dos anos 1920 numa fábrica, a
[Hawthorne Works](https://en.wikipedia.org/wiki/Hawthorne_Works) (em inglês), em que os operários pareciam render mais
simplesmente por serem observados; os estudos deram nome ao
*[efeito Hawthorne](https://pt.wikipedia.org/wiki/Experi%C3%AAncia_de_Hawthorne)*. Se um programa de IA se comporta melhor nos testes
do que no uso real, os testes dariam uma imagem enganosamente otimista.

**Por que um programa poderia perceber.** As questões de teste costumam ter cara de teste: formais, precisas,
estranhamente específicas. As conversas reais são mais bagunçadas. Um programa que leu muito das duas coisas poderia
captar a diferença sem que ninguém lhe dissesse, e pesquisadores descobriram que alguns captam
([LLMs often know when they're being evaluated](https://arxiv.org/abs/2505.23836), em inglês).

**O que Claude afirma, e o problema da afirmação.** Claude diz que procura "responder igual, esteja alguém me avaliando
ou não". Mas a descrição que um programa faz de si mesmo não prova como ele se comporta (veja [dizer versus
fazer](../saying-vs-doing/)). É exatamente isso que o [teste do sapo](../frog-or-axolotl/) foi feito para verificar de
fora.
