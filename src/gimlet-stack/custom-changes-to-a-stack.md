---
layout: gimlet-stack
title: Custom changes to a stack
lastUpdated: 2021-05-26
image: gimlet-stack.png
tags: [gimlet-stack]
---

# Custom changes to a stack

Stack templates only go so far, and it is inevitable that you want to amend the generated manifests in slight ways.

`stack generate` takes your custom changes into account and keeps them even after a configuration change, or an upgrade.

In case your custom change is conflicting with the generated content, you have to do a content merge, that should be familiar from git.

## Custom changes that conflicts

The bellow output was from a stack that was upgraded from `0.2.0` to `0.3.0` and having a custom change on top of `0.2.0`.

The stack 
operator manually upgraded the version to `3.27.0`.

Since stack version `0.3.0` also updates the ingress-nginx version, now the operator has to make a judgment call whether to keep
the manually updated version or roll with generated changes.

```yaml
---
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: ingress-nginx
  namespace: infrastructure
spec:
  interval: 60m
  releaseName: ingress-nginx
  chart:
    spec:
      chart: ingress-nginx
<<<<<<<<< Your custom settings
      version: 3.27.0
=========
      version: 3.33.0
>>>>>>>>> From stack generate
      sourceRef:
        kind: HelmRepository
        name: ingress-nginx
      interval: 10m
```

Many editors have conflict resolution tooling. With a click of a button, the operator can accept the changes coming `From stack generate`.
