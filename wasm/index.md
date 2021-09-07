# WASM 入门

## 目标

在浏览器或者 Node.js 中运用其它编程语言提供的功能进行编码。

![wasm-web](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/wasm-web.7be01jplvzo0.png)

![wasm-node](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/wasm-node.67a0yfrkrek0.png)

1. 可移植。比浏览器更丰富的功能，如图片在线压缩。
1. 高性能。比 Node 更高的性能。
1. 可调试

## 术语

``` c
int main() { 
  return 42;
}
```

``` js
var wasmModule = new WebAssembly.Module(wasmCode);
var wasmInstance = new WebAssembly.Instance(wasmModule, wasmImports);
log(wasmInstance.exports.main());
```

+ `Module`
+ `Instance`
+ `memory`

## 使用 C+++ 编写第一个 WASM

## 从 C++/Rust/Go 到 JS

``` js
C++ -> WASM -> JS
```

1. C++。使用 C++ 编写源码。
1. C++ Binary。把源码编译为二进制。
1. WebAssembly 实例化。在 JS 中通过 WebAssembly API 加载运行模块，进行实例化。
1. JS。

## 实例化

``` js
fetch('module.wasm').then(response =>
  response.arrayBuffer()
).then(bytes =>
  WebAssembly.instantiate(bytes, importObject)
).then(results => {
  // Do something with the compiled results!
});
```

## 
