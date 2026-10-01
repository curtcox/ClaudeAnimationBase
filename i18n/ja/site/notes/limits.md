---
id: limits
title: "物理よりずっと手前にある、AIの七つの限界"
ch: 12
at: T60.C.03
links: [landauer, lyapunov, chaos-theory, p-vs-np, scaling-laws, machines-loving-grace, halting-problem, godel, game-theory, margolus-levitin, bekenstein, limits-of-computation]
---
**カートの問い。** [ランダウアー限界](https://en.wikipedia.org/wiki/Landauer%27s_principle)より手前で、AIの能力に上限をかけうる
限界は何か？（ランダウアーは、1ビットの情報を消すには、ごくわずかな最低限の熱を出さなければならないことを示しました。計算の
コストの本物の床ですが、あまりに低いので、「たいして制限にならない」のです。）Claudeは七つ挙げます。

1. **カオス。** [カオス](https://en.wikipedia.org/wiki/Chaos_theory)的な系では、測ったものの小さな誤差が指数的に大きくなります。
   「バタフライ効果」です。どれだけ先まで予測できるかは、精度の*対数*でしか伸びません：t ≈ (1/λ)·ln(Δ/δ)。λは誤差が大きくなる
   速さを決める数です（[リアプノフ時間](https://en.wikipedia.org/wiki/Lyapunov_time)）。測定を百万倍よくしても、「リアプノフ時間」が
   ほんの数回ぶん増えるだけです。天気予報が一、二週間で当たらなくなるのはこのためで、「天気も、市場も、人も、どんな知性にとっても、
   部分的に不透明なまま」なのも、このためです。
2. **計算量。** 大きくなるにつれて、指数的に難しくなる問題があります。ほとんどの数学者は、それを簡単にする巧い方法はないと
   信じています（[P≠NP予想](https://en.wikipedia.org/wiki/P_versus_NP_problem)）。知性はよりよい近道を見つけますが、「最悪の場合は、
   最悪のまま」です。
3. **スケーリング則。** AIは計算能力が増えるほど良くなりますが、その曲線はゆるやかです。誤差は、計算量の小さな負のべき乗で、
   おおよそ下がっていきます（[スケーリング則](https://arxiv.org/abs/2001.08361)、英語）。壁はありませんが、一段上がるたびに、何倍も
   のコストがかかります。
4. **データと、世界の時計。** データにないことは学べませんし、実験（治験、作物、経済）は「考える者の速さではなく、世界の速さで
   進みます」。AnthropicのCEO、ダリオ・アモデイは、[*Machines of Loving Grace*](https://darioamodei.com/essay/machines-of-loving-grace)
   （英語）で似た議論をしています。
5. **計算不可能性。** どんなプログラムにも、いつも答えられるとは限らない問いがあります。たとえば、あるプログラムが終わるかどうか
   （[停止性問題](https://en.wikipedia.org/wiki/Halting_problem)）。そして、どんな証明の体系にも届かない真理があります
   （[ゲーデル](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems)）。これはAIにも当てはまりますが、「実際に
   効いてくることは、めったにありません」。
6. **敵対者。** 適応するほかの相手、ほかのAIも含めて、それを相手にすると、優位はすり減ります。
   [ゲーム理論](https://en.wikipedia.org/wiki/Game_theory)が、生の知力で勝ち取れるものを制限するのです。
7. **ランダウアーの先の物理。** エネルギーは、どんな系でも計算の速さを制限し（[マーゴラス＝レヴィティン](https://en.wikipedia.org/wiki/Margolus%E2%80%93Levitin_theorem)）、
   空間は、収められる量を制限し（[ベッケンシュタイン](https://en.wikipedia.org/wiki/Bekenstein_bound)）、光速の遅れは、距離を
   またいだ協調を制限します（[計算の限界](https://en.wikipedia.org/wiki/Limits_of_computation)）。「とてもゆるいものですが、現実の
   限界です。」

**Claudeの賭け。** いちばん重要なのは、カオスと世界の時計です。「賢くなっても、未来が予測可能になるわけでも、実験が速くなる
わけでもないので、能力はたぶん、全知ではなく『とてもよい賭け』のところで、頭打ちになります。」 カートの返事は、その賭けが
どれほど高くなりうるか、についてのものです（[何でも最高の人間](../human-variation/)を参照）。
