---
layout: docs
title: Manage your staging application configuration
lastUpdated: 2021-11-09
tags: [docs]
---

# Manage your staging application configuration

In this guide you will 

- configure your staging application deployment in a declarative file, called the Gimlet manifest
- and set up a deploy policy to automatically deploy every new git commit to staging

#### Prerequisites

- You have finished the [Deploy your app to Kubernetes without the boilerplate](/docs/deploy-your-app-to-kubernetes-without-the-boilerplate) tutorial
- Your cluster administrator has set up GimletD for your cluster. If you are the cluster adminstrator, then bad luck, go and install GimletD first by following the [Enable release automation with GimletD](/docs/enable-release-automation-with-gimletd) tutorial.<br />You may do this tutorial without GimletD for the most part. Your automation won't work but you will learn about the Gimlet manifest file.

## Let's go declarative

In the [Deploy your app to Kubernetes without the boilerplate](/docs/deploy-your-app-to-kubernetes-without-the-boilerplate) tutorial you got familiar

- with the `values.yaml` file to store configuration parameters for the Helm chart
- and also the `helm template` command with its parameters to render the manifests

Gimlet introduces the Gimlet environment manifest file that captures those two things in a single file.

This way the configuration options, and the command parameters are managed together: right in your source code repository.

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

They looks rather similar to Helm's `values.yaml` file.

Not by accident, the `values` field carries the content that you previously placed in the `values.yaml` file.

In addition, it captures the name of the application instance, the logical name of the environment, the namespace where it goes, and the chart name and version.

Capturing the chart name and version also lifts responsibilities from CI as it allows you deploy different manifest version on different environments, without modifying the CI pipeline.

To create your first environment file, use `gimlet manifest create` on your values.yaml file from the previous tutorial:

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

Gimlet CLI has numerous tools that helps your local workflows. With the `gimlet manifest template` command you can render the exact Kubernetes manifest that is later applied on the cluster through automation. If in doubt, you can always fallback to this method to debug your manifests.

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
Time to automate things, but first, coffee time!


<img src="/dev-coffee.svg" class="mx-auto my-16" alt="Dev drinking coffee" />


## Automating staging deploys

To deploy every new commit on the main branch, add the following deploy policy section to the `.gimlet/staging.yaml` file.

```diff
# .gimlet/staging.yaml
app: frontend
env: staging
namespace: my-team
+deploy:
+  branch: main
+  event: push
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.32.0
values:
  replicas: 2
  image:
    repository: myapp
    tag: 1.1.0
  ingress:
    host: myapp.staging.mycompany.com
    tlsEnabled: true
```

Gimlet supports [multiple deploy conditions]((tbd to reference)), but before this is going to work, you have to set up the missing link between your CI and Gimlet. Let's set it up now, shall we?

## The missing link

Before Gimlet can act on your new commits, it must know about every new artifact you build.

Your CI

- runs tests
- builds your app
- and also builds a docker image

When it is ready with all that, it must signal Gimlet that there is a new releasable application version.

To do that, you have to extend your CI pipeline with an explicit step that ships this information to Gimlet.

## Shipping artifact information to Gimlet

Gimlet has [CI plugins](tbd to reference) that ship the needed artifact information.

Alter your Github Action pipeline to ship the artifact to GimletD.

```diff
name: Build
on:
  push:
    branches:
      - 'main'

jobs:
  shipping-artifact:
    runs-on: ubuntu-latest
    name: "Shipping artifact"
    needs:
    - docker-build
    steps:
    - name: Check out
      uses: actions/checkout@v1
      with:
        fetch-depth: 1
+    - name: Shipping release artifact to Gimlet
+      id: shipping
+      uses: gimlet-io/gimlet-artifact-shipper-action@v0.4.2
+      env:
+        GIMLET_SERVER: ${{ secrets.GIMLET_SERVER }}
+        GIMLET_TOKEN: ${{ secrets.GIMLET_TOKEN }}
```

Set the `GIMLET_SERVER` and `GIMLET_TOKEN` secrets for your repository. These are [GimletD API access](tbd to reference) credentials.
Get them rom your cluster administrator.

TODO:
screenshot from artifact shipment

TODO
confirm artifact shipment with
`gimlet artifact list`

