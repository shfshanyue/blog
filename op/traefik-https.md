# 在 traefik 中为服务开通 https

`https` 已经成为一个现代网站的标配，以至于当一个网站没有 `https` 时，某些浏览器都会把它标识为不安全。而除了安全方面，`https` 对网站的SEO也影响很多，而对于某些新型的浏览器 API，也只有在 `https` 下才能使用。不管怎么说，`https` 也成为一个网站的刚需。

而当你使用了 `traefik` 作为反向代理时，你可以配置 `ACME` 自动为域名提供证书，只需几行即可解决问题。免费的证书，当然是通过 `Let's Encrypt` 来解决。

## ACME 配置

通过它可以很方便地自动签发证书并且自动续期，我们在 `traefik.toml` 中进行相关配置

``` toml
[certificatesResolvers.le.acme]
  email = "xianger94@qq.com"
  storage = "acme.json"

  [certificatesResolvers.le.acme.tlsChallenge]
```

其中，`storage` 指存放证书的位置

## Traefik 容器配置

在配置好 `traefik.toml` 配置完成后，我们需要修改 `traefik` 容器启动的相关配置

1. 暴露 443 端口
1. 挂载 acme.json，持久化证书

由于 `acme.json` 是一个文件，我们现在宿主机中创建它

``` bash
$ touch acme.json
$ docker-compose up
```

随后启动容器，配置文件如下

``` yaml
version: '3'

services:
  reverse-proxy:
    image: traefik:v2.0
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - ./traefik.toml:/etc/traefik/traefik.toml
      - ./acme.json:/acme.json
      - ./log:/log
      - /var/run/docker.sock:/var/run/docker.sock
    container_name: traefik
    env_file: .env
    labels:
      - "traefik.http.routers.api.rule=Host(`traefik.shanyue.local`)"
      - "traefik.http.routers.api.service=api@internal"
```

## 服务配置

如果你需要为你的服务提供 https 流量，只需要添加两行代码

``` yaml
labels:
  - traefik.http.routers.whoami.tls=true
  - traefik.http.routers.whoami.tls.certresolver=le
```

我们依然使用 `whoami` 做测试，`docker-compose.yaml` 文件内容如下

``` yaml
version: '3'

services:
  whoami:
    image: containous/whoami
    labels:
      - traefik.http.routers.whoami.rule=Host(`whoami.shanyue.tech`)
      - traefik.http.routers.whoami.tls=true
      - traefik.http.routers.whoami.tls.certresolver=le
    # environments:
    #   TMUX
    
networks:
  default:
    external:
      name: traefik_default
```

服务启动后，使用 `curl` 测试服务是否正常工作，我们可以看到 `X-Forwarded-Proto` 为 `https`，配置成功

``` bash
$ curl https://whoami.shanyue.tech
Hostname: c9c3cc850e2b
IP: 127.0.0.1
IP: 172.18.0.2
RemoteAddr: 172.18.0.3:35320
GET / HTTP/1.1
Host: whoami.shanyue.tech
User-Agent: curl/7.29.0
Accept: */*
Accept-Encoding: gzip
X-Forwarded-For: 59.110.159.217
X-Forwarded-Host: whoami.shanyue.tech
X-Forwarded-Port: 443
X-Forwarded-Proto: https
X-Forwarded-Server: 9d783174aca9
X-Real-Ip: 59.110.159.217
```
