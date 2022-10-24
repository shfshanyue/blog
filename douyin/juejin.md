# 交个朋友，我做了一个掘金会员返现平台全部返点

大家好，我是山月。

在我今天日常逛掘金的时候发现，掘金小册的右上角有一个小图标。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6b51e59b3e2420fbb34430dcca6dd7d~tplv-k3u1fbpfcp-watermark.image?)

原来这是关于掘金小册的推广链接，每当他人通过我的链接购买小册后，则我可以拿到相应的返点，比如这里是大约六块钱，掘金小册价格的 20%。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4d1e838c63440c882f06027da630a58~tplv-k3u1fbpfcp-watermark.image?)

那让别人通过我的推广链接购买，我再把 20% 的返点拿给大家，那岂不是相当于变相打八折了。

但是，每次别人需要购买时，我还需要将购买链接拿给别人，也挺麻烦的。

那我是不是可以做一个返现平台，别人想买哪门课都就可以找到该课的链接，我再将返点回馈给大家。

这样虽然无法实现自动化，但还是稍微简单了些。

那就开始开发吧！

我们使用浏览器开发者工具中的网络面板分析请求，并通过 [Apifox](http://apifox.cn/a1shanyue) 进行接口调试，写个脚本生成所有课程数据，并将数据渲染到页面上。

最终，我做了这么一个平台，欢迎大家使用。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2596dc9cd08348418b3203d04dbafa60~tplv-k3u1fbpfcp-watermark.image?)

地址: [掘金会员返现平台](https://geek.shanyue.tech/juejin)