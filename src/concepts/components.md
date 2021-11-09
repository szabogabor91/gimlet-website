---
layout: docs
title: Components
lastUpdated: 2021-11-09
tags: [docs]
---

# Components

Gimlet is a set of tools that will get you an application operations platform on top of Kubernetes.

![Gimlet components](/components.svg)

#### Gimlet CLI
Gimlet CLI is a command line tool that you run on your laptop.

- You can initiate releases, rollbacks
- Collect information about versions, look at the release log
- Render manifests locally for debug purposes

Gimlet CLI talks to GimletD, Gimlet's release manager, to perform most of its capabilities. 4) on the diagram.

#### Gimlet Dash
The Gimlet Dashboard is where you can get a comprehensive overview quick.

- It displays realtime Kubernetes information about your deployments
- also realtime git information about your commits, branches and their build statuses
- You can also initiate releases and rollbacks, just like with Gimlet CLI

Gimlet Dash receives real-time Kubernetes information from the Gimlet Agent (7), talks to GimletD to take release actions (9), and talks to your application source code git repository to collect commit information (8).


#### Gimlet Agent
Gimlet Agent is a pod running in your Kubernetes cluster. It collects realtime information about your deployments, and forwards it to the Gimlet Dashboard (7).

#### GimletD

GimletD is the release manager. It has write access to the gitops repository (3), and encompasses all logic related to making releases, rollbacks, and git audit log processing.

This is the only components that has write access to the gitops repository.

#### Flux
Flux is the gitops controller. It polls the gitops repository (1) and applies changes to the Kubernetes cluster (2).

#### Gitops repository

A completely normal git repository with the role to hold all Kubernetes resource definitions

#### Application repository
Where your application source code lives.