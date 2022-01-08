# 将静态资源推至 OSS

本篇文章需要你有一个 OSS 服务，一个月几毛钱，可自行购买。

## PUBLIC_PATH 与 webpack 的处理

假设将带有 hash 值的静态资源推至 CDN 中，此时静态资源的地址为: `https://cdn.shanyue.tech`。

``` js
module.exports = {
  output: {
    publicPath: 'https://cdn.shanyue.tech'
  }
}
```

而在 `create-react-app` 中，阅读其 `webpack.config.js` 配置。

``` js
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
)

const config = {
  output: {
    // webpack uses `publicPath` to determine where the app is being served from.
    // It requires a trailing slash, or the file assets will get an incorrect path.
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: paths.publicUrlOrPath,
  },
}
```

可知通过设置环境变量 PUBLIC_URL 即可。

``` bash
export PUBLIC_URL=https://cdn.shanyue.tech
```

## 云服务之前的准备

## AccessKey

+ aliyun_access_key_id
+ aliyun_access_key_secret

## 将资源推送到 OSS: ossutil

在 OSS 上创建一个 Bucket，通过 `ossutil` 将资源上传至 OSS。

+ [ossutil 安装](https://help.aliyun.com/document_detail/120075.htm)
+ [ossutil 文档](https://help.aliyun.com/document_detail/50452.html)

``` bash
# 将资源上传到 OSS Bucket
$ ossutil cp -rf --meta Cache-Control:no-cache build oss://shanyue-cra/

# 将带有 hash 资源上传到 OSS Bucket，并且配置长期缓存
# 注意此时 build/static 上传了两遍
$ ossutil cp -rf --meta Cache-Control:max-age=31536000 build/static oss://shanyue-cra/static
```

为求方便，可将两条命令维护到 `npm scripts` 中

``` js
{
  scripts: {
    'oss:cli': 'ossutil cp -rf --meta Cache-Control:no-cache build oss://shanyue-cra/ && ossutil cp -rf --meta Cache-Control:max-age=31536000 build/static oss://shanyue-cra/static'
  }
}
```

## 将资源推送到 OSS: npm scripts

另有一种方法，通过官方提供的 SDK: [ali-oss](https://github.com/ali-sdk/ali-oss) 可对资源进行精准控制:

1. 对每一个资源进行精准控制
1. 仅仅上传进行更改的文件
1. 使用 `p-map` 控制 N 个资源同时上传

``` js
{
  scripts: {
    'oss:sdk': 'node ./scripts/uploadOSS.js'
  }
}
```

脚本此处省略。

## Dockerfile

``` dockerfile
FROM node:14-alpine as builder

WORKDIR /code

# 单独分离 package.json，是为了安装依赖可最大限度利用缓存
ADD package.json yarn.lock /code/
RUN yarn

ADD . /code
RUN npm run build && npm run oss:cli

# 选择更小体积的基础镜像
FROM nginx:alpine
COPY --from=builder code/build/index.html /usr/share/nginx/html
```

**好像，容器里好像就剩下一个 index.html 了？**

