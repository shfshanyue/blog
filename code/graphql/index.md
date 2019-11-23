---
title: graphql.js 源码解析
date: 2019-08-24 10:00

---

`graphql.js` 可以视作由两大部分组成

1. `query`，可以视作 rest 中的 API，它可以与客户端相结合，提供查询语句
1. `schema`，可以视作 rest 中对应 API 的逻辑层，它可以与服务端相结合，根据查询语句提供结果

以下是一个简单的 `hello, world` 的示例

```javascript
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql')

// schema，由 web 框架实现时，这部分放在服务器端里
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world'
        }
      }
    }
  })
})

// query，由 web 框架实现时，这部分放在客户端里
const query = '{ hello }'

// 查询，这部分放在服务端里
graphql(schema, query).then(result => {
  // {
  //   data: { hello: "world" }
  // }
  console.log(result)
})
```

在这里分析一下以上简单代码的源码解析

## 
