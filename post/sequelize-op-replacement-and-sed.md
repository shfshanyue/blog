---
title: "sed 命令实践: 升级 sequelize.js 时批量替换字符串"
date: 2019-06-13T22:03:22+08:00
thumbnail: ""
categories:
  - 后端
  - 运维
tags:
  - linux
---

[sequelize](https://github.com/sequelize/sequelize) 是 Node 中使用比较多的一个 ORM 库，最近计划将项目中的 `sequelize` 升级至 V5 版本。

根据 [升级文档](http://docs.sequelizejs.com/manual/upgrade-to-v5.html)，其中一项是即将禁用 `String based operators`，使用 Sequelize.Op 等 Symbol operators 来代替。

而 `operator` 主要用在查询条件中，用以生成查询条件，如

```javascript
const where = {
  age: {
    $lte: 10 
  }
}

// 替换为
const replaceWhere = {
  age: {
    [Op.lte]: 10
  }
}
```

<!--more-->

```javascript
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $all: Op.all,
  $in: Op.in,
  ...moreAliase
}
```

简而言之，需要把本项目中的所有查询条件， 从 `operatorsAliases` 左边的替换为右边的。这也是本篇文章的主要内容

本文链接: <https://shanyue.tech/post/sequelize-op-replacement-and-sed/>

## 准备工作

在开始工作之前，需要先把 git 的工作区和暂存区清理干净，避免替换过程中造成无法回退的尴尬局面。

把工作区和暂存区清理干净的意思就是，先把能 commit 的 commit 掉，不能 commit 的 stash 掉，当然切个新分支就更好了。

## VS Code 全局替换

在刚开始随手手动替换了几个之后，觉得这样也不是办法，决定开始使用 `VS Code` 的全局替换。

首先思考一个查询的 operator 会出现的位置，无外乎以下几种

```javascript
where.age = { $lte: 10 }
where.age.$lte = 10
where.age['$lte'] = 10
```

另外，顺序很重要，从最具体到抽象的顺序如下

```javascript
['$lte', Op.lte],
['.$lte', [Op.lte]],
['$lte', [Op.lte]]
```

然后，按照顺序挨个替换就好了，但替换了几个知乎，我发现...我的耐心实在有限

```javascript
> Object.keys(operatorsAliases).length
34
```

我需要替换 `34 * 3 = 102` 次，这也不能怪我烦啊，搁谁谁都没有耐心

## 使用 sed 命令替换文件

> 多掌握一个命令是多么重要

先来一个 `hello, world` 版的 sed 命令，以下命令把 `hello` 替换成 `word`

恩，`sed` 替换的语法和 `vim` 简直一模一样，这告诉我们掌握 `vim` 多么重要...

```shell
$ echo hello | sed "s/hello/world/g"
world
```

根据上一部分所讲的规则，写一个 sed 文件 (replace.sed)，对示例(test.js)做一个测试

```sed
# replace.sed
s/'$lte'/Op.lte/g
s/.$lte/[Op.lte]/g
s/$lte/[Op.lte]/g
```

```test.js
where.age = { $lte: 10 }
where.age.$lte = 10
where.age['$lte'] = 10
```

做了简单的测试，输入以下命令，看起来工作地还不错

```shell
$ sed -f replace.sed test.js
where.age = {[Op.lte]: 10 }
where.age[Op.lte] = 10
where.age[Op.lte] = 10
```

但是有 34 个 alias 需要替换，利用浏览器的控制台生成 sed 文件

```javascript
> Object.keys(operatorsAliases).map(op => op.slice(1)).flatMap(op =>  [`s/'\$${op}\b'/Op.${op}/g`, `s/\.\$${op}\b/[Op.${op}]/g`, `s/\$${op}\b/[Op.${op}]/g`]).join('\n')
s/'$eq'/Op.eq/g
s/.$eq/[Op.eq]/g
s/$eq/[Op.eq]/g
s/'$ne'/Op.ne/g
s/.$ne/[Op.ne]/g
s/$ne/[Op.ne]/g
...
...
```

虽然生成的命令有些简单粗暴...，不过简单粗暴的东西就是好用

## 替换项目下所有文件

只剩下一个问题，如何列出当前路径下的所有文件

> 多掌握一个命令是多么重要

我把所有我能想到的命令给列下来

+ `find .` 应该可以排除掉 .gitignores 所列文件，但好像有点麻烦，我从来没用过。
+ `ls -R` 格式不够友好
+ `tree` 可读性不错，但机器可读性太差了

> 如何排除文件夹可以参考 [How to exclude a directory in find . command](https://stackoverflow.com/questions/4210042/how-to-exclude-a-directory-in-find-command)

以上三个命令都不太好用。柳暗花明又一村，这里有一个更简单而又恰到好处的命令

```shell
git ls-files
```

关于 git 的更多命令，可以参考 [Git Cheat Sheets](https://shfshanyue.github.io/cheat-sheets/git)

此时，shell 命令如下，-i 代表直接替换文件，`-i ""` 代表替换时文件名不添加后缀，为啥一定要写个空字符串，因为 MAC 下的 sed 命令就是如此丧心病狂。

```shell
$ sed -i "" -f replace.sed $(git ls-files)
```

不过，这时候有新的问题产生了，在 `git diff` 时发现有一些模板中带有 `$index` ，也会被替换成 `[Op.in]dex`，这是不期望的结果

```shell
git checkout .
```

## 使用正则匹配 

使用 \b 匹配单词，完美解决问题。

```sed
s/'\$eq\b'/Op.eq/g
s/\.\$eq\b/[Op.eq]/g
s/\$eq\b/[Op.eq]/g
```

不过，在 MAC 下并不支持 `\b`，可以拿以下命令做个试验。这时候在 MAC 下需要安装 `gnu-sed`，终于把 MAC 下的 `sed` 命令替换掉了

```shell
$ echo "hello" | sed "s/\bhello\b/world/g"
hello
$ brew install gnu-sed
$ echo "hello" | gsed "s/\bhello\b/world/g"
world

# 一定一定要用双引号括起来
$ echo "hello" | gsed s/\bhello\b/world/g
hello
```

**这里有一个很重要的点，即sed命令一定要用双引号给括起来**

使用 js 生成新的 sed 命令

```javascript
Object.keys(operatorsAliases).map(op => op.slice(1)).flatMap(op =>  [`s/'\\$${op}\\b'/Op.${op}/g`, `s/\\.\\$${op}\\b/[Op.${op}]/g`, `s/\\$${op}\\b/[Op.${op}]/g`]).join('\n')
```

最后执行命令，成功替换全部字符

```shell
# -i 代表直接替换文件，-r 代表支持扩展的正则表达式
$ gsed -i -r -f r.sed $(git ls-files| grep -v src/data)

$ git diff --shortstat
63 files changed, 293 insertions(+), 293 deletions(-)
```

## 编译

项目使用的 `typescript`，最后编译出错。还有类似以下一种情况，手动改掉

```javascript
const $or = {}
const where = {
  $or
}
```

## 附录

sed 文件如下

```sed
s/'\$eq\b'/Op.eq/g
s/\.\$eq\b/[Op.eq]/g
s/\$eq\b/[Op.eq]/g
s/'\$ne\b'/Op.ne/g
s/\.\$ne\b/[Op.ne]/g
s/\$ne\b/[Op.ne]/g
s/'\$gte\b'/Op.gte/g
s/\.\$gte\b/[Op.gte]/g
s/\$gte\b/[Op.gte]/g
s/'\$gt\b'/Op.gt/g
s/\.\$gt\b/[Op.gt]/g
s/\$gt\b/[Op.gt]/g
s/'\$lte\b'/Op.lte/g
s/\.\$lte\b/[Op.lte]/g
s/\$lte\b/[Op.lte]/g
s/'\$lt\b'/Op.lt/g
s/\.\$lt\b/[Op.lt]/g
s/\$lt\b/[Op.lt]/g
s/'\$not\b'/Op.not/g
s/\.\$not\b/[Op.not]/g
s/\$not\b/[Op.not]/g
s/'\$in\b'/Op.in/g
s/\.\$in\b/[Op.in]/g
s/\$in\b/[Op.in]/g
s/'\$notIn\b'/Op.notIn/g
s/\.\$notIn\b/[Op.notIn]/g
s/\$notIn\b/[Op.notIn]/g
s/'\$is\b'/Op.is/g
s/\.\$is\b/[Op.is]/g
s/\$is\b/[Op.is]/g
s/'\$like\b'/Op.like/g
s/\.\$like\b/[Op.like]/g
s/\$like\b/[Op.like]/g
s/'\$notLike\b'/Op.notLike/g
s/\.\$notLike\b/[Op.notLike]/g
s/\$notLike\b/[Op.notLike]/g
s/'\$iLike\b'/Op.iLike/g
s/\.\$iLike\b/[Op.iLike]/g
s/\$iLike\b/[Op.iLike]/g
s/'\$notILike\b'/Op.notILike/g
s/\.\$notILike\b/[Op.notILike]/g
s/\$notILike\b/[Op.notILike]/g
s/'\$regexp\b'/Op.regexp/g
s/\.\$regexp\b/[Op.regexp]/g
s/\$regexp\b/[Op.regexp]/g
s/'\$notRegexp\b'/Op.notRegexp/g
s/\.\$notRegexp\b/[Op.notRegexp]/g
s/\$notRegexp\b/[Op.notRegexp]/g
s/'\$iRegexp\b'/Op.iRegexp/g
s/\.\$iRegexp\b/[Op.iRegexp]/g
s/\$iRegexp\b/[Op.iRegexp]/g
s/'\$notIRegexp\b'/Op.notIRegexp/g
s/\.\$notIRegexp\b/[Op.notIRegexp]/g
s/\$notIRegexp\b/[Op.notIRegexp]/g
s/'\$between\b'/Op.between/g
s/\.\$between\b/[Op.between]/g
s/\$between\b/[Op.between]/g
s/'\$notBetween\b'/Op.notBetween/g
s/\.\$notBetween\b/[Op.notBetween]/g
s/\$notBetween\b/[Op.notBetween]/g
s/'\$overlap\b'/Op.overlap/g
s/\.\$overlap\b/[Op.overlap]/g
s/\$overlap\b/[Op.overlap]/g
s/'\$contains\b'/Op.contains/g
s/\.\$contains\b/[Op.contains]/g
s/\$contains\b/[Op.contains]/g
s/'\$contained\b'/Op.contained/g
s/\.\$contained\b/[Op.contained]/g
s/\$contained\b/[Op.contained]/g
s/'\$adjacent\b'/Op.adjacent/g
s/\.\$adjacent\b/[Op.adjacent]/g
s/\$adjacent\b/[Op.adjacent]/g
s/'\$strictLeft\b'/Op.strictLeft/g
s/\.\$strictLeft\b/[Op.strictLeft]/g
s/\$strictLeft\b/[Op.strictLeft]/g
s/'\$strictRight\b'/Op.strictRight/g
s/\.\$strictRight\b/[Op.strictRight]/g
s/\$strictRight\b/[Op.strictRight]/g
s/'\$noExtendRight\b'/Op.noExtendRight/g
s/\.\$noExtendRight\b/[Op.noExtendRight]/g
s/\$noExtendRight\b/[Op.noExtendRight]/g
s/'\$noExtendLeft\b'/Op.noExtendLeft/g
s/\.\$noExtendLeft\b/[Op.noExtendLeft]/g
s/\$noExtendLeft\b/[Op.noExtendLeft]/g
s/'\$and\b'/Op.and/g
s/\.\$and\b/[Op.and]/g
s/\$and\b/[Op.and]/g
s/'\$or\b'/Op.or/g
s/\.\$or\b/[Op.or]/g
s/\$or\b/[Op.or]/g
s/'\$any\b'/Op.any/g
s/\.\$any\b/[Op.any]/g
s/\$any\b/[Op.any]/g
s/'\$all\b'/Op.all/g
s/\.\$all\b/[Op.all]/g
s/\$all\b/[Op.all]/g
s/'\$values\b'/Op.values/g
s/\.\$values\b/[Op.values]/g
s/\$values\b/[Op.values]/g
s/'\$col\b'/Op.col/g
s/\.\$col\b/[Op.col]/g
s/\$col\b/[Op.col]/g
```

<hr/>

欢迎关注我的公众号**山月行**，我会定期分享一些前后端以及运维的文章，并且会有技术与生活上的每日回顾，欢迎关注交流

![欢迎关注公众号山月行，在这里记录我的技术成长，欢迎交流](https://shanyue.tech/qrcode.jpg)
