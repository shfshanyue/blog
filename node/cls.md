# 使用 async_hooks 监听异步资源的生命周期

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
