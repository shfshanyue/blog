# 一段代码的体积压缩优化之旅

大家好，我是山月。

今天的前端一分钟演示一段代码从 110 个字节优化到 14 个字节的压缩过程。

最初，一段代码占用 110 个字节。

``` js
// 对两个数字进行求和
function sum (first, second) {
  return first + second
}

console.log(sum(3, 4))
```

去除注释、空格、空行等无意义字符，将代码压缩成一行。

此时代码还有 68 个字节。

``` js
function sum(first,second){return first+second}console.log(sum(3,4))
```

接着，再将长变量替换为短变量。

此时代码仅有 46 个字节。

``` js
function f(a,b){return a+b}console.log(f(3,4))
```

我们开启代码压缩的神奇魔法，在编译期对代码进行预计算。

经优化，代码最终仅有 14 个字节。

``` js
console.log(7)
```

terser 是 js 中专业的代码压缩工具，在 webpack 中可使用 `terser-webpack-plugin` 进行代码压缩。

我们可以在 Terser REPL 中在线尝试压缩代码。

哦对，在测试环境中用以调试随便打的 console.log，出现在生产环境中是不不太好。

很多同学也将去除生产环境中的 console.log 写在简历上。

这仅仅需要对 terser 添加一个配置项 drop_console 即可完成。

## 纯文字

大家好，我是山月。

今天的前端一分钟演示一段代码从 110 个字节优化到 14 个字节的压缩过程。

最初，一段代码占用 110 个字节。

去除注释、空格、空行等无意义字符，将代码压缩成一行。

此时代码还有 68 个字节。

接着，再将长变量替换为短变量。

此时代码仅有 46 个字节。

我们开启代码压缩的神奇魔法，在编译期对代码进行预计算。

经优化，代码最终仅有 14 个字节。

terser 是 js 中专业的代码压缩工具，在 webpack 中可使用 terser-webpack-plugin 进行代码压缩。

我们可以在 Terser REPL 中在线尝试压缩代码。

哦对，在测试环境中用以调试随便打的 console.log，出现在生产环境中是不不太好。

很多同学也将去除生产环境中的 console.log 写在简历上。

这仅仅需要对 terser 添加一个配置项 drop_console 即可完成。
