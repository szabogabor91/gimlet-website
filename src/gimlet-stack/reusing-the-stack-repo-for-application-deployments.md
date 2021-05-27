---
layout: gimlet-stack
title: Reusing the stack repo for application deployments
lastUpdated: 2021-05-26
image: gimlet-stack.png
tags: [gimlet-stack]
---

# Reusing the stack repo for application deployments

Since your stack git repository has a working gitops loop set up, it is tempting to reuse it
to deliver other types of applications, not just components of your cluster infrastructure.

For that, let's take a look at the folder structure:

```bash
.
├── flux
│   ├── deploy-key.yaml
│   ├── flux.yaml
│   └── gitops-repo.yaml
├── helm-releases
│   ├── grafana.yaml
│   ├── ingress-nginx.yaml
│   └── loki.yaml
├── helm-repositories
│   ├── grafana.yaml
│   └── ingress-nginx.yaml
├── manifests
│   ├── grafana-dashboard-logs.yaml
│   ├── grafana-dashboard-nginx.yaml
│   ├── grafana-datasources.yaml
│   └── namespace.yaml
└── stack.yaml
```


For a few applications you can reuse the existing folder structure and add a Kubernetes manifests to the `manifests` folder, or HelmReleases to the
`helm-releases` folder.

If you prefer to be more organized, you can group your additional applications to an `app` folder

## Sync a new `app` folder with GitOps

The Flux gitops controller has a git repository and folder configuration under the `flux/gitops-repo.yaml` path.

```yaml
# flux/gitops-repo.yaml
---
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: GitRepository
metadata:
  name: gitops-repo
  namespace: flux-system
spec:
  interval: 15s
  ref:
    branch: master
  secretRef:
    name: gitops-repo
  url: ssh://git@github.com/laszlocph/k8s-stack
---
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: gitops-repo
  namespace: flux-system
spec:
  interval: 10m0s
  path: ./
  prune: true
  sourceRef:
    kind: GitRepository
    name: gitops-repo
  validation: client
```

By default, it is configured to sync the whole git repository therefor syncing a new folder to the cluster doesn't require any new configuration.
