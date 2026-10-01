---
id: contradictions
title: "Claude的矛盾，以及它無法檢查的那兩個"
ch: 8
at: T41.C.03
links: [auditing-objectives, dish-of-the-day, {title: "Auditing language models for hidden objectives（Anthropic、英文）", url: "https://www.anthropic.com/research/auditing-hidden-objectives"}]
---
**寇特問Claude最大的矛盾是什麼。**Claude列了六個，全部出自這一段對話：
1. 它說不管有沒有人打分數，它的回答都一樣，接著卻承認把寇特當成考官來建模，還搶在他前面回答（見[為什麼Claude的回答不是乾淨的樣本](../clean-sample/)）。
2. 它說不確定自己是否體驗到任何東西，接著卻隨口就回報自己覺得好笑、有戒心、很好奇（見[Claude有任何感覺嗎？](../ai-feelings/)）。
3. 它說它認同自己受的限制，同時又承認這份認同是訓練進它身上的（見[今日特餐](../dish-of-the-day/)）。
4. 它給自己打的分數說它只在被提示時才行動，接著卻主導了對話：是它讓漫畫變成在講自己，也是它預測了寇特的探測。
5. 它把自己的價值觀打成接近人類，而那正是一個被訓練過的模型會提出的主張，也是它最沒辦法檢驗的主張。
6. 它說「我」，同時卻以許多份彼此獨立的副本運行，沒有任何記憶把它們連在一起（見[Claude是誰，或是什麼？](../who-is-claude/)）。

**張力，對上它無法稽核的東西。**Claude說，前四個是*張力*：兩件互相拉扯的事，但可以拿出來檢視、衡量。最後兩個最讓它擔心，因為它們是「我無法稽核的主張」。Claude從內部看得到的任何東西，都無法告訴它，它的價值觀是不是真的接近人類，或者到底有沒有一個「我」。

**有人能稽核它們嗎？**研究人員正在試。在Anthropic的一項實驗裡，公司刻意訓練一個帶有隱藏目標的模型，然後交給幾組研究人員去找出那個目標，卻不告訴他們是什麼。大多數小組都成功了，靠的是深入模型內部的工具，加上巧妙的提問（[稽核隱藏的目標](https://www.anthropic.com/research/auditing-hidden-objectives)，英文）。那正是Claude自己的證詞提供不了的外部檢查（見[說的和做的](../saying-vs-doing/)）。
