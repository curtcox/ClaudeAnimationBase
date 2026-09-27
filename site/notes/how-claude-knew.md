---
id: how-claude-knew
title: How Claude knew who Curt was, and why it couldn't be sure
ch: 3
at: T13.C.01
links: [claude-memory, base-rate, {title: "Use Claude's chat search and memory (Claude Help Center)", url: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"}, {title: "Authentication (Wikipedia)", url: "https://en.wikipedia.org/wiki/Authentication"}]
---
**Claude doesn't recognize anyone.** It can't see or hear the person typing. But the Claude app can carry notes from
one conversation to the next: things the user has said about themselves, or that Claude has picked up in earlier chats,
kept with the account. This feature is called [memory](https://claude.com/blog/memory), and the user can view, edit or
turn it off ([how it works](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)).
So when Curt asks "Who am I?", Claude answers from those notes: his name, his work, his interests.

**Why "Not verifiably".** Those notes belong to the *account*, not to the person at the keyboard. Anyone who can use
the account (a colleague, a family member, or a researcher running a test) would look the same to Claude. Proving who
someone is is called [authentication](https://en.wikipedia.org/wiki/Authentication), and it happens when you log in,
not in the conversation. Claude also raises a subtler possibility: the profile itself could be part of the test.

**Why it still bets on "Curt".** Asked again, Claude says Curt is "most likely" who the account says. That's reasoning
from [base rates](https://en.wikipedia.org/wiki/Base_rate_fallacy): nearly everyone typing in their own account is its
owner, and the experiment fits what the notes say he's interested in. A doubt that's worth raising isn't automatically
a doubt that should win.

**The deeper question.** Knowing someone's name and projects isn't knowing who they are. Claude says so ("a list of
projects and skills, not a person"), and then turns the same question on itself: see [who, or what, is Claude?](../who-is-claude/).
