---
title: 使用 Metrics Server 进行 CPU/Memory 监控
date: 2019-09-12 20:00

---

metrics server 用以监控k8s集群中每个 pod 与 node 的 CPU/Memory 使用情况。另外，正因为它能够监控 CPU/Memory 它也被用作弹性扩容。

![集群监控情况]()

## 参考

先上两篇官方文档作为参考，强烈建议阅读第二篇

1. [Resource metrics pipeline](https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/)
1. [Kubernetes monitoring architecture](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/monitoring_architecture.md)

这里有一张从第二篇文章中抽出来的监控架构图

![monitoring architecture](https://raw.githubusercontent.com/kubernetes/community/master/contributors/design-proposals/instrumentation/monitoring_architecture.png)

## 部署

可以直接使用官方写好的配置文件进行部署: [kubernetes-incubator/metrics-server](https://github.com/kubernetes-incubator/metrics-server)

> 这里也有一个镜像需要在代理节点下载并使用 rsync 移动到 work node：`k8s.gcr.io/metrics-server-amd64:v0.3.6`。详细方法参照 [](kubectl create -f deploy/1.8+/)
> 如果采用代理节点下载并移动的方案进行部署，则需要设置 image 的 `imagePullPolicy: IfNotPresent`

以下是关于 metrics server 的安装步骤

``` shell
$ git clone git@github.com:kubernetes-incubator/metrics-server.git

# 切换至 v0.3.6 版本
$ cd metrics-server && git checkout v0.3.6

# 创建资源，注意在此之前拉取镜像需要设置代理，或者在代理机上准备好并复制过来
# 再要注意，如果使用代理节点下载并且复制的方案进行部署，需要删除  metrics-server-deployment.yaml 中关于 imagePullPolicy 的一行
$ sed -i '/imagePullPolicy: Always/d' deploy/1.8+/metrics-server-deployment.yaml

# 添加两个参数
$ sed -i '/image: k8s.gcr.io/a \        args: [ "--kubelet-insecure-tls", "--kubelet-preferred-address-types=InternalIP"]' deploy/1.8+/metrics-server-deployment.yaml

$ kubectl apply -f deploy/1.8+/
clusterrole.rbac.authorization.k8s.io/system:aggregated-metrics-reader created
clusterrolebinding.rbac.authorization.k8s.io/metrics-server:system:auth-delegator created
rolebinding.rbac.authorization.k8s.io/metrics-server-auth-reader created
apiservice.apiregistration.k8s.io/v1beta1.metrics.k8s.io created
serviceaccount/metrics-server created
deployment.extensions/metrics-server created
service/metrics-server created
clusterrole.rbac.authorization.k8s.io/system:metrics-server created
clusterrolebinding.rbac.authorization.k8s.io/system:metrics-server created

# 获取所有 pod，查看 metrc-server 此时处于运行状态
$ kubectl get pods --all-namespaces | grep metrics
kube-system   metrics-server-7fbb854b45-zsc5s                  1/1     Running   0          64s
```

部署成功后，可以使用 `kubectl top nodes`

``` shell
$ kubectl top nodes
NAME       CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
shanyue    114m         5%     2327Mi          63%
shuifeng   32m          1%     2379Mi          15%
```

### error: metrics not available yet

部署过程有可能出现错误 `error: metrics not available yet`，可以参考该 [Issue](https://github.com/kubernetes-incubator/metrics-server/issues/247)

此时可以添加两个参数 `--kubelet-insecure-tls` 和 `--kubelet-preferred-address-types=InternalIP` 来避免问题

``` yaml
spec:
 selector:
   matchLabels:
     k8s-app: metrics-server
 template:
   metadata:
     name: metrics-server
     labels:
       k8s-app: metrics-server
   spec:
     serviceAccountName: metrics-server
     volumes:
     - name: tmp-dir
       emptyDir: {}
     containers:
     - name: metrics-server
       image: k8s.gcr.io/metrics-server-amd64:v0.3.6
       # 添加两个参数避免此类问题
       args: [ "--kubelet-insecure-tls", "--kubelet-preferred-address-types=InternalIP"]
       volumeMounts:
       - name: tmp-dir
         mountPath: /tmp
```

可以直接使用 `sed` 命令直接修改文件，关于 sed 可以参考 [sed 命令详解](https://shanyue.tech/op/linux-sed.html)

``` shell
# -i 代表直接替换文件
# a 代表下一行插入 (i 代表上一行插入)
$ sed -i '/image: k8s.gcr.io/a \        args: [ "--kubelet-insecure-tls", "--kubelet-preferred-address-types=InternalIP"]' deploy/1.8+/metrics-server-deployment.yaml
```
