---
layout: docs
title: Gimlet Stack concepts
lastUpdated: 2021-11-09
tags: [docs]
---

# Gimlet Stack concepts

## What can you do with Gimlet Stack

Bootstrap curated Kubernetes stacks!

Logging, metrics, ingress and more - all delivered with gitops.

- You can install logging aggregators, metric collectors, ingress controllers and more on your cluster with a few commands, 
without much knowledge of Helm charts, and their configuration options

- The components are delivered through a plain git repository with self-contained gitops automation

- You will get constant upgrades for the installed components from the stack curators

## Design

Gimlet Stack is a command line tool that you can use to configure curated stacks for Kubernetes clusters.

*Stack makers* (or curators) maintain the stacks, and *end-users* benefit from the curator's hard-earned best practices as they deploy the curated stacks on their clusters.

A stack instance - with its complete configuration - is stored in a git repository and delivered onto a kubernetes cluster via a gitops automation.
Gimlet Stack uses Flux V2 as the gitops controller to sync git changes to the cluster. 

The full overview of the various artifacts and actors of Gimlet Stack:
![Gimlet Stack concepts](/stack-concepts.png)

## End-user workflow

- end-users create a `stack.yaml` file with the full configuration of their stack: enabling the needed components, and configuring them through a series of options
  - end-users can create the `stack.yaml` manually
  - or through the `stack configure` CLI command which opens a browser based UI from the terminal
- users store the `stack.yaml` in git git@.com:mycompany/gitops-infra-staging.git
- users generate HelmRelease resources and other Kubernetes manifests from the components defined in `stack.yaml` with the `stack generate` CLI command
- users store the generated files in the same git repository as the `stack.yaml` file


- users push the changes to git, and the bootstrapped gitops loop syncs it on the cluster.
- users can bootstrap the gitops loop with the `stack bootstrap` CLI command

## Stacks

Stacks are a set of Helm charts and Kubernetes manifests that are configured to work together seamlessly.

- stacks use the well known community Helm charts 
- stacks expose only a subset of helm chart values to users to limit the decision space
- stacks make it possible to use all chart values if people want the full chart feature set / optionality
- stacks create new chart values that group together multiple flags, and abstract them at a higher level. Eg.: stickySessions, realIP, HA
- stacks don't change the community charts, as upstreaming opinions will be a blocker every time. Instead, stacks wrap/compose the community charts 
- stacks are able to deliver raw yamls to the gitops repo, configmaps, etc


## Next steps

To see Gimlet Stack in action, go and [Make Kubernetes an application platform with Gimlet Stack](/docs/make-kubernetes-an-application-platform-with-gimlet-stack).

