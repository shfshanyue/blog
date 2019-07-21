# 资源是如何打包的

以下代码是 `sum.js` 与 `index.js` 两个代码。

``` js
// sum.js
function sum (x, y) {
  return x + y;
}

module.exports = sum

// index.js
const sum = require('./sum')

sum(3, 4)
```

以下代码是打包后的代码。

``` js
const modules = {
  './sum': (module) => {
    function sum (x, y) {
      return x + y;
    }

    module.exports = sum
  },
  '.': (module) => {
    const sum = require('./sum')

    sum(3, 4)
  }
}

function require(id) {
  const module = {}
  modules[id](module)
  return module.exports
}

require('.')
```

## 如何生成 modules

