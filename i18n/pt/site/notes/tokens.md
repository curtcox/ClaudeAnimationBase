---
id: tokens
title: "Os tokens: por que Claude vê os erros de digitação mas tem dificuldade para contar letras"
ch: 12
at: T57.C.03
links: [tokenizers, bpe, solidgoldmagikarp, glitch-token, magikarp]
---
**Claude não lê letras.** Antes que qualquer texto chegue a um modelo como Claude, ele é picado em pedaços chamados
*tokens*: palavras comuns viram um pedaço só, palavras mais raras viram vários (em inglês, por exemplo, "ax" e "olotl").
O modelo só vê os pedaços, como números. As regras de corte são aprendidas a partir de muito texto, em geral por um
método chamado [codificação por pares de bytes](https://en.wikipedia.org/wiki/Byte-pair_encoding) (em inglês)
([uma explicação acessível](https://huggingface.co/learn/llm-course/chapter2/4), em inglês).

**Por isso encontrar erros de digitação é fácil.** Uma palavra escrita errado se parte em pedaços incomuns, e pedaços
estranhos numa frase conhecida se destacam, "como notar uma nota errada numa música que você conhece sem ler a
partitura". Foi assim que Claude notou que Curt escreveu "Magicarp", quando o Pokémon é
[Magikarp](https://pt.wikipedia.org/wiki/Fam%C3%ADlia_de_Magikarp), com k.

**E contar letras é difícil.** Pergunte "quantos r há em *strawberry*?" e um modelo vê talvez três pedaços, não dez
letras. Ele aprendeu o que há dentro de cada pedaço só de forma indireta, e contar exige uma contabilidade letra por
letra através dos pedaços. Durante anos, os chatbots erraram isso de forma famosa. A comparação de Claude: "contar os
'e' de uma palavra que você só viu como uma forma inteira". Os modelos mais novos se saem melhor, em parte soletrando a
palavra primeiro e contando depois.

**SolidGoldMagikarp foi outra coisa.** Em 2023, pesquisadores descobriram que pedir ao GPT-3 que repetisse certas
palavras estranhas, como " SolidGoldMagikarp", produzia evasivas, insultos ou absurdos
([a publicação original](https://www.lesswrong.com/posts/aPeJE8bSo6rAFoLqg/solidgoldmagikarp-plus-prompt-generation), em
inglês). A causa: as regras de corte tinham sido construídas a partir de textos em que essas sequências eram comuns
(algumas eram nomes de usuário do Reddit), então cada uma ganhou o próprio token, mas o modelo em si quase nunca as viu no
treinamento. Ele tinha um token praticamente sem significado nenhum, uma "palavra fantasma". Hoje elas se chamam
[tokens defeituosos](https://en.wikipedia.org/wiki/Glitch_token) (em inglês) (*glitch tokens*). Não era problema de ortografia: era
uma lacuna no arquivo do dicionário.

[Nota da tradução: as demonstrações de tokens no filme continuam em inglês, porque mostram o texto em inglês que o
modelo leu de verdade; em português, as palavras se partiriam em outros pedaços.]
