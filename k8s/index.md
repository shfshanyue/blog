---
title: K8s-Install
date: 2019-07-13T11:09:57+08:00
thumbnail: ""
categories:
  - 前端
  - 后端
tags:
  - node
---

## 预备工作

### 节点命名

+ shuifeng master 172.17.68.40 (2vCPU, 16G Mem)
+ shanyue  worker 172.17.68.39 (2vCPU, 4G Mem)

另外有一个可以访问谷歌的节点，用以下载一些国内无法下载的镜像，把它叫做 `proxy`

+ proxy

### 版本

+ `kubernetes v1.15`
+ [k8s 官方搭建文档](https://kubernetes.io/docs/setup/)

### 硬件

+ 操作系统: centos 7

## 常见命令使用

安装 `kubernetes` 是一个技术活，其中涉及到很多在 `linux` 上的操作。在此之前，熟悉一些在 `centos` 上的基本命令是必不可少的。也可以反过来说 **不了解这些命令你有可能寸步难行**。 以下是在安装过程中会反复使用的命令

PS: 就算没装成功，熟悉几条命令也是挺好的

### yum

``` shell
$ yum install docker-ce
$ yum list | grep docker
$ yum remove docker-ce

# 删除 package
$ yum erase docker-ce

# 清除 package 的依赖
$ yum autoremove
```

### systemctl

### journalctl

``` shell
$ journalctl -xeu kubelet
```

### route/ip

在设置网络时，可以使用该命令检查路由表。在搭建 k8s 集群是，可能出现 `connect: no route to host` 类似的错误，可以使用 `route -n` 或者 `ip route` 进行诊断。

``` shell
# 打印路由表
# -n 代表使用数字代表 IP 地址
$ route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         172.17.79.253   0.0.0.0         UG    0      0        0 eth0
10.244.0.0      0.0.0.0         255.255.255.0   U     0      0        0 cni0
10.244.1.0      10.244.1.0      255.255.255.0   UG    0      0        0 flannel.1
169.254.0.0     0.0.0.0         255.255.0.0     U     1002   0        0 eth0
172.17.64.0     0.0.0.0         255.255.240.0   U     0      0        0 eth0
172.18.0.0      0.0.0.0         255.255.0.0     U     0      0        0 docker0

# 另外，也可以通过该命令检查其路由表
$ ip route
```

### iptables

### rsync

负责与远程机器间传送文件，与 `scp` 类似

``` shell
# -a 代表归档
# -v 代表打印详细信息，这个参数很常见了 --verbose
# -h 代表打印可读性好的信息，这个参数也很常见 --human-readable
# -z 代表打包传送，减小传送体积
$ rsync -avhzP src shanyue:/root
```

### ipvs

### lsmod

显示已载入系统的模块，如以下常见的模块

+ `ip_tables`
+ `overlay`
+ `bridge`
+ `br_netfilter`

### modprobe

### sysctl

## 安装方案

## 容器 (Container runtime)

除了 docker 外，还有其它容器方案

+ CRI-O
+ Containerd


``` shell
$ systemctl status docker
```

### 安装 docker

这里有在 centos 上安装 docker 的官方文档: <https://docs.docker.com/install/linux/docker-ce/centos/>

``` shell
$ yum install -y yum-utils device-mapper-persistent-data lvm2

# 安装 docker 官方的镜像源
$ yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 如果在国内，安装阿里云的镜像
$ yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo


# 列出
$ yum list docker-ce.x86_64 --showduplicates | sort -r
docker-ce.x86_64            3:19.03.1-3.el7                    docker-ce-stable
docker-ce.x86_64            3:19.03.1-3.el7                    @docker-ce-stable
docker-ce.x86_64            3:19.03.0-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.8-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.7-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.6-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.5-3.el7                    docker-ce-stable

# 安装 docker
$ yum install -y docker-ce

# 安装指定版本号的 docker，以下是 k8s 官方推荐的 docker 版本号 (此时，k8s 的版本号在 v1.15)
$ yum install -y docker-ce-18.06.2.ce

$ system enable docker
Created symlink from /etc/systemd/system/multi-user.target.wants/docker.service to /usr/lib/systemd/system/docker.service.

$ system start docker
```

当 `docker` 安装成功后，可以使用以下命令查看版本号

``` shell
$ docker --version
Docker version 19.03.1, build 74b1e89

$ docker version

$ docker info
```

### docker daemon

`dockerd` 是 `docker` 的后台进程，而 `dockerd` 可以通过配置文件进行配置，在 linux 下在 `/etc/docker/daemon.json`，详细可以参考官方文档 [](https://docs.docker.com/engine/reference/commandline/dockerd/)。

``` shell
$ mkdir /etc/docker

# 设置 docker daemon
$ cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF

# 重启 docker
$ systemctl daemon-reload
$ systemctl restart docker
```

## 安装 kubelet/kubeadm/kubectl

先来介绍这三个命令行工具的作用:

+ `kubeadm`: 用以构建一个 k8s 集群
+ `kubelet`: 工作在集群的每个节点，负责容器的一些行为如启动
+ `kubectl`: 用以控制集群

``` shell
# 安装 kubernetes.repo 的源，这里使用阿里云的源
$ cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

# 禁掉 SELinux
$ setenforce 0
setenforce: SELinux is disabled

# 安装关键软件
$ yum install -y kubelet kubeadm kubectl
...
Complete!

# 开启服务
$ systemctl enable kubelet && systemctl start kubelet
Created symlink from /etc/systemd/system/multi-user.target.wants/kubelet.service to /usr/lib/systemd/system/kubelet.service

# 查看 kubelet 服务的状态
$ systemctl status kubelet
```

在 centos 中，你还需要设置 `net.bridge.bridge-nf-call-iptables` 为 1

``` shell
# 更改系统设置
$ cat <<EOF > /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF

# 查看更改是否生效
$ sysctl --system | grep tables
```

## 搭建一个集群即主节点 (control-plane node)

### 搭建主节点

当搭建主节点时，你需要在 `gcr.io` 上拉取所需镜像，但 `gcr.io` 有可能网络不通，你可以通过以下命令测试下连接性

``` shell
# 如果有以下提示，代表连接不通
$ kubeadm config images pull
W0905 19:04:37.519303   11952 version.go:98] could not fetch a Kubernetes version from the internet: unable to get URL "https://dl.k8s.io/release/stable-1.txt": Get https://dl.k8s.io/release/stable-1.txt: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
W0905 19:04:37.519384   11952 version.go:99] falling back to the local client version: v1.15.3

```

> 如果你不能获取镜像的话，你可以通过以下离线镜像来获取。具体参考下一小节

**测试成功后，使用 `kubeadm init` 命令添加一个主节点 (control-plane node)。`172.17.68.40` 指 master 节点的IP地址**

``` shell
# init: 初始化一个 master 节点，现在也叫 control plane node (控制面板节点)
# --apiserver-advertise-address: 可以视作主节点的 IP 地址，这里是 172.17.68.40
# --pod-network-cidr: 当使用 pod network 时需要指定，用以 pod 间互相通信
$ kubeadm init --apiserver-advertise-address=172.17.68.40 --pod-network-cidr=10.244.0.0/16 --apiserver-cert-extra-sans=
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

kubeadm join 172.17.68.40:6443 --token qq8hbl.4utma949mu0p47v4 \
    --discovery-token-ca-cert-hash sha256:cce6cd7ec86cf4cd65215bea554f98c786783720b19262533cd98656ac6eb15e

```

到这里为止，k8s 集群已经初步搭建完成。不过你会有疑问，在 `kubeadm init` 的过程中做了什么，这都被它作为日志打印了出来

1.

接下来你可以按照以上输出的指示做完以下命令，这将生成一个 `kubectl` 的配置文件，以及检查集群状态

``` shell
$ mkdir -p $HOME/.kube
$ cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ chown $(id -u):$(id -g) $HOME/.kube/config

$ kubectl cluster-info
Kubernetes master is running at https://172.17.68.40:6443
KubeDNS is running at https://172.17.68.40:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

再往后，你也可以通过以上的输出指示加入主节点。

### 离线镜像

在 `master` 节点执行命令，获取需要预先下载好的镜像列表。

``` shell
# 获取预先下载好的镜像列表
$ kubeadm config images list
W0830 19:12:54.406735    6221 version.go:98] could not fetch a Kubernetes version from the internet: unable to get URL "https://dl.k8s.io/release/stable-1.txt": Get https://dl.k8s.io/release/stable-1.txt: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
W0830 19:12:54.406891    6221 version.go:99] falling back to the local client version: v1.15.3
k8s.gcr.io/kube-apiserver:v1.15.3
k8s.gcr.io/kube-controller-manager:v1.15.3
k8s.gcr.io/kube-scheduler:v1.15.3
k8s.gcr.io/kube-proxy:v1.15.3
k8s.gcr.io/pause:3.1
k8s.gcr.io/etcd:3.3.10
k8s.gcr.io/coredns:1.3.1`
```

