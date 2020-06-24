---
layout: post
title: The last-mile problem with Kubernetes
date: 2020-06-23
image: randy-laybourne-06P0tprVDvY-unsplash.jpg
image_author: Randy Laybourne
image_url: https://unsplash.com/photos/06P0tprVDvY
excerpt: |
    Transporting goods via freight rail networks and container ships is often the most efficient and cost-effective manner of shipping. <br /><br />
    However, when goods arrive at a high-capacity freight station or port, they must then be transported to their final destination. This last leg of the supply chain is often less efficient, comprising up to 41% of the total cost to move goods.
topic: Case Study
tags: [posts]
---

> Transporting goods via freight rail networks and container ships is often the most efficient and cost-effective manner of shipping. <br /><br />
> However, when goods arrive at a high-capacity freight station or port, they must then be transported to their final destination. This last leg of the supply chain is often less efficient, comprising up to 41% of the total cost to move goods.
>
> [1]

Something similar we see with Kubernetes projects.

Kubernetes standardized distributed systems deployment and operations, companies adopt it with great pace. But they have to deal with the variable parts as well:
the metrics stack, the logging stack, the ingress architecture and - the biggest of it all - tooling to fit with their company processes.

Gimlet came about to ease the last point: to provide sensible defaults where companies are not really that unique, and to provide flexibility for the parts that truly vary.

In this article you will learn how one of our early users used Gimlet to cater for their ingress architecture. Let's call them FlyCorp in this article.

But how does FlyCorp's ingress architecture look?

Let's find out.

## The ingress architecture

There are two named environments in their setup: `staging` and `production`, and two ingress controllers with the matching ingress class.

FlyCorp experiments a lot and as a result, some services don't have authentication and authorization built in, but they still want to iterate on it with the non-technical team members.
Thus, they have to make it accessible on a publicly accessible URL. They use HTTP Basic Authentication to protect those services.

FlyCorp configured Gimlet's master template to provide these options for the team:

![Ingress setup](/ingress.png)

## Master Template introduction

The Master Template is what drives Gimlet's deployment configuration screen, and also the one that provides the deployment options of the `gimlet.yaml` file.
The two are interchangable - the UI is great when you are getting started, the yaml is perfect when you deploy your fifth service.

![Gimlet deployment configuration](/config-screen.png)

The Master Template is a generic Kustomize template that Gimlet dynamically generates, based on the configuration parameters.

The `questions.yaml` file is what holds the template together. It specifies every configuration option, 
the technical details and the explanation text as well that shows up on the UI.  

```yaml
baseline: v0.4.6
questions:
  - variable: name
    label: Name
    description: The name of your application
    type: string
    group: basic
    required: true
  - variable: namespace
    label: Namespace
    description: The namespace to put your application in
    type: string
    group: basic
    required: true
  - variable: image
    label: Image name
    description: The image to deploy
    type: string
    group: basic
    required: true
  - variable: tag
    label: Image tag
    description: The image tag to apply on release. Supports bash string manipulations
    type: string
    group: basic
    required: true
    default: "${COMMIT_SHA:0:8}"
  - variable: replicas
    label: Replicas
    description: The number of instances to run
    type: int
    group: misc
    required: true
    default: 1
    range:
      min: 1
      max: 12
      step: 1
```

Providing these values to Gimlet - through the UI or in a `gimlet.yaml` file, it will generate the Kustomize template.
 
During deployment, Gimlet unfolds the Kustomize template to the gitops repository, where pure Kubernetes resources are stored.
You too can track the changes in the Kubernetes reources upon a deploy.

## The ingress templates

Just like the name, namespace and replica fields, the ingress configuration too has its matching entry in the `questions.yaml` file.

In addition to the common fields, it specifies the `resource` field, which tells Gimlet to add the `ingress.yaml` to the generated Kustomize resource file list.

questions.yaml
```yaml
  - variable: ingress
    label: Ingress
    description: Exposes the application on a public URL, behind a firewall
    type: complex
    group: networking
    resource: ingress.yaml
    subquestions:
      - variable: subdomain
        label: Subdomain
        description: Specifies the subdomain your app is going to be exposed on <<subdomain>>.staging.xxx.com
        type: string
```

