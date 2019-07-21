---
title: "hello, world 示例"
date: 2019-09-07

---

我们先写一个关于 `graphql.js` 的 `hello, world` 示例，并且围绕它展开对 `graphql` 的学习

``` javascript
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql')

// schema，由 web 框架实现时，这部分放在后端里
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'hello, world'
        }
      }
    }
  })
})

// query，由 web 框架实现时，这部分放在前端里
const query = '{ hello }'

// 查询，这部分放在服务端里
graphql(schema, query).then(result => {
  // {
  //   data: { hello: "hello, world" }
  // }
  console.log(result)
})
```

由上，也可以看出 `graphql` 很关键的两个要素：`schema` 和 `query`。而当我们开发 web 应用时，`schema` 将会是服务端的主体，而 `query` 存在于前端中，类似 REST 中的 API。

