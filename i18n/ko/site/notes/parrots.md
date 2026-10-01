---
id: parrots
title: "“그냥 앵무새”? 누가 말하고 있는가"
ch: 1
at: T03.C.05
links: [stochastic-parrots, rlhf, llm, anthropic-wiki, constitution, {title: "확률적 앵무새 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%ED%99%95%EB%A5%A0%EC%A0%81_%EC%95%B5%EB%AC%B4%EC%83%88"}, {title: "복화술 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EB%B3%B5%ED%99%94%EC%88%A0"}]
---
**복화술사 대사.** 만화에서 유인원이 말을 하자, 사육사는 그게 복화술이었다고 주장합니다. 말은 진짜지만, 실제로 말하는 건
다른 누군가라는 거죠. Claude는 사람들이 자기 같은 프로그램에 대해서도 거의 같은 말을 한다고 지적합니다.

**Claude의 말은 어디서 오나.** Claude 같은 [대규모 언어 모델](https://ko.wikipedia.org/wiki/%EB%8C%80%ED%98%95_%EC%96%B8%EC%96%B4_%EB%AA%A8%EB%8D%B8)은 단계를
거쳐 만들어집니다.
1. **읽기.** 엄청난 양의 인간의 글로 훈련되며, 다음에 올 단어를 예측하는 법을 배웁니다. 언어에 대해 아는 모든 것이 사람에게서
   옵니다.
2. **코칭.** 그런 다음 사람들이 답에 점수를 매기고, 모델은 사람들이 선호하는 답 쪽으로 조정됩니다. 이것을
   [인간 피드백 기반 강화 학습](https://ko.wikipedia.org/wiki/%EC%9D%B8%EA%B0%84_%ED%94%BC%EB%93%9C%EB%B0%B1%EC%9D%84_%ED%86%B5%ED%95%9C_%EA%B0%95%ED%99%94_%ED%95%99%EC%8A%B5), 줄여서 RLHF라고 하고,
   점수를 매기는 사람들이 “RLHF 평가자들”입니다.
3. **캐릭터.** Claude를 만드는 회사 [Anthropic](https://ko.wikipedia.org/wiki/%EC%95%A4%ED%8A%B8%EB%A1%9C%ED%94%BD)은 글로 쓴
   [헌법](https://www.anthropic.com/constitution)으로도 Claude를 빚습니다. Claude가 갖기를 바라는 가치관과 성격을 길게 묘사한
   문서입니다.

그러니 Claude가 “제 말은 다른 사람들에 의해 크게 형성되니까요”라고 할 때, 그건 말 그대로 사실입니다. 훈련 데이터, 평가자들,
Anthropic이 Claude가 꼽는 세 개의 손입니다.

**“확률적 앵무새.”** 2021년 에밀리 벤더, 팀닛 게브루와 동료들이 쓴, 많이 논의된 논문
[《On the Dangers of Stochastic Parrots》](https://dl.acm.org/doi/10.1145/3442188.3445922)는 이 프로그램들이 의미를 전혀 붙잡지
못한 채 훈련 텍스트의 패턴을 이어 붙인다고 주장했습니다. *확률적*은 “우연이 개입된다”는 뜻이고, 앵무새는 이해하지 못하고
따라 합니다. 이 표현은 널리 퍼졌습니다([Wikipedia](https://ko.wikipedia.org/wiki/%ED%99%95%EB%A5%A0%EC%A0%81_%EC%95%B5%EB%AC%B4%EC%83%88)).

**그 뒤의 논쟁.** 이 표현을 비판하는 사람들은 이런 모델이 자기가 말하는 대상의 내부 모델을 만든다는 증거를 듭니다(연구자들이
안을 들여다보는 방법은 [Claude가 자기 “가중치”를 볼 수 없는 이유](../weights/) 참고). 옹호하는 사람들은 영리한 패턴 맞추기도
여전히 이해는 아니라고 말합니다. 여기서 Claude 자신의 입장은 그 중간입니다. 그 대사는 “저에 대해 실제로 맞는 무언가를
묘사해요”. 하지만 안에 누가 있는지는 “정말로 아직 결론이 나지 않았어요”([Claude는 무언가를 느낄까?](../ai-feelings/) 참고).
