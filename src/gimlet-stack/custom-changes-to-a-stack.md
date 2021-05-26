---
layout: gimlet-stack
title: Custom changes to a stack
lastUpdated: 2021-05-26
image: gimlet-stack.png
tags: [gimlet-stack]
---

# Custom changes to a stack

Stack templates only go so far, and it is inevitable that you want to amend the generated manifests in slight ways.

To do that, you have to make sure that after you run `stack generate` - for example to [upgrade it to the latest version](/gimlet-stack/upgrading-a-stack) - 
you make sure to keep your manual changes.

The best workflow for that is to do the `stack generate` on a branch, and you inspect the changes with focus on your manual changes in the compare view.

The workflow becomes:

- branch out
- run `stack generate`
- inspect, commit and push the changes to the branch
- open a pull request and review the changes
- when you made sure that none of your manual changes are lost, merge the pull request
