---
date: 2020-12-16 15:31
loc: 武汉江汉区

---

# Mac 中 git 大小写问题的解决方案

一般开发中在 Mac 上开发程序，并使用 Git 进行版本管理，在使用 React 编写 Component 时，组件名一般建议首字母大写。

**有些同学对 React 组件的文件进行命名时，刚开始是小写，后来为了保持团队一致，又改成了大写，然而 git 不会发现大小写的变化，此时就出了问题。**

再梳理一遍这个逻辑：

1. 小明编写组件 `button.js`，提交代码
1. 小明觉得组件命名不妥，改为 `Button.js`
1. 小明并修改所有文件对它的引用，本地环境运行正常，提交代码
1. 构建服务器通过 Git 拉取代码，进行构建，Git 为认识到 `button.js` 大小写发生变化，所有引用 `Button.js` 的组件发生报错，失败

来重现一下犯错的这个过程：

``` bash
# 刚开始 test 文件是由内容的
~/Documents/ignorecase-test(master ✔) cat test
hello

# 把 test 文件改成首字母大写的 Test 文件
~/Documents/ignorecase-test(master ✔) mv test Test

# 注意此时 git status 并没有发生改变
~/Documents/ignorecase-test(master ✔)
~/Documents/ignorecase-test(master ✔) git ls-files
test
~/Documents/ignorecase-test(master ✔) ls
Test
```

## 解决方案

通过 `git mv`，在 Git 暂存区中再更改一遍文件大小写解决问题

``` bash
$ git mv test Test
```

但是修改文件夹时会出现一些问题：

> fatal: renaming 'dir' failed: Invalid argument

使用下边这个笨办法修改：

``` bash
$ git mv dir DirTemp
$ git mv DirTemp Dir
```

## 预防方案

那有没有什么预防措施？

**Git 默认是忽略大小写的，如果改成不忽略大小写是不就可以了？不行，这样会产生更麻烦的问题。**

更改为不忽略大小写

``` bash
[core]
  ignorecase = false
```

以下是产生的问题：

1. **修改文件名时，Git 工作区中一下子增加了两个文件，并且无法删除**
1. **git rm 删除文件时，工作区的两个文件都被删除**

``` bash
~/Documents/ignorecase-test(master ✔) ls
test
~/Documents/ignorecase-test(master ✔) mv test Test
~/Documents/ignorecase-test(master ✗) ls
Test
~/Documents/ignorecase-test(master ✗) git status
On branch master
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        Test

nothing added to commit but untracked files present (use "git add" to track)
~/Documents/ignorecase-test(master ✗) git add -A
~/Documents/ignorecase-test(master ✗) git ls-files
Test
test
~/Documents/ignorecase-test(master ✗) git rm test
rm 'test'
~/Documents/ignorecase-test(master ✗) git add -A
~/Documents/ignorecase-test(master ✗) git ls-files
~/Documents/ignorecase-test(master ✗)
```

## 总结

使用 `git mv -f` 和 `mv` 同时更改文件名，避免本地文件系统与仓库中代码不一致。

