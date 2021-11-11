---
layout: docs
title: Healthcheck
lastUpdated: 2021-02-15
tags: [docs]
---

# Healthcheck

You can set a Kubernetes Readiness probe that determines whether your app is healthy and if it should receive traffic.

Enable it with:

```bash
probe:
  enabled: false
  path: "/"
```

Check the Kubernetes manifest:

```bash
cat << EOF > values.yaml
probe:
  enabled: false
  path: "/"
EOF

helm template my-release onechart/onechart -f values.yaml
```

## Finetuning

You can further tune the frequency and thresholds of the probe with:

```yaml
probe:
  enabled: false
  path: "/"
  settings:
    initialDelaySeconds: 0
    periodSeconds: 10
    successThreshold: 1
    timeoutSeconds: 3
    failureThreshold: 3
```



| Setting        | Description           | 
| ------------- |:-------------|
| initialDelaySeconds      | Number of seconds after the container has started before the probes is initiated      |
| periodSeconds |How often (in seconds) to perform the probe     |
| successThreshold | Minimum consecutive successes for the probe to be considered successful after having failed      |
| timeoutSeconds | Number of seconds after which the probe times out     |
| failureThreshold | When a probe fails, Kubernetes will tries this many times before giving up. Giving up the pod will be marked Unready and won't get any traffic      |
