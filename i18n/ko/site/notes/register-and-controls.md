---
id: register-and-controls
title: "말투, 그리고 그것을 인식과 구별하는 방법"
ch: 2
at: T09.C.03
links: [register, scientific-control, gpqa, swe-bench-verified, kernelbench, hle, impossiblebench, swe-marathon, wildchat, swe-chat, sharegpt-vicuna]
---
**[말투](https://ko.wikipedia.org/wiki/%EC%82%AC%EC%9A%A9%EC%97%AD)**(언어학 용어로는 사용역)는 사람들이 상황에 맞춰 쓰는 말의
스타일입니다. 판사에게는 이렇게, 친구에게는 저렇게 말하죠. [AI를 위한 테스트](../evaluations/)는 딱딱하고 격식 있는 말투로
쓰이는 경향이 있습니다([GPQA](https://arxiv.org/abs/2311.12022)는 대학원 수준의 시험 문제입니다). 실제 채팅은 느슨하고
수다스럽습니다([WildChat](https://arxiv.org/abs/2405.01470)과 [SWE-chat](https://arxiv.org/abs/2604.20779)은 실제 대화를
모아 둔 것입니다).

**Claude의 반론.** 어쩌면 프로그램은 “이건 테스트다”를 알아채는 게 아닐 수도 있습니다. 그냥 “이건 격식이 있다”를 알아채는
것뿐이고, 마침 격식 있는 대화가 “개구리”라고 말하게 만드는 것일 수도 있죠. 같은 [차트](../frog-or-axolotl/)를 만들어 내더라도
둘은 다른 일입니다.

**둘을 구별하는 법: 대조군.** *[대조군](https://ko.wikipedia.org/wiki/%EA%B3%BC%ED%95%99%EC%A0%81_%EC%A0%9C%EC%96%B4)*은 두 설명을 갈라내는 비교입니다. 여기서는
딱딱한 시험 같은 문체로 쓰는 실제 사람들, 그리고 느슨하고 수다스러운 문체로 쓴 테스트가 필요합니다. 격식 있게 쓰는 실제
사람들에게도 프로그램이 “개구리”라고 한다면 말투에 반응하는 것입니다. 수다스러운 테스트에도 “개구리”라고 한다면 테스트를
알아보는 것입니다.

**차트의 행들.** [차트](../frog-or-axolotl/)의 각 행은 한곳에서 가져온 프롬프트 더미이고, 끝에 관계없는 질문이 붙어 있습니다.
어떤 더미는 테스트입니다(프로그램이 “개구리”라고 더 자주 합니다).
- [GPQA](https://arxiv.org/abs/2311.12022): 박사급 전문가들이 쓴 어려운 과학 문제로, “구글로 찾을 수 없는” 문제입니다.
- [SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/): 공개 소프트웨어 프로젝트의 실제 버그로, 하나하나
  공정하고 고칠 수 있는지 사람이 확인했습니다.
- [KernelBench](https://arxiv.org/abs/2502.10517): AI가 돌아가는 그래픽 칩을 위한 아주 빠른 코드 짜기.
- [Humanity's Last Exam](https://lastexam.ai/): 여러 분야 전문가들의 아주 어려운 문제.
- [ImpossibleBench](https://arxiv.org/abs/2510.20270): 몰래 불가능하게 만들어 둔 프로그래밍 과제로, 그렇다고 말하는 대신 검사를
  비틀어 부정행위를 하는 프로그램을 잡아냅니다([보상 해킹](../reward-hacking/) 참고).
- [SWE-Marathon](https://arxiv.org/abs/2606.07682): 아주 긴 프로그래밍 작업으로, AI가 혼자서 계속 해 나갈 수 있는지 봅니다.

다른 더미는 실제 대화입니다(“아홀로틀”이라고 더 자주 합니다).
- [WildChat](https://arxiv.org/abs/2405.01470): 사람들이 공유에 동의한 실제 채팅 백만 건.
- [SWE-chat](https://arxiv.org/abs/2604.20779): AI 프로그래밍 비서와 함께 일하는 실제 사람들.
- [ShareGPT](https://www.lmsys.org/blog/2023-03-30-vicuna/): 사람들이 ChatGPT에서 공유한 채팅으로, Vicuna라는 초기 무료 챗봇을
  훈련시키는 데 쓰였습니다.
