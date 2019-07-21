---
title: 使用 docker-compose 部署 postgres
date: 2019-01-04 20:37

---

# 部署 redis

## 部署

使用官方镜像 `redis:5-alpine` 进行部署

`docker-compose.yaml` 配置文件如下，由于我们仅仅把 `redis` 作为一个缓存服务，因此不做持久化的处理

> 关于配置文件，我维护在我的 github 仓库 [shfshanyue/op-note:compose](https://github.com/shfshanyue/op-note/tree/master/compose) 中

``` yaml
version: '3'

services:
  redis:
    image: redis:5-alpine
    restart: always
    ports:
      - 6379:6379
    labels:
      - traefik.http.routers.db.rule=Host(`redis.shanyue.local`)

# 使用已存在的 traefik 的 network
networks:
  default:
    external:
      name: traefik_default
```

`docker-compose up` 启动服务

``` bash
$ docker-compose up -d
```

## 连接 Redis

使用 `docker-compose exec` 测试是否能够正常连接redis

``` bash
$ docker-compose exec redis redis-cli
```

连接正常
