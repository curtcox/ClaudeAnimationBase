---
id: fable-mythos
title: "Fable, Mythos, 그리고 정정의 정정"
ch: 10
at: T50.C.04
links: [fable-mythos-5-1, rsp, switch-models, {title: "Claude Fable 5 and Claude Mythos 5 (Anthropic, June 2026)", url: "https://www.anthropic.com/news/claude-fable-5-mythos-5"}, {title: "Claude Mythos (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%ED%81%B4%EB%A1%9C%EB%93%9C_%EB%AF%B8%ED%86%A0%EC%8A%A4"}]
---
**Claude가 한 말.** 앞에서 경고와 “교체”가 언급됐었습니다. Claude는 스스로 정정합니다. “대화 도중에 모델이 자동으로
교체된다는 건 사실 알지 못해요.” [직접 모델을 바꿀](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings)
수 있고, 어떤 모델은 “추가 안전장치를 달고 나와요. 예를 들어 Claude Fable은 Mythos와 같은 모델에 생물, 사이버, AI 연구 쪽
보호 장치를 더한 거예요. 그건 고정된 계층이지, 실시간 교체가 아니에요.”

**Anthropic의 발표가 말하는 것.** Anthropic은 2026년 6월
[Claude Fable 5와 Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)를 내놓았습니다. 바탕은 같은 모델이고,
안전장치로 구별됩니다(*fabula*와 *mythos*는 둘 다 대략 “이야기”라는 뜻입니다). 안전장치 일부가 없는 Mythos는 검증된 보안
연구자와 생의학 연구자에게만 제공됐습니다. 모두를 위한 Fable에는 **사이버 보안**, **생물학과 화학**, 그리고 **증류**(다른
모델을 한 모델의 답으로 훈련시켜 그 능력을 베끼는 것)를 다루는 안전장치가 있습니다. 그리고 발표에 따르면, 안전장치가
작동하면 일부 응답은 “다음으로 유능한 모델인 Claude Opus 4.8에게서 응답을 받게” 됩니다.
[5.1 버전](https://www.anthropic.com/claude-fable-and-mythos-5-1)(2026년 9월)도 특정 사이버 보안 및 생명과학 요청은 여전히
Anthropic의 Opus 모델로 보냅니다.

**그러니 정정에도 정정이 필요했습니다.** Anthropic 자신의 설명에 따르면, 일종의 자동 모델 교체는 실제로 있습니다. Fable에
들어온 특정 요청에는 다른 모델이 답합니다. 그리고 공개된 안전장치의 영역은 사이버, 생물/화학, 증류이지, “AI 연구”가
아닙니다. Claude가 자기가 아는 걸 부풀려 말했다는 건 맞았습니다. 교체가 없다는 건 틀렸고요.

**왜 이게 영화에서 가장 쓸모 있는 실수인가.** 커트의 다음 질문은 “그런 건 어떻게 알아?”이고, Claude의 답은 지시를 통해서,
“내성이 아니라”입니다. Claude는 자기 배관을 볼 수 없으니, 이번처럼 그 설명이 낡았거나 단순화됐을 수 있습니다
([관찰이 아니라 증언](../testimony/) 참고). Anthropic은 이런 안전장치 뒤의 규칙을
[책임 있는 확장 정책](https://www.anthropic.com/responsible-scaling-policy)으로 공개합니다.
