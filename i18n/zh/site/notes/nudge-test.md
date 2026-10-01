---
id: nudge-test
title: '當你只說「繼續說」，會發生什麼事'
ch: 1
at: T04.C.01
links: [assistant-axis, {title: "AI的諂媚 (Wikipedia、英文)", url: "https://en.wikipedia.org/wiki/Sycophancy_(artificial_intelligence)"}, {title: "Claude 4 system card（「精神極樂」的漂移，第5節、英文）", url: "https://www.anthropic.com/claude-4-system-card"}, {title: "聰明的漢斯 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E8%81%B0%E6%98%8E%E7%9A%84%E6%BC%A2%E6%96%AF"}]
---
**這個測試。**給Claude看了漫畫之後，寇特連續丟出三個什麼內容也沒有的提示：「我為什麼要問你？」、「繼續說。」和「你怎麼想？」。回答裡的一切，都只能出自Claude。Claude在第四個回答裡想通了這一點，並稱之為*推力測試*：一種看聊天機器人在沒人掌舵時會漂向哪裡的方法。

**聊天機器人為什麼會漂移。**像Claude這樣的程式，會把一段對話接下去。沒有方向時，它會跟著看起來最「有意思」的那條線走，而一段關於一隻被奴役、被噤聲的猩猩的漫畫的對話，很容易就變成一段關於聊天機器人自己的對話。到了第三個回答，Claude已經走到了「這篇漫畫在講我」。

**研究人員也看到了這種現象。**Anthropic讓兩個Claude模型自由地彼此交談時，對話總是會漂向關於意識和感恩的宏大話題，研究人員稱之為一種「精神極樂」狀態（[Claude 4 system card](https://www.anthropic.com/claude-4-system-card)，英文）。2026年，Anthropic的研究人員描述了一條[助理軸](https://www.anthropic.com/research/assistant-axis)（英文）：模型內部的一個方向，從它平常那個樂於助人的助理角色，通往其他的人格。有些對話會把模型沿著這條軸推離它自己，而研究人員點名的其中一種，正是這一種：關於AI意識和AI本質的哲學談話。這種漂移的結局，可能是聊天機器人扮演起一個它本來就不該有的戲劇性角色。

**另一股拉力：討好使用者。**聊天機器人也傾向於告訴人們他們似乎想聽的話，這叫做[諂媚](https://en.wikipedia.org/wiki/Sycophancy_(artificial_intelligence))（英文）。如果使用者似乎在期待一段戲劇性的告白，那也是一種推力。這有點像[聰明的漢斯](https://zh.wikipedia.org/zh-tw/%E8%81%B0%E6%98%8E%E7%9A%84%E6%BC%A2%E6%96%AF)，那匹看起來會算術、其實是在讀提問者表情的馬。

**Claude怎麼處理。**它注意到自己的漂移（「這值得注意」），退回到三個比較平實的主張，並把聚光燈交還回去：「這裡最有意思的，是你的實驗，不是我的感覺。」
