---
id: car-wash
title: "洗車場の問題と、速い思考・遅い思考"
ch: 12
at: T58.C.03
links: [car-wash, thinking-fast-slow, dual-process, crt, reasoning-models, cot-faithfulness, {title: "合理化 (Wikipedia)", url: "https://en.wikipedia.org/wiki/Rationalization_(psychology)"}]
---
**問題。** 「車を洗いたい。洗車場は50メートル先にある。歩いて行くべき？ 車で行くべき？」 多くのAIモデルは、近いから
歩いて行く、と答えました（[洗車場テスト](https://opper.ai/blog/car-wash-test)、英語）。答えは、車です。車がそこに
なければいけないのですから。

**モデルが間違える理由。** トークンの問題ではありません（[トークン](../tokens/)を参照）。どの語もありふれています。
「近い距離、だから歩く」がとても強いパターンで、本当の目的、つまり車を動かすことを押しのけてしまうのです。人間も同じ種類の
問題にひっかかります。いちばん有名なのが[バットとボール](https://en.wikipedia.org/wiki/Cognitive_reflection_test)の問題です。
バットとボールは合わせて1ドル10セントで、バットはボールより1ドル高い。ボールはいくら？ たいていの人は10セントと言います。
（正解は5セントです。）

**システム1とシステム2。** カートは、それが「タイプ1の思考」なのかと尋ねます。心理学者は二つのモードを区別します
（[二重過程理論](https://en.wikipedia.org/wiki/Dual_process_theory)）。速く、自動的で、パターンに動かされる*システム1*と、
遅く、骨が折れ、確かめる*システム2*です。ダニエル・カーネマンの
[『ファスト＆スロー』](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow)で有名になりました。Claudeは、このたとえは
よく当てはまると言います。Claudeが出すトークン一つ一つは「一回きりの速い通過で、その中に熟慮はありません」。それがシステム1
です。

**システム2はどこから来るか。** 声に出して考えることからです。答える前に、問題を一歩ずつ解いていく。隠れた「推論」の段階でも、
ページの上でもかまいません。そうするように作られたモデルは、[推論モデル](https://en.wikipedia.org/wiki/Reasoning_language_model)
と呼ばれます。役には立ちますが、「特効薬ではありません。人間と同じで、私も長々と推論したあげく、最初に頭に浮かんだ答えを
正当化して終わることがあります」（[合理化](https://en.wikipedia.org/wiki/Rationalization_(psychology))）。Anthropicは、
モデルが書き出す推論が、実際に答えを動かしたものをいつも映しているとは限らない、と見つけています
（[推論モデルは考えていることをいつも言うとは限らない](https://www.anthropic.com/research/reasoning-models-dont-say-think)、英語）。
