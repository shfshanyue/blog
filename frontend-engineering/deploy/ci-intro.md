# CICD 

在前边的篇章中，我们在服务器中搭建了 Traefik 网关，并使用 `docker-compose` 部署前端并发布成功。

但前边的部署流程都是基于手动部署，那我们如何将部署进行自动化: 

**即每当我们将前端代码更新到仓库后，代码将会拉取仓库代码并自动部署到服务器。**。这就是 CICD 要做的事情。

+ `CI`，Continuous Integration，持续集成。
+ `CD`，Continuous Deployment，持续部署。

`CICD` 与 git 集成在一起，可理解为服务器端的 `git hooks`: 当代码 push 到远程仓库后，借助 `WebHooks` 对当前代码在构建服务器(即 CI 服务器，也称作 Runner)中进行自动构建、测试及部署等。

为了方便理解，我们将上篇篇章中所指的服务器称为部署服务器，而 CI 中所指的服务器，称为构建服务器。

+ 部署服务器: 对外提供服务的服务器，容器在该服务器中启动。
+ 构建服务器: 进行CI构建的服务器，一般用以构建、测试和部署，构建镜像以及自动部署服务。一般也可以是 Docker 容器。

在以前的篇章中，相当于构建服务器和部署服务器为同一个服务器，而在工作中，二者往往为独立服务器。但是为了更好的 CICD，构建服务器会赋予控制部署服务集群的权限，**在构建服务器中通过一条命令，即可将某个服务在部署服务器集群中进行管理。**

在 CICD 中，构建服务器往往会做以下工作，这也是接下来几篇篇章的内容:

1. 功能分支提交后，通过 CICD 进行自动化测试、语法检查、npm 库风险审计等前端质量保障工程，**如未通过 CICD，则无法 Code Review，更无法合并到生产环境分支进行上线**
1. 功能分支提交后，通过 CICD 对当前分支代码构建独立镜像并**生成独立的分支环境地址**进行测试如对每一个功能分支生成一个可供测试的地址，一般是 `<branch>.dev.shanyue.tech` 此种地址
1. 功能分支测试通过后，合并到主分支，**自动构建镜像并部署到生成环境中** (一般生成环境需要手动触发、自动部署)

如下图，当所有 Checks 通过后，`Merge pull request` 才会变绿允许进行合并。

![CI Checks](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-17/pr-checks-final.26fba2.webp)

由于近些年来 CICD 的全面介入，项目开发的工作流就是 CICD 的工作流，请看一个比较完善的 CICD Workflow。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-17/clipboard-7669.a41a94.webp)

