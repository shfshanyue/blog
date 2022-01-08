# 接口联调那点小事

## 一个需求、一份表单

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-05/clipboard-3484.7baea3.webp)

有一天，产品甩过来一个新的需求: 山月呀，**你对数据库中的用户完善用户姓名、用户邮箱、用户手机号，其中手机号必填**。

那前后端分工合作，如何完成这样的一个表单的需求呢？

可以看看经典的前后端合作的工作流模式:

前端表单设计 -> 客户端校验数据(更人性化的提示) -> API 请求 -> 服务端校验数据(更强壮的逻辑) -> 数据库

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-05/form.7fe5a5.webp)

**我们在整个工作流中以数据校验的角度来看待这个问题**，以避免最终在数据库中出现脏数据。我们根据产品要求，总结出几点校验的要求。

1. 姓名必须是字符串
1. 邮箱必须是邮箱格式
1. 手机号必须是手机号格式
1. 手机号必填，其它选填

以下是一份用以交互的示例数据

``` js
{
  id: 10086,
  name: 'shanyue',
  mobilePhone: '18367891234',
  email: 'me@shanyue.tech'
}
```

## 客户端数据校验

在客户端进行数据校验，有两方面因素的考虑

1. 更人性化的用户体验设计，当用户校验失误后，拥有更好的提示文案
1. 提前预警，节省服务器资源

使用一段 JSX 的伪代码进行数据校验

``` jsx {4-8}
const mobilePhoneRegexp = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/

const form = <Form>
  <Form.Item
    name="mobilePhone"
    rules={[{
      required: true,
      message: '您输入的手机号格式不正确'
    }]}
    pattern={mobilePhoneRegexp}
  >
    <Input />
  </Form.Item>
</Form>
```

大家都知道，**前端的数据校验属于防君子不防小人。** 属于想绕过就能绕过的类型。

![client side validation](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/image.png)

而真正的数据校验在服务器端！

## 服务端数据校验

后端由于重业务逻辑以及待处理各种数据，以致于分成各种各样的层级，其中有一层称为 `Controller`，站在后端最上层直接接收客户端经 HTTP 传输的数据。

由于 `Controller` 层是服务器端中与客户端数据交互的最顶层，秉承着 `Fail Fast` 的原则，肩负着数据过滤器的功能，对于不合法数据直接打回去，如同秦琼与尉迟恭门神般威严。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-05/clipboard-3000.0a5525.webp)

我们看一段后端进行数据校验的一段伪代码

``` js
const mobilePhoneRegexp = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
const schema = Schema.object({
  id: Schema.number().required(),
  name: Schema.number().required(),
  email: Schema.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] }
  }),
  mobilePhone: Joi.string().pattern(mobilePhoneRegexp),
})
```

## 统一的校验逻辑: JSON Schema

从上述前端和后端校验的伪代码中，可以看出二者的校验规则虽然一致，但是写法大不相同，那**有没有一种统一的 Schema 即可作用于前端，又可作用于后端**。

有，这就是 JSON Schema。

`JSON Schema` 基于 JSON 进行数据校验格式，并附有一份规范 [json-schema.org](http://json-schema.org/)，各种服务器编程语言都对规范进行了实现，如 `go`、`java`、`php` 等。

以下是校验用户信息的一个 Schema 示例:

``` json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
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
      "type": "string"
    },
    "email": {
      "description": "用户邮箱",
      "type": "string",
      "format": "email",
      "maxLength": 20
    },
    "mobilePhone": {
      "description": "用户手机号",
      "type": "string",
      "pattern": "^(?:(?:\+|00)86)?1[3-9]\d{9}$",
      "maxLength": 15
    }
  },
  "required": ["id", "mobilePhone"]
}
```

对于复杂的数据类型校验，JSON Schema 内置了以下 Format，方便快捷校验

+ Dates and times
+ Email addresses
+ Hostnames
+ IP Addresses
+ Resource identifiers
+ URI template
+ JSON Pointer
+ Regular Expressions

值得一提的是 Node 中号称最快的框架 [fastify](https://www.fastify.io/) 内置 JSON Schema 实现输入(Request)输出(Response)数据的类型校验。

在前端中可以使用 [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form) 通过 JSON Schema 进行数据校验，而在后端关于 JSON Schema 的工具更是数不胜数，比如 nodejs 的 [ajv](https://github.com/ajv-validator/ajv)。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-05/clipboard-8340.bd853b.webp)

## JSON Schema 在 API 自动化测试中的应用

在进行写操作时，为了防止数据库进入脏数据需要进行数据校验。

而在进行读操作时，为了检验 API 接口的正确性，一般也会以 JSON Schema 进行校验。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-05/json-schema.fa1e9f.webp)

在 `postman` 的 Tests 面板**以写脚本的方式通过 JSON Schema 进行校验**。而它使用 [tv4](https://github.com/geraintluff/tv4) 校验 JSON Schema。

1. `pm.response.json()` 用以获取 Response Body
1. `tv4.validate(jsonData, schema)` 用以校验 JSON Schema

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-05/clipboard-9436.e8c2b4.webp)

## 更友好的 JSON Schema 可视化校验: Apifox

在 `postman` 中，可以通过 `JSON Schema` 进行数据校验，然而一个缺点是仍然写脚本。

如果把 JSON Schema 进行可视化编辑，那对于用户体验，特别是对于不喜欢写脚本的同学，岂不是提高了一大截。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-07/clipboard-3615.50d0cb.webp)

比如在 [ApiFox](https://www.apifox.cn/)，一款国人开发的接口调试利器，通过可视化编辑校验规则来进行数据校验，当然它也可以通过写脚本来进行测试。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-05/clipboard-1896.b21706.webp)

最后推荐一款 JSON Schema 可视化编辑器的 React 组件。

[JSON Schema Editor](https://github.com/Open-Federation/json-schema-editor-visual)

## 总结

使用 JSON 不仅可以针对前后端进行数据校验，甚至还可以对 API 进行自动化测试。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-05/clipboard-9436.e8c2b4.webp)
