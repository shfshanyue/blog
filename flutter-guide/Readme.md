---
title: flutter 入门指南
date: 2019-04-04
tags:
  - flutter
categories:
  - 移动端
sidebar: auto

---

# flutter

flutter 的出现不得不说是激动人心的，你可以以 React-Style 的方式写多端应用。而相比 RN 而言，它自身的版本迭代也比较积极。

<!--more-->

## 前言

### 开发系统

我在 MacOS 上进行开发

### shell

我的 shell 是 `zsh`，配置文件在 `~/.zshrc`。如果你们的是
+ mobile -> android
+ 基础 -> 前端 css 与 react

建议跟着目录走

### 翻译

+ compile-time (编译时)
+ run-time (运行时)
+ generic type (泛型)

## 安装

```shell
# 安装到自己感兴趣的位置，这里安装在 /app 目录下
cd /app
curl -O https://storage.googleapis.com/flutter_infra/releases/stable/macos/flutter_macos_v1.2.1-stable.zip
unzip flutter_macos_v1.2.1-stable.zip

# 写入到环境变量
echo 'export PATH="$PATH:/app/flutter/bin"' >> ~/.zshrc

# 选择你工作所使用的 shell，可以是 bash 也可以是 zsh
# echo 'export PATH="$PATH:/app/flutter/bin"' >> ~/.bashrc

# 执行生效
source ~/.zshrc
```

完成以上命令后，运行命令 `flutter doctor` 查看是否安装成功，如果没有则有对相关扩展的安装提示。有以下扩展，可以参考相关文章进行安装

+ Android toolchain (SDK)
+ IOS toolchain
+ Android Studio

### 网络问题

