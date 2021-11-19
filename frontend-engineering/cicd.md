# 什么是 CICD

+ `CI`，Continuous Integration，持续集成。
+ `CD`，Continuous Deployment，持续部署。

`CICD` 一般合称，无需特意区分二者区别。从开发、测试到上线的过程中，借助于 CICD 进行一些自动化处理，保障项目质量。

`CICD` 与 git 集成在一起，可理解为服务器端的 `git hooks`: 当代码 push 到远程仓库后，借助 `WebHooks` 对当前代码在构建服务器(即 CI 服务器，也称作 Runner)中进行自动构建、测试及部署等。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-17/clipboard-6509.1b9b98.webp)

它有若干好处:

1. 功能分支提交后，通过 CICD 进行自动化测试、语法检查等，**如未通过 CICD，则无法 CodeReview，更无法合并到生产环境分支进行上线**
1. 功能分支提交后，通过 CICD 检查 npm 库的风险、检查构建镜像容器的风险等
1. 功能分支提交后，通过 CICD 对当前分支代码构建独立镜像并生成独立的分支环境地址进行测试，**如对每一个功能分支生成一个可供测试的地址，一般是 `<branch>.dev.shanyue.tech` 此种地址**
1. 功能分支测试通过后，合并到主分支，自动构建镜像并部署到生成环境 (一般生成环境需要手动触发、自动部署)

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-17/pr-checks-final.26fba2.webp)

由于近些年来 CICD 的全面介入，项目开发的工作流就是 CICD 的工作流，请看一个比较完善的 CICD Workflow。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-17/clipboard-7669.a41a94.webp)

## CICD 工具

`CICD` 集成于 CICD 工具及代码托管服务。CICD 有时也可理解为进行 CICD 的构建服务器，而提供 CICD 的服务，如以下产品，将会提供构建服务与 github/gitlab 集成在一起。

+ `jenkins`
+ `Travis CI`

如果你们公司没有 CICD 基础设置，那么你可以尝试 github 免费的 CICD 服务: [github actions](https://github.com/features/actions)。

公司一般以 `gitlab CI` 作为 CICD 工具，此时需要自建 `gitlab Runner` 作为构建服务器。

## 一段简单的 CICD 配置

每一家 CICD 产品，都有各自的配置方式，但是总体上用法差不多。以下 CI 脚本指当在 master 有代码变更时，自动部署上线。

```yaml
deploy:
  stage: deploy
  only:
    - master
  script:
    - docker build -t harbor.shanyue.tech/fe/devtools-app
    - docker push harbor.shanyue.tech/fe/devtools-app
    - helm upgrade -install devtools-app-chart .
```