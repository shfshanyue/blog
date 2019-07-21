---
title: tcpdump 命令详解及示例
keywords: tcpdump,linux抓包
description: sed 是一个用来筛选与转换文本内容的工具。一般用来批量替换，删除某行文件。如果想在 mac 中使用 sed，请使用 gsed 代替，不然会被坑
date: 2019-11-14 20:00
sidebarDepth: 3
tags:
  - linux

---

# tcpdump 命令详解及示例

Q: `tcpdump` 是干吗的\
A: 抓包的\
Q: 除了 `tcpdump` 还有啥能抓包\
A: `wireshark`\
Q: 为啥不讲 `wireshark` 抓包\
A: `wireshark` 在 linux 命令行上不能用

<!--more-->

+ 原文链接: [tcpdump 命令详解及示例](https://github.com/shfshanyue/op-note/blob/master/linux-tcpdump.md)
+ 系列文章: [当我有台服务器时我做了什么](https://github.com/shfshanyue/op-note)

## tcpdump 命令详解

### 关键选项

+ `-c count`: 指定打印条数
+ `-i interface`: 指定网络接口，如常见的 `eth0`，`lo`，可以通过 `ifconfig` 打印所有网络接口
+ `-vv`: 尽可能多地打印信息

### 过滤器

过滤器，顾名思义，过滤一部分数据包，**而过滤器使用 `pcap-filter` 的语法**

所以你可以查看 `pcap-filter` 手册

``` bash
# 查看所有过滤器
$ man pcap-fliter
```

过滤器可以简单分为三类

+ `type`: 有四种类型 `host`，`net`，`port`，`portrange`
    + `tcpdump port 22`
    + `tcpdump port ssh`
+ `dir`: 源地址和目标地址，主要有 `src` 和 `dst`
    + `tcpdump src port ssh`
+ `proto`: 协议，有 `ip`，`arp`，`rarp`，`tcp`，`udp`，`icmp` 等
    + `tcpdump icmp`

## tcpdump examples

+ 命令: `netstat -i`\
  解释: 打印所有网络接口

+ 命令: `tcpdump -i eth0`\
  解释: 监视网络接口 `eth0` 的数据包

+ 命令: `tcpdump host 172.18.0.10`\
  解释: 监视主机地址 `172.18.0.10` 的数据包

+ 命令: `tcpdump net 172.18.0.1/24`\
  解释: 监视网络 `172.10.0.1/24` 的所有数据包

+ 命令: `tcpdump tcp port 443`\
  解释: 监听 https 请求

+ 命令: `tcpdump tcp port 443 and host 172.18.0.10`\
  解释: 监听目标地址或源地址是 172.18.0.10 的 https 请求

+ 命令: `tcpdump icmp`\
  解释: 监听 ICMP 协议 (比如典型的 PING 命令)

+ 命令: `tcpdump arp`\
  解释: 监听 ARP 协议

+ 命令: `tcpdump 'tcp[tcpflags] == tcp-syn'`\
  解释: 监听 TCP 协议中 `flag` 带 `SYN` 的，可以用来监听三次握手

+ 命令: `tcpdump -vv tcp port 80 | grep 'Host:'`\
  解释: 找到 http 中所有的 Host 

## 相关文章

+ [A tcpdump Tutorial with Examples — 50 Ways to Isolate Traffic](https://danielmiessler.com/study/tcpdump/)
