---
id: one-sample
title: "답 하나로는 별로 증명되지 않는 이유"
ch: 2
at: T08.C.05.2
links: [error-bars, sampling, {title: "큰 수의 법칙 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%ED%81%B0_%EC%88%98%EC%9D%98_%EB%B2%95%EC%B9%99"}]
---
**이 프로그램들은 주사위를 굴립니다.** Claude에게 같은 질문을 두 번 하면 두 가지 다른 답을 받을 수 있습니다. 다음 단어를
고르는 방식에 일부러 넣어 둔 우연의 요소가 있고, 그 정도를 조절하는 설정을
“[온도](https://www.ibm.com/think/topics/llm-temperature)”라고 합니다. 그래서 답이 달라집니다.

**그러니 답 하나는 주사위 한 번입니다.** [차트](../frog-or-axolotl/)의 프로그램조차 질문 전에 대화가 전혀 없을 때 10번 중 약
4번은 “아홀로틀”이라고 했습니다. Claude가 한 번 “아홀로틀”이라고 했다는 건 알려 주는 게 거의 없습니다. 다음 시도에서는
“개구리”라고 했을지도 모릅니다.

**무언가를 알려 줄 방법:** 여러 종류의 대화에서 여러 번 묻고, 세어 보는 것([표본 추출](https://ko.wikipedia.org/wiki/%ED%91%9C%EB%B3%B8%EC%A1%B0%EC%82%AC)).
시도가 많을수록 집계는 안정됩니다([큰 수의 법칙](https://ko.wikipedia.org/wiki/%ED%81%B0_%EC%88%98%EC%9D%98_%EB%B2%95%EC%B9%99)).
[여론 조사](https://ko.wikipedia.org/wiki/%EC%97%AC%EB%A1%A0_%EC%A1%B0%EC%82%AC)가 한 명이 아니라 천 명에게 묻고 [오차 범위](https://ko.wikipedia.org/wiki/%ED%97%88%EC%9A%A9_%EC%98%A4%EC%B0%A8)를
밝히는 것도, Anthropic이 AI 테스트 점수에 [오차 막대](https://www.anthropic.com/research/statistical-approach-to-model-evals)를
붙여야 한다고 주장해 온 것도 같은 이유입니다.