在国内，如果出现了关于网络的问题，官方早已想到了解决方案，参考本篇文章 [Using Flutter in China](https://flutter.dev/community/china)。

执行以下命令更换安装包的源，你也可以选择其它的源

```shell
# 写入你自己的 shell 文件
cat <<EOF >> ~/.zshrc
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
EOF
```

## 编辑器

### VS Code

需要与插件 Dart 配合使用

**在 VS Code 下，对启动，调试，热加载，Goto Path 以及自动补全都相当方便，强烈推荐。**

> 参考官方文档 https://flutter.dev/docs/development/tools/vs-code

### vim

+ [dart-vim-plugin](https://github.com/dart-lang/dart-vim-plugin)

使用该插件无法正确缩进圆括号内代码

> 参考 https://github.com/dart-lang/dart-vim-plugin#faq

## 运行第一个应用

使用以下命令新建一个项目并使用 VS Code 打开。当然你也可以选择使用编辑器新建项目

```shell
cd ~/flutter-examples

# 新建项目时会自动执行 flutter packages get 来装包
flutter create hello-world 

# 进入项目目录
cd hello-world

# 装包，新建项目时已自动执行
# flutter packages get

# 列出模拟器列表
flutter emulators

# 启动一个模拟器，输入 emulatorId 的前缀即可
flutter emulators --lauch <emulatorId>

# 查看设备列表
flutter devices

# 运行，成功后可以在模拟器中看见界面
flutter run

# 如果有多个设置，选择某个设备进行调试，输入前缀即可
flutter run -d <deviceId>
```

![运行成功界面](https://flutter.dev/assets/get-started/ios/starter-app-5e284e57b8dce587ea1dfdac7da616e6ec9dc263a409a9a8f99cf836340f47b8.png)

如果没有走完流程，也非常正常，通向成功的道路从不一帆风顺，学习新技术总会遇到不少坑。这里列举新建项目时出现的几个小问题

### 热加载

你会发现你保存文件时没有更新界面，这是因为你使用了命令启动，并未与编辑器进行绑定。

使用命令 `flutter run` 运行成功后，按键 `r` 进行热加载，`R` 进行热重启，会刷新应用状态。

### 真机运行

在 Android 上真机运行，需要打开

+ 开发者选项
+ USB 调试
+ USB 安装

### 问题

#### 装包卡顿

装包卡顿有可能是因为国内网络的原因，请参考以上章节 [网络问题]()

如果还有问题，在 flutter 创建的项目根目录中定位文件 `./android/build.gradle`，进行如下修改

```gradle
// 修改前文件
buildscript {
    repositories {
        google()
        jcenter()
    }
}

allprojects {
    repositories {
        google()
        jcenter()
    }
}


// 修改后文件
buildscript {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/jcenter' }
        maven { url 'http://maven.aliyun.com/nexus/content/groups/public' }
    }
}
allprojects {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/jcenter' }
        maven { url 'http://maven.aliyun.com/nexus/content/groups/public' }
    }
}
```

#### 命令锁住

在执行 flutter 命令时，有可能遇到命令被锁住的情况

```
Waiting for another flutter command to release the startup lock...
```

> 更多解决方案参考 https://github.com/flutter/flutter/issues/17422

使用以下命令解决

```shell
# 删除 bin 目录下的 lockfile
rm /app/flutter/bin/cache/lockfile
```

## 动手写第一个应用

动手写一个 flutter 的 `hello, world` 应用。编辑 /lib/main.dart 如下

```Dart
import 'package:flutter/material.dart';

void main() => runApp(App());

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Text('hello, world', textDirection: TextDirection.ltr)
  }
}
```

在模拟器或真机上运行。运行后是一个黑色界面，左上角写着 `hello, world` 虽然丑了点，好歹麻雀虽小五脏俱全。另外，如果你写过 React, 发现它和 React 的写法如此相像。人在学习新东西时，如果与旧知识有关联性，能够学的很快。

你会发现，`StateLessWidget` 与 React 的 `Component` 相似，而 `build` 函数与 React 的 `build` 相似。

```jsx
import React, { Component } from 'react';
import { render } from 'react-dom';

render(<App />, document.getElementById('app'));

class App extends Component {
  render () {
    return <div>hello, world</div>
  }
}
```

## Dart

敲完了第一个应用，你会发现 `Text('hello, world', textDirection: TextDirection.ltr)` 这个函数很怪，有点像 js 的 `Text('hello, world', { textDirection: TextDirection.ltr })` 或者 python 的 `Text('hello, world', textDirection=TextDirection.ltr )`。

这时候，你发现 `flutter` 仅仅是依赖于 `Dart` 下的移动开发框架，现在有必要学习一下 `Dart` 的语法了。

`Dart`  是一门强类型的静态语言，而且必须加分号。

> 如果你需要更为详细的文档，参考官方文档 https://www.dartlang.org/guides/language/language-tour

### 环境

正如 codepen 可以在线学习与测试前端。你也可以在 [DartPad](https://dartpad.dartlang.org) 中，打开浏览器在线学习 Dart 语言。

### main() 函数

入口函数，如同 C 语言一样。

```dart
void main() {
  print('hello, world');
}
```

### 变量

`Dart` 是强类型语言，但也可以直接使用 `var` 声明一个变量。

```dart
void main() {
  var a = 3;
  int b = 4;

  const c = 10;
  final d = 100;

  dynamic e = 'hello, world';
}
```

#### `final` 和 `const` 的区别是什么

`const` 编译时确定，`const` 运行时确定。

**了解两者不同后，以下示例的输出是什么**

```dart
void test1() {
  final foo = [];
  foo.add(3);
 
  print(foo);
}

void test2() {
  const foo = [];
  foo.add(3);
 
  print(foo);
}

void main() {
  test1();
  test2();
}
```

```dart
void main() {
  final l = [1, 2, 3].map((x) => x+3);
  const l = [1, 2, 3].map((x) => x+3);
}
```

#### `dynamic` 与 `var` 的区别是什么

你运行完以下代码，便可以知道两者的区别。

```dart
void main() {
  var foo = 'hello';
  var = 3;

  dynamic bar = 'hello';
  bar = 3;
}
```

### 内置类型 (Built-in Types)

> 参考类型风格指南建议 https://www.dartlang.org/guides/language/effective-dart/design#types

Dart 有如下数据类型，这里先简单介绍一下常用类型

+ number
    + int
    + number
+ string
+ boolean
+ list (array)
+ set
+ map
+ rune
+ symbol

```dart
void main() {
  // int
  var a = 1;
  print(a);

  // double
  var b = 3.14;
  print(b);

  // string
  // ${exp} 字符串变量解析。恩，有点像 shell
  var s = '$a + $b = ${a + b}';
  print(s);

}
```

#### List

> TODO
在 `Dart` 中，`List`，`Set` 和 `Collection` 统称为 Collection。它们有公共的方法 `forEach` 与 `map` 等。

```dart
void main() {
  var l = [1, 2, 3];

  // [1, 2, 3]
  print(l);

  l.add(4);
  l.addAll([5, 6]);

  // [1, 2, 3, 4, 5, 6]
  print(l);

  // 1
  print(l.first);

  // [2, 3, 4, 5, 6]
  print(l.skip(1));

  var ll = l.map((x) => x + 3);
  var lll = l.map((x) {
    return x + 3;
  });
  print(ll.runtimeType);
}
```

另外，在 js 中数组有一个我最喜欢的 API `Array.prototype.reduce`。在 `dart` 中可以使用 `fold` 替代

```dart
// 21
[1, 2, 3, 4, 5, 6].reduce((acc, x) => acc + x);

// 121
[1, 2, 3, 4, 5, 6].fold(100, (acc, x) => acc + x);
```

> Q: 什么是泛型 (generic type)

#### Set

```dart
void main() {
  // 或者 Set<String> colors = {};
  var colors = Set();
  colors.add('red');
  colors.add('blue');
  print(colors);
  print(colors.map((x) => x))

  assert(colors.contains('red'));
}
```

#### Map

```dart
void main() {
  // Map<String, int> = {};
  var o = Map();
  o['a'] = 3;
  o['b'] = 4;
  print(o);

  o = {
    'a': 3,
    'b': 4,
    'c': 5
  };
  print(o);

  assert(o.containsKey('a'));
  o.forEach((k, v) {
    print('$k: $v');
  })

  print(o.entries);
  print(o.entries.map((o) => '${o.key}: ${o.value}'));
}
```

### 函数 

```dart
bool isZero(int n) {
  return n == 0;
}

// 在 [] 中代表可选参数
bool isZero([int n]) {
  if (n != null) {
    return n == 0;
  }
  return false;
}

// 默认参数
bool isZero([int n = 0]) {
  if (n != null) {
    return n == 0; 
  }
  return false;
}

// 箭头函数
// 如 javascript 一样，相比 js 而言它只是少了一个 = 等于号
// javascript 👉 const isZero = (n) => n === 0;
bool isZero(int n) => n == 0;


// 匿名函数
// 如 javascript 一样，相比 js 而言参数必须带括号
[1, 2, 3].map((x) => x+1);
[1, 2, 3].map((x) {
  return x + 1;
});
```

### 操作符

#### 

### 类

```dart
class Point {
  final num x;
  final num y;
  final num z;

  Point(x, y): x = x, y = y, z = x + y;
}

void main() {
  var p = Point(3, 4);
  print(p.z);
}
```

### 异步

在 js 中有承诺(Promise)，在 Dart 中也有未来(Future)

```dart
// 与 js 的不同就是，dart 把 async 写到最后边了...
Future fetch() async {
  var res = await request.get();
}
```

## 布局

熟悉了 `dart` 的语法之后，可以动手画一个漂亮的界面 (UI)了。布局组件是构成 UI 的重要一步

> 更多布局组件参考官方文档 https://flutter.dev/docs/development/ui/widgets/layout

+ Padding
+ Container
+ Row
+ Column
+ Center
+ RenderBox
+ SizedBox
+ ConstrainedBox
+ Center
+ ListView
+ Text
+ Image
+ Transform
+ Opacity

### Constraint Box

正如 html 中元素有 block，inline，inline-box 之分。flutter 也有类似三类约束

+ 尽可能撑高成宽   👉 `Container` 和 `Center`
+ 与子组件等高等宽 👉 `Transform` 和 `Opacity`
+ 特定尺寸         👉 `Text` 和 `Image`

当然上边只是一部分组件的约束，`Container` 也可以指定宽高，变为第三类。另外还有不受此约束的 `ListView` 与 `Row/Column`。

接下来介绍几种重要且常见的组件，如 `Container`，`Row`，`Column`

### Text Widget

```dart
Text(
  textDirection: TextDirection.ltr
)
```

#### Text 的 TextDirection 属性什么时候可以缺省，为什么
#### Text 如何使用外部字体

1. 添加字体至 $app/fonts/

2. 修改 pubspec.yaml 配置文件，关于配置文件的具体作用请往下翻阅

    ```yaml
    flutter:
      fonts:
        - family: xinxi
          fonts:
            - asset: fonts/臺灣新細明體.ttf
    ```

3. 代码中引用字体
 
    ```dart
    Text(
        '暮从碧山下',
        style: TextStyle(
            fontSize: 36,
            fontFamily: 'xinxi',
        ),
    ),
    ```

4. 无发热更新，重启应用生效

#### Text 如何从上往下排列，实现 `writing-mode: vertical-rl` 的效果

使用一个取巧的办法，即把字体父元素宽度设置为仅仅大于字体宽度，可以视为从上往下排列

```dart
Container(
  width: 48,
  child: Text(
    '山月照弹琴',
     style: TextStyle(
       fontSize: 36,
     )
  ),
)
```

#### 如何统一设置 Text 的字号字体和样式

可以通过设置 `ThemeData` 设置一套主题，其中的 `textTheme` 控制字体的样式



### Container Widget

#### 样式

`BoxDecoration` 可以设置 `margin`，`padding`, `border` 和 `color` (类似于 css 中的背景)等。与 css 类比如下

```
// dart
Container( 
  width: 100,
  height: 100,
  margin: EdgeInsets.all(24),
  padding: EdgeInsets.only(top: 24),
  alignment: Alignment.center,
  decoration: BoxDecoration(
    color: const Colors.white,
    border: Border.all(
      color: Colors.blue,
      width: 1.0,
    ),
  ),
  child: MyWidget()
))


// css 
.container {
  width: 100px;
  height: 100px;
  margin: 24px;
  padding-top: 24px;
  text-align: center; 
  background-color: white;
  border: 1px solid blue;
}
```

#### 颜色

表示颜色的有两类 `Color` 与 `Colors`，颜色的值可以使用十六进制，RGB 或者常量来表示。

```dart
// 黑色
Color(0xff000000)

// RGBO，类似于 css 中的 rgba
Color.fromRGBO(0, 0, 0, .3)

// 红色，等同与 Colors.red[500]
Colors.red

// 深红
Colors.red[900]
```

### Row & Column Widget

Row 与 Column 是几乎一模一样的组件，除了方向。如果你使用过 CSS 的 flex 布局，会很快理解这两个组件，他们完全是 flexbox，只不过 `flex-direction` 不一样。

如果两个组件在 HTML 中，那么他们的默认样式就如下所描述的 CSS 一般

```css
Row {
  display: flex;
  flex-direction: row;
}

Column {
  display: flex;
  flex-direction: column;
}
```

flexbox 中有纵轴，横轴之分，Row/Column 自然也有这两个属性。自我感觉 flutter 更语义一些

+ Flutter: mainAxisAlignment/crossAxisAlignment
+ CSS: justify-content/align-items

而且它们的属性值也是相同的

+ `mainAxisAlignment.center` 👉 `justify-content: center`
+ `mainAxisAlignment.start` 👉 `justify-content: flex-start`
+ `mainAxisAlignment.end` 👉 `justify-content: flex-end`
+ `mainAxisAlignment.spaceBetween` 👉 `justify-content: space-between`
+ `mainAxisAlignment.spaceAround` 👉 `justify-content: space-around`
+ `mainAxisAlignment.spaceEvenly` 👉 `justify-content: space-evenly`

另外，在 css flex 中有一个 `flex-grow` 属性，可以对应到 flutter 中的 `Expanded`

## Material Design

Meterial Design Guidelines

> 参考官方文档 https://material.io/design/

由于 `Scaffold` 组件在平时使用的频率较多，所以也特别介绍一下。但是这一块不是特别重要可以跳过。

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
            primarySwatch: Colors.blue,
            fontFamily: 'xinxi',
            textTheme: TextTheme(
              display2: TextStyle(
                  fontSize: 45.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.white),
            )),
        home: App());
  }
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('诗词'),
        actions: [
          IconButton(
            icon: Icon(Icons.share),
            color: Colors.white,
            onPressed: () {
              print('Press share');
            },
          ),
          IconButton(
            icon: Icon(Icons.settings),
            color: Colors.white,
            onPressed: () {
              print('Press settings');
            },
          )
        ],
        leading: Builder(
          builder: (BuildContext context) {
            return IconButton(
                icon: const Icon(Icons.menu),
                onPressed: () {
                  Scaffold.of(context).openDrawer();
                });
          },
        ),
      ),
      // 抽屉，从侧栏打开，如 QQ
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              child: Text('诗酒趁年华', style: Theme.of(context).textTheme.display2),
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
            ),
            ListTile(
              title: Text('我的诗词', style: Theme.of(context).textTheme.display1),
            ),
            ListTile(
              title: Text('我的收藏', style: Theme.of(context).textTheme.display1),
            ),
          ],
        ),
      ),
      body: Center(
          child: Container(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 48,
              child: Text('山月照弹琴', style: TextStyle(fontSize: 36)),
            )
          ],
        ),
      )),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          print('hello, world');
        },
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(
              icon: Icon(Icons.business), title: Text('收藏')),
          BottomNavigationBarItem(icon: Icon(Icons.home), title: Text('主页')),
          BottomNavigationBarItem(icon: Icon(Icons.school), title: Text('诗词')),
        ],
      ),
    );
  }
}
```

### AppBar

### Icon

```dart
IconButton(
  icon: Icon(Icons.share),
  color: Colors.white,
  tooltip: '分享到朋友圈',
  onPressed: () { print('Icon Share'); },
),
```

> 至于更多图标参考 https://docs.flutter.io/flutter/material/Icons-class.html

### TabBar

`TabBar` 使用 `Tab`，`TabBarView` 以及 `TabController` 控制。

```dart
class MyTabbedPage extends StatefulWidget {
  const MyTabbedPage({ Key key }) : super(key: key);
  @override
  _MyTabbedPageState createState() => _MyTabbedPageState();
}

