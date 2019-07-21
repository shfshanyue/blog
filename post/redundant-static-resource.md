---
title: 关于前端静态资源在 OSS 上冗余问题的解决

---

## 背景

先说前端静态资源的部署。在现有的打包方案下，为了充分利用 http 的永久缓存，打包后静态资源文件一般会戳个 hash 值。这样打包后的某个文件会长这个样子: `main.a3b4c5.js`。

又为了充分利用 CDN 对静态资源的加速，我们会把静态资源扔到对象存储 OSS 上，然后使用 CDN 对 OSS 的静态资源加速。于是，久而久之，OSS 上堆积的文件也越来越多

```txt
project/static/main.a3b4c5.js
project/static/main.a3b4xs.js
project/static/main.axx8xs.js
project/static/main.8abc09.js
project/static/main.8bayd0.js
...
```