在 `proxy` 节点，把镜像列表存为 `images.txt`，并批量下载镜像与打包。并通过 `docker save` 与 `docker load` 在代理节点与 master/work 节点之间传送。

> 此时，`images.txt` 除了关于搭建集群所需要的镜像外，还有一些因网络问题而不可达的镜像。如 dashboard/metrics-server/tiller/ingress 等。

``` shell
# 以下操作在 proxy 节点进行操作

$ cat images.txt
k8s.gcr.io/kube-apiserver:v1.15.3
k8s.gcr.io/kube-controller-manager:v1.15.3
k8s.gcr.io/kube-scheduler:v1.15.3
k8s.gcr.io/kube-proxy:v1.15.3
k8s.gcr.io/pause:3.1
k8s.gcr.io/etcd:3.3.10
k8s.gcr.io/coredns:1.3.1

k8s.gcr.io/kubernetes-dashboard-amd64:v1.10.1
k8s.gcr.io/metrics-server-amd64:v0.3.3
gcr.io/kubernetes-helm/tiller:v2.14.3
k8s.gcr.io/defaultbackend-amd64:1.5

# 在代理节点拉取所有镜像
# -I {}，指以 {} 代替 pipe 前每一行内容
$ cat images.txt | xargs -I {} docker pull {}

# 在代理节点打包所有镜像
$ cat images.txt | xargs docker save -o k8s.tar
```

