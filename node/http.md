# 一个简单的 HTTP Server

> 本文涉及到以下库及模块:
> + [mime](https://npm.devtool.tech/mime): 解析 MIME TYPE
> + [mime-types](https://npm.devtool.tech/mime-types)
> + [parseurl](https://npm.devtool.tech/parseurl): 用以解析 URL。同时也可使用原生模块 url。
> + [qs](https://npm.devtool.tech/qs): 用以接续 querystring。同时也可使用原生模块 querystring，但已被废弃，推荐使用 URLSearchParams。
> + [raw-body](https://npm.devtool.tech/raw-body): 用以解析 body。

一个服务端框架是对 HTTP 协议的高级封装，是对 HTTP 报文的解析与处理。因此，学习 Node Server 的第一步，从一个 HTTP 报文开始。

## HTTP 报文

以下是对百度发起请求的简单 HTTP 报文格式，使用 `nc` 命令行工具可以从 HTTP 报文发起连接请求，接收响应。

``` bash
$ nc www.baidu.com 80
GET / HTTP/1.1
Hostname: www.baidu.com

HTTP/1.1 200 OK
Accept-Ranges: bytes
Cache-Control: no-cache
Connection: keep-alive
Content-Length: 14615
Content-Type: text/html
Date: Sun, 04 Jul 2021 05:26:21 GMT
P3p: CP=" OTI DSP COR IVA OUR IND COM "
P3p: CP=" OTI DSP COR IVA OUR IND COM "
Pragma: no-cache
Server: BWS/1.1
Set-Cookie: BAIDUID=062BC32733955287CAD249DFFA961C83:FG=1; expires=Thu, 31-Dec-37 23:55:55 GMT; max-age=2147483647; path=/; domain=.baidu.com
Set-Cookie: BIDUPSID=062BC32733955287CAD249DFFA961C83; expires=Thu, 31-Dec-37 23:55:55 GMT; max-age=2147483647; path=/; domain=.baidu.com
Set-Cookie: PSTM=1625376381; expires=Thu, 31-Dec-37 23:55:55 GMT; max-age=2147483647; path=/; domain=.baidu.com
Set-Cookie: BAIDUID=062BC3273395528798622D3D30510E2B:FG=1; max-age=31536000; expires=Mon, 04-Jul-22 05:26:21 GMT; domain=.baidu.com; path=/; version=1; comment=bd
Traceid: 1625376381035471002611003607825099517305
Vary: Accept-Encoding
X-Ua-Compatible: IE=Edge,chrome=1

<!DOCTYPE html><!--STATUS OK-->
<html>
<head>
        <meta http-equiv="content-type" content="text/html;charset=utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=Edge">
        <link rel="dns-prefetch" href="//s1.bdstatic.com"/>
        <link rel="dns-prefetch" href="//t1.baidu.com"/>
        <link rel="dns-prefetch" href="//t2.baidu.com"/>
        <link rel="dns-prefetch" href="//t3.baidu.com"/>
        <link rel="dns-prefetch" href="//t10.baidu.com"/>
        <link rel="dns-prefetch" href="//t11.baidu.com"/>
        <link rel="dns-prefetch" href="//t12.baidu.com"/>
        <link rel="dns-prefetch" href="//b1.bdstatic.com"/>
        <title>百度一下，你就知道</title>
......
```

我们把报文划分为以下几部分，稍后在 Node Server 中解析

+ Request
  + Method
  + Path
  + HTTP Version
  + Request Header
+ Response
  + Response Status Code
  + Response Header
  + Response Body

## Simple Server: hello, world

在 Node 中编写一个简单的服务端代码非常简单，仅需以下三行即可做到。其中 [http](https://nodejs.org/api/http.html) 是完成此项事情的核心模块。

``` js
const http = require('http')

const server = http.createServer((req, res) => res.end('hello, world'))

server.listen(3000)
```

此时，在浏览器中访问 `http://localhost:3000`，即可看到一个 `hello, world` 的页面。最简单的服务端应用完成了。

``` bash
$ nc localhost 3000
GET / HTTP/1.1

HTTP/1.1 200 OK
Date: Sun, 04 Jul 2021 08:54:45 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 12

hello, world
```

以下是关于 `createServer` 的核心 API，其中 `req` 对应刚开始解析后的请求报文，`res` 对应响应报文的处理与设计，如以上的状态码及几个响应头的处理。

``` ts
function createServer(requestListener?: RequestListener): Server;

type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;

class IncomingMessage extends stream.Readable {
  constructor(socket: Socket);

  aborted: boolean;
  httpVersion: string;
  httpVersionMajor: number;
  httpVersionMinor: number;
  complete: boolean;
  connection: Socket;
  socket: Socket;
  headers: IncomingHttpHeaders;
  rawHeaders: string[];
  trailers: NodeJS.Dict<string>;
  rawTrailers: string[];
  setTimeout(msecs: number, callback?: () => void): this;
  method?: string;
  url?: string;
  statusCode?: number;
  statusMessage?: string;
  destroy(error?: Error): void;
}
```

## JSON API 与 Content-Type

以上仅仅是一个 `hello, world` 的示例，而在实际项目中大部分为 JSON API 的设计。

我们如何响应一个 JSON 数据呢？

为了使地能够正确的发送一个携带中文信息的响应报文，我们进行如下设置:

1. `Content-Type: 'application/json; charset=utf-8'`，响应报文设置为 JSON 格式，编码格式设置为 `utf8` 使得正常显示中文。

``` js
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const data = JSON.stringify({ username: '山月' })
  res.end(data)
})
```

``` bash
$ nc localhost 3000
GET /json HTTP/1.1

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Sun, 04 Jul 2021 11:03:05 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 21

{"username":"山月"}

```

响应 JSON 数据需要设置特殊的 `Content-Type`，被称为 `MIME`。除 JSON 外，图片、视频都有不同的 `MIME Type`，可通过以下量给进行获取。

+ [mime](https://npm.devtool.tech/mime)
+ [mime-types](https://npm.devtool.tech/mime-types)

``` js
> mime.getType('json')
"application/json"

> mime.getType('html')
"text/html"

> mime.getType('svg')
"image/svg+xml"

> mime.getType('jpg')
"image/jpeg"
```

## 如何处理用户输入: URL 与 QueryString 解析

在一个服务端应用中，需要解析请求地址为各种参数，方便调用，如常用的 `hostname`、`path`、`querystring`。

而实际上，当一次请求来临时，我们只可以拿到一个 `req.url`，而其它的参数需要我们自己解析。毕竟自己动手，丰衣足食。URL 可以使用以下库来解析。

+ [parseurl](https://npm.devtool.tech/parseurl): 用以解析 URL。同时也可使用原生模块 url。
+ [qs](https://npm.devtool.tech/qs): 用以接续 querystring。同时也可使用原生模块 querystring，但已被废弃，推荐使用 URLSearchParams。

这两类是服务端常用的库，在一般的面试手写代码中也会要求你来手写。

**为了提高性能，各大服务端框架一般使用 `get/set` 进行延时计算**。以下为 koa 源码

``` js
const request = {
  get path() {
    return parse(this.req).pathname;
  },
  set path(path) {
    const url = parse(this.req);
    if (url.pathname === path) return;

    url.pathname = path;
    url.path = null;

    this.url = stringify(url);
  },
  get query() {
    const str = this.querystring;
    const c = this._querycache = this._querycache || {};
    return c[str] || (c[str] = qs.parse(str));
  },
  set query(obj) {
    this.querystring = qs.stringify(obj);
  },
}
```

## 如何处理用户输入: Request Body 解析

在 JSON API 中作为输入传参，除了通过在 URL 上进行传参外，最流行最通用最安全的

在 Node Server 中，我们的 `HTTP Request` 基于 `Readable Stream`，因此对请求体(Request Body)的解析有可能并不是一件很简单的事情，需要涉及到读取流、编码、解析格式、、gzip 解压缩、异常处理、体积过大413处理等。

即使最简单的处理，也需要涉及到以下代码。

``` js
const server = http.createServer((req, res) => {
  let body = ''
  req.on('data', chunk => body += chunk)
  req.on('end', () => {
    data = body
    res.end(data)
  })
})
```

**好在有一个 Body 解析神器: [raw-body](https://npm.devtool.tech/raw-body)。最受欢迎的 Node 服务端框架 Express 与 Koa 都是基于 raw-body 对请求体进行解析。**

``` js
const server = http.createServer((req, res) => {
  getRawBody(req)
    .then((body) => {
      res.statusCode = 200
      res.end(body)
    })
    .catch((err) => {
      res.statusCode = 500
      res.end(err.message)
    })
})
```

在 JSON API 中，即使响应体是基于 JSON 的，但是对于请求体的格式还是有多种多样的，比如最常见的以下几种：

+ `application/www-form-url-encoded`
+ `application/json`
+ `multipart/form-data`
+ `text/plain`

对不同 MIME 的请求体应如何处理，我们在下一篇文章中进行分析！

此时，服务端即可以通过请求 URL 中所携带的 QueryString 及 Request Body 进行输入，并返回相应的响应体。

## 细数 Node 服务端框架

+ Express
+ Koa
+ Hapi
+ Nest
+ Fastify
+ Micro

## 总结

本篇文章从一段 HTTP 报文信息开始理解服务端，根据以下步骤最终理清从请求到响应的整个处理流程：

1. 开始写第一个 Node 的 `hello, world` 版本服务端代码。无论任何请求，响应数据总是 `hello, world`。
1. 开始写第一个 Node 的 JSON API 式服务端代码，加强版的 `hello, world`。无论任何请求，响应数据总是一个 JSON，并通过响应头 `Content-Type` 设置响应体类型。
1. 通过解析请求报文的 URL 及 QueryString，解析输入，并响应相应的输出。
1. 通过解析请求报文的 Body，解析输入，并响应响应的输出。

那下一步呢？

1. 如何解析路由，作为请求的输入
1. 解析 Body 时有哪些细节问题
1. JSON API 最后一步的必要步骤序列化如何更加高效
