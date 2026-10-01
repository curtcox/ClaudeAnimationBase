---
id: rsi
title: "RSI：自分を改良するAI"
ch: 13
at: T63.C.04
links: [rsi-wiki, arxiv-aide2, arxiv-bounded, anthropic-rsi, mittr-rsi, datacamp-rsi, coxon-resigns]
---
**問い。** 「年末までにRSI？」とは、年末までに*再帰的自己改善*が見られるか、という意味です。RSIとは、AIシステムが自分自身を改良し、改良されるたびに、次の改良がうまくなっていくことです（[Wikipedia](https://ja.wikipedia.org/wiki/%E5%86%8D%E5%B8%B0%E7%9A%84%E8%87%AA%E5%B7%B1%E6%94%B9%E5%96%84)、[やさしい解説](https://www.datacamp.com/tutorial/recursive-self-improvement)、英語）。「foom」の背後にある考えです（[Foom](../foom/)を参照）。

**Claudeの答え：どのRSIかによる。**

**弱いRSIは、もう来ています。** この会話の週に投稿された論文、[AIDE²](https://arxiv.org/abs/2609.26457)（英語）は、自分のコードを書き換えるAI研究エージェントについて書いています。自分への変更を提案し、研究の課題で試し、役に立つものを残します。受け入れられた版の一つ一つが、次に編集される版になるのです。8日間の実行で、新しい課題にも効く改良を七つ見つけました。書き換えるのはエージェント自身のコード、つまりモデルを包むソフトウェア（Claudeはこれを「ハーネスの層」と呼びます。[エージェントのハーネス](../agent-harnesses/)を参照）で、モデルそのものを訓練し直すわけではありません。Anthropic自身の報告[*When AI builds itself*](https://www.anthropic.com/institute/recursive-self-improvement)（2026年、英語）は、自社のAI開発のどれほどを、すでにClaudeに任せているかを書いています。取り込むコードの80%以上をClaudeが書いているのです。同時に、ループはまだ閉じておらず、研究の方向を決めているのは今も人間だ、とも書いています。

**強いRSIは、際限のないループです。** 人間にできるよりも速く、人間の監督をほとんど受けずに、能力を高めていきます。Claudeは、年末までにそれが来る確率を、5%くらいとします。7月の、1250本の論文のサーベイ（[From Bounded Self-Refinement to Autonomous Research Loops](https://arxiv.org/abs/2607.07663)、英語）は、そうしたループを三つのものが抑えていると見つけました。何をもって良くなったとするかの、当てになる信号が要ること（*接地*）、自分の出力を食べて劣化しうること（*崩壊*）、そして計算能力が要ること（*計算資源*）です。[MIT Technology Review](https://www.technologyreview.com/2026/08/18/1142188/ai-recursive-self-improvement/)（英語）は8月に、RSIは「結局、そんなに早くは来ないかもしれない」と報じました。

**心配なケースは、その中間にあります。** 弱いループ、たくさんのコピー、そして競い合う研究所。2026年9月、ジェイコブ・コクソンという研究者がAnthropicを辞め、AI企業は「自己改善する超知能へ一直線に競争していて、私たちの命を賭けている」と書きました（[TechCrunch](https://techcrunch.com/2026/09/09/gambling-with-our-lives-anthropic-researcher-quits-warns-against-self-improving-ai/)、英語）。

**そして、開示。** 「私はAnthropicのモデルなので、そのことを念頭に置いて、私の5%を量ってください。」
