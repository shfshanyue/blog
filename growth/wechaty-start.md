---
title: 如何开发第一个微信机器人？
date: 2020-06-29 19:36
description: "你想每天定时向你的女朋友发一句早安吗？wechaty 是一个使用 typescript 开发的机器人，我已经使用 wechaty 做了很多关于有趣的自动化的工作。"
---

# 如何开发一个微信机器人

> 你想每天定时向你的女朋友发一句早安吗？

`wechaty` 是一个使用 `typescript` 开发的机器人，我已经使用 [wechaty](https://github.com/wechaty/wechaty) 做了很多关于有趣的自动化的工作。

你可以通过 `wechaty` 把你的微信变成一个机器人，如果你有两个微信号的话，那就收获了一枚机器人小助手。通过编程的手段与它接入基金与股票的接口，再加一个两点半的定时任务，这样小助手就可以在每天收盘前给你发一个最近的基金趋势信息供你选择。

你还可以把你的常用公众号挂一个机器人，每天早上七点左右向你的女朋友道一句早安，这样她就会在每天醒来时对你的问候充满期待。

**哦对，忘了，程序员是没有女朋友的。**

好了，来实现一个机器人吧。接下来本篇文章开始介绍微信机器人的常见使用场景，及如何用代码来把你的微信变成小助手。

> 加我微信前端交流群的小伙伴们知道我有一个小机器人在管理着群，每天定时推送面试题。而这个微信机器人就是我自己敲代码实现的，今天讲一讲如何实现一个简单机器人。
>
> 我通过 `wechaty` 也实现了一个自娱自乐的机器人
>
> 1. 自动推送文章
> 1. 自动推送技术面试题并在群里讨论
> 1. 基金、天气预报、百科、名言、诗词等自动回复及每日推送功能
>
> 部分代码开源在 [wechat-bot](https://github.com/shfshanyue/wechat-bot)，欢迎来玩
> 
> 另外也欢迎加入我的前端交流群，添加微信 `shanyue-bot`

## 微信机器人应用场景及私域流量

先来瞅一眼，常见的微信操作，而这些都可以通过机器人来完成

+ 消息
  + 收发个人名片、文本、图片、小程序、图文消息
  + 转发文本、图片、小程序、图文消息
+ 群组
  + 建群、设置群公告、获取群二维码
  + 拉人、踢人，并监听相关事件
  + 群列表、群详情、群成员
+ 联系人
  + 添加好友、自动通过好友
  + 好友备注、详情及列表信息

关于机器人的应用，我总结为三个大方面

1. **社群管理**，根据关键字自动动过好友，对好友自动分组，添加备注并拉入相对应的群。
1. **智能对话**，稍微笨一点如回复资料，智能一些可以真人与人工智能结合，来处理各种咨询问题
1. **定时任务**，每天定时定点在微信群发送行业信息促进活跃度。如果是中学高校或教育集团，可以发送昨日学员学习信息统计等

如果中小企业内部有私域流量需求并把微信群作为私域流量池，通过微信机器人的社群管理、智能对话及定时任务可加强管理效率。对于个人开发者来说，你可以通过智能对话及定时任务把它作为一个开发版的日历及通知服务。

关于这三个应用场景的技术实现，将在以下代码中涉及到

## 开始写第一个微信机器人

使用 [wechaty](https://github.com/wechaty/wechaty) 通过几行就可以写一个具有核心功能的微信机器人

``` ts
import { Wechaty } from 'wechaty'

const bot = new Wechaty({
  // 微信机器人使用了 iPad 协议登录，puppet 为 `PuppetPadplus`
  puppet: new PuppetPadplus(),
  name: 'daxiange'
})

bot
  .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`))
  .on('message',       message => console.log(`Message: ${message}`))
  .start()
```

把以上文件存为 `index.ts`，此时需要一个 token 来运行它。

``` bash
$ WECHATY_PUPPET_PADPLUS_TOKEN=HELLOSHANYUE ts-node index.ts
```

如果你需要获得一个永久的 token，可以参考这里：<https://github.com/juzibot/Welcome/wiki/Support-Developers>

你可以在这里获得更全面的开发文档: <https://wechaty.github.io/wechaty/>

### Node Version

需要注意的是，目前 `wechaty` 版本是 `0.41`，需要 Node 版本最小为 `node12`。

毕竟现在 `node12` 已经是处于活跃期的 LTS，`node10` 已进入维护期，所以赶快升级 node 版本吧。

![Node Release](./assets/node-schedule.svg)

## 社群管理

+ 自动通过好友
+ 自动拉人入群

``` ts
import { Friendship } from 'wechaty'

bot
   .on('friendship', handleFriendShip)

const handleFriendShip = async (friendship) => {
  // 如果是添加好友请求
  if (friendship.type() === Friendship.Type.Receive) {
    // 通过好友请求
    await friendship.accept()

    const room = await bot.Room.find({ topic: 'wechat' })
    if (room) {
      try {
        // 添加好友入群
        await room.add(friendship.contact())
      } catch(e) {
        console.error(e)
      }
    }
}
```

## 智能对话

智能对话，简单来说就是你一嘴，我一嘴。

与微信公众号开发自动回复差不多，你可以通过自定义关键词来回复

``` ts
// index.ts
bot
  .on('message', message.handleMessage)

// message.ts
const defaultRoute = { keyword: '', handle: covid.keyword }
const routes = [
  { keyword: '基金', handle: fund.topFund },
  { keyword: '面试', handle: interview.randomQuestion },
  { keyword: '文章', handle: recentArticle },
  defaultRoute
]

async function reply (msg: Message, _data) {
  const data = _.concat(_data)
  for (const text of data) {
    if (text) {
      await msg.say(text)
    }
  }
}

export async function handleMessage (msg: Message) {
  // 如果收到了文本消息
  if (msg.type() === Message.Type.Text) {
    // 如果不是微信群
    if (!msg.room()) {
      const text = msg.text()
      // 通过用户回复关键字，进行路由处理，找到对应的处理函数
      const route = routes.find(route => {
        return text.includes(route.keyword)
      }) || defaultRoute
      const data = await route.handle(text)
      await reply(msg, data)
    }
  }
}
```

## 定时任务

定时任务应该是社群运营中最常使用的功能之一了，如下

1. 每日九点统计群活跃度信息
1. 每日十点群发每日资讯。结合公众号可以群发公众号内图文信息，为企业内公众号甚至C端产品进行促活
1. 每日十点向微信群管理人员发送网站运营数据，如 UV/IP，活跃用户数，新增用户数，新增付费 (此类功能可用邮件及钉钉机器人替代，各有优劣)
1. 备忘录提醒功能，如每日十点半运营复盘大会

当然，对于个人来说，也可以做一做每日两点半股票基金推荐的消息推送等等有趣的功能。

关于定时任务代码如下，使用了一个简单的非分布式的定时任务库 [node-cron](https://github.com/kelektiv/node-cron)。

``` ts
// index.ts
import { schedule } from './schedule'

bot
  .start()
  .then(() => {
    schedule(bot)
  })

// schedule/index.ts
import { Wechaty } from 'wechaty'

import articleBot from './article'

export async function schedule (bot: Wechaty) {
  await articleBot(bot)
  // await schedule1(bot)
  // await schedule2(bot)
}

// schedule/article.ts
// 定时定点群发消息
import { Wechaty } from 'wechaty'
import { CronJob } from 'cron'

export default async (bot: Wechaty) => {
  return new CronJob('13 12 * * *', async () => {
    const rooms = await bot.Room.findAll()
    const article = await recentArticle()
    await pMap(targetRooms, async room => {
      await room.say(article)
    }, {
      concurrency: 6
    })
  }, null, true, 'Asia/Shanghai')
}
```

## 异常处理

异常处理在某种程度上比应用系统更加重要，不然有可能应用挂掉了 N 天都不知道。

`sentry` 是一个关于异常上报的系统，并且提供完善的 `SDK` 及文档，通过 `sentry` 可以对机器人添加警报着重监听以下事件。

1. 自动捕捉 `unhandledPromiseRejection` 异常
1. 监控 `bot.on('error')` 事件并报告异常

``` ts
Sentry.init({
  dsn
})

bot.on('error', (error) => {
  Sentry.captureException(error)
})
```

最后记着开通了 `Sentry` 的 Alerts，不然异常爆满了都收不到邮件。

## 总结

通过 `wechaty` 开发机器人可以很轻松实现以下功能并作为私域流量管理，并扩展来更多的好玩的有趣的事儿

1. 社群管理
1. 智能对话
1. 定时任务

我通过 `wechaty` 也实现了一个自娱自乐的机器人，部分代码开源在 [wechat-bot](https://github.com/shfshanyue/wechat-bot)，欢迎来玩

但前提是你需要有一个 `WECHATY_PUPPET_PADPLUS_TOKEN`，你可以通过 [开发者支持](https://github.com/juzibot/Welcome/wiki/Support-Developers) 来获得免费 Token
