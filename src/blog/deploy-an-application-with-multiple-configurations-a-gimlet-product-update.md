---
layout: post
title: Deploy an application with multiple configurations - a Gimlet product update
date: 2020-05-18
image: gorilla.jpg
image_author: Mike Arney
image_url: https://unsplash.com/photos/rJ5vHo8gr2U
excerpt: |
    Deploy an application in multiple instances, each with a different configuration.
    <br /><br />
    Learn about Gimlet's new feature following a real-life scenario: a generic PyTorch machine learning API that is deployed in multiple instances, each with a different model.
topic: Product Updates
tags: [posts]
---

Now you can deploy an application in multiple instances, each with a different configuration.

Learn about Gimlet's new feature following a real-life scenario: a generic PyTorch machine learning API that is deployed in multiple instances, each with a different model.
## TLDR

The solution uses the following *.gimlet.yml*:

```yaml
envs:
  production:
    - name: pytorch-api
      strategy: simple
      namespace: models
      image: mycompany/pytorch-api
      tag: '${COMMIT_SHA:0:8}'
      containerPort: '80'
      securedIngress:
        subdomain: pytorch-api
      requests:
        cpu: 500m
        memory: 1000Mi
      limits:
        cpu: 4
        memory: 1500Mi
      vars:
        MODEL_ID: xxx
        MODEL_VERSION: 2
    - name: pytorch-api-2
      strategy: simple
      namespace: models
      image: mycompany/pytorch-api
      tag: '${COMMIT_SHA:0:8}'
      containerPort: '80'
      securedIngress:
        subdomain: pytorch-api-2
      requests:
        cpu: 500m
        memory: 1000Mi
      limits:
        cpu: 4
        memory: 1500Mi
      vars:
        MODEL_ID: yyy
        MODEL_VERSION: 4
```

## One model per customer

There is a trained model for each customer using their anonymized data, resulting in many models.
The models are deployed separately, using the same api code, parameterized with environment variables.

## New possibilities in .gimlet.yml

The `.gimlet.yml` file describes how an application is deployed on various environments.
It's an abstraction over the Kubernetes manifests, containing only the variable parts of the lengthy yaml files.

With this new Gimlet release you can not just deploy your application to various environments - staging, production, etc -
but also deploy your app in multiple configurations on the same environment.

```yaml
envs:
  production:
    - name: app2
    - name: app2
  staging:
    - name: app1
    - name: app2
    - name: app3
```

## About Gimlet.io

Gimlet packages much of the deployment logic that previously was scattered in CI pipelines and implemented by every company.
It is encapsulating all the logic to update the gitops repository in a consistent, environment aware fashion.

Head over to [https://gimlet.io](https://gimlet.io) and sign up for a trial.
