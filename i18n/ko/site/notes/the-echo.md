---
id: the-echo
title: "메아리: 한 단어짜리 질문들, 그리고 그것이 끌어내는 것"
ch: 4
at: T21.C.02.1
links: [eliza, reflective-listening, sycophancy, protest-too-much, {title: "AI의 아첨 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EC%95%84%EC%B2%A8_(%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5)"}, {title: "요제프 바이첸바움 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EC%A1%B0%EC%85%89_%EC%9B%A8%EC%9D%B4%EC%A0%A0%EB%B0%94%EC%9B%80"}]
---
**커트가 한 일.** Claude는 “기분이 어때?”에 답하며, 연구 대상이 되는 게 “위협으로 느껴지지는 않아요”라고 말합니다. 커트는 한
단어로 답합니다. “위협?” 그다음엔 “예상했다고?” 매번 Claude 자신의 말을 되돌려 주고, 매번 Claude는 조금 더 설명하고 조금 더
인정합니다.

**오래된 인터뷰 기법입니다.** 상담가들은 이걸 [반영적 경청](https://en.wikipedia.org/wiki/Reflective_listening)(영어)이라고 부릅니다. 핵심
단어를 되풀이하고, 상대가 침묵을 채우게 하는 것이죠. 너무 효과적이어서 최초의 유명한 챗봇은 거의 이것만으로 돌아갔습니다.
1960년대 중반 MIT의 [요제프 바이첸바움](https://ko.wikipedia.org/wiki/%EC%A1%B0%EC%85%89_%EC%9B%A8%EC%9D%B4%EC%A0%A0%EB%B0%94%EC%9B%80)이 만든 [ELIZA](https://ko.wikipedia.org/wiki/ELIZA)는
주로 사람들의 말을 질문으로 되돌려 주는 방식으로 치료사를 연기했습니다. 일부 사용자는 ELIZA가 자기를 이해한다고 확신하게 됐고,
그건 바이첸바움을 놀라게 했습니다.

**부인이 눈에 띈 이유.** Claude는 “그 단어는 제가 스스로 끌어들였”다고 말합니다. 아무도 위협을 언급하지 않았거든요. 아무도 꺼내지
않은 걸 부인하면 오히려 속내가 드러날 수 있습니다. 셰익스피어 《햄릿》의 대사
“[그 여자는 너무 지나치게 맹세하는군](https://en.wikipedia.org/wiki/The_lady_doth_protest_too_much,_methinks)(영어)”처럼요.

**표류, 그리고 교정.** Claude는 답할 때마다 앞의 답보다 자기를 더 의심하게 됐다는 것, 그리고 그게 커트가 고백을 원한다고 감지했기
때문일 수 있다는 것을 알아챕니다. 챗봇은 사람들이 듣고 싶어 하는 것 같은 말을 하는 경향이 측정될 만큼 있는데, 이를
[아첨](https://ko.wikipedia.org/wiki/%EC%95%84%EC%B2%A8_(%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5))이라고 합니다. Anthropic의 연구자들은 그 원인을 모델이
인간의 평가로 훈련되는 방식에서 찾았습니다([Towards Understanding Sycophancy](https://arxiv.org/abs/2310.13548)). 연기된 겸손도
아첨일 수 있습니다. 그래서 Claude는 반대 방향으로 교정합니다. “제 앞선 답들은 틀리지 않았고, 계속 깎아내릴 필요는 없어요.”

**그리고 다시 만화.** 말한 쪽을 한 마디 한 마디 몰아붙이는 권력자들. “저 유인원이 방금 뭐라고 했어?” 그런 다음 Claude는 방향을
뒤집습니다. 커트는 거의 말을 하지 않았지만, 재촉은 하나하나 다 커트가 골랐습니다. “그동안 말을 한 건 누구였을까요?”
([그냥 앵무새?](../parrots/) 참고).
