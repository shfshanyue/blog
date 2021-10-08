# 性能优化

## 核心性能指标与 Performance API

+ LCP: 加载性
+ FID: 交互性
+ CLS: 页面稳定性

### 如何计算

+ web-vitals

### DCL 与 L 的区别

+ DCL: DOM 渲染完成
+ L: 资源加载完成

## gzip/brotli

+ nginx (多少个压缩级别)

## JS 压缩混淆

+ 长变量名替换
+ 删除空格换行符
+ 预计算: `const a = 24 * 60 * 60 * 1000`
+ tree shaking

压缩混淆的工具

+ uglifyjs
+ terser
+ swc: Rust，性能更高，next.js 已经使用了 swc

## 减少 HTTP 请求及负载

+ 减小 js/css/image 体积 (下补充)
+ 小图片优化: Data URI
+ 图片懒加载
  + IntersectionObserver API

## 充分利用 HTTP 缓存

+ 缓存策略
  + 强缓存: 打包后带有 hash 值的资源 (如 /build/a3b4c8a8.js)
  + 协商缓存: 打包后不带有 hash 值的资源 (如 /index.html)
+ 分包加载 (Bundle Spliting): bundle -> chunks
  + 一行代码修改导致整个 bundle 的缓存失效

## 更小的 js

1. 路由懒加载，无需加载整个应用的 Javascript
1. Tree Shaking
1. 压缩混淆
1. gzip
1. browserlist

补充问题:

+ 如何分析并优化当前项目的 Javascript 体积
  + webpack-bundle-analyze
  + 替换: moment -> dayjs
  + 按需: import lodash -> import lodash/get

## 更小的图片

1. jpeg -> png -> webp -> avif
1. picture/source


## 关键渲染路径

dom -> cssom -> reflow -> repaint

+ 减少重排重绘
+ 打开 GPU 性能优化
+ defer/async 的 script


## 防抖与节流

## 虚拟列表优化


## preload/prefetch

## requestIdleCallback

## 请求及资源缓存

1. 避免多次发送请求

## ServiceWorker 与资源缓存

## Worker

## WASM

1. C++/Rust