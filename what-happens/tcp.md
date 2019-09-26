# 建立一个 TCP 连接

我们已经通过 DNS 解析到了 IP 地址

+ `shanyue.tech`: 178.128.123.58
+ `shici.xiange.tech`: 59.110.216.155，我在阿里云的服务器

在本地:

``` shell
$ netstat -tan | sed -n 2
Proto Recv-Q Send-Q  Local Address          Foreign Address        (state)

$ netstat -tan | grep 59.110
tcp4       0      0  172.16.12.207.49239    59.110.216.155.443     ESTABLISHED
```

在云服务上:

``` shell
$ netstat -tan | grep 124.200
tcp        0     36 172.17.68.39:22         124.200.184.74:28204    ESTABLISHED
```

+ 建立连接的过程是什么
+ 如何监控连接的状态变化

## 报文

+ 

+ TCP 关注于端口，而 IP 寻址由 IP 层完成
+ 报文长度是 20 Byte+

## socket


