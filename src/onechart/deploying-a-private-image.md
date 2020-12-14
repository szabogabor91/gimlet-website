---
layout: onechart
title: Deploying a private image
lastUpdated: 2020-12-09
tags: [onechart]
---

# Deploying a private image

OneChart settings for deploying `my-web-app` image from Amazon ECR:

```yaml
image:
  repository: aws_account_id.dkr.ecr.region.amazonaws.com/my-web-app
  tag: x.y.z

imagePullSecrets: 
 - name: regcred
```

Check the Kubernetes manifest:

```bash
cat << EOF > values.yaml
image:
  repository: aws_account_id.dkr.ecr.region.amazonaws.com/my-web-app
  tag: x.y.z

imagePullSecrets: 
 - name: regcred
EOF

helm template my-release onechart/onechart -f values.yaml
```

Warning:
The `regcred` image pull credentials must be set up in the cluster. 
See how: [https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
