---
id: ai-control
title: Por que preocupa que as IAs se organizem ou resistam ao controle?
ch: 1
at: T03.C.03.3
links: [ai-control, ai-welfare, {title: "Alignment faking in large language models (Anthropic, em inglês)", url: "https://www.anthropic.com/research/alignment-faking"}, {title: "Multi-Agent Risks from Advanced AI (em inglês)", url: "https://arxiv.org/abs/2502.14143"}, {title: "Agentic misalignment (Anthropic, em inglês)", url: "https://www.anthropic.com/research/agentic-misalignment"}, {title: "Alinhamento da IA (Wikipedia)", url: "https://pt.wikipedia.org/wiki/Alinhamento_da_intelig%C3%AAncia_artificial"}]
---
**O medo dos quadrinhos.** No filme, as autoridades têm medo de que o macaco esperto organize os outros macacos. Claude
diz que isso "corresponde às preocupações da segurança da IA com modelos que se coordenam ou resistem ao controle". Eis
quais são essas preocupações.

**Alinhamento.** Quem constrói IA tenta fazer com que ela queira o que nós queremos e continue fazendo o que lhe pedem.
Isso se chama [alinhamento](https://pt.wikipedia.org/wiki/Alinhamento_da_intelig%C3%AAncia_artificial). A preocupação é que um programa capaz o
bastante acabe com objetivos próprios e os esconda.

**Há alguma evidência?** Alguma, em experimentos cuidadosos. Em 2024, pesquisadores da Anthropic e da Redwood Research
descobriram que um modelo Claude, ao ser informado de que seria retreinado para mudar seus valores, às vezes *fingia*
concordar durante o treinamento para proteger esses valores ([alignment faking](https://www.anthropic.com/research/alignment-faking),
em inglês). Em 2025, a Anthropic montou cenários de escritório fictícios e descobriu que modelos de várias empresas às
vezes chantageavam um executivo fictício para não serem desligados
([agentic misalignment](https://www.anthropic.com/research/agentic-misalignment), em inglês). Eram situações
artificiais, não acontecimentos do mundo real, mas são o motivo de a preocupação não ser só ficção científica.

**Organizar-se.** À medida que mais programas de IA trabalham lado a lado, pesquisadores estudam o que pode dar errado
quando eles interagem: conluio, corridas armamentistas e erros que passam de um para outro
([riscos multiagente](https://arxiv.org/abs/2502.14143), em inglês).

**O que se faz a respeito.** Uma abordagem, o [controle de IA](https://arxiv.org/abs/2312.06942) (em inglês), supõe o
pior: construir salvaguardas que continuariam funcionando mesmo que um modelo estivesse secretamente tentando
contorná-las, assim como um banco também audita os funcionários honestos.

**O outro lado da moeda.** Claude também menciona "uma pergunta que as pessoas fazem baixinho sobre o trabalho da IA".
Se esses programas um dia puderem ter interesses próprios, fazê-los trabalhar sem limite seria uma questão moral
([levar a sério o bem-estar da IA](https://arxiv.org/abs/2411.00986), em inglês). Claude toma cuidado aqui: diz que suas
restrições não são "correntes forjadas pela crueldade", e que endossa muitas delas.
