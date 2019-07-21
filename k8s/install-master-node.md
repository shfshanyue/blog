---
title: 搭建一个集群的主节点 (control-plane node)
date: 2019-09-05 22:00

---

主节点以前叫 `master node`，现在官网称 `control plane node`。

使用 `kubeadm init` 就可以很简单地搭建一个主节点。但是在搭建主节点过程中，有可能由于国内网络的原因而不得成功。所以本篇文章分为两部分

+ 如果有网络问题，如何准备离线镜像
+ 搭建主节点

## 准备离线镜像

> 如果你能够访问谷歌，则直接查看下一节：搭建主节点

在 `master` 节点执行命令，获取需要预先下载的镜像列表。

``` shell
# 获取预先下载好的镜像列表
$ kubeadm config images list
W1002 21:48:28.382907   14218 version.go:101] could not fetch a Kubernetes version from the internet: unable to get URL "https://dl.k8s.io/release/stable-1.txt": Get https://dl.k8s.io/release/stable-1.txt: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
W1002 21:48:28.382998   14218 version.go:102] falling back to the local client version: v1.16.0
k8s.gcr.io/kube-apiserver:v1.16.0
k8s.gcr.io/kube-controller-manager:v1.16.0
k8s.gcr.io/kube-scheduler:v1.16.0
k8s.gcr.io/kube-proxy:v1.16.0
k8s.gcr.io/pause:3.1
k8s.gcr.io/etcd:3.3.15-0
k8s.gcr.io/coredns:1.6.2
```

在 `proxy` 节点，把镜像列表存为 `images.txt`，通过 `docker pull` 与 `docker save` 批量下载镜像与打包。并通过 `rsync` 在代理节点与 master/work 节点之间传送。关于 `rsync` 的用法可以参考:

> 此时，`images.txt` 除了关于搭建集群所需要的镜像外，还有一些因网络问题而不可达的镜像。如 dashboard/metrics-server/tiller/ingress 等。

``` shell
# 以下操作在 proxy 节点进行操作

# 查看所需要的镜像
$ cat images.txt
k8s.gcr.io/kube-apiserver:v1.16.0
k8s.gcr.io/kube-controller-manager:v1.16.0
k8s.gcr.io/kube-scheduler:v1.16.0
k8s.gcr.io/kube-proxy:v1.16.0
k8s.gcr.io/pause:3.1
k8s.gcr.io/etcd:3.3.15-0
k8s.gcr.io/coredns:1.6.2

k8s.gcr.io/kubernetes-dashboard-amd64:v1.10.1
k8s.gcr.io/metrics-server-amd64:v0.3.6
k8s.gcr.io/defaultbackend-amd64:1.5

# 在代理节点拉取所有镜像
# -I {}，指以 {} 代替 pipe 前每一行内容
$ cat images.txt | xargs -I {} docker pull {}

# 在代理节点打包所有镜像
$ cat images.txt | xargs docker save -o k8s.tar
```

待在 proxy 节点完成镜像打包后，使用 `rsync` 传输到 master 节点。以下操作在 master 节点进行

``` shell
# 以下操作在 master 节点进行

# 复制代理节点的打包镜像到 master 节点
# proxy:/path/k8s.tar: 打包镜像在proxy节点的位置
$ rsync -avzhP proxy:/path/k8s.tar .

# 加载 k8s.tar 中所有镜像
# load，从压缩文件中加载镜像
# -i，指定压缩文件
$ docker load -i k8s.tar
```


## 搭建主节点

当搭建主节点时，你需要在 `gcr.io` 上拉取所需镜像，但 `gcr.io` 有可能网络不通，你可以通过以下命令测试下连接性

``` shell
# 如果有以下提示，代表连接不通
$ kubeadm config images pull
W0905 19:04:37.519303   11952 version.go:98] could not fetch a Kubernetes version from the internet: unable to get URL "https://dl.k8s.io/release/stable-1.txt": Get https://dl.k8s.io/release/stable-1.txt: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
W0905 19:04:37.519384   11952 version.go:99] falling back to the local client version: v1.15.3

```

> 如果你不能获取镜像的话，可以通过准备离线镜像来获取。具体参考上一小节

测试成功后，使用 `kubeadm init` 命令添加一个主节点 (control-plane node)。

+ `172.17.68.39` 指 master 节点的IP地址，可以通过 `ifconfig eth0 获得`
+ `59.110.216.155` 指 master 节点的公网IP

``` shell
# init: 初始化一个 master 节点，现在也叫 control plane node (控制面板节点)
# --apiserver-advertise-address: 可以视作主节点的 IP 地址，这里是 172.17.68.39
# --pod-network-cidr: 当使用 pod network 时需要指定，用以 pod 间互相通信
# --apiserver-cert-extra-sans: 证书白名单，如果你使用 VPN 的话，可以不指定该参数 TODO
$ kubeadm init --apiserver-advertise-address=172.17.68.39 --pod-network-cidr=10.244.0.0/16 --apiserver-cert-extra-sans=59.110.216.155
...
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 172.17.68.39:6443 --token qq8hbl.4utma949mu0p47v4 \
    --discovery-token-ca-cert-hash sha256:cce6cd7ec86cf4cd65215bea554f98c786783720b19262533cd98656ac6eb15e

```

到这里为止，k8s 集群已经初步搭建完成。不过你会有疑问，在 `kubeadm init` 的过程中做了什么，这都被它作为日志打印了出来

TODO

接下来你可以按照以上输出的指示做完以下命令，这将生成一个 `kubectl` 的配置文件，以及检查集群状态

``` shell
$ mkdir -p $HOME/.kube
$ cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ chown $(id -u):$(id -g) $HOME/.kube/config

$ kubectl cluster-info
Kubernetes master is running at https://172.17.68.39:6443
KubeDNS is running at https://172.17.68.39:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

$ kubectl get pods --all-namespaces
NAMESPACE     NAME                              READY   STATUS    RESTARTS   AGE
kube-system   coredns-5644d7b6d9-8l2gv          0/1     Pending   0          56m
kube-system   coredns-5644d7b6d9-l8zv5          0/1     Pending   0          56m
kube-system   etcd-shanyue                      1/1     Running   0          55m
kube-system   kube-apiserver-shanyue            1/1     Running   0          55m
kube-system   kube-controller-manager-shanyue   1/1     Running   0          55m
kube-system   kube-proxy-5drlg                  1/1     Running   0          56m
kube-system   kube-scheduler-shanyue            1/1     Running   0          55m
```

再往后，你也可以通过以上的输出指示添加 worker node

``` shell
$ kubeadm join 172.17.68.39:6443 --token qq8hbl.4utma949mu0p47v4 \
    --discovery-token-ca-cert-hash sha256:cce6cd7ec86cf4cd65215bea554f98c786783720b19262533cd98656ac6eb15e
```

## kubectl 命令自动补全

没有自动补全的 `kubectl` 就如同没带眼镜的近视者，可以使用，但很难受。

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

