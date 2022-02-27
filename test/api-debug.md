# 前后端联调数据的三个小技巧

当项目开发完成进行提测后，测试人员发现了一条 Bug，定睛一看，原来某个接口报错变成了红色。

这就是**第一个小技巧，对于异常 API，请使用 400+ 状态码进行表示，400+ 状态码在浏览器开发者工具调试下为红色，可一眼定位到异常 API**。

那测试人员发现了这条异常请求后，如何告知后端开发呢？

在虫子管理平台提 Bug 时，附以下信息。

1. 告知当前登录用户
1. 告知当前所在页面
1. 告知页面操作步骤

但是，这实在太繁琐了，实际上，只需要一个 `curl` 即可搞定。

1. 在控制台选中该条异常 API，右键点击 `Copy as cURL`。
1. 将该 curl 命令贴在 Bug 的上下文信息中

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-02-27/clipboard-2469.4423b5.webp)

这就是**第二个小技巧，在浏览器控制台复制异常API的 cURL 扔给后端**

后端拿到该 curl 后，无需登录，也无需操作页面，即可打断点进行问题定位。但是如何更好地去控制 Body 传递的参数呢？而在 curl 中修改参数是非常复杂的。

此时，可以在 [Apifox](https://www.apifox.cn/?utm_source=shanyue-blog) 等 API 调试工具中直接将 curl 转化为 Apifox 中的请求，此时修改参数特别方便。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-02-27/clipboard-8252.33b823.webp)

这就是**第三个小技巧，通过 [Apifox](https://www.apifox.cn/?utm_source=shanyue-blog) 等 API 调试工具导入 cURL，方便修改参数**

另外，在 Apifox 中还可以将 API 请求，转化为代码，这样子爬虫是不就非常方便了呢:

1. 刷新页面，找到爬虫目标 API 接口
1. 将该 API 接口转化为 cURL
1. 将 cRUL 导入到 Apifox 中的请求
1. 将 Apifox 中的请求生成代码

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/131dd1707e2a48f7a97d24b0c623deb7~tplv-k3u1fbpfcp-watermark.image?)