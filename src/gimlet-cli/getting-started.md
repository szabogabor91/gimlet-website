---
layout: gimlet-cli
title: Getting Started
lastUpdated: 2020-12-09
tags: [gimletcli]
---

# Getting Started

Welcome to the Gimlet universe!

Gimlet CLI provides a modular GitOps workflow that you can adopt in partial, or in full.

Its main design goal was to support you on your Kubernetes journey.
Whether you are hacking on your Raspberry, or want to manage services and environments at scale.

## Installation

#### Linux / Mac

```bash
curl -L https://github.com/gimlet-io/gimlet-cli/releases/download/v0.7.0/gimlet-$(uname)-$(uname -m) -o gimlet
chmod +x gimlet
sudo mv ./gimlet /usr/local/bin/gimlet
gimlet --version
```

## Next steps

There are a couple of paths you can take:

- If you are new to Kubernetes, follow this guide: <br />
  [Deploy your app to Kubernetes without the boilerplate](/gimlet-cli/deploy-your-app-to-kubernetes-without-the-boilerplate)

- If you already deploy services to Kubernetes, see the
  [Manage environments with Gimlet and GitOps](/gimlet-cli/manage-environments-with-gimlet-and-gitops) guide