# 如何开发一个支持 SSR 的 npm 包

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-27/clipboard-5670.91f38f.webp)

> 可使用 BROWSER 环境变量，针对浏览器环境与Node环境通过 `rollup`/`@rollup/plugin-replace` 打包两份，并通过 `exportmap` 的 `browser`/`node` 字段作为不同环境的入口文件。

如果一个 npm package 既能在 node 环境中运行，又能在浏览器环境运行，那么它就是支持 SSR 的，也可称为支持同构的 npm package。比如 [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)。

以一个最简单版的 `hello, world` 示例说明问题。

假设我要开发一个能够用在 SSR 下的 base64 编码解码的 npm package，那我应该如何上手。

## Web/Node 环境下的实现

在浏览器环境中，我们可以借助于 `atob` 实现编码解码。实现该包的主要代码如下。

``` js
export function encode (str) {
  return btoa(str)
}

export function decode (str) {
  return atob(str)
}
```

但是在 Node 环境中使用 `atob`/`btoa` 有兼容性问题无法工作，**如使用以上代码进行发包，则在 Node 环境下将会报错**。

在 Node 中应使用 `Buffer` 来处理 base64 的编码解码，代码如下。

> PS: `atob`/`btoa` 在 node v16 后可以使用，然而并不被建议使用，仍然推荐使用 Buffer API，详见文档: [buffer](https://nodejs.org/api/buffer.html#bufferatobdata)

``` js
export function encode (str) {
  return Buffer.from(str).toString('base64')
}

export function decode (str) {
  return Buffer.from(str, 'base64').toString()
}
```

## 发包的兼容问题解决: 代码层面解决

我们可以通过代码来对当前环境进行判断是否在 Node/Web 环境下。

``` js
// 判断当前环境是否为服务器
const isServer = typeof Window === 'undefined'
```

则可以通过 `isServer` 判断当前环境，导出对应的函数。

``` js
let encode, decode

if (isServer) {
  // 使用 Buffer API 实现
} else {
  // 使用 atob/btoa 实现
}

export { encode, decode }
```

**然而，在浏览器环境中并不需要 Node 环境中的实现，反之同理，此举将增加无用的代码体积。**

## 发包的兼容问题解决: Export Map

假设此时有两份文件:

1. `base64.browser.js`: 在浏览器端实现 base64 的编码解码
1. `base64.node.js`: 在 Node 端实现 base64 的编码解码

此时，可使用 Export Map 解决该问题，可见我的文章: [Package 的入口文件](https://q.shanyue.tech/engineering/535.html)。

``` js
{
  exports: {
    node: 'base64.node.js',
    broswer: 'base64.browser.js'
  }
}
```

如此一来，打包体积问题将得到解决。

## 既要还要又要: 更好的打包方案

但是，为了更好的开发体验。我们更希望将两份代码在一起维护，思考以下案例:

我们需要发布一个 npm package，其中使用到了 base64 该函数，因此代码在一起维护比较方便，然而我们也同时希望打包时将二者分开供不同的平台进行使用。

总结一句话，我们要做到以下两点:

1. 开发时，我们要把代码放在一个文件中进行维护
1. 发包时，我们要把代码放在两个文件供不同环境使用

接下来，要讲一点点编译器优化的小知识了。

众所周知，Tree Shaking 即属于编译器体积压缩进行优化，Terser 压缩代码也是在编译期进行操作。

假设，在编译期有以下代码

``` js
if (false) {
  console.log('hello, world')
}
```

**经代码压缩一走，将只剩下0个字符。** 这也是我们接下来的思路。

## 将运行时逻辑提前至编译期

我们将运行时判断是否为服务器的逻辑改为由环境变量判断，并在编译器注入环境变量，并编译两次，问题解决。

``` js
// 判断当前环境是否为服务器

// Before
const isServer = typeof Window === 'undefined'

// After
const isServer = process.env.BROWSER === true
```

![图解同构 Package](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-27/clipboard-5670.91f38f.webp)

## 实践

我们通过 `rollup` 进行打包，通过 [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace) 进行环境变量的注入。

``` js
import replace from '@rollup/plugin-replace'

export default [
  {
    input: './index.js',
    output: {
      file: 'dist/base64.browser.js'
    },
    plugins: [
      replace({
        'process.env.BROWSER': true
      })
    ]
  }, {
    input: './index.js',
    output: {
      file: 'dist/base64.node.js'
    },
    plugins: [
      replace({
        'process.env.BROWSER': false
      })
    ]
  }
]
```

详见代码示例: [示例](https://github.com/shfshanyue/node-examples/tree/master/engineering/rollup/ssr)
