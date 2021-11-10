---
layout: docs
title: Rolling back
lastUpdated: 2020-03-16
image: sisyphus.jpg?123
tags: [docs]
---

# Rolling back

In software, things go wrong sometimes. It is inevitable, so best if you have an action that you can perform routinely.

That's why Gimlet provides rollback tooling out of the box. 

On this page you will learn how to use it, first with the CLI then on the UI, and learn what it does actually.

## Getting a quick overview

To roll back, first you have to get a good picture of what was released and when.

List the recent releases with Gimlet CLI:

```
gimlet release list --env staging --app my-app                  
```

```
staging/my-app laszlocph/gimletd-test@44e6c26866 (just now)
        26fc62ff - Bugfix 123 Laszlo
        my-app/master my-app-34666da3-ae77-45d5-843b-7b4bce1edf55
        https://github.com/owner/repo/commits/0017d995e

staging/my-app laszlocph/gimletd-test@c8d8c1d192 (1 week ago)
        26fc62ff - Bugfix 123 Laszlo
        my-app/master my-app-c19a27dd-25a0-4d0b-b932-db4c7c660996
        https://github.com/owner/repo/commits/0017d995e

staging/my-app laszlocph/gimletd-test@d2d0a416e6 (1 week ago)
        26fc62ff - Bugfix 123 Laszlo
        my-app/master my-app-34666da3-ae77-45d5-843b-7b4bce1edf55
        https://github.com/owner/repo/commits/0017d995e
```

## Roll back

Once you identified the broken release, roll back to the preceding one.
Gimlet will revert all gitops commits made after the desired release.

```
gimlet release rollback --env staging --app my-app --to c8d8c1d192
```

And verify the release state:

```
gimlet release list --env staging --app my-app                  
```

```
staging/my-app laszlocph/gimletd-test@44e6c26866 **ROLLED BACK** (1 minute ago)
        26fc62ff - Bugfix 123 Laszlo
        my-app/master my-app-34666da3-ae77-45d5-843b-7b4bce1edf55
        https://github.com/owner/repo/commits/0017d995e

staging/my-app laszlocph/gimletd-test@c8d8c1d192 (1 week ago)
        26fc62ff - Bugfix 123 Laszlo
        my-app/master my-app-c19a27dd-25a0-4d0b-b932-db4c7c660996
        https://github.com/owner/repo/commits/0017d995e

staging/my-app laszlocph/gimletd-test@d2d0a416e6 (1 week ago)
        26fc62ff - Bugfix 123 Laszlo
        my-app/master my-app-34666da3-ae77-45d5-843b-7b4bce1edf55
        https://github.com/owner/repo/commits/0017d995e
```

## What does rollback do

Rollbacks in Gimlet are preforming revert commits on all gitops commits that were made later than the release that you are rolling back to.

With this approach you can be sure that a previous release will be applied verbatim on the cluster. No template re-renders, no waiting on the machinery.

## Roll back or roll forward

You can't roll back an already rolled back commit. Best to roll forward in this case.

Rollbacks are made for a quick mindless remedy to jump back to previously active gitops state.

If you want to be more creative, best to roll forward by releasing a new version.

## Rolling back on the UI

Each application has a release history bar with the ten most recent deploys.
If you click the bar, you will see the individual released versions, and you can click the "Rollback to this version" button next to it.

<img src="/rollback.gif" class="w-full md:max-w-4xl mx-auto my-16"/>
