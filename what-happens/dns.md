# DNS (Domain Name System) 解析

DNS 用来解析域名所对应的 IP 地址。

> 我们要以命令洞见整个流程

## 报文信息

DNS 协议属于应用层协议，使用 `dig` 命令可以发送一条 `DNS` 报文。既然它在进行域名解析时实质是发送了一条 DNS 的报文，那首先来简单看看报文格式

> https://www.thegeekstuff.com/2012/02/dig-command-examples/

## dig 与 host 命令

可以通过 `dig` 或者 `host` 命令来把域名解析到真实的 IP 地址。

```shell{15,16,37,38}
$ dig shanyue.tech

; <<>> DiG 9.9.4-RedHat-9.9.4-74.el7_6.2 <<>> shanyue.tech
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 26762
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;shanyue.tech.                  IN      A

;; ANSWER SECTION:
shanyue.tech.           600     IN      CNAME   shanyue.netlify.com.
shanyue.netlify.com.    20      IN      A       178.128.115.5

;; Query time: 847 msec
;; SERVER: 100.100.2.138#53(100.100.2.138)
;; WHEN: Fri Sep 20 18:36:42 CST 2019
;; MSG SIZE  rcvd: 90

$ dig shanyue.tech

; <<>> DiG 9.9.4-RedHat-9.9.4-74.el7_6.2 <<>> shanyue.tech
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 54418
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;shanyue.tech.                  IN      A

;; ANSWER SECTION:
shanyue.tech.           338     IN      CNAME   shanyue.netlify.com.
shanyue.netlify.com.    20      IN      A       206.189.89.118

;; Query time: 0 msec
;; SERVER: 100.100.2.138#53(100.100.2.138)
;; WHEN: Fri Sep 20 18:41:30 CST 2019
;; MSG SIZE  rcvd: 90

$ host shanyue.tech
shanyue.tech is an alias for shanyue.netlify.com.
shanyue.netlify.com has address 178.128.115.5
shanyue.netlify.com has IPv6 address 2400:6180:0:d1::5cd:c001
```

以上是对 `shanyue.tech` 进行了两次 DNS 查询所打印的结果

### Header

一些 dig 的版本信息以及报文的汇总信息

### Question Section

即查找域名: `shanyue.tech` 在 IN (Internet) 对应的A记录 (IP)。可以控制 `-t` 指明资源记录类型

```shell
# -t: 指定记录类型，如果不指定，默认为A记录
# +noall: 隐藏所有信息
# +question: 只显示 question section
$ dig -t CNAME shanyue.tech +noall +question

; <<>> DiG 9.9.4-RedHat-9.9.4-74.el7_6.2 <<>> -t CNAME shanyue.tech +noall +question
;; global options: +cmd
;shanyue.tech.                  IN      CNAME
```

### Answer Section

这是DNS的查询结果，从打印看有两条结果

其中，`CNAME` 与 `A` 称作资源记录类型 (RR, resource record type)，他们分别释义如下

