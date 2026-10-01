---
id: concepts-case
title: "主張AI沒有概念的理由，以及反駁"
ch: 6
at: T33.C.03
links: [symbol-grounding, chinese-room, blockhead, monosemanticity, harnad, searle, ned-block, computer-use, {title: "具身認知 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E9%AB%94%E5%8C%96%E8%AA%8D%E7%9F%A5"}]
---
**寇特的挑戰。** 「以一個專業本體論者的身分，你能為『你沒有概念』這個主張提出辯護嗎？」Claude分四點提出了反對自己的理由，然後給出反駁。

**1. 扎根。** 一個概念應該把心智和世界連結起來。Claude的「水」這個字，只連到其他的字，從來連不到濕或渴。這就是[符號扎根問題](https://zh.wikipedia.org/zh-tw/%E7%AC%A6%E8%99%9F%E5%A5%A0%E5%9F%BA%E5%95%8F%E9%A1%8C)，由認知科學家[史蒂文‧哈納德](https://en.wikipedia.org/wiki/Stevan_Harnad)（英文）在1990年命名。哲學家[約翰‧瑟爾](https://zh.wikipedia.org/zh-tw/%E7%BA%A6%E7%BF%B0%C2%B7%E7%91%9F%E5%B0%94)在1980年提出了一個相關的論證，[中文房間](https://plato.stanford.edu/entries/chinese-room/)（英文）：一個照著規則手冊做事的人，可以用中文完美地回答問題，卻一個字也不懂。［譯註：這個思想實驗用的正是中文，在中文裡讀起來別有一番滋味。］

**2. 承諾。** 擁有一個概念，代表要對它負責：用錯了是*你*的錯。Claude說它沒有任何利害關係。巧妙的框架可以讓它自相矛盾，而它內部沒有任何東西會反對。

**3. 穩定。** 一個概念應該在任何地方都以同樣的方式運作。[青蛙圖表](../frog-or-axolotl/)顯示，模型的答案會隨著對話的語氣而改變。

**4. 行為不是證明。** 哲學家[內德‧布洛克](https://zh.wikipedia.org/zh-tw/%E5%86%85%E5%BE%B7%C2%B7%E5%B8%83%E6%B4%9B%E5%85%8B)設想了一個「[笨頭](https://en.wikipedia.org/wiki/Blockhead_(thought_experiment))（英文）」（Blockhead）：一台機器，存著一張巨大的表，列出所有可能的對話，以及對每一句的合理回應。它能通過任何有限長度的測試，同時什麼也沒在想。所以通過斯林朵測試，證明的是能力，不是概念。

**反駁。**
- 第2點和第3點也適用在人身上：我們也會自相矛盾，也會隨著框架改變。
- 深入檢視這些模型的研究人員，在內部找到了一些表現得很像概念的特徵。Anthropic在一個模型裡標出了數百萬個這樣的特徵，其中一個對應著金門大橋（[Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)，英文）。
- 要求概念扎根於感官，會把「[質數](https://zh.wikipedia.org/zh-tw/%E8%B4%A8%E6%95%B0)」這樣的概念也排除在外，因為沒有人見過或摸過質數。

**寇特的回應：「只有扎根這一點還站得住，而那相當自私自利。」** Claude同意：這條規則剛好把它瞄準的東西排除在外。而且它正在被侵蝕。模型現在會看圖像、[使用電腦](https://www.anthropic.com/news/3-5-models-and-computer-use)（英文），並在世界中行動，而*你*對「正義」或「質數」的掌握，很多是透過文字而不是感官得來的（參照[具身認知](https://zh.wikipedia.org/zh-tw/%E9%AB%94%E5%8C%96%E8%AA%8D%E7%9F%A5)）。笨頭另有它自己的答案：見[GAZP vs. GLUT](../gazp-glut/)。
