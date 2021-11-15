---
layout: docs
title: Configuring GimletD
lastUpdated: 2020-03-16
tags: [docs]
---

# Configuring GimletD

## Debug sidecar container

In case you need tools to debug.

```diff
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
[...]
+ sidecar:
+   repository: debian
+   tag: stable-slim
+   shell: "/bin/bash"
+   command: "while true; do sleep 30; done;"
```

## Github integration

GimletD integrates with Github with a dedicated Github Application.

GimletD uses this integration to:
- detect deleted branches in your source code repositories
- send commit statuses on gitops operations
- read private Helm charts, should you use a custom Helm chart for your applications

#### Integrating through a Github Application

There are multiple ways that you can integrate with Github. GimletD chooses to use a Github Application which has the most fine-grained access model.
You can set which repositories GimletD can access, and what it can do with those repositories.

You will use a dedicated Github Application, that you create.
Practically you don't give access to any third-party, not even the makers of Gimlet.

#### Creating the Github Application

To create the Github Application, we provide a script that is writing an HTML file to your disk, and guides you through the creation process.

When you click the *"Create Github app"* button, you are forwarded to Github where you can confirm your application's name. All settings are sent to Github
in a json structure, holding the required permission list, webhook URLs and so on, so you don't have to perform too many manual steps.

Now scan the source of the HTML file.

```bash

cat << EOF > create-app.html
<form action="https://github.com/settings/apps/new" method="post">
  <input type="hidden" name="manifest" id="manifest"><br>
  <input type="submit" value="Create Github app">
</form>

<script>
  var url = new URL(window.location);
  var code = url.searchParams.get("code");

  if (code) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      console.log(xhr.response)

      var responseObj = JSON.parse(xhr.response)

      document.open();

      document.write('<p>GITHUB_APP_ID: ' + responseObj.id + '</p>');
      document.write('<p>GITHUB_PRIVATE_KEY: <br/>' + responseObj.pem.replaceAll('\n', '<br/>') + '</p>');

      document.close();
      }
    }
    xhr.open("POST", "https://api.github.com/app-manifests/"+code+"/conversions", true);
    xhr.send();
  }
</script>

<script>
  input = document.getElementById("manifest")
  input.value = JSON.stringify({
  "name": "GimletD",
  "url": "https://gimlet.mycompany.com",
  "callback_url": "https://gimlet.mycompany.com",
  "hook_attributes": {
    "url": "https://gimlet.mycompany.com/hook"
  },
  "redirect_url": "http://127.0.0.1:11111/create-app.html",
  "public": false,
  "default_permissions": {
    "contents": "read",
    "statuses": "write",
  },
  "default_events": []
  })
</script>
EOF

PORT=11111 npx http-server -o /create-app.html
```

Once you clicked the *"Create Github app"* button, and confirmed the app's name on Github, you are redirected to a page that shows all
the required configuration values for Gimlet Dashboard.

Copy them to your Helm values file accordingly.

```diff
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
+vars:
+  GITHUB_APP_ID: 123456789
+  GITHUB_INSTALLATION_ID: "987654321"
+  GITHUB_PRIVATE_KEY: |
+    -----BEGIN RSA PRIVATE KEY-----
+    MIIEowIBAAKCAQEAxpLdgC6KEDFPx5...
+    ...
```

To obtain the `INSTALLATION_ID`, navigate to [https://github.com/settings/apps](https://github.com/settings/apps) and edit your just created application.
Click *Install App* in the sidebar to install it on the account that you want GimletD to access.

You can copy the `INSTALLATION_ID` from your browsers address bar after installation. The URL will be in the following format:
[https://github.com/settings/installations/$INSTALLATION_ID]()

That's all.

Now you integrated GimletD with Github.

> If you are in doubt about the process, you can crosscheck our script with Github's general guide on how to create a Github Application [here](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app)

> You can also validate our script on Github's [Creating a GitHub App from a manifest](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app-from-a-manifest) guide

## Notifications on gitops repo applies

This section you will configure Flux - the gitops controller - to notify GimletD whenever it applies the latest changes.

- Generate a Gimlet user for Flux:

```bash
curl -i \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -X POST -d '{"login":"flux"}' \
  http://gimletd.mycompany.com:8888/api/user\?access_token\=$GIMLET_ADMIN_TOKEN
```

- Create the `notifications.yaml` file in your gitops repo under $your_env/flux/notifications.yaml

```yaml
apiVersion: notification.toolkit.fluxcd.io/v1beta1
kind: Provider
metadata:
  name: gimletd
  namespace: flux-system
spec:
  type: generic
  address: https://gimletd.<your-company-com>/api/flux-events?access_token=<token>
---
apiVersion: notification.toolkit.fluxcd.io/v1beta1
kind: Alert
metadata:
  name: all-kustomizations
  namespace: flux-system
spec:
  providerRef:
    name: gimletd
  eventSeverity: info
  eventSources:
    - kind: Kustomization
      namespace: flux-system
      name: '*'
  suspend: false
```

You will see the notifications reaching Slack:

![Notifications on gitops applies](https://raw.githubusercontent.com/gimlet-io/gimletd/tip/docs/notifs.png)

## Limiting resources

```diff
image:
  repository: ghcr.io/gimlet-io/gimletd
  tag: latest
probe:
  enabled: true
  path: /
[...]
+resources:
+  requests:
+    cpu: "50m"
+    memory: "200Mi"
+  limits:
+    cpu: "2000m"
+    memory: "1000Mi"
```
