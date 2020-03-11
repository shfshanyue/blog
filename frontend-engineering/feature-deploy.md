# CICD 下前端的多特性分支环境部署

无论大中小企业，多特性分支的前端环境基本上已成为了标配，即每一个功能分支都配有相应的测试环境。今天山月就循序渐进来讲解下多分支环境的实现方式，经济基础决定上层建筑，企业的基础服务建设决定实现方式，这里是基于 Docker 与 CICD 的实现。

至于服务器端的多分支环境部署，由于都是基于容器的思想，思路与前端一致，如果直接想看结论，请翻到最后看小结。

从前后端的开发到上线，不同的企业对不同的环境有不同的命名，甚至有更精细的划分。但是一般可以可以划分为三个环境，我把这三个环境命名如下，并会在下述

1. `local`：本地环境，把项目 git clone 到自己的工作笔记本或者开发机中，在 `localhost:8080` 类似的地址进行调试与开发。此时环境的面向对象主要是开发者。
1. `dev`：测试环境，本地业务迭代开发结束并交付给测试进行功能测试的环境，在 `dev.shanyue.tech` 类似的二级域名进行测试。此时环境的面向对象主要是测试人员。
1. `prod`：生产环境，线上供用户使用的环境，在 `shanyue.tech` 类似的地址。此时环境的面向对象主要是用户。

那什么是多分支环境部署呢？这要从 Git 的工作流说起

