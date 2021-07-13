# Stringify: Node 服务端序列化及反序列化优化

> https://github.com/fastify/fastify/blob/main/docs/Validation-and-Serialization.md
fast-json-stringify
https://npm.devtool.tech/json-stringify-safe

## 序列化

``` js
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const data = JSON.stringify({ username: '山月' })
  res.end(data)
})
```

## 环形嵌套与序列化

``` js
const user = { name: '山月' }
const user._user = user

JSON.stringify(user)
```

![circular](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210619/circular.1urtfrtgm1og.png)

## 更快的序列化

+ [fast-json-stringify](https://github.com/fastify/fast-json-stringify): 2x faster than JSON.stringify()

``` js

```

## 再快一点的序列化

+ [slow-json-stringify]

## protobuf