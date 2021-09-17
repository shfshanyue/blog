---
title: docker compose 简易入门
keywords: docker
date: 2019-11-19T20:02:20+08:00
categories:
  - 运维
  - 后端
thumbnail: https://docs.docker.com/engine/images/architecture.svg
tags:
  - devops
---

# docker compose 简易入门

当我们通过了解 [docker 简易入门](https://github.com/shfshanyue/op-note/blob/master/docker.md) 本篇文章后，想必此时我们已经可以基于 `nginx` 镜像创建一个最简单的容器：启动一个最简单的 http 服务

``` bash
$ docker run -d --name nginx -p 8888:80 nginx:alpine

$ docker ps -l
CONTAINER ID        IMAGE                COMMAND                  CREATED             STATUS              PORTS                    NAMES
404e88f0d90c        nginx:alpine         "nginx -g 'daemon of…"   4 minutes ago       Up 4 minutes        0.0.0.0:8888->80/tcp     nginx
CONTAINER ID        IMAGE                COMMAND                  CREATED             STATUS              PORTS                    NAMES
```

其中有诸多参数命令

+ `-d`: 启动一个 `daemon` 进程
+ `--name`: 为容器指定名称
+ `-p host-port:container-port`: 宿主机与容器端口映射，方便容器对外提供服务
+ `nginx:alpine`: 基于该镜像创建容器

这还只是一个简单的 `nginx` 的容器，如果有更多的容器那应该如何管理呢？

**使用 `docker-compose` 来编排应用**

<!--more-->

+ 原文链接: [docker compose 简易入门](https://github.com/shfshanyue/op-note/blob/master/docker-compose.md)
+ 系列文章: [个人服务器运维指南](https://github.com/shfshanyue/op-note)

## 快速开始

使用 `docker-compose` 创建一个最简单的容器，创建 `docker-compose.yaml` 文件。它使用配置文件的方式代替以前传参数的方式启动容器

``` yaml
version: '3'

services:
  nginx:
    image: nginx:alpine
    container_name: nginx-service
    restart: always
    ports:
      - "8888:80"
```

使用 `docker-compose up` 启动容器，它会自动查找当前目录下的 `docker-compose.yaml` 文件作为配置文件

``` bash
# 启动
$ docker-compose up

# 启动三个实例
$ docker-compose up --scale nginx=3

# 查看日志，而不退出
$ docker-compose logs -f

# 停止
$ docker-compose stop

# 删除
$ docker-compose rm

# 在某个 Service 下的容器中执行命令
$ docker-compose exec nginx sh
```

## 配置文件

关于 `compose` 的所有的配置请参考官方文档 [compose file](https://docs.docker.com/compose/compose-file/)，大部分配置与 `dockerfile` 配置相类似

配置文件管理三种资源，`services`，`networks` 以及 `volumes`，我们可以结合 `docker-compose` 与 `traefik` 来管理应用。如以下配置文件将可以以域名 `whiami.docker.localhost` 来访问应用，详情可参考 [traefik 简易入门](https://github.com/shfshanyue/op-note/blob/master/traefik.md)

``` yaml
version: '3'

# 配置 service
services:
  whoami:
    image: containous/whoami
    restart: always
    labels:
      - "traefik.http.routers.whoami.rule=Host(`whoami.docker.localhost`)"

# 配置 network
networks:
  default:
    external:
      name: traefik_default
```

### image

指定镜像

``` yaml
image: nginx
```

### build

可以直接根据当前目录构建，而无需镜像

``` yaml
version: "3"
services:
  webapp:
    build: .
```

### ports

主机与容器的端口映射，但是在 `trafik` 代理下往往不需要指定

``` yaml
ports:
  - "8080:80"
```

### labels

用以筛选容器，在结合 `traefik` 或者 `k8s` 使用时，用以控制流量

``` yaml
labels:
  com.example.description: "Accounting webapp"
  com.example.department: "Finance"
  com.example.label-with-empty-value: ""

labels:
  - "com.example.description=Accounting webapp"
  - "com.example.department=Finance"
  - "com.example.label-with-empty-value"
```

### container_name

指定容器名称，但是指定后不能够横向扩展，往往不会用到

## 容器管理

当使用 `docker-compose` 编排应用时，同时也可以选择 `ctop` 来管理容器。
