---
layout: docs
title: The SANE Helm guide
lastUpdated: 2021-10-29
tags: [docs]
---

# The SANE Helm guide

Helm is the most thrown around term in the Kubernetes ecosystem and perhaps one of the most divisive one as well. Many accept and use the tool, many refuse to touch it and always look for raw yaml alternatives.

But Helm does two things well:

- packaging
- and templating

In this guide, you will get practical knowledge about using Helm, focusing on those use-cases, namely packaging and templating, that also underpin Gimlet.

This guide emphasizes simplicity and ease of use. Being an exhausting guide of Helm features is a non-goal. Instead, the goal is to get you from *"Helm, wtf?"* to *"Helm, this ain't so bad"* under five minutes.

Let's get to it, shall we?

## Prerequisites
- You have access to a Kubernetes cluster. Use [k3d](https://github.com/rancher/k3d#get), if you don't have one.
- You have `kubectl` installed. Follow [this guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/), if you don't have it.
- You have Helm installed. Install it with 
`curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` <br /> or look for installation alternatives at [https://helm.sh/docs/intro/install/](https://helm.sh/docs/intro/install/)

## Helm as a source of packaged infrastructure components

If you need a quick and dirty way to install a database, queuing engine or any infrastructure component on Kubernetes, chances are that the infrastructure component has a good enough official or community Helm chart that you can use for installation.

Charts also give you good enough default settings as well. Good enough for testing purposes - that is.

### Let's see how this works with the PostgreSQL database!

- First you need to find the Helm chart for PostgreSQL. The official website of PostgreSQL is a good starting point, but I usually go with a Google search, *"PostgreSQL Helm chart"*
- You can typically find the Helm chart in the Github organization of the software you want to install. With PostgreSQL however, there is only a community chart available, so Google pointed me to the [bitnami/charts repo on Github](https://github.com/bitnami/charts/tree/master/bitnami/postgresql).
- Judging the trustworthiness of community charts is often not easy. You may get help on slack channels, or judge the maintainer activity on Github. In this particular case I know that Bitnami's charts are often good, so I will go with it.
- Follow the steps on the `bitnami/charts` repo and install PostrgreSQL with the followingtwo liner::

```
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm install my-postgres bitnami/postgresql
```

With these two commands you installed PostgreSQL, and you also got some getting started information on the screen.

```
[..]

PostgreSQL can be accessed via port 5432 on the following DNS names from within your cluster:

    my-postgres-postgresql.default.svc.cluster.local - Read/Write connection

To get the password for "postgres" run:

    export POSTGRES_PASSWORD=$(kubectl get secret --namespace default my-postgres-postgresql -o jsonpath="{.data.postgresql-password}" | base64 --decode)

To connect to your database run the following command:

    kubectl run my-postgres-postgresql-client --rm --tty -i --restart='Never' --namespace default --image docker.io/bitnami/postgresql:11.13.0-debian-10-r80 --env="PGPASSWORD=$POSTGRES_PASSWORD" --command -- psql --host my-postgres-postgresql -U postgres -d postgres -p 5432

To connect to your database from outside the cluster execute the following commands:

    kubectl port-forward --namespace default svc/my-postgres-postgresql 5432:5432 &
    PGPASSWORD="$POSTGRES_PASSWORD" psql --host 127.0.0.1 -U postgres -d postgres -p 5432
```


This is usually the way to install any Helm chart. First register the chart repository in your local Helm registry, then call helm install with the name of the release and the Helm chart.

This approach may not match the infrastructure as code tool of your choice, but to see how the component looks installed, Helm is the go-to tool, and knowing the above two commands is a must have.

## Configuring releases with Helm

Continuing with the PostgreSQL example from the previous chapter, now you will tune the PostgreSQL instance using the `bitnami/postgresql` Helm charts predefined options.

Every Helm chart offers a set of configuration options that you can use to tune your installation. You will configure the default user and password in this chapter.

To update the `my-postgres` release, use the following command

```
$ helm upgrade my-postgres bitnami/postgresql \
  --set postgresqlUsername=postgres \
  --set postgresqlPassword=e8f844db4cf0bbb5f431e250dd8e44cb
```

This changed the `ConfigMap` resource for PostgreSQL what you can verify with:

```
$ kubectl get secret my-postgres-postgresql -o jsonpath="{.data.postgresql-password}" | base64 --decode

e8f844db4cf0bbb5f431e250dd8e44cb%
```

Since PostgreSQL only reads the default username and password parameter at startup time, use the following command to restart it, then verify the changed password by connecting to it.

```
$ kubectl rollout restart statefulset my-postgres-postgresql
$ kubectl get pods -w

my-postgres-postgresql-0   0/1     Terminating   0          8m56s
my-postgres-postgresql-0   0/1     Terminating   0          8m56s
my-postgres-postgresql-0   0/1     Pending       0          0s
my-postgres-postgresql-0   0/1     Pending       0          0s
my-postgres-postgresql-0   0/1     ContainerCreating   0          0s
my-postgres-postgresql-0   0/1     Running             0          2s
my-postgres-postgresql-0   1/1     Running             0          10s
```

For the connection, we borrow the command from the helm install's output:

```
$ kubectl run my-postgres-postgresql-client --rm --tty -i --restart='Never' --namespace default --image docker.io/bitnami/postgresql:11.13.0-debian-10-r80 --env="PGPASSWORD=e8f844db4cf0bbb5f431e250dd8e44cb" --command -- psql --host my-postgres-postgresql -U postgres -d postgres -p 5432

postgres=#
postgres=# quit
```

Before we round up this chapter and jump to Helm's other thing that it does well, you should get familiar with a more declarative way of providing Helm chart configuration options.

## Configuring releases with Helm's values.yaml file

It is good practice to store configuration values in a declarative form, in a file that you can version control.

Let's change the password of the Postgresql installation once again.

This time, by feeding in the `postgresql.values.yaml` to `helm upgrade`.

Let's create the file first:

```
$ cat << EOF > postgresql.values.yaml
postgresqlUsername: postgres
postgresqlPassword: 543e9a6bf104ccb7249715991831f3a0
EOF
```
then let's upgrade the installation with

```
$ helm upgrade my-postgres bitnami/postgresql \
  -f postgresql.values.yaml
```

Restart PostgreSQL, and validate the password by connecting to it:

```
$ kubectl rollout restart statefulset my-postgres-postgresql

statefulset.apps/my-postgres-postgresql restarted

$ kubectl get pods -w

my-postgres-postgresql-0   0/1     Terminating   0          8m56s
my-postgres-postgresql-0   0/1     Terminating   0          8m56s
my-postgres-postgresql-0   0/1     Pending       0          0s
my-postgres-postgresql-0   0/1     Pending       0          0s
my-postgres-postgresql-0   0/1     ContainerCreating   0          0s
my-postgres-postgresql-0   0/1     Running             0          2s
my-postgres-postgresql-0   1/1     Running             0          10s

$ kubectl run my-postgres-postgresql-client --rm --tty -i --restart='Never' --namespace default --image docker.io/bitnami/postgresql:11.13.0-debian-10-r80 --env="PGPASSWORD=543e9a6bf104ccb7249715991831f3a0" --command -- psql --host my-postgres-postgresql -U postgres -d postgres -p 5432

postgres=#
postgres=# quit
```

Congratulations, now you are able to configure Helm installations with a declarative values.yaml file!

Now that you are able to install and upgrade Helm charts, it's time to complete your must-have Helm knowledge by looking at the other thing that Helm does well: templating.


## Templating - the anatomy of a Helm chart

To fully understand Helm, and the configuration values you used in previous chapters, you are going to learn about how Helm charts look inside.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: {% raw %}{{ .Values.replicas }}{% endraw %}
  template:
    metadata:
    spec:
      containers:
        - name: my-deployment
          image: nginx
```

The above snippet is a Kubernetes Deployment resource with its replica count templated.

This is how Helm charts look inside: they are Golang template files that are able to render variables at predefined placeholders.
Just much more convoluted in real life, thanks to the many generic use-cases they have to serve.


To round up your Helm intro, in the remaining chapters you will

- modify a chart by introducing a new variable to it
- learn how to render and debug Helm charts locally
- and how to navigate chart source code

This way you will see that charts are really just template files, and learn how to handle not well documented situations.

## Rendering Helm charts as Kubernetes resources

To demistify Helm, it is important to understand that what Helm does is just little more than rendering Golang templates.

Let's return briefly to the PostgreSQL example from previous chapters. But instead of running `helm upgrade` run `helm template` this time:

```
$ helm template my-postgres bitnami/postgresql \
  -f postgresql.values.yaml

---
# Source: postgresql/templates/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  [...]
```

The output is the well known - although lengthy - Kubernetes yaml. These are the yamls Helm is applying on the cluster, this time though it was only rendering text files on your laptop.

## Closing the feedback loop

To see Helm in full circle, let's create a chart on your laptop that we can modify safely:

```
$ helm create my-first-chart
Creating my-first-chart

$ tree my-first-chart
my-first-chart
├── charts
├── Chart.yaml
├── templates
│   ├── deployment.yaml
│   ├── _helpers.tpl
│   ├── hpa.yaml
│   ├── ingress.yaml
│   ├── NOTES.txt
│   ├── serviceaccount.yaml
│   ├── service.yaml
│   └── tests
│       └── test-connection.yaml
└── values.yaml
```

Plenty of files and quite a structure, but let's focus on the templates folder.

The templates folder is where the Golang template files are placed and this is where you will make a change.

- Locate the `replicas: {% raw %}{{ .Values.replicaCount }}{% endraw %}` line in the deployment.yaml file 
- and change it to `replicas: {% raw %}{{ .Values.replicas }}{% endraw %}` to simplify the naming a bit.

Save the file and template the chart to see that your change manifests in the result:

```
$ helm template my-first-chart --set replicas=2

[...]
spec:
  replicas: 2
[...]
```

Congratulations, you successfully made your first edit in a Helm chart!

While editing charts is not a common thing to do as a developer, it is important to get familiar with Helm chart internals. Configuration options are sometimes not well documented, so seeing how they work will help you in your daily work.

## Closing thoughts

This is what you have learnt:


- you know how to install off-the-shelf charts
- you know how to configure them after installation
- and you also understand that Helm charts are Golang template files

There is still a lot to know about Helm, but now you are able to navigate the ecosystem.

As a final task, you should inspect [the defaults of the PostgresSQL chart](https://github.com/bitnami/charts/blob/master/bitnami/postgresql/values.yaml).

Every Helm chart has a default `values.yaml` file where most variables are listed and have their default values assigned.
It is good practice to look at a chart's values.yaml when you are looking for examples of configuring a Helm chart. This knowledge combined with `helm template` should get you far.

And don't get discouraged by complex chart templates.

You know everything about them now conceptually. You may not know yet about templating functions and named templates, but [Helm's documentation](https://helm.sh/docs/chart_template_guide/functions_and_pipelines/) is a good reference to learn about the syntaxes that you don't quite understand yet.

Onwards!
