---
description: 全栈成长之路，分享前后端以及 DevOps 相关文章，使各端开发者能够突破瓶颈进一步成长。
---

# 山月的琐碎博客记录

关于平常工作中在前端，后端以及运维中遇到问题的一些文章总结。以后也会做系列文章进行输出，如前端高级进阶系列，个人服务器指南系列。

> 说到个人服务器，如果你是新人的话，在阿里云有优惠，这里有连接进行购买：[阿里云新人优惠服务器](https://www.aliyun.com/1111/pintuan-share?ptCode=MTY5MzQ0Mjc1MzQyODAwMHx8MTE0fDE%3D&userCode=4sm8juxu)。可以跟着我的系列文章 [跟着山月管理个人服务器](https://shanyue.tech/op/) 来学习。 如果你对服务器完全没有概念，建议购买配置 `1核2G`，也就八十来快钱。如果对云主机有所了解，建议购买配置 `2核4G`。

+ **[阿里云新人优惠服务器](https://www.aliyun.com/1111/pintuan-share?ptCode=MTY5MzQ0Mjc1MzQyODAwMHx8MTE0fDE%3D&userCode=4sm8juxu)**
+ **[跟着山月管理个人服务器](https://shanyue.tech/op/)**

## 名字由来

大学时读了温庭筠一首词，`山月不知心底事，水风空落眼前花`，于是就起了一个名字: 山月水风。

后来难免觉得花间词过于矫情，于是把名字拆成两个，只取前两个字：山月。取李白 `暮从碧山下，山月随人归` 之意，恰好那段时间从京西阳台山下来时伴着月亮。

再后来读书读多了，觉得 `松风吹解带，山月照弹琴` 与 `水风轻，蘋花渐老，月露冷，梧叶飘黄` 的意境也不错，也很喜欢。

## 开源及个人项目

### Package

+ [@shanyue/promise-utils (npm)](https://github.com/shfshanyue/promise-utils): 一些有用的 promise 工具函数，如 map, filter, retry 与 sleep
+ [cls-session (npm)](https://github.com/shfshanyue/cls-session): Node 类似 CLS 的实现，并避免了 Promise 在 async_hooks 中内存泄漏问题
+ [we-api (npm)](https://github.com/shfshanyue/we-api): 关于微信公众号 API 封装的 SDK，支持 TS与更好用的 SDK
+ [shfshanyue/whoami (docker)](https://github.com/shfshanyue/whoami): Tiny node.js webserver that prints os information and HTTP request to output
+ [shfshanyue/ansible-op (ansible role)](https://github.com/shfshanyue/ansible-op): 满足你个人服务器一切运维需求的 Ansible Role
+ [shfshanyue/apollo-server-starter (graphql template)](https://github.com/shfshanyue/apollo-server-starter): 基于 apollo-server 的 graphql 后端脚手架

### Serverless

+ [shfshanyue/markdown-to-html-api](https://github.com/shfshanyue/md-to-html-api): 根据 mardown 生成美化 html 的 GraphQL API
+ [shfshanyue/interview-api](https://github.com/shfshanyue/interview-api): 程序员面试每日一题
+ [shfshanyue/geek](https://github.com/shfshanyue/geek): 极客时间返利平台: <https://geek.shanyue.tech>

### Side Project

> 以下项目均部署在我的个人服务器中，详情见 [当我有一台服务器时我做了什么](https://github.com/shfshanyue/op-note)

+ [shfshanyue/2019-ncov](https://github.com/shfshanyue/2019-ncov): 全国新型冠状病毒，肺炎疫情实时省市地图，单日 PV 最高48万
+ [shfshanyue/shici](https://github.com/shfshanyue/shici): 诗词小站，服务器容器运维、爬虫及前后端开发可参考我的博客，单日 PV 500 <https://shici.xiange.tech/>
+ [shfshanyue/shici-spider](https://github.com/shfshanyue/shici-server): 诗词小站的爬虫
+ [shfshanyue/shici-server](https://github.com/shfshanyue/shici-server): 诗词小站的服务端
+ [shfshanyue/wechat](https://github.com/shfshanyue/wechat): 个人公众号的微信开发，黑客增长实践，看文需扫码关注功能
+ [shfshanyue/wechat-bot](https://github.com/shfshanyue/wechat-bot): 个人微信机器人开发，社群运营、智能对话与提醒。自动通过好友，加群后欢迎语以及基金、疫情信息监控
+ [shfshanyue/wechat-cron](https://github.com/shfshanyue/wechat-cron): 个人公众号的自动上传素材脚本，使用 [we-api](https://github.com/shfshanyue/we-api) 作为 SDK
+ [shfshanyue/reacht-rubic](https://github.com/shfshanyue/react-rubic): 使用 react 开发一个魔方
+ [shfshanyue/tomato](https://github.com/shfshanyue/tomato): 基于 vue 与 cordova 的番茄闹钟APP
+ [shfshanyue/eleven](https://github.com/shfshanyue/eleven): 小程序十一选五小助手
+ [shfshanyue/cheat-sheets](https://github.com/shfshanyue/cheat-sheets): cheat sheets
+ [shfshanyue/tieba_post (python)](https://github.com/shfshanyue/tieba_post): 模拟百度贴吧的登录及自动发帖
+ [shfshanyue/spider (python)](https://github.com/shfshanyue/spider): python 写的网页定时备份小工具

## 前端工程化

1. [前端高级进阶：javascript 代码是如何被压缩](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/uglify.md)
1. [前端高级进阶：如何更好地优化打包资源](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/bundle.md)
1. [前端高级进阶：网站的缓存控制策略最佳实践及注意事项](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/http-cache.md)
1. [前端高级进阶：团队代码规范约束最佳实践](https://shanyue.tech/frontend-engineering/eslint.html)
1. [前端高级进阶：在生产环境中使你的 npm i 速度提升 50%](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/npm-install.md)
1. [前端高级进阶：使用 docker 高效部署你的前端应用](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/docker.md)
1. [前端高级进阶：CICD 下的前端多特性分支环境的部署](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/feature-deploy.md)
1. [前端高级进阶：前端部署的发展历程](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/deploy.md)
1. [前端高级进阶：本地环境 https 证书配置](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/https-local.md)

更多文章: [前端工程化系列](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/)

## Node 工程及实践

+ [Node实践语言篇: 如何引入模块及其细节](./node/require.md)
+ [Node实践源码篇: 40 行代码实现精简版 koa](./node/koa.md)
+ [Node实践代码篇: 为你的应用添加单元测试](./node/test.md)
+ [Node实践质量篇: Node 应用中如何做数据类型校验](./node/joi.md)
+ [Node实践质量篇: Node 脚本遭遇异常时如何安全退出](./exit-code.md)
+ [Node实践交互篇: 浏览器跨域与服务器中的 CORS](./node/cors.md)
+ [Node实践日志篇: 如何正确且高效地打印日志](./node/log.md)
+ [Node实践日志篇: async_hooks，CLS 与异步资源生命周期监听](./node/cls.md)
+ [Node实践日志篇: Node 中全链路式日志实践](./node/log-request-id.md)
+ [Node实践监控篇: 如何监控 Node 服务的内存](./node/mem.md)
+ [Node实践部署篇: 如何使用 Docker 部署 Node 应用](./node/docker.md)
+ [Node实践质量篇: Node 脚本遭遇异常时如何安全退出](./node/exit-code.md)
+ [Node实践质量篇: Controller 层如何做数据类型校验](./node/joi.md)

更多文章: [Node 实践](https://github.com/shfshanyue/blog/tree/master/node/)

## 虫子集

山月在测试环境及生产环境中遇到的那些有关前端，后端及运维的虫子 (BUG)

更多文章: [虫子集](./bug/)

## 技术中的用户增长手段

+ [如何使用 wechaty 开发一个微信机器人](https://shanyue.tech/growth/wechaty-start.html)
+ [如何使用公众号开发从 PC 端网站引流](https://shanyue.tech/op/blog-to-wechat.html)
+ [使用公众号开发进行网站向公众号的导流](https://shanyue.tech/op/blog-to-wechat.html)

更多文章: [用户增长](./growth/)

## 有可能你并不需要云服务器 | 如何更好地薅羊毛

但仅仅是开发一个简单的项目(弱数据存储)，有可能你并不需要一个云服务器。

1. [如果你只想搭建一个博客](https://shanyue.tech/no-vps/if-you-want-a-blog.html)
1. [使用 Netlify 托管静态网站与持续集成](https://shanyue.tech/no-vps/deploy-fe-with-netlify.html)
1. [使用 AliOSS 部署及加速你的静态网站](https://shanyue.tech/no-vps/deploy-fe-with-alioss.html)
1. [Github Actions 持续集成简介及实践](https://shanyue.tech/no-vps/github-action-guide.html)
1. [Serverless 与 Serverless Framework](https://shanyue.tech/no-vps/serverless.html)
1. [使用 serverless 开发第一个 Koa 应用](https://shanyue.tech/no-vps/sls-koa.html)
1. [使用 serverless 开发第一个 Next 应用](https://shanyue.tech/no-vps/sls-next.html)

更多文章: [你并不需要云服务器](https://github.com/shfshanyue/you-dont-need-vps)

## 个人服务器运维指南

你可以在阿里云新购一台服务器作为实践：

+ **[阿里云新人优惠服务器](https://www.aliyun.com/1111/pintuan-share?ptCode=MTY5MzQ0Mjc1MzQyODAwMHx8MTE0fDE%3D&userCode=4sm8juxu)**

### 序

1. [序·当我有一台服务器时我做了什么](https://shanyue.tech/op/when-server.html)
1. [序·当我有一台服务器时我做了什么(2019)](https://shanyue.tech/op/when-server-2019.html)

### 配置篇

1. [高效简单的服务器登录配置](https://shanyue.tech/op/init.html)
1. [服务器上 git 安装及基本配置](https://shanyue.tech/op/git.html)
1. [服务器上 ssh key 管理及 github 配置](https://shanyue.tech/op/ssh-setting.html)
1. [云服务器基本指标信息查看及命令](https://shanyue.tech/op/system-info.html)
1. [vim 基本操作及配置](https://shanyue.tech/op/vim-setting.html)
1. [tmux 与多窗口管理](https://shanyue.tech/op/tmux-vim-setting.html)
1. [ansible 简易入门](https://shanyue.tech/op/ansible-guide.html)

### 容器篇

1. [docker 简易入门](https://shanyue.tech/op/docker.html)
1. [Dockerfile 最佳实践](https://shanyue.tech/op/dockerfile-practice.html)
1. [案例: 使用 docker 高效部署前端应用](https://shanyue.tech/op/deploy-fe-with-docker.html)
1. [docker compose 编排架构简介](https://shanyue.tech/op/docker-compose-arch.html)
1. [docker compose 简易入门](https://shanyue.tech/op/docker-compose.html)
1. [使用 traefik 做反向代理](https://shanyue.tech/op/traefik.html)
1. [使用 traefik 自动生成 https 的证书](https://shanyue.tech/op/traefik-https.html)
1. [使用 dnsmasq 搭建本地 DNS 服务](https://shanyue.tech/op/dnsmasq.html)
1. [使用 openvpn 访问内部集群私有服务](https://shanyue.tech/op/openvpn.html)
1. [使用 postgres 做数据存储](https://shanyue.tech/op/deploy-postgres.html)
1. [使用 redis 做缓存服务](https://shanyue.tech/op/deploy-redis.html)
1. [使用 sentry 做异常监控](https://shanyue.tech/op/deploy-sentry.html)
1. [案例：黑客增长 - 从博客向公众号引流](https://shanyue.tech/op/blog-to-wechat.html)
1. [案例：黑客增长 - 使用公众号开发模拟面试](https://shanyue.tech/op/wechat-interview.html)

### 监控篇

1. [linux 各项监控指标](https://shanyue.tech/op/linux-monitor.html)
1. [使用 htop 监控进程指标](https://shanyue.tech/op/htop.html)
1. [使用 ctop 监控容器指标](https://shanyue.tech/op/ctop.html)

### 命令篇

1. [sed 命令详解及示例](https://shanyue.tech/op/linux-sed.html)
1. [awk 命令详解及示例](https://shanyue.tech/op/linux-awk.html)
1. [jq 命令详解及示例](https://shanyue.tech/op/jq.html)
1. [tcpdump 命令详解及示例](https://shanyue.tech/op/linux-tcpdump.html)
1. [案例: 使用jq与sed制作掘金面试文章榜单](https://shanyue.tech/op/jq-sed-case.html)

## 使用 k8s 管理多服务器

### 集群搭建

1. [预备工作](https://github.com/shfshanyue/learn-k8s/blob/master/prepare.md)
1. [搭建过程中常见 linux 命令使用](https://github.com/shfshanyue/learn-k8s/blob/master/linux-command.md)
1. [docker 的安装与配置](https://github.com/shfshanyue/learn-k8s/blob/master/install-docker.md)
1. [kubelet/kubeadm 简介与安装](https://github.com/shfshanyue/learn-k8s/blob/master/install-kubeadm.md)
1. [搭建一个集群的主节点 (control plane node)](https://github.com/shfshanyue/learn-k8s/blob/master/install-master-node.md)
1. [为集群添加一个工作节点 (work node)](https://github.com/shfshanyue/learn-k8s/blob/master/install-work-node.md)
1. [在本地环境管理集群](https://github.com/shfshanyue/learn-k8s/blob/master/local-kubectl.md)

### 资源部署

1. [部署你的第一个应用: Pod，Deployment 与 Service](https://github.com/shfshanyue/learn-k8s/blob/master/pod.md)
1. [通过外部域名访问你的应用: Ingress](https://github.com/shfshanyue/learn-k8s/blob/master/ingress.md)
1. [自动为你的域名添加 https](https://github.com/shfshanyue/learn-k8s/blob/master/https.md)

### 工具与运维

1. [部署利器 Helm 安装及简介](https://github.com/shfshanyue/learn-k8s/blob/master/helm.md)
1. [易用轻量的持续集成方案: helm 结合 drone](https://github.com/shfshanyue/learn-k8s/blob/master/deploy-drone.md)

## 业务与技术

+ [新人如何快速熟悉业务](https://shanyue.tech/business/business-get-started.html)
+ [前端如何在业务中提升自己](https://shanyue.tech/business/learn-in-business.html)
+ [如何为测试环境制造假数据](https://shanyue.tech/business/dev-data-create.html)
+ [在线教育考试系统业务分析](https://shanyue.tech/business/exam.html)

## 杂记

### 技术反思分享

> 以下都是关于技术思考的文章分享

1. [10 Things Every Developer Should Learn](https://medium.com/better-programming/10-things-every-developer-should-learn-72697ed5d94a) · [中文翻译](https://mp.weixin.qq.com/s?__biz=MjM5NTk4MDA1MA==&mid=2458073334&idx=2&sn=0d0c3f9552c1632baa3f25a46e0d28d1&chksm=b187ae8b86f0279d0482bbfd98dfaa579b451c44754c8b1ed1b33151de9803691c4fe59e3757&token=1024506330&lang=zh_CN#rd)

### 后端

1. [各种架构图乱七八糟的图索引](https://github.com/shfshanyue/graph)
1. [linux 性能监控指标速查](https://shanyue.tech/op/linux-monitor)
1. [jwt 实践应用以及特殊案例思考](https://shanyue.tech/post/jwt-guide.html)
1. [jwt 邮件验证码与登录实践](https://shanyue.tech/post/jwt-and-verifyCode.html)
1. [GraphQL 开发指南](https://shanyue.tech/post/graphql-guide.html)
1. [由 GraphQL 来思考 API Design](https://shanyue.tech/post/api-design-inspire-by-graphql.html)
1. [Node 中异常，EXIT CODE 与 dockerfile ](https://shanyue.tech/post/exit-code-node-and-docker.html)
1. [限流算法: 漏桶与令牌桶简介](https://shanyue.tech/post/rate-limit/)
1. [使用 requestId 标记全链路日志](https://shanyue.tech/post/requestId-and-tracing/)
1. [Node 中的异常收集，结构化与监控](https://shanyue.tech/post/server-structed-error.html)
1. [谈谈 Redis 在项目中的常见使用场景](./post/redis-case)
1. [项目实践: 使用微信公众号开发模拟面试功能](https://shanyue.tech/op/wechat-interview.html)
1. [Sequelize V5 升级记录及注意事项](https://shanyue.tech/post/sequelize-upgrade.html)
1. [如何判断文件中换行符 LF(\n) 与 CRLF(\r\n)](https://shanyue.tech/post/LF-CRLF.html)
1. [两个由于 async/await 导致 OOM 的示例](https://shanyue.tech/post/async-oom.html)
1. [隔离级，悲观锁与诗词字云功能的开发](https://shanyue.tech/post/poem-char-frequent-stat.html)
1. [域名更改注意事项须知](https://shanyue.tech/post/domain-update-record.html)
1. [从数据库到前端，使用 enum 代替 constant number](https://shanyue.tech/post/constant-db-to-client.html)
1. [SQL必知必会](https://shanyue.tech/post/sql-examples.html)

### 前端

1. [JS 调试问题汇总及示例](https://shanyue.tech/post/js-debug-examples/)
1. [如何实现 Promise 的限流](https://shanyue.tech/code/Promise/)
1. [如何实现一个简单的 Promise](https://shanyue.tech/code/Promise-map/)
1. [你不知道的 JS 之疑难汇总](./post/js-puzzles)
1. [使用纯 CSS 实现仿 Material Design 的 input 过渡效果](https://shanyue.tech/post/login-input-style.html)
1. [Canvas VS SVG 画影图形](https://shanyue.tech/post/canvas-and-svg-shapes.html)
1. [Grid 布局指南](https://shanyue.tech/post/Grid-Guide/)
1. [使用 Grid 进行常见布局](https://shanyue.tech/post/Grid-Layout-Common-Usage/)
1. [浏览器中的二进制以及相互转化](https://shanyue.tech/post/binary-in-frontend/)

### 工具与增效

1. [vim 快速入门](https://shanyue.tech/post/vim-quick-start.html)
1. [是谁动了我的代码](https://shanyue.tech/post/git-tips.html)
1. [tmux 与多窗口管理](https://shanyue.tech/op/tmux-vim-setting.html)
1. [ssh 快速登录服务器](https://shanyue.tech/op/init.html)

## 关注我

我是山月，一个~~以前喜欢跑步与爬山的~~程序员，我会定期分享全栈文章在个人公众号中。如果你对全栈面试，前端工程化，graphql，devops，个人服务器运维以及微服务感兴趣的话，可以关注我的微信公众号【全栈成长之路】。

![如果你对全栈面试，前端工程化，graphql，devops，个人服务器运维以及微服务感兴趣的话，可以关注我](https://shanyue.tech/qrcode.jpg)
