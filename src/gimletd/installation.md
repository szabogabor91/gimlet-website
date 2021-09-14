---
layout: gimletd
title: Installation
lastUpdated: 2020-03-15
tags: [gimletd]
---

# Installation YAMLs and Helm chart

```bash
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
  pullPolicy: Always
containerPort: 8888
probe:
  enabled: true
  path: /
EOF

helm template gimletd onechart/onechart -f values.yaml
```

## Volume to back the state

```diff
cat << EOF > values.yaml
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
+volumes:
+  - name: data
+    path: /var/lib/gimletd
+    size: 1Gi
+  - name: repoCache
+    path: /tmp/gimletd
+    size: 5Gi
EOF

helm template gimletd onechart/onechart -f values.yaml
```

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
+  host: gimletd.mycompany.com
+  tlsEnabled: true
EOF

helm template gimletd onechart/onechart -f values.yaml
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

helm template gimletd onechart/onechart -f values.yaml
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
+    memory: "200Mi"
+  limits:
+    cpu: "2000m"
+    memory: "1000Mi"
EOF

helm template gimletd onechart/onechart -f values.yaml
```

## Next steps

- Continue with [configuring GimletD](/gimletd/configuration)
- Or see how to [create release artifacts](/gimletd/creating-artifacts) directly with Gimlet CLI, or with Gimlet's CircleCI integration
- See how to create [ad-hoc](/gimletd/on-demand-releases) or [policy based releases](/gimletd/policy-based-releases)
