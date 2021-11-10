---
layout: docs
title: How-to manage staging and production environment configs
lastUpdated: 2021-11-09
tags: [docs]
---

# How-to manage staging and production environment configs

You store Gimlet manifest files under the `.gimlet` folder of your application source code repository.

One file per environment.

## Example

The following example shows two files, on for staging, and one for production.

They only differ in the replica count. However, you can have a completely unique set of configs in your envs.
The manifest files controls it all.

```yaml
# .gimlet/staging.yaml
app: myapp
env: staging
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.32.0
values:
  replicas: 1
  image:
    repository: myapp
    tag: 1.1.0
  ingress:
    host: myapp.staging.mycompany.com
    tlsEnabled: true

# .gimlet/production.yaml
app: myapp
env: production
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.32.0
values:
  replicas: 2
  image:
    repository: myapp
    tag: 1.1.0
  ingress:
    host: myapp.mycompany.com
    tlsEnabled: true
```
