---
title: 如何调试 node.js 源码

---

## 克隆项目

node.js 源码托管在 [Github](https://github.com/nodejs/node)。

``` bash
$ git clone git@github.com:nodejs/node.git
```

## 编译源码

通过以下命令对 node.js 源码进行编译。

``` bash
$ ./configure --debug && make
```

**等待的时间较长，需要一顿吃火锅的功夫。**

源码编译之后会生成 `./out` 目录，在根目录中会生成可执行命令行工具 `node` 与 `node_g`，指向 `./out` 中的符号链接。

``` bash
node -> out/Release/node
node_g -> out/Debug/node
```

**使用 `node_g` 替代全局的 `node`，可对源码进行调试。**

你可以像使用全局 `node` 命令一样使用它，如查看当前 `node.js` 的版本号，此处显示为 `v17.0.0-pre`。

``` bash
$ ./node_g --version
v17.0.0-pre
$ ./node_g
Welcome to Node.js v17.0.0-pre.
Type ".help" for more information.
> process.versions
{
  node: '17.0.0-pre',
  v8: '9.3.345.16-node.9',
  uv: '1.42.0',
  zlib: '1.2.11',
  brotli: '1.0.9',
  ares: '1.17.2',
  modules: '96',
  nghttp2: '1.42.0',
  napi: '8',
  llhttp: '6.0.2',
  openssl: '1.1.1l+quic',
  cldr: '39.0',
  icu: '69.1',
  tz: '2021a',
  unicode: '13.0',
  ngtcp2: '0.1.0-DEV',
  nghttp3: '0.1.0-DEV'
}
>
```

## 在 VSCode 中调试 node.js 源码

此处仅调试 node.js 源码中 `javascript` 的部分。

1. 新建文件 `hello.js`，通过 `./node_g --inspect-brk hello.js` 方式运行脚本，并打开调试功能
1. 在 `vscode` 中以 `attach` 的方式调试代码，配置如下

``` json
{
  "name": "Attact Node Program",
  "type": "node",
  "request": "attach",
  "port": 9229
}
```

若要使用 `node_g` 调试任意位置中项目的源码，可把 `node_g` 符号链接至全局的 `$PATH` 中，这步很重要，对下一步有用。

``` bash
$ ln -s /Users/xiange/Documents/node/out/Debug/node /usr/local/bin/node_g
```

当调试时，通过 `node_g` 开启项目，并使用 `attach` 监听端口进行调试。

## 在 VSCode 中调试 C++/node.js 源码

[调试 C++ 需要下载相关插件](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/image.6sfjp5qt0ig0.png)

当调试 C++ 源码时，使用以下配置，可调试执行任意脚本时的 node.js 源码(C++/Javascript):

``` js
{
  "name": "(lldb) Node Source Code",
  "type": "cppdbg",
  "request": "launch",

  // 注意上一步已将 node_g 进行了符号链接
  "program": "/usr/local/bin/node_g",
  "stopAtEntry": true,
  "cwd": "${workspaceFolder}",

  // 对于 JS 打开调试，调试文件为第二个参数，可自行修改
  "args": ["--inspect-brk", "${workspaceFolder}/native/https/index.js"],
  "environment": [],
  "externalConsole": true,
  "MIMode": "lldb"
}
```

![使用 VSCode 调试 C++](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/debug-cc.2z00y6ermrs0.png)

1. 当调试 C++ 时，使用 VSCode 调试器进行调试
1. 当调试 C++ 过程中需要调试 node.js 时，使用 Chrome 浏览器进行调试

![使用 Chrome 调试 Jsvascript](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/debug-node.15rd4d61su74.png)

## 一个示例

以下代码是关于以上调试部分的一个示例，包含源码及调试配置部分。

联系山月微信 (`shanyue94`) 获取。
