---
title: K8s-Install
thumbnail: ""
categories:
  - 前端
  - 后端
tags:
  - node
---

date: 2019-07-13T11:09:57+08:00
## kubectl 基础命令

### kubectl get pods

`kubectl get pods` 是 k8s 最基本而且最常用的命令，类似于 `redis.get`。

此时获取所有的 pod，结果如下所示。我们发现 `coredns` 的状态在 `Pending` 状态，并没有运行起来。此时需要安装一个网络 Pod，参考下一个章节

``` shell
# -A: --all-namespaces，代表所有的 namespace
$ kubectl get pods -A
NAMESPACE     NAME                               READY   STATUS    RESTARTS   AGE
kube-system   coredns-5c98db65d4-cqcn9           0/1     Pending   0          147m
kube-system   coredns-5c98db65d4-zxq79           0/1     Pending   0          147m
kube-system   etcd-shuifeng                      1/1     Running   0          146m
kube-system   kube-apiserver-shuifeng            1/1     Running   0          146m
kube-system   kube-controller-manager-shuifeng   1/1     Running   0          146m
kube-system   kube-proxy-js5wl                   1/1     Running   0          147m
kube-system   kube-scheduler-shuifeng            1/1     Running   0          146m
```

## RBAC 

## 添加 Dashboard

没有什么比数据可视化更重要的事了，你可以安装 Dashboard 在网页上管理你的集群以及应用。

这是 dashboard 在 github 上的仓库地址: <https://github.com/kubernetes/dashboard>

虽然现在已经有 v2.0.0 beta 版本了，但此处仍然使用 v1.10.1 的版本

``` shell
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml

# 查看 dashboard 的运行状态，一切正常: TODO
```

> 其中使用了镜像 `k8s.gcr.io/kubernetes-dashboard-amd64:v1.10.1`，仍然需要在代理服务器中进行下载

### 访问 web

``` shell
# 监听地址
# --address: 监听地址，设为 0.0.0.0，则同一网络下也可以访问
# --accept-hosts: 设置有权限访问的 host，否则会是 Forbiden
# --port: 端口号
$ kubectl proxy --address='0.0.0.0' --accept-hosts='^*$' --port 8080
```

此时，你可以通过以下地址访问。如果你配置了 VPN，可以使用私网地址进行访问。

``` shell
http://<PUBLIC_IP>/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/#!/login
http://172.17.68.40/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/#!/login
```

访问界面截图如下

## 权限控制

如果说以上章节部分只是与机器打交道，那么本篇将要与人打交道： **为你开发同事的账号进行权限控制**

### Service Account

``` shell
# 获取所有的 
$ kubectl get serviceaccount --all-namespaces
NAMESPACE         NAME                                 SECRETS   AGE
default           default                              1         5d
kube-node-lease   default                              1         5d
kube-public       default                              1         5d
kube-system       attachdetach-controller              1         5d
kube-system       bootstrap-signer                     1         5d
kube-system       certificate-controller               1         5d
kube-system       clusterrole-aggregation-controller   1         5d
kube-system       coredns                              1         5d
kube-system       cronjob-controller                   1         5d
kube-system       daemon-set-controller                1         5d
kube-system       default                              1         5d

$ kubectl describe serviceaccount certificate-controller -n kube-system
Name:                certificate-controller
Namespace:           kube-system
Labels:              <none>
Annotations:         <none>
Image pull secrets:  <none>
Mountable secrets:   certificate-controller-token-vwzz2
Tokens:              certificate-controller-token-vwzz2
Events:              <none>

$ kubectl get clusterrolebindings --all-namespaces -o wide
NAME                                                   AGE    ROLE                                                                               USERS                            GROUPS                                            SERVICEACCOUNTS
cluster-admin                                          5d9h   ClusterRole/cluster-admin                                                                                           system:masters
flannel                                                5d7h   ClusterRole/flannel                                                                                                                                                   kube-system/flannel
kubeadm:kubelet-bootstrap                              5d9h   ClusterRole/system:node-bootstrapper                                                                                system:bootstrappers:kubeadm:default-node-token
kubeadm:node-autoapprove-bootstrap                     5d9h   ClusterRole/system:certificates.k8s.io:certificatesigningrequests:nodeclient                                        system:bootstrappers:kubeadm:default-node-token
kubeadm:node-autoapprove-certificate-rotation          5d9h   ClusterRole/system:certificates.k8s.io:certificatesigningrequests:selfnodeclient                                    system:nodes
kubeadm:node-proxier                                   5d9h   ClusterRole/system:node-proxier                                                                                                                                       kube-system/kube-proxy
metrics-server:system:auth-delegator                   5d6h   ClusterRole/system:auth-delegator                                                                                                                                     kube-system/metrics-server
system:basic-user                                      5d9h   ClusterRole/system:basic-user                                                                                       system:authenticated
system:controller:attachdetach-controller              5d9h   ClusterRole/system:controller:attachdetach-controller                                                                                                                 kube-system/attachdetach-controller
```

