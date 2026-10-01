---
id: curts-work
title: "커트의 작업: 256t.org와 hashbin.org"
ch: 3
at: T12.C.02
links: [256t, hashbin, content-addressable, {title: "256t.org 소스 코드 (GitHub)", url: "https://github.com/curtcox/256t.org"}, {title: "hashbin.org 소스 코드 (GitHub)", url: "https://github.com/curtcox/hashbin.org"}, {title: "암호학적 해시 함수 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EC%95%94%ED%98%B8%ED%99%94_%ED%95%B4%EC%8B%9C_%ED%95%A8%EC%88%98"}, {title: "링크 부패 (Wikipedia)", url: "https://ko.wikipedia.org/wiki/%EA%B9%A8%EC%A7%84_%EB%A7%81%ED%81%AC"}]
---
**Claude가 말하는 커트.** 주로 [Python](https://ko.wikipedia.org/wiki/%ED%8C%8C%EC%9D%B4%EC%8D%AC)과
[Java](https://ko.wikipedia.org/wiki/%EC%9E%90%EB%B0%94_(%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D_%EC%96%B8%EC%96%B4))(널리 쓰이는 두 프로그래밍 언어), 그리고
[Flask](https://ko.wikipedia.org/wiki/%ED%94%8C%EB%9D%BC%EC%8A%A4%ED%81%AC_(%EC%9B%B9_%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC))(Python으로 웹사이트를 만드는 도구)로 일하는 소프트웨어
엔지니어입니다. 다른 프로그래머들을 위한 도구, AI와 함께 일하기 위한 도구를 만듭니다. [AI 안전](https://ko.wikipedia.org/wiki/AI_%EC%95%88%EC%A0%84)과
[심리철학](https://ko.wikipedia.org/wiki/%EC%8B%AC%EB%A6%AC%EC%B2%A0%ED%95%99)에도 관심이 있습니다.

**그의 프로젝트가 푸는 문제.** 웹의 링크는 깨집니다. 페이지가 옮겨지거나 사이트가 문을 닫으면, 저장해 둔 링크는 아무 데도
이어지지 않습니다. 이것을 [링크 부패](https://ko.wikipedia.org/wiki/%EA%B9%A8%EC%A7%84_%EB%A7%81%ED%81%AC)라고 합니다. 문제의 일부는 평범한 웹 주소가
무언가가 *어디에* 있는지를 말할 뿐, 그것이 *무엇인지*는 말하지 않는다는 데 있습니다.

**무엇인지로 이름 붙이기.** 해결책은 [콘텐츠 주소 지정 저장소](https://en.wikipedia.org/wiki/Content-addressable_storage)(영어)라고
불립니다. 파일을 [암호학적 해시 함수](https://ko.wikipedia.org/wiki/%EC%95%94%ED%98%B8%ED%99%94_%ED%95%B4%EC%8B%9C_%ED%95%A8%EC%88%98)에 넣습니다. 어떤 파일이든
지문 같은 긴 코드로 바꾸는 계산법입니다. 같은 파일은 언제나 같은 코드를 내고, 글자 하나만 바꿔도 완전히 다른 코드가
나옵니다. 그러니 코드 자체를 파일 이름으로 쓸 수 있습니다. 코드를 가진 사람은 누구든 어디서나 파일을 가져올 수 있고, 그
파일이 코드가 약속한 바로 그것인지 확인할 수 있습니다. 책의 청구 기호가 그 책의 모든 단어로 계산되는 도서관과 비슷합니다.
엉뚱한 책을 건네받을 수가 없죠.

**[256t.org](https://256t.org)**는 이런 코드를 위한, 커트가 만든 열려 있고 단순한 표준입니다. SHA-512 해시를 쓰는데, 웹
주소에 들어가는 94자의 문자와 숫자로 적고, 50개가 넘는 프로그래밍 언어로 된 실제 예제가 함께 있습니다
([소스 코드](https://github.com/curtcox/256t.org)).

**[hashbin.org](https://hashbin.org)**는 그 위에 세운 서비스입니다. 조금 돈을 내고 무언가를 저장하면 256t 코드를 받고,
그 뒤로는 코드가 있는 사람은 누구든 계정 없이 무료로 내려받을 수 있습니다([소스 코드](https://github.com/curtcox/hashbin.org)).

**왜 이 이야기가 나오나.** Claude가 “나는 누구지?”에 답하는 방식이 이것입니다. 커트의 계정과 연결된 정보로요([Claude는 커트가 누군지 어떻게 알았나](../how-claude-knew/) 참고).
그런 다음 Claude는 이건 “사람이 아니라 프로젝트와 기술의 목록이니까요”라고 인정합니다.
