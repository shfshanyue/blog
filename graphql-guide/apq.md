
## 利用 hash/query 键值对优化网络性能 (APQ)

在 `apollo-server` 中，这种技术叫 `APQ(Automatic persisted queries)`。

``` javascript
const queryMap = {
  'hash1': `{ user { id, phone } }`,
  'hash2': `{ todos { id, name } }`
}
```

![Apollo APQ](https://www.apollographql.com/docs/apollo-server/d500b543a6ad2a7d64ed7f190d40bd8c/persistedQueries.newPath.png)

### 前端 APQ

### APQ 与 缓存

### APQ 与 service worker

### APQ 与 cors

