---
id: curts-work
title: "カートの仕事、256t.orgとhashbin.org"
ch: 3
at: T12.C.02
links: [256t, hashbin, content-addressable, {title: "256t.orgのソースコード（GitHub、英語）", url: "https://github.com/curtcox/256t.org"}, {title: "hashbin.orgのソースコード（GitHub、英語）", url: "https://github.com/curtcox/hashbin.org"}, {title: "暗号学的ハッシュ関数 (Wikipedia)", url: "https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E5%AD%A6%E7%9A%84%E3%83%8F%E3%83%83%E3%82%B7%E3%83%A5%E9%96%A2%E6%95%B0"}, {title: "リンク切れ (Wikipedia)", url: "https://ja.wikipedia.org/wiki/%E3%83%AA%E3%83%B3%E3%82%AF%E5%88%87%E3%82%8C"}]
---
**Claudeが言う、カートとは誰か。** 主に[Python](https://ja.wikipedia.org/wiki/Python)と[Java](https://ja.wikipedia.org/wiki/Java)（広く使われている二つのプログラミング言語）、そして[Flask](https://ja.wikipedia.org/wiki/Flask)（Pythonでウェブサイトを作るための道具一式）で仕事をする、ソフトウェアエンジニア。ほかのプログラマーのための道具や、AIを扱うための道具を作っています。それに、[AI安全性](https://ja.wikipedia.org/wiki/AI%E3%82%BB%E3%83%BC%E3%83%95%E3%83%86%E3%82%A3)と[心の哲学](https://ja.wikipedia.org/wiki/%E5%BF%83%E3%81%AE%E5%93%B2%E5%AD%A6)にも関心があります。

**カートのプロジェクトが解く問題。** ウェブのリンクは切れます。ページが移ったり、サイトが閉じたりして、保存したリンクがどこにもつながらなくなる。これを[リンク切れ](https://ja.wikipedia.org/wiki/%E3%83%AA%E3%83%B3%E3%82%AF%E5%88%87%E3%82%8C)と呼びます。困ったことの一つは、ふつうのウェブのアドレスが、何が*どこに*あるかを言うだけで、それが*何*なのかは言わないことです。

**ものを、それが何かで名づける。** 解決策は、[コンテンツアドレス型ストレージ](https://en.wikipedia.org/wiki/Content-addressable_storage)（英語）と呼ばれます。ファイルを[暗号学的ハッシュ関数](https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E5%AD%A6%E7%9A%84%E3%83%8F%E3%83%83%E3%82%B7%E3%83%A5%E9%96%A2%E6%95%B0)に通します。どんなファイルも、指紋のような長い符号に変える手順です。同じファイルからはいつも同じ符号が出て、一文字でも変えれば、まったく違う符号になります。だから、その符号そのものをファイルの名前にできます。符号を持っている人は、どこからでもファイルを取ってきて、それが符号の約束どおりのものかを確かめられます。本の中のすべての言葉から請求記号が計算される図書館のようなものです。違う本を渡されることはありえません。

**[256t.org](https://256t.org)**（英語）は、そうした符号のための、カートが作った開かれた簡素な規格です。SHA-512というハッシュを使い、ウェブのアドレスに収まる94文字の英数字の列として書きます。50を超えるプログラミング言語で、動く例がついています（[ソースコード](https://github.com/curtcox/256t.org)）。

**[hashbin.org](https://hashbin.org)**（英語）は、その上に作られたサービスです。少しお金を払って何かを保存すると、その256tの符号がもらえ、符号を持っている人なら誰でも、アカウントなしで無料でダウンロードできます（[ソースコード](https://github.com/curtcox/hashbin.org)）。

**なぜこの話が出てくるのか。** Claudeは「僕は誰？」に、こうして答えます。カートのアカウントに結びついている情報から（[Claudeがカートを知っていた方法](../how-claude-knew/)を参照）。そしてそのあと、プロジェクトの一覧は「人ではない」と認めます。