// with 操作符代表一个 Mixin，在创建 TabController 时会用到
class _MyTabbedPageState extends State<MyTabbedPage> with SingleTickerProviderStateMixin {
  final List<Tab> myTabs = <Tab>[
    Tab(text: 'LEFT'),
    Tab(text: 'RIGHT'),
  ];

  TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(vsync: this, length: myTabs.length);
  }

  @override
  void dispose() {
  _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // TabBar 由两部分组成，一部分为上边的 label，另一部分为下边的横线 indicator
        bottom: TabBar(
          controller: _tabController,
          tabs: myTabs,
          // tab 下的横线大小，label 表示尽可能小，tab 表示尽可能大
          indicatorSize: TabBarIndicatorSize.label,
        ),
      ),
      // tab容器，在指向特定tab时所呈现的内容
      body: TabBarView(
        controller: _tabController,
        children: myTabs.map((Tab tab) {
          return Center(child: Text(tab.text));
        }).toList(),
      ),
    );
  }
}
```

> 更多内容参考 https://docs.flutter.io/flutter/material/TabController-class.html

## 布局实践

蜻蜓点水般介绍了两个组件，做两个常见的布局来测试你是否掌握了基本用法

### **垂直居中一个 300 * 300 固定宽高的组件**

需要注意以下点

1. `Center` 实现垂直居中
1. `Container` 置于 `Center` 下，宽与高才会生效

```dart
Center(
  child: Container(
    width: 300,
    height: 300,
    color: Colors.red,
  ),
);
```

### **垂直居中多行文字**

```dart
Center(
  child: Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.center,
    children: [
      Text('hello, world', textDirection: TextDirection.ltr),
      Text('hello, world', textDirection: TextDirection.ltr),
      Text('hello, world', textDirection: TextDirection.ltr),
    ],
  ),
);
```

### 左侧固定 50px，中间自适应，右侧固定 50px

```dart
Center(
  child: Row(
    textDirection: TextDirection.ltr,
    children: [
      Container(
        width: 80.0,
        color: Colors.red,
      ),
      Expanded(
        child: Container(
          color: Colors.white     
        )    
      ),
      Container(
        width: 80.0,
        color: Colors.blue,
      ),
    ],
  ),
);
```

### 平分5栏

```dart
Center(
  child: Row(
    textDirection: TextDirection.ltr,
    children: [
      Expanded(
        child: Container(
          color: Colors.white     
        )    
      ),
      Expanded(
        child: Container(
          color: Colors.red
        )    
      ),
      Expanded(
        child: Container(
          color: Colors.blue
        )    
      ),
      Expanded(
          child: Container(
            color: Colors.red
          )    
      ),
      Expanded(
          child: Container(
            color: Colors.white     
          )    
      ),
    ],
  )
);
```

## 手势

html 和 flutter 有一个重大区别就是 html 是由 div 组成的，而 flutter 是由各种组件组成的。

> 即使在 html 中强调语义化标签，现在也有 web component 标准，但他们大多数都可以由 div 模拟而来，监听同样的 click 事件

手势当属移动端交互最多的事件，而所有手势事件都在 `GestureDetector` 组件上进行监听。当然，如果你使用流行的组件库，它们已经给你把时间封装到了组件。

在 flutter 中有以下手势

+ Tap
+ Double tap
+ Long press
+ Vertical drag
+ Horizontal drag
+ Pan


## 状态

做了几个简单的布局之后，你会发现以上所有组件继承的都是 `StatelessWidget`，除此以外，还有另一种常用的组件 `StatefulWidget`。

见词生义，两个组件的不同在于是否本身有状态需要维护。在 React 中，Component 也有 `Function Component` 和 `Class Component` 之分。如果你之前写过 React，你就会很快理解两者的区别。

如何实现有状态的组件呢，有以下两点

1. 有状态的组件需要实现两个类，`StatefulWidget` 和 `State` 的子类。
2. 使用 `setState` 更改状态

### 生命周期

> 说到生命周期，就有一个随之而来的问题，数据请求应该在哪一个生命周期

+ initState
+ didChangeDependencies
+ build
+ didUpdateState
+ deactive
+ dispose

### Counter

`Couter` 在状态管理的地位快比得上编程语言里的 `hello, world` 了。以下实现一个 `Counter` 组件。

> flutter create 出来直接就是一个 `Counter` 组件。

先来介绍一下什么是 `Counter` 组件

+ `Counter` 组件有一个按钮与一个数字组成
+ 每点击一次按钮，数字加1

做一个最小化描述 Counter 的代码，再加一点样式。

+ setState

```dart
import 'package:flutter/material.dart';

