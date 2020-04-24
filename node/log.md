# Node 中如何更好地打日志

在服务器端应用中，完善及结构化的日志不仅可以更好地帮助定位问题及复现，也能够通过日志发现性能问题的端倪，甚至能够帮忙用来解决线上 CPU 及内存过高的问题。

## 日志类型

+ 数据库日志
+ 请求响应日志
+ 异常

+ redis
+ 消息队列
+ 关键业务逻辑

## 日志结构化

对于

1. 结构化的
1. 可检索的

{
  "timestamp": "2020-04-24T04:50:57.651Z",
}

{
  "server_name": ""
}

### server_name

现已有相当多公司的服务器应用使用 `kubernetes` 进行编排。

`Deployment`，`ReplicaSet` 以及 `Git Hash`

``` bash
$ hostname
shanyue-production-69d9884864-vt22t
```

## 请求及响应日志

## 数据库日志

## 过滤掉无用日志

+ PING
+ OPTIONS

