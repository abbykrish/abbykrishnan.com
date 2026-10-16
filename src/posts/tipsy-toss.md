---
layout: post.njk
title: "The Tipsy Toss Tournament"
date: 2026-10-16
excerpt: Signups, live standings, and a bracket for an annual tipsy toss tournament, built on Cloudflare Workers and D1.
---

**[The Tipsy Toss Tournament](https://tipsytoss.abbykrishnan.com/)** is the site for an annual tipsy toss tournament: two poles, a bottle on each, a frisbee, and a lot of yelling. It's now in its second year.

Teams sign up on the site, and solo players get paired with another free agent before the tournament starts. On game day, the live page shows prelim matchups, standings, and the bracket, and refreshes itself so everyone can follow along on their phones. An admin view handles the logistics: drawing prelim rounds that pair teams with similar records, then seeding the bracket from the results.

It runs on [Cloudflare Workers](https://workers.cloudflare.com/) with a [D1](https://developers.cloudflare.com/d1/) database, and is built with React and [Hono](https://hono.dev/).
