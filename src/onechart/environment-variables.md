---
layout: docs
title: Environment variables
lastUpdated: 2020-12-09
tags: [docs]
---

# Environment variables

OneChart settings for setting environment variables:

```yaml
image:
  repository: nginx
  tag: 1.19.3

vars:
  VAR_1: "value 1"
  VAR_2: "value 2"
```

Check the Kubernetes manifest:

```bash
cat << EOF > values.yaml
image:
  repository: nginx
  tag: 1.19.3

vars:
  VAR_1: "value 1"
  VAR_2: "value 2"
EOF

helm template my-release onechart/onechart -f values.yaml
```

Note: OneChart creates a `ConfigMap` with all the defined environment variables.
Then includes all entries with the `EnvFrom` field in the deployment.
