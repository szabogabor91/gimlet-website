---
layout: gimlet-stack
title: Upgrading a stack
lastUpdated: 2021-05-26
image: gimlet-stack.png
tags: [gimlet-stack]
---

# Upgrading a stack

## Stack version is locked

`stack.yaml` has a reference to the stack template, under the `stack.repository` field it points to a git repository where the stack files are maintained.

```yaml
---
stack:
  repository: https://github.com/gimlet-io/gimlet-stack-reference.git?tag=v0.3.0
config:
  loki:
    enabled: true
  nginx:
    enabled: true
    host: laszlo.cloud
```

By default, it is locked to a particular version, therefore every time you run `stack generate` it works with the same stack version and generates Kubernetes resources accordingly.

## Updating

`stack update --check` displays the new versions that can be applied to your stack, while
running `stack update` will update `stack.yaml` to the latest stack version number:

```bash
$ stack update

⏳  Stack version is updating to v0.3.0... 

✔️   Config updated. 

⚠️   Run `stack generate` to render resources with the updated stack. 

📚  Change log:

   - v0.3.0 
      • Cert Manager - Just a bugfix release
      • Grafana to 8.0.1 🎉
        • Plenty of goodies, see for yourself: [https://grafana.com/docs/grafana
          /latest/whatsnew/whats-new-in-v8-0/](https://grafana.com/docs/grafana/
          latest/whatsnew/whats-new-in-v8-0/)
      • Ingress Nginx from 0.44 to 0.47
        • Updates NGINX to version v1.20.1
      • Loki - just keeping track of the latest release - nothing major in this
        one.
      • Prometheus
        • Upgrading node-exporters and kube-state-metrics to the latest
      • Sealed Secrets to 0.16.0 - nothing major in this one
```

Important that you have to run `stack generate` to generate the updated Kubernetes manifests, as `stack update` only updates the stack reference in `stack.yaml`.

Make sure to

- inspect the change set 
- resolve possible [conflicts with custom changes](/gimlet-stack/custom-changes-to-a-stack/#custom-changes-that-conflicts)
- push to git

## Automatic updates:

You can automate stack upgrades by using automation provided by Gimlet Stack.

The implemented [Github Action](https://github.com/gimlet-io/gimlet-stack-updater-action/pull/11)

- periodically checks for updates,
- runs `stack update` on new versions
- and opens a Pull Request with the new version
- it can also assign you as reviewer

![Stack updater Github Action](/stack-updater.png)

See the action in an [example workflow](https://github.com/gimlet-io/gimlet-stack-updater-action/blob/main/.github/workflows/demo.yml).
