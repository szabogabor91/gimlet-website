---
layout: gimlet-cli
title: gimlet manifest create
lastUpdated: 2020-12-09
tags: [gimletcli]
---

# `gimlet manifest create`

Creates a Gimlet manifest from a Helm Chart and matching `values.yaml` file.

## Usage

```
NAME:
   gimlet manifest create - Creates a Gimlet manifest

USAGE:
   gimlet manifest create -f values.yaml --app my-app --env staging > .gimlet/staging-myapp.yaml

OPTIONS:
   --env value                  environment your application is deployed to (mandatory)
   --app value                  name of the application that you configure (mandatory)
   --namespace value, -n value  the Kubernetes namespace to deploy to (mandatory)
   --chart value, -c value      Helm chart to deploy (mandatory)
   --file value, -f value       Helm chart values file location to include in the manifest, or "-" for stdin
   --output value, -o value     output manifest file
   --help, -h                   show help (default: false)

```

## Examples

### Creating manifest

```
gimlet manifest create \
  -f values.yaml \
  --chart onechart/onechart
  --env staging \
  --app myapp \
  --namespace my-team
  > .gimlet/staging.yaml
```

### Creating manifest from a values coming from standard in

```
gimlet chart configure onechart/onechart | \
  gimlet manifest create \
    -f - \
    --chart onechart/onechart
    --env staging \
    --app myapp \
    --namespace my-team
    > .gimlet/staging.yaml
```
