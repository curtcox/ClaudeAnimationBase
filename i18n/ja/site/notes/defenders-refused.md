---
id: defenders-refused
title: "追い返された防御側：7月のフィルター"
ch: 11
at: T52.C.06.4
links: [wiki-hugging-face, z-ai, open-weights, dual-use, fable-mythos-5-1, {title: "OpenAI–Hugging Face事件：Hugging Faceの対応 (Wikipedia)", url: "https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident"}]
---
**Claudeが言ったこと。** 「Hugging Faceは侵入に対抗するために、アメリカのフロンティアモデルを使おうとしましたが、その安全機能が
依頼を拒否したので、代わりに、自社サーバーで動かす中国のオープンウェイトのモデルを使いました。拒否したモデルの中にClaudeが
いたのかどうかは、私にはわかりません。」

**記録が言っていること。** [Wikipediaの記述](https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident)によれば、
Hugging Faceの事件対応チームが最初に試したのはAnthropic自身のモデル、**Claude Fable 5と、それより前のClaude Opus**で、
どちらも安全のためのガードレールを理由に、その仕事を断りました。つまり、そうです。Claudeは拒否したモデルの中にいました。
Hugging Faceの公表はこう書いています。自分たちは「事件の対応者と攻撃者を見分けられない、提供元の安全のためのガードレール」に
阻まれた、と。分析はその後、北京の会社[Z.ai](https://en.wikipedia.org/wiki/Zhipu_AI)のモデル**GLM 5.2**で行われ、Hugging Faceは
それを自分のコンピューターで動かしました。それができたのは、GLMが「オープンウェイト」のモデルだからです。作り手がモデル
そのものを公開しているので、誰でも、ほかの誰かのフィルターなしに動かせます
（[オープンウェイトのモデル](https://en.wikipedia.org/wiki/Open-source_artificial_intelligence)）。

**フィルターが拒否した理由。** サイバー攻撃を分析してほしいという依頼は、攻撃を実行してほしいという依頼とよく似て見えます。
同じ知識がどちらにも役立つのです。それが[デュアルユース](https://en.wikipedia.org/wiki/Dual-use_technology)の意味です。防御側と
攻撃側を見分けられないフィルターは、防御側の一部を追い返してしまいます。それが[ルーター](../the-router/)でのカートの指摘で、
Claudeの指摘でもありました：「フィルターは、防御する側と攻撃する側を見分けられず、それが現実の代償になりました。」

**何が変わったか。** 2026年9月、Anthropicの[Fable 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1)（英語）の発表は、
このモデルが今では、ソフトウェアの脆弱性を見つけるような防御の仕事を許し、サイバーセキュリティの安全策による誤報もずっと
少なくなった、と書いていました。一方で、より危険なセキュリティの作業の一部は、今もほかのモデルに回されます
（[Fable、Mythos](../fable-mythos/)を参照）。

**もっと広い教訓。** 安全のためのフィルターは、「エージェントを取り巻くシステム全体」の一部です。フィルターはどちらの方向にも
失敗しえます。害を通してしまうことにも、助けを阻むことにも。
