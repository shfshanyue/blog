---
title: kafka 从入门到入门
date: 2019-04-10T15:41:39+08:00
categories:
  - 后端
tags:
  - kafka
  - 大数据
---

最近工作中需要使用到 `Kafka`，基于 `mysql` 的 `bin log` 与 `postgres` 的 `WAL log` 把数据发布到 `Kafka`。`Kafka` 另外一大用途主要用作消息中间件，虽然没有在业务系统中使用它作为消息队列，但这也是一个令人心动的功能。趁此契机，从环境搭建，系统原理，到生产使用再系统过一遍 `Kafka`。

<!--more-->

## 术语

+ Stream

    先把它理解成数据。

+ Topic

    类似于数据库的一个表，数据流 record 的集合。对于它的每一条记录都有 key，value 和 timestamp，很像是时序数据库了

+ Publish

    发布，Producer 会产生数据到 Topics，这个过程就叫 Publish

+ Subscribe

    订阅，当 Producer 生产数据后，Consumer 会从 kafka 接收到数据，或者叫读取数据，这个过程叫 Subscribe

+ Producer

    数据的生产者，实时发送数据到 Topics。可以为各个数据库，或者各个应用的日志。

+ Consumer

    数据的消费者，用来读取数据，或者监听数据的产生做一些处理

+ broker

    `Kafka` 为分布式流处理平台，则它是由多个实例组成，每个实例称为 `broker`

## 用来做什么

一个工具可以用来做什么，是我们为什么要学习他的主要原因，另外了解它和同类产品比有什么优缺点，可以更好地根据自己的需求做出抉择。官网这么介绍 `Kafka`

> Apache Kafka® is a distributed streaming platform. 

在官网描述 `Kafka` 是一个分布式流处理(distributed streaming)平台，作为一个流处理的工具，它可以应用在一下几方面。

+ 消息队列
+ 流数据处理
+ 日志处理

> 参考 <http://kafka.apache.org/uses>

它有四个核心 API

+ Producer API
+ Consumer API
+ Streams API
+ Conector API

## 安装

CentOS

### 安装 java

kafka 依赖于 `java` 的环境，所以第一步先安装 JDK 和 JRE。

```shell
yum install java-1.8.0-openjdk
yum install java-1.8.0-openjdk-devel
```

### 安装 `Zookeeper` 与 `Kafka`

安装好 java 后按照以下命令安装和启动 `Kafka`。

`Kafka` 依赖于 `Zookeeper`，启动 `Kafka` 之前先启动 `Zookeeper`。这里启动一个单实例的 `Kafka`。

关于 `kafka` 和 `Zookeeper` 的下载地址，可以在国内的镜像源进行下载

<https://mirrors.tuna.tsinghua.edu.cn/apache>

```shell
$ curl -O http://mirrors.shu.edu.cn/apache/kafka/2.2.0/kafka_2.12-2.2.0.tgz

$ # 在国内可以使用以下镜像源
$ # curl -O https://mirrors.tuna.tsinghua.edu.cn/apache/kafka/2.2.0/kafka_2.12-2.2.0.tgz

$ tar -xzf kafka_2.12-2.2.0.tgz
$ cd kafka_2.12-2.2.0

# 以以下配置文件启动 Zookeeper
$ bin/zookeeper-server-start.sh config/zookeeper.properties
...
[2019-04-04 16:07:30,141] INFO binding to port 0.0.0.0/0.0.0.0:2181 (org.apache.zookeeper.server.NIOServerCnxnFactory)

# 以以下配置文件启动 Kafka
$ bin/kafka-server-start.sh config/server.properties
...
[2019-04-04 16:13:07,794] INFO [KafkaServer id=0] started (kafka.server.KafkaServer)
```

**启动成功后，`Zookeeper` 会占用 2181 端口号，而 `Kafka` 会占用 9092 端口号，对于这些特殊服务的端口号需要留意一下，在以下很多命令中需要指定端口号**

### 如何获取版本号

如果是自己搭建的 `Kafka`，自然可以很容易地通过下载包的命名知道版本号。如果是别人搭建的，那又如何获取版本号？

你可以先试一试，`kafka-topics.sh --version`。

```shell
$ ./kafka-topics.sh --version
2.2.0 (Commit:05fcfde8f69b0349)
```

如果不成功，那说明版本在 2.0 一下，你只能通过安装文件夹下文件的命名用肉眼来辨别了

**如果你在 `kafka_install_dir/libs` 下发现了文件 `kafka-clients-2.2.0.jar`，那么它的版本号就是 2.2.0。**

## Hello, world | 一个简单的示例

先开始一个最简单的示例，一方在终端发布数据，一方在终端订阅数据。在这之前，先了解下什么是 Topic

### Topic 简介

上边术语中提到过，Topic 是数据流的集合，类似于 sql 中的 table，并由 record 组成。

