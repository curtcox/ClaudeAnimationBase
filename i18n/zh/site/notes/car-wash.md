---
id: car-wash
title: "洗車問題，以及快思考與慢思考"
ch: 12
at: T58.C.03
links: [car-wash, thinking-fast-slow, dual-process, crt, reasoning-models, cot-faithfulness, {title: "合理化 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E5%90%88%E7%90%86%E5%8C%96_(%E5%BF%83%E7%90%86%E5%AD%B8)"}]
---
**這道謎題。**「我想洗車。洗車場在50公尺外。我該走路去還是開車去？」很多AI模型說走路，因為很近（[洗車測試](https://opper.ai/blog/car-wash-test)，英文）。答案是開車：車子得在那裡。

**模型為什麼會答錯。**這和詞元無關（見[詞元](../tokens/)）：每個字都很普通。問題在於「距離短，所以走路」是一個非常強的模式，強到蓋過了真正的目標：把車子移過去。人也會栽在同一類問題上。最有名的是[球棒和球](https://en.wikipedia.org/wiki/Cognitive_reflection_test)（英文）：一支球棒和一顆球合計1.10美元，球棒比球貴1.00美元；球多少錢？大多數人說10美分。（答案是5美分。）

**系統一和系統二。**寇特問，那是不是「第一型思考」。心理學家描述了兩種模式（[雙歷程理論](https://zh.wikipedia.org/zh-tw/%E9%9B%99%E9%87%8D%E6%AD%B7%E7%A8%8B%E7%90%86%E8%AB%96)）：快速、自動、由模式驅動的*系統一*，以及緩慢、費力、會檢查的*系統二*，因丹尼爾‧康納曼的[《快思慢想》](https://zh.wikipedia.org/zh-tw/%E5%BF%AB%E6%80%9D%E6%85%A2%E6%83%B3)而廣為人知。Claude說這個比喻很貼切：它產出的每一個詞元，都是「一次快速的單趟運算，裡面沒有任何斟酌」。那就是系統一。

**系統二從哪裡來。**把思考說出來：在回答之前一步一步地把問題想過一遍，不管是在隱藏的「推理」步驟裡，還是在頁面上。專門做這件事的模型叫做[推理模型](https://zh.wikipedia.org/zh-tw/%E6%8E%A8%E7%90%86%E8%AA%9E%E8%A8%80%E6%A8%A1%E5%9E%8B)。這有幫助，但「不是解藥。就像人一樣，我可以推理很久，最後卻還是在替第一個冒出來的答案找理由」（[合理化](https://zh.wikipedia.org/zh-tw/%E5%90%88%E7%90%86%E5%8C%96_(%E5%BF%83%E7%90%86%E5%AD%B8))）。Anthropic發現，模型寫出來的推理，並不總是反映真正驅動它答案的東西（[reasoning models don't always say what they think](https://www.anthropic.com/research/reasoning-models-dont-say-think)，英文）。
