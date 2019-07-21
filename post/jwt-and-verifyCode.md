# JWT 实践邮件验证与登录

去年我写了一篇介绍 `jwt` 的[文章](https://shanyue.tech/post/jwt-guide/readme/)。

**文章指出如果没有特别的用户注销及单用户多设备登录的需求，可以使用 jwt，而 jwt 的最大的特征就是无状态，且不加密。** 

除了用户登录方面外，还可以使用 jwt 验证邮箱验证码，其实也可以验证手机验证码，但是鉴于我囊中羞涩，只能验证邮箱了。

另外，我已在我的[试验田](https://shanyue.tech/login)进行了实践，不过目前前端代码写的比较简陋，甚至没有失败的回馈提示。至于为什么前端写的简陋，完全是因为前端的代码量相比后端来讲实在过于庞大...

另外，如果你熟悉 graphql，也可以在本项目的 [graphql-playground](https://graphql.xiange.tech/playground) 中查看效果。

<!--more-->

> 本文地址: <https://shanyue.tech/post/jwt-and-verifycode/>
> 相关代码: <https://github.com/shfshanyue/shici-server/blob/master/src/resolvers/User.js#L73>

## 发送验证码

校验之前，需要配合一个随机数供邮箱和短信发送。使用以下代码片段生成一个六位数字的随机码，你也可以把它包装为一个函数

```javascript
const verifyCode = Array.from(Array(6), () => parseInt((Math.random() * 10))).join('')
```

**如果使用传统有状态的解决方案，此时需要在服务端维护一个用户邮箱及随机码的键值对**，而使用 `jwt` 也需要给前端返回一个 token，随后用来校验验证码。

我们知道 jwt 只会校验数据的完整性，而不对数据加密。此时当拿用户邮箱及校验码配对时，但是如果都放到 `payload` 中，而 `jwt` 使用明文传输数据，校验码会被泄露

```javascript
// 放到明文中，校验码泄露
jwt.sign({ email, verifyCode }, config.jwtSecret, { expiresIn: '30m' })
```

> 那如何保证校验码不被泄露，而且能够正确校验数据呢

**我们知道 secret 是不会被泄露的，此时把校验码放到 secret 中，完成配对**

```javascript
// 再给个半小时的过期时间
const token = jwt.sign({ email }, config.jwtSecret + verifyCode, { expiresIn: '30m' })
```

**在服务端发送邮件的同时，把 token 再传递给前端，随注册时再发送到后端进行验证**，这是我项目中关于校验的 `graphql` 的代码。如果你不懂 graphql 也可以把它当做伪代码，大致应该都可以看的懂

```graphql
type Mutation {
  # 发送邮件
  # 返回一个 token，注册时需要携带 token，用以校验验证码
  sendEmailVerifyCode (
    email: String! @constraint(format: "email")
  ): String!
}
```

```javascript
const Mutation = {
  async sendEmailVerifyCode (root, { email }, { email: emailService }) {
    // 生成六个随机数
    const verifyCode = Array.from(Array(6), () => parseInt((Math.random() * 10))).join('')
    // TODO 可以放到消息队列里，但是没有多少量，而且本 Mutation 还有限流，其实目前没啥必要...
    // 与打点一样，不关注结果
    emailService.send({
      to: email, 
      subject: '【诗词弦歌】账号安全——邮箱验证',
      html: `您正在进行邮箱验证，本次请求的验证码为：<span style="color:#337ab7">${verifyCode}</span>（为了保证您帐号的安全性，请在30分钟内完成验证）\n\n诗词弦歌团队`
    })
    return jwt.sign({ email }, config.jwtSecret + verifyCode, { expiresIn: '30m' })
  }
}
```

> 题外话，发送邮件也有几个问题需要思考一下，不过这里先不管它了，以后实现了再写篇文章总结一下
>
> 1. 如果邮件由服务提供，如何考虑异步服务和同步服务
> 1. 消息队列处理，发邮件不要求可靠性，更像是 UDP
> 1. 为了避免用户短时间内大量邮件发送，如何实现限流 (RateLimit)
>
> 题外题外话，一般发送邮件或者手机短信之前需要一个图片校验码来进行用户真实性校验和限流。而图片校验码也可以通过 jwt 进行实现

## 注册

注册就简单很多了，对客户端传入的数据进行邮箱检验，校验成功后直接入库就可以了，以下是 `graphql` 的代码

```graphql
type Mutation {
  # 注册
  createUser (
    name: String!
    password: String!
    email: String! @constraint(format: "email")
    verifyCode: String!
    # 发送邮件传给客户端的 token
    token: String!
  ): User!
}
```

```javascript
const Mutation = {
  async createUser (root, { name, password, email, verifyCode, token }, { models }) {
    const { email: verifyEmail } = jwt.verify(token, config.jwtSecret + verifyCode)
    if (email !== verifyEmail) {
      throw new Error('请输入正确的邮箱') 
    }
    const user = await models.users.create({
      name,
      email,
      // 入库时密码做了加盐处理
      password: hash(password)
    })
    return user
  }
}
```

这里有一个细节，对入库的密码使用 `MD5` 与一个参数 `salt` 做了不可逆处理

```javascript
function hash (str) {
  return crypto.createHash('md5').update(`${str}-${config.salt}`, 'utf8').digest('hex')
}
```

> 题外话，`salt` 是否可以与 `JWT` 的 `secret` 设置为同一字符串？

> 再题外话，这里的输入正确邮箱的 Error 明显不应该发送至 Sentry (报警系统)，而有的 Error 的信息可以直接显示在前端，如何对 Error 进行规范与分类

## 校验码由传统方法实现与 jwt 比较

如果使用传统方法，只需要一个 key/value 数据库，维护手机号/邮箱与检验码的对应关系即可实现，相比 jwt 而言要简单很多。

## 登录

一个用 `jwt` 实现登录的 `graphql` 代码，把 `user_id` 与 `user_role` 置于 payload 中

```graphql
type Mutation {
  # 登录，如果返回 null，则登录失败
  createUserToken (
    email: String! @constraint(format: "email")
    password: String!
  ): String
}
```

```
const Mutation = {
  async createUserToken (root, { email, password }, { models }) {
    const user = await models.users.findOne({
      where: {
        email,
        password: hash(password)
      },
      attributes: ['id', 'role'],
      raw: true
    })
    if (!user) {
      // 返回空代表用户登录失败
      return
    }
    return jwt.sign(user, config.jwtSecret, { expiresIn: '1d' })
  }
}
```

<hr/>

关注公众号**山月行**，记录我的技术成长，欢迎交流

![欢迎关注公众号山月行，记录我的技术成长，欢迎交流](https://user-gold-cdn.xitu.io/2019/4/12/16a0f3f9a9376aff?w=258&h=258&f=jpeg&s=27530)
