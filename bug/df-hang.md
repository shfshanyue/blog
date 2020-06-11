date: 2020-04-10 20:00

--- 

# df 被 hang 住，无法查看磁盘使用情况

## 情景再现

在 `centos7` 中，当使用 `df` 命令查看磁盘空间时被 hang 住，时隔两周决定处理这个问题

## 捉虫

1. `df` 命令 `hanging`
1. `strace df`，查看系统调用，发现阻塞在了 `stat("/proc/sys/fs/binfmt_misc")`
1. `mount | grep binfmt`，查看挂载情况，输出 `systemd-1 on /proc/sys/fs/binfmt_misc type autofs (rw,relatime,fd=31,pgrp=1,timeout=300,minproto=5,maxproto=5,direct)
`
### 补充知识

1. `df`: 查看磁盘使用情况
1. `strace`: 查看某命令的系统调用

## 原因

`proc-sys-fs-binfmt_misc.automount` 与 `proc-sys-fs-binfmt_misc.mount` 这两个之间存在竞争条件

## 解决

``` bash
$ systemctl restart proc-sys-fs-binfmt_misc.mount
```

### 参考

1. [解决CentOS 7 df命令卡住问题](https://www.jianshu.com/p/7e71b5248cb3)
1. [why is df hanging](https://unix.stackexchange.com/questions/21199/why-is-df-hanging)
1. [centos7 系统 df hang 问题处理说明](https://www.colabug.com/2018/0607/3072371/)