void main() => runApp(App());

class App extends StatelessWidget {
  Widget build(BuildContext context) {
    return Counter();
  }
}

class Counter extends StatefulWidget {
  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  // 状态都放在 State 的属性里边
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    // 设置垂直居中
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // +1 的按钮，被 GestureDetector 包裹监听事件
          GestureDetector(
            onTap: () {
              // 监听 Tap 事件，监听对 _count 进行自增
              setState(() {
                _count += 1;
              });
            },
            child: Container(
              child: Text('点击 +1', textDirection: TextDirection.ltr),
            ),
          ),
          Text(_count.toString(), textDirection: TextDirection.ltr)
        ]
      )
    );
  }
}
```

### 状态管理方案

+ Bloc
+ redux

### ValueNotifier

## 调试

通过以上学习布局，你时时需要查看组件的位置，大小，以及嵌套关系。通过以上学习组件状态管理，你需要时时打印数据，查看数据流向，甚至打断点

flutter 的调试如同前端一样分为两大块，UI 以及 Data。以下介绍 flutter 的调试

### 如何像 Devtool Inspector 一样定位元素

### 如何打印数据至控制台

> 你用的最多的调试手段是什么?
> print

打印数据到控制台是最简单，最直接的方法。在 flutter 中

## 路由

这里先回顾一下前端的路由是如何控制的？

前端路由通过 `history API` 控制跳转，在 flutter 中使用 `Navigator` 跳转。

### Navigator

正如 `history API` 一样，`Navigator` 使用 `push` 跳转路由，使用 `pop` 进行返回。

```dart
// 跳转路由
Navigator.push(
  context,
  // 一般使用 MaterialPageRoute 进行路由控制，当然你也可以自定义路由
  MaterialPageRoute(builder: (context) => SecondRoute()),
);