![topic](https://shanyue.tech/)

如上图，由于 kafka 是分布式的，每个 Topic 由分区日志组成，每个分区日志由 **不可变的，顺序的** record 组成。Consumer 会标记每个分区日志中已处理的 record 位置，即 offset，使用 offset 可以唯一标志每个 record。

多个 Consumer 并不会对已处理数据丢失，数据永久存储在 kafka 上，除非过了 kafka 设置的过期时间。

### 创建 Topic

```shell
# 创建一个 Topic: test
$ bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic test
Created topic test.

# 列出 Topic 列表
$ bin/kafka-topics.sh --list --bootstrap-server localhost:9092
test
```

### 生产者(Producer)/消费者(Consumer)

运行以下命令，从终端生产数据发布消息

```shell
$ bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test
hello
world
```

打开消费者，会从终端看到订阅的数据

```shell
$ bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
hello
world
```

这样，一个简单版的 kafka 的 Demo 完成了。

不过，此时他有两个问题

1. 单节点
1. 数据来源只有终端

接下来看如何处理这两方面问题

## 多 `Broker` 集群


```shell
bin/kafka-server-start.sh config/server.properties
```

从以上单节点的示例中，我们看到它会读取 `config/server.properties` 作为配置文件。

> 默默吐槽下配置文件的 DSL 太多了

先复制出来两份文件，修改下部分属性，作为三个 broker 的配置文件进行启动，就可以有三个 broker 了

```shell
cp config/server.properties config/server-1.properties
cp config/server.properties config/server-2.properties
```

以下几项是需要修改的配置

+ `broker.id` 代表 broker 的id，全局唯一
+ `listeners` 启动时的端口号，默认是 9092
+ `log.dirs` 日志文件目录

以下是修改后的配置文件内容

```shell
$ cat config/server-1.properties
...
broker.id=1
listeners=PLAINTEXT://:9093
log.dirs=/tmp/kafka-logs-1
...
$ cat config/server-2.properties
...
broker.id=2
listeners=PLAINTEXT://:9094
log.dirs=/tmp/kafka-logs-2
...
```

接下来启动多个 broker

```shell
bin/kafka-server-start.sh config/server-1.properties &
bin/kafka-server-start.sh config/server-2.properties &
```

### 创建一个多 broker 的 Topic

`--replication-facor` 指定备份数目，现在有三个 broker，因此指定三个备份。

现在有了三个 broker 的地址，现在创建 Topic 时指定 `Zookeeper` 地址。

```shell
$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 3 --partitions 1 --topic todo
Error while executing topic command : Replication factor: 3 larger than available brokers: 2.
[2019-04-11 15:27:28,265] ERROR org.apache.kafka.common.errors.InvalidReplicationFactorException: Replication factor: 3 larger than available brokers: 2.
 (kafka.admin.TopicCommand$)
```

原来是由于我的机器配置太差，内存不足以支持三个副本运行。

```shell
$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 2 --partitions 1 --topic todo
Created topic todo.
```

那这时候又引进来了一个新的问题，如何查看目前集群中的 broker 个数

### 如何查看目前的 broker 个数

TODO

### 查看 Topic 信息

当为 Topic 使用了多个备份时，可以使用 `--describe` 查看信息

```shell
$ bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic todo
Topic:todo    PartitionCount:1        ReplicationFactor:2     Configs:segment.bytes=1073741824
        Topic: todo2    Partition: 0    Leader: 0       Replicas: 0,1   Isr: 0,1
```

+ leader 是负责读写功能的节点
+ replicas 是负责备份的节点
+ isr 是目前备份节点还活着的节点，是 replicas 的子集

### 生产者/消费者

```shell
$ bin/kafka-console-producer.sh --broker-list localhost:9092 --topic todo
hello
world
```

```shell
$ bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --from-beginning --topic todo
hello
world
```

## 如何读取数据

在 `mysql` 或者 `postgres` 中可以使用命令行的方式进入数据库，使用 `select` 来读取数据库表中的数据。那么如何在 `kafka` 中读取 `Topic` 的数据呢?

答案是通过 `Consumer API` 来读取数据。

> 那可以使用命令行式的交互工具读取数据吗？
> 恩，好像不能。

### Consumer

以上无论是单节点还是多节点，我们都是用 Consumer 从终端中读取数据

```shell
bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group my-group
```

## 从文件中读取和写入数据

使用 `Connect API` 控制数据从文件中读写

TODO

## 可靠性

At most once——消息可能会丢失但绝不重传。
At least once——消息可以重传但绝不丢失。
Exactly once——这正是人们想要的, 每一条消息只被传递一次.

## Kafka Cheat Sheets

### 查看版本号

```shell
$ bin/kafka-topics.sh --version
2.2.0
```

### 启动 zookeeper

`config/zookeeper.properties` 是 zookeeper 的配置文件

```shell
bin/zookeeper-server-start.sh config/zookeeper.properties
```

### 启动 Kafka

`config/server.properties` 是 Kafka 的配置文件

```shell
bin/kafka-server-start.sh config/server.properties
```

### 创建一个 Topic

创建命名为 test 的 Topic

+ `--create` 创建新的 Topic
+ `--partitions` 该 Topic 指定的 partition 个数
+ `--replication-factor` 该 Topic 下的 partition 的备份数目
+ `--topic` 指定的 topic 名称

```shell
bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic test
```

### 查看 Topic 列表

`__consumer_offsets` 为 `Kafka` 自动生成的，代表每个 consumer 的 offset。

```shell
$ bin/kafka-topics.sh --list --bootstrap-server localhost:9092
__consumer_offsets
test
```

### 发布 Topic 数据  (console-producer)

以下是使用 `console-producer` 发布数据到 `test`

+ `--broker-list` 指定broker的地址，此字段必须

```shell
$ bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test
hello
world
```

### 订阅 Topic 数据  (console-consumer)

以下是使用 `console-consumer` 读取 `test` 中的数据

```shell
$ bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
hello
world
```

### 查看 Consumer Group 列表

```shell
$ bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list
console-consumer-54112
```

### 查看 Consumer Group 中的 Consumer 信息

可以查看组内的每个 Consumer 的 id 以及 offset

```shell
$ bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group console-consumer-54112
TOPIC           PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             CONSUMER-ID                                     HOST            CLIENT-ID
todo            0          -               11              -               consumer-1-ab662bd3-60b3-4e97-829d-84f27a799f0d /192.168.1.214  consumer-1
```
