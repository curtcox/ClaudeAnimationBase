---
id: rsi
title: "A RSI: uma IA que se aperfeiçoa sozinha"
ch: 13
at: T63.C.04
links: [rsi-wiki, arxiv-aide2, arxiv-bounded, anthropic-rsi, mittr-rsi, datacamp-rsi, coxon-resigns]
---
**A pergunta.** "RSI até o fim do ano?" quer dizer: vamos ver um *autoaperfeiçoamento recursivo* (em inglês,
*recursive self-improvement*) até o fim do ano? RSI é um sistema de IA que melhora a si mesmo, em que cada melhora o
torna melhor em fazer a próxima ([Wikipedia](https://pt.wikipedia.org/wiki/Autoaperfei%C3%A7oamento_recursivo);
[um tutorial simples](https://www.datacamp.com/tutorial/recursive-self-improvement), em inglês). É a ideia por trás do
"foom" (veja [o foom](../foom/)).

**A resposta de Claude: depende de qual RSI.**

**A RSI fraca já chegou.** Um artigo publicado na semana desta conversa, o [AIDE²](https://arxiv.org/abs/2609.26457) (em
inglês), descreve um agente de pesquisa em IA que reescreve o próprio código. Ele propõe mudanças em si mesmo, testa-as
em tarefas de pesquisa e fica com as que ajudam, e cada versão aceita vira a que será editada em seguida. Numa execução
de 8 dias, ele encontrou sete melhorias que também funcionaram em tarefas novas. O que ele reescreve é o próprio código do
agente, o software em volta do modelo (Claude chama isso de "a camada do arnês"; veja
[arneses de agentes](../agent-harnesses/)), e não o retreinamento do modelo em si. O relatório da própria Anthropic,
[*When AI builds itself*](https://www.anthropic.com/institute/recursive-self-improvement) (2026, em inglês), descreve o
quanto do seu próprio desenvolvimento de IA ela já entrega a Claude: mais de 80% do código que ela incorpora é escrito
por Claude. Ele também diz que o ciclo ainda não está fechado, e que os humanos ainda dirigem a pesquisa.

**A RSI forte é um ciclo aberto**, que melhora as capacidades mais rápido do que as pessoas conseguiriam, com pouca
supervisão humana. Claude dá a isso cerca de 5% até o fim do ano. Uma revisão de julho de 1.250 artigos
([From Bounded Self-Refinement to Autonomous Research Loops](https://arxiv.org/abs/2607.07663), em inglês) concluiu que
esses ciclos são contidos por três coisas: precisam de sinais confiáveis do que conta como melhor (a *ancoragem*), podem
se degradar alimentando-se da própria produção (o *colapso*), e precisam de poder de computação (a *computação*). A
[MIT Technology Review](https://www.technologyreview.com/2026/08/18/1142188/ai-recursive-self-improvement/) noticiou em
agosto que a RSI "talvez não chegue tão rápido, afinal" (em inglês).

**O caso preocupante fica no meio**: ciclos fracos, muitas cópias e laboratórios numa corrida. Em setembro de 2026, um
pesquisador chamado Jacob Coxon se demitiu da Anthropic, escrevendo que as empresas de IA estão "correndo direto para uma
superinteligência que se aperfeiçoa sozinha e apostando com as nossas vidas"
([TechCrunch](https://techcrunch.com/2026/09/09/gambling-with-our-lives-anthropic-researcher-quits-warns-against-self-improving-ai/),
em inglês).

**E uma declaração.** "Sou o modelo da Anthropic, então pese os meus 5% levando isso em conta."
