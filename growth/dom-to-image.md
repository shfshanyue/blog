---
title: 如何把 DOM/HTML 转化为 JPG/PNG 图片并下载
date: 2021-02-13 11:35

---

# 如何把 DOM 转化为图片并下载

## 案例

> 一、如何把文章中的代码片段保存为高亮格式的图片？

1. 某些博客平台为了保证对高亮格式的代码保有最大的兼容性，可支持把代码转化为兼容良好的图片
1. 保持高亮格式的图片化代码更容易传播与分享

> 二、如何为原创图片添加水印？

1. 水印图片可以更好地防止盗用
1. 水印图片利用水印可以更好的传播

> 三、在我的工作中也曾有一个真实的案例：电子奖状及电子结业证，并可以转化为图片下载。

我负责的一个院校管理系统中，每次期末考试会对学生进行，排名靠前的可获得奖状。而奖状的开头是:

``` text
__同学:

  恭喜你获得第N名，再接再厉。
```

而最终的解决方案就是前端获取数据，并由 DOM 转为图片下载。

> 四、如何开发一个截屏的浏览器插件

那 DOM 是如何转化为图片，能够在前端下载的呢？

## 原理

你现在开始着手调研解决方案，面向浩瀚的开源，借助轮子在 Github 进行疯狂检索，那一定绕不开以下两个贼好用的库

+ [dom-to-image](https://github.com/tsayen/dom-to-image): 7K Star，每周 6 万次下载
+ [html2cannvas](https://github.com/niklasvh/html2canvas): 22.7K Star, 每周 58 万次下载

> 从实践经验来说，[Code](https://code.devtool.tech/) 是一个不错的示例项目，它基于开源项目 [Carbon](https://github.com/carbon-app/carbon)，利用 `dom-to-image` 这个库把高亮代码转化为图片。

但无论选择哪一个库，你仔细研读他们的代码，他们都基于相同的技术方案: 借助 SVG 与 Canvas。

``` js
const node = document.getElementById('app');

const dataURI = await domtoimage.toPng(node)

const img = new Image()
img.src = dataURI
```

## HTML -> SVG: ForeignObject

1. SVG 中的 `<foreignObject>` 元素允许包含来自不同的XML命名空间的元素，意味着 HTML 可以转化为 SVG
1. SVG 是一种文本格式的图片

因此，借助 `foreignObject` 可以很简单地把 HTML 转化为一张图片，注意不同的命名空间用 xmlns 指定

``` svg
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <style>
    div {
      color: #eee;
      background: #333;
      border: 1px solid red;
      font-size: 16px;
    }
  </style>

  <!-- 把 HTML 嵌入到 SVG 中 -->
  <!-- 注意设置高度与宽度 -->
  <foreignObject x="0" y="0" width="200" height="200">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <h1>悯农</h1>
      <p>锄禾日当午，汗滴禾下土</p>
      <p>谁知盘中餐，粒粒皆辛苦</p>
    </div>
  </foreignObject>
</svg>
```

当然这个只是一个简单的示例，真正做到一比一还原还要下点功夫。效果如下所示，可以在浏览器[直接打开](/dom-to-image.svg)中查看图片源代码

![foreignObject 用法](/dom-to-image.svg)

**到这里为止，借助 `SVG(foreignObject)` 已经能够实现了DOM向图片转化的需求，既然已经支持了 SVG，那如何支持 JPG 与 Canvas？**

## SVG -> JPG/PNG: 借助 Canvas

> JPG/PNG 格式的图片如何互相转化格式？

**使用 Canvas 绘制图像**

``` js
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const img = document.getElementById('image')
ctx.drawImage(img, 0, 0, 200, 200)
```

``` js
// 默认转化为 PNG 格式的图片
const png = canvas.toDataURL()

// 可指定转化为 JPG 格式的图片
const jpg = canvas.toDataURL('image/jpeg', 1.0)
```

## 核心步骤: HTML -> SVG -> Canvas -> JPG/PNG

总结一下
