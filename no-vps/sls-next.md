# 使用 serverless 与 next 开发第一个 SSR 应用

在上一章，我介绍到了 [如何使用 serverless 部署第一个 koa 应用](https://shanyue.tech/no-vps/sls-koa.html)。对于一个后端(Node)项目使用 `serverless` 的方式要接收巨大的挑战，其中最大的挑战来自于传统的并已完善与成熟的架构。

而对于一个弱存储弱状态的 SSR 项目或者纯前端项目，通过 `zeit` 或者 `netlify` 部署是一个更好的选择，然而由于网络原因并不适用于国内。国内也无如 `netlify` 一样的前端快速部署方案（笔者认为这一点对于国内的云服务商是一个可选的机会），此时 `serverless` 是一个不错的选择，只需一行命令即可充分利用缓存配置，对象存储服务，CDN 与自动 https 证书。

本篇文章介绍如何使用 serverlss 开发第一个 SSR 应用。SSR，即 `Server Side Render`，服务端渲染为单页应用的 SEO 提供了一种更好的体验，同时，他对首屏优化也有极大提升。而 `Next.js` 无疑是服务端渲染框架中最璀璨的明珠。

这里是一个结合 `ts` 及 `` 快速部署到腾讯云函数计算中的模板。仓库见下

+ [shfshanyue/serverless-template-zh](https://github.com/shfshanyue/serverless-template-zh): 中国云厂商 serverless framework 模板及示例 （更快的访问速度）

## 快速使用

使用本模板快速创建应用

``` bash
$ serverless install --url https://github.com/shfshanyue/serverless-template-zh/tree/master/tencent-next-helmet-ga --name next-app
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
├── node_modules/
├── pages/                  # 所有的 pages
├── utils/
├── package.json
├── package-lock.json
├── README.md
└── serverless.yaml
```

### serverless component

`serverless component` 可以认为是把 faas 及 baas 资源集合的进一步抽象，该项目采用了 `@serverless/tencent-next`

``` yaml
next-app:
  component: '@serverless/tencent-nextjs'
  inputs:
    functionName: nextjs-function
    region: ap-guangzhou
    runtime: Nodejs10.15
    code: ./
    functionConf:
      timeout: 60
      memorySize: 128
    environment:
      variables:
        ENV: true
    apigatewayConf:
      protocols:
        - http
        - https
      environment: release
```

## 部署

部署之前需要准备好生产环境所需的 `node_modules` 以及编译完成的 js 资源。

``` bash
# 编译静态文件
$ npm run build

# 部署到腾讯云
$ sls
 next-app:
    functionName:        nextjs-function
    functionOutputs:
      ap-guangzhou:
        Name:        nextjs-function
        Runtime:     Nodejs10.15
        Handler:     serverless-handler.handler
        MemorySize:  128
        Timeout:     60
        Region:      ap-guangzhou
        Namespace:   default
        Description: This is a function created by serverless component
    region:              ap-guangzhou
    apiGatewayServiceId: service-r8i140rq
    url:                 https://service-r8i140rq-1257314149.gz.apigw.tencentcs.com/release/
    cns:                 (empty array)

  240s › next-app › done
```

此时网站部署在了 `https://service-r8i140rq-1257314149.gz.apigw.tencentcs.com/release/`，可通过访问连接直接查看效果

从日志可以看出，部署到腾讯云需要使用 4 分钟，而且这仅仅是一个 `hello, world`，不过现在国内的 serverless 还处于早期发展状态，这将在不久得到优化。

如果对于部署速度有所追求的话，可以使用 `now.sh`，仅需要 3s 就可以部署成功，`now` 以及 `next` 均处于一家公司旗下，对于 `next` 的部署有很大程度的优化。

## 缺点

这里是使用腾讯云目前部署 `serverless` 的一些缺点

1. 部署过慢，node_modules 过大，导致上传时间过长
1. 对于 SSR 项目，所有的静态资源相关的依赖可视为 devDep，对于这类库可以不上传，目前是全部上传，这也是部署过慢的原因
1. 在本地不支持 `log` 及 `metrics`，需要转至腾讯云控制台查看
