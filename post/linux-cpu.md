---
title: Linux 的 cpu/memory/progress 等各项监控指标小记
date: 2019-07-05T16:03:06+08:00
thumbnail: ""
categories:
  - 后端
tags:
  - devops
---

## CPU 基本信息

``` shell
cat /proc/cpuinfo
cat /proc/stat
```

## 平均负载 (load average)

使用 `uptime` 和 `w` 可打印出系统过去 1, 5, 15 分钟内的平均负载

``` shell
$ uptime
 19:28:49 up 290 days, 20:25,  1 user,  load average: 2.39, 2.64, 1.55
$ w
 19:29:50 up 290 days, 20:26,  1 user,  load average: 2.58, 2.63, 1.61
USER     TTY      FROM          LOGIN@   IDLE   JCPU   PCPU WHAT
root     pts/0    172.16.0.1    19:27    6.00s  0.05s  0.00s tmux a
```

在 `uptime` 的 man 手册中这么解释平均负载

> System load averages is the average number of processes that are either in a runnable or uninterruptable state.

翻译过来就是指系统中处于可运行状态和不可中断状态的平均进程数。

对于 4 核的 CPU，如果平均负载为 4 意味着 CPU 半点没浪费。

## CPU 使用率

`CPU 利用率 = 1 - 空闲 CPU 时间(idle time) / 总 CPU 时间`

``` shell
$ top
%Cpu(s):  7.4 us,  2.3 sy,  0.0 ni, 90.1 id,  0.0 wa,  0.0 hi,  0.2 si,  0.0 st
```

+ user: 用户态，但不包括 nice
+ system: 内核态
+ nice: 低优先级用户态，nice 值为 1-19 的 CPU 时间
+ idle (id)
+ iowait (wa)
+ irq (hi)
+ softirq (si)
+ steal (st)

## 系统调用

``` shell
# 用来看一个进程所用到的系统调用
$ strace -p 7477

# 用来查看某命令需要用到的系统调用
$ strace cat index.js

# 关于系统调用的统计信息
$ strace -p 7477 -c
```

## 内存

## 进程

``` shell
# 查看 122 PID 进程
$ ps 122

# 根据命令名(command)找到 PID
$ pgrep -a node
26464 node /code/node_modules/.bin/ts-node index.ts
30549 node server.js

# 根据命令名以及参数找到 PID
$ pgrep -af ts-node
26464 node /code/node_modules/.bin/ts-node index.ts

# 查看 122 PID 进程的信息
$ cat /proc/122/status
$ cat /proc/122/*

# 打印父进程树
# -s --show-parents: 显示父进程
# -a --arguments: 显示参数，如 echo hello 中 hello 为参数
$ pstree 122 -sap
```

## procfs

<http://man7.org/linux/man-pages/man5/proc.5.html>

## 进程的状态

+ D    uninterruptible sleep (usually IO)
+ R    running or runnable (on run queue)
+ S    interruptible sleep (waiting for an event to complete)
+ T    stopped by job control signal
+ t    stopped by debugger during the tracing
+ W    paging (not valid since the 2.6.xx kernel)
+ X    dead (should never be seen)
+ Z    defunct ("zombie") process, terminated but not reaped by its parent

``` shell
# 第二行可以统计进程的状态信息
$ top
...
Tasks: 214 total,   1 running, 210 sleeping,   0 stopped,   3 zombie
...
```

## 进程内存

``` shell
# 查看 2579 PID 的内存
# -O rss 代表附加 RSS 信息进行打印
$ ps -O rss 2579
 PID   RSS S TTY          TIME COMMAND
 2579 19876 S pts/10   00:00:03 node index.js
```

## 实时查看进程内存

``` shell
# 查看 23097 PID 的内存信息，每隔一秒打印一次
# -r: 查看进程的内存信息
# -s: 查看进程的 stack 信息
# -p: 指定 PID
# 1: 每间隔 1s 打印一次
# 5: 共打印 5 组
$ pidstat -sr -p 23097 1 5
Linux 3.10.0-693.2.2.el7.x86_64 (shanyue)       07/18/19        _x86_64_        (2 CPU)

18:56:07      UID       PID  minflt/s  majflt/s     VSZ    RSS   %MEM StkSize  StkRef  Command
18:56:08        0     23097      0.00      0.00  366424  95996   2.47    136      80  node

18:56:08      UID       PID  minflt/s  majflt/s     VSZ    RSS   %MEM StkSize  StkRef  Command
18:56:09        0     23097      0.00      0.00  366424  95996   2.47    136      80  node

18:56:09      UID       PID  minflt/s  majflt/s     VSZ    RSS   %MEM StkSize  StkRef  Command
18:56:10        0     23097      0.00      0.00  366424  95996   2.47    136      80  node

18:56:10      UID       PID  minflt/s  majflt/s     VSZ    RSS   %MEM StkSize  StkRef  Command
18:56:11        0     23097      0.00      0.00  366424  95996   2.47    136      80  node

18:56:11      UID       PID  minflt/s  majflt/s     VSZ    RSS   %MEM StkSize  StkRef  Command
18:56:12        0     23097      0.00      0.00  366424  95996   2.47    136      80  node

Average:      UID       PID  minflt/s  majflt/s     VSZ    RSS   %MEM StkSize  StkRef  Command
Average:        0     23097      0.00      0.00  366424  95996   2.47    136      80  node
```

