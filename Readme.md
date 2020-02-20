# 山月的琐碎博客记录

## 后端

1. [谈谈 Redis 在项目中的常见使用场景](./post/redis-case)
1. [项目实践: 使用微信公众号开发模拟面试功能](https://shanyue.tech/op/wechat-interview.html)
1. [黑客增长: 如何把用户从博客引到公众号](https://shanyue.tech/op/blog-to-wechat.html)
1. [jwt 实践应用以及特殊案例思考](https://shanyue.tech/post/jwt-guide.html)
1. [jwt 邮件验证码与登录实践](https://shanyue.tech/post/jwt-and-verifyCode.html)
1. [Node 中异常，EXIT CODE 与 dockerfile ](https://shanyue.tech/post/exit-code-node-and-docker.html)
1. [限流算法: 漏桶与令牌桶简介](https://shanyue.tech/post/rate-limit/)
1. [使用 requestId 标记全链路日志](https://shanyue.tech/post/requestId-and-tracing/)
1. [Node 中的异常收集，结构化与监控](https://shanyue.tech/post/server-structed-error.html)
1. [Sequelize V5 升级记录及注意事项](https://shanyue.tech/post/sequelize-upgrade.html)
1. [如何判断文件中换行符 LF(\n) 与 CRLF(\r\n)](https://shanyue.tech/post/LF-CRLF.html)
1. [两个由于 async/await 导致 OOM 的示例](https://shanyue.tech/post/async-oom.html)
1. [隔离级，悲观锁与诗词字云功能的开发](https://shanyue.tech/post/poem-char-frequent-stat.html)
1. [GraphQL 开发指南](https://shanyue.tech/post/graphql-guide.html)
1. [域名更改注意事项须知](https://shanyue.tech/post/domain-update-record.html)
1. [从数据库到前端，使用 enum 代替 constant number](https://shanyue.tech/post/constant-db-to-client.html)

## 工具与增效

1. [vim 快速入门](https://shanyue.tech/post/vim-quick-start.html)
1. [是谁动了我的代码](https://shanyue.tech/post/git-tips.html)

## 个人服务器运维指南

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
1. 使用 kubernetes 编排容器
    1. [搭建一个 k8s 集群](https://github.com/shfshanyue/learn-k8s)
    1. [部署你的第一个应用: Pod ，Deployment，Service](https://github.com/shfshanyue/learn-k8s/blob/master/pod.md)
    1. [部署你的第一个应用: Ingress](https://github.com/shfshanyue/learn-k8s/blob/master/ingress.md)
    1. [部署你的第一个应用: https](https://github.com/shfshanyue/learn-k8s/blob/master/https.md)
    1. [使用 Helm 作为包管理器](https://github.com/shfshanyue/learn-k8s/blob/master/helm.md)
    1. [持续集成 drone.ci 简介及部署](https://shanyue.tech/op/deploy-drone.html)
    1. [案例：前端部署发展史](https://shanyue.tech/op/deploy-fe.html)
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


## Javascript

1. [JS 调试问题汇总及示例](https://shanyue.tech/post/js-debug-examples/)
1. [你不知道的 JS 之疑难汇总](./post/js-puzzles)

## 部分博客

+ [各种架构图乱七八糟的图索引](https://github.com/shfshanyue/graph)
+ [前端部署演化史](https://shanyue.tech/op/deploy-fe)
+ [当我有一台服务器时我做了什么](https://shanyue.tech/op/when-server)
+ [linux 性能监控指标速查](https://shanyue.tech/op/linux-monitor)
+ [限流与漏桶算法](https://shanyue.tech/post/rate-limit)
+ [如何快速了解新业务](https://shanyue.tech/post/business-get-started)
+ [SQL必知必会](https://shanyue.tech/post/sql-examples)

## 名字由来

大学时读了温庭筠一首词，`山月不知心底事，水风空落眼前花`，于是就起了一个名字: 山月水风。

后来难免觉得花间词过于矫情，于是把名字拆成两个，只取前两个字：山月。取李白 `暮从碧山下，山月随人归` 之意，恰好那段时间从京西阳台山下来时伴着月亮。

再后来读书读多了，觉得 `松风吹解带，山月照弹琴` 与 `水风轻，蘋花渐老，月露冷，梧叶飘黄` 的意境也不错，也很喜欢。所以我两台服务器的 hostname 被命名为这两个名字。

## 关注我

我是山月，一个喜欢跑步与爬山的程序员，我会定期分享全栈文章在个人公众号中。如果你对全栈面试，前端工程化，graphql，devops，个人服务器运维以及微服务感兴趣的话，可以关注我的微信公众号【山月行】。

另外可以添加微信 `shanyue94` 备注加群，进群交流技术问题

![如果你对全栈面试，前端工程化，graphql，devops，个人服务器运维以及微服务感兴趣的话，可以关注我](https://shanyue.tech/qrcode.jpg)
