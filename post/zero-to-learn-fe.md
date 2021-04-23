---
date: 2021-01-22 17:49
loc: 浙江金华义乌
description: 转专业、零基础如何开始学习前端？这里特意针对零基础者出了一份简易易执行的清单，从刚开始的心态准备到最后的服务端开发与前端部署，无不包含

---

# 零基础可操作的前端入门学习指南

本篇文章写给那些想初窥编程门径却不知如何下手的零基础非计算机科班的同学们。

本篇文章所推荐的所有资源，绝大部分可称得上我认为全网最好的资源之一，其中包括工具、网站、游戏都是我手不释卷翻过多遍的，至今仍然会不停的去翻去看，。

> 本文过长！强烈建议收藏并对比目录翻看

## 准备工作

### 心态

> 既不妄自尊大想着一口吃成胖子，也不妄自菲薄觉得自己写不了代码

零基础者学习编程或者前端，最重要的一点在于心理。

许多人一看代码二字就吓住了，想起了大学时被C语言二级支配的痛苦，于是刚听到编程俩字，就已被劝退，心里便想着：我不行，敲不了代码。于是未战先败。不过你放心，相对于C语言来说，前端入门可以称得上既简单又好玩。

相对于其它转专业来学前端的，前端实在过于简单。相比机械电子来说，前端不费材料，不用机床不用电路板，没有高价的设施要求，也无生命安全之忧。(话说，山月在大学见别人车零件时总怕切到手)

还有一些人会问：写代码是不全是写英文，英文不好可以吗？如果说代码和英文相关，那估计只有几个关键字的单词吧。学习编程只要你有英语四级的水平，正常的英文阅读水平，但大部分时候是用来去阅读英文文档。**你需要养成阅读英文文档的习惯。**

![沙拉查词插件](./assets/learn-fe-en-plugin.png)

下载地址: <https://saladict.crimx.com/>

### 坚持

> 贵有恒，何必三更起、五更眠；最无益，只怕一日曝、十日寒。

保证每天可以至少学习两个小时，挤一挤上下班通勤时间应该是比较容易做到的。每天起早贪黑牺牲睡眠时间就没有必要，毕竟贵有恒。

对于前端，所见即所得，如同嗑瓜子一样，可以快速得到学习效果的正反馈，也更容易坚持。

学前端全在死功夫，笨功夫。

### 工具

> 工欲善其事，必先利其器。

这里介绍三款山月认为的**必备必备必备工具**吧:

