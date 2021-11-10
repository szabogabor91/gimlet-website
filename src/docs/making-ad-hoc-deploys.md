---
layout: docs
title: Making ad-hoc deploys
lastUpdated: 2020-03-16
tags: [docs]
---

# Making ad-hoc deploys

GimletD operates only on the releasable artifacts that you shipped from your CI pipeline, therefore to make an adhoc release, first you should browse the stored artifacts to pick the desired version.

In this guide first 
- you see how to make ad-hoc releases with Gimlet CLI
- then you will see how to do so on the Gimlet Dash UI.

If you need a refresher, you can see how artifacts are shipped from CI pipelines to Gimlet in the [Automatically deploy your application to staging](/docs/automatically-deploy-your-application-to-staging) tutorial.

## Browsing the artifacts with Gimlet CLI

```bash
export GIMLET_SERVER=http://gimletd.mycompany.com
export GIMLET_TOKEN=xxx

gimlet artifact list --app mycompany/frontend
```

```
559c756d - Fixing a critical bug (yesterday) laszlo                                                                                  
mycompany/frontend-3dcf8ec0-96ec-4974-b28b-4e8d2862a359 mycompany/frontend/fix-critical-bug                                                 
https://github.com/mycompany/frontend/pull/323

2ee906e3 - Data model changes (3 days ago) laszlo
mycompany/frontend-abd4040f-4457-4e50-85a1-c2f8663527a7 mycompany/frontend/model-changes
https://github.com/mycompany/frontend/pull/324

175a8aa4 - CSS fix (3 days ago) tom
mycompany/frontend-81343685-62ea-48c3-b53c-f8dd3ecc4972 mycompany/frontend/css-fix
https://github.com/mycompany/frontend/pull/322
[...]
```

## Releasing an artifact with Gimlet CLI

Once you identified the artifact you want to release, issue the following Gimlet CLI command:

```
gimlet release make \
  --env staging \
  --artifact mycompany/frontend-3dcf8ec0-96ec-4974-b28b-4e8d2862a359
```

## Tracking releases

Besides following the Slack notifications messages, you can query the audit log from GimletD:

```
gimlet release list --env staging --app frontend
```

```
staging/frontend mycompany/gitops@2655962fcf5b27553d139005f47c2eec9002c19d  (just now)
    559c756d - Fixing a critical bug laszlo
    mycompany/frontend-3dcf8ec0-96ec-4974-b28b-4e8d2862a359
```

## Making ad-hoc releases with the Gimlet Dash UI

If an artifact exist for a given commit, you can push the deploy button next to it.

So locate the desired commit, and hit "Deploy".

<img src="/deploy.gif" class="w-full md:max-w-4xl mx-auto my-16"/>
