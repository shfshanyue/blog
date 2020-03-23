# 山月的琐碎博客记录

关于平常工作中在前端，后端以及运维中遇到问题的一些文章总结。以后也会做系列文章进行输出，如前端高级进阶系列，个人服务器指南系列。

> 说到个人服务器，如果你是新人的话，在阿里云有优惠，这里有连接进行购买：[阿里云新人优惠服务器](https://www.aliyun.com/minisite/goods?userCode=4sm8juxu)。可以跟着我的系列文章 [跟着山月管理个人服务器](https://shanyue.tech/op/) 来学习。 如果你对服务器完全没有概念，建议购买配置 `1核2G`，也就八十来快钱。如果对云主机有所了解，建议购买配置 `2核4G`。

+ **[阿里云新人优惠服务器](https://www.aliyun.com/minisite/goods?userCode=4sm8juxu)**
+ **[跟着山月管理个人服务器](https://shanyue.tech/op/)**

## 名字由来

大学时读了温庭筠一首词，`山月不知心底事，水风空落眼前花`，于是就起了一个名字: 山月水风。

后来难免觉得花间词过于矫情，于是把名字拆成两个，只取前两个字：山月。取李白 `暮从碧山下，山月随人归` 之意，恰好那段时间从京西阳台山下来时伴着月亮。

再后来读书读多了，觉得 `松风吹解带，山月照弹琴` 与 `水风轻，蘋花渐老，月露冷，梧叶飘黄` 的意境也不错，也很喜欢。

## 前端工程化

1. [前端高级进阶：javascript 代码是如何被压缩](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/uglify.md)
1. [前端高级进阶：如何更好地优化打包资源](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/bundle.md)
1. [前端高级进阶：网站的缓存控制策略最佳实践及注意事项](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/http-cache.md)
1. [前端高级进阶：在生产环境中使你的 npm i 速度提升 50%](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/npm-install.md)
1. [前端高级进阶：使用 docker 高效部署你的前端应用](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/docker.md)
1. [前端高级进阶：CICD 下的前端多特性分支环境的部署](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/feature-deploy.md)
1. [前端高级进阶：前端部署的发展历程](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/deploy.md)

更多文章: [前端工程化系列](https://github.com/shfshanyue/blog/tree/master/frontend-engineering/)

## Node 实践

+ [Node实践源码篇: 40 行代码实现精简版 koa](https://shanyue.tech/node/koa.html)
+ [Node实践日志篇: 异步资源监听与 CLS 实现](https://shanyue.tech/node/cls.html)

更多文章: [Node 实践](https://github.com/shfshanyue/blog/tree/master/node/)

## 技术中的用户增长手段

### 案例篇

+ [使用 wechaty 实现一个疫情机器人](https://shanyue.tech/growth/wechaty.html)
+ [使用公众号开发进行网站向公众号的导流](https://shanyue.tech/op/blog-to-wechat.html)

更多文章: [用户增长](https://github.com/shfshanyue/blog/tree/master/growth/)

## 个人服务器运维指南

你可以在阿里云新购一台服务器作为实践：

+ **[阿里云新人优惠服务器](https://www.aliyun.com/minisite/goods?userCode=4sm8juxu)**

1. 序
    1. [序·当我有一台服务器时我做了什么](https://shanyue.tech/op/when-server.html)
    1. [序·当我有一台服务器时我做了什么(2019)](https://shanyue.tech/op/when-server-2019.html)
1. 服务器初始化配置
    1. [服务器快速登录配置：ssh-config](https://shanyue.tech/op/init.html)
    1. [git 基本命令及安装](https://shanyue.tech/op/git.html)
    1. [服务器ssh key 及 github 配置](https://shanyue.tech/op/ssh-setting.html)
    1. [系统信息查看相关命令](https://shanyue.tech/op/system-info.html)
    1. [vim 基本操作及配置](https://shanyue.tech/op/vim-setting.html)
    1. [tmux 与多窗口管理](https://shanyue.tech/op/tmux-vim-setting.html)
1. 自动化运维
    1. [ansible 简易入门](https://shanyue.tech/op/ansible-guide.html)
1. 了解 docker 
    1. [docker 简易入门](https://shanyue.tech/op/docker.html)
    1. [Dockerfile 最佳实践](https://shanyue.tech/op/dockerfile-practice.html)
    1. [案例: 使用 docker 高效部署前端应用](https://shanyue.tech/op/deploy-fe-with-docker.html)
1. 使用 docker compose 编排容器
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
1. 服务器及容器监控
    1. [linux 各项监控指标](https://shanyue.tech/op/linux-monitor.html)
    1. [使用 htop 监控进程指标](https://shanyue.tech/op/htop.html)
    1. [使用 ctop 监控容器指标](https://shanyue.tech/op/ctop.html)
1. 高频 linux 命令
    1. [sed 命令详解及示例](https://shanyue.tech/op/linux-sed.html)
    1. [awk 命令详解及示例](https://shanyue.tech/op/linux-awk.html)
    1. [jq 命令详解及示例](https://shanyue.tech/op/jq.html)
    1. [tcpdump 命令详解及示例](https://shanyue.tech/op/linux-tcpdump.html)
    1. [案例: 使用jq与sed制作掘金面试文章榜单](https://shanyue.tech/op/jq-sed-case.html)

## 技术反思分享

> 以下都是关于技术思考的文章分享

1. [10 Things Every Developer Should Learn](https://medium.com/better-programming/10-things-every-developer-should-learn-72697ed5d94a) · [中文翻译](https://mp.weixin.qq.com/s?__biz=MjM5NTk4MDA1MA==&mid=2458073334&idx=2&sn=0d0c3f9552c1632baa3f25a46e0d28d1&chksm=b187ae8b86f0279d0482bbfd98dfaa579b451c44754c8b1ed1b33151de9803691c4fe59e3757&token=1024506330&lang=zh_CN#rd)

## 后端

1. [各种架构图乱七八糟的图索引](https://github.com/shfshanyue/graph)
1. [linux 性能监控指标速查](https://shanyue.tech/op/linux-monitor)
1. [jwt 实践应用以及特殊案例思考](https://shanyue.tech/post/jwt-guide.html)
1. [jwt 邮件验证码与登录实践](https://shanyue.tech/post/jwt-and-verifyCode.html)
1. [GraphQL 开发指南](https://shanyue.tech/post/graphql-guide.html)
1. [由 GraphQL 来思考 API Design](https://shanyue.tech/post/api-design-inspire-by-graphql.html)
1. [Node 中异常，EXIT CODE 与 dockerfile ](https://shanyue.tech/post/exit-code-node-and-docker.html)
1. [如何快速了解新业务](https://shanyue.tech/post/business-get-started.html)
1. [限流算法: 漏桶与令牌桶简介](https://shanyue.tech/post/rate-limit/)
1. [使用 requestId 标记全链路日志](https://shanyue.tech/post/requestId-and-tracing/)
1. [Node 中的异常收集，结构化与监控](https://shanyue.tech/post/server-structed-error.html)
1. [谈谈 Redis 在项目中的常见使用场景](./post/redis-case)
1. [项目实践: 使用微信公众号开发模拟面试功能](https://shanyue.tech/op/wechat-interview.html)
1. [黑客增长: 如何把用户从博客引到公众号](https://shanyue.tech/op/blog-to-wechat.html)
1. [Sequelize V5 升级记录及注意事项](https://shanyue.tech/post/sequelize-upgrade.html)
1. [如何判断文件中换行符 LF(\n) 与 CRLF(\r\n)](https://shanyue.tech/post/LF-CRLF.html)
1. [两个由于 async/await 导致 OOM 的示例](https://shanyue.tech/post/async-oom.html)
1. [隔离级，悲观锁与诗词字云功能的开发](https://shanyue.tech/post/poem-char-frequent-stat.html)
1. [域名更改注意事项须知](https://shanyue.tech/post/domain-update-record.html)
1. [从数据库到前端，使用 enum 代替 constant number](https://shanyue.tech/post/constant-db-to-client.html)
1. [SQL必知必会](https://shanyue.tech/post/sql-examples.html)

## 前端

1. [前端部署演化史](https://shanyue.tech/op/deploy-fe.html)
1. [JS 调试问题汇总及示例](https://shanyue.tech/post/js-debug-examples/)
1. [如何实现 Promise 的限流](https://shanyue.tech/code/Promise/)
1. [如何实现一个简单的 Promise](https://shanyue.tech/code/Promise-map/)
1. [你不知道的 JS 之疑难汇总](./post/js-puzzles)
1. [使用纯 CSS 实现仿 Material Design 的 input 过渡效果](https://shanyue.tech/post/login-input-style.html)
1. [Canvas VS SVG 画影图形](https://shanyue.tech/post/canvas-and-svg-shapes.html)
1. [Grid 布局指南](https://shanyue.tech/post/Grid-Guide/)
1. [使用 Grid 进行常见布局](https://shanyue.tech/post/Grid-Layout-Common-Usage/)
1. [浏览器中的二进制以及相互转化](https://shanyue.tech/post/binary-in-frontend/)

## 工具与增效

1. [vim 快速入门](https://shanyue.tech/post/vim-quick-start.html)
1. [是谁动了我的代码](https://shanyue.tech/post/git-tips.html)
1. [tmux 与多窗口管理](https://shanyue.tech/op/tmux-vim-setting.html)
1. [ssh 快速登录服务器](https://shanyue.tech/op/init.html)

## 关注我

我是山月，一个喜欢跑步与爬山的程序员，我会定期分享全栈文章在个人公众号中。如果你对全栈面试，前端工程化，graphql，devops，个人服务器运维以及微服务感兴趣的话，可以关注我的微信公众号【全栈成长之路】。

![如果你对全栈面试，前端工程化，graphql，devops，个人服务器运维以及微服务感兴趣的话，可以关注我](https://shanyue.tech/qrcode.jpg)
