# 如何对 npm 包进行升级

npm 的版本号为 `semver` 规范，由 [major, minor, patch] 三部分组成，其中

+ major: 当你发了一个含有 Breaking Change 的 API
+ minor: 当你新增了一个向后兼容的功能时
+ patch: 当你修复了一个向后兼容的 Bug 时

假设 `react` 当前版本号为 `17.0.1`，我们要升级到 `17.0.2` 应该如何操作？

``` diff
- "react": "17.0.1",
+ "react": "17.0.2",
```

## 自动发现更新

升级版本号，最不建议的事情就是手动在 package.json 中进行修改。

``` diff
- "react": "17.0.1",
+ "react": "17.0.2",
```

**毕竟，你无法手动发现所有需要更新的 package。**

此时可借助于 `npm outdated`，发现有待更新的 package。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-10/clipboard-6918.0c6824.webp)

使用 `npm outdated`，还可以列出其待更新 package 的文档。

``` bash
$ npm outdated -l
Package                 Current    Wanted    Latest  Location                            Depended by  Package Type     Homepage
@next/bundle-analyzer    10.2.0    10.2.3    12.0.3  node_modules/@next/bundle-analyzer  app          dependencies     https://github.com/vercel/next.js#readme
```

## 自动更新版本号

使用 `npm outdated` 虽能发现需要升级版本号的 package，但仍然需要手动在 package.json 更改版本号进行升级。

此时推荐一个功能更强大的工具 `npm-check-updates`，比 `npm outdated` 强大百倍。

`npm-check-updates -u`，可自动将 package.json 中待更新版本号进行重写。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-10/clipboard-3561.1b70dc.webp)

升级 [minor] 小版本号，有可能引起 `Break Change`，可仅仅升级到最新的 patch 版本。

``` bash
$ npx npm-check-updates --target patch
```

## 一点小建议

1. 当一个库的 major 版本号更新后，不要第一时间去更新，容易踩坑，可再度过几个 patch 版本号再更新尝试新功能
1. 当遇到 major 版本号更新时，多看文档中的 ChangeLog，多看升级指导并多测试及审计

