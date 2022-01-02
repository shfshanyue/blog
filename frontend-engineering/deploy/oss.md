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

## 将资源推送到 OSS

在 OSS 上创建一个 Bucket，通过 `ossutil` 将资源上传至 OSS。

+ [ossutil 安装](https://help.aliyun.com/document_detail/120075.htm)
+ [ossutil 文档](https://help.aliyun.com/document_detail/50452.html)

``` bash
# 将资源上传到 OSS Bucket
$ ossutil cp -rf build oss://shanyue-cra/

# 通过响应头 `Cache-Control` 配置长期缓存
$ ossutil set-meta oss://shanyue-cra/static cache-control:"max-age=31536000" --update -rf
```

## Dockerfile

``` dockerfile
FROM node:14-alpine as builder

WORKDIR /code

# 单独分离 package.json，是为了安装依赖可最大限度利用缓存
ADD package.json yarn.lock /code/
RUN yarn

ADD . /code
RUN npm run build && npm run uploadOSS

# 选择更小体积的基础镜像
FROM nginx:alpine
COPY --from=builder code/build /usr/share/nginx/html
```