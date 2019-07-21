# 浏览器跨域问题与服务器中的 CORS

> Access to XMLHttpRequest at 'xxx' from origin 'xxx' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

> [什么是跨域？](https://q.shanyue.tech/fe/js/216.html)

跨域，这或许是前端面试中最常碰到的问题了，大概因为跨域问题是浏览器环境中的特有问题，而且随处可见，如同蚊子不仅盯你肉而且处处围着你转让你心烦。**你看，在服务器发起 HTTP 请求就不会有跨域问题的**。

当谈到跨域问题的解决方案时，最流行也最简单的当属 CORS 了。

## CORS

CORS 即跨域资源共享 (Cross-Origin Resource Sharing, CORS)。简而言之，就是在服务器端的响应中加入几个标头，使得浏览器能够跨域访问资源。

这个响应头的字段设置就是 `Access-Control-Allow-Origin: *`，如下图所示

![简单的 CORS 请求](https://mdn.mozillademos.org/files/17214/simple-req-updated.png)

以下是最简单的一个 CORS 请求

``` txt
GET / HTTP/1.1
Host: shanyue.tech
Origin: http://shanyue.tech
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: text/plain; charset=utf-8
Content-Length: 12
Date: Wed, 08 Jul 2020 17:03:44 GMT
Connection: keep-alive
```

## 预请求与 Options

当一个请求跨域且不是简单请求时就会发起预请求，也就是 `Options`。如果没有预请求，万一有一个毁灭性的 POST 跨域请求直接执行，虽然最后告知浏览器你没有跨域权限，但是损失已造成，岂不亏大的。

以下条件构成了简单请求：

1. `Method`: 请求的方法是 `GET`、`POST` 及 `HEAD`
1. `Header`: 请求头是 `Content-Type` (有限制)、`Accept-Language`、`Content-Language` 等
1. `Content-Type`: 请求类型是 `application/x-www-form-urlencoded`、`multipart/form-data` 或 `text/plain`

非简单请求一般需要开发者主动构造，在项目中常见的 `Content-Type: application/json` 及 `Authorization: <token>` 为典型的**非简单请求**。与之有关的三个字段如下：

- `Access-Control-Allow-Methods`: 请求所允许的方法, **用于预请求 (preflight request) 中**
- `Access-Control-Allow-Headers`: 请求所允许的头，**用于预请求 (preflight request) 中**
- `Access-Control-Max-Age`: 预请求的缓存时间

## 写一个 CORS Middleware

既然 CORS 原理如此简单，那就拿起键盘写一个简单的 CORS 中间件吧，CORS 大致是设置几个响应头吧

> [关于 cors 的响应头有哪些？](https://q.shanyue.tech/base/http/328.html)

**关于 CORS 的设置即是对 CORS 相关响应头的设置，因此了解这些 headers 至关重要。无论对于配置的生产者和消费者，及后端和前端而言，都应该掌握！**

以下是关于 CORS 相关的 response headers 及其释义

- `Access-Control-Allow-Origin`: 可以把资源共享给那些域名，支持 * 及 特定域名
- `Access-Control-Allow-Credentials`: 请求是否可以带 cookie
- `Access-Control-Allow-Methods`: 请求所允许的方法, **用于预请求 (preflight request) 中**
- `Access-Control-Allow-Headers`: 请求所允许的头，**用于预请求 (preflight request) 中**
- `Access-Control-Expose-Headers`: 那些头可以在响应中列出
- `Access-Control-Max-Age`: 预请求的缓存时间

而关于 CORS 的中间件即是使用默认值与配置来设置这些头，如 `koa/cors` 需要传递以下参数。

``` js
/**
 * CORS middleware
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean|Function(ctx)} credentials `Access-Control-Allow-Credentials`, default is false.
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 * @return {Function} cors middleware
 * @api public
 */

// Example
app.use(cors())
```

## CORS 如何设置多域名

由上，貌似很简单，只需要服务端设置一下 `Access-Control-Allow-Origin` 就可以轻松解决问题，但其中的坑有可能比你想象地要多很多！

先说回 `Access-Control-Allow-Origin`，它所允许的值只有两个

+ `*`: 所有域名
+ `shanyue.tech`: 特定域名

此时，新问题来了:

> [CORS 如果需要指定多个域名怎么办](https://q.shanyue.tech/base/http/364.html)

**如果使用 `Access-Control-Allow-Origin: *`，则所有的请求不能够携带 `cookie`**，因此这种方案被摈弃。

因此这个问题需要写代码来解决，根据请求头中的 Origin 来设置响应头 `Access-Control-Allow-Origin`

1. 如果请求头不带有 Origin，证明未跨域，则不作任何处理
1. 如果请求头带有 Origin，证明跨域，根据 Origin 设置相应的 `Access-Control-Allow-Origin: <Origin>`

``` js
// 获取 Origin 请求头
const requestOrigin = ctx.get('Origin');

// 如果没有，则跳过
if (!requestOrigin) {
  return await next();
}

// 设置响应头
ctx.set('Access-Control-Allow-Origin', requestOrigin)
```

**但此时会出现一个新的问题：缓存**

## CORS 与 Vary: Origin

在讨论与 `Vary` 关系时，先抛出一个问题：

> [如何避免 CDN 为 PC 端缓存移动端页面](https://q.shanyue.tech/base/http/330.html)

假设有两个域名访问 `static.shanyue.tech` 的跨域资源

1. `foo.shanyue.tech`，响应头中返回 `Access-Control-Allow-Origin: foo.shanyue.tech`
1. `bar.shanyue.tech`，响应头中返回 `Access-Control-Allow-Origin: bar.shanyue.tech`

看起来一切正常，但平静的水面下波涛暗涌:

**如果 `static.shanyue.tech` 资源被 CDN 缓存，`bar.shanyue.tech` 再次访问资源时，因缓存问题，因此此时返回的是 `Access-Control-Allow-Origin: foo.shanyue.tech`，此时会有跨域问题**

此时，`Vary: Origin` 就上场了，代表为不同的 `Origin` 缓存不同的资源，这在各个服务器端 CORS 中间件也能体现出来，如以下几段代码

此处是一段 koa 关于 CORS 的处理函数: 详见 [koajs/cors](https://github.com/koajs/cors/blob/master/index.js#L54)

``` js
return async function cors(ctx, next) {
  // If the Origin header is not present terminate this set of steps.
  // The request is outside the scope of this specification.
  const requestOrigin = ctx.get('Origin');

  // Always set Vary header
  // https://github.com/rs/cors/issues/10
  ctx.vary('Origin');
}
```

此处是一段 Go 语言关于 CORS 的处理函数: 详见 [rs/cors](https://github.com/rs/cors/blob/be1c7e127af9fce006600894df5c5731d99cdc82/cors.go#L268)

``` go
func (c *Cors) handleActualRequest(w http.ResponseWriter, r *http.Request) {
	headers := w.Header()
	origin := r.Header.Get("Origin")

	// Always set Vary, see https://github.com/rs/cors/issues/10
  headers.Add("Vary", "Origin")
}
```

进一步改进相关代码：

``` js
// 获取 Origin 请求头
const requestOrigin = ctx.get('Origin');

// 不管有没有跨域都要设置 Vary: Origin
ctx.set('Vary', 'Origin')

// 如果没有设置，说明没有跨域，跳过
if (!requestOrigin) {
  return await next();
}

// 设置响应头
ctx.set('Access-Control-Allow-Origin', requestOrigin)
```

**那此时是不关于 `CORS` 的问题就解决了？从中间件处理层面是这样的，但仍然有一些服务端中间件使用问题及浏览器问题**

## HSTS 与 CORS

HSTS (HTTP Strict Transport Security) 为了避免 HTTP 跳转到 HTTPS 时遭受潜在的中间人攻击，由浏览器本身控制到 HTTPS 的跳转。如同 CORS 一样，它也是有一个服务器的响应头来控制

``` txt
Strict-Transport-Security: max-age=5184000
```

此时浏览器访问该域名时，会使用 `307 Internal Redirect`，无需服务器干涉，自动跳转到HTTPS请求。

**如果前端访问 HTTP 跨域请求，此时浏览器通过 HSTS 跳转到 HTTPS，但浏览器不会给出相应的 CORS 响应头部，就会发生跨域问题。**

``` txt
GET / HTTP/1.1
Host: shanyue.tech
Origin: http://shanyue.tech
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36

Access to XMLHttpRequest at 'xxx' from origin 'xxx' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 服务器异常处理与跨域异常

当与其他中间件一起工作时，也有可能出现问题，由于不正确的执行顺序也可能导致跨域失败。

假设有一个参数校验中间件，置于 CORS 中间件上方，由于校验失败，并未穿过 CORS 中间件，在前端会报错跨域失败，真正的参数校验问题掩盖其中。

``` js
const Koa = require('koa')
const app = new Koa()
const cors = require('@koa/cors')

// 异常处理中间件
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    ctx.body = 'hello, error'
  }
})

// 某一个特定时刻肯定会报错的中间件
app.use(async (ctx, next) => {
  throw new Error('hello, world')
})

// CORS 中间件
app.use(cors())

app.listen(3000)
```

## 总结

本篇文章介绍了跨域问题及其相应的 CORS 解决方案，并列出了若干细节问题。

1. CORS 通过服务器端设置若干响应头来正常工作
1. `Access-Control-Allow-Origin: *` 无法携带 Cookie，因此以此为多域名跨域设置有缺陷
1. 服务器端通过响应头 `Origin` 来判断是否为跨域请求，并以此设置多域名跨域，但要加上 `Vary: Origin`
1. 在编码过程中要注意 HSTS 配置及服务器的中间件顺序带来的潜在风险
