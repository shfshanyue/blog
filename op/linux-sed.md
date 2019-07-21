---
title: sed 命令详解及示例
keywords: sed examples,mac中的sed,sed删除文件,sed替换文件
description: sed 是一个用来筛选与转换文本内容的工具。一般用来批量替换，删除某行文件。如果想在 mac 中使用 sed，请使用 gsed 代替，不然会被坑
date: 2019-10-18 22:00
sidebarDepth: 3
tags:
  - linux

---

# sed 命令详解及示例

`sed` 是一个用来筛选与转换文本内容的工具。一般用来批量替换，删除某行文件

<!--more-->

+ 原文链接: [sed命令使用及示例](https://shanyue.tech/op/linux-sed) · [github](https://github.com/shfshanyue/op-note/blob/master/linux-sed.md)
+ 系列文章: [当我有台服务器时我做了什么](https://shanyue.tech/op) · [github](https://github.com/shfshanyue/op-note)

## sed 命令详解

每个 sed 命令，基本可以由选项，匹配与对应的操作来完成

```shell
# 打印文件第三行到第五行
# -n: 选项，代表打印
# 3-5: 匹配，代表第三行到第五行
# p: 操作，代表打印
$ sed -n '3,5p' file

# 删除文件第二行
# -i: 选项，代表直接替换文件
# 2: 匹配，代表第二行
# d: 操作，代表删除
$ sed -i '2d' file
```

### 关键选项

+ `-n`: 打印匹配内容行
+ `-i`: 直接替换文本内容
+ `-f`: 指定 sed 脚本文件，包含一系列 sed 命令

### 匹配

+ `/reg/`: 匹配正则
+ `3`: 数字代表第几行
+ `$`: 最后一行
+ `1,3`: 第一行到第三行
+ `1,+3`: 第一行，并再往下打印三行 (打印第一行到第四行)
+ `1, /reg/` 第一行，并到匹配字符串行

### 操作

+ `a`: append, 下一行插入内容
+ `i`: insert, 上一行插入内容
+ `p`: print，打印，通常用来打印文件某几行，通常与 `-n` 一起用
+ `s`: replace，替换，与 vim 一致

## sed examples

### 查看手册

```
$ man sed
```

### 打印特定行

`p` 指打印

```shell
# 1p 指打印第一行
$ ps -ef | sed -n 1p
UID        PID  PPID  C STIME TTY          TIME CMD


# 2,5p 指打印第2-5行
$ ps -ef | sed -n 2,5p
root         1     0  0 Sep29 ?        00:03:42 /usr/lib/systemd/systemd --system --deserialize 15
root         2     0  0 Sep29 ?        00:00:00 [kthreadd]
root         3     2  0 Sep29 ?        00:00:51 [ksoftirqd/0]
root         5     2  0 Sep29 ?        00:00:00 [kworker/0:0H]
```

### 打印最后一行

`$` 指最后一行

> 注意需要使用单引号

```shell
$ ps -ef | sed -n '$p'
```

### 删除特定行

`d` 指删除

```shell
$ cat hello.txt
hello, one
hello, two
hello, three

# 删除第三行内容
$ sed '3d' hello.txt
hello, one
hello, two
```

### 过滤字符串

与 `grep` 类似，不过 `grep` 可以高亮关键词

```shell
$ ps -ef | sed -n /ssh/p
root      1188     1  0 Sep29 ?        00:00:00 /usr/sbin/sshd -D
root      9291  1188  0 20:00 ?        00:00:00 sshd: root@pts/0
root      9687  1188  0 20:02 ?        00:00:00 sshd: root@pts/2
root     11502  9689  0 20:08 pts/2    00:00:00 sed -n /ssh/p
root     14766     1  0 Sep30 ?        00:00:00 ssh-agent -s

$ ps -ef | grep ssh
root      1188     1  0 Sep29 ?        00:00:00 /usr/sbin/sshd -D
root      9291  1188  0 20:00 ?        00:00:00 sshd: root@pts/0
root      9687  1188  0 20:02 ?        00:00:00 sshd: root@pts/2
root     12200  9689  0 20:10 pts/2    00:00:00 grep --color=auto ssh
root     14766     1  0 Sep30 ?        00:00:00 ssh-agent -s
```

### 删除匹配字符串的行

```shell
$ cat hello.txt
hello, one
hello, two
hello, three

$ sed /one/d hello.txt
hello, two
hello, three
```

### 替换内容

`s` 代表替换，与 vim 类似

```shell
$ echo hello | sed s/hello/world/
world
```

### 添加内容

`a` 与 `i` 代表在新一行添加内容，与 vim 类似

```shell
# i 指定前一行
# a 指定后一行
# -e 指定脚本
$ echo hello | sed -e '/hello/i hello insert' -e '/hello/a hello append'
hello insert
hello
hello append
```

### 替换文件内容

```shell
$ cat hello.txt
hello, world
hello, world
hello, world

# 把 hello 替换成 world
$ sed -i s/hello/world/g hello.txt

$ cat hello.txt
world, world
world, world
world, world
```
## 注意事项

如果想在 mac 中使用 `sed`，请使用 `gsed` 替代，不然在正则或者某些格式上扩展不全。

使用 `brew install gnu-sed` 安装

```shell
$ echo "hello" | sed "s/\bhello\b/world/g"
hello
$ brew install gnu-sed
$ echo "hello" | gsed "s/\bhello\b/world/g"
world
```

## 参考

+ [Linux Sed Command](https://www.computerhope.com/unix/used.htm)

