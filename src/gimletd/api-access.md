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
