---
layout: gimlet-cli
title: Manage environments with Gimlet and GitOps
lastUpdated: 2020-12-11
tags: [gimletcli]
---

# Manage environments with Gimlet and GitOps

In this guide you will learn how you can manage a staging and production environment by using Gimlet CLI, and by adopting the GitOps Continuous Delivery technique.

#### Prerequisites

- A Helm Chart that you use today to deploy your application to Kubernetes

Note: If you deploy plain yaml today with your own tooling, we recommend that you read the 
[Deploy your app to Kubernetes without the boilerplate](/gimlet-cli/deploy-your-app-to-kubernetes-without-the-boilerplate) 
guide, and see if our lightweight Helm approach works for you. 

## Why GitOps

Whether you deploy today from your laptop, or from CI, you have a set of commands - or plugin - to install the chart, and you have to have Kubernetes access to be able to perform these commands.

With GitOps, your deployment step is simplified. You only interact with git by writing your manifests to it, then the GitOps controller will apply these changes on the cluster, in a separate workflow.

This split allows for a more declarative software delivery flow - you record in git what state the cluster needs to be in, and leave the rollout for standardized tooling. 

This split also allows you to move responsibilities out of the CI pipeline, and out from custom scripts, reducing the maintenance burden.

In this guide you will use Gimlet to bootstrap the GitOps flow, and manage environments declaratively.

## How to manage environments declaratively

In scripts and CI, we speak in procedural terms: install this chart, set this variable, roll back the changes, if this, then that.

In a software delivery however, we use different words: staging has this fix, production has the new feature.

To manage environments effectively, we have to capture this in our configuration, in an environment configuration file.

## Creating the environment file

With Gimlet, environment configuration happens in the source code repository, in environment config files:

```yaml
# .gimlet/staging.yaml
app: myapp
env: staging
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.10.0
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
  version: 0.10.0
values:
  replicas: 2
  image:
    repository: myapp
    tag: 1.0.0
  ingress:
    host: myapp.mycompany.com
    tlsEnabled: true
```

This looks rather similar to Helm's `values.yaml` file. 
Not by accident, the `values` field carries the content that you previously placed in the `values.yaml` file, or set with `--set` flags on `helm install`.

In addition, it captures the name of the application instance, the logical name of the environment, the namespace where it goes, and the chart name and version.

Capturing the chart name and version also lifts responsibilities from CI as it allows you deploy different manifest version on different environments, without modifying the CI pipeline.

To create your first environment file, use `gimlet manifest create` on your values file:

```bash
gimlet manifest create \
  -f values.yaml \
  --env staging \
  --app myapp \
  > .gimlet/staging.yaml
```

Continue reading to see how you get Kubernetes manifests from the environment file.

## Generating Kubernetes manifests for an environment

Gimlet CLI processes the environment file and helps interacting with the GitOps repo.

Run `gimlet manifest template` to get Kubernetes manifests from your environment file:

```bash
gimlet manifest template \
  -f .gimlet/staging.yaml \
  -o manifests.yaml
```

It knows how to process the gimlet manifest file and essentially performs the equivalent of `helm template` to produce the Kubernetes manifests.

Now that you have tools to manage environments, let's tie it back to GitOps.

## Write manifests to the GitOps repository

`gimlet gitops write` is the command to write manifests to a working copy of the GitOps repository:

```bash
gimlet gitops write -f manifests.yaml \
  --env staging \
  --app myapp \
  --gitops-repo-path <<path-to-working-copy-of-the-gitops-repo>> \
  -m "Releasing Bugfix 345"
```

Notice that it requires the path of the checked out GitOps repository, so you, or your CI has to have a working copy of the repository.
Gimlet prefers a central GitOps repository, one that is separate from the application codebase.

## Next Steps

There are a few of paths you can take:

- You can read how to [Kick-off GitOps with Gimlet](/gimlet-cli/kick-off-gitops-with-gimlet)

- or read the reference of 
  - [gimlet manifest create]()
  - [gimlet manifest template]()
  - or [gimlet gitops write]()

