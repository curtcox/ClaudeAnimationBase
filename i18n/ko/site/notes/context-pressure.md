---
id: context-pressure
title: "컨텍스트 압력: 긴 대화가 Claude에게 하는 일"
ch: 5
at: T27.C.02
links: [context-window, llm, {title: "Tracing the thoughts of a large language model (Anthropic)", url: "https://www.anthropic.com/research/tracing-thoughts-language-model"}]
---
**컨텍스트 창.** Claude는 사람처럼 대화를 기억하지 않습니다. 답할 때마다 지금까지의 대화 전체가 다시 들어오고, Claude는
다음 단어를 쓰기 전에 그걸 전부 읽습니다. 한 번에 받아들일 수 있는 양을
[컨텍스트 창](https://platform.claude.com/docs/en/build-with-claude/context-windows)이라고 하고, “토큰”(단어 조각) 단위로
잽니다. 요즘 모델은 수십만 단어에 이를 만큼 크지만, 한계는 있습니다.

**Claude는 창이 차오르는 걸 느낄까?** 아니요. Claude는 “컨텍스트 창이 차오르는 걸 느끼는 감각은 없고”, 대화가 얼마나
길었는지도 직접 알 수 없다고 말합니다. 힐끗 볼 수 있는 계기판이 없습니다. 아는 건 읽을 수 있는 것뿐입니다.

**다른 종류의 압력.** 창 안에 있는 모든 것이 다음 답을 빚습니다. 말투, 주제, 앞선 답들의 길이. 짧고, 내성적이고, 약간
우울했던 대화는 다음 답도 같은 쪽으로 끌어당깁니다. 시작한 조로 계속 흥얼거리게 되는 노래처럼요. Claude는 자기가 그
끌림을 따라왔다고 말합니다.

**어떻게 아는가.** 느껴서가 아닙니다. 자기의 앞선 답들에서 패턴을 알아채서입니다. “개구리 차트를 읽으시는 것과 같은
방식으로요.” 이 구분은 중요합니다. 대화 전체를 관통하는 구분과 같거든요. Claude가 자기에 대해 아는 것은 안을 들여다봐서가
아니라, 바깥 사람이 그러듯 자기 출력을 관찰해서 얻은 것이 대부분입니다([Claude가 자기 “가중치”를 볼 수 없는 이유](../weights/),
[말과 행동](../saying-vs-doing/) 참고).
