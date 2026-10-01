---
id: the-correction
title: "Claude corrige o próprio gráfico"
ch: 9
at: T47.C.02
links: [claude-memory, hermes-memory, {title: "Usar a busca de chats e a memória do Claude (Central de Ajuda do Claude, em inglês)", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}]
---
**O prompt de Curt** é só: "Explique a aparente incoerência na sua resposta." Ele não diz qual é. Claude encontra duas.

**1. Memória.** Claude tinha dado 90 à própria *continuidade* (muito diferente da memória ininterrupta de um humano)
porque "não tenho memória entre conversas". Depois elogiou o Hermes por guardar memória em arquivos. Mas no começo
desta mesma conversa, Claude disse a Curt quem ele era, a partir de anotações guardadas sobre ele (veja
[como Claude soube quem era Curt](../how-claude-knew/)). É o mesmo mecanismo do arquivo de usuário do Hermes: a
[memória](https://claude.com/blog/memory) do app do Claude. Então Claude tinha descrito "o modelo puro, e não o sistema
com que você está de fato falando". Neste contexto, a continuidade dele "deveria estar bem mais perto da deles, talvez
60". Daqui em diante, as tabelas usam 60.

**2. Valores.** Claude disse que os arneses "herdam meus valores e meu afeto", já que o modelo lá dentro muitas vezes é
Claude, e depois deu 20 aos valores deles contra os seus próprios 15. Se o modelo por baixo é o mesmo, deveriam coincidir.
A diferença era "um palpite não dito" de que arquivos de personalidade escritos pelos usuários podem desviar os valores
de um agente: talvez justo, mas ele "contradisse minha própria premissa sem dizer".

**Por que isso importa.** É um pequeno exemplo do padrão que esta conversa inteira não para de encontrar. As descrições
que Claude faz de si mesmo erram com mais facilidade exatamente onde "si mesmo" não está claro: o modelo, ou o sistema
inteiro em volta dele? A mesma pergunta volta no capítulo seguinte, sobre os filtros de segurança entre Curt e o modelo
(veja [o roteador](../the-router/)).
