---
title: scala 入门指南
date: 2019-05-04T20:55:33+08:00
categories:
  - 后端
tags:
  - scala
---

## 前言

## 环境

如果你正在学习或者只想敲几个示例，那么强烈推荐 [Scastie](https://scastie.scala-lang.org/e7IG6PygTWm1Me7InTYDkg)，一个嵌在浏览器中的线上编辑器。

如果你更喜欢 REPL 环境在自己的 scala shell 中学习和测试，则需要首先安装 sbt，使用 sbt 进入 scala shell。

<!--more-->

### 安装 sbt

sbt 用来创建，编译，测试且运行 scala 项目。这里介绍如何安装它。

> 注意：安装 sbt 依赖于 java 环境

由于我的机器是 CentOS，使用 `yum` 进行安装。

```shell
curl https://bintray.com/sbt/rpm/rpm | sudo tee /etc/yum.repos.d/bintray-sbt-rpm.repo
sudo yum install sbt
```

安装成功后，敲命令 `sbt console` 进入 REPL 环境

```shell
$ sbt console
[info] Updated file /root/hello/project/build.properties: set sbt.version to 1.2.8
[info] Loading project definition from /root/hello/project
[info] Updating ProjectRef(uri("file:/root/hello/project/"), "hello-build")...
[info] downloading https://repo1.maven.org/maven2/org/apache/logging/log4j/log4j-core/2.11.1/log4j-core-2.11.1-tests.jar ...
[info]  [SUCCESSFUL ] org.apache.logging.log4j#log4j-core;2.11.1!log4j-core.jar(test-jar) (2985ms)
[info] Done updating.
[info] Set current project to hello (in build file:/root/hello/)
[info] Starting scala interpreter...
Welcome to Scala 2.12.7 (OpenJDK 64-Bit Server VM, Java 1.8.0_201).
Type in expressions for evaluation. Or try :help.

scala>
```

## 变量

`scala` 是一种强类型的语言，但是你可以通过 `var` 进行赋值，它会自动做类型推断(Type Infer)。

通过以下示例，你可以得到一个好消息，则是 `scala` 不用写分号！但是它必须使用双引号来表示字符串

```scala
var s = "hello, world"

println(s)
```

当然你也可以显式地声明变量。好吧，他这个类型声明有点怪，不过如果你写过 `typescript`，你对它的接受度会好很多。

```scala
var s: String = 'hello, world'
```

## 数据类型 (Type)

![unified-types-diagram](https://shanyue.tech/post/learning-scala/unified-types-diagram.svg)

`scala` 分为引用类型与值类型

以下为所有的值类型，`Unit` 比较特殊些，在 `scala` 函数必须有返回值，如果实在没有，那返回的就是 `Unit`，类似于 `javascript` 中的 `undefined` 吧。

+ Double
+ Float
+ Long
+ Int
+ Short
+ Byte
+ Char
+ Boolean
+ Unit

## 操作符 (Operator)

```scala
```

## Block

被 `{}` 包裹称作 `Block`。`Block` 中的最后一个表达式的值为 `Block` 本身的值。另外 `Block` 与函数一样拥有一个独立的作用域。

```scala
var r = {
  val x = 1 + 1
  x + 1
}

// 3
println(r)
```

类似于 `javascript` 中的箭头表达式，不过 `scala` 更加灵活，以下是一个 `js` 的箭头表达式

```javascript
const r = (x = 1 + 1, x + 1)

// 3
console.log(r)
```

## 函数 (Function)

在 `scala` 中，函数是带有参数的表达式

```scala
val add = (x: Int, y: Int) => x + y
```

类似于 `python` 中的 `lambda` 函数，与 `javascript` 中的单行箭头函数，他们都是匿名函数并进行赋值，见以下示例

```python
add = lambda x, y: x + y
```

```javascript
const add = (x, y) => x + y
```

## Method

与函数类似，使用 `def` 标记，并在其后注明返回数据类型

```scala
def add(x: Int, y: Int): Int = x + y
```

它也可以带有多个参数列表或者不带参数列表

```scala
def add(x: Int)(y: Int)(z: Int): Int = x + y + z

// 12
println(add(3)(4)(5))

def zero: Int = 0

// 0
println(zero)
```

可以使用 `Block` 来做 Method 的返回值

```scala
def add(x: Int, y: Int): Int = {
  var sum = x + y
  sum
}
```

## Class

```scala
class Cat(name: String) {
  def say(): String = "miao~"
}

var tom = new Cat("tom")
println(tom.say()) // miao~
```

## Object

可以理解为 **单例模式**

```scala
// 不需要带参数
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}

IdFactory.create() // 1
IdFactory.create() // 2
IdFactory.create() // 3
```

依照我的理解，它有点类似于 `javascript` 中的闭包，如以下 `js` 代码

```javascript
const IdFactory = (counter = 0, () => ++counter)

IdFactory() // 1
IdFactory() // 2
IdFactory() // 3
```

但更像是 `javascript` 中的 `object`，如以下 `js` 代码

```javascript
const IdFactory = {
  counter: 0,
  create () {
    return ++this.counter
  }
}

IdFactory.create() // 1
IdFactory.create() // 2
IdFactory.create() // 3
```

### Case Class

常用来表示不可修改数据

```scala
case class Point(x: Int, y: Int)

var p1 = Point(3, 4)
var p2 = Point(30, 40)
```

## Trait

```scala
trait Greeter {
  def greet(name: String): Unit = println("hello, " + name)
}

class DefaultGreeter extends Greeter

var greeter = new DefaultGreeter()
greeter.greet("shanyue")
```

## 引用类型

### String

```scala
scala> var str = "hello"
str: String = hello

scala> str.map(x => x.toUpper)
res4: String = HELLO

scala> str.map(x => 'A')
res7: String = AAAAA

scala> str.map(x => "A")
res10: scala.collection.immutable.IndexedSeq[String] = Vector(A, A, A, A, A)
```

> 更多参考官方文档 <https://docs.scala-lang.org/overviews/collections/strings.html>

### Array

```scala
scala> var a1 = Array(1, 2, 3)
a1: Array[Int] = Array(1, 2, 3)

scala> a1.map(x => x*3)
res22: Array[Int] = Array(3, 6, 9)

// 获取 Array 特定位置的值
scala> arr.apply(3)
res26: Int = 4
```

另外，对于 `Array` 有 `map` 与 `filter` 操作符，其中 `_` 代表所包含的元素

```scala
scala> var a1 = Array(1, 2, 3)
a1: Array[Int] = Array(1, 2, 3)

scala> a1 map (_ * 3)
a2: Array[Int] = Array(3, 6, 9)
```

### List

```scala
scala> var list = List(1, 2, 3, 4, 5)
list: List[Int] = List(1, 2, 3, 4, 5)

scala> var list2 = List(6, 7, 8, 9)
list2: List[Int] = List(6, 7, 8, 9)

// 获取 List 特定位置的值
scala> list.apply(3)
res4: Int = 4

// 获取 List 特定位置的值
scala> list(3)
res7: Int = 4

scala> list ++ list2
res8: List[Int] = List(1, 2, 3, 4, 5, 6, 7, 8, 9)

// List 是 immutable 的，无法修改其中的值
scala> list(3) = 100
<console>:26: error: value update is not a member of List[Int]
       list(3) = 100
       ^
```

#### List 与 Array 有什么区别

[Difference between Array and List in scala](https://stackoverflow.com/questions/2712877/difference-between-array-and-list-in-scala)

1. Array 中的值是可变的，List 是不可变的，List 更符合函数式的思维

### Seq

```scala
scala> var s = Seq(1, 1, 2)
s: Seq[Int] = List(1, 1, 2)
```

### Map

可以使用 `key -> value` 或者 `(key, value)` 两种形式声明 `Map`。

```scala
scala> var m = Map(("x", 3), ("y", 4), ("z", 5))
m: scala.collection.immutable.Map[String,Int] = Map(x -> 3, y -> 4, z -> 5)

scala> var m = Map("x" -> 3, "y" -> 4, "z" -> 5)
m: scala.collection.immutable.Map[String,Int] = Map(x -> 3, y -> 4, z -> 5)

// 可以通过 get 方法获取 key
scala> m.get("x")
res7: Option[Int] = Some(3)

// get 也可以作为操作符
scala> m get "x"
res9: Option[Int] = Some(3)

// 也可以直接获取 key
scala> m("x")
res10: Int = 3

// 当直接获取 key 时，key 不存在则抛出异常
scala> m("X")
java.util.NoSuchElementException: key not found: X
  at scala.collection.MapLike$class.default(MapLike.scala:228)
  at scala.collection.AbstractMap.default(Map.scala:59)
  at scala.collection.MapLike$class.apply(MapLike.scala:141)
  at scala.collection.AbstractMap.apply(Map.scala:59)
  ... 49 elided

// 当不存在 key 时，则取默认值 100
scala> m.getOrElse("X", 100)
res13: Int = 100

// 查看 key 是否存在
scala> m.contains("X")
res16: Boolean = false

// 添加 k/v 对
scala> m.updated("a", 100)
res19: scala.collection.immutable.Map[String,Int] = Map(x -> 3, y -> 4, z -> 5, a -> 100)

// 添加 k/v 对的操作符形式
scala> m + ("a" -> 100)
res22: scala.collection.immutable.Map[String,Int] = Map(x -> 3, y -> 4, z -> 5, a -> 100)

scala> var m2 = Map("a" -> 100, "b" -> 200)
m2: scala.collection.immutable.Map[String,Int] = Map(a -> 100, b -> 200)

// 拼接两个 Map
scala> m2 ++ m
res29: scala.collection.immutable.Map[String,Int] = Map(x -> 3, y -> 4, a -> 100, b -> 200, z -> 5)

// 删除某个 key
scala> m - "x"
res31: scala.collection.immutable.Map[String,Int] = Map(y -> 4, z -> 5)

// 删除多个 key
scala> m - ("x", "y")
res33: scala.collection.immutable.Map[String,Int] = Map(z -> 5)

scala> m.keys
res38: Iterable[String] = Set(x, y, z)

scala> m.values
res42: Iterable[Int] = MapLike(3, 4, 5)

// 对 value 进行 map 转换
scala> m mapValues ((x) => x + 10)
res45: scala.collection.immutable.Map[String,Int] = Map(x -> 13, y -> 14, z -> 15)

```

> 更多 Map 操作参考官方文档 <https://docs.scala-lang.org/overviews/collections/maps.html>

## 流程控制

### if 语句

在 `scala` 中没有 `?:` 运算符，使用 `if` 代替

```scala
var foo = 3
var a = if (foo == 3) 10 else 100
```

### for 语句

```scala
```

## 参考

+ [官方文档](https://docs.scala-lang.org/tour/basics.html)
