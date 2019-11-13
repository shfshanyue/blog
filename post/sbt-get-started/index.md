---
title: 使用 sbt 配置管理与运行
date: 2019-04-17T16:43:42+08:00
categories:
  - 大数据
tags:
  - scala
---

关于安装，参考上一篇文章

## 启动 shell

首先创建项目目录，并创建一个 sbt 文件

```shell
mkdir hello
cd hello
touch hello.sbt
```

启动 sbt shell，在 shell 中可以使用 `help` 查看命令帮助

```shell
$ sbt
[info] Updated file /root/hello/project/build.properties: set sbt.version to 1.2.8
[info] Loading project definition from /root/hello/project
[info] Updating ProjectRef(uri("file:/root/hello/project/"), "hello-build")...
[info] Done updating.
[info] Loading settings for project hello from build.sbt ...
[info] Set current project to hello (in build file:/root/hello/)
[info] sbt server started at local:///root/.sbt/1.0/server/531858fa6de1db1d6da4/sock
sbt:hello>
sbt:hello> help

  about                                          Displays basic information about sbt and the build.
  tasks                                          Lists the tasks defined for the current project.
  settings                                       Lists the settings defined for the current project.
  reload                                         (Re)loads the current project or changes to plugins project or returns from it.
  new                                            Creates a new sbt build.
  projects                                       Lists the names of available projects or temporarily adds/removes extra builds to the session.
...
```

在 shell 中使用 `exit` 命令或者 Ctrl+D 退出

```shell
sbt:hello> exit
[info] shutting down server
```

退出 shell 后，文件目录已发生了改变，我们使用 `tree` 查看一下文件目录，这里的 `-L 5` 代表打印目录层级深度为5。

如果你没有安装 `tree`，可以使用 `ls -lahR`，不过可读性和美观度就差了很多了。

```shell
$ tree -L 5
.
├── build.sbt
├── project
│   ├── build.properties
│   └── target
│       ├── config-classes
│       ├── scala-2.12
│       │   └── sbt-1.0
│       │       └── resolution-cache
│       └── streams
│           ├── $global
│           │   ├── $global
│           │   ├── dependencyPositions
│           │   ├── ivyConfiguration
│           │   ├── ivySbt
│           │   ├── projectDescriptors
│           │   └── update
│           ├── compile
│           │   ├── $global
│           │   ├── compile
│           │   ├── compileIncSetup
│           │   ├── compileIncremental
│           │   ├── copyResources
│           │   ├── dependencyClasspath
│           │   ├── exportedProducts
│           │   ├── externalDependencyClasspath
│           │   ├── internalDependencyClasspath
│           │   ├── managedClasspath
│           │   ├── unmanagedClasspath
│           │   └── unmanagedJars
│           └── runtime
│               ├── dependencyClasspath
│               ├── exportedProducts
│               ├── externalDependencyClasspath
│               ├── fullClasspath
│               ├── internalDependencyClasspath
│               ├── managedClasspath
│               ├── unmanagedClasspath
│               └── unmanagedJars
└── target

37 directories, 2 files
```

## hello, world

退出 shell 后，创建目录 `src/main/scala/example`，并创建文件 `Hello.scala`。

```shell
mkdir -p src/main/scala/example/
vim src/main/scala/example/Hello.scala
```

Hello.scala 文件中的程序是打印一个 `hello, world`

```scala
object Hello extends App {
  println("hello, world")
}
```

再次进入 shell 中

1. 使用 `compile` 命令编译程序
1. 使用 `run` 命令运行程序

程序运行成功，打印出 `hello, world`

```shell
sbt:hello> compile
[info] Compiling 1 Scala source to /root/hello/target/scala-2.12/classes ...
[info] Done compiling.
[success] Total time: 5 s, completed 2019-4-17 20:29:17
sbt:hello> run
[info] Packaging /root/hello/target/scala-2.12/hello_2.12-0.1.0-SNAPSHOT.jar ...
[info] Done packaging.
[info] Running example.Hello
hello, world
[success] Total time: 1 s, completed 2019-4-17 20:29:36
```

## 项目构建配置

编写项目配置文件 `build.sbt`，指定 scala 版本号以及项目命名

```sbt
name := "Hello"
```

修改 `build.sbt` 后，使用 `reload` 重新载入配置。此时提示符变为了项目名

```shell
sbt:hello> reload
[info] Loading project definition from /root/hello/project
[info] Loading settings for project hello from build.sbt ...
[info] Set current project to Hello (in build file:/root/hello/)
sbt:Hello>
```

## 打包

```shell
$ sbt package
[info] Loading project definition from /root/hello/project
[info] Loading settings for project hello from build.sbt ...
[info] Set current project to Hello (in build file:/root/hello/)
[success] Total time: 1 s, completed 2019-4-18 12:04:29
```

打包成 `jar` 后，可以在以下路径找到目标 `jar` 包的位置 `./target/scala-2.12/`

```shell
$ find . | grep jar
./target/scala-2.12/hello_2.12-0.1.0-SNAPSHOT-sources.jar
./target/scala-2.12/hello_2.12-0.1.0-SNAPSHOT-javadoc.jar
./target/scala-2.12/hello_2.12-0.1.0-SNAPSHOT.jar
```

### 第三方库依赖管理

对于你需要的第三方库可以到 <https://maven.apache.org/> 进行查找

如果选择 `sbt` 作为依赖管理工具，如果需要引入第三方库，编辑 `build.sbt`，按以下格式添加依赖

```sbt
libraryDependencies += groupID % artifactID % revision
```

如需要添加 `spark-streaming` 的库

```sbt
// https://mvnrepository.com/artifact/org.apache.spark/spark-streaming
libraryDependencies += "org.apache.spark" %% "spark-streaming" % "2.4.1" % "provided"
```