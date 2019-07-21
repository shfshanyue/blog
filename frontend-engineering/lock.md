# package-lock.json 的意义何在

`packagelock.json`/`yarn.lock` 用以锁定版本号，保证开发环境与生产环境的一致性，避免出现不兼容 API 导致生产环境报错

在这个问题之前，需要了解下什么是 `semver`: [什么是 semver](https://github.com/shfshanyue/Daily-Question/issues/534)。

当我们在 `npm i` 某个依赖时，默认的版本号是最新版本号 `^1.2.3`，以 `^` 开头可最大限度地使用新特性，但是某些库不遵循该依赖可能出现问题。

> `^1.2.3` 指 *>=1.2.3 <2.0.0*，可查看 [semver checker](https://devtool.tech/semver)

*一个问题: 当项目中没有 lock 文件时，生产环境的风险是如何产生的?*

演示风险过程如下:

1. `pkg 1.2.3`: 首次在开发环境安装 pkg 库，为此时最新版本 `1.2.3`，`dependencies` 依赖中显示 `^1.2.3`，实际安装版本为 `1.2.3`
1. `pkg 1.19.0`: 在生产环境中上线项目，安装 pkg 库，此时最新版本为 `1.19.0`，满足 `dependencies` 中依赖 `^1.2.3` 范围，实际安装版本为 `1.19.0`，**但是 `pkg` 未遵从 semver 规范，在此过程中引入了 Breaking Change**，因此此时生产环境中的 `1.1.0` 导致了 bug，且难以调试

而当有了 lock 文件时，每一个依赖的版本号都被锁死在了 lock 文件，每次依赖安装的版本号都从 lock 文件中进行获取，避免了不可测的依赖风险。

1. `pkg 1.2.3`: 首次在开发环境安装 pkg 库，为此时最新版本 `1.2.3`，`dependencies` 依赖中显示 `^1.2.3`，实际安装版本为 `1.2.3`，**在 lock 中被锁定版本号**
1. `pkg 1.2.3`: 在生产环境中上线项目，安装 pkg 库，此时 lock 文件中版本号为 `1.2.3`，符合 `dependencies` 中 `^1.2.3` 的范围，将在生产环境安装 `1.2.3`，完美上线。

## npm 第三方库需要提交 lockfile 吗

## 为何有人说第三方库不需要提交 package-lock.json/yarn.lock？

> 该观点仅对第三方库的 `dependencies` 有效

答: 你自己项目中所有依赖都会根据 lockfile 被锁死，**但并不会依照你第三方依赖的 lockfile**。

试举一例:

1. 项目中依赖 `react@^17.0.2`
2. 而 `react@17.0.2` 依赖 `object-assign@^4.1.0`

在 React 自身的 `yarn.lock` 中版本锁定依赖如下:

``` bash
react@17.0.2
└── object-assign@4.1.0 (PS: 请注意该版本号)
```

而在个人业务项目中 `yarn.lock` 中版本锁定依赖如下:

``` bash
Application
└── react@17.0.2
    └── object-assign@4.99.99 (PS: 请注意该版本号)
```

**此时个人业务项目中 `object-assign@4.99.99` 与 React 中 `object-assign@4.1.0` 不符，将有可能出现问题**。

此时，即使第三方库存在 `lockfile`，但也有着间接依赖(如此时的 `object-assign`，是第三方的依赖，个人业务项目中的依赖的依赖)不可控的问题。

## 第三方库如何解决潜在的间接依赖不可控问题

可参考 `next.js` 的解决方案。

> [next.js 源码](https://github.com/vercel/next.js/tree/canary/packages/next) 点击此处

1. 将所有依赖中的版本号在 `package.json` 中锁死。可见 [package.json](https://github.com/vercel/next.js/tree/canary/packages/next/package.json)
1. 将部分依赖直接编译后直接引入，而非通过依赖的方式，如 `webpack`、`babel` 等。可见目录 [next/compiled](https://github.com/vercel/next.js/tree/canary/packages/next/compiled)

以下是一部分 `package.json`

``` js
{
  "dependencies": {
    "@babel/runtime": "7.15.4",
    "@hapi/accept": "5.0.2",
    "@napi-rs/triples": "1.0.3"
  }
}
```

除了参考 `next.js` 直接锁死版本号方式外，还可以仍然按照 `^x.x.x` 加勤加维护并时时更新 `depencencies`

## 总结

`lockfile` 对于第三方库仍然必不可少。可见 `react`、`next.js`、`webpack` 均有 `yarn.lock`。(PS: 可见 yarn 的受欢迎程度，另外 vue3 采用了 pnpm)

1. 第三方库的 `devDependencies` 必须锁定，这样 Contributor 可根据 lockfile 很容易将项目跑起来。
2. 第三方库的 `dependencies` 虽然有可能存在不可控问题，但是可通过锁死 `package.json` 依赖或者勤加更新的方式来解决。
