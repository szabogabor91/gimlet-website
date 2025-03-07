---
layout: docs
title: GimletD concepts
lastUpdated: 2021-11-09
tags: [docs]
---

# GimletD concepts

GimletD is the GitOps release manager.

It builds on the concepts, conventions and workflows that Gimlet CLI introduced 
and extends them with a centralized approach for managing releases.

It packs all release automation logic that used to be scattered in CI pipelines.

## Rational

The GitOps ecosystem lacks tooling to manage the GitOps repository and related workflows.

- How do you store manifests in your GitOps repository?
- how many GitOps repositories do you have
- how do you model clusters, environments, teams and apps?

Organizations have to answer these questions when they implement GitOps.

Gimlet answers these questions by bringing conventions to the GitOps repository to help companies implementing GitOps.

## GimletD adds centralized release workflows

GimletD acts as a centralized release manager that adds
- policy based deploys
- advanced authorization and security standards

It both allows strict control over releases, and flexibility to rewire the release workflows for all your applications at once.

And by capturing all release logic, it factors out a large amount of scripting work from CI pipelines into a 
standardized toolchain.

## It factors much of the scripting work into a standardized toolchain

Today companies use CI to automate their releases.

![GimletCLI used from CI](/gitops-with-ci.png)

Deploy and rollback steps are implemented in CI pipelines to handle the basic release workflows.

Later on, further release steps are added: dynamic environments, cleanups, notifications.

Steps that every application has to maintain.

This decentralized approach allows little room for control, flexibility and complex features. 
GimletD assumes all release focused tasks and the management of the GitOps repository.

## Introducing the release artifact

GimletD achieves this by introducing a new concept, the release artifact. It serves as the means to detach release workflows from CI.

With GimletD, CI pipelines create an artifact for every releasable version of the application, but not release them.
GimletD then serves as a release manager to perform ad-hoc or policy based releases.

GimletD operates only on the releasable artifacts that CI creates. This split allows for the above listed features.

![GimletD operates on the release artifacts, manages the GitOps repository](/gimletd-with-gitops.png)

** The artifact store is implemented in GimletD, hence the matching colors

Now, let's look at the release artifact.

## The release artifact

Instead of releasing, CI generates a release artifact for each releasable version of the application.

The artifact contains all metadata that can be later used for releasing and auditing.

GimletD stores the release artifacts in the artifact storage.

```json
{
  "id": "mycompany/frontend-ffd302df-2d85-4aa4-acd1-957ea6bcceeb",
  "version": {
    "repositoryName": "mycompany/frontend",
    "sha": "deae5dbaf237766240181fa397e923d3c5253112",
    "branch": "new-feature",
    "event": "pr",
    "sourceBranch": "new-feature",
    "authorName": "Laszlo Fogas",
    "authorEmail": "xxx",
    "committerName": "Laszlo Fogas",
    "committerEmail": "xxx",
    "message": "This is a wonderful new feature",
    "url": "https://github.com/mycompany/frontend/pull/100"
  },
  "context": {
    "CIRCLECI": "true",
    "CIRCLECI_PKG_DIR": "/opt/circleci",
    "CIRCLE_BRANCH": "persist-insights-filters",
    "CIRCLE_BUILD_NUM": "2254",
    "CIRCLE_BUILD_URL": "https://circleci.com/gh/mycompany/frontend/22",
    "CIRCLE_COMPARE_URL": "",
  [...]
  },
  "environments": [
    {
      "app": "frontend",
      "env": "staging",
      "namespace": "staging",
      "chart": {
        "repository": "https://chart.onechart.dev",
        "name": "onechart",
        "version": "0.10.0"
      },
      "values": {
        "containerPort": 5000,
        "image": {
          "pullPolicy": "Always",
          "repository": "mycompany/frontend",
          "tag": "{{ .CIRCLE_SHA1 }}"
        },
        "ingress": {
          "annotations": {
            "cert-manager.io/cluster-issuer": "letsencrypt",
            "kubernetes.io/ingress.class": "nginx"
          },
          "host": "frontend.staging.mycompany.com",
          "tlsEnabled": true
        },
        "probe": {
          "enabled": true,
          "path": "/healthcheck"
        },
        "replicas": 1,
        "vars": {
          "NODE_ENV": "production",
        }
      }
    }
  ],
  "items": [
    {
      "name": "CI",
      "url": "https://circleci.com/gh/mycompany/frontend/22"
    },
    {
      "name": "docker-image",
      "url": "mycompany/frontend:deaevvbaf237766240181fa397e923d3c5253112"
    }
  ]
}
```

While this is a sizable json structure, we have integrations with most CI engines out there today.

You can also use Gimlet CLI's `gimlet artifact` commands, should you work with something that is not integrated with Gimlet.