> 本篇文章要求你有一定的 Docker，DevOps 以及前端工程化的知识储备。如果没有的话，本系列文章以及 [个人服务器运维指南](https://github.com/shfshanyue/blog#%E4%B8%AA%E4%BA%BA%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%BF%90%E7%BB%B4%E6%8C%87%E5%8D%97) 中的 Docker 部分会对你有所帮助。

## Git 工作流

随着不同的环境的区分，基于版本管理工具演化出了各种各样的工作流，比如 `Git Flow`，`Github Flow` 与 `Gitlab Flow`。这里简单介绍一种最常见的 `Git Flow`

![git flow](https://nvie.com/img/git-model@2x.png)

`git flow` 流程如图上所示，关于细节这里不作过多的讨论。一般来说

1. `feature` 分支对应本地环境
1. `develop` 分支对应测试环境
1. `master` 分支对应生产环境

由于每次 `feature` 开发结束后都要合并到 `develop` 分支进行测试。此时会有几个问题

1. 当 `develop` 分支测试出现 bug 后，每次修复后都需要合并到 `develop` 分支。
1. **当多功能同时开发时会造成 `develop` 分支的拥挤导致，各个功能最后只能统一上线**，因为它无法时刻保持一个干净的 `develop` 分支，这与我们现在所提倡的敏捷开发，小步迭代格格不入。

此时，基于 `feature` 分支急需一套可单独测试的环境

## 多分支环境部署

CI，`Continous Integration` 持续集成使项目变得更加自动化，充分减少程序员的手动操作，并且在产品快速迭代的同时提高代码质量。基于 CICD 的工作流也大大改善了 Git 的工作流。其中就增加了一个基于分支的前端环境：

1. 特性环境 (也不知道叫啥名字，就这么起吧)，对应于 `feature` 分支。每个 `feature` 分支都会有一个环境，可以视为本地环境与测试环境的结合体。如对功能 `feature-A` 的开发在 `feature-A.dev.shanyue.tech` 类似的三级域名进行测试。

此时对于开发，测试，产品交付来讲，整个流程的体验就顺滑了很多。于是终于到了今天的正题：

**如何实现多分支环境部署？**

## 基于 docker 进行部署

由于 docker 的轻便易用，隔离性好并且可移植性高的特点，这里选择基于 docker 的部署，镜像配置文件如下所示。

``` dockerfile
FROM node:10-alpine as builder

ENV PROJECT_ENV development
ENV NODE_ENV production

# http-server 不变动也可以利用缓存
WORKDIR /code

ADD package.json package-lock.json /code
RUN npm install --production

ADD . /code
RUN npm run build

# 选择更小体积的基础镜像
FROM nginx:10-alpine
COPY --from=builder /code/public /usr/share/nginx/html
```

另外由于此时不在生产环境，完全没有必要把所有静态资源扔到 CDN 去处理，甚至为了方便调试，在打包时也可以避免做过多的混淆及压缩。如果你对 docker 不熟悉，可以查看本系列暨前端工程暨高级前端进阶的系列文章第 N 篇：[使用 Docker 部署前端项目](https://shanyue.tech/frontend-engineering/docker.html)

## 基于容器的前端部署与反向代理

现在流行的 `kubernetes`，`docker-compose` 应用编排都是基于容器的，所以我们只需要着力于容器，思考如何利用它做多分支部署。

首先解决的问题是多分支部署环境的多域名问题，因此首先要了解如何利用容器来映射域名，以下是两种常见的方案，但是利用容器的 label 的方式还是多一些

1. 基于 container label，如 `traefik` 以及 `kubernetes ingress`。
1. 基于 environment，如 `docker-nginx`。

但是无论基于那种方式的部署，我们总是可以在给它封装一层来简化操作，一来方便运维管理，一来方便开发者直接接入。如把部署抽象为一个命令，我们这里暂时把这个命令命名为 `deploy`，`deploy` 这个命令可能基于 `kubectl/heml` 也有可能基于 `docker-conpose`。

该命令最核心 API 如下：

``` bash
$ deploy service-name --host :host
```

假设要部署一个应用 `shanyue-feature-A`，设置它的域名为 `feature-A.dev.shanyue.tech`，则这个部署前端的命令为：

``` bash
$ deploy shanyue-feature-A --host feature-A.dev.shanyue.tech
```

现在只剩下了一个问题：找到当前分支。

## 基于 CICD 的多分支部署

在 CICD 中很容易获取当前分支的信息，在 CI 环境中可以通过环境变量获取到。

如在 gitlab CI 中可以通过环境变量 `CI_COMMIT_REF_SLUG` 获取，该环境变量还会做相应的分支名替换，如 `feature/A` 到 `feature-a` 的转化。

+ `CI_COMMIT_REF_SLUG`: $CI_COMMIT_REF_NAME lowercased, shortened to 63 bytes, and with everything except 0-9 and a-z replaced with -. No leading / trailing -. Use in URLs, host names and domain names.

以下是一个基于 `gitlab CI` 的一个多分支部署的简单示例

``` bash
deploy-for-feature:
  stage: deploy
  only:
    refs:
      - /^feature\/.*$/
  script:
    - deploy shanyue-$CI_COMMIT_REF_SLUG --host https://$CI_COMMIT_REF_SLUG.sp.dev.smartstudy.com 
  environment:
    name: review/$CI_COMMIT_REF_NAME
    url: http://$CI_COMMIT_REF_SLUG.dev.shanyue.tech
```

## 小结

随着 CICD 的发展，对快速迭代以及代码质量提出了更高的要求，而基于分支的多测试环境则成为了刚需。对于该环境的搭建，思路也很清晰

1. 借用现有的 CICD 服务，如 `jenkins`，`gitlab CI` 或者 `drone CI`，获取当前分支信息
1. 借用 Docker 快速部署前端或者后端，根据分支信息启动不同的容器，并配置标签
1. 根据容器的标签与当前 Git 分支对前端后端设置不同的域名

另外，这个基于容器的思路不仅仅使用于前端，同样也适用于后端。而现实的业务中复杂多样，如又分为已下几种，这需要在项目的使用场景中灵活处理。

+ `feature-A` 的前端分支对应 `feature-A` 的后端分支环境
+ `feature-A` 的前端分支对应 `develop` 的后端分支环境
+ `feature-A` 的前端分支对应 `master` 的后端分支环境