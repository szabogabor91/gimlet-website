---
layout: onechart
title: Secrets
lastUpdated: 2020-12-09
tags: [onechart]
---

# Secrets

Secrets demand special handling, and often they are stored, managed and configured in a workflow that is adjacent to application deployment.

OneChart will not generate a Kubernetes `Secret` object, but can reference one.

You must place your application secrets in Kubernetes in a `Secret` object, named the same way as your application deployment.
OneChart can reference this secret, and includes all of its entries in the deployment.

The secret name must match the release name. `my-release` in this example.

```yaml
image:
  repository: nginx
  tag: 1.19.3

secret:
  enabled: true
```

Check the Kubernetes manifest:

```bash
cat << EOF > values.yaml
image:
  repository: nginx
  tag: 1.19.3

secret:
  enabled: true
EOF

helm template my-release onechart/onechart -f values.yaml
```

## Using encrypted secret values

OneChart can be used with [Bitnami's Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets), as it generates a `SealedSecret` resource that can be stored even in git.

```yaml
image:
  repository: nginx
  tag: 1.19.3

sealedSecrets:
  secret1: secret-value-to-be-sealed
  secret2: another-secret-to-be-sealed
```

We recommend that you seal your `values.yaml` file with [Gimlet CLI](/gimlet-cli/manage-secrets-with-gimlet):

```
gimlet seal -f values.yaml \
  -o values.yaml \
  -p sealedSecrets \
  -k sealingKey.crt
```

```yaml
# values.yaml
image:
  repository: nginx
  tag: 1.19.3

sealedSecrets:
  secret1: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEq...
  secret2: ewogICJjcmVk...
```
