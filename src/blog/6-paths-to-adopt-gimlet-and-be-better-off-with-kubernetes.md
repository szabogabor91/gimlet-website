---
layout: post
title: "6 paths to adopt Gimlet and be better off with Kubernetes"
date: 2021-03-17
excerpt: |
    Gimlet was made to be modular. It meets you where you are and helps you to be better off with Kubernetes. 
    This post collects six avenues to adopt Gimlet.  
topic: Best Practices
image: gimlet-k8s.png
image_author: Paweł Czerwiński
image_url: https://unsplash.com/photos/Lki74Jj7H-U
tags: [posts]
---

With the launch of GimletD, crafting a concise and elegant home page for Gimlet is not easy.

Since one of my driving thoughts for Gimlet is to be modular, there are many paths you can take to adopt Gimlet:

- You can adopt just OneChart to ease Kubernetes YAML authoring, and you are better off already
- Or you can adopt Gimlet environment files and use Gimlet CLI to render it, without adopting any gitops at all

No need to adopt the full platform to benefit, unlike many PaaS out there.

But this also makes it difficult to capture the different usecases for Gimlet.
This blog post is an exercise for me - the maker of Gimlet - to collect the different paths for adoption.

## First off, an inventory

Gimlet has three components today:

### OneChart

[OneChart](/onechart/getting-started) is a generic Helm chart that supports the typical web service deployment patterns.

Authoring a Kubernetes application manifest is reduced to setting the parts that are unique to the app itself. No more boilerplate.

### Gimlet CLI

[Gimlet CLI](/gimlet-cli/getting-started) is the glue between all Gimlet components, but it also warrants for existence on its own. 
There are workflows that can be only carried out with Gimlet CLI.

You typically use Gimlet CLI on your laptop, or in CI, but also it is the tool to drive many of GimletD's workflows.

### GimletD

[GimletD](/gimletd/getting-started) is the gitops release manager. It builds on the concepts, conventions and workflows that Gimlet CLI introduced and extends it with a centralized approach for managing releases.

It allows for policy based deploys and advanced authorization settings. It also packs all release automation logic that used to be scattered in CI pipelines.

## Path #1 - Using OneChart in your Helm workflows

<img src="/path1.png" class="py-8 h-96" alt="Using OneChart in your Helm workflows"/>

This case is simple. OneChart is a Helm chart like any other, and you can insert it in your existing Helm workflow.

While I wouldn't call this a true adoption of Gimlet, OneChart can stand on its own. 
It simplifies YAML authoring at your company. Go and use it, and thanks for doing so!

## Path #2 - Using Gimlet CLI in your Helm workflows

<img src="/path2.png" class="py-8 h-96" alt="Using Gimlet CLI in your Helm workflows"/>

On this path you would use the generic Helm UI feature of Gimlet CLI to configure your existing Helm charts.

It would mean that Gimlet's Helm UI feature would really take off, something I want to happen regardless of the success of Gimlet as a whole.

[Helm React UI](https://gimlet.io/blog/helm-react-ui-a-react-component-to-render-ui-for-helm-charts/) was a true R&D at Gimlet 
and I'm hoping that one that you can use it for all the common charts out there.

It is certainly my priority to get through to Helm devs and make Helm UI an industry wide standard.

See the UI feature of Gimlet CLI in action:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/d8hq5e_wq54?start=1682" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Path #3 - Using all that Gimlet can give to speed up YAML authoring

<img src="/path3.png" class="py-8 h-96" alt="Using all that Gimlet can give to speed up YAML authoring"/>

Using OneChart and Gimlet CLI's UI to configure Helm charts can really speed up YAML authoring.

It also provides an easy way in for new Kubernetes users, plus you can distribute best practices at your company through OneChart.

We recently discussed OneChart on CNCF's Application Delivery SIG how to use it internally at a company to package all best practices:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/HcgPquZSqZc?start=1255" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Path #4 - Declarative environments, stored in application repo

<img src="/path4.png" class="py-8" alt="Declarative environments, stored in application repo"/>

This path means adopting one of the defining feature of Gimlet, the environment file.

Its power lies in its declarativeness. It captures all there is to be captured about an environment, versions, variables, etc. 
And the best thing is: it lives in the application source code repository, thus giving the control to devs for things that they can and should control.

The manifest combined with OneChart's best practices approach gives the core developer experience of Gimlet, 
and you can benefit from it even without adopting gitops, or the gimletd release manager.

You can stick to your existing CI pipelines and use `gimlet manifest template` to render the Kubernetes manifests at deploy time, 
then pipe into `kubectl apply`. This way you can enjoy a standardized templating mechanism, and a more declarative approach than using Helm alone.

## Path #5 - Gitops, driven by CI

<img src="/path5.png" class="py-8" alt="Gitops, driven by CI"/>

This path ups a notch from path four.

You are still using your proven CI pipelines, but instead of running `kubectl apply`, you use `gimlet gitops write` to write the gitops repository.

This is an easy path into gitops: you still control most of the things, but have a gitops indirection in your delivery workflow.

Read more about this approach in the [Manage environments with Gimlet and gitops](/gimlet-cli/manage-environments-with-gimlet-and-gitops/) guide.

Once you gain confidence in the gitops controller, you are ready to jump to path six and remove a bunch of pipeline logic from your CI.

## Path #6 - Gitops at scale, release automation

![6 usecases for Gimlet adoption](/gimlet-usecases.png)

In path six, you take full advantage of Gimlet.

- Using the manifest to provide a good developer experience for devs: giving them control of things that they can and should control
- Combined with OneChart's best practices approach gives you the ability to have a supported set of usecases, without devs having to figure out the same thing over and over again
- You also use gitops, and a standardized toolchain across all your applications in a centralized release manager that is GimletD

In this setup GimletD acts as a centralized release manager that adds policy based deploys and advanced authorization and security controls.

It both allows strict control over releases, and flexibility to rewire the release workflows for all your applications at once. 
And by capturing all release logic, it factors out a large amount of scripting work from CI pipelines into a
standardized toolchain.

Read more about GimletD's concepts [here](/gimletd/concepts/).

## And that makes it six adoption patterns for Gimlet

Pick the one you feel the most comfortable with and let me know how it went.

I'm [@laszlocph](https://twitter.com/laszlocph) on Twitter.

Onwards!
