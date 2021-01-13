---
title: 使用腾讯云的 Serverless 托管你的前端应用
date: 2021-01-13 11:48
loc: 杭州江干区
---

# 使用 Serverless 部署前端应用

无论选择 `vercel`、`netlify` 还是 `alioss` 部署前端应用，以下三项配置都是必不可少的:

``` toml
[build]
  # 项目的根目录，及 npm 命令执行的目录
  base = ""

  # 将要服务化的静态文件，也是打包后生成的目录
  publish = ".vuepress/dist"

  # 打包命令
  command = "npm run build"
```

## Serverless 部署

在腾讯云的 Serverless 中，需要配置文件来部署应用。部署纯前端页面的话，需要使用一个 `tencent-website` 的组件，并使用以上配置进行部署。

以下是使用 `vuepress` 搭建我的博客的 Serverless 配置文件，在根目录新疆配置文件 `serverless.yaml`，配置如下:

> 更详细的配置请看过来：[Serverless Website 全配置](https://github.com/serverless-components/tencent-website/blob/master/docs/configure.md)

``` yaml
component: website # (必填) 引用 component 的名称，当前用到的是 tencent-website 组件
name: shanyue-blog # (必填) 该 website 组件创建的实例名称

inputs:
  src:
    src: .
    index: index.html
    dist: .vuepress/dist
    hook: npm run build
    # websitePath: ./
  region: ap-guangzhou
  bucketName: my-bucket
  protocol: https
```

执行命令前设置两个环境变量(我偷懒直接全部扔到了 `bashrc` 下)，在腾讯云的账号体系中可以找到：

``` shell
export TENCENT_SECRET_ID=shanyue-id
export TENCENT_SECRET_KEY=shanyue-key
```

万事俱备只欠东风，一个命令搞定：

``` bash
# 需提前下载: npm i -g serverless
$ sls

serverless ⚡framework
Action: "deploy" - Stage: "dev" - App: "shanyue-blog" - Instance: "shanyue-blog"

region:  ap-guangzhou
website: https://my-bucket-1257314149.cos-website.ap-guangzhou.myqcloud.com

Full details: https://serverless.cloud.tencent.com/apps/shanyue-blog/shanyue-blog/dev

103s › shanyue-blog › Success
```

## Serverless 域名

此时可以通过域名: <https://my-bucket-1257314149.cos-website.ap-guangzhou.myqcloud.com> 访问我的博客，不过域名好像过长？

在腾讯云的 Serverless 中使用自己的域名需要备案，这里就不细讲了。

## 总结

结合 Github Actions 能够实现与 `vercel` 和 `netlify` 差不多的自动部署，他最大的优势是在国内有着稳定的网络，且免费的托管方案。如果有一点麻烦，那就是自定义域名，如果你仅仅想用它做一个示例 Demo，那完全够用！