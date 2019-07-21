# http 缓存问题与 LM Factor 算法

前几天写了一篇博客，[浏览器中的二进制](../binary-in-frontend/)，其中使用 [draw.io](draw.io) 总结了一张图，并且附在了我的博客里。

![前端中二进制的转换](../binary-in-frontend/transform.jpg)

<!--more-->

后来，我对图片做了一些更改，但是命名未发生改变，又重新部署了博客。

**这时候问题出现了，图片并没有更新！**

**比没有缓存更严重的问题是缓存了不该缓存的东西！** 前者属于性能优化，而后者可能就属于故障了，使你不厌其烦地充当客服工作。有时就是这样，性能优化时会增进复杂度，而增加复杂度就会引来新的问题。一切都需要权衡。

关于 http 的问题，则应该专注于它的报文信息。我研究了下该图片的 `Request`/`Response` 信息，总结为以下三点

1. 图片从缓存中获取，没有走网络流量，显示 `from memory cache`
1. 响应头设置了 ETag 与 Last-Modified
1. 响应头没有设置 Cache-Control，以及 Expires

## LM factor 算法

> 如何得出某资源的最后更新时间以及本次请求资源所生成的时间

先熟悉以下两个 Response Header

+ `Date`: 报文在源服务器的产生时间
+ `Last-Modified`: 资源在源服务器的上次修改时间

从这两个头可以计算出资源已经多久没有更新了。

**LM factor 算法在没有 Cache-Control 以及 Expires 的时候，用来计算应该强制缓存多长时间。**

算法大致介绍如下：对于本次请求资源，如果没有发现关于强制缓存的配置。而且该资源最后一次修改是在 10 小时以前，那么就对它设置 10 * factor 个小时的缓存。

factor 即 LM factor，设置为 (0, 1)。

> 可参考《http 权威指南》

## 问题总结

如果你不设置 `Cache-Control` 的话，那你的资源访问很危险，用户可能正在访问已过期的页面或者图片！

另外，在对你的应用进行二次刷新时，你大部分资源都进了缓存，加载速度很快。先不要高兴太早，有可能不是你缓存设置得好，更有可能是你压根就没设置缓存。

**一言蔽之，无论如何，要主动设置 Cache-Control，不要让浏览器替你做决策**

## 问题解决

找到了问题所在，只需添加一个响应头 `Cache-Control: no-cache;` 就可以解决问题。

> no-cache 代表需要每次校验资源的新鲜度，来决定是否从缓存中取
> no-store 代表从不存缓存

由于博客没有能做长期缓存的资源，统一对博客的所有请求添加了响应头 `Cache-Control: no-cache`。

我使用了 `traefik` 作为反向代理，并使用 `docker-compose` 部署，修改 `docker-compose.yml` 配置文件如下所示

```yaml
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

![如何设置资源的缓存策略](./http-cache-hierarchy.png)

而我的缓存策略简单总结如下

+ 对于带指纹信息的资源设置永久缓存
+ 对于不带指纹信息的资源设置 ETag 每次校验新鲜度

## 使用 Service Worker 增强缓存功能

> 如果 304 过多怎么办

如果不带指纹的资源过多，又需要资源保障实时的新鲜度如何处理。这么一大堆资源每次去向服务器比对 ETag，服务器也是很烦的，毕竟也会消耗一些 CPU。

这时候可以考虑使用 service worker 做缓存增强。

1. 使用 workbox 自动生成 sw.js
1. sw.js 对所有资源打一个 hash 戳，维护一个文件与hash的键值对清单，并使用 Cache API 对所有资源做永久缓存。
1. sw.js 每次请求需要校验新鲜度
1. 当静态资源有所更改，sw.js 维护的键值对清单发生变化，sw.js 会获取到新的资源

此时，只需要 sw.js 每次校验新鲜度，而无需一大堆文件都去校验新鲜度了
