date: 2018-07-18 21:00

---

# Node 中异常上报与监控

在一个后端服务设计中，异常捕获是必不可少需要考虑的因素

**而当异常发生时，能够第一时间捕捉到并且能够获得足够的信息定位到问题至关重要** 这也是本篇文章的内容

刚开始，先抛出两个问题

1. 在生产环境中后端连接的数据库挂了，是否能够第一时间收到通知并定位到问题，而不是等到用户反馈之后又用了半天时间才找到问题 (虽然运维肯定会在第一时间知道数据库挂了)
1. 在生产环境中有一条 API 出了问题，能否衡量该错误的紧急重要程度，并根据报告解决问题

## 异常收集

异常一般发生在以下几个位置

1. API/GraphQL 层，在 API 层的最外层使用一个中间件对错误集中进行处理，并进行上报。在具体逻辑层往往不需要主动捕捉异常，除非针对异常有特殊处理，如数据库事务失败后的回退

    ```javascript
    // 在中间件中集中处理异常
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        ctx.body = formatError(err)
      }
    })

    // graphql 中也可以
    new ApolloServer({
      typeDefs,
      resolvers,
      formatError
    })
    ```

    > 当在逻辑层捕捉到异常再手动抛出时，不要丢失上下文信息，此时可以使用添加字段 originalError 来保持上下文信息

1. script 等非 API 层，如拉取配置，数据库迁移脚本以及计划任务等

另外除了主动捕捉到的异常，还有一些可能漏掉的异常，可能导致程序退出

```javascript
process.on('uncaughtException', (err) => {
  console.error('uncaught', err)
})

process.on('unhandledRejection', (reason, p) => {
  console.error('unhandle', reason, p)
})
```

## API 异常结构化

当 API 层发生异常时，传输数据至客户端时需要对异常进行结构化，方便下一步的异常上报与前端对结构化信息的解析以及对应的展示

以下使用 `FormatError` 表示当发生异常时 API 应该返回的结构化的信息

而当异常发生时，异常可以在最顶层中间件作为错误处理中间件统一捕获，捕获到时可以使用一个函数 `formatError` 在中间件中统一结构化异常信息

```typescript
interface FormatError {
  code: string;
  message: string;
  info: any;
  data: Record<string, any> | null;
  originalError?: Error;
}

function formatError (error: Error): FormatError;
```

以下是 `FormatError` 各字段的示意

### code

表示错误标识码，用以对错误进行归类，如用户输入数据不合法 (ValidationError)，数据库异常 (DatabaseError)，外部服务请求失败 (RequestError)

根据经验我把 code 分为以下几类

+ ValidationError，用户输入不合法
+ DatabaseError，数据库问题
    + DatabaseUniqueError
    + DatabaseConnectionError
    + ...
+ RequestError，外部服务
    + RequestTimeoutError
+ ForbiddenError
+ AuthError，未授权请求授权资源
+ AppError，业务问题
    + AppBadRequest
    + ...
+ ...

对于数据校验，数据库异常与请求失败，我们通常会使用第三方库。 **此时可以根据第三方库的 Error 来定制 code**

### message

**表示 human-readable 的错误信息，但不一定代表它可以展示在前端。这里的 human 代表的是开发人员，而非用户**，如以下两个 message 就不适宜展示在前端

1. connect ECONNREFUSED postgres.xiange.tech. 不需要把数据库断连的消息展示在前端
1. email is required. 输入数据校验，虽然可以展示给用户，但是需要展示中文 (国际化)

**你可以根据 code，来决定前端是否可以展示后端期待它展示的信息，而在前端也可以根据 code 来进行全局集中处理**

### info

表示一些针对 code 的更为详细的信息

+ 当发送请求失败的时候，你至少得知道失败的这个请求长什么样子: method，params/body 以及 headers
+ 当用户输入数据校验失败时，至少得知道是那几个字段

### originalError

originalError 表示由该异常引发的错误 API，它往往会包含更加详细的上下文信息

`originalError.stack` 表示当前错误的堆栈，当异常发生时可以快速定位问题发生的位置 (虽然 node 有时候抛出的堆栈信息都是自己从未见过的文件)

当在开发和测试环境时，把 originalError 附到 API 中可以快速定位问题， **当在生产环境时，不要把你的 originalError 也放到 API 里**，你可以在监控系统中找到完整的错误信息

**你可以使用以下两个 API 来优化你的 `stacktrace`**

```typescript
Error.captureStackTrace(error, constructorOpt)
Error.prepareStackTrace(error, structuredStackTrace)
```

具体使用方法可以参考 [v8 stack trace api](https://v8.dev/docs/stack-trace-api)

### data

代表该接口返回的数据。当 API 报错时 data 是不是应该返回为 `null`？

**不应该，当 API 报错时，可能只有部分字段有问题，剩余字段可以正常返回。** 由于 `graphql` 是由字段(field)聚合而成，这在 `graphql` 中体现地非常明显。

### http status

当API处理过程中发生错误时，应该返回 400+ 的 status code

+ HTTP/1.1 400 Bad Request
+ HTTP/1.1 401 Unauthorized
+ HTTP/1.1 403 Forbidden
+ HTTP/1.1 429 Too Many Requests

## 过滤

在本地开发时，往往不需要把异常上报到 `Sentry`。`Sentry` 也提供了 hook 再上报之前对异常进行过滤

```typescript
beforeSend?(event: Event, hint?: EventHint): Promise<Event | null> | Event | null;
```

## 监控系统

监控首先需要有一个监控系统，我这里比较推荐 `Sentry`，具体如何部署可以参考我的上一篇文章：[如何部署 Sentry](https://shanyue.tech/post/sentry-docker-install/)。

你也可以直接在官方注册使用 SaaS 版本: [Sentry 付费](https://sentry.io/pricing/)。个人免费版每个月有 5K 的报错限额，也足够个人使用。

相比自建版本，使用 SaaS 免了一些运维的日常工作。最主要的是， **自建系统有功能限制**。

这里有关于 `Sentry` 的文档

##  指标

异常监控除了异常本身以外，还要采集更多一些的指标。

> 异常监控最重要的目标就是还原异常抛出场景

1. 异常级别: Fatel, Error 以及 Warn。这决定你周日收到报警邮件或报警短信是继续浪还是打开笔记本改 Bug。可以通过 code 来标记

    ```typescript
    const codeLevelMap = {
      ValidationError: 'warn',
      DatabaseError: 'error'
    }
    ```
1. 环境: 生产环境还是测试环境，早于用户及测试发现问题，可以直接读取应用服务的环境变量
1. 上下文: 如哪一条 API 请求，哪一个用户，以及更详细的 http 报文信息。可以直接利用 Sentry 的API上报上下文信息

    ```typescript
    Sentry.configureScope(scope => {
      scope.addEventProcessor(event => Sentry.Handlers.parseRequest(event, ctx.request))
    })
    ```
1. 用户: API 错误是由那个用户触发的
1. code: 便于对错误进行分类
1. request_id: 便于 tracing，也方便获取更多的调试信息：在 elk 中查找当前 API 执行的 SQL 语句

    ```typescript
    const requestId = ctx.header['x-request-id'] || Math.random().toString(36).substr(2, 9)
    Sentry.configureScope(scope => {
      scope.setTag('requestId', requestId)
    })
    ```

由上可见，对于采集指标的数据一般来源于两个方面，http 报文以及环境变量

