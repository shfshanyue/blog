# 浏览器中的原生 ESM

`Vite`、`ESBuild`、`Snowpack` 大火

## 大势所趋

## Native Import: Import from URL

``` html
<script type="module">
  import lodash from 'https://cdn.skypack.dev/lodash';
</script>
```

**只能从 URL 中引入 `Package`**！

1. 绝对路径: `https://cdn.sykpack.dev/lodash`
1. 相对路径: `./lib`

## ImportMap

``` js
import lodash from 'lodash'
```

裸导入 (`bare import specifiers`)，不同于 `Node.JS` 可以依赖系统文件系统，层层寻找 `node_modules`

``` bash
/home/ry/projects/node_modules/bar.js
/home/ry/node_modules/bar.js
/home/node_modules/bar.js
/node_modules/bar.js
```

``` html
<script type="importmap">
{
  "imports": {
    "lodash": "https://cdn.sykpack.dev/lodash"
  }
}
</script>
```

``` js
import lodash from 'lodash'

import("lodash").then(_ => ...)
```

## 构建工具

## 支持 ES 的 Package 过少？

``` bash

```

## ESM Shims