> 改图出自 [Gitlab CICD Workflow](https://docs.gitlab.com/ee/ci/introduction/index.html#basic-cicd-workflow)

1. CI: 切出功能分支，进行新特性开发。此时为图中的 `Verify`、`Package` 阶段
1. CD: 合并功能分支，进行自动化部署。此时为图中的 `Release` 阶段。

## CICD 工具与产品

国内公司一般以 `gitlab CI` 作为 CICD 工具，此时需要自建 `Gitlab Runner` 作为构建服务器。

如果你们公司没有 CICD 基础设置，但是个人对 CICD 有极大兴趣，那么可以尝试 github 免费的 CICD 服务: [github actions](https://github.com/features/actions)。

github 提供了以下配置的服务器作为构建服务器，可以说相当良心，对于 CICD 完全足够。

+ 2-core CPU
+ 7 GB of RAM memory
+ 14 GB of SSD disk space

## 基础概念与术语

每一家 CICD 产品，都有各自的配置方式，但是总体上用法差不多。我们了解下 CICD 的基本术语

+ `Runner`: 用来执行 CI/CD 的构建服务器
+ `workflow/pipeline`: CI/CD 的工作流。(在大部分 CI，如 Gitlab 中为 Pipeline，而 Github 中为 Workflow，但二者实际上还是略有不同)
+ `job`: 任务，比如构建，测试和部署。每个 `workflow`/`pipeline` 由多个 `job` 组成

在本系列专栏中，以 Github Actions 为主，并配有全部关于 Github Actions 的配置代码，并可成功运行，配置目录见 [.github/workflows](https://github.com/shfshanyue/cra-deploy/tree/master/.github/workflows)。以 Gitlab CI 为辅，并配有部分配置代码。

以下是关于 Github Actions 与 Gitlab CI 的配置文档，在以后篇章中可自行查阅。

1. [Github Actions 配置](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions)
2. [Gitlab CI 配置](https://docs.gitlab.com/ee/ci/yaml/gitlab_ci_yaml.html)

## 基本功能介绍

在文首提到 CICD 的主要意义：

**每当我们将前端代码更新到仓库后，代码将会拉取仓库代码并自动部署到服务器。**

我们进行拆分成两个阶段，并在以下简单介绍如何对其进行配置

1. 事件: push
1. 命令: 前端部署

### 事件: on push

该 CI/CD 触发时的事件。如果需要上传代码自动部署的功能时，应该选择 `on: push`

``` yaml
on: push
```

更多 Github Actions Event 可以参考官方文档 [Events that trigger workflows](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/events-that-trigger-workflows#about-workflow-events)

``` yaml
# 仅仅当 master 代码发生变更时，用以自动化部署
on:
  push:
    branches:    
      - master

# 仅当 feature/** 分支发生变更时，进行 Preview 功能分支部署 (见 Preview 篇)
on:
  pull_request:
    types:
      # 当新建了一个 PR 时
      - opened
      # 当提交 PR 的分支，未合并前并拥有新的 Commit 时
      - synchronize
    branches:    
      - 'feature/**'

# 在每天凌晨 0:30 处理一些事情，比如清理多余的 OSS 资源，清理多余的功能分支 Preview (见 Preview 篇)
on:
  schedule:
    - cron:  '30 8 * * *'
```

### 命令: Job 与脚本

如，在 push 到最新代码时，使用 `docker-compose up` 进行部署。

``` yaml
name: push

on: [push]

jobs:
  test:
    # 将代码跑在 ubuntu 上
    runs-on: ubuntu-latest
    steps:
      # 切出代码，使用该 Action 将可以拉取最新代码
      - uses: actions/checkout@v2

      # 运行部署的脚本命令
      - run: docker-compose up -d
```

## 使用 CICD 进行自动部署

终于到了最重要的内容了，如何使用 CICD 自动部署前端？

通过以前的篇章，我们了解到部署前端，仅仅需要在部署服务器执行一条命令即可 (简单环境下)

``` bash
$ docker-compose up --build
```

以下是对于简单部署在个人服务器的一个 Github Actions 的案例，由于构建服务器无部署服务器管理集群应用的能力与权限 (kubernetes 拥有这种能力)。如果部署到服务器，只能简单粗暴地通过 ssh 进如服务器并拉取代码执行命令。

```yaml
deploy:
  runs-on: ubuntu-latest
  steps:
    - |
      ssh root@shanyue.tech "
        # 假设该仓库位于 ~/Documents 目录
        cd ~/Documents/cra-deploy

        # 拉取最新代码
        get fetch origin master
        git reset --hard origin/master

        # 部署
        docker-compose up --build -d
      "
```

## 自建 Runner

在本次实践中，将构建服务器与部署服务器置于一起，则可以解决这个问题。在 Github Actions，可以在自有服务器中自建 Runner，文档如下。

+ [Github Actions: Adding self hosted runners](https://docs.github.com/cn/actions/hosting-your-own-runners/adding-self-hosted-runners)

此时部署仅仅需要一行 `docker-compose up`。

```yaml
preview:
  # 该 JOB 在自建 Runner 中进行运行
  runs-on: self-hosted
  steps:
    # 切出代码，使用该 Action 将可以拉取最新代码
    - uses: actions/checkout@v2
    - run: docker-compose up --build -d
```

而在真实的工作环境中，部署更为复杂，往往通过一些封装的命令来完成，分为三步:

1. 构建镜像
1. 推送镜像到自建的镜像仓库
1. 将镜像仓库中的镜像拉取到部署服务器进行部署 (kubectl)

*伪代码*如下:

``` yaml
deploy:
  stage: deploy
  only:
    - master
  script:
    # 构建镜像
    - docker build -t devtools-app-image
    # 推送镜像
    - docker push devtools-app-image
    # 拉取并部署，devtools-app-servie 将会拉取远程的 devtools-app-image 镜像，进行服务部署
    - deploy devtools-app-service .
```

## 小结

本篇文章介绍了 CICD 的基础概念，在下一篇章，将会上手对 `create-react-app` 在 CICD 中进行前端质量保障。并附真实代码。
