---
title: 使用 Let's Encrypt 为 Traefik 制作证书并自动续期
date: 2019-04-15T20:17:50+08:00
categories:
  - 运维
tags:
  - devops
  - linux
---

## 前言

你需要在 github 上找到 `certbot-auto` 并下载安装

+ [certbot-auto](https://github.com/certbot/certbot)

## 手动

```shell
./certbot-auto certonly  -d *.xiange.tech -d *.shanyue.tech -d shanyue.tech -d xiange.tech --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory
```

## DNS

在 [dns-plugins](https://certbot.eff.org/docs/using.html#dns-plugins) 中选择 `cloudflare`。

<https://certbot-dns-cloudflare.readthedocs.io/en/stable/>

<https://dash.cloudflare.com/sign-up>

## 自动续期

```shell
./certbot-auto  renew
```

## 列出证书列表

./certbot-auto certificates

## 删除证书

./certbt-auto delete
