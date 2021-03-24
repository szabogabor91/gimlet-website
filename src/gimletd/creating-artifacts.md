---
layout: gimletd
title: Creating artifacts
lastUpdated: 2020-03-16
tags: [gimletd]
---

# Creating Artifacts

GimletD uses the release artifact to detach the release workflow from CI.

Instead of releasing, CI generates a release artifact for each releasable version of the application.
The artifact contains all metadata that can be later used for releasing and auditing. 
GimletD then stores these artifacts in the artifact storage.

You can read more about the artifact and the motivation behind it on the [Concepts](/gimletd/concepts) page.

## Creating artifacts from CircleCI

```yaml
version: 2.1
orbs:
  gimlet: gimlet-io/circleci-orb@dev:1934d4b
workflows:
  my-workflow:
    jobs:
      - build_docker_image:
          working_directory: /tmp/workspace
          machine: true
          steps:
            - attach_workspace:
                at: /tmp/workspace
            - docker-build:
                service-name: 'my-service'
            - gimlet/gimlet-artifact-create:
                image-tag: "my-image-registry/my-service:$CIRCLE_SHA1"
```

## Creating artifacts with Gimlet CLI

Init the artifact with the git version information:

```bash
./gimlet artifact create \
  --repository "mycompany/frontend" \
  --sha "deae5dbaf237766240181fa397e923d3c5253112" \
  --branch "new-feature" \
  --event "pr" \
  --sourceBranch "new-feature" \
  --authorName "Laszlo Fogas" \
  --authorEmail "xxx" \
  --committerName "Laszlo Fogas" \
  --committerEmail "xxx" \
  --message "This is a wonderful new feature" \
  --url "$URL" \
  > artifact.json
```

Then extend it with meta data

```bash
./gimlet artifact add \
  -f artifact.json \
  --field "name=CI" \
  --field "url=$CIRCLE_BUILD_URL"
  
./gimlet artifact add \
  -f artifact.json \
  --field "name=docker-image" \
  --field "url=mycompany/frontend:deaevvbaf237766240181fa397e923d3c5253112"
```

Attach the gimlet environment config(s):

```bash
./gimlet artifact add \
  -f artifact.json \
  --envFile ".gimlet/preview.yaml"
```

Attach additional variables:

```bash
./gimlet artifact add -f artifact.json --var MY_VAR=yyy
```
  
Then push the artifact to GimletD:

```bash
./gimlet artifact push -f artifact.json
```

This metadata assembly is typically hidden in CI plugins. See how it is done in the 
[Gimlet CircleCI Orb](https://github.com/gimlet-io/circleci-orb/blob/alpha/src/commands/gimlet-artifact-create.yml).

## Next steps

Now go and [release one of the artifacts](/gimletd/on-demand-releases)
