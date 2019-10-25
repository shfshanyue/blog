---
title: 使用 Postman 做 API 自动化测试
description: Postman 最基本的功能用来重放请求，并且配合良好的 `response` 格式化工具。
keywords:
  - postman
  - 自动化测试
  - 工具
date: 2017-12-09
tags:
  - postman
categories:
  - 工具
---

Postman 最基本的功能用来重放请求，并且配合良好的 `response` 格式化工具。

高级点的用法可以使用 Postman 生成各个语言的脚本，还可以抓包，认证，传输文件。

仅仅做到这些还不能够满足一个系统的开发，或者说过于琐碎，你仍需要频繁地在开发环境，测试环境，生产环境中来回切换。单一的请求也不够，你需要维护系统所有 API 的请求，并且每个请求还带有不同的 `querystring` 和 `body`。

<!--more-->

原文链接见 [山月的博客](https://shanyue.tech/post/postman-for-api-automated-testing/)

## Collection

对服务器端的所有请求按功能或者业务模块进行组织，使用 markdown 对所有请求和示例添加适当的描述，这时候就用到了 Collection。以下是 postman 的一些术语以及组织请求的建议。

详细参考 [Postman SDK Concepts](http://www.postmanlabs.com/postman-collection/tutorial-concepts.html) 以及 [creating collections](https://www.getpostman.com/docs/postman/collections/creating_collections)

+ Collection
    对应一个Application，组内各个成员(server, client, QA)共享一个 Collection。可以对整个 Collection 添加测试，文档。
    对于一开始未在 postman 组织请求的应用，可以设置 Proxy，跑一遍应用，对应用的所有请求进行抓包。

+ Folder (ItemGroup)
    对应一个模块，或者各层级子路由。如 `router.use('/users')` 所有的请求都在一个 Folder，可以根据路由互相嵌套 Folder。

+ Request (Item)
    对应一个请求，可以添加认证信息。也可以设置代理，进行抓包。详见 [capturing http requests](https://www.getpostman.com/docs/postman/sending_api_requests/capturing_http_requests)。

+ Example
    对应一个请求不同的参数以及响应，用于Mock Server 以及文档。

postman 可以根据 Collection 的结构生成文档与Mock Server。不过都是付费功能，免费版有次数限制。

### 文档

postman 自动生成文档有助于团队协作，解决了手动写文档，以及更新不及时的重大bug。

对于 GET 请求，Postman 上可以添加对该字段的描述，生成文档。

对于 POST 以及 PUT 请求，如果 Content-Type 是 `form-data` 或者 `x-www-form-urlencoded` 可以添加描述生成文档。不过如今传递 json 更方便灵活，所以 `application/json` 也会有很多，而且 json 又是不能添加注释的。如果需要对 json 添加文档说明的话，可以添加冗余字段 `_{key}.comment` 标明注释

```javascript
{
  "id": 128,
  "_id.comment": "id",
  "page": 10,
  "_page.comment": "页数"
  "pageSize": 15,
  "_pageSize.comment": "每页条数"
}
```

不过这样冗余字段过多，更好的解决方案是在测试中对请求进行 json 校验，同时充当了一部分文档的功能。毕竟 json-schema 就是用来描述数据使数据更加可读。

以上说到请求，对于响应的文档，可以 json-schema 校验或者每个字段的描述，以及更多的测试用例代表更多的细节。

### Mock

当服务器端还没有写好 API 时，客户端可以根据 Examples 来生成 Mock Server。

建议客户端端自己做 Mock，与项目集成在一起，纳入版本控制，方便灵活。强烈推荐 [json-server](https://github.com/typicode/json-server)，简单好用。

## 测试

对于每一个 Request 都需要有测试用例。验证响应是否成功，响应时间是否过长或者响应 json 的数据类型是否正确。

测试可以使用 `pm.expect` 进行 `BDD` 测试，风格和 `chai` 很像，如果熟悉 `chai` 就很容易上手。

postman 内置了一些[第三方库](https://www.getpostman.com/docs/postman/scripts/postman_sandbox_api_reference)，如果你更喜欢 `chai` ，可以直接使用，也可以使用 `pm.expect` 底层使用 chai 实现，与 chai BDD API 一致。

postman 也有一些 http 相关的测试 API，如 status code，header, body，并且也提供了一些 snippets。

```javascript
// 响应成功
pm.test('Status code is 200', () => {
  pm.response.to.have.status(200)
})

// 响应成功 chai.expect
pm.test('Status code is 200', () => {
  chai.expect(pm.response).to.have.property('code', 200)
})

// 校验响应数据
pm.test('Page is 100', () => {
  const jsonData = pm.response.json()
  chai.expect(jsonData.page).to.eql(100)
})
```

### Json Schema

[json-schema](http://json-schema.org/) 可以用来描述 json 信息，使 json 更加易读，同时也可以用来校验 json 的合法性。主流语言都有实现 json-schema 的库。

建议对所有 GET 响应进行 json-schema 校验，一来校验数据，二来也可以作为文档使用，使用 [tv4](https://github.com/geraintluff/tv4) 校验 json

```javascript
pm.test("User info", () => {
  const jsonData = pm.response.json()
  const schema = {
    title: 'UserInfo',
    discription: '用户信息',
    type: 'object',
    required: ['age', 'email', 'name'],
    properties: {
      age: {
        description: '年龄',
        type: 'number',
        mininum: 0,
      },
      email: {
        description: '邮箱',
        type: 'string' 
      },
      name: {
        description: '姓名',
        type: 'string' 
      }
    }
  }
  pm.expect(tv4.validate(jsonData, schema)).to.eql(true)
})
```

同样对于请求也可以添加 json 校验，不过更复杂一些，因为 postman 没有直接给出获取全部请求参数的api，需要自己解析和计算

```javascript
// 获取 application/json 中的数据
const json = JSON.stringify(pm.request.body.raw)

// 获取 GET query string 的数据
const qs = pm.request.url.query.toObject()
```

> 如果 postman 可以根据请求参数的 json-schema 自动生成数据就好了...

+ 参考
  + [json-schema.org](http://json-schema.org/)
  + [tv4 Documentaion](https://github.com/geraintluff/tv4)
  + [chai bdd - API](http://chaijs.com/api/bdd/)
  + [postman sandbox api reference](https://www.getpostman.com/docs/postman/scripts/postman_sandbox_api_reference)


### 测试请求参数

一个请求带有若干参数，如 `GET` 的 `querystring(search)` 以及 `POST` 的 `body`，不同的参数会有不同的响应。

假设一个请求不同参数返回的 json schema 完全不同，则可以写成两个 Request 分开测试。如果返回的 json schema 相同，只是值不同，则需要考虑传递了哪些参数，参数是多少。

一个经典的场景，根据 filter 来筛选符合条件的列表。拿用户列表举例，伪代码如下

```javascript
const url = '/api/users'
const query = {
  name: 'san',
  age: 12,
  sex: 'MALE'
}
// 注意query数据需要校验，防止 SQL 注入
const sql = `select * from users where name = ${query.name} and age = ${query.age} and sex = ${query.sex}`
```

一个思路是根据请求的参数进行测试，一段重要的 snipet 是在 postman 中获取 querystring，query 是一种 `PropertyList` 的数据，定义在 [postman-collection - PropertyList](http://www.postmanlabs.com/postman-collection/PropertyList.html)。如下

```javascript
const name = pm.request.url.query.get('name')
const age = pm.request.url.query.get('age')

if (name) {
  pm.test('Items should match the name', () => {
    const jsonData = pm.response.json()
    expect(_.uniq(jsonData.rows.map(row => row.name))).to.eql([name])
  })
}

// 冗余代码有些多，postman不知道支不支持自建 snipets
if (age) {
  pm.test('Items should match the age', () => {
    const jsonData = pm.response.json()
    expect(_.uniq(jsonData.rows.map(row => row.age))).to.eql([age])
  })
}
```

当然以上 filter 只包含了最简单的场景，其中只涉及到了相等测试。但是有不等以及包含关系呢。

```javascript
const query = {
  name: 'san',
  age: 12,
  sex: 'MALE'
}
const sql = `select * from users where name like ${query.name} and age < ${query.age} and sex = ${query.sex}`
```

这种请求参数依赖于前后端的协商交流，当然对测试或者一个不知情的开发来说很不友好的。

当然对于后端也是不友好的，因为需要对你传入的每个 query 来进行处理，而且以后每添加一个筛选字段，都需要手动改一下。

可以由前端自行决定需要筛选的数据，比如使用类似于 mongo 的检索语法。

> [graphql](http://graphql.org/) 是相当酷的，值得尝试一下

```javascript
const query = {
  name: {
    $like: 'san' 
  },
  age: {
    $lt: 12 
  },
  sex: 'MALE'
}
```

不过这对于测试的开发能力要求也比较高了，测试人员需要解析参数并且测试接口。

### 测试多次请求

当对一个函数进行单元测试时，需要大量的输入以及期望输出，在postman中，可以使用 `data` 来模拟多次输入

data 是一种变量，只能在 Runner 中使用，有必要对每个 Folder 建立相关的 data file，并且加入版本控制

+ [using csv and json files in the postman collection runner](http://blog.getpostman.com/2014/10/28/using-csv-and-json-files-in-the-postman-collection-runner/)

## 集成测试

单个API测试通过后，需要把所有请求集成在一起进行测试。这时候出现了两个问题

1. 如何确保API依赖
1. API之间如何传递数据

请求在 Collection 的顺序就是他们的发起请求的顺序，如果需要强制更改顺序，可以使用 [`setNextRuest()`](https://www.getpostman.com/docs/postman/collection_runs/building_workflows)

在 postman 中有三种作用域的数据，`data`，`environment`，`global`。在请求中用 `{{}}` 占位符替代。

`environment` 可以用来更改 `HOST`，避免在 url 中频繁手动切换本地环境，开发环境和生产环境。另外也可以用来传递数据。

一个常见的场景是项目使用 token 来保存登录信息，每次请求都需要携带token。可以在登录的测试代码中设置 token 的环境变量

```javascript
const url = 'http://{{HOST}}/api/login'

pm.test('There is a token', () => {
  const jsonData = pm.response.json()
  pm.expect(jsonData.token).to.a('string')
  pm.environment.set('token', jsonData.token)
})

const urlNext = 'http://{{HOST}}/api/profile?token={{token}}'
```

### 测试Collection

确保依赖后，可以对 Collection 新建一个 Runner，并且引入一个 data 文件来测试所有的请求。对局部的 Folder 也可以使用 Runner 以及 data 进行测试。

> 最新版本的 postman 已经可以支持，为每个 Postman 新建变量以及 Test

所有的请求都会有一些共同测试，比如测试接口是否响应成功以及以上提到的测试 filter

```javascript
pm.test('Response is right', () => {
  // status code: 2XX
  pm.response.to.be.success
})

pm.test('Filter is matching', () => {
  // ...
})
```

## 持续集成

当可以测试 Collection 后，需要对测试加入版本控制，与项目集成在一起，保留测试记录，以便准时定位 bug。可以与 postman 的官方工具 `newman` 集成在一起，但是有一点不方便的是，持续集成仅仅可以保存记录，并不能还原记录。

```shell
newman run https://api.getpostman.com/collections/{{collection_uid}}?apikey={{postman-api-key-here}} --environment https://api.getpostman.com/environments/{{environment_uid}}?apikey={{postman-api-key-here}}
```

## 对比UI自动化测试

按照我的理解，UI 自动化测试目的是用来测试流程是否通畅，比如登陆，注册，退出，如果用例没通过则截屏。但是前端需求的不断变化，加上现在各种前端框架，导致 selector 不是特别容易获取到且流程容易更改。

而API 自动化测试用来测试数据是否正确。而且大部分问题是出在数据问题上，所以 API 自动化测试性价比比较高一些。

## 总结

1. 如何编写测试用例

    > postman 底层使用 `[chai.js](http://chaijs.com/api/bdd/)` 的 bdd 语法作为断言库，另外加了一些特有的语法。

1. 如何debug

    > 点击菜单栏 View -> Show Devtools (Show Postman Console) 可以查看响应，检查输出，不过不能打断点。对于系统的单个请求，可以使用 Proxy 监听请求进行调试。

1. 如何使用js第三方库对请求就行预处理以及后处理

    比如:
    发送请求时，服务器端要求时间为 `timestmap(unix)` 的格式，但接口调试时可读性过弱，是否可以使用 `moment` 转化时间。
    收到响应时，也需要 `moment` 对时间进行解析，获得更好的展现形式。或者使用 `lodash` 一些函数进行数据的处理。
  
    > 可以在 Tests 和 Pre-request Script 中编写脚本对请求以及响应做一些处理。但是不能对数据格式化，比如日期。
    > 建议前后端交流日期时使用 ISO 格式的字符串，前后端都容易解析，并且可读性强。

1. 如何管理请求依赖

    比如:
    两个API需要有依赖关系，比如当创建完一个用户后（注册），获取他的个人信息。获取个人信息就需要依赖创建用户这个API。

    > 使用 Environment Variables 可以管理依赖

1. 如何设置统一的请求参数

    比如:
    大部分接口都需要统一的 `token` 参数。

    > 目前好像没什么办法

1. 如何集成到服务器端项目中

    如果系统后续版本没有通过API测试，则保留测试记录是很重要的，版本控制可以得知该时间段内的代码变更。以git为例，需要每次提交后运行测试，并保留测试结果。
  
    > 可以使用 npm 包 newman 来集成到项目中

## 参考

+ [using variables inside postman and collection runner](http://blog.getpostman.com/2014/02/20/using-variables-inside-postman-and-collection-runner/)
+ [writing tests in postman](http://blog.getpostman.com/2017/10/25/writing-tests-in-postman/)
+ [postman-echo](https://docs.postman-echo.com)
+ [generate spoitify playlists using a postman collection](http://blog.getpostman.com/2016/11/09/generate-spotify-playlists-using-a-postman-collection/)