// 返回上一级
Navigator.pop(context);
```

以下是路由跳转的示例

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(
    title: 'Navigation Basics',
    home: FirstRoute(),
  ));
}

class FirstRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('First Route'),
      ),
      body: Center(
        child: RaisedButton(
          child: Text('Open route'),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => SecondRoute()),
            );
          },
        ),
      ),
    );
  }
}

class SecondRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Second Route"),
      ),
      body: Center(
        child: RaisedButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: Text('Go back!'),
        ),
      ),
    );
  }
}
```

### 路由传值

在前端中，路由可以通过 `querystring` 或者 `pushState` 进行参数传递，那么在 `flutter` 中如何进行路由传值呢。

**在 flutter 中可以在跳转路由的 builder 函数中，把将要传递的值作为组件的参数进行传递。**

```dart
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondRoute(props)),
);
```

### 命名路由 (Named Routes)

在 SPA 应用中会使用，路径以及组件的对应表来管理路由，伪代码如下

```javascript
const routes = {
  '/admin': Admin,
  '/user': User
}
```

在 flutter 中，可以在 MaterialApp 声明一个路径组件对应表，而路径即 Named Routes。

在页面间进行路由跳转时可以直接使用路径名称 `Navigator.pushNamed(context, '/user')`。

以下是一个命名路由的示例，来自官方。

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(
    title: 'Named Routes Demo',
    initialRoute: '/',
    routes: {
      '/': (context) => FirstScreen(),
      '/second': (context) => SecondScreen(),
    },
  ));
}

class FirstScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('First Screen'),
      ),
      body: Center(
        child: RaisedButton(
          child: Text('Launch screen'),
          onPressed: () {
            Navigator.pushNamed(context, '/second');
          },
        ),
      ),
    );
  }
}

class SecondScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Second Screen"),
      ),
      body: Center(
        child: RaisedButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: Text('Go back!'),
        ),
      ),
    );
  }
}
```

> 参考官方文档 [Navigate with named routes](https://flutter.dev/docs/cookbook/navigation/named-routes)


### 路由管理

在一个 `flutter` 应用中可以使用命名路由进行管理。也可以使用 [fluro](https://github.com/theyakka/fluro) 统一管理路由。

## 包管理

现在我们已经掌握了组件，路由，状态的用法，已经可以写一个相对简单的应用了。但我们现在仅仅只在单文件中进行操作，且没有引入额外的库。而且，你肯定发现了文件首行的代码

```dart
import 'package:flutter/material.dart';
```

### 引入库 (Importing a Library)

在 `Dart` 中，引入官方库使用 `dart:<library>`，比如

```dart
import 'dart:convert';
```

而对于其它非Dart官方库，采用 `package:<package>/<library>.dart`，比如 flutter

```dart
import 'package:flutter/material.dart';
```

更多三方库可以在 https://pub.dartlang.org/flutter 上查找

```dart
import 'package:url_launcher/url_launcher.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
```

**在 `Dart` 中有很烦的一点是你当你使用某个 API 的时候，你不知道它出自与哪个库去，这时候你可以在引入库的时候使用 `json` 显式标明。**

```dart
import 'dart:convert' show json;
```

在使用第三方库之前还需要引用依赖，并安装，进行包管理

### 如何引入另一个文件

以上引入的都是第三方库或者官方的一些库，如果需要引入本地路径下的文件呢。

> 参考 [How to reference another file in Dart?](https://stackoverflow.com/questions/12951989/how-to-reference-another-file-in-dart?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa)

### 依赖

在学习 flutter 的包管理工具之前，先回顾一下 node 的包管理工具 `npm`。

npm 使用 `package.json` 管理包，使用 `package-lock.json` 锁定包的版本，避免开发环境与生产环境的不一致。

而在 flutter 中，也有同样功能的两个文件。他们的版本号也同样遵守 [Semantic Versioning](https://semver.org/spec/v2.0.0-rc.1.html)

+ `pubspec.yaml` 👉 `package.json`
+ `pubspec.lock` 👉 `package-lock.json`

在使用第三方库之前，还需要 **手动编辑** `pubspec.yaml` 添加依赖

```yaml
dependencies:
  url_launcher: ^5.0.2
