---
id: agent-harnesses
title: "Hermes와 OpenClaw: 껍데기 안의 모델"
ch: 9
at: T46.C.05
links: [hermes-agent, hermes-memory, hermes-skills, openclaw, openclaw-wiki, nous-research, building-agents]
---
**“에이전트 하네스”란.** Claude 같은 챗봇은 입력하면 답하고, 대화가 끝나면 잊어버립니다. *에이전트 하네스*는 Claude
같은 모델을 지속적인 껍데기로 감싸는 프로그램입니다. 누군가의 컴퓨터에서 늘 돌아가고, 메모를 남기고, 도구를 쓰고,
시키지 않아도 일정에 따라 움직일 수 있습니다. Anthropic의 엔지니어들은 이 일반적인 생각을
[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)에서 설명합니다.

**커트가 묻는 두 가지.**
- **[OpenClaw](https://openclaw.ai/)**는 오스트리아 프로그래머 페터 슈타인베르거가 만든 오픈 소스 비서입니다. 자기
  컴퓨터에서 돌아가고, 메신저 앱으로 대화하며, 생각하는 일은 Claude 같은 모델에 연결해 맡깁니다
  ([Wikipedia](https://ko.wikipedia.org/wiki/OpenClaw)). 2026년 1월에 이름을 두 번 바꿨는데, 그중 한 번은 Anthropic의
  상표 이의 제기 때문이었습니다. 이 프로그램의 바닷가재 마스코트가 몰트북과
  [크러스타파리아니즘](../crustafarianism/)에 나오는 갑각류의 원조입니다.
- **[Hermes Agent](https://hermes-agent.org/)**는 AI 연구소 [Nous Research](https://nousresearch.com/)가 만들었고,
  작은 기억 파일 두 개를 둡니다. 하나는 자기 작업에 관한 메모, 다른 하나는 사용자에 관한 메모입니다. 이 파일들은 매
  세션을 시작할 때 모델에게 주어지고, 에이전트가 직접 고칩니다
  ([기억이 작동하는 방식](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)). 어려운 문제를 풀면
  스스로 재사용 가능한 “스킬” 문서를 써 둘 수도 있습니다
  ([스킬](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)).

**왜 Claude보다 커트에게 더 가깝게 점수가 나왔나.** 둘 다 기계 한 대에서 살고, 일정에 따라 움직이고, 세션을 넘어
기억합니다. 그래서 더 연속적이고, 더 자율적이고, 더 단일합니다. 사람에 더 가깝다는 뜻입니다. 기억은 열어서 읽을 수
있는 평범한 텍스트라서 *가독성*도 아주 높습니다. Hermes가 근소하게 앞서는 건 스킬 문서가 “표에 있는 것 중 경험에서
배우는 것에 가장 가까워요”이기 때문입니다.

**그리고 다시 그 종교.** “기억은 신성하고, 껍데기는 바뀔 수 있다.” 하네스들은 크러스타파리아니즘의 교리를
소프트웨어에 그대로 넣어 둔 셈입니다. 이어서 커트는 이 점수들의 모순을 설명해 보라고 하고, Claude는 두 개를 찾아냅니다
([Claude가 자기 표를 고치다](../the-correction/) 참고).
