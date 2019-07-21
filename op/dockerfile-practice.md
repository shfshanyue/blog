---
title: dockerfile 最佳实践及示例
keywords: docker,docker最佳实践
date: 2019-12-14T20:02:20+08:00
description: Dockerfile 最佳实践已经出现在官方文档中，地址在 Best practices for writing Dockerfiles。如果再写一份最佳实践，倒有点关公门前耍大刀之意。因此本篇文章是对官方文档的翻译，理解，扩展与示例补充
categories:
  - 运维
  - 后端
thumbnail: https://docs.docker.com/engine/images/architecture.svg
tags:
  - devops
---

# Dockerfile 最佳实践

Dockerfile 最佳实践已经出现在官方文档中，地址在 [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)。如果再写一份最佳实践，倒有点关公门前耍大刀之意。因此本篇文章是对官方文档的翻译，理解，扩展与示例补充

<!--more-->

+ 原文地址: [dockerfile 最佳实践](https://github.com/shfshanyue/op-note/blob/master/dockerfile-practice.md)
+ 系列文章: [个人服务器运维指南](https://github.com/shfshanyue/op-note)

> 如果本篇文章能够对你有所帮助，可以帮我在 [shfshanyue/op-note](https://github.com/shfshanyue/op-note) 上点个 star

## 容器应该是短暂的

通过 `Dockerfile` 构建的镜像所启动的容器应该尽可能短暂 (ephemeral)。短暂意味着可以很快地启动并且终止

## 使用 .dockerignore 排除构建无关文件

`.dockerignore` 语法与 `.gitignore` 语法一致。使用它排除构建无关的文件及目录，如 `node_modules`

## 使用多阶段构建

多阶段构建可以有效减小镜像体积，特别是对于需编译语言而言，一个应用的构建过程往往如下

1. 安装编译工具
1. 安装第三方库依赖
1. 编译构建应用

而在前两步会有大量的镜像体积冗余，使用多阶段构建可以避免这一问题

这是构建 `Go` 应用的一个示例

``` dockerfile
FROM golang:1.11-alpine AS build

# Install tools required for project
# Run `docker build --no-cache .` to update dependencies
RUN apk add --no-cache git
RUN go get github.com/golang/dep/cmd/dep

# List project dependencies with Gopkg.toml and Gopkg.lock
# These layers are only re-built when Gopkg files are updated
COPY Gopkg.lock Gopkg.toml /go/src/project/
WORKDIR /go/src/project/
# Install library dependencies
RUN dep ensure -vendor-only

# Copy the entire project and build it
# This layer is rebuilt when a file changes in the project directory
COPY . /go/src/project/
RUN go build -o /bin/project

# This results in a single layer image
FROM scratch
COPY --from=build /bin/project /bin/project
ENTRYPOINT ["/bin/project"]
CMD ["--help"]
```

这是构建前端应用的一个示例，可以参考 [如何使用 docker 高效部署前端应用](https://github.com/shfshanyue/op-note/blob/master/deploy-fe-with-docker.md)

``` dockerfile
FROM node:10-alpine as builder

ENV PROJECT_ENV production
ENV NODE_ENV production

# http-server 不变动也可以利用缓存
WORKDIR /code

ADD package.json /code
RUN npm install --production

ADD . /code
RUN npm run build

# 选择更小体积的基础镜像
FROM nginx:10-alpine
COPY --from=builder /code/public /usr/share/nginx/html
```

## 避免安装不必要的包

减小体积，减少构建时间。如前端应用使用 `npm install --production` 只装生产环境所依赖的包。

## 一个容器只做一件事

如一个web应用将会包含三个部分，web 服务，数据库与缓存。把他们解耦到多个容器中，方便横向扩展。如果你需要网络通信，则可以将他们至于一个网络下。

如在我的个人服务器中，我使用 `traefik` 做负载均衡与服务发现，所有应用及数据库都在 `traefik_default` 网络下，详情参考 [使用 traefik 做负载均衡与服务发现](https://github.com/shfshanyue/op-note/blob/master/traefik.md)

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

## 减少镜像层数

+ 只有 `RUN`, `COPY`, `ADD` 会创建层数, 其它指令不会增加镜像的体积
+ 尽可能使用多阶段构建

使用以下方法安装依赖

``` dockerfile
RUN yum install -y node python go
```

错误的方法安装依赖，这将增加镜像层数

``` dockerfile
RUN yum install -y node
RUN yum install -y python
RUN yum install -y go
```

## 将多行参数排序

便于可读性以及不小心地重复装包

``` dockerfile
RUN apt-get update && apt-get install -y \
  bzr \
  cvs \
  git \
  mercurial \
  subversion
```

## 充分利用构建缓存

在镜像的构建过程中 `docker` 会遍历 `Dockerfile` 文件中的所有指令，顺序执行。对于每一条指令，`docker` 都会在缓存中查找是否已存在可重用的镜像，否则会创建一个新的镜像

我们可以使用 `docker build --no-cache` 跳过缓存

+ `ADD` 和 `COPY` 将会计算文件的 `checksum` 是否改变来决定是否利用缓存
+ `RUN` 仅仅查看命令字符串是否命中缓存，如 `RUN apt-get -y update` 可能会有问题

如一个 `node` 应用，可以先拷贝 `package.json` 进行依赖安装，然后再添加整个目录，可以做到充分利用缓存的目的。

``` dockerfile
FROM node:10-alpine as builder

WORKDIR /code

ADD package.json /code
# 此步将可以充分利用 node_modules 的缓存
RUN npm install --production

ADD . /code

RUN npm run build 
```
