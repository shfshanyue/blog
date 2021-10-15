# 写在 2021 的前端性能优化指南总结

我们把性能优化的方向分为以下两个方面，有助于结构化的思考与系统分析。

1. 加载性能。如何更快地把资源从服务器中拉到浏览器，如 http 与资源体积的各种优化，都是旨在加载性能的提升。
1. 渲染性能。如何更快的把资源在浏览器上进行渲染。如减少重排重绘，rIC 等都是旨在渲染性能的提升。

## 核心性能指标与 Performance API

![web-vitals](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/web-vitals.1bvfjaq9y3nk.png)

+ LCP: 加载性能。最大内容绘制应在 2.5s 内完成。
+ FID: 交互性能。首次输入延迟应在 100ms 内完成。
+ CLS: 页面稳定性。累积布局偏移，需手动计算，CLS 应保持在 0.1 以下。

### 计算与收集

+ [web-vitals](https://web.dev/vitals/)

当收集浏览器端每个用户核心性能指标时，可通过 `web-vitals` 收集并通过 [sendBeacon](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon) 上报到打点系统。

``` js
import { getCLS, getFID, getLCP } from 'web-vitals'

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  navigator.sendBeacon('/analytics', body))
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

## 更快的传输: CDN

将资源分发到 CDN 的边缘网络节点，使用户可就近获取所需内容，大幅减小了光纤传输距离，使全球各地用户打开网站都拥有良好的网络体验。

![CDN](https://img.alicdn.com/imgextra/i4/O1CN01ZE3PtG22EoMNyAv9L_!!6000000007089-2-tps-1530-1140.png)

## 更快的传输: http2

`http2` 的诸多特性决定了它更快的传输速度。

1. 多路复用，在浏览器可并行发送 N 条请求。
1. 首部压缩，更小的负载体积。

目前，网站已大多上了 http2，可在控制台面板进行查看。

![h2](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/h2.7582a4fvtx00.png)

## 更快的传输: 充分利用 HTTP 缓存

更好的资源缓存策略，对于 CDN 来讲可减少回源次数，对于浏览器而言可减少请求发送次数。无论哪一点，对于二次网站访问都具有更好的访问体验。

+ 缓存策略
  + 强缓存: 打包后带有 hash 值的资源 (如 /build/a3b4c8a8.js)
  + 协商缓存: 打包后不带有 hash 值的资源 (如 /index.html)
+ 分包加载 (Bundle Spliting)
  + 避免一行代码修改导致整个 bundle 的缓存失效

## 更快的传输: 减少 HTTP 请求及负载

对一个网站的资源进行压缩优化，从而达到减少 HTTP 负载的目的。

+ js/css/image 等常规资源体积优化，这是一个大话题，再以下分别讨论
+ 小图片优化，将小图片内联为 Data URI，减小请求数量
+ 图片懒加载
  + 新的 API: IntersectionObserver API
  + 新的属性: loading=lazy

## 更小的体积: gzip/brotli

对 JS、CSS、HTML 等文本资源均有效，但是对图片效果不大。

+ `gzip` 通过 LZ77 算法与 Huffman 编码来压缩文件，重复度越高的文件可压缩的空间就越大。
+ `brotli` 通过变种的 LZ77 算法、Huffman 编码及二阶文本建模来压缩文件，更先进的压缩算法，比 gzip 有更高的性能及压缩率

可在浏览器的 `Content-Encoding` 响应头查看该网站是否开启了压缩算法，目前知乎、掘金等已全面开启了 `brotli` 压缩。

``` bash
# Request Header
Accept-Encoding: gzip, deflate, br

# gzip
Content-Encoding: gzip

# gzip
Content-Encoding: br
```
## 更小的体积: 压缩混淆工具

[Terser](https://terser.org/docs/api-reference.html#compress-options) 是 Javascript 资源压缩混淆的神器。

它可以根据以下策略进行压缩处理:

1. 长变量名替换短变量
1. 删除空格换行符
1. 预计算: `const a = 24 * 60 * 60 * 1000` -> `const a = 86400000`
1. 移除无法被执行的代码
1. 移除无用的变量及函数

可在 [Terser Repl](https://try.terser.org/) 在线查看代码压缩效果。

![terser](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/terser.1bb1s5v3tt4w.png)

1. [swc](https://github.com/swc-project/swc) 是另外一个用以压缩 Javascript 的工具，它拥有与 `terser` 相同的 API，由于它是由 `rust` 所写，因此它拥有更高的性能。
1. [html-minifier-terser](https://github.com/terser/html-minifier-terser) 用以压缩 HTML 的工具

## 更小的体积: 更小的 Javascript

关于更小的 Javascript，上边已总结了两条:

1. gzip/brotli
1. terser (minify)

还有以下几点可以考虑考虑:

1. 路由懒加载，无需加载整个应用的资源
1. Tree Shaking: 无用导出将在生产环境进行删除
1. browserlist/babel: 及时更新 browserlist，将会产生更小的垫片体积

再补充一个问题:

如何分析并优化当前项目的 Javascript 体积？如果使用 `webpack` 那就简单很多。

1. 使用 `webpack-bundle-analyze` 分析打包体积
1. 对一些库替换为更小体积的库，如 moment -> dayjs
1. 对一些库进行按需加载，如 `import lodash` -> `import lodash/get`
1. 对一些库使用支持 Tree Shaking，如 `import lodash` -> `import lodash-es`

## 更小的体积: 更小的图片

在前端发展的现在，`webp` 普遍比 `jpeg/png` 更小，而 `avif` 又比 `webp` 小一个级别

为了无缝兼容，可选择 `picture/source` 进行回退处理

``` html
<picture>
  <source srcset="img/photo.avif" type="image/avif">
  <source srcset="img/photo.webp" type="image/webp">
  <img src="img/photo.jpg" width="360" height="240">
</picture>
```

1. 更合适的尺寸: 当页面仅需显示 100px/100px 大小图片时，对图片进行压缩到 100px/100px
1. 更合适的压缩: 可对前端图片进行适当压缩，如通过 `sharp` 等

## preload/prefetch

## 关键渲染路径

dom -> cssom -> reflow -> repaint

+ 减少重排重绘
+ 打开 GPU 性能优化
+ defer/async 的 script

## 防抖与节流

## 虚拟列表优化

## requestIdleCallback

## 请求及资源缓存

1. 避免多次发送请求

## ServiceWorker 与资源缓存

## Worker

## WASM

1. C++/Rust