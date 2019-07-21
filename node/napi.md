---
alias: "没写过 C++ 插件的 Node 开发工程师不是一个好的程序员"
date: 2021-09-02 11:31
location: 成都市双流区
---

# Node API 与 C++ 扩展

大家好，我是山月。

我还有工作的时候，据我同事说，他作为一个 Node 开发者去字节跳动面试时，面试官问到: 你写过 C++ 的扩展吗？

自此之后，他再也没有面试过 Node，前几天听闻他的消息时，他的 title 已变成前端开发工程师，当他再次大厂面试时，对以前的 Node 经验闭口不提。

今天将学习 node 中的 `napi`, 并从零写一个关于 C 的拓展。不啰嗦，直接开始。

1. 如何使用 Node API 写一个 `hello, world`
1. 如何使用 Node API 写一个 `sum(a, b)`
1. 如何使用 Node API 迁移 C library

代码地址: [shfshanyue/node-examples/napi](https://github.com/shfshanyue/node-examples/tree/master/native/napi)，可直接下载，并编译。

## 00 编译环境准备

+ python

## 01 node-gyp 配置

``` bash
$ npm install -g node-gyp

$ npm init
```

在根目录添加文件 `binding.gyp`

``` py
{
  "targets": [{
    "target_name": "module",
    "sources": [ "./module.c" ]
  }]
}
```

## 02 第一个 C 扩展: hello, world

在项目根目录新建文件 `module.c`，文件内容如下

+ `napi_env`: 一个 v8 隔离实例的抽象
+ `exports`: 用以模块的导出
+ `napi_value`: JS 中变量的抽象
+ `napi_set_named_property`: 用以为 JS 对象创建属性
+ `napi_create_string_utf8`: 用以将 C 中的字符串转化为可供 JS 使用的 napi_value

``` c
// 关于 node api 的库
#include <node_api.h>

// 关于出自字符串的库，如以下获取字符串的长度
#include <string.h>

napi_value Init(napi_env env, napi_value exports) {
    napi_value nHello;
    char* hello = "hello, world";

    napi_create_string_utf8(env, hello, strlen(hello), &nHello);
    napi_set_named_property(env, exports, "hello", nHello);

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```

可看出核心流程为:

1. C 声明定义一个变量
2. C 中的变量通过 API `napi_create_xxx` 转化为在 JS 中可以使用的 `napi_value`
3. C 中通过 API `napi_set_named_property` 将该变量导出

## 03 编译

通过 `node-gyp` 可编译得到 `build/Release/module.node`，一个二进制文件。

与 `.json`、 `.js` 一样，`.node` 是 Node 中原生支持的模块，也是我们在代码中需要引用的路径。

``` bash
$ node-gyp rebuild

$ tree
.
├── binding.gyp
├── build
│   ├── Makefile
│   ├── Release
│   │   ├── module.node
│   │   └── obj.target
│   │       └── module
│   │           └── module.o
│   ├── binding.Makefile
│   ├── config.gypi
│   ├── gyp-mac-tool
│   └── module.target.mk
├── index.js
├── module.c
└── package.json

4 directories, 11 files
```

## 04 在 Node API 中导出函数

一个 `hello, world` 过于简陋，这里示例一个高级版的 `hello, world`: 导出一个函数。

+ `napi_value sum(napi_env env, napi_callback_info info)`: 创建一个可在 JS 环境中使用的函数
+ `napi_get_cb_info(env, info, &argc, argv, NULL, NULL)`: 读取函数输入参数 (与读取脚本输入时 argc/argv 类似)

其余步骤与 `hello, world` 版相同，即在 C/JS 中变量进行切换。

``` c
#include <node_api.h>
#include <string.h>

napi_value sum(napi_env env, napi_callback_info info) {
    napi_status status;

    size_t argc = 2;
    napi_value argv[2];

    int a = 0;
    int b = 0;

    // 获取函数参数, argc 为参数的数量，argv 为参数数组
    napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    
    // napi_value -> int: 类型转化
    napi_get_value_int32(env, argv[0], &a);
    napi_get_value_int32(env, argv[1], &b);
    
    int sum = a + b;

    napi_value nSum;
    // int -> napi_value: 类型转化
    status = napi_create_int32(env, sum, &nSum);
    return nSum;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_value nSum;

    napi_create_function(env, NULL, 0, sum, NULL, &nSum);
    napi_set_named_property(env, exports, "sum", nSum);

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```

## 05 移植已有的 C/C++ 库

在某种情况，我们无需自己开发 C/C++ 库，只需将成熟的 C/C++ 库进行移植。

``` c
int compute (int n)
```

此处，只需要补充以下胶水代码即可。

``` js
napi_value myGzip(napi_env env, napi_callback_info info) {
    napi_status status;

    size_t argc = 1;
    napi_value argv[1];

    int a = 0;

    // 获取函数参数, argc 为参数的数量，argv 为参数数组
    napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    
    // napi_value -> int: 类型转化
    napi_get_value_int32(env, argv[0], &a);
    
    // 在此处进行胶水的粘合即可
    int c = compute(n)

    napi_value result;
    // int -> napi_value: 类型转化
    status = napi_create_int32(env, n, &result);
    return result;
}
```

## 06 版本发布

发包时，仅仅需要 `module.node` 即可，可大幅减小包的体积，也减轻使用该包的人的心智负担。

当发布之前，将 `module.node` 单独挪出，并将 `build` 目录清理。

``` js
{
  "build": "node-gyp rebuild && node-gyp clean",
  "prepublishOnly": "npm run build"
}
```

以下为 `bingding.gyp` 配置，成功编译后将目标模块单独摘出。

``` json
{
    "targets": [{
        "target_name": "module",
        "sources": ["./module.c"]
    }, {
        "target_name": "action_after_build",
        "type": "none",
        "copies": [{
            "files": ["<(PRODUCT_DIR)/module.node"],
            "destination": "./"
        }]
    }]
}

```
