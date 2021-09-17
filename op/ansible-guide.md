---
title: ansible 自动化运维指南
keywords: linux,ansible,自动化运维,ansible安装
desription: 使用 ansible 可以进行批量配置，批量安装软件，省了一大部分繁琐的重复工作，提高了管理服务器的效率。本章介绍如何使用 ansible 的安装以及关于 ansible 的基本功能。建议拥有云服务器的同学都可以学习一下 ansible
recommend:
  - 对ansible各个组件进行简单介绍，通俗易懂
  - 一个小的实例讲解如何使用ansible做自动化运维
date: 2019-10-23 22:00
tags:
  - devops
  - linux

---

# ansible 简易入门

使用 ansible 可以进行批量配置服务器，批量安装软件，省了一大部分繁琐的重复工作，提高了管理服务器的效率。

简单点说，使用 ansible 可以一键配置好你所有服务器的一切配置及软件安装，如 `vim`，`git`, `tmux`，`python`，`c++`，`nginx`，`docker` 等。如果你对它情有所钟，你还可以使用它自动部署应用至多台服务器。(目前建议通过 k8s 及 CI 做自动部署)

本章介绍如何使用 `ansible` 的安装以及关于 `ansible` 的基本功能，建议拥有云服务器的同学都可以尝试一下 `ansible`，你会发现宝藏的。

<!--more-->

