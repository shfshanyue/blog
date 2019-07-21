--- 
title: "k8s在github上易用轻量的持续集成方案: helm 结合 drone"
keywords: helm,drone,k8s,github,ci
date: 2019-10-31 21:00
tags:
  - k8s
  - devops

---

一般小型公司的持续集成方案会选择: `gitlab` + `gitlab CI`，当然部分公司也会选择 `jenkins`。

选择 `gitlab CI` 的原因很简单，因为使用了 `gitlab CE` 作为代码托管平台。那为什么选择了 `gitlab` 作为代码托管呢， `gitlab CE` 是免费版(社区版)，对于昂贵的 toB 软件来说，一家公司至少省了几十万的开销，而且支持自建平台，搭在自家的服务器中，安全性得到了保证。

而对比 `gitlab` 的同一类产品，世界最大的同性社交网站 `github` 来说，随着微软的收购，`github` 也越来越开放了，它不仅免费开放了私有仓库，现在也可以通过 `github action` 来做简单的 CI。

对于个人，自有开发者以及小型公司来说，拥有免费仓库的 `github` 也是一个不错的选择。

[drone](https://drone.io/) 是基于容器的构建服务，配置简单且免费，在 github 上也有 20K star。如果你的仓库主要都在 github，你会喜欢上它的

> 随着 github action 的发展，github + github-action 也是个人以及小型公司可选的持续集成方案，不过由于它属于公共构建服务的缘故，镜像构建以及镜像拉取速度会是一个问题，这要取舍
