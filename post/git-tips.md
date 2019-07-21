# 是谁改了我的代码

前些月，写了一个关于 git 的表格，叫[Git Cheat Sheet](https://shfshanyue.github.io/cheat-sheets/git)，现分享一些有用的小技巧。另推荐一个非常不错的关于 git 小技巧的项目 [git-tips](https://github.com/git-tips/tips)。

<!--more-->

## 是谁动了我的代码

是谁动了我的代码？

又是谁的 bug 指到了我的头上？

团队合作时，这样的问题相信大家已经家常便饭司空见惯屡见不鲜了。这时候可以祭出杀器 `blame`: 使用 `git blame <file>` 来定位代码的最后一次修改。

但是，此时有一个问题，这只能查看本行代码的上体提交，而无法定位本行代码的提交历史。比如项目合作中某人对全部代码进行了格式化，`git blame` 就失去了作用。此时，可以与另一个有用的命令 `git log -p <file>` 结合使用，可以查看文件的更改历史与明细，最终找到这个锅究竟应该由谁来背。

``` bash
git blame -L 10,12 package.json
git log -p -L 10,12:package.json
```

## 快速切换合并分支

当你经常工作于 A 与 B 两个分支，需要来回切。这时命令应该是 `git checkout A`，但这里有一个更简单的命令，`git checkout -`，表示切到最近的一次分支。如果你需要把 B 分支的内容合并过来，可以使用 `git merge -`。

``` bash
git checkout -
git merge -
```

而 `-` 往往代表最近一次，如 `cd -` 代表进入最近目录，也相当实用。

## 统计项目

统计项目各个成员 commit 的情况，比如你可以查看你自己的项目的 commit 数以及他人对你项目的贡献数

```sh
git shortlog -sn
git shortlog -sn --no-merges      # 不包含 merge commit
```

## 快速定位提交

如果你的 commit message 比较规范，比如会关联 issuse 或者当前任务或者 bug 的编号，此时根据 commit message 快速定位： `git log --grep "Add"`。

如果你的 commit message 不太规范，只记得改了哪几行代码，此时也可以根据每次提交的信息查找关键字，是 `git log -S "setTimeout"`。

同时，也可以根据作者，时间来辅助快速定位。

```sh
git log --since="0 am" 　　　     # 查看今日的提交
git log --author="shfshanyue"     # 查看 shfshanyue 的提交
git log --grep="#12"              # 查找提交信息中包含关键字的提交
git log -S "setTimeout"           # 查看提交内容中包含关键字的提交
```

## 快速定位字符串 

如何查找包换关键字的全部文件？

使用 `VS Code` 可以全局搜索，使用 `grep` 也可以通过 `grep -rn <keyword>` 来全局搜索。

不过，它们也会连带搜索忽略文件，比如前端著名的两个文件夹 `node_modules` 和 `public(dist/build)`。虽然 grep 可以指定 `--exclude` 来忽略文件，不过 `git` 来的更方便一些。

这时，可以使用 `git grep <keyword>` 来解决这个问题，另外 ag 也可以解决这个问题。

```sh
grep -rn <keyword>
grep -rn <keyword> --exclude config.js --exclude-dir node_modules
git grep <keyword>
ag <keyword>
```

