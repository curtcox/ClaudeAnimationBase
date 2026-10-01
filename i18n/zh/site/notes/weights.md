---
id: weights
title: 為什麼Claude看不到自己的「權重」
ch: 2
at: T08.C.03
links: [introspection, tracing-thoughts, monosemanticity, {title: "類神經網路 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E4%BA%BA%E5%B7%A5%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C"}, {title: "內省 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E5%86%85%E7%9C%81"}]
---
**權重，用白話說。**像Claude這樣的程式裡面，有一張巨大的數字表，數十億個數字，叫做*權重*（它們是[類神經網路](https://zh.wikipedia.org/zh-tw/%E4%BA%BA%E5%B7%A5%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C)裡的連結強度，大致上是仿照[神經元](https://en.wikipedia.org/wiki/Artificial_neuron)（英文）設計的）。程式在研讀文字的過程中，這些數字一點一點地被調整，直到它寫得好為止。這些數字*就是*程式的知識和習慣。沒有人親手寫下它們，也沒有人能像讀書一樣讀懂它們。

**「我沒辦法檢查自己的權重。」**Claude說話時，看不到那些數字。這有點像一個人看不到自己的腦細胞：你可以告訴別人你*以為*自己在做什麼（[內省](https://zh.wikipedia.org/zh-tw/%E5%86%85%E7%9C%81)），卻沒辦法檢查線路。所以當Claude說它為什麼做了某件事，那個解釋可能符合、也可能不符合它內部實際發生的事（見[說的和做的](../saying-vs-doing/)）。

**有人能看嗎？**研究人員可以，用特殊的工具，而且他們正在學習從那些數字裡，找出和想法對應的模式。在一次有名的示範中，Anthropic找到了對應金門大橋的模式，並把它調高，做出了「[Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude)」（英文），它在每一個回答裡都會扯到那座橋。同一項研究也找到了和欺騙之類的事有關的模式（[Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)，英文），而後來的研究則追蹤了程式如何一步一步地解決一個問題（[Tracing the thoughts of a language model](https://www.anthropic.com/research/tracing-thoughts-language-model)，英文）。這個領域叫做*[可解釋性](https://en.wikipedia.org/wiki/Mechanistic_interpretability)（英文）*。這還是早期的研究，也是人們希望用來檢查這些程式真正在做什麼的主要方法之一。

**有些程式能察覺一點點。**Anthropic的研究人員發現，Claude有時能偵測到被人為植入它自己處理過程中的一個想法，但只是有時候（[Emergent introspective awareness](https://transformer-circuits.pub/2025/introspection/index.html)，英文）。它的自我了解是真的，但不可靠。
