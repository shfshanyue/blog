---
title: 微信公众号开发模拟面试功能
path: wechat-interview
description: 最近在整理我在大厂面试以及平时工作中遇到的问题，记录在 [shfshanyue/Daily-Question](https://github.com/shfshanyue/Daily-Question) 中，但觉得对于时时回顾，常常复习仍然做的不够。
keywords: 公众号开发,devops,traefik,serverless
date: 2020-01-16 20:00
tags:
  - node
  - devops

---

# 使用微信公众号开发模拟面试功能

最近在整理我在大厂面试以及平时工作中遇到的问题，记录在 [shfshanyue/Daily-Question](https://github.com/shfshanyue/Daily-Question) 中，但觉得对于时时回顾，常常复习仍然做的不够。

于是在微信公众号中开发了随机生成模拟面试的功能，由于觉得比较简单且有趣，于是分享了出来

## 需求

先来谈一谈需求点：

1. 在公众号中回复面试，随机生成 N 道大厂面试题
1. 每道面试题指向一个超链接，可以查看答案

需求很简单，如图下所示。你也可以去我的公众号 `全栈成长之路` 查看实现效果

![](https://camo.githubusercontent.com/c6aefa9d0e275fa39f3447f62267c191c25a1da2/68747470733a2f2f6330312e676169747562616f2e6e65742f676169747562616f5f466c4f4d423637704b58552d444e6b6d4862455449714c6b655363332e706e673f696d6167654d6f6772322f7175616c6974792f3930)

<!--more-->

## 内容

在大部分行业中，内容是至为重要的，有内容才会有好的服务，而技术只是整合内容的一种手段。

在本次功能开发中也是如此：**一个面试题库才是至关重要**。

为此，我在 github 上新建了一个仓库，使用 `Issue` 来记录我在大厂面试中所遇到的面试题及答案

> [每天一道面试题，有关前端，后端，devops以及软技能，促进职业成长，敲开大厂之门。](https://github.com/shfshanyue/Daily-Question)

**到此一步，我拥有了自己的内容，并且拥有了开箱即用的后台管理系统: github issues**

## 数据

此时我们已经拥有了一个特殊的后台管理系统，但很遗憾，由于该管理系统的特殊性，我们并不是数据映射管理系统，而需要根据 Github Issues 来生成结构化的数据，好在我们可以使用 Github API。

Github API 现在已经全部变成了 `GraphQL` 接口，看来大家又需要学习一门新的技术了。关于 Github API 的文档可以在这里找到: [Github API Explorer](https://developer.github.com/v4/explorer/)

以下 Query 就是我们所需要的数据

``` graphql
query ISSUES ($after: String) { 
  repository (name: "Daily-Question", owner: "shfshanyue") {
    id
    issues (first: 100, after: $after, states: OPEN) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        number
        title
        body
        comments (first: 10) {
          nodes {
            id
            body
            star: reactions (content: THUMBS_UP) {
              totalCount
            }
            author {
              login
              url
            }
          }
        }
        labels (first: 5) {
          nodes {
            id
            name
          }
        }
      }
    }
  }
}
```

## 微信开发

在微信开发中，定义一条路由，用来处理对关键字 `面试` 的回复

``` js
const routes = [{
  default: true,
  handle: handleDefault
}, {
  text: /面试/,
  handle: handleInterview,
}]
```

根据封装好的 Issue SDK 随机选取八个问题，更多代码可以前往 [shfshanyue/wechat](https://github.com/shfshanyue/wechat) 中

``` js
function handleInterview () {
  return issue.randomIssues(8).map((issue, i) =>
    `<a href="https://github.com/shfshanyue/Daily-Question/issues/${issue.number}">${i+1}. ${issue.title.slice(6)}</a>`
  ).join('\n\n')
}
```

自此微信开发结束，开始部署项目

## 部署

开发完成之后使用 `docker` 及 `docker-compose` 部署，`traefik` 做服务发现及负载均衡。

如果你对它们不够了解，可以查看我的系列文章 [个人服务器运维指南](https://github.com/shfshanyue/op-note) 的案例篇，关于 `docker`，`compose` 及 `traefik` 等基础设施的搭建均在本系列中有所介绍。

在生产环境中，通过 `https://we.shanyue.tech` 暴露服务。

在测试环境中，需要监听文件重启。在测试环境通过挂载目录的方式在 `https://we.dev.shanyue.tech` 暴露服务。

`Dockerfile` 较为简单，配置文件如下

``` dockerfile
FROM node:10-alpine

WORKDIR /code

ADD package.json /code
RUN npm install --production

ADD . /code

CMD npm start
```

`docker-compose.yaml` 配置文件如下

``` yaml
version: '3'

services:
  wechat:
    build: .
    restart: always
    labels:
      - traefik.http.routers.wechat.rule=Host(`we.shanyue.tech`)
      - traefik.http.routers.wechat.tls=true
      - traefik.http.routers.wechat.tls.certresolver=le
    expose:
      - 3000

networks:
  default:
    external:
      name: traefik_default
```

## 测试环境与生产环境

当我们需要测试微信公众号时，直接使用自己的公众号不太合适，特别是当已有上线内容时。微信官方提供了测试公众号，我们可以重新填写 `域名` 以及 `token`。在测试环境使用域名 `https://we.dev.shanyue.tech`

我们在 `docker-compose` 中使用 `service` 中的 `wechat` 代表生产环境，`wechat-dev` 代表测试环境

`wechat-dev` 通过文件挂载提供服务，可以更新重启应用，便可以做到实时更新代码，并实时在测试公众号中看到效果。

`docker-compose.yaml` 配置文件如下

``` yaml
version: '3'

services:
  wechat:
    build: .
    restart: always
    labels:
      - traefik.http.routers.wechat.rule=Host(`we.shanyue.tech`)
      - traefik.http.routers.wechat.tls=true
      - traefik.http.routers.wechat.tls.certresolver=le
    expose:
      - 3000

  wechat-dev:
    image: 'node:10-alpine'
    restart: always
    volumes:
      - .:/code
    working_dir: /code
    command: npm run dev
    labels:
      - traefik.http.routers.wechat-dev.rule=Host(`we.dev.shanyue.tech`)
      - traefik.http.routers.wechat-dev.tls=true
      - traefik.http.routers.wechat-dev.tls.certresolver=le
    expose:
      - 3000

networks:
  default:
    external:
      name: traefik_default
```

关于后端代码，托管在 [shfshanyue/wechat](https://github.com/shfshanyue/wechat) 中

