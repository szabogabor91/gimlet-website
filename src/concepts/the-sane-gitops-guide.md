---
layout: docs
title: The SANE gitops guide
lastUpdated: 2021-10-29
tags: [docs]
---

# The SANE gitops guide

Gitops means many things to many people.

What they all agree on is that gitops is a form of *Infrastructure as Code* where the infrastructure configuration is stored in a git repository - being the single source of truth - and some automation delivers it to the target system.

The term was [coined](https://www.weave.works/blog/gitops-operations-by-pull-request) in 2017 by CEO of Weave Works. Their definition enumerates the benefits of this approach, and it is rather permissive allowing many existing tools to be called as gitops tools, including Terraform, Ansible and also their gitops controller FluxCD. 

But this permissive definiton doesn't help us in our day-to-day communication. It is not clear what others mean when they talk about gitops, plus there is a disturbing thought: we already had a handful of terms defining something similar many years prior. 

Therefor this guide uses a more restrictive definition.

## Gitops, a restrictive definiton

Gitops is a continuous delivery technique used for Kubernetes that delivers Kubernetes yamls on the cluster.

Essentially tools like [FluxCD](https://fluxcd.io/), [ArgoCD](https://argo-cd.readthedocs.io/en/stable/).

This guide is going to focus on FluxCD and its concepts to explain gitops in depth.

## Gitops, a high level view

![Gitops](/gitops.svg)

- FluxCD, the gitops controller, runs in the cluster
- It pulls the latest changes from a configured gitops repository (1)
- Then it applies it on the cluster (2)
- The gitops repository is a completely normal git repository. We store Kubernetes resource definitions in it.

## Pull semantics

The presented flow is just the opposite of a what you find in CI based automation.

CI **pushes** changes to a target system, while FluxCD **pulls** changes from git and applies it on the environment it is running in.

While this looks odd at first sight, it allows for 

- a fine-grained access management. No central component knows the credentials of all target systems
- more robust error handling. Since the controller is a long running process in the target environment, it allows for a more versatile state reconsiliation, (the process when the controller tries to get the target system into the desired state), and it is better equipped to solve complex failure modes.
- flexible configuration. The environment controlls what identity it want to assume. You can easily replicate environments or control flavors of environments.

## Building on the core properties of git

- Git is a well-known toolchain for developers<br />
Making and reading changes is a skill all developers posess

- You get an audit log of all changes<br />
The log that was previously scattered in the CI build history

- Rollback based on git history<br />
Since every version is stored, rolling back to exact revisions is a core property of git

## Next steps

Congratulations. You now know 

- what role the gitops controller has
- what is the gitops repository
- and how the pull semantics work.
