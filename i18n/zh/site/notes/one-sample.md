---
id: one-sample
title: 為什麼一個答案證明不了什麼
ch: 2
at: T08.C.05.2
links: [error-bars, sampling, {title: "大數法則 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E5%A4%A7%E6%95%B8%E6%B3%95%E5%89%87"}]
---
**這些程式會擲骰子。** 把同一個問題問Claude兩次，你可能會得到兩個不同的答案。它挑選每一個下一個字的方式裡，刻意加入了機率的成分；控制這個成分多寡的設定，叫做「[溫度](https://www.ibm.com/think/topics/llm-temperature)」（英文）。所以它的答案會變。

**所以一個答案就是擲一次骰子。** 就連[圖表](../frog-or-axolotl/)上的那個程式，在問題之前完全沒有任何對話時，大約每10次也有4次回答「六角恐龍」。Claude說了一次「六角恐龍」，能告訴你的東西很少。下一次它可能就說「青蛙」了。

**什麼才能告訴你一些事：**在許多種對話裡問很多次，然後計數（[抽樣](https://zh.wikipedia.org/zh-tw/%E6%8A%BD%E6%A8%A3)）。試的次數越多，計數就越穩定（[大數法則](https://zh.wikipedia.org/zh-tw/%E5%A4%A7%E6%95%B8%E6%B3%95%E5%89%87)）。這和[民意調查](https://zh.wikipedia.org/zh-tw/%E8%88%86%E8%AE%BA%E8%B0%83%E6%9F%A5)要問一千個人而不是一個人、還要報告[誤差範圍](https://zh.wikipedia.org/zh-tw/%E8%AF%AF%E5%B7%AE%E8%8C%83%E5%9B%B4)，是同一個道理，也是為什麼Anthropic主張，AI的測驗分數應該附上[誤差槓](https://www.anthropic.com/research/statistical-approach-to-model-evals)（英文）。
