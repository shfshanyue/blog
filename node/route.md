---
date: 2021-07-10 12:15

---

# Node 服务端框架路由解析

大家好，我是山月。在上篇文章介绍了 HTTP 报文及简单的服务端框架要素，如如何接受请求参数等。这篇文章介绍另一个常见的主题：路由。

## 简单路由

最简单的路由可使用 `req.url` 进行路由分发不同的逻辑，代码如下所示。

但是对于一个非Demo式的页面，业务逻辑都堆在一起，这显得太为简陋。

``` js
const http = require('http')

const server = http.createServer((req, res) => {
  console.log(req.url)

  let data = ''
  if (req.url === '/') {
    data = 'hello, world'
    res.end(data)
  } else if (req.url === '/json') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    data = JSON.stringify({ username: '山月' })
    res.end(data)
  } else if (req.url === '/input') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      data = body
      res.end(data)
    })
  }
  
})

server.listen(3000)
```

## 复杂路由

作为一个能够在生产环境使用，较为复杂的路由至少能够解析以下路由，并为单独路由配置单独的业务逻辑处理函数

+ Method: `app.post('/', handler)`
+ Param Path: `app.post('/users/:userId', handler)`

## 基于正则路由

目前，绝大部分服务端框架的路由都是基于正则进行匹配，如 `koa`、`express` 等。另外，前端框架的路由 `vue-router` 与 `react-router` 也是基于正则匹配。

而这些框架基于正则匹配的路由，都离不开一个库: [path-to-regexp](https://github.com/pillarjs/path-to-regexp)，它将把一个路由如 `/user/:name` 转化为正则表达式。

它的 API 十分简单:

+ `pathToRegexp`: 可将路由转化为正则表达式
+ `match`: 可匹配参数

``` js
const { pathToRegexp, match, parse, compile } = require('path-to-regexp')

pathToRegexp('/api/users/:userId')
//=> /^\/api\/users(?:\/([^\/#\?]+?))[\/#\?]?$/i


const toParams = match('/api/users/:userId')
toParams('/api/users/10')
//=> {
//   index: 0
//   params: {userId: "12"}
//   path: "/api/users/12"
// }
```

那这些 Node 服务器框架基于正则路由的原理是什么？

+ 注册路由。每一个路由都作为一个 Layer (在 express、koa 中)，并使用 `path-to-regexp` 把路由路径转化为正则，作为 Layer 的属性。
+ 匹配路由。当一次请求来临时，对比路由表中每一条路由，找到匹配正则的多条路由，执行多条路由所对应的业务处理逻辑。

从上可以看出它没进行一次路由匹配的时间复杂度为: **O(n) X 正则匹配复杂度**

## 基于正则路由的一些问题

性能问题先不谈，先看一个问题:

**当我们请求 `/api/users/10086`，有两条路由可供选择: `/api/users/10086` 与 `/api/users/:userId`，此时将会匹配哪一条路由？**

以下是由 koa/koa-router 书写， **由于是正则匹配，此时极易出现路由冲突问题，匹配路由时与顺序极为相关。**

``` js
const Koa = require("koa");
const Router = require("@koa/router");

const app = new Koa();
const router = new Router();

router.get("/api/users/10086", (ctx, next) => {
  console.log(ctx.router);
  ctx.body = {
    userId: 10086,
    direct: true
  };
});

router.get("/api/users/:userId", (ctx, next) => {
  console.log(ctx.router);
  ctx.body = {
    userId: ctx.params.userId
  };
});
```

## 基于前缀树路由 (Trie、Radix Tree、Prefix Tree)

相对于正则匹配路由而言，基于前缀树匹配更加高效，且无上述路由冲突问题。

+ [find-my-way](https://github.com/delvedor/find-my-way)

``` js
const http = require('http')
const router = require('find-my-way')()

const server = http.createServer((req, res) => {
  router.lookup(req, res)
})

router.on('GET', '/api', () => {})
router.on('GET', '/api/users/:id', (req, res) => { res.end('id') })
router.on('GET', '/api/users/10086', (req, res) => { res.end('10086') })
router.on('GET', '/api/users-friends', () => {})

console.log(router.prettyPrint())

server.listen(3000)
```

在上述代码中，将把所有路由路径构成前缀树。前缀树，顾名思义，将会把字符串的公共前缀提取出来。

``` bash
└── /api (GET)
    └── /users
        ├── /
        │   ├── 10086 (GET)
        │   └── :id (GET)
        └── -friends (GET)
```

可以看出，前缀树路由的匹配时间复杂度明显小于 O(n)，且每次不会有正则路由进行正则匹配的复杂度。这决定了它相比正则路由更高的性能。

Node 中最快的框架 fastify，便是内置了基于前缀树的路由。

``` js
const fastify = require('fastify')()

fastify.get('/api/users/10086', async (request, reply) => {
  return { userId: 10086, direct: true }
})

fastify.get('/api/users/:id', async (request, reply) => {
  const id = request.params.id
  return { userId: id }
})

fastify.listen(3000)
```

## 405

在 HTTP 状态码中，与路由相关的状态码为 404、405，作为一个专业的路由库，实现一个 405 也是分内之事。

+ 301
+ 302
+ 307
+ 308
+ 404: Not Found
+ 405: Method Not Allowed

嗯，代码就不放了...
