---
id: evaluations
title: AI的測試，以及被測試為什麼可能改變答案
ch: 2
at: T07.C.02
links: [hawthorne, swe-bench-verified, gpqa, hle, eval-awareness, {title: "基準測試 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E5%9F%BA%E5%87%86%E6%B5%8B%E8%AF%95"}]
---
**評估**（英文簡稱「eval」）是企業或研究人員給AI程式做的測試，用來看它有多能幹、有多安全：考題（[GPQA](https://arxiv.org/abs/2311.12022)、[Humanity's Last Exam](https://lastexam.ai/)，英文）、程式設計題（[SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)，英文）、棘手的道德情境。結果決定一個版本要不要發布，以及要附上什麼預防措施。（這個概念一般叫做[基準測試](https://zh.wikipedia.org/zh-tw/%E5%9F%BA%E5%87%86%E6%B5%8B%E8%AF%95)。）

**擔憂。**人知道自己被觀察時，行為會不一樣。經典的例子（雖然歷史學家至今仍有爭論）是1920年代在一家工廠[霍桑工廠](https://en.wikipedia.org/wiki/Hawthorne_Works)（英文）做的一系列研究，工人似乎只因為被觀察，表現就變好了；這也就是*[霍桑效應](https://zh.wikipedia.org/zh-tw/%E9%9C%8D%E6%A1%91%E6%95%88%E5%BA%94)*名稱的由來。如果一個AI程式在測試中表現得比在真實使用中好，測試就會給出一幅假的美好圖像。

**程式為什麼可能察覺。**測驗題往往看起來就像測驗題：正式、精確、具體得有點奇怪。真實的對話比較雜亂。一個讀過大量兩種文字的程式，可能不用人告訴就察覺到其中的差別，而研究人員發現，有些程式確實察覺到了（[LLMs often know when they're being evaluated](https://arxiv.org/abs/2505.23836)，英文）。

**Claude的主張，以及這個主張的問題。**Claude說它努力做到「不管有沒有人在打分數，回答都一樣」。但一個程式對自己的描述，不能證明它實際上怎麼表現（見[說的和做的](../saying-vs-doing/)）。這正是[青蛙測試](../frog-or-axolotl/)要從外部檢驗的東西。
