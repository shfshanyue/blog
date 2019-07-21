---
title: "Tmux: 打造精致与使用共存的终端"
date: 2017-01-21
categories:
  - 前端
  - 后端
  - 运维
tags:
  - devops
---

由于最近需要经常 `ssh` 到远程环境，遂趁此折腾了一番 `tmux`。毕竟 **工欲善其事，必先利其器**

<!--more-->

以下是我的配置文件地址，并在不断摸索与更新中。特别喜欢 `solarized` 主题，于是参考它配了状态栏的主题。在后边我会列出一些平时使用的技巧，并且欢迎补充~ 如果能够帮到你的话，希望点一个赞或者star

+ [https://github.com/shfshanyue/tmux-config](https://github.com/shfshanyue/tmux-config)

先放张截图，先睹为快，这是在 `Mac` 下的截图。

![tmux in mac](https://shanyue.tech/post/tmux-start/screen.jpeg)

> 本文链接: <https://shanyue.tech/post/tmux-start/>

## 简介
**tmux is a terminal multiplexer**

`tmux` 是一个终端复用器，你可以在一个屏幕上管理多个终端！

就我理解，`tmux` 有以下三大好处
 1. 分屏
    诚然，`iterm2` 也是可以做到分屏的，但是 `iterm2` 有一个缺点便是 `iterm for Mac`。
    而且，`iterm2` 分屏也需要不断地 `ssh <server>`。导致的后果就是有多个用户连接，使用 `ps aux | grep sshd | grep -v grep` 查看连接数。
 3. attach
`attach` 可以起到保护现场的作用，不至于因 `ssh timeout`，而丧失了工作环境。
 4. 可配置化

## 基础
### 启动
新建一个 tmux session，不过建议您使用以下 Tips 1 来新建
```
$ tmux      # 新建一个 tmux session，不过建议您使用以下 Tips 1 来新建。
```
### 术语
+ server 包含多个 `session`
+ session 包含多个 `window`
+ **window** 类似于 `iterm2` 的 `Tab`，包含多个 `pane`，以下中文会翻译为窗口
+ **pane** 类似于 `iterm2` 的 `Pane`，以下中文会翻译为面板

### 常见命令
+ **bind-key (bind)**　：绑定快捷键，按 `prefix` 键与快捷键触发。
+ **set-option (set)** : 设置选项
+ **source-file (source)** : 生效当前配置文件
+ **new-window** : 新建窗口，默认快捷键 `prefix c`
+ **split-window** : 分屏

## 自定义状态栏
喜欢 `solarized` 主题，但是背景色在终端下不大漂亮，选择了 `tomorrow` 中的一个背景色替代。

### message-command-style
设置状态栏信息的样式，以逗号分隔，可设置前景色 `fg`，背景色 `bg`，与文字修饰，如斜体 `italics`，粗体 `bold` 等等。如下例

```
"fg=yellow, bg=#abcdef, underscore"
```

### 自定义状态栏
可以自定义状态栏的内容，如窗口号，窗口名，host，用电量，时间等等。

+ `#{host}`
`tmux` 会提供一些关于自身状态的变量，比如 `session-name`，`window-name`，`host` 等等。比如以 `#{host}` 这种形式来代替 `host`，`#{window-name}` 代替 `window-name`。 
+ `#(uptime)`
除了在状态栏中 `tmux` 相关信息，有时还需要取到系统相关信息，如开机时间，当前用户。这些系统命令可以表示为 `#(uptime)`。


```
set -g message-style "bg=#00346e, fg=#ffffd7"        # tomorrow night blue, base3

set -g status-style "bg=#00346e, fg=#ffffd7"   # tomorrow night blue, base3
set -g status-left "#[bg=#0087ff] ❐ #S "       # blue
set -g status-left-length 400
set -g status-right "#{?client_prefix, ~ , } #[bg=#0087ff] #h #[bg=red] %Y-%m-%d %H:%M "
set -g status-right-length 600

set -wg window-status-format " #I #W "
set -wg window-status-current-format " #I #W "
set -wg window-status-separator ""
set -wg window-status-current-style "bg=red" # red
set -wg window-status-last-style "fg=red"
```

## Tmux Tricks
### 保持 `ssh` 连接
每次新建 `session` 的时候带上名字，方便下次 `attach` 。稍微提一个命令 `detach`，默认快捷键 `prefix d`，会先 `detach` 掉当前 `session`。
```
$ tmux new -s shanyue
$ tmux detach
$ tmux attach -t shanyue
```

### 快速移动面板
移动面板命令为 `select-pane`，可配置为 `vim` 式的移动命令。
```
bind -r h select-pane -L 
bind -r l select-pane -R
bind -r j select-pane -D
bind -r k select-pane -U
```

其中，参数 `-r` 代表可重复按键，比如 `prefix r r` 表示 `prefix r， prefix r`。其中按键时间需要通过 `repeat-time` 来设置，一般为500ms。

另外，也可以开启鼠标支持，通过鼠标快速移动面板。

### 向终端发送 `prefix key`
我习惯 `Crtl-s` 来作为前缀键，`send-prefix` 为向终端发送前缀键的命令。
```
set -g prefix2 C-s                                                             
bind C-s send-prefix -2
```

### 重命名窗口名
`rename-window` 为重命名窗口名的命令，默认快捷键 `prefix ,`。

但是有一个小问题，每当重命名窗口名后，敲几个空格又会自动重命名，自己的辛勤工作又被破坏了...

需要配置以下两个配置把它俩给关了，终于可以重命名了

```
set -wg allow-rename off                                                            
set -wg automatic-rename off
```

### 配置编辑和重启快捷键
把打开和重启配置文件设为快捷键可以快速提高配置效率。设置 `prefix r` 重启并更新配置，便于调试配置文件。`prefix e` 打开配置文件。

`source ~/.tmux.conf` 使配置文件生效，即重启配置。
`new-window -n <window-name> command` 新建窗口，并设置窗口名，`-n`
 代表新建的窗口名

```
bind r source ~/.tmux.conf\; display "tmux config sourced"
bind e neww -n tmux-config "\${EDITOR:-vim} ~/.tmux.conf
```

### 开启鼠标支持
`$ tmux set -g mouse on`

鼠标支持默认是关闭的，开启鼠标后，支持复制，翻屏，切换面板，切换窗口，resize。

鼠标支持的功能很强大，至此已经成功打造了一个 `iterm2` 了。不过鼠标模式我不大喜欢，所以还是禁了。

何况，开启鼠标支持后，谁都可以操作我的终端了，一点逼格也没有了

### 保持当前路径
新开 `pane` 和 `window` 时，保持当前路径。为以前的命令添加参数 `-c`，表明新建窗口或者面板的路径。

新开面板的命令为 `split-window`
```
bind c new-window -c "#{pane_current_path}"
bind % split-window -h -c "#{pane_current_path}"
bind '"' split-window -c "#{pane_current_path}"
```

### 最大化当前面板
命令为 `tmux resize-pane -Z`，默认快捷键为 `prefix z`。需要查看更加详细的信息时可以按 `prefix z` 进入全屏，完毕之后，再按一次恢复。相当酷的一个功能。

### 翻屏

第一次使用 `tmux` 时， 使用`webpack`，输出信息很多，而有用的错误信息被覆盖。此时，往上翻屏就很重要了。此时要说下 `tmux window` 下的两种模式，

+ default-mode

    就是刚进入 `tmux` 默认的模式。

+ **copy-mode:**

    按 `prefix [` 键进入此模式，类似于 `vi(emacs)` 的 `normal mode`，支持复制，粘贴，查找，以及翻页。具体是 `vi` 还是 `emacs` 可以根据以下命令探知，表明查看全局窗口设置 `mode-keys`，默认会是 `vi`，如果不是，那就请设置为 `vi` 吧~
    ``` 
    $ tmux show-window-options -g mode-keys
    ```
    与 `vi` 命令相同，如上下翻页(半屏)可使用 `C-d` 以及 `C-u`，当然你也可以使用 `hjkl`。

另外，也可以开启鼠标支持，使用滚轮来翻屏。

### 复制与粘贴
上边说到 `copy-mode`，接下来是复制与粘贴。进入 `copy-mode` 后，`v` 开始选中，`y` 来进行复制并会退出 `copy-mode`。使用 `prefix ]` 来进行粘贴。

`v & y` 为自定义配置，配置如下
```
bind -t vi-copy v begin-selection
bind -t vi-copy y copy-selection
```

复制操作会把内容存进 `buffer` 里，熟悉以下几个命令能够更熟练地操作 buffer
```
$ tmux list-buffers          # 列出所有
$ tmux show-buffer -b [name] # 显示最近 buffer,也可指定 buffer name
$ tmux choose-buffer　　    　# 进入选择 buffer 界面，更加灵活
```

另外，也可以开启鼠标支持，用鼠标来选择文字。

### 查找关键字
既然进入 `copy-mode`，熟悉 `vi` 的朋友一定知道查找是 `/` 与 `?`。

### 快速定位窗口
假设你新建了多个窗口，需要快速定位到某一个窗口，而你虽知道那个窗口中的内容，却忘了窗口号，这样如何解决呢？

有一个很好的解决方案的命令便是 `find-window`，更好用的便是默认的快捷键 `prefix f`。输入窗口内容的关键字，便可以快速定位到窗口，不过有一个小小的缺点，便是**不能定位到面板！**

### Last but not least
**man tmux ！** **不看文档不足以熟练，不看源码不足以精通。**所以，平常需要多看几眼文档，多瞧几个命令。

## 扩展
+ [practical-tmux](https://www.mutelight.org/practical-tmux)
+ [gpakosz/.tmux (stars 1569)](https://github.com/gpakosz/.tmux)
+ [tmux-resurrect 保护和恢复工作状态](https://github.com/tmux-plugins/tmux-resurrect)
