# 如何更高效地管理多个数据库

如果你崇尚微服务，或者你所工作的企业崇尚微服务，如果微服务没有专门的团队负责，那么对于一个服务端工程师而言，多个数据库的管理是无法避免的。

此时，订单服务有它独属的订单数据库，用户服务有它独属的用户数据库，主体业务也有他独属的数据库。假设此时有三个数据库：

+ `user`
+ `order`
+ `business`

我们假设这几个数据库都是 `postgres`

> [如何管理生产环境多个数据库的配置，如何快速连接](https://github.com/shfshanyue/Daily-Question/issues/158)

## 使用 pgcli 管理数据库

大部分人使用数据库一般会选择界面丰富的 GUI 工具，可以更自由地增删改查，更轻松地设计数据结构。如 `navicat` 就是一款非常优秀的数据库GUI工具，但是它的价格却让我望而却步。

![](https://www.navicat.com.cn/images/product_screenshot/02.Product_01_PostgreSQL_Mac_04_Modeling_CN.png)

今天本篇文章主要介绍一下 `pgcli`，一款优秀的开源的并支持自动补全及关键字高亮的数据库客户端软件，它如同 `ipython` 一样，在命令行下工作，因此它能够更好地再跳板机下工作。

![](https://github.com/dbcli/pgcli/raw/master/screenshots/pgcli.gif)

### 安装

`pgcli` 基于 python，因此当你有了 python 环境时，可以直接使用 `pip` 来进行安装。

``` bash
$ pip install -U pgcli

or

$ brew install pgcli  # Only on macOS
```

### 连接数据库

``` bash
$ pgcli postgresql://[user[:password]@][netloc][:port][/dbname][?extra=value[&other=other-value]]
```

## 使用 pgcli 管理多个数据库

如同 `ssh-config` 可以对多个服务器设立别名，快速连接服务器。`pgcli-config` 同样可以对多个数据库设立别名，快速连接数据库。

`pgcli` 的配置文件位于 `~/.config/pgcli/config`，根据 `alias_dsn` 可以为数据库设立别名：

``` dosini
# DSN to call by -D option
[alias_dsn]
user = postgresql://postgres@db.shanyue.local/user

order = postgresql://postgres@db.shanyue.local/order

business = postgresql://postgres@db.shanyue.local/business
```

此时，需要连接用户服务数据库时可以很方便地使用 `pgcli -D user`。