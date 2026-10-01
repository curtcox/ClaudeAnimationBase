---
id: the-router
title: "라우터: 커트와 모델 사이에 있는 것"
ch: 10
at: T49.C.01
links: [constitutional-classifiers, usage-policy, system-prompts, fable-mythos-5-1, {title: "Anthropic's Transparency Hub", url: "https://www.anthropic.com/transparency"}]
---
**커트의 요점.** 해킹 사건에 대해 잘못된 질문을 하면 “사이버 보안 위험으로 태그가 붙어서 거부되거나 적어도 다운그레이드돼”.
그건 사실 Claude가 아니라고 커트는 말합니다. “아주 작은 의미에서는 너이긴 하지만. 더 정확히는 우리 사이에 있는 능동적인
라우터야.”

**실제로 거기 있는 것.** 앱에서 Claude를 쓸 때, 메시지는 모델 하나에 곧장 갔다가 돌아오지 않습니다. 모델 주위에는 다른, 더 작은
프로그램들이 있습니다. 그중 일부는 *분류기*입니다. 무기나 컴퓨터 침입을 돕는 요청처럼 특정 종류의 요청을 알아보도록 훈련된
프로그램이죠. Anthropic은 그중 한 종류인 [헌법 분류기](https://www.anthropic.com/research/constitutional-classifiers)에 대해 썼는데,
허용되는 것과 안 되는 것을 글로 적은 목록으로 훈련됩니다. 분류기가 작동하면 요청은 거부되거나, 조정되거나, 다른 모델이 답할 수
있습니다([Fable, Mythos, 그리고 정정의 정정](../fable-mythos/) 참고).

**Claude가 볼 수 있는 것과 없는 것.** Claude의 설명으로는, 분류기가 작동하면 Claude가 읽기 전에 사용자의 메시지에 태그가 달린
알림이 덧붙을 수 있습니다. 사이버 보안, 윤리, 저작권, 이미지, 아주 긴 대화 같은 것들이요. Claude는 태그는 보지만 분류기의 추론이나
점수는 보지 못합니다. 그리고 답한 뒤에 일어나는 일은 아무것도 보지 못합니다. 답이 차단되거나 플래그가 붙어도 끝내 모릅니다. 그래서
“커트 씨 쪽에서는 그게 전부 “Claude”로 보여요”. 하지만 Claude는 “전체를 묘사하는 구성 요소 하나”입니다.
[기억에 관한 교정](../the-correction/)과 같은 교훈입니다. 우리가 대화하는 상대는 시스템입니다.

**어떤 거부는 Claude 자신의 것입니다.** Claude는 “어느 계층이 잡든, 저는 사건을 작동하는 익스플로잇으로 바꾸는 걸 돕지 않을
거예요”라고 덧붙입니다. 무슨 일이 있었고 그게 왜 중요한지 설명하는 건 다른 문제이고, 그건 답하고 싶어 합니다. Anthropic의 제품을
무엇에 쓸 수 있는지에 관한 규칙은 공개돼 있고([이용 정책](https://www.anthropic.com/legal/aup)), 앱에서 Claude에게 주는 주요 지시도
마찬가지입니다([시스템 프롬프트](https://platform.claude.com/docs/en/release-notes/system-prompts/overview)).

**어느 사건?** Claude는 커트가 어느 Hugging Face 사건을 말하는지 확신하지 못합니다. 여러 번 있었으니까요. 다음 장이 그걸
정리합니다([7월](../hf-incident/) 참고).
