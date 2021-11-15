---
layout: docs
title: How-to configure preview environments
lastUpdated: 2020-12-11
tags: [docs]
---

# How-to configure preview environments

Branch deploys, review apps, PR deploys, preview environments.. It's called by many names, but the functionality is ubiquitous:

the ability to deploy a non-mainline version of the application on demand, on its own URL.

In this guide you will learn how to set up preview environments with Gimlet's manifest file.

## Gimlet environments recap

The Gimlet environment manifest file is a declarative format to configure which Helm chart, what chart version, and what parameters should be deployed to an environment. 

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

and the best part: the file has variable support.

## Gimlet manifest variable support

The Gimlet manifest resolves Golang templates in the `gimlet manifest template` step.

You provide the variable values in the `--vars` flag, or if you use GimletD for automated deployes, GimletD resolves all variables (context and custom field) that are part of the shipped artifact.

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
    tag: {% raw %}"{{ .GIT_SHA }}"{% endraw %}
  ingress:
    host: myapp.staging.mycompany.com
    tlsEnabled: true

# ci.env
GIT_SHA=d750703d39a6fd8f2f82b34dfce2de9719cc4b98

gimlet manifest template \
  -f .gimlet/staging.yaml \
  -o manifests.yaml \
  --vars ci.env
```

Using variables, configuring per branch preview environments is straightforward.

## Variables enable preview environments

Feature branch deploys is a templating question:

- Names should be unique to avoid collision between application instances
- Names should follow some convention
- It's driven by automation, and git branch name is a typical input parameter

After these considerations, let's see how to configure preview environments.

## How to configure per branch preview environments

One good practice is to add a {% raw %}`-{{ .BRANCH }}`{% endraw %} suffix to the feature branch instances:

```yaml
# .gimlet/preview-env.yaml
app: myapp-{% raw %}{{ .BRANCH }}{% endraw %}
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
    tag: {% raw %}"{{ .GIT_SHA }}"{% endraw %}
  ingress:
    host: "myapp-{% raw %}{{ .BRANCH }}{% endraw %}.staging.mycompany.com"
    tlsEnabled: true

# ci.env
GIT_SHA=d750703d39a6fd8f2f82b34dfce2de9719cc4b98
BRANCH=feature-x

gimlet manifest template \
  -f .gimlet/preview-env.yaml \
  -o manifests.yaml \
  --vars ci.env
```

## Policies for preview app deploys

Now that the naming and templating is covered, using policy based releases, you can define policies that automatically deploy your Pull Requests or branches.

The following snippet deploys app pushes on branches that match the `feature/*` wildcard pattern.
Variables are used to guarantee unique resource names, and avoid collision.

It also applies sanitization on the branch name, to fit Kubernetes resource name limitations, and DNS naming rules.

```diff
# .gimlet/preview-env.yaml
- app: myapp-{% raw %}{{ .BRANCH }}{% endraw %}
+ app: myapp-{% raw %}{{ .BRANCH | sanitizeDNSName }}{% endraw %}
env: staging
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.32.0
+deploy:
+  branch: feature/*
+  event: push
values:
  replicas: 1
  image:
    repository: myapp
    tag: {% raw %}"{{ .GIT_SHA }}"{% endraw %}
  ingress:
-    host: "myapp-{% raw %}{{ .BRANCH }}{% endraw %}.staging.mycompany.com"
+    host: "myapp-{% raw %}{{ .BRANCH | sanitizeDNSName }}{% endraw %}.staging.mycompany.com"
    tlsEnabled: true
```

The next example is using the `event: pr` trigger to deploy Pull Requests:

```diff
# .gimlet/preview-env.yaml
app: myapp-{% raw %}{{ .BRANCH | sanitizeDNSName }}{% endraw %}
env: staging
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.32.0
deploy:
-  branch: feature/*
-  event: push
  event: pr
values:
  replicas: 1
  image:
    repository: myapp
    tag: {% raw %}"{{ .GIT_SHA }}"{% endraw %}
  ingress:
    host: "myapp-{% raw %}{{ .BRANCH | sanitizeDNSName }}{% endraw %}.staging.mycompany.com"
    tlsEnabled: true
```

For all the possibilities please refer to the [Configuring policy-based deploys](/docs/configuring-policy-based-deploys#supported-git-refs)
