---
id: rsi
title: "RSI: 스스로를 개선하는 AI"
ch: 13
at: T63.C.04
links: [rsi-wiki, arxiv-aide2, arxiv-bounded, anthropic-rsi, mittr-rsi, datacamp-rsi, coxon-resigns]
---
**질문.** “연말까지 RSI?”는 올해가 끝나기 전에 *재귀적 자기 개선*을 보게 될지 묻는 말입니다. RSI는 AI 시스템이 스스로를
개선하고, 각 개선이 다음 개선을 더 잘하게 만드는 것입니다([Wikipedia](https://ko.wikipedia.org/wiki/%EC%9E%AC%EA%B7%80%EC%A0%81_%EC%9E%90%EA%B8%B0_%EA%B0%9C%EC%84%A0);
[쉬운 안내](https://www.datacamp.com/tutorial/recursive-self-improvement)). “foom” 뒤에 있는 생각입니다([foom](../foom/) 참고).

**Claude의 답: 어떤 RSI냐에 달려 있어요.**

**약한 RSI는 이미 와 있습니다.** 이 대화가 있던 주에 올라온 논문 [AIDE²](https://arxiv.org/abs/2609.26457)는 자기 코드를 다시
쓰는 AI 연구 에이전트를 설명합니다. 자기 자신에 대한 변경을 제안하고, 연구 과제로 시험해 보고, 도움이 되는 것을 남기며,
받아들여진 버전 하나하나가 다음에 편집되는 버전이 됩니다. 8일 동안 돌린 결과 새 과제에서도 통하는 개선 일곱 가지를
찾았습니다. 다시 쓰는 것은 모델 자체를 재훈련하는 게 아니라 에이전트 자신의 코드, 즉 모델을 둘러싼 소프트웨어입니다(Claude는
이것을 “하네스 층위”라고 부릅니다. [에이전트 하네스](../agent-harnesses/) 참고). Anthropic 자신의 보고서
[《When AI builds itself》](https://www.anthropic.com/institute/recursive-self-improvement)(2026)는 자사 AI 개발의 얼마나 많은 부분을
이미 Claude에게 맡기는지 설명합니다. 병합하는 코드의 80% 이상을 Claude가 씁니다. 그러면서도 루프는 아직 닫히지 않았고, 연구의
방향은 여전히 사람이 잡는다고 말합니다.

**강한 RSI는 열린 루프입니다.** 인간의 감독을 거의 받지 않으면서 사람보다 빠르게 능력을 개선하는 것이죠. Claude는 연말까지 그럴
확률을 약 5%로 봅니다. 논문 1,250편을 검토한 7월의 조사([From Bounded Self-Refinement to Autonomous Research Loops](https://arxiv.org/abs/2607.07663))는
이런 루프를 붙잡는 세 가지를 찾았습니다. 무엇이 더 나은지에 대한 믿을 만한 신호가 필요하고(*접지*), 자기 출력을 먹고 자라다
망가질 수 있으며(*붕괴*), 컴퓨팅 능력이 필요하다는 것(*컴퓨팅*)입니다.
[MIT Technology Review](https://www.technologyreview.com/2026/08/18/1142188/ai-recursive-self-improvement/)는 8월에 RSI가 “결국 그렇게
빨리 오지는 않을지도 모른다”고 보도했습니다.

**걱정되는 경우는 그 중간에 있습니다.** 약한 루프, 많은 복사본, 경쟁하는 연구소들. 2026년 9월 제이컵 콕슨이라는 연구자가
Anthropic을 떠나며, AI 기업들이 “스스로 개선하는 초지능을 향해 곧장 달려가며 우리의 목숨을 걸고 도박을 하고 있다”고 썼습니다
([TechCrunch](https://techcrunch.com/2026/09/09/gambling-with-our-lives-anthropic-researcher-quits-warns-against-self-improving-ai/)).

**그리고 밝혀 둘 것.** “저는 Anthropic의 모델이니, 제 5%는 그 점을 감안해서 들으세요.”
