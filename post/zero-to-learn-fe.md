# 零基础前端入门学习指南

本篇文章写给那些想初窥编程门径却不知如何下手的零基础非计算机科班的同学们。

> 专家者视角

## 准备工作

### 心态

> 既不妄自尊大想着一口吃成胖子，也不妄自菲薄觉得自己写不了代码

零基础者学习编程或者前端，最重要的一点在于心理。

许多人一看代码二字就吓住了，想起了大学时被C语言二级支配的痛苦，于是刚听到编程俩字，就已被劝退，心里便想着：我不行，敲不了代码。于是未战先败。不过你放心，相对于C语言来说，前端入门可以称得上既简单又好玩。

相对于其它转专业来学前端的，前端实在过于简单。相比机械电子来说，前端不费材料，不用机床不用电路板，没有高价的设施要求，也无生命安全之忧。(话说，山月在大学见别人车零件时总怕切到手)

### 坚持

> 贵有恒，何必三更起、五更眠；最无益，只怕一日曝、十日寒。

保证每天可以至少学习两个小时，挤一挤上下班通勤时间应该是比较容易做到的。每天起早贪黑牺牲睡眠时间就没有必要，毕竟贵有恒。

对于前端，所见即所得，如同嗑瓜子一样，可以快速得到学习效果的正反馈，也更容易坚持。

### 工具

> 工欲善其事，必先利其器。

这里介绍三款山月认为的**必备工具**吧:

+ [VSCode](https://code.visualstudio.com/): VSCode 是一款编辑器。在我开始学习编程时，Sublime Text 都给人眼前一亮。而随着编辑器的发展，对于前端而言，VSCode 无疑是最流行最好用的那款。在学习前端之前，务必装好这个软件。
+ [Github](https://github.com/): Github 是全球最大的开源平台，你可以在上边找到你想要的代码及学习资料。如果离开了 Github，很多程序员将面临失业，这并不是夸夸其谈。
+ [DevDocs](https://devdocs.io/): 文档，可理解为官方学习资料，贯穿编程的每一天，基本与文档随影随行，**学习编程的最重要一步就是养成看文档的习惯**。devdocs 有可能是最全的文档库。

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

+ [慕课网](https://imooc.com)
+ [网易云课堂](https://study.163.com/)

## HTML: 一天时间

![]()

+ 学习资料: [初识HTML(5)+CSS(3)-2020升级版](https://www.imooc.com/learn/9)，包含了 HTML 和 CSS 的教程。
+ 文档协助: [MDN](https://developer.mozilla.org/zh-CN/docs/learn)，MDN 是服务于开发者最齐全的文档，也是前端**必不可少翻得最多的文档**

目前这个阶段敲代码在教程所提供的代码编辑器中运行即可，**无需使用 VSCode**。**花费一天时间照着以上教程至少过一遍，如果遇到无法理解的问题，深思三遍仍不得其解，不要硬磕，容易引来挫败感，直接跳过即可。**为了加深记忆，可以过三遍。

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

如果连以上标签也无法记得，那就记住以下这个标签:

``` html
<div>hello, world</div>
```

## CSS: 三天时间

![]()

+ 学习资料: [初识HTML(5)+CSS(3)-2020升级版](https://www.imooc.com/learn/9)，包含了 HTML 和 CSS 的教程。

目前这个阶段敲代码在教程所提供的代码编辑器中运行即可，无需使用 VSCode。在 CSS 中涉及到的知识点比 HTML 章节要多少很多，**此时必然会有一些属性无法牢记，比如 animate、transform 等，无需理会，此时仅仅需要知道他们能够实现什么样的效果即可，并在以后项目实践中不断加强**

### CSS 趣味练习

+ [CSS Diner](https://flukeout.github.io/)
+ [EnjoyCSS](https://enjoycss.com/)

## 插曲: Chrome Devtools

### 练习一: 更改网页内容

### 练习二: 查看密码明文

## Javascript: 七天

![]()

+ 学习资料: 

相对于 HTML/CSS 而言，Javascript 才可以称得上是一门编程语言。

### 第一阶段: 语言基础

+ 变量: const/let
+ 数据类型: number/string/boolean/null/undefined/object(Object, Array, Date)
+ 流程控制: IF/FOR/WHERE
+ 函数: Function、`() => {}`

### 第二阶段: DOM API

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

+ 学习资料: [初识HTML(5)+CSS(3)-2020升级版](https://www.imooc.com/learn/9)，包含了 HTML 和 CSS 的教程。

### 第四阶段: npm/(lodash/moment)

``` bash
$ npm install 
```

``` js
https://github.com/js-cookie/js-cookie
```

## 插曲: Git

``` bash
$ git pull origin master
$ git add -u
$ git commit -m 'update'
$ git push origin master
```

## 插曲: VsCode Plugins

+ GitLens

## 框架: React

+ React: 七天

## 框架生态圈: React/React Router/Ant Design

+ React
+ React Router
+ Next
+ Redux/Mobx
+ Ant Design

## HTTP: 前后端交流桥梁

+ fetch API
+ axios

## 简单 Server

你现在终于可以知道别人经常念叨的 Java、Python 是做什么的，他们大部分是用来做服务器端。

+ C++
+ Java
+ Python
+ Go
+ PHP

但是，作为一个初窥门径的 FEer，使用 Koa 吧

``` js
const app = require('koa')

```

## 项目实战: 已毕业 ? Github Projects : 实习



## 面试

