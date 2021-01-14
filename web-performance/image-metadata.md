---
title: 通过图像 Metadata 对网站性能与安全性进行优化
date: 2021-01-14 15:19
loc: 义乌
---

#  图片的 Metadata 与网站性能优化

当我们拿出自己的手机，来一张美美的自拍时，这张自拍就包含了你的**拍摄时间、位置与机型信息**，称作这个图片的 `Metadata`。越来越多的国产手机支持把 `Metadata` 作为水印，同时有一些产品根据 `Metadata` 信息制作水印相机。据说去年就有这样一个个人开发者的水印小程序大火，山月也曾跃跃欲试去开发一个。嗯，跑远了...

由于位置信息可能泄露，因此它存在安全性问题。由于有诸多信息隐藏在照片，造成照片臃肿，因为它存在潜在的性能问题。

1. Performance
1. Securty

以下图片是山月在杭州的苏堤拍摄，从中可以读取到拍摄时间及特别精准的经纬度，体积大小 7.4 Mb

![]()

## Metadata

+ `EXIF`: 主要是摄像设备的参数，如 ISO、焦距、GIS、机型信息等。
+ `XMP`: XML stuff Adobe inserts into pics。
+ `8BIM`: 使用 PhotoShop 处理过，会携带一些 PS 的信息。
+ `IPTC`: 用户添加的信息
+ `ICC`: 色彩相关的信息

## EXIF 信息读取

> EXIF(Exchangeable Image File format)是可交换图像文件的缩写，是专门为数码相机的照片设定的，可以记录数码照片的属性信息和拍摄数据。EXIF可以附加于JPEG、TIFF、RIFF、RAW等文件之中，为其增加有关数码相机拍摄信息的内容和索引图或图像处理软件的版本信息。

读取 `EXIF` 信息，传统方案在服务端进行，处理图片，提供接口。现代方案可在浏览器端进行，天然的分布式解决方案，不怕大量的访问量，也不用维护服务器，真好。

作为一名合格的 CV 工程师，当然要面向 Github 编程，毕竟离了它可能一行代码都敲不了

两个前端的仓库:

1. [Javascript-Load-Image](https://github.com/blueimp/JavaScript-Load-Image): 4K Star，周 200K Download
1. [exif-js](https://www.npmjs.com/package/exif-js): 周 86K Download

三个后端的仓库:

1. [exif reader](https://github.com/devongovett/exif-reader): 97 Star，周 3K Download, Node
1. [metatdata extractor](https://github.com/drewnoakes/metadata-extractor): 1.8K Star, Java
1. [goexif](https://github.com/rwcarlsen/goexif): 464 Star, Go

## EXIF 信息读取可视化网站

## EXIF 信息读取原理

## EXIF 信息去除

## 参考链接

1. [An Overview of Image Metadata - How It Affects Web Performance and Security](https://www.keycdn.com/blog/image-metadata)
1. [Impact of metadata on Image Performance](https://dexecure.com/blog/impact-of-metadata-on-image-performance/)