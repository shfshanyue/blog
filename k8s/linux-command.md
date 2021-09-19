---
title: 安装k8s过程会遇到的linxu命令
date: 2019-09-02 22:00

---

安装 `kubernetes` 是一个技术活，其中涉及到很多在 `linux` 上的命令行操作。在此之前，熟悉一些在 `centos` 上的基本命令是必不可少的。

也可以反过来说 **不了解这些命令你有可能寸步难行**。 以下是在安装过程中有可能会反复使用的命令

## yum

`yum` 是在 `centos` 下的包管理工具

``` shell
# 安装 docker
$ yum install docker-ce
$ yum list | grep docker
$ yum remove docker-ce

# 删除 package
$ yum erase docker-ce

# 清除 package 的依赖
$ yum autoremove
```

## rsync

`rsync` 被用来与远程服务器间传送文件，与 `scp` 类似，但 `rsync` 可以实现增量传送

如需要传输k8s所需要的镜像压缩包时: 首次打包了总共5个镜像为 k8s.tar，传输到目标节点。随后发现一个镜像没有打包，于是再次打包，总共6个镜像为 k8s.tar，再次传输到目标节点。`rsync` 可以对比文件差异而做到仅传输最后一次丢掉的镜像。

``` shell
# 把本机的 k8s.tar 传送到 shanyue 服务器的 /root 目录
# -a 代表归档
# -v 代表打印详细信息，这个参数很常见了 --verbose
# -h 代表打印可读性好的信息，这个参数也很常见 --human-readable
# -z 代表打包传送，减小传送体积
$ rsync -avhzP k8s.tar shanyue:/root
```

## systemctl

`systemctl` 管理 `centos` 中的服务

``` shell
$ systemctl status docker
```

## journalctl

`journalctl` 用以管理 `centos` 中服务的日志。

``` shell
$ journalctl -xeu docker
```

## route/ip

在设置网络时，可以使用该命令检查路由表。在搭建 k8s 集群是，可能出现 `connect: no route to host` 类似的错误，可以使用 `route -n` 或者 `ip route` 进行诊断。

``` shell
# 打印路由表
# -n 代表使用数字代表 IP 地址
$ route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         172.17.79.253   0.0.0.0         UG    0      0        0 eth0
10.244.0.0      0.0.0.0         255.255.255.0   U     0      0        0 cni0
10.244.1.0      10.244.1.0      255.255.255.0   UG    0      0        0 flannel.1
169.254.0.0     0.0.0.0         255.255.0.0     U     1002   0        0 eth0
172.17.64.0     0.0.0.0         255.255.240.0   U     0      0        0 eth0
172.18.0.0      0.0.0.0         255.255.0.0     U     0      0        0 docker0

# 另外，也可以通过该命令检查其路由表
$ ip route
```

### iptables

`iptables` 用以控制 IP 数据报，比如转发，丢弃与过滤

``` shell
$ iptables -L
Chain INPUT (policy ACCEPT)
target     prot opt source               destination

Chain FORWARD (policy DROP)
target     prot opt source               destination
DOCKER-USER  all  --  anywhere             anywhere
DOCKER-ISOLATION-STAGE-1  all  --  anywhere             anywhere
ACCEPT     all  --  anywhere             anywhere             ctstate RELATED,ESTABLISHED
DOCKER     all  --  anywhere             anywhere
ACCEPT     all  --  anywhere             anywhere
ACCEPT     all  --  anywhere             anywhere

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination

Chain DOCKER (1 references)
target     prot opt source               destination

Chain DOCKER-ISOLATION-STAGE-1 (1 references)
target     prot opt source               destination
DOCKER-ISOLATION-STAGE-2  all  --  anywhere             anywhere
RETURN     all  --  anywhere             anywhere

Chain DOCKER-ISOLATION-STAGE-2 (1 references)
target     prot opt source               destination
DROP       all  --  anywhere             anywhere
RETURN     all  --  anywhere             anywhere

Chain DOCKER-USER (1 references)
target     prot opt source               destination
RETURN     all  --  anywhere             anywhere
```

### lsmod

显示已载入linux内核的模块，如以下常见的模块

+ `ip_tables`
+ `overlay`
+ `bridge`
+ `br_netfilter`

### modprobe

添加或删除linux内核模块

### sysctl

`sysctl` 用以控制内核的参数

``` shell
# 打印所有配置
$ sysctl -a
```
