---
title: traefik 简易入门
date: 2019-12-07T16:31:01+08:00
thumbnail: https://docs.traefik.io/assets/img/traefik-architecture.png
categories:
  - 后端
  - 运维
tags:
  - devops
---

# Traefik 简易入门

`traefik` 与 `nginx` 一样，是一款优秀的反向代理工具，或者叫 `Edge Router`。至于使用它的原因则基于以下几点

+ 无须重启即可更新配置
+ 自动的服务发现与负载均衡
+ 与 `docker` 完美集成，基于 `container label` 的配置
+ 漂亮的 `dashboard` 界面
+ `metrics` 的支持，支持对 `prometheus` 和 `k8s` 集成

接下来讲一下 `traefik` 的安装，基本功能以及配置，以及如何基于 `Traefik` 搭建一套 `CaaS` 的架构。

<!--more-->

+ 原文链接: [Traefik: 更好用更简单的反向代理](https://github.com/shfshanyue/op-note/blob/master/traefik.md)
+ 系列文章: [个人服务器运维指南](https://github.com/shfshanyue/op-note)

![traefik quickstart](https://docs.traefik.io/assets/img/quickstart-diagram.png)

## 快速开始

> 本篇文章基于版本号 `traefik:v2.2` 进行讲解

我们使用 `traefik:v2.2` 作为镜像启动 `traefik` 服务。`docker-compose.yaml` 配置文件如下

``` yaml
version: '3'

services:
  traefik:
    image: traefik:v2.2
    command: --api.insecure=true --providers.docker
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

此时我们使用命令 `docker-compose up -d` 开启 `traefik` 服务，此时一个反向代理器已经部署成功。

接下来我们使用 `docker-compose` 借助 `whoami` 镜像启动一个简单的 `http` 服务，`docker-compose.yaml` 配置文件如下

``` yaml
version: '3'

services:
  # 改镜像会暴露出自身的 `header` 信息
  whoami:
    image: containous/whoami
    labels:
      # 设置Host 为 whoami.docker.localhost 进行域名访问
      - "traefik.http.routers.whoami.rule=Host(`whoami.docker.localhost`)"

# 使用已存在的 traefik 的 network
networks:
  default:
    external:
      name: traefik_default
```

那 `whoami` 这个 `http` 服务做了什么事情呢

1. 暴露了一个 `http` 服务，主要提供一些 `header` 以及 `ip` 信息
1. 配置了容器的 `labels`，设置该服务的 `Host` 为 `whoami.docker.localhost`，给 `traefik` 提供标记

此时我们可以通过主机名 `whoami.docker.localhost` 来访问 `whoami` 服务，我们使用 `curl` 做测试

``` bash
$ curl -H Host:whoami.docker.localhost http://127.0.0.1
Hostname: bc3e8f1a5066
IP: 127.0.0.1
IP: 172.21.0.2
RemoteAddr: 172.21.0.1:37852
GET / HTTP/1.1
Host: whoami.docker.localhost
User-Agent: curl/7.29.0
Accept: */*
Accept-Encoding: gzip
X-Forwarded-For: 127.0.0.1
X-Forwarded-Host: whoami.docker.localhost
X-Forwarded-Port: 80
X-Forwarded-Proto: http
X-Forwarded-Server: 8.8.8.8
X-Real-Ip: 127.0.0.1
```

服务正常访问。此时如果把 `Host` 配置为自己的域名，则已经可以使用自己的域名来提供服务

## 配置文件

![](https://docs.traefik.io/assets/img/static-dynamic-configuration.png)

`traefik` 一般需要一个配置文件来管理路由，服务，证书等。我们可以通过 `docker` 启动 `traefik` 时来挂载配置文件，`docker-compose.yaml` 初始文件如下

``` yaml
version: '3'

services:
  traefik:
    image: traefik:v2.2
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - ./traefik.toml:/etc/traefik/traefik.toml
      - /var/run/docker.sock:/var/run/docker.sock
```

其中 `traefik.toml` 通过挂载文件的方式作为 `traefik` 的基本配置文件，基本配置文件可以通过 [traefik.sample.toml](https://raw.githubusercontent.com/containous/traefik/master/traefik.sample.toml) 获取

一个简单的配置文件及释义如下

### docker

``` toml
[providers.docker]
  endpoint = "unix:///var/run/docker.sock"
  defaultRule = "Host(`{{ normalize .Name }}.shanyue.local`)"
```

如果没有配置 `Rule`，将默认通过 `<Name>.shanyue.local` 的形式发现路由

### 日志

日志极为重要，当某个路由配置不成功，或者 https 配置失败时，可以通过日志文件找到蛛丝马迹。

``` toml
# Writing Logs to a File, in JSON
[log]
  filePath = "/path/to/log-file.log"
  format = "json"
```

### 请求日志

``` toml
[accessLog]

filePath = "./traefik-access.json"

format = "json"
```

请求日志文件配置为 `json` 格式，结构化数据方便调试

### entryPoint

``` toml
[entryPoints]
  [entryPoints.web]
    address = ":80"

  [entryPoints.web-secure]
    address = ":443"
```

考虑到隐私以及安全，不对外公开的服务可以配置 `Basic Auth`，`Digest Auth` 或者 `WhiteList`，或者直接搭建 VPN，在内网内进行访问。至于 `Basic Auth` 等，可以参考 [traefik middlewares](https://docs.traefik.io/middlewares/overview/)

### prometheus metrics

``` toml
[metrics.prometheus]
  buckets = [0.1,0.3,1.2,5.0]
  entryPoint = "metrics"
```

[Prometheus](https://prometheus.io/) 作为时序数据库，可以用来监控 traefik 的日志，支持更加灵活的查询，报警以及可视化。traefik 默认设置 prometheus 作为日志收集工具。另外可以使用 `grafana` 做为 `prometheus` 的可视化工具。

## Docker Provider，Router and Service

![traefik architecture](https://docs.traefik.io/assets/img/architecture-overview.png)

+ `Providers` 服务提供者，如 docker，如一个 http service
+ `Routers` 分析请求的 `Host`，`Header` 或者 `Path` 
+ `Services` 选择合适的 `Provider` (负载均衡等)

我们使用 `Docker` 作为 `Provider`，而 `Router` 与 `Service` 可以通过 `container labels` 来进行配置，我们一般使用 `docker-compose.yaml` 中的 `labels` 来配置

我们可以通过 `traefik.http.routers.<container-name>.rule` 来配置路由规则，类似与 `nginx` 中的 `location`

``` yaml
labels:
  - "traefik.http.routers.blog.rule=Host(`traefik.io`) || (Host(`containo.us`) && Path(`/traefik`))"
```

### 负载均衡

如果要为 `docker provider` 进行负载均衡怎么办?

只需要使用 `docker-compose up --scale` 对容器横向扩容即可完成

``` bash
$ docker-compose up --scale whoami=3
WARNING: The scale command is deprecated. Use the up command with the --scale flag instead.
Starting whoami_whoami_1 ... done
Creating whoami_whoami_2 ... done
Creating whoami_whoami_3 ... done
```

在 `traefik dashboard` 中查看该 `service`时，已负载到三个容器

## Traefik Dashboard

![traefik dashboard](./assets/traefik-dashboard.png)

`traefik` 默认有一个 `dashboard`，通过 `:8080` 端口暴露出去。我们可以在浏览器中直接通过 `<IP>:8080` 访问，但是

1. 使用 `IP` 地址肯定不是特别方便，此时我们可以配置 `Host`
1. 在公网环境下访问有安全性问题，此时可以配置 `basicAuth`，`digestAuth`，`IpWhiteList` 或者 `openVPN` 等中间件

再次更改 `traefik` 的 `docker-compose.yaml` 文件如下：

``` yaml
version: '3'

services:
  reverse-proxy:
    image: traefik:v2.2
    restart: always
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - ./traefik.toml:/etc/traefik/traefik.toml
      - /var/run/docker.sock:/var/run/docker.sock
    container_name: traefik
    labels:
      - "traefik.http.routers.api.rule=Host(`traefik.shanyue.local`)"
      - "traefik.http.routers.api.service=api@internal"
```

此时可以通过 `traefik.shanyue.local` 来访问 `dashboard`

> Q: 我们如何配置 DNS 服务器来使得 `traefik.shanyue.local` 可供集群内部使用

## 总结

使用 `docker-compose.yaml` 部署 `traefik`，部署文件文件如下

``` yaml
version: '3'

services:
  reverse-proxy:
    image: traefik:v2.2
    restart: always
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - ./traefik.toml:/etc/traefik/traefik.toml
      - /var/run/docker.sock:/var/run/docker.sock
    container_name: traefik
    labels:
      - "traefik.http.routers.api.rule=Host(`traefik.shanyue.local`)"
      - "traefik.http.routers.api.service=api@internal"
```

`traefik` 的配置文件可以通过 [traefik.sample.toml](https://raw.githubusercontent.com/containous/traefik/master/traefik.sample.toml) 获取

当使用 `docker` 部署完成 `traefik` 并且配置好配置文件后。如果想要使用 `docker-compose` 部署一个新的应用时只需要

1. 添加几行 `container labels`
1. 添加 `traefik` 容器所使用的网络

``` yaml
version: '3'

services:
  # 该镜像会暴露出自身的 `header` 信息
  whoami:
    image: containous/whoami
    restart: always
    labels:
      # 设置Host 为 whoami.docker.localhost 进行域名访问
      - "traefik.http.routers.whoami.rule=Host(`whoami.docker.localhost`)"

# 使用已存在的 traefik 的 network
networks:
  default:
    external:
      name: traefik_default
```

## 下一步

当我们访问集群内部服务，如数据库，缓存，`traefik Dashboard`，`gitlab` 时，如果直接暴露在公网中，则会造成很大安全隐患，此时我们应该如何处理呢？
