---
layout: docs
title: Volumes
lastUpdated: 2020-12-09
tags: [docs]
---

# Volumes

OneChart settings for mounting volumes:

```yaml
image:
  repository: nginx
  tag: 1.19.3

volumes:
  - name: data
    path: /data
    size: 10Gi
    storageClass: default
```

Check the Kubernetes manifest:

```bash
cat << EOF > values.yaml
image:
  repository: nginx
  tag: 1.19.3

volumes:
  - name: data
    path: /data
    size: 10Gi
    storageClass: default
EOF

helm template my-release onechart/onechart -f values.yaml
```

## Using existing PersistentVolumeClaims

If for some reason you want to use an existing PersistentVolumeClaim, use the following syntax:

```bash
cat << EOF > values.yaml
image:
  repository: nginx
  tag: 1.19.3

volumes:
  - name: data
    path: /data
    existingClaim: my-static-claim
EOF

helm template my-release onechart/onechart -f values.yaml
```

## About volumes

OneChart generates a `PeristentVolumeClaim` with this configuration and mounts it to the given path.

You have to know what `storageClass` is supported in your cluster.

- On Google Cloud, `standard` gets you disk
- On Azure, `default` gets you a normal block storage
- Amazon EKS, `TODO`
- Use `do-block-storage` for Digital Ocean
