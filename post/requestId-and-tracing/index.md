---
title: 使用 requestId 标记全链路日志
date: 2019-07-05T20:02:20+08:00
categories:
  - 后端
tags:
  - node
  - 监控
---

# 使用 requestId 标记全链路日志

标记全链路日志有助于更好的解决 bug 和分析接口性能，本篇文章使用 `node` 来作为示例

<!--more-->

+ [代码示例](https://github.com/shfshanyue/apollo-server-starter/blob/master/lib/logger.ts)
+ [本文地址](https://shanyue.tech/post/requestid-and-tracing/)
+ [github](https://github.com/shfshanyue/blog)

## 当一个请求到来时，会产生哪些日志

+ 本次请求报文
+ 本次请求涉及到的数据库操作
+ 本次请求涉及到的缓存操作
+ 本次请求涉及到的服务请求
+ 本次请求所遭遇的异常
+ 本次请求执行的关键函数
+ 本次请求所对应的响应体

## 如何查询本次从请求到响应全链路的所有日志

使用 `requestId` 唯一标识每个请求，有时它又被称为 `sessionId` 或者 `transactionId`。

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

## 如何在 logger.ts 中绑定 requestId

或者说如何在 `logger.ts` 如何获得整个请求响应生命周期中的 `requestId`

+ 通过 [async_hooks](https://github.com/nodejs/node/blob/master/doc/api/async_hooks.md) 可以追踪异步行为的生命周期
+ 通过 [cls-hooked](https://github.com/Jeff-Lewis/cls-hooked) 可以获得每次异步请求的 requestId

具体代码可见 [session.ts](https://github.com/shfshanyue/apollo-server-starter/blob/master/lib/session.ts)

```javascript
import { createNamespace } from 'cls-hooked'

const session = createNamespace('hello, world')

export { session }
```

## 如何从全链路日志中得益

1. 当 `sentry` (警报系统) 中收到一条异常警报时，通过 `requestId` 可以在 `elk` (日志系统) 中获取到关于该异常的所有关键日志 (sql, redis, 关键函数的输入输出)
1. 当客户端一条请求过慢时，通过请求头获取到的 `requestId` 可以在 `elk` 中分析该请求的所有数据库查询时间，请求响应时间，缓存是否命中等指标
1. 查找 API 对应执行的 SQL 语句以及条数，判断是否有冗余 SQL 语句的查询

另外可以通过 [zipkin](https://zipkin.io/) 来追踪全链路耗时。

