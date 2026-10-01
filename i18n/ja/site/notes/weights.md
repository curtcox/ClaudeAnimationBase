---
id: weights
title: Claudeが自分の「重み」を見られない理由
ch: 2
at: T08.C.03
links: [introspection, tracing-thoughts, monosemanticity, {title: "ニューラルネットワーク (Wikipedia)", url: "https://ja.wikipedia.org/wiki/%E3%83%8B%E3%83%A5%E3%83%BC%E3%83%A9%E3%83%AB%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF_(%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92)"}, {title: "内観 (Wikipedia)", url: "https://ja.wikipedia.org/wiki/%E5%86%85%E8%A6%B3%23%E5%BF%83%E7%90%86%E5%AD%A6%E7%A0%94%E7%A9%B6%E3%81%AE%E6%96%B9%E6%B3%95%E3%81%A8%E3%81%97%E3%81%A6%E3%81%AE%E5%86%85%E8%A6%B3"}]
---
**重みを、わかりやすく。** Claudeのようなプログラムの中には、何十億もの数字の巨大な表があり、*重み*と呼ばれます（それは[ニューラルネットワーク](https://ja.wikipedia.org/wiki/%E3%83%8B%E3%83%A5%E3%83%BC%E3%83%A9%E3%83%AB%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF_(%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92))のつながりの強さで、ゆるやかに[ニューロン](https://ja.wikipedia.org/wiki/%E4%BA%BA%E5%B7%A5%E7%A5%9E%E7%B5%8C)をまねたものです）。プログラムが文章を学ぶあいだに、うまく書けるようになるまで、ほんの少しずつ調整されてきました。その数字こそが、プログラムの知識と癖*そのもの*です。誰も手で書いたわけではなく、誰も本のように読むことはできません。

**「私は自分の重みを調べられない」。** Claudeは、話しているあいだ、その数字を見ることができません。自分の脳細胞を見られない人に少し似ています。自分が何をしていると*思うか*を人に話すことはできても（[内観](https://ja.wikipedia.org/wiki/%E5%86%85%E8%A6%B3%23%E5%BF%83%E7%90%86%E5%AD%A6%E7%A0%94%E7%A9%B6%E3%81%AE%E6%96%B9%E6%B3%95%E3%81%A8%E3%81%97%E3%81%A6%E3%81%AE%E5%86%85%E8%A6%B3)）、配線を確かめることはできない。だからClaudeが、なぜそうしたのかを言うとき、その説明は、内部で実際に起きたことと合っているかもしれないし、合っていないかもしれません（[言うこととすること](../saying-vs-doing/)を参照）。

**誰かなら見られるのか？** 研究者は、特別な道具を使えば見られます。そして、その数字の中に、考えと対応するパターンを見つける方法を学びつつあります。有名な実演の一つで、Anthropicはゴールデンゲート・ブリッジのパターンを見つけてそれを強め、「[Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude)」（英語）を作りました。どの答えにもその橋を持ち込むClaudeです。同じ研究は、ごまかしのようなものに結びついたパターンも見つけ（[Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)、英語）、その後の研究は、プログラムが問題を一歩ずつどう解いていくかをたどっています（[Tracing the thoughts of a language model](https://www.anthropic.com/research/tracing-thoughts-language-model)、英語）。この分野は*[解釈可能性](https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%AB%E3%83%8B%E3%82%B9%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF%E8%A7%A3%E9%87%88%E5%8F%AF%E8%83%BD%E6%80%A7)*と呼ばれます。まだ始まったばかりですが、こうしたプログラムが本当は何をしているのかを確かめる、人々が期待している主な方法の一つです。

**少しなら、気づけるプログラムもあります。** Anthropicの研究者たちは、Claudeが、自分の処理の中に人工的に植えつけられた考えに気づけることがある、と見つけました。ただし、ときどきだけです（[Emergent introspective awareness](https://transformer-circuits.pub/2025/introspection/index.html)、英語）。その自己知識は、本物ですが、当てになりません。
