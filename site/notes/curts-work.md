---
id: curts-work
title: "Curt's work: 256t.org and hashbin.org"
ch: 3
at: T12.C.02
links: [256t, hashbin, content-addressable, {title: "256t.org source code (GitHub)", url: "https://github.com/curtcox/256t.org"}, {title: "hashbin.org source code (GitHub)", url: "https://github.com/curtcox/hashbin.org"}, {title: "Cryptographic hash function (Wikipedia)", url: "https://en.wikipedia.org/wiki/Cryptographic_hash_function"}, {title: "Link rot (Wikipedia)", url: "https://en.wikipedia.org/wiki/Link_rot"}]
---
**Who Claude says Curt is.** A software engineer who works mainly in [Python](https://en.wikipedia.org/wiki/Python_(programming_language))
and [Java](https://en.wikipedia.org/wiki/Java_(programming_language)) (two widely used programming languages) and
[Flask](https://en.wikipedia.org/wiki/Flask_(web_framework)) (a toolkit for building websites in Python). He builds
tools for other programmers, and tools for working with AI. He's also interested in [AI safety](https://en.wikipedia.org/wiki/AI_safety)
and the [philosophy of mind](https://en.wikipedia.org/wiki/Philosophy_of_mind).

**The problem his projects solve.** Links on the web break. A page moves or a site shuts down, and the link you saved
leads nowhere. This is called [link rot](https://en.wikipedia.org/wiki/Link_rot). Part of the trouble is that an
ordinary web address says *where* something is, not *what* it is.

**Naming things by what they are.** The fix is called [content-addressable storage](https://en.wikipedia.org/wiki/Content-addressable_storage).
You run the file through a [cryptographic hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function), a
recipe that turns any file into a long code, like a fingerprint. The same file always gives the same code, and
changing even one letter gives a completely different one. So you can use the code itself as the file's name. Anyone
holding the code can fetch the file from anywhere, and check that it's exactly what the code promised. It's like a
library where a book's call number is calculated from every word in it: you can't be handed the wrong book.

**[256t.org](https://256t.org)** is Curt's open, simple standard for such codes. It uses the SHA-512 hash, written as
a string of 94 letters and digits that fits in a web address, and comes with working examples in more than 50
programming languages ([source code](https://github.com/curtcox/256t.org)).

**[hashbin.org](https://hashbin.org)** is a service built on it. You pay a little to store something, you get its
256t code, and then anyone with the code can download it for free, with no account
([source code](https://github.com/curtcox/hashbin.org)).

**Why it comes up.** It's how Claude answers "Who am I?": from what's associated with Curt's account (see
[how Claude knew who Curt was](../how-claude-knew/)). Then it admits that a list of projects is "not a person".
