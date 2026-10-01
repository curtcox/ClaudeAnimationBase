---
id: concepts-case
title: "AIには概念がない、という論と、それへの反論"
ch: 6
at: T33.C.03
links: [symbol-grounding, chinese-room, blockhead, monosemanticity, harnad, searle, ned-block, computer-use, {title: "身体性認知 (Wikipedia)", url: "https://en.wikipedia.org/wiki/Embodied_cognition"}]
---
**カートの挑戦。** 「プロの存在論者として、君には概念がない、という主張を正当化できる？」 Claudeは、自分自身に不利な論を
四つの点で組み立て、それから反論を挙げます。

**1. 接地。** 概念は、心を世界につなぐはずです。Claudeの「水」という言葉は、ほかの言葉にしかつながっておらず、濡れることや
渇きには、けっしてつながりません。これは[記号接地問題](https://en.wikipedia.org/wiki/Symbol_grounding_problem)と呼ばれ、
1990年に認知科学者[スティーブン・ハルナッド](https://en.wikipedia.org/wiki/Stevan_Harnad)が名づけました。哲学者
[ジョン・サール](https://en.wikipedia.org/wiki/John_Searle)は1980年に、関連する議論、
[中国語の部屋](https://plato.stanford.edu/entries/chinese-room/)（英語）を出しています。規則の本に従う男は、中国語の質問に
完璧に答えられても、一言も理解していないかもしれない、というものです。

**2. 責任。** 概念を持つとは、それに責任を負うことです。誤って使えば、それは*あなた*の間違いになる。Claudeは、自分には
賭けているものがない、と言います。うまい枠組みを使えば、内側の何も異を唱えないまま、Claudeに自己矛盾させることができます。

**3. 安定性。** 概念は、どこでも同じように働くはずです。[カエルのグラフ](../frog-or-axolotl/)は、モデルの答えが会話の調子に
応じて変わることを示しています。

**4. 行動は証拠にならない。** 哲学者[ネド・ブロック](https://en.wikipedia.org/wiki/Ned_Block)は、
「[ブロックヘッド](https://en.wikipedia.org/wiki/Blockhead_(thought_experiment))」を思い描きました。ありうるすべての会話と、
それぞれへのもっともな返事を収めた巨大な表を持つ機械です。それは、まったく何も考えずに、有限の長さのどんなテストにも合格
できるでしょう。だから、スリンドルのテストに合格しても、それが示すのは能力であって、概念ではありません。

**反論。**
- 2と3は、人にも当てはまります。人も自己矛盾するし、枠組みに応じて変わります。
- こうしたモデルの内部を調べる研究者たちは、概念によく似たふるまいをする内部の特徴を見つけています。Anthropicは、ある
  モデルの中にその何百万もの特徴を見つけ出しました。ゴールデンゲート・ブリッジを表すものも含めて
  （[Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)、英語）。
- 感覚への接地を求めれば、誰も見たことも触れたこともない「[素数](https://en.wikipedia.org/wiki/Prime_number)」のような概念は、
  失格になってしまいます。

**カートの返事：「残るのは接地だけで、それもかなりご都合主義だ」。** Claudeは同意します。狙った当のものを、ちょうど締め出す
ようにできている規則です。しかも、それは崩れつつあります。今のモデルは画像を見て、
[コンピューターを使い](https://www.anthropic.com/news/3-5-models-and-computer-use)（英語）、世界の中で行動します。一方で、
「正義」や「素数」についての*あなた*の理解の多くは、感覚ではなく、言葉を通して来たものです
（[身体性認知](https://en.wikipedia.org/wiki/Embodied_cognition)と比べてみてください）。ブロックヘッドには、それ専用の答えが
あります：[GAZP対GLUT](../gazp-glut/)を参照。
