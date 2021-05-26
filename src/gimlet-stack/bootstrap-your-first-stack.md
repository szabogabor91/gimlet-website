---
layout: gimlet-stack
title: Bootstrap your first stack
lastUpdated: 2021-05-26
image: gimlet-stack.png
tags: [gimletd]
---

# Bootstrap your first stack

In this tutorial you will install 

- the Nginx ingress controller 
- and an observability stack 
  - featuring Grafana for dashboards 
  - Prometheus for metrics
  - and Loki for logs
    
 on your Kubernetes cluster using Gimlet Stack.
 
All backed by a git repository with a self-containing gitops automation.

## Prerequisites

- You need to have a running Kubernetes cluster, and you need to be able to access it with `kubectl`. <br /><br />
If you don't have one we recommend using [k3d](https://k3d.io/#installation) on your laptop. 
  If you do so, make sure to not install the built-in ingress controller: `k3d cluster create my-cluster --k3s-server-arg '--no-deploy=traefik'`

- You need to have a free GitHub account, or any other git provider that you know enough to translate the Github configuration instructions in this guide to the provider of your choice.

One other thing that you will need for GitOps, is a git repository. We will create that next.

## Let's start by creating a git repository

Create a private git repository on Github where you will store the infrastructure configuration manifests of your stack. `k8s-stack` could be a suitable name for it.

![Create a git repository](/create-repository.png)

Now that you have a GitOps repository, let's bootstrap the GitOps deployment cycle.

## Bootstrap the GitOps automation

In GitOps, instead of applying Helm charts and kubernetes manifests directly on the cluster, you write them to a git repository.
The GitOps controller will be the one deploying them on the cluster based on changes in the repository.

The GitOps controller is a control loop that monitors the state of the GitOps repository and applies any new changes on the cluster.

With this structure, your deployment process gets a set of nice properties:

- a complete audit log of your configuration changes
- a familiar toolchain - git - as the primary means to manage your infrastructure
- and finally, the GitOps control loop is in a better position to recover from errors than CI jobs and homegrown automation scripts

In this tutorial we are going to use Flux V2 as the GitOps controller, and use the Gimlet Stack to bootstrap it.

### Install Gimlet Stack

Fetch Gimlet Stack and install it with the following commands:

```bash
curl -L https://github.com/gimlet-io/gimlet-stack/releases/download/v0.1.0/stack-$(uname)-$(uname -m) -o stack
chmod +x stack
sudo mv ./stack /usr/local/bin/stack
stack --version
```

### Clone your GitOps repository and bootstrap GitOps

Now, you will clone your GitOps repository that you just created on GitHub, and place the GitOps controller yaml files in it with the `stack bootstrap` command.

Make sure to change the repository name to be the one you created earlier.

```bash
git clone git@github.com:laszlocph/k8s-stack.git

cd k8s-stack

stack bootstrap \
  --single-env \
  --gitops-repo-url git@github.com:laszlocph/k8s-stack.git
```

You should see a similar output to this:

```
⏳ Generating manifests
⏳ Generating deploy key
✔️ GitOps configuration written to k8s-stack/flux

👉 1) Push the configuration to git
👉 2) Add the following deploy key to your Git provider

ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC1593b2v[...]

👉 3) Apply the gitops manifests on the cluster to start the gitops loop:

kubectl apply -f k8s-stack/flux/flux.yaml
kubectl apply -f k8s-stack/flux/deploy-key.yaml
kubectl wait --for condition=established --timeout=60s crd/gitrepositories.source.toolkit.fluxcd.io
kubectl wait --for condition=established --timeout=60s crd/kustomizations.kustomize.toolkit.fluxcd.io
kubectl apply -f k8s-stack/flux/gitops-repo.yaml

         Happy Gitopsing🎊
```

Let's follow Gimlet Stack's instructions.

### Authorize Flux to fetch your GitOps repository

