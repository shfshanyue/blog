---
date: 2021-10-12

---

# browserslist

`browserslit` 用特定的语句来查询浏览器列表，如 `last 2 Chrome versions`。

``` js
$ npx browserslist "last 2 Chrome versions"
chrome 94
chrome 93
```

那它有什么作用呢？

细说起来，它是现代前端工程化不可获取的工具，无论是处理 JS 的 `babel`，还是处理 CSS 的 `postcss`，他们的背后都有 `browserslist` 的身影。

+ `babel` 使用 `core-js` 作为垫片
+ `postcss` 使用 `autoprefixer` 作为垫片

关于前端打包体积与垫片关系，我们有以下几点共识:

1. 由于低浏览器版本的存在，垫片是必不可少的
2. 垫片越少，则打包体积越小
3. 浏览器版本越新，则垫片越少

那在前端工程化实践中，当我们确认的浏览器版本号，那么它的垫片体积就会确认。

假设项目只需要支持最新的两个谷歌浏览器。那么关于 `browserslist` 的查询，可以写作 `last 2 Chrome versions`。

而随着时间的推移，该查询语句将会返回更新的浏览器，垫片体积便会减小。

如使用以上查询语句，一年前可能还需要 `Promise.any` 的垫片，但目前肯定不需要了。

最终，谈一下 `browserslist` 的原理: `browserslist` 根据正则解析查询语句，对浏览器版本数据库 `caniuse-lite` 进行查询，返回所得的浏览器版本列表。

因为 `browserslist` 并不维护数据库，因此它会经常提醒你去更新 `caniuse-lite` 这个库。

> PS: `caniuse-lite` 这个库也由 `browserslist` 团队进行维护。

## 查询语法

### 根据用户份额:

+ `> 5%`: 在全球用户份额大于 `5%` 的浏览器
+ `> 5% in CN`: 在中国用户份额大于 `5%` 的浏览器

### 根据最新浏览器版本

+ `last 2 versions`: 所有浏览器的最新两个版本
+ `last 2 Chrome versions`: Chrome 浏览器的最新两个版本

### 不再维护的浏览器

+ `dead`: 官方不在维护已过两年，比如 `IE10`

### 浏览器版本号

+ `Chrome > 90`: Chrome 大于 90 版本号的浏览器

## 查询语法及 API 示例

``` bash
$ npx browserslist --coverage=CN "> 1%"      
These browsers account for 63.15% of all users in the CN
```

``` bash
```

## 核心原理

``` js

```

``` js
$ npx browserslist 'chrome > 90'
Browserslist: caniuse-lite is outdated. Please run:
npx browserslist@latest --update-db

Why you should do it regularly:
https://github.com/browserslist/browserslist#browsers-data-updating
```

![target-browsers](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/target-browsers.6y0ifvj0r1k0.png)
