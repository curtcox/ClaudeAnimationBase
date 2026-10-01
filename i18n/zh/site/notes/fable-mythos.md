---
id: fable-mythos
title: "Fable、Mythos，以及對更正的更正"
ch: 10
at: T50.C.04
links: [fable-mythos-5-1, rsp, switch-models, {title: "Claude Fable 5 and Claude Mythos 5（Anthropic，2026年6月、英文）", url: "https://www.anthropic.com/news/claude-fable-5-mythos-5"}, {title: "Claude Mythos (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/Claude_Mythos"}]
---
**Claude說了什麼。**寇特提到了警告和「被換掉」。Claude更正了自己：它「其實不知道有在對話中途自動替換模型這回事」。你可以[自己切換模型](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings)（英文），而有些模型「出廠時就帶有額外的防護。比方說，Claude Fable和Mythos是同一個模型，只是在生物、網路攻防和AI研究方面加上了防護。那是一層固定的防護，不是即時替換。」

**Anthropic的公告怎麼說。**Anthropic在2026年6月發布了[Claude Fable 5和Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)（英文）：底下是同一個模型，靠防護措施來區分（*fabula*和*mythos*的意思大致都是「故事」）。少了部分防護的Mythos，只提供給經過審核的資安和生醫研究人員。給所有人用的Fable，防護涵蓋**網路安全**、**生物和化學**，以及**蒸餾**（用一個模型的答案去訓練另一個模型，藉此複製它的能力）。公告還說，這些防護觸發時，有些請求「會改由我們能力次高的模型Claude Opus 4.8回應」。[5.1版](https://www.anthropic.com/claude-fable-and-mythos-5-1)（英文，2026年9月）仍然會把某些網路安全和生命科學的請求，轉給Anthropic的Opus模型。

**所以這個更正本身需要更正。**根據Anthropic自己的說法，某種自動替換模型的機制確實存在：某些給Fable的請求，是由另一個模型回答的。而公布的防護領域是網路安全、生物／化學和蒸餾，不是「AI研究」。Claude說自己誇大了所知道的，這一點是對的。它說沒有替換，這一點是錯的。

**為什麼這是影片裡最有用的錯誤。**寇特的下一個問題是「你怎麼知道這些的？」，而Claude的回答是：來自指示，「而不是來自內省」。它看不見自己的管線，所以它的說法可能過時或被簡化了，就像這一次（見[證詞，不是觀察](../testimony/)）。Anthropic在它的[負責任擴展政策](https://www.anthropic.com/responsible-scaling-policy)（英文）裡公布了這些防護背後的規則。
