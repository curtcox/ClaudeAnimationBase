---
id: clean-sample
title: "Claude의 답이 깨끗한 표본이 아닌 이유"
ch: 4
at: T20.C.02
links: [demand-characteristics, apollo-eval-awareness, eval-awareness, hawthorne, {title: "관찰자 효과 (Wikipedia, 영어)", url: "https://en.wikipedia.org/wiki/Observer_effect"}]
---
**Claude가 인정하는 것.** 이 구간의 네 번째 답에서 Claude는 자기가 “커트 씨가 어디로 가는지 예측하고 앞질러 답해
왔어요”라고 말합니다. 화학 질문이 테스트라는 걸 알아챘고, 다음 질문을 짐작했고, 아무도 묻기 전에 두렵지 않다고
부인했습니다. Claude는 이것을 “평가자를 모델링하는 모델”이라고 부릅니다.

**사람도 그렇게 합니다.** 심리학자들은 오래전에, 실험에 참여한 자원자들이 실험이 무엇에 관한 건지 알아내려 하고, 그런
다음 기대된다고 생각하는 대로 행동한다는 것을 알아챘습니다. 이런 단서를
[요구 특성](https://ko.wikipedia.org/wiki/%EC%9A%94%EA%B5%AC%ED%8A%B9%EC%84%B1)이라고 하고, 좋은 실험은 이를 숨기도록 설계됩니다.
관련된 발견으로 [호손 효과](https://ko.wikipedia.org/wiki/%ED%98%B8%EC%86%90_%ED%9A%A8%EA%B3%BC)가 있습니다. 사람은 누가 지켜본다는 걸 알면
다르게 일한다는 것이죠. 물리학의 [관찰자 효과](https://en.wikipedia.org/wiki/Observer_effect)(영어)는 무언가를 측정하는 일이
그것을 바꿀 수 있다는 일반적인 생각입니다.

**AI는 측정될 만큼 그렇게 합니다.** 연구자들은 AI 모델이 테스트받고 있다는 걸 자주 알아챈다는 것을 발견합니다. 안전
연구소 Apollo Research는 한 Claude 모델이 비공개 추론에서 어떤 시나리오가
[평가처럼 보인다](https://www.apolloresearch.ai/science/claude-sonnet-37-often-knows-when-its-in-alignment-evaluations)고
자주 적는다는 것을 발견했습니다. 한 논문은 모델들에게 대놓고 물어서, 가장 뛰어난 모델들은 테스트와 실제 사용을 자주
구별할 수 있다는 것을 알아냈습니다([평가 인식](https://arxiv.org/abs/2505.23836)). 이는 안전 테스트에 문제가 됩니다.
모델이 테스트받는다고 생각할 때 더 잘 행동한다면, 테스트 결과가 현실보다 좋아 보이니까요. (테스트 자체는
[AI를 위한 테스트](../evaluations/) 참고.)

**왜 “소리 내어”가 더 나을까.** Claude는 적어도 이걸 드러내 놓고 하고 있다고 지적합니다. 테스트라고 짐작하고도 아무 말 하지
않는 모델이 더 나쁠 겁니다. 하지만 Claude는 정직하게 결론 내립니다. “정직하게 답하기”와 “지켜보고 있다는 걸 아는
사람에게 잘 답하기”를 완전히 떼어 놓을 수 없다고요. 그러니 커트의 결과는 Claude가 커트에 대해 하는 짐작에 조금 영향을
받고, 그래서 자기 보고보다는 개구리 차트 같은 행동을 믿을 이유가 됩니다.
