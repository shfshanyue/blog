# 如何云养一只猫

**一起用代码吸猫！本文正在参与[【喵星人征文活动】](https://juejin.cn/post/7024369534119182367/ "https://juejin.cn/post/7024369534119182367/")。**

大家好，我是山月。

最近我开发了一个网站: [云吸一只猫](https://cat.shanyue.tech)，代码置于仓库 [random-cat](https://github.com/shfshanyue/random-cat) 中。以下两张图片都来自我的网站截图，来这里吸猫吧。

![](https://images.unsplash.com/photo-1523659568202-85268a087db7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8YW5pbWFsLGNhdHx8fHx8fDE2MzY1MTE4NTY&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1600)

![](https://images.unsplash.com/photo-1511044568932-338cba0ad803?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8YW5pbWFsLGNhdHx8fHx8fDE2MzY1MTE5NjI&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1600)

以下讲解本网站的开发历程。

## Cat As a Service: 如何随机拿到一只猫的图片

一个自由开发者，如何获得免费的 API 服务？

![public api](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75dc9c34893545ac8c9db863f6dc356f~tplv-k3u1fbpfcp-watermark.image?)

[public-apis](https://github.com/public-apis/public-apis) 就是这样一个好地方，程序员的免费 API 集市，收藏了若千个免费的 API。它是 Github 上的一个仓库，目前已经有 167K 颗星星。

你可以在这里找到:

1. 免费的 CDN
1. 免费的图片、视频资源存储
1. 免费的主机托管服务
1. 免费的代码托管服务
1. 免费的天气预报 API、GeoJSON API
1. 免费的...更多 API

你甚至可以找到关于一只猫的 API:

``` bash
$ curl https://aws.random.cat/meow
{"file":"https:\/\/purr.objects-us-east-1.dream.io\/i\/4QEZq.jpg"}
```

它仅仅有一个缺点，大部分为海外服务。不过不打紧，对于云养猫，已经足够了。

## Unsplash: 更漂亮的一只猫

不过，`random.cat` 上的猫无法指定尺寸，需要另寻一个更高级的 API。

此时，我注意到了 `Unsplash`，它是一个可免费商用的图片服务网站，其中图片异常精美，被国内的设计同学经常引用。使用它，就可以拿到一只更漂亮的猫。

对于开发者最友好的一点是: 它有功能齐全、非常完善的 Developer API 及其文档。

如果需要根据关键词进行索引图片，可使用以下 API。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2568db26b21406889a1f35095ac0216~tplv-k3u1fbpfcp-watermark.image?)

把关键字指定为 `animal,cat`，就得到了专属 Cat API。

``` html
<img src="https://source.unsplash.com/1600x900/?animal,cat">
```

## 开发网站: 云吸一只猫

最终来到了开发环节，这个网站的目标就是: 每次刷新随机拿到一只全屏猫。

那如何做到全屏呢？

``` css
.fullscreen {
  object-fit: cover;
  width: 100vw;
  height: 100vh;
}
```

如果使用 `tailwindcss` 开发，更加简单。

``` html
<img src="https://source.unsplash.com/1600x900/?animal,cat" className="object-cover w-screen h-screen" />
```

再加上一些必要的 `title` 等信息，网站开发大成！

``` jsx
import { Helmet } from 'react-helmet'

const Home = () => (
  <div>
    <Helmet
      title="云吸一只猫"
      meta={[{ property: 'og:title', content: '云吸一只猫' }]}
    />
    <img src="https://source.unsplash.com/1600x900/?animal,cat" className="object-cover w-screen h-screen" />
  </div>
)

export default Home
```

## 部署上线

部署上线前的准备工作！

+ 技术栈: Next.js
+ 部署平台: Vercel
+ 仓库: [shfshanyue/random-cat](https://github.com/shfshanyue/random-cat)
+ 域名: `cat.shanyue.tech`

记住要把 `cat.shanyue.tech` 的 CNAME 记住指向 Vercel。

``` bash
$ dig +short cat.shanyue.tech
cname.vercel-dns.com.
76.223.126.88
```

准备好后，登录 `vercel` 即可一键部署。详细步骤可参考 [Vercel 部署](https://shanyue.tech/no-vps/api.html#hello-world)。可见网址: <https://cat.shanyue.tech>

## 开发总结

有的同学会认为这个网站开发的相当简单，只需要几行代码即可搞定。

其实并不是这样，**开发该网站花费了我三天的时间**。其中 API 分析调研与技术调研三天，开发部署半个小时。

1. API 分析调研，查找了各种关于 `Random Cat` 的 API，最后才锁定了使用 `Unsplash`。**这个是必要的，且非常必要**。
1. 技术调研，最近 next.js 升级到了 12，查看了 swc 及 Image 的各种优化，**这个是没必要的**。虽然没有必要，但作为个人项目，每次总是使用一些较新特性，也就忍不住看看新的文档。即便项目中并无需使用到新特性。

---

*最后，有什么意见和建议，可以在评论区留言。*