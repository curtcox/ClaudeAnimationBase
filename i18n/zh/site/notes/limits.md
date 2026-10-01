---
id: limits
title: "AI的七個極限，遠在物理學之前"
ch: 12
at: T60.C.03
links: [landauer, lyapunov, chaos-theory, p-vs-np, scaling-laws, machines-loving-grace, halting-problem, godel, game-theory, margolus-levitin, bekenstein, limits-of-computation]
---
**寇特的問題。**在[蘭道爾極限](https://zh.wikipedia.org/zh-tw/%E8%98%AD%E9%81%93%E7%88%BE%E5%8E%9F%E7%90%86)之前，有哪些極限可能限制AI的能力？（蘭道爾證明了，抹去一位元的資訊，必定會釋放出一個微小的最低熱量。這是計算成本真正的下限，但低到「並不怎麼構成限制」。）Claude給了七個。

1. **混沌。**在[混沌](https://zh.wikipedia.org/zh-tw/%E6%B7%B7%E6%B2%8C%E7%90%86%E8%AE%BA)系統裡，測量上的微小誤差會呈指數增長，也就是「蝴蝶效應」。你能預測多遠，只隨著精度的*對數*增長：t ≈ (1/λ)·ln(Δ/δ)，其中λ決定誤差增長得多快（[李亞普諾夫時間](https://zh.wikipedia.org/zh-tw/%E6%9D%8E%E9%9B%85%E6%99%AE%E8%AF%BA%E5%A4%AB%E6%97%B6%E9%97%B4)）。測量好上一百萬倍，你也只多得到寥寥幾個「李亞普諾夫時間」。這就是為什麼天氣預報過了一兩週就不準了，也是為什麼「天氣、市場和人，對任何智慧來說都仍有一部分是不透明的」。
2. **複雜度。**有些問題規模一變大，難度就呈指數增加。大多數數學家相信，沒有任何巧妙的方法能讓它們變簡單（[P對NP問題](https://zh.wikipedia.org/zh-tw/P/NP%E9%97%AE%E9%A2%98)）。智慧能找到更好的捷徑，「但最壞的情況依然最壞」。
3. **縮放定律。**AI的運算能力越多就越好，但沿著一條平緩的曲線：誤差大致隨著運算量的一個小小負次方下降（[縮放定律](https://arxiv.org/abs/2001.08361)，英文）。沒有牆，但每往上一步，都要多花好幾倍的代價。
4. **資料和世界的時鐘。**資料裡沒有的東西，你學不到，而實驗（臨床試驗、農作物、經濟）「都按世界的速度進行，而不是按思考者的速度」。Anthropic的執行長達里奧‧阿莫代在[*Machines of Loving Grace*](https://darioamodei.com/essay/machines-of-loving-grace)（英文）裡也提出了類似的論點。
5. **不可計算性。**有些問題沒有任何程式能永遠回答，比如任意一個程式會不會結束（[停機問題](https://zh.wikipedia.org/zh-tw/%E5%81%9C%E6%9C%BA%E9%97%AE%E9%A2%98)），而有些真理是任何證明系統都達不到的（[哥德爾](https://zh.wikipedia.org/zh-tw/%E5%93%A5%E5%BE%B7%E5%B0%94%E4%B8%8D%E5%AE%8C%E5%A4%87%E5%AE%9A%E7%90%86)）。它們也適用於AI，「雖然在實務上很少真的卡住」。
6. **對手。**面對其他會適應的玩家，包括其他AI，優勢會被磨蝕：[賽局理論](https://zh.wikipedia.org/zh-tw/%E5%8D%9A%E5%BC%88%E8%AE%BA)限制了純粹的智力能贏得多少。
7. **蘭道爾之外的物理。**能量限制了任何系統的計算速度（[馬戈勒斯–列維廷](https://en.wikipedia.org/wiki/Margolus%E2%80%93Levitin_theorem)（英文）），空間限制了它能容納多少（[貝肯斯坦](https://zh.wikipedia.org/zh-tw/%E8%B2%9D%E8%82%AF%E6%96%AF%E5%9D%A6%E4%B8%8A%E9%99%90)），而光速造成的延遲限制了跨距離的協調（[計算的極限](https://en.wikipedia.org/wiki/Limits_of_computation)（英文））。「非常寬鬆，但真實存在。」

**Claude的押注。**混沌和世界的時鐘最要緊。「聰明不會讓未來變得可預測，也不會讓實驗變快，所以能力大概會停在『非常好的押注』，而不是全知。」寇特的回應，講的是這些押注能有多高（見[樣樣都最強的人](../human-variation/)）。
