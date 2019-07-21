# 虫子集

测试环境及生产环境中遇到的那些有关前端，后端及运维的虫子 (BUG)

## 防虫器

+ [谈测试]()
+ [当线上出现问题时如何定位]()
+ [如何得知 develop 分支是一个干净的分支]()
+ [如何回滚服务]()
+ [如何快速定位异常]()
+ [如何优化慢接口]()

## 虫卵集

> 发生在开发环境的问题

+ [koa 中的 ctx.req 与 ctx.request]()
+ [Clipboard API 与 devtools 问题]()
+ [df 被 hang 住，无法查看磁盘使用情况](./df-hang.md)
+ [k8s 部署 ES 时，挂载目录权限问题](./es-failed.md)
+ [Unexpected end of JSON input while parsing near '...oyNMOOPIvOSSv8aveUYxO'](./npm-error.md)
+ [npm package missing file]()

## 幼虫集

> 发生在测试环境的问题

+ [上游服务不存在或未响应](./upstream.md)
+ [sentry 429 rate-limit](./sentry-429.md)
+ [Vary: Origin 与 cors]()

## 羽化集

> 关于生产环境的性能优化

+ [ORM 层分页查询过慢优化](./perf-orm-pagination.md)

## 成虫集

> 关于生产环境中的问题

+ [最新手机号无法注册问题]()
+ [node 8 -> node 10]()
+ [循环引用所造成的 OOM]()
+ [上线未生效](上线未生效)
