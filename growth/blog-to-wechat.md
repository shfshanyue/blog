---
title: '黑客增长: 如何把用户从博客引流到公众号'
path: blog-to-wechat
description: 鉴于我自己也有一个博客，并且日均UV在200左右，决定来试一试。整理了一下思路，差不多与短信验证码的逻辑相似，于是花了一天时间搞定。
keywords: 公众号开发,博客引流,devops,traefik,serverless,博客引流到公众号
date: 2019-12-30
tags:
  - node
  - devops

---

# 黑客增长: 从博客引流到公众号

前几日在朋友圈刷到一篇文章 [我是怎么把博客粉丝转到公众号的](https://cuiqingcai.com/7463.html)，觉得相当有创意。最近一年在做 toC 产品，一直在谈拉新留存转化。**这刚好可以作为一个黑客增长的成功案例。**

鉴于我自己也有一个博客，并且日均UV在200左右，决定来试一试。整理了一下思路，差不多与短信验证码的逻辑相似，于是花了一天时间搞定。

另外，在此之前我也花了一天时间调研了 `serverless`。所以你完全可以**零成本实现从博客到公众号引流的功能**。

## 需求

先来谈一谈需求点：

1. 博客的内容被二维码弹框遮挡，弹框上有口令及公众号二维码
1. 扫码关注二维码并回复口令，回复口令后刷新博客弹框消失

需求很简单，如图下所示。你也可以去我的网站 [每天学习一点点](https://q.shanyue.tech) 查看实现效果

![博客被锁住时的截图](./assets/lock.png)

### 用户体验

不得不说，弹窗实在是一件伤用户体验的事情了。但也有一些措施，能够让用户体验变得稍微优化一点

1. 简单的口令，如只有四位数字
1. 非强制的弹窗，浏览内容时只有一定几率会出现弹窗，及时出现弹窗，刷新一下即可跳过

## 实现

简单过一遍技术栈，博客采用了 `vuepress`，前端的技术栈就是 `vue` 了。

由于是一个小小的服务，后端则尽可能轻量，于是我选择了 `koa`。为了方便后端迁移，如我以后将会迁移到 `serverless`，则使用无状态服务，即不依赖数据存储。如果没有状态，那怎么认证用户呢？使用 `jwt`

关于部署，则使用 `docker`，`docker-compose` 以及 `traefik`。至于部署这块，我有一个基础设施很完善的服务器环境，可以参考文章 [当我有一台服务器时我做了什么](https://shanyue.tech/op/when-server-2019.html)。

这下子实现思路就很清晰了：

+ css 部分使用选择器控制只显示文章的前两个标签，其余隐藏
+ js 部分有两个请求，一个根据口令请求 jwt，一个根据jwt判断是否合法，口令是四位数字随机生成
+ 后端，使用koa做一个简单的服务，使用jwt免掉存储状态，且可以使用四位简短数字，避免冲突
+ 存储，一个 lru，存在内存里，只留三分钟，用来交换 jwt
+ 部署，使用 `docker compose` 和 `docker` 由于无状态，很容易迁移到 serverless。且在微信环境下很容易制作测试环境与生产环境
+ 网关 `traefik`，方便自动服务发现与证书管理

## CSS

在前端控制内容被二维码遮挡的主要实现在于 CSS，而CSS主要控制两点

1. 弹框
1. 只显示博客内容前N段

我们博客大部分使用静态生成器，从 `markdown` 生成，生成的 `html` 大致长这个样子。

``` html
<div class="content">
  <h1></h1>
  <p></p>
  <p></p>
</div>
```

**现在前端的发展趋势是状态即UI**，我们使用一个变量 `isLock` 来控制所有样式。我们在 `vue template` 中加入弹框。

``` html
<div :class="{ lock: isLock }">
  <!-- markdown内容 -->
  <Content />
  <!-- 弹框 -->
  <div class="content-lock">
  </div>
</div>
```

弹框的显示隐藏容易控制，那 `Content` 即文章内容的呢，如何控制只显示前N段？

这肯定难不倒曾经三个月的工作只写 `CSS` 的我，使用 `nth-child`。`stylus` 代码如下

``` stylus
.theme-default-content.lock
  .content__default
    :nth-child(3)
      opacity .5

    :nth-child(4)
      opacity .2

    :nth-child(n+5)
      display none

  .content-lock
    display block
```

另外，我们也加了点渐变效果提升观感：前两段内容显示，第三段第四段渐变，五段以后全部隐藏。具体见 `css` 代码

## 解锁状态

在 `vue` 中主要控制状态 `isLock`，除了真实解锁逻辑还有一个随机性的弹窗。`this.lock` 代表是否解锁，`this.isLock` 代表是否显示弹窗

``` js
{
  data () {
    return {
      lock: false,
      code: ''
    }
  },
  computed: {
    isLock () {
      return this.lock ? Math.random() > 0.5 : false
    }
  },
}
```

## 口令

口令需要是持久化的：保证每次刷新页面口令都是一致的。因此口令存储于 `localStorage` 中，随机生成四位数字，代码如下

``` js
function getCode () {
  if (localStorage.code) {
    return localStorage.code
  }
  const code = Math.random().toString().slice(2, 6)
  localStorage.code = code
  return code
}
```

## 微信开发

接下来的逻辑是

1. 在微信中把口令传给后端
1. 前端刷新解锁

先看在微信这边的逻辑。我对微信开发封装成了简单的路由形式，核心逻辑如下：**当接收到数字码时存储到 `cache` 中，这里使用了一个简单的内存 lru，只存储口令三分钟**

`cache` 中存储了 `code: userOpenId` 键值对

``` js
function handleCode (message) {
  const { FromUserName: from, Content: code } = message
  // 对于 code，存储三分钟
  cache.set(code, from, 3 * 60 * 1000)
  return '您好，在三分钟内刷新网站即可无限制浏览所有文章'
}

const routes = [{
  default: true,
  handle: handleDefault
}, {
  text: /\d{4}/,
  handle: handleCode
}]
```

## 用户认证

此时的用户认证就很简单了，传统形式的基于 `session` 的用户认证。后端采用 `koa` 开发，代码如下，此时还使用了 `JOI` 做了简单的输入检验

``` javascript
exports.verifyCode = async function (ctx) {
  const { code } = Joi.attempt(ctx.request.body, Joi.object({
    code: Joi.string().pattern(/\d{4}/)
  }))
  if (!cache.get(code)) {
    ctx.body = ''
    return
  }
  const from = cache.get(code)
  ctx.body = jwt.sign({ from }, secret, { expiresIn: '3y' })
}
```

## 口令过短会不会造成冲突

不会，由于在服务端用户口令只在内存中存在三分钟，所以冲突的可能性很小。那三分钟之后，如何进行用户状态的持久化呢？

## 用户状态持久化

但是此时有一个问题，`cache` 只能存储维护三分钟数据状态。这个问题如何解决？

此时使用 `JWT` 来做用户认证。因此校验口令时返回生成的 `jwt`，在浏览器端持久化，使用它来保持用户状态。关于 `JWT`，可以看我以前的文章 [JWT 深入浅出](https://shanyue.tech/post/jwt-guide.html#session)

``` javascript
exports.verifyCode = async function (ctx) {
  // ...
  ctx.body = jwt.sign({ from }, secret, { expiresIn: '3y' })
}
```

持久化用户认证逻辑前端部分

``` javascript
async function verifyToken (token) {
  const { data: { data: verify } } = await request.post('/api/verifyToken', {
    token
  })
  return verify
}

async mounted () {
  const code = getCode()
  this.code = code
  if (!localStorage.token) {
    this.lock = true
    const token = await verifyCode(code)
    if (token) {
      localStorage.token = token
      this.lock = false
    }
  } else {
    const token = localStorage.token
    const verify = await verifyToken(token)
    if (!verify) {
      this.lock = true
    }
  }
}
```

持久化用户认证逻辑后端部分

``` js
exports.verifyToken = async function (ctx) {
  const { token } = Joi.attempt(ctx.request.body, Joi.object({
    token: Joi.string().required()
  }))
  ctx.body = jwt.verify(token, secret)
}
```

## 如何保证用户取消订阅后再次弹框

当后端使用 `jwt` 用户认证时，服务器端收到 `openId`，根据 `openId` 获取用户信息，如果没有获取到，说明用户取消了订阅。

**但是获取用户信息此项权限个人公众号未曾拥有**

## 部署

开发完成之后使用 `docker` 及 `docker-compose` 部署，`traefik` 做服务发现，通过 `https://we.shanyue.tech` 暴露服务，这三者在本系列文章中有所介绍

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

## 代码开源

关于前端代码，皆在 [shfshanyue/Daily-Question](https://github.com/shfshanyue/Daily-Question/blob/master/.vuepress/theme/components/Page.vue) 中

关于后端代码，皆在 [shfshanyue/wechat](https://github.com/shfshanyue/wechat) 中

而本篇文章，属于 [个人服务器运维指南](https://github.com/shfshanyue/op-note) 的案例篇，关于 `docker`，`compose` 及 `traefik` 等基础设施的搭建均在本系列中有所介绍

## 获取一个永久 token

除了通过扫码回复公众号口令获得文章解锁外，这里也有一个永久 token 可以解锁。复制以下代码到控制台刷新即可解锁全部文章

``` js
localStorage.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1Nzc2MjI1MjEsImV4cCI6MTY3MjI5NTMyMX0.tB-CgK6aIo3whD-mAu3X37XT8q9v2bVXxG6llodznws'
```
