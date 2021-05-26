---
layout: gimlet-stack
title: Reconfiguring a stack
lastUpdated: 2021-05-26
image: gimlet-stack.png
tags: [gimlet-stack]
---

# Reconfiguring a stack

When you run `stack configure` and configure components on the UI, the configuration options are stored in a file
called `stack.yaml`. 

When next time you run `stack configure` the configuration options are read from `stack.yaml` and you can reconfigure your settings.
As you can see, the `stack.yaml` file contains the full configuration of your stack, and you should version it in your stack repository.

## Always re-generate after you reconfigured

`stack.yaml` is Gimlet Stack's own format, therefore for your configuration changes to be effective on the cluster, 
make sure to run `stack generate` every time you make changes to the `stack.yaml` file. Be that changes through the UI or manually.

Once you ran `stack generate` and made a git commit and pushed, you should see the changes on your cluster.
