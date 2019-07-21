# IP 寻址

当通过 DNS 解析查找到域名对应的 IP 地址后，就会进行 IP 寻址与 ARP 寻址，找到目标主机。

## 报文

## ping

使用 `ping` 命令发送 `ICMP` 报文，查看主机是否可达。`ping` 也可以直接测试域名

+ `shanyue.tech`
+ `shici.xiange.tech`

``` bash
$ ping -c 3 shici.xiange.tech
PING shici.xiange.tech (59.110.216.155): 56 data bytes
64 bytes from 59.110.216.155: icmp_seq=0 ttl=50 time=9.547 ms
64 bytes from 59.110.216.155: icmp_seq=1 ttl=50 time=9.175 ms
64 bytes from 59.110.216.155: icmp_seq=2 ttl=50 time=15.694 ms

--- shici.xiange.tech ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 9.175/11.472/15.694/2.989 ms

$ ping -c 3 shanyue.tech
PING shanyue.netlify.com (206.189.89.118): 56 data bytes
64 bytes from 206.189.89.118: icmp_seq=0 ttl=39 time=278.805 ms
64 bytes from 206.189.89.118: icmp_seq=1 ttl=39 time=322.390 ms
64 bytes from 206.189.89.118: icmp_seq=2 ttl=39 time=262.476 ms

--- shanyue.netlify.com ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 262.476/287.890/322.390/25.289 ms

# 经过国内 CDN 优化后
$ ping -c 3 shanyue.tech
PING shanyue.tech.w.kunlungr.com (124.200.113.112): 56 data bytes
64 bytes from 124.200.113.112: icmp_seq=0 ttl=55 time=3.274 ms
64 bytes from 124.200.113.112: icmp_seq=1 ttl=55 time=3.759 ms
64 bytes from 124.200.113.112: icmp_seq=2 ttl=55 time=4.697 ms

--- shanyue.tech.w.kunlungr.com ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 3.274/3.910/4.697/0.591 ms
```

## TTL (time to live) 与 hop

我们在 ping IP地址时，会有一个字段 ttl=55，那 ttl 是什么意思呢？

我们在互联网寻址时会经过一个又一个的路由器，每次经过一个路由器就成一个 hop，hop 又称为一跳。路由器就像是自驾游时过高速公路的收费站，也像是出去旅游时坐高铁的中转站。

**我们在不断跳路由器寻找目标主机时，我们如何判断目标主机不可达呢？**

我们会设置一个最大的最大的 hop，一般为 64，如果 64 跳后还没有到达目标主机，则称目标主机不可达。

ttl 在这里的意思与调数相关，全称 `time to live`，用它表示如果在跳 ttl 个路由器还没找到，那就代表目标主机不可达

## IP 寻址与 traceroute

我们在互联网上访问到 `59.110.216.155`，其中必然经过了许多路由器。如同我们去公司上班时也会经过很多地铁中转站，虽然去公司有很多条可选，但最近的往往就那么一条。

通过 `traceroute` 命令可以打印途中经过的路由

``` bash
$ traceroute 59.110.216.155
traceroute to 59.110.216.155 (59.110.216.155), 64 hops max, 52 byte packets
 1  172.16.12.1 (172.16.12.1)  4.177 ms  9.170 ms  2.181 ms
 2  172.16.252.1 (172.16.252.1)  1.459 ms  2.394 ms  2.240 ms
 3  124.200.184.73 (124.200.184.73)  9.865 ms  16.787 ms  6.794 ms
 4  10.255.155.201 (10.255.155.201)  4.647 ms  5.405 ms  5.014 ms
 5  10.255.154.85 (10.255.154.85)  5.240 ms  5.883 ms  6.500 ms
 6  218.241.255.201 (218.241.255.201)  9.469 ms  4.176 ms  2.976 ms
 7  14.197.243.45 (14.197.243.45)  4.421 ms
    14.197.179.69 (14.197.179.69)  28.519 ms
    14.197.177.81 (14.197.177.81)  62.002 ms
 8  14.197.219.201 (14.197.219.201)  5.500 ms
    14.197.219.205 (14.197.219.205)  6.851 ms
    14.197.196.22 (14.197.196.22)  4.769 ms
 9  14.197.213.94 (14.197.213.94)  6.365 ms
    14.197.200.242 (14.197.200.242)  10.781 ms
    14.197.213.90 (14.197.213.90)  4.157 ms
10  14.197.200.242 (14.197.200.242)  5.768 ms  6.031 ms  6.015 ms
11  116.251.112.178 (116.251.112.178)  8.215 ms
    103.41.143.193 (103.41.143.193)  7.112 ms
    103.41.143.177 (103.41.143.177)  7.725 ms
12  116.251.117.29 (116.251.117.29)  8.993 ms *
    103.41.143.177 (103.41.143.177)  7.771 ms
13  11.204.180.169 (11.204.180.169)  11.260 ms * *
14  59.110.216.155 (59.110.216.155)  7.740 ms
    11.219.79.177 (11.219.79.177)  12.645 ms
    11.219.79.145 (11.219.79.145)  11.785 ms
```

我们可以得到哪些信息呢

1. 我们发送的报文大小是 52 Byte
1. 我们到达目标主机听过了 14 个路由器

## 路由表

那我们如何确认第一跳呢？

我们有一个路由表记录了信息

``` bash
$ route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
0.0.0.0         192.168.1.253   0.0.0.0         UG        0 0          0 eth0
10.8.0.0        0.0.0.0         255.255.255.0   U         0 0          0 tun0
169.254.0.0     0.0.0.0         255.255.0.0     U         0 0          0 eth0
172.17.0.0      0.0.0.0         255.255.0.0     U         0 0          0 docker0
172.18.0.0      0.0.0.0         255.255.0.0     U         0 0          0 br-705e5ff46760
172.19.0.0      0.0.0.0         255.255.0.0     U         0 0          0 br-cf03cb526caf
192.168.1.0     0.0.0.0         255.255.255.0   U         0 0          0 eth0

$ ip route
default via 192.168.1.253 dev eth0
10.8.0.0/24 dev tun0 proto kernel scope link src 10.8.0.1
169.254.0.0/16 dev eth0 scope link metric 1002
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1
172.18.0.0/16 dev br-705e5ff46760 proto kernel scope link src 172.18.0.1
172.19.0.0/16 dev br-cf03cb526caf proto kernel scope link src 172.19.0.1
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.214

$ netstat -nr
```

在根据路由表寻址时，有一系列步骤

## 面试追问

### 使用什么命令查找本机的路由表
### `traceroute` 的原理是什么
### 当 ping 目标主机时，如何判断目标主机不可达
### 如何查看你与目标主机隔了多少路由器
### 127.0.0.1 与 localhost 有什么区别
