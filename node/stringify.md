# Stringify: Node 服务端序列化及反序列化优化

> https://github.com/fastify/fastify/blob/main/docs/Validation-and-Serialization.md
fast-json-stringify
https://npm.devtool.tech/json-stringify-safe

## 序列化

``` js
const user = {
  id: 10086,
  name: 'shanyue',
  location: '山西省临汾市洪洞县',
  isOnline: false
}
```

在服务端向客户端发送数据时，需要把梳理好的 Object 序列化为可在 http 中传输的数据，如文本数据。因此，在服务端的末尾一般是进行序列化。

在 Node 中借用 `JSON.stringify` 进行数据模型的序列化操作。

``` js
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const data = JSON.stringify(user)
  res.end(data)
})
```

## 环形嵌套与序列化

``` js
const user = { id: 10086, name: '山月' }
const user._user = user

JSON.stringify(user)
```

在服务端进行数据处理时，如果不小心混入了环形嵌套数据，则会构成序列化失败，造成意外情况，发生异常。

![circular](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210619/circular.1urtfrtgm1og.png)

在实际生产环境中发生这种问题的概率极小，因为对于数据库中 ORM 而言，他们有专门的 `toJSON()` 进行序列化处理。

即使出现嵌套数据，嵌套数据也会通过 `defineProperty` 定义 `enumerable: false` 使它不可枚举，而 `JSON.stringify` 会跳过不可枚举数据进行序列化。

## 更快的序列化

如果对一个对象进行序列化，那么它的时间复杂多是多少呢？

``` js
const stringify = (user) => {
  return `{
    "id": ${user.id},
    "name": "${user.name}",
    "location": "${user.location}",
    "isOnline": ${user.isOnline}
  }`
}

stringify(user)
```

+ [fast-json-stringify](https://github.com/fastify/fast-json-stringify): 2x faster than JSON.stringify()



`JSON Schema` 是基于 JSON 的 Schema，对 JSON 进行数据规范化及校验，并附有一份规范 [json-schema.org](http://json-schema.org/)。

``` json
{
  "title": "User",
  "description": "用户信息",
  "type": "object",
  "properties": {
    "id": {
      "description": "用户 ID",
      "type": "integer"
    },
    "name": {
      "description": "用户姓名",
      "type": "string",
      "maxLength": 20
    },
    "location": {
      "description": "用户地址",
      "type": "string",
      "maxLength": 30
    },
    "isOnline": {
      "description": "用户是否在线",
      "type": "boolean"
    }
  },
  "required": ["id", "name"]
}
```

``` js
const stringify = (user) {
  return `{
    "id": ${verifyInteger(user.id)},
    "name": "${verifyString(user.name)}",
    "location": "${verifyString(user.location)}",
    "isOnline": ${verifyBool(user.isOnline)}
  }`
}
```

## 再快一点的序列化

+ [slow-json-stringify](https://github.com/lucagez/slow-json-stringify)

源码就不解析了

## protobuf