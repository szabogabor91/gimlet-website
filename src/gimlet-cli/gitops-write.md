---
layout: gimlet-cli
title: gimlet gitops write
lastUpdated: 2020-12-09
tags: [gimletcli]
---

# `gimlet gitops write`

Writes app manifests to environment in the GitOps repository. Then it makes a commit.

## Usage

```
NAME:
   gimlet gitops write - Writes app manifests to a gitops environment

USAGE:
   gimlet gitops write -f my-app.yaml \
     --env staging \
     --app my-app \
     -m "Releasing Bugfix 345"

OPTIONS:
   --file value, -f value     manifest file, folder or "-" for stdin to write (mandatory)
   --env value                environment to write to (mandatory)
   --app value                name of the application that you configure (mandatory)
   --gitops-repo-path value   path to the working copy of the gitops repo, default: current dir
   --message value, -m value  gitops commit message
   --help, -h                 show help (default: false)
```

## Examples

### Writing a manifest file

```
cd <<path-to-a-working-copy-of-the-gitops-repo>>

gimlet gitops write -f my-app.yaml \
 --env staging \
 --app my-app \
 -m "Releasing Bugfix 345"

git push origin main
```

### Setting the working copy path of the GitOps repo 

```
   gimlet gitops write -f my-app.yaml \
     --env staging \
     --app my-app \
     --gitops-repo-path <<path-to-a-working-copy-of-the-gitops-repo>> \
     -m "Releasing Bugfix 345"
```

### Writing all manifest files from a folder

```
cd <<path-to-a-working-copy-of-the-gitops-repo>>

gimlet gitops write -f deploy/ \
 --env staging \
 --app my-app \
 --gitops-repo-path <<path-to-a-working-copy-of-the-gitops-repo>> \
 -m "Releasing Bugfix 345"

git push origin main
```

### Writing all manifests from standard in

```
cd <<path-to-a-working-copy-of-the-gitops-repo>>

helm template onechart/onechart -f values.yaml | \
gimlet gitops write -f - \
 --env staging \
 --app my-app \
 --gitops-repo-path <<path-to-a-working-copy-of-the-gitops-repo>> \
 -m "Releasing Bugfix 345"

git push origin main
```
