## main、exports、module

+ umd
+ commonjs
+ esm

> PS: 可在 jsdeliver/unpkg 查看某个 package 的真实发包内容。

## main

`main` 指某个 Package 的入口文件。

``` js
const midash = require('midash')
```

``` js
{
  name: 'midash',
  main: './index.js'
}
```

## module

``` js
import midash from 'midash'
```

``` js
{
  name: 'midash',
  main: './index.js',
  module: './index.mjs'
}
```

## exports

`exports` 可以更容易地控制子目录的访问路径:

假设我们 Package 的目录如下所示:

``` bash
├── package.json
├── index.js
└── src
    └── get.js
```

``` js
{
  name: 'midash',
  main: './index.js',
  exports: {
    '.': './index.js',
    'get': './src/get.js'
  }
}
```

``` js
// 正常工作
import get from 'midash/get'

// 无法正常工作
import get from 'midash/src/get'
```