### 创建 Service Account

``` yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kube-system
```

### RBAC

### 获取 jwt

``` shell
$ kubectl get secret -A | grep admin-user
kube-system            admin-user-token-zxrkx                           kubernetes.io/service-account-token   3      5s

$ kubectl describe secrets admin-user-token-zxrkx -n kube-system
Name:         admin-user-token-zxrkx
Namespace:    kube-system
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: admin-user
              kubernetes.io/service-account.uid: add04cf5-32fe-4200-9618-a4e5fef40dbd

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1025 bytes
namespace:  11 bytes
token:      eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLTZnbDZsIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJiMTZhZmJhOS1kZmVjLTExZTctYmJiOS05MDFiMGU1MzI1MTYiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06YWRtaW4tdXNlciJ9.M70CU3lbu3PP4OjhFms8PVL5pQKj-jj4RNSLA4YmQfTXpPUuxqXjiTf094_Rzr0fgN_IVX6gC4fiNUL5ynx9KU-lkPfk0HnX8scxfJNzypL039mpGt0bbe1IXKSIRaq_9VW59Xz-yBUhycYcKPO9RM2Qa1Ax29nqNVko4vLn1_1wPqJ6XSq3GYI8anTzV8Fku4jasUwjrws6Cn6_sPEGmL54sq5R4Z5afUtv-mItTmqZZdxnkRqcJLlg2Y8WbCPogErbsaCDJoABQ7ppaqHetwfM_0yMun6ABOQbIwwl8pspJhpplKwyo700OSpvTT9zlBsu-b35lzXGBRHzv5g_RA
```

最后，我们拿到了一个 token，这个 token 是一个 `JWT`。我们在浏览器的控制台，可以查看 `JWT` 里存储了什么信息

``` javascript
// 即 payload 中的信息
JSON.parse(atob(token.split('.')[1]))

const payload = {
  iss: "kubernetes/serviceaccount"
  kubernetes.io/serviceaccount/namespace: "kube-system"
  kubernetes.io/serviceaccount/secret.name: "admin-user-token-6gl6l"
  kubernetes.io/serviceaccount/service-account.name: "admin-user"
  kubernetes.io/serviceaccount/service-account.uid: "b16afba9-dfec-11e7-bbb9-901b0e532516"
  sub: "system:serviceaccount:kube-system:admin-user"
}
```

## PKI 证书体系

## 在本地管理集群


## k9s 图形化命令行界面

先上一张图，它可以列出来你所有的 pod，并且可以进行各种操作。

> 可以把它视作 k8s 的 `htop` 命令，而事实上，它确实依赖于 `kubectl top` 这个命令。

目前，可以看到 CPU 以及 MEM 列为 n/a。关于详细的 metrics，请查看章节

## 网络

+ [](https://kubernetes.io/docs/concepts/cluster-administration/networking/)

## 配置文件及资源

## 对 Pod 进行资源限制

对一个容器进行资源限制，这是 docker 的基本功能，其原理是 linux 的 cgroup。那么在 Pod 中如何进行资源限制呢

## kubernetes plugin 与 knew

## k8s cheatsheets

## k8s 术语
