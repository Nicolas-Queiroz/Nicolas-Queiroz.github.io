---
title: "When building it yourself gets cheaper than buying it"
description: "A McKinsey survey found nearly a third of companies skipped buying software because AI coding agents let them build the same thing in-house."
pubDate: 2026-09-13
tags: ["AI", "Backend", "Cloud"]
lang: "en"
image: "/posts-images/2026-09-13-agentes-codificacao-orcamento.svg"
linkedin: |
  Nearly a third of the companies McKinsey surveyed skipped buying a piece of software because they could build the same thing in-house with coding agents.

  I already live on the "build" side of that math. I am the only developer responsible for end-to-end projects across a 90+ store chain, and the loyalty program I built in Odoo did not exist because the market had nothing to sell us. It exists because owning the architecture was worth more than owning a vendor contract.

  Agents do not change the decision. They change its price: a feature that took weeks now takes days.

  One honest question stuck with me. How many of those calls were "the subscription is not worth it anymore", and how many were "the vendor never did exactly what we needed"?
---

This doesn't surprise me at all, and I think that's exactly why it's worth sitting with for a second. McKinsey surveyed a bunch of organizations and found that nearly a third of them decided not to buy at least one software product or feature because they could build the same thing internally using AI coding agents.

That's corporate budget decisions shifting sides because of a tool category that barely existed three years ago.

## I already live on the "build" side of this equation

At my current job I'm the sole developer responsible for end-to-end projects across a retail chain with over 90 stores, and one example I like bringing up is a loyalty program service I built in Odoo, with resources exposed for other platforms to consume. That wasn't because there was no vendor option out there. It was because building it in-house, with full control over the architecture and no dependency on a third-party contract, made more sense for that specific business context. The same logic applies to an independent GCP logs module I built, pluggable into other modules: it solved a real pain point without requiring a whole paid observability tool just for that.

What coding agents change in that equation isn't the decision itself: "building in-house can be worth it" was already true before. What changes is the time and labor cost to get there. A feature that used to require weeks from a dedicated team can now be a days-long project for one developer with the right agent alongside them. That pushes the bar for "worth building" into much wider territory than it used to cover, and that's exactly the shift showing up in the survey numbers.

From a vendor's point of view, that's uncomfortable. From the point of view of someone like me, who's the sole dev deciding between integrating an off-the-shelf solution or writing my own, it's one more option on the table, and one that increasingly tips toward "I can knock this out in a sprint."

I'm curious how many of that 30% were "we didn't feel like paying for a subscription anymore" decisions versus "we realized the vendor didn't actually do what we needed, and now we could build it to spec." My guess is that second category is the one that's actually going to grow.
