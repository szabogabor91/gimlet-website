---
layout: post
title: "Are you sure none of your containers run as root?"
date: 2021-11-24
excerpt: |
    The Kyverno policy engine just arrived in Gimlet Stack. Let's see how you can be certain that none of the containers run as root in your Kubernetes cluster.
topic: Gimlet Stack
image: introducing-kyverno.png
tags: [posts]
---

The Kyverno policy engine just arrived in Gimlet Stack. Let's see how you can be certain that none of the containers run as root in your Kubernetes cluster.

## Kyverno is a policy engine

Kyverno runs on your Kubernetes cluster, hooks into the API server's extension points and able to determine if a resource is of the shape as the policies you defined.

Based on those policies it can validate (and reject), or even mutate the deployed resources, making it a very powerful tool for you.

In order to detect if a container is running as root, we are going to use Kyverno's validation feature in this article, and alert if a root container is deployed on the cluster.

## Kyverno uses the stadardized extension points of the Kubernetes API server

When you type `kubectl apply`, the Kubernetes API server gets your request and passes it through a series of steps.

It provides two extension points

- for mutating admission controllers
- and validating admission controllers

to - as the name suggests - mutate the resources that you are about to create, and to determine if they are allowed on the cluster or not.

![How Kyverno extends the Kubernetes API server](https://kyverno.io/images/kyverno-architecture.png)

Kyverno implements both of these extension points and able to due quite handy stuff. Like automatically injecting resource limits, or what our article is about: checking if a pod is running as root or not.

If it is running as root, Kyverno sends a rejection response in the validating admission webhook request, and the Kubernetes API server turns down your `kubectl apply` request.

## Introducing Kyverno to Gimlet Stack

Gimlet Stack is a CLI tool that you can use to bootstrap curated stacks on your Kubernetes cluster. Making it an application platform from day one.

Things that would take you hours to set up, should be just there from the get go. Policy engines is typically a day two thing to set  up for a Kubernetes cluster. There is just so many other things to get right before cluster admins get to policies.

But not anymore.

Now you can add Kyverno to your platform with Gimlet Stack on the UI:

![Enabling Kyverno on the Gimlet Stack UI](/enabling-kyverno.png)

or in your stack.yaml

```yaml
---
stack:
  repository: https://github.com/gimlet-io/gimlet-stack-reference.git?tag=v0.10.0
config:
  kyverno:
    enabled: true
    podSecurityStandard: restricted
```

## The non root policy

At Gimlet.io, we like Kyverno for it simplicity.

The fact that you can define policies with a CRD, giving you the configuration experience like any other k8s resource. That is, writing yamls.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-run-as-non-root
spec:
  validationFailureAction: audit
  background: true
  rules:
  - name: check-containers
    match:
      resources:
        kinds:
        - Pod
    validate:
      message: >-
        Running as root is not allowed. The fields spec.securityContext.runAsNonRoot,
        spec.containers[*].securityContext.runAsNonRoot, and
        spec.initContainers[*].securityContext.runAsNonRoot must be `true`.        
      anyPattern:
      - spec:
          securityContext:
            runAsNonRoot: true
          containers:
          - =(securityContext):
              =(runAsNonRoot): true
          =(initContainers):
          - =(securityContext):
              =(runAsNonRoot): true
      - spec:
          containers:
          - securityContext:
              runAsNonRoot: true
          =(initContainers):
          - securityContext:
              runAsNonRoot: true
```

The above `ClusterPolicy` is checking if the depployed `Deployments` have the `runAsNonRoot: true` flag in their pod specification. If not, then it will not pass this policy.

It is worth noting that Kyverno is not looking inside the container to validate if it is really running as root. Instead, it relies on existing Kubernetes controls, `runAsNonRoot: true`, and the developer's diligence of adding the flag in their `Deployment` configuration. Should they not add the flag, their deployment is flagged if the policy is in `validationFailureAction: audit` mode, or rejected if `validationFailureAction ` is set to `enforce`.

The above policy is part of group of `restricted` policies that you can deploy with Gimlet Stack. The two supported set of policies, baseline and restricted, are also documented on the [Kyverno website](https://kyverno.io/policies).

## Checking violating containers

Gimlet deploys Kyverno policies in `audit` mode. Thus the natural next step is to see the pods that are harming policies.

For that purpose Gimlet Stack includes a Grafana dashboard:

![Pods that harm policies](/policy-dash.png)

## Setting alert on it

To round up policy reporting, let's set an alert on it too.

Looking at dashboards just adds to the daily toil that you do anyways. Instead, let's have Grafana reach out to you if a new pod is running as non root.

To do that, duplicate the "Failing Policies" widget on the dash and limit it to the `require-run-as-non-root` policy with the following query: `sum(increase(kyverno_policy_results_total{rule_result="fail", policy_name="require-run-as-non-root"}[45s])) by (policy_name)`

![Alerting on pods that run as root](/policy-alert.png)


## Gimlet stack going wide and deep

Adding Kyverno to Gimlet Stack rounds up a recent push of going wide.

If you like what you saw, you may also be interested in hearing about Gimlet Stack going deep.

Gimlet Stack for Amazon EKS arrives soon, see the announcement:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Gimlet Stack for EKS is coming this year.<br><br>The why, the what and to get notified, check out <a href="https://t.co/GdzcO7BuFn">https://t.co/GdzcO7BuFn</a><br><br>Feature set 👉 <a href="https://t.co/XypJMgGDb2">pic.twitter.com/XypJMgGDb2</a></p>&mdash; Laszlo Fogas (@laszlocph) <a href="https://twitter.com/laszlocph/status/1460954766159368193?ref_src=twsrc%5Etfw">November 17, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Onwards!
