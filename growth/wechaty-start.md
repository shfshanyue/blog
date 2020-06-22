# 使用 wechaty 开发一个微信机器人

我已经使用 [wechaty](https://github.com/wechaty/wechaty) 做了很多有趣的自动化的工作

如使用一个机器人小助手，通过编程的手段与它接入基金与股票的接口，再加一个两点半的定时任务，这样它就可以在每天收盘前给你发一个最近的基金趋势信息供你选择。

或者使用它管理微信社群，每天早上九点半及时在微信群发送一些行业内信息，促进活跃度。

或者智能管理好友，修改备注，并自动入群，提高运营效率，给运营人员更大的想象空间。

## 微信机器人与微信公众号开发

## 微信机器人



## 开始写第一个微信机器人

开始

``` ts
mport { Wechaty } from 'wechaty'

const bot = new Wechaty({
  puppet: new PuppetPadplus(),
  name: 'daxiange'
})

bot
  .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`))
  .on('message',       message => console.log(`Message: ${message}`))
  .start()
```

### Node Version


