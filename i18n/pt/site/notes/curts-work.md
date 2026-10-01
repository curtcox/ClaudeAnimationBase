---
id: curts-work
title: "O trabalho de Curt: 256t.org e hashbin.org"
ch: 3
at: T12.C.02
links: [256t, hashbin, content-addressable, {title: "Código-fonte do 256t.org (GitHub, em inglês)", url: "https://github.com/curtcox/256t.org"}, {title: "Código-fonte do hashbin.org (GitHub, em inglês)", url: "https://github.com/curtcox/hashbin.org"}, {title: "Função hash criptográfica (Wikipedia)", url: "https://pt.wikipedia.org/wiki/Fun%C3%A7%C3%A3o_hash_criptogr%C3%A1fica"}, {title: "Link quebrado (Wikipedia)", url: "https://pt.wikipedia.org/wiki/Apodrecimento_de_links"}]
---
**Quem Claude diz que Curt é.** Um engenheiro de software que trabalha principalmente com
[Python](https://pt.wikipedia.org/wiki/Python) e [Java](https://pt.wikipedia.org/wiki/Java_(linguagem_de_programa%C3%A7%C3%A3o))
(duas linguagens de programação muito usadas) e [Flask](https://pt.wikipedia.org/wiki/Flask_(framework_web)) (um kit de
ferramentas para construir sites em Python). Ele constrói ferramentas para outros programadores, e ferramentas para
trabalhar com IA. Também se interessa por [segurança da IA](https://pt.wikipedia.org/wiki/Seguran%C3%A7a_da_intelig%C3%AAncia_artificial) e por
[filosofia da mente](https://pt.wikipedia.org/wiki/Filosofia_da_mente).

**O problema que os projetos dele resolvem.** Os links da web quebram. Uma página muda de lugar ou um site sai do ar, e
o link que você guardou não leva a lugar nenhum. Em inglês isso se chama [*link rot*](https://pt.wikipedia.org/wiki/Apodrecimento_de_links)
("apodrecimento de links"). Parte do problema é que um endereço da web comum diz *onde* algo está, e não *o que* é.

**Dar nome às coisas pelo que elas são.** A solução se chama
[armazenamento endereçável por conteúdo](https://pt.wikipedia.org/wiki/Content_Addressable_Storage). Você passa o
arquivo por uma [função hash criptográfica](https://pt.wikipedia.org/wiki/Fun%C3%A7%C3%A3o_hash_criptogr%C3%A1fica), uma receita que
transforma qualquer arquivo num código longo, como uma impressão digital. O mesmo arquivo sempre dá o mesmo código, e
mudar uma única letra dá um código completamente diferente. Então dá para usar o próprio código como nome do arquivo.
Qualquer pessoa com o código pode buscar o arquivo em qualquer lugar e conferir que ele é exatamente o que o código
prometia. É como uma biblioteca em que o número de chamada de um livro é calculado a partir de cada palavra dele: não
tem como te entregarem o livro errado.

**[256t.org](https://256t.org)** é o padrão aberto e simples de Curt para esses códigos. Ele usa o hash SHA-512, escrito
como uma sequência de 94 letras e números que cabe num endereço da web, e vem com exemplos funcionando em mais de 50
linguagens de programação ([código-fonte](https://github.com/curtcox/256t.org), em inglês).

**[hashbin.org](https://hashbin.org)** é um serviço construído sobre ele. Você paga um pouco para guardar alguma coisa,
recebe o código 256t dela, e daí qualquer pessoa com o código pode baixá-la de graça, sem conta
([código-fonte](https://github.com/curtcox/hashbin.org), em inglês).

**Por que isso aparece.** É assim que Claude responde "Quem sou eu?": a partir do que está associado à conta de Curt
(veja [como Claude soube quem era Curt](../how-claude-knew/)). Depois ele admite que uma lista de projetos "não é uma
pessoa".
