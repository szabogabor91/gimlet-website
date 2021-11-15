---
layout: docs
title: Bootstrap the gitops automation
lastUpdated: 2020-12-11
tags: [docs]
---

# Bootstrap the gitops automation

In this guide you will use GimletCLI to bootstrap the GitOps workflow, then write application manifests to the GitOps repository and see it deploy.

## Prerequisites

- it is imporant that you read the [The SANE Gitops guide](/concepts/the-sane-gitops-guide)

## Bootstrapping gitops

The gitops controller is a small piece of software running in your Kubernetes cluster.
It monitors your gitops git repository for changes and applies them on the cluster.

To bootstrap the gitops controller

- first create a new git repository and check it out locally
- then use the `gimlet gitops bootstrap` command to put the controller's deploy manifests in the GitOps repository 
- finally, apply the just created manifests on the cluster

Any further changes to the GitOps repository will be automatically applied to the cluster. This is GitOps.🙌

```
gimlet gitops bootstrap \
  --env staging \
  --gitops-repo-path <<path-to-a-working-copy-of-the-gitops-repo>> \
  --gitops-repo-url git@github.com:<user>/<repo>.git
```

Notice that you have to provide a logical environment name to the bootstrap command.
Gimlet prefers a central gitops repository, one that hosts multiple environments in one git repo.

Follow the steps from the command output, to bootstrap the GitOps loop:

```
⏳ Generating manifests
⏳ Generating deploy key
✔️ GitOps configuration written to gitops/staging/flux


👉 1) Push the configuration to git
👉 2) Add the following deploy key to your Git provider

ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC1593b2v[...]

👉 3) Apply the gitops manifests on the cluster to start the gitops loop:

kubectl apply -f gitops/staging/flux/flux.yaml
kubectl apply -f gitops/staging/flux/deploy-key.yaml
kubectl wait --for condition=established --timeout=60s crd/gitrepositories.source.toolkit.fluxcd.io
kubectl wait --for condition=established --timeout=60s crd/kustomizations.kustomize.toolkit.fluxcd.io
kubectl apply -f gitops/staging/flux/gitops-repo.yaml

         Happy Gitopsing🎊
```

## Deploy your first app with GitOps

To see gitops in action, deploy a dummy application now with GitOps.

To do that, you need to place application manifests in the GitOps repository, and push your commit.

First get some dummy yaml to deploy an Nginx container. Gimlet's OneChart Helm chart is perfect for that:

```
helm template dummy-app -n staging onechart/onechart > manifest.yaml
```

Then commit and push the files to the gitops repo under `staging/dummy-app`.

With the push, the gitops controller tries get the cluster state according to the git state, so it will deploy the git changes and the dummy application will pop up in the cluster.

In case you are not seeing it deployed, you can crosscheck the GitOps loop logs with:

```
kubectl logs -n flux-system -f deploy/source-controller
kubectl logs -n flux-system -f deploy/kuatomize-controller
```

## Adding a second gitops repository to a cluster

In case a cluster already has the Flux gitops controller deployed, and you want it to pull from another gitops repo, you can use the `gimlet gitops bootstrap` commands `--no-controller` option.

With that option, Gimlet will not provision the Flux gitops controller, only the gitops repository CRDs.

## Using a one repo per cluster model

Gimlet favors packing multiple environments in the same gitops repo. It uses folders to organize manifests into environments.

Sometimes you want to dedicate a full git repository for the environment.

That case you can use the `--single-env` option of `gimlet gitops bootstrap` when it will place everything in the root of the git repository.
