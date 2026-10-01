---
id: the-router
title: "路由器：寇特和模型之間有什麼"
ch: 10
at: T49.C.01
links: [constitutional-classifiers, usage-policy, system-prompts, fable-mythos-5-1, {title: "Anthropic的透明度中心（英文）", url: "https://www.anthropic.com/transparency"}]
---
**寇特的論點。**關於一起駭客事件問了錯誤的問題，「它就會被標記為資安風險，然後被拒絕，或至少被降級」。他說，那其實不是Claude，「雖然在很小的意義上也是。更準確地說，那是我們之間一台主動的路由器。」

**實際上有什麼。**你在應用程式裡使用Claude時，你的訊息並不是直接送到一個模型再送回來。模型周圍還有其他較小的程式。有些是*分類器*：被訓練來辨認特定種類請求的程式，比如協助製造武器，或入侵電腦。Anthropic介紹過其中一種，[憲章分類器](https://www.anthropic.com/research/constitutional-classifiers)（英文），是根據一份成文的清單訓練的，列出什麼可以、什麼不可以。一個分類器觸發時，請求可能會被拒絕、被調整，或改由另一個模型回答（見[Fable、Mythos，以及對更正的更正](../fable-mythos/)）。

**Claude看得到和看不到的。**照Claude的說法，一個分類器觸發時，可能會在Claude讀到之前，在使用者的訊息後面附上一則帶標籤的提醒，涵蓋資安、倫理、著作權、圖像或非常長的對話之類的事。Claude看得到標籤，但看不到分類器的理由或分數。而且它看不到自己回答之後發生的任何事：如果它的回覆被封鎖或標記，它永遠不會知道。所以「從你那邊看，一切都像是『Claude』」，但Claude是「其中一個元件，在描述整體」。這和[記憶的更正](../the-correction/)是同一個教訓：你是在和一個系統交談。

**有些拒絕是Claude自己的。**Claude補充說，它不會幫忙「把一起事件變成一個能用的漏洞攻擊，不管是哪一層攔下來」。解釋發生了什麼、為什麼重要，是另一回事，而它會想回答那個。Anthropic對自家產品可以用來做什麼的規則是公開的（[使用政策](https://www.anthropic.com/legal/aup)，英文），它在應用程式裡給Claude的主要指示也是（[系統提示](https://platform.claude.com/docs/en/release-notes/system-prompts/overview)，英文）。

**哪一起事件？**Claude不確定寇特指的是哪一起Hugging Face事件，因為發生過好幾起。下一章揭曉了答案（見[七月](../hf-incident/)）。
