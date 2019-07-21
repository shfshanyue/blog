---
TODO
---

# 网站性能中图片体积优化最佳实践

以实践为主，以理论为辅。

## 内联小图片至 HTML 中

+ [url-loader](https://github.com/webpack-contrib/url-loader): 把文件转化为 Base64 URL

``` javascript
module.exports = {
  module: {
    rules: [
    {
      test: /\.(jpe?g|png|gif)$/,
      loader: 'url-loader',
      options: {
        limit: 10 * 1024
      }
    },
    {
      test: /\.svg$/i,
      loader: 'url-loader',
      options: {
        limit: 10 * 1024,
        encoding: 'utf8',
      }
    ]
  }
}
```

## 大图片优化体积

``` javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        // Specify enforce: 'pre' to apply the loader
        // before url-loader/svg-url-loader
        // and not duplicate it in rules with them
        enforce: 'pre'
      }
    ]
  }
}
```

## 更合适的尺寸

## 更小的图片: Webp 与 Avif

## 懒加载: Lzay Loading

## Next 中 Image 的优化方案

## 总结

1. 图片在网站中占比过大
1. 图片优化及其简单
1. 面试有用，性价比高

+ [](https://web.dev/fast/#optimize-your-images)

https://github.com/tigt/mini-svg-data-uri
