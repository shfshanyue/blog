---
title: spark 入门指南
date: 2019-05-04T20:55:33+08:00
categories:
  - 后端
tags:
  - spark
  - 大数据
---

## 搭建环境

在 <https://spark.apache.org/downloads.html> 页面选择适合版本的 `spark` 并进行下载。此处演示下载的是 2.4.1 版本

<!--more-->

```shell
curl -O http://mirrors.tuna.tsinghua.edu.cn/apache/spark/spark-2.4.1/spark-2.4.1-bin-hadoop2.7.tgz
tar -zxvf spark-2.4.1-bin-hadoop2.7.tgz
cd spark-2.4.1-bin-hadoop2.7
```

## Spark Shell

在当前路径下，使用命令 `bin/spark-shell` 进入 spark-shell

```shell
$ bin/spark-shell
19/04/15 15:38:15 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Using Spark's default log4j profile: org/apache/spark/log4j-defaults.properties
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
Spark context Web UI available at http://shanyue:4040
Spark context available as 'sc' (master = local[*], app id = local-1555313911802).
Spark session available as 'spark'.
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /___/ .__/\_,_/_/ /_/\_\   version 2.4.1
      /_/

Using Scala version 2.11.12 (OpenJDK 64-Bit Server VM, Java 1.8.0_201)
Type in expressions to have them evaluated.
Type :help for more information.

scala>
```

此时，有几个全局变量需要解释一下，可以直接在 `shell` 中使用

+ `sc` 指 `spark context`
+ `session` 指 `spark`

关于 `spark` 的基本语法，参考我的另一篇文章

## Dataset

`Dataset` 是 `spark` 中指对象的 Collection，一般用来 TODO。你可以通过 `Action` 计算它获取到一个结果值，也可以通过 `Transformation` 生成一个新的 `Dataset`。

`Dataset` 大多通过读取文件来创造，这里将演示基于文件的 `Dataset` 操作，而文件 `README.md` 的内容可以在这个地址进行查看 <https://github.com/apache/spark/blob/v2.4.1/README.md>

```scala
// 通过读取文件新建一个 Dataset
scala> val textFile = spark.read.textFile("README.md")
textFile: org.apache.spark.sql.Dataset[String] = [value: string]
```

另外 Dataset 既然是一种 `Collection`，也可以通过 `List` 进行创建

```scala
scala> spark.createDataset(List(1, 2, 3, 4, 5))
```

### Action

通过 `shell` 的返回结果，你可以了解 `org.apache.spark.sql.Dataset` 属于这个 Type，你会发现它挂在了 `sql` 下。

现在已经构建了一个 Dataset，但是我们现在对其中的数据不知所措，那如何查看其中内容和一些描述以及统计信息呢？通过 `Action` 可以对 `Dataset` 进行计算

```scala
// 查看 Dataset 中的内容
scala> textFile.show
+--------------------+
|               value|
+--------------------+
|      # Apache Spark|
|                    |
|Spark is a fast a...|
|high-level APIs i...|
|supports general ...|
|rich set of highe...|
|MLlib for machine...|
|and Spark Streami...|
...
only showing top 20 rows

// 如果你想要获取全部信息的话
scala> textFile.collect.foreach(println)

// 查看 Dataset 的一些描述信息
scala> textFile.describe().show()
+-------+--------------------+
|summary|               value|
+-------+--------------------+
|  count|                 105|
|   mean|                null|
| stddev|                null|
|    min|                    |
|    max|will run the Pi e...|
+-------+--------------------+
```

以下是 `Dataset` 的一些常规操作

```scala
// DataSet 中的items个数，在此即文件的行数
scala> textFile.count()
res5: Long = 105

// 取前四行，返回 Array
// 等同于 `textFile.take(4)`
scala> textFile.head(4)
res6: Array[String] = Array(# Apache Spark, "", Spark is a fast and general cluster computing system for Big Data. It provides, high-level APIs in Scala, Java, Python, and R, and an optimized engine that)

// 取前四行并且转化为 List
// 等同于 `textFile.take(4).toList`
scala> textFile.takeAsList(4)
res8: java.util.List[String] = [# Apache Spark, , Spark is a fast and general cluster computing system for Big Data. It provides, high-level APIs in Scala, Java, Python, and R, and an optimized engine that]
```

> 关于 `DataSet` 更多的 Action API 以及详解可以在官方文档查看 <http://spark.apache.org/docs/latest/api/scala/index.html#org.apache.spark.sql.Dataset>

### Transformation

`Transformation` 可以通过操作使一个 `Dataset` 转变为一个新的 `Dataset`，如 `map`，`filter` 与 `groupBy` 就是典型的 `Transformation`。

`map` 对 `Dataset` 中的每一项进行转化，并组合成一个新的 `Dataset`。

```scala
scala> textFile.map(line => line.split(" ").size)
res14: org.apache.spark.sql.Dataset[Int] = [value: int]
```

`filter` 对 `Dataset` 进行筛选

```scala
scala> textFile.filter(line => line.split(" ").size > 10).count()
res20: Long = 22
```

## RDD (resilient distributed dataset)

