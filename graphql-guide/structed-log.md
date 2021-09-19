## 结构化日志

在一个健壮的项目中，日志是必不可少的。而格式化的日志更有助于我们快速检索日志，更快的找到性能瓶颈，更快的解决线上故障。

如果在 nodejs 环境中，推荐 [winston](https://github.com/winstonjs/winston) 作为日志库

### level

在所有关于日志的组件/函数库中都会有 level 的属性。它表示日志的紧急程度。一般会分为以下几个等级

+ `error`: 线上第一时间需要解决的问题
+ `warn`: 预料中的问题，如登录失败，数据库唯一性检查没有通过
+ `info`: 一些辅助信息，如 sql，request，response 
+ `log`
+ `debug`

在平常使用中，还是 `error`，`warn`，`info` 三者较多。另外，`error` 与 `warn` 一般会接入异常监控系统，如 Sentry

``` javascript
const winston = require('winston')

const logger = createLogger()

logger.info('hello, world');
logger.warn('hello, warn');
logger.error('hello, error');
```

### label

日志会在不同的地方产生，如 db，redis，function，request, response。在不同地方产生的日志，则含有不同的信息

如在数据库产生的日志会有以下信息

``` javascript
{
  label: 'db',
  sql: 'select * from todo',
  timing: 180,
  tables: ['todo'],
  type: 'SELECT',
  timestamp: '2019-09-13T12:55:16.061Z',
  requestId: '1a83de48-6b80-4558-a587-5be4c87449c2'
}
```

如在一个 graphql 的 query 中产生的日志会有以下信息

``` javascript
{
  label: 'query',
  query: 'query TODOS { todos { id, title } }',
  operationName: 'TODOS'
  variables: {},
  user: {
    id: 10086, 
    role: 'ADMIN'
  },
  ip: '::1',
  timestamp: '2019-09-13T12:55:16.061Z',
  requestId: '1a83de48-6b80-4558-a587-5be4c87449c2'
}
```

### 生成结构化与易读的日志

一般来说，关于日志

1. 生产环境的日志需要 `machine readable`，使用 json 进行数据结构化，方便在 ELK 或其它日志系统进行检索
1. 本地环境的日志需要 `human readable`，方便开发人员在本地开发时阅读

那如何设计一个简单的 logger，既能够 `machine readable`，又 `human readable` 呢

1. 把日志存储为 jsonl 格式文件，即每行都是一个 json，来满足 `machine readable`
1. 使用 `jq` 来做 `human readable`，可以对日志进行筛选，并展示所需字段

``` javascript
// 把日志存储使用 jsonl 格式存到文件中
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      dirname: './logs',
      filename: `db.log`,
    })
  ]
})
```

``` shell
$ tail -f -n 2 logs/db.log | jq '{ message, requestId }'
{
  "message": "Executing (default): SELECT \"id\", \"name\" FROM \"todo\" AS \"Todo\";",
  "requestId": "4ab7525d-dbae-4243-b833-490a9b7268b5"
}
{
  "message": "Executing (default): SELECT \"id\" FROM \"todo\" AS \"Todo\";",
  "requestId": "390b158b-23aa-443d-9dc9-03abfc56e750"
}
```
