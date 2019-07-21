---
title: vim 高频操作，常用配置与插件简介
keywords: vim,linux,vim插件,vim前端,vim常用快捷键,vim高级技巧,vim配置
description: 当你有一个服务器，或者运维若干服务器时，没有什么比不够熟练 vim 更让人难受和窝心的事情了。而在各种编辑器中 vim 模式也大受欢迎。因此，学习 vim 是很有必要的。
date: 2019-10-12 23:00
sidebarDepth: 3
tags:
  - linux

---

如果你是一个运维，当你拥有一个服务器，或者运维若干服务器时，没有什么比不够熟练 vim 更让人难受和窝心的事情了。

而如果你是一个开发，而在各种编辑器中 vim 模式也大受欢迎。因此，学习 vim 是很有必要的。

本章旨在如何快速的上手 vim，主要体现在以下三个方面

1. 无插件零配置时如何灵活使用 (即各种编辑器的 vim mode)
1. 常用配置简介
1. 常用插件简介

掌握了vim 无插件零配置的操作，能大大提高程序员在各种编辑器中敲代码的效率。

了解了 vim 常用的配置，你将把 `vim` 用的很舒服，如沐春风。

而了解了常用插件，你将可以把它打造成一个适合自己的 IDE 工具。但往往来说，它对于服务器运维好处有限，对敲代码的程序员，往往也不如一个专用语言的 IDE 工具强大。不过，它有一个最大的好处，就是可以满足马斯洛需求层次理论中的自我需求: 装逼。这也是我会使用它的原因。

<!--more-->

