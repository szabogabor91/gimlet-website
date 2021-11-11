---
layout: docs
title: Install the Gimlet Dash UI
lastUpdated: 2020-09-06
tags: [docs]
---

# Install the Gimlet Dash UI

Gimlet Dash is a developer focused generic Kubernetes dashboard and a UI for Gimlet tools.

It gives a

- a realtime view on Kubernetes resources

![Gimlet Dash Kubernetes resources](/gimlet-dash-rt-k8s.png)

- a realtime view on your git commits

![Gimlet Dash Kubernetes resources](/gimlet-dash-rt-commits.png)

- an overview on what was deployed and when, by whom

![Gimlet Dash Kubernetes resources](/gimlet-dash-history.png)

- and you can deploy on-demand

![Gimlet Dash Kubernetes resources](/gimlet-dash-deploy.png)

In this tutorial you are going install Gimlet Dash and connect it to Github and GimletD.

## Installation yamls and configuration

```bash
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimlet-dashboard
  tag: latest
  pullPolicy: Always
containerPort: 9000
probe:
  enabled: true
  path: /
EOF

helm repo add onechart https://chart.onechart.dev
helm template gimlet-dashboard onechart/onechart -f values.yaml
```

## Volume to back the state

```diff
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimlet-dashboard
  tag: latest
  pullPolicy: Always
containerPort: 9000
probe:
  enabled: true
  path: /
+volumes:
+  - name: data
+    path: /var/lib/gimlet-dashboard
+    size: 1Gi
+    storageClass: default
+  - name: repo-cache
+    path: /tmp/gimlet-dashboard
+    size: 5Gi
+    storageClass: default
EOF

helm template gimlet-dashboard onechart/onechart -f values.yaml
```

- `data` volume to back the SQLite database where Gimlet Dashboard keeps its data
- `repo-cache` is where Gimlet Dashboard checks out git repositories of your applications. Data can be cleaned from this disk, it serves only as cache. 

## Ingress

```diff
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
+ingress:
+  annotations:
+    kubernetes.io/ingress.class: nginx
+    cert-manager.io/cluster-issuer: letsencrypt
+  host: gimlet.mycompany.com
+  tlsEnabled: true
EOF

helm template gimlet-dashboard onechart/onechart -f values.yaml
```

## Debug sidecar container

In case you need tools to debug.

```diff
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
+ sidecar:
+   repository: debian
+   tag: stable-slim
+   shell: "/bin/bash"
+   command: "while true; do sleep 30; done;"
EOF

helm template gimlet-dashboard onechart/onechart -f values.yaml
```

## Limiting resources

```diff
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
+resources:
+  requests:
+    cpu: "50m"
+    memory: "100Mi"
+  limits:
+    cpu: "2000m"
+    memory: "200Mi"
EOF

helm template gimlet-dashboard onechart/onechart -f values.yaml
```

## Next steps

- Continue with [configuring Gimlet Dashboard](/gimlet-dash/configuration)
