---
layout: gimlet-cli
title: Bootstrap GitOps with Gimlet
lastUpdated: 2020-12-11
tags: [gimletcli]
---

# Bootstrap GitOps with Gimlet

In this guide you will use Gimlet to bootstrap the GitOps workflow, then write application manifests to the GitOps repository and see it deploy.

But first, some GitOps concepts.

## How GitOps differs from other automation

Whether you deploy today from your laptop, or from CI, you have a set of commands - or plugin - to install the Kubernetes manifests, and you have to have Kubernetes access to be able to perform these commands.

With GitOps, your deployment step is simplified. You only interact with git by writing your manifests to it, then the GitOps controller will apply these changes on the cluster, in a separate workflow.

This split allows for a more declarative software delivery flow - you record in git what state the cluster needs to be in, and leave the rollout for standardized tooling.

In this guide you will use Gimlet to bootstrap the GitOps controller and will also use Gimlet to write manifests to the GitOps repository. 

## Bootstrapping GitOps

The GitOps controller is a small piece of software running in your Kubernetes cluster.
It monitors your GitOps git repository for changes and applies them on the cluster.

To bootstrap the GitOps controller

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
Gimlet prefers a central GitOps repository, one that hosts multiple environments in one git repo.

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

To see GitOps in action, deploy a dummy application now with GitOps.

To do that, you need to place application manifests in the GitOps repository, and push your commit.

The `gimlet gitops write` command is a helper to do just that:

```
# get some dummy yaml to deploy an Nginx container
helm template dummy-app -n staging onechart/onechart > manifest.yaml

# in the working copy of your gitops repo
gimlet gitops write -f manifest.yaml \
  --env staging \
  --app dummy-app \
  -m "My first deploy with GitOps"
```

Inspect the changes in the GitOps repo and push it.

The dummy application will pop up in the cluster.

In case you are not seeing it deployed, you can crosscheck the GitOps loop logs with:

```
kubectl logs -n flux-system -f deploy/source-controller
```

## Working with GitOps in CI

To work with GitOps in CI pipelines, you have to be able to check out the GitOps repository and be able to push to it from your pipeline.

Since the GitOps repository is not the same repository as the one the CI pipeline builds,
here is a set of example pipelines on how to check out and write the GitOps repository from the different CI engines.

#### Jenkins
[https://github.com/gimlet-io/jenkins-example](https://github.com/gimlet-io/github-actions-example)

#### Github actions
[https://github.com/gimlet-io/github-actions-example](https://github.com/gimlet-io/github-actions-example)

## Next steps

- Read how you can manage your environments in the [Manage environments with Gimlet and GitOps](/gimlet-cli/manage-environments-with-gimlet-and-gitops) guide.

- or read the reference of [gimlet gitops write](/gimlet-cli/gitops-write)