+ CNAME (canonical name): CNAME记录指向一个新的域名。`shanyue.tech` 会 `CNAME` 到 `shanyue.netlify.com`。 **从这里可以看出博客部署在了 [netlify](https://www.netlify.com/)：它可以托管你的静态页面并提供二级域名。**
+ A (address): A记录指向IP地址。 **在两次 DNS 查询时，`shanyue.netlify.com` 的 A 记录指向两个 IP 地址。表明它在 DNS 层做了负载均衡: 实际上 netlify 利用了 CDN**

```shell
# +noall: 隐藏所有信息
# +answer: 只显示 answer section
$ dig shanyue.tech +noall +answer

; <<>> DiG 9.9.4-RedHat-9.9.4-74.el7_6.2 <<>> shanyue.tech +noall +answer
;; global options: +cmd
shanyue.tech.           212     IN      CNAME   shanyue.netlify.com.
shanyue.netlify.com.    20      IN      A       206.189.89.118
```

### Stats

最后一段就是统计信息

+ `Query time`: 报文查询时间，第一次是 847ms，而第二次是 0ms，这有可能是有缓存。
+ `SERVER: 100.100.2.136#53`: 由53端口我们可以看出它是一个 DNS 服务器 (递归服务器)。另外，可以自己指定一个 DNS 递归服务器，如 `8.8.8.8`。在 linux 下，由 `/etc/resolv.conf` 维护。

```shell{3,4,15}
# DNS 服务器由以下文件设置
$ cat /etc/resolv.conf
nameserver 100.100.2.138
nameserver 100.100.2.136
options timeout:2 attempts:3 rotate single-request-reopen


# @8.8.8.8 手动设置dns服务器
$ dig @8.8.8.8 shanyue.tech +noall +stats

; <<>> DiG 9.9.4-RedHat-9.9.4-74.el7_6.2 <<>> @8.8.8.8 shanyue.tech +noall +stats
; (1 server found)
;; global options: +cmd
;; Query time: 106 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Mon Sep 23 20:40:06 CST 2019
;; MSG SIZE  rcvd: 90
```

另外除了以上我们所使用的递归服务器，还有更多选择

+ 8.8.8.8: google 家的
+ 8.8.4.4: google 家的
+ 223.5.5.5: 阿里家的
+ 114.114.114.114
+ 114.114.115.115

另外，你也可以使用 `dnsmasq` 自搭一个递归服务器：方便在内网中使用任意域名来管理自己的内网应用。如我搭建了 `172.18.0.1` 的递归服务器来解析本地域名 `xiange.me`

```shell {1, 16}
$ dig xiange.me

; <<>> DiG 9.10.6 <<>> xiange.me
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 3310
;; flags: qr aa rd ra ad; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;xiange.me.                     IN      A

;; ANSWER SECTION:
xiange.me.              0       IN      A       172.18.0.1

;; Query time: 803 msec
;; SERVER: 172.18.0.1#53(172.18.0.1)
;; WHEN: Tue Sep 24 19:59:44 CST 2019
;; MSG SIZE  rcvd: 43
```

## DNS 缓存

## 递归服务器，根服务器权威服务器

DNS 服务器在不同的情景下不是同一类服务器。

```shell{1,15,16,23,37}
$ dig -t NS shanyue.tech

; <<>> DiG 9.9.4-RedHat-9.9.4-74.el7_6.2 <<>> -t NS shanyue.tech
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 25771
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;shanyue.tech.                  IN      NS

;; ANSWER SECTION:
shanyue.tech.           1551    IN      NS      dns13.hichina.com.
shanyue.tech.           1551    IN      NS      dns14.hichina.com.

;; Query time: 0 msec
;; SERVER: 100.100.2.138#53(100.100.2.138)
;; WHEN: Tue Sep 24 20:16:43 CST 2019
;; MSG SIZE  rcvd: 92

$ dig -t NS shici.xiange.tech

; <<>> DiG 9.9.4-RedHat-9.9.4-74.el7_6.2 <<>> -t NS shici.xiange.tech
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 46429
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;shici.xiange.tech.             IN      NS

;; AUTHORITY SECTION:
xiange.tech.            600     IN      SOA     dns17.hichina.com. hostmaster.hichina.com. 2018092718 3600 1200 86400 360

;; Query time: 5 msec
;; SERVER: 100.100.2.138#53(100.100.2.138)
;; WHEN: Tue Sep 24 20:18:15 CST 2019
;; MSG SIZE  rcvd: 110
```

+ `shanyue.tech` 的权威DNS服务器是 `dns13.hichina.com.` 与 `dns14.hichina.com.`
+ `shici.xiange.tech` 的权威DNS服务器是 `dns17.hichina.com`

关于权威服务器，你可以在你的域名服务商中进行设置。

## 面试追问

### 在什么场景下会自建 DNS 服务器
### 递归服务器与权威服务器指什么
### 在本机如何查看 DNS 的缓存记录
### 如何确认 DNS 解析是从缓存中直接取来
### 如何得知域名的服务商

## 参考文章

+ [DNS协议详解及报文格式分析](https://jocent.me/2017/06/18/dns-protocol-principle.html)
