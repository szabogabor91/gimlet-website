---
layout: gimletd
title: Cleaning up applications
lastUpdated: 2020-09-14
image: policy.png
tags: [gimletd]
---

# Cleaning up applications

If you accidentally deployed an app, or you no longer need one, use the following one-off command: 

```bash
gimlet release delete --env local --app myapp-dummy
```

## Cleaning up preview apps

If you deploy preview apps with dynamic names, like with the branch name in the app name, 
you can use Gimlet's cleanup policies to clean them up once you don't need them anymore.

```diff
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
+cleanup:
+  branch: feature/*
+  event: branchDeleted
+  app: myapp-{% raw %}{{ .BRANCH | sanitizeDNSName }}{% endraw %}
values:
  replicas: 1
  image:
    repository: ghcr.io/podtato-head/podtatoserver
    tag: {% raw %}"{{ .GITHUB_SHA }}"{% endraw %}
  gitRepository: laszlocph/gimletd-test-repo
  gitSha: {% raw %}"{{ .GITHUB_SHA }}"{% endraw %}
```

The above snippet has a cleanup section that is triggered 
- on the `branchDeleted` event, 
- if the branch that is deleted matches the `feature/*` pattern.

Once the policy triggers, it deletes applications that are matching the `myapp-{% raw %}{{ .BRANCH | sanitizeDNSName }}{% endraw %}` pattern.

All three fields are mandatory.

Please note that only the `{% raw %}{{ .BRANCH }}{% endraw %}` variable is available for the `branchDeleted` event. At the time of deletion the shipped artifacts and their extensive 
variable set is not available, only the branch name is known that got deleted - hence the `{% raw %}{{ .GITHUB_BRANCH }}{% endraw %}` usage throughout the manifest, except 
in the cleanup policy.
