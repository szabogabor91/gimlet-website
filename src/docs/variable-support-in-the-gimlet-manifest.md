---
layout: docs
title: Variable support in the Gimlet manifest
lastUpdated: 2020-12-11
tags: [docs]
---

# Variable support in the Gimlet manifest

The Gimlet manifest resolves Golang templates in the `gimlet manifest template` step.

You provide the variable values in the `--vars` flag:

```yaml
# .gimlet/staging.yaml
app: myapp
env: staging
namespace: my-team
chart:
  repository: https://chart.onechart.dev
  name: onechart
  version: 0.10.0
values:
  replicas: 1
  image:
    repository: myapp
    tag: {% raw %}"{{ .GIT_SHA }}"{% endraw %}
  ingress:
    host: myapp.staging.mycompany.com
    tlsEnabled: true

# ci.env
GIT_SHA=d750703d39a6fd8f2f82b34dfce2de9719cc4b98

gimlet manifest template \
  -f .gimlet/staging.yaml \
  -o manifests.yaml \
  --vars ci.env
```

## Variable resolution using GimletD

If you use GimletD for automated deploys, GimletD resolves all variables (context and custom field) that are part of the shipped artifact.

You can always look into an artifact by `gimlet artifact list -o json` and locate the `.context` and `.items` fields. Key value pairs from these structures are made available (case-sensitive) as variables in the Gimlet manifest.

You can also look into the [artifact shipper CI plugins' source code](https://github.com/gimlet-io/gimlet-artifact-shipper-action/blob/main/entrypoint.sh#L53) to see how variables are added to the manifest.

```bash
gimlet artifact add \
  -f artifact.json \
  --field "name=CI" \
  --field "url=$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID"
```

```bash
echo "Attaching environment variable context.."
VARS=$(printenv | grep GITHUB | grep -v '=$' | awk '$0="--var "$0')
gimlet artifact add -f artifact.json $VARS
```

and add your own variables with the `gimlet artifact add` command or by the CI plugins custom fields section.
