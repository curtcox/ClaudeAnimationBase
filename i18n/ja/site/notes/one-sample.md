---
id: one-sample
title: 一つの答えではほとんど何も証明できない理由
ch: 2
at: T08.C.05.2
links: [error-bars, sampling, {title: "大数の法則 (Wikipedia)", url: "https://ja.wikipedia.org/wiki/%E5%A4%A7%E6%95%B0%E3%81%AE%E6%B3%95%E5%89%87"}]
---
**こうしたプログラムは、さいころを振ります。**Claudeに同じ質問を二度すると、二つの違う答えが返ってくるかもしれません。次の一語を選ぶやり方に、わざと偶然の要素が入っているのです。その度合いを決める設定は「[温度](https://www.ibm.com/think/topics/llm-temperature)」（英語）と呼ばれます。だから答えはばらつきます。

**だから、一つの答えは、さいころ一振り。**[グラフ](../frog-or-axolotl/)のプログラムでさえ、質問の前に会話がまったくなくても、10回に4回ほどは「ウーパールーパー」と答えました。Claudeが一度「ウーパールーパー」と言っても、ほとんど何もわかりません。次に試したら、「カエル」と言ったかもしれないのです。

**何かがわかるのは：**いろいろな種類の会話で、何度も尋ねて、数えることです（[標本調査](https://ja.wikipedia.org/wiki/%E6%A8%99%E6%9C%AC%E8%AA%BF%E6%9F%BB)）。試す回数が増えるほど、数は落ち着いてきます（[大数の法則](https://ja.wikipedia.org/wiki/%E5%A4%A7%E6%95%B0%E3%81%AE%E6%B3%95%E5%89%87)）。[世論調査](https://ja.wikipedia.org/wiki/%E4%B8%96%E8%AB%96%E8%AA%BF%E6%9F%BB)が一人ではなく千人に尋ね、[誤差の幅](https://ja.wikipedia.org/wiki/%E8%AA%A4%E5%B7%AE%E3%81%AE%E7%AF%84%E5%9B%B2)を添えて報告するのも、同じ理由です。Anthropicが、AIのテストの点数には[誤差棒](https://www.anthropic.com/research/statistical-approach-to-model-evals)（英語）をつけるべきだと論じてきたのも、同じ理由です。
