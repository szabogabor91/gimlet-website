---
layout: post
title: "Helm React UI: a React component to render UIs for Helm Charts"
date: 2020-12-29
excerpt: |
    Helm React UI generates a UI based on Helm schema files and allows you to configure Helm
    Chart values in your browser.
topic: Helm
image: helmreactui.png
tags: [posts]
---

Helm is the de-facto standard for packaging applications for Kubernetes. Its usage is ubiquitous and sentiment against its
serverside component - Tiller - is fading since the 3.0 release.

Helm is facing another issue nowadays.

The amount of Helm charts is increasing and as it is a community effort, the quality of charts vary, so as their structure.
It is a considerable effort to understand what a given chart bundles and what knobs it exposes to its users.

The practice to document these knobs is an extensive list of values that the user can set.
Helm React UI is here to improve this practice.

## Helm React UI is a project to allow the configuration of Helm values on a UI   

It takes the [Helm schema file](https://helm.sh/docs/topics/charts/#schema-files) to generate a UI for users 
to better discover the possible configuration options. Also, to allow an alternative path to Helm. 

The project is hosted at [https://github.com/gimlet-io/helm-react-ui](https://github.com/gimlet-io/helm-react-ui) 
and a practical [example project](https://github.com/gimlet-io/helm-react-ui-test-bed) is available too. The project that produced the following screen.

![Helm React UI screen](/helmreactui2.png)

## It is a React component

```js
import HelmUI from 'helm-react-ui';

<HelmUI
  schema={schema}
  config={helmUIConfig}
  values={this.state.values}
  setValues={this.setValues}
/>
```

It takes the schema as input, and a json file that helps to generate better UIs than the json schema would allow on its own.

Besides those, you can feed in an existing Helm `values.json` and an event handler to keep track of UI changes.

See the example code [here](https://github.com/gimlet-io/helm-react-ui-test-bed/blob/main/src/app.js).

## The `helm-ui.json`

Generating UIs from json schema is a practically doable task, but the schema doesn't allow the kind of fine-tuning 
that is needed for useful UIs.

When I set out to implement Helm React UI I was warned on Twitter.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">json schema lacks layout information, information on how to pre-fill some fields.</p>&mdash; Tamal Saha (@tsaha) <a href="https://twitter.com/tsaha/status/1316665380442497024?ref_src=twsrc%5Etfw">October 15, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Rightly so. Helm schemas are large, and rendering all fields at once would be difficult to comprehend.

Thankfully, this was handled already in the React component I use. With [react-jsonschema-form](https://react-jsonschema-form.readthedocs.io/en/latest/api-reference/uiSchema/#uischema)
I could attach the required metadata to further customize the chart appearance.

Furthermore, I introduced a new metadata format for Helm charts
to drive their appearance in Helm React UI.
It's the `helm-ui.json`, that you should place next to the `values.schema.json` file and follow the following structure:

```json
[
  {
    "schemaIDs": [
      "#/properties/image",
      "#/properties/containerPort",
      "#/properties/replicas"
    ],
    "uiSchema": {
      "#/properties/replicas": {
        "ui:widget": "range"
      }
    },
    "metaData": {
      "name": "Basics",
      "icon": "M17 8l4 4m0 0l-4 4m4-4H3"
    }
  }
]
```

It is an array of objects with three fields

- the sub-schemas to render on a screen
- the uiSchema to fine tune field rendering, options are from [react-jsonschema-form](https://react-jsonschema-form.readthedocs.io/en/latest/api-reference/uiSchema/#uischema)
- and metadata to render the navigation frame

See a full example [here](https://github.com/gimlet-io/onechart/blob/master/charts/onechart/helm-ui.json).

## Putting Helm React UI in practice 

Besides the Helm React UI component, I also launch today a tool that packages it in a practical form: a CLI.

It's the Gimlet CLI that has a `chart configure` command to generate a Helm values.yaml file for a given chart.
                                                           
It launches a browser tab where you can discover and set the deployment options.
 
```
$ gimlet chart configure onechart/onechart
👩‍💻 Configure on http://127.0.0.1:28955
👩‍💻 Close the browser when you are done
Browser opened
```


![gimlet chart configure](/chart-configure.png)


```
Browser closed
📁 Generating values..
---
image:
  repository: myapp
  tag: 1.0.0
ingress:
  host: myapp.local
  tlsEnabled: true
replicas: 2
```

It works with any chart that has a JSON schema defined and an accompanying `helm-ui.json`.

`onechart/onechart` is one such chart, you can use it to see Helm React UI in action.
It is also a handy 
chart if you need to deploy something quickly, or looking for an alternative for the lengthy Kubernetes yaml format.

## Learn more

- You can discover the source code of [Helm React UI](https://github.com/gimlet-io/helm-react-ui/blob/master/src/index.js)
- See an [example](https://github.com/gimlet-io/helm-react-ui-test-bed) to include it in your project
- Learn more about [OneChart](http://localhost:8080/onechart/getting-started/), the chart that has a schema and a helm-ui.json today
- Check [Gimlet CLI](http://localhost:8080/gimlet-cli/chart-configure/) in depth to see what you can use it for