## 页表与缺页异常

``` shell
$ pidstat -s -p 23097 1 5
```

## 标准输出到文件中

## 容器

## namespace PID -> global PID 映射

换一个问题就是，**如何找出 docker 容器中的 pid 在宿主机对应的 pid**

``` shell
# 容器环境
# 已知该进程 PID 为 122
# 在容器中找到对应 PID 的信息，在 /proc/$pid/sched 中包含宿主机的信息
$ cat /proc/122/sched
node (7477, #threads: 7)
...
```

``` shell
# 宿主机环境
# 7477 就是对应的 global PID，在宿主机中可以找到
# -p 代表指定 PID
# -f 代表打印更多信息
$ ps -fp 7477
UID        PID  PPID  C STIME TTY          TIME CMD
root      7477  7161  0 Jul10 ?        00:00:38 node index.js
```

## global PID -> namespace PID 映射

换一个问题就是， **已知宿主机的 PID，如何找出对应的容器**

``` shell
# 通过 docker inspect 查找到对应容器
$ docker ps -q | xargs docker inspect --format '{{.State.Pid}}, {{.ID}}' | grep 22932

# 通过 cgroupfs 找到对应容器
$ cat /etc/22932/cgroup
```

幸运地是有人已经在 stackoverflow 上总结出来了

+ [https://stackoverflow.com/questions/24406743/coreos-get-docker-container-name-by-pid](https://stackoverflow.com/questions/24406743/coreos-get-docker-container-name-by-pid)

## SWAP

``` shell
# 查找关于
$ vmstat -s
```

## 根据 inode 找到文件

## inode

``` shell
# -i: 打印 inode number
$ ls -lahi
```



## 网络吞吐量

+ 带宽: 指网络链路的最大传输速率
+ 吞吐量: 代表单位时间内成功传输的数据量，单位为 b/s (KB/s, MB/s)
+ PPS: pck/s (Packet Per Second)，以网络包为单位的传输速率

``` shell
# 查看网卡信息
$ ifconfig eth0

$ sar -n DEV 1 | grep eth0
#                IFACE   rxpck/s   txpck/s    rxkB/s    txkB/s   rxcmp/s   txcmp/s  rxmcst/s
16:34:37         eth0      8.00      2.00      0.69      1.90      0.00      0.00      0.00
16:34:38         eth0     39.00     27.00      2.91     38.11      0.00      0.00      0.00
16:34:39         eth0     13.00     11.00      0.92     13.97      0.00      0.00      0.00
16:34:40         eth0     16.00     16.00      1.21     20.86      0.00      0.00      0.00
16:34:41         eth0     17.00     17.00      1.51     15.27      0.00      0.00      0.00
Average:         eth0     18.60     14.60      1.45     18.02      0.00      0.00      0.00
```

## socket 状态

## socket 信息

推荐使用 `ss`，不过 `netstat` 仍需要掌握，在特定条件 (docker 中) 有可能没有 `ss` 命令。

``` shell
# -t TCP
# -a 所有状态
# -n 显示数字地址和端口号
# -p 显示 pid
$ netstat -tanp
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 127.0.0.11:35283        0.0.0.0:*               LISTEN      -
tcp        0      0 192.168.112.2:37344     172.18.0.1:6379         ESTABLISHED 78/node
tcp        0      0 :::80                   :::*                    LISTEN      78/node
```

+ `Recv-Q` 与 `Send-Q` 不为0时，表示网络包堆积，需要注意

## 协议信息

``` shell
# 展示对每个协议的统计信息
$ netstat -s

# 展示对每个协议的统计信息
$ ss -s
Total: 1468 (kernel 1480)
TCP:   613 (estab 270, closed 315, orphaned 0, synrecv 0, timewait 41/0), ports 0

Transport Total     IP        IPv6
*         1480      -         -
RAW       0         0         0
UDP       30        22        8
TCP       298       145       153
INET      328       167       161
FRAG      0         0         0

# 也可以这样统计 estab socket 的数量
$ netstat -tanp | grep ESTAB | wc -l

```

## TCP 连接数