+ [VSCode](https://code.visualstudio.com/): VSCode 是一款编辑器。在我开始学习编程时，Sublime Text 都给人眼前一亮。而随着编辑器的发展，对于前端而言，VSCode 无疑是最流行最好用的那款。在学习前端之前，务必装好这个软件。
+ [Github](https://github.com/): Github 是全球最大的开源平台，你可以在上边找到你想要的代码及学习资料。如果离开了 Github，很多程序员将面临失业，这并不是夸夸其谈。
+ [DevDocs](https://devdocs.io/): 文档，可理解为官方学习资料，贯穿编程的每一天，基本与文档随影随行，**学习编程的最重要一步就是养成看文档的习惯**。devdocs 有可能是最全的文档库。
+ Chrome: 谷歌浏览器

### 终端 (命令行工具)

+ iterm2 (Mac)
+ cmd (Windows)

### 存疑

1. 百度/Google/Segmentfault
1. 博客园/掘金/CSDN

知乎？别去知乎问，怕被喷。

## 基础: HTML/CSS/JS

一切准备就绪，这时候要接触代码了，不过这一部分并不困难。

HTML/CSS/JS 被称为前端网站编写三剑客，也是常说的前端所需编写的代码。对于目前大部分互联网前端岗位而言，Javascript 是无可争议的大头。

+ [MDN](https://developer.mozilla.org/zh-CN/docs/learn)
+ [慕课网](https://imooc.com)
+ [网易云课堂](https://study.163.com/)

## HTML: 两天时间

![HTML 课程](./assets/learn-fe-html.png)

+ 学习资料: [初识HTML(5)+CSS(3)-2020升级版](https://www.imooc.com/learn/9)，包含了 HTML 和 CSS 的教程。
+ 学习资料二: [MDN](https://developer.mozilla.org/zh-CN/docs/learn) 中的[新手请从这开始](https://developer.mozilla.org/zh-CN/docs/Learn/Getting_started_with_the_web)与 [HTML-构建Web](https://developer.mozilla.org/zh-CN/docs/Learn/HTML) 部分，MDN 是服务于开发者最齐全的文档，也是前端**必不可少翻得最多的文档**

在慕课网中教程为交互式学习，根据它提供的代码在编辑器中运行即可，**无需使用 VSCode**。而 MDN 的教程会引导你从新建一个 index.html 文件开始。

**花费两天时间照着以上教程至少过一遍，如果遇到无法理解的问题，深思三遍仍不得其解，不要硬磕，否则容易引来挫败感，直接跳过即可。**为了加深记忆，可以过三遍。

即使最后忘记了所有标签，只要记得以下这些标签及整体框架即可:

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <div>hello, world</div>
</body>
</html>
```

如果连以上标签也无法记得，那就记住以下这个标签，然后愉快地开启下一章节吧！

``` html
<div>hello, world</div>
```

## CSS: 五天时间

+ 学习资料: [初识HTML(5)+CSS(3)-2020升级版](https://www.imooc.com/learn/9)，包含了 HTML 和 CSS 的教程。

在 CSS 中涉及到的知识点比 HTML 章节要多少很多，**此时必然会有一些属性无法牢记，比如 animate、transform 等，无需理会，此时仅仅需要知道他们能够实现什么样的效果即可，并在以后项目实践中不断加强**

### CSS 趣味练习

以下三种是关于学习 CSS3 选择器、Flex、Grid最好的教程了，并且极其富有趣味性

+ [CSS Diner](https://flukeout.github.io/)
+ [Flex Forggy](https://flexboxfroggy.com/)
+ [Grid Garden](https://cssgridgarden.com/)

## 插曲: Chrome Devtools

![Chrome Devtools](./assets/learn-fe-devtools.png)

学习完 HTML/CSS 后，可以发送一下，学点 Devtools 的用法，以下不需要掌握，多看一点是一点

一个前端每天有一半的时间在敲代码、另一半的时间在点 Devtools。从中可以看到 Devtools 在前端中的地位及重要性。

参考两篇文章学起来:

1. [Chrome 开发者工具官方文档](https://developers.google.cn/web/tools/chrome-devtools?hl=zh-cn)
1. [Chrome 开发者工具非官方小册子](https://legacy.gitbook.com/book/leeon/devtools)

### 练习一: 更改网页内容

在我初学 Chrome 的开发者工具后，最爱改一些数字，然后截图给我的朋友和发到朋友圈，你也来试一试吧

![更改知乎信息](./assets/learn-fe-edit.png)
### 练习二: 查看密码明文

当忘记密码时，浏览器仍然记得你的密码，在开发者工具中修改 `input.type` 即可做到

![查看明文密码](./assets/learn-fe-pwd.png)
## Javascript: 七天

相对于 HTML/CSS 而言，Javascript 才可以称得上是一门编程语言。**从这里开始你要开始使用编辑器 VSCode**

### 第一阶段: 语言基础

![JS 基础学习](./assets/learn-fe-js.png)

学习资料: [MDN 上的 Javascript 入门篇](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/First_steps)

在 MDN 作为教程，并在 Chrome Devtools 或者在 VS Code 中练习

+ 变量: const/let
+ 数据类型: number/string/boolean/null/undefined/object(Object, Array, Date)
+ 流程控制: IF/FOR/WHERE
+ 函数: Function、`() => {}`

### 第二阶段: DOM API

![DOM API 学习](./assets/learn-fe-dom.png)

学习资料: [MDN 上的 DOM API 概述](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction)

DOM API，及 DOM 赋予 Javascript 的各种操作 HTML 的 API。现代前端框架对于 DOM 手动操作已经很少很少了，但是了解还是必不可少的。

在 Chrome Devtools 中输入以下变量观察挂在上边的所有属性:

``` js
// 一: 了解 document 对象
> document

// 二: 了解 window 对象
> window
> window.localStorage
> window.location

// 三: 了解 Event 事件
> document.addEventlistener('click', () => {})
> element.onClick = () => {}
```

### 第三阶段: ES6+

学习资料: 

1. [ES6 入门教程](https://es6.ruanyifeng.com/)
1. [Javascript 参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)

可速查[浏览器兼容性表](https://kangax.github.io/compat-table/es6/)

对于数组与对象的 API 要多看，反复地看，翻来覆去的看。就按照下边 MDN 的 API 列表来看，先看目录有不熟悉、不了解的、没见过的 API 更要重点看看。

1. [数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
1. [对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

### 第四阶段: lodash/npm

写代码的经常有几句话挂在嘴边: **不要重复造轮子**别人实现过的功能，你无需再实现。

npm 是 js 的包管理工具，你可以通过它下载各种各样的库(即各类别人实现的函数的集合)。

这里介绍两个只要你工作就肯定会用到的库: lodash。

``` bash
# 安装一个库
$ npm install lodash
```

lodash 拥有着各种各样方便的工具函数，**向熟悉 ES6+ API 一样熟悉 lodash 的 API**。你需要打开它的官网 [lodash](https://lodash.com/docs/)，并在侧边打开控制台，一个一个照着文档敲他的例子

> 无剑胜有剑

[You Dont Need Lodash Underscore](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore)

## 第五阶段: You Dont Know Javascript

选学！

## 插曲: Git

学习资料: [最好用的 Git 教程](https://learngitbranching.js.org/?locale=zh_CN)

Git 也是工作中必不可少的，但敲的最多的就是以下几条命令了。


``` bash
$ git pull origin master
$ git add -u
$ git commit -m 'update'
$ git push origin master
```


[githug](https://github.com/Gazler/githug)，**采用玩游戏的方式闯过 Git** 你需要这个为你的 Git 学习填充一点乐趣！

### gitlen: 可视化 Git

[gitlen](https://gitlens.amod.io/) 是 VSCode 中关于 git 的可视化神器，但是最重要的是要搞明白几个问题

1. 如何查看当前行的上次更改者
1. 如何看某人某次的提交是什么
1. 如何看当前文件当前行上次是如何被修改的
1. 如何看当前文件的提交历史是什么

## 插曲: VsCode Plugins

为了使你的 VSCode 更加好用，现在可以开始安装插件了，以下我只强烈安装一个。

滚瓜烂熟

有时候工具的掌握如同 API 一样重要，但很有可能被忽视，那是因为面试里不会涉及

+ GitLens
+ Emmet

## 框架: React 十五天

学习资料:

+ [React 官方文档](https://reactjs.org/docs/getting-started.html)，重理论，精读至少两遍。文档永远是第一手学习资料！！！对于 React 文档我已阅读了不下五遍。
+ [React Express](https://www.react.express/)，重实践，精读一遍，特别是对于 。对于 React 官方文档更为简洁，最重要的是对于每一个技术点都有实时编辑器进行调试。

Playground:

强烈推荐一下两个 Playground，类似线上的 VSCode，让你更加关注于 React 的学习。这个阶段你不需要在本地打开 VSCode，

+ [CodeSandBox](https://codesandbox.io)
+ [stackblitz](https://stackblitz.com)

## React 与工程化

此时，你要学的不仅仅是 React，而是一种现代化框架绑定的各种方法论，你至少需要对以下有所了解

+ React
+ Sass/Less/Stylus
+ Webpack

1. 通读 React 文档，所有章节过一遍，重要章节过三遍

### Create React App

+ [Create React App](https://github.com/facebook/create-react-app)
+ [CRA 文档](https://create-react-app.dev/docs/getting-started)

1. **通读 CRA 的文档**
1. 在本地跑起来项目
1. 了解文件目录结构，并了解每个文件的配置
1. **通读 CRA 的文档**

## 框架生态圈: React/ReactRouter/AntDesign/Next

1. 看文档
1. 跑示例
1. 看文档
1. 跑示例
1. 看文档
1. 跑示例
1. ...

+ [React](https://reactjs.org/)
+ [React Router](https://reactrouter.com/)
+ [Next](https://nextjs.org/)
+ Redux/Mobx
+ [Ant Design](https://ant.design/)

## HTTP: 前后端沟通桥梁

+ fetch API
+ axios

## 插曲: 调试 HTTP

## Node Server

你现在终于可以知道别人经常念叨的 Java、Python 是做什么的，他们大部分是用来做服务器端。

+ C++
+ Java
+ Python
+ Go
+ PHP

但是，作为一个初窥门径的 FEer，使用 Koa 吧

``` js
const Koa = require('koa')
const app = new Koa()

app.use(ctx => {
  ctx.body = 'hello, world'
})

app.listen(3000)
```

## 项目实战: 已毕业 ? Github Projects : 实习

## 面试
