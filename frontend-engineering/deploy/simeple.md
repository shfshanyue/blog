# 关于前端部署的简单理解

在所有人入门编程及学习更多编程语言时，敲下的第一行代码是: 输出 `hello, world`。

初学如何部署前端，如同学习编程一样，第一步先根据最简单页面进行部署。

比如本文，先部署一个最简单 HTML，以下我称它为**hello 版前端应用**

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  hello, shanyue. 
</body>
</html>
```

## HTTP 报文

部署可看做对 HTTP 资源的服务，或者说，是对 HTTP 请求报文的响应。我们写一段服务器代码返回 HTML，便完成了对前端的部署。

以下是对*hello版前端应用*的一段简单的 HTTP 请求及响应报文。

``` bash
# 请求报文
GET / HTTP/1.1
Host: localhost:3000

# 响应报文
HTTP/1.1 200 OK
Content-Length: 133
Content-Disposition: inline; filename="index.html"
Accept-Ranges: bytes
ETag: "f35811a8315e55a02d427abef9b906fca6defedb"
Content-Type: text/html; charset=utf-8
Vary: Accept-Encoding
Date: Fri, 31 Dec 2021 04:19:14 GMT
Connection: keep-alive
Keep-Alive: timeout=5

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  hello, shanyue. 
</body>
</html>
```

## 一段简单的服务器代码

作为前端，以我们最为熟悉的 Node 为例，写一段最简单的前端服务。

该服务监听本地的 3000 端口，并返回我们的*hello 版前端应用*。

``` js
const http = require('node:http')

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  hello, shanyue. 
</body>
</html>`

const server = http.createServer((req, res) => res.end(html))
server.listen(3000, () => {
  console.log('Listening 3000')
})
```

启动服务，并在浏览器端打开 `localhost:3000`，可看见 `hello, shanyue`。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-31/clipboard-3621.529aef.webp)

**恭喜你，部署成功！**

是了，作为前端，你每天借助于 `webpack-dev-server/vite` 都在做着同样的事情。

当然，作为**纯静态资源**，需要我们使用文件系统(fs)去读取资源并将数据进行返回。

``` js
const http = require('node:http')
const fs = require('node:fs')

const html = fs.readFileSync('./index.html')

const server = http.createServer((req, res) => res.end(html))
server.listen(3000, () => {
  console.log('Listening 3000')
})
```

当然，对于前端这类纯静态资源，自己写代码无论从开发效率还是性能而言都是极差的。

因此，有诸多工具专门针对静态资源进行服务，比如 [serve](https://github.com/vercel/serve)

``` bash
$ npx serve .
```

![Creact React APP 构建后，提示使用 serve 进行部署](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-31/clipboard-3980.619061.webp)

**然而，Javascript 的性能毕竟有限，使用 `nginx` 作为静态资源服务器拥有更高的性能。**

但是对于本地环境而言，还是 `serve` 要方便很多啊。

## 部署的简单理解

那什么是部署呢，为什么说你刚才部署成功？

假设此时有一台拥有 IP 地址的服务器，登录上去，使用 `nodejs` 运行刚才的代码，则外网的人可通过 `IP:3000` 访问该页面。

那这可理解为部署，使得所有人都可以访问。

你将服务器作为你的工作环境，通过 `npm run dev` 运行代码，所有人都可访问他，部署成功。看来你离所有人都可访问的部署只差一台服务器。

不管怎么说，你现在已经可以通过裸机(宿主机)部署一个简单的前端应用了。

## 一些疑问

*那为什么还需要 nginx 呢？*

**你需要管理诸多服务(比如A网站、B网站)，通过 nginx 进行路由转发至不同的服务，这也就是反向代理**

当然，如果你不在意别人通过端口号去访问，不用 nginx 等反向代理器也是可以的。

![反向代理](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-31/Nginx.e7035d.webp)

*那在服务器可以 npm run dev 部署吗？*

可以，但是非常不推荐。`npm run dev` 往往需要监听文件变更并重启服务，此处需要消耗较大的内存及CPU等性能。

针对 Typescript 写的后端服务器，不推荐在服务器中直接使用 `ts-node` 而需要事先编译的理由同样如此。

当然，如果你在意性能也是可以的。

*那为什么需要 Docker 部署？*

用以隔离环境。

假设你有三个后端服务，分别用 Java、Go、Node 编写，你需要在服务器分别安装三者的环境，非常麻烦。

假设你有三个 Node 服务，分别用 node10、node12、node14 编写，你需要在服务器分别安装三个版本 nodejs，非常麻烦。

而有了 Docker，就没有这种问题。
