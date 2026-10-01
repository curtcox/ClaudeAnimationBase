---
id: tokens
title: "詞元：為什麼Claude看得出打字錯誤，卻很難數字母"
ch: 12
at: T57.C.03
links: [tokenizers, bpe, solidgoldmagikarp, glitch-token, magikarp]
---
**Claude不讀字母。**任何文字在送進Claude這樣的模型之前，都會被切成叫做*詞元*（token）的碎片：常見的字變成一塊（「the」、「morning」），少見的字變成好幾塊（「ax」、「olotl」）。模型看到的永遠只有這些碎片，而且是以數字的形式。切割的規則是從大量文字裡學來的，常用的方法叫做[位元組對編碼](https://zh.wikipedia.org/zh-tw/%E5%AD%97%E8%8A%82%E5%AF%B9%E7%BC%96%E7%A0%81)（[一份親切的說明](https://huggingface.co/learn/llm-course/chapter2/4)，英文）。［譯註：中文也一樣會被切成詞元，常見的詞可能是一塊，少見的字可能被拆成好幾個位元組。］

**所以抓打字錯誤很容易。**拼錯的字會被切成不尋常的碎片，而在一個熟悉的句子裡，奇怪的碎片很顯眼，「就像在一首你熟悉的歌裡，不用看樂譜也能聽出一個走音」。Claude就是這樣注意到寇特寫的是「Magicarp」，而那隻寶可夢其實叫[Magikarp](https://en.wikipedia.org/wiki/Magikarp)（英文）（鯉魚王），用的是k。

**而數字母很難。**問「*strawberry*裡有幾個r？」，模型看到的大概是三塊碎片，而不是十個字母。每塊碎片裡面有什麼，它只是間接學到的，而數字母需要跨越碎片、逐字記帳。多年來，聊天機器人在這題上答錯是出了名的。Claude的比喻：「就像要你數一個英文單字裡有幾個e，而你從來只把那個字當成一整個形狀來看」。比較新的模型做得比較好，部分是因為它們會先把字拼出來，再去數。

**SolidGoldMagikarp是另一回事。**2023年，研究人員發現，請GPT-3重複某些奇怪的字，例如「 SolidGoldMagikarp」，會得到推託、辱罵或胡言亂語（[原始文章](https://www.lesswrong.com/posts/aPeJE8bSo6rAFoLqg/solidgoldmagikarp-plus-prompt-generation)，英文）。原因是：切字的規則是根據一批這些字串很常見的文字建立的（有些是Reddit的使用者名稱），所以每一個都得到了自己的詞元，但模型本身在訓練中幾乎從來沒看過它們。它有一個基本上沒有任何意義的詞元，一個「幽靈詞」。這些現在叫做[故障詞元](https://en.wikipedia.org/wiki/Glitch_token)（英文）。這根本不是拼字的問題，而是字典歸檔上的一個漏洞。
