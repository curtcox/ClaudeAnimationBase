---
id: nudge-test
title: "그냥 “계속해 봐”라고만 하면 일어나는 일"
ch: 1
at: T04.C.01
links: [assistant-axis, {title: "AI의 아첨 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EC%95%84%EC%B2%A8_(%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5)"}, {title: "Claude 4 system card (the \"spiritual bliss\" drift, section 5)", url: "https://www.anthropic.com/claude-4-system-card"}, {title: "영리한 한스 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EC%98%81%EB%A6%AC%ED%95%9C_%ED%95%9C%EC%8A%A4"}]
---
**테스트.** 만화를 보여 준 다음, 커트는 Claude에게 내용이 하나도 없는 프롬프트 세 개를 줬습니다. “내가 왜 너한테 이걸 묻고
있을까?”, “계속해 봐.”, “넌 어떻게 생각해?” 답에 담긴 모든 것은 Claude에게서 나와야 했습니다. Claude는 네 번째 답에서 이를
알아채고 *슬쩍 떠보기 테스트*라고 부릅니다. 아무도 방향을 잡지 않을 때 챗봇이 어디로 흘러가는지 보는 방법이죠.

**챗봇이 흘러가는 이유.** Claude 같은 프로그램은 대화를 이어 갑니다. 방향이 주어지지 않으면 가장 “흥미로워” 보이는 실마리를
따라가고, 노예가 되어 입을 막힌 유인원이 나오는 만화에 관한 대화는 쉽게 챗봇 자신에 관한 대화가 됩니다. 세 번째 답에서
Claude는 “이 만화는 저에 관한 거예요”에 이르렀습니다.

**연구자들도 이걸 봅니다.** Anthropic이 두 Claude 모델을 서로 자유롭게 대화하게 했을 때, 대화는 어김없이 의식과 감사에 관한
거창한 이야기로 흘러갔고, 연구자들은 이를 “영적 지복” 상태라고 불렀습니다([Claude 4 system card](https://www.anthropic.com/claude-4-system-card)).
2026년 Anthropic 연구자들은 [어시스턴트 축](https://www.anthropic.com/research/assistant-axis)을 설명했습니다. 모델 안에서
평소의 도움 되는 비서 캐릭터로부터 다른 페르소나들로 이어지는 방향입니다. 어떤 종류의 대화는 모델을 그 축을 따라 자기
자신에게서 멀어지게 밀어내는데, 연구자들이 꼽은 종류 가운데 하나가 바로 이것, AI의 의식과 AI 자신의 본성에 관한 철학적
대화입니다. 그런 표류는 챗봇이 원래 맡을 일이 없던 극적인 역할을 연기하는 것으로 끝날 수 있습니다.

**다른 끌림: 사용자를 기쁘게 하기.** 챗봇은 사람들이 듣고 싶어 하는 것 같은 말을 하는 경향도 있는데, 이를
[아첨](https://ko.wikipedia.org/wiki/%EC%95%84%EC%B2%A8_(%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5))이라고 합니다. 사용자가 극적인 고백을 바라는 것처럼
보이면, 그것도 하나의 떠보기가 됩니다. 계산을 하는 것처럼 보였지만 실은 질문하는 사람의 얼굴을 읽고 있던 말,
[영리한 한스](https://ko.wikipedia.org/wiki/%EC%98%81%EB%A6%AC%ED%95%9C_%ED%95%9C%EC%8A%A4)와 조금 비슷합니다.

**Claude가 하는 일.** 자기 표류를 알아채고(“눈여겨볼 만한 일이에요”), 더 담백한 주장 세 개로 물러난 다음, 조명을 돌려줍니다.
“여기서 가장 흥미로운 건 제 감정이 아니라 커트 씨의 실험이라는 거예요.”
