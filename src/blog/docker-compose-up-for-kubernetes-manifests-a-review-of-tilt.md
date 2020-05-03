---
layout: post
title: Docker-compose up for Kubernetes manifests - a review of tilt
date: 2020-05-03
image: wasp.jpg
image_author: v2osk
image_url: https://unsplash.com/photos/joL0nSbZ-lI
excerpt: |
    Tilt.dev is a New York based startup that made tilt: a new tool for multi-service development.
    <br /><br />
    It is basically docker-compose that works with Kubernetes yamls. In this blog post you get a quick intro to tilt, and our take on it.
topic: Ecosystem
tags: [posts]
---

Tilt.dev is a new New York based startup that made tilt: a new tool for multi-service development.

It is basically docker-compose that works with Kubernetes yamls. In this blog post you get a quick intro to tilt, and my take on it.

## Tilt up

The promise is simple, you type `tilt up` and your whole stack is up and running. Just like with Docker Compose.

But this time, you define your stack in Kubernetes manifests.

## The `Tiltfile` wires your stack together

It's a small configuration file written in Starlark, a langugage made specifically for configuration. It's a dialect of Python, with a familiar and highly readable syntax.

The following is a Tiltifile that defines what Kubernetes yamls to deploy, and what port-forwards to create.

``` py
print('Hello Tiltfile')

# Tell Tilt what YAML to deploy
k8s_yaml('app.yaml')

# Tell Tilt to create a port forward for a k8s resource
k8s_resource('frontend', port_forwards=8080)
```

## Running tilt

When you run `tilt up`, it tries to deploy the stack on your current Kubernetes environment. 
That said, you have to have a Kubernetes cluster at hand, either a local or your company issued one. 


It works with any Kubernetes cluster. Should you need one, the Tilt documentation is graciously helping you to get up and running with the well known local ones: Microk8s, Minikube, kind, k3d. 
Tilt is going as far as building in safeguards to protect you from accidentally deploying on a production cluster. Only the local cluster names are allowed by default, you have to explicitly allow specific k8s contexts for deployment with the `allow_k8s_contexts` command. 
Kudos for these.

Tilt runs in the foreground, and you get a fully functional console UI, but also opens up a browser tab with a web UI.

![Tilt UI](/tilt.png)

It brings a similar experience to Docker Compose, you can track the list of services and their logs, but it does so in a forward-looking structure.

What stands out, is the *Alerts* tab: it surfaces the typical deployment, or runtime errors. Should any of your pods crash, miss an image, or is misconfigured, you get notified immediately. This could reduce debug time.

## What's wrong with compose?

Nothing, really. Compose was my gateway drug to containers et al. and still is my standard on ease of use.

If I really must raise a concern, Docker Compose in early 2020 is a dead end deployment wise.

Feels wasteful to introduce compose to a team, and when going to production, build completely new manifests for Kubernetes deployments.
There has been a few projects, like [Kompose.io](http://kompose.io), with the aim to use `docker-compose.yml` to deploy to Kubernetes, however these tools never gained wide adoption.

Tilt's approach is both simple and novel and I would love to see it evolve. The more tools try to be the new Docker Compose, the better we are off.

Interestingly, Docker Inc also started to re-invent itself these days.
They pivot from the former ops focus: they intentionally leave deployment to other industry players, as they try to become a dev tooling company.

One of their first steps is releasing the Docker Compose specification to the community. Which will bring a nice buzz in the ecosystem. Interesting times ahead.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">This could be big. Hope it&#39;s not too late. Compose has been my gateway drug to containers et al. and still my standard on ease of use. <a href="https://t.co/URiNQu4R4X">https://t.co/URiNQu4R4X</a></p>&mdash; laszlo (@laszlocph) <a href="https://twitter.com/laszlocph/status/1247515592036409344?ref_src=twsrc%5Etfw">April 7, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

### Killer features: in-place code update

Tilt comes with one more feature I haven't covered yet.

It automatically rebuilds your Docker images if you change a file, and redeploys it in Kubernetes.
This closes the developer feedback loop, as you see the Docker build and Kubernetes deploy logs in Tilt.

You configure this behavior in the Tiltfile with the `docker_build` command.

``` diff
print('Hello Tiltfile')

# Tell Tilt what YAML to deploy
k8s_yaml('app.yaml')

+ # Tell Tilt what images to build from which directories
+ docker_build('companyname/app', 'app')

# Tell Tilt to create a port forward for a k8s resource
k8s_resource('frontend', port_forwards=8080)
```

Tilt knows that the Docker rebuild and Kubernetes deploy takes time, so it offers two optimizations: the `local_resource` directive and the `live_update` option.

`local_resource` allows you to compile projects outside of the Docker environment, eg on your laptop in your regular development workflow.
`live_update` then allows you to copy prebuilt binaries or for - interpreted languages or static sites - source files into the container.

This removes the two longest operations from the workflow: Docker image build, and Kubernetes redeploy, 
reducing the feedback loop to the time of compilation of your app (for compiled languages), and the application restart.

The Tilt <a href="https://docs.tilt.dev/example_go.html" target="_blank">docs</a> has examples of this workflow for many of the languages.

### Killer features: using Helm or Kustomize manifests

Tilt plays well with the existing tools that we use to manage our manifests. Static files templates are seldom used in real life scenarios: we either use Helm or Kustomize, or roll our own templating solutions.

The Tiltifile has options to work with these templates. This greatly increases the utility of Tilt.

``` py
# multiple YAML files; can be either a list or multiple calls
k8s_yaml(['foo.yaml', 'bar.yaml'])

# run a command to generate YAML
k8s_yaml(local('gen_k8s_yaml.py')) # a custom script
k8s_yaml(kustomize('config_dir')) # built-in support for popular tools
k8s_yaml(helm('chart_dir'))
```

## First impressions

At Gimlet.io, we think that the Cloud Native ecosystem produced many best in class tools. However, they are only building blocks, piecing them together is not an all the way pleasant experience. 
There shall exist a wide range of tools and products that operate on higher abstractions levels. We are certainly one of those.
We welcome new products in this space, and we are glad to look at them.

Tilt is fast. Golang shines in CLIs, and its startup time never ceases to amaze me. Working with Tilt felt snappy all the way.

Tilt does what it says, it lives up to the Docker Compose experience, therefor I definitely want to try Tilt in my dev setups.

Not necessarily the live update feature though. I use Docker Compose for the dependencies only, the static part of the stack and I wire things in ways I need.
The service I'm developing is running on my laptop, and uses the services running in compose. But, as always with new workflow additions, I have to try it and see if it sticks.
Tilt puts a great emphasis on the live update feature. Technically it's a nice solution, and I'm sure it will please many developers.

Also, tilt is a well executed skeleton of a possible feature rich tool in the future. The Docker Compose workflow is a good start, and I'm sure the Tilt team has many ideas how to develop it further.
It's a nice canvas to build on.

If you want to try Tilt, head over to the <a href="https://docs.tilt.dev/tutorial.html" target="_blank">The First 15 Minutes</a> tutorial by Tilt.
