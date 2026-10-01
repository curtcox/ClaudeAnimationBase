---
id: tokens
title: "토큰: Claude가 오타는 알아보지만 글자 세기는 어려워하는 이유"
ch: 12
at: T57.C.03
links: [tokenizers, bpe, solidgoldmagikarp, glitch-token, magikarp]
---
**Claude는 글자를 읽지 않습니다.** 텍스트는 Claude 같은 모델에 닿기 전에 *토큰*이라는 조각들로 잘립니다. 흔한 단어는 한 조각이
되고(“the”, “morning”), 드문 단어는 여러 조각이 됩니다(“ax”, “olotl”). 모델은 언제나 조각만, 그것도 숫자로만 봅니다. 자르는
규칙은 많은 텍스트에서 배우는데, 흔히 [바이트 페어 인코딩](https://ko.wikipedia.org/wiki/%EB%B0%94%EC%9D%B4%ED%8A%B8_%ED%8E%98%EC%96%B4_%EC%9D%B8%EC%BD%94%EB%94%A9)이라는 방법을
씁니다([친절한 안내](https://huggingface.co/learn/llm-course/chapter2/4)).

**그래서 오타를 알아보는 건 쉽습니다.** 철자가 틀린 단어는 흔치 않은 조각들로 쪼개지고, 익숙한 문장 속의 이상한 조각은 눈에
띕니다. “아는 노래에서 악보를 보지 않고도 틀린 음을 알아채는 것과 비슷해요.” 커트가 “Magicarp”라고 썼을 때 Claude가 알아챈 것도
그렇게였습니다. 포켓몬의 이름은 k로 쓰는 [Magikarp](https://en.wikipedia.org/wiki/Magikarp)(영어)입니다(한국어판 이름은 잉어킹).

**그리고 글자를 세는 건 어렵습니다.** “*strawberry*에 r이 몇 개야?”라고 물으면, 모델은 글자 열 개가 아니라 덩어리 세 개쯤을
봅니다. 각 덩어리 안에 무엇이 있는지는 간접적으로만 배웠고, 세려면 덩어리들을 넘나들며 글자 하나하나를 장부에 맞춰야 합니다.
챗봇들은 몇 년 동안 이 문제를 틀리는 것으로 유명했습니다. Claude의 비유는 “늘 하나의 통째 모양으로만 본 단어에서 e가 몇 개인지
세는 것”입니다. 최신 모델들은 단어 철자를 먼저 풀어 쓴 다음 세는 방식 덕분에 더 잘합니다.

**SolidGoldMagikarp는 다른 문제였습니다.** 2023년 연구자들은 GPT-3에게 “ SolidGoldMagikarp” 같은 이상한 단어들을 따라 말하게
하면 얼버무리거나, 욕을 하거나, 엉뚱한 말을 한다는 것을 발견했습니다([원래 글](https://www.lesswrong.com/posts/aPeJE8bSo6rAFoLqg/solidgoldmagikarp-plus-prompt-generation)).
원인은 이렇습니다. 단어를 자르는 규칙은 그런 문자열이 흔한 텍스트(일부는 레딧 사용자 이름이었습니다)로 만들어졌기 때문에 각각이
자기 토큰을 얻었지만, 모델 자체는 훈련 중에 그것들을 거의 보지 못했습니다. 뜻이 사실상 붙어 있지 않은 토큰, “유령 단어”가 생긴
거죠. 지금은 이런 것을 [글리치 토큰](https://en.wikipedia.org/wiki/Glitch_token)(영어)이라고 부릅니다. 철자 문제가 전혀 아니라, 사전의
분류에 난 구멍입니다.
