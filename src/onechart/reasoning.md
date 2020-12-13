---
layout: onechart
title: Reasoning
lastUpdated: 2020-12-09
tags: [onechart]
---

## The Yaml

Kubernetes has a powerful deployment manifest, or "the yaml" as people often call it.

It allows for great flexibility with its many options and knobs, but that also means that it requires extensive boilerplate to get started.

The bigger issue is that it's not easy to piece together the needed Kubernetes `Deployment`, `Service` and `Ingress` objects
as there is no go to place besides the Kubernetes documentation.

## How to get started with Kubernetes yamls

Most people copy it from somewhere.

If they need to extend it with new features, they search and copy that snippet too. When they start a new project, they copy over their proven yamls.

Some point, they want to make it more clever, support variables, apply pieces conditionally, they come up with some templating solution.

This scales to a certain point, but there has to be a better way.

And you keep hearing about Helm, aren't you?

## What is Helm

If you want to deploy well known infrastructure components, like Redis, the community has a solution for you:
it's called Helm, and it is a package manager.

There are prepackaged deployments manifests, called Helm Charts, that can get you started with installation and configuration.

Helm charts allow you to progress from a simple two liner that installs a default Redis:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-redis bitnami/redis
```

to more tailored setups:
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-redis bitnami/redis -f values.yaml

# values.yaml
master:
  persistence:
    size: 10Gi
```

While most infrastructure software has a Helm Chart today, there is no go to chart to use for your own applications.

You can try writing your own, but that it is even a larger endeavour than piecing your yamls together from blog posts.

Most companies have an internal best practice and reference implementation on how to deploy to Kubernetes.
That usually includes a Helm Chart, or a corresponding internal tool.

But if you don't work for a company like that,
you can use Gimlet's OneChart Helm Chart for your application.

## Use OneChart to deploy your application

OneChart is a generic Helm Chart for web applications. The idea is that most Kubernetes manifest look alike, only very few parts actually change.

The example bellow deploys your application image, sets environment variables and configures the Kubernetes Ingress domain name:

```bash
helm repo add onechart https://chart.onechart.dev
helm template my-release onechart/onechart -f values.yaml

# values.yaml
image:
    repository: my-app
    tag: fd803fc
vars:
  VAR_1: "value 1"
  VAR_2: "value 2"
ingress:
  annotations:
    kubernetes.io/ingress.class: nginx
  host: my-app.mycompany.com
```


the 123 templating thing

why not xsonnet , don't make my head spin
why yaml is good enough? why not a fill fledged language

Why helm is good enough, using it the right way
where are the limitations, what if onechart doesn't cover a case? (all abstractions leak)
