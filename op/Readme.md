# 当我有服务器时我做了什么 · <small>个人服务器运维指南</small>

在 2018 年时，我写了一篇文章: [当我有一台服务器时做了什么](https://shanyue.tech/op/when-server.html)。为了不至于浪费我在阿里云低价优惠买的服务器，于是使用 docker 跑了一个应用，并参照我司的技术架构搭建了相关的基础设施。

现在仔细想来，这些经验非常适用于有一台服务器却不知所措的人，于是有了本系列文章，希望能够帮助到那些服务器买来已久却仍在吃灰的人。如果你是一个自由开发者，本系列文章或许对你环境搭建也会有些许启发。

如果你的服务器配置高于1核2G，则本系列文章将会适用于你。如果你的服务器配置较高，并且拥有多台服务器，你可以参考我另一系列文章 [k8s 与微服务实践](https://github.com/shfshanyue/learn-k8s)

> 本系列文章托管在 github 的仓库 [shfshanyue/op-note](https://github.com/shfshanyue/op-note)

如果你没有服务器，可以在华为云或者阿里云新购一台服务器作为实践，对于新手有以下优惠

+ [阿里云](https://www.aliyun.com/1111/pintuan-share?ptCode=MTY5MzQ0Mjc1MzQyODAwMHx8MTE0fDE%3D&userCode=4sm8juxu)

## 预览

### 窗口管理

![窗口管理](./assets/dev-env.png)

### 服务管理

![服务管理](https://raw.githubusercontent.com/shfshanyue/graph/master/draw/docker-compose.jpg)

## 目录

> 本系列文章所有容器的配置文件在 [compose目录](https://github.com/shfshanyue/op-note/tree/master/compose)

1. 序
    1. [序·当我有一台服务器时我做了什么](https://shanyue.tech/op/when-server.html)
    1. [序·当我有一台服务器时我做了什么(2019)](https://shanyue.tech/op/when-server-2019.html)
1. 服务器初始化配置
    1. [高效简单的服务器登录配置](./init.md)
    1. [服务器上 git 安装及基本配置](./git.md)
    1. [服务器上 ssh key 管理及 github 配置](./ssh-setting.md)
    1. [服务器基本指标信息查看及命令](./system-info.md)
    1. [tmux 与服务器终端多窗口管理](https://shanyue.tech/op/tmux-setting.html)
    1. [vim 基本操作及配置](https://shanyue.tech/op/vim-setting.html)
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
    1. [iptables 命令详解及示例](https://shanyue.tech/op/iptables.html) - TODO
    1. [tcpdump 命令详解及示例](https://shanyue.tech/op/linux-tcpdump.html)
    1. [htop 命令详解及示例](https://shanyue.tech/op/htop.html) - TODO
    1. [案例: 使用jq与sed制作掘金面试文章榜单](https://shanyue.tech/op/jq-sed-case.html)

### TODO

1. 为何需要一套 Linux 环境

## 关注我

我是山月，我会定期分享文章在个人公众号【全栈成长之路】中。你可以添加我微信 `shanyue94` 或者在公众号中联系我，添加好友时回复 **个人服务器** 可以拉你进个人服务器运维交流群。

如果你没有服务器，可以在华为云或者阿里云新购一台服务器作为实践，对于新手有以下优惠

+ [阿里云](https://www.aliyun.com/1111/pintuan-share?ptCode=MTY5MzQ0Mjc1MzQyODAwMHx8MTE0fDE%3D&userCode=4sm8juxu)

![](https://shanyue.tech/wechat.jpeg)
