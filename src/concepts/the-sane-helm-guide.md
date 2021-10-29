---
layout: docs
title: The SANE Helm guide
lastUpdated: 2021-10-29
tags: [docs]
---

# The SANE Helm guide

Helm is the most thrown around term in the Kubernetes ecosystem and perhaps one of the most divisive one as well. Many accept and use the tool, many refuse to touch it and always look for raw yaml alternatives.

But Helm does two things well:

- packaging
- and templating

In this guide you will get practical knowledge on how-to use Helm focusing on those usecases, packaging and templating, that by the way also underpin Gimlet.

This guide emphasizes simplicity and ease of use. Being an exhausting guide of Helm features is a non-goal. The goal is that in the 5 minutes that this guide takes you, you will get from *"Helm, wtf?"* to *"Helm, this ain't so bad"*.

Let's not waste any more time and let's get to it, shall we?

## Prerequisites
- You have access to a Kubernetes cluster. Use [k3d](https://github.com/rancher/k3d#get) if you don't have one.
- You have `kubectl` installed. Follow [this guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/) if you don't have it.
- You have Helm installed. Curl to bash it if you live on the edge, <br />
`curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` <br /> or look for installation alternatives at [https://helm.sh/docs/intro/install/](https://helm.sh/docs/intro/install/)

## Helm as a source of packaged infrastructure tools

If you need a quick and dirty way to install a database, queuing engine or any infrastructure component on Kubernetes, chances are that the infrastructure component has a good enough official or community Helm chart that will get it installed with okay defaults.

This may not match the infrastructure as code tool of your choice, but to see how the component looks installed, and to get inspired how you can automate the component's installation, Helm is the go-to tool. Knowing the basic commands of Helm is a must have.

Let's see quickly how this works with the Redis project!

- I typically go with a Google search, *"Redis Helm chart"* which gets me to the [bitnami/charts repo on Github](https://github.com/bitnami/charts/tree/master/bitnami/redis) as the first result.
- Now typically you can find a Helm chart in the Github organization of the software you want to install, with Redis however there is only a community chart. Judging the trustworthiness of community charts is often not easy. You may get help on slack channels, in this case I just know that Bitnami's charts are often good, so I will go with it.
- Following the steps on the `bitnami/charts` repo installing the Helm chart is nothing more than the typical Helm two liners:

```
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm install my-release bitnami/redis
```

todo install output
todo values file and configuring helm charts
round up the usecase

## Templating
helm template
knowing what's in the helm chart
navigating on git
golang template basics
helm create command
Onechart






