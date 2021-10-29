# corejs

[core-js](https://github.com/zloirock/core-js) 是关于 ES 标准最出名的 `polyfill`，polyfill 意指当浏览器不支持某一最新 API 时，它将帮你实现，中文叫做垫片。你也许每天都与它打交道，但你毫不知情。

> 有一段时间，当你执行 `npm install` 并且项目依赖 `core-js` 时，会发现 `core-js` 的作者正借助于 `npm postinstall` 在找工作。

由于垫片的存在，打包后体积便会增加，所需支持的浏览器版本​越高，垫片越少，体积就会越小。

以下代码便是 `Array.from`(ES6) 的垫片代码，有了它的存在，在任意浏览器中都可以使用 `Array.from` 这个 API。

``` js
// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
  Array.from = () => { // 省略若干代码 }
}
```

**而 `core-js` 的伟大之处是它包含了所有 `ES6+` 的 polyfill，并集成在 `babel` 等编译工具之中**

试举一例: 

你在开发环境使用了 [Promise.any](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)，而它属于 `ES2021` 新出的 API，在部分浏览器里尚未实现，同时，你又使用了 `ES2020` 新出的操作符 `?.`。

为了使代码能够在大部分浏览器里能够实现，你将会使用 `babel` 或者 `swc` 将代码编译为 ES5。

**但是此时你会发现问题，*如果不做任何配置*，`babel`/`swc` 只能处理操作符，而无法处理新的 API。以下代码会报错**

![babel](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/babel.j056lzjd1g0.png)

好消息是，`core-js` 已集成到了 `babel`/`swc` 之中。在 `babel` 中你可以使用 `@babel/preset-env` 或者 `@babel/runtime` 进行配置，详见文档 [core-js](https://github.com/zloirock/core-js)。**通过配置，`babel` 编译代码后将会自动包含所需的 polyfill**，如下所示。

> PS: `@babel/polyfill` 已在 `babel@7.4.0` 被废弃掉，可使用 `@babel/plugin-transform-runtime` 代替。

+ [点击查看以下代码在线演示](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=usage&corejs=3.6&spec=false&loose=false&code_lz=AoJw9gtglgzgpgOgIYDsCeAKA2gZgLoCUCALgBZwoZgAEAvAHzUDGYKMYANoh2AOZUECAKCEs2xajVrUUAVw4cRY9lwQ9-YAPzJtAIwJA&debug=false&forceAllTransforms=true&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env&prettier=false&targets=&version=7.15.8&externalPlugins=&assumptions=%7B%7D)

![babel-preset-env](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/babel-preset.4rbb4gbe77o0.png)