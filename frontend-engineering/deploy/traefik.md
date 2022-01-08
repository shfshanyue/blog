# 服务编排: 服务发现与 Treafik 网关搭建

假设你在服务器中，现在维护了 N 个容器，每个容器包含一个服务。

但好像，除了使用容器启动服务外，和传统方式并无二致。

对，差了一个服务的编排功能。

比如

1. 我使用 docker 跑了 N 个服务，我怎么了解所有的服务以及他们的状态呢？
1. 我使用 docker 新跑了一个服务，如何让它被其它服务所感知或直接被互联网所访问呢？

这就需要一个基于服务发现的网关建设: traefik

## traefik 搭建

[traefik](https://github.com/traefik/traefik) 目前在 Github 拥有 36K 星星，可以放心使用。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-08/clipboard-0525.255635.webp)

``` yaml
version: '3'

services:
  traefik:
    image: traefik:v2.5
    command: --api.insecure=true --providers.docker
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

使用 `docker-compose up` 启动 traefik，此时会默认新建一个 `traefik_network` 的网络。这个网络名称很重要，要记住。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-08/clipboard-5259.7e350b.webp)

## 启动一个任意的服务

启动一个 whoami 的简易版服务

``` yaml
version: '3'

services:
  # 改镜像会暴露出自身的 `header` 信息
  whoami:
    image: containous/whoami
    labels:
      # 设置Host 为 whoami.docker.localhost 进行域名访问
      - "traefik.http.routers.whoami.rule=Host(`whoami.shanyue.local`)"

# 使用已存在的 traefik 的 network
networks:
  default:
    external:
      name: traefik_default
```

那 `whoami` 这个 `http` 服务做了什么事情呢

1. 暴露了一个 `http` 服务，主要提供一些 `header` 以及 `ip` 信息
1. 配置了容器的 `labels`，设置该服务的 `Host` 为 `whoami.shanyue.local`，给 `traefik` 提供标记

此时我们可以通过主机名 `whoami.docker.localhost` 来访问 `whoami` 服务，我们使用 `curl` 做测试

``` bash
$ curl -H Host:whoami.shanyue.local http://127.0.0.1
Hostname: f4b29ed568da
IP: 127.0.0.1
IP: 172.20.0.3
RemoteAddr: 172.20.0.2:42356
GET / HTTP/1.1
Host: whoami.shanyue.local
User-Agent: curl/7.29.0
Accept: */*
Accept-Encoding: gzip
X-Forwarded-For: 172.20.0.1
X-Forwarded-Host: whoami.shanyue.local
X-Forwarded-Port: 80
X-Forwarded-Proto: http
X-Forwarded-Server: 9f108517e2ca
X-Real-Ip: 172.20.0.1
```

服务正常访问。

**此时如果把 `Host` 配置为自己的域名，则已经可以使用自己的域名来提供服务。**

由于本系列文章重点在于部署，因此对于 Traefik 将不再过多研究

1. 如何配置 https
1. 如何配置 Dashboard