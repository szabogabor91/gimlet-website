---
layout: docs
title: Deploying an image
lastUpdated: 2020-12-09
tags: [docs]
---

# Deploying an image

OneChart settings for deploying the Nginx image:

```yaml
image:
  repository: nginx
  tag: 1.19.3
```

Check the Kubernetes manifest:

```bash
cat << EOF > values.yaml
image:
  repository: nginx
  tag: 1.19.3
EOF

helm template my-release onechart/onechart -f values.yaml
```
