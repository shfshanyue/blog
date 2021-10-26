## main、exports、module

<!-- + umd
+ commonjs
+ esm

> PS: 可在 jsdeliver/unpkg 查看某个 package 的真实发包内容。 -->

## main

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

## module

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

## exports

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