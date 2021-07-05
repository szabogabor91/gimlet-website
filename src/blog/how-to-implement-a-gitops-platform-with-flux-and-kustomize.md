---
layout: post
title: How to implement a gitops platform with Flux and Kustomize
date: 2020-06-08
image: mountain.jpg
image_author: Massimiliano Morosinotto
image_url: https://unsplash.com/photos/3i5PHVp1Fkw
excerpt: |
    In this blog post you will learn how to implement a gitops platform at your company, using Flux and Kustomize.
topic: Ecosystem
tags: [posts]
---

<h4 class="text-lg font-bold">5th July, 2021 UPDATE <br /><br />This blog post uses Flux V1 which is deprecated now. Either head over <a href="https://fluxcd.io/">fluxcd.io</a> for the official docs of Flux V2, or check out the most recent practice from Gimlet in the <a href="/deploy-your-app-to-kubernetes-without-the-boilerplate">Deploy your app to Kubernetes without the boilerplate</a> guide.<br/><br/>There is still some value in reading this blog post as the core of gitops hasn't changed.</h4>

In this blog post you will learn how to implement a gitops platform at your company, using Flux and Kustomize.

What you need as a prerequisite is 
- a Kubernetes cluster
- a project you already deploy to Kubernetes from a CI pipeline
- you configure this application with Kustomize 

You will deploy this project to Kubernetes with the gitops approach, side-by-side of your existing deployment.
At the end of this how-to, you will be able to judge how gitops fits your workflow.

## Start with creating an empty git repository

With gitops, we store all manifests in a git repository. Let's create it now.

Any name would work, but use `gitops` as name, and add a `README.md` file as a courtesy.

## Early decisions

There are a couple gitops controllers out there, in this post we chose Flux. Flux is a single purpose tool, and the simplest approach to gitops.

Furthermore, we will use Flux only to synchronize git state to the Kubernetes cluster.
We are going to avoid `fluxctl`, Flux's CLI tool. It is both a convenience tool, and an opinionated workflow to use Flux and
we opted to not use it in this how-to. We did so to have a full understanding of what is happening in the cluster.

This how-to also assumes that you use Kustomize at your company, so we are going to use Kustomize both to configure your deployed applications, and installing Flux.

## Continue with installing Flux

For installation, we follow closely the official [How to bootstrap Flux using Kustomize](https://docs.fluxcd.io/en/latest/tutorials/get-started-kustomize/) guide.

Use the Flux Github release as the Kustomize base, and lock the version to the latest one.

```bash
cat > fluxcd/kustomization.yaml <<EOF
namespace: flux
bases:
  - github.com/fluxcd/flux//deploy?ref=v1.19.0
patchesStrategicMerge:
  - patch.yaml
EOF
```

It's a good practice to scan the deployment manifests now on [https://github.com/fluxcd/flux/tree/master/deploy](https://github.com/fluxcd/flux/tree/master/deploy).

Alternatively you can pull down the manifests from Github and use it as a base in your kustomization.yaml. 
This could be a good idea especially as we are not going to use the Flux features that use Memcached.
Removing the Memcached manifests reduces the number of moving parts in the deployment.

Next step is to write the `patch.yaml`.

```bash
export GHUSER="YOURUSER"
export GITOPS_REPO="gitops"
cat > fluxcd/patch.yaml <<EOF
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
            - --git-path=releases/staging
            - --git-url=git@github.com:${GHUSER}/${GITOPS_REPO}
EOF
```

The arguments are significantly different from what is in the official installation guide:

- add `registry-disable-scanning`

Disables automatic deployments of new Docker images. You will deploy through CI every time, and the version change will be captured as a git commit.


- remove `memcached-*` arguments

After adding registry-disable-scanning, we won't need Memcached anymore as Flux only uses Memcached to cache image metadata.


- add `git-readonly`

Disables fluxctl release workflows. You will deploy through CI every time, and the version change will be captured as a git commit.


- remove `git-user` and `git-email`

Due to using git-readonly



- add `git-poll-interval`

To speed up releases. The default is 5 minutes.


- change `git-path`

Configures Flux to deploy everything from the releases/staging and releases/production  folder of the gitops repo.

## Github access

Time to deploy Flux:

```bash
kubectl apply -k fluxcd
```

At startup Flux generates an SSH key and logs the public key.
In order to sync your cluster state with git, you need to copy the public key and create a deploy key on your GitHub repository.

Grab the key with 
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

To deploy your application, you should put the kustomized Kubernetes manifests under `releases/staging/your-app`

Instead of applying your templates on the cluster with `kubectl apply -k`, run `kubectl kustomize . > releases/staging/your-app/deployment.yaml`, and make a git commit to the gitops repository.   

You should see in the Flux logs that it synced the change to your cluster.

## Let's automate the gitops repo update with CI

At this point you are already doing gitops. If you want to change something, you make a git commit with the unfolded kustomize template, and Flux deploys it.

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

## An alternative workflow: storing kustomize templates in the gitops repo

So far we have stored fully kustomized manifests in the gitops repository.

Flux is able to run kustomize upon git sync as we enabled this feature with `manifest-generation=true` in the patch.yaml file.
Meaning, you can put kustomize templates under `releases/staging/your-app`, Flux will do the `kubectl kustomize` step for you.

Put a `.flux.yaml` file under `releases/staging/your-app` to enable this feature.

```yaml
version: 1
commandUpdated:
  generators:
    - command: kustomize build .
```

Flux allows great flexibility with this feature, check out the [Manifest generation through .flux.yaml configuration files](https://docs.fluxcd.io/en/1.19.0/references/fluxyaml-config-files/) guide to see all possibilities.

This approach however comes with a few drawbacks:

- Kustomize failures will surface at deploy time
- if you want to see what changed in your manifest in a given commit, you have to run kustomize in your head to grasp what changed
- Flux imposes limitations on the placement of `.flux.yaml`. It looks for the file in the `git-path` folder, or one level up.
The folder conventions we come up with do not fit this limitation.  

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
- [https://github.com/swade1987/gitops-with-kustomize](https://github.com/swade1987/gitops-with-kustomize) more sophisticated scripting for Flux and Kustomize
- [https://github.com/lunarway/release-manager](https://github.com/lunarway/release-manager) a gitops platform using Flux, its own CLI tool, its server-side component, that implements promotion and release logic
