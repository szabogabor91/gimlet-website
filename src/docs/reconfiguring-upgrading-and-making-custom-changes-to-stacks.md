---
layout: docs
title: Reconfiguring a stack
lastUpdated: 2021-05-26
image: gimlet-stack.png
tags: [docs]
---

# Reconfiguring, upgrading and making custom changes to stacks

## Reconfiguring a stack

When you run `stack configure` and configure components on the UI, the configuration options are stored in a file
called `stack.yaml`. 

When next time you run `stack configure` the configuration options are read from `stack.yaml` and you can reconfigure your settings.
As you can see, the `stack.yaml` file contains the full configuration of your stack, and you should version it in your stack repository.

## Always re-generate after you reconfigured

`stack.yaml` is Gimlet Stack's own format, therefore for your configuration changes to be effective on the cluster, 
make sure to run `stack generate` every time you make changes to the `stack.yaml` file. Be that changes through the UI or manually.

Once you ran `stack generate` and made a git commit and pushed, you should see the changes on your cluster.

## Stack version is locked

`stack.yaml` has a reference to the stack template, under the `stack.repository` field it points to a git repository where the stack files are maintained.

```yaml
---
stack:
  repository: https://github.com/gimlet-io/gimlet-stack-reference.git?tag=v0.8.0
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

## Automatic updates

You can automate stack upgrades by using automation provided by Gimlet Stack.

The implemented [Github Action](https://github.com/gimlet-io/gimlet-stack-updater-action/pull/11)

- periodically checks for updates,
- runs `stack update` on new versions
- and opens a Pull Request with the new version
- it can also assign you as reviewer

![Stack updater Github Action](/stack-updater.png)

See the action in an [example workflow](https://github.com/gimlet-io/gimlet-stack-updater-action/blob/main/.github/workflows/demo.yml).


# Making custom changes to a stack

Stack templates only go so far, and it is inevitable that you want to amend the generated manifests in slight ways.

`stack generate` takes your custom changes into account and keeps them even after a configuration change, or an upgrade.

In case your custom change is conflicting with the generated content, you have to do a content merge, that should be familiar from git.

## Custom changes that conflicts

The bellow output was from a stack that was upgraded from `0.2.0` to `0.3.0` and having a custom change on top of `0.2.0`.

The stack 
operator manually upgraded the version to `3.27.0`.

Since stack version `0.3.0` also updates the ingress-nginx version, now the operator has to make a judgment call whether to keep
the manually updated version or roll with generated changes.

```yaml
---
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: ingress-nginx
  namespace: infrastructure
spec:
  interval: 60m
  releaseName: ingress-nginx
  chart:
    spec:
      chart: ingress-nginx
<<<<<<<<< Your custom settings
      version: 3.27.0
=========
      version: 3.33.0
>>>>>>>>> From stack generate
      sourceRef:
        kind: HelmRepository
        name: ingress-nginx
      interval: 10m
```

Many editors have conflict resolution tooling. With a click of a button, the operator can accept the changes coming `From stack generate`.
