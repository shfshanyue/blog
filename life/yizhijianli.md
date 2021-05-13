# 只有一张纸的简历 一纸简历发布

在两天前，有一个关于尤大的直播，其中探讨了许多问题:

1. Vue 的模板可以像 Svelte 一样高效地做静态编译优化，facebook 搞的 prepack 基于高灵活的 JS 已经没了动作
1. 面试问源码就是人为设坎，一个人的 Vue 水平有多高与他有没有看过源码没有太大的相关性
1. LowCode 是在自由度与易用度为两端的一条线段上尝试不同的点做平衡
1. Serverless 取决于公司的 Infra，而你最多能考虑的是选哪家的服务
1. 微前端需要取决于你们的业务场景

但其中一个问答对我印象极深：

> Q: 如何平衡 Vue 与 Vite 的开发？
> 
> A: 以周或者月为单位来进行切换。

这对我带来了极大的启发，连续时间的注意力集中至关重要。我痛改掉我喜欢在几个项目间横跳的习惯，一鼓作气把一纸简历发布上线。

---

![一纸简历](https://cdn.jsdelivr.net/gh/shfshanyue/blog@master/life/assets/yizhijianli.png)

简历，只用一页纸写完，重点突出，一目了然，这也是我做一纸简历的初衷。先来看一看一纸简历的成品。

+ [一纸简历](https://cv.devtool.tech)
+ [一纸简历](https://cv.devtool.tech)
+ [一纸简历](https://cv.devtool.tech)

## 图标设计

自己曾做过很多个大小网站，但都逃不过两点，一是丑，二是没图标。比如以前做的极客时间返现平台，既没有 logo，还长得丑。

![](https://cdn.jsdelivr.net/gh/shfshanyue/blog@master/life/assets/geek.png)

长得丑无可救药，没图标这事儿还可以抢救一下，我使用 sketch 辛苦一天整出了第一个图标。

![一纸简历 ICON](https://cv.devtool.tech/icon.svg)

**图标中外边的文档代表一张纸，图标中下边的 M 是 Markdown 的标志，寓意用 Markdown 编写的一张纸简历。**

## 使用指南

一纸简历，你只需要使用基础的 Markdown 语法与特殊的 FrontMatter 即可生成简历。它具有以下功能

1. 一纸简历，顾名思义，最终导出只有一纸大小的文档
1. 模板主题，多种模板，根据个人风格选择简约与美观
1. Markdown，语法简介上手快，几乎不存在学习成本
1. 实时渲染为 PDF，可直接预览与下载

一纸简历根据 Markdown 生成只有一页纸的 PDF 格式简历。它的语法与 Markdown 一致，但对部分语法不受支持，一纸简历的主要组成部分为两大块:

1. Markdown 中的**frontmatter**生成结构化的基础信息，如姓名、手机号、微信等个人信息
1. Markdown 中的**正文**生成非结构化的简历主体内容，如工作负责具体事项及其成果

### 基础信息 frontmatter 中的字段释义

基础信息中的 `frontmatter` 采用 `yaml` 书写，以下字段均为选填，不填则不显示

+ `name` (string): 求职人姓名，如 `山月`
+ `desc` (string): 求职人关于自己的描述，如 `山月科技前端架构师`，`十年后端，五年前端` 等
+ `avatar` (string): 求职人照片或者头像，可以取 Github 等社交平台上的头像 URL 地址
+ `avatarCircle` (boolean): 头像是否显示为圆形头像
+ `graduation` (string): 毕业院校及时间信息，如 `家里蹲大学/2018级`
+ `blog` (string): 博客地址
+ `github` (string): Github 用户名，不用填写具体首页地址。如 `shfshanyue`
+ `wechat` (string): 微信号
+ `phone` (string): 手机号
+ `email` (string): 邮箱地址
+ `skills` (`([string, number] | string)[]`): 技能及掌握程度，5 为满星，也可以不标星

### 正文信息

目前支持以下 Markdown 语法:

+ heading: `#`、`##`、`###`、`####`、`#####`、`######`
+ inlineCode: `\`hello\``
+ a: `[shanyue](https://shanyue.tech)`
+ list: `+`、`-`、`1. `

目前不支持以下 Markdown 语法:

1. 引用: `blockquote`
1. Markdown 扩展语法

### 多页简历

本应用主要引入一页简历，如需多页简历，请转到另一个使用 Markdown 书写的 [码途编辑器](https://markdown.devtool.tech/app)。

它是一个 Markdown 编辑器，支持多种主题，并可导出为 PDF。你可以把多页简历使用 Markdown 书写，并使用它来导出 PDF。

## 技术架构

一纸简历完全是纯前端实现，无服务器端参与。因此技术的难点在于**在浏览器端，如何把 Markdown 渲染为 PDF 可供实时预览与直接下载**。

而实现原理说起来简单: **从 Markdown 起，AST 经各种转换，在浏览器中生成二进制的PDF文档，并在浏览器中进行展示**。

对于一个业务同学而言，其中的难点不在于如何从零实现，而在于如何在一百万的 npm 仓库中找到合适的轮子，从零实现既无心力也不必要。而对于此实现最重要的三个库呈现在眼前

1. [react-markdown](https://npm.devtool.tech/react-markdown): Markdown 渲染为 React Component
1. [@react-pdf/renderer](https://npm.devtool.tech/@react-pdf/renderer): React Component 制作 PDF 文档
1. [react-pdf](https://npm.devtool.tech/react-pdf): 把 PDF 文档通过 SVG/Canvas 的形式在浏览器中渲染出来

## 尝试与反馈

线上地址: [一纸简历](https://cv.devtool.tech)

如果你有任何使用上的问题与建议，可以添加我的微信 `shanyue94` 进行反馈与交流。

## 下一步规划

1. 主题模板: 添加更多的样式，每一个人都有不同的风格，简约与美观不能兼顾，将会开发更多的模板供用户选择
1. 内容模板: 相比主题样式而言，内容或许更为重要，如何写更好的简历每个人都有不同的简介，我将与诸多大厂同学对简历内容进行讨论，制作出多种内容模板
1. 定制模板: 供用户自定义模板
1. 分享链接: 这有可能是一个非常好用的功能，可把简历生成为一个拥有过期时间的 URL，方便在投递简历时进行沟通。

对于以上四个下一步规划，你更喜欢哪一个呢，欢迎留言，山月将把时间留给最为迫切的需求。

留言点赞最多的三位用户将每人送一件短袖

(:投票
