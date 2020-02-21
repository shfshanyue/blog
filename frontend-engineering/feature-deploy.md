# CICD 下基于 git 分支的前端多特性环境部署

这是山月关于高级前端进阶暨前端工程系列文章的第 M 篇文章 (M 随便打的，毕竟也不知道能写多少篇)，关于前 M-1 篇文章，可以从我的 github repo [shfshanyue/blog](https://github.com/shfshanyue/blog) 中找到，如果点进去的话可以捎带~点个赞~，如果没有点进去的话，那就给这篇文章点个赞。今天的文章开始了

无论大中小企业，基于分支的前端环境基本上已成为了标配。今天山月就循序渐进来讲解下多分支环境的实现方式，这里是基于 Docker 与 CICD 的实现。

另外本篇文章要求你有一定的 Docker，DevOps 以及前端工程化的知识储备。如果没有的话，本系列文章以及 [个人服务器运维指南](https://github.com/shfshanyue/blog#%E4%B8%AA%E4%BA%BA%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%BF%90%E7%BB%B4%E6%8C%87%E5%8D%97) 中的 docker 部分会对你有所帮助。

---

从前后端的开发到上线，不同的企业对不同的环境有不同的命名，甚至有更精细的划分。但是一般可以可以划分为三个环境：

1. `local`：本地环境，把项目 git clone 到自己的工作笔记本或者开发机中，在 `localhost:8080` 类似的地址进行调试与开发。此时环境的面向对象主要是开发者。
1. `dev`：测试环境，本地业务迭代开发结束并交付给测试进行功能测试的环境，在 `dev.shanyue.tech` 类似的二级域名进行测试。此时环境的面向对象主要是测试人员。
1. `prod`：生产环境，线上供用户使用的环境，在 `shanyue.tech` 类似的地址。此时环境的面向对象主要是用户。

那什么是多分支环境部署呢？这要从 Git 的工作流说起

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

1. 特性环境 (也不知道叫啥名字，就这么起吧)，对应于 `feature` 分支。每个 `feature` 分支都会有一个环境，可以视为本地环境与测试环境的结合体，在 `feature-footer.dev.shanyue.tech` 类似的三级域名进行测试。

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

如果你对 docker 不熟悉，可以查看本系列暨前端工程暨高级前端进阶的系列文章第 N 篇：[使用 Docker 部署前端项目](./docker.html)

## 基于 CICD 与容器的前端部署

现在流行的 `kubernetes`，`docker-compose` 应用编排,

`shanyue`
