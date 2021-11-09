---
layout: docs
title: Automatically deploy your application to staging
lastUpdated: 2021-11-09
tags: [docs]
---

# Automatically deploy your application to staging

In this guide you will 

- configure your staging application deployment in a declarative file, called the Gimlet manifest
- and set up a deploy policy to automatically deploy every new git commit to staging

#### Prerequisites

- You have finished the [Deploy your app to Kubernetes without the boilerplate](/docs/deploy-your-app-to-kubernetes-without-the-boilerplate) tutorial
- Your cluster administrator has set up GimletD for your cluster. If you are the cluster adminstrator, then bad luck, go and install GimletD first by following the [Enable release automation with GimletD](/docs/enable-release-automation-with-gimletd) tutorial.<br />You may do this tutorial without GimletD for the most part, but your automation won't work.
