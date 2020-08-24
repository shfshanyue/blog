date: 2020-07-10 08:53

---

# 如何使用 Docker 部署 Node 应用

> 如何在生产环境部署一个 Node 应用？

一个合理并且高效的部署方案，不仅能够实现快速升级，平滑切换，负载均衡，应用隔离等部署特性，而且配有一套成熟稳定的监控。

`kubernetes` 把 Node 应用视作一个服务端应用的黑盒子，完美匹配了以上条件，越来越多的团队把 node 部署在 k8s 上。

但在此之前，需要先把 Node 应用跑在一个 Docker 容器上，这也是本章的主题。

> 关于前端在 docker 上部署，山月曾写了两篇文章：
> 
> 1. [如何在 docker 中部署前端]()
> 1. [前端部署 Prview 与 Production]()
> 1. [前端部署演化史]()

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

## 一个 Node 应用的简单部署

一个典型的、面向服务端的 Node 应用是这么跑起来的:

1. `npm install`
1. `npm run config`，从配置服务(consul/vault)拉取配置 ，如数据库与缓存的账号密码，此时构建服务器需要配置服务权限
1. `npm run migrate`，数据库迁移脚本，执行数据库表列行更改操作，此时构建服务器需要数据库访问权限
1. `npm start`，启动一个 Node 服务

把运行步骤翻译为 Dockerfile:

``` dockerfile
FROM node:12-alpine

ENV NODE_ENV production

WORKDIR /code

# 更好的根据 Image Layer 利用缓存
ADD package.json package-lock.json /code
RUN npm ci

ADD . /code

# 配置服务及数据库迁移
RUN npm run config --if-present && npm run migrate --if-present

CMD npm start
```

## C++ Addon 的安装流程


