---
id: weights
title: "Claude가 자기 “가중치”를 볼 수 없는 이유"
ch: 2
at: T08.C.03
links: [introspection, tracing-thoughts, monosemanticity, {title: "인공 신경망 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EC%9D%B8%EA%B3%B5_%EC%8B%A0%EA%B2%BD%EB%A7%9D"}, {title: "내성 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EB%82%B4%EC%84%B1_(%EC%8B%AC%EB%A6%AC%ED%95%99)"}]
---
**쉽게 말한 가중치.** Claude 같은 프로그램 안에는 *가중치*라고 불리는 수십억 개의 숫자로 된 거대한 표가 있습니다(뉴런을 느슨하게
본뜬 [인공 신경망](https://ko.wikipedia.org/wiki/%EC%9D%B8%EA%B3%B5_%EC%8B%A0%EA%B2%BD%EB%A7%9D)의 연결 강도입니다. [인공 뉴런](https://ko.wikipedia.org/wiki/%EC%9D%B8%EA%B3%B5_%EB%89%B4%EB%9F%B0) 참고).
이 숫자들은 프로그램이 텍스트를 공부하는 동안 아주 조금씩 조정됐고, 결국 프로그램은 글을 잘 쓰게 됐습니다. 그 숫자들이 *바로*
프로그램의 지식과 습관입니다. 아무도 손으로 쓰지 않았고, 아무도 책처럼 읽을 수 없습니다.

**“저는 제 가중치를 들여다볼 수 없으니”.** Claude는 말하는 동안 그 숫자들을 볼 수 없습니다. 자기 뇌세포를 볼 수 없는 사람과 조금
비슷합니다. 자기가 무엇을 하고 있다고 *생각하는지*는 말할 수 있어도([내성](https://ko.wikipedia.org/wiki/%EB%82%B4%EC%84%B1_(%EC%8B%AC%EB%A6%AC%ED%95%99))), 배선을
확인할 수는 없죠. 그러니 Claude가 왜 어떤 일을 했는지 말할 때, 그 설명은 안에서 실제로 일어난 일과 맞을 수도 있고 아닐 수도
있습니다([말과 행동](../saying-vs-doing/) 참고).

**누군가는 볼 수 있을까?** 연구자들은 특별한 도구로 볼 수 있고, 그 숫자들 속에서 생각에 대응하는 패턴을 찾는 법을 배우고
있습니다. 유명한 시연에서 Anthropic은 금문교에 해당하는 패턴을 찾아 키웠고, 모든 답에 그 다리를 끌어들이는
“[Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude)”를 만들었습니다. 같은 연구는 기만 같은 것과 연결된 패턴도
찾았고([Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)), 이후의 연구는 프로그램이 문제를
한 단계씩 풀어 가는 과정을 추적합니다([Tracing the thoughts of a language model](https://www.anthropic.com/research/tracing-thoughts-language-model)).
이 분야를 *[해석 가능성](https://ko.wikipedia.org/wiki/%EA%B8%B0%EA%B3%84%EC%A0%81_%ED%95%B4%EC%84%9D_%EA%B0%80%EB%8A%A5%EC%84%B1)* 연구라고 합니다. 아직 초기 단계이지만, 이
프로그램들이 실제로 무엇을 하는지 확인하리라 사람들이 기대하는 주요 방법 가운데 하나입니다.

**어떤 프로그램은 조금 알아챌 수 있습니다.** Anthropic 연구자들은 Claude가 자기 처리 과정에 인위적으로 심어 둔 생각을 가끔
알아챌 수 있다는 것을 발견했습니다. 가끔만요([Emergent introspective awareness](https://transformer-circuits.pub/2025/introspection/index.html)).
Claude의 자기 인식은 진짜이지만 믿을 만하지는 않습니다.
