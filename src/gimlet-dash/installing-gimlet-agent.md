---
layout: gimlet-dash
title: Installating Gimlet Agent
lastUpdated: 2020-09-06
tags: [gimlet-dash]
---

# Installing Gimlet Agent

## ServiceAccount and ClusterRole

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gimlet-agent
  namespace: gimlet
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: gimlet-agent
subjects:
  - kind: ServiceAccount
    name: gimlet-agent
    namespace: gimlet
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
```

## Agent installation

```bash
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimlet-dashboard
  tag: agent-latest
  pullPolicy: Always
serviceAccount: gimlet-agent
EOF

helm repo add onechart https://chart.onechart.dev
helm template gimlet-agent onechart/onechart -f values.yaml
```

## Configuring the agent

```diff
image:
  repository: ghcr.io/gimlet-io/gimlet-dashboard
  tag: agent-latest
  pullPolicy: Always
serviceAccount: gimlet-agent
+vars:
+  HOST: gimletd.mycompany.com
+  AGENT_KEY: xyz
+  ENV: staging  
```

where: 

- `HOST` is where you run Gimlet Dash
- `AGENT_KEY` is the api key for agents. Find it in Gimlet Dash's startup log
- `ENV` is the name of the environment like `staging` or `production`. If you have multiple environments on a single cluster,
you can map an environment to a single namespace. Use `staging=gimlet-demo-staging` to map the `gimlet-demo-staging` namespace.

## Limiting resources

```diff
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimlet-dashboard
  tag: agent-latest
  pullPolicy: Always
serviceAccount: gimlet-agent
+resources:
+  requests:
+    cpu: "50m"
+    memory: "100Mi"
+  limits:
+    cpu: "500m"
+    memory: "200Mi"
EOF

helm template gimlet-agent onechart/onechart -f values.yaml
```

## Next steps

- Continue with [configuring Gimlet Dashboard](/gimlet-dash/configuration)
