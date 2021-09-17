---
title: 终端复用神器 tmux 简介配置及高频操作
keywords: linux,tmux,ansible,centos中安装tmux,linux多窗口管理,终端复用,安装tmux,ansible安装tmux
description: tmux 是一个终端复用器，这也是它命名的由来 t(terminal) mux(multiplexer)，你可以在一个屏幕上管理多个终端！
date: 2019-10-23 20:00
sidebarDepth: 3
tags:
  - linux

---

# 窗口复用与 tmux

> tmux is a terminal multiplexer

`tmux` 是一个终端复用器，这也是它命名的由来 `t(terminal) mux(multiplexer)`，你可以在一个屏幕上管理多个终端！

在 `mac` 上得益于 [iterm2](https://www.iterm2.com/)，你管理多个终端窗口相当方便。但是在 linux 上，`iterm2` 就鞭长莫及了，`tmux` 的优势就显出来了。

就我理解，`tmux` 在 linux 上或者 mac 上有诸多好处

1. 分屏

    诚然，`iterm2` 也是可以做到分屏的，但是 `iterm2` 有一个缺点便是 `iterm for Mac`。如果结合 `iterm2` 与 `ssh` 的话，`iterm2` 分屏需要不断地 `ssh <server>`，导致的后果就是有多个用户连接，使用 `who` 命令查看登录用户数。

1. attach

    `attach` 可以起到保护现场的作用，不至于因 `ssh timeout`，而丧失了工作环境。

1. 操作简单，可配置化

    你可以使用快捷键很快地在多个窗口，面板间切换，粘贴复制，无限滚屏。

本章将介绍以下内容

+ contos/mac 上如何安装 `tmux` 
+ 使用 ansible 自动化批量安装 `tmux`
+ `tmux` 常用操作

至于说它高颜值，体现在可定制化样式的状态栏下，可以设置状态栏的样式, 位置，当前window的样式，状态栏信息的丰富度。比如 [gpakosz/.tmux](https://github.com/gpakosz/.tmux) 的配置

![tmux](https://cloud.githubusercontent.com/assets/553208/9890797/8dffe542-5c02-11e5-9c06-a25b452e6fcc.gif)

<!--more-->

+ 原文地址: [窗口复用与 tmux](https://shanyue.tech/op/tmux-setting.html)
+ 系列文章: [服务器运维笔记](https://shanyue.tech/op/)

## 安装

如果你在 mac 上，那么你可以使用 `brew install tmux` 安装 tmux，简单，快捷。

但是你在 centos 上，如果直接使用 `yum` 来安装软件，会安装特别旧的版本，且很多实用的功能无法使用。那么直接通过 [tmux源码](https://github.com/tmux/tmux) 自己编译安装则是一个不错的注意

```shell
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

### 使用 ansible 自动化安装

**使用源码编译安装过于琐碎且易错，又有可能需要在若干台服务器上安装 `tmux`，此时使用 `ansible` 进行自动化安装是一个不错的选择。** 关于 `ansible` 可参考本系列文章 [使用 ansible 做自动化运维](https://shanyue.tech/op/ansible-guide)。

```shell
$ git clone git@github.com:shfshanyue/ansible-op.git

# 一次性给多服务器上安装 tmux
$ ansible-playbook -i hosts tmux.yml
```

`tmux` 这个 ansible role 的配置在 [我的tmux配置](https://github.com/shfshanyue/ansible-op/blob/master/roles/tmux/tasks/main.yml) 上。配置文件如下

```yaml
# 安装依赖软件
- name: prepare
  yum:
    name: "{{item}}"
  with_items:
    - gcc
    - automake
    - libevent-devel
    # 字符终端处理库
    - ncurses-devel
    - glibc-static

# 下载 tmux 源文件
- name: install tmux
  git:
    repo: https://github.com/tmux/tmux.git
    dest: ~/Documents/tmux
    version: 2.8

- name: make tmux
  shell: sh autogen.sh && ./configure && make
  args:
    chdir: ~/Documents/tmux/

# 使 tmux 全局可执行
- name: copy tmux
  copy:
    src: ~/Documents/tmux/tmux
    dest: /usr/bin/tmux
    remote_src: yes
    mode: 0755

# 使用我的配置文件
- name: clone config file
  when: USE_ME
  git:
    repo: https://github.com/shfshanyue/tmux-config.git 
    dest: ~/Documents/tmux-config

- name: copy config file
  copy:
    src: ~/Documents/tmux-config/.tmux.conf
    dest: ~/.tmux.conf
    remote_src: yes

- name: delete tmux-config 
  file:
    name: ~/Documents/tmux-config
    state: absent
```

## 快速开始

### 术语

+ `server` 包含多个 `session`
+ `session` 包含多个 `window`
+ `window` 类似于 `iterm2` 的 `Tab`，包含多个 `pane`，以下中文会翻译为窗口
+ `pane` 类似于 `iterm2` 的 `Pane`，以下中文会翻译为面板

### 启动

```shell
# 新建一个 tmux session
$ tmux
```

### 分屏

<img width="600" src="https://raw.githubusercontent.com/shfshanyue/op-note/master/assets/tmux-split.gif" loading="lazy">

在 `tmux` 环境下使用快捷键 `prefix %` 与 `prefix "` 完成分屏

### 查看所有快捷键

<img width="600" src="https://raw.githubusercontent.com/shfshanyue/op-note/master/assets/tmux-help.jpg" loading="lazy">

`prefix ?`

## tmux 高频操作

### 向终端发送 prefix key

我习惯 `<Crtl-s>` 来作为前缀键，默认前缀建为 `<Ctrl-b>`。`send-prefix` 代表向终端发送前缀键，`send-prefix -2` 代表新增一个快捷键代表前缀键。

```shell
# 以下命令直接在 tmux 命令模式执行，或者加关键字 `tmux` 在 shell 中执行，或者写入配置文件 ~/.tmux.conf 中生效
# `prefix :` 可以进入 tmux 命令模式

$ set -g prefix2 C-s
$ bind C-s send-prefix -2
```

### 保持 ssh 连接

每次新建 `session` 的时候带上名字，方便下次 `attach` 。

稍微提一个命令 `detach`，默认快捷键 `<prefix> d`，会先 `detach` 掉当前 `session`。

> prefix 默认为 `<Ctrl-b>`

```shell
$ tmux new -s shanyue

# 或者使用快捷键 prefix + d
$ tmux detach
$ tmux attach -t shanyue
```

### 快速移动面板

移动面板命令为 `select-pane`，可配置为 `vim` 式的移动命令。

```shell
# 以下命令直接在 tmux 命令模式执行，或者加关键字 `tmux` 在 shell 中执行，或者写入配置文件 ~/.tmux.conf 中生效
# `prefix :` 可以进入 tmux 命令模式

# bind 绑定快捷键
# -r 可重复按键
# select-pane 选择面板
$ bind -r h select-pane -L 
$ bind -r l select-pane -R
$ bind -r j select-pane -D
$ bind -r k select-pane -U
```

其中，参数 `-r` 代表可重复按键，比如 `prefix r r` 表示 `prefix r， prefix r`。其中按键时间需要通过 `repeat-time` 来设置，一般为500ms。

另外，也可以开启鼠标支持，通过鼠标快速移动面板。

### 重命名窗口名

`rename-window` 为重命名窗口名的命令，默认快捷键 `prefix ,`

但是有一个小问题，每当重命名窗口名后，敲几个空格又会自动重命名，自己的辛勤工作又被破坏了...

需要配置以下两个配置把它俩给关了，终于可以重命名了

```shell
# 以下命令直接在 tmux 命令模式执行，或者加关键字 `tmux` 在 shell 中执行，或者写入配置文件 ~/.tmux.conf 中生效
# `prefix :` 可以进入 tmux 命令模式

set -wg allow-rename off                                                            
set -wg automatic-rename off
```

### 开启鼠标支持

```shell
$ tmux set -g mouse on
```

鼠标支持默认是关闭的，开启鼠标后，支持复制，翻屏，切换面板，切换窗口，resize。

鼠标支持的功能很强大，至此已经成功打造了一个 `iterm2` 了。不过鼠标模式我不大喜欢，所以还是禁了。

何况，开启鼠标支持后，谁都可以操作我的终端了，一点逼格也没有了

### 保留当前路径

新开 `pane` 和 `window` 时，保持当前路径。为以前的命令添加参数 `-c`，表明新建窗口或者面板的路径。

新开面板的命令为 `split-window`

```shell
# 以下命令直接在 tmux 命令模式执行，或者加关键字 `tmux` 在 shell 中执行，或者写入配置文件 ~/.tmux.conf 中生效
# `prefix :` 可以进入 tmux 命令模式

bind c new-window -c "#{pane_current_path}"
bind % split-window -h -c "#{pane_current_path}"
bind '"' split-window -c "#{pane_current_path}"
```

### 最大化当前面板

命令为 `tmux resize-pane -Z`，默认快捷键为 `prefix z`。需要查看更加详细的信息时可以按 `prefix z` 进入全屏，完毕之后，再按一次恢复。相当酷的一个功能。

### 翻屏

第一次使用 `tmux` 时， 使用`webpack`，输出信息很多，而有用的错误信息被覆盖。此时，往上翻屏就很重要了。此时要说下 `tmux window` 下的两种模式，

+ `default-mode`

    就是刚进入 `tmux` 默认的模式。

+ `copy-mode`

    按 `prefix [` 键进入此模式，类似于 `vi(emacs)` 的 `normal mode`，支持复制，粘贴，查找，以及翻页。具体是 `vi` 还是 `emacs` 可以根据以下命令探知，表明查看全局窗口设置 `mode-keys`，默认会是 `vi`，如果不是，那就请设置为 `vi` 吧~
    ``` shell
    $ tmux show-window-options -g mode-keys
    ```
    与 `vi` 命令相同，如上下翻页(半屏)可使用 `C-d` 以及 `C-u`，当然你也可以使用 `hjkl`。

另外，也可以开启鼠标支持，使用滚轮来翻屏。

### 复制与粘贴

上边说到 `copy-mode`，接下来是复制与粘贴。进入 `copy-mode` 后，`v` 开始选中，`y` 来进行复制并会退出 `copy-mode`。使用 `prefix ]` 来进行粘贴。

**在 linux 下复制粘贴是最重要最实用的功能了**

`v & y` 为自定义配置，配置如下

```
bind -t vi-copy v begin-selection
bind -t vi-copy y copy-selection
```

复制操作会把内容存进 `buffer` 里，熟悉以下几个命令能够更熟练地操作 buffer

```shell
$ tmux list-buffers           # 列出所有 buffer
$ tmux show-buffer -b [name]  # 显示最近 buffer,也可指定 buffer name
$ tmux choose-buffer　　    　# 进入选择 buffer 界面，更加灵活
```

另外，也可以开启鼠标支持，用鼠标来选择文字。

### 查找关键字

既然进入 `copy-mode`，熟悉 `vi` 的朋友一定知道查找是 `/` 与 `?`。

### 快速定位窗口

假设你新建了多个窗口，需要快速定位到某一个窗口，而你虽知道那个窗口中的内容，却忘了窗口号，这样如何解决呢？

有一个很好的解决方案的命令便是 `find-window`，更好用的便是默认的快捷键 `prefix f`。输入窗口内容的关键字，便可以快速定位到窗口，不过有一个小小的缺点，便是**不能定位到面板！**

### Last but not least

**man tmux ！** 不看文档不足以熟练，不看源码不足以精通。所以，平常需要多看几眼文档，多瞧几个命令。

## 小结

通过本章你可以很熟练地在服务器中使用 tmux 同时管理多个窗口，再结合 vim 的使用就可以使在服务器里工作达到随心所欲的地步了。关于 vim 的使用，配置以及插件，可以参考上一章 [vim 快速上手，配置以及插件](https://shanyue.tech/op/vim-setting)。
