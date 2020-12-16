---
layout: gimlet-cli
title: gimlet manifest template
lastUpdated: 2020-12-09
tags: [gimletcli]
---

# `gimlet manifest template`

Templates a Gimlet manifest.

Resolves template variables and templates the referenced Helm Chart with the values specified.

All environment variables from the shell are available in the template. You can also provide a `.env` file for additional variables.

## Usage

```
NAME:
   gimlet manifest template - Templates a Gimlet manifest

USAGE:
   gimlet manifest template \
    -f .gimlet/staging.yaml \
    -o manifests.yaml \
    --vars ci.env

OPTIONS:
   --file value, -f value    Gimlet manifest file to template, or "-" for stdin
   --vars value, -v value    variables file for the templating
   --output value, -o value  output file
   --help, -h                show help (default: false)
```

## Examples

#### Templating a Helm Chart with values

```
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

gimlet manifest template \
  -f .gimlet/staging.yaml \
  -o manifests.yaml \
```

#### Using variables in the manifest
```
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
    tag: {% raw %}{{ .GIT_SHA }}{% endraw %}
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

#### Output folder

Splits the manifests to Kubernetes objects

```
gimlet manifest template \
  -f .gimlet/staging.yaml \
  -o manifests/
```
