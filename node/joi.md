date: 2020-08-26 21:50

---

# Node 应用中的 Controller 层如何进行数据类型校验

幽默风趣的后端程序员一般自嘲为 CURD Boy。CURD, 也就是对某一存储资源的增删改查，这完全是面向数据编程啊。

真好呀，面向数据编程，往往会对业务理解地更加透彻，从而写出更高质量的代码，造出更少的 BUG。既然是面向数据编程那更需要避免脏数据的出现，加强数据校验。否则，难道要相信前端的数据校验吗，毕竟前端数据校验直达用户，是为了 UI 层更友好的用户反馈。

## 数据校验层

后端由于重业务逻辑以及待处理各种数据，以致于分成各种各样的层级，以我经历过的后端项目就有分为 `Controller`、`Service`、`Model`、`Helper`、`Entity` 等各种命名的层，五花八门。但这里肯定有一个层称为 `Controller`，站在后端最上层直接接收客户端传输数据。

由于 `Controller` 层是服务器端中与客户端数据交互的最顶层，秉承着 `Fail Fast` 的原则，肩负着数据过滤器的功能，对于不合法数据直接打回去，如同秦琼与尉迟恭门神般威严。

数据校验同时衍生了一个半文档化的副产品，你只需要看一眼数据校验层，便知道要传哪些字段，都是些什么格式。

以下都是常见的数据校验，本文讲述如何对它们进行校验：

1. required/optional
1. 基本的数据校验，如 number、string、timestamp 及值需要满足的条件
1. 复杂的数据校验，如 IP、手机号、邮箱与域名 

``` js
const body = {
  id,
  name,
  mobilePhone,
  email
}
```

山月接触过一个没有数据校验层的后端项目，`if/else` 充斥在各种层级，万分痛苦，分分钟向重构。

## JSON Schema

`JSON Schema` 基于 JSON 进行数据校验格式，并附有一份规范 [json-schema.org](http://json-schema.org/)，目前 (2020-08) 最新版本是 7.0。各种服务器编程语言都对规范进行了实现，如 `go`、`java`、`php` 等，当然伟大的 javascript 也有，如不温不火的 [ajv](https://github.com/ajv-validator/ajv)。

以下是校验用户信息的一个 Schema，可见语法复杂与繁琐:

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
  "required": ["id", "name"]
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

对于不在内置 Format 中的手机号，使用 `ajv.addFormat` 可手动添加 Format

``` js
ajv.addFormat('mobilePhone', (str) => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(str));
```

## Joi

[joi](https://github.com/sideway/joi) 自称最强大的 JS 校验库，在 github 也斩获了一万六颗星星。相比 JSON Schema 而言，它的语法更加简洁并且功能强大。

> The most powerful data validation library for JS

完成相同的校验，仅需要更少的代码，并能够完成更加强大的校验。以下仅做示例，更多示例请前往文档。

``` js
const schema = Joi.object({
  id: Joi.number().required(),
  name: Joi.number().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  mobilePhone: Joi.string().pattern(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/),

  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
  // 与 password 相同的校验
  repeatPassword: Joi.ref('password'),
})
  // 密码与重复密码需要同时发送
  .with('password', 'repeat_password');
  // 邮箱与手机号提供一个即可
  .xor('email', 'mobilePhone')
```

## 数据校验与路由层集成

由于数据直接从路由传递，因此 `koajs` 官方基于 `joi` 实现了一个 [joi-router](https://github.com/koajs/joi-router)，前置数据校验到路由层，对前端传递来的 `query`、`body` 与 `params` 进行校验。

`joi-router` 也同时基于 `co-body` 对前端传输的各种 `content-type` 进行解析及限制。如限制为 `application/json`，也可在一定程度上防止 CSRF 攻击。

``` js
const router = require('koa-joi-router');
const public = router();

public.route({
  method: 'post',
  path: '/signup',
  validate: {
    header: joiObject,
    query: joiObject,
    params: joiObject,
    body: joiObject,
    maxBody: '64kb',
    output: { '400-600': { body: joiObject } },
    type: 'json',
    failure: 400,
    continueOnError: false
  },
  pre: async (ctx, next) => {
    await checkAuth(ctx);
    return next();
  },
  handler: async (ctx) => {
    await createUser(ctx.request.body);
    ctx.status = 201;
  },
});
```

## 正则表达式与安全正则表达式

山月在一次排查性能问题时发现，一条 API 竟在数据校验层耗时过久，这是我未曾想到的。而问题根源在于不安全的正则表达式，那什么叫做不安全的正则表达式呢？

比如下边这个能把 CPU 跑挂的正则表达式就是一个定时炸弹，回溯次数进入了指数爆炸般的增长。

> 可以参考文章 [浅析 ReDos 原理与实践](https://www.freebuf.com/articles/network/124422.html)

``` js
const safe = require('safe-regex')
const re = /(x+x+)+y/

// 能跑死 CPU 的一个正则
re.test('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')

// 使用 safe-regex 判断正则是否安全
safe(re)   // false
```

数据校验，针对的大多是字符串校验，也会充斥着各种各样的正则表达式，保证正则表达式的安全相当紧要。[safe-regex](https://github.com/substack/safe-regex) 能够发现哪些不安全的正则表达式。

## 总结

1. Controller 层需要进行统一的数据校验，可以采用 JSON Schema (Node 实现 ajv) 与 Joi
1. JSON Schema 有官方规范及各个语言的实现，但语法繁琐，可使用校验功能更为强大的 Joi
1. 进行字符串校验时，注意不安全的正则引起的性能问题
