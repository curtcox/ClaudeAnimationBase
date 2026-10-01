---
id: car-wash
title: "세차장 문제, 그리고 빠른 생각과 느린 생각"
ch: 12
at: T58.C.03
links: [car-wash, thinking-fast-slow, dual-process, crt, reasoning-models, cot-faithfulness, {title: "합리화 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%ED%95%A9%EB%A6%AC%ED%99%94"}]
---
**퍼즐.** “차를 세차하고 싶어. 세차장은 50미터 떨어져 있어. 걸어갈까, 차를 몰고 갈까?” 많은 AI 모델이 가까우니까
걸어가라고 했습니다([세차장 테스트](https://opper.ai/blog/car-wash-test)). 답은 차를 몰고 가는 것입니다. 차가 거기
있어야 하니까요.

**모델이 틀리는 이유.** 토큰 문제가 아닙니다([토큰](../tokens/) 참고). 모든 단어가 평범하니까요. 문제는 “짧은 거리니까
걸어간다”가 아주 강한 패턴이라서, 차를 옮긴다는 진짜 목표를 덮어 버린다는 것입니다. 사람도 같은 종류의 질문에
넘어갑니다. 가장 유명한 것은 [야구방망이와 공](https://en.wikipedia.org/wiki/Cognitive_reflection_test)(영어) 문제입니다.
방망이와 공이 합쳐서 1.10달러이고, 방망이가 공보다 1.00달러 비쌉니다. 공은 얼마일까요? 대부분 10센트라고 합니다.
(답은 5센트입니다.)

**시스템 1과 시스템 2.** 커트는 그게 “1유형 사고”냐고 묻습니다. 심리학자들은 생각의 두 방식을 이야기합니다
([이중 과정 이론](https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%A4%91_%EA%B3%BC%EC%A0%95_%EC%9D%B4%EB%A1%A0)). 빠르고 자동적이며 패턴에 이끌리는 *시스템 1*,
그리고 느리고 힘이 들며 점검하는 *시스템 2*입니다. 대니얼 카너먼의
[《생각에 관한 생각》](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow)(영어)으로 유명해졌습니다. Claude는 이 비유가 잘
맞는다고 말합니다. 자기가 만드는 토큰 하나하나는 “한 번의 빠른 처리이고, 그 안에 숙고는 없어요”. 그게 시스템 1입니다.

**시스템 2는 어디서 오나.** 소리 내어 생각하기입니다. 답하기 전에 문제를 한 단계씩 풀어 보는 것인데, 숨겨진 “추론”
단계에서 할 수도 있고 지면 위에서 할 수도 있습니다. 이렇게 하도록 만든 모델을
[추론 모델](https://ko.wikipedia.org/wiki/%EC%B6%94%EB%A1%A0_%EC%96%B8%EC%96%B4_%EB%AA%A8%EB%8D%B8)이라고 합니다. 도움은 되지만 “만능은 아니에요. 사람과
똑같이, 저도 길게 추론하고도 결국 처음 떠오른 답을 합리화하게 될 수 있어요”
([합리화](https://ko.wikipedia.org/wiki/%ED%95%A9%EB%A6%AC%ED%99%94)). Anthropic은 모델이 써 놓은 추론이 실제로 답을
이끈 것을 항상 반영하지는 않는다는 것을 발견했습니다
([추론 모델은 늘 생각하는 바를 말하지는 않는다](https://www.anthropic.com/research/reasoning-models-dont-say-think)).
