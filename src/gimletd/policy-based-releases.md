---
layout: gimletd
title: Policy based releases
lastUpdated: 2020-03-16
image: policy.png
tags: [gimletd]
---

# Policy based releases

Now that you are familiar with [on-demand releases](/gimletd/on-demand-releases), 
you may want to automate releases to your staging or production environment.

On this page you will learn how to create release policies - that are triggered on certain conditions - 
to automatically release to a target environment.

## Set release policies in the Gimlet environment file

Gimlet CLI introduced the Gimlet environment file that is placed in your application source code repository and pins
down the release configuration to a target environment.

[Learn more](/gimlet-cli/manage-environments-with-gimlet-and-gitops/) about the Gimlet environment file if you are not familiar with the concept,
but as a recap here is an example configuration for an application's staging environment.

It pins down the Helm chart to use, its version, and the configuration variables for the staging environment:

```yaml
# .gimlet/staging.yaml
app: frontend
env: staging
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.15.3
values:
  replicas: 1
  image:
    repository: mycompany/frontend
    tag: 1.1.0
  ingress:
    host: frontend.staging.mycompany.com
    tlsEnabled: true
  vars:
    NODE_ENV: staging
```

## Adding the policy

```diff
# .gimlet/staging.yaml
app: frontend
env: staging
namespace: my-team
+deploy:
+  branch: main
+  event: push
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.15.3
values:
  replicas: 1
  image:
    repository: mycompany/frontend
    tag: 1.1.0
  ingress:
    host: frontend.staging.mycompany.com
    tlsEnabled: true
  vars:
    NODE_ENV: staging
```

GimletD processes each new artifact and matches against the defined policies.

The above example configures a release policy 
that automatically releases every git push on the `main` branch to the staging environment

## Supported git refs

GimletD supports `branch` and `tag` filters.

Both support wildcards.

### Tag pattern trigger example
```yaml
+deploy:
+  tag: v*
+  event: tag
```

Triggers on "v1", "v2", "v1.1" or any glob pattern that is supported by the https://github.com/gobwas/glob project.

### Branch pattern trigger example
```yaml
+deploy:
+  branch: feature/*
+  event: push
```

Triggers on any commit pushed to a branch that is prefixed with "feature/".

## Supported events

GimletD supports `push`, `tag` and `pr` events.

It is mandatory to set either the `branch` or the `event` condition, and they can be also defined solo.
If both are defined, the policy triggers if both conditions are satisfied.

## Next steps

- If you made a mistake, you might want to see how to [roll back](/gimletd/rolling-back)
