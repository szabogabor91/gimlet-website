---
layout: docs
title: The SANE Helm guide
lastUpdated: 2021-10-29
tags: [docs]
---

# The SANE Helm guide

Helm is the most thrown around term in the Kubernetes ecosystem and perhaps one of the most divisive one as well. Many accept and use the tool, many refuse to touch it and always look for raw yaml alternatives.

But Helm does two things well:

- packaging
- and templating

In this guide you will get practical knowledge on how-to use Helm focusing on those usecases - that also underpin Gimlet -, emphasizing simplicity.

In the 5 minutes that this guide will take you, you will get from *"Helm, wtf?"* or *"Helm, yak"* to "Helm, this ain't so bad".

Let's not waste any more time and get to it, shall we?

## Helm as a source of packaged infrastructure tools

If you need a quick and dirty way to install a database, queueing engine or any infrastructure component, Helm is the way to go. Almost every project has a good enough official or community Helm chart that will get the tool installed with okay defaults.

