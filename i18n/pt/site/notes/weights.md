---
id: weights
title: Por que Claude não pode olhar os próprios "pesos"
ch: 2
at: T08.C.03
links: [introspection, tracing-thoughts, monosemanticity, {title: "Rede neural (Wikipedia)", url: "https://pt.wikipedia.org/wiki/Rede_neural_artificial"}, {title: "Introspecção (Wikipedia)", url: "https://pt.wikipedia.org/wiki/Introspec%C3%A7%C3%A3o"}]
---
**Pesos, em termos simples.** Dentro de um programa como Claude há uma tabela enorme de números, bilhões deles,
chamados *pesos* (são as intensidades das conexões numa [rede neural](https://pt.wikipedia.org/wiki/Rede_neural_artificial),
inspirada de longe nos [neurônios](https://pt.wikipedia.org/wiki/Neur%C3%B4nio_artificial)). Eles foram ajustados, um
pouquinho de cada vez, enquanto o programa estudava texto, até ele escrever bem. Esses números *são* o conhecimento e os
hábitos do programa. Ninguém os escreveu à mão, e ninguém consegue lê-los como um livro.

**"Não posso inspecionar meus próprios pesos."** Claude não pode olhar esses números enquanto fala. É um pouco como uma
pessoa que não consegue ver os próprios neurônios: você pode contar aos outros o que *acha* que está fazendo
([introspecção](https://pt.wikipedia.org/wiki/Introspec%C3%A7%C3%A3o)), mas não pode verificar a fiação. Então, quando Claude diz
por que fez algo, essa explicação pode ou não corresponder ao que de fato aconteceu lá dentro (veja
[dizer versus fazer](../saying-vs-doing/)).

**Alguém consegue olhar?** Os pesquisadores conseguem, com ferramentas especiais, e estão aprendendo a encontrar nesses
números padrões que correspondem a ideias. Numa demonstração famosa, a Anthropic encontrou o padrão da ponte Golden Gate
e o aumentou, produzindo o "[Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude)" (em inglês), que
enfiava a ponte em todas as respostas. O mesmo trabalho encontrou padrões ligados a coisas como o engano
([Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/), em inglês), e trabalhos
posteriores acompanham como o programa resolve um problema passo a passo ([Tracing the thoughts of a language
model](https://www.anthropic.com/research/tracing-thoughts-language-model), em inglês). Essa área se chama
*[interpretabilidade](https://pt.wikipedia.org/wiki/Interpretabilidade_mecanicista)*. É um trabalho no começo, e é um dos
principais caminhos pelos quais se espera verificar o que esses programas estão realmente fazendo.

**Alguns programas conseguem notar um pouco.** Pesquisadores da Anthropic descobriram que Claude às vezes consegue
detectar uma ideia plantada artificialmente no seu próprio processamento, mas só às vezes
([Emergent introspective awareness](https://transformer-circuits.pub/2025/introspection/index.html), em inglês). O
autoconhecimento dele é real, mas pouco confiável.
