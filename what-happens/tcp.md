# 建立一个 TCP 连接

我们已经通过 DNS 解析到了 IP 地址

+ `shanyue.tech`: 178.128.123.58
+ `shici.xiange.tech`: 59.110.216.155，我在阿里云的服务器

在本地(客户端)查看建立好的连接:

```shell
# 打印头部信息
$ netstat -tan | sed -n 2p
Proto Recv-Q Send-Q  Local Address          Foreign Address        (state)

$ netstat -tan | grep 59.110
tcp4       0      0  172.16.12.207.49239    59.110.216.155.443     ESTABLISHED
```

在云主机上(服务端)查看建立好的连接:

```shell
$ netstat -tan | grep 124.200
```

+ 建立连接的过程是什么
+ 如何监控连接的状态变化

## 报文

![TCP 报文字段]()

+ TCP 关注于端口，而 IP 寻址由 IP 层完成
+ 报文长度是 20 Byte+

## socket

当解析到 IP 地址后，客户端与服务器端建立一个 TCP 连接。TCP Client 与 TCP Server 建立连接的过程如下

![TCP 连接过程]()

## 三次握手与四次挥手

当我们访问 `shici.xiange.tech` 时，服务器已经处于 `accept` 状态等待，而客户端一般会以三次握手主动开始进行连接，四次挥手主动关闭连接。

![TCP 三次握手与四次挥手]()

## TCP 连接状态装换图

![TCP 连接状态]()

当然最常见的状态还是以下几种

+ `LISTEN`
+ `ESTABLISEHED`

## 更多问题

+ TCP 为什么是可靠的连接
+ 为什么刚好是三次握手
+ TCP 如何进行拥塞控制
+ 一个主机中 TCP 连接的上限是多少
+ 如何查看某个服务的TCP连接数
+ 如何查看 mysql/postgres 的TCP连接数
+ 如何判断某个端口号是TCP连接还是UDP连接
+ 我们如何找到某个端口号上跑的进程
