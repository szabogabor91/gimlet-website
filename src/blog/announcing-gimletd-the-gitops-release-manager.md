---
layout: post
title: "Announcing GimletD, the gitops release manager"
date: 2021-03-16
excerpt: |
    Today, I am thrilled to announce GimletD, the gitops release manager component of Gimlet.
    See what GimletD brings to the gitops ecosystem.

topic: Product Updates
image: gimletd-with-gitops.png
tags: [posts]
---

Today, I am thrilled to announce GimletD, the gitops release manager component of Gimlet.

A little more than two months ago I launched Gimlet CLI to bring conventions to the gitops repository, and a CLI to operate within those conventions.

Gimlet CLI enjoyed a decent industry buzz since its launch. Concepts that it introduced - OneChart, and the Gimlet manifest - sparked some interest in industry collaboration which warns my heart very much.

Especially, because even then I knew that GimletD is not long before it gets released, and it is also built around those concepts.

## GimletD builds on the workflow that Gimlet CLI introduced and extends it with a centralized approach for managing releases

First, let's see how the workflow looks with Gimlet CLI and what GimletD brings to the table.

You put the Gimlet environment manifest file in your application source code repository.

This declaratively captures all there is to be captured about an application environment, be that staging, production or a throw away environment.

```yaml
# .gimlet/staging.yaml
app: myapp
env: staging
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.15.3
values:
  replicas: 1
  image:
    repository: myapp
    tag: {% raw %}{{ .GIT_SHA }}{% endraw %}
  ingress:
    host: myapp.staging.mycompany.com
    tlsEnabled: true
```

Then you use Gimlet CLI's `gimlet manifest template` command to render the specified Helm chart:
- either locally to debug your manifest
- or on CI you pipe it into `gimlet gitops write` to update your gitops repository
- or on CI you pipe it to `kubectl apply` if you don't fancy gitops too much

While we are soon providing plugins to all major CI engines - so that you write fewer scripts - you are still wiring everything together in CI pipelines.

To move much of the CD logic out of your burgeoning CI pipelines, we are launching GimletD to pack all release automation logic in a standardized toolchain.

This will not just reduce the size of your CI pipelines, but also allow for centralized control.

## GimletD allows for centralized control over releases, and flexibility to add new deployment features to all applications at once

GimletD is a server-side component. It listens for new releasable software versions and matches them against the existing deployment policies.

You can set the deployment policies trough the now extended manifest file:

```diff
# .gimlet/staging.yaml
app: myapp
env: staging
namespace: my-team
+deploy:
+  branch: main
+  event: push
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.15.3
values:
  replicas: 1
  image:
    repository: myapp
    tag: {% raw %}{{ .GIT_SHA }}{% endraw %}
  ingress:
    host: myapp.staging.mycompany.com
    tlsEnabled: true
```

When a new software version matches this policy, GimletD will render the manifest and write it to the gitops repository.
Just like you did so in CI with `gimelt manifest template` and `gimlet gitops write`.

There is only one missing piece to make this possible.

## Introducing the release artifact to detach the release workflow from CI

With GimletD, CI pipelines create an artifact for every releasable version of the application, but not release them.

GimletD then serves as a release manager to perform ad-hoc or policy based releases.

The artifact itself is a json structure that you can create with our CI plugins, or with Gimlet CLI's `gimlet artifact *` commands.

![GimletD operates on the release artifacts, manages the GitOps repository](/gimletd-with-gitops.png)

## Ad-hoc releases, rollbacks and other actions

Now that you have an overview of how GimletD fits into Gimlet see how to perform ad-hoc releases, rollbacks and other actions in the [GimletD documentation](http://localhost:8080/gimletd/on-demand-releases/).

Make sure also to follow [gimlet_io](https://twitter.com/gimlet_io) as I'm going to live demo GimletD on Thursday, 25th March on Twitter.

Twice actually, first at 11AM CET, then 3PM ET.

Onwards!
