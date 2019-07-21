---
date: 2021-02-16
---

# TailwindCSS 1.0 升级到 2.0 PostCSS 问题

## 复现

**升级 `TailwindCSS` 到 2.0 之后**

``` bash
$ npm run dev -- -p 10000

> next-app@1.0.0 dev /Users/xiange/Documents/next-app
> next "-p" "10000"

ready - started server on 0.0.0.0:10000, url: http://localhost:10000
error - ./styles/index.css ((webpack)/css-loader/cjs.js??ref--5-oneOf-6-1!(webpack)/postcss-loader/cjs.js??ref--5-oneOf-6-2!./styles/index.css)
Error: [object Object] is not a PostCSS plugin
```

**删除 yarn.lock 重新装包后报错**

``` bash
$ npm run dev -- -p 10000

> next-app@1.0.0 dev /Users/xiange/Documents/next-app
> next "-p" "10000"

ready - started server on 0.0.0.0:10000, url: http://localhost:10000
error - ./styles/index.css ((webpack)/css-loader/cjs.js??ref--5-oneOf-6-1!(webpack)/postcss-loader/cjs.js??ref--5-oneOf-6-2!./styles/index.css)
Error: PostCSS plugin postcss-nested requires PostCSS 8.
Migration guide for end-users:
https://github.com/postcss/postcss/wiki/PostCSS-8-for-end-users
```

## 解决

手动安装 postcss，版本是 8.0 以上，问题解决

``` bash
yarn install postcss
```

## 原因

TODO