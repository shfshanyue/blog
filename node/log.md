# Node 中如何更好地打日志

在服务器应用中，完善并结构化的日志不仅可以更好地帮助定位问题及复现，也能够发现性能问题的端倪，甚至能够帮忙用来解决线上 CPU 及内存爆掉的问题。

本篇文章将讲解如何使用 Node 在服务端更好地打日志

+ 哪里应该打日志: AccessLog、SQLLog、BusinessLog
+ 应该打什么日志: server_name、timestamp 以及相关类型日志
+ 用什么去打日志: winston、log4j、bunyan

产生日志后，将在下一章讲解日志的收集处理及检索

## 日志类型

在一个服务器应用中，或作为生产者，或作为消费者，需要与各方数据进行交互。除了最常见的与客户端交互外，还有数据库、缓存、消息队列、第三方服务。对于重要的数据交互需要打日志记录。

除了外界交互外，自身产生的异常信息、关键业务逻辑及定时任务信息，也需要打日志。

以下简述需要打日志的类型及涉及字段

+ `AccessLog`: 这是最常见的日志类型，一般在 `nginx` 等方向代理中也有日志记录，但在业务系统中有时需要更详细的日志记录，如 API 耗时，详细的 request body 与 response body
+ `SQLLog`: 关于数据库查询的日志，记录 SQL、涉及到的 table、以及执行时间，**从此可以筛选出执行过慢的SQL，也可以筛选出某条API对应的SQL条数**
+ `Exception`: 异常
+ `redis`: 缓存，也有一些非缓存的操作如 `zset` 及分布式锁等
+ `message queue`: 记录生产消息及消费消息的日志
+ `cron`: 记录定时任务执行的时间以及是否成功
+ 关键业务逻辑

## 日志的基本字段

对于所有的日志，都会有一些共用的基本字段，如在那台服务器，在那个点产生的日志

### server_name

**即服务器的 `hostname`**，通过它很容易定位到出问题的服务器/容器。

现已有相当多公司的生产环境应用使用 `kubernetes` 进行编排，而在 `k8s` 中每个 POD 的 `hostname` 如下所示，因此很容易定位到

1. `Deployment`: 哪一个应用/项目
1. `ReplicaSet`: 哪一次上线
1. `Pod`: 哪一个 Pod

``` bash
# shanyue-production 指 Deployment name
# 69d9884864 指某次升级时 ReplicaSet 对应的 hash
# vt22t 指某个 Pod 对应的 hash
$ hostname
shanyue-production-69d9884864-vt22t
```

### timestamp

**即该条日志产生的时间**，使用如下格式有更好的人可读性与机器可读性

``` json
{
  "timestamp": "2020-04-24T04:50:57.651Z",
}
```

### requestId/traceId

**及全链路式日志中的唯一id**，通过 `requestId`，可以把相关的微服务同一条日志链接起来、包括前端、后端、上游微服务、数据库及 redis

全链路式日志平台可以更好地分析一条请求在各个微服务的生命周期，目前流行的有以下几种，以下使他们的官网介绍

+ [zipkin](https://zipkin.io/): Zipkin is a distributed tracing system. It helps gather timing data needed to troubleshoot latency problems in service architectures. Features include both the collection and lookup of this data.
+ [jaeger](https://www.jaegertracing.io/): open source, end-to-end distributed tracing

### userId

**即用户信息**，当然有的服务可能没有用户信息，这个要视后端服务的性质而定。当用户未登录时，以 -1 替代，方便索引。

``` json
{
  "userId": 10086,
  // 当用户在未状态时，以 -1 替代
  "userId": -1,
}
```

## Node 中如何打日志

[winston](https://github.com/winstonjs/winston) 是 Node 中最为流行的日志工具，支持各种各样的 `Transport`，能够让你定义各种存储位置及日志格式

### winston 与日志结构化

``` js
import winston, { format } from 'winston'
import os from 'os'
import { session } from './session'

const requestId = format((info) => {
  info.requestId = session.get('requestId')
  return info
})

function createLogger (label: string) {
  return winston.createLogger({
    defaultMeta: {
      serverName: os.hostname(),
      label
    },
    format: format.combine(
      format.timestamp(),
      requestId(),
      format.json()
    ),
    transports: [
      new winston.transports.File({
        dirname: './logs',
        filename: `${label}.log`,
      })
    ]
  })
}
```

``` js
const accessLogger = createLogger('access')

accessLogger.log()
```

### 


### AccessLog

## 数据库日志

## 过滤掉无用日志

+ PING
+ OPTIONS

