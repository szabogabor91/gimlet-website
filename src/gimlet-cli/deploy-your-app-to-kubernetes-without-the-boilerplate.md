---
layout: gimlet-cli
title: Deploy your app to Kubernetes without the boilerplate
lastUpdated: 2020-12-09
tags: [gimletcli]
---

# Deploy your app to Kubernetes without the boilerplate

In this guide you will deploy your application to Kubernetes without writing lengthy deployment manifests.

#### Prerequisites

- Your application has a Docker image, and it is pushed to a container registry
- You have access to a Kubernetes cluster. Use [k3d](https://github.com/rancher/k3d#get) if you don't have one
- You have `kubectl` installed. Follow [this guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/) if you don't have it
- You have Gimlet CLI installed. [Click](/gimlet-cli/getting-started#installation) to install it
- You have Helm installed. You can do so [here](https://helm.sh/docs/intro/install/)

## The Yaml

Kubernetes has a powerful deployment manifest, or "the yaml" as people often call it.

It allows for great flexibility with its many options and knobs, but that also means that it requires extensive boilerplate to get started.

The bigger issue is that it's not easy to piece together the needed Kubernetes `Deployment`, `Service` and `Ingress` objects 
as there is no go to place besides the Kubernetes documentation.

## How to get started with Kubernetes yamls

Most people copy it from somewhere.

If they need to extend it with new features, they search and copy that snippet too. When they start a new project, they copy over their proven yamls.

Some point, they want to make it more clever, support variables, apply pieces conditionally, they come up with some templating solution.

This scales to a certain point, but there has to be a better way.

And you keep hearing about Helm, aren't you?

## What is Helm

If you want to deploy well known infrastructure components, like Redis, the community has a solution for you:
it's called Helm, and it is a package manager.

There are prepackaged deployments manifests, called Helm Charts, that can get you started with installation and configuration.

Helm charts allow you to progress from a simple two liner that installs a default Redis:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-redis bitnami/redis
```

to more tailored setups:
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-redis bitnami/redis -f values.yaml

# values.yaml
master:
  persistence:
    size: 10Gi
```

While most infrastructure software has a Helm Chart today, there is no go to chart to use for your own applications.

You can try writing your own, but that it is even a larger endeavour than piecing your yamls together from blog posts.

Most companies have an internal best practice and reference implementation on how to deploy to Kubernetes.
That usually includes a Helm Chart, or a corresponding internal tool.

But if you don't work for a company like that,
you can use Gimlet's OneChart Helm Chart for your application.

## Use OneChart to deploy your application

OneChart is a generic Helm Chart for web applications. The idea is that most Kubernetes manifest look alike, only very few parts actually change.

The example bellow deploys your application image, sets environment variables and configures the Kubernetes Ingress domain name:

```bash
helm repo add onechart https://chart.onechart.dev
helm template my-release onechart/onechart -f values.yaml

# values.yaml
image:
    repository: my-app
    tag: fd803fc
vars:
  VAR_1: "value 1"
  VAR_2: "value 2"
ingress:
  annotations:
    kubernetes.io/ingress.class: nginx
  host: my-app.mycompany.com
```

In this guide you will use the OneChart Helm Chart to configure your application for deployment.

Using Gimlet CLI, you can configure OneChart on a GUI, unlike the usual Helm experience of scanning hundreds lines of variable documentation of Helm Charts.

You will also see that thanks to Gimlet's design principles, you won't be locked into Gimlet CLI as it works with common Helm file formats and workflows.

Now let's configure your deployment!

## How to configure your deployment

You will use the `gimlet chart configure` command to configure the OneChart Helm Chart.

`gimlet chart configure` generates a Helm `values.yaml` file that you can use in a normal Helm workflow,
while you can configure the deployment parameters in a browser based GUI:

```
helm repo add onechart https://chart.onechart.dev
gimlet chart configure onechart/onechart
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

Note: even if you don't have an application image to deploy, you can still run this exercise as the default configuration deploys an Nginx image.
A webserver with a default page that you can interact with in your browser.

## Deploying the application

At this point you have a Helm `values.yaml` with the values that are unique to your deployment.

(you can copy the output values and create a `values.yaml` file, or ran `gimlet chart configure` and pipe its output to the `values.yaml`: `gimlet chart configure onechart/onechart > values.yaml`)

You can ran Helm templating and inspect the Kubernetes deployment manifest by running:

```bash
helm template myapp -n staging onechart/onechart -f values.yaml

---
# Source: onechart/templates/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
  namespace: staging
[...]
---
# Source: onechart/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: staging
[...]
---
# Source: onechart/templates/ingress.yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: myapp
  namespace: staging
[...]
spec:
  tls:
    - hosts:
        - "myapp.local"
      secretName: tls-myapp
  rules:
    - host: "myapp.local"
[...]
```

Finally, feed the yamls to Kubernetes to deploy it:

```bash
helm template myapp -n staging onechart/onechart -f values.yaml | \
  kubectl apply -f -
```

## Workflow

Now that you have successfully deployed your application, you can think about a workflow how you will make this process repeatable.

You can version two artifacts in this workflow: the Kubernetes yaml or the `values.yaml` file.

We recommend versioning the `values.yaml` file, perhaps in multiple instances, as many environments you have.

With a Makefile or CI pipeline you can automate the `helm template` and `kubectl apply -f` commands too.

Should you need to make modifications to the `values.yaml`, you can do that manually, or run `gimlet chart configure` again and feed in your existing values file:

```
gimlet chart configure -f values.yaml onechart/onechart
```

## Next steps

There are a couple of paths you can take:

- You can explore the many use-cases of OneChart in the [OneChart documentation]()

- or read how can you elevate your workflow further by using GitOps in the [Manage environments with Gimlet and GitOps](/gimlet-cli/manage-environments-with-gimlet-and-gitops) guide
