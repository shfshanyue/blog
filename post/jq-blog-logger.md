---
title: "jq 以及分析 nginx 日志"
date: 2019-05-16T11:39:46+08:00
thumbnail: ""
categories:
  - 运维
  - 日志与报警
tags:
  - devops
---


`jq` 主要用来处理 json 数据，在学习 `jq` 之前，需要掌握一个基本术语，JSONL。

JSONL 即 JSON Lines，代表数据的每一行都是一个合法的 json，因格式简单易读，更适用于流数据，广泛应用在 `ELK` 以及 `spark` 中。

举个栗子，如以下数据就是 jsonl

```jsonl
{"id": 1}
{"id": 2}
{"id": 3}
```

而以下数据是 json

```json
[
  {"id": 1},
  {"id": 2},
  {"id": 3}
]
```

