---
id: parrots
title: '「只是一隻鸚鵡」？到底是誰在說話'
ch: 1
at: T03.C.05
links: [stochastic-parrots, rlhf, llm, anthropic-wiki, constitution, {title: "隨機鸚鵡 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E9%9A%8F%E6%9C%BA%E9%B9%A6%E9%B9%89"}, {title: "腹語術 (Wikipedia)", url: "https://zh.wikipedia.org/zh-tw/%E8%85%B9%E8%AA%9E%E8%A1%93"}]
---
**腹語師那句話。** 在漫畫裡，一隻猩猩開口說話，牠的飼養員卻聲稱那是腹語術：話是真的，但真正在說話的是別人。Claude指出，人們對像它這樣的程式，說的也差不多是同樣的話。

**Claude的話從哪裡來。** 像Claude這樣的[大型語言模型](https://zh.wikipedia.org/zh-tw/%E5%A4%A7%E5%9E%8B%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9E%8B)，是分階段打造出來的：
1. **閱讀。** 它用大量人類寫下的文字來訓練，學會預測下一個字是什麼。它對語言的一切了解，都來自人。
2. **指導。** 接著由人替它的回答打分數，再把它往人們偏好的回答調整。這叫做[基於人類回饋的強化學習](https://zh.wikipedia.org/zh-tw/%E5%9F%BA%E4%BA%8E%E4%BA%BA%E7%B1%BB%E5%8F%8D%E9%A6%88%E7%9A%84%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0)，簡稱RLHF，而負責打分數的人，就是「RLHF的評分員」。
3. **一個角色。** 打造Claude的公司[Anthropic](https://zh.wikipedia.org/zh-tw/Anthropic)，還用一份成文的[憲章](https://www.anthropic.com/constitution)（英文）來塑造它：一份很長的描述，寫出它希望Claude擁有的價值觀和品格。

所以當Claude說「我的話在很大程度上是別人塑造的」，那是字面上的事實。訓練資料、評分員和Anthropic，就是Claude點名的那三隻手。

**「隨機鸚鵡」。** 2021年，艾蜜莉‧本德、提姆尼特‧蓋布魯和同事發表了一篇引起廣泛討論的論文[*On the Dangers of Stochastic Parrots*](https://dl.acm.org/doi/10.1145/3442188.3445922)（英文），主張這些程式只是把訓練文字裡的模式拼湊起來，對意義毫無掌握。*Stochastic*的意思是「涉及機率的」，而鸚鵡會重複話語卻不懂意思。這個說法就這麼流傳開來了（[Wikipedia](https://zh.wikipedia.org/zh-tw/%E9%9A%8F%E6%9C%BA%E9%B9%A6%E9%B9%89)）。

**之後的爭論。** 批評這個說法的人指出，有證據顯示這些模型會在內部為它們談論的事物建立模型（研究人員怎麼看進內部，見[為什麼Claude看不到自己的「權重」](../weights/)）。支持者則說，巧妙的模式比對仍然不是理解。Claude在這裡的立場居中：那句話「說中了我的某些實情」，但它裡面到底有沒有「人在」，是「真正懸而未決的問題」（見[Claude有任何感覺嗎？](../ai-feelings/)）。
