---
layout: gimlet-cli
title: gimelt seal
lastUpdated: 2020-12-09
tags: [gimletcli]
---

# `gimlet seal`

Seals secrets in the manifest.

Requires a sealing key, and a [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) controller running in your cluster.

## Usage
```
NAME:
gimlet seal - Seals secrets in the manifest

USAGE:
gimlet seal -f values.yaml -o values.yaml -p sealedSecrets -k sealingKey.crt

OPTIONS:
--file value, -f value    manifest file,folder or "-" for stdin (mandatory)
--path value, -p value    path of the field to seal (mandatory)
--key value, -k value     path to the sealing key (mandatory)
--output value, -o value  output sealed file
--help, -h                show help (default: false)
```

## Examples

#### Sealing a Helm values file

```
gimlet seal -f values.yaml -o values.yaml -p sealedSecrets -k sealingKey.crt
```

#### Sealing a Gimlet manifest

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
    tag: 1.0.0
  sealedSecrets:
    secret1: secret-value-to-be-sealed

gimlet seal -f .gimlet/staging.yaml \
  -o .gimlet/staging.yaml \
  -p values.sealedSecrets \
  -k sealingKey.crt
```
