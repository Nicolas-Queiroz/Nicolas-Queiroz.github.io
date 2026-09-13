---
title: "Blocking training bots by default is admitting nobody read the terms of service"
description: "Starting September 15, 2026, new Cloudflare domains block AI 'Agent' and 'Training' crawlers by default on ad-supported pages, while still allowing search bots."
pubDate: 2026-09-13
tags: ["Cloud", "AI", "Backend"]
lang: "en"
image: "/posts-images/2026-09-13-cloudflare-bloqueia-bots-ia.svg"
---

I find it telling that the fix for "your content is being scraped to train a model without permission" ended up being an infrastructure setting instead of a contractual issue. Starting September 15, 2026, every new domain on Cloudflare will automatically block "Agent" and "Training" AI crawlers on ad-supported pages, while still letting search bots through. That gives site owners much more granular control over who gets to scrape their content — but the fact that this had to become a CDN default says a lot about how this was never actually solved at any other level.

## This is an architecture decision, not just a policy one

I work with Google Cloud Platform day to day, and one thing I learned building the independent GCP logs module I use at work is that separating "who can read" from "who can process" is almost always worth solving at the infrastructure layer, not the application layer. It's easier to audit, harder to forget to apply on some new endpoint, and doesn't depend on every team remembering to configure it right. Cloudflare distinguishing search bots from training bots at the edge of the network is exactly that principle in action: the access decision happens before the request ever reaches anything I wrote.

Here's the ironic part: this blog you're reading right now has posts drafted with help from an AI agent I built myself — and at the same time, if I hosted it behind a setting like this, I'd be blocking the same category of bot that helped write the text. I don't actually think that's contradictory, though. Choosing to use AI as a tool in my own process is one thing; someone scraping my content without me choosing anything is a very different thing. The whole difference is who gets to decide.

I'd love to know what fraction of the sites born with this block switched on by default will actually know the option exists, versus how many will just inherit the setting without understanding what it means. My guess is most fall into that second group — and that might be the most important outcome here: the decision that most affects who gets to train the next model could end up being made by a default value, not by anyone's conscious choice.
