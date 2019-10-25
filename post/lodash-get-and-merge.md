---
title: 如何实现类似 lodash 的 get 与 merge 函数
date: 2019-05-13
tags:
  - javascript
  - graphql
categories:
  - 前端
  - 后端
---

`lodash` 基本上成为了写 javascript 工具库的标配，它广泛应用在各种服务端以及前端应用中，但是它的包体积略大了一些。对于服务端来说，包的体积并不是十分的重要，或者换句话说，不像前端那样对包的体积特别敏感，一分一毫都会影响页面打开的性能，从而影响用户体验。

正因为前端包体积对于用户体验的重要性，因此有各种各样减小包体积的方法。针对 `lodash` 来说，你完全不必要引入 `lodash` 的所有工具函数，你只需要按需引入或者直接使用单函数包。关于按需引入你可以参考以下文章

> [Lessons on tree-shaking Lodash with Webpack and Babel](https://www.azavea.com/blog/2019/03/07/lessons-on-tree-shaking-lodash/)

在针对我的[个人站点](https://shici.xiange.tech)中的 `lodash` 进行优化时，如果没记错的话，`lodash` 从以前 gzip 后的 `80KB` 变为了 `20KB`，相对来说还是比较大。而当我全局搜索了 lodash 的引用之后，发现 90% 的场景都是在使用 `_.get`。

另外，随着 `ES6+` 的发展，以及浏览器与 Node 对它的支持，很多 `lodash` 的函数都很容易自己来实现或者说已被实现，如 `_.assign`，`_.trim`，`_.startsWith` 等等已被 ES6+ 实现，而 `_.uniq` 又很容易通过 `new Set()` 来解决。有人就在 github 上总结了 [you-dont-need/You-Dont-Need-Lodash-Underscore](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore)，其中囊括了很多工具函数很简易的实现。

<!--more-->

鉴于本站点就是我作为试验田用来实践各种技术，于是我决定自己来实现 `lodash` 的一些工具函数。`get` 与 `merge` 两个函数在我使用时比较多，且相对来说比较复杂一些，这里贴一下我的实现代码。

本文地址: <https://shanyue.tech/post/lodash-get-and-merge/>

## get

在 js 中经常会出现嵌套调用这种情况，如 `a.b.c.d.e`，但是这么写很容易抛出异常。你需要这么写 `a && a.b && a.b.c && a.b.c.d && a.b.c.d.e`，但是显得有些啰嗦与冗长了。特别是在 graphql 中，这种嵌套调用更是难以避免。

这时就需要一个 `get` 函数，使用 `get(a, 'b.c.d.e')` 简单清晰，并且容错性提高了很多。以下是需要通过的几个测试用例

```javascript
get({ a: null }, 'a.b.c', 3)
// output: 3

get({ a: undefined }, 'a', 3)
// output: 3

get({ a: null }, 'a', 3)
// output: 3

get({ a: [{ b: 1 }]}, 'a[0].b', 3)
// output: 1
```

`path` 中也可能是数组的路径，全部转化成 `.` 运算符并组成数组

```javascript
// a[3].b -> a.3.b
const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
```

然后层层迭代属性即可，另外注意 `null` 与 `undefined` 取属性会报错，所以使用 `Object` 包装一下。

```javascript
function get (source, path, defaultValue = undefined) {
  // a[3].b -> a.3.b
  const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let result = source
  for (const p of paths) {
    result = Object(result)[p]
    if (result === undefined) {
      return defaultValue
    }
  }
  return result
}
```


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
