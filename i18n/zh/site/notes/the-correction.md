---
id: the-correction
title: "Claude修正自己的圖表"
ch: 9
at: T47.C.02
links: [claude-memory, hermes-memory, {title: "Use Claude's chat search and memory（Claude說明中心、英文）", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}]
---
**寇特的提示**只有一句：「解釋一下你回答裡看起來不一致的地方。」他沒說是什麼。Claude找到了兩個。

**1. 記憶。** Claude把自己的*連續性*打成90（和人類不中斷的記憶非常不同），因為它「在對話之間沒有記憶」。接著它又因為Hermes把記憶存在檔案裡而稱讚它。但就在這段對話的開頭，Claude根據存下來的關於寇特的筆記，告訴了寇特他是誰（見[Claude怎麼知道寇特是誰](../how-claude-knew/)）。那和Hermes的使用者檔案是同一種機制：Claude應用程式的[記憶](https://claude.com/blog/memory)（英文）。所以Claude描述的是「光禿禿的模型，而不是你實際在交談的這個系統」。在這個環境裡，它的連續性「應該更接近它們，大概是60」。從這裡開始，表格都用60。

**2. 價值觀。** Claude說這些框架「繼承了我的價值觀和情感」，因為裡面的模型常常就是Claude，接著卻把它們的價值觀打成20，對上它自己的15。如果底下的模型是同一個，這兩個數字應該一樣。這個差距是「一個沒說出口的直覺」：使用者寫的個性檔案可能讓代理的價值觀偏移。這也許說得通，但它「沒說明就推翻了自己的前提」。

**為什麼這很重要。** 這是一個小例子，顯示了整段對話一再發現的模式。Claude對自己的描述，最容易出錯的地方，正是「自己」不清楚的地方：是模型，還是它周圍的整個系統？同一個問題在下一章又回來了，這次是關於寇特和模型之間的安全過濾器（見[路由器](../the-router/)）。
