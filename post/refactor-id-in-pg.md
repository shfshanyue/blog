---
title: 在 pg 中重设用户表的 ID
date: 2019-06-16T20:02:20+08:00
thumbnail: ""
categories:
  - 后端
tags:
  - 数据库
  - postgres
---

`GET /users/:ID` 是一个非常典型的 REST API。最近在浏览我的应用时，经常会有

```shell
> GET /users/3 HTTP/1.1
> Host: shanyue.tech
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 404 Not Found
...
```

而我的用户表的 ID 采用了整型自增的数据类型，为了使我的网站的用户数看起来不太寒碜，我绝对把我的用户 id 拉长一些！

<!--more-->

> 我的数据库采用 postgres

本文链接: <https://shanyue.tech/post/refactor-id-in-pg/>

## 设置外键，同步更新

**对所有用户用户表 ID 的关联表设置外键，并且设置 `on update cascade`，使之当用户表 ID 发生变化时，关联表的 user_id 可以同步更新**

```sql
alter table todo add constraint todo_user_id_fkey foreign key (user_id) references users(id) on update cascade
```

## 迁移旧数据

把所有用户的 ID 放大16倍，并且添加一个 10086 的基数。有一种拉面的既视感..

> 注意以下第一条 SQL 有问题

```sql
-- update users set id = id * 16 + (random() * 16)::integer + 10086
update users set id = id * 16 + ceil(random() * 15) + 10086
```

如果以上语句没有报错，那就说明用户量实在是太少了，如果数据量较多会发生主键冲突。

采用负负得正的方法避免主键冲突

```sql
update users set id = id * -16 - ceil(random() * 15) + 10086
update users set id = -id
```

## 设置 Sequence

当旧有数据清理完毕，新增数据也采用自增 16 的方式，这里需要熟悉 postgres 中 `Sequence` 的用户，见最后参考

```sql
> select currval('users_id_seq')
currval
16
> alter SEQUENCE users_id_seq INCREMENT by 16
> select max(id) from users
max
20000
> select setval('users_id_seq', 20000)

```

## why not uuid

因为它太长了，而我的用户数又太少，它的优点我不但吸取不到，还经常会面对一串字符的茫然...

## 参考

+ [ALTER SEQUENCE](https://www.postgresql.org/docs/current/sql-altersequence.html)
+ [Sequence Manipulation Functions](https://www.postgresql.org/docs/current/functions-sequence.html)

<hr/>

欢迎关注我的公众号**山月行**，在这里记录着我的技术成长，欢迎交流

![欢迎关注公众号山月行，在这里记录我的技术成长，欢迎交流](https://shanyue.tech/qrcode.jpg)
