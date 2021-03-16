---
layout: gimletd
title: API access
lastUpdated: 2020-03-16
tags: [gimletd]
---

# API Access

When you first start GimletD, it inits a file based SQLite3 database and prints the admin token to the logs.

Use this token to create a regular user token:

```bash
curl -i \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -X POST -d '{"login":"laszlo"}' \
  http://gimletd.mycompany.com:8888/api/user?access_token=$GIMLET_TOKEN
```

Save the returned user token from the result.

## Next steps

Now that you have access to the API

- Continue with [creating release artifacts](/gimletd/creating-artifacts) directly with Gimlet CLI, or with Gimlet's CircleCI integration
- Or see how to create [ad-hoc](/gimletd/on-demand-releases) or [policy based releases](/gimletd/policy-based-releases)
