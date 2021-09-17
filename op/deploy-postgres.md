---
title: 使用 docker-compose 快速部署 postgres
date: 2019-01-04 20:37

---

# 部署 postgres

`postgres` 是一个功能强大的开源对象关系型数据库系统，被业界誉为“最先进的开源数据库“。

`postgres` 不仅功能强大，而且免费开源，你可以在 github 上学习并研究它的源码: [postgres/postgres](https://github.com/postgres/postgres)。另外，它在数据类型，内置函数，事务的支持相比 `mysql` 都要好一些。

但我在个人服务器里选择 `postgres` 的终极原因是: 我们生产环境中大部分数据库都采用了 `postgres`。

关于 `mysql` 与 `postgres` 的优劣，可以参考知乎上的一个问题: [PostgreSQL 与 MySQL 相比，优势何在？](https://www.zhihu.com/question/20010554)。

## 部署

在部署之前，你需要对 `docker-compose` 以及 `traefik` 有所了解，可以参考我以前的文章:

+ [docker compose 简易入门](https://shanyue.tech/op/docker-compose.html)
+ [使用 traefik 做反向代理](https://shanyue.tech/op/traefik.html)

这里采用官方镜像 `postgres:12-alpine` 进行数据库的部署，之所以采用 `alpine` 作为基础镜像，源于它体积较小。

我们使用 `docker-compose` 进行数据库的部署， 如果你对它不了解，可以参考我以前写的系列文章 [个人服务器运维指南](https://github.com/shfshanyue/op-note)。

对于数据库的存储，我放置于当前目录 `./pg-data` 之下，方便迁移。关于 `docker-compose.yaml` 配置文件如下:

> 关于我个人服务器下所有服务的配置文件，均维护在我的 github 仓库 [shfshanyue/op-note:compose](https://github.com/shfshanyue/op-note/tree/master/compose) 中

``` yaml
version: '3'

services:
  db:
    image: postgres:12-alpine
    restart: always
    ports:
      - 5432:5432
    volumes:
      - ./pg-data:/var/lib/postgresql/data
    labels:
      - "traefik.http.routers.db.rule=Host(`db.shanyue.local`)"

# 使用已存在的 traefik 的 network
networks:
  default:
    external:
      name: traefik_default
```

`docker-compose up` 启动服务，数据库部署完成

``` bash
$ docker-compose up -d
```

## 连接数据库

使用 `docker-compose exec` 测试是否能够正常连接数据库，通过测试，我们已经正确部署并且连接上了数据库

``` bash
$ docker-compose exec db psql -U postgres
psql (12.1)
Type "help" for help.

postgres=#
```

在宿主机中可以通过 `docker-compose` 与 `psql` 来连接数据库，那如何在整个局域网集群中连接数据库呢？

## 使用 pgcli 连接数据库

如果把 `psql` 比作记事本，那么 `pgcli` 则是带有代码高亮功能的 IDE。在日常开发中，使用 `pgcli` 足以应付生产环境多个数据库的配置管理。

使用 `brew` 安装 `pgcli`:

``` bash
$ brew install pgcli
```

使用 `pgcli` 得以成功连接数据库:

``` bash
$ pgcli -h db.shanyue.local -U postgres
postgres@db:postgres> \d
+----------+--------+--------+---------+
| Schema   | Name   | Type   | Owner   |
|----------+--------+--------+---------|
+----------+--------+--------+---------+
SELECT 0
Time: 0.030s

```
