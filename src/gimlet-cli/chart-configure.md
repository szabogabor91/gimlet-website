---
layout: gimlet-cli
title: gimlet chart configure
lastUpdated: 2020-12-09
tags: [gimletcli]
---

# `gimlet chart configure`

Generates a Helm `values.yaml` file for the given Helm Chart.

It launches a browser tab where you can discover and set the deployment options.

## Usage

```
NAME:
gimlet chart configure - Configures Helm chart values

USAGE:
gimlet chart configure onechart/onechart > values.yaml

OPTIONS:
--file value, -f value    edit existing values file
--output value, -o value  output values file
--help, -h                show help (default: false)
```

## Examples

#### Experimenting with chart values

```
$ gimlet chart configure onechart/onechart
👩‍💻 Configure on http://127.0.0.1:28955
👩‍💻 Close the browser when you are done
Browser opened
```

![gimlet chart configure](/chart-configure.png)

```
Browser closed
📁 Generating values..
---
image:
  repository: myapp
  tag: 1.0.0
ingress:
  host: myapp.local
  tlsEnabled: true
replicas: 2
```

#### Saving chart values to `values.yaml`

```
gimlet chart configure onechart/onechart > values.yaml
```

#### Editing existing chart values

```
gimlet chart configure \
  -f values.yaml \
  -o values.yaml \
  onechart/onechart
```
