# 突发Gitee 防盗链，图片在外站打不开

今天下午，群内及朋友圈内有小伙伴反映: **Gitee 图床中的图片打不开**

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c0d911e47404cbaac02349ffbb187c0~tplv-k3u1fbpfcp-watermark.image?)

在本文中，我以 `https://gitee.com/Topcvan/js-notes-img/raw/master/%E5%AE%8F%E4%BB%BB%E5%8A%A1%E9%98%9F%E5%88%97.png` 这个图片为例，重现下事发过程。

## 防盗链

我一想，这肯定是突加了防盗链，来看一看防盗链的原理:

**Referer 指当前请求页面的来源页面的地址，用以判断当前页面的访问源。图片防盗链通过判断 `Referer` 是否目标网站而对图片替换为禁止标志的图片。**

> Referer 实际上是单词 `referrer` 的错误拼写

比如，这次 gitee 事件中，gitee 网站上所有图片加载时，浏览器会默认给图片添加上一个请求头: `referer: https://gitee.com/`。而在其它网站，携带的 referer 请求头字段并非 gitee 的网站，则会返回一个占位符图片。

**但是，一般来说，防盗链图片在浏览器图片能够直接打开，因为在浏览器直接打开，不会携带 `referer` 请求头字段，防盗链配置会对此放行。**

如果是这样，如果在个人网站上，可**通过 [Referrer Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referrer-Policy) 配置所有图片请求时不带 `Referer` 请求头字段来跨过防盗链设置**。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/786b24bc83c04aefae5add24c47e9416~tplv-k3u1fbpfcp-watermark.image?)

``` html
<meta name="referrer" content="no-referrer">
```

为此，我专门做了两个网页，根据已经设置了防盗链的 mdnice 网址图片，对照了一番:

+ 添加了该头，成功绕过了防盗链设置: https://vercel-api.shanyue.vercel.app/referrer
+ 没添加该头，图片被 403 禁止访问: https://vercel-api.shanyue.vercel.app/referrer/forbidden.html

![403](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b5f4a7261ee4920b22b58ca6a21ee61~tplv-k3u1fbpfcp-watermark.image?)

哦对，此时打开两个网址的时候，记得**在浏览器控制台禁止缓存**:(PS: 加一个 Vary: referer 禁止这类问题多好)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f8eae6bab49447ea9bbb6d2474ec6c3~tplv-k3u1fbpfcp-watermark.image?)

然而，这对于 gitee 却没有用！

## gitee 的防盗链措施

但是，gitee 设置的防盗链措施更为严格:

**在 gitee 中的图片，如果没有携带 referer 也会进行防盗链处理**

为此，我根据 `referer` 字段做了一个对照试验。

通过 cURL **直接请求图片地址，无任何内容返回**:

``` bash
$ curl 'https://gitee.com/Topcvan/js-notes-img/raw/master/%E5%AE%8F%E4%BB%BB%E5%8A%A1%E9%98%9F%E5%88%97.png' \
  --compressed
```

通过 cURL 直接请求图片地址，并**携带上 `referer` 字段，有内容并正确返回**:

``` bash
$ curl 'https://gitee.com/Topcvan/js-notes-img/raw/master/%E5%AE%8F%E4%BB%BB%E5%8A%A1%E9%98%9F%E5%88%97.png' \
  -H 'Referer: https://gitee.com/' \
  --compressed
Warning: Binary output can mess up your terminal. Use "--output -" to tell
Warning: curl to output it to your terminal anyway, or consider "--output
Warning: <FILE>" to save to a file.
```

截图如下:

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7961f75f84a418289caeed5b4f6ed95~tplv-k3u1fbpfcp-watermark.image?)

直接在官网中替换某个 img 的 src 为个人的 gitee 图片地址，正常打开:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4d1324afd4d4a45967786314224abba~tplv-k3u1fbpfcp-watermark.image?)

## 评价

按理来说，防盗链也是为了避免网站中图片等资源被大量盗用，而造成极大的一笔服务器费用。但是 gitee 拥有更好的做法:

1. 提前一个月进行通知，平滑过渡，也不会造成如此之大的反响
2. 防盗链策略过于严格，在浏览器都无法直接打开图片

**哪怕像掘金这样，在右下角加一个自己的水印呢！**

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1d2ec87380447d080ab974e3e37ce06~tplv-k3u1fbpfcp-watermark.image?)
