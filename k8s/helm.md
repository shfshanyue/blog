--- 
title: 部署利器 helm v3 安装以及使用指南
keywords: kubernetes,helm,helm安装,helm3,helm2
description: "`helm` 是基于 `kubernetes` 的包管理器。它之于 `kubernetes` 就如 `yum` 之于 `centos`，`pip` 之于 `python`，`npm` 之于 `javascript`"
date: 2019-11-01 20:00
tags:
  - k8s
  - devops

---

# 部署利器: helm

> 山月最近想起来自己还有一个 k8s 集群，决定输出一些云原生的文章，在我的 github 仓库 <https://github.com/shfshanyue/learn-k8s> 可以看到。本篇文章主要介绍 helm，说到它，实在是太简单太好用，在 k8s 上部署应用就和傻瓜似的...傻瓜式一键安装，你值得拥有

`helm` 是基于 `kubernetes` 的包管理器。它之于 `kubernetes` 就如 `yum` 之于 `centos`，`pip` 之于 `python`，`npm` 之于 `javascript`。

那 `helm` 的引入对于管理集群有哪些帮助呢？可体现在基础运维建设及业务应用两方面

1. 基础设施，更方便地部署与升级基础设施，如 `gitlab`，`prometheus`，`grafana`，`ES` 等
1. 业务应用，更方便地部署，管理与升级公司内部应用，为公司内部的项目配置 Chart，使用 `helm` 结合 CI，在 k8s 中部署应用如一行命令般简单

**当然 `helm` 更伟大的在于它的思想上：`Separation of concerns`。使得运维人员与开发人员进一步职责分离**。

让开发人员写 `k8s` 资源配置文件是不现实的

1. 不是所有开发都了解k8s，或者说很少，不了解 k8s 很难写资源配置部署文件
1. 开发的主要职能还是在业务上

于是 `helm` 应时而出，运维通过 `helm` 配置好资源文件模板，然后交给开发填参数。

本篇文章主要介绍如何安装 helm 以及如何使用 helm 部署基础服务和业务

