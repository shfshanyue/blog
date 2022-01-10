# 部署 CRA: 部署时间与云服务优化

当公司内一个将静态资源部署云服务的前端项目持续跑了 N 年后，可能出现几种情况。

1. 将静态资源推送到 OSS 用时过长。如构建后的资源全部上传到对象存储，然而**有些资源内容并未发生变更**，将会导致过多的上传时间。
1. OSS 对象存储中冗余资源越来越多。**前端每改一行代码，便会生成一个新的资源，而旧资源将会在 OSS 不断堆积，占用额外体积。** 从而导致更昂贵的云服务费用。

## 静态资源上传优化

在前端构建过程中存在无处不在的缓存

1. 当源文件内容为发生更改时，将不会对 Module 重新使用 Loader 等进行编译，不会重新编译。这是利用了 webpack5 的持久化缓存。
1. 当源文件内容未发生更改时，构建生成资源的 hash 将不会发生变更。此举有利于 HTTP 的 Long Term Cache。

那对比生成资源的哈希，如未发生变更，则不向 OSS 进行上产。**这一步将会提升静态资源上传时间，进而提升每一次前端部署的时间。**

**对于构建后含有 hash 的资源，其实对比文件名即可了解资源是否发生变更。**

伪代码如下

``` js
function uploadFile (file: string) {}
function isFileExistsOSS (file: string): boolean {}

if (!isFileExistsOSS(file)) {
  uploadFile(file)
}
```

而对于不含有 hash 的资源，则对比内容 hash。

## Rclone

``` js
$ rclone
```

## 删除 OSS 中冗余资源

此处要保障生产环境与开发环境的 OSS 资源进行隔离。

在生产环境中，OSS 只需保留最后一次线上环境所依赖的资源。可根据OSS 所有资源与最后一次构建生成的资源一一对比文件名，进行删除。

``` js

```

而有一种特殊情况，可能不适合此种方法。生产环境发布了多个版本的前端，如 AB 测试，toB 面向不同大客户的差异化开发与部署，此时可针对不同版本对应不同的 `output.path` 来解决。

> `output.path` 可通过环境变量注入 webpack 选项，而环境变量可通过以下命令置入。(或置入 .env)

``` bash
export BRANCH=$(git branch --show-current)

export BRANCH=$(git rev-parse --abbrev-ref HEAD)
```

在测试环境中，虽然有很多个分支，但是不重要，想删的时候把 OSS 清掉都没关系。
