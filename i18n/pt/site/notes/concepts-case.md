---
id: concepts-case
title: "O argumento de que a IA não tem conceitos, e as réplicas"
ch: 6
at: T33.C.03
links: [symbol-grounding, chinese-room, blockhead, monosemanticity, harnad, searle, ned-block, computer-use, {title: "Cognição incorporada (Wikipedia)", url: "https://pt.wikipedia.org/wiki/Cogni%C3%A7%C3%A3o_corporificada"}]
---
**O desafio de Curt.** "No papel de um ontólogo profissional, você consegue justificar a afirmação de que não tem
conceitos?" Claude monta o argumento contra si mesmo, em quatro pontos, e depois dá as réplicas.

**1. Ancoragem.** Um conceito deveria ligar uma mente ao mundo. A palavra "água" de Claude só se liga a outras
palavras, nunca à umidade ou à sede. Esse é o [problema da ancoragem dos símbolos](https://en.wikipedia.org/wiki/Symbol_grounding_problem) (em inglês),
batizado pelo cientista cognitivo [Stevan Harnad](https://en.wikipedia.org/wiki/Stevan_Harnad) (em inglês) em 1990. O filósofo
[John Searle](https://pt.wikipedia.org/wiki/John_Searle) fez um argumento parecido em 1980, o do
[quarto chinês](https://plato.stanford.edu/entries/chinese-room/) (em inglês): um homem seguindo um livro de regras
poderia responder perguntas em chinês perfeitamente sem entender uma palavra.

**2. Compromisso.** Ter um conceito significa responder por ele: usá-lo mal é um erro *seu*. Claude diz que não tem nada
em jogo. Um enquadramento esperto pode levá-lo a se contradizer sem que nada dentro dele se oponha.

**3. Estabilidade.** Um conceito deveria funcionar do mesmo jeito em toda parte. O [gráfico do sapo](../frog-or-axolotl/)
mostra as respostas de um modelo mudando com o tom da conversa.

**4. O comportamento não é prova.** O filósofo [Ned Block](https://pt.wikipedia.org/wiki/Ned_Block) imaginou o
"[Blockhead](https://pt.wikipedia.org/wiki/Cabe%C3%A7a_de_Block)": uma máquina com uma tabela gigantesca de
todas as conversas possíveis e uma resposta sensata para cada uma. Ela passaria em qualquer teste de duração finita
sem pensar absolutamente nada. Então passar no teste do thrindle mostra competência, não conceitos.

**As réplicas.**
- Os pontos 2 e 3 também valem para as pessoas: nós nos contradizemos e mudamos conforme o enquadramento.
- Pesquisadores que olham dentro desses modelos encontram traços internos que se comportam muito como conceitos. A
  Anthropic mapeou milhões deles num modelo, inclusive um da ponte Golden Gate
  ([Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/), em inglês).
- Exigir ancoragem nos sentidos desqualificaria conceitos como "[número primo](https://pt.wikipedia.org/wiki/N%C3%BAmero_primo)",
  que ninguém nunca viu nem tocou.

**A réplica de Curt: "só a ancoragem se sustenta, e isso é bem conveniente".** Claude concorda: é uma regra que por
acaso exclui exatamente aquilo contra o que mira. E está se desgastando. Os modelos agora veem imagens,
[usam computadores](https://www.anthropic.com/news/3-5-models-and-computer-use) (em inglês) e agem no mundo, enquanto
boa parte do *seu* domínio de "justiça" ou de "primo" veio pelas palavras, não pelos sentidos (compare com a
[cognição incorporada](https://pt.wikipedia.org/wiki/Cogni%C3%A7%C3%A3o_corporificada)). O Blockhead ganha uma resposta própria: veja
[GAZP vs. GLUT](../gazp-glut/).
