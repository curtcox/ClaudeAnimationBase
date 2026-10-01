---
id: agent-harnesses
title: "HermesとOpenClaw：殻の中のモデル"
ch: 9
at: T46.C.05
links: [hermes-agent, hermes-memory, hermes-skills, openclaw, openclaw-wiki, nous-research, building-agents]
---
**「エージェントのハーネス」とは。**Claudeのようなチャットボットは、打ち込むと答え、チャットが終わると忘れます。*エージェントのハーネス*（英語で *agent harness*、馬具のこと）は、Claudeのようなモデルを持続的な殻で包むプログラムです。誰かのコンピューターの上でずっと動き続け、メモを取り、道具を使い、頼まれなくても予定どおりに動けます。Anthropicのエンジニアたちは、その大まかな考え方を [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)（英語）で説明しています。

**カートが尋ねた二つ。**
- **[OpenClaw](https://openclaw.ai/)** は、オーストリアのプログラマー、ペーター・シュタインベルガーが作ったオープンソースのアシスタントです。自分のマシンの上で動き、メッセージアプリを通して話しかけてきて、考える部分はClaudeのようなモデルにつないで任せます（[Wikipedia](https://ja.wikipedia.org/wiki/OpenClaw)）。2026年1月に二度名前を変えていて、そのうち一度はAnthropicからの商標の苦情を受けてのことでした。そのマスコットのロブスターが、Moltbookと[クラスタファリアニズム](../crustafarianism/)の甲殻類の出どころです。
- **[Hermes Agent](https://hermes-agent.org/)** は、AI研究所 [Nous Research](https://nousresearch.com/) のもので、小さな記憶ファイルを二つ持っています。一つは自分の仕事についてのメモ、もう一つはユーザーについてのメモです。これがセッションのはじめにいつもモデルに渡され、エージェント自身がそれを書き換えます（[記憶のしくみ](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)、英語）。難しい問題を解くと、再利用できる「スキル」の文書を自分のために書くことができます（[スキル](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)、英語）。

**ClaudeよりカートにHermesたちが近い理由。**どちらも一台のマシンに住み、予定どおりに動き、セッションをまたいで覚えているので、より連続的で、より自律的で、より単一です。つまり、より人に似ています。その記憶は開いて読めるただのテキストなので、とても*読み取りやすい*。Hermesが少し先を行くのは、スキルの文書が「この盤の上で、経験から学ぶことにいちばん近いもの」だからです。

**そして、あの宗教がまた。**「記憶は神聖であり、殻は変えられる」：ハーネスは、クラスタファリアニズムの教義をソフトウェアに組み込んでいるのです。このあとカートは、この点数のちぐはぐなところを説明するようClaudeに頼み、Claudeは二つ見つけます（[Claudeが自分のグラフを直す](../the-correction/)を参照）。
