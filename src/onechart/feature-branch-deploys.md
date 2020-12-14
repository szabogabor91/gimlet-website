---
layout: onechart
title: Feature branch deploys
lastUpdated: 2020-12-09
tags: [onechart]
---

# Feature branch deploys

Feature branch deploys is a templating question:

- Names should be unique to avoid collision between application instances
- Names should follow some convention
- It's driven by CI, and git branch name is a typical input parameter

### Avoiding name collisions

With OneChart, you can drive the naming of most resources by setting a unique release name.
Release name is unique in Helm too, so it makes it a good tool to drive resource names.

One good practice can be to add a `-$BRANCH` suffix to the feature branch instance:

```
helm template my-release-my-branch onechart/onechart -f values.yaml
```

### Avoiding domain name collision

The release name will make all Kubernetes objects unique, but the domain name configuration remains static:

```bash
cat << EOF > values.yaml
image:
  repository: nginx
  tag: 1.19.3

ingress:
  annotations:
    kubernetes.io/ingress.class: nginx
  host: my-release.mycompany.com
EOF

helm template my-release-my-branch onechart/onechart -f values.yaml
```

The `ingress.host` name should also be dynamic to avoid the collision:

```bash
helm template my-release-my-branch onechart/onechart\
  -f values.yaml \
  --set ingress.host=my-release-my-branch.mycompany.com
```

To see how to manage feature environments effectively read [Preview environments with Gimlet](/gimlet-cli/preview-environments-with-gimlet)
