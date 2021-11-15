---
layout: docs
title: How-to delete an application
lastUpdated: 2020-03-16
image: sisyphus.jpg?123
tags: [docs]
---

# How-to delete an application

If you have been experimenting, it is inevitable that you want to delete an already relased application.

- The first step is to remove the Gimlet manifest file, so you will not deploy new versions of it
- then use the `gimlet release delete` CLI command

This will delete it from the gitops repository, and Flux will clean it up from the cluster.
