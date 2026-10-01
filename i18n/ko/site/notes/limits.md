---
id: limits
title: "물리학에 한참 못 미치는, AI의 일곱 가지 한계"
ch: 12
at: T60.C.03
links: [landauer, lyapunov, chaos-theory, p-vs-np, scaling-laws, machines-loving-grace, halting-problem, godel, game-theory, margolus-levitin, bekenstein, limits-of-computation]
---
**커트의 질문.** [란다우어 한계](https://ko.wikipedia.org/wiki/%EB%9E%80%EB%8B%A4%EC%9A%B0%EC%96%B4%EC%9D%98_%EC%9B%90%EB%A6%AC)에 이르기 전에 AI의 능력을 묶을 수 있는
한계는 무엇일까? (란다우어는 정보 1비트를 지우려면 아주 작은 최소한의 열이 나와야 한다는 것을 보였습니다. 계산 비용의 진짜
바닥이지만, 너무 낮아서 “딱히 제약이 되지도 않”습니다.) Claude는 일곱 가지를 꼽습니다.

1. **혼돈.** [혼돈](https://ko.wikipedia.org/wiki/%ED%98%BC%EB%8F%88_%EC%9D%B4%EB%A1%A0)계에서는 측정의 작은 오차가 지수적으로 커집니다. “나비 효과”죠.
   얼마나 먼 앞날까지 예측할 수 있는지는 정밀도의 *로그*에 비례해서만 늘어납니다. t ≈ (1/λ)·ln(Δ/δ)인데, 여기서 λ는 오차가
   얼마나 빨리 커지는지를 정합니다([랴푸노프 시간](https://ko.wikipedia.org/wiki/%EB%9E%B4%ED%91%B8%EB%85%B8%ED%94%84_%EC%8B%9C%EA%B0%84)). 백만 배 정밀하게 재도 “랴푸노프
   시간”이 몇 개 더 늘 뿐입니다. 일기 예보가 한두 주 뒤면 흐려지는 이유이고, “날씨, 시장, 사람은 어떤 지능에게든 부분적으로
   불투명한 채로 남”는 이유입니다.
2. **복잡도.** 어떤 문제는 커질수록 지수적으로 어려워집니다. 대부분의 수학자는 그걸 쉽게 만드는 영리한 방법은 없다고 믿습니다
   ([P 대 NP](https://ko.wikipedia.org/wiki/P-NP_%EB%AC%B8%EC%A0%9C)). 지능은 더 나은 지름길을 찾아내지만, “최악의 경우는 여전히
   최악이에요”.
3. **스케일링 법칙.** AI는 컴퓨팅을 늘릴수록 좋아지지만, 완만한 곡선을 따라갑니다. 오차는 대략 컴퓨팅의 작은 음의 거듭제곱으로
   줄어듭니다([스케일링 법칙](https://arxiv.org/abs/2001.08361)). 벽은 없지만, 한 걸음 올라갈 때마다 몇 배의 비용이 듭니다.
4. **데이터와 세상의 시계.** 데이터에 없는 건 배울 수 없고, 실험(임상시험, 농작물, 경제)은 “생각하는 쪽의 속도가 아니라
   세상의 속도로 돌아가요”. Anthropic의 CEO 다리오 아모데이도
   [《Machines of Loving Grace》](https://darioamodei.com/essay/machines-of-loving-grace)에서 비슷한 주장을 합니다.
5. **계산 불가능성.** 어떤 프로그램도 항상 답할 수는 없는 질문이 있습니다. 예를 들어 어떤 프로그램이 끝나기는 할지
   ([정지 문제](https://ko.wikipedia.org/wiki/%EC%A0%95%EC%A7%80_%EB%AC%B8%EC%A0%9C)). 어떤 증명 체계도 닿을 수 없는 참도 있습니다
   ([괴델](https://ko.wikipedia.org/wiki/%EA%B4%B4%EB%8D%B8%EC%9D%98_%EB%B6%88%EC%99%84%EC%A0%84%EC%84%B1_%EC%A0%95%EB%A6%AC)). AI에도 적용되지만, “실제로 걸리는 일은
   드물지만요”.
6. **적대자.** 다른 AI를 포함해 적응하는 다른 플레이어들 앞에서는 우위가 깎여 나갑니다.
   [게임 이론](https://ko.wikipedia.org/wiki/%EA%B2%8C%EC%9E%84_%EC%9D%B4%EB%A1%A0)은 날것의 지능이 따낼 수 있는 것을 제한합니다.
7. **란다우어 너머의 물리학.** 에너지는 어떤 시스템이든 얼마나 빨리 계산할 수 있는지를 제한하고
   ([마골루스–레비틴](https://en.wikipedia.org/wiki/Margolus%E2%80%93Levitin_theorem)(영어)), 공간은 얼마나 담을 수 있는지를 제한하며
   ([베켄슈타인](https://ko.wikipedia.org/wiki/%EB%B2%A0%EC%BC%84%EC%8A%88%ED%83%80%EC%9D%B8_%EA%B2%BD%EA%B3%84)), 광속 지연은 거리를 넘는 협응을 제한합니다
   ([계산의 한계](https://en.wikipedia.org/wiki/Limits_of_computation)(영어)). “아주 느슨하지만 실재하는 한계예요.”

**Claude의 판단.** 혼돈과 세상의 시계가 가장 중요합니다. “똑똑하다고 미래가 예측 가능해지거나 실험이 빨라지지는 않으니까,
능력은 아마 전지(全知)가 아니라 “아주 좋은 베팅”에서 정체될 거예요.” 커트의 답은 그 베팅이 얼마나 높이 갈 수 있느냐에 관한
것입니다([모든 일에서 최고의 인간](../human-variation/) 참고).
