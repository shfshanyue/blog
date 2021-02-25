---
title: 使用 Vercel 托管你的 API 服务
date: 2020-12-06 23:40
tags:
  - devops
loc: 宜昌伍家岗区

---

# 使用 Vercel 托管你的 API 服务

`Vercel`，官网 <https://vercel.com>，如同 `Netlify` 一般，可以提供免费的前端应用托管及 Serverless Functions，甚至对开发者更加亲和与友好。

以下截图，可见一斑: **当你部署前端应用时，它能够根据你使用的技术栈而自动设置构建命令及输出目录**

![使用vercel导入项目](./assets/vercel-import.png)

`Vercel` 团队为了更好地推广他们的云服务，在开源中做了众多贡献，甚至盛名在外，以下几个 npm package 你即使没有使用过，但肯定会有所耳闻：

+ [next.js](https://github.com/vercel/next.js): 基于 React 的框架，也有可能是最好用的 SSR 方案
+ [swr](https://github.com/vercel/swr): 基于 React hooks 的数据请求库，可最大限度地充分利用缓存，并实现*乐观 UI*
+ [serve](https://github.com/vercel/serve): 适用于本地用于测试的静态文件托管服务

我们可以使用 `Vercel`/`Netlify`/`AliOSS` 以及各大云厂商的一些 Serverless 产品来几乎零成本地部署前端应用，但是**偶尔也需要配套一些简单的 API 支持**。这个时候如果购买一台云服务器，就是杀鸡焉用宰牛刀了。

对于一款轻量的 API 服务，你可以选择各大云厂商的 Serverless 产品，但这里更推荐 `Vercel`。`Vercel` 相对而言，学习成本低，部署方便，开源项目众多，更易上手，本篇文章介绍如何使用 `Vercel` 来部署 API 服务

## hello, world

本地项目新建 `/api/index.js`，文件内容如下，*标准的 HTTP Handler 的语法*，只要你熟悉 `http` 模块，就可以很快上手:

``` js
module.exports = (req, res) => {
  const { name = 'World' } = req.query
  res.send(`Hello ${name}!`)
}
```

**文件编辑后，把代码上传到 Github，并打开 Vercel 控制台托管 Github 中的该项目，该 API 部署成功。**

虽然很简单，但是也有可能出错，以下是源码及演示地址:

+ 源码: <https://github.com/shfshanyue/vercel-api>
+ 演示地址: <https://vercel-api.shanyue.vercel.app/api?name=shanyue>

以上是使用 `Node` 作为运行时的代码，但其实它还可以使用以下编程语言:

+ Node
+ Go
+ Python
+ Ruby

Runtime 拥有更多的 API 及配置，可见文档：

[Vercel Runtimes](https://vercel.com/docs/runtimes#official-runtimes/node-js)

## JSON API 与 Vercel Node Helper

后端作为数据提供者，一般以 Rest API 为标准并返回 JSON 数据，而前端解析数据并渲染页面。

``` js
module.exports = (req, res) => {
  res.json({
    json: true
  })
}
```

+ 演示地址: <https://vercel-api-shanyue.vercel.app/api/json>

在 vercel 中通过 `res.json(obj)` 来返回 JSON 数据，像这样的简单方便的函数并不为原生的 [HTTP Handler](https://nodejs.org/api/http.html) 所提供。而由 vercel 提供的 [Node.js Helper](https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects) 实现:

+ `req.query`: An object containing the request's query string, or {} if the request does not have a query string.
+ `req.cookies`: An object containing the cookies sent by the request, or {} if the request contains no cookies.
+ `req.body`: An object containing the body sent by the request, or null if no body is sent.
+ `res.status(code)`: A function to set the status code sent with the response where code must be a valid HTTP status code. Returns res for chaining.
+ `res.send(body)`: A function to set the content of the response where body can be a string, an object or a Buffer.
+ `res.json(obj)`: A function to send a JSON response where obj is the JSON object to send.
+ `res.redirect(url)`: A function to redirect to the URL derived from the specified path with status code "307 Temporary Redirect".
+ `res.redirect(statusCode, url)`: A function to redirect to the URL derived from the specified path, with specified HTTP status code.

## 本地调试

TODO
## Router: Rewrite 与 Redirect

部署完成后，默认的路由路径是 `/api`，此时 `/` 会*显示文件目录*，如果想更好地扩展路由呢？

通过配置文件 `vercel.json` 配置 `Rewrites/Redirects` 可完成此功能

``` json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/api"
    }
  ]
}
```

## 小而有创意的 API

由于 `Vercel` 这个 API 的本质也是 `Serverless`，最适合做一些轻量的若存储的服务。我也收集了一些小而有创意的服务，如下所列

+ [github-readme-stats](https://github.com/anuraghazra/github-readme-stats): Github Readme 的统计数据图表
+ [shields.io](https://github.com/badges/shields): 设计各种漂亮的 Badge
+ [qrcode api](http://goqr.me/api/): 生成二维码
+ [imageproxy](https://github.com/willnorris/imageproxy): 一个对图片进行处理的服务，也可以用来反防盗链
+ [avatar api](https://github.com/itsthatguy/avatars-api-middleware): 生成指定或随机的头像