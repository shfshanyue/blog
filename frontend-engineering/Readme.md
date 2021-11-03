# 前端工程化实践

## 系列文章

1. [前端高级进阶：javascript 代码是如何被压缩](./uglify.md)
1. [前端高级进阶：如何更好地优化打包资源](./bundle.md)
1. [前端高级进阶：网站的缓存控制策略最佳实践及注意事项](./http-cache.md)
1. [前端高级进阶：团队代码规范约束最佳实践](./eslint.md)
1. [前端高级进阶：npm i 在生产环境下的速度优化](./npm-install.md)
1. [前端高级进阶：使用 docker 高效部署你的前端应用](./docker.md)
1. [前端高级进阶：CICD 下的前端多特性分支环境的部署](./feature-deploy.md)
1. [前端高级进阶：前端部署的发展历程](./deploy.md)
1. [前端高级进阶：如何为前端本地环境配置 https 证书](./local-https.md)

以下 TODO

1. [如何部署 SSR 应用]()
1. [图片处理与工程化]()
1. [使用 CDN 加速你的网站](./cdn.md)
1. [CDN 下 index.html 应如何安放]()
1. [在 CICD 中使用 npm ci 代替 npm i](./npm-ci.md)
1. [使用 CICD 构造你的前端质量保障体系]()
1. [如何衡量你的代码复杂度]()
1. [依赖安全漏洞与审计]()
1. [前端需要日志处理吗]()
1. [前端中的异常监测与报告]()
1. [团队编码规范约束最佳实践](./eslint.md)
1. [应用状态](./store.md)
1. [React 优化](./react-perf.md)
1. [Memo](./memorized.md)

## 前端工程化小卡片

1. 简述各种模块化方案
1. webpack http cache
1. webpack runtime (关于webpack)
1. webpack loadChunk runtime
1. webpack loadChunk runtime (加载 chunks，如何保证顺序) (重复)
1. webpack html webpack plugin
1. webpack image/json loader
1. webpack style loader/extract
1. webpack hmr
1. webpack speed up build
1. babel plugin/preset
1. babel runtime
1. size: 如何分析打包体积 ❎
1. size: reduce js size
1. size: minify/terser 原理
1. size: minify/sourcemap
1. size: tree shaking
1. size: code spliting (重复)
1. size: splitChunksPlugin
1. size: browserlist/core.js
1. package.json semver
1. package.json main/module/export
1. package.json dep/devDep
1. package.json engines
1. package.json script hooks
1. package.json npm publish
1. package.json sideEffects
1. node modules package-lock.json
1. node modules require package
1. CI: git hooks
1. PQM
1. pritter (关于项目质量)
1. eslint
1. docker (关于部署)
1. preview
1. 灰度
1. esm
1. bundless
1. vite

## 体积优化

1. 概述
  1. 仅限于前端方向，如 gzip/brotli
  1. 仅限于工程化方向

## 通用方案

1. uglify 的原理
1. uglify 之 prepack 的原理
1. Tree Shaking
1. browserslist
1. corejs/babel
1. webpack 运行时代码
1. webpack style 等运行时代码
1. webpack codespliting
1. minicss/cleancss
1. autoprefixer

## 实战

2. webpack 打包体积分析

## Package 分析

1. 查看包的体积
1. 如何发布一个更小体积的包
