---
layout: gimletd
title: Configuring GimletD
lastUpdated: 2020-03-16
tags: [gimletd]
---

# Configuring GimletD

## Setting a Gitops repository

This will kickstart the Gitops worker.

- Generate a keypair with 

```
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
``` 

- Open GitHub, navigate to your gitops repository, and under *Settings > Deploy keys* click on *"Add deploy key"*
- Paste the generated public key
- Make sure to check the *"Allow write access"* checkbox

```diff
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
+vars:
+  GITOPS_REPO: mycompany/gitops
+  GITOPS_REPO_DEPLOY_KEY_PATH: /github/deploy.key
+sealedFileSecrets:
+  - name: github-gitops-deploy-key
+    path: /github
+    filesToMount:
+      - name: deploy.key
+        source: AgA/7BnNhSkZAzbMqxMDidxK[...]
EOF

helm repo add onechart https://chart.onechart.dev
helm template gimletd onechart/onechart -f values.yaml
```

If you don't have Sealed Secrets running in your cluster, you can use your own secrets solution, or the following example
that uses regular Kubernetes secrets stored in git (not for production use).

```diff
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
vars:
  GITOPS_REPO: mycompany/gitops
  GITOPS_REPO_DEPLOY_KEY_PATH: /github/deploy.key
+fileSecrets:
+  - name:  github-gitops-deploy-key
+    path: /github
+    secrets:
+      deploy.key: |
+        -----BEGIN OPENSSH PRIVATE KEY-----
+        b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAACFwAAAAdzc2gtcn
+        NhAAAAAwEAAQAAAgEA7BqMTFnDm6+C9FrRK5aoj[...]
```

#### Slack notifications

First, create a Slack app

To generate a new Slack token visit the [https://api.slack.com/apps](https://api.slack.com/apps) page and follow these steps:

- Create a new application. *"App Name"* is Gimlet, pick your workspace as *"Development Slack Workspace"*
- Navigate to *"OAuth & Permissions"* on the left sidebar
- Under *"Bot Token Scopes"*, add scopes `chat:write`, `chat:write.customize` and `chat:write.public`
- Click the *"Install App to Workspace"* button on the top of the page
- Once you installed the app, save *"Bot User OAuth Access Token"* in Gimlet above


```diff
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
+vars:
+  NOTIFICATIONS_PROVIDER: slack
+  NOTIFICATIONS_TOKEN: xoxb-41[...]
+  NOTIFICATIONS_DEFAULT_CHANNEL: gimletd
EOF

helm template gimletd onechart/onechart -f values.yaml
```

#### Github token to update commit statuses

- Set `GITHUB_STATUS_TOKEN` with a Github Personal Access Token with `repo:status` permission.
- Go and add the Personal Access Token now at [https://github.com/settings/tokens](https://github.com/settings/tokens)

```diff
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
+vars:
+  GITHUB_STATUS_TOKEN: 9a4243[...]
EOF

helm template gimletd onechart/onechart -f values.yaml
```

#### Deploy key to access private Helm chart repositories

If you use a Helm chart from a private git repository - like if you forked OneChart - add a read-only deploy key to the repo on Github.

You can follow how to add a deploy key in the [Setting a Gitops repository](#setting-a-gitops-repository) section.

```diff
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
+vars:
+  GITOPS_CHART_ACCESS_DEPLOY_KEY_PATH: /github-chart/deploy.key
+sealedFileSecrets:
+  - name: github-chart-deploy-key
+    path: /github-chart
+    filesToMount:
+      - name: deploy.key
+        source: AgBGFCheUt5LP9[...]
EOF

helm template gimletd onechart/onechart -f values.yaml
```

## Notifications on gitops repo applies

This section you will configure Flux - the gitops controller - to notify GimletD whenever it applies the latest changes.

- Generate a Gimlet user for Flux:

```bash
curl -i \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -X POST -d '{"login":"flux"}' \
  http://gimletd.mycompany.com:8888/api/user\?access_token\=$GIMLET_ADMIN_TOKEN
```

- Create the `notifications.yaml` file in your gitops repo under $your_env/flux/notifications.yaml

```yaml
apiVersion: notification.toolkit.fluxcd.io/v1beta1
kind: Provider
metadata:
  name: gimletd
  namespace: flux-system
spec:
  type: generic
  address: https://gimletd.<your-company-com>/api/flux-events?access_token=<token>
---
apiVersion: notification.toolkit.fluxcd.io/v1beta1
kind: Alert
metadata:
  name: all-kustomizations
  namespace: flux-system
spec:
  providerRef:
    name: gimletd
  eventSeverity: info
  eventSources:
    - kind: Kustomization
      namespace: flux-system
      name: '*'
  suspend: false
```

You will see the notifications reaching Slack:

![Notifications on gitops applies](https://raw.githubusercontent.com/gimlet-io/gimletd/tip/docs/notifs.png)

## Next steps

- Continue with [getting access to the API](/gimletd/api-access)
- Or see how to [create release artifacts](/gimletd/creating-artifacts) directly with Gimlet CLI, or with Gimlet's CircleCI integration
- See how to create [ad-hoc](/gimletd/on-demand-releases) or [policy based releases](/gimletd/policy-based-releases)
