---
layout: gimlet-stack
title: Author your first stack
lastUpdated: 2021-05-26
image: gimlet-stack.png
tags: [gimlet-stack]
---

# Author your first stack

So you want to share your favorite stack and best practices with others? If you want to become a stack curator, this page is for you.

You will learn how to create a stack template from scratch and how your users can use it.

## Prerequisites

To complete this tutorial, make sure you understood the end-user flows of Gimlet Stack, 
and you understand the [concepts](/gimlet-stack/concepts) thoroughly.

## What defines a stack

- a stack lives in a dedicated git repository 
- a stack is a mix of Kubernetes resources, configmaps, HelmRelease resources placed in the git repo's root
- the resources are Golang templates, and can resolve variables that are defined in the stack.yaml by the end-user
- a stack has a `stack-definition.yaml` in the git repository root
  - that contains the stack meta data 
  - component metadata, name, version, and a one-pager per component that helps the user getting started with the component
  - component schema that is a subset of the component's Helm Chart's `values.schema.json`
  - the ui-schema, that is a helm-ui.json schema file described in this blog post: https://gimlet.io/blog/helm-react-ui-a-react-component-to-render-ui-for-helm-charts/#the-helm-ui.jso

Gimlet Stack maintains a reference stack implementation in the [https://github.com/gimlet-io/gimlet-stack-reference](https://github.com/gimlet-io/gimlet-stack-reference) repository.
