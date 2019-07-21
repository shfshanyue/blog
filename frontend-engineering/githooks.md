---
date: 2021-10-05
---

# Git Hooks 与 Husky 原理解析与应用

`git hooks` 是前端项目在本地通用的质量保障手段。

> `npm script hook` 也可对前端工程做质量加强，可见往日文章。

它在 `git commit`、`git push` 等 git 操作之前与之后可设置自动执行的脚本，被称为 `git hooks` 脚本。

代码在提交之前 (`pre-commit hook`)，可做以下诸多校验，如未通过检验，则无法成功提交。

+ `pritter`: html、css、js、md、yaml 等代码格式化校验
+ `eslint`: 代码质量规范检测
+ `commit message lint`: 结构化语义化的 Commit 信息，可参考 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
+ `test`

## Git Hooks

在每一个使用 git 进行版本管理的仓库，都有一个目录 `.git/hooks`，包含 commit 各个阶段 hook 的脚本。

> 官方文档详见: [githooks](https://git-scm.com/docs/githooks)

``` bash
$ ls -lah .git/hooks
applypatch-msg.sample     pre-merge-commit.sample
commit-msg.sample         pre-push.sample
fsmonitor-watchman.sample pre-rebase.sample
post-update.sample        pre-receive.sample
pre-applypatch.sample     prepare-commit-msg.sample
pre-commit.sample         update.sample
```

+ pre-commit: `git commit` 之前触发
+ pre-push: `git push` 之前触发

在 git 2.9 中引入了 `core.hooksPath`，可手动配置 `git hooks` 所在的目录。

``` bash
# 可通过命令行配置 core.hooksPath
$ git config 'core.hooksPath' .husky

# 也可通过写入文件配置 core.hooksPath
$ cat .git/config
[core]
  ignorecase = true
  precomposeunicode = true
  hooksPath = .husky
```

## Git Hooks 初试

编辑 `.git/hooks/pre-commit`，设定以下脚本，在每次提交之前输出 `ok`。

``` bash
#!/bin/sh

echo ok
```

并设置该脚本为可执行权限

``` bash
$ chmod 777 .git/hooks/pre-commit
```

提交一次，看看结果如何吧。在第一行确实有一个 `ok`，测试成功。

``` bash
$ git commit -m 'test'
ok
[master 24d8f91] update
 Date: Wed Nov 3 11:39:50 2021 +0800
 1 file changed, 2 insertions(+), 1 deletion(-)
```

**将 `pre-commit` 脚本中的命令改为 `npm scripts`，即可实现前端工程化的效果。**

在每次提交之前自动校验代码风格:

``` bash
#!/bin/sh

npm run lint
```

## 跳过 Git Hooks

由于 `git hooks` 是在客户端进行的校验，在客户端禁掉也是非常简单的。

``` bash
$ git commit --no-verify

# 或者使用它的缩写
$ git commit -n
```

## Husky 是如何工作的？

[husky](https://github.com/typicode/husky) 

不同版本的 `husky` 工作原理略有不同，本文讲述 `husky 6+` 的工作原理。

> 由于相邻版本的 `husky` 变更较大 (husky6 为分界线)，如果你们项目中 `husky` 配置有问题，先确认 `husky` 版本号，再定位问题。

`husky` 做了两件事(需要 `husky install` 手动完成):

1. 创建 `~/.husky` 目录
1. 设置 `~/.husky` 目录为 `git hooks` 目录

而对于使用者而言，需要在 `~/.husky` 目录下**手动创建 hook 脚本**。

``` bash
# 手动创建 pre-commit hook
$ vim .husky/pre-commit
```

在 `pre-commit` 中进行代码风格校验

``` bash
#!/bin/sh

npm run lint
npm run test
```

**此时，你有疑惑，`husky` 这么简单，这事儿我也能干！**

是了，确实如此。`husky` 的源码十分简单，建议阅读。
