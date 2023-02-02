# API 调试的四点技巧，让你的接口返工更少

作为后端开发者，CURD 写 API 接口时最痛苦的是什么？

每次产品迭代，后端开发者扫一眼需求文档，就马不停蹄上手敲代码了，不到一天，API 接口全部实现，以为此时万事大吉。

但令人沮丧的一点是，此时与前端团队联调接口，**很多字段设计不匹配**。前端一脸不满满是怨恨地指出，这里是不还有个字段，这个字段是不是应该是个整数类型。

于是作为后端开发者，只能无奈返工，经过 N 次如此经历，前后端开发者均身心俱疲，终于联调结束，那如何减少接口返工，减少对双方的折磨及互相伤害呢？

![](https://files.mdnice.com/user/24782/25a7be6a-bb12-4f69-96ef-10fabbd1267c.png)

本文介绍四个 API 调试小技巧，让你接口返工更少：

1. 先设计，再编码
2. 测试，一定要测试
3. CI Pipeline，让你的 API 测试自动化
4. 将异常 API 使用 400+ 状态码，便于定位

## 先设计，再编码，Mock 神器来救场

**先设计，再编码** 是开发者的金规玉律了，但是往往大部分开发者总是当做耳边风，造成无效的重复劳作。

首先要思考充分后再架构设计，与前端协商好 API 接口，此时后端开发者再编码进行实现。

那在后端开发者实现 API 的这段时间，前端开发者干嘛，总不能闲着等后端开发者开发结束吧。

此时，前端开发者可通过 Mock 来跑通 API 请求，这样，前端开发者就可以在后端开发者实现 API 的过程中，也可以进行相应的前端开发工作。

那前端如何进行 Mock API 请求呢？

直到有一天，我发现了这个神器，我，一个前端，效率提升了 83%，我不费吹灰之力零配置即可得到我需要的 Mock 数据。

它就是 [Apifox](https://www.apifox.cn/a1xxxxxx)，它可以帮助前端开发者轻松模拟后端 API 接口的数据，它的颜值也实属上乘：

![Apifox](https://files.mdnice.com/user/24782/2e69c32b-3d92-4ad3-a69b-c5a16cecba89.png)

那我们如何配置 Mock 数据来进一步调试呢？

[Apifox](https://www.apifox.cn/a1xxxxxx) 会根据后端开发编写的 API 文档自动启动一个本地的 Mock Server，并自动化智能化生成 Mock 数据。

![Apifox 本地 Mock 服务](https://files.mdnice.com/user/24782/2e95ee0d-a133-4a23-ab0a-8a71501d65e0.png)

翻译翻译，TMD 什么叫做 TMD 惊喜？

在 Apifox 中零配置智能 Mock，这就是惊喜啊！

虽然，智能 Mock 仅仅是 Apifox Mock 的最基础功能，更强大的 Mock 功能可查看 [xxxxxx](xxxxxx)

## 一定要测试

后端开发者开发完 API 接口后，通知前端：我开发完了，用真实的服务环境吧，你可以不用 Mock 服务了。

此时，便开始了真正的数据联调工作。

前端将 API 接口从 Mock 服务改成了真实的服务环境，结果好家伙，页面直接挂了。

花费大力气定位问题，原来是虽然接口开发完成，但是没有经过严谨的测试，某些字段不合规，而导致前端异常。

此时，可借助于神器 Apifox 测试功能的**后置操作**面板。是了，Apifox 不仅仅拥有强大的 Mock 功能，还拥有强大的测试功能。

![](https://static.shanyue.tech/images/23-01-04/clipboard-6013.88130c.webp)

比如可视化设置断言：

![Apifox 设置断言](https://cdn3.apifox.cn/www/assets/image/article/main/assertion-1.png)

运行后，查看断言结果：

![](https://cdn3.apifox.cn/www/assets/image/article/main/assertion-2.png)

但是你以为这就结束了吗，这仅仅是接口层面的测试，**在 Apifox 中还可以测试整个流程，比如登录流程，下单流程等**。

![](https://static.shanyue.tech/images/23-01-04/clipboard-1530.a6742a.webp)

在 Apifox 还贴心地给出整个流程测试的报告，让你知道问题出在了哪里。

![](https://static.shanyue.tech/images/23-01-04/clipboard-7682.845e37.webp)

我们在提供给前端真实接口进行接口联调之前，一定要通过 Apifox 对接口以及流程进行严谨的测试！

这样才能高效率地主动修复问题，而非在前端的催促下被动修复 Bug，大大提高了效率，也减少了 API 返工次数。

## CI Pipeline

通过以上几个小技巧，我们已经可以将 API 返工次数降低到最低，但是手动点击，进行流程测试，还是略微麻烦点。

我们有没有一种办法，每次新功能实现，提交新代码后，自动跑一遍集成测试。可通过 Apifox 自动生成命令行命令。

![](https://static.shanyue.tech/images/23-01-04/clipboard-6873.4df929.webp)

关于 Apifox 的命令行命令，可参考文档 [Apifox: 持续集成](https://www.apifox.cn/help/app/ci)

如此一来，将集成测试与项目集成在一起，纳入版本管理，保留测试记录，方便准时定位 bug。

```shell
$ apifox run examples/sample.apifox-cli.json -r cli,html
```

## 将异常 API 使用 400+ 状态码

最终，前后端联调结束，项目开发完成进行提测，测试人员发现了一条 Bug，定睛一看，原来某个接口报错变成了红色。

这就是一个小技巧，**对于异常 API，请使用 400+ 状态码进行表示，400+ 状态码在浏览器开发者工具调试下为红色，可一眼定位到异常 API**。

在 Bug 管理平台提 Bug 时，测试人员可附以下信息帮助开发者更好地复现问题

1. 告知当前登录用户
1. 告知当前所在页面
1. 告知页面操作步骤

但是，这个流程实在太繁琐了，每次复现以及测试都需要十分钟以上时间，实际上，只需要一个 `curl` 命令即可搞定。

1. 在控制台选中该条异常 API，右键点击 `Copy as cURL`。
1. 将该 curl 命令贴在 Bug 的上下文信息中

![](https://static.shanyue.tech/images/23-01-04/clipboard-9760.035401.webp)

后端开发者拿到该 curl 后，无需登录，也无需操作页面，即可打断点进行问题定位。

此时，为了更好的调试，可以借助 Apifox 调试工具中直接将 curl 转化为 Apifox 中的请求，此时修改参数特别方便。

![](https://static.shanyue.tech/images/23-01-04/clipboard-6503.797be5.webp)

**通过 [Apifox](https://www.apifox.cn/?utm_source=shanyue-blog) 导入 cURL，方便修改参数**

另外，在 Apifox 中还可以将 API 请求，转化为代码，这样子爬虫是不就非常方便了呢:

1. 刷新页面，找到爬虫目标 API 接口
1. 将该 API 接口转化为 cURL
1. 将 cRUL 导入到 Apifox 中的请求
1. 将 Apifox 中的请求生成代码

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/131dd1707e2a48f7a97d24b0c623deb7~tplv-k3u1fbpfcp-watermark.image?)
