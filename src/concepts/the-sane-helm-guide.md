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

In this guide you will get practical knowledge on how-to use Helm focusing on those usecases, packaging and templating, that by the way also underpin Gimlet.

This guide emphasizes simplicity and ease of use. Being an exhausting guide of Helm features is a non-goal. Instead, the goal is to get you from *"Helm, wtf?"* to *"Helm, this ain't so bad"* under five minutes.

Let's get to it, shall we?

## Prerequisites
- You have access to a Kubernetes cluster. Use [k3d](https://github.com/rancher/k3d#get) if you don't have one.
- You have `kubectl` installed. Follow [this guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/) if you don't have it.
- You have Helm installed. Install it with 
`curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` <br /> or look for installation alternatives at [https://helm.sh/docs/intro/install/](https://helm.sh/docs/intro/install/)

## Helm as a source of packaged infrastructure components

If you need a quick and dirty way to install a database, queuing engine or any infrastructure component on Kubernetes, chances are that the infrastructure component has a good enough official - or community - Helm chart that you can use for installation.

 Using the chart you usually get good enough default settings as well. Good for testing purposes - that is.

Let's see how this works with the PostgreSQL database!

- First you need to find the Helm chart for PostgreSQL. The official website of PostgreSQL is a good starting point, but I usually go with a Google search, *"PostgreSQL Helm chart"*
- Typically you can find the Helm chart in the Github organization of the software you want to install, with PostgreSQL however there is only a community chart available so Google pointed me to the [bitnami/charts repo on Github](https://github.com/bitnami/charts/tree/master/bitnami/postgresql).
- Judging the trustworthiness of community charts is often not easy. You may get help on slack channels. In this case I just know that Bitnami's charts are often good, so I will go with it.
- Following the steps on the `bitnami/charts` repo, installing the Helm chart is nothing more than the typical Helm two liners: register first the Helm repository, then install the Redis Helm chart.

```
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm install my-postgres bitnami/postgresql
```

In return, PostgreSQL was installed on the cluster and you also got some getting started information on the screen.

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

Follow the installation with the `kubectl get pods -w` command.

With two commands you were able to install PostgreSQL. This is the power of Helm.

This approach may not match the infrastructure as code tool of your choice, but to see how the component looks installed, and to get inspired how you can automate the component's installation, Helm is the go-to tool. Therefor knowing the above demonstrated commands of Helm is a must have.

## Configuring releases with Helm

Continuing with the PostgreSQL example from the previous chapter, you will tune the PostgreSQL instance using the `bitnami/postgresql` Helm charts predefined options.

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

Since PostgreSQL only reads the default username and password parameter at startup time, use the following command to restart it:

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

Before we round up this chapter and jump to Helm's other thing that it does well, you should get familiar with the a more declarative way of providing Helm chart configuration options.

## Configuring releases with Helm's values.yaml file

It is a good practice to store configuration values in a declerative form, in a file that you can version control.

Let's change the password of the Postgresql installation once again.

This time, by feeding in the `postgresql.values.yaml` to `helm upgrade`.

Let's create the file first:

```
$ cat << EOF > postgresql.values.yaml
postgresqlUsername=postgres
postgresqlPassword=e8f844db4cf0bbb5f431e250dd8e44cb
EOF
```
then let's upgrade the installation with

```
$ helm upgrade my-postgres bitnami/postgresql -f postgresql.values.yaml
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

$ kubectl run my-postgres-postgresql-client --rm --tty -i --restart='Never' --namespace default --image docker.io/bitnami/postgresql:11.13.0-debian-10-r80 --env="PGPASSWORD=e8f844db4cf0bbb5f431e250dd8e44cb" --command -- psql --host my-postgres-postgresql -U postgres -d postgres -p 5432

postgres=#
```

Now that you are able to install and upgrade Helm charts, it's time to complete your must have Helm knowledge by looking at the other thing that Helm does well: templating.


## Templating - the anatomy of a Helm chart

To fully understand Helm - and the configuration values you used in previous chapters - you are going to learn about how Helm charts look inside.

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

The above snippet is a Kubernetes Deployment resource with its replica count templated. This is how Helm charts look inside.

They are Golang template files that are able to render variables at predefined placeholders. Just much more convoluted in real life, thanks to the many generic usecases they have to serve.


In this chapter

- you will modify a chart by introducing a new variable to it, this way you will see that charts are really just template files
- while you will learn how to render and debug Helm charts locally
- and how to navigate chart source code






Large part of Helm's official documentaion explains the structure of Helm charts and teaches how you can make one. But most people never has to create and maintain a Helm chart.







helm template
knowing what's in the helm chart
navigating on git
golang template basics
helm create command
Onechart






