# Internet 地址结构

## 术语

+ `IANA`: `The Internet Assigned Numbers Authority`，互联网数字分配机构，管IP地址的
+ `ISP`: `Internet Service Provider`，互联网服务提供商，卖宽带的，有移动，联通，电信
+ `AS`: `Autonomous System`，自治系统

## IP 地址的表示



## CIDR

`CIDR` 即 `Classless Inter-Domain Routing`，无类别域间路由，表示 IP 地址段

比如 `198.128.128.192/27` 代表地址段 `198.128.128.192` ~ `198.128.128.223`，而在以前，它属于 C 段地址，只能表示为 `198.128.128.0/24`

## 特殊用途地址

常用的私网地址有三段

+ `10.0.0.0/8`
+ `172.16.0.0/12`
+ `192.168.0.0/16`

还有一段经常在路由表里出现的地址

+ `169.254.0.0/16`
