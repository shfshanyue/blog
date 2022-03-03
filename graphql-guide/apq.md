# 利用 hash/query 键值对优化网络性能 (APQ)

在 `apollo-server` 中，这种技术叫 `APQ(Automatic persisted queries)`。

``` javascript
const queryHashCache = {
  'a8cba0': `{ user { id, phone } }`,
  '8adc8a': `{ todos { id, name } }`
}
```

![Apollo APQ](https://www.apollographql.com/docs/apollo-server/d500b543a6ad2a7d64ed7f190d40bd8c/persistedQueries.newPath.png)

``` bash
$ curl --get http://localhost:4000/graphql \
  --data-urlencode 'query={__typename}' \
  --data-urlencode 'extensions={"persistedQuery":{"version":1,"sha256Hash":"ecf4edb46db40b5132295c0291d62fb65d6759a9eedfa4d5d612dd5ec54a6b38"}}'
```

``` bash
curl  --get http://localhost:4000/graphql \
  --data-urlencode 'extensions={"persistedQuery":{"version":1,"sha256Hash":"ecf4edb46db40b5132295c0291d62fb65d6759a9eedfa4d5d612dd5ec54a6b38"}}'    ``
```

## 前端 APQ

## APQ 与 缓存

## APQ 与 service worker

## APQ 与 cors

