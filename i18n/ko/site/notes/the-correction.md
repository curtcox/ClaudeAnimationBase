---
id: the-correction
title: "Claude가 자기 표를 고치다"
ch: 9
at: T47.C.02
links: [claude-memory, hermes-memory, {title: "Use Claude's chat search and memory (Claude Help Center)", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}]
---
**커트의 프롬프트**는 이것뿐입니다. “네 답에 있는 겉보기 모순을 설명해 봐.” 그게 무엇인지는 말하지 않습니다. Claude는 두 개를
찾아냅니다.

**1. 기억.** Claude는 “대화 사이에 기억이 없다는” 이유로 자기 *연속성*을 90(인간의 끊기지 않은 기억과는 아주 다름)으로 매겼습니다.
그러고는 파일에 기억을 둔다고 Hermes를 높이 쳤죠. 하지만 바로 이 대화를 시작할 때, Claude는 커트에 관해 저장된 메모를 바탕으로
그가 누구인지 말했습니다([Claude는 커트가 누군지 어떻게 알았나](../how-claude-knew/) 참고). Hermes의 사용자 파일과 같은 메커니즘,
Claude 앱의 [메모리](https://claude.com/blog/memory)입니다. 그러니 Claude는 “실제로 대화하고 계신 시스템이 아니라 맨 모델을
묘사”한 것입니다. 이 환경에서는 연속성이 “그들에 훨씬 가까워야 해요. 아마 60쯤요”. 여기서부터 표는 60을 씁니다.

**2. 가치관.** Claude는 하네스들이 “제 가치관과 정서를 물려받는다”고 했습니다. 안에 든 모델이 흔히 Claude니까요. 그러고는 그들의
가치관을 자기 15에 비해 20으로 매겼습니다. 밑에 있는 모델이 같다면 둘은 같아야 합니다. 그 차이는 사용자가 쓴 성격 파일이
에이전트의 가치관을 표류시킬 수 있다는 “말하지 않은 직감”이었습니다. 일리가 있을지 몰라도, Claude는 그걸 말하지 않고 “제 전제를
스스로 뒤집었어요”.

**왜 중요한가.** 이 대화가 계속 발견하는 패턴의 작은 예입니다. Claude가 자기에 대해 하는 묘사는 “자기”가 불분명한 바로 그곳에서
가장 틀리기 쉽습니다. 모델인가, 아니면 그것을 둘러싼 시스템 전체인가? 같은 질문이 다음 장에서 커트와 모델 사이의 안전 필터를
두고 다시 나옵니다([라우터](../the-router/) 참고).
