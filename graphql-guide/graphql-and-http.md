---
title: graphql 与 http
date: 2019-09-08 22:00

---

`graphql` 仅仅提供了 schema 与 query 的用法，当我们在 web 中使用 `graphql` 时，就需要使用 `http` 把 `graphql` 隔离为 `client` 与 `server` 两端。想象一个流程：

1. 前端发送 query 到后端
1. 后端维护一个 schema
1. 后端根据前端的 query 对照自己的 schema，查询出数据返回给前端

### request/response

前端需要根据自己构造的 query 去后端请求数据，而一个 query 可以由以下几个元素构成，通过 get/post 传递数据。而目前流行的框架比如 [apollo-server](https://github.com/apollographql/apollo-server)，也是这样处理

+ query
+ operationName
+ variables

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

// 响应
const response = {
  data: {
    hello: 'hello, world' 
  },
  errors: null
}
```

