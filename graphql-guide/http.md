---
title: graphql 与 http
date: 2019-09-08 22:00

---

`graphql` 仅仅提供了 schema 与 operation/query 的用法，当我们在 web 中使用 `graphql` 时，就需要使用 `HTTP` 把 `graphql` 隔离为 `client` 与 `server` 两端。想象一个流程：

1. 前端发送 operation 到后端
1. 后端维护一个 schema
1. 后端根据前端的 operation 对照自己的 schema，查询出数据返回给前端

## Request

前端需要根据自己构造的 query 去后端请求数据，而一个 query 可以由以下几个元素构成，通过 get/post 传递数据。而目前流行的框架比如 [apollo-server](https://github.com/apollographql/apollo-server)，也是这样处理

+ query
+ operationName
+ variables

在客户端无需多余的库进行支持，仅仅按照以前的方式组织 Body 发送数据即可。当然为了更好的缓存及类型提示，在前端也可以使用 `apollo-client` 一些库协助进行 GraphQL 查询。

``` javascript
// url 统一入口，但可以使用 operationName 作为 querystring 方便 debug
const url = '/graphql?HELLO'

// 如果是 POST 请求，构造以下 body 数据
const body = {
  query: 'query HELLO { hello }',
  operationName: 'HELLO',
  variables: {}
}

// 如果是 GET 请求，构造 query string
const qs = querystring.encode(body)

// 向后端发送请求数据
const response = await fetch(url, {
  body
}).then(res => res.json())
// {
//   data: {
//     hello: 'hello, world' 
//   },
//   errors: null
// }
```

## Response: 一个简单的 GraphQL Server

对于 GraphQL 而言，前端仅仅是构造请求，而无需对 Query 进行解析，最重要的工作量放在服务端实现，如解析 GraphQL、执行 Operation 等。

我们在这里手动实现一个简单的 GraphQL Server。

``` js
import http from 'node:http'
import getRawBody from 'raw-body'
import { graphql } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'

class GraphQLServer {
  constructor ({ typeDefs, resolvers }) {
    this.schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })
  }

  callback () {
    return async (req, res) => {
      const buffer = await getRawBody(req)
      const {
        query,
        operationName,
        variables
      } = JSON.parse(buffer.toString())
      const result = await graphql({
        schema: this.schema,
        source: query,
        variableValues: variables,
        operationName
      })
      res.end(JSON.stringify(result))
    }
  }

  listen (...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

export default GraphQLServer
```

如此，我们在后端仅仅需要关注如何写好 Schema？

``` js
import GraphQLServer from './index.mjs'

const typeDefs = `
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`

const books = [
  {
    title: '三国演义',
    author: '施耐庵',
  },
  {
    title: '西游记',
    author: '罗贯中',
  },
]

const resolvers = {
  Query: {
    books: () => {
      return books
    }
  }
}

const app = new GraphQLServer({ typeDefs, resolvers })

app.listen(4000)
```
