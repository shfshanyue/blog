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

![circular](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210619/circular.1urtfrtgm1og.png)

## 更快的序列化

+ [fast-json-stringify](https://github.com/fastify/fast-json-stringify): 2x faster than JSON.stringify()

``` js
// stringify 函数根据 schema 自动生成
const stringify = (user) {
  return `{
    "id": ${user.id},
    "name": "${user.name}",
    "location": "${user.location}",
    "isOnline": ${user.isOnline}
  }`
}

stringify(user)
```

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