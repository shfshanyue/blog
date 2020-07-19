# Unexpected end of JSON input while parsing near '...oyNMOOPIvOSSv8aveUYxO'

今天在升级 `serverless` 时，未能安装成功，提示问题如下

``` bash
$ npm i -g serverless
npm ERR! Unexpected end of JSON input while parsing near '...oyNMOOPIvOSSv8aveUYxO'

npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2020-07-17T09_32_21_882Z-debug.log

```

## 解决方案

``` bash
$ npm cache clean --force

$ npm i -g serverless
```

