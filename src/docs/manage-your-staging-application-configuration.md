---
layout: docs
title: Manage your staging application configuration
lastUpdated: 2021-11-09
tags: [docs]
---

# Manage your staging application configuration

In this guide, you will configure your staging application deployment in a declarative file, called the Gimlet manifest.

#### Prerequisites

- You have finished the [Deploy your app to Kubernetes without the boilerplate](/docs/deploy-your-app-to-kubernetes-without-the-boilerplate) tutorial

## Let's go declarative

In the [Deploy your app to Kubernetes without the boilerplate](/docs/deploy-your-app-to-kubernetes-without-the-boilerplate) tutorial you got familiar

- with the `values.yaml` file to store configuration parameters for Helm charts
- and also the `helm template` command and its parameters to render manifests

Gimlet introduces the Gimlet environment manifest file that captures those two things in a single file.

This way the configuration options, and the command parameters are managed together: in a file right in your source code repository.

## Introducing the Gimlet environment manifest

With Gimlet, environment configuration happens in your source code repository, in Gimlet environment manifest files:

```yaml
# .gimlet/staging.yaml
app: myapp
env: staging
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.32.0
values:
  replicas: 1
  image:
    repository: myapp
    tag: 1.1.0
  ingress:
    host: myapp.staging.mycompany.com
    tlsEnabled: true
```

It looks rather similar to Helm's `values.yaml` file.

Not by accident, the `values` field carries the content that you previously placed in the `values.yaml` file.

In addition, it captures the name of the application instance, the logical name of the environment, the namespace where it goes, and the chart name and version.

Capturing the chart name and version also lifts responsibilities from CI, as it allows you to deploy different manifest versions on different environments, without modifying the CI pipeline.

To create your first environment file, use `gimlet manifest create` on your values.yaml file from the previous tutorial. It reads the values.yaml file, and converts its contents into the Gimlet manifest format.

```bash
gimlet manifest create \
  -f values.yaml \
  --env staging \
  --app myapp \
  --chart onechart/onechart \
  --namespace my-team \
  > .gimlet/staging.yaml
```

```yaml
app: myapp
env: staging
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.32.0
values:
  replicas: 1
  image:
    repository: myapp
    tag: 1.1.0
  ingress:
    host: myapp.staging.mycompany.com
    tlsEnabled: true
```

Continue reading to see how you get Kubernetes manifests from the environment file.

## Generating Kubernetes manifests for an environment

Gimlet CLI has numerous tools that help your local workflows. With the `gimlet manifest template` command, you can render the exact Kubernetes manifest that is later applied on the cluster through automation. If in doubt, you can always fall back to this method to debug your manifests.

Now run `gimlet manifest template` to get Kubernetes manifests from your environment file:

```bash
gimlet manifest template \
  -f .gimlet/staging.yaml \
  -o manifests.yaml
```

It knows how to process the gimlet manifest file and essentially performs the equivalent of `helm template` to produce the Kubernetes manifests.

Now that you have the tool to manage environments, make a change in the `.gimlet/staging.yaml` file:

- increase the replica count to 2
- render the manifests
- and apply it on the cluster

```
gimlet manifest template \
  -f .gimlet/staging.yaml | kubectl apply -f -
```

Cool, now you can control your environment.
Time for a coffee!


<img src="/dev-coffee.svg" class="mx-auto my-16" alt="Dev drinking coffee" />
