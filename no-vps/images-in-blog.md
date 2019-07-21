# 如何维护个人博客中的图片

大家好，我是山月。

个人博客中的图片如何维护，取决于博客的搭建及部署方式。

那如何快速搭建及部署一个博客呢？

1. 使用 vuepress 以 Markdown 方式组织博客文章内容
1. 使用 `vercel`/`github pages`/`阿里云` 进行静态资源部署

那如何维护博客中的图片资源呢？

## 图片与博客一同维护，引用图片资源相对路径

假设文章如下所示，其实 `markdown` 为博客内容，`assets` 目录下为博客所需图片资源。

``` bash
├── assets
│   ├── article-a.jpg
│   ├── article-b.jpg
│   └── article-c.jpg
├── Article-A.md
├── Article-B.md
├── Article-C.md
├── Article-D.md
└── Article-E.md
```

在 `markdown` 中引用图片的相对路径，在 `vercel`/`github pages`/`阿里云` 均可正常工作。

``` markdown
# 在 Markdown 中如何引用图片

![](./assets/article-a.jpg)
```

然而，直接引用图片的相对路径有较大局限性。

1. 不好迁移。假设文章需要同时发布在掘金与公众号，但在掘金平台上无法识别相对路径地址
1. 截图不便。截图需要粘贴到微信中，并另存为博客目录，十分麻烦
1. 图片太大。为了 SEO，文章中图片需尽可能小，用以加速文章访问速度

## 图片与博客一同维护，获取其 CDN 地址

利用图床工具，可解决引用相对路径时的不方便等诸多问题。

1. 通过操作 Github 图床工具，在网页端直接将图片存入 Github 中博客仓库的指定图片目录。
1. 通过操作 Github 图床工具，将图片上传至 github 之前可自动压缩，并转化为更小体积的 `webp` 格式。
1. 通过操作 Github 图床工具，直接获取 CDN 加速后的绝对路径地址。

关于 Github 图床工具，可选用我最新开发的 [微图床](https://devtool.tech/gallery) 或者是 [picx](https://github.com/XPoet/picx)，将自动完成以上功能。

![Github 微图床工具](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-02/clipboard-9183.c3e0bc.webp)

通过设置，可将图片的存入路径指定为博客仓库的图片资源目录。

![选择博客仓库中的图片路径](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-02/clipboard-0785.5e8b12.webp)

**当然，其中最重要的设置是需要获取到 Github 的 `access token`**

## 获取 Github Token

### 01 开发者设置

1. 进入 [Github Profile](https://github.com/settings/profile) 页面
1. 点击 `Developer settings`

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-02/clipboard-8436.3ca94f.webp)

### 02 生成 Token

1. 进入 [Personal access tokens](https://github.com/settings/tokens) 页面
1. 点击 `Generate new token` 按钮
1. 注意 token 的过期时间设置，可设为一个月或永久
1. 注意 token 的权限可读写 `repo` 即可

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-02/clipboard-2170.2dcf4c.webp)

### 03 设置成功

注意该 token 只会显示一次，及时复制，拿到 token。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-02/clipboard-4867.36311f.webp)