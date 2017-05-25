# git 一些有用的小技巧

前些月，写了一个关于 git 的表格，叫[Git Cheat Sheet](https://shfshanyue.github.io/cheat-sheets/git)，现分享一些有用的小技巧，更多内容请移步，另有一个非常不错的关于 git 小技巧的项目 [git-tips](https://github.com/git-tips/tips)。

## 是谁动了我的代码

谁动了我的代码？

谁的 bug 指到了我的头上？

团队合作时，经常会出现这样的问题。这时候可以使用 `git blame <file>` 来定位代码的最后一次修改。但是，有一个问题，这并不能看出本行代码以前的修改。比如项目组中某人对全部代码进行了格式化，`git blame` 就失去了作用。此时，可以与另一个有用的命令 `git log -p <file>` 结合使用，可以查看文件的更改历史与明细，最终找到这个锅究竟应该由谁来背。

``` sh
git blame -L 10,12 package.json
git log -p -L 10,12:package.json
```

## 快速切换合并分支

当你经常工作于 A 与 B 两个分支，需要来回切。这时命令应该是 `git checkout A`，但这里有一个更简单的命令，`git checkout -`，表示切到最近的一次分支。如果你需要把 B 分支的内容合并过来，可以使用 `git merge -`。

``` sh
git checkout -
git merge -
```

## 统计项目贡献

统计项目组各个成员 commit 的情况。

``` sh
git shortlog -sn
git shortlog -sn --no-merges      # 不包含 merge commit
```

## 快速定位提交

根据 commit message 查找关键字可以是 `git log --grep "Add"`，也可以根据commit diff 信息查找关键字，是 `git log -S "setTimeout"`。同时，也可以根据作者，时间来快速定位。

``` sh
git log --since="0 am" 　　　     # 查看今日的提交
git log --author="shfshanyue"     # 查看 shfshanyue 的提交
git log --grep="#12"              # 查找提交信息中包换关键字的提交
git log -S "setTimeout"           # 查看提交内容中包换关机子的提交
```

## 快速定位字符串 

如何查找包换关键字的全部文件？

sublime 告诉我们直接查找全项目。

`grep` 告诉我们 `grep -rn <keyword>`。

不过，它们也会连带搜索忽略文件，比如前端著名的两个文件夹 `node_modules` 和 `public`。虽然 grep 可以使用 `--exclude` 来忽略文件。

这时，可以使用 `git grep <keyword>` 来解决这个问题，另外 ag 也可以解决这个问题。

``` sh
grep -rn <keyword>
grep -rn <keyword> --exclude config.js --exclude-dir node_modules
git grep <keyword>
ag <keyword>
```

