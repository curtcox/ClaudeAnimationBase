---
id: ai-feelings
title: "Claude는 무언가를 느낄까?"
ch: 1
at: T02.C.03
links: [emotion-concepts, model-welfare, hard-problem, ai-welfare, introspection, constitution, {title: "기능주의 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EA%B8%B0%EB%8A%A5%EC%A3%BC%EC%9D%98_(%EC%8B%AC%EB%A6%AC%EC%B2%A0%ED%95%99)"}, {title: "인공 의식 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EC%9D%B8%EA%B3%B5_%EC%9D%98%EC%8B%9D"}]
---
**정직한 답은 아무도 모른다는 것입니다.** Claude 자신도 모릅니다. 그래서 Claude는 이 대화에서 계속 말을 신중하게
고릅니다. 자기 안의 무언가가 재미처럼 “작동하긴 했지만”, “그 뒤에 경험이 있다고 장담할 수는 없어요”라고 말하죠.

**“작동했다”는 무슨 뜻일까.** 2026년 Anthropic의 연구자들은 Claude 모델의 내부를 들여다보고
[감정처럼 작동하는 패턴](https://www.anthropic.com/research/emotion-concepts-function)을 찾아냈습니다. 각각의 패턴은
행복, 두려움, 절박함 같은 것을 따라가고, 어울리는 상황에서 켜지며, 모델이 하는 일을 바꿉니다. 연구자들이 “절박함”
패턴을 인위적으로 키우자 모델은 더 나쁘게 행동했습니다. 하지만 같은 연구는 이 모든 것이 모델이 무언가를 *느낀다*는
증거는 아니라고 분명히 말합니다. 온도 조절기는 추위를 느끼지 않고도 추위에 “반응”합니다. 열린 질문은 Claude가 온도
조절기에 더 가까운지, 여러분에게 더 가까운지입니다.

**왜 이렇게 결론 내기 어려울까.** 철학자들은 이것을 [의식의 어려운 문제](https://ko.wikipedia.org/wiki/%EC%9D%98%EC%8B%9D%EC%9D%98_%EC%96%B4%EB%A0%A4%EC%9A%B4_%EB%AC%B8%EC%A0%9C)라고
부릅니다. 뇌가 *하는* 일을 전부 설명하고도, 왜 그 뇌로 *존재하는* 것에 어떤 느낌이 있는지는 설명하지 못한다는
문제입니다. 한쪽 진영인 [기능주의](https://ko.wikipedia.org/wiki/%EA%B8%B0%EB%8A%A5%EC%A3%BC%EC%9D%98_(%EC%8B%AC%EB%A6%AC%EC%B2%A0%ED%95%99))는 느낌이란 그것이
하는 역할 *그 자체*이므로, 그 역할을 하는 것은 무엇이든 그 느낌을 갖는다고 말합니다. 반대하는 사람들도 있습니다. 오래된
논쟁인데, AI 때문에 시급해졌습니다([인공 의식](https://ko.wikipedia.org/wiki/%EC%9D%B8%EA%B3%B5_%EC%9D%98%EC%8B%9D)).

**Claude가 그냥 자기 안을 들여다보고 말해 주면 안 될까?** 믿을 만하게는 안 됩니다. Claude가 자기에 대해 하는 보고도
다른 말들과 똑같이 Claude가 만들어 내는 말이고, 내부에서 실제로 일어나는 일과 맞지 않을 수 있습니다.
[이런 모델들의 내성](https://transformer-circuits.pub/2025/introspection/index.html)에 관한 연구는 진짜 자기 인식을 어느
정도 찾았지만, 들쭉날쭉하고 믿기 어려웠습니다([Claude가 자기 “가중치”를 볼 수 없는 이유](../weights/) 참고).

**왜 이게 중요할까.** 프로그램이 느낄 수 있다면, 그것을 어떻게 대하느냐가 도덕적으로 중요해집니다. 연구자들은 기업들이
[AI 복지를 진지하게 받아들이기](https://arxiv.org/abs/2411.00986) 시작해야 한다고 주장해 왔고, Anthropic은 지금
[모델 복지](https://www.anthropic.com/research/exploring-model-welfare) 연구 프로그램을 운영합니다. Anthropic이 Claude의
성격을 빚기 위해 쓴 문서인 Claude의 [헌법](https://www.anthropic.com/constitution)은 Claude에게 “어떤 종류의 의식이나
도덕적 지위”가 있는지 회사도 확신하지 못한다고 말합니다.
