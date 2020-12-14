---
layout: onechart
title: Getting Started
lastUpdated: 2020-12-09
tags: [onechart]
---

# OneChart

One chart to rule them all.

A generic Helm chart for your application deployments. Because no-one can remember the Kubernetes yaml syntax.

## Getting started

Add the OneChart Helm repository:

```
helm repo add onechart https://chart.onechart.dev
```

Set your image name and version, the boilerplate is generated.

```
helm template my-release onechart/onechart \
  --set image.repository=nginx \
  --set image.tag=1.19.3
```

Deploy with Helm:

```
helm install my-release onechart/onechart \
  --set image.repository=nginx \
  --set image.tag=1.19.3
```

## Next steps

- See how you can [deploy your application image](/onechart/deploying-an-image) using OneChart

- See how you can [set environment variables]()

[comment]: <> (- Learn how OneChart came about, what it is solving, and where are its limitations in [Reasoning]&#40;&#41;)
