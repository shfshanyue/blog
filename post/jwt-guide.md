# JWT 实践应用以及不适用特殊案例思考

JSON Web Token 是 [rfc7519](https://tools.ietf.org/html/rfc7519) 出的一份标准，使用 JSON 来传递数据，用于判定用户是否登录状态。

jwt 之前，使用 `session` 来做用户认证。

<!--more-->

> 以下代码均使用 javascript 编写。

+ 原文链接: [山月的博客](https://shanyue.tech/post/jwt-guide)

## session 

传统判断是否登录的方式是使用 `session + token`。

`token` 是指在客户端使用 token 作为用户状态凭证，浏览器一般存储在 `localStorage` 或者 `cookie` 中。

`session` 是指在服务器端使用 redis 或者 sql 类数据库，存储 user_id 以及 token 的键值对关系，基本工作原理如下。

在服务器端使用 `sessions` 存储键值对

```javascript
const sessions = {
  "ABCED1": 10086,
  "CDEFA0": 10010
}
```

每次客户端请求带权限数据时携带 token，在服务器端根据 token 与 sessions 获取 user_id， 完成认证过程

``` javascript
function getUserIdByToken (token) {
  return sessions[token]
}
```

如果存储在 `cookie` 中就是经常听到的 `session + cookie` 的登录方案。其实存储在 `cookie`，`localStorage` 甚至 `IndexedDB` 或者 `WebSQL` 各有利弊，核心思想一致。

关于 `cookie` 以及 `token` 优缺点，在 [token authetication vs cookies](https://stackoverflow.com/questions/17000835/token-authentication-vs-cookies) 中有讨论。

如果不使用 cookie，可以采取 `localStorage + Authorization` 的方式进行认证，更加无状态化

```javascript
// http 的头，每次请求权限接口时，需要携带 Authorization Header
const headers = {
  Authorization: `Bearer ${localStorage.get('token')}`
}
```

> 推荐一个前端的存储库 [localForage](https://github.com/localForage/localForage)，使用 `IndexedDB`，`WebSQL` 以及 `IndexedDB` 做键值对存储。

## 无状态登录

`session` 需要在数据库中保持用户及token对应信息，所以叫 **有状态**。

试想一下，如何在数据库中不保持用户状态也可以登录。

第一种方法： **前端直接传 user_id 给服务端**

缺点也特别特别明显，容易被用户篡改成任意 user_id，权限设置形同虚设。不过思路正确，接着往下走。

改进： **对 user_id 进行对称加密** 

服务端对 user_id 进行对称加密后，作为 token 返回客户端，作为用户状态凭证。比上边略微强点，但由于对称加密，选择合适的算法以及密钥比较重要

改进： **对 user_id 不需要加密，只需要进行签名，保证不被篡改**

这便是 jwt 的思想：user_id，加密算法和签名组成 token 一起存储到客户端，每当客户端请求接口时携带 token，服务器根据 token 解析出加密算法与 user_id 来判断签名是否一致。

## Json Web Token

+ [jwt.io](https://jwt.io/)

jwt 根据 `Header`，`Payload` 以及 `Signature` 三个部分由 `.` 拼接而成。

### Header

Header 由非对称加密算法和类型组成，如下

```javascript
const header = {
  // 加密算法
  alg: 'HS256',
  type: 'jwt'
}
```

### Payload

Payload 中由 [Registered Claim](https://tools.ietf.org/html/rfc7519#section-4.1) 以及需要通信的数据组成。这些数据字段也叫 `Claim`。

`Registered Claim` 中比较重要的是 `"exp" Claim` 表示过期时间，在用户登录时会设置过期时间。

```javascript
const payload = {
  // 表示 jwt 创建时间
  iat: 1532135735,

  // 表示 jwt 过期时间
  exp: 1532136735,

  // 用户 id，用以通信
  user_id: 10086
}
```

### Signature

`Signature` 由 `Header`，`Payload` 以及 `secretOrPrivateKey` 计算而成。`secretOrPrivateKey` 作为敏感数据存储在服务器端，可以考虑使用 `vault secret` 或者 `k8s secret`

对于 `secretOrPrivateKey`，如果加密算法采用 `HMAC`，则为字符串，如果采用 `RSA` 或者 `ECDSA`，则为 PrivateKey。

```javascript
// 由 HMACSHA256 算法进行签名，secret 不能外泄
const sign = HMACSHA256(base64.encode(header) + '.' + base64.encode(payload), secret)

// jwt 由三部分拼接而成
const jwt = base64.encode(header) + '.' + base64.encode(payload) + '.' + sign
```

> 从生成 jwt 规则可知客户端可以解析出 payload，因此不要在 payload 中携带敏感数据，比如用户密码

### 校验过程

在生成规则中可知，jwt 前两部分是对 header 以及 payload 的 base64 编码。

**当服务器收到客户端的 token 后，解析前两部分得到 header 以及 payload，并使用 header 中的算法与 secretOrPrivateKey 进行签名，判断与 jwt 中携带的签名是否一致。**

> 带个问题，如何判断 token 过期？

## 应用

由上可知，jwt 并不对数据进行加密，而是对数据进行签名，保证不被篡改。**除了在登录中可以用到，在进行邮箱校验，图形验证码和短信验证码时也可以用到。**

### 图形验证码

在登录时，输入密码错误次数过多会出现图形验证码。

图形验证码的原理是给客户端一个图形，并且在服务器端保存与这个图片配对的字符串，以前也大都通过 session 来实现。

可以把验证码配对的字符串作为 secret，进行无状态校验。

```javascript
const jwt = require('jsonwebtoken')

// 假设验证码为字符验证码，字符为 ACDE，10分钟失效
const token = jwt.sign({}, secrect + 'ACDE', { expiresIn: 60 * 10 })

const codeImage = getImageFromString('ACDE')

// 给前端的响应
const res = {
  // 验证码图片的 token，从中可以校验前端发送的验证码
  token,
  // 验证码图片
  codeImage,
}
```

**短信验证码与图形验证码同理**

### 邮箱校验

现在网站在注册成功后会进行邮箱校验，具体做法是给邮箱发一个链接，用户点开链接校验成功。

```javascript
// 把邮箱以及用户id绑定在一起
const code = jwt.sign({ email, userId }, secret, { expiresIn: 60 * 30 })

// 在此链接校验验证码
const link = `https://example.com/code=${code}`
```

## 无状态 VS 有状态

关于无状态和有状态，在其它技术方向也有对比，比如 React 的 `stateLess component` 以及 `stateful component`，函数式编程中的副作用可以理解为状态，http 也是一个无状态协议，需要靠 header 以及 cookie 携带状态。

在用户认证这里，有无状态是指是否依赖外部数据存储，如 mysql，redis 等。

## 案例

思考以下几个关于登录的问题如何使用 session 以及 jwt 实现，来更加清楚 `jwt` 的使用场景

### 当用户注销时，如何使该 token 失效

因为 jwt 无状态，不保存用户设备信息，没法单纯使用它完成以上问题，可以再利用数据库保存一些状态完成。

+ `session`: 只需要把 user_id 对应的 token 清掉即可
+ `jwt`: 使用 redis，维护一张黑名单，用户注销时把该 token 加入黑名单，过期时间与 jwt 的过期时间保持一致。

### 如何允许用户只能在一个设备登录，如微信

+ `session`: 使用 sql 类数据库，对用户数据库表添加 token 字段并加索引，每次登陆重置 token 字段，每次请求需要权限接口时，根据 token 查找 user_id
+ `jwt`: 假使使用 sql 类数据库，对用户数据库表添加 token 字段(不需要添加索引)，每次登陆重置 token 字段，每次请求需要权限接口时，根据 jwt 获取 user_id，根据 user_id 查用户表获取 token 判断 token 是否一致。另外也可以使用计数器的方法，如下一个问题。

对于这个需求，session 稍微简单些，毕竟 jwt 也需要依赖数据库。

### 如何允许用户只能在最近五个设备登录，如诸多播放器

+ `session`: 使用 sql 类数据库，创建 token 数据库表，有 id, token, user_id 三个字段，user 与 token 表为 1:m 关系。每次登录添加一行记录。根据 token 获取 user_id，再根据 user_id 获取该用户有多少设备登录，超过 5 个，则删除最小 id 一行。
+ `jwt`: 使用计数器，使用 sql 类数据库，在用户表中添加字段 count，默认值为 0，每次登录 count 字段自增1，每次登录创建的 jwt 的 Payload 中携带数据 current_count 为用户的 count 值。每次请求权限接口时，根据 jwt 获取 count 以及 current_count，根据 user_id 查用户表获取 count，判断与 current_count 差值是否小于 5

对于这个需求，jwt 略简单些，而使用 session 还需要多维护一张 token 表。

### 如何允许用户只能在最近五个设备登录，而且使某一用户踢掉除现有设备外的其它所有设备，如诸多播放器

+ `session`: 在上一个问题的基础上，删掉该设备以外其它所有的token记录。
+ `jwt`: 在上一个问题的基础上，对 count + 5，并对该设备重新赋值为新的 count。

### 如何显示该用户登录设备列表 / 如何踢掉特定用户

+ `session`: 在 token 表中新加列 device
+ `jwt`: 需要服务器端保持设备列表信息，做法与 session 一样，使用 jwt 意义不大

## 总结

从以上问题得知，如果不需要控制登录设备数量以及设备信息，无状态的 jwt 是一个不错的选择。一旦涉及到了设备信息，就需要对 jwt 添加额外的状态支持，增加了认证的复杂度，此时选用 session 是一个不错的选择。

jwt 不是万能的，是否采用 jwt，需要根据业务需求来确定。
