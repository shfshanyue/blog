---
title: 关于 canal 的安装以及配置
date: 2019-04-12T14:24:52+08:00
categories:
  - 前端
  - 后端
tags:
  - java
  - 大数据
---

最近在公司的测试环境搭了一套 canal 用以同步 mysql 的 binlog。环境搭建步骤如下，和官方文档无异，权作记录

<!--more-->

## 安装

在 <https://github.com/alibaba/canal/releases> 中选择最新的安装包进行下载

```shell
# -L 表示 follow redirect
curl -OL https://github.com/alibaba/canal/releases/download/canal-1.1.3/canal.deployer-1.1.3.tar.gz

mkdir -p /usr/local/canal

# -C 表示解压路径
tar -zxvf canal.deployer-1.1.3.tar.gz -C /usr/local/canal
```

## 配置

修改数据库以及如何与Topic对应的配置

```shell
$ cd /usr/local/canal/
$ vim conf/example/instance.properties
...
canal.instance.master.address=192.168.1.20:3306
canal.instance.dbUsername = canal
canal.instance.dbPassword = canal

canal.mq.topic=example
canal.mq.dynamicTopic=mytest,.*,mytest.user,mytest\\..*,.*\\..*
```

修改 kafka 的配置

```shell
$ vim /usr/local/canal/conf/canal.properties
...
canal.serverMode = kafka
canal.mq.servers = 127.0.0.1:9092
```

更多详细内容参考官方文档 [Canal Kafka RocketMQ QuickStart](https://github.com/alibaba/canal/wiki/Canal-Kafka-RocketMQ-QuickStart)
