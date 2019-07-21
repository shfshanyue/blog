--- 
title: 安装 kubeadm/kubelet/kubectl
date: 2019-09-04 22:00

---

先来介绍这三个命令行工具的作用:

+ `kubeadm`: 用以构建一个 k8s 集群的官方工具
+ `kubelet`: 工作在集群的每个节点，负责容器的一些行为如启动
+ `kubectl`: 用以控制集群的客户端工具

**在 k8s 的 master 与 node 节点均需要安装 `kubeadm`**

以下使用 [阿里源](https://opsx.alibaba.com/mirror) 来安装 `kubeadm`

> 可能会有索引gpg检查失败的情况, 这时请用 yum install -y --nogpgcheck kubelet kubeadm kubectl 安装

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

$ sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

# 安装关键软件
# 如果 gpg 校验失败，添加参数：yum install --nogpgcheck
$ yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

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
# 更改内核配置
$ cat <<EOF > /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF

# 查看更改是否生效
$ sysctl --system | grep tables
```

如果设置失败，查看你是否加载了 `br-netfiler` 的内核模块。

``` shell
# 查看是否加载模块
$ lsmod | grep netf
br_netfilter           22256  0
bridge                151336  1 br_netfilter

# 如果没有加载，则手动加载改模块
$ modprobe br_netfilter
```
