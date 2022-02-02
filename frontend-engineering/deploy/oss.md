# 将静态资源推至 OSS

本篇文章需要一个阿里云 OSS (对象存储服务)服务，一个月几毛钱，可自行购买。我们将会把静态资源上传至 OSS，并对 OSS 提供 CDN 服务。

本篇文章还是以项目 [cra-deploy](https://github.com/shfshanyue/cra-deploy) 示例，并将静态资源上传至 OSS 处理。其地址为

## PUBLIC_PATH 与 webpack 的处理

假设将带有 hash 值的静态资源推至 CDN 中，此时静态资源的地址为: `https://cdn.shanyue.tech`。而它即是我们将要在 webpack 中配置的 `config.output.publicPath`。

``` js
module.exports = {
  output: {
    publicPath: 'https://cdn.shanyue.tech'
  }
}
```

在 `create-react-app` 中，对 `webpack config` 做了进一步封装，阅读其源码，了解其 `webpack.config.js` 配置。

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

可知**在 `cra` 中通过设置环境变量 PUBLIC_URL 即可配置 CDN 地址**。

``` bash
export PUBLIC_URL=https://cdn.shanyue.tech
```

## OSS 云服务之前的准备

### AccessKey

+ aliyun_access_key_id
+ aliyun_access_key_secret

在将静态资源上传至云服务时，我们需要 AccessKey 获得权限用以上传。可参考文档[创建AccessKey](https://help.aliyun.com/document_detail/53045.html)

### Bucket

`Bucket` 是 OSS 中的存储空间。对于生产环境，可对每一个项目创建单独的 Bucket，而在测试环境，多个项目可共用 Bucket。

在创建 Bucket 时，需要注意以下事项。

1. 权限设置为公共读 (Public Read)
1. 跨域配置 CORS (manifest.json 需要配置 cors)
1. 记住 Endpoint，比如 `oss-cn-beijing.aliyuncs.com`。将会在配置 PUBLIC_URL 中使用到

最终的 PUBLIC_URL 为 `$Bucket.$Endpoint`，比如本篇文章示例项目的 PUBLIC_URL 为 `shanyue-cra.oss-cn-beijing.aliyuncs.com`。

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

ARG ACCESS_KEY_ID
ARG ACCESS_KEY_SECRET
ARG ENDPOINT
ENV PUBLIC_URL https://shanyue-cra.oss-cn-beijing.aliyuncs.com/

WORKDIR /code

# 为了更好的缓存，把它放在前边
RUN wget http://gosspublic.alicdn.com/ossutil/1.7.7/ossutil64 -O /usr/local/bin/ossutil \
  && chmod 755 /usr/local/bin/ossutil \
  && ossutil config -i $ACCESS_KEY_ID -k $ACCESS_KEY_SECRET -e $ENDPOINT

# 单独分离 package.json，是为了安装依赖可最大限度利用缓存
ADD package.json yarn.lock /code/
RUN yarn

ADD . /code
RUN npm run build && npm run oss:cli

# 选择更小体积的基础镜像
FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder code/build /usr/share/nginx/html
```

## docker-compose

``` yaml
version: "3"
services:
  oss:
    build:
      context: .
      dockerfile: oss.Dockerfile
      args:
        - ACCESS_KEY_ID
        - ACCESS_KEY_SECRET
        - ENDPOINT=oss-cn-beijing.aliyuncs.com
    ports:
      - 8000:80
```

**好像，容器里好像就剩下一个 index.html 了？**
