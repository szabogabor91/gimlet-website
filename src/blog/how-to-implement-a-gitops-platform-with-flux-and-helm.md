---
layout: post
title: How to implement a gitops platform with Flux and Helm
date: 2020-06-10
image: leafs.jpg
image_author:  Phil Hearing
image_url: https://unsplash.com/photos/KH9_FVZmmb4
excerpt: |
    In this blog post you will learn how to implement a gitops platform at your company, using Flux and Helm.
topic: Ecosystem
tags: [posts]
---

In this blog post you will learn how to implement a gitops platform at your company, using Flux and Helm.

What you need as a prerequisite is 
- a Kubernetes cluster
- a project you already deploy to Kubernetes from a CI pipeline
- you configure this application with Helm 

You will deploy this project to Kubernetes with the gitops approach, side-by-side of your existing deployment.
At the end of this how-to, you will be able to judge how gitops fits your workflow.

If you use Kustomize today, we made a guide for that too.
See [How to implement a gitops platform with Flux and Kustomize](https://gimlet.io/blog/how-to-implement-a-gitops-platform-with-flux-and-kustomize/)

## Start with creating an empty git repository

With gitops, we store all manifests in a git repository. Let's create it now.

Any name would work, but use `gitops` as name, and add a `README.md` file as a courtesy.

## Early decisions

There are a couple gitops controllers out there, in this post we chose Flux. Flux is a single purpose tool, and the simplest approach to gitops.

Furthermore, we will use Flux only to synchronize git state to the Kubernetes cluster.
We are going to avoid `fluxctl`, Flux's CLI tool. It is both a convenience tool, and an opinionated workflow to use Flux and
we opted to not use it in this how-to. We did so to have a full understanding of what is happening in the cluster.


This how-to also assumes that you use Helm at your company, so we are going to use Helm both to configure your deployed applications, and installing Flux.

## Continue with installing Flux

For installation, we follow loosely the official [Get started with Flux using Helm](https://docs.fluxcd.io/en/latest/tutorials/get-started-helm/) guide.

But, instead of running a one off `helm upgrade` command, you will capture the Flux configuration in the `values.yaml` file first.
You can see the documentation of each field at the [chart's default values file](https://github.com/fluxcd/flux/blob/master/chart/flux/values.yaml).

```bash
export GHUSER="YOURUSER"
export GITOPS_REPO="gitops"
cat > values.yaml <<EOF
image:
  tag: 1.19.0

git:
  url: git@github.com:${GHUSER}/${GITOPS_REPO}
  path: releases/staging
  readonly: true
  pollInterval: 5s

registry:
  disableScanning: true

memcached:
  enabled: false

manifestGeneration: true
EOF
```

The values are significantly different from what is in the official installation guide:

- `git.readonly: true`

Disables fluxctl release workflows. You will deploy through CI every time, and the version change will be captured as a git commit.


- `git.pollInterval: 5s`

To speed up releases. The default is 5 minutes.


- `git.path: releases/staging,releases/production`

Configures Flux to deploy everything from the releases/staging and releases/production  folder of the gitops repo.


- `registry.disableScanning: true`

Disables automatic deployments of new Docker images. You will deploy through CI every time, and the version change will be captured as a git commit.


- `memcached.enabled: false`

After adding registry-disable-scanning, we won't need Memcached anymore as Flux only uses Memcached to cache image metadata.


## Github access

Time to deploy Flux:

```bash
kubectl create namespace flux

helm repo add fluxcd https://charts.fluxcd.io

helm upgrade -i flux fluxcd/flux \
   --values values.yaml \
   --namespace flux
```

At startup, Flux generates an SSH key and logs the public key.
In order to sync your cluster state with git, you need to copy the public key and create a deploy key on your GitHub repository.

Grab the key with:
```
kubectl -n flux logs deployment/flux | grep identity.pub | cut -d '"' -f2
```

Open GitHub, navigate to the gitops repository. In Settings > Deploy keys click "Add a deploy key". You will **not** need write access.

Once you added the deploy key, you should see in the flux pod logs, that the next sync succeeds:

```
ts=2020-06-05T12:00:50.218922569Z caller=loop.go:133 component=sync-loop event=refreshed url=ssh://git@github.com/YOURUSER/gitops branch=master HEAD=69f55486fc70e0dd49212a5516dd7790d26715dd
```

Congratulations, you have Flux running.

One note before moving forward. Copying the public key from the log is not easy to automate.
Alternatively, you can find the public key in the `flux-git-deploy` secret after startup, 
or you can provision your own key in your installation script following the 
[https://docs.fluxcd.io/en/1.19.0/guides/provide-own-ssh-key/](https://docs.fluxcd.io/en/1.19.0/guides/provide-own-ssh-key/)
guide.

## Gitops repository folder structure

At this point, Flux listens to the `releases/staging` and `releases/production` folders in the `gitops` repository.
It deploys any Kubernetes manifests from those folders, and their subfolders.

The folder structure is up to the conventions you come up with. This how-to works with the following conventions:

```bash
├── fluxcd
│   ├── kustomization.yaml
│   └── patch.yaml                                                                                                                                        
└── releases                                                                                                                                                  
    ├── staging                                                                                                                                            
    │   ├── app1                                                                                                                                             
    │   │   ├── deployment.yaml                                                                                                                         
    │   │   └── service.yaml
    │   └── app2
    │       ├── deployment.yaml                                                                                                                         
    │       └── service.yaml
    └── production
        ├── app1                                                                                                                                             
        │   ├── deployment.yaml                                                                                                                         
        │   └── service.yaml
        └── app2
            ├── deployment.yaml                                                                                                                         
            └── service.yaml

```

Using a `releases` folder allows us to store other things in this repo, like the `fluxcd` folder.

Using the `releases/staging` and `releases/production` folders, allows this repository to serve as the source of truth for multiple environments - or Kubernetes clusters.


## Now let's make the first deploy

To deploy your application, you should put your application's Kubernetes manifests under `releases/staging/your-app`
and Flux will sync it to the cluster.

This workflow uses Helm's templating features, but nothing else.

Template your application's Helm chart now:   

```bash
helm template your-app . \
  --values values.yaml \
  --output-dir ../gitops-dummy/releases/staging/
```

Make a git commit to the gitops repository, and you should see in the Flux logs that it synced the change to your cluster.

## Let's automate the gitops repo update with CI

At this point you are already doing gitops. If you want to change something, you make a git commit with the unfolded Helm chart, and Flux deploys it.

Doing this by hand is a good exercise, but it gets tedious soon. It's time to add it to CI.

Take the commands you ran previously and add it as a step to your CI pipeline.

## Rollback

Thanks to the gitops approach. Doing a rollback is nothing more than going back to an earlier state in the git tree.

Use `git revert <hash>` on each unwanted commit to preserve the history.

## Slack notifications

With introducing Flux to your workflow you lost an important mental model.
With CI, you could assume that if your CI pipeline finished, your new version is rolled out.

You can gain your confidence back with Slack notifications.
Configure the [justinbarrick/fluxcloud](https://github.com/justinbarrick/fluxcloud) project to get Slack (or MS Teams)
messages upon new deploys.

Configure Flux to connect to your FluxCloud deployment, to propagate updates.

```diff
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flux
  namespace: flux
spec:
  template:
    spec:
      containers:
        - name: flux
          args:
            - --registry-disable-scanning
            - --git-readonly
            - --git-poll-interval=5s
            - --manifest-generation=true
            - --ssh-keygen-dir=/var/fluxd/keygen
            - --git-branch=master
            - --git-path=releases/staging,releases/production
            - --git-url=git@github.com:${GHUSER}/${GITOPS_REPO}
+           - --connect=ws://fluxcloud
+           - --token=changethissupersecrettoken
```

## An alternative workflow: storing Helm charts in the gitops repo

So far we have stored plain Kubernetes manifests in the gitops repository.

Flux is able to handle Helm charts upon git sync with the [Helm Operator](https://github.com/fluxcd/helm-operator).
This operator makes Helm charts declarative. Instead of running one off `helm upgrade` commands, you can capture the intended state in a yaml file.

With the HelmRelease CRD you can capture the chart information and the matching configuration values and you can store this in your gitops repository.

```yaml
apiVersion: helm.fluxcd.io/v1
kind: HelmRelease
metadata:
  name: nginx-ingress
  namespace: default
spec:
  releaseName: nginx-ingress
  chart:
    repository: https://kubernetes-charts.storage.googleapis.com/
    name: nginx-ingress
    version: 1.22.1
  values:
    controller:
      ingressClass: "myNginx"
```

CRDs are Kubernetes extensions that make is it possible to define custom resources like `HelmRelease`. Install the `HelmRelease` CRD with:

```yaml
kubectl apply -f https://raw.githubusercontent.com/fluxcd/helm-operator/master/deploy/crds.yaml
```

Then install the Helm Operator with

```yaml
helm upgrade -i helm-operator fluxcd/helm-operator \
  --set git.ssh.secretName=flux-git-deploy \
  --set helm.versions=v3
  --namespace flux
```

Place the example HelmRelease from above under `releases/staging/nginx`, make a git commit 
and see how Flux and the Helm Operator deploys it.

You can track `HelmReleases` with `kubectl get hr --all-namespaces`.

## An alternative workflow: using fluxctl

An early decision was to not use `fluxctl`. We did that to not bypass the gitops repo with any change, and we wanted CI to be the actor that writes the gitops repo.

Now that you saw one workflow, you may want to compare the proposed workflow with the one fluxctl offers.

```
Available Commands:
  automate       Turn on automatic deployment for a workload.
  deautomate     Turn off automatic deployment for a workload.
  help           Help about any command
  identity       Display SSH public key
  install        Print and tweak Kubernetes manifests needed to install Flux in a Cluster
  list-images    Show deployed and available images.
  list-workloads List workloads currently running in the cluster.
  lock           Lock a workload, so it cannot be deployed.
  policy         Manage policies for a workload.
  release        Release a new version of a workload.
  save           save workload definitions to local files in cluster-native format
  sync           synchronize the cluster with the git repository, now
  unlock         Unlock a workload, so it can be deployed.
  version        Output the version of fluxctl
```

## An alternative workflow: auto image update

We had a CI centric view in this how-to. We updated the gitops repo explicitly on the same events as we used to deploy to Kubernetes.

Flux is able to scan your image registry and update your deployed image if there is a new image available. With that approach, you don't need CI to trigger the gitops update.

See the [Automated deployment of new container images](https://docs.fluxcd.io/en/1.19.0/references/automated-image-update/) guide to enable it.

## Next steps

At this point you have a functioning gitops setup that can be gradually added to each of your CI/CD pipelines.
You probably want to factor all gitops commands into scripts and extend it further with rollback and other workflows.
Or, if you liked the setup, and want to kickstart your gitops platform, check out [Gimlet](https://gimlet.io).

For inspiration, you can check out some other OSS projects that have a slightly different take and/or go further with Flux:

- [https://github.com/cloud-native-nordics/k8s-config-repo](https://github.com/cloud-native-nordics/k8s-config-repo) a gitops repo, that follows a slightly different structure
- [https://github.com/lunarway/release-manager](https://github.com/lunarway/release-manager) a gitops platform using Flux, its own CLI tool, its server-side component, that implements promotion and release logic
