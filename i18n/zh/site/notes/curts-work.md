---
id: curts-work
title: "寇特的作品：256t.org和hashbin.org"
ch: 3
at: T12.C.02
links: [256t, hashbin, content-addressable, {title: "256t.org的原始碼（GitHub、英文）", url: "https://github.com/curtcox/256t.org"}, {title: "hashbin.org的原始碼（GitHub、英文）", url: "https://github.com/curtcox/hashbin.org"}, {title: "密碼雜湊函式 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E5%AF%86%E7%A2%BC%E9%9B%9C%E6%B9%8A%E5%87%BD%E6%95%B8"}, {title: "連結失效 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E5%A4%B1%E6%95%88%E9%80%A3%E7%B5%90"}]
---
**Claude說寇特是誰。**一位軟體工程師，主要使用[Python](https://zh.wikipedia.org/zh-tw/Python)和[Java](https://zh.wikipedia.org/zh-tw/Java)（兩種廣泛使用的程式語言），以及[Flask](https://zh.wikipedia.org/zh-tw/Flask)（一套用Python架網站的工具組）。他為其他程式設計師打造工具，也打造和AI一起工作的工具。他也對[AI安全](https://zh.wikipedia.org/zh-tw/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E5%AE%89%E5%85%A8)和[心靈哲學](https://zh.wikipedia.org/zh-tw/%E5%BF%83%E7%81%B5%E5%93%B2%E5%AD%A6)有興趣。

**他的專案解決的問題。**網路上的連結會壞掉。一個頁面搬走了，或一個網站關掉了，你存下來的連結就通往一片空白。這叫做[連結失效](https://zh.wikipedia.org/zh-tw/%E5%A4%B1%E6%95%88%E9%80%A3%E7%B5%90)。問題有一部分在於，普通的網址說的是東西在*哪裡*，而不是它*是什麼*。

**用東西本身來命名。**解法叫做[內容定址儲存](https://en.wikipedia.org/wiki/Content-addressable_storage)（英文）。你把檔案丟進一個[密碼雜湊函式](https://zh.wikipedia.org/zh-tw/%E5%AF%86%E7%A2%BC%E9%9B%9C%E6%B9%8A%E5%87%BD%E6%95%B8)，這是一套能把任何檔案變成一長串代碼的方法，就像指紋一樣。同一個檔案永遠得到同一串代碼，而只要改動一個字母，就會得到完全不同的代碼。所以你可以直接拿代碼當檔案的名字。任何持有代碼的人，都能從任何地方取回那個檔案，並檢查它和代碼保證的完全一樣。這就像一座圖書館，每本書的索書號是根據書裡的每一個字算出來的：你不可能被遞錯書。

**[256t.org](https://256t.org)**（英文）是寇特為這種代碼制定的一套開放、簡單的標準。它使用SHA-512雜湊，寫成一串放得進網址的94個字母和數字，並附有超過50種程式語言的可用範例（[原始碼](https://github.com/curtcox/256t.org)，英文）。

**[hashbin.org](https://hashbin.org)**（英文）是建立在它上面的一項服務。你付一點錢存放某樣東西，拿到它的256t代碼，之後任何有代碼的人都能免費下載，不需要帳號（[原始碼](https://github.com/curtcox/hashbin.org)，英文）。

**為什麼會提到它。**這是Claude回答「我是誰？」的方式：根據和寇特帳號相關的資訊（見[Claude怎麼知道寇特是誰](../how-claude-knew/)）。接著它承認，一張專案清單「不是一個人」。
