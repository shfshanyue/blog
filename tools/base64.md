---
date: 2022-03-04
---

# 一周一度的新站发布: 一款 Base64 编码解码工具

大家好，我是山月。

最近开发了一个 Base64 内部编码的过程。

先睹为快，附上链接: <https://devtool.tech/base64>。

Base64 编码及解码工具，但与以往工具不同的是，他图表演示了字符串从 unicode 到 uint8 再到 base64 的全过程，能够让你更加了解 Base64 的原理。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-02-27/clipboard-9461.b42188.webp)

## Base64 小解

`Base64` 是基于 64 个可打印字符来表示二进制数据的一种编码方式，是最为流行的 `binary-to-text` 编码算法。见 [Base64](https://en.wikipedia.org/wiki/Base64)。

在前端工程化实践过程中，将会把二进制JPG/PNG图片转化为 base64 的 `Data URI`，用以减少 HTTP 请求次数。

`base64` 由 `0-9`、`A-Z`、`a-z` 及 `+`、`/` 组成，但是在 URL 中使用 `base64` 时，`/` 容易与路径符号发生冲突。

因此，`URL Safe Base64` 将 `+` 替换为 `_`，`/` 替换为 `-`。

通过 `Base64` 编码，每 `3*8bit` 的字节转换为 `4*6bit` 的字节，剩下的两位用 00 补齐。因此就有了常听到的 Base64 编码后的数据比编码之前大 1/3 的说法。

``` text
10101101, 10111010, 01110110
00101011, 00011011, 00101001, 00110110
```

## 转化过程

1. 将数据转化为 uint8 二进制
1. 将转化后的二进制每六个分为一组，共有 64 中可能 (0-63)
1. 将六位一组的二进制，计算出 Index (0-63)，并根据以上速对表及 Index 找到对应的 base64 字符
1. 由此编码后 base64 长度为 4 的倍数，不足使用 `=` 进行填充

> PS: 关于第4点，使用 `=` 进行补充，规范描述: base64 将原数据三个字节数最终编码为四个字节，但是原数据字节数最终有可能不足三个，原数据字节数可能会多一到两个字节。如果多一个字节，则编码结果最后填充 `==`，如果多两个字节，则编码结果最后填充 `=`。
>
> 见: <https://datatracker.ietf.org/doc/html/rfc4648#section-4>
> 
> 1. The final quantum of encoding input is an integral multiple of 24 bits; here, the final unit of encoded output will be an integral multiple of 4 characters with no "=" padding.
> 2. The final quantum of encoding input is exactly 8 bits; here, the final unit of encoded output will be two characters followed by two "=" padding characters.
> 3. The final quantum of encoding input is exactly 16 bits; here, the final unit of encoded output will be three characters followed by one "=" padding character.
> 
> 规范以原字节数为视角进行描述，如果原数据字节数为 1，编码结果长度为2，需填充 2 个 =，原数据字节数为 2，编码结果长度为 3，需填充 1 个 =。换算成编码后视角而言，则为编码输出最终必须为 4 的倍数，不足使用 `=` 进行补齐。

## API

### Rest API

本站点对 Base64 提供对外 API 接口可供调用:

``` bash
# 编码
$ curl -L devtool.tech/api/base64?s=hello

# 解码
$ curl -L devtool.tech/api/base64?s=5bGx5pyI&d
```

Live Demo: <https://devtool.tech/api/base64?s=hello>

### JS

在浏览器环境中可借助 `btoa/atob` 编码解码，在 Node 环境中借助于 `Buffer API` 编码解码。另可借助于 [base64-js](https://github.com/beatgammit/base64-js/blob/master/index.js)

``` ts
const base64 = {
  encode (v: string) {
    return isBrowser ? btoa(v) : Buffer.from(v).toString('base64')
  },
  decode (v: string) {
    return isBrowser ? atob(v) : Buffer.from(v, 'base64').toString()
  }
}
```

### Bash

在 `Mac/Linux` 中可以通过命令行工具 `base64` 进行解码编码

``` bash
# 编码
$ echo hello | base64
aGVsbG8K

# 解码
$ echo aGVsbG8K | base64 -d
hello
```
