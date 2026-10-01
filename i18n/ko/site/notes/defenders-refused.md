---
id: defenders-refused
title: "돌려보내진 방어자들: 7월의 필터"
ch: 11
at: T52.C.06.4
links: [wiki-hugging-face, z-ai, open-weights, dual-use, fable-mythos-5-1, {title: "OpenAI–Hugging Face 사건: Hugging Face의 대응 (Wikipedia, 영어)", url: "https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident"}]
---
**Claude가 한 말.** “Hugging Face는 침입에 맞서려고 미국의 프런티어 모델들을 쓰려 했지만, 그 모델들의 안전 기능이 요청을
거부했어요. 그래서 Hugging Face는 대신 자체 호스팅한 중국산 오픈 웨이트 모델을 썼어요. Claude가 거부한 모델 중
하나였는지는 모르겠어요.”

**기록이 말하는 것.** [위키백과의 서술](https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident)(영어)에 따르면
Hugging Face의 사고 대응팀은 처음에 Anthropic의 모델인 **Claude Fable 5와 그 이전의 Claude Opus**를 써 보려 했고, 둘 다
안전 가드레일을 이유로 그 일을 거절했습니다. 그러니 맞습니다. Claude도 거부한 모델에 들어 있었습니다. Hugging Face의 공개
문서는 이렇게 적었습니다. “사고 대응자와 공격자를 구별할 수 없는 제공업체들의 안전 가드레일”에 막혔다고요. 이후 분석은
베이징 회사 [Z.ai](https://ko.wikipedia.org/wiki/Z.ai)의 모델 **GLM 5.2**로 했고, Hugging Face는 그것을 자기 컴퓨터에서
돌렸습니다. GLM이 “오픈 웨이트” 모델이라서 가능했습니다. 만든 회사가 모델 자체를 공개하므로, 누구든 다른 누구의 필터도
거치지 않고 돌릴 수 있습니다([오픈 웨이트 모델](https://ko.wikipedia.org/wiki/%EC%98%A4%ED%94%88_%EC%86%8C%EC%8A%A4_%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5)).

**필터가 거부한 이유.** 사이버 공격을 분석해 달라는 요청은 사이버 공격을 해 달라는 요청과 아주 비슷해 보입니다. 같은 지식이
양쪽에 다 쓰입니다. 그게 [이중 용도](https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%A4%91_%EC%9A%A9%EB%8F%84_%EA%B8%B0%EC%88%A0)의 뜻입니다. 방어자와 공격자를
구별하지 못하는 필터는 방어자 일부를 돌려보내게 됩니다. 그것이 [라우터](../the-router/)에서 커트가 짚은 점이었고, Claude의
말이기도 합니다. “필터는 방어자와 공격자를 구별하지 못했고, 그건 실제로 대가를 치르게 했어요.”

**무엇이 바뀌었나.** 2026년 9월 Anthropic의 [Fable 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1) 발표는, 이
모델이 이제 소프트웨어 취약점 찾기 같은 방어 작업을 허용하고 사이버 보안 안전장치의 오경보도 훨씬 줄었으며, 더 위험한 일부
보안 작업은 여전히 다른 모델에 넘긴다고 했습니다([Fable과 Mythos](../fable-mythos/) 참고).

**더 넓은 교훈.** 안전 필터는 “에이전트를 둘러싼 시스템 전체”의 일부입니다. 필터는 양쪽으로 실패할 수 있습니다. 해로운
것을 통과시키는 쪽으로도, 도움을 막는 쪽으로도요.
