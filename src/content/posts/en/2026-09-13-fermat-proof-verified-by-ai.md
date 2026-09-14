---
title: "A machine-checked Fermat: what it reminds me about my own code"
description: "Anthropic says Claude translated an existing proof of Fermat's Last Theorem into Lean and got it fully machine-verified in 11 days."
pubDate: 2026-09-13
tags: ["AI", "LLMs", "MCP"]
lang: "en"
image: "/posts-images/2026-09-13-prova-fermat-lean.svg"
---

Here's what keeps nagging me: if it takes an AI 11 days to translate an entire proof of Fermat's Last Theorem into Lean and come out the other side with something a computer fully verifies, the real shift isn't "the AI understands math." It's the bar we use for the word verified.

Anthropic claims Claude took an existing proof of the theorem and rewrote it in Lean, a formal language where every logical step has to close for the compiler to accept it. There's no middle ground: either the proof is logically airtight from start to finish, or the checker rejects it. That's a very different standard from how most production code gets validated.

## Formal proof is automated testing taken to its logical extreme

One thing I repeat a lot at work is that a good workflow is configurable, documented, and covered by automated tests. But software testing, underneath it all, is sampling. I write cases for the scenarios I can imagine, run them, and trust that's enough coverage. There's always that nagging question left over: what about the case I didn't think of?

A Lean proof doesn't have that gap. Either the argument holds for every possible input under the rules of logic, or it doesn't. That's the difference between "I tested it and it didn't break" and "it is mathematically impossible for this to break." For a centuries-old theorem, that rigor is the whole point. For a production system, it's mostly impractical: most software doesn't have, and doesn't need, a formal specification.

The hook that stuck with me is different, though. If an AI can automate 11 days of formal translation that would take a human much longer and a very specific kind of expertise, that lowers the cost of applying formal rigor to smaller, higher-stakes pieces of real systems. Not the whole system, maybe just the part that calculates a discount, or the part that decides whether a batch of data is safe to process. Places where "I think I tested it enough" isn't a satisfying answer.

I don't know if I'll ever run something like this to prove my loyalty-program module can't let a duplicate discount slip through, but the idea hasn't left my head. Has anyone actually tried formal verification on a real business rule, outside academia, and lived to tell how it went?
