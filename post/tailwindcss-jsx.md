# 在 Next.js 中配置 styled-jsx 与 tailwindcss 协同工作

`Next.js` 中默认的 CSS 方案是 `styled-jsx`，而 `tailwindcss` 是最近大火的原子化 CSS。如果配合 `styled-jsx` 与 `tailwindcss` 共同使用，则只需要维护很少的 CSS，解决方案如下:

1. 大部分样式使用 `tailwindcss`
1. 无法原子化的样式使用 `styled-jsx`

那什么样的样式无法原子化呢？有以下多种，但很庆幸的是只有一小部分

1. 样式复用。避免过多的重复多个原子化的 css，DRY
    ``` css
    .item {
      @apply hover:bg-white bg-gray-100 border border-dashed cursor-pointer;
    }
    ```
1. 伪类与嵌套的复杂选择器
    ``` css
    .container:hover .item {
      @apply bg-gray-100;
    }
    ```
1. CSS function
    ``` css
    .item {
      background: url(https://shanyue.tech/shanyue94.jpg)
    }
    ```
1. 复杂不常用的 CSS 属性

所以，现在重要的问题是在 `styled-jsx` 中如何配置使用 `tailwindcss`

## 配置

第一步、配置 `babelrc`，为 styled-jsx 添加 postcss 的插件

``` bash
npm i styled-jsx-plugin-postcss
```

``` js
{
  "presets": [
    [
      "next/babel",
      {
        "styled-jsx": {
          "plugins": [
            "styled-jsx-plugin-postcss"
          ]
        }
      }
    ]
  ]
}
```

第二步、配置 `postcss.config.js`，此时的 tailwindcss 必须是个对象

``` js
module.exports = {
  plugins: {
    tailwindcss: {},
  }
}
```

大功告成

