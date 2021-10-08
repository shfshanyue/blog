# Tree Shaking

+ CONCATENATED MODULE

`Tree Shaking`，在前端工程化中指打包过程中将无用代码进行消除，而减小打包体积的过程。

有例为证:

``` js
import { sum } from './math'

console.log('hello, world')
```

``` js
export function sum (a, b) {
  return a + b
}

export function sub (a, b) {
  return a - b
}
```

如上所示，在打包中将会消除无用的引用 `sum` 及 `diff`，因此打包后代码仅有一行

``` js
console.log('hello, world')
```

## 程序流分析

``` js
import * as math from './math'

math.sum(3, 4)
```

``` js
import * as math from './math'

math['sum'](3, 4)
```

## 引入为 ES 的 Package
