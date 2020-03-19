# 使用 async_hooks 监听异步资源的生命周期

## 为什么需要监听异步资源

``` js
const session = new Map()

app.use((ctx, next) => {
  try {
    await next()
  } catch (e) {
    const user = session.get('user')

    // 把 user 上报给异常监控系统
  }
})

app.use((ctx, next) => {
  // 设置用户信息
  const user = getUserById()
  session.set('user', user)
})
```

而异步资源监听使用场景最多的地方在于：

+ 异常捕捉用户信息配置
+ 全链路式日志追踪: 第三方服务、数据库、Redis 等
+ 一些可能的业务处理

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
+ `before`
+ `after`

``` js
setTimeout(() => {
  // after 生命周期在回调函数最前边
  console.log('Async Before')
  op()
  op()
  op()
  op()
  // after 生命周期在回调函数最后边
  console.log('Async After')
})
```

## 调试及测试

调试大法最重要的是调试工具，并且不停地打断点与 Step In 吗？

不，调试大法是 `console.log`。

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

## Continuation Local Storage

> Continuation-local storage works like thread-local storage in threaded programming, but is based on chains of Node-style callbacks instead of threads. 

`CLS` 是存在于异步资源生命周期的一个键值对存储，对于在同一异步资源中将会维护一份数据，而不会被其它异步资源所修改。社区中有许多优秀的实现，而在高版本的 Node (>=8.2.1) 可直接使用 `async_hooks` 实现。

+ [node-continuation-local-storage](https://github.com/othiym23/node-continuation-local-storage): implementation of https://github.com/joyent/node/issues/5243
+ [cls-hooked](https://github.com/jeff-lewis/cls-hooked): CLS using AsynWrap or async_hooks instead of async-listener for node 4.7+

而我自己使用 `async_hooks` 也实现了一个 CLS: [cls-session](https://github.com/shfshanyue/cls-session]

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

## 小结

1. 开启 async_hooks 后，每一个异步资源都有一个 asyncId 与 trigerAsyncId，通过二者可查知异步调用关系
1. CLS 是基于异步资源生命周期的存储，可通过 async_hooks 实现
1. CLS 常用场景在异常监控及全链路式日志处理中