--- 
title: 部署利器 helm 安装以及使用指南 (helv v2/v3)
keywords: kubernetes,helm,helm安装,helm3,helm2
description: "`helm` 是基于 `kubernetes` 的包管理器。它之于 `kubernetes` 就如 `yum` 之于 `centos`，`pip` 之于 `python`，`npm` 之于 `javascript`"
date: 2019-11-01 20:00
tags:
  - k8s
  - devops

---

# 部署利器: helm

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

helm client 需要安装在你可以访问 k8s 集群的任何服务器，如同 `kubectl`，不过通常来说，你需要安装在两个地方

1. k8s 集群的 master node
1. 你自己的 PC/mac 上

> 在 helm v3 中，只需要安装 helm client

在 mac 上进行安装

``` shell
$ brew install kubernetes-helm
```

在 linux 上进行安装

``` shell
$ curl -LO https://git.io/get_helm.sh
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

根据源码包进行安装，比较推荐(毕竟使用以上两种方案可能有网络问题)，至于如何使用 `rsync` 见以下安装步骤

> 使用脚本安装在国内会出现网络问题，需要在代理节点安装并使用 `rsync` 或者 `scp` 移动到目标位置

示例选择 `2.14.3` 进行安装，`helm` 的最新版本可以参考 [helm/helm Releases](https://github.com/helm/helm/releases)。

> 可以选择 3.0+ 版本的安装，目前最新版本是 `Helm v3.0.0-rc.1` (2019/11/01)

``` shell
# 下载 MAC 上适用的软件包
# -L: 追踪重定向链接
# -O: 保存到本地
# -S: 打印错误
$ curl -SLO https://get.helm.sh/helm-v2.14.3-darwin-amd64.tar.gz 

# 下载 CentOS 上适用的软件包
$ curl -SLO https://get.helm.sh/helm-v2.14.3-linux-amd64.tar.gz

# 如果有网络问题，请在代理节点下载并 rsync 到目标节点，如果没有，跳过此步
$ rsync -avhzP proxy:/root/helm-v2.14.3-linux-amd64.tar.gz .

# 如果在 mac 上
$ tar -zxvf helm-v2.14.3-darwin-amd64.tar.gz 

# 如果在 centos 上
$ tar -zxvf helm-v2.14.3-linux-amd64.tar.gz

# 进入相应目录，移至 /bin 目录
$ mv linux-amd64/helm /usr/local/bin/helm
```

### 安装 tiller (helm server)

> 如果使用了 Helm v3，则不用安装 tiller

#### 01 下载镜像

tiller 的镜像 `gcr.io/kubernetes-helm/tiller:v2.14.3` 在 gcr.io 上，这意味着在国内网络需要先下载到代理节点，再移动到目标位置。具体步骤参照以前章节

+ [安装主节点 - 准备离线镜像](https://shanyue.tech/k8s/install-master-node)

#### 02 安装 Tiller

当安装好 `helm` 命令行工具后，使用 `helm init` 安装 tiller。安装 `tiller` 时会在 k8s 上部署一个 pod。

``` bash
$ helm init
Creating /root/.helm
Creating /root/.helm/repository
Creating /root/.helm/repository/cache
Creating /root/.helm/repository/local
Creating /root/.helm/plugins
Creating /root/.helm/starters
Creating /root/.helm/cache/archive
Creating /root/.helm/repository/repositories.yaml
Adding stable repo with URL: https://kubernetes-charts.storage.googleapis.com
Adding local repo with URL: http://127.0.0.1:8879/charts
$HELM_HOME has been configured at /root/.helm.

Tiller (the Helm server-side component) has been installed into your Kubernetes Cluster.

Please note: by default, Tiller is deployed with an insecure 'allow unauthenticated users' policy.
To prevent this, run `helm init` with the --tiller-tls-verify flag.
For more information on securing your installation see: https://docs.helm.sh/using_helm/#securing-your-helm-installation
```

根据提示此时已安装成功，校验 Pod 状态

``` bash
# 查看 tiller 是否出在运行状态
$ kubectl get pods --all-namespaces

# 查看 helm 与 tiller 版本
$ helm version
Client: &version.Version{SemVer:"v2.14.3", GitCommit:"0e7f3b6637f7af8fcfddb3d2941fcc7cbebb0085", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.14.3", GitCommit:"0e7f3b6637f7af8fcfddb3d2941fcc7cbebb0085", GitTreeState:"clean"}
```

## 介绍

+ `Chart`: 一系列 k8s 资源集合的命名，它包含一系列 k8s 资源配置文件的模板与参数，可供灵活配置
+ `release`: 当一个 Chart 部署后生成一个 release，chart/relase 类似于 docker 中 image/container
+ `repo`: 即 chart 的仓库，其中有很多个 chart 可供选择，如官方 [helm/charts](https://github.com/helm/charts)

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

+ [使用 helm 部署 redis](https://shanyue.tech/k8s/deploy-redis)
+ [使用 helm 部署 postgres](https://shanyue.tech/k8s/deploy-postgres)
+ [使用 helm 部署 drone](https://shanyue.tech/k8s/deploy-drone)

这里讲述一些关于部署基础服务的一般步骤。假设我们需要部署 redis

> 这里使用 helm v3，语法与 v2 可能略有出入

### 01 查找相关 Chart

使用 `helm search hub`

``` bash
$ helm search hub redis
URL                                                     CHART VERSION   APP VERSION     DESCRIPTION
https://hub.helm.sh/charts/bitnami/redis                9.5.0           5.0.5           Open source, advanced key-value store. It is of...
https://hub.helm.sh/charts/hephy/redis                  v2.4.0                          A Redis database for use inside a Kubernetes cl...
https://hub.helm.sh/charts/incubator/redis-cache        0.5.0           4.0.12-alpine   A pure in-memory redis cache, using statefulset...
```

### 02 选定 Chart，跟进 Chart 的官方文档

我们选定 [stable/redis](https://hub.helm.sh/charts/bitnami/redis) 这个 chart。

跟踪官方文档，设置相关参数，存储为 `values-production.yaml`

``` bash
# Production configuration
$ helm install redis stable/redis --values values-production.yaml
```

如何部署完成，可以查看安装某个 `Release` 时的 `values`

``` bash
$ helm get values redis
```

如果需要升级，使用 `helm upgrade`

``` bash
$ helm upgrade redis stable/redis --values values-production.yaml
```

如果有必要时会添加 repo: `helm repo add`

``` bash
# helm repo add stable https://kubernetes-charts.storage.googleapis.com/

# 列出所有 repo
$ helm repo list
NAME            URL
stable          https://kubernetes-charts.storage.googleapis.com/
apphub          https://apphub.aliyuncs.com
jetstack        https://charts.jetstack.io
```

### 03 校验部署状态

这与需要部署的资源有关，不过一般也就分为 `Service`，`Pod` 和 `PVC`

