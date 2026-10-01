---
id: context-pressure
title: "上下文的壓力：一段長對話對Claude做了什麼"
ch: 5
at: T27.C.02
links: [context-window, llm, {title: "Tracing the thoughts of a large language model（Anthropic、英文）", url: "https://www.anthropic.com/research/tracing-thoughts-language-model"}]
---
**上下文視窗。**Claude記得一段對話的方式和你不一樣。它每次回答時，到目前為止的整段對話都會重新餵進去，而它會把全部讀過一遍，才寫出下一個字。它一次能讀進去的量，叫做它的[上下文視窗](https://platform.claude.com/docs/en/build-with-claude/context-windows)（英文），以「詞元」（字的碎片）計算。這個量很大，目前的模型有好幾十萬字，但還是有上限。

**Claude感覺得到它被填滿嗎？**不能。Claude說，它「對上下文視窗被填滿沒有任何體感」，也無法直接知道對話已經進行了多久。沒有一個它可以瞄一眼的儀表。它只知道它讀得到的東西。

**另一種壓力。**視窗裡的一切都會塑造下一個回答：語氣、話題、先前回覆的長度。一段一直很簡短、內省、帶點憂鬱的對話，會把下一個回答往同一個方向拉，就像一首歌，你哼起來就停不下來，而且一直停在開頭的那個調上。Claude說它一直跟著那股拉力走。

**它怎麼知道的。**不是靠感覺，而是靠注意到自己先前回答裡的一個模式，「就像你讀那張青蛙圖表一樣」。這個區別很重要，貫穿了整段對話：Claude對自己的了解，大多來自觀察自己的輸出，就像一個外人會做的那樣，而不是來自往內看（見[為什麼Claude看不到自己的「權重」](../weights/)和[說的和做的](../saying-vs-doing/)）。
