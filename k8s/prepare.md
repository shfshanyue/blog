---
title: 安装 k8s 前的准备工作
date: 2019-09-01 22:00

---

> 关于 k8s 的安装可以参考:  [k8s 官方搭建文档](https://kubernetes.io/docs/setup/)

## 版本

+ kubernetes v1.16
+ docker 18.06.2-ce: [官方文档](https://kubernetes.io/docs/setup/production-environment/container-runtimes/) 推荐此版本
+ centos 7

``` shell
# 查看 centos 版本号
$ cat /etc/redhat-release
CentOS Linux release 7.5.1804 (Core)
```

## 节点命名

以下两个节点(云服务器)作为 k8s 的一部分

+ shanyue  master 172.17.68.39 (2vCPU, 4G Mem)
+ shuifeng work   172.17.68.40 (2vCPU, 16G Mem)

另外有一个可以访问谷歌的节点，用以下载一些国内无法下载的镜像，把它叫做 `proxy`

+ proxy

为了更方便且更可读画地访问服务器进行操作，在客户端机器(Mac)编辑 `~/.ssh/config` 添加以下内容

``` config
# ~/.ssh/config

Host shanyue
    HostName 111.111.111.111
    User root
Host shuifeng
    HostName 222.222.222.222
    User root
Host proxy
    HostName 123.123.123.123
    User root
```

此时 `ssh proxy` 可以快速登录 `root@123.123.123.123`。`rsync -avhzP k8s.tar shanyue:/root` 代表把本地的 k8s.tar 文件传输到 `shanyue` 目标机的 /root 目录下。
