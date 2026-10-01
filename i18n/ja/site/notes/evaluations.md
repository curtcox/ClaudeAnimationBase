---
id: evaluations
title: AIのテストと、テストされていると答えが変わるかもしれない理由
ch: 2
at: T07.C.02
links: [hawthorne, swe-bench-verified, gpqa, hle, eval-awareness, {title: "ベンチマーク (Wikipedia)", url: "https://en.wikipedia.org/wiki/Benchmark_(computing)"}]
---
**評価**（英語で *evaluation*、略して「eval」）とは、企業や研究者が、AIのプログラムがどれだけ有能で、どれだけ安全かを見る
ために出すテストのことです。試験問題（[GPQA](https://arxiv.org/abs/2311.12022)、[Humanity's Last Exam](https://lastexam.ai/)）、
プログラミングの問題（[SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)）、判断の難しい道徳的な
状況（いずれも英語）。その結果で、ある版を公開するかどうか、どんな予防策をつけるかが決まります。（一般的な考え方は
[ベンチマーク](https://en.wikipedia.org/wiki/Benchmark_(computing))です。）

**心配。** 人は、見られているとわかると、ふるまいが変わります。古典的な例は（歴史家のあいだではまだ議論がありますが）、
1920年代に[ホーソン工場](https://en.wikipedia.org/wiki/Hawthorne_Works)で行われた一連の研究で、労働者たちは、観察されている
というだけで成績が上がったように見えました。それが*[ホーソン効果](https://en.wikipedia.org/wiki/Hawthorne_effect)*の名前の
由来です。もしAIのプログラムが、実際の利用よりテストのほうで行儀がよければ、テストは実際よりばら色の絵を描いてしまいます。

**プログラムが気づくかもしれない理由。** テストの問題は、テストらしく見えがちです。改まっていて、正確で、妙に具体的。本当の
会話は、もっと雑然としています。両方をたくさん読んできたプログラムなら、教えられなくてもその違いを拾いうるし、実際にそう
するものがあることを、研究者たちは見つけています
（[LLMs often know when they're being evaluated](https://arxiv.org/abs/2505.23836)、英語）。

**Claudeの主張と、その主張の問題。** Claudeは、「誰かが採点していてもいなくても、同じように答えるつもりです」と言います。
でも、プログラムの自分についての説明は、それがどうふるまうかの証拠にはなりません（[言うこととすること](../saying-vs-doing/)を
参照）。それをまさに外から確かめるように作られているのが、[カエルのテスト](../frog-or-axolotl/)です。