待在 proxy 节点完成镜像打包后，传输到 master 节点。以下操作在 master 节点进行

``` shell
# 以下操作在 master 节点进行

# 复制代理节点的打包镜像到 master 节点
$ rsync -avzhP proxy:/path/k8s.tar .

# 加载 k8s.tar 中所有镜像
# load，从压缩文件中加载镜像
# -i，指定压缩文件
$ docker load -i k8s.tar
fe9a8b4f1dcc: Loading layer  43.87MB/43.87MB
9b49e894f11a: Loading layer  164.5MB/164.5MB
Loaded image: k8s.gcr.io/kube-apiserver:v1.15.3
5823a8d719ed: Loading layer  116.4MB/116.4MB
Loaded image: k8s.gcr.io/kube-controller-manager:v1.15.3
ef4643438a15: Loading layer  38.79MB/38.79MB
Loaded image: k8s.gcr.io/kube-scheduler:v1.15.3
15c9248be8a9: Loading layer  3.403MB/3.403MB
d01dcbdc596d: Loading layer  36.99MB/36.99MB
Loaded image: k8s.gcr.io/kube-proxy:v1.15.3
e17133b79956: Loading layer  744.4kB/744.4kB
Loaded image: k8s.gcr.io/pause:3.1
8a788232037e: Loading layer   1.37MB/1.37MB
30796113fb51: Loading layer    232MB/232MB
6fbfb277289f: Loading layer  24.98MB/24.98MB
Loaded image: k8s.gcr.io/etcd:3.3.10
fb61a074724d: Loading layer  479.7kB/479.7kB
c6a5fc8a3f01: Loading layer  40.05MB/40.05MB
Loaded image: k8s.gcr.io/coredns:1.3.1
```

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

