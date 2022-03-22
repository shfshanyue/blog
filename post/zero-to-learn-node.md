# 零基础可操作的 Node 入门学习指南

1. 如何开始学习 Node？
2. Node 有哪些重要的内置模块需要重点学习？
3. 哪些源码可以推荐阅读？
4. 有没有路线图(Roadmap)可以进行系统学习？

## 如何开始学习 Node？

**根据公司的需求学习 node.js，在需求中进行学习，时间充分，成长快，事半功倍。**

我们来看一看 nodejs 扮演的最重要的两个角色：

1. 前端工具链
2. Server

而对于前端，接触最多的便是基于 Node 的前端工具，比如 webpack、rollup、vite、eslint、prettier、create-react-app、create-vue 等。因此这里先说下**前端工具链**这部分。

而这部分，最容易在工作中获得需求，如**构建一个脚手架**，也容易作为自己的 KPI/OKR。通过此，可获得 node 关于 **文件系统**、**终端操作** 一系列知识。

如果业务中不需要构建一个脚手架，那也有诸多的场景需要写一个脚本，其中涉及最多的也是文件系统。

比如，在详细了解并完成一个脚手架后，你至少可以了解一个问题？

**如何判断文件是否存在？**

再往下看，你会发现有很多关于文件系统的第三方包，他们是做什么的？

+ [mkdirp](https://github.com/isaacs/node-mkdirp#readme): 什么是 `mkdir -p`，你自己实现会如何实现，如何设计 API？(当然这个在 node 10+ 已经原生实现，不过你仍然可以看看源码的实现)
+ [fs-extra](https://npm.devtool.tech/fs-extra): 你会发现很多脚手架都使用了 `fs-extra`，它又比原生的 `fs` 多了什么功能呢？
+ [fs-events](https://npm.devtool.tech/fsevents): 为什么不使用原生的 `fs.watch` 监听文件变化呢，监听文件变化的底层操作系统原理又是什么呢？
+ [graceful-fs](https://npm.devtool.tech/graceful-fs): 它为什么比原生的 `fs` 更加友好 (graceful)


继续深入，你会发现，一个东西叫 Glob，一个叫 Braces，它们又是啥？最后你发现，原来它们和语言无关，在终端就可以直接使用。

### glob

+ `ls -lah *.js`

### braces

+ Set: `{x,y,z}`
+ Sequence: `{1..10}`
+ Step: `{1..10..2}`

## Node 有哪些重要的内置模块需要重点学习？

好吧，假设这个大前提是，**我想要使用 Node 作为服务器端来使用，那我应该重点学习哪些重要模块？**

那最重要的一个就是:

+ `http`

非常重要但是不那么紧急的有:

+ `stream`
+ `buffer`
+ `net`

这几个模块十分重要，但是学习起来非常枯燥。可参照我的示例代码 [node-native](https://github.com/shfshanyue/node-examples/tree/master/node-native) 进行学习。

最终也可以思考一个问题？

**我需要考虑多少边界条件才能正确读取到 Request Body 呢？** 可以参考 [raw-body](https://github.com/stream-utils/raw-body)

## 哪些源码可以推荐阅读？

+ [lru-cache](https://github.com/isaacs/node-lru-cache): LRU Cache，前端及服务端框架中的常用依赖。
+ [tsdx](https://github.com/formium/tsdx): 零配置的 npm 库开发利器，与 CRA 相似，不过它主要面向库开发者而非业务开发者，了解它是如何提供零配置功能，看懂默认配置做了那些优化，并了解它的所有工具链 (prettier、eslint、size、bundleanalyzer、rollup、typescript、storybook)。
+ [create-react-app](https://github.com/facebook/create-react-app): React 最广泛的脚手架，读懂三点。一，如何生成脚手架；二，如何实现 eject；三，了解 cra 的所有重要依赖，读懂默认 webpack 配置。
+ [axios](https://github.com/axios/axios): 请求库，了解它是如何封装源码且如何实现拦截器的。
+ [koa](https://github.com/koajs/koa)
+ [body-parser](https://github.com/stream-utils/raw-body): express 甚至是大部分服务端框架所依赖的用以解析 body 的库
+ [next](https://github.com/vercel/next.js)
+ [ws](https://github.com/websockets/ws): 了解 websocket 是如何构造 Frame 并发送数据的 (在此之前可阅读 node/http 源码)
+ [apollo-server](https://github.com/apollographql/apollo-server): GraphQL 框架，值得一看
+ [node](https://github.com/nodejs/node): 最难的放到最后边

还有一些细节可以实现下:

+ native http server
+ native http client
+ trie router
+ mustable
+ stream pipeline (nodejs): https://github.com/mafintosh/pump

## 有没有线路图可以推荐下

目前关于 node 的学习路线图还不太有，我粗略总结一下，过几天做一个路线图出来:

1. 了解 node.js 可以做什么
2. 学习 node.js 的 http 模块，并了解一些简单的 HTTP Header 及状态码
3. 学习 node.js 的 stream 并且了解如何最简单形式的读取 Request Body
4. 学习 node.js 的一个框架，比如 express、koa、fastify、nest
5. 学习 node.js 框架如何写中间件，并了解其 Context
6. 学习 node.js 的路由，了解两种，一种基于正则，一种基于前缀树
7. 使用 docker 在本地搭建一个 postgres/redis，学习简单的数据库和 redis
8. 使用 sequelize 了解如何操作数据库
9. 使用 node.js 写一个真正但简单的服务，比如成语接龙
10. 日志设计，接入数据
11. 部署
12. 异常与报警设计
13. 性能分析与调试

学习结束后可以根据面试进行系统训练:

+ https://github.com/ElemeFE/node-interview: 关于 node 的面试合集
+ https://github.com/goldbergyoni/nodebestpractices: ✅ The Node.js best practices list (February 2022)