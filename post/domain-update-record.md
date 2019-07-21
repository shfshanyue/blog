# 博客域名更换记录以及衍生问题解决方案

拖延了半年后，我终于在最近把我的域名 <https://shanyue.tech> 通过了备案，趁此对我的域名进行更换: 由 <https://blog.xiange.tech> 更换到了 <https://shanyue.tech>

如果刚开始就使用新域名，倒是很简单。但是更换域名就需要做一些额外的琐碎的东西了，如 https，反向代理，SEO需求等等，记录一下

<!--more-->

## https

在制作证书时在 domains 中添加新域名

```shell
certbot -d shanyue.tech -d xiange.tech -d *.shanyue.tech -d *.xiange.tech ...
```

## reverse proxy

在反向代理中使用新域名代替旧有域名，以下是 traefik 在 docker 的 compose file 的示例，同时需要保留新老域名

```yaml
version: "3"
services:
  blog:
    build:
      context: .
    restart: always
    labels:
      - "traefik.old.frontend.rule=Host:blog.xiange.tech"
      - "traefik.blog.frontend.rule=Host:shanyue.tech"
```

## 301 & SEO

为了防止使用旧网址打开失败，需要进行301重定向，重定向之前思考两个问题

1. 为什么不使用 302
1. 为什么不给站点设置多个 domain

答案是为了 `SEO`，使用 301 可以把搜索引擎原域名的收录给带过去，而使用多个 domain 会降低页面的权重

百度给的建议是新旧网站并存一段时间，然后进行 301

```yaml
version: "3"
services:
  blog:
    build:
      context: .
    restart: always
    labels:
      - "traefik.old.frontend.rule=Host:blog.xiange.tech"
      # 重定向至新域名
      - "traefik.old.frontend.redirect.regex=^https?://blog.xiange.tech/(.*)"
      - "traefik.old.frontend.redirect.replacement=https://shanyue.tech/$$1"

      # 设置永久重定向: 301
      - "traefik.old.frontend.redirect.permanent=true"
```

## sitemap.xml & robots.txt

这两个是为了 SEO，当站点新添了页面，可以使用 sitmeap 更好地通知搜索引擎的小蜘蛛们，方便新页面更快的收录

需要更改 sitemap 中 的 url.loc 的绝对地址为新域名，以下是一个 sitemap 的样例，你也可以通过 <https://shanyue.tech/sitemap.xml> 访问

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://blog.xiange.tech/post/login-input-style/</loc>
    <lastmod>2019-04-23T11:12:38+08:00</lastmod>
  </url>`
</urlset>
```

## 依赖应用

在我博客的评论系统中使用了 github 的 `OAuth Apps`，需要更改主页及回调地址

+ Homepage URL
+ Authorization callback URL

## 总结

鉴于只是一个简单的博客，应该没有什么工作量了

如果域名需要 SEO，也就比较麻烦些，如果不需要的话，基本可以使用 nginx 或者 traefik 配置多个域名就可以了
