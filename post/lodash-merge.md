# 如何实现类似 lodash.merge 的函数

## merge

`merge` 用来递归合并对象，相当于深层的 `Object.assign`。在 `graphql` 中会广泛用到 `merge`，如会经常使用 `merge` 来合并所有的 `resolver`，特别是 `Mutation` 如下示例

```javascript
const rootResolver = {
  Query: {
  
  },
  Mutation: {
    login () {}
  }
}

const userResolver = {
  User: {
    createUser() {}
  }
}

const resolver = merge(rootResolver, userResolver)
// output
// {
//   Query: {},
//   Mutation: {
//     login () {},
//     createUser () {}
//   }
// }
```

另外，在前端进行 graphql 的查询时也经常需要使用到 `merge`。如在进行页面的性能优化时，为了避免一个 Query 耗时过久，页面渲染过于耗时，会拆成两个 Query，先渲染响应快的数据，在慢慢等待个别响应慢的数据。

以下是一个关于个人主页信息的 Query，但是其中有一个字段 `dataNeedDelay3s` 会在服务器耗时许久，会因为此字段加大了用户的等待时间，造成不友好的用户体验。此时会把此字段单独拆掉，优先渲染其它个人信息。

```graphql
query PROFILE {
  me {
    id
    age
    name
    # 需要耗时3s的字段
    dataNeedDelay3s
  }
}

# 拆为以下两个茶轩
query PROFILE_ONE {
  me {
    id
    age
    name
  }
}

query PROFILE_TWO {
  me {
    dataNeedDelay3s
  }
}
```

此时就有 `merge` 的需求，查询完成后把两次查询结果给拼到一起。

关于拆 graphql 的 Query 的需求无处不在，如在服务端渲染时，需要把权限资源与非权限资源分开。

这里讲述下如何实现 `merge`

```javascript
function isObject (value) {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

// { a: [{ b: 2 }] } { a: [{ c: 2 }]} -> { a: [{b:2}, {c:2}]}
// merge({o: {a: 3}}, {o: {b:4}}) => {o: {a:3, b:4}}
function merge (source, other) {
  if (!isObject(source) || !isObject(other)) {
    return other === undefined ? source : other
  }
  // 合并两个对象的 key，另外要区分数组的初始值为 []
  return Object.keys({
    ...source,
    ...other
  }).reduce((acc, key) => {
    // 递归合并 value
    acc[key] = merge(source[key], other[key])
    return acc
  }, Array.isArray(source) ? [] : {})
}
```
