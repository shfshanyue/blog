# 如何做好一份前端技术周报 | 项目复盘

![](https://cdn.jsdelivr.net/gh/shfshanyue/blog/post/assets/weekly-mulu.png)

最近掘金有一个活动是项目复盘，想来我做前端技术周刊已经有一个月了，于是过来分享下项目经历。

这是山月最近在做的一个项目: [前端技术周刊](https://weekly.shanyue.tech/)，旨在做业内最具专业性的前端周刊，每一个开发者即使随便看看也有所裨益。

本项目可视为一个内容为主、技术为辅的一个产品，实际上来说对于一个内容产品而言，技术形态不是很重要。(所以写独立博客的各位，就不要纠结用哪个 SSG 工具了)

然而即使如此，我也还是花了一点时间看了看大火的 Gatsby 并对周刊进行了更丰富的展示。

下来先捋一捋这个项目的发展过程吧

## 缘起

从前端周刊来看前端发展史，这是一个不错的视角，即使后入行者也可以大致从中看出前端发展的脉络。一五年还有大量的 Gulp 文章，而一六年 webpack 就声名鹊起。一五年前周刊的半壁江山还在 CSS，如今 CSS 有可能几周才能看到一次。

加之，在诸多技术社区中经常会看到以下提问

1. 有哪些工具可以提高开发效率？
1. 对于 React/Vue/Node/TypeScript 的新版本，你怎么看这些新特性？
1. 最近 Tailwindcss/Vite 比较火，这些是什么东西？

基于广大前端开发者对技术的渴求与 996 无大量时间耗费的矛盾，我开发出了一款产品：[前端周刊](https://weekly.shanyue.tech)。但是是否有需求，还要经过充分的调研

## 调研

国内外做前端周刊的团队大概有几十家，国外细数如下

1. Javascript Weekly，分享一周内关于 JS 的热门技术文章、版本发布、优秀的库与工具及工作
1. Node Weekly，如上，只不过方向不同
1. React Status，如上
1. CSS Weekly，如上

(前三家周刊 UI 一致，为一个团队维护) 国外周刊的优点很多、专业性强，定期发布长期维护，以下优点值得学习

1. 拥有独立网站。可在相关网站实时查看近一期及历史所有期的周刊发布
1. 订阅制。可邮箱订阅及RSS订阅
1. 持续固定时间更新
1. 专业团队维护
1. 清晰的分门别类

国内也有几家，但是质量参差不齐，距离国外差距较大。大部分虽由大厂发布，但大部分比例为业余维护，质量参差不齐就不细说了。以此来看，向国外周刊看齐，做一份国内的前端周刊是可行的。

## 开发

Gatsby 是最为流行的静态网站的构建工具，这次把它作为本次周报的技术栈。综合使用下来 Gatsby 的感觉特别好，对SEO、打包、网络性能都做了极致的优化。除了依赖包难以下载，除了插件太多难以维护。

![](https://cdn.jsdelivr.net/gh/shfshanyue/blog/post/assets/gatsby-vs.png)

周刊内容需要解析成工具类、文章类、库包类，因此不能以 Markdown 来维护内容。

![](https://cdn.jsdelivr.net/gh/shfshanyue/blog/post/assets/weekly-leibie.png)

最终选择了 yaml 维护周刊并使用脚本构建为多个 Markdown。有兴趣的同学可以去 Github 看看代码: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)

## 优势

![](https://cdn.jsdelivr.net/gh/shfshanyue/blog/post/assets/weekly-mulu.png)

为什么要订阅这个前端周刊？这个周刊与其他周刊有何不同？

于是我总结了一下这个周刊相对于国内其它周刊的优势

1. 拥有独立网站: <https://weekly.shanyue.tech>
1. 多平台推送: 将会在掘金和知乎平台每周发布
1. RSS 订阅
1. 持续固定时间更新: 将在每周一早上九点发布
1. 推送文章认真阅读多遍，并做总结，图文并茂，而非截取描述
1. 内容丰富，推送分类为一句话技术总结、技术文章、版本发布、优秀的库、工具推荐统共五大类，并对每一类使用技术的角度抽取出来

## 用户

嗯...刚做了三期，目前用户还不是很多，期望随着周刊的期数越来越多会吸引更多的用户。

![](https://cdn.jsdelivr.net/gh/shfshanyue/blog/post/assets/weekly-juejin.png)

## 加入

今天在山月的**开发者工具交流群**中我分享了几个关于游戏中学习的网站，比如 CSS Dinner、Flex Frog、Grid Garden、Vim 大冒险等，作为我下一期前端周刊的工具推荐

![Vim 大冒险 - 通过闯关的方式](https://cdn.jsdelivr.net/gh/shfshanyue/blog/post/assets/vimadventure.png)

群里的小伙伴响应激烈，并且推了一个特别友好的关于可视化学习 Git 的闯关卡游戏: [Learning Git Branch](https://github.com/pcottle/learnGitBranching)

![可视化 Git 学习](https://cdn.jsdelivr.net/gh/shfshanyue/blog/post/assets/learngit.gif)

因此我创建了 **山月周刊推荐交流群**，欢迎大家加入，小伙伴在这里可以推荐优秀文章(非微信公众号)、学习工具等，每周一推送以下内容：

+ 每周新闻
+ 开发工具推荐  (已收录18个)
+ npm库包推荐  (已收录21个)
+ 优秀文章推荐  (已收录20篇)

目前周刊已经发了七期，如果你还没看过，请点击以下链接: [山月周刊](https://weekly.shanyue.tech/)，

![扫码进群](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bce22c038424350a9e48da6c81ca87c~tplv-k3u1fbpfcp-watermark.image)

## 总结

那如何做好一份前端技术周刊呢？我想大概就是，用心不敷衍。最后期待大家关注一下。
