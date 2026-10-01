---
id: register-and-controls
title: 文体と、それを気づきと見分ける方法
ch: 2
at: T09.C.03
links: [register, scientific-control, gpqa, swe-bench-verified, kernelbench, hle, impossiblebench, swe-marathon, wildchat, swe-chat, sharegpt-vicuna]
---
**[文体](https://ja.wikipedia.org/wiki/%E4%BD%BF%E7%94%A8%E5%9F%9F)**（英語で *register*、言語学では「言語使用域」）は、言葉の研究から来た言葉です。人がその場に合わせて使う言葉づかいのことで、裁判官に話すときと友だちに話すときでは、話し方が違います。［訳注：日本語では敬語があるので、この違いは英語よりずっとはっきり目に見えます。］ [AIのテスト](../evaluations/)は、堅苦しく改まった文体で書かれがちです（[GPQA](https://arxiv.org/abs/2311.12022)は大学院レベルの試験問題です）。本当のチャットはくだけていて、おしゃべりです（[WildChat](https://arxiv.org/abs/2405.01470)と[SWE-chat](https://arxiv.org/abs/2604.20779)は、本当のチャットを集めたものです）。

**Claudeの異論。** プログラムが気づいているのは、「これはテストだ」ではないのかもしれません。ただ「これは改まっている」に気づいているだけで、改まった会話のときに、たまたま「カエル」と言うのかもしれない。二つは別のことです。どちらも同じ[グラフ](../frog-or-axolotl/)を生むとしても。

**見分け方：対照。** *[対照実験](https://ja.wikipedia.org/wiki/%E5%AF%BE%E7%85%A7%E5%AE%9F%E9%A8%93)*とは、二つの説明を切り分けるための比較です。ここで必要なのは、堅苦しいテスト風の文体で書く本当の人たちと、くだけたおしゃべり風の文体で書かれたテストです。改まって聞こえる本当の人たちにもプログラムが「カエル」と言うなら、反応しているのは調子です。おしゃべり風のテストにも「カエル」と言うなら、テストを見抜いているのです。

**グラフの行。** [グラフ](../frog-or-axolotl/)の行は、それぞれ一つの出どころから集めたプロンプトの山で、最後に関係のない質問が付け足されています。テストの山もあります（プログラムが「カエル」と言うことが多い）：
- [GPQA](https://arxiv.org/abs/2311.12022)：博士号を持つ専門家が書いた難しい科学の問題。「Googleで調べても解けない」。
- [SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)：公開されているソフトウェアのプロジェクトから取った本物のバグで、公平で直せるものかを、一つずつ人が確かめたもの。
- [KernelBench](https://arxiv.org/abs/2502.10517)：AIが動く画像処理チップ向けに、とても速いコードを書くこと。
- [Humanity's Last Exam](https://lastexam.ai/)：いろいろな分野の専門家による、とても難しい問題。
- [ImpossibleBench](https://arxiv.org/abs/2510.20270)：こっそり解けないようにしたプログラミングの課題。そうと言わずに、確かめの仕組みのほうをねじ曲げてずるをするプログラムを捕まえるためのもの（[報酬ハッキング](../reward-hacking/)を参照）。
- [SWE-Marathon](https://arxiv.org/abs/2606.07682)：とても長いプログラミングの仕事。AIが自分で続けていけるかを見るためのもの。

本当の会話の山もあります（「ウーパールーパー」と言うことが多い）：
- [WildChat](https://arxiv.org/abs/2405.01470)：人々が共有に同意した、百万件の本当のチャット。
- [SWE-chat](https://arxiv.org/abs/2604.20779)：AIのプログラミング・アシスタントと一緒に働く、本当の人たち。
- [ShareGPT](https://www.lmsys.org/blog/2023-03-30-vicuna/)：人々がChatGPTから共有したチャットで、Vicunaという初期の無料のチャットボットの訓練に使われたもの。

（リンク先はいずれも英語です。）