```

然后进行安装

```shell
flutter packages get
```

## Permission API

PACKAGE_USAGE_STATS

```xml
<uses-permission
  android:name="android.permission.PACKAGE_USAGE_STATS"
  tools:ignore="ProtectedPermissions" />
```

## http 请求

flutter 作为移动端框架，更多时候需要服务器的支持，一个 http 请求库此时应是登场的时候了。

你对一个 http 请求库的了解程度取决于你对 `http protocol` 的了解程度，需要使用时直接查找文档即可。这里仅仅列出它如何发送最为常见的 `GET` 和 `POST` 请求。

`http` 请求属于异步操作，返回一个 `Future`。如果你对此概念感到陌生，你需要往上翻，复习一下 `Future` 的用法。

这里介绍一个国人写的请求库 `dio`，为了能够使用它，这里首先介绍一下包管理器。


编辑 `pubspec.yaml`，添加依赖库 `dio`

```yaml
dependencies:
  flutter:
    sdk: flutter
  dio: ^2.1.0
```

接下来 `flutter packages get` 装包，重启，完成了 dio 的安装。

在需要的文件中，引入它

```dart
import 'package:dio/dio.dart';
```

### Dio

```dart
Response response;
Dio dio = new Dio();

response = await dio.get('/')
response = await dio.post('https://shici.xiange.tech/graphql', data: { 'query': '{ping}' });

