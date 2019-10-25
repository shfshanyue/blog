---
title: 如何使用 docker 高效部署前端应用
description: docker 变得越来越流行，它可以轻便灵活地隔离环境，进行扩容，方便运维管理。对开发者也更方便开发，测试与部署。这里介绍如何使用 Docker 部署前端应用。千里之行，始于足下，足下的意思就是，先让它能够跑起来。
keywords:
  - docker
  - 使用 docker 部署前端
  - 优化 dockerfile
date: 2019-03-09
tags:
  - docker
  - javascript
categories:
  - 前端
  - 运维
---

docker 变得越来越流行，它可以轻便灵活地隔离环境，进行扩容，方便运维管理。对开发者也更方便开发，测试与部署。

最重要的是， **当你面对一个陌生的项目，你可以照着 Dockerfile，甚至不看文档(文档也不一定全，全也不一定对)就可以很快让它在本地跑起来。**

<!--more-->

现在很强调 devops 的理念，我把 devops 五个大字放在电脑桌面上，格物致知了一天。豁然开朗，devops 的意思就是写一个 Dockerfile 去跑应用(开玩笑。

这里介绍如何使用 Docker 部署前端应用。千里之行，始于足下，足下的意思就是，先让它能够跑起来。

> 本文地址 http://shanyue.tech/post/deploy-frontend-with-docker/

## 先让它跑起来

首先，简单介绍一下一个典型的前端应用部署流程

1. `npm install`, 安装依赖
1. `npm run build`，编译，打包，生成静态资源
1. 服务化静态资源

介绍完部署流程后，简单写一个 Dockerfile

```Dockerfile
FROM node:alpine

# 代表生产环境
ENV PROJECT_ENV production
# 许多 package 会根据此环境变量，做出不同的行为
# 另外，在 webpack 中打包也会根据此环境变量做出优化，但是 create-react-app 在打包时会写死该环境变量
ENV NODE_ENV production
WORKDIR /code
ADD . /code
RUN npm install && npm run build && npm install -g http-server
EXPOSE 80

CMD http-server ./public -p 80
```

现在这个前端服务已经跑起来了。接下来你可以完成部署的其它阶段了。一般情况下，以下就成了运维的工作了，不过，拓展自己的知识边界总是没错的。

+ 使用 nginx 或者 traefik 做反向代理
+ 使用 kubernetes 或者 compose 等做编排。
+ 使用 gitlab ci 或者 drone ci 等做 CI/CD

这时镜像存在有两个问题，导致每次部署时间过长，不利于产品的快速交付

+ 构建镜像时间过长
+ 构建镜像大小过大，1G+

## 从 dependencies 和 devDependencies 下手

> 陆小凤说过，一个前端程序员若是每天工作八个小时，至少有两个小时是白白浪费了的。一个小时用来 npm install，另一个小时用来 npm run build。

对于每次部署，如果能够减少无用包的下载，便能够节省很多镜像构建时间。eslint，mocha，chai 等代码风格测试模块可以放到 devDependencies 中。在生产环境中使用 `npm install --production` 装包。

> 关于两者的区别可以参考文档  https://docs.npmjs.com/files/package.json.html#dependencies

```Dockerfile
FROM node:alpine

ENV PROJECT_ENV production
ENV NODE_ENV production
WORKDIR /code
ADD . /code
RUN npm install --production && npm run build && npm install -g http-server
EXPOSE 80

CMD http-server ./public -p 80
```

好像是快了那么一点点。

我们注意到，相对于项目的源文件来讲，package.json 是相对稳定的。如果没有新的安装包需要下载，则再次构建镜像时，无需重新装包。则可以在 npm install 上节省一半的时间。

## 利用镜像缓存

对于 `ADD` 来讲，如果需要添加的内容没有发生变化，则可以利用缓存。把 package.json 与源文件分隔开写入镜像是一个很好的选择。目前，如果没有新的安装包更新的话，可以节省一半时间

```Dockerfile
FROM node:alpine

ENV PROJECT_ENV production
ENV NODE_ENV production

# http-server 不变动也可以利用缓存
RUN npm install -g http-server

WORKDIR /code

ADD package.json /code
RUN npm install --production

ADD . /code
RUN npm run build
EXPOSE 80

CMD http-server ./public -p 80
```

关于利用缓存有更多细节，需要特别注意一下，如 `RUN git clone <repo>` 的缓存此类

> 参考官方文档 https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#leverage-build-cache

## 多阶段构建

得益于缓存，现在镜像构建时间已经快了不少。但是，镜像的体积依旧过于庞大，也会增加每次的部署时间

考虑下每次 CI 部署的流程

1. 在构建服务器构建镜像
1. 把镜像推至镜像仓库服务器，
1. 在生产服务器拉取镜像，启动容器

显而易见，镜像体积过大造成传输效率低下，增加每次部署的延时。

即使，构建服务器与生产服务器在同一节点下，没有延时的问题。减少镜像体积也能够节省磁盘空间

关于镜像体积的过大，很大一部分是因为node_modules 臭名昭著的体积

![node_modules的体积](https://blog.xiange.tech/post/deploy-frontend-with-docker/node_modules.jpeg)

但最后我们只需要 public 文件夹下的内容，对于源文件以及node_modules下文件，占用体积过大且不必要，造成浪费。

此时可以利用 Docker 的多阶段构建，仅来提取编译后文件

> 参考官方文档 https://docs.docker.com/develop/develop-images/multistage-build/

```Dockerfile
FROM node:alpine as builder

ENV PROJECT_ENV production
ENV NODE_ENV production

# http-server 不变动也可以利用缓存
WORKDIR /code

ADD package.json /code
RUN npm install --production

ADD . /code
RUN npm run build

# 选择更小体积的基础镜像
FROM nginx:alpine
COPY --from=builder /code/public /usr/share/nginx/html
```

此时，镜像体积从 1G+ 变成了 50M+

## 使用 CDN

分析一下 50M+ 的镜像体积，nginx:alpine 的镜像是16M，剩下的40M是静态资源。

**如果把静态资源给上传到 CDN，则没有必要打入镜像了**，此时镜像大小会控制在 20M 以下

关于静态资源，可以分类成两部分

+ /static，此类文件在项目中直接引用根路径，打包时复制进 /public 下，需要被打入镜像
+ /build，此类文件需要 require 引用，会被 webpack 打包并加 hash 值，并通过 publicPath 修改资源地址。可以把此类文件上传至 cdn，并加上永久缓存，不需要打入镜像

```Dockerfile
FROM node:alpine as builder

ENV PROJECT_ENV production
ENV NODE_ENV production

# http-server 不变动也可以利用缓存
WORKDIR /code

ADD package.json /code
RUN npm install --production

ADD . /code

# npm run uploadCdn 是把静态资源上传至 cdn 上的脚本文件
RUN npm run build && npm run uploadCdn

# 选择更小体积的基础镜像
FROM nginx:alpine
COPY --from=builder code/public/index.html code/public/favicon.ico /usr/share/nginx/html/
COPY --from=builder code/public/static /usr/share/nginx/html/static
```
