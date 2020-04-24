# Node 中的全链路式日志标记及处理

本篇文章开始之前先抛出两个问题:

1. 当在客户端捕捉到一条异常请求时，如何有效地排查问题？
1. 当在生产环境中发现某条 API 高延迟，又如何定位问题？

从挂下来的蜘蛛丝可以找到蜘蛛的所在，从灶马爬过留下的痕迹可以查出灶马的去向。而要更有效解决此类问题，我们需要依赖全链路式的日志作为蛛丝马迹。如当发现测试环境某条 API 延迟过高时，通过该 API 在日志系统中找到所涉及到的所有关键逻辑及数据库查询，查找是否 SQL 查询过多或其中有慢查询所致，或者是否被上游服务拖累。

在微服务架构中，标记全链路日志有助于更好的解决 bug 和分析接口性能，本篇文章介绍在 `Node` 中如何标记全链路式日志

## 当一个请求到来时，服务器端会产生哪些日志

+ 本次请求及相应报文
+ 本次请求涉及到的数据库操作
+ 本次请求涉及到的缓存操作
+ 本次请求涉及到的上游服务请求
+ 本次请求所遭遇的异常
+ 本次请求执行的关键业务逻辑

## 如何查询本次从请求到响应全链路的所有日志

使用 `requestId` 唯一标识每个请求，有时它又被称为 `sessionId` 或者 `transactionId`，在更多情况下它被称作 `traceId`。

1. 使用 `requestId` 标记每次请求全链路日志，所要标记的日志种类如上所示
1. 通过把 `X-Request-Id` (X-Session-Id) 标记在请求头中，在整个链路进行传递

```typescript
async function context (ctx: KoaContext, next: any) {
  const requestId = ctx.header['x-request-id'] || uuid()
  ctx.res.setHeader('requestId', requestId)
  ctx.requestId = requestId
  await next()
}

app.use('/todos/:id', (ctx) => {
  User.findByPk(ctx.body.id, {
    logging () {
      // log ctx.requestId
    }
  })
})
```

## 如何以侵入性更小的方式来标记每次请求

如上，在每次数据库查询时手动对 `requestId` 进行标记过于繁琐。可以统一设计 `logger` 函数进行标记

具体代码可见我一个脚手架中的 [logger.ts](https://github.com/shfshanyue/apollo-server-starter/blob/master/lib/logger.ts)

这里使用了流行的日志库 [winston (13582 Star)](https://github.com/winstonjs/winston)

```typescript
import winston, { format } from 'winston'

const requestId = format((info) => {
  info.requestId = session.get('requestId')
  return info
})

const logger = winston.createLogger({
  format: format.combine(
    format.timestamp(),
    requestId(),
    format.json()
  )
})
```

## 异步资源周期及 CLS

或者说如何在 `logger.ts` 如何获得整个请求响应生命周期中的 `requestId`，这里要提到了 `CLS`，及异步资源生命周期中的

+ 通过 [async_hooks](https://github.com/nodejs/node/blob/master/doc/api/async_hooks.md) 可以追踪异步行为的生命周期
+ 通过 [cls-hooked](https://github.com/Jeff-Lewis/cls-hooked) 可以获得每次异步请求的 requestId

> 

```javascript
import { createNamespace } from 'cls-hooked'

const session = createNamespace('hello, world')

export { session }
```

## 如何从全链路日志中得益

1. 当 `sentry` (警报系统) 中收到一条异常警报时，通过 `requestId` 可以在 `elk` (日志系统) 中获取到关于该异常的所有关键日志 (sql, redis, 关键函数的输入输出)
1. 当客户端一条请求过慢时，通过请求头获取到的 `requestId` 可以在 `elk` 中分析该请求的所有数据库查询时间，请求响应时间，缓存是否命中等指标
1. 查找 API 对应执行的 SQL 语句以及条数，判断是否有冗余 SQL 语句的查询
