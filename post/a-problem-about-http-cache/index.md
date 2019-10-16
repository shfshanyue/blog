---
title: 关于 http 缓存的一个小问题以及引发的思考
keywords:
  - http
  - service worker
  - lm factor
date: 2019-03-15
categories:
  - 后端
tags:
  - service worker
  - http
---

> 本文地址 [http://shanyue.tech/post/a-problem-about-http-cache/](https://shanyue.tech/post/a-problem-about-http-cache/)

## 问题回顾

前几天，写了一篇博客，[浏览器中的二进制](https://shanyue.tech/post/binary-in-frontend/)，其中总结了一张图。

<!--more-->

![前端中二进制的转换](https://shanyue.tech/post/binary-in-frontend/transform.jpg)

后来，我对图片做了一些更改，又发布了上去。这时候问题出现了，图片没有更新！

比没有缓存更严重的问题是缓存了不该缓存的东西！

我研究了下该图片的 Request/Response 信息，总结如下

1. 图片从缓存中取，没有走网络流量，显示 from memory cache
1. 响应头设置了 ETag 
1. 响应头没有设置 Cache-Control，以及 Expires

> 现在再来看文章开头那张图，如果这是一段面试题，第二次请求图片资源应该是哪种缓存策略

## LM factor 算法

> 再抛出一个问题，如何得出某资源的最后更新时间以及本次请求资源所生成的时间

先熟悉以下两个 Response Header

+ Date
+ Last-Modified

从这两个头可以计算出资源已经多久没有更新了。

**LM factor 算法在没有 Cache-Control 以及 Expires 的时候，用来计算应该强制缓存多长时间。**

算法大致介绍如下，如果本次请求资源，发现没有关于强制缓存的配置，而且该资源最后一次修改是在 10 小时以前，那么就对它设置 10 * factor 个小时的缓存。factor 即 LM factor，设置为 (0, 1)。

## 问题总结

如果你不设置 Cache-Control 的话，那你的资源很危险，用户可能正在访问已过期的资源！

另外，在对你的应用进行二次刷新时，你大部分资源都进了缓存，加载速度很快。先不要高兴太早，有可能不是你缓存设置得好，更有可能是你压根就没设置缓存。

**一言蔽之，无论如何，要主动设置 Cache-Control，不要让浏览器替你做决策**

## 问题解决

找到了问题所在，只需添加一个响应头 `Cache-Control: no-cache;` 就可以解决问题。

> no-cache 代表需要每次校验资源的新鲜度，来决定是否从缓存中取
> no-store 代表从不存缓存

由于博客没有能做长期缓存的资源，统一对博客的所有请求添加了响应头 `Cache-Control: no-cache`。我使用了 `Traefik` 作为反向代理，修改 docker-compose.yml 如下

``` yaml
version: "3"
services:
  blog:
    build:
      context: .
    restart: always
    labels:
      - "traefik.frontend.rule=Host:shanyue.tech"
      - "traefik.frontend.headers.customResponseHeaders=Cache-Control:no-cache"
```

再次部署后，图片缓存的问题已经解决。

## 缓存策略设置

这时再思考一个项目的缓存策略设置

> 图片总结如下，参考谷歌开发者文档 https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#defining_optimal_cache-control_policy

![如何设置资源的缓存策略](https://shanyue.tech/post/a-problem-about-http-cache/http-cache-hierarchy.png)

而我的缓存策略简单总结如下

+ 对于带指纹信息的资源设置永久缓存
+ 对于不带指纹信息的资源设置 ETag 每次校验新鲜度

## 使用 Service Worker 增强缓存

> 如果 304 过多怎么办

如果不带指纹的资源过多，又需要资源保障实时的新鲜度如何处理。这么一大堆资源每次去向服务器比对 ETag，服务器也是很烦的，毕竟也会消耗一些 CPU。

这时候可以考虑使用 service worker 做缓存增强。

1. 使用 workbox 自动生成 sw.js
1. sw.js 对所有资源打一个 hash 戳，维护一个文件与hash的键值对清单，并使用 Cache API 对所有资源做永久缓存。
1. sw.js 每次请求需要校验新鲜度
1. 当静态资源有所更改，sw.js 维护的键值对清单发生变化，sw.js 会获取到新的资源

此时，只需要 sw.js 每次校验新鲜度，而无需一大堆文件都去校验新鲜度了
