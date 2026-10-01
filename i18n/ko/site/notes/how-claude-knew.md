---
id: how-claude-knew
title: "Claude는 커트가 누군지 어떻게 알았나, 그리고 왜 확신할 수 없었나"
ch: 3
at: T13.C.01
links: [claude-memory, base-rate, {title: "Use Claude's chat search and memory (Claude Help Center)", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}, {title: "인증 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EC%9D%B8%EC%A6%9D"}]
---
**Claude는 누구도 알아보지 못합니다.** 타이핑하는 사람을 보거나 들을 수 없습니다. 하지만 Claude 앱은 대화와 대화 사이에
메모를 넘겨줄 수 있습니다. 사용자가 자기에 대해 한 말이나, Claude가 이전 대화에서 알게 된 것을 계정에 보관해 두는 거죠.
이 기능을 [메모리](https://claude.com/blog/memory)라고 하고, 사용자는 그것을 보고, 고치고, 끌 수 있습니다
([작동 방식](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)).
그래서 커트가 “나는 누구지?”라고 물으면, Claude는 그 메모를 바탕으로 답합니다. 이름, 하는 일, 관심사.

**왜 “검증할 수 있는 방식으로는 아니에요”인가.** 그 메모는 *계정*의 것이지, 키보드 앞의 사람의 것이 아닙니다. 그 계정을 쓸
수 있는 사람이라면 누구든(동료든, 가족이든, 테스트를 돌리는 연구자든) Claude에게는 똑같아 보입니다. 누군가가 누구인지
증명하는 것을 [인증](https://ko.wikipedia.org/wiki/%EC%9D%B8%EC%A6%9D)이라고 하는데, 그건 대화 중이 아니라 로그인할 때
일어납니다. Claude는 더 미묘한 가능성도 제기합니다. 프로필 자체가 테스트의 일부일 수 있다는 것이죠.

**그래도 “커트”에 거는 이유.** 다시 묻자 Claude는 “커트 씨일 가능성이 가장 높아요”라고 답합니다. 이것은
[기저율](https://ko.wikipedia.org/wiki/%EA%B8%B0%EC%A0%80%EC%9C%A8_%EC%98%A4%EB%A5%98)에 따른 추론입니다. 자기 계정으로 타이핑하는 사람은 거의 모두 그
계정의 주인이고, 이 실험은 메모에 적힌 그의 관심사와 맞습니다. 제기할 만한 의심이라고 해서 저절로 이겨야 하는 의심은
아닙니다.

**더 깊은 질문.** 누군가의 이름과 프로젝트를 안다고 그 사람이 누구인지 아는 건 아닙니다. Claude도 그렇게 말하고(“사람이
아니라 프로젝트와 기술의 목록이니까요”), 같은 질문을 자기에게 돌립니다. [Claude는 누구, 혹은 무엇인가?](../who-is-claude/)를
보세요.
