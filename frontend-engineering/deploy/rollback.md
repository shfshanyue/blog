# 回滚、滚动升级、灰度部署与后端协作

## 灰度与精细流量控制

1. 50% 的流量用于功能A。对功能 A 切分支单独开发
1. 50% 的流量用于功能B。对功能 B 切分支单独开发

那如何使仅有一半的访问到功能 A，而另一半的人访问到功能 B 呢？

我们可将项目部署为 `kubernetes`

+ 功能 A 使用一个 Deployment，部署 N 个 Pod。并暴露在服务 `cra-service-test-A`
+ 功能 B 使用一个 Deployment，部署 N 个 Pod。并暴露在服务 `cra-service-test-B`

对两个服务进行负载均衡即可。

``` yaml
upstream:
  - cra-service-test-A
  - cra-service-test-B
```

## 金丝雀

+ 旧版本使用一个 Deployment，部署 9 个 Pod。并暴露在服务 `cra-service-main`
+ 金丝雀版本使用一个 Deployment，部署 1 个 Pod。并暴露在服务 `cra-service-canary`

## 滚动升级

AAA

## 回滚

