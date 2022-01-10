---
layout: docs
title: Components
lastUpdated: 2021-11-09
tags: [docs]
---

# Components

GitOps looks straightforward from the outset,
but early implementations showed that constructing your GitOps workflow is far from trivial.
It involves many decisions - big and small, that add up to a lot of work as you go.

Gimlet is a modular take on GitOps that brings an opinionated layer on top of 
the common GitOps tools. It eliminates much of the decisions you have to make and gets you a developer platform on top of Kubernetes.

Gimlet CLI, GimletD and Gimlet Dash addresses the application configuration problem space. 
They were made to help developers wanting to deploy their own applications. 

Gimlet Stack is made for cluster admins to manage infrastructure components (ingress, logging, metrics etc) through a curated update stream.

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

A completely normal git repository with the role to hold all Kubernetes resource definitions of your applications.

#### Application repository
Where your application source code lives.

#### Stack CLI
With Stack CLI, you can bootstrap curated Kubernetes stacks, logging, metrics, ingress and more - all delivered with gitops.

- You can install logging aggregators, metric collectors, ingress controllers and more on your cluster with a few commands, 
without much knowledge of Helm charts, and their configuration options

- The components are delivered through a plain git repository with self-contained gitops automation

- You will get constant upgrades for the installed components from the stack curators

You write the infrarstructure gitops repo with the Stack CLI (10) and Flux pulls the changes (11) and applies it on the cluster (2).

#### Infrastructure Gitops repository

A completely normal git repository with the role to hold all Kubernetes resource definitions related to infrastructure components: ingress controller, observability stack, daemonsets etc.
