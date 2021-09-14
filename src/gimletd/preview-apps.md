---
layout: gimletd
title: Preview apps
lastUpdated: 2020-09-14
image: policy.png
tags: [gimletd]
---

# Preview apps

Using policy based releases you can define policies that automatically deploy your Pull Requests or branches.

## Policies for preview app deploys

The following snippet deploys app pushes on branches that match the `feature/*` wildcard pattern.
Variables are used to guarantee unique resource names, and avoid collision.

```yaml
# .gimlet/preview.yaml
app: myapp-{% raw %}{{ .GITHUB_BRANCH | sanitizeDNSName }}{% endraw %}
env: staging
namespace: staging
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.28.0
deploy:
  branch: feature/*
  event: push
values:
  replicas: 1
  image:
    repository: ghcr.io/podtato-head/podtatoserver
    tag: {% raw %}"{{ .GITHUB_SHA }}"{% endraw %}
  gitRepository: laszlocph/gimletd-test-repo
  gitSha: {% raw %}"{{ .GITHUB_SHA }}"{% endraw %}
```

The next example is using the `event: pr` trigger to deploy Pull Requests:

```diff
# .gimlet/preview.yaml
app: myapp-{% raw %}{{ .GITHUB_BRANCH | sanitizeDNSName }}{% endraw %}
env: staging
namespace: staging
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.28.0
+deploy:
+  event: pr
values:
 ...
```

For all the possibilities please refer to the [Policy based releases](/gimletd/policy-based-releases) section and to 
fully understand how to write a Gimlet Manifest for preview apps, check out Gimlet CLI's [Preview environments with Gimlet](/gimlet-cli/preview-environments-with-gimlet) section.
