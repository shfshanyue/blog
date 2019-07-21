date: 2020-07-17 20:00

---

# Unexpected end of JSON input while parsing near

今天在升级 `serverless` 时，未能安装成功，提示问题如下

``` bash
$ npm i -g serverless
npm ERR! Unexpected end of JSON input while parsing near '...oyNMOOPIvOSSv8aveUYxO'

npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2020-07-17T09_32_21_882Z-debug.log

```

## 捉虫

既然是 npm 的问题，那首先去 github 的源码中找找问题

npm 的源码在 <https://github.com/npm/cli>，找到以下 Issue

+ [Unexpected end of JSON input while parsing near #21172](https://github.com/npm/npm/issues/21172)


## 解决方案

这是因为本地 `npm cache` 的问题，清除掉本地的 cache 即可成功，如下所示

``` bash
$ npm cache clean --force
npm WARN using --force I sure hope you know what you are doing.

$ npm i -g serverless
```

另外可以通过 `npm cache verify` 去查看缓存位置

``` bash
$ npm cache verify
Cache verified and compressed (~/.npm/_cacache):
Content verified: 4217 (168362093 bytes)
Index entries: 5814
Finished in 11.194s
```
