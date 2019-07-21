# 如何做一个极客时间返现平台

极客时间给广大码农提供了非常优质的关于互联网技术的内容，其中价格也很公道。

有电商的地方就有渠道，而我作为一个渠道商可以从中获利中间差价。

于是山月今天心血来潮做了一个返现平台，方便大家从中购买，并且省了中间差价：**你从平台购买可以加我微信返现中间差价**，这样你可以以更廉价的方式买一个极客时间的专栏。

今天就谈谈做这个平台的感受及技术栈吧

![](https://user-gold-cdn.xitu.io/2020/7/18/173629065812f691?w=3016&h=1490&f=png&s=1997562)

> 这个平台的链接是 <https://geek.shanyue.tech>

## 技术栈的考虑

关于技术的实现上有三大块: 爬虫、开发、部署。

关于技术的诉求有: 快速部署 (CICD)、网络延迟小 (国内网络)、SEO 友好

本来的设想是: `next.js`、`serverless` 与 `github actions`。但是其中两大块就出了问题：

1. `next.js`: 更好的 SEO，但是更复杂的部署，因为它会起一个 server (其实后来想想也还好)
1. `serverless`: 使用腾讯云的 `serverless` 部署，然而我的域名在腾讯云上没有备案，放弃

最终的技术栈是 `gatsby`、`vercel`，算是满足了快速部署及SEO友好的问题，就差国内网络了。不过既然用到了 `vercel`，以后也会考虑切回它同家的 `next.js`。当然，以后的技术栈也可能是这样

1. `next.js` + 个人服务器部署: 更好的 SEO，部署估计会差强人意
1. `gatsby` + `alioss` + `cdn`: 前期工作会很多，特别是配 cdn 和 https
1. `next.js` + `tencent serverless`: 需要花20天在腾讯云备案

哦对，还有爬虫，可以使用我最近写的一个新库 [https://github.com/shfshanyue/promise-utils](https://github.com/shfshanyue/promise-utils) 中的 `map` 来控制上百个请求的并发度

``` js
const { map, sleep } = require('@shanyue/promise-utils')

const items = await map(courses, async course => {
  const sku = course.column_sku
  const intro = await getIntro(sku)
  await sleep(100)
  return intro
}, {
  concurrency: 3
})
```

## 关于感想

今天从写爬虫到完成部署花了半天时间，其中爬虫半个小时、React一个小时、CSS三四个小时、部署半个小时。想一想前端的活真是又苦有多啊。

在写爬虫时还发现了有意思的状态码：451(UnavailableFor Legal Reasons)，代表因法律问题导致网站不可访问。如果你也有兴趣，你可以试试以下请求：

``` bash
curl curl -vvv 'https://time.geekbang.org/serv/v1/my/data' \
  -X 'POST' \
  --compressed
```

我以前没做过电商的业务，看了极客时间的数据结构之后，特别是看到了 `sku` 那个词还是比较兴奋的，对电商业务这种领域技术也有了一点点兴趣，并在想一想后端的数据库设计，如

+ `Sku` 代表一个商品，则肯定存到一张表中，名为 sku，有原价、折扣价、活动价多种属性
+ `GroupBuy` 指拼团，最近拼团也特别常见，拼团应该也是一张独立的表，与 sku 应该是 1:1 的关系。有关于拼团的折扣信息，条件，等属性
+ `GroupBuyCase` 指实际的拼团案例，如甲乙拼团成功则是一个记录，与 GroupBuy 应该是 1:n 的关系。但是拼团人数有可能过多，这时 User 与 GroupBuy 应该是 m:n 的关系
+ `Seller/Business` 卖家，卖家不知道怎么拼了，在极客时间里的卖家就是出专栏的老师了，有种种关于自己的介绍
+ `Channel` 渠道，也就是我了。每一个渠道会有自己的推荐链接，也有可能对 Sku 有一个自己的推荐链接，此时又是 M:N 关系了，至于推荐链接中的 token 就是个存在数据库的随机数了
+ `User` 用户，也是买家，不知道有没有专有名词

其中用户、渠道、卖家、平台有各种各样的交易，其中的一致性又是如何保证的。光想到这些，电商业务是比我们教育行业的业务是更要复杂的。不知道我的公众号粉丝里是否有电商领域的同学

最后，可以打开原文链接参看这次的效果，如果感兴趣可以买几个专栏找我返现