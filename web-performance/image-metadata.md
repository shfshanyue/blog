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

以下图片是山月在杭州的苏堤拍摄，从中可以读取到拍摄时间及特别精准的经纬度，体积大小 6.83 Mb

![杭州-苏堤](./assets/hang-sudi.jpeg)
## Metadata

+ `EXIF`: 主要是摄像设备的参数，如 ISO、焦距、GIS、机型信息等
+ `XMP`: XML stuff Adobe inserts into pics
+ `8BIM`: 使用 PhotoShop 处理过，会携带一些 PS 的信息
+ `IPTC`: 用户添加的信息
+ `ICC`: 色彩相关的信息

## EXIF 信息读取

> EXIF(Exchangeable Image File format)是可交换图像文件的缩写，是专门为数码相机的照片设定的，可以记录数码照片的属性信息和拍摄数据。EXIF可以附加于JPEG、TIFF、RIFF、RAW等文件之中，为其增加有关数码相机拍摄信息的内容和索引图或图像处理软件的版本信息。

读取 `EXIF` 信息，传统方案在服务端进行：处理图片，提供接口。现代方案可在浏览器端进行，天然的分布式解决方案，不怕大量的访问量，也不用维护服务器，没有网络的传输，解析速度更快，也无文件隐私问题。

作为一名合格的 CV 工程师，当然要面向 Github 编程，毕竟离开了它可能一行代码都敲不了，以下是关于读取 Exif 信息的几个仓库:

两个前端的仓库:

1. [Javascript-Load-Image](https://github.com/blueimp/JavaScript-Load-Image): 4K Star，周 200K Download
1. [exif-js](https://www.npmjs.com/package/exif-js): 周 86K Download

三个后端的仓库:

1. [exif reader](https://github.com/devongovett/exif-reader): 97 Star，周 3K Download, Node
1. [metatdata extractor](https://github.com/drewnoakes/metadata-extractor): 1.8K Star, Java
1. [goexif](https://github.com/rwcarlsen/goexif): 464 Star, Go

一个命令行工具:

1. [exiftool](https://github.com/exiftool/exiftool)

## EXIF 信息读取可视化工具

Mac笔记本:

![在 Mac 上读取 Metadata 信息](./assets/han-exif-sudi.png)

可视化网站:

+ [EXIF 可视化工具](https://devtools.tech/exif)
+ [metapicz](http://metapicz.com/)
+ [jimpl](https://jimpl.com/)

命令行工具:

``` bash
$ brew install exiftool
$ exiftool ../Desktop/WechatIMG12.jpeg 
ExifTool Version Number         : 11.85
File Name                       : WechatIMG12.jpeg
Directory                       : ../Desktop
File Size                       : 9.3 MB
File Modification Date/Time     : 2021:01:14 15:29:32+08:00
File Access Date/Time           : 2021:01:18 23:04:18+08:00
File Inode Change Date/Time     : 2021:01:18 22:28:52+08:00
File Permissions                : rw-------
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
ISO                             : 50
...
```

## Metadata 信息读取原理

读取 JPEG 图像的 Metadata 信息，就要了解并解析 JPEG 的二进制格式。**JPEG 由许多 `Segement` 组成，而每个 `Segement` 以 `Marker` 打头，每一个 `Marker` 以字节 `0XFF` 打头。**

<table><thead><tr><th>Short Name</th><th>Bytes</th><th>Payload</th><th>Name</th><th>Comments</th></tr></thead><tbody><tr><td>SOI</td><td>0xFF, 0xD8</td><td>none</td><td>Start of Image</td><td></td></tr><tr><td>S0F0</td><td>0xFF, 0xC0</td><td>variable size</td><td>Start of Frame</td><td></td></tr><tr><td>S0F2</td><td>0xFF, 0xC2</td><td>variable size</td><td>Start fo Frame</td><td></td></tr><tr><td>DHT</td><td>0xFF, 0xC4</td><td>variable size</td><td>Define Huffman Tables</td><td></td></tr><tr><td>DQT</td><td>0xFF, 0xDB</td><td>variable size</td><td>Define Quantization Table(s)</td><td></td></tr><tr><td>DRI</td><td>0xFF, 0xDD</td><td>4 bytes</td><td>Define Restart Interval</td><td></td></tr><tr><td>SOS</td><td>0xFF, 0xDA</td><td>variable size</td><td>Start Of Scan</td><td></td></tr><tr><td>RSTn</td><td>0xFF, 0xD//n//(//n//#0..7)</td><td>none</td><td>Restart</td><td></td></tr><tr><td>APPn</td><td>0xFF, 0xE//n//</td><td>variable size</td><td>Application specific</td><td></td></tr><tr><td>COM</td><td>0xFF, 0xFE</td><td>variable size</td><td>Comment</td><td></td></tr><tr><td>EOI</td><td>0xFF, 0xD9</td><td>none</td><td>End Of Image</td><td></td></tr></tbody></table>

其中的 `AppN` Segement 中，包含了图像的 EXIF 信息，而解析 EXIF 又可以根据下图:

## Metadata 信息去除

根据文章 [Impact of metadata on Image Performance](https://dexecure.com/blog/impact-of-metadata-on-image-performance/)，Metadata 信息会占到一个图片大小的 15%，不可不忽略，且藏有设备信息及位置信息等敏感信息。

通过对 JPEG 中 Metadata 信息的抹除，可以对图片大小及网络性能起到一个不错的优化。

## 参考链接

1. [An Overview of Image Metadata - How It Affects Web Performance and Security](https://www.keycdn.com/blog/image-metadata)
1. [Impact of metadata on Image Performance](https://dexecure.com/blog/impact-of-metadata-on-image-performance/)
1. [JPEG文件格式解析(一) Exif 与 JFIF](https://cloud.tencent.com/developer/article/1427939)
1. [What is a JPEG file?](https://docs.fileformat.com/image/jpeg/)
1. [What is an EXIF file?](https://docs.fileformat.com/image/exif/)
1. [Exif - wikipedia](https://en.wikipedia.org/wiki/Exif)