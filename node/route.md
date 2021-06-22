## 简单路由


## 复杂路由

+ Method: `app.post('/')`
+ Param Path: `app.post('/users/:userId')`

## 基于正则路由

``` js
const { pathToRegexp, match, parse, compile } = require('path-to-regexp')
```
+ Path-to-RegExp

## 基于正则路由的一些问题

性能问题先不谈，先看一个问题

``` js

```

## 基于前缀树路由 (Trie、Radix Tree、Prefix Tree)

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