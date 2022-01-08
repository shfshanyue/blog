# Body Parse / Raw Body

在 Node Server 中，`HTTP Request` 基于 `Readable Stream`，我们可以通过读取可读流的方式，将原始请求体读取出来。

简单粗暴的解析代码如下:

``` js
const server = http.createServer((req, res) => {
  let body = ''
  req.on('data', chunk => body += chunk)
  req.on('end', () => {
    res.end(body)
  })
})
```

## gzip/brotli 解析

我们知道，为了节省带宽，在针对静态资源进行部署时，往往会做 gzip/brotli 的压缩。

从浏览器发的请求来看，也会有经过压缩的内容，此时在服务器端需要先把请求体进行解压缩。

## Content-Type

