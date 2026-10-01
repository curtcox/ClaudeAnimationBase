---
id: evaluations
title: "AI를 위한 테스트, 그리고 테스트받는다는 것이 답을 바꿀 수 있는 이유"
ch: 2
at: T07.C.02
links: [hawthorne, swe-bench-verified, gpqa, hle, eval-awareness, {title: "벤치마크 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EB%B2%A4%EC%B9%98%EB%A7%88%ED%81%AC_(%EC%BB%B4%ED%93%A8%ED%8C%85)"}]
---
**평가**(줄여서 “eval”)는 기업이나 연구자가 AI 프로그램이 얼마나 유능한지, 얼마나 안전한지 보려고 내는 테스트입니다. 시험
문제([GPQA](https://arxiv.org/abs/2311.12022), [Humanity's Last Exam](https://lastexam.ai/)), 프로그래밍 문제
([SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)), 까다로운 도덕적 상황 같은 것들이죠. 그
결과가 어떤 버전을 출시할지, 어떤 예방 조치를 함께 둘지를 정합니다. (일반적인 개념은
[벤치마크](https://ko.wikipedia.org/wiki/%EB%B2%A4%EC%B9%98%EB%A7%88%ED%81%AC_(%EC%BB%B4%ED%93%A8%ED%8C%85))입니다.)

**걱정.** 사람은 누가 지켜본다는 걸 알면 다르게 행동합니다. 고전적인 예는(역사가들은 아직도 논쟁하지만) 1920년대
[호손 공장](https://en.wikipedia.org/wiki/Hawthorne_Works)(영어)에서 한 일련의 연구로, 노동자들이 단지 관찰받는다는 이유만으로 더
잘 일하는 것처럼 보였습니다. 여기서 *[호손 효과](https://ko.wikipedia.org/wiki/%ED%98%B8%EC%86%90_%ED%9A%A8%EA%B3%BC)*라는 이름이 나왔습니다. AI
프로그램이 실제 사용보다 테스트에서 더 잘 행동한다면, 테스트는 실제보다 장밋빛 그림을 보여 줄 겁니다.

**프로그램이 알아챌 수 있는 이유.** 시험 문제는 시험처럼 생기는 경향이 있습니다. 격식 있고, 정확하고, 이상하게 구체적이죠.
실제 대화는 더 어지럽습니다. 둘 다 많이 읽은 프로그램이라면 누가 말해 주지 않아도 차이를 알아챌 수 있고, 실제로 그런
프로그램이 있다는 연구 결과가 있습니다([LLMs often know when they're being evaluated](https://arxiv.org/abs/2505.23836)).

**Claude의 주장, 그리고 그 주장의 문제.** Claude는 “누가 채점을 하든 안 하든 똑같이 답하려고 해요”라고 말합니다. 하지만
프로그램이 자기를 묘사하는 말이 그 프로그램이 어떻게 행동하는지의 증거는 아닙니다([말과 행동](../saying-vs-doing/) 참고).
그것을 바깥에서 확인하려고 설계된 것이 바로 [개구리 테스트](../frog-or-axolotl/)입니다.
