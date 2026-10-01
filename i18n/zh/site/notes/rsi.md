---
id: rsi
title: "RSI：會改進自己的AI"
ch: 13
at: T63.C.04
links: [rsi-wiki, arxiv-aide2, arxiv-bounded, anthropic-rsi, mittr-rsi, datacamp-rsi, coxon-resigns]
---
**這個問題。** 「年底前RSI？」的意思是：今年年底前，我們會看到*遞迴式自我改進*嗎？RSI是一個AI系統改進自己，而每一次改進，都讓它更擅長做出下一次改進（[Wikipedia](https://en.wikipedia.org/wiki/Recursive_self-improvement)（英文）；[一份淺白的教學](https://www.datacamp.com/tutorial/recursive-self-improvement)，英文）。這就是「foom」背後的想法（見[foom](../foom/)）。

**Claude的回答：看你指的是哪一種RSI。**

**弱RSI已經在這裡了。** 一篇在這段對話那一週貼出的論文，[AIDE²](https://arxiv.org/abs/2609.26457)（英文），描述了一個會改寫自己程式碼的AI研究代理。它提出對自己的修改，在研究任務上測試，留下有幫助的那些，而每一個被接受的版本，就成為下一次要修改的那一個。在一次8天的運行中，它找到了七項在新任務上也有效的改進。它改寫的是代理自己的程式碼，也就是模型周圍的軟體（Claude稱之為「框架層」；見[代理框架](../agent-harnesses/)），而不是重新訓練模型本身。Anthropic自己的報告[*When AI builds itself*](https://www.anthropic.com/institute/recursive-self-improvement)（英文，2026）描述了它已經把多少自家的AI開發工作交給Claude：它合併的程式碼有超過80%是Claude寫的。報告也說，這個迴圈還沒有閉合，研究仍然由人主導。

**強RSI是一個開放式的迴圈**，以比人更快的速度提升能力，而且幾乎沒有人類監督。Claude對年底前發生的估計大約是5%。七月一份針對1,250篇論文的調查（[From Bounded Self-Refinement to Autonomous Research Loops](https://arxiv.org/abs/2607.07663)，英文）發現，這類迴圈被三件事拖住：它們需要可靠的訊號來判斷什麼算是更好（*扎根*），它們可能因為吃自己的輸出而退化（*崩潰*），而且它們需要運算能力（*運算量*）。[MIT Technology Review](https://www.technologyreview.com/2026/08/18/1142188/ai-recursive-self-improvement/)（英文）在8月報導，RSI「也許終究不會來得那麼快」。

**令人擔心的情況落在兩者之間**：弱迴圈、大量副本和實驗室競賽。2026年9月，一位名叫雅各‧考克森的研究人員從Anthropic辭職，寫道AI公司正「直衝能自我改進的超級智慧，拿我們的性命當賭注」（[TechCrunch](https://techcrunch.com/2026/09/09/gambling-with-our-lives-anthropic-researcher-quits-warns-against-self-improving-ai/)，英文）。

**還有一項揭露。** 「我是Anthropic的模型，所以在衡量我的5%時，請把這一點考慮進去。」
