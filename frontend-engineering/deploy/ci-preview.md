# Preview and Environments

关于 Preview，我在前几篇文章提到过几次，**即每一个功能分支都配有对应的测试环境**。

> 如果不了解 Preview 的话，可以看看我在 [cra-deploy](https://github.com/shfshanyue/cra-deploy) 的一个 [PR](https://github.com/shfshanyue/cra-deploy/pull/1)。
>
> ![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-13/clipboard-1458.98c150.webp)

项目研发的从开发到上线，一般可以可以划分为三个环境

1. `local`：本地环境，把项目 git clone 到自己的工作笔记本或者开发机中，在 `localhost:8080` 类似的地址进行调试与开发。此时环境的面向对象主要是开发者。
1. `dev`：测试环境，本地业务迭代开发结束并交付给测试进行功能测试的环境，在 `dev.shanyue.tech` 类似的二级域名进行测试。此时环境的面向对象主要是测试人员。
1. `prod`：生产环境，线上供用户使用的环境，在 `shanyue.tech` 类似的地址。此时环境的面向对象主要是用户。

那什么是多分支环境部署呢？这要从 `Git Workflow` 说起

## 多分支环境部署

CI，使项目变得更加自动化，充分减少程序员的手动操作，并且在产品快速迭代的同时提高代码质量。

基于 CICD 的工作流也大大改善了 Git 的工作流。其中就增加了一个基于分支的前端环境：

1. 功能分支环境，对应于 `feature` 分支。每个 `feature` 分支都会有一个环境，一个特殊的测试环境。如对功能 `feature-A` 的开发在 `cra.feature-A.dev.shanyue.tech` 进行测试。

**那实现多分支环境部署？**

## 基于 docker 进行部署

回忆之前关于部署的章节内容，我们可以根据以下 `docker-compose.yaml` 进行部署，并配置为 `cra.shanyue.tech`。

``` yaml {9,14}
version: "3"
services:
  domain:
    build:
      context: .
      dockerfile: router.Dockerfile
    labels:
      # 为 cra 配置我们的自定义域名
      - "traefik.http.routers.cra.rule=Host(`cra.shanyue.tech`)"
      # 设置 https，此时我们的 certresolver 为 le，与上篇文章配置保持一致
      - traefik.http.routers.cra.tls=true
      - traefik.http.routers.cra.tls.certresolver=le

networks:
  default:
    external:
      name: traefik_default
```

注意，**此时我们通过容器中的 `labels` 来配置域名。如果我们对不同的分支，配置不同的 `labels`，岂不可以完成这件事？**

回忆之前关于 CI 的章节内容，我们在构建服务器中，**可通过环境变量获取到当前仓库的当前分支**，我们使用它进行功能分支环境部署。

``` yaml
labels:
  - "traefik.http.routers.cra.rule=Host(`cra.${CI_COMMIT_REF_NAME}.shanyue.tech`)"
```

大功告成，我们在本地/个人服务器来尝试一下吧。

## deploy 命令的封装

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

在 CICD 中很可根据环境变量获取当前分支名，详情可参考上一篇文章: [CI 中的环境变量](./ci-env.md)。

在 Gitlab CI 中可以通过环境变量 `CI_COMMIT_REF_SLUG` 获取，*该环境变量还会做相应的分支名替换*，如 `feature/A` 到 `feature-a` 的转化。

在 Github Actions 中可以通过环境变量 `GITHUB_REF_NAME` 获取。

> `CI_COMMIT_REF_SLUG`: $CI_COMMIT_REF_NAME lowercased, shortened to 63 bytes, and with everything except 0-9 and a-z replaced with -. No leading / trailing -. Use in URLs, host names and domain names.

> https://docs.github.com/en/actions/learn-github-actions/expressions

以下是一个基于 `gitlab CI` 的一个多分支部署的简单示例

``` yaml
deploy-for-feature:
  - 
```

``` yaml
deploy-for-feature:
  stage: deploy
  only:
    refs:
      - /^feature-.*$/
  script:
    - deploy shanyue-$CI_COMMIT_REF_SLUG --host https://$CI_COMMIT_REF_SLUG.sp.dev.smartstudy.com 
  environment:
    name: review/$CI_COMMIT_REF_NAME
    url: http://$CI_COMMIT_REF_SLUG.dev.shanyue.tech
```

## environment

+ [Github Actions: environment](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idenvironment)
+ [Using environments for deployment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)

``` yaml
environment:
  name: review/$COMMIT_BRANCH_NAME
  url: http://$COMMIT_BRANCH_NAME.dev.shanyue.tech
```

## 基于 k8s 的多分支部署

> PS: 本段内容需要对 k8s 有基本概念的了解，比如 `Deployment`、`Pod`、`Service`。可在下一篇章进行了解。

+ Deployment: 对 [cra-deploy](https://github.com/shfshanyue/cra-deploy) 项目的部署视作一个 Deployment
+ Service: 对 [cra-deploy](https://github.com/shfshanyue/cra-deploy) 提供可对集群或外网的访问地址

如此一来

1. 根据分支名作为镜像的 Tag 构建镜像。如 `cra-deploy-app:feature-A`
1. 根据带有 Tag 的镜像，对每个功能分支进行单独的 Deployment。如 `cra-deployment-feature-A`
1. 根据 Deployment 配置相对应的 Service。如 `cra-service-feature-A`
1. 根据 Ingress 对外暴露服务并对不同的 Service 提供不同的域名。如 `feature-A.cra.shanyue.tech`

> 配置文件路径位于 [k8s-preview-app.yaml](https://github.com/shfshanyue/cra-deploy/blob/master/k8s-preview-app.yaml)

``` yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cra-deployment-${COMMIT_REF}
spec:
  selector:
    matchLabels:
      app: cra
  replicas: 3
  template:
    metadata:
      labels:
        app: cra
    spec:
      containers:
      - name: cra-deploy
        image: cra-deploy-app:${COMMIT_REF}
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80

---

apiVersion: v1
kind: Service
metadata:
  name: cra-service-${COMMIT_REF}
spec:
  selector:
    app: cra
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

## 小结

随着 CICD 的发展，对快速迭代以及代码质量提出了更高的要求，而基于分支的多测试环境则成为了刚需。对于该环境的搭建，思路也很清晰

1. 借用现有的 CICD 服务，如 `github actions` 或者 `gitlab CI` 获取当前分支信息
1. 借用 Docker 快速部署前端或者后端，根据分支信息启动不同的容器，并配置标签
1. 根据容器的标签与当前 Git 分支对前端后端设置不同的域名

另外，这个基于容器的思路不仅仅使用于前端，同样也适用于后端。而现实的业务中复杂多样，如又分为已下几种，这需要在项目的使用场景中灵活处理。

+ `feature-A` 的前端分支对应 `feature-A` 的后端分支环境
+ `feature-A` 的前端分支对应 `develop` 的后端分支环境
+ `feature-A` 的前端分支对应 `master` 的后端分支环境
