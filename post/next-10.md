# 如何评价 Next 10

本人在新项目中使用过 Next 10，因此谈一谈关于它的感受。下边是一个 Next 10 的项目，可以感受一下，重点感受图片

+ [开发者武器库](https://devtool.tech/)

在回答这个问题之前，先看一下关于 Next10 的文档 [Next 10 新特性](https://nextjs.org/blog/next-10)。发现对于我那几个项目影响最大的新特性也有可能是对所有开发者影响最大的特性是 `next/image`，于是着重评价一下 `next/image`

**开头见山来说: 它对于图片的优化使网络性能提高了不少，但仍然不能算是最佳实践，仍然有许多问题。初次使用惊艳，再次使用略感鸡肋，不过未来可期**

以下是我项目中使用 `next/image` 处理过后的一个图片:

``` html
<img
  src="/_next/image?url=%2Fassets%2Fsf.png&amp;w=96&amp;q=75"
  decoding="async"
  style="
    visibility: inherit;
    position: absolute;
    inset: 0px;
    box-sizing: border-box;
    padding: 0px;
    border: none;
    margin: auto;
    display: block;
    width: 0px;
    height: 0px;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
  "
  srcset="
    /_next/image?url=%2Fassets%2Fsf.png&amp;w=48&amp;q=75 1x,
    /_next/image?url=%2Fassets%2Fsf.png&amp;w=96&amp;q=75 2x
  "
/>
```

先来看看它做了什么吧: **内置 Image Proxy，对图片进行转换、压缩，使得图片体积最小化。并配合图片懒加载与 srcset 一系列关于图片优化的小点子优化网络体验** Next 团队宣传地也颇为实在

> In order to use images on web pages in a performant way a lot of aspects have to be considered: size, weight, lazy loading, and modern image formats.

举一个栗子，如果你使用了一张 `10000px x 10000px` 的 PNG 图片，放到了 `100px x 100px` 的小方格里。那么 next.js 将会做以下操作优化性能

1. 内置 Proxy 服务把它压缩成 100px 与 200px 两张图，大幅度压缩体积
1. 内置 Proxy 服务把它转成 webp，一个体积更小的图片格式 (比 jpg 小 30% 的体积)
1. 内置 Proxy 服务把它转成 75% 压缩质量的 webp，一个更小的体积与几乎无肉眼可见的图片质量变化
1. 懒加载，看不到图片不加载
1. 按需加载 (不像 Gatsby 那样需要在部署项目前耗费大量精力去压缩图片)
1. 由于内置 Proxy 运行时处理，可支持非本域名上的图片处理

**优点说完了，这里说一下它的缺点吧**

1. 无法利用 Long Term Cache，浏览器二次加载时图片速度慢，使 CDN 也无法性能最大化
1. 小图片无法内置为 Data URI，大量的小图片将造成多次 HTTP 请求影响性能，比如我的这个网站: [开发者武器库](https://devtool.tech/)
1. 无法支持多分辨率屏幕
1. CPU，如果部署在 Vercel 可以利用它的服务器资源做缓存服务，如果自部署处理图片需要消耗 CPU。但这个也不算很缺点，只是引入了复杂状态，国内可以利用 Ali_OSS 或公司共有 Image Proxy 做图片缓存服务 **自定义一个 loader，详见文档 <https://nextjs.org/docs/api-reference/next/image#loader>**
1. 还有一个算不上缺点的具有迷惑性的点：虽然响应的后缀名是 png，但是返回的 MIME 是 image/webp

``` bash
cache-control: public, max-age=0, must-revalidate
content-disposition: inline; filename="svgo.png"
content-length: 3628
content-type: image/webp
```

再来看看一个我所认为的比较优秀的图片实践，基本上是 next/image 的实践，及对它缺点的完善。经过处理的图片显示为下边这种形式:

> 这个图片格式出自我的另一个项目：[前端技术周刊](https://weekly.shanyue.tech)

``` html
<picture>
  <source
    srcset="
      /static/820815c23f4a6baa71bf38aa266126a4/6988c/huangyuanmao.webp  158w,
      /static/820815c23f4a6baa71bf38aa266126a4/7a400/huangyuanmao.webp  315w,
      /static/820815c23f4a6baa71bf38aa266126a4/2923b/huangyuanmao.webp  630w,
      /static/820815c23f4a6baa71bf38aa266126a4/295cf/huangyuanmao.webp  945w,
      /static/820815c23f4a6baa71bf38aa266126a4/d0dac/huangyuanmao.webp 1000w
    "
    sizes="(max-width: 630px) 100vw, 630px"
    type="image/webp"
  />
  <source
    srcset="
      /static/820815c23f4a6baa71bf38aa266126a4/2b62a/huangyuanmao.jpg  158w,
      /static/820815c23f4a6baa71bf38aa266126a4/3583e/huangyuanmao.jpg  315w,
      /static/820815c23f4a6baa71bf38aa266126a4/e40dd/huangyuanmao.jpg  630w,
      /static/820815c23f4a6baa71bf38aa266126a4/8095a/huangyuanmao.jpg  945w,
      /static/820815c23f4a6baa71bf38aa266126a4/4edc6/huangyuanmao.jpg 1000w
    "
    sizes="(max-width: 630px) 100vw, 630px"
    type="image/jpeg"
  />
  <img
    class="gatsby-resp-image-image"
    src="/static/820815c23f4a6baa71bf38aa266126a4/e40dd/huangyuanmao.jpg"
    alt="祁连山国家公园青海片区拍摄到的荒漠猫"
    title="祁连山国家公园青海片区拍摄到的荒漠猫"
    loading="lazy"
    style="
      width: 100%;
      height: 100%;
      margin: 0px;
      vertical-align: middle;
      position: absolute;
      top: 0px;
      left: 0px;
      opacity: 1;
      color: inherit;
      box-shadow: white 0px 0px 0px 400px inset;
    "
  />
</picture>
```

总结一下一个图片的最佳实践包括的要素

1. 优秀的现代化标签 picture 用以代替 img
1. 对图片进行自动化转换处理，使用 avif/webp 作为现代化的图片格式，jpg/png 兼容低浏览器
1. 对图片进行自动化压缩处理，图片并不需要那么大
1. Long Term Cache 的支持 (通过编译，对编译的条件有所提高)
1. 小图片内嵌为 Data URI，减少 HTTP 请求
1. 域外图片的压缩处理，如数据库中的图片地址
1. 懒加载

现代一个优秀的图片处理应该是**编译期对静态文件压缩转换、运行期图片服务对动态图片的压缩转换**，以上最佳实践的要素完全可以被这两种方案所覆盖。

以下是 Gatsby 处理一个动态图片，是不与 next.js 的 loader 很像？根据它的 [文档](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/adding-gatsby-image-support/)，被称为 URL Builder

``` js
// In this example we use a custom `quality` option
const generateImageSource = (baseURL, width, height, format, fit, options) => {
  const src = `https://myexampleimagehost.com/${baseURL}?w=${width}&h=${height}&fmt=${format}&q=${options.quality}`
  return { src, width, height, format }
}
```

编译期间压缩文件也有一些挑战，编译期间压缩图片需要依赖许多底层库，比如 pngquant、mozjpeg 等复杂的依赖，但大体上没有什么大问题

因此，Next 10 对 Image 的处理提升空间很大，未来可期！
