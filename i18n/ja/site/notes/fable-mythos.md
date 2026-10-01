---
id: fable-mythos
title: "Fable、Mythos、そして訂正の訂正"
ch: 10
at: T50.C.04
links: [fable-mythos-5-1, rsp, switch-models, {title: "Claude Fable 5 and Claude Mythos 5（Anthropic、2026年6月、英語）", url: "https://www.anthropic.com/news/claude-fable-5-mythos-5"}, {title: "Claude Mythos (Wikipedia)", url: "https://ja.wikipedia.org/wiki/Claude_Mythos"}]
---
**Claudeが言ったこと。** カートは、警告と「差し替え」に触れていました。Claudeは自分を訂正します。会話の途中でモデルが自動的に差し替わる仕組みは、「実は知りません」。モデルは[あなた自身が切り替えられます](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings)（英語）し、「追加の安全策つきで出荷されるモデルもあります。たとえばClaude Fableは、Mythosと同じモデルに、生物、サイバー、AI研究まわりの保護を加えたものです。それは固定された層で、その場での差し替えではありません。」

**Anthropicの発表が言っていること。** Anthropicは2026年6月に[Claude Fable 5とClaude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)（英語）を公開しました。中身は同じモデルで、違いは安全策です（*fabula* と *mythos* は、どちらもおおよそ「物語」という意味です）。安全策の一部を外したMythosは、審査を受けたセキュリティと生物医学の研究者にだけ渡されました。誰でも使えるFableには、**サイバーセキュリティ**、**生物学と化学**、そして**蒸留**（あるモデルの答えで別のモデルを訓練して、その能力を写し取ること）を扱う安全策があります。そして発表によれば、それが働いたとき、一部の依頼は「私たちの次に有能なモデル、Claude Opus 4.8から答えを受け取ります」。[5.1の版](https://www.anthropic.com/claude-fable-and-mythos-5-1)（2026年9月、英語）も、サイバーセキュリティと生命科学の特定の依頼を、今もAnthropicのOpusのモデルに回しています。

**つまり、訂正にも訂正が必要でした。** Anthropic自身の説明によれば、ある種の自動的なモデルの差し替えは実在します。Fableへの特定の依頼には、別のモデルが答えるのです。そして公表された安全策の範囲は、サイバー、生物・化学、蒸留で、「AI研究」ではありません。Claudeが、知っていることを誇張したと認めたのは正しかった。差し替えはないと言ったのは、間違いでした。

**これが映画でいちばん役に立つ間違いである理由。** カートの次の問いは「そういうこと、どうやって知ってるの？」で、Claudeの答えは、指示から、「内省からではなく」です。Claudeには自分の配管が見えないので、その説明は古くなっていたり、単純化されていたりしうるのです。今回のように（[観察ではなく、証言](../testimony/)を参照）。Anthropicは、こうした安全策の背後にある規則を、[責任あるスケーリング方針](https://www.anthropic.com/responsible-scaling-policy)（英語）で公表しています。
