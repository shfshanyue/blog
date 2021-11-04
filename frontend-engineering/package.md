## name、version 与 semver 字段

`name` 与 `version` 字段几乎是

## main、exports、module
### main

`main` 指 npm package 的入口文件，当我们对某个 package 进行导入时，实际上导入的是 `main` 字段所指向的文件。

`main` 是 CommonJS 时代的产物，也是最古老且最常用的入口文件。

``` js
// package.json 内容
{
  name: 'midash',
  main: './dist/index.js'
}

// 关于如何引用 package
const midash = require('midash')

// 实际上是通过 main 字段来找到入口文件，等同于该引用
const midash = require('midash/dist/index.js')
```

### module

随着 ESM 且打包工具的发展，许多 package 会打包 N 份模块化格式进行分发，如 `antd` 既支持 `ES`，也支持 `umd`，将会打包两份。

![antd 分发了两种格式](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/antd.50lzknb7r000.png)

如果使用 `import` 对该库进行导入，则首次寻找 `module` 字段引入，否则引入 `main` 字段。

基于此，许多前端友好的库，都进行了以下分发操作:

1. 对代码进行两份格式打包: `commonjs` 与 `es module`
1. `module` 字段作为 `es module` 入口
1. `main` 字段作为 `commonjs` 入口

``` js
{
  name: 'midash',
  main: './dist/index.js',
  module: './dist/index.mjs'
}

// 以下两者等同
import midash from 'midash'
import midash from 'midash/dist/index.mjs'
```

如果你的代码只分发一份 `es module` 模块化方案，则直接置于 `main` 字段之中。

### exports

如果说以上两个是刀剑，那 `exports` 至少得是瑞士军刀。

`exports` 可以更容易地控制子目录的访问路径，也被称为 `export map`。

假设我们 Package 的目录如下所示:

``` bash
├── package.json
├── index.js
└── src
    └── get.js
```

**不在 `exports` 字段中的模块，即使直接访问路径，也无法引用！**

``` js
// package.json
{
  name: 'midash',
  main: './index.js',
  exports: {
    '.': './dist/index.js',
    'get': './dist/get.js'
  }
}

// 正常工作
import get from 'midash/get'

// 无法正常工作，无法引入
import get from 'midash/dist/get'
```

`exports` 不仅可根据模块化方案不同选择不同的入口文件，还可以根据环境变量(`NODE_ENV`)、运行环境(`nodejs`/`browser`/`electron`) 导入不同的入口文件。

``` js
{
  "type": "module",
  "exports": {
    "electron": {
      "node": {
        "development": {
          "module": "./index-electron-node-with-devtools.js",
          "import": "./wrapper-electron-node-with-devtools.js",
          "require": "./index-electron-node-with-devtools.cjs"
        },
        "production": {
          "module": "./index-electron-node-optimized.js",
          "import": "./wrapper-electron-node-optimized.js",
          "require": "./index-electron-node-optimized.cjs"
        },
        "default": "./wrapper-electron-node-process-env.cjs"
      },
      "development": "./index-electron-with-devtools.js",
      "production": "./index-electron-optimized.js",
      "default": "./index-electron-optimized.js"
    },
    "node": {
      "development": {
        "module": "./index-node-with-devtools.js",
        "import": "./wrapper-node-with-devtools.js",
        "require": "./index-node-with-devtools.cjs"
      },
      "production": {
        "module": "./index-node-optimized.js",
        "import": "./wrapper-node-optimized.js",
        "require": "./index-node-optimized.cjs"
      },
      "default": "./wrapper-node-process-env.cjs"
    },
    "development": "./index-with-devtools.js",
    "production": "./index-optimized.js",
    "default": "./index-optimized.js"
  }
}
```

## NPM Script 的生命周期

在 npm 中，使用 `npm scripts` 可以组织整个前端工程的工具链。

``` js
{
  start: 'serve ./dist',
  build: 'webpack',
  lint: 'eslint'
}
```

除了可自定义 `npm script` 外，npm 附带许多内置 scripts

``` bash
npm install

npm test

npm publish
```

1. 在某个 npm 库安装结束后，自动执行操作如何处理？
1. npm publish 发布 npm 库时将发布打包后文件，如果遗漏了打包过程如何处理，如何在发布前自动打包？

这就要涉及到一个 npm script 的生命周期

### 一个 npm script 的生命周期

当我们执行任意 `npm run` 脚本时，将自动触发 `pre`/`post` 的生命周期。

当手动执行 `npm run abc` 时，将在此之前自动执行 `npm run preabc`，在此之后自动执行 `npm run postabc`。

``` js
// 自动执行
npm run preabc

npm run abc

// 自动执行
npm run postabc
```

[patch-package](https://github.com/ds300/patch-package) 一般会放到 `postinstall` 中。

``` js
{
  postinstall: 'patch-package'
}
```

而发包的生命周期更为复杂，当执行 `npm publish`，将自动执行以下脚本。

+ **prepublishOnly**: 最重要的一个生命周期。
+ prepack
+ prepare
+ postpack
+ publish
+ postpublish

当然你无需完全记住所有的生命周期，如果你需要在发包之前自动做一些事情，如测试、构建等，请在 `prepulishOnly` 中完成。

``` js
{
  prepublishOnly: 'npm run test && npm run build'
}
```

### 一个最常用的生命周期

`prepare`

1. `npm install` 之后自动执行
1. `npm publish` 之前自动执行

比如 `husky`

``` js
{
  prepare: 'husky install'
}
```