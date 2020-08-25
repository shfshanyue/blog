date: 2020-07-10 08:53

---

# 如何使用 Docker 高效部署 Node 应用

> [如何在生产环境部署一个 Node 应用？](https://github.com/shfshanyue/Daily-Question/issues/420)

一个合理并且高效的部署方案，不仅能够实现快速升级，平滑切换，负载均衡，应用隔离等部署特性，而且配有一套成熟稳定的监控。

`kubernetes` 把 Node 应用视作一个服务端应用的黑盒子，完美匹配了以上条件，越来越多的团队把 node 部署在 k8s 上。

但在此之前，需要先把 Node 应用跑在一个 Docker 容器上，这也是本章的主题。

> 关于前端在 docker 上部署，山月曾写了两篇文章：
> 
> 1. [如何在 docker 中部署前端](https://shanyue.tech/frontend-engineering/docker.html)
> 1. [前端部署 Prview 与 Production](https://shanyue.tech/frontend-engineering/feature-deploy.html)
> 1. [前端部署的发展过程](https://shanyue.tech/frontend-engineering/deploy.html)

## 一个简单的 Node 应用

**index.js**

一个 `hello, world` 版的 Node Web App

``` js
const http = require('http')

const app = async (req, res) => {
  res.end('hello, world')
}

http.createServer(app).listen(3000, () => console.log(3000))
```

**package.json**

配置 `npm start` 来启动应用

``` json
"scripts": {
  "start": "node index.js"
},
```

但这仅仅是最简单的 Node 应用，真实环境中还有各种数据存储及定时任务调度等，暂撇开不谈，这已经足够了。

再稍微复杂一点点的 Node 应用可以查看山月的项目 [whoami](https://github.com/shfshanyue/whoami): 一个最简化的 `serverless` 与 `dockerize` 示例。 

## NODE_ENV=production

在生产环境中，无需安装 `devDependecies` 中依赖，NODE_ENV 环境变量设置为 production 时将会跳过 `devDep`。

``` bash
# 通过设置环境变量，只安装生产环境依赖
$ NODE_ENV=production npm ci

# 通过显式指定 flag，只安装生产环境依赖
$ npm ci --production
```

另一方面，某些第三方模块会根据 NODE_ENV 环境变量做出一些意料不到的配置。因此在生产环境注意该环境变量的配置。

## 一个 Node 应用的简单部署

一个典型的、面向服务端的 Node 应用是这么跑起来的:

1. `npm install`
1. `npm run config`，从配置服务(consul/vault)拉取配置 ，如数据库与缓存的账号密码，此时构建服务器需要配置服务权限
1. `npm run migrate`，数据库迁移脚本，执行数据库表列行更改操作，此时构建服务器需要数据库访问权限
1. `npm start`，启动一个 Node 服务

把运行步骤翻译为 Dockerfile:

``` dockerfile
# 选择一个体积小的镜像 (~5MB)
FROM node:12-alpine

# 环境变量设置为生产环境
ENV NODE_ENV production

WORKDIR /code

# 更好的根据 Image Layer 利用缓存
ADD package.json package-lock.json /code
RUN npm ci

ADD . /code

# 配置服务及数据库迁移
RUN npm run config --if-present && npm run migrate --if-present

EXPOSE 3000
CMD npm start
```

这对于大部分 Node 应用已经是足够了，如果精益求精，可以再走接下来的多阶段构建

## node-gyp 与 Native Addon

在 Node 中有可能存在着一些 Native Addon，它们通过 node-gyp 进行编译，而它依赖于 `python`，`make` 与 `g++`。

``` bash
$ apk --no-cache add python make g++
```

在带有编译过程的镜像构建中，源文件与构建工具都会造成空间的浪费。借助镜像的**多阶段构建**可以高效利用空间。`Go App` 与 `FE App` 的构建也遵循此规则。

+ [多阶段构建 Go 应用](https://docs.docker.com/develop/develop-images/multistage-build/#use-multi-stage-builds)
+ [多阶段构建前端应用](https://shanyue.tech/frontend-engineering/docker.html#%E5%A4%9A%E9%98%B6%E6%AE%B5%E6%9E%84%E5%BB%BA)

在构建 Node 应用镜像时，第一层镜像用以构造 `node_modules`。

``` dockerfile
# 选择一个体积小的镜像 (~5MB)
FROM node:12-alpine as builder

# 环境变量设置为生产环境
ENV NODE_ENV production

# 更好的根据 Image Layer 利用缓存
ADD package.json package-lock.json ./
RUN npm ci

# 多阶段构建之第二阶段
# 多阶段构建之第二阶段
# 多阶段构建之第二阶段
FROM node:12-alpine

WORKDIR /code
ENV NODE_ENV production

ADD . .
COPY --from=builder node_modules node_modules
# 配置服务及数据库迁移
RUN npm run config --if-present && npm run migrate --if-present

EXPOSE 3000
CMD npm start
```

## 相关文章

1. [N-API and getting started with writing C addons for Node.js](https://hackernoon.com/n-api-and-getting-started-with-writing-c-addons-for-node-js-cf061b3eae75)
1. [Using Docker for Node.js in Development and Production](https://dev.to/alex_barashkov/using-docker-for-nodejs-in-development-and-production-3cgp)