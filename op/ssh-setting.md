---
title: 云服务器中 ssh key 管理 与 github 的配置
date: 2019-10-11 23:00
keywords: ssh-keygen,permission denied (publickey),git clone 的配置,ssh -T
description: ssh keygen 生成非对称加密中的 public-key 与 private-key，并把 publick-key 扔到 github 上。与上篇文章配置服务器免登陆一样的步骤。
tags:
  - linux

---

# 云服务器中 ssh key 管理与 github 配置

程序员经常挂在嘴边的一句话是: 面向 github 编程。如果没有 github 对程序员而言万古如长夜，github 对程序员的重要性可见一斑。

与 `github` 进行协同的工具是 `git`，在上一章 [云服务器上 git 安装及基本配置](./git.md) 对它在服务器上按照也有了基本介绍。虽然 `git` 可以工作在 `ssh` 与 `https` 两种协议上，但为了安全性及便利性，更多时候会选择 `ssh`。

> 如果采用 https，则每次 git push 都需要验证身份

此篇文章的主要内容是:

1. `ssh keygen` 生成非对称加密中的 public-key 与 private-key
1. 把 publik-key 扔到 github 上，与上篇文章 [服务器高效登录配置](https://shanyue.tech/op/init.html) 一样的步骤，不过上文是如何把 key 扔到云服务器，而此处是扔到 github。

> 你对流程熟悉后，只需要一分钟便可以操作完成

<!--more-->

+ 原文地址: [云服务器 ssh key 以及 git 的配置](https://shanyue.tech/op/ssh-setting.html)
+ 系列文章: [服务器运维笔记](https://shanyue.tech/op/)

## Permission denied (publickey).

如果没有在 github 设置 public key 而直接执行 `git clone` 命令的话，会有权限问题。

使用 `ssh -T` 测试连通性如下，会有一个 `Permission denied` 的异常。

``` bash
$ git clone git@github.com:vim/vim.git
Cloning into 'vim'...
Warning: Permanently added the RSA host key for IP address '13.229.188.59' to the list of known hosts.
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.

# 不过有一个更直接的命令去查看是否有权限
$ ssh -T git@github.com
Permission denied (publickey).
```

## 生成新的 ssh key

使用命令 `ssh-keygen` 可以生成配对的 `id_rsa` 与 `id_rsa.pub` 文件，生成之后只需把 `id_rsa.pub` 扔到 github 即可。

``` bash
# 生成一个 ssh-key
# -t: 可选择 dsa | ecdsa | ed25519 | rsa | rsa1，代表加密方式
# -C: 注释，一般写自己的邮箱
$ ssh-keygen -t rsa -C "shanyue"

# 生成 id_rsa/id_rsa.pub: 配对的私钥与公钥
$ ls ~/.ssh
authorized_keys  config  id_rsa  id_rsa.pub  known_hosts
```

## 在 github 设置里新添一个 ssh key

在云服务器中复制 `~/.ssh/id_rsa.pub` 中文件内容，并粘贴到github 的配置中。

``` bash
$ cat ~/.ssh/id_rsa.pub
ssh-rsa AAAAB3SSSSSSSSSSSSSSSSSSSSSBAQDcM4aOo9qlrHOnh0+HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHuM9cYmdKq5ZMfO0dQ5PB53nqZQ1YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAc1w7bC0PD02M706ZdQm5M9Q9VFzLY0TK1nz19fsh2I2yuKwHJJeRxsFAUJKgrtNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN7nm6B/9erp5n4FDKJFxdnFWuhqqUwMzRa9rUfhOX1qJ1SYAWUryQ90rpxOwXt9Pfq0Y13VsWk3QQ8nyaEJzytEXG7OR9pf9zDQph4r4rpJbXCwNjXn/ThL shanyue
```

在 github 的 ssh keys 设置中：<https://github.com/settings/keys> 点击 `New SSH key` 添加刚才生成的 public key。

更多图文指引可以参照官方文档：<https://help.github.com/cn/articles/adding-a-new-ssh-key-to-your-github-account>

## 设置成功

使用 `ssh -T` 测试成功， 此时可以成功愉快地面向 github 编程了，再也不愁没地抄代码了。

```shell
$ ssh -T git@github.com
Hi shfshanyue! You've successfully authenticated, but GitHub does not provide shell access.

$ git clone git@github.com:shfshanyue/vim-config.git
Cloning into 'vim-config'...
remote: Enumerating objects: 183, done.
remote: Total 183 (delta 0), reused 0 (delta 0), pack-reused 183
Receiving objects: 100% (183/183), 411.13 KiB | 55.00 KiB/s, done.
Resolving deltas: 100% (100/100), done.
```