## kubectl 命令自动补全

没有自动补全的 `kubectl` 就如同没带眼镜的近视者，可以使用，但很难受。

``` shell
# 安装自动补全插件
$ yum install bash-completion

# 添加 kubectl 自动补全的脚本至 /etc/bash_completion.d 目录下
$ kubectl completion bash >/etc/bash_completion.d/kubectl

# 生效
$ kubectl get n
namespaces                         networkpolicies.extensions         networkpolicies.networking.k8s.io  nodes
```

## 安装 network pod: flannel

网络组件用以在 pod 间进行通信，再此之前

在安装网络组件要确保路是通的，设置 `/proc/sys/net/bridge/bridge-nf-call-iptables` 为0

``` shell
sysctl net.bridge.bridge-nf-call-iptables=1
```

``` shell
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/62e44c867a2846fefb68bd5f178daf4da3095ccb/Documentation/kube-flannel.yml
```

此时，再次查看集群中所有的 pod 状态，此时 `coredn` 变为正常状态，且多了 `kube-flannel-ds-amd64-7v8mw` 这个 pod。

``` shell
kubectl get pods -A
NAMESPACE     NAME                               READY   STATUS    RESTARTS   AGE
kube-system   coredns-5c98db65d4-cqcn9           1/1     Running   0          152m
kube-system   coredns-5c98db65d4-zxq79           1/1     Running   0          152m
kube-system   etcd-shuifeng                      1/1     Running   0          151m
kube-system   kube-apiserver-shuifeng            1/1     Running   0          151m
kube-system   kube-controller-manager-shuifeng   1/1     Running   0          151m
kube-system   kube-flannel-ds-amd64-7v8mw        1/1     Running   0          2m6s
kube-system   kube-proxy-js5wl                   1/1     Running   0          152m
kube-system   kube-scheduler-shuifeng            1/1     Running   0          151m
```

## 添加 worker node

在添加 worker node 时，需要在子节点也进行 `docker` 以及 `kubeadm` 的安装，按照以上章节步骤进行安装。

安装之后根据以上关于搭建主节点章节的输出指示，使用 `kubeadm join` 加入集群之中:

``` ssh
$ kubeadm join 172.17.68.40:6443 --token qq8hbl.4utma949mu0p47v4 \
    --discovery-token-ca-cert-hash sha256:cce6cd7ec86cf4cd65215bea554f98c786783720b19262533cd98656ac6eb15e
```

安装完之后，再次打印节点信息

``` shell
$ kubectl get nodes
NAME       STATUS   ROLES    AGE   VERSION
shanyue    Ready    <none>   12h   v1.15.3
shuifeng   Ready    master   16h   v1.15.3
```

至此，一个 `kubernetes` 的集群就搭建完成了。

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

## k9s 图形化命令行界面

先上一张图，它可以列出来你所有的 pod，并且可以进行各种操作。

> 可以把它视作 k8s 的 `htop` 命令，而事实上，它确实依赖于 `kubectl top` 这个命令。

目前，可以看到 CPU 以及 MEM 列为 n/a。关于详细的 metrics，请查看章节

## 网络