The `stack bootstrap` command made a commit to the local copy of the GitOps repository with the gitops controller's deployment manifests.
Let's push that now to origin main.

Before you apply the just written manifests on your Kubernetes cluster, authorize Flux to fetch the contents from Github by creating a read-only deploy key in your GitOps repository.

- Open GitHub, navigate to your repository, and under *Settings > Deploy* keys click on *Add deploy key*
- Paste the ssh-rsa key from step 2) of the `stack bootstrap` output as a key. `flux-gitops` can be an appropriate name for it
- Make sure to leave the *Allow write access* checkbox unchecked

![Create a deploy-key](/deploy-key.png)

After all these steps, it's time to deploy Flux and start the GitOps loop.

### Let's close the loop and start the GitOps deployment cycle

After granting access for Flux to read the GitOps repository, there is nothing else left to prepare. We can get to deploying Flux and inspect the GitOps deployment cycle in action.

Apply the GitOps controller manifests on the cluster from step 3) of the `stack bootstrap` output. As a recap, these steps will get Flux deployed:

```
kubectl apply -f k8s-stack/flux/flux.yaml
kubectl apply -f k8s-stack/flux/deploy-key.yaml
kubectl wait --for condition=established --timeout=60s crd/gitrepositories.source.toolkit.fluxcd.io
kubectl wait --for condition=established --timeout=60s crd/kustomizations.kustomize.toolkit.fluxcd.io
kubectl apply -f k8s-stack/flux/gitops-repo.yaml
```

Once the pods are started you can verify the GitOps deployment cycle in the Flux logs. If you have everything working, you should see Reconciliation finished messages popping up periodically.

```
kubectl logs -n flux-system -f deploy/source-controller
...
<{"level":"info","ts":"2021-01-19T10:07:25.368Z","logger":"controller.gitrepository","msg":"Reconciliation finished in 1.413640057s, next run in 15s","reconciler group":"source.toolkit.fluxcd.io","reconciler kind":"GitRepository","name":"gitops-repo","namespace":"flux-system"}
<{"level":"info","ts":"2021-01-19T10:07:25.368Z","logger":"controller.gitrepository","msg":"Reconciliation finished in 1.413640057s, next run in 15s","reconciler group":"source.toolkit.fluxcd.io","reconciler kind":"GitRepository","name":"gitops-repo","namespace":"flux-system"}
```

Congratulations, now you have a working GitOps setup!

## Let the fun begin, configure your stack

But GitOps is only as fun as the applications you are deploying with it. Let's configure now the stack components.

Run `stack configure` and pick enable Nginx, Prometheus and Loki on the UI that starts:

![Configure your stack with stack configure](/stack-configure.png)

Once you enabled the components write the configuration with the red *Close tab & Write values* button.

This will not just write the stack configuration to the console, but also to the `stack.yaml` file which holds all configuration of your stack.

```
➜  k8s-stack git:(master) ✗ stack configure
👩‍💻 Configure on http://127.0.0.1:24259
👩‍💻 Close the browser when you are done
Browser opened
Browser closed
📁 Generating values..
---
stack:
  repository: https://github.com/gimlet-io/gimlet-stack-reference.git
config:
  loki:
    enabled: true
  nginx:
    enabled: true
    host: laszlo.cloud
```

Should you made a mistake, just run `stack configure` again. It will read the stack configuration from the stack.yaml, and you can reconfigure it.

## Generate Kubernetes manifests from your stack and deploy it

The only thing left is to generate the manifests from the stack.yaml file that Kubernetes understands.

For that, run `stack generate` and verify the files that have been generated.

```
➜  k8s-stack git:(master) ✗ git status
On branch master
Your branch is based on 'origin/master', but the upstream is gone.
  (use "git branch --unset-upstream" to fixup)

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        examples/
        helm-releases/
        helm-repositories/
        manifests/
        stack.yaml
```

Add all files to git, then push it to origin main.


