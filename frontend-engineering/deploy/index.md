## 部署篇

本专栏需要您了解一些前置知识，如 docker/docker-compose/traefik/cicd 等基础用法。

在学习本专栏过程中，您可以随时查阅文档，在文章涉及到的相关配置，会指明具体配置所对应的文档地址。

本专栏尽量做到图文轻松阅读便于理解，并有**代码示例保障能真实跑得起来**。

1. 每段代码都可运行
1. 每篇文章都可实践
1. 每次实践都有示例

示例代码开源，置于 Github 中，演示如何对真实项目进行部署上线。

+ [simple-deploy](https://github.com/shfshanyue/simple-deploy): 了解最简单的部署，不涉及打包等内容。
+ [cra-deploy](https://github.com/shfshanyue/cra-deploy): 了解如何部署单页应用，这里以 [create-react-app](https://github.com/facebook/create-react-app) 为例，但实际上所讲述东西与 React 无关，仅与单页应用有关。

本专栏分为以下若干篇，其中前三篇以[simple-deploy](https://github.com/shfshanyue/simple-deploy)作为示例项目，而余下若干篇以[cra-deploy](https://github.com/shfshanyue/cra-deploy)作为示例项目。

其中有几篇文章需要个人服务器资源，以下有所标明。

1. 如何阅读本小册
1. 极简部署: 在宿主机环境(裸机)进行部署
1. 极简部署: docker/docker-compose 部署极简版
1. 极简部署: 基于 nginx 镜像部署
1. 部署 CRA: Docker 缓存优化以及多阶段构建
1. 部署 CRA: nginx 配置、路由修复与长期缓存优化
1. 对象存储云服务: 静态资源部署在 OSS/CDN 云服务。**必须需要**云服务，可自行购买。
1. 对象存储云服务: 静态资源上传时间与空间优化。
1. 服务编排: 服务发现与服务网关 Traefik 搭建。**最好需要**个人服务器，可自行购买。如果没有，可在本地进行测试。
1. 服务编排: 前端应用域名配置。**必须需要**个人域名，可自行购买。
1. CICD: CICD 功能基础配置介绍与自动部署实践
1. CICD: 在 CI 中实践前端质量保障工程
1. CICD: 在 CI 中充分利用 Cache
1. CICD: CI 中的环境变量
1. CICD: 使用 CI 实现功能分支测试环境 Preview。**必须需要**个人服务器及个人域名。
1. k8s: 简单概念介绍及使用 k8s 部署前端应用。可本地使用 minikube 进行模拟。
1. 未来展望