---
date: 2021-02-17 14:30
title: 如何找到一个合适的 NPM 轮子 - 关于 NPM Package 的 API 及 API 扩展
---

# 这几个网站帮你找到一个合适的高质量 npm 轮子

<npmjs.com> 是 npm 的官方仓库，目前已经有 150+ 万个仓库发布在了 <npmjs.com>，数量巨大也造就了 package 的参差不齐，这里整理了一些 npm package 各个维度的 API，方便多维度分析 package。

很多新入行的同学喜欢搞高仿版的抖音或者美团，这里提供一个新的思路，有兴趣的同学可以基于此搞一个 <npmjs.com> 的高仿版或者加强版。

以下列举了几个网站及其 API:

+ npmjs.com
+ npms.io
+ unpkg.com
+ bundlephobia.com
+ yarnpkg.com

## NPM Official API: npmjs.com

+ 官网: <https://npmjs.com>

这是 `npm` 的官方 API，但不对外提供服务，因此也没有文档。第三方客户端请求需要**设置代理处理跨域问题**

## Yarn Official API: yarnpkg.com

+ 官网: <https://yarnpkg.com/>
+ API: <https://ofcncog2cu-3.algolianet.com/1/indexes/*/queries>

`Algolia`

### Search Package List

``` bash
curl 'https://www.npmjs.com/search?q=keywords:front-end&page=0&ranking=optimal' -H 'x-spiferack: 1'
```

> 注: x-spiferack 是必须的字段

### Package Info

``` bash
curl 'https://www.npmjs.com/package/ms' -H 'x-spiferack: 1'
```

> 注: x-spiferack 是必须的字段

Response 重要字段:

+ `downloads`: 每周下载数据
+ `readme.data`: 文档
+ `packageVersion.devDependencies`
+ `packageVersion.dependencies`
+ `packageVersion.typings`: 是否支持 TS
+ `packument.name`
+ `packument.description`
+ `packument.homepage`
+ `packument.repository`
+ `packument.version`
+ `packument.versions`: 各个版本及大小

## snyk

Learn more about axios: package health score, popularity, security, maintenance, versions and more.

## NPM Unoffical API: npms.io

该 API 在 `https://api.npms.io/v<version>` 下提供服务，当前版本是 v2

由于对官方 API 的不满意，`npmsio` 借助 `ElasticSearch` 单独整了个 API，并提供更好的搜索体验。

## UNPKG API: unpkg.com

UNPKG 是一个服务于 NPM 仓库的 CDN，用以快速使用发送请求的方式加载文件。另外，还提供一些基础信息查询的 API

官方文档: <https://unpkg.com/>

![](./assets/pkg-search.jpg)

### Meta

``` bash
$ curl https://unpkg.com/react@17.0.1/index.js?meta | jq
{
  "path": "/index.js",
  "type": "file",
  "contentType": "application/javascript",
  "integrity": "sha384-uYepeL3qyzb/7G5T1fizoxPoKmV6ftFXdz4jeQlBff4HqMuNVJPqiNjvN38BeHUk",
  "lastModified": "Sat, 26 Oct 1985 08:15:00 GMT",
  "size": 190
}
```

## BundlePhobia API: bundlephobia.com

用以查询一个 package 的打包体积有多大

``` bash
$ curl 'https://bundlephobia.com/api/size?package=react@17.0.1' | jq
{
  "assets": [
    {
      "gzip": 2908,
      "name": "main",
      "size": 7128,
      "type": "js"
    }
  ],
  "dependencyCount": 2,
  "dependencySizes": [
    {
      "approximateSize": 6320,
      "name": "react"
    },
    {
      "approximateSize": 1236,
      "name": "object-assign"
    }
  ],
  "description": "React is a JavaScript library for building user interfaces.",
  "gzip": 2908,
  "hasJSModule": false,
  "hasJSNext": false,
  "hasSideEffects": true,
  "name": "react",
  "repository": "https://github.com/facebook/react.git",
  "scoped": false,
  "size": 7128,
  "version": "17.0.1"
}
```
