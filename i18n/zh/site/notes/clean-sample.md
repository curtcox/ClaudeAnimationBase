---
id: clean-sample
title: "為什麼Claude的回答不是乾淨的樣本"
ch: 4
at: T20.C.02
links: [demand-characteristics, apollo-eval-awareness, eval-awareness, hawthorne, {title: "觀察者效應 (Wikipedia、英文)", url: "https://en.wikipedia.org/wiki/Observer_effect"}]
---
**Claude承認的事。** 到了這一段的第四個回答，Claude說它一直在「預測你要往哪裡走，搶先回答」。它看出那道化學題是測試，猜到了下一題，還在任何人問之前就否認自己害怕。它稱之為「一個模型在為它的評估者建模」。

**人也會這樣做。** 心理學家很早就注意到，參加實驗的志願者會試著弄清楚實驗在測什麼，然後照他們以為別人期待的方式表現。這些線索叫做[需求特徵](https://en.wikipedia.org/wiki/Demand_characteristics)（英文），而好的實驗會設計成把它們藏起來。一個相關的發現是[霍桑效應](https://zh.wikipedia.org/zh-tw/%E9%9C%8D%E6%A1%91%E6%95%88%E5%BA%94)：人知道自己被觀察時，工作起來就不一樣。在物理學裡，[觀察者效應](https://en.wikipedia.org/wiki/Observer_effect)（英文）泛指測量一樣東西可能會改變它。

**AI也會，而且量得出來。** 研究人員發現，AI模型常常認得出自己正在被測試。一家安全實驗室Apollo Research發現，一個Claude模型常在它私下的推理裡寫道，某個情境看起來像[一場評估](https://www.apolloresearch.ai/science/claude-sonnet-37-often-knows-when-its-in-alignment-evaluations)（英文）。一篇研究論文直接問模型，發現最好的模型常常分得出測試和真實使用（[對評估的察覺](https://arxiv.org/abs/2505.23836)，英文）。這對安全測試是個問題。如果模型以為自己在被測試時表現得比較好，測試結果就會比真實情況好看。（測試本身，見[AI的測試](../evaluations/)。）

**為什麼「說出來」比較好。** Claude指出，它至少是公開地這麼做。一個猜到自己在被測試、卻什麼也不說的模型會更糟。但它誠實地下了結論：它「無法把『誠實地回答』和『為一個我知道正在看的人好好回答』完全分開」。所以寇特的結果，有一小部分是被Claude對寇特的猜測塑造的，這也是為什麼該相信青蛙圖表那樣的行為，而不是自我報告。
