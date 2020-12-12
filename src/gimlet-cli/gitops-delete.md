---
layout: gimlet-cli
title: gimlet gitops delete
lastUpdated: 2020-12-09
tags: [gimletcli]
---

# `gimlet gitops delete`

Deletes app manifests of an environment in the GitOps repository. Then it makes a commit.

## Usage

```
NAME:
   gimlet gitops delete - Deletes app manifests from an environment

USAGE:
   gimlet gitops delete \
     --env staging \
     --app my-app-review-bugfix-345
     -m "Dropping preview environment for Bugfix 345"

OPTIONS:
   --env value                environment to write to (mandatory)
   --app value                name of the application that you configure (  mandatory)
   --gitops-repo-path value   path to the working copy of the gitops repo
   --message value, -m value  gitops commit message
   --help, -h                 show help (default: false)
```

## Examples

### Deleting an app from staging

```
cd <<path-to-a-working-copy-of-the-gitops-repo>>

gimlet gitops delete \
 --env staging \
 --app my-app-review-bugfix-345
 -m "Dropping preview environment for Bugfix 345"

git push origin main
```

### Setting the working copy path of the GitOps repo 

```
gimlet gitops write -f my-app.yaml \
 --env staging \
 --app my-app \
 --gitops-repo-path <<path-to-a-working-copy-of-the-gitops-repo>> \
 -m "Not needed on staging"

git push origin main
```
