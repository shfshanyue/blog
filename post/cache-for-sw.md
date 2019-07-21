# Service Worker 实践与在 create-react-app 中所遇到的问题解决方案

## 缓存策略

`workbox` 是 google 出的关于 service worker 生成预缓存列表，缓存策略，Background API 的一个库，综合了自家以前 `sw-toolbox` 以及 `sw-precache` 的功能。

`workbox` 介绍了几种缓存策略，[workbox-strategies](https://developers.google.com/web/tools/workbox/modules/workbox-strategies)。

`Service Worker Cookbook` 也对这几种缓存策略做了介绍，[caching-strategies](https://serviceworke.rs/caching-strategies.html)。

但是关于这些策略的原理以及如何使用，**强烈推荐**谷歌开发者文档中的 [离线指南](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/)。

<!--more-->

使用缓存，我们都会关心浏览器会提供多达的存储空间，以下代码可以查看你的应用已使用了多少存储空间以及有多大的配额

```javascript
navigator.storage.estimate().then(info => console.log(info.quota, info.usage))
```

另外也可以在 chrome 的 devtool 中进行查看，Application -> clear storage -> usage

## Service Worker in React

如果项目采用 `create-react-app` 脚手架搭建，内置了 `sw-precache-webpack-plugin` 这个离线化插件，于是就对它做了一些适配。它是基于 google 的 [sw-precache](https://github.com/GoogleChrome/sw-precache) 的一个插件。

如果你们项目没有使用 `create-react-app`，建议使用 `workbox` 的 webpack Plugin，[workbox](https://workboxjs.org/) 也是 google 新出的关于 service-worker 的工具。

如果你们的静态资源不在 CDN 上，Create React APP 已帮你写好了 webpack 的配置。

如果静态资源在 CDN 上，就要略微折腾一番了。

## 静态资源在 CDN 上

`/index.html` 与 `/sw.js` 需要在同域下，引用 `/sw.js` 时需要注意去掉 `PUBLIC_PATH (webpackConfig.output.publicPath)` 的前缀。

另外 `sw-precache-webpack-plugin` 生成 preCache 列表时，也会对 `/index.html` 添加上 `PUBLIC_PATH` 的前缀，需要替换掉，配置如下。其中 paths.appBuild 为 `webpackConfig.output.path`

```javascript
{
  ...config,
  mergeStaticsConfig: true,
  stripPrefixMulti: {
    [`${paths.appBuild}/index.html`]: '/index.html'
  }
}
```

以下是对于为何如此操作的源码分析

关于 `stripPrefixMulti` ，可以查看 `sw-precache` 的文档，[sw-precache#stripprefixmulti-object](https://github.com/GoogleChromeLabs/sw-precache#stripprefixmulti-object)。主要是处理 precache 文件的前缀的，如以下 [源码](https://github.com/GoogleChromeLabs/sw-precache/blob/5.2.1/lib/sw-precache.js#L170)

```javascript
// https://github.com/GoogleChromeLabs/sw-precache/blob/5.2.1/lib/sw-precache.js#L170
var relativeUrl = fileAndSizeAndHash.file
  .replace(
    new RegExp('^(' + Object.keys(params.stripPrefixMulti)
        .map(escapeRegExp).join('|') + ')'),
    function(match) {
      return params.stripPrefixMulti[match];
    })
  .replace(path.sep, '/');
```

可以看出来它用来替换特定前缀。

而 `sw-precache-webpack-plugin` 中已经对它做了一些处理，查看 [源码](https://github.com/goldhand/sw-precache-webpack-plugin/blob/v0.11.5/src/index.js#L119)

```javascript
// https://github.com/goldhand/sw-precache-webpack-plugin/blob/v0.11.5/src/index.js#L119
if (outputPath) {
  // strip the webpack config's output.path (replace for windows users)
  stripPrefixMulti[`${outputPath}${path.sep}`.replace(/\\/g, '/')] = publicPath;
}
```

它把 precache 文件列表的前缀全部替换为了 publicPath (即 webpackConfig.output.publicPath)，但是 `/index.html` 不能在 cdn 的路径上，所以需要特殊配置一下。

```javascript
stripPrefixMulti: {
  [`${paths.appBuild}/index.html`]: '/index.html'
}
```

根据正则的短路原则，刚好可以把 index.html 给替换回来。

```javascript
'hello, world'.replace(/(hello, world)|(hello)/, 'shanyue')    // shanyue
```

## 动态缓存 API

对于静态资源，采取了所有静态资源添加hash，除部署后第一次外均不需再访问服务器。

如果这里采用 workbox 的术语的话，那么静态资源则是采用了 `Cache-First` 的策略，当缓存不可取时才回退到网络，而对于动态 API，则采用 `Network-First` 的策略，只有在离线状态下才使用缓存。

当然，如果你只想使用 service worker 做缓存控制的话，API 缓存就可以跳过了。

以下代码是 `sw-precache-webpack-plugin` 的配置，动态缓存利用了 google 的 `sw-toolbox` 工具，它提供了如 workbox 一样的缓存策略。

```javascript
{
  runtimeCaching: [{
    urlPattern: /api/,
    handler: 'networkFirst'
  }]
}
```

## 缓存 GraphQL query

GraphQL 的 query 是使用 http 的 POST 请求进行发送的，而 service worker 不支持对 POST 请求进行缓存。

[Replaying POST requests by w3c@ServiceWorker](https://github.com/w3c/ServiceWorker/issues/693)

其实一想很正常，POST 是非幂等的，连 http 也不对它进行缓存。

GraphQL 的 query 支持 GET 请求，修改为 GET 是可行的。另外一种方案是使用 [apollo-cache-persist](https://github.com/apollographql/apollo-cache-persist) 对访问过的数据进行持久化。

## 部署

关于前端项目在生产环境中部署的问题是一个比较工程化的问题，关于具体实现方案简单来说是如下两点

1. 先部署资源，每次部署对静态资源添加 hash 到文件名中，带有hash的资源添加超长时间缓存(Cache-Control: public, max-age=31536000)，不带hash的资源配置 Etag，并配置 Cache-Control: no-cache
2. 再部署页面，并配置 Cache-Control: no-cache

可以参考以下两篇文章

+ [Make use of long-term caching](https://developers.google.com/web/fundamentals/performance/webpack/use-long-term-caching)
+ [大公司里怎样开发和部署前端代码？](https://github.com/fouber/blog/issues/6)

但是有了 Service Worker 之后有如下几个好处

1. 部署资源与部署页面顺序可以不严格控制 (还是严格控制比较好一些)
  假设先部署页面，后部署资源，用户进入了新页面，但是资源没有更新，这时候 Service Worker 会在 install 事件中，由于无法找到新的资源而导致 install 失败，资源进行回退。
2. 节省带宽
  以前用户每次访问页面，需要向服务器请求 /index.html 与一切不带 hash 的资源，现在所有的资源都被 sw-toolbox 或者 workbox 加上了指纹，每次只需要请求 /sw.js。

注意要对 /sw.js 设置 `Cache-Control: no-cache`。

## 对比 http 缓存

http 的缓存策略虽然是把静态资源缓存在浏览器中，但是缓存行为的控制却是在服务端的 - 如 http response 中的 Cache-Control。而 service worker 对缓存资源的控制权完全在浏览器手中，并且可以通过编程精度控制静态资源，动态请求的数据等。

但是这不代表 service worker 可以完全控制 http 进行缓存控制，因为 http 不仅仅缓存在浏览器中，还有代理缓存中。

在 http 的 Cache-Control 中有两个参数，private 和 public。private 代表不被 proxy 所缓存，区别详细如下

[Private vs Public in Cache-Control](https://stackoverflow.com/questions/3492319/private-vs-public-in-cache-control)
