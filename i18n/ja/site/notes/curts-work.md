---
id: curts-work
title: "カートの仕事、256t.orgとhashbin.org"
ch: 3
at: T12.C.02
links: [256t, hashbin, content-addressable, {title: "256t.orgのソースコード（GitHub、英語）", url: "https://github.com/curtcox/256t.org"}, {title: "hashbin.orgのソースコード（GitHub、英語）", url: "https://github.com/curtcox/hashbin.org"}, {title: "暗号学的ハッシュ関数 (Wikipedia)", url: "https://en.wikipedia.org/wiki/Cryptographic_hash_function"}, {title: "リンク切れ (Wikipedia)", url: "https://en.wikipedia.org/wiki/Link_rot"}]
---
**Claudeが言う、カートとは誰か。** 主に[Python](https://en.wikipedia.org/wiki/Python_(programming_language))と
[Java](https://en.wikipedia.org/wiki/Java_(programming_language))（広く使われている二つのプログラミング言語）、そして
[Flask](https://en.wikipedia.org/wiki/Flask_(web_framework))（Pythonでウェブサイトを作るための道具一式）で仕事をする、ソフト
ウェアエンジニア。ほかのプログラマーのための道具や、AIを扱うための道具を作っています。それに、
[AI安全性](https://en.wikipedia.org/wiki/AI_safety)と[心の哲学](https://en.wikipedia.org/wiki/Philosophy_of_mind)にも関心が
あります。

**カートのプロジェクトが解く問題。** ウェブのリンクは切れます。ページが移ったり、サイトが閉じたりして、保存したリンクが
どこにもつながらなくなる。これを[リンク切れ](https://en.wikipedia.org/wiki/Link_rot)と呼びます。困ったことの一つは、ふつうの
ウェブのアドレスが、何が*どこに*あるかを言うだけで、それが*何*なのかは言わないことです。

**ものを、それが何かで名づける。** 解決策は、[コンテンツアドレス型ストレージ](https://en.wikipedia.org/wiki/Content-addressable_storage)
と呼ばれます。ファイルを[暗号学的ハッシュ関数](https://en.wikipedia.org/wiki/Cryptographic_hash_function)に通します。どんな
ファイルも、指紋のような長い符号に変える手順です。同じファイルからはいつも同じ符号が出て、一文字でも変えれば、まったく違う
符号になります。だから、その符号そのものをファイルの名前にできます。符号を持っている人は、どこからでもファイルを取ってきて、
それが符号の約束どおりのものかを確かめられます。本の中のすべての言葉から請求記号が計算される図書館のようなものです。違う本を
渡されることはありえません。

**[256t.org](https://256t.org)**（英語）は、そうした符号のための、カートが作った開かれた簡素な規格です。SHA-512というハッシュを
使い、ウェブのアドレスに収まる94文字の英数字の列として書きます。50を超えるプログラミング言語で、動く例がついています
（[ソースコード](https://github.com/curtcox/256t.org)）。

**[hashbin.org](https://hashbin.org)**（英語）は、その上に作られたサービスです。少しお金を払って何かを保存すると、その256tの
符号がもらえ、符号を持っている人なら誰でも、アカウントなしで無料でダウンロードできます
（[ソースコード](https://github.com/curtcox/hashbin.org)）。

**なぜこの話が出てくるのか。** Claudeは「僕は誰？」に、こうして答えます。カートのアカウントに結びついている情報から
（[Claudeがカートを知っていた方法](../how-claude-knew/)を参照）。そしてそのあと、プロジェクトの一覧は「人ではない」と
認めます。
