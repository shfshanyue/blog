# ESM 大势所趋

**由 `ESM` 的普及，而带来的打包工具的革命以及适用于 ESM 下一代 CDN 的发展，业务项目在生产环境开始使用原生的 ESM 代替以前的 Bundle 方案，从而导致开发体验及网站速度的大幅提升。**

核心代码就是下边这一行: 使用 `HTTP Import` 的方式代替以前的 `Bare Import` + `Bundle`

``` js
<script type="module">
  import lodash from 'https://cdn.skypack.dev/lodash';
</script>
```

而 `ESM` 的发展，从基建到应用的各个开发者都会参与其中: 

1. 面向业务的开发者: 更改为 `Native ESM` 的最终打包方式，而非以前单一复杂的大 Bundle。网站速度变得更快 90%
1. 面向工程化的开发者: 专注于 ESM 的打包，如 Vite、ESBuild、Snowpack 等及相关插件的开发(如集成CDN)，以及 CJS 向 ES 的过渡工作等。这使得构建效率可以提升10倍
1. 面向组件、库的开发者: 更多地支持 `ES` 作为前后通通用的打包方式，代替了以前的 `UMD`
1. 面向云服务的开发者: 开发新的 CDN 服务，支持最通用的 cjs-esm 及一些新特性如私有库的支持，子域名、http2/http3、审计日志做更好的收费等
1. 面向企业: 更快的网络访问速度，更便宜的 CDN (大部分资源会有公共 CDN)

## 面向业务

以前打包主要是两部分: `common` 打所有第三方包，`app.js` 打应用代码的包，路径带上 Hash 值，加一个永久缓存。

+ common.xxxxxx.js
+ app.xxxxxx.js

**但是有可能产生一个问题: 一行代码造成整个应用的长久缓存失效。**

为了对缓存进行更加细致的控制，也会小心细致的分包。如一些大包 `echarts`、`mathjax` 分出去。一些不在视觉内需要点点点才能看到的包也通过 `React.lazy`，`lodable-component` 等也给分出去。但也需要繁琐的手动配置。

+ [分包](https://shanyue.tech/frontend-engineering/bundle.html)
+ [HTTP 缓存控制](https://shanyue.tech/frontend-engineering/http-cache.html)

当 `ESM` 加入后:

1. 所有第三方模块都从 CDN 中获取，且模块都会被永久缓存，而根据调查，第三方模块的体积占整个应用的 90%。为啥子可以永久缓存，因为对于 npm 的每一个 package 都会有版本号控制，版本号不变内容就不会变。现在一些支持 ESM 的 CDN 已经实现了这个功能。

``` bash
$ curl --head -vvv https://jspm.dev/ms@2.1.3
cache-control: public, max-age=31536000, s-maxage=604800, immutable
```

2. CDN 使网络速度更快。以前没有 CDN 吗？以前也有，但是频率就不是一个量级了，当使用了 ESM 的 React CDN 后，React 会被各地各网站都跨网站缓存，更能充分利用到 CDN 的优势。而以前一个大的 Bundle，更有可能未命中缓存及回源

## 面向 Package 开发

TODO

(看的人多的话补充)

## 关于 ESM 的学习

以下两篇文章可以更好地理解 ESM

+ [How to control the behavior of JavaScript imports](https://github.com/WICG/import-maps)
+ [ES modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)

另外我做了一个网站，用以**找到更合适的轮子以及直接在控制台访问模块**: <npm.devtool.tech>。其中就使用了 `ESM` 去加载这些第三方库。

比如，当我查看 `lodash`、`date-fns` 的文档时，需要去实验这些函数时，`npm.runkit` 显得不如控制台那么方便。

+ [lodash](https://npm.devtoo.tech)，打开控制台可以直接全局访问 `lodash`
