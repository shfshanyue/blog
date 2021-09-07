# 山月新站发布: EXIF 预览器

大家好，我是山月。

最近写了一个有意思但无大用的小工具: [EXIF 预览器](https://devtool.tech/exif)，地址为 <https://devtool.tech/exif>。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/image.5p1nyit63u80.png)

当你拿出智能手机，对着镜子一拍，这张照片就包含了...**拍摄时间、位置、机型信息、拍摄参数等等信息**，称作这个图片的 `Metadata`。

越来越多的国产手机支持把各式各样的 `Metadata` 作为水印，同时有一些产品根据这些信息制作水印相机。其中的原理就是读取 JPEG 的 EXIF 二进制信息，找到特定位置的字节所代表的的参数意义。**JPEG 由许多 `Segement` 组成，而每个 `Segement` 以 `Marker` 打头，每一个 `Marker` 以字节 `0XFF` 打头。**

EXIF 在前端业务开发中也有一些用处，如判断该照片横屏、竖屏及一些水印美化之类。

除了前端开发，还可以利用它做一些性能优化之类的事情。由于有诸多信息隐藏在照片，比如 Thumbnail 等造成照片臃肿，据统计每张 JPEG 这种 15% 的体积就是 Metadata，因此它存在潜在的性能问题。把一张照片的 EXIF 信息删掉可以减小一部分体积，从而提高加载性能。

EXIF 还有哪些应用呢，欢迎评论区留言。
