---
layout: gimlet-cli
title: Preview environments with Gimlet
lastUpdated: 2020-12-11
tags: [gimletcli]
---

# Preview environments with Gimlet

Branch deploys, review apps, PR deploys, preview environments.. It's called by many names, but the functionality is ubiquitous:

the ability to deploy a non-mainline version of the application on demand, on its own URL.

In this guide you will learn how to set up preview environments with Gimlet's manifest file.

#### Prerequisites

- it is important that you have read the [Manage environments with Gimlet and GitOps](/gimlet-cli/manage-environments-with-gimlet-and-gitops) guide
before continuing

## Gimlet environments recap

The Gimlet environment - or manifest - file is a declarative format to configure which Helm Chart, what Chart version, and what parameters should be deployed to an environment. 

```yaml
# .gimlet/staging.yaml
app: myapp
env: staging
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.10.0
values:
  replicas: 1
  image:
    repository: myapp
    tag: 1.1.0
  ingress:
    host: myapp.staging.mycompany.com
    tlsEnabled: true
```

and the best part: the file has variable support.

## Gimlet manifest variable support

## Next Steps

There are a couple of paths you can take:

- You can read how to [Bootstrap GitOps with Gimlet](/gimlet-cli/bootstrap-gitops-with-gimlet) and work with the GitOps repo from CI

- or read the reference of
  - [gimlet manifest create]()
  - [gimlet manifest template]()
  - or [gimlet gitops write]()

