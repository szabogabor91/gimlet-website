---
layout: docs
title: The SANE gitops guide
lastUpdated: 2021-10-29
tags: [docs]
---

# The SANE gitops guide

Gitops means many things to many people.

What they all agree on is that gitops is a form of *Infrastructure as Code* where the infrastructure configuration is stored in a git repository - it being the single source of truth - and some automation delivers it to the target system.

The term was [coined](https://www.weave.works/blog/gitops-operations-by-pull-request) in 2017 by CEO of Weave Works. Their definition enumerates the benefits of this approach, and it is rather permissive allowing many existing tools to be called as gitops tools, including Terraform, Ansible and also their gitops controller FluxCD. 

But this permissive definiton doesn't help us in our day-to-day communication. It is not clear what others mean when they talk about gitops, plus there is a disturbing thought: we already had a handful of terms defining something similar many years prior. 

Therefor this guide uses a more restrictive definition.

## Gitops, a restrictive definiton

Gitops is a continuous delivery technique used for Kubernetes that delivers Kubernetes yamls on the cluster.

Essentially tools like [FluxCD](https://fluxcd.io/), [ArgoCD](https://argo-cd.readthedocs.io/en/stable/).

This guide is going to focus on FluxCD and its concepts to explain gitops in depth.


Ci vs gitops
two diagrams ci vs gitops controller
declarative, vs procedural
central access, control theory self managing
recoverability


Gitops attributes
audit, used to be in CI transaction logs

next: bootstrap gitops automation tutorial
next: how to structure gitops repos


