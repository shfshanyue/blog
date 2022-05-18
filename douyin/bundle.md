# 打包器是如何对资源进行打包的

大家好，我是山月。

今天的前端一分钟关于打包器的运行时分析。

在 webpack 或者 rollup 中，js、css 以及图片，**皆为模块**。

我们可以将所有资源打包为一个 **bundle.js**。

以 rollup 为例，对以下两个文件进行打包。

在 index.js 中，引入了模块 name.js。

使用 rollup 打包，直接**把所有模块平铺展开**即可。

而以 webpack 为例，它将生成一段**运行时代码**。

主要有两种数据结构。

第一，__webpack_modules__，维护一个所有模块的数组。

将入口模块解析为 AST，根据 AST 深度优先搜索所有的模块，并构建出这个模块数组。

每个模块都由一个包裹函数 (module, module.exports, __webpack_require__) 对模块进行包裹构成。

第二，__webpack_require__(moduleId)，手动实现模块加载器

对已加载过的模块进行缓存，对未加载过的模块，执行 id 定位到 __webpack_modules__ 中的包裹函数，执行并返回 module.exports，并缓存

关于以上所述的包裹函数，如果你写过 node.js，会发现它与 commonjs 的包裹函数是何等地相似。
