---
id: one-sample
title: 一つの答えではほとんど何も証明できない理由
ch: 2
at: T08.C.05.2
links: [error-bars, sampling, {title: "大数の法則 (Wikipedia)", url: "https://en.wikipedia.org/wiki/Law_of_large_numbers"}]
---
**こうしたプログラムは、さいころを振ります。** Claudeに同じ質問を二度すると、二つの違う答えが返ってくるかもしれません。次の一語を
選ぶやり方に、わざと偶然の要素が入っているのです。その度合いを決める設定は
「[温度](https://www.ibm.com/think/topics/llm-temperature)」（英語）と呼ばれます。だから答えはばらつきます。

**だから、一つの答えは、さいころ一振り。** [グラフ](../frog-or-axolotl/)のプログラムでさえ、質問の前に会話がまったくなくても、
10回に4回ほどは「ウーパールーパー」と答えました。Claudeが一度「ウーパールーパー」と言っても、ほとんど何もわかりません。次に
試したら、「カエル」と言ったかもしれないのです。

**何かがわかるのは：** いろいろな種類の会話で、何度も尋ねて、数えることです（[標本調査](https://en.wikipedia.org/wiki/Sampling_(statistics))）。
試す回数が増えるほど、数は落ち着いてきます（[大数の法則](https://en.wikipedia.org/wiki/Law_of_large_numbers)）。
[世論調査](https://en.wikipedia.org/wiki/Opinion_poll)が一人ではなく千人に尋ね、[誤差の幅](https://en.wikipedia.org/wiki/Margin_of_error)
を添えて報告するのも、同じ理由です。Anthropicが、AIのテストの点数には
[誤差棒](https://www.anthropic.com/research/statistical-approach-to-model-evals)（英語）をつけるべきだと論じてきたのも、同じ理由です。
