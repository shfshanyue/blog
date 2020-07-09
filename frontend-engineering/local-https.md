date: 2020-07-09 20:41

---

# 在本地环境为前端项目配置 https

在使用某些 html API 时，`https` 是前置必须项，这要求我们在本地开发环境也能够配置 `https`。否则你要每次部署到测试环境才能预览效果，这对开发的敏捷度造成了极大的干扰。

如果能够在本地环境生成证书，这将开发体验提供极大的便利及舒适度。

## 关于证书

关于 https 的原理，有很多篇文章对此有极其详尽的介绍，然而在实践过程中最后都要落地为几个文件

1. `cert-file`
1. `key-file`

以及 `CA`，给证书提供安全性保障的机构，当然也可自制。

对于个人及一些企业的证书会使用 `Let's Encrypt` 制作，只要一个 `ACME` 简单配置即可搞定。对于本地环境下的 `https` 如此操作就显得大费周章且无必要了。

另外一种方式是使用 `openssl` 配置本地证书，自建 Root CA。不过这对于不熟悉 `https` 及一些简易命令行的人而言，简直是无字天书级别的操作。

**凡是复杂且常见的需求，必有人开发出更简单的工具解放生产力，必有成熟的解决方案占领市场。**

简化证书制作的工具就是 [mkcert](https://github.com/FiloSottile/mkcert)

## 使用 mkcert

[mkcert](https://github.com/FiloSottile/mkcert) 是一个用 GO 写的零配置专门用来本地环境 https 证书生成的工具。

``` bash
# 本地安装 CA
$ mkcert -install
Created a new local CA at "/Users/shanyue/Library/Application Support/mkcert" 💥
The local CA is now installed in the system trust store! ⚡️
The local CA is now installed in the Firefox trust store (requires browser restart)! 🦊

$ mkcert local.shanyue.tech
Using the local CA at "/Users/xiange/Library/Application Support/mkcert" ✨

Created a new certificate valid for the following names 📜
 - "local.shanyue.tech"

The certificate is at "./local.shanyue.tech.pem" and the key at "./local.shanyue.tech-key.pem" ✅
```

通过 cert 最终会成功安装 CA，并生成 `cert` 及 `key`，文件目录如下

``` js
{
  cert: './local.shanyue.tech.pem',
  key: './local.shanyue.tech-key.pem'
}
```

## 在 webpack 中配置 https

如果你使用了 `webpack`，那恭喜你，配置 `https` 只需要在 `devServer` 处添加两行代码。

``` js
module.exports = {
  //...
  devServer: {
    https: true,
    key: fs.readFileSync('/path/to/server.key'),
    cert: fs.readFileSync('/path/to/server.crt')
  }
};
```

## 在 node server 中配置 https

如果你的前端项目是通过 `express` 读取静态文件启动，那这就稍微有点麻烦

此时在 `http server` 中开启 https，需要使用到 `https` 模块，如下所示

``` js
import path from 'path'
import fs from 'fs'
import express from 'express'
import http from 'http'
import https from 'https'

const app = express();

const cred = {
  key: fs.readFileSync(path.resolve(__dirname, '../key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert.pem'))
}
const httpServer = http.createServer(app)
const httpsServer = https.createServer(cred, app)

httpServer.listen(8000);
httpsServer.listen(8888);
```

而对于 `webpack-dev-server`，仔细阅读源码就能过发现它的原理也是如此，详见代码 [webpack-dev-server:/lib/Server.js](https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L677)

``` js
const http = require('http');
const https = require('https');

if (this.options.https) {
  if (semver.gte(process.version, '10.0.0') || !isHttp2) {
    this.listeningApp = https.createServer(this.options.https, this.app);
  } else {
    // The relevant issues are:
    // https://github.com/spdy-http2/node-spdy/issues/350
    // https://github.com/webpack/webpack-dev-server/issues/1592
    this.listeningApp = require('spdy').createServer(
      this.options.https,
      this.app
    );
  }
} else {
  this.listeningApp = http.createServer(this.app);
}
```

## 总结

本篇文章讲解了以下几个点

1. 在本地环境可以通过 `mkcert` 制作证书
1. webpack 中如何配置证书及其原理
1. Node 原生 http server 如何配置证书