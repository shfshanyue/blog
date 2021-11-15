# eslint 核心

`eslint`，对代码不仅有风格的校验，更有可读性、安全性、健壮性的校验。

关于校验分号、冒号等，属于风格校验，与个人风格有关，遵循团队标准即可，可商量可妥协。

``` js
// 这属于风格校验
{
  semi: ['error', 'never']
}
```

与 `prettier` 不同，`eslint` 更多是关于代码健壮性校验，试举一例。

+ `Array.prototype.forEach` 不要求也**不推荐回调函数返回值**
+ `Array.prototype.map` 回调函数**必须返回一个新的值**用以映射

当代码不遵守此两条要求时，通过 `eslint` 以下规则校验，则会报错。此种校验与代码健壮有关，不可商量不可妥协。

``` js
// 这属于代码健壮性校验
{
  'array-callback-return': ['error', { checkForEach: true }]
}
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/435ced2505c647b9b2989338350600f3~tplv-k3u1fbpfcp-watermark.image)

## Rule

在 `eslint` 中，使用 `Rule` 最为校验代码最小规则单元。

``` js
{
  rules: {
    semi: ['error', 'never']
    quotes: ['error', 'single', { avoidEscape: true }]
  }
}
```

在 `eslint` 自身，内置大量 `rules`，比如分号冒号逗号等配置。

> [eslint rules 源码位置](https://github.com/eslint/eslint/tree/main/lib/rules)

校验 `typescript`、`react` 等规则，自然不会由 `eslint` 官方提供，那这些 Rules 如何维护？

## Plugin

如 `react`、`typescript`、`flow` 等，需要自制 `Rule`，此类为 `Plugin`，他们维护了一系列 `Rules`。

在命名时以 `eslint-plugin-` 开头并发布在 `npm` 仓库中，而执行的规则以 `react/`、`flow/` 等开头。

维护一个 `eslint-plugin`，极需要前端工程化功底，需要了解如何写一个 ESLint Rule，了解 `Tokenizer` 与 `AST`，必要时需要适配至 `eslint` 的 Parser。

``` js
{
  'react/no-multi-comp': [error, { ignoreStateless: true }]
}
```

+ [React ESLint Rules](https://www.npmjs.com/package/eslint-plugin-react)
+ [TypeScript ESLint Rules](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/rules)

## Config

在第三方库、公司业务项目中需要配置各种适应自身的规则、插件等，称为 `Config`。

1. 作为库发布，在命名时以 `elint-config-` 开头，并发布在 `npm` 仓库中。
1. 为项目服务，在项目中以 `.eslintrc` 命名或者置于项目 package.json 中的 `eslintConfig` 字段中，推荐第二种方案。


+ [eslint-config-react-app](https://github.com/facebook/create-react-app/tree/main/packages/eslint-config-react-app)
+ [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)

以下是 `eslint-config-airbnb` 的最外层配置。

``` js
module.exports = {
  extends: [
    'eslint-config-airbnb-base',
    './rules/react',
    './rules/react-a11y',
  ].map(require.resolve),
  rules: {}
}
```

护一个 `eslint-config`，极其简单。在我们公司实际项目中，无需重新造轮子，只需要配置文件中的 `extends` 继承那些优秀的 `eslint-config` 即可。如果被大团队认可，还可以在公司内部发包在私有仓库。
