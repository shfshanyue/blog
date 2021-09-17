---
title: 服务器登录配置
date: 2019-10-10 23:00
keywords: 云服务器登录,ssh-config,ssh免密登录,ssh及服务器登录配置,ssh禁止密码登录
description: 当刚拥有服务器后，首先需要登录服务器，本节主要有以下三个实践操作：快速登录，免密登录，禁用密码。
tags:
  - linux

---

# 高效简单的服务器登录配置

当你拥有了属于自己的一台云服务器后，首先需要做的事情就是登录服务器。

而登录服务器，作为新手可以通过云厂商提供的 dashboard 进行登录操作。但是，最简单及最方便的方式还是通过终端，使用 `ssh` 命令快速登录

本节主要涉及以下四个实践操作，这也是山月关于个人服务器管理的第一篇文章，欢迎持续关注

1. 快速登录: 配置客户端 ssh-config
1. 免密登录: 配置 public key
1. 禁用密码：配置服务器 ssh-config
1. 保持连接：控制ssh不被断开

> 你对流程熟悉后，只需要一分钟便可以操作完成

<!--more-->

+ 原文地址: [云服务器初始登录配置](https://shanyue.tech/op/init.html)
+ 系列文章: [服务器运维笔记](https://shanyue.tech/op/)

## 登录服务器: ssh

把以下 IP 地址替换为你云服务器的公网地址，并提供密码即可登录。但记住一个 IP 地址，这是一个反人性的操作，如果你有多个服务器呢？此时 `ssh-config` 就派上了用场

``` bash
$ ssh root@172.16.3.2
```

## 快速登录：ssh-config

在本地客户端环境 (个人电脑) 上配置 ssh-config，对个人服务器起别名，可以更方便地登录云服务器，以下是关于 ssh-config 的配置文件

+ `/etc/ssh/ssh_config`
+ `~/.ssh/config`

以下是快速登录山月两个服务器 `shanyue` 和 `shuifeng` 的配置

```config
# 修改 ssh 配置文件 ~/.ssh/config

Host shanyue
    HostName 59.110.216.155
    User root
Host shuifeng
    HostName <PUBLIC_IP>
    User root
```

配置成功之后直接 ssh host 名称就可以，是不是很方便呢？

``` bash
$ ssh shanyue
The authenticity of host '59.110.216.155 (59.110.216.155)' can't be established.
ECDSA key fingerprint is SHA256:WXULVpZcrX6kENrR5GH0mqRi49Djj22UXba0dRXCVKo.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '59.110.216.155' (ECDSA) to the list of known hosts.

Welcome to Alibaba Cloud Elastic Compute Service !

[root@shanyue ~]#
[root@shanyue ~]#
[root@shanyue ~]#
```

## 免密登录：public-key 与 ssh-copy-id

不过仅仅有了别名，每次输入密码也是足够麻烦的。**那如何实现远程服务器的免密登录?**

1. 两个文件: 本地环境的 `~/.ssh/id_rsa.pub` 与 远程服务器的 `~/.ssh/authorized_keys`
1. 一个动作：把本地文件中的内容复制粘贴到远程服务器中

> 如果本地环境中 ~/.ssh/id_rsa.pub 文件不存在，请参考下一章节使用 ssh-keygen 生成 ssh keys: [ssh key 及 git 配置](https://shanyue.tech/op/ssh-setting.html)

**总结成一句话，即把自己的公钥放在远程服务器。**

简单来说，就是 `Ctrl-C` 与 `Ctrl-V` 操作，不过具体实施起来较为琐碎。 **更为重要的是对于新人还有一个门槛：vim 的使用**。

> 关于 vim，可以参考后续文章 [vim 基本操作及其配置](https://shanyue.tech/op/vim-setting.html)

此时一个解决生产力的命令行工具应运而生: `ssh-copy-id`

```ssh
# 在本地环境进行操作

# 提示你输入密码，成功之后可以直接 ssh 登录，无需密码
$ ssh-copy-id shanyue

# 登陆成功，无需密码
$ ssh shanyue
```

## 禁用密码登录

为了更大保障服务器的安全性，这里禁止密码登录。修改云服务器的 `sshd` 配置文件：`/etc/ssh/sshd_config`。其中 `PasswordAuthentication` 设置为 `no`，以此来禁用密码登录。

```config
# 编辑服务器端的 /etc/ssh/sshd_config
# 禁用密码登录
Host *
  PasswordAuthentication no
```

## 保持连接

此时仿佛一切都顺心遂意，心满意足，于是，山月趁空接了杯水喝。然而回来发现，ssh 超时断开连接，并因此 hang 住了，这怎么能忍？

在客户端的 ssh-config 配置文件中，加两行配置搞定。

``` config
Host *
  ServerAliveInterval 60
```
