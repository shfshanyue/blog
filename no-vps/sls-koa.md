# 使用 serverless 与 typescript 开发第一个 Koa 应用

对于稍微大型的 Node 应用，`typescript` 已经是标配，它为 `javascript` 提供了强类型的铠甲，有效提高了代码质量。

这里是一个结合 `ts` 及 `koa` 快速部署到腾讯云函数计算中的模板。仓库见下

+ [shfshanyue/serverless-template-zh](https://github.com/shfshanyue/serverless-template-zh): 中国云厂商 serverless framework 模板及示例 （更快的访问速度）

## 快速使用

使用本模板快速创建应用

``` bash
$ serverless install --url https://github.com/shfshanyue/serverless-template-zh/tree/master/tencent-koa-ts --name koa-server
```

在项目创建早期尽可能对 package 进行升级，这里使用了 `npm-check-updates`

``` bash
$ npm run ncu
```

在测试环境中进行开发

``` bash
$ npm run dev
```

### 文件结构

``` bash
.
├── dist/               # 编译文件，及最终需要上传的目录
├── node_modules/
├── app.ts              # 入口文件，必须采用 app 的命名
├── package.json
├── package-lock.json
├── Readme.md
├── serverless.yaml     # serverless 配置文件
└── tsconfig.json
```

### app.ts

`app.ts` 即是你业务逻辑的入口文件，你可以像其他 Koa Application 一样自由组织路由，业务逻辑，Model 等。

``` typescript
import Koa from 'koa'

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = `hello, path: '${ctx.request.path}'`
})

app.listen(3333, () => { console.log('Listening 3333') })

module.exports = app
```

### serverless component

`serverless component` 可以认为是把 faas 及 baas 资源集合的进一步抽象，该项目采用了 `@serverless/tencent-koa`

``` yaml
koa-app:
  component: '@serverless/tencent-koa'
  inputs:
    region: ap-guangzhou
    functionName: koa-function
    runtime: Nodejs10.15
    code: ./dist
    functionConf:
      timeout: 60
      memorySize: 128
    apigatewayConf:
      protocols:
        - https
      environment: release
```

## 部署

部署之前需要准备好生产环境所需的 `node_modules` 以及编译完成的 js 资源。

``` bash
# 装包
$ npm install typescript

# 编译成 js
$ npm run build

# 打包生产环境的包，并移至 dist 目录
# predeploy: npm ci --production && rsync -avz node_modules dist/
$ npm run predeploy

# 部署到腾讯云
$ sls
koa-function [████████████████████████████████████████] 100% | ETA: 0s | Speed: 314.98k/

  koa-app:
    functionName:        koa-function
    functionOutputs:
      ap-guangzhou:
        Name:        koa-function
        Runtime:     Nodejs10.15
        Handler:     serverless-handler.handler
        MemorySize:  128
        Timeout:     60
        Region:      ap-guangzhou
        Namespace:   default
        Description: This is a function created by serverless component
    region:              ap-guangzhou
    apiGatewayServiceId: service-dture22u
    url:                 https://service-dture22u-1257314149.gz.apigw.tencentcs.com/release/
    cns:                 (empty array)

  11s › koa-app › done
```

从日志可以看出，部署到腾讯云只需 11s，还是很快速

## Http 调用

在本地直接使用 `npm run dev`，在本地端口调试。而在生产环境，使用 sls 部署后日志中提供的 url 进行 http 调用

``` bash
$ curl https://service-dture22u-1257314149.gz.apigw.tencentcs.com/release/
hello, path: '/'# 
```

## 缺点

在开始之前，稍微提一下缺点：

1. 部署麻烦，需要先编译 ts 至 js，并且仅上传生产环境需要的 node_modules (全部上传速度过慢)
1. 在本地不支持 `log` 及 `metrics`，需要转至腾讯云控制台查看

> 由于部署过程稍微复杂，可以考虑重写一个关于 ts 的 serverless component
