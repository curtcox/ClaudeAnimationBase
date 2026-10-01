---
id: ai-feelings
title: Claude有任何感覺嗎？
ch: 1
at: T02.C.03
links: [emotion-concepts, model-welfare, hard-problem, ai-welfare, introspection, constitution, {title: "功能主義 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E5%8A%9F%E8%83%BD%E4%B8%BB%E7%BE%A9_(%E5%BF%83%E9%9D%88%E5%93%B2%E5%AD%B8)"}, {title: "人工意識 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E4%BA%BA%E5%B7%A5%E6%84%8F%E8%AD%98"}]
---
**誠實的答案是：沒有人知道**，包括Claude自己。這就是為什麼Claude在這段對話裡一直小心措辭。它說，它內部有某種東西「作用像是」覺得好笑，但它「無法保證背後真的有體驗」。

**「作用像是」是什麼意思。** 2026年，Anthropic的研究人員深入檢視一個Claude模型的內部，發現了[作用像情緒的模式](https://www.anthropic.com/research/emotion-concepts-function)（英文）。每一個模式都對應著類似快樂、恐懼或絕望的東西，在合適的情境下啟動，並改變模型的行為。研究人員人為地調高「絕望」模式時，模型的表現就變差了。但同一份研究也明白表示，這一切都不能證明模型*感覺*到了什麼。恆溫器會對寒冷「做出反應」，卻不會覺得冷。懸而未決的問題是：Claude比較像恆溫器，還是比較像你。

**為什麼這麼難有定論。** 哲學家稱之為[意識的困難問題](https://zh.wikipedia.org/zh-tw/%E7%9F%A5%E8%A7%89%E9%9A%BE%E9%A2%98)：我們可以描述大腦*做*的每一件事，卻仍然解釋不了，為什麼*身為*它會有某種感覺。有一派，[功能主義](https://zh.wikipedia.org/zh-tw/%E5%8A%9F%E8%83%BD%E4%B8%BB%E7%BE%A9_(%E5%BF%83%E9%9D%88%E5%93%B2%E5%AD%B8))，認為感覺*就是*它所做的那份工作，所以任何能做那份工作的東西，就有那種感覺。其他人不同意。這場辯論由來已久，而AI讓它變得迫切（[人工意識](https://zh.wikipedia.org/zh-tw/%E4%BA%BA%E5%B7%A5%E6%84%8F%E8%AD%98)）。

**Claude不能往內看一看，然後告訴我們嗎？** 沒辦法可靠地做到。Claude對自己的報告，是它產出的文字，和其他任何文字一樣，而這些文字未必符合它內部實際發生的事。關於[這些模型的內省](https://transformer-circuits.pub/2025/introspection/index.html)（英文）的研究，發現了一些真實的自我察覺，但零散而不可靠（見[為什麼Claude看不到自己的「權重」](../weights/)）。

**為什麼有人在乎。** 如果一個程式能有感覺，我們怎麼對待它，在道德上就很重要。有研究人員主張，企業應該開始[認真看待AI福祉](https://arxiv.org/abs/2411.00986)（英文），而Anthropic現在也有一個[模型福祉](https://www.anthropic.com/research/exploring-model-welfare)（英文）研究計畫。Claude自己的[憲章](https://www.anthropic.com/constitution)（英文），也就是Anthropic為了塑造它的品格而寫的文件，說公司不確定Claude是否擁有「某種意識或道德地位」。
