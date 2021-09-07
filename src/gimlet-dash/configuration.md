---
layout: gimlet-dash
title: Configuring Gimlet Dash
lastUpdated: 2020-09-06
tags: [gimlet-dash]
---

# Configuring Gimlet Dash

```diff
image:
  repository: ghcr.io/gimlet-io/gimlet-dashboard
  tag: latest
  pullPolicy: Always
containerPort: 9000
probe:
  enabled: true
  path: /
+vars:
+  HOST: gimlet.mycompany.com
+  JWT_SECRET: <<$(openssl rand -hex 32)>>
```

- `HOST` Gimlet Dash must know what address it is running on. It uses this hostname to register webhooks on Github.
- `JWT_SECRET` is the secret to generate agent JWT tokens

## GimletD integration

To be able to deploy / rollback and to look at the deploy history, you must connect your Gimlet Dash to GimletD, the release manager.

```diff
image:
  repository: ghcr.io/gimlet-io/gimlet-dashboard
  tag: latest
  pullPolicy: Always
containerPort: 9000
probe:
  enabled: true
  path: /
+vars:
+  GIMLETD_URL: gimletd.mycompany.com
+  GIMLETD_TOKEN: <<a GilmetD admin token>>
```

## Github integration

Gimlet Dashboard uses a Github Application to gain access to your source code.

You must create this application first. 

> Please note that this application is created by you, and you don't give access to your source code to any third party or the makers of Gimlet.

#### Creating a Github Application

Let's create first the Github Application.

The application requires various permissions, and you have to perform further actions like you generating a private key and so on.
Instead of a lengthy guide, we prepared a script for you that does all that on Github.

The following snippet, writes a html file on your disk and opens it in your browser, where you find a *"Create Github app"* button.

When you click the *"Create Github app"* button, you are forwarded to Github where you can confirm your application's name. All settings are sent to Github
in a json structure, holding the required permission list, webhook URLs and so on, so you don't have to perform too many manual steps.

Now scan the source of the HTML file, and replace `gimlet.mycompany.com` with the URL you are going to host Gimlet Dash on.

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
      document.write('<p>GITHUB_CLIENT_ID: ' + responseObj.client_id + '</p>');
      document.write('<p>GITHUB_CLIENT_SECRET: ' + responseObj.client_secret + '</p>');
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
  "name": "Gimlet Dash",
  "url": "https://gimlet.mycompany.com",
  "callback_url": "https://gimlet.mycompany.com",
  "hook_attributes": {
    "url": "https://gimlet.mycompany.com/hook"
  },
  "redirect_url": "http://127.0.0.1:11111/create-app.html",
  "public": false,
  "default_permissions": {
    "checks": "read",
    "contents": "read",
    "repository_hooks": "write",
    "statuses": "read",
    "members": "read"
  },
  "default_events": [
    "create",
    "push",
    "delete",
    "status"
  ]
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
  repository: ghcr.io/gimlet-io/gimlet-dashboard
  tag: latest
  pullPolicy: Always
containerPort: 9000
probe:
  enabled: true
  path: /
+vars:
+  GITHUB_APP_ID: 123456789
+  GITHUB_INSTALLATION_ID: 987654321
+  GITHUB_PRIVATE_KEY: |
+    -----BEGIN RSA PRIVATE KEY-----
+    MIIEowIBAAKCAQEAxpLdgC6KEDFPx5...
+    ...
+  GITHUB_CLIENT_ID: Iv1.123456
+  GITHUB_CLIENT_SECRET: xxx
```

One last step is to provide the `GITHUB_ORG` variable.
Users that are members of this Github Organization will be able to authenticate to the dashboard.

```diff
image:
  repository: ghcr.io/gimlet-io/gimlet-dashboard
  tag: latest
  pullPolicy: Always
containerPort: 9000
probe:
  enabled: true
  path: /
vars:
+ GITHUB_ORG: mycompany
  GITHUB_APP_ID: 123456789
  GITHUB_INSTALLATION_ID: 987654321
  GITHUB_PRIVATE_KEY: |
    -----BEGIN RSA PRIVATE KEY-----
    MIIEowIBAAKCAQEAxpLdgC6KEDFPx5...
    ...
  GITHUB_CLIENT_ID: Iv1.123456
  GITHUB_CLIENT_SECRET: xxx
```

That's all.

Now you integrated Gimlet Dash with Github.

> If you are in doubt about the process, you can crosscheck our script with Github's general guide on how to create a Github Application [here](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app)

> You can also validate our script on Github's [Creating a GitHub App from a manifest](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app-from-a-manifest) guide

## Next steps

- Continue with [installing the Gimlet Agent](/gimlet-dash/installing-gimlet-agent)
