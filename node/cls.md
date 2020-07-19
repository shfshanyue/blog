date: 2020-04-10 20:00

---

# async_hooks、Continuation Local Storage 与 Node 中异步资源生命周期监听

> 在 Node 中为什么需要监听异步资源？

在一个 Node 应用中，异步资源监听使用场景最多的地方在于：

+ 异常捕捉时需要提供用户信息，在每次客户端请求中保持一致的用户信息
+ 全链路式日志追踪，设计每次请求的第三方服务、数据库、Redis携带一致的 traceId

下图为 zipkin 根据 traceId 定位的全链路追踪：

![zipkin 全链路追踪](https://zipkin.io/public/img/web-screenshot.png)

我们来看一个在异常处理中配置用户信息的**错误示例**:

``` js
const session = new Map()

app.use((ctx, next) => {
  // 设置用户信息
  const user = getUserById()
  session.set('user', user)
  await next()
})

app.use((ctx, next) => {
  try {
    await next()
  } catch (e) {
    const user = session.get('user')

    // 把 user 上报给异常监控系统
  }
})
```

当在后端服务全局配置用户信息，以便异常及日志追踪。**由于此时采用的 session 是异步的，用户信息极其容易被随后而来的请求而覆盖，那如何正确获取用户信息呢？**

## async_hooks

官方文档如此描述 `async_hooks`: 它被用来追踪异步资源，也就是监听异步资源的生命周期。

> The async_hooks module provides an API to track asynchronous resources. 

既然它被用来追踪异步资源，则在每个异步资源中，都有两个 ID:

+ `asyncId`: 异步资源当前生命周期的 ID
+ `trigerAsyncId`: 可理解为父级异步资源的 ID，即 `parentAsyncId`

通过以下 API 调取

``` js
const async_hooks = require('async_hooks');

const asyncId = async_hooks.executionAsyncId();

const trigerAsyncId = async_hooks.triggerAsyncId();
```

更多详情参考官方文档: [async_hooks API](https://nodejs.org/api/async_hooks.html#async_hooks_async_hooks_createhook_callbacks)

## 异步资源

既然谈到了 `async_hooks` 用以监听异步资源，那会有那些异步资源呢？我们日常项目中经常用到的也无非以下集中：

+ `Promise`
+ `setTimeout`
+ `fs`/`net`/`process` 等基于底层的API

然而，在官网中 `async_hooks` 列出的竟有如此之多。除了上述提到的几个，连 `console.log` 也属于异步资源: `TickObject`。

```
FSEVENTWRAP, FSREQCALLBACK, GETADDRINFOREQWRAP, GETNAMEINFOREQWRAP, HTTPINCOMINGMESSAGE,
HTTPCLIENTREQUEST, JSSTREAM, PIPECONNECTWRAP, PIPEWRAP, PROCESSWRAP, QUERYWRAP,
SHUTDOWNWRAP, SIGNALWRAP, STATWATCHER, TCPCONNECTWRAP, TCPSERVERWRAP, TCPWRAP,
TTYWRAP, UDPSENDWRAP, UDPWRAP, WRITEWRAP, ZLIB, SSLCONNECTION, PBKDF2REQUEST,
RANDOMBYTESREQUEST, TLSWRAP, Microtask, Timeout, Immediate, TickObject
```

## async_hooks.createHook

我们可以通过 `asyncId` 来监听某一异步资源，那如何监听到该异步资源的创建及销毁呢？

答案是通过 `async_hooks.createHook` 创建一个钩子，API 及释义见代码:

``` js
const asyncHook = async_hooks.createHook({
  // asyncId: 异步资源Id
  // type: 异步资源类型
  // triggerAsyncId: 父级异步资源 Id
  init (asyncId, type, triggerAsyncId, resource) {},
  before (asyncId) {},
  after (asyncId) {},
  destroy(asyncId) {}
})
```

我们只需要关注最重要的四个 API:

+ `init`: 监听异步资源的创建，在该函数中我们可以获取异步资源的调用链，也可以获取异步资源的类型，这两点很重要。
+ `destory`: 监听异步资源的销毁。要注意 `setTimeout` 可以销毁，而 `Promise` 无法销毁，如果通过 async_hooks 实现 CLS 可能会在这里造成内存泄漏！
+ `before`: 异步资源回调函数开始执行前
+ `after`: 异步资源回调函数执行后

从以下代码可看出 `before` 及 `after` 的位置

``` js
setTimeout(() => {
  // before 生命周期在回调函数最前边
  console.log('Async Before')
  op()
  op()
  op()
  op()
  // after 生命周期在回调函数最后边
  console.log('Async After')
})
```

> 注意: Promise 无 destory 的生命周期，要注意由此造成的内存泄漏。另外，如果使用 `await prom`，Promise 也不会有 before/after 的生命周期

## async_hooks 调试及测试

调试大法最重要的是调试工具，并且不停地打断点与 Step In 吗？

不，调试大法是 `console.log`

但如果调试 `async_hooks` 时使用 `console.log` 就会出现问题，因为 `console.log` 也属于异步资源: `TickObject`。那 `console.log` 有没有替代品呢？

此时可利用 `write` 系统调用，用它向标准输出(`STDOUT`)中打印字符，而标准输出的文件描述符是 1。由此也可见，操作系统知识对于服务端开发的重要性不言而喻。

node 中调用 API 如下:

``` js
fs.writeSync(1, 'hello, world')
```

> [什么是文件描述符 (file descriptor)](https://github.com/shfshanyue/Daily-Question/issues/171)

完整的调试代码如下:

``` js
function log (...args) {
  fs.writeSync(1, args.join(' ') + '\n')
}

async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    log('Init: ', `${type}(asyncId=${asyncId}, parentAsyncId: ${triggerAsyncId})`)
  },
  before(asyncId) {
    log('Before: ', asyncId)
  },
  after(asyncId) {
    log('After: ', asyncId)
  },
  destroy(asyncId) {
    log('Destory: ', asyncId);
  }
}).enable()
```

## Continuation Local Storage 实现

> Continuation-local storage works like thread-local storage in threaded programming, but is based on chains of Node-style callbacks instead of threads. 

`CLS` 是存在于异步资源生命周期的一个键值对存储，对于在同一异步资源中将会维护一份数据，而不会被其它异步资源所修改。

**社区中有许多优秀的实现，而在高版本的 Node (>=8.2.1) 可直接使用 `async_hooks` 实现。目前 Node (>10.0.0) 中，`async_hooks` 可直接使用在生产环境，我们已将几乎所有的Node 服务接入了基于 `async_hooks` 实现的 CLS: `cls-hooked`。**

社区中最流行的两种实现如下：

+ [node-continuation-local-storage](https://github.com/othiym23/node-continuation-local-storage): implementation of https://github.com/joyent/node/issues/5243
+ [cls-hooked](https://github.com/jeff-lewis/cls-hooked): CLS using AsynWrap or async_hooks instead of async-listener for node 4.7+

以下是关于读写值的最简示例：

``` js
const createNamespace = require('cls-hooked').createNamespace
const session = createNamespace('shanyue case')

session.run(() => {
  session.set('a', 3)
  setTimeout(() => {
    // 获取值
    session.get('a')
  }, 1000)
})
```

我自己也使用 `async_hooks` 也实现了一个类似 CLS 功能的库: [cls-session](https://github.com/shfshanyue/cls-session]

``` js
const Session = require('cls-session')

const session = new Session()

function timeout (id) {
  session.scope(() => {
    session.set('a', id)
    setTimeout(() => {
      const a = session.get('a')
      console.log(a)
    })
  })
}

timeout(1)
timeout(2)
timeout(3)

// Output:
// 1
// 2
// 3
```

## cls-hooked 与 session 中间件

为了在 `Node` 中全局异步资源获取 Context 信息更加方便，一般会在 `logger` 中加入 `requestId` 以及 `userId`。

以下是利用 `cls-hooked` 存储 `userId` 的 `koa` 中间件示例

``` js
function session (ctx: KoaContext, next: any) {
  await session.runPromise(() => {
    // 获取 requestId
    const requestId = ctx.header['x-request-id'] || uuid()
    const userId = await getUserIdByCtx()

    ctx.res.setHeader('X-Request-ID', requestId)
    // CLS 中设置 requestId/userId

    session.set('requestId', requestId)
    session.set('userId', userId)
    return next()
  })
}
```

## AsyncLocalStorage

由于 `CLS` 的呼声实在过高，呼吁官方实现类似 API，于是 `ALS` 就在 `node v13.10.0` 之后的版本实现了，与 `CLS` 功能类似，但是 API 有微弱的差别

以下是关于读写值的最简示例：

``` js
const store = { userId: 10086 }
// 设置值
asyncLocalStorage.run(store, () => {
  // 获取值
  asyncLocalStorage.getStore()
})
```

写一个 `koa` 的中间件如下所示

``` js
const { AsyncLocalStorage } = require('async_hooks')

const asyncLocalStorage = new AsyncLocalStorage()

function session (ctx: KoaContext, next: any) {
  const requestId = ctx.header['x-request-id'] || uuid()
  const userId = await getUserIdByCtx()
  const context = { requestId, userId }
  await asyncLocalStorage.run(context, () => {
    return next()
  })
}
```

## 小结

本篇文章讲解了异步资源监听的使用场景及实现方式，可总结为以下三点：

1. CLS 是基于异步资源生命周期的存储，可通过 async_hooks 实现
1. Promise 无 `destroy()` 生命周期，需要注意内存泄漏，必要时可与 `lru-cache` 结合
1. 开启 `async_hooks` 后，每一个异步资源都有一个 asyncId 与 trigerAsyncId，通过二者可查知异步调用关系
1. CLS 常用场景在异常监控及全链路式日志处理中，目前可以使用基于 `async_hooks` 的 `cls-hooked` 作为 CLS 实现
1. 在 `node13.10` 之后官方实现了 `ALS`
