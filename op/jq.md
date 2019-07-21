---
title: jq 命令详解及示例
keywords: jq,json命令行工具,jq examples,json格式化工具
description: "jq 是一款命令行的 json 处理工具。类似于 lodash 一样，它可以对 json 做各种各样的处理，如 pick，get，filter，sort，map"
date: 2019-10-24 08:00
sidebarDepth: 3
tags:
  - linux

---

# jq 命令详解及示例

`jq` 是一款命令行的 `json` 处理工具。类似于 `lodash` 一样，它可以对 `json` 做各种各样的处理: `pick`，`get`，`filter`，`sort`，`map`...

由于 `jq` 本身比较简单，以下总结一些经常用到的示例。如果需要更多的细节，可以参考 [jq 官方文档](https://stedolan.github.io/jq/manual/)

先创建一个样例 `demo.jsonl`，`jsonl` 即每行都是一个 `json`，常用在日志格式中

```json
{"name": "shanyue", "age": 24, "friend": {"name": "shuifeng"}}
{"name": "shuifeng", "age": 25, "friend": {"name": "shanyue"}}
```

由于在后端 API 中会是以 `json` 的格式返回，再次创建一个样例 `demo.json`

```json
[
  {"name": "shanyue", "age": 24, "friend": {"name": "shuifeng"}},
  {"name": "shuifeng", "age": 25, "friend": {"name": "shanyue"}}
]
```

<!--more-->

+ 原文链接: [jq命令使用及示例](https://shanyue.tech/op/jq) · [github](https://github.com/shfshanyue/op-note/blob/master/jq.md)
+ 系列文章: [当我有台服务器时我做了什么](https://shanyue.tech/op) · [github](https://github.com/shfshanyue/op-note)

## jq 命令详解

`jq` 主要可以分作两部分，options 即选项，filter 即各种转换操作，类似于 `lodash` 的各种函数

```shell
jq [options...] filter [files]
```

> 强烈建议参考 [jq 官方手册](https://stedolan.github.io/jq/manual/)，命令示例一应俱全

### option

我仅常用以下几个选项

+ `-s`: 把读取的 `jsonl` 视作数组来处理 (如 group, sort 只能以数组作为输入)
+ `-c`: 不对输出的 `json` 做格式化，一行输出

### filter

filter 各种转换操作就很多了，如 `get`，`map`，`filter`，`map`，`pick`，`uniq`，`group` 等操作

+ `.`: 代表自身
+ `.a.b`: 相当于 `_.get(input, 'a.b')`
+ `select(bool)`: 相当于 `_.filter(boolFn)`
+ `map_values`: 相当于 `_.map`，不过 `jq` 无法单独操作 `key`
+ `sort`
+ `group_by`

> 更多 filter 参考 [jq 官方手册](https://stedolan.github.io/jq/manual/)

## jq examples

虽然 `jq` 的功能很强大，但平时使用最为频繁的也就以下几个示例。当然复杂的情形也会有，参考我过去一篇使用 `jq` 改 `ts` 类型错误的一篇文章: [sequelize 升级记录](https://shanyue.tech/post/sequelize-upgrade.html#_07-%E5%BD%92%E5%B9%B6%E4%B8%8E%E5%88%86%E7%B1%BB%EF%BC%8C%E9%80%90%E4%B8%AA%E5%87%BB%E7%A0%B4)

### json to jsonl

```shell
$ cat demo.json | jq '.[]'
{
  "name": "shanyue",
  "age": 24,
  "friend": {
    "name": "shuifeng"
  }
}
{
  "name": "shuifeng",
  "age": 25,
  "friend": {
    "name": "shanyue"
  }
}
```

### jsonl to json

```shell
# -s: 代表把 jsonl 组成数组处理
$ cat demo.jsonl | jq -s '.'
[
  {
    "name": "shanyue",
    "age": 24,
    "friend": {
      "name": "shuifeng"
    }
  },
  {
    "name": "shuifeng",
    "age": 25,
    "friend": {
      "name": "shanyue"
    }
  }
]
```

### . (_.get)

```shell
$ cat demo.jsonl | jq '.name'
"shanyue"
"shuifeng"
```

### {} (_.pick)

```shell
$ cat demo.jsonl| jq '{name, friendname: .friend.name}'
{
  "name": "shanyue",
  "friendname": "shuifeng"
}
{
  "name": "shuifeng",
  "friendname": "shanyue"
}
```

### select (_.filter)

```shell
$ cat demo.jsonl| jq 'select(.age > 24) | {name}'
{
  "name": "shuifeng"
}
```

### map_values (_.map)

```shell
$ cat demo.jsonl| jq '{age} | map_values(.+10)'
{
  "age": 34
}
{
  "age": 35
}
```

### sort_by (_.sortBy)

`sort_by` 需要先把 `jsonl` 转化为 `json` 才能进行

```shell
# 按照 age 降序排列
# -s: jsonl to json
# -.age: 降序
# .[]: json to jsonl
# {}: pick
$ cat demo.jsonl | jq -s '. | sort_by(-.age) | .[] | {name, age}'
{
  "name": "shuifeng",
  "age": 25
}
{
  "name": "shanyue",
  "age": 24
}

# 按照 age 升序排列
$ cat demo.jsonl | jq -s '. | sort_by(.age) | .[] | {name, age}'
{
  "name": "shanyue",
  "age": 24
}
{
  "name": "shuifeng",
  "age": 25
}
```
