---
layout: gimlet-cli
title: gimlet gitops bootstrap
lastUpdated: 2020-12-09
tags: [gimletcli]
---

# `gimlet gitops bootstrap`

Bootstraps the gitops controller for an environment.

It places the deployment manifests of the [Flux2](https://github.com/fluxcd/flux2) GitOps controller to your GitOps repository, then makes a commit.

## Usage

```
NAME:
   gimlet gitops bootstrap - Bootstraps the gitops controller for an environment

USAGE:
   gimlet gitops bootstrap \
     --env staging \
     --gitops-repo-url git@github.com:<user>/<repo>.git

OPTIONS:
   --env value               environment to bootstrap (mandatory)
   --gitops-repo-url value   URL of the gitops repo (mandatory)
   --gitops-repo-path value  path to the working copy of the gitops repo, default: current dir
   --help, -h                show help (default: false)
```

## Examples

### Bootstrapping staging environment

```
cd <<path-to-a-working-copy-of-the-gitops-repo>>

gimlet gitops bootstrap \
  --env staging \
  --gitops-repo-url git@github.com:<user>/<repo>.git

git push origin main
```

### Setting the working copy path of the GitOps repo 

```
gimlet gitops bootstrap \
  --env staging \
  --gitops-repo-path <<path-to-a-working-copy-of-the-gitops-repo>> \
  --gitops-repo-url git@github.com:<user>/<repo>.git

git push origin main
```
