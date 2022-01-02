# 部署 CRA: Docker 缓存优化技术以及多阶段构建

部署完一个简单页面后，终于可以来一个与真实项目接近带有复杂度的项目:

*部署一个 `Creact React APP` 单页应用。*

## 单页应用的静态资源

``` bash
$ npx create-react-app my-app
$ cd my-app
$ npm run build
```

**所有的前端单页应用对于部署，最重要的就是两点:**

1. 静态资源如何构建: 大部分项目都是 `npm run build`。
1. 静态资源目录在哪: 有的项目是 `/dist`，有的项目是 `/build`。CRA 是 `/build` 目录。

## Dockerfile

在本地运行 CRA 应用有以下步骤:

``` bash
$ yarn
$ npm run build
$ npx serve -s build
```

将命令通过以下几步翻译为一个 Dockerfile:

1. 选择一个基础镜像。由于需要构建，需要 node 的运行环境，因此选择 node。
1. 将以上几个脚本命令放在 RUN 指令中。
1. 启动服务命令放在 CMD 指令中。

``` dockerfile
FROM node:14-alpine

WORKDIR /code

ADD . /code
RUN yarn && npm run build

CMD npx serve -s build
EXPOSE 3000
```

构建完成。

然而还可以针对以下两点进行优化。

+ 构建镜像时间过长，优化构建时间
+ 构建镜像大小过大，优化镜像体积

## 构建时间优化: 构建缓存

我们注意到，一个前端项目的耗时时间主要集中在两个命令:

1. npm install (yarn)
1. npm run build

在本地环境中，如果没有新的 npm package 需要下载，不需要重新 npm i。那 Docker 中是不也可以做到这一点？

在 Dockerfile 中，对于 `ADD` 指令来讲，如果需要**添加的文件内容的 `checksum` 没有发生变化，则可以利用构建缓存**。

而对于前端项目而言，如果 `package.json/yarn.lock` 文件内容没有变更，则无需 `npm i`。

将 `package.json/yarn.lock` 事先置于镜像中，安装依赖将可以获得缓存的优化。优化如下。

``` dockerfile
FROM node:14-alpine as builder

WORKDIR /code

# 单独分离 package.json，是为了安装依赖可最大限度利用缓存
ADD package.json yarn.lock /code/
RUN yarn

ADD . /code
RUN npm run build

CMD npx serve -s build
EXPOSE 3000
```

## 构建体积优化: 多阶段构建

1. 使用 node 镜像对单页应用进行构建，生成静态资源
1. 使用 nginx 镜像对单页应用的静态资源进行服务化

``` dockerfile
FROM node:14-alpine as builder

WORKDIR /code

# 单独分离 package.json，是为了安装依赖可最大限度利用缓存
ADD package.json yarn.lock /code/
RUN yarn

ADD . /code
RUN npm run build

# 选择更小体积的基础镜像
FROM nginx:alpine
COPY --from=builder code/build /usr/share/nginx/html
```

## 启动容器

我们将 Dockerfile 命名为 `simple.Dockerfile`，使用 `docker-compose up` 启动容器。

``` bash
version: "3"
services:
  simple:
    build:
      context: .
      dockerfile: simple.Dockerfile
    ports:
      - 4000:80
```

访问 `http://localhost:4000` 页面成功。

---

本篇文章，通过构建缓存与多阶段构建优化了体积和时间，然而还有连个个小问题需要解决:

1. 单页应用的路由
1. 单页应用的永久缓存