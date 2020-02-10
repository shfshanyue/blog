# 由 GraphQL 来思考 API Design

目前我已经写了一年多 QraphQL，也时常思考和 Rest API 的不同，以及对 API Design 的启发。

> 他山之石可以攻玉。

GraphQL 一些天然的设计或者思想对写 Rest API 有很大的借鉴或参考意义。

这里总结下一些受启发的 API 设计规范。

<!--more-->

如果你对 GraphQL 不熟悉，可以先通读 [GraphQL 中文文档](http://graphql.cn/learn/)

## 对所有的资源返回 id

在 graphql 中，scalar 类型 `ID` 用来表示资源的全局唯一性。在 `apollo-client` 中也建议客户端每次请求都把 id 带上。

在响应中带上 id 至少有两个好处

1. 客户端对资源的缓存
2. 在数据上游至客户端的整个链路中有利于数据的溯源

## 按需加载资源的字段

```graphql
query TODO {
  todo (id: 10) {
    id 
    name
    status
  }
}
```

如客户端只需要显示某个 TODO 的状态以及名称，则只需要返回 name 以及 status 字段，大大减少了网络的流量。

另外， **graphql server 需要在数据库层面也对字段做按需加载。否则，graphql server 与 database 之间也会造成无用的数据 IO 与流量浪费。**

> 获取 graphql query 所请求的字段，需要手动解析 GraphQLFieldResolveFn 函数的第四个字段 info，并在每一个 field 上自定义一个 directive 标注 Graphql Filed 与 Database Field 的关系

在 Rest API 中可以使用额外字段做按需加载。 **如使用 fields 标记返回需要的字段，若无此字段，默认返回资源的全部字段，在中间件中对 fields 做结构化处理**

```javascript
// 请求 Todo:10，并且只需要 id,name,status 三个字符安
'/api/todos/10?fields=id,name,status'

// 请求 Todo:10 全部资源
'/api/todos/10'
```

## 关联资源使用嵌套对象表示

这个请求表示一个用户列表，每个用户需要展示最后一个 Todo 的名称。Todo 需要使用嵌套对象来表示。

```graphql
query USERS {
  users {
    id
    name
    lastTodo {
      id
      name
    }
  }
}
```

在 Rest API 设计中经常见到所有数据进行了展开，不仅无法定位资源，也不好扩展数据。嵌套数据可以很灵活的扩展数据，另外也可以对嵌套数据进行按需加载

```javascript
const res0 = {
  users: [{
    id: 1,
    name: "山月",
    todoName: "学习"
  }]
}

// 修改后
const todoFields = {}
const res = {
  users: [{
    id: 1,
    name: "山月",
    todo: {
      id: 1,
      name: "学习",
      ...fields
    }
  }]
}

// 可以这样设计 API
const api = '/api/users?fields=id,name,todo.id,todo.name'
```

## 使用 ISOString 表示时间戳

在 graphql 中，虽没有一个 scalar 类型来表示时间戳，不过可以自定义 scalar DateTime 来表示时间。关于时间的格式

> 参考 StackOverflow 上的问题 [the-right-json-date-format](https://stackoverflow.com/questions/10286204/the-right-json-date-format)

```javascript
const date = new Date()

// 从 toJSON 的输出就知道前后端交互需要使用什么格式了
date.toJSON()
// 2019-03-14T07:41:08.500Z
date.toISOString()
// 2019-03-14T07:41:08.500Z
```

这样返回的格式不仅符合规范，而且可读性也比较好。

我见过API中返回的时间戳表示为 unix timestamp，js timestamp, iso8601 三种格式，较为混乱。统一的数据格式有利于前后端的联调，不过这也得益于 graphql 的强类型 schema。

## 结构化的错误信息

在 graphql 中会返回 `{ data, errors }` 的数据结构，可以在最后结构化错误信息为

```json
{
  "code": "InvalidToken",
  "message": "Token 失效",
  "httpStatus": 401
}
```

`message` 为可读性的错误信息，可以由前端直接显示，`code` 为调试用，`httpStatus` 由下一步的中间件捕捉，设置状态码。

> 在结构化错误信息后，可以顺带把错误信息发送到报警系统 (如 Sentry)。不过需要分清 WARN 与 ERROR，如 401，403 应当做 WARN 处理。

## 符合标准的 http status

恩，好吧。graphql 这条有缺陷。graphql 的 `Query` 与 `Mutation` 都是使用 `POST` 请求。对不同的执行成功的 `Mutation` 返回不同的 200，201，202 还是比较麻烦。

不过对于错误返回不同的状态码， **打开 devtool 一眼可以看到红色的 4XX 信息，也对快速定位错误请求有帮助，稍微减少了些烦躁心。**

介绍几种常见的4xx状态码

+ 401 Unauthorized: 用户未登录请求需要登录才能请求的资源
+ 403 Forbidden: 用户A登录了，但他却想请求 B 的资源
+ 400 Bad Request: 恩，我把所有找不到状态码的错误都放到了 400

> 关于400参考 [400 BAD request HTTP error code meaning?](https://stackoverflow.com/questions/19671317/400-bad-request-http-error-code-meaning)
> 这里有一篇文章，[关于4xx状态码的选择](https://www.codetinkerer.com/2015/12/04/choosing-an-http-status-code.html)，取一张图出来

![如何选择http错误状态码](https://www.codetinkerer.com/assets/choosing-an-http-status-code/http-4xx-status-codes.png)

## 请求及响应数据校验

由于 graphql 的强类型 schema，也省了数据输入输出的校验。

对于 Rest API，可以使用 JSON Schema 来校验数据格式。node 也可以使用 [joi](https://github.com/hapijs/joi) 做数据校验。

> 这里放一份 JSON Schema 的文档：http://json-schema.org/

## 注释文档化

得益于 graphql 的 introspection 与强类型的 schema。graphql 可以根据源码以及注释自动生成文档，直接使用 graphiql 或者 graphql playground 上查看。

如果你使用 node.js 来写服务器应用，可以使用 [apiDoc](https://github.com/apidoc/apidoc)

另外，注意不要把文档暴露到生产环境，graphql 需要在生产环境中关掉 introspection。