+ 原文地址: [部署利器 helm 安装及使用指南](https://shanyue.tech/k8s/helm.html)
+ 系列文章: [个人服务器运维指南](https://shanyue.tech/op/)

## 安装 helm

这里参考官方文档 [安装 helm](https://helm.sh/docs/intro/install/)

`helm` 此时已发布了 v3，本篇文章关于 `helm` 安装及使用指南以 `helm v3` 为基础。

> `helm` 在 helm v2 时分为客户端 (helm client，即命令行工具) 与服务端 (helm server) 两部分，在服务端又叫 `Tiller`，安装 `Tiller` 时会在集群中部署一个 `Pod`，用以接替资源部署。

### 安装客户端 (helm client)

helm client 需要安装在你可以访问 k8s 集群的任何服务器，如同 `kubectl`，你既可以安装在你自己的 `PC/Mac` 中，也可以安装在 `kubectl` 集群环境的主节点

在 mac 上进行安装

``` shell
$ brew install kubernetes-helm
```

在 linux 上进行安装

``` shell
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

根据二进制包进行安装，比较推荐，毕竟使用以上两种方案在目标机可能有网络问题

1. 需要在代理节点下载二进制脚本
1. 使用 `rsync` 或者 `scp` 将脚本移动到目标机目标位置

示例选择 `3.2.3` 进行安装，`helm` 的最新版本可以参考 [helm/helm Releases](https://github.com/helm/helm/releases)。

> 可以选择 3.0+ 版本的安装，目前最新版本是 `Helm v3.0.0-rc.1` (2019/11/01)

``` shell
# 下载 MAC 上适用的软件包
# -L: 追踪重定向链接
# -O: 保存到本地
# -S: 打印错误
$ curl -SLO https://get.helm.sh/helm-v3.2.3-darwin-amd64.tar.gz 

# 下载 CentOS 上适用的软件包
$ curl -SLO https://get.helm.sh/helm-v3.2.3-linux-amd64.tar.gz

# 如果有网络问题，请在代理节点下载并 rsync 到目标节点，如果没有，跳过此步
$ rsync -avhzP proxy:/root/helm-v3.2.3-linux-amd64.tar.gz .

# 如果在 mac 上
$ tar -zxvf helm-v3.2.3-darwin-amd64.tar.gz 

# 如果在 centos 上
$ tar -zxvf helm-v3.2.3-linux-amd64.tar.gz

# 进入相应目录，移至 /bin 目录
$ mv linux-amd64/helm /usr/local/bin/helm
```

此时 `helm v3` 安装成功，使用 `helm version` 查看版本号

``` bash
$ helm version
version.BuildInfo{Version:"v3.2.3", GitCommit:"8f832046e258e2cb800894579b1b3b50c2d83492", GitTreeState:"clean", GoVersion:"go1.13.12"}
```

## 介绍

在 `helm` 中有三个关键概念：`Chart`，`Repo` 及 `Release`

+ `Chart`: 一系列 k8s 资源集合的命名，它包含一系列 k8s 资源配置文件的模板与参数，可供灵活配置
+ `Repo`: 即 chart 的仓库，其中有很多个 chart 可供选择，如官方 [helm/charts](https://github.com/helm/charts)
+ `Release`: 当一个 Chart 部署后生成一个 release

### Chart 简介

使用 `helm create` 创建一个 chart，了解简单 chart 的目录结构

> 关于如何安装 helm 参考下一小节

``` bash
# 创建一个 chart
$ helm create todo
Creating todo

$ cd todo

# 打印 chart 目录，主要文件有 Chart.yaml 与 values.yaml
# --dirsfirst 先打印文件夹名称
$ tree --dirsfirst
.
├── charts
├── templates
│   ├── tests
│   │   └── test-connection.yaml
│   ├── NOTES.txt
│   ├── _helpers.tpl
│   ├── deployment.yaml
│   ├── ingress.yaml
│   └── service.yaml
├── Chart.yaml
└── values.yaml

3 directories, 8 files
```

查看主要的两个文件目录

+ `templates/`: 这是运维大哥写的配置文件模板，示例是最简单应用的资源配置，但复杂应用还会有 pvc，role，service-acount 等等
+ `values.yaml`: 这是给开发小弟写的可选参数，但是大部分参数都被运维大哥给内置了

## 使用 helm 部署基础服务

真实案例可以参看我的系列文章其它章节

+ [使用 helm 部署 redis](https://shanyue.tech/k8s/deploy-redis.html)
+ [使用 helm 部署 postgres](https://shanyue.tech/k8s/deploy-postgres.html)
+ [使用 helm 部署 drone](https://shanyue.tech/k8s/deploy-drone.html)

这里讲述一些关于部署基础服务的一般步骤，假设我们需要部署 redis

> 这里使用 helm v3，语法与 v2 可能略有出入

### 00 添加相关 Repo

通过 `helm repo add` 可以添加 Repo，这里列出几个频率使用较高的 Repo

+ [helm](https://github.com/helm/charts)
+ [bitnami](https://hub.helm.sh/charts/bitnami)

如果在国内有网络问题，可以使用阿里云镜像

``` bash
$ helm repo add stable https://apphub.aliyuncs.com/stable

$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

另外，对于一些大软件公司也会维护自己的 Chart，如 `gitlab`，`elasti`

+ [elastic](https://hub.helm.sh/charts/elastic)
+ [gitlab](https://hub.helm.sh/charts/gitlab)

### 01 查找相关 Chart

使用 `helm search hub`

``` bash
$ helm search repo redis
NAME                                    CHART VERSION   APP VERSION     DESCRIPTION
apphub/prometheus-redis-exporter        3.1.0           1.0.4           Prometheus exporter for Redis metrics
apphub/redis                            9.3.1           5.0.5           Open source, advanced key-value store. It is of...
apphub/redis-cache                      0.4.1           4.0.12-alpine   A pure in-memory redis cache, using statefulset...
apphub/redis-ha                         3.8.0           5.0.5           Highly available Kubernetes implementation of R...
apphub/redis-operator                   1.0.0                           Redis Operator provides high availability redis...
apphub/redispapa                        0.0.1           0.0.1           利用redis的info信息对redis的使用情况进行监控的一...
bitnami/redis                           10.7.1          6.0.5           Open source, advanced key-value store. It is of...
bitnami/redis-cluster                   2.3.1           6.0.5           Open source, advanced key-value store. It is of...
stable/prometheus-redis-exporter        3.4.1           1.3.4           Prometheus exporter for Redis metrics
stable/redis                            10.5.7          5.0.7           DEPRECATED Open source, advanced key-value stor...
stable/redis-ha                         4.4.4           5.0.6           Highly available Kubernetes implementation of R...
apphub/codis                            3.2             3.2             A Helm chart for Codis
```

### 02 选定 Chart，跟进 Chart 的官方文档

我们选定 [stable/redis](https://hub.helm.sh/charts/bitnami/redis) 这个 chart。

跟踪官方文档，设置相关参数，存储为 `values-production.yaml`

``` bash
# Production configuration
$ helm install redis bitami/redis --values values-production.yaml
```

如何部署完成，可以查看安装某个 `Release` 时的 `values`

``` bash
$ helm get values redis
```

如果需要升级，使用 `helm upgrade`

``` bash
$ helm upgrade redis bitnami/redis --values values-production.yaml
```

### 03 校验部署状态

这与需要部署的资源有关，不过一般也就分为 `Service`，`Pod` 和 `PVC`

``` bash
helm status redis
NAME: redis
LAST DEPLOYED: Fri Nov  8 21:07:24 2019
NAMESPACE: default
STATUS: deployed
REVISION: 2
TEST SUITE: None
NOTES:
** Please be patient while the chart is being deployed **
Redis can be accessed via port 6379 on the following DNS name from within your cluster:

redis-master.default.svc.cluster.local
```

## 总结

本篇文章介绍了如何安装 `helm v3`，及如何使用 `helm` 快速部署应用，简单总结为两条命令

``` bash
# 在有 k8s 管理权限的 mac 上安装 helm
$ brew install helm

# 使用 helm 安装 redis
$ helm install redis bitnami/redis
```

