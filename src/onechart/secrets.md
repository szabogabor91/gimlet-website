---
layout: onechart
title: Secrets
lastUpdated: 2020-12-09
tags: [onechart]
---

# Secrets

Secrets demand special handling, and often they are stored, managed and configured in a workflow that is adjacent to application deployment.

Therefore, OneChart will not generate a Kubernetes `Secret` object by default, but it can reference one:
using the `secretEnabled: true` field, OneChart will look for a secret named exactly as your release.

```yaml
image:
  repository: nginx
  tag: 1.19.3

secretEnabled: true
```

How the Kubernetes `Secret` object gets on the cluster, remains your task.

Hint: ask your Kubernetes administrator for best practices, or if you are testing only, you can put the secret in your cluster with this command:

```bash
kubectl create secret generic my-release \                                                            
  --from-literal=SECRET1="my secret" \
  --from-literal=SECRET2="another secret"
```

given that you called your release `my-release`.

You may use a secret with a custom name, by using the `secretName` field:
```yaml
image:
  repository: nginx
  tag: 1.19.3

secretEnabled: true
secretName: my-custom-secret
```

## Mounting secrets as files

OneChart supports experimentation.

When you first try to make a deployment work, you may use OneChart's `fileSecrets` feature to
provide your application long form secrets: SSH keys, or json files that are typically used as service account keys on Google Cloud.

Just make sure to keep this config out of git - strictly on your laptop - as secrets are plain text.

```yaml
image:
  repository: nginx
  tag: 1.19.3

fileSecrets:
  - name: google-account-key
    path: /google-account-key
    secrets:
      key.json: supersecret
      another.json: |
        this
        is
        a
        multiline
        secret
```

- The above snippet will create a Kubernetes Secret object with two entries
- This secret is mounted to the `/google-account-key` and produce two files: `key.json` and `another.json`

## Using encrypted secret values

OneChart also has a secret workflow to keep secrets in git in an encrypted form.

This requires that you have [Bitnami's Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) configured in your cluster.

You can ease the management of `SealedSecret` objects with OneChart's `sealedSecrets` field:

First, put the secret values in your values.yaml file in plain text:

```yaml
image:
  repository: nginx
  tag: 1.19.3

sealedSecrets:
  secret1: secret-value-to-be-sealed
  secret2: another-secret-to-be-sealed
```

Then seal the values with with [Gimlet CLI](/gimlet-cli/manage-secrets-with-gimlet):

```
gimlet seal -f values.yaml \
  -o values.yaml \
  -p sealedSecrets \
  -k sealingKey.crt
```

Then you can put values file now in git as the secret values are encrypted.

```yaml
# values.yaml
image:
  repository: nginx
  tag: 1.19.3

sealedSecrets:
  secret1: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEq...
  secret2: ewogICJjcmVk...
```

The `gimlet seal` command is idempotent, so you can repeatedly seal already sealed files, it will not change the sealed values.
Should you need to update a secret value, just update it and use `gimlet seal` again.

Alternatively you can use [Sealed Secret's raw mode](https://github.com/bitnami-labs/sealed-secrets#raw-mode-experimental) to put already sealed values into the values.yaml file.
