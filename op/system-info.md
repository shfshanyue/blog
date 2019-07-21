---
title: 云服务器基本指标信息查看及命令
keywords: 服务器系统信息,平均负载,系统监控,linux内存与CPU,linux版本,centos版本
description: "关于云服务器系统的基础信息一般在购买时就有标明，至于一些资源的使用在云服务器服务商的控制台上也有相应的监控，如果你对监控有更细致化的需求，采用 node exporter + cadvisor + prometheus + grafana 也可以做地更为精细。但是最重要的是: 你要了解哪些指标，以及它们如何在服务器上用命令敲出来"
date: 2019-10-02 14:00
tags:
  - linux

---

# 云服务器基本指标信息查看及命令

通过前几章内容的学习，我们已经可以很容易地进入云服务器及从 github 拉取代码。本章内容将会为你介绍如何查看云服务的基本配置。

关于云服务器系统的基础信息，在购买时就会有标明，至于一些资源的使用情况在云服务器服务商的控制台上也有相应的监控。

> 如果你对监控有更细致化的需求，也可以采用 `node exporter` + `cadvisor` + `prometheus` + `grafana` 做更为精细的掌控。

但是最重要的是: **你要了解哪些指标，以及它们如何在服务器上用命令敲出来**，举例如下

+ 如何查看 linux 版本和 centos 版本号
+ 如何查看内存配额及使用情况
+ 如何查看CPU核心数量及CPU使用率
+ 如何查看磁盘使用情况
+ 如何查看服务器的平均负载
+ 如何获取服务器的公网 IP 以及私网 IP
+ 如何查看服务器登录的所有用户
+ 如何查看服务器登录的所有用户

> 关于监控更多内容可以参考以下章节: [linux 各项监控指标](https://shanyue.tech/op/linux-monitor.html)

<!--more-->

+ 原文地址: [linux 基础信息查看](https://shanyue.tech/op/system-info.html)
+ 系列文章: [服务器运维笔记](https://shanyue.tech/op/)

## linux 版本和 centos 版本

``` bash
# 查看 linux 版本
$ uname -a
Linux shanyue 3.10.0-957.21.3.el7.x86_64 #1 SMP Tue Jun 18 16:35:19 UTC 2019 x86_64 x86_64 x86_64 GNU/Linux

# 查看 centos 版本号
$ cat /etc/centos-release
CentOS Linux release 7.6.1810 (Core)
```

## 内存配额及使用情况

查看还有多少内存，available 指还有多少可用内存

```bash
# -h 指打印可视化信息
$ free -h
              total        used        free      shared  buff/cache   available
Mem:           3.7G        154M        2.1G        512K        1.5G        3.3G
Swap:            0B          0B          0B
```

## CPU 核心数量及使用率

``` bash
# 查看 cpu 的核心数
$ cat /proc/cpuinfo

# 查看
$ top

$ htop
```

## 磁盘使用情况

``` bash
$ df -h
```

## 平均负载

`load average` 指单位时间内运行态进程及不可中断进程的平均进程数，运行态进程指正在使用或者等待使用 CPU 的进程，不可中断进程指正等待一些 IO 操作的进程。可使用 `uptime` 查看此指标。

```bash
$ uptime
 16:48:09 up 2 days, 23:43,  2 users,  load average: 0.01, 0.21, 0.20
```

## IP

```bash
# 公网IP
$ curl ifconfig.me
59.110.216.155

# 公网IP，上个地址的网络在国内不太好
$ curl icanhazip.com
59.110.216.155

# 私网IP
$ ifconfig eth0
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.68.39  netmask 255.255.240.0  broadcast 172.17.79.255
        ether 00:16:3e:0e:01:d8  txqueuelen 1000  (Ethernet)
        RX packets 416550  bytes 505253322 (481.8 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 194374  bytes 67561825 (64.4 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

## 登录用户

```bash
$ who -u
who -u
root     pts/0        Oct 18 15:04 04:25       16860 (124.200.184.74)
root     pts/2        Oct 18 18:10 01:22        2545 (124.200.184.74)
root     pts/5        Oct 18 19:33   .         24952 (124.200.184.74)

$ last -a | head -6
root     pts/5        Fri Oct 18 19:33   still logged in    124.200.184.74
root     pts/2        Fri Oct 18 18:10   still logged in    124.200.184.74
root     pts/2        Fri Oct 18 18:10 - 18:10  (00:00)     124.200.184.74
root     pts/2        Fri Oct 18 17:54 - 18:10  (00:16)     124.200.184.74
root     pts/2        Fri Oct 18 17:49 - 17:53  (00:03)     124.200.184.74
root     pts/2        Fri Oct 18 16:49 - 17:25  (00:36)     124.200.184.74
```
