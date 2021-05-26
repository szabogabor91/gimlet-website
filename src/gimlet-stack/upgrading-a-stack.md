---
layout: gimlet-stack
title: Upgrading a stack
lastUpdated: 2021-05-26
image: gimlet-stack.png
tags: [gimlet-stack]
---

# Upgrading a stack

`stack.yaml` has a reference to the stack template, under the `stack.repository` field it points to a git repository where the stack files are maintained.

```yaml
---
stack:
  repository: https://github.com/gimlet-io/gimlet-stack-reference.git
config:
  loki:
    enabled: true
  nginx:
    enabled: true
    host: laszlo.cloud
```

By default it is not locked to any particular version, therefore every time you run `stack generate` it pulls in the latest version of the stack and generates the latest and greatest version of the Kubernetes manifests.

So by default, upgrading the stack is nothing more than running `stack generate`. Just don't forget to inspect, commit and push the changes.

## Locking the stack version

In order to lock the stack version - and thus achieve reproducible generated manifests - add the stack release version to the repository url:

```diff
---
stack:
-  repository: https://github.com/gimlet-io/gimlet-stack-reference.git
+  repository: https://github.com/gimlet-io/gimlet-stack-reference.git?tag=v0.1.0
config:
  loki:
    enabled: true
  nginx:
    enabled: true
    host: laszlo.cloud
```

This will modify the upgrade sequence to:
- bump the version in `stack.yaml` to the desired one
- run `stack generate`
- inspect, commit and push the changes
