---
date: 2021-11-16
---

# 山月新站发布: semver 可视化查看器与 tree 树形目录自动生成器

大家好，我是山月。今天周二，又到了一周一度的山月新站发布时间。

周末做的工具都比较简单，因此写了两个。先睹为快，附上链接: 

+ semver: <https://devtool.tech/dataurl>。当输入 `~1.2.3` 版本号时，它会计算出该版本号的范围。
+ tree: <https://devtool.tech/tree>。以 Markdown 列表的方式输入，将以树形目录方式输出，方便写作。

![semver 版本号查询](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89b2d9a7688b4b818e99df2bd0f2536f~tplv-k3u1fbpfcp-watermark.image?)

![树形目录可视化生成器](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eae7aa34917a4f6dad4adbd5ccd485e4~tplv-k3u1fbpfcp-watermark.image?)

## Semver 工作原理

`semver`，`Semantic Versioning` 语义化版本的缩写，文档可见 <https://semver.org/>，它由 `[major, minor, patch]` 三部分组成，其中

+ `major`: 当你发了一个含有 Breaking Change 的 API
+ `minor`:  当你新增了一个向后兼容的功能时
+ `patch`: 当你修复了一个向后兼容的 Bug 时

对于 `~1.2.3` 而言，它的版本号范围是 `>=1.2.3  <1.3.0`

对于 `^1.2.3` 而言，它的版本号范围是 `>=1.2.3  <2.0.0`

`npm package` 通过 `semver` 进行版本管理。当我们下载 `lodash` 时，如果此时最新版本号为 `lodash@4.17.4`，则默认在 `package.json` 中维护的版本号为 `lodash@^4.17.4`。

## 如何获取一个版本号的范围

``` js
import { Range } from 'semver'

// >=1.2.3 <2.0.0-0
new Range('^1.2.3').range
```

## 树形目录生成器

在 linux 中，可借助于命令行工具 `tree` 来生成树形目录。

``` bash
$ tree -L 2
.
├── config
│   └── webpack.config.js
├── components
│   ├── Modal
│   ├── Form
│   └── Table
├── pages
│   ├── home
│   ├── app
│   └── help
├── package.json
└── package-lock.json
```

然而手动生成目录十分不便，在写作中，往往需要手动输入树形目录，十分不便。

于是该工具有了存在的意义。它可以将 Markdown List 解析为 AST，并渲染成树形目录。

---

下一个工具与新功能的建议欢迎留言！

---

~~下一个工具，我已经想好了，一个 `SVG Viewer`，可压缩可美化、可预览图片、可生成 DataURL、可转为 JPG/PNG、可转为 React Component。~~

下一个工具，大概是整合下网站中的所有编码解码类工具。
