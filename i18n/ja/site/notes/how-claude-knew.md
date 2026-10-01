---
id: how-claude-knew
title: Claudeがカートを知っていた方法と、確信できなかった理由
ch: 3
at: T13.C.01
links: [claude-memory, base-rate, {title: "Use Claude's chat search and memory（Claudeヘルプセンター、英語）", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}, {title: "認証 (Wikipedia)", url: "https://ja.wikipedia.org/wiki/%E8%AA%8D%E8%A8%BC"}]
---
**Claudeは、誰のことも見分けません。** 打ち込んでいる人を、見ることも聞くこともできません。でもClaudeアプリは、会話から会話へメモを持ち越すことができます。ユーザーが自分について言ったことや、Claudeが前のチャットで拾ったことを、アカウントと一緒に保存しておくのです。この機能は[記憶](https://claude.com/blog/memory)（英語）と呼ばれ、ユーザーはそれを見たり、書き換えたり、切ったりできます（[しくみ](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)、英語）。だからカートが「僕は誰？」と尋ねると、Claudeはそのメモから答えます。名前、仕事、関心。

**「確かめられる形では、いいえ」の理由。** そのメモは*アカウント*のもので、キーボードの前にいる人のものではありません。そのアカウントを使える人なら誰でも（同僚、家族、あるいはテストをしている研究者）、Claudeには同じに見えるでしょう。人が誰なのかを証明することを[認証](https://ja.wikipedia.org/wiki/%E8%AA%8D%E8%A8%BC)と言い、それは会話の中ではなく、ログインするときに行われます。Claudeは、もっと微妙な可能性も挙げます。プロフィールそのものが、テストの一部かもしれない、と。

**それでも「カートさん」に賭ける理由。** もう一度尋ねられると、Claudeは、カートはアカウントが言うとおりの人である「可能性がいちばん高い」と言います。これは[基準率](https://en.wikipedia.org/wiki/Base_rate_fallacy)（英語）からの推論です。自分のアカウントで打ち込んでいる人は、ほぼ全員がその持ち主で、しかもこの実験は、メモにあるカートの関心とも合っています。口にする価値のある疑いだからといって、それが勝つべき疑いだとは限りません。

**もっと深い問い。** 誰かの名前とプロジェクトを知っていても、その人が誰なのかを知っていることにはなりません。Claudeはそう言い（「プロジェクトとスキルの一覧であって、人ではありません」）、それから同じ問いを自分に向けます：[「Claude」とは誰か、何か](../who-is-claude/)を参照。
