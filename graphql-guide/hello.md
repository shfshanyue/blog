---
title: "hello, world 示例"
date: 2019-09-07

---

## hello, world

我们先写一个关于 `graphql.js` 的 `hello, world` 示例，并且围绕它展开对 `graphql` 的学习

``` javascript
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'


// `graphql.js` 可以视作由两大部分组成

// 1. `query`，可以视作 rest 中的 API，它可以与客户端相结合，提供查询语句
// 1. `schema`，可以视作 rest 中对应 API 的逻辑层，它可以与服务端相结合，根据查询语句提供结果

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'hello, shanyue'
        }
      }
    }
  })
})

const query = '{ hello }'

graphql({
  schema,
  source: query
}).then(result => {
  // { hello: "hello, shanyue" }
  console.log(result)
})
```

由上，也可以看出 `graphql` 很关键的两个要素：`schema` 和 `query`。而当我们开发 web 应用时，`schema` 将会是服务端的主体，而 `query` 存在于前端中，类似 REST 中的 API。

## Schema

``` js
import { graphql, buildSchema } from 'graphql'

const schema = buildSchema(`
  type Query {
    hello: String
  }
`)

const root = {
  hello (...args) {
    return 'hello, shanyue'
  }
}

const query = '{ hello }'

graphql({
  schema,
  source: query,
  rootValue: root
}).then((result) => {
  console.log(result)
})
```

## Schema With Resolvers

