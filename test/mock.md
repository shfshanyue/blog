# 一个前端所期待的 Mock 功能都是什么样的？

大家好呀，我是一名苦逼的前端开发工程师，为啥苦逼呢，这不，项目下周就要上线了，但是后端还没给我接口，没有接口我就无法调试，工作停滞不前，我也只能坐着干着急。

我报告给了我的老板山哥: **老板，这后端不靠谱啊，都快上线了，接口还没出来**。

山哥回道，**别着急呀，这不有 Mock 吗**？

**Mock，什么是 Mock 啊？**我一脸狐疑，问向山哥。

山哥慢条斯理说，就是**前端自己启动一个 HTTP 服务，模拟后端接口的数据，这样就无需等待后端接口开发完成了，不会因为后端开发延误而阻塞你的工作进程了**。

嗯，真是个不错的注意，我仿佛发现了新大陆！以后再也不用受后端拖累了，心里暗暗开心，但转念一想不对啊，时间不够啊！

我又沮丧了下来，转头向山哥说道: **Mock 好是好，但是时间不够了啊，我重新启动一个 Mock HTTP Server，也要花不少时间呀**。

山哥见我开了窍，又忙不迭地说: **咱们团队不是用的 [Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 管理 API 吗，只需要点下按钮，就可以自动 Mock！**

一键 Mock 数据，这么简单，那应该怎么使用 [Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 自动 Mock 呢？

山哥接下来，缓缓道来。

## 智能 Mock

[Apifox](https://www.apifox.cn/?utm_source=shanyue-question)，API 文档、API 调试、API Mock、API 自动化测试集成于一体的强大工具，可以在 [Apifox 官网](https://www.apifox.cn/?utm_source=shanyue-question) 直接下载，在 Windows、Linux、Mac 下都可以使用。

![](https://files.mdnice.com/user/5840/2dea171d-ab32-42c2-89a9-ddac0993a046.png)

下载成功后，可打开其中的**示例项目**，是一个关于宠物店的项目。打开宠物店的项目，可以在每个标签页看到四个标签: 文档、修改文档、运行、高级 Mock。

![](https://files.mdnice.com/user/5840/f9276d5a-59e4-4afb-ae44-3c33c80ca565.png)

我们先看下这个**查询宠物详情**的接口，其请求接口为 `/pet/{petId}`，而响应数据为 `code` 与 `data`，`data` 是一个 `Pet` 的一个自定义数据类型。

![](https://files.mdnice.com/user/5840/7c0c7ba9-37cd-4052-b98a-bbed63258993.png)

在数据模型选项卡中，可以看到 `Pet` 这个自定义数据类型，其中有两个字段为 `id`、`name` 和 `photoUrls`。

![](https://files.mdnice.com/user/5840/ff4c39ab-c0e7-4770-93c1-e66cd383971e.png)

在我们的本地是肯定没有宠物店的这个项目和接口的，那我们现在就可以使用一键 Mock 服务，请求 Mock 出来的宠物店数据，非常方便！

切换环境为**Mock服务**，此时地址栏前缀为 `http://127.0.0.1:4523/mock/533840`，点击运行按钮发送请求，见证奇迹的时刻到了，数据正确返回！

![](https://files.mdnice.com/user/5840/68e12984-e582-44e0-8b8b-e48a466bf412.png)

在项目中进行 Mock 时，使用 `http://127.0.0.1:4523/mock/533840` 代替后端的 API 前缀即可，特别好用是不是！

但这仅仅是 [Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 强大的只能 Mock 下的冰山一角！

**假设，我们有一个用户接口，它有一个字段 email 期待返回邮箱格式的数据，一个字段 phone 期待返回手机格式的数据，一个字段 avatar 期待返回一个头像，而这在 [Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 下都可以零配置完成！**

![](https://files.mdnice.com/user/5840/32d23cf9-b399-42ef-8664-0a43a8616c2c.png)

这就是，[Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 强大的智能 Mock 规则: **你需要做的仅仅是定义 API 接口文档中的响应数据，接下来一键 Mock 服务，全部只能工作都交给 [Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 的智能 Mock 来完成**。

在 [Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 内部，当接口响应的数据字段未配置 mock 规则时，系统会自动使用智能 Mock 规则来生成数据，以实现使用时零配置即可 mock 出非常人性化的数据。根据项目设置、功能设置、智能 Mock 设置即可打开默认配置。

![](https://files.mdnice.com/user/5840/7a2aa8ec-5b09-4dc1-a38b-9b1b0964ca76.png)

除此之外，[Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 还可以根据高级设置，对字段进一步的限制，如

1. 字符串长度限定，及正则限定
1. 数字最大最小的限定
1. 枚举类型

![](https://files.mdnice.com/user/5840/e8147b2e-6657-48d0-bab4-6d3ccaa1895b.png)

举一个示例，宠物售卖状态总共有三种：在售、待上架、已售。我们可以通过高级设置的枚举类型来完成，如下图所示：

![](https://files.mdnice.com/user/5840/5bc61733-a91b-491d-a8c1-29c13a1ccafd.png)

![](https://files.mdnice.com/user/5840/3c5db58a-add3-4e50-84c5-778c9f557a64.png)

## 自定义 Mock

在 [Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 自动 Mock 非常方便，但我们需要自定义 Mock 功能，在上个接口中，宠物有一个字段是 `name`，表示宠物的名字，我们可不可以将宠物的名字仅仅定位为两个字符。

我们在 [Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 数据模型设置中找到该宠物的数据模型，并配置其 `name` 字段。

![](https://files.mdnice.com/user/5840/adbe46af-c005-4d85-b0fb-c4eed92ade8e.png)

`@cword(3)` 是 Apifox 的 Mock 语法，完全兼容 Mock.js（数据占位符方式），并扩展了一些 Mock.js 没有的语法（如国内手机号 @phone）。

![](https://files.mdnice.com/user/5840/69d8e813-62c2-4f11-80be-431b77216584.png)

如现有 Mock 语法无法满足需求，建议使用 正则表达式 `@regexp` 来实现灵活的定制。正则表达式基本能满足各种特殊场景的需求。

![](https://files.mdnice.com/user/5840/90098d40-a7f8-4a08-8872-f3238bd35cd8.png)

而我们将宠物的名字限制为两个字符，即可使用: `@cword(2)` 替代。

## 高级 Mock

[Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 的智能 Mock 与自定义 Mock 已经足够强大，但是他的功能远不止于此。我们尽管可以使用自定义 Mock 对数据进行每个字段更为精细的模拟，但远远无法满足复杂业务的多样性。

以以上**查询宠物详情**的接口为例，难免有记录不存在的示例，此时接口响应为完全不同的数据类型。此时，我们可以使用 [Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 的高级 Mock 用以模拟数据。

![](https://files.mdnice.com/user/5840/e694b02c-ef90-4aa4-9d0e-1ef89d9d9caa.png)

当我们查询宠物的 ID 为3时，返回不存在数据的相应格式，同时设置状态码为 404。

![](https://files.mdnice.com/user/5840/f8bc471d-ec66-4ba5-adf6-9844036a5b83.png)

为了满足业务的多样性，我们还可以使用基于模板的高级 Mock 功能与 [Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 的 Mock 语法相结合。这里使用了 Javascript 的 [nunjucks](https://github.com/mozilla/nunjucks) 模板语法，可以生成你想生成的任意数据。

![](https://files.mdnice.com/user/5840/d3759afb-8586-4c42-82f0-f7f5be4d44dc.png)

## 小结

今天关于 Mock 的分享就到这里，你还有什么更复杂的 Mock 需求吗？

[Apifox](https://www.apifox.cn/?utm_source=shanyue-question) 关于 Mock 的功能非常强大，你也可以来试一试。

