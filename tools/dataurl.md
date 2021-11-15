---
date: 2021-11-09
---

# 一周一度的新站发布: 一款 DataURL 处理相关工具

大家好，我是山月。今天周二，又到了一周一度的山月新站发布时间。

先睹为快，附上链接: <https://devtool.tech/dataurl>。

哦对，时隔半年，最近我又在 B 站直播，我会把我开发者工具网站上所有工具都在 B 站上传视频讲解一遍使用及其原理。可在 B 站搜索**程序员山月**关注我。

![DataURL Preview](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4e005dae12c407283245fdea1477556~tplv-k3u1fbpfcp-zoom-1.image)

可根据图片生成其 DataURL，也可根据 DataURL 实时预览图片。并展示了 DataURL 的原理及使用场景。

## 如何使用

### DataURL Preview

在输入框直接输入 DataURL，将在右侧进行实时预览。

### DataURL Generator

在输入框上侧点击上传图片，将在输入框中生成 Base64 DataURL，并在右侧进行实时预览。

## 工作原理

`Data URL` 由四个部分组成：

1. 前缀(`data:`)
2. 指示数据类型的MIME类型(`[<mediatype>]`)，所有 MIME Type，可查 [mime-db](https://github.com/jshttp/mime-db)
3. 如果二进制数据则为可选的base64标记，比如图片(`[;base64]`)
4. 数据

```
data:[<mediatype>][;base64],<data>
```

因此，任意 `MIME Type` 的资源均可以表示为 DataURL 而不仅仅限于图片。

## 将图片生成 DataURL

将图片生成 DataURL 的方式有两种:

1. Blob -> FileReader  -> DataURL
1. Blob -> ArrayBuffer -> DataURL

这里仅列举其中第二种实现:

``` ts
function blobToDataURL(blob: Blob): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.addEventListener('load', () => {
      const url = reader.result as string
      resolve(url)
    }, false)
    reader.addEventListener('error', (e) => {
      reject(e)
    }, false)
    reader.readAsDataURL(blob)
  })
}
```

## 应用

在工程化实践中，往往会将小于 `8KiB` 的图片展示为 Base64 DataURL，并内联在 HTML 中。从而减少小体积图片 HTTP 请求的次数，并提升页面性能。

在 `webpack 4` 中进行如下配置:

``` js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            }
          },
        ],
      },
    ]
  }
}
```

在 `webpack 5` 中进行如下配置:

``` js
{
  test: /\.(png|jpe|gif)$/,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8192
    }
  }
}
```

---

下一个工具与新功能的建议欢迎留言！

---

下一个工具，我已经想好了，一个 `SVG Viewer`，可压缩可美化、可预览图片、可生成 DataURL、可转为 JPG/PNG、可转为 React Component。

本次这个工具(DataURL)更像是为下个工具作准备，总之功能很多，敬请期待。
