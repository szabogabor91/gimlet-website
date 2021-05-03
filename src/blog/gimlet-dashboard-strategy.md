---
layout: post
title: "Gimlet Dashboard strategy"
date: 2021-05-03
excerpt: |
    Gimlet Dashboard - or Gimlet Dash in short - is going to be Gimlet's UI component. It tackles multiple purposes, and this document is here to elaborate on that.
topic: Dashboard
image: old-gimlet-ui.png
tags: [posts]
---

Gimlet Dashboard - or Gimlet Dash in short - is going to be Gimlet's UI component.
It tackles multiple purposes, and this document is here to elaborate on that.

## UI for GimletD
A natural use-case for Gimlet Dash is providing a UI for GimletD's features.

GimletD has an API and today Gimlet CLI is the only way to interact with that API.

A UI is crucial to serve a wider audience and once Gimlet Dash is released, both the CLI and Dash can be used to drive GimletD's workflows. They will be interchangeable.

Gimlet CLI today provides two command groups that are serving GimletD's use-cases: `gimlet artifact *` and `gimlet release *`

These two groups combined with the git CLI are sufficient to browse the git history, find artifacts for specific git versions and release them.

Gimlet Dash should provide the same capabilities::

- Listing of git commits to a specific git repository
- Listing artifacts for a specific commit
  <br />matching CLI command: `gimlet artifact list --sha xxx`
- Allowing an artifact to be released
  <br />matching CLI command: `gimlet release make --artifact xxx --env yyy`
- Listing of recent releases
  <br />matching CLI command: `gimlet release list`
- Allowing to rollback to a specific release in the past
  <br />matching CLI command: `gimlet release rollback`

Two screenshots that have these features, the first one is Gimlet's monolithic closed source predecessor:
![Gimlet's monolithic closed source predecessor](/old-gimlet-ui2.png)

And Codefresh, one of the better competitors of Gimlet Dash:
![Codefresh](/codefresh.png)

## Generic Kubernetes dashboard

Gimlet is made to be modular. So far the community traction we got is from components that are simpler, single purpose and easily comprehensible.

A good example of this is OneChart. OneChart started its own life and this is great.
We should foster this and try replicating it: instead of making it useful only for people who adopt GimletD, we will make it a generic Kubernetes dashboard.

One of Gimlet Dash's differentiator will be to follow a developer centric approach: 
instead of looking at Kubernetes resources as an inventory of all pods, deployments and ingresses, 
the primary means of navigation should be through deployed applications, more so through git repositories. 
Our primary users will be developers who want to see their own application. Nothing less, nothing more.

This is showcased on a screenshot from Gimlet's closed source version:
![Gimlet's monolithic closed source predecessor](/old-gimlet-ui.png)

The developer can quickly see all ingresses, deployments, pods that are deployed related to her application. Combined with git version information.

Gimlet Dash will be a realtime view on Kubernetes resources, meshed together with application meta information.


The view will be realtime as our agent is running inside the target Kubernetes clusters, subscribes to resource events and streams that to the Gimlet Dash backend, which then streams it to the Gimlet Dash single page app
In order to be able to match Kubernetes resources to git repositories, and to have relevant meta data (version information, owner information, on-call rotation etc) we are launching a Kubernetes CRD alongside Gimlet Dash for people to be able to provide the required information. This CRD will be part of our configuration management tool: OneChart.


## Standalone or Backstage plugin
We should get into the Backstage ecosystem as much as possible, but we should also have a standalone experience as well.

This means Gimlet Dash will exist as a Backstage plugin, and as a single binary golang application.

## Extensibility
Optionality is the lifeblood of cloud native. Therefor we should investigate how others can extend Gimlet Dash.

Strategically it is important to hook into the Backstage ecosystem and be able to use backstage plugins. So their inevitable inertia should not put us in constant trailing.

On the other hand, Backstage's view per plugin will quickly result in fragmented experiences. It has been demonstrated many times that navigating a large plugin ecosystem is overwhelming to users. The Jenkins and Wordpress ecosystems turned out to be the staples of the internet, but there exist a single purpose competitor for each of their plugins with better UX. Github Actions is also an example where the user has try a myriad of actions to find the best. Quality varies, canonical solutions lacking.

Gimlet Dash will rather be an opinionated delightful tool than a frame for a burgeoning number of views and plugins. Eg extensibility only matters if we find an elegant way of doing it.

You can find Gimlet Dashboard at [https://github.com/gimlet-io/gimlet-dashboard](gimlet-io/gimlet-dashboard)

Onwards!
