---
layout: docs
title: How-to structure gitops repositories
lastUpdated: 2021-11-11
tags: [docs]
---

# How-to structure gitops repositories

You have to make several decisions when you start implementing gitops.
No standards emerged yet on how to structure your gitops repository, 
thus you have to weigh tradeoffs as you settle on your structure:
 
- will you have one central repository or many?
- how do you split repositories?
- how to organize folders inside the repository?
- how to model clusters, environments, teams, namespaces, apps?

On this page you can read about the choices Gimlet is making, bearing in mind that probably no shape will fit all teams.  

## One central repository over many

Gimlet works with one central gitops repository over many small one.

While technically Gimlet can be used to work with several gitops repositories, this concept is orthogonal to Gimlet's design.

Gimlet is able to model multiple clusters, environments, teams and applications in a single gitops repository therefore the need to split gitops repositories often originates from team structures rather than technical choices.

Splitting the gitops repository shows great similarity to rightsizing your services - 
whether you develop micro, nano, or team sized services - and just like that, splitting the gitops repository is more 
an art than science, and influenced by the team structure of your company. That said splitting gitops repositories into many is usually driven by access control.

A good rule of thumb is that you can use a single repository for your application deployments that spans across many teams, and holds tens of applications.

Then split your shared infrastructure components to a separate repository.

## Model environments and apps rather than clusters and namespaces

Gimlet avoids modelling the shape of your clusters. Instead, Gimlet works with logical environment names,
that can be mapped to clusters or namespaces.  

This abstraction allows reshaping your clusters without having to deal with gitops changes.

Gimlet's folder structure follows the `/$environment/$application` convention, and allows you to map the environment 
to any cluster, or namespace. It even allows you to map the same environment to multiple clusters, should you need to recreate your environment during a migration, or a fire drill.
