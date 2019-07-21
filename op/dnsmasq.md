---
title: 使用 dnsmasq 为内部集群搭建本地 DNS 服务器
thumbnail: http://www.tcpipguide.com/free/diagrams/dnsresolution.png
tags:
  - linux

---

# 搭建集群内部 DNS 服务器

当我们使用 `traefik` 反向代理和自动服务发现后，我们对集群内部的服务分为两类

1. 公有服务。如我的博客，网站，以及为它们提供服务的 API。我们可以通过公有的域名去映射服务使得外网能够访问，如通过我自己的域名 `shanyue.tech` 与 `xiange.tech`。
1. 私有服务。如 `gitlab`，`traefik Dashboard`，`redis`，`postgres` 以及自己实现的不公开的私有服务。我们可以通过自建 DNS 服务器，来对这些域名进行访问。如 `*.shanyue.local` 做 `A记录` 来映射到内部集群的网关入口 (当然也要做白名单，BasicAuth，DigestAuth，限制端口号转发等安全措施)

<!--more-->

我们先来看一看 `DNS Lookup` 的流程

![dns lookup](http://www.tcpipguide.com/free/diagrams/dnsresolution.png)

而当有了 `dnsmasq` 后，请求私有服务会先去 `dnsmasq` 解析 IP 地址。而请求互联网，如百度，则会由 `dnsmasq` 转发至上游 DNS 服务器进行解析。

+ 原文链接: [搭建集群内部 DNS 服务器](https://github.com/shfshanyue/op-note/blob/master/dnsmasq.md)
+ 系列文章: [个人服务器运维指南](https://github.com/shfshanyue/op-note)

## dnsmasq 部署

`dnsmasq` 部署自然也是使用 `docker compose`，配置文件如下

``` yaml
version: '3'

services:
  dns:
    image: jpillora/dnsmasq
    restart: always
    ports:
      - "53:53/udp"
    volumes:
      - ./dnsmasq.conf:/etc/dnsmasq.conf
      - ./resolv.conf:/etc/resolv.conf

# 使用已存在的 traefik 的 network
networks:
  default:
    external:
      name: traefik_default
```

其中自然也是与 `traefik` 使用同一网络，挂载两个文件，关于文件配置如下所示

+ `dnsmasq.conf`: 关于 `dnsmasq` 的配置文件，可以配置关于内部集群的域名映射规则
+ `resolv.conf`: 关于上游DNS服务器的配置

## dnsmasq 配置

在 `dnsmasq` 中需要配置 `*.shanyue.local` 映射到内部集群，`./dnsmasq.conf` 配置文件如下所示。`172.18.0.1` 是 `traefik` 网络入口，详情参照我的文章 [traefik 简易介绍](https://shanyue.tech/op/traefik.html)

``` conf
log-queries
log-dhcp

# 配置域名映射
address=/docker.localhost/172.18.0.1
address=/shanyue.local/172.18.0.1
```

当访问 `www.baidu.com` 还是要通过公共的 DNS 服务的，如谷歌的 `8.8.8.8`，这里使用阿里云默认的 `nameserver`。`./resolv.conf` 配置文件如下所示

``` conf
options timeout:2 attempts:3 rotate single-request-reopen
nameserver 100.100.2.136
nameserver 100.100.2.138
```

由于在服务器中使用 `0.0.0.0:53` 作为 DNS 服务器，此时也需要更改服务器内部的 `/etc/resolv.conf`，修改如下

``` conf
nameserver 127.0.0.1
```

在本地局域网中，可以使用该服务器的 IP 地址作为 DNS 服务器。可以使用 `openvpn` 来连接本地环境与服务器集群。详情参考 [使用 openvpn 与集群内部服务通信](https://shanyue.tech/op/openvpn.html)

## DNS lookup 测试

此时使用 `host` 或 `dig` 对内部服务进行测试，均能返回正确的 IP 地址

``` bash
$ host whoami.docker.localhost
whoami.docker.localhost has address 172.18.0.1

$ dig whoami.docker.localhost
172.18.0.1
```

此时，`dnsmasq` 解析的日志显示如下

``` txt
dnsmasq: query[A] whoami.docker.localhost from 172.18.0.1
dnsmasq: config whoami.docker.localhost is 172.18.0.1
```

再测试下 `www.baidu.com`，测试外部域名是否能够正常解析

``` bash
$ dig www.baidu.com +short
www.a.shifen.com.
220.181.38.149
220.181.38.150
```

正常工作，`dnsmasq` 日志如下

``` txt
dnsmasq: query[A] www.baidu.com from 172.18.0.1
dnsmasq: forwarded www.baidu.com to 100.100.2.136
dnsmasq: forwarded www.baidu.com to 100.100.2.138
dnsmasq: reply www.baidu.com is <CNAME>
dnsmasq: reply www.a.shifen.com is 220.181.38.149
dnsmasq: reply www.a.shifen.com is 220.181.38.150
```