+ 原文链接: [使用 ansible 做自动化运维](https://github.com/shfshanyue/op-note/blob/master/ansible-guide.md)
+ 系列文章: [服务器运维笔记](https://github.com/shfshanyue/op-note)

## 自动化运维的必要性

我现在有两个云服务器用来瞎折腾，装的都是 centos 系统。而我在两个服务器上都会装上 `tmux`，用作多窗口管理工具。

但在有了服务器的早期有可能各种乱折腾，又需要多次重装系统，而每次重装系统，又需要重装一遍 `tmux`。

这就会造成一件重复度极高的事情: 安装 `tmux`。

如果在 centos 中安装 `tmux` 能够直接使用 `yum install tmux` 也就罢了，但是安装 tmux 也是一件极为琐碎的事情。

根据我在本系列文章 [窗口复用与 tmux](https://shanyue.tech/op/tmux-setting) 中提到一个 `tmux` 的安装步骤

1. 安装依赖 package
1. 在 github 下载源代码，编译安装
1. 在 github 下载配置文件

**而且，在多个服务器和多次重装过程中，有可能重复以上安装步骤 N 次。**

于是自动化运维存在的意义就体现了出来，它可以直接使用一条命令便完成所有服务器的安装过程

## ansible 安装及配置

ansible 是使用 python 写的一个做自动化运维的工具。在使用 ansible 之前需要明白以下两个概念

+ 本地环境: 即你的 PC，mac 或者是跳板机，在本地环境需要安装 ansible
+ 远程服务器: 在远程服务器会部署自己的服务，跑应用，也是需要被管理的服务器。在远程服务器中不需要装任何应用

ansible 工作在 ssh 协议上，它只需要满足两个条件

### 1. 在本地环境安装 ansible

在 mac 上，直接通过 `brew install ansible` 就可以完成安装。

如果不是 mac，可以参考 [官方安装指南](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#intro-installation-guide)

不过本地环境大多都是 `mac` 或者 `windows`

### 2. 在本地能够 ssh 到远程服务器

通过配置 `~/.ssh/config` 与 `ssh key` 可以达到直连免密的效果，具体参考本系列的第一篇文章 [云服务器初始登录配置](https://shanyue.tech/op/init)

`~/.ssh/config` 文件如下

```config
Host shanyue
    HostName 172.17.68.39
    User root
Host shuifeng
    HostName 172.17.68.40
    User root
```

## ansible inventory

通过配置 `~/.ssh/config` 后，我们为远程服务器起了别名。此时可以通过 `inventory` 进行分组管理。

`ansible` 默认的 `inventory` 配置文件为 `/etc/ansible/hosts`。

```ini
[prod]
shanyue
shuifeng

[dev]
proxy
jumper ansible_port=5555 ansible_host=192.0.2.50
```

配置释义如下

1. 总共有四台服务器，shanyue，shuifeng，proxy，jumper，所有的服务器都在分组 `all` 下
1. shanyue 与 shuifeng 在分组 `prod` 下，而 proxy 与 jumper 在分组 `dev` 下
1. 在 `inventory` 中同样可以设置 `hostname`, `port` 与别名，但是建议在 ssh-config 中进行设置

## 一个简单的 ad-hoc 命令

`ad-hoc` 命令指去特定一组服务器上执行一个命令。而一个命令实际上指的是 `module`，而最常用的 `module` 是 `ping`，用以查看服务器是否正常连通

所有的module可以参考 [ansible modules](https://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html)

```shell
# 查看所有服务器是否能够正常连通
$ ansible all -m ping
shuifeng | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
shanyue | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

## Ansible playbook

`ansible ad-hoc` 执行的命令过于简单，一般用于服务器的测试工作以及一些简单的小操作。而一些复杂的事情，如上述所说的 `tmux` 的安装则需要一系列脚本来完成。

`ad-hoc` 是指定服务器执行指定命令， **而 `playbook` 是指定服务器执行一系列命令。**

+ hosts，用以指定服务器分组。如 prod
+ role, 用以指定一系列命令的集合。如 tmux，方便复用

```yaml
- hosts: prod
  roles:
    - tmux
```

+ [Ansible playbook 最佳实践](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)

### Role

role 指定了一系列命令，或者称做 `tasks`。每个 `task` 都可以看做一个 `ad-hoc`，由 [ansible module](https://docs.ansible.com/ansible/latest/modules/modules_by_category.html) 组成

但是在 `task` 执行的过程中，一定会有一些变量，配置文件的设置，这就是 role 的其它组成部分。如 `defaults`，`vars`，`files` 和 `templates`。`role` 的文件结构组织如下

```txt
site.yml
roles/
   tmux/
     tasks/
     handlers/
     files/
     templates/
     vars/
     defaults/
     meta/
```

比如一个 tmux 的 role 做了以下 `tasks`

1. 安装依赖 package
1. 在 github 下载源代码，编译安装
1. 在 github 下载配置文件

配置文件参考我的 ansible 配置: [shfshanyue/ansible-op](https://github.com/shfshanyue/ansible-op/blob/master/roles/tmux/tasks/main.yml)

```yaml
- name: prepare
  yum:
    name: "{{item}}"
  with_items:
    - gcc
    - automake
    - libevent-devel
    - ncurses-devel
    - glibc-static

- name: install tmux
  git:
    repo: https://github.com/tmux/tmux.git
    dest: ~/Documents/tmux
    version: 2.8

- name: make tmux
  shell: sh autogen.sh && ./configure && make
  args:
    chdir: ~/Documents/tmux/

- name: copy tmux
  copy:
    src: ~/Documents/tmux/tmux
    dest: /usr/bin/tmux
    remote_src: yes
    mode: 0755

- name: clone config file
  when: USE_ME
  git:
    repo: https://github.com/shfshanyue/tmux-config.git 
    dest: ~/Documents/tmux-config

- name: clone config file (from .tmux)
  git:
    repo: https://github.com/gpakosz/.tmux.git
    dest: ~/Documents/tmux-config
  when: not USE_ME

- name: copy config file (from .tmux)
  copy:
    src: ~/Documents/tmux-config/.tmux.conf.local
    dest: ~/.tmux.conf.local
    remote_src: yes
  when: not USE_ME

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

## Ansible galaxy

即 `Role` 的仓库。

有一些高频的可复用的服务组件的部署，如 `docker`，`redis` 之类，可以在 [ansible-galaxy](https://galaxy.ansible.com) 找到，而免了自己写 `role` 的麻烦。

如 [ansible-redis](https://github.com/DavidWittman/ansible-redis)

```shell
# 查找关于 redis 的所有 Role
$ ansible-galaxy search redis
Found 387 roles matching your search:

 Name                                                    Description
 ----                                                    -----------
 0x5a17ed.ansible_role_netbox                            Installs and configures NetBox, a DCIM suite, in a production setting.
 1it.sudo                                                Ansible role for managing sudoers
 75629fce.ufw                                            High-level, service-based interface for configuring UFW
 aalaesar.install_nextcloud                              Add a new Nextcloud instance in your infrastructure. The rol
 ...
$ ansible-galaxy install davidwittman.redis
```

### 列出本地安装的所有 Role

``` bash
$ ansible-galaxy list
```

## 小结

`ansible` 以批量配置以及软件管理见长，如果你有一台自己的服务器的话，非常建议学习 `ansible`。
