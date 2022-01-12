---
layout: docs
title: Automatically deploy your application to staging
lastUpdated: 2021-11-09
tags: [docs]
---

# Automatically deploy your application to staging

In this guide you will set up a deploy policy to automatically deploy every new git commit to staging.

#### Prerequisites

- You have finished the [Manage your staging application configuration](/docs/manage-your-staging-application-configuration) tutorial
- Your cluster administrator has set up GimletD for your cluster. If you are the cluster adminstrator, then bad luck, go and install GimletD first by following the [Enable release automation with GimletD](/docs/install-gimletd-and-enable-release-automation) tutorial.
- A CI pipeline that builds a docker image on new commits

## Automating staging deploys

To deploy every new main branch commit to staging, add the following deploy policy section to the `.gimlet/staging.yaml` file.

Also, change your image tag to follow your image tagging convention

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
-    tag: 1.1.0
+    tag:  {% raw %}"{{ .GITHUB_SHA }}"{% endraw %}
  ingress:
    host: myapp.staging.mycompany.com
    tlsEnabled: true
```

Gimlet supports [multiple deploy conditions](/docs/configuring-policy-based-deploys#supported-git-refs), but before this is going to work, you have to set up the missing link between your CI and Gimlet. Let's set it up now, shall we?

## The missing link

Before Gimlet can act on your new commits, it must know about every new artifact you build.

Your CI typically

- runs tests
- builds your app
- and also builds a docker image

When it is ready with all that, it must signal Gimlet that there is a new releasable application version.

To do that, you have to extend your CI pipeline with an explicit step that ships this information to Gimlet.

## Shipping artifact information to Gimlet

Gimlet has [CI plugins](/docs/tbdtoreference) that ship the needed artifact information.

First, set the `GIMLET_SERVER` and `GIMLET_TOKEN` secrets for your repository. These are [GimletD API access](/docs/tbdtoreference) credentials that you can get from your cluster administrator.

Then alter your Github Action pipeline to ship the artifact to GimletD.

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

If you do so, your Github Action will ship an artifact after everty docker image build.

![Github Action shipping a Gimlet artifcat](/actions-shipping.png)

## Verify the shipped artifact

To verify the shipped artifact, use the Gimlet CLI:

```bash
$ export GIMLET_SERVER=<<Gimlet server URL>>
$ export GIMLET_TOKEN=<<Gilmet API token>>
                      
$ gimlet artifact list

laszlocph/gimletd-test-repo-dc5b219d-a836-4f84-9890-8dfac2a0e993
1c3f577a - Just another monorepo commit (3 weeks ago) Laszlo Fogas
laszlocph/gimletd-test-repo@main https://github.com/laszlocph/gimletd-test-repo/commit/1c3f577a3b81963d3d9750da79d9ad8536890d9f
  myapp -> staging @ push
```

By now, if GimletD is in place, it also already released your app to staging. Verify the latest commit in the gitops repo to see of GimletD had made the change, and on Kubernetes to see your updated application.
