# 在本地管理集群

关于本篇文章，你可以参考官方文档：[Configure Access to Multiple Clusters](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#explore-the-home-kube-directory) 与 [Organizing Cluster Access Using kubeconfig Files](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)

### 在 MAC 中安装 kubectl

目前，你可以在你的集群中的 master node 中使用 `kubectl` 管理集群，那如何在你的本地环境，比如 MAC 中管理集群呢。

``` shell
brew install kubectl
```

### 配置文件

### 证书问题

一切就绪，准备与 API Server 友好交流时，有可能发现会有以下的证书报错。其中 `47.93.26.56` 是 master node 的公网 IP。

``` shell
$ kubectl get pods
Unable to connect to the server: x509: certificate is valid for 10.96.0.1, 172.17.68.40, not 47.93.26.56
```

此时可以使用以下命令重新生成证书，把 IP 地址 `47.93.26.56` 加入白名单。以下操作均在 `master node`

``` shell
# 以下操作均在 master node

# 删除 apiserver 的证书
$ rm /etc/kubernetes/pki/apiserver.*
rm: remove regular file ‘/etc/kubernetes/pki/apiserver.crt’? y
rm: remove regular file ‘/etc/kubernetes/pki/apiserver.key’? y

# 重新生成证书，并添加 IP 地址白名单 (当前 kubernetes 集群的版本是 v1.15)
$ kubeadm init phase certs all --apiserver-advertise-address=0.0.0.0 --apiserver-cert-extra-sans=47.93.26.56
W0902 20:38:12.102570   18119 version.go:98] could not fetch a Kubernetes version from the internet: unable to get URL "https://dl.k8s.io/release/stable-1.txt": Get https://dl.k8s.io/release/stable-1.txt: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
W0902 20:38:12.102645   18119 version.go:99] falling back to the local client version: v1.15.3
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Using existing front-proxy-ca certificate authority
[certs] Using existing front-proxy-client certificate and key on disk
[certs] Using existing etcd/ca certificate authority
[certs] Using existing etcd/healthcheck-client certificate and key on disk
[certs] Using existing apiserver-etcd-client certificate and key on disk
[certs] Using existing etcd/peer certificate and key on disk
[certs] Using existing etcd/server certificate and key on disk
[certs] Using existing ca certificate authority
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [shuifeng kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 172.17.68.40 47.93.26.56]
[certs] Using existing apiserver-kubelet-client certificate and key on disk
[certs] Using the existing "sa" key

# 强制删除 apiserver 的容器
$ docker rm -f `docker ps -q -f 'name=k8s_kube-apiserver*'`
83fcae44bb1d

# 重启 kubelet 服务
$ systemctl restart kubelet
```

此时在个人的 mac (客户端)上进行操作，得以正确返回结果

``` shell
# 以下操作均在客户端 (个人mac)

$ kubectl get pods --all-namespaces 
NAMESPACE              NAME                                          READY     STATUS             RESTARTS   AGE
kube-system            coredns-5c98db65d4-cqcn9                      1/1       Running            5          3d
kube-system            coredns-5c98db65d4-zxq79                      1/1       Running            5          3d
kube-system            etcd-shuifeng                                 1/1       Running            0          3d
kube-system            kube-apiserver-shuifeng                       1/1       Running            0          3d
kube-system            kube-controller-manager-shuifeng              1/1       Running            0          3d
kube-system            kube-flannel-ds-amd64-7v8mw                   1/1       Running            0          3d
kube-system            kube-flannel-ds-amd64-c6dpj                   1/1       Running            0          2d
kube-system            kube-proxy-cntqj                              1/1       Running            0          2d
kube-system            kube-proxy-js5wl                              1/1       Running            0          3d
kube-system            kube-scheduler-shuifeng                       1/1       Running            0          3d
```

### 多集群及配置文件管理

可以通过环境变量 `KUBECONFIG` 来控制配置文件的路径，假设在 `$HOME/.kube/` 中有多个配置文件：`config`，`config-dev`，`config-production`。

``` shell
$ export KUBECONFIG=$HOME/.kube/config:$HOME/.kube/config-dev:$HOME/.kube/config-production

# 罗列出所有的集群
$ kubectl config get-clusters
NAME
k8s-dev
k8s-production
minikube
```
## 配置文件

```
```

## 安装 kubectl

``` shell
# 如果在 mac 上
$ curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl"

# 如果在 linux 上
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl

$ chmod +x ./kubectl
$ sudo mv ./kubectl /usr/local/bin/kubectl

$ kubectl version
Client Version: version.Info{Major:"1", Minor:"16", GitVersion:"v1.16.0", GitCommit:"2bd9643cee5b3b3a5ecbd3af49d09018f0773c77", GitTreeState:"clean", BuildDate:"2019-09-18T14:36:53Z", GoVersion:"go1.12.9", Compiler:"gc", Platform:"darwin/amd64"}
Server Version: version.Info{Major:"1", Minor:"16", GitVersion:"v1.16.0", GitCommit:"2bd9643cee5b3b3a5ecbd3af49d09018f0773c77", GitTreeState:"clean", BuildDate:"2019-09-18T14:27:17Z", GoVersion:"go1.12.9", Compiler:"gc", Platform:"linux/amd64"}
```

## kubectl 自动补全

``` shell
# 安装自动补全插件
$ yum install bash-completion

# 添加 kubectl 自动补全的脚本至 /etc/bash_completion.d 目录下
# kubectl completion bash: 生成自动补全的脚本
$ kubectl completion bash >/etc/bash_completion.d/kubectl

# 自动补全生效
$ kubectl get n
namespaces                         networkpolicies.extensions         networkpolicies.networking.k8s.io  nodes
```

``` shell
$ source <(kubectl completion zsh)
```
