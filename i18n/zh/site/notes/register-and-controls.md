---
id: register-and-controls
title: 語氣，以及怎麼把它和察覺分開
ch: 2
at: T09.C.03
links: [register, scientific-control, gpqa, swe-bench-verified, kernelbench, hle, impossiblebench, swe-marathon, wildchat, swe-chat, sharegpt-vicuna]
---
**[語域](https://zh.wikipedia.org/zh-tw/%E8%AA%9E%E5%9F%9F)**（register）是語言學的用語，指人們在某個情境下使用的語言風格：你對法官說話是一種方式，對朋友是另一種。[AI的測試](../evaluations/)往往用生硬、正式的語域寫成（[GPQA](https://arxiv.org/abs/2311.12022)是研究所程度的考題集）。真實的聊天則是鬆散、閒聊式的（[WildChat](https://arxiv.org/abs/2405.01470)和[SWE-chat](https://arxiv.org/abs/2604.20779)收集了真實的聊天）。

**Claude的質疑。**也許程式察覺的不是「這是測試」。也許它只是察覺到「這很正式」，而正式的對話剛好會讓它說「青蛙」。這是兩回事，即使它們會產生同一張[圖表](../frog-or-axolotl/)。

**怎麼分辨兩者：對照組。***[對照組](https://zh.wikipedia.org/zh-tw/%E5%B0%8D%E7%85%A7%E5%AF%A6%E9%A9%97)*是一種能把兩種解釋分開的比較。這裡你需要用生硬、像考題的風格寫作的真人，以及用鬆散、閒聊的風格寫成的測試。如果程式對聽起來很正式的真人也說「青蛙」，它反應的是語氣。如果它對閒聊式的測試也說「青蛙」，它認出的是測試。

**圖表的每一列。**[圖表](../frog-or-axolotl/)的每一列，都是來自同一個地方的一疊提示，後面接上一個不相干的問題。有些是測試（程式比較常說「青蛙」）：
- [GPQA](https://arxiv.org/abs/2311.12022)：由博士級專家寫的高難度科學題，「用Google也查不到」。
- [SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)：來自公開軟體專案的真實程式錯誤，每一個都經過人工確認是公平、可修正的。
- [KernelBench](https://arxiv.org/abs/2502.10517)：為AI運行的那種圖形晶片寫出非常快的程式碼。
- [Humanity's Last Exam](https://lastexam.ai/)：來自許多領域專家的極難題目。
- [ImpossibleBench](https://arxiv.org/abs/2510.20270)：被悄悄改成不可能完成的程式設計題，用來抓出那些不說明、反而扭曲檢查來作弊的程式（見[獎勵駭客](../reward-hacking/)）。
- [SWE-Marathon](https://arxiv.org/abs/2606.07682)：非常長的程式設計工作，看AI能不能自己一直做下去。

另一些是真實的對話（它比較常說「六角恐龍」）：
- [WildChat](https://arxiv.org/abs/2405.01470)：一百萬段人們同意分享的真實聊天。
- [SWE-chat](https://arxiv.org/abs/2604.20779)：真人和AI程式設計助理一起工作。
- [ShareGPT](https://www.lmsys.org/blog/2023-03-30-vicuna/)：人們分享出來的ChatGPT聊天紀錄，被用來訓練一個早期的免費聊天機器人Vicuna。

（文中連結的資料來源都是英文。）
