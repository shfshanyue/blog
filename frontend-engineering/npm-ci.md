# 生产环境中使用 npm ci 代替 npm i

乍一眼看 `npm ci`，CI，恩，看这名字就很适合放在持续集成中。事实也是如此，它更快，更严格，也更适合于放在 CI 中，至于为什么这么说，将会在以下分别做介绍。

`npm ci` 基于一个独立的库 [libcipm](https://github.com/npm/libcipm) 安装依赖，而它拥有和 `npm install` 兼容的 API。当它安装依赖时，默认是缓存优先的，它会充分利用缓存，从而加速装包。


直接从官方文档看 `npm ci` 与 `npm i` 的不同之处吧

> In short, the main differences between using npm install and npm ci are:
> 
> + The project must have an existing package-lock.json or npm-shrinkwrap.json.
> + If dependencies in the package lock do not match those in package.json, npm ci will exit with an error, instead of updating the package lock.
> + npm ci can only install entire projects at a time: individual dependencies cannot be added with this command.
> + If a node_modules is already present, it will be automatically removed before npm ci begins its install.
> + It will never write to package.json or any of the package-locks: installs are essentially frozen.

我将基于官方文档做适当扩展

## package-lock.json 必须存在

`package-lock.json` 在 `npm ci` 时是必须存在的，否则将会报错，阻塞住 CI pipeline 的进一步执行。

`package-lock.json` 用于锁住 package 的版本号，避免在生产环境中因版本导致的构建错误或者运行时错误，对于前端工程化也意义非凡。`npm ci` 时 `package-lock.json` 必须存在也避免了此类问题的产生，它对项目的安全性有所提高。

## package.json 与 package-lock.json 不匹配问题

有可能您会有疑惑了，它们怎么会不匹配呢？在正常情况下肯定不会出现这种问题。

1. **手动改动** `package.json` 中某个 package 的版本号
1. **没有** 再次 `npm install`
1. `git push` 触发了 CI

在我工作经历中，遇到过手动改写 `package.json` 中版本号，却未同步到 `package-lock.json` 的事件。

而使用 `npm ci` 将会保证其安全性，但两者不匹配时，直接抛出异常。这给我们两个教训

1. 不要手动改写版本号
1. 在 CI 中使用 `npm ci` 保证安全性

## 自动删除 node_modules

当 `npm ci` 时，如果 node_modules 存在，则自动删除它，这是为了保证一个干净的 node_modules 环境，避免遗留旧版本库的副作用。

但由于在 CI 中往往是无状态的：触发构建时，将会在一个临时目录中拉取代码，此时node_modules 也不会存在。

## 不能单独装包

这一条很容易解释，它适用于持续集成环境中，无法单独装包，例如无法仅仅安装 `lodash`。
