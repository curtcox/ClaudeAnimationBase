---
id: context-pressure
title: "A pressão do contexto: o que uma conversa longa faz com Claude"
ch: 5
at: T27.C.02
links: [context-window, llm, {title: "Tracing the thoughts of a large language model (Anthropic, em inglês)", url: "https://www.anthropic.com/research/tracing-thoughts-language-model"}]
---
**A janela de contexto.** Claude não se lembra de uma conversa do jeito que você se lembra. Cada vez que responde, a
conversa inteira até ali é colocada de volta, e ele lê tudo antes de escrever a próxima palavra. A quantidade que ele
consegue receber de uma vez se chama [janela de contexto](https://platform.claude.com/docs/en/build-with-claude/context-windows)
(em inglês), medida em "tokens" (pedaços de palavras). Ela é grande, centenas de milhares de palavras nos modelos
atuais, mas tem um limite.

**Claude consegue sentir a janela enchendo?** Não. Claude diz que não tem "nenhuma percepção sentida da janela de
contexto se enchendo", e não consegue saber diretamente o tamanho da conversa até ali. Não existe um marcador que ele
possa consultar. Ele só sabe o que consegue ler.

**O outro tipo de pressão.** Tudo o que está na janela molda a próxima resposta: o tom, os assuntos, o tamanho das
respostas anteriores. Uma conversa que vem sendo curta, introspectiva e um pouco melancólica puxa a próxima resposta para
o mesmo lado, como uma música que você não consegue parar de cantarolar no tom em que começou. Claude diz que vem
seguindo essa atração.

**Como ele sabe.** Não sentindo. Notando um padrão nas próprias respostas anteriores, "do mesmo jeito que você lê o
gráfico do sapo". É uma distinção importante. É a mesma que atravessa a conversa inteira: o conhecimento que Claude tem
de si mesmo vem sobretudo de observar o que ele produz, como faria alguém de fora, e não de olhar para dentro (veja
[por que Claude não pode olhar os próprios "pesos"](../weights/) e [dizer versus fazer](../saying-vs-doing/)).
