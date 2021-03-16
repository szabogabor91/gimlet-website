---
layout: gimletd
title: On-demand releases
lastUpdated: 2020-03-16
tags: [gimletd]
---

# On-demand releases

GimletD operates only on the releasable artifacts that CI created, therefore to make an adhoc release, first you should
browse the stored artifacts to pick the desired version.

If you need a refresher, you can read more about the artifacts on the [Concepts](/gimletd/concepts) page.

## Browsing the artifacts

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

## Releasing an artifact

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

## Next steps

- If you made a mistake, you might want to [Roll back](/gimletd/rolling-back)
- To automate the releases, read about [Policy based releases](/gimletd/policy-based-releases)
