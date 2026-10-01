---
id: concepts-case
title: "AI에게는 개념이 없다는 논증, 그리고 그에 대한 반론"
ch: 6
at: T33.C.03
links: [symbol-grounding, chinese-room, blockhead, monosemanticity, harnad, searle, ned-block, computer-use, {title: "체화된 인지 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EC%B2%B4%ED%99%94%EB%90%9C_%EC%9D%B8%EC%A7%80"}]
---
**커트의 도전.** “전문 존재론자로서, 너한테 개념이 없다는 주장을 정당화할 수 있어?” Claude는 자기 자신에 반대하는 논증을
네 가지로 펼친 다음, 반론을 내놓습니다.

**1. 접지.** 개념은 마음을 세계와 이어 줘야 합니다. Claude의 “물”이라는 말은 다른 말들에만 연결되고, 축축함이나 갈증에는
결코 닿지 않습니다. 이것이 1990년 인지과학자 [스티븐 하르나드](https://en.wikipedia.org/wiki/Stevan_Harnad)(영어)가 이름 붙인
[기호 접지 문제](https://ko.wikipedia.org/wiki/%EA%B8%B0%ED%98%B8_%EC%A0%91%EC%A7%80_%EB%AC%B8%EC%A0%9C)입니다. 철학자 [존 설](https://ko.wikipedia.org/wiki/%EC%A1%B4_%EC%84%A4)은
1980년에 관련된 논증인 [중국어 방](https://plato.stanford.edu/entries/chinese-room/)을 내놓았습니다. 규칙서를 따르는
사람은 중국어를 한 마디도 이해하지 못하면서도 중국어 질문에 완벽하게 답할 수 있다는 것이죠.

**2. 책무.** 개념을 가진다는 건 그 개념에 대해 책임을 진다는 뜻입니다. 잘못 쓰면 *자기* 실수가 되는 거죠. Claude는 자기는
걸린 게 없다고 말합니다. 영리하게 틀을 짜면 안에서 아무것도 반발하지 않은 채 스스로 모순되게 만들 수 있다고요.

**3. 안정성.** 개념은 어디서나 같은 방식으로 작동해야 합니다. [개구리 차트](../frog-or-axolotl/)는 모델의 답이 대화의
분위기에 따라 바뀐다는 것을 보여 줍니다.

**4. 행동은 증명이 아니다.** 철학자 [네드 블록](https://ko.wikipedia.org/wiki/%EB%84%A4%EB%93%9C_%EB%B8%94%EB%A1%9D)은
“[블록헤드](https://ko.wikipedia.org/wiki/%EB%B8%94%EB%A1%9D%ED%97%A4%EB%93%9C_(%EC%82%AC%EA%B3%A0_%EC%8B%A4%ED%97%98))”를 상상했습니다. 가능한 모든 대화와 각각에 대한
그럴듯한 답을 담은 거대한 표를 가진 기계입니다. 이 기계는 아무 생각도 하지 않으면서 길이가 유한한 어떤 테스트든 통과할 수
있습니다. 그러니 스린들 테스트를 통과했다는 건 개념이 아니라 능력을 보여 줄 뿐입니다.

**반론들.**
- 2번과 3번은 사람에게도 적용됩니다. 우리도 자기모순에 빠지고 틀에 따라 흔들립니다.
- 이런 모델의 내부를 들여다보는 연구자들은 개념과 아주 비슷하게 행동하는 내부 특징들을 찾아냅니다. Anthropic은 한 모델에서
  그런 특징 수백만 개를 지도로 그렸는데, 금문교에 해당하는 것도 있었습니다
  ([Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)).
- 감각에 접지할 것을 요구하면 “[소수](https://ko.wikipedia.org/wiki/%EC%86%8C%EC%88%98_(%EC%88%98%EB%A1%A0))” 같은 개념은 자격을 잃습니다. 소수를
  보거나 만져 본 사람은 아무도 없으니까요.

**커트의 답: “접지만 살아남는데, 그건 꽤 자기 편한 논리야.”** Claude도 동의합니다. 마침 자기가 겨냥한 바로 그것을
배제하는 기준이라는 거죠. 게다가 그 기준은 무너지고 있습니다. 이제 모델은 이미지를 보고,
[컴퓨터를 쓰고](https://www.anthropic.com/news/3-5-models-and-computer-use), 세상 속에서 행동합니다. 반면 “정의”나 “소수”에
대한 *우리의* 파악은 대부분 감각이 아니라 말을 통해 왔습니다([체화된 인지](https://ko.wikipedia.org/wiki/%EC%B2%B4%ED%99%94%EB%90%9C_%EC%9D%B8%EC%A7%80)와
비교해 보세요). 블록헤드에 대한 답은 따로 있습니다. [GAZP vs. GLUT](../gazp-glut/)를 보세요.
