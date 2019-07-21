# 山月大姐，在哪些在线平台可以练习及实验 JS 代码 (API)

一天，一个粉丝在微信上私信我:

“山月大姐，在哪些工具平台上可以练习 JS 代码呢？”

大姐？？

![](https://img.soogif.com/8iHLiXBwQwKFp0fVUvkXGttwG1A26aln.gif?scope=mdnice)

我本来不想搭理他，但是想想这个问题简直太适合我了。我现在很少在本地测试代码，基本上所有代码都托管在云平台。

“那发10块钱的红包吧”

十块钱的红包换一篇文章来解答，还是挺值的。

## Chrome Devtools Source Pannel

### ES6/DOM API

![在 Devtool 中进行学习](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210604/image.2qgmdog77600.png)

MDN，前端必备手册，网站中的犀牛书，比犀牛书更全更新更易于索引，而且免费。

因此，在我的文章[构建前端知识体系](https://shanyue.tech/post/zero-to-learn-fe.html)中，把它作为所有前端不可绕过的学习资源网站。这篇文章过长，已整理成 PDF，需要PDF 的同学可以添加我微信 `shanyue94` 获取。

一边打开 MDN 查文档，一边在控制台敲代码学习 API，这是学习简单 ES6/DOM API 的正确姿势。

在脑海中过一遍，随即在手上也敲一敲，这个 API 差不多就有些印象了，以后需用到时，方便去索引。

### npm 第三方库

第三方库的 API 是无法在控制台直接使用的，除非你全局引入它的 CDN。幸好，一个**由山月大佬制作的**伟大的工具网站[NPM.DEVTOOL](https://npm.devtool.tech) 完成了这件事情。

![NPM.DEVTOOL](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/image.3yis0otdgps0.png)

一边打开 [NPM.DEVTOOL](https://npm.devtool.tech)，一边在控制台敲代码学习 API。

![在 NPM.DEVTOOL 中试验 API](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210604/image.37eltlk8id60.png)

## Codepen: CSS/DOM 简单代码试验场

> 如果涉及到 CSS 如何？
>
> 如果过于复杂的操作，上传一个大文件如何操作？
>
> 一些较为复杂的新式 Web API 如何测试，如 FileSystem Access API 等？

这就需要真正的 Web IDE 来救场，Codepen 当属独一无二，CSS 测试利器，浏览器 WebAPI 测试首选！

在 Codepen 这种云平台代码工具，可以很容易地使用、尝试新功能，但最重要的是，**它可以更好的组织整理你的代码片段**！

我关于前端面试的 CSS 及简单代码部分，全部收藏在 Codepen，并新建了收藏夹进行收藏。**有需要的同学可以微信留言 codepen 获取面试指南代码集合**。

![前端面试指南](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210604/image.1qo7xcauqhds.png)

## Codesandbox: React/Vue 最佳试验场

> 如果涉及到 React/Vue 需要前端工程化呢？

别急，先来一道面试题，请问以下输出 `count` 是多少？

``` js
const [count, setCount] = useState(0)

// ......

setCount(10)
console.log(count)
```

如果我们想获知正确答案，亲自去敲一遍代码怎么样？

这当然是好的，问题是去哪里敲，去大费周章地再自有项目里测试病之后删掉吗，还是费心费力地去新建一个 React 项目并测试呢？

这些都不需要，使用 `Codesandbox` 吧，专为工程化项目而生！

![前端面试指南](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210604/image.46fjaxeq5za0.png)

嗯，同时，我把所有关于 React 的面试题都置于一个文件夹下，有需要的同学微信留言 codesandbox 获取地址。

## Stackblitz: Node API 学习

那，关于 Node API 的测试呢？

比如 Node Server，可以试试 `codesandbox`，也可以试试 `stackblitz`，他们关于简单的 Node Server 都支持良好。

部分 API (fs、process、cluster、worker、os)，与操作系统强相关，更推荐跑在本地环境。

## 总结

+ Chrome Devtools: 简单 API
+ Codepen: CSS 与 DOM API
+ Codesandbox: React/Vue 工程化项目
+ Codesandbox/Stackblitz: Node Server
+ LocalFile: Node API