ingress.yaml
```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: {% raw %}{{ .name }}{% endraw %}
  annotations:
    kubernetes.io/ingress.class: nginx
    certmanager.k8s.io/cluster-issuer: letsencrypt
spec:
  tls:
    - hosts:
        - {% raw %}{{ .ingress.subdomain }}{% endraw %}.staging.xxx.com
      secretName: tls-secret-{% raw %}{{ .ingress.subdomain }}{% endraw %}
  rules:
    - host: {% raw %}{{ .ingress.subdomain }}{% endraw %}.staging.xxx.com
      http:
        paths:
          - path: /
            backend:
              serviceName: {% raw %}{{ .name }}{% endraw %}
              servicePort: {% raw %}{{ .containerPort }}{% endraw %}
```

Since the Master Template lives in FlyCorp's company gitops repo, they extended it with two new options:
 - production URls
 - and optional HTTP basic authentication

## Production URL support

They defined the `production` variable, which if set, Gimlet adds the `ingress-hostname.yaml` file as a `patchesJson6902` Kustomize patch.

questions.yaml

```diff
  - variable: ingress
    label: Ingress
    description: Exposes the application on a public URL, behind a firewall
    type: complex
    group: networking
    resource: ingress.yaml
    subquestions:
      - variable: subdomain
        label: Subdomain
        description: Specifies the subdomain your app is going to be exposed on <<subdomain>>.staging.xxx.com
        type: string
+     - variable: production
+       label: Production
+       description: Set if this is a production config. If set, the URL will be <<subdomain>>.xxx.com
+       type: bool
+       default: false
+       patchJson6902:
+         group: networking.k8s.io
+         version: v1beta1
+         kind: Ingress
+         name: "{% raw %}{{ .name }}{% endraw %}"
+         patch: ingress-hostname.yaml
```

The overlay is a standard Kustomize JSON patch, which will overwrite the ingress host name to the production URL schema

ingress-hostname.yaml
```yaml
- op: replace
  path: /spec/rules/0/host
  value: {% raw %}{{ .ingress.subdomain }}{% endraw %}.xxx.com
- op: replace
  path: /spec/tls/0/hosts/0
  value: {% raw %}{{ .ingress.subdomain }}{% endraw %}.xxx.com
```

If you are new to Kustomize you can get started on [https://kustomize.io/](https://kustomize.io/)
It is the official way to template Kubernetes manifests, although not as adopted as Helm. Gimlet's Helm support in the Master Template will arrive soon.

## Providing the basic authentication feature to devs

FlyCorp then added another variable to the `questions.yaml` file, to determine whether basic auth is enabled for the ingress or not.

If enabled they apply another `patchesJson6902` on the ingress resource.

questions.yaml
```diff
+  - variable: basicauth
+    label: Basic Auth
+    description: Add HTTP Basic Authentication in front of your app. Use it if your app doesn't have built in auth.
+    type: bool
+    default: false
+    patchJson6902:
+      group: networking.k8s.io
+      version: v1beta1
+      kind: Ingress
+      name: "{% raw %}{{ .name }}{% endraw %}"
+      patch: ingress-basicauth.yaml
```

The Kustomize patch that adds the annotations to enable basic auth:

```yaml
- op: add
  path: "/metadata/annotations/ingress.appscode.com~1auth-realm"
  value: Authentication Required
- op: add
  path: "/metadata/annotations/nginx.ingress.kubernetes.io~1auth-type"
  value: basic
- op: add
  path: "/metadata/annotations/nginx.ingress.kubernetes.io~1auth-secret"
  value: kube-system/auth
```

## Next steps

With the custom fields, FlyCorp was able to provide standardized options to their developers.

Prior to adopting Gimlet, they documented the possibilities in their company wiki, 
but developers didn't fully know what features were available for them to use. With Gimlet, they see it now on the UI.

To have your team features codified, check out the full reference of the [Gimlet Master Template](https://docs.gimlet.io/setup/master-template/) and check out [Gimlet](https://gimlet.io) too.

<br/>
<br/>
[1] https://en.wikipedia.org/wiki/Last_mile_(transportation)
<br/>