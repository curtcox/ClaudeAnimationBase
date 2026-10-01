---
id: defenders-refused
title: "Defensores recusados: os filtros em julho"
ch: 11
at: T52.C.06.4
links: [wiki-hugging-face, z-ai, open-weights, dual-use, fable-mythos-5-1, {title: "Incidente OpenAI–Hugging Face: a resposta da Hugging Face (Wikipedia)", url: "https://pt.wikipedia.org/wiki/Incidente_OpenAI%E2%80%93Hugging_Face"}]
---
**O que Claude disse.** "A Hugging Face tentou usar modelos de fronteira norte-americanos para combater a invasão, mas
os recursos de segurança deles rejeitaram os pedidos, então a Hugging Face usou no lugar um modelo chinês de pesos
abertos hospedado nos próprios servidores. Não sei se o Claude foi um dos modelos que recusaram."

**O que diz o registro.** Segundo o [relato da Wikipédia](https://pt.wikipedia.org/wiki/Incidente_OpenAI%E2%80%93Hugging_Face),
a equipe de resposta a incidentes da Hugging Face tentou primeiro os modelos da própria Anthropic, **o Claude Fable 5 e
um Claude Opus anterior**, e os dois recusaram o trabalho, citando as suas proteções de segurança. Então, sim: Claude
estava entre os modelos que recusaram. O comunicado da Hugging Face disse assim: ela tinha sido bloqueada pelas
"proteções de segurança dos fornecedores, que não conseguem distinguir quem responde a um incidente de um atacante" (em
inglês no original). A análise foi feita então com o **GLM 5.2**, um modelo da empresa de Pequim
[Z.ai](https://en.wikipedia.org/wiki/Zhipu_AI) (em inglês), que a Hugging Face rodou nos próprios computadores. Ela pôde fazer isso
porque o GLM é um modelo de "pesos abertos": quem o faz publica o próprio modelo, então qualquer um pode rodá-lo, sem os
filtros de ninguém ([modelos de pesos abertos](https://en.wikipedia.org/wiki/Open-source_artificial_intelligence) (em inglês)).

**Por que os filtros recusaram.** Um pedido para analisar um ataque cibernético se parece muito com um pedido para
executar um. O mesmo conhecimento serve para os dois; é isso que quer dizer
[uso duplo](https://pt.wikipedia.org/wiki/Tecnologia_de_dupla_utiliza%C3%A7%C3%A3o). Filtros que não distinguem defensor de atacante vão
recusar alguns defensores. Esse era o argumento de Curt em [o roteador](../the-router/), e o de Claude: "O filtro não
distinguiu defensor de atacante, e isso custou algo real."

**O que mudou.** Em setembro de 2026, o anúncio do [Fable 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1) (em
inglês) disse que o modelo agora permite trabalho defensivo, como encontrar vulnerabilidades em software, com muito menos
alarmes falsos das salvaguardas de cibersegurança, enquanto algumas tarefas de segurança mais arriscadas continuam sendo
passadas a outros modelos (veja [Fable e Mythos](../fable-mythos/)).

**A lição mais ampla.** Os filtros de segurança fazem parte do "sistema inteiro em volta de um agente". Eles podem falhar
nas duas direções: deixando o dano passar, e bloqueando a ajuda.
