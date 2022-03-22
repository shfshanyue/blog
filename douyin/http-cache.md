# HTTP Cache

大家好，我是山月。

在 HTTP 中，可通过控制 http 响应头，来控制 http 客户端的资源缓存。

可分为两大类，强缓存和协商缓存。

强缓存通过响应头 Cache-Control 中 max-age 等指令进行控制。

max-age 可设置强缓存时间周期，在该周期内，将直接从客户端缓存获取资源，而不会向服务器发送请求。

协商缓存通过响应头 ETag 与 Last-Modified 进行控制。

它每次发送请求时，需要进行缓存新鲜度校验，如果资源过旧，将直接从响应中获取，否则从客户端缓存中进行获取。

新鲜度校验，通过请求头 If-None-Match 与响应头 ETag 进行对比，或者请求头 If-Modified-Since 与响应头 Last-Modifed 进行对比。

一般来说，我们对经构建工具打包后，带有 hash 的资源进行一年的强缓存。

而对不带 hash 的资源进行协商缓存控制，注意协商缓存需配置 Cache-Control 为 max-age=0，或者 no-cache。

否则一个没有设置 Cache-Control 的静态资源，将会根据 Date 与 Last-Modified，计算出强缓存时间。

我们可以通过谷歌浏览器中开发者工具中的网络面板，查看其 Javascript、CSS 等资源的响应头，来确认是否配置了正确的缓存策略。
