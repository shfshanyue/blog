# 四十行代码实现一个 koa

`删繁就简三秋树`。当我们学习

这是一个拥有 koa 所有核心功能最简化的示例：

``` js
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  console.log('Middleware 1 Start')
  await next()
  console.log('Middleware 1 End')
})

app.use(async (ctx, next) => {
  console.log('Middleware 2 Start')
  await next()
  console.log('Middleware 2 End')

  ctx.body = 'hello, world'
})

app.listen(3000)

// output
// Middleware 1 Start
// Middleware 2 Start
// Middleware 2 End
// Middleware 1 End
```

在这个最简化的示例中，可以看到有三个清晰的模块，分别如下：

+ Application: 基本服务器框架
+ Context: 服务器框架基本数据结构的封装，用以 http 请求解析及响应
+ Middleware: 中间件，也是洋葱模型的核心机制

我们开始逐步实现这三个模块

## Http Server

我们要基于 node 最基本的 `http server` 来实现一个最简版的 `koa`，示例如下：

``` js
const http = require('http')

const server = http.createServer((req, res) => {
  res.end('hello, world')
})

server.listen(3000)
```

而要实现最简版的 `koa` 示例如下，我把最简版的这个 koa 命名为 `koa-mini`

``` js
const Koa = require('koa-mini')
const app = new Koa()

app.use(async (ctx, next) => {
  console.log('Middleware 1 Start')
  await next()
  console.log('Middleware 1 End')
})

app.use(async (ctx, next) => {
  console.log('Middleware 2 Start')
  await next()
  console.log('Middleware 2 End')

  ctx.body = 'hello, world'
})

app.listen(3000)
```

## 构建 Application

首先完成 `Appliacation` 的大体框架：

+ `app.listen`: 处理请求及响应，并且监听端口
+ `app.use`: 这里依旧调用的是原生 `http.createServer` 的回调函数

示例如下：

``` js
const http = require('http')

class Application {
  constructor () {
    this.cb = null 
  }

  listen (...args) {
    const server = http.createServer(this.cb)
    server.listen(...args)
  }

  // 这里依旧调用的是原生 http.createServer 的回调函数
  use (cb) {
    this.cb = cb 
  }
}
```

此时调用 `Application` 处理请求：

``` js
const app = new Appliacation()

app.use((req, res) => {
  res.end('hello, world')
})

app.listen(3000)
```

由于 `app.use` 的回调函数依然是原生的 `http.crateServer` 回调函数，而在 `koa` 中回调参数是一个 `Context` 对象。

下一步要做的将是构建 `Context`

### 构建 Context

`koa-use` 的回调参数为 `Context`: `app.use(ctx => {})`。在这一步要构建一个 `Context` 对象，并使用 `ctx.body` 构建响应：

+ `app.use(ctx => ctx.body = 'hello, world')`: 在 `http.createServer` 回调函数中进一步封装 `Context` 及 app 回调函数
+ `Context(req, res)`: 以 `request/response` 数据结构为主体构造 Context 对象

``` js
const http = require('http')

class Application {
  constructor () {
    this.cb = null 
  }

  listen (...args) {
    const server = http.createServer((req, res) => {
      // 构造 Context 对象
      const ctx = new Context(req, res)

      // 此时处理为与 koa 兼容 Context 的 app.use 函数
      this.cb(ctx)

      // ctx.body 为响应内容
      ctx.res.end(ctx.body)
    })
    server.listen(...args)
  }

  use (cb) {
    this.cb = cb 
  }
}

class Context {
  constructor (req, res) {
    this.req = req
    this.res = res
  }
}
```

此时 `koa` 被改造如下，可以正常工作：

``` js
const app = new Application()

app.use(ctx => {
  ctx.body = 'hello, world'
})

app.listen(7000)
```

现在就剩下一个最重要也是最核心的功能：洋葱模型

## 洋葱模型及中间件改造

+ `app.use(fn)`: 收集中间件回调函数数组，并并使用 `compose` 串联起来

``` js
const http = require('http')

class Application {
  constructor () {
    this.cbs = []
  }

  listen (...args) {
    const server = http.createServer(async (req, res) => {
      const ctx = new Context(req, res)
      // 对中间件回调函数串联，形成洋葱模型
      const fn = compose(this.cbs)
      await fn(ctx)
      ctx.res.end(ctx.body)
    })
    server.listen(...args)
  }

  use (cb) {
    // 中间件回调函数变为了数组
    this.cbs.push(cb)
  }
}

class Context {
  constructor (req, res) {
    this.req = req
    this.res = res
  }
}
```

### compose

``` js
middleware(ctx, next)
```

``` js
const next = () => nextMiddleware(ctx, next)
middleware(ctx, next)
```

``` js
const dispatch = (i) => {
  return middleware(ctx, () => dispatch(i+1))
}
```

最终的 `compose`

``` js
function compose (middlewares) {
  return ctx => {
    const dispatch = (i) => {
      const fn = middlewares[i]
      if (i === middlewares.length) {
        return
      }
      return fn(ctx, () => dispatch(i+1))
    }
    return dispatch(0)
  }
}
```