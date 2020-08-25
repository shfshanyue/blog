# 使用 serverless 与 GraphQL 开发一个 markdown-to-html-api 服务

在 `github` 上关于 `html-to-markdown` 的库有很多，如著名的 [turndown](https://github.com/domchristie/turndown)。而关于 `markdown-to-html` 的库却很少，原因大概是以下两点 [](https://github.com/showdownjs/showdown)

1. markdown 转化 html 过于简单，相比 html-to-md 需要处理各种无语义标签并解析，要简单很多
1. markdown 转化 html，往往更注重 `html` 的样式，而关于样式大家喜爱千差万别，而又无统一的主题样式(如 solarized)配置

``` md
<!-- 转化前 -->
## hello

<!-- 转化后 -->
<h2>hello</h2>
```

## 需求

而关于 markdown 转 html，大家确实有实实在在的需求：

1. 微信公众号开发上传图文素材时，格式是 html，并且需要适配好看的主题
1. 发送邮件时，格式是 html，如果自己
1. 喜欢收藏文章另存为 html，并且需要漂亮的赏心悦目的主题，方便转化为 PDF 或电子书格式

好吧，这些需求貌似有些牵强，但我确确实实有这方面需求，需要自动上传素材到公众号，免于每日半小时的辛苦，简述以下我的两个需求

1. 运营着【诗词古文】公众号，希望每日自动上传三篇文章，作为我日常闲暇及跑步时的慰藉，而我每天至少需要花一个多小时选择诗词并整理排版
1. 运营着【互联网大厂招聘】公众号，希望每日自动上传已备好的面试题及简答，附上首部及尾部，而我每天也要花半个小时在来回排版及添加收尾

我不禁被这每日的琐碎重复繁琐任务所折磨 (越说越感觉像是我们做的无穷无尽的业务)，作为程序员，当然要用编码来解放生产力来体现程序员的价值。**于是决定做一个 `markdown-to-html` 的工具或者服务**

当然要做以上的工具，仅仅要做一个 `markdown-to-html` 是不够的，于是我又做了以下事情：

1. `promise-utils`，一系列的 promise 工具，方便上传多个图文消息时控制并发数及错误重试
1. `shici-spider`，关于诗词的爬虫
1. `apollo-server-starter`，关于诗词爬取的
1. `shici-api`，可以随机获取一篇优秀的古诗文，采用了 `GraphQL`，指哪取哪
1. `interview-api`，可以随机获取一篇面试题，采用了 `GraphQL`，指哪取哪
1. `wechat-sdk`，关于微信API封装的一个 SDK
1. `wechat-cron`，关于自动上传图文素材的系列脚本

