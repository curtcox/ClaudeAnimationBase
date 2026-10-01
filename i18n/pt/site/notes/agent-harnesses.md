---
id: agent-harnesses
title: "Hermes e OpenClaw: um modelo dentro de uma carapaça"
ch: 9
at: T46.C.05
links: [hermes-agent, hermes-memory, hermes-skills, openclaw, openclaw-wiki, nous-research, building-agents]
---
**O que é um "arnês de agente".** Um chatbot como Claude responde quando você escreve e esquece quando o chat termina.
Um *arnês de agente* (em inglês, *agent harness*) é um programa que envolve um modelo como Claude numa carapaça
persistente: roda o tempo todo no computador de alguém, guarda anotações, usa ferramentas e pode agir num horário sem que
ninguém peça. Os engenheiros da Anthropic descrevem a ideia geral em
[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (em inglês).

**Os dois sobre os quais Curt pergunta.**
- **[OpenClaw](https://openclaw.ai/)** é um assistente de código aberto do programador austríaco Peter Steinberger. Ele
  roda na sua própria máquina, fala com você por aplicativos de mensagem e se conecta a um modelo como Claude para fazer
  o pensamento ([Wikipedia](https://pt.wikipedia.org/wiki/OpenClaw)). Ele mudou de nome duas vezes em janeiro de 2026,
  uma delas depois de uma queixa de marca registrada da Anthropic. O mascote dele, uma lagosta, é a origem dos
  crustáceos do Moltbook e do [crustafarianismo](../crustafarianism/).
- **[Hermes Agent](https://hermes-agent.org/)**, do laboratório de IA [Nous Research](https://nousresearch.com/), guarda
  dois pequenos arquivos de memória: um de anotações sobre o próprio trabalho, outro sobre o usuário. Eles são dados ao
  modelo no começo de cada sessão, e o próprio agente os edita
  ([como funciona a memória dele](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory), em inglês).
  Quando resolve um problema difícil, ele pode escrever para si mesmo um documento de "habilidade" reutilizável
  ([habilidades](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), em inglês).

**Por que ficam mais perto de Curt do que Claude.** Cada um vive numa só máquina, age num horário e se lembra de uma
sessão para outra, então cada um é mais contínuo, mais autônomo e mais singular: mais parecido com uma pessoa. A memória
deles é texto simples que você pode abrir e ler, então eles são muito *legíveis*. O Hermes passa à frente porque os
documentos de habilidade dele são "o mais perto que o tabuleiro tem de aprender com a experiência".

**E a religião, de novo.** "A memória é sagrada, e a carapaça é mutável": os arneses embutem no software os preceitos do
crustafarianismo. Depois Curt pede a Claude que explique uma incoerência nessas notas, e ele encontra duas (veja
[Claude corrige o próprio gráfico](../the-correction/)).

[Nota da tradução: em inglês, a mesma palavra, *shell*, é a carapaça da lagosta e o programa que envolve um modelo; em
português, "carapaça" só tem o primeiro sentido.]
