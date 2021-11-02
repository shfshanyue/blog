# Tree Shaking

class 是否可以 Tree Shaking

+ CONCATENATED MODULE

`Tree Shaking` 指基于 ES Module 进行静态分析，通过 AST 将用不到的函数进行移除，从而减小打包体积。

有例为证:

> 以下示例可在 [Rollup Repl](https://rollupjs.org/repl/?version=2.58.0&shareable=JTdCJTIybW9kdWxlcyUyMiUzQSU1QiU3QiUyMm5hbWUlMjIlM0ElMjJtYWluLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMiUyRiolMjBUUkVFLVNIQUtJTkclMjAqJTJGJTVDbmltcG9ydCUyMCU3QiUyMGN1YmUlMjAlN0QlMjBmcm9tJTIwJy4lMkZtYXRocy5qcyclM0IlNUNuJTVDbmNvbnNvbGUubG9nKCUyMGN1YmUoJTIwNSUyMCklMjApJTNCJTIwJTJGJTJGJTIwMTI1JTIyJTJDJTIyaXNFbnRyeSUyMiUzQXRydWUlN0QlMkMlN0IlMjJuYW1lJTIyJTNBJTIybWF0aHMuanMlMjIlMkMlMjJjb2RlJTIyJTNBJTIyJTJGJTJGJTIwbWF0aHMuanMlNUNuJTVDbiUyRiUyRiUyMFRoaXMlMjBmdW5jdGlvbiUyMGlzbid0JTIwdXNlZCUyMGFueXdoZXJlJTJDJTIwc28lNUNuJTJGJTJGJTIwUm9sbHVwJTIwZXhjbHVkZXMlMjBpdCUyMGZyb20lMjB0aGUlMjBidW5kbGUuLi4lNUNuZXhwb3J0JTIwZnVuY3Rpb24lMjBzcXVhcmUlMjAoJTIweCUyMCklMjAlN0IlNUNuJTVDdHJldHVybiUyMHglMjAqJTIweCUzQiU1Q24lN0QlNUNuJTVDbiUyRiUyRiUyMFRoaXMlMjBmdW5jdGlvbiUyMGdldHMlMjBpbmNsdWRlZCU1Q25leHBvcnQlMjBmdW5jdGlvbiUyMGN1YmUlMjAoJTIweCUyMCklMjAlN0IlNUNuJTVDdCUyRiUyRiUyMHJld3JpdGUlMjB0aGlzJTIwYXMlMjAlNjBzcXVhcmUoJTIweCUyMCklMjAqJTIweCU2MCU1Q24lNUN0JTJGJTJGJTIwYW5kJTIwc2VlJTIwd2hhdCUyMGhhcHBlbnMhJTVDbiU1Q3RyZXR1cm4lMjB4JTIwKiUyMHglMjAqJTIweCUzQiU1Q24lN0QlMjIlMkMlMjJpc0VudHJ5JTIyJTNBZmFsc2UlN0QlNUQlMkMlMjJvcHRpb25zJTIyJTNBJTdCJTIyZm9ybWF0JTIyJTNBJTIyZXMlMjIlMkMlMjJuYW1lJTIyJTNBJTIybXlCdW5kbGUlMjIlMkMlMjJhbWQlMjIlM0ElN0IlMjJpZCUyMiUzQSUyMiUyMiU3RCUyQyUyMmdsb2JhbHMlMjIlM0ElN0IlN0QlN0QlMkMlMjJleGFtcGxlJTIyJTNBJTIyMDIlMjIlN0Q=) 中进行在线演示

``` js
/* TREE-SHAKING */
import { sum } from './maths.js'

console.log( sum( 5, 5 ) )  // 10
```

``` js
// maths.js

export function sum ( x, y ) {
  return x + y
}

// 由于 sub 函数没有引用到，最终将不会对它进行打包
export function sub ( x, y ) {
  return x - y
}
```

最终打包过程中，`sub` 没有被引用到，将不会对它进行打包。以下为打包后代码。

``` js
// maths.js

function sum ( x, y ) {
  return x + y
}

/* TREE-SHAKING */

console.log( sum( 5, 5 ) )
```

## `import *`

当使用语法 `import *` 时，Tree Shaking 依然生效。

``` js
import * as maths from './maths'

// Tree Shaking 依然生效
maths.sum(3, 4)
maths['sum'](3, 4)
```

`import * as maths`，其中 `maths` 的数据结构是固定的，无复杂数据，通过 AST 分析可查知其引用关系。

``` js
const maths = {
  sum () {},
  sub () {}
}
```

## JSON TreeShaking

`Tree Shaking` 甚至可对 JSON 进行优化。原理是因为 JSON 格式简单，通过 AST 容易预测结果，不像 JS 对象有复杂的类型与副作用。

``` json
{
  "a": 3,
  "b": 4
}
```

``` js
import obj from './main.json'

// obj.b 由于未使用到，仍旧不会被打包
console.log(obj.a)
```

## 引入支持 Tree Shaking 的 Package

为了减小生产环境体积，我们可以**使用一些支持 ES 的 package，比如使用 `lodash-es` 替代 `lodash`**。

我们可以在 [npm.devtool.tech](https://npm.devtool.tech/lodash-es) 中查看某个库是否支持 Tree Shaking。

![lodash-es](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/lodash-es.60xosee62440.png)

## 引入为 ES 的 Package

``` js
{
  unused: true,
  dead_code: true
}
```