+ [](https://kubernetes.io/docs/concepts/cluster-administration/networking/)

## 配置文件及资源

## 对 Pod 进行资源限制

对一个容器进行资源限制，这是 docker 的基本功能，其原理是 linux 的 cgroup。那么在 Pod 中如何进行资源限制呢

## 使用 Ingress 进行域名访问

以下是官网搬用的一幅图，用以描述 Ingress 的作用。如果你对它一无所知，你可以把它理解为传统的 nginx，用以配置自己网站的域名使之能够通过外网访问。

``` txt
internet
    |
[ Ingress ]
--|-----|--
[ Services ]
```

## kubernetes plugin 与 knew

## 使用 Metrics Server 进行 CPU/Memory 监控

先上两篇官方文档作为参考，强烈建议阅读第二篇

1. [Resource metrics pipeline](https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/)
1. [Kubernetes monitoring architecture](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/monitoring_architecture.md)

> 这里也有一个镜像需要在代理节点下载并使用 rsync 移动到 work node：`k8s.gcr.io/metrics-server-amd64:v0.3.3`。详细方法参照 [](kubectl create -f deploy/1.8+/)
> 如果采用代理节点下载并移动的方案进行部署，则需要设置 image 的 `imagePullPolicy: IfNotPresent`

以下是关于 metrics server 的安装步骤

``` shell
$ git clone git@github.com:kubernetes-incubator/metrics-server.git

# 创建资源，注意在此之前拉取镜像需要设置代理，或者在代理机上准备好并复制过来
# 再要注意，如果使用代理节点下载并且复制的方案进行部署，需要删除  metrics-server-deployment.yaml 中关于 imagePullPolicy 的一行 (血的教训)
$ kubectl apply -f metrics-server/deploy/1.8+/
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
$ kubectl get pods --all-namespaces
NAMESPACE     NAME                                    READY   STATUS    RESTARTS   AGE
kube-system   coredns-5c98db65d4-5g28h                1/1     Running   2          3h29m
kube-system   coredns-5c98db65d4-jxz67                1/1     Running   2          3h29m
kube-system   etcd-shuifeng                           1/1     Running   0          3h28m
kube-system   kube-apiserver-shuifeng                 1/1     Running   0          3h28m
kube-system   kube-controller-manager-shuifeng        1/1     Running   0          3h28m
kube-system   kube-flannel-ds-amd64-cgjtk             1/1     Running   0          115m
kube-system   kube-flannel-ds-amd64-kb5np             1/1     Running   0          118m
kube-system   kube-proxy-b85rd                        1/1     Running   0          115m
kube-system   kube-proxy-xwqvk                        1/1     Running   0          3h29m
kube-system   kube-scheduler-shuifeng                 1/1     Running   0          3h28m
kube-system   kubernetes-dashboard-7d75c474bb-p7558   1/1     Running   0          105m
kube-system   metrics-server-6554b7b6db-czp52         1/1     Running   0          20m
```

``` shell
# 查看各节点的监控情况
$ kubectl top nodes
error: metrics not available yet
```

如果出现上述问题，查看该条 issue 用以解决问题: [error: metrics not available yet](https://github.com/kubernetes-incubator/metrics-server/issues/247)

## 使用 helm 管理 kubernetes 集群

`helm` 之于 `kubernetes` 就如 `yum` 之于 `centos`，`pip` 之于 `python`，`npm` 之于 `javascript`。

`helm` 分为客户端与服务端两部分，在服务端又叫 `Tiller`。

那 `helm` 的引入对于管理集群有哪些帮助呢？

1. 更方便地安装 postgres/elk/grafana/gitlab/prometheus 等工具
1. 更方便地管理自己的应用

这里参考文档： [安装 helm](https://helm.sh/docs/using_helm/#installing-helm)

### helm 基本概念

+ `chart`

### 安装客户端

在 mac 上进行安装

``` shell
$ brew install kubernetes-helm
```

在 linux 上进行安装

``` shell
$ curl -LO https://git.io/get_helm.sh
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

根据源码包进行安装，比较推荐(毕竟使用以上两种方案可能有网络问题)

``` shell
# 在 mac 上
# -L: 追踪重定向链接
# -O: 保存到本地
# -S: 打印错误
$ curl -SLO https://get.helm.sh/helm-v2.14.3-darwin-amd64.tar.gz 

# 在 centos 上
$ curl -SLO https://get.helm.sh/helm-v2.14.3-linux-amd64.tar.gz

# 如果有网络问题，请在代理节点下载并 rsync 到目标节点，如果没有，跳过此步
$ rsync -avhzP proxy:/root/helm-v2.14.3-linux-amd64.tar.gz .

# 如果在 mac 上
$ tar -zxvf helm-v2.14.3-darwin-amd64.tar.gz 

# 如果在 centos 上
$ tar -zxvf helm-v2.14.3-linux-amd64.tar.gz

# 进入相应目录，移至 /bin 目录
$ mv helm /usr/local/bin/helm
```

### 安装 tiller

当安装好 `helm` 命令后，使用 `helm init` 安装 tiller。

> tiller 的镜像：gcr.io/kubernetes-helm/tiller:v2.14.3 也在 gcr 上，网络可能无法直连

``` shell
$ helm init
...
Adding stable repo with URL: https://kubernetes-charts.storage.googleapis.com
Adding local repo with URL: http://127.0.0.1:8879/charts
$HELM_HOME has been configured at /root/.helm.

Tiller (the Helm server-side component) has been installed into your Kubernetes Cluster.

Please note: by default, Tiller is deployed with an insecure 'allow unauthenticated users' policy.
To prevent this, run `helm init` with the --tiller-tls-verify flag.
For more information on securing your installation see: https://docs.helm.sh/using_helm/#securing-your-helm-installation

# 查看 tiller 是否出在运行状态
$ kubectl get pods --all-namespaces

# 查看 helm 与 tiller 版本
$ helm version
Client: &version.Version{SemVer:"v2.14.3", GitCommit:"0e7f3b6637f7af8fcfddb3d2941fcc7cbebb0085", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.14.3", GitCommit:"0e7f3b6637f7af8fcfddb3d2941fcc7cbebb0085", GitTreeState:"clean"}
```

### RBAC

关于更多文档可以查看官方文档 [RBAC](https://helm.sh/docs/using_helm/#role-based-access-control) 或者以上章节

``` yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: tiller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system
```

### 参考链接

+ [helm 官方文档](https://helm.sh/docs/)

### 编辑

### 使用 helm 搭建 postgres

> 搭建 postgres 时确保服务器有充足的磁盘空间

``` shell
$ helm search postgres
NAME                                    CHART VERSION   APP VERSION     DESCRIPTION
stable/postgresql                       6.3.6           11.5.0          Chart for PostgreSQL, an object-relational database manag...
stable/prometheus-postgres-exporter     0.7.2           0.5.1           A Helm chart for prometheus postgres-exporter
stable/stolon                           1.1.2           0.13.0          Stolon - PostgreSQL cloud native High Availability.
stable/gcloud-sqlproxy                  0.6.1           1.11            DEPRECATED Google Cloud SQL Proxy
$ helm install stable/postgresql
```

## 使用 helm 部署应用

``` shell
$ helm create todo
Creating todo

$ cd todo

# 打印 chart 目录
# --dirsfirst 先打印文件夹名称
$ tree --dirsfirst
.
├── charts
├── templates
│   ├── tests
│   │   └── test-connection.yaml
│   ├── NOTES.txt
│   ├── _helpers.tpl
│   ├── deployment.yaml
│   ├── ingress.yaml
│   └── service.yaml
├── Chart.yaml
└── values.yaml

3 directories, 8 files

# 查看主要的两个文件 Chart.yaml 与 values.yaml

$ cat Chart.yaml
apiVersion: v1
appVersion: "1.0"
description: A Helm chart for Kubernetes
name: helm
version: 0.1.0

$ cat values.yaml
# Default values for helm.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

replicaCount: 1

image:
  repository: nginx
  tag: stable
  pullPolicy: IfNotPresent

imagePullSecrets: []
nameOverride: ""
fullnameOverride: ""

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  hosts:
    - host: chart-example.local
      paths: []

  tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local

resources: {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with little
  # resources, such as Minikube. If you do want to specify resources, uncomment the following
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #   cpu: 100m
  #   memory: 128Mi
  # requests:
  #   cpu: 100m
  #   memory: 128Mi

nodeSelector: {}

tolerations: []

affinity: {}
```

## k8s cheatsheets

### kubectl edit pvc 

`kubectl edit persistentvolumeclaims`

### kubectl get cs

`kubectl get componentstatus`

## k8s 术语
