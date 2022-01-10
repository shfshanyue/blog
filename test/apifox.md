# 为什么我更推荐 Apifox，而不是 postman 呢

`Apifox`，同 postman 一样，最基本的功能用来接口联调。

稍微高级点的用法可以使用 Apifox 生成各个语言发送请求的代码，针对 Image/File 进行请求，对 Request Body 与 Response Body 进行数据校验及测试。

**仅仅做到这些只是满足一个开发者的使用场景。而 Apifox 更高级的用法可以使整个团队进行受益，满足开发测试的各个阶段，对开发环境，测试环境，生产环境进行全环境覆盖。对开发、测试、文档进行更进一步的自动化**

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-13/apifox.8afe66.webp)

## Apifox API 管理分层

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-13/apifox%20api.5a9586.webp)

Apifox 可对后端的所有请求按功能或者业务模块进行组织，使用 markdown 对所有请求和示例添加适当的描述。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-13/clipboard-2357.2a5777.webp)

我们看一下 Apifox 关于组织请求及分组的建议。

+ 项目: 对应一个团队中某个服务。项目在项目组内各个成员(server, client, QA)间进行共享。可以对整个项目添加请求，文档、单API测试等。最重要的是可以添加**测试流程**和**数据模型**，后续讲到。对于一开始未在 apifox 组织请求的项目，可以**根据 apidoc、swagger 等文档自动转化为 apifox 组织好的项目**。
+ 分组: 对应一个模块，或者各层级子路由。如 `router.use('/users')` 所有的请求都在一个*分组*，可以根据路由互相嵌套*分组*。
+ 请求: 对应一个API请求，一个文档。
+ 实例: 对应一个请求不同的参数以及响应，用于 Mock Server 以及文档。

> PS: 关于 Mock Server 和团队共享 API，在 postman 中也存在，不过 apifox 全部免费，优势在我。

> PS2: 一个小建议，如果能够通过一个 Proxy，跑一遍项目，将所有请求收集起来并存储为 Apifox 的项目，可最大幅度地节省了人为添加 API 的繁琐性。特别是由其它工具，刚转化为 apifox 时。

### 文档

apifox 自动生成文档有助于团队协作，解决了手动写文档，**以及更新不及时的重大bug**。

> 喂，那个后端，就是说你了，你文档没更新害我白折腾了三天三夜。


不过这样冗余字段过多，更好的解决方案是在测试中对请求进行 json 校验，同时充当了一部分文档的功能。毕竟 json-schema 就是用来描述数据使数据更加可读。

以上说到请求，对于响应的文档，可以 json-schema 校验或者每个字段的描述，以及更多的测试用例代表更多的细节。

### Mock

当服务器端还没有写好 API 时，客户端可以自定义规则来生成接口。

更多参考 [「前端该如何优雅地Mock数据🏃」每个前端都应该学会的技巧](https://juejin.cn/post/7048916480032768013)

## 测试

对于每一个 Request 都需要有测试用例，验证响应是否成功，响应时间是否过长或者响应 json 的数据类型是否正确。

测试可以使用 `pm.expect` 进行 `BDD` 测试，风格和 `chai` 很像，如果熟悉 `chai` 就很容易上手，`pm.expect` 底层使用 chai 实现，与 chai BDD API 一致。

apifox 也有一些 HTTP 相关的测试 API，如 status code，header, body，并且也提供了一些 snippets。

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

重点不在这里，使用 **apifox 可以使用图形界面交互式无需写代码对接口进行测试**。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-13/clipboard-5798.739b9c.webp)

以上截图对以下数据进行了校验

1. API 请求成功，状态码必须是 200
1. 响应体数据必须是 JSON
1. 响应体中 code 字段必须是数字

### 示例: 测试请求参数

一个请求带有若干参数，如 `GET` 的 `querystring(search)` 以及 `POST` 的 `body`，**不同的参数会有不同数据结构的响应**。

假设一个请求不同参数返回的 json schema 完全不同，则可以写成两个 API 分开测试。

如果返回的 Json Schema 相同，只是值不同，则使用两个不同的示例进行测试。

## 集成测试

单个API测试通过后，需要把所有请求集成在一起进行测试。这时候出现了两个问题

1. 如何确保API依赖
1. API之间如何传递数据

在 apifox 中可以使用环境变量维护数据，在请求中用 `{{}}` 占位符替代。

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

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-13/clipboard-4460.7398ca.webp)

> PS: 那如何自动控制所有测试的顺序呢？比如以下三步，登录成功后走第二步，登录失败走第三步
> 1. 登录
> 2. 发帖
> 3. XXX

## 持续集成

如何将集成测试与项目集成在一起，纳入版本管理，保留测试记录，方便准时定位 bug。

可以可使用 Apifox CLI，*不过仅仅能测试离线数据*。可参考文档 [Apifox: 持续集成](https://www.apifox.cn/help/app/ci)

```shell
$ apifox run examples/sample.apifox-cli.json -r cli,html
```

## 总结及更多疑问总结

1. 如何编写测试用例

    > 1. apifox 底层使用 `[chai.js](http://chaijs.com/api/bdd/)` 的 bdd 语法作为断言库，另外加了一些特有的语法。
    > 1. apifox 可通过图形化界面交互式校验数据

1. 如何debug

    > 点击菜单栏 View -> Show Devtools (Show Postman Console) 可以查看响应，检查输出。

1. 集成测试如何管理请求依赖

    比如: 两个API需要有依赖关系，比如当创建完一个用户后（注册），获取他的个人信息。获取个人信息就需要依赖创建用户这个API。

    > 使用 Environment Variables 可以管理依赖

1. 如何集成到服务器端项目中

    > 可以使用 npm 包 apifox-cli 来集成到项目中
