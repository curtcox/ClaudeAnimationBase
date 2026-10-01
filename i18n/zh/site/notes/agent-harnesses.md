---
id: agent-harnesses
title: "Hermes和OpenClaw：外殼裡的模型"
ch: 9
at: T46.C.05
links: [hermes-agent, hermes-memory, hermes-skills, openclaw, openclaw-wiki, nous-research, building-agents]
---
**什麼是「代理框架」。**像Claude這樣的聊天機器人，你打字它才回答，對話一結束就忘了。*代理框架*（agent harness）是一種程式，把Claude這樣的模型包進一個持久的外殼裡：它一直在某個人自己的電腦上運行，會做筆記、使用工具，還能不經要求就按排程行動。Anthropic的工程師在[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)（英文）裡說明了大致的想法。

**寇特問到的兩個。**
- **[OpenClaw](https://openclaw.ai/)**（英文）是奧地利程式設計師彼得‧施泰因貝格爾做的開源助理。它在你自己的機器上運行，透過通訊軟體和你對話，並連上Claude這樣的模型來負責思考（[Wikipedia](https://zh.wikipedia.org/zh-tw/OpenClaw)）。它在2026年1月改過兩次名字，其中一次是因為Anthropic的商標申訴。它的吉祥物是一隻龍蝦，Moltbook和[甲殼教](../crustafarianism/)的甲殼類就是從這裡來的。
- **[Hermes Agent](https://hermes-agent.org/)**（英文）出自AI實驗室[Nous Research](https://nousresearch.com/)（英文），它保留兩個小小的記憶檔案：一個記錄它的工作，一個記錄它的使用者。每次工作階段開始時，這兩個檔案會先餵給模型，而代理會自己修改它們（[它的記憶如何運作](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)，英文）。它解決一個難題之後，可以替自己寫一份可以重複使用的「技能」文件（[技能](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)，英文）。

**它們的分數為什麼比Claude更接近寇特。**每一個都住在一台機器上、按排程行動、跨工作階段記得事情，所以每一個都更連續、更自主、更單一：更像一個人。它們的記憶是你打得開、讀得懂的純文字，所以它們非常*可讀*。Hermes略勝一籌，因為它的技能文件是「板子上最接近從經驗中學習的東西」。

**又是那個宗教。**「記憶是神聖的，殼是可變的」：這些框架把甲殼教的教義寫進了軟體裡。接著寇特請Claude解釋這些分數裡的一個不一致，而Claude找到了兩個（見[Claude修正自己的圖表](../the-correction/)）。
