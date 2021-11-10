---
layout: gimlet-cli
title: Concepts
lastUpdated: 2020-12-23
tags: [gimletcli]
---

# Concepts

GitOps looks straightforward from the outset,
but early implementations showed that constructing your GitOps workflow is far from trivial.
It involves many decisions - big and small, that add up to a lot of work as you go.

Gimlet is a modular take on GitOps that brings an opinionated layer on top of 
the common GitOps tools. It eliminates much of the decisions you have to make, and provides the tools and workflows 
to get you started with GitOps, then stairstep you to GitOps at scale.

This page collects the decisions we made while designing Gimlet.

## Premise

Gimlet CLI, GimletD and Gimlet Dash addresses the application configuration problem space. 
While infrastructure components deserve their tools, Gimlet was made to help developers wanting to deploy their own applications. 

Gimlet Stack is made for cluster admins to manage infrastructure components (ingress, logging, metrics etc) through a curated update stream.

## Gimlet's take on the GitOps repository structure

You have to make several decisions when you start implementing GitOps.
No standards emerged yet on how to structure your GitOps repository, 
thus you have to weigh tradeoffs as you settle on your structure:
 
- will you have one central repository or many?
- how do you split repositories?
- how to organize folders inside the repository?
- how to model clusters, environments, teams, namespaces, apps?

On this page you can read about the choices Gimlet is making, bearing in mind that probably no shape will fit all teams.  

## One central repository over many

Gimlet works with one central GitOps repository over many small one.

While technically Gimlet can be used to work with several GitOps repositories, this concept is orthogonal to Gimlet's design.

Gimlet is able to model multiple clusters, environments, teams and applications in a single GitOps repository therefore the need
to split GitOps repositories often originates from team structures rather than technical choices.

Splitting the GitOps repository shows great similarity to rightsizing your services - 
whether you develop micro, nano, or team sized services - and just like that, splitting the GitOps repository is more 
an art than science, and influenced by the team structure of your company.

A good rule of thumb is that you can use a single repository for your application deployments that spans across many teams, and holds tens of applications.

Then split your shared infrastructure components to a separate repository.
Gimlet doesn't offer tools to manage those components, and typically they are managed by a dedicated team.

## Model environments and apps rather than clusters and namespaces

Gimlet avoids modelling the shape of your clusters. Instead, Gimlet works with logical environment names,
that can be mapped to clusters or namespaces.  

This abstraction allows reshaping your clusters without having to deal with GitOps changes.

Gimlet's folder structure follows the `/$environment/$application` convention, and allows you to map the environment 
to any cluster, or namespace. It even allows you to map the same environment to multiple clusters, should you need to recreate
your environment during a migration, or a fire drill.

## Manifests live in a central GitOps repo, or with the application source code? 

Gimlet resolves this dichotomy by promoting both patterns.

The deployed application manifests live in the GitOps repository and serve as the source of truth 
for debugging or disaster recovery.

But developers control their application configuration from their source code.

Gimlet introduces environment manifest files that live with the application source code and capture the
configuration values for a given environment.

Gimlet then provides tools for your automation
 that translates the declarative environments to actual manifests.
 
```yaml
# .gimlet/staging.yaml
app: myapp
env: staging
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.10.0
values:
  replicas: 1
  image:
    repository: myapp
    tag: {% raw %}"{{ .GIT_SHA }}"{% endraw %}
```

## CI to glue everything together?

While Gimlet accepts the state of mind that we use CI for everything in our workflow, 
Gimlet will gradually factor deployment logic to a standalone deployment controller.

In the meantime, Gimlet provides tools that you can use in your CI to kickstart GitOps at your company.

## Next steps

There are several paths you can take:

- Get to know the Gimlet environment manifest better in the 
  [Manage environments with Gimlet and GitOps](/gimlet-cli/manage-environments-with-gimlet-and-gitops) guide

- See what tools you can use in your CI pipeline to manage GitOps in [Bootstrap GitOps with Gimlet](/gimlet-cli/bootstrap-gitops-with-gimlet)

- or read the reference of
  - [gimlet manifest create]()
  - [gimlet manifest template]()
  - or [gimlet gitops write]()