+ 原文地址: [使用 vim 及其配置](https://shanyue.tech/op/vim-setting.html)
+ 系列文章: [我的服务器运维笔记](https://shanyue.tech/op/)

## 高频操作

以下是我在使用 vim 过程中每天都会使用无数次的高频操作

+ `:w` 快速保存
+ `<C-[>` 退出 insert 模式，与 `esc` 类似
+ `0` 快速移动到行首
+ `gg` 快速移动到文件首
+ `G` 快速移动至文件尾
+ `<c-o>` 移动至最近一次位置
+ `zz` 把光标移动至本屏中间
+ `:12` 快速移动至特定行
+ `dd` 剪切本行
+ `yy` 复制本行
+ `yi{` 复制括号中内容
+ `=i{` 自动缩进
+ `<c-p>` 自动补全
+ `"*yy` 复制到系统剪切板
+ `*` 快速查找关键字，类似于sublime/vscode 的 `Command + d`
+ `:noh` 取消关键字高亮
+ `o` 快速进入 insert 模式，并定位到下一行
+ `u` 撤销

## 无插件零配置操作

### 快速移动

**快速移动是 vim 的重中之重，比一切插件都要重要**。也是下编辑和修改的基础。

+ **上(k)下(j)左(h)右(l)** 移动，需要注意，禁止使用上下左右箭头

    如果需要移动数行，可以在操作前加数字。如 `10j` 代表往下移动十行。 **通过数字与操作结合，这是 vim 的思想。**

+ 减少上一步的左右移动，效率太低，使用 `b, B, w, W` 代替

    `b` 指 back a word，退回一个单词。`w` 指 forward a word，前进一个单词。
    `B` 指 back a WORD，退回一个大单词。`w` 指 forward a WORD，前进一个大单词。

    > 其中，word 以及 WORD 的区别，以一个示例说明。 hello.world 有三个 word ('hello', '.', 'world')，却只有一个 WORD。

+ 使用 `f, F, t, T` 进行更为精细的左右移动控制

    `f` 指 find a character，快速移动到下一个字符的位置，`F` 指向前查找。结合 `b, w` 实现快速左右移动。
    `t` 指 tail a character，快速移动到下一个字符位置的前一个字符，`T` 指向前查找。

+ 使用 `0, $` 进行行首行尾移动

+ 使用 `%` 快速移动到配对字符

    如从左括号快速移动到右括号，左引号快速移动到右引号，在编码中最为常用！

+ 使用 `<Ctrl-d>，<Ctrl-u>` 进行大范围上下移动

    `<Ctrl-d>` 往下移动半页，`<Ctrl-u>` 往上移动半页。

    > 也可以使用 `<Ctrl-f>, <Ctrl-b>` 进行整页移动。

+ 使用 `gg, G` 进行首行尾行移动

+ `:128` 表示快速定位到 128 行，目前只在 debug 中使用

+ `zz` 快速定位当前光标至当前屏幕中间，`zb` 定位当前光标至屏尾，`zt` 定位当前光标至屏首

+ `*` 定位当前光标下的单词，并指向下一个，`#` 指向上一个

+ `gd` 在编码中常用，定位当前变量的申明位置，`gf` 定位到当前路径所指向的文件。

+ 最后如果你发现定位错了，可以使用 `<Ctrl>-o` 回到光标的上一位置

### 编辑

vim 的编辑在 `Insert Mode`，以上的快速移动是在 `Normal Mode`。编辑文本需要首先进入 `Insert Mode`。

`i, I, a, A, o, O` 进入 `Insert Mode`。

`i` 指 insert text，在该光标前进行编辑，`I` 指在行首进行编辑。
`a` 指 append text，在该光标后进行编辑，`A` 指在行尾进行编辑。
`o` 指 append text，在该光标后一行进行编辑，`O` 指在光标前一行进行编辑。

个人习惯，`i, A, o, O` 用的多一些，`I, a` 基本不用。

`Esc` 以及 `<Ctrl-[>` 都可以退出 `Insert Mode`。

个人习惯使用 `<Ctrl-[>`，一来 `Esc` 过远，二来在一些编辑器中 `Esc` 容易与其它热键冲突。

### 修改

删除也可以在 `Insert Mode` 使用 `delete` 键进行手动删除，不过效率太低，建议一般在 `Normal Mode` 进行删除，刚进入 vim 的状态便是 `Normal Mode`。

+ 使用 `x(dl)` 删除特定字符

    可以结合 `x` 以及上述所讲的快速移动，删掉光标下的特定字符

    在括号里标注 `l`，意指 `x` 为 `dl` 的简写。

    **`d` 指 `delete`，表示删除，是所有修改操作的基础。`dl` 由 `d` 和 `l` 两个操作组成，代表删掉光标右侧的字符，同理，`dh` 代表删掉光标左侧的字符，这是所有删除的基本形式，也是 vim 的核心思想。**

+ 使用 `daw` 删除特定单词

    `daw` 指 `delete a word`，表示删除特定单词。同样也可以使用 `db, dw` 来删除单词。

+ 使用 `dt, df` 加特定字符，删掉字符前的文本

+ 使用 `di(, da(` 删除特定符号内的文本，如删除括号，引号中的文本

    `di(` 指 `delete in (`，不会删掉括号。`da(` 指 `delete a (`，会连同括号一同删掉。同理还有 `di'`，`di"` 等，在编码中最为常用！

+ 使用 `D (d$)` 删除掉该字符以后的所有文本

+ 使用 `dd` 删掉整行

+ **把以上操作的所有 d 替换为 c，表示删除后进入编辑模式**

    `c` 指 `change`，表示删除，如 `d` 一样，是 vim 的基本动词

+ 使用 `r` 加特定字符，表示使用特定字符代替原有字符

### 文件以及多窗口

+ 使用 `:Ex (Explore)` 浏览目录

    定位到文件所在行，回车进入指定文件

+ 使用 `:ls` 列出缓冲列表

    缓冲列表中保存最近使用文件，行头有标号

+ 使用 `:bn` 进入最近使用文件

    `bn` 指 `buffer next`，进入缓冲列表的下个缓冲，即最近一次使用文件

+ 使用 `:b[N]` 进入缓冲列表中标号为 N 的文件

    `b 10` 指 `buffer 10`，进入缓冲列表，即最近一次使用文件

+ 使用 `:sbn, :vbn` 在新窗口打开最近使用文件

    `s` 指 `split`，水平方向。
    `v` 指 `vertical`，垂直方向。

+ 使用 `:on(ly)` 只保留当前窗口

### 基本操作

基本操作指查找，替换，撤销，重做，复制，粘贴，保存等

+ `/{pattern}` 查找

    `/` 后加需要查找的词或者正则表达式进行查询，`n` 向下查询，`N` 向上查询。

+ `:s/aa/bb/g` 替换

    `s` 指 `substitute` 的缩写，替换，`g` 代表全局替换。

+ `u` 撤销

    `u` 指 `undo` 的缩写，撤销。可与数字结合进行多次撤销。

+ `<Ctrl-r>` 重做

+ `yy` 复制整行

    `y` 指 `yank`，复制。使 `y` 与快速移动结合起来，可以使用多种情况的复制，如复制括号中内容，复制引号中内容。

    复制时，会把当前内容置入寄存器，使用 `:reg` 查看寄存器列表。

+ `p` 粘贴

    `p` 指 `paste`，粘贴。

+ `"*y` 复制内容至系统剪切板

    `:reg` 会列出寄存器列表，`"*` 寄存器代表系统剪切板()，所以以上就是把内容放到系统剪切板。

    如果寄存器列表中没有该寄存器，则 vim 不支持系统剪切板，也可以使用命令 `vim --version | grep clipboard`。

+ `"*p` 粘贴系统剪切板中内容

## 常用配置

### 1tab == 2space

```vim
set expandtab
set smarttab
set shiftwidth=2
set tabstop=2
```

### 保留操作记录

当关闭文件并再次进入时，可以使用 `u` 进行撤销动作

```vim
set undofile
set undodir=~/.vim-config/undo_dirs
```

### 不生成交换文件

```vim
" 不产生交换文件(当打开一个文件未正常关闭时会产生交换文件)
set noswapfile
```

## 常用插件

以下是在 [我的vim配置](https://github.com/shfshanyue/vim-config) 中所使用的插件，关于快捷键有可能经过我自定义。

### [nerdtree](https://github.com/scrooloose/nerdtree)

<img width="600" src="https://raw.githubusercontent.com/shfshanyue/op-note/master/assets/vim-nerdtree.gif" loading="lazy">

文件管理器

+ `,nn` 切换文件管理器窗口，类似于sublime的 `Command + k + b`
+ `,nf` 定位当前文件的位置

在文件管理窗口

+ `ma` 新建文件或文件夹
+ `md` 删除文件或文件夹
+ `I` 切换隐藏文件显示状态

### [ctrlp.vim](https://github.com/kien/ctrlp.vim)

<img width="600" src="https://raw.githubusercontent.com/shfshanyue/op-note/master/assets/vim-ctrlp.gif" loading="lazy">

ctrlp，类似于sublime的ctrlp

+ `<c-p>` 在当前项目下查找文件
+ `,b` 在buffer中查找文件
+ `,f` 在最近打开文件中查找

在ctrlp窗口中，`<c-j>` 和 `<c-k>` 控制上下移动。

### [ag.vim](https://github.com/rking/ag.vim)

<img width="600" src="https://raw.githubusercontent.com/shfshanyue/op-note/master/assets/vim-ag.gif" loading="lazy">

查找关键字，类似于sublime的 `Command + Shift + f`

+ `Ag key *.js` 在特定文件下查找关键字

注：首先需要安装 [the_silver_searcher](https://github.com/ggreer/the_silver_searcher)

### [vim-commentary](https://github.com/tpope/vim-commentary)

注释命令

+ `:gcc` 注释当前行，类似于sublime的 `<c-/>`

### [vim-fugitive](https://github.com/tpope/vim-fugitive)

<img width="600" src="https://raw.githubusercontent.com/shfshanyue/op-note/master/assets/vim-git.gif" loading="lazy">

git扩展

+ `:Gblame` 查看当前行的归属
+ `:Gdiff` 查看与工作区文件的差异
+ `:Gread` 相当于 `git checkout -- file`
+ `:Gwrite` 相当于 `git add file`

### [syntastic](https://github.com/vim-syntastic/syntastic)

语法检查插件，设置eslint

+ `:SyntasticCheck` 语法检查，默认会在保存时进行语法检查，不过会有卡顿
+ `:lne[xt]` 下一处语法错误
+ `:lp[revious]` 上一处语法错误
+ `:! eslint %:p --fix` 自动修正错误

### [emmet-vim](https://github.com/mattn/emmet-vim)

+ `<c-y>,` 类似于sublime的 `<c-e>`

### [delimitMate](https://github.com/Raimondi/delimitMate)

括号，引号自动补全

### [goyo](https://github.com/junegunn/goyo.vim)

<img width="600" src="https://raw.githubusercontent.com/shfshanyue/op-note/master/assets/vim-goyo.png" loading="lazy">

+ `:Goyo` 切换至 gotyo 模式

### [vim-colors-solarized](https://github.com/altercation/vim-colors-solarized)

<img width="600" src="https://raw.githubusercontent.com/shfshanyue/op-note/master/assets/vim-dark.png" loading="lazy">

可更改配置文件中 background 为 `dark` 和 `light` 切换主题

## 小结

通过本章你可以很熟练地在服务器中使用 vim 编辑文本，如果有必要的话还可以在 linux 中使用 vim 进行编程。但是在服务器中除了需要熟练地使用 vim 外，更需要应付多窗口管理，可以参考下一章 [tmux 与多窗口管理](https://shanyue.tech/op/tmux-setting)。
