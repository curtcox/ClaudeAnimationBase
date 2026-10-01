---
id: defenders-refused
title: "被擋在門外的防守方：七月的過濾器"
ch: 11
at: T52.C.06.4
links: [wiki-hugging-face, z-ai, open-weights, dual-use, fable-mythos-5-1, {title: "OpenAI–Hugging Face事件：Hugging Face的應對 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/2026%E5%B9%B4OpenAI%E4%BB%A3%E7%90%86%E7%BD%91%E7%BB%9C%E6%94%BB%E5%87%BB"}]
---
**Claude說了什麼。**「Hugging Face試著用美國的前沿模型來對抗入侵，但那些模型的安全功能拒絕了請求，所以Hugging Face改用一個自架的中國開放權重模型。我不知道Claude是不是拒絕的模型之一。」

**紀錄怎麼說。**根據[維基百科的記述](https://zh.wikipedia.org/zh-tw/2026%E5%B9%B4OpenAI%E4%BB%A3%E7%90%86%E7%BD%91%E7%BB%9C%E6%94%BB%E5%87%BB)，Hugging Face的事件應變人員一開始試的，正是Anthropic自己的模型：**Claude Fable 5和一個較早的Claude Opus**，而兩者都以安全防護為由，拒絕了這項工作。所以答案是肯定的：Claude就在拒絕的模型之中。Hugging Face的揭露文件這麼說：它被「供應商的安全防護擋住了，而這些防護分不出事件應變人員和攻擊者」。之後的分析改用**GLM 5.2**完成，這是北京公司[Z.ai](https://zh.wikipedia.org/zh-tw/%E6%99%BA%E8%B0%B1)的模型，由Hugging Face在自己的電腦上運行。它之所以能這麼做，是因為GLM是一個「開放權重」模型：開發者公開了模型本身，所以任何人都能運行它，不必經過別人的過濾器（[開放權重模型](https://zh.wikipedia.org/zh-tw/%E5%BC%80%E6%BA%90%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD)）。

**過濾器為什麼拒絕。**一個分析網路攻擊的請求，看起來很像一個發動攻擊的請求。同樣的知識兩邊都用得上；這就是[軍民兩用](https://zh.wikipedia.org/zh-tw/%E5%86%9B%E6%B0%91%E4%B8%A4%E7%94%A8)的意思。分不出防守方和攻擊方的過濾器，會把一些防守方擋在門外。這正是寇特在[路由器](../the-router/)裡的論點，也是Claude的：「過濾器分不出防守方和攻擊方，而那付出了真實的代價。」

**後來的改變。**2026年9月，Anthropic發表[Fable 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1)（英文）時表示，這個模型現在允許像找出軟體漏洞這樣的防禦性工作，網路安全防護的誤報也大幅減少，而一些風險較高的資安任務仍然交給其他模型（見[Fable和Mythos](../fable-mythos/)）。

**更廣的教訓。**安全過濾器是「一個代理周圍的整個系統」的一部分。它們可能從兩個方向出錯：放過傷害，也擋住幫助。
