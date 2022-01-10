# CI 中的环境变量

## 环境变量

在 Linux 系统中，通过 `env` 可列出所有环境变量，我们可对环境变量进行修改与获取操作。

``` bash
$ env
USER=shanyue

$ echo $USER
shanyue

$ export USER=shanyue2

$ echo $USER
shanyue2
```

我们在前后端，都会用到大量的环境变量。环境变量可将非应用层内数据安全地注入到应用当中。在 node.js 中可通过以下表达式进行获取。

``` js
process.env.USER
```

## CI 中的环境变量

CI 作为与 Git 集成的工具，其中注入了诸多与 Git 相关的环境变量。以下列举一条常用的环境变量

如 Github Actions 中

| 环境变量 | 描述 |
| --- | --- |
| `CI` | `true` 标明当前环境在 CI 中 |
| `GITHUB_REPOSITORY` | 仓库名称。例如 `shfshanyue/cra-deploy`. |
| `GITHUB_EVENT_NAME` | 触发当前 CI 的 Webhook 事件名称 |
| `GITHUB_SHA` | 当前的 Commit Id。 `ffac537e6cbbf934b08745a378932722df287a53`. |
| `GITHUB_REF_NAME` | 当前的分支名称。|

如 [Gitlab CI envirables](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html) 中


| 环境变量 | 描述 |
| --- | --- |
| `CI` | `true` 标明当前环境在 CI 中 |
| `CI_PROJECT_PATH` | 仓库名称。例如 `shfshanyue/cra-deploy`。 |
| `CI_COMMIT_SHORT_SHA` | 当前的 Commit Short Id。 `ffac53`。 |
| `CI_COMMIT_REF_NAME` | 当前的分支名称。|

1. Commit/Tag 可作为版本号，注入到日志系统与 Sentry 中追踪异常。如，当在异常系统中收到一条报警，查看其 commit/tag 便可定位到从哪次部署开始出现问题，或者哪次代码提交开始出现问题。
1. Branch 可作为 Preview 前缀。

## CI=true

不同的 CI 产品会在构建服务器中自动注入环境变量。

``` bash
$ export CI=true
```

而测试、构建等工具均会根据环境变量判断当前是否在 CI 中，如果在，则执行更为严格的校验。

如 `create-react-app` 中 `npm test` 在本地环境为交互式测试命令，而在 CI 中则直接执行。

在本地环境构建，仅仅警告(Warn) ESLint 的错误，而在 CI 中，如果有 ESLint 问题，直接异常退出。

`create-react-app` 的源码中，使用了以下语句判断是否在 CI 环境中。

``` js
const isCI =
  process.env.CI &&
  (typeof process.env.CI !== 'string' ||
    process.env.CI.toLowerCase() !== 'false');
```

因此，可在本地中通过该环境变量进行更为严格的校验。比如在 git hooks 中。

``` bash
# 可使用该命令，演示在 CI 中的表现
$ CI=true npm run test

$ CI=true npm run build
```

## 写段 CI 验证下 CI 中的环境变量

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-11/clipboard-9125.9b3a8e.webp)

+ [Github CI Run](https://github.com/shfshanyue/cra-deploy/runs/4771781199?check_suite_focus=true)

``` yaml
name: CI Env Check
on: [push]
jobs:
  env:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: echo $CI
      - run: echo $GITHUB_REPOSITORY
      - run: echo $GITHUB_EVENT_NAME
      - run: echo $GITHUB_SHA
      - run: echo $GITHUB_REF_NAME
```