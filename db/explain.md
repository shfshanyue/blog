# 你的数据库查询为什么这么慢：Explain 与 Query Plan

数据库中慢查询作为一个业务中的常见问题，屡见不鲜。

##

## 翻书

如何更快地检索数据？

翻更少页的书。

数据库查询如翻书，书的每一页就是数据库中的每条记录。

## 执行计划

数据库查询是如何执行的？

## 你的数据查询有多慢？

换一个问题是：

> [如何得知一条 SQL 执行的时间？]()

## 你的数据查询为什么慢: EXPLAIN

## 如何看懂 EXPLAIN

## 执行计划 (Query Plan)

执行计划的本质上是一棵树: Plan Nodes Tree，而 `explain` 输出的每一行是一个节点。

TODO: 图

``` sql
explain select * from student where id = 3
```

``` bash
+------------------------------------------------------------------------------+
| QUERY PLAN                                                                   |
|------------------------------------------------------------------------------|
| Index Scan using student_pkey on student  (cost=0.15..8.17 rows=1 width=142) |
|   Index Cond: (id = 3)                                                       |
+------------------------------------------------------------------------------+
EXPLAIN
Time: 0.031s
```

``` sql
explain (format json) select * from student where id = 3
```

``` json
[
  {
    "Plan": {
      "Node Type": "Index Scan",
      "Parallel Aware": false,
      "Scan Direction": "Forward",
      "Index Name": "student_pkey",
      "Relation Name": "student",
      "Alias": "student",
      "Startup Cost": 0.15,
      "Total Cost": 8.17,
      "Plan Rows": 1,
      "Plan Width": 142,
      "Index Cond": "(id = 3)"
    }
  }
]
```

我们先来看最直观，最能反映问题的几个字段：

1. `Total Cost`: **评估当前节点的总消耗 (而非时间)**，该值越大，SQL 执行的时间越长吗？不一定，此外还需要考虑到大量数据 IO 的问题
1. `Plan Rows`: **评估当前节点的返回行数**
1. `Plan Witdh`: **评估当前节点的返回行的平均字节数**，我们要查询的字段越少，该值越低，带宽消耗也更小

### 多节点的执行计划

### 优化

该 SQL 是否还能够优化

## Node Type

+ Index Scan
+ Seq Scan

### Index Scan

``` sql
select * from student where id = 
```

### Seq Scan

``` sql
postgres@db:school> explain select * from student
+------------------------------------------------------------+
| QUERY PLAN                                                 |
|------------------------------------------------------------|
| Seq Scan on student  (cost=0.00..14.80 rows=480 width=142) |
+------------------------------------------------------------+
EXPLAIN
Time: 0.022s
postgres@db:school> explain select * from student where age = 10000
+----------------------------------------------------------+
| QUERY PLAN                                               |
|----------------------------------------------------------|
| Seq Scan on student  (cost=0.00..16.00 rows=2 width=142) |
|   Filter: (age = 10000)                                  |
+----------------------------------------------------------+
EXPLAIN
Time: 0.031s
postgres@db:school>

```

## 🌰聚簇索引

``` sql
select * from student where id = 3
```

``` sql
postgres@db:school> explain select * from student where id = 3
+------------------------------------------------------------------------------+
| QUERY PLAN                                                                   |
|------------------------------------------------------------------------------|
| Index Scan using student_pkey on student  (cost=0.15..8.17 rows=1 width=142) |
|   Index Cond: (id = 3)                                                       |
+------------------------------------------------------------------------------+
EXPLAIN
Time: 0.031s
```

## BTree 疑思

```
explain select * from student where id > 10
```

## 参考

+ [](https://www.postgresql.org/docs/current/using-explain.html)