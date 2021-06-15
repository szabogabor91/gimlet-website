---
layout: gimlet-cli
title: Preview environments with Gimlet
lastUpdated: 2020-12-11
tags: [gimletcli]
---

# Preview environments with Gimlet

Branch deploys, review apps, PR deploys, preview environments.. It's called by many names, but the functionality is ubiquitous:

the ability to deploy a non-mainline version of the application on demand, on its own URL.

In this guide you will learn how to set up preview environments with Gimlet's manifest file.

## Gimlet environments recap

The Gimlet environment - or manifest - file is a declarative format to configure which Helm Chart, what Chart version, and what parameters should be deployed to an environment. 

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
```

and the best part: the file has variable support.

## Gimlet manifest variable support

The Gimlet manifest resolves Golang templates in the `gimlet manifest template` step.

You provide the variable values in the `--vars` flag.

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

With variables, configuring per branch preview environments is straightforward.

## Variables enable preview environments

Feature branch deploys is a templating question:

- Names should be unique to avoid collision between application instances
- Names should follow some convention
- It's driven by CI, and git branch name is a typical input parameter

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
  version: 0.10.0
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

## Next Steps

There are a few of paths you can take:

- You can learn more about the manifest file and see how to [Manage environments with Gimlet and GitOps](/gimlet-cli/manage-environments-with-gimlet-and-gitops)

- or you can read how to [Bootstrap GitOps with Gimlet](/gimlet-cli/bootstrap-gitops-with-gimlet) and work with the GitOps repo from CI

- or read the reference of
  - [gimlet manifest create]()
  - [gimlet manifest template]()
  - or [gimlet gitops write]()

