---
layout: gimlet-dash
title: Configuring Gimlet Dash
lastUpdated: 2020-09-06
tags: [gimlet-dash]
---

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
