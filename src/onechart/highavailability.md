---
layout: onechart
title: Healthcheck
lastUpdated: 2021-02-15
tags: [onechart]
---

# High-Availability

OneChart makes your applications highly available as long as you set the replicas more than 1.

```bash
replicas: 2
```

By default, OneChart sets two more flags if the replica count is higher than one:

- PodDisruptionBudgets
- and pod anti affinity

You can turn them off by setting the following values to `false`:

```yaml
podDisruptionBudgetEnabled: true
spreadAcrossNodes: true
```

These two flags make sure that your application pods are spread across nodes and never placed on the same one.

Also, in case of node maintenance, it makes sure that nodes are drained in an order that leaves at least one instance running from your application.