// {"data":{"ping":"pong"}}
print(response)

// 'pong'
print(response.data['data']['ping']);
```

### JSON

dart 的 JSON 处理实在是丧心病狂了，相当怀念 `js`，不过也没办法，毕竟 JSON 的全称是 `JavaScript Object Notation`。

```dart
import 'dart:convert' show json;

var s = '{"name": "shanyue"}'

Map<String, dynamic> user = json.decode(s);

print(user['name'])
```

> 其实作为以前写 python 和 javascript 的我表示完全无所谓...

### StreamBuilder && FutureBuilder

想象一个经典场景，当加载数据时显示加载状态，加载完成后正常显示数据。按照以前的思路，使用 jsx 做了伪代码如下

```jsx
{
  loading <Loading /> : <Page />
}
```

不过在 flutter 中可以使用 `FutureBuilder` 来进行实现

### Memoization

## 存储

### key/value 存储

**package -> `shared_preferences`**

```dart
import 'package:shared_preferences/shared_preferences.dart';

SharedPreferences prefs = await SharedPreferences.getInstance();
prefs.setInt('count', 100);
final count = prefs.getInt('counter');
```

### database

**package -> `sqflite`**

## 参考

+ [flutter 组件定位指南](https://fireship.io/lessons/flutter-widget-positioning-guide/)
+ [Flutter Cookbook](https://flutter.dev/docs/cookbook)
+ [react native VS flutter](https://hackr.io/blog/react-native-vs-flutter)
