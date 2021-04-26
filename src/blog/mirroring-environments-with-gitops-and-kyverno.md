---
layout: post
title: "Mirroring environments with gitops and Kyverno"
date: 2021-04-26
excerpt: |
    See how you can mirror complete environments with gitops and rewrite host names with Kyverno's mutating admission controllers.
topic: Ecosystem
image: gitops-kyverno2.png
image_author: Paweł Czerwiński
image_url: https://unsplash.com/photos/bRwM14s-XcE
tags: [posts]
---

One of the benefits of gitops that we often cite is the ability to recreate environments in case of a disaster recovery situation.

Git being the source of truth in gitops, the recovery does not differ from normal deployment scenarios: we point the gitops controller to the 
git repository that holds the deployment manifests, and it syncs the state onto the cluster.

Or clusters. Actually, nothing prevents us from syncing one git repository to multiple clusters.

## Mirroring complete environments with gitops

By syncing the same git repository onto multiple clusters, we can create an identical mirror of an environment.
Or so my thinking was when I needed to prepare an environment for an intrusive penetration test. In this exploratory test I wanted to limit
side effects, therefore a mirrored environment seemed like a good idea.

And building on the core properties of gitops it didn't look too difficult either.

## When mirrors are too identical

Mirroring an environment with gitops makes certain things trivial, like keeping the deployments in sync.

But when I launched the mirrored env, I realized that mirrored application Ingresses are configured to use the same hostname as on the original environment.
Making them practically unreachable as the DNS record points to the original cluster.

While I could circumvent the problem with host file entries locally, the Let's Encrypt certificates were not issued as ACME requests were hitting the other environment.

I somehow needed to change the hostname for the mirrored env.

Changing the hostname in git was not an option since the original environment would also get the change.
I somehow needed to intercept and change the configuration at deployment time.

## Using Mutating Admission Controllers to rewrite manifests at deployment time

Twitter to the rescue. Turned out the coming (now merged) version of Kyverno will be able to do string replace on Ingress hostnames.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">You could use Kyverno to patch the ingress <a href="https://t.co/lyW53aiCRa">https://t.co/lyW53aiCRa</a></p>&mdash; Stefan Prodan (@stefanprodan) <a href="https://twitter.com/stefanprodan/status/1369619082379726852?ref_src=twsrc%5Etfw">March 10, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Kyverno is a Kubernetes Admission Controller that you can use to mandate certain policies on your cluster, like not allowing root user on it, 
or set defaults to applications if the author forgot to set them. 

With the most recent version, I could use a string replace function on the Ingress hostname, making my mirrored environment accessible on its unique host name:

```yaml

apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: replace-staging-to-mirror
spec:
  background: false
  rules:
    - name: replace-staging-to-mirror
      match:
        resources:
          kinds:
          - Ingress
      mutate:
        patchesJson6902: |-{% raw %}
          - op: replace
            path: /spec/rules/0/host
            value: {{ replace_all(request.object.spec.rules[0].host, 'staging.mycompany.com', 'mirror.mycompany.com') }}
          - op: replace
            path: /spec/tls/0/hosts/0
            value: {{ replace_all(request.object.spec.rules[0].host, 'staging.mycompany.com', 'mirror.mycompany.com') }}{% endraw %}
```

## So is my source of truth intact?

There was just one thing that kept bugging me: if I use gitops, and I store completely rendered manifests in git, would it break my principle of git being the source of truth?

In a strict interpretation I think it breaks it.

What gives me some comfort is the fact that the Kyverno mutating rule is also stored in git, 
and I can think of this approach as if the environment knows what URL it is really bound to. And as long as I don't have too many of these special rules, it should be fine.

## Gitops made it transparent to create mirrored environments

It took no more than launching a new cluster and pointing the controller to the git repo.

With the Kyverno mutating rule, the final tailoring of the environment is also clean, and I like that.
