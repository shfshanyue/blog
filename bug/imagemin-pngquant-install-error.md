# Pngquant 在 Mac 中构建失败解决方案

**Error: pngquant failed to build, make sure that libpng is installed**

今天调研一个关于 gatsby 的项目 [react-svgr playground](https://react-svgr.com/playground/)。

涉及到了一个 C 的东西: `libpng`。`gatsby` 中一个插件，使用库 `imagemin-pngquant` 借助命令行工具 `pngquant` 去压缩 PNG 图片，其中用到了这个 `libpng`。

**另外说一下，`pngquant` 是一个常见常用的压缩 PNG 的工具，可以尝试了解下它的原理及常见的压缩选项。**

库依赖如下所示:

+ gatsby
  + smooth-doc
    + gatsby-plugin-sharp
      + imagemin-pngquant
        + pngquant-bin
          + pngquant (c)

安装包时报错:

``` bash
$ yarn
...
error /Users/xiange/Documents/svgr/website/node_modules/pngquant-bin: Command failed.
Exit code: 1
Command: node lib/install.js
Arguments:
Directory: /Users/xiange/Documents/svgr/website/node_modules/pngquant-bin
Output:
⚠ connect ECONNREFUSED 0.0.0.0:443
  ⚠ pngquant pre-build test failed
  ℹ compiling from source
  ✖ Error: pngquant failed to build, make sure that libpng is installed
    at /Users/xiange/Documents/svgr/website/node_modules/bin-build/node_modules/execa/index.js:
```

提示，缺失 `libpng`，使用 `brew` 在 Mac 系统安装，未果。

最终，经 Issue [npm install is broken by pngquant-bin dependency](https://github.com/imagemin/imagemin-pngquant) 提示，在 Mac 下的解决方案为:

``` bash
$ brew install pkg-config
```

重新装包，成功
