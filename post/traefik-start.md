# Traefik 快速指南

> 本文章介绍的是 traefik V1，很可能已不适用

Traefik 与 nginx 一样，是一款反向代理的工具，至于使用他原因基于以下几点

+ 漂亮的 dashboard 界面
+ 可基于容器 label 进行配置
+ 新添服务简单，不用像 nginx 一样复杂配置，并且不用频繁重启
+ 对 prometheus 和 k8s 的集成
+ 尝试一下...

接下来讲一下它的基本功能以及文件配置

## 安装

下载二进制文件，指定配置文件，直接执行可以启动。

```shell
./traefik -c traefik.toml
```

当然，你也可以通过 docker 启动，参考 [Traefik Get Started](https://docs.traefik.io/)。

另外，如果需要使用 docker 启动，需要所有的服务都在一个 network 中，或者设置 traefik 的 network 为 host。

启动成功后，可以访问 `localhost:8080` 访问 Dashboard 页面。

### 问题

+ 每当有配置改动需要重启时，只能杀了进程，然后启动，导致服务有短暂的暂停
  + 补充一下，每当使用 docker 新添一个服务时，不需要更改配置，或者更改部分配置时，如 file provider，traefik 会监听配置文件变化并自动重启。但是需要修改 https 的证书或者日志的路径时，需要手动重启。所以需要手动重启的时候并不是很多。
+ 当配置文件修改后，会有语法错误，无法向 `nginx -t` 一样检查是否配置文件有问题

## 日志

```toml
[accessLog]

# Sets the file path for the access log. If not specified, stdout will be used.
# Intermediate directories are created if necessary.
#
# Optional
# Default: os.Stdout
#
filePath = "./traefik-access.json"

# Format is either "json" or "common".
#
# Optional
# Default: "common"
#
format = "json"
```

日志文件配置为 `json` 格式，方便调试。同时，强烈推荐 [jq](https://github.com/stedolan/jq)，一款 linux 下解析 json 的工具。

以下是两个常用的命令，统计某个站点的请求以及响应时间。不过最好建议有专门的日志系统去处理，可以获取更完善的，更定制化的信息。另外，traefik 无法查看请求的 body。

```shell
# 筛选特定站点的请求
cat traefik-access.json | jq 'select(.["RequestHost"] == "shici.xiange.tech") | {RequestPath, RequestHost, DownstreamStatus, "request_User-Agent", OriginDuration}'


# 筛选大于 300ms 的接口
cat traefik-access.json | jq 'select(.["RequestHost"] == "shici.xiange.tech" and .OriginDuration > 300000000) | {RequestPath, RequestHost, DownstreamStatus,
"request_User-Agent", OriginDuration, DownstreamContentSize}'
```

## prometheus + grafana

`jq` 虽然可以分析日志，但是适合做日志的统计以及更细化的分析。

[Prometheus](https://prometheus.io/) 作为时序数据库，可以用来监控 traefik 的日志，支持更加灵活的查询，报警以及可视化。traefik 默认设置 prometheus 作为日志收集工具。另外可以使用 grafana 做为 prometheus 的可视化工具。

### 某个服务的平均响应时间

![Screencast One](https://raw.githubusercontent.com/shfshanyue/blog/master/Articles/Traefik/graf.png)

PromQL 为
```
sum(traefik_backend_request_duration_seconds_sum{backend="$backend"}) / sum(traefik_backend_requests_total{backend="$backend"}) * 1000
```

### 某个服务响应时长大于 300ms 的请求的个数

TODO

### 统计请求数大于 10000 的服务

TODO

## entryPoint

### http

http 配置在 `entryPoints` 中，暴露出80端口。开启 `gzip` 压缩，使用 `compress = true` 来配置。

```toml
[entryPoints]
    [entryPoints.http]
    address = ":80"
    compress = true

    # 如果配置了此项，会使用 307 跳转到 https 
    [entryPoints.http.redirect]
    entryPoint = "https"
```

考虑到隐私以及安全，不对外公开的服务可以配置 `Basic Auth`，`Digest Auth` 或者 `WhiteList`，或者直接搭建 VPN，在内网内进行访问。如在我服务器上 `xiange.tech` 对外公开，`xiange.me` 只能通过VPN访问。

更多文档查看 [Traefik entrypoints](https://docs.traefik.io/configuration/entrypoints/)。

### https

使用 `Let's Encrypt` 安装证书后，在 `entryPoints.https.tls.certificats` 中指定证书位置。

```toml
[entryPoints]
    [entryPoints.https]
    address = ":443"
    compress = true

        [[entryPoints.https.tls.certificates]]
            certFile = "/etc/letsencrypt/live/xiange.tech/fullchain.pem"
            keyFile = "/etc/letsencrypt/live/xiange.tech/privkey.pem"
```

另外，traefik 默认开启 http2。

### other

另外，如果需要暴露其它的端口出去，如 consul 的 8500，类似于 nginx 的 listen 指令。

可以设置

```toml
[entryPoints]
    [entryPoints.consul]
    address = ":8500"
```

## Docker

traefik 会监听 `docker.sock`，根据容器的 label 进行配置。容器的端口号需要暴露出来，但是不需要映射到 Host。因为 traefik 可以通过 `docker.sock` 找到 container 的 IP 地址以及端口号，无需使用 `docker-proxy` 转发到 Host。

```yaml
version: '3'
services:
  frontend:
    image: your-frontend-server-image
    labels:
      - "traefik.frontend.rule=Host:frontend.xiange.tech"

  api:
    image: your-api-server-image
    expose: 80
    labels:
      # 同域配置， /api 走server
      - "traefik.frontend.rule=Host:frontend.xiange.tech;PathPrefix:/api"
```

### 如何给一个服务配置多个域名

```yaml
labels:
  - "traefik.prod.frontend.rule=Host:whoami.xiange.tech"
  - "traefik.another.frontend.rule=Host:who.xiange.tech"
  - "traefik.dev.frontend.rule=Host:whoami.xiange.me"
```

### 如何把前端和后端配置在统一域名

```yaml
services:
  frontend:
    image: your-frontend-server-image
    labels:
      - "traefik.frontend.rule=Host:frontend.xiange.tech"

  api:
    image: your-api-server-image
    expose: 80
    labels:
      - "traefik.frontend.rule=Host:frontend.xiange.tech;PathPrefix:/api"
```

### 部署时，如果项目代码有更新，如何当新服务 start 后，再去 drop 掉旧服务

TODO

## 负载均衡

如果使用docker，对一个容器进行扩展后，traefik 会自动做负载均衡，而 nginx 需要手动干预。

```yaml
version: '3'
services:
  whoami:
    image: emilevauge/whoami
    labels:
      - "traefik.frontend.rule=Host:whoami.xiange.tech"
```

手动扩展为3个实例，可以自动实现负载均衡。实现效果可以直接访问 [whoami.xiange.tech](https://whoami.xiange.tech)，每次通过 WRR 策略分配到不同的容器处理，可以通过 Hostname 和 IP 字段看出。

```
docker-compose up whoami=3
```

## 手动配置

当然，以上反向代理配置都是基于 docker，那如何像 nginx 一样配置呢。如把 `consul.xiange.me` 转发到 8500 这个端口。可以利用 traefik 的 file provider。

```toml
[file]
    [backends]
        # consul 是服务的名字，也可以叫张三，也可以叫李四
        [backends.consul]
            [backends.consul.servers]
                [backends.consul.servers.website]
                url = "http://0.0.0.0:8500"
                weight = 1

    [frontends]
        [frontends.consul]
        entryPoints = ["http"]
        backend = "consul"
            [frontends.consul.routes]
                # website 是路由的名字，也可以叫阿猫，也可以叫阿狗
                [frontends.consul.routes.website]
                rule = "Host:consul.xiange.me"

                # 可以配置多个域名
                [frontends.consul.routes.website2]
                rule = "Host:config.xiange.me"
```
