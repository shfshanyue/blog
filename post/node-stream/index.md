---
title: node 中 stream 的使用
no-date: 2019-08-06T09:39:20+08:00
thumbnail: ""
categories:
  - 前端
  - 后端
tags:
  - node
---

在学习 node 的 `stream` 之前，先抛出一个问题

> 如何找到所有 node 的进程？

我们一般会使用以下命令来解决这个问题

```shell
$ ps -ef | grep node
```

其中，它运行了 `ps` 和 `grep` 两个进程，它们之间通过 `|` 来衔接输入输出，而 `|` 就是管道 (`pipe`)。

## pipe (管道)

`pipe` 可以把源数据从一端导向另一端

## Readable

```javascript
const Readable = require('stream').Readable

const src = new Readable()
src.push('hello')
src.push('world')
src.push(null)

src.pipe(process.stdout)
```
