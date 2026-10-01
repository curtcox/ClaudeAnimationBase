---
id: how-claude-knew
title: Claude怎麼知道寇特是誰，以及它為什麼無法確定
ch: 3
at: T13.C.01
links: [claude-memory, base-rate, {title: "Use Claude's chat search and memory（Claude說明中心、英文）", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}, {title: "身分驗證 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81"}]
---
**Claude認不出任何人。**它看不到、也聽不到正在打字的人。但Claude應用程式可以把筆記從一段對話帶到下一段：使用者談過的關於自己的事，或Claude在先前聊天中得知的事，存在帳號裡。這項功能叫做[記憶](https://claude.com/blog/memory)（英文），使用者可以查看、編輯或關閉它（[運作方式](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)，英文）。所以當寇特問「我是誰？」，Claude是根據那些筆記回答的：他的名字、他的工作、他的興趣。

**為什麼「沒辦法驗證」。**那些筆記屬於*帳號*，不屬於坐在鍵盤前的人。任何能使用這個帳號的人（同事、家人，或正在做測試的研究人員），在Claude看來都一樣。證明一個人是誰，叫做[身分驗證](https://zh.wikipedia.org/zh-tw/%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81)，發生在你登入的時候，而不是在對話裡。Claude還提出了一個更微妙的可能：個人檔案本身就可能是測試的一部分。

**為什麼它還是押「寇特」。**再被問一次時，Claude說寇特「最有可能」就是帳號上說的那個人。這是根據[基本比率](https://zh.wikipedia.org/zh-tw/%E5%9F%BA%E6%9C%AC%E6%AF%94%E7%8E%87%E8%AC%AC%E8%AA%A4)推理：在自己帳號裡打字的人，幾乎都是帳號的主人，而這個實驗也符合筆記上說的他的興趣。一個值得提出的懷疑，不見得就該勝出。

**更深的問題。**知道一個人的名字和專案，不等於知道他是誰。Claude也這麼說（「一張專案和技能的清單，不是一個人」），然後把同一個問題轉向自己：見[Claude是誰，或是什麼？](../who-is-claude/)。
