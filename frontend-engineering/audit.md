# npm audit

如何确保所有 `npm install` 的依赖都是安全的？

当有一个库偷偷在你的笔记本后台挖矿怎么办？

比如，不久前一个周下载量超过八百万的库被侵入，它在你的笔记本运行时会偷偷挖矿。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-03/clipboard-0833.d9da75.webp)

## Audit

`Audit`，审计，检测你的所有依赖是否安全。`npm audit`/`yarn audit` 均有效。

通过审计，可看出有风险的 `package`、依赖库的依赖链、风险原因及其解决方案。

``` bash
$ npm audit
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ high          │ Regular Expression Denial of Service in trim                 │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ trim                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=0.0.3                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ @mdx-js/loader                                               │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ @mdx-js/loader > @mdx-js/mdx > remark-mdx > remark-parse >   │
│               │ trim                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://www.npmjs.com/advisories/1002775                     │
└───────────────┴──────────────────────────────────────────────────────────────┘
76 vulnerabilities found - Packages audited: 1076
Severity: 49 Moderate | 27 High
✨  Done in 4.60s.
```

你可以在我的笔记本上挖矿，但绝不能在生产环境服务器下挖矿，此时可使用以下两条命令。

``` bash
$ npm audit production

$ yarn audit dependencies
```

![Audit](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-03/clipboard-1904.f4c916.webp)

通过 `npm audit fix` 可以自动修复该库的风险，原理就是升级依赖库，升级至已修复了风险的版本号。

``` bash
$ npm audit fix
```

`yarn audit` 无法自动修复，可使用 `yarn upgrade` 手动更新版本号，不过不够智能。

[synk](https://snyk.io/) 是一个高级版的 `npm audit`，可自动修复，且支持 CICD 集成与多种语言。


``` bash
$ npx snyk

$ npx wizard
```

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-03/clipboard-1409.96de76.webp)

## CI 机器人

可通过 CI/gitlab/github 中配置机器人，使他们每天轮询一次检查仓库的依赖中是否有风险。

![Github 机器人](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-03/clipboard-4186.0dac46.webp)

在 Github 中，可单独设置 `dependabot` 机器人，在仓库设置中开启小机器人，当它检测到有问题时，会自动向该仓库提交 PR。

![dependabot](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-03/clipboard-6581.08f1c2.webp)

而它的解决方案也是升级版本号。

![Github Bot 提的 PR](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-03/clipboard-8617.e80863.webp)
