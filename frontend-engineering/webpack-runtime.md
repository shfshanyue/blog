`Code Spliting` 往往归为两个方面:

1. 通过 `splitChunksPlugin` 提取公共子模块，把第三方模块打包为 `vendor.js`。一般被称作 `Bundle Spliting`。
1. 通过 `import()` 动态加载模块，进行按需加载。一般被称作 `Code Spliting`。

`Code Spliting` 可显著提升首页性能:

1. 在单页应用中，你只需加载当前路由的 `chunk` (及运行时代码)，当进行路由跳转时，再对其它路由页面的 `chunk` 进行按需加载。
1. 在加载 `jspdf`、`echarts` 等较大体积库时，可使用 `Code Spliting` 进行懒加载，显著减小首页打包体积。

那在打包工具的视角，`import()` 的懒加载是如何做到的呢？请往下看。

## Code Spliting

在 `webpack` 下，当使用动态 `import()` 时，会生成一个 `chunk`，被成为 `code spliting`。

``` js
import('./sum').then(m => {
  m.default(3, 4)
})

// 以下为 sum.js 内容
const sum = (x, y) => x + y
export default sum
```

以上代码在 `webpack` 中会被编译为:

``` js
__webpack_require__.e(/* import() | sum */ 644).then(__webpack_require__.bind(__webpack_require__, 709)).then(m => {
  m.default(3, 4)
})
```

而每一个 `chunk` 的代码如下，以下为 `sum` 函数所构建而成的 chunk:

``` js
"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[644],{

/***/ 709:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
        /* harmony export */ });
        const sum = (x, y) => x + y

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sum);


/***/ })

}]);
```

1. `__webpack_require__.e`: 加载 chunk，此处加载 644 的 chunk
1. `self["webpackChunk"].push`: JSONP callback，用以收集 modules，如此处收集的 moduleId 为709

## `__webpack_require__.e`: webpack 如何加载一个 chunk？

``` js
// 当前已加载的 chunk
const installedChunks = {
  // 标明 chunk 108 已加载成功
  108: 0
}

__webpack_require.e = chunkId => {
  return __webpack_require__.f.j(chunkId)
}

// JSONP chunk loading for javascript
__webpack_require__.f.j = chunkId => {
  let installedChunkData = []
  installChunks[chunkId] = installedChunkData

  const promise = new Promise((resolve, reject) => installedChunkData = [resolve, reject])
  installedChunkData.push(promise)

  const url = __webpack_require__.p + __webpack_require__.u(chunkid)
  const done = (error) => { installedChunkData[1](error) }
  __webpack_requie__.l(url, done, key, chunkId)
}

__webpack_require__.u = (chunkId) => {
  return "" + chunkId + "." + {"40":"e82f3a1c151a3561fcf2","644":"6dd015eb5522909537df"}[chunkId] + ".chunk.js";
}

__webpack_require__.l = (url, done, key, chunkId) => {
  const script = document.createElement('script')
  script.src = url
  script.onload = () => done()
  script.onerror = (error) => done(error)
}
```

## `__webpac_require__.push`: webpack 如何收集 chunk 的依赖？

``` js
// install a JSONP callback for chunk loading
__webpack_require__.push = function webpackJsonpCallback (data) {
  const [chunkIds, moreModules] = data;
  if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
	for(moduleId of Object.keys(moreModules)) {
    __webpack_require__.m[moduleId] = moreModules[moduleId]
	}
  for(let i = 0; i < chunkIds.length; i++) {
    chunkId = chunkIds[i]

    // 当执行万 JSONP callback 后，进行 resolve，表示 chunk 已加载完成
    installedChunks[chunkId][0]()
    // 赋值为 0，标明当前 chunk 已加载
    installedChunks[chunkId]] = 0
  }
}
}
```


可在 [webpack 运行时代码](https://github.com/shfshanyue/node-examples/blob/master/engineering/webpack/code-spliting/example/runtime.js) 中查看加载一个 chunk 的实现。