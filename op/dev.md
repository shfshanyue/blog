---
title: 打造强大炫酷的终端开发体验
alias: 前端也应该学点 Linux
---

本篇文章适用于 `Windows`(WSL)、`MacOS`(个别命令所有区别) 及 `Ubuntu` 及各种 Linux 发行版。

本篇文章既适用于刚入门的前端小白，也适用于工作五年的资深工程师。

## 命令行基础

### 善用帮助文档及搜索

1. 使用 `--help` 获取该命令的参数及参数释义
1. 使用 `man` 获取该命令的帮助手册

``` bash
$ ls --help

$ man ls
```

如果一个命令过长怎么处理？

``` bash
$ for user in $(cut -f1 -d: /etc/passwd); do crontab -u $user -l 2>/dev/null; done
```

别慌，山月助你祭出大杀器: [ExplainShell](https://explainshell.com/)。将对命令行的每个参数逐词解释。

![explain-shell](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/explain-shell.o3hf6xrgs9s.png)

### 使用命令行管理文件及目录，而非文件管理器

在终端高频使用以下命令管理自己的目录，而非通过文件管理器

+ `ls`: 列出该目录下所有文件
+ `cd`: 进入指定目录
+ `rm`: 删除指定文件
+ `mkdir`: 创建目录
+ `less`: 查看文件
+ `head`: 查看文件前几行
+ `tail`: 查看文件后几行
+ `stat`: 了解该文件的详细信息

## 熟悉本机状态相关命令

+ `uname -a`: 查看内核版本号等信息
+ `free`: 查看内存信息 (mac不适用)
+ `du`: 查看硬盘信息
+ `top`: 交互式查看进程信息
+ `uptime`: 开机时间与平均负载
+ `who`: 查看用户

## 熟悉网络相关命令

+ `dig`: dns 解析
+ `curl`: http 请求，高频使用，务必掌握
+ `netstat`: 网络统计相关信息
+ `lsof -i:3000`: 列出 3000 端口对应的进程
+ `ifconfig`

### 熟悉 Glob

如何列出当下目录下所有 .js 文件？

这就是 glob 了

``` bash
$ la -lah **/*.js
```

### 熟悉 Braces

顾名思义，就是用大括号包裹的表达式

``` bash
$ echo {2..10..2}
2 4 6 8 10

$ echo {a..e}
a b c d e

$ echo {a, c, z}
a c z
```

### 了解环境变量

了解如何设置并且读取环境变量

``` bash
# 列出所有环境变量
$ env

# 输出 HOME 环境变量
$ echo $HOME

# PATH 为全局命令所在的路径
$ echo $PATH

# 设置一个环境变量
$ export NAME=shanyue && echo $NAME

# 这样也可以设置一个环境变量
$ NAME=shanyue && echo NAME
```

## 选择个人喜爱的 shell 工具

如果不出意外，`bash` 将是我们的默认 `shell` 工具，`bash` 功能强大，但需要极高的能力方能驾驭，且不够炫酷。

> PS: 用于生产的 Linux 既不需要炫酷，也不建议安装多余的 shell。而基于开发的 Linux，炫酷的功能

1. 如何智能自动补全
1. 如何标明当前 git 状态
1. 选择丰富多样 shell 主题

基于这些考虑，可选择以下 `shell`。

+ `zsh`
+ `fish`

注意: 当你切换了 shell，你 shell 的默认配置将由 `~/.bashrc` 改为 `~/.zshrc` (假如改成了 zsh)

### oh-my-zsh

功能强大、主题丰富、插件众多，可极大提高开发体验，是**我**作为终端主题及配置的不二之选。

``` bash
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

![丰富的主题](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/image.6pq9j4lvgls0.png)

## 熟悉 vim

![vim](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/vim.1blolxwo7z28.png)

你现在在用什么编辑器？

`VS Code`、`Eclipse`、`Sublime`，还是 `Vim`？

比 vim 强大的编辑器数不胜数，比 vim 快捷键功能强大的编辑器绝无仅有。

在终端，在生产环境中，vim 是唯一选择。且，vim 插件是所有编辑器中最受欢迎的插件之一，它的功能强大可见一斑。

为了提高你的 vim 水平，可通过以下两个操作:

1. 禁用上下左右进行移动
1. 把 vim 作为你编辑器的编辑模式

### 快速移动

+ **上(k)下(j)左(h)右(l)** 移动，需要注意，**禁止使用上下左右箭头**
+ 减少上一步的左右移动，效率太低，使用 `b, B, w, W` 代替
+ 使用 `f, F, t, T` 进行更为精细的左右移动控制
+ 使用 `0, $` 进行行首行尾移动
+ 使用 `%` 快速移动到配对字符
+ 使用 `<Ctrl-d>，<Ctrl-u>` 进行大范围上下移动
+ 使用 `gg, G` 进行首行尾行移动

### 高频操作

以下是我在使用 vim 过程中每天都会使用无数次的高频操作

+ `:w` 快速保存
+ `<C-[>` 退出 insert 模式，与 `esc` 类似
+ `gg` 快速移动到文件首
+ `G` 快速移动至文件尾
+ `<c-o>` 移动至最近一次位置
+ `zz` 把光标移动至本屏中间
+ `:12` 快速移动至特定行
+ `dd` 剪切本行
+ `yy` 复制本行
+ `yi{` 复制括号中内容
+ `=i{` 自动缩进
+ `*` 快速查找关键字，类似于sublime/vscode 的 `Command + d`
+ `:noh` 取消关键字高亮
+ `o` 快速进入 insert 模式，并定位到下一行
+ `u` 撤销


## 熟悉 tmux (可选)

你有可能没听过 `tmux`，但你知道它强大的功能，你将会对它倍加青睐。

![Tmux](https://cloud.githubusercontent.com/assets/553208/9890797/8dffe542-5c02-11e5-9c06-a25b452e6fcc.gif)

它是在 linux 中用以管理多窗口特别使用的工具！

它可以在终端打开多个标签页，每个标签页打开多个面板，开发还是调试都是十分方便。

如果你在使用 mac，那你可以考虑使用 iterm2 达到相同的功能。


``` bash
# 安装软件依赖
$ yum install -y gcc automake libevent-devel ncurses-devel glibc-static

# 下载源代码
$ git clone git@github.com:tmux/tmux.git

# 切换到 2.8 版本
$ git checkout 2.8
$ cd tmux

# 编译源码
$ sh autogen.sh && ./configure && make

# 查看版本号
$ ./tmux -V
tmux 2.8
```

## 把终端作为开发必备工具

由于编辑器功能的强大，完全不使用终端也可以完成工作。

1. 在编辑器中利用插件 GUI 方式运行代码
1. 在编辑器中利用插件 GUI 方式提交代码

但如果作为一名立志于学习 Linux 命令行工具的开发者，我强烈建议使用终端。特别大多数编辑器与终端集成，也可以使用集成式的终端。

1. 在终端检查进程内存、CPU 信息等
1. 在终端维护多个项目，每个项目一个标签页。打开单独面板，在终端中运行项目。使用 `code .`(在 vscode 中) 打开项目在编辑器中进行开发。
1. 在终端进行提交代码 (集成终端)