`RDD` 是可以并行计算的数据集，可以通过 `parallelize` 操作直接创建。也可以通过 `HDFS`，`HBase` 或者本地的文件系统进行创建。

```scala
scala> var data = Array(1, 2, 3, 4, 5)
data: Array[Int] = Array(1, 2, 3, 4, 5)

scala> var distData = sc.parallelize(data)
distData: org.apache.spark.rdd.RDD[Int] = ParallelCollectionRDD[0] at parallelize at <console>:26

scala> var lines = sc.textFile("./README.md")
lines: org.apache.spark.rdd.RDD[String] = ./README.md MapPartitionsRDD[6] at textFile at <console>:24
```

`RDD` 如同 `Dataset` 一样也有两种操作方式，`Transformation` 与 `Action`。

```scala
scala> lines.map(x => x.length)
res12: org.apache.spark.rdd.RDD[Int] = MapPartitionsRDD[8] at map at <console>:26

scala> lines.map(x => x.length).foreach(println)
14
0
78
75
73
74
56
42
...
```

### 闭包

为了更好地理解闭包和作用域，请思考下以下代码的输出

> 当然，scala 更鼓励声明式的写法，而非这样命名式的写法

```scala
var counter = 0
var rdd = sc.parallelize(Array(1, 2, 3, 4, 5))

rdd.foreach(x => counter += x)

println(counter)
```

`spark` 会把 RDD 的操作即以上的 `foreach` 分割为 `tasks`，而每个 `task` 被执行器执行。在执行器执行以前，会计算 `task` 的闭包

```scala
```

总之，你不要在局部方法内修改全局变量。

### K/V Pair

在 `spark` 中使用 `Tuple2` 作为存储 k/v 对的数据结构，`Tuple2` 的意思就是含有两个元素的 `tuple`。

```spark
var rdd = sc.parallelize(Array(1, 2, 3, 4, 5))
var pairs = rdd.map(x => (if (x > 3) 10 else 1, x))
pairs.foreach(println)

// 打印出来数据如下
// (1,1)
// (1,2)
// (1,3)
// (10,4)
// (10,5)

pairs.keys.foreach(println)
// 1
// 1
// 1
// 10
// 10
```

> 更多关于 Key/Value 的操作查看官方文档 <http://spark.apache.org/docs/latest/api/scala/index.html#org.apache.spark.rdd.PairRDDFunctions>

### 处理 JSON

## SQL

[spark sql data sources](http://spark.apache.org/docs/latest/sql-data-sources.html)

从这里你可以学到如何使用 `DataFrame` 处理 SQL 以及嵌套数据。

### DataFrame

我们把 `$sparkDir/examples/src/main/resources/people.json` 作为示例文件

> 查看文件的内容如下，严格来说不是合法的 json，并且以下内容必须一行为单位，每行是一个 JSON。严格来说，它的格式是 JSON Lines，参考文档 <http://jsonlines.org/>，是日志处理中常见的格式。

```json
{"name":"Michael"}
{"name":"Andy", "age":30}
{"name":"Justin", "age":19}
```

我们使用 `spark.read.json` 对它进行读入，示例会用以下 API 操作 `DataFrame`

+ `df.show`
+ `df.printSchema`
+ `df.select`

```scala
scala> val df = spark.read.json("examples/src/main/resources/people.json")
df: org.apache.spark.sql.DataFrame = [age: bigint, name: string]

scala> df.show
+----+-------+
| age|   name|
+----+-------+
|null|Michael|
|  30|   Andy|
|  19| Justin|
+----+-------+

// 打印 schema 信息
scala> df.printSchema
root
 |-- age: long (nullable = true)
 |-- name: string (nullable = true)

scala> df.select("name").show
+-------+
|   name|
+-------+
|Michael|
|   Andy|
| Justin|
+-------+

scala> df.select($"name", $"age" + 100).show()
+-------+-----------+
|   name|(age + 100)|
+-------+-----------+
|Michael|       null|
|   Andy|        130|
| Justin|        119|
+-------+-----------+

scala> df.filter($"age" > 21).show()
+---+----+
|age|name|
+---+----+
| 30|Andy|
+---+----+

// 把 df 作为一个 `global_temp` 的 sql table
scala> df.createGlobalTempView("people")
19/04/19 17:10:30 WARN ObjectStore: Version information not found in metastore. hive.metastore.schema.verification is not enabled so recording the schema version 1.2.0
19/04/19 17:10:31 WARN ObjectStore: Failed to get database default, returning NoSuchObjectException
19/04/19 17:10:32 WARN ObjectStore: Failed to get database global_temp, returning NoSuchObjectException

scala> spark.sql("SELECT count(*) FROM global_temp.people").show
+--------+
|count(1)|
+--------+
|       3|
+--------+

scala> spark.sql("SELECT * FROM global_temp.people").show
+----+-------+
| age|   name|
+----+-------+
|null|Michael|
|  30|   Andy|
|  19| Justin|
+----+-------+

```

## Structed Streaming

`Spark` 可以从 `Kafka` 等作为数据源，经流处理到 `HDFS` 或者数据库等。

### 



## 参考

+ <https://data-flair.training/blogs/apache-spark-sql-dataframe-tutorial